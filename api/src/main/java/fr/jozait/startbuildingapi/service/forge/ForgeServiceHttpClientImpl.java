package fr.jozait.startbuildingapi.service.forge;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.jozait.startbuildingapi.domain.model.project.ProjectKnowledgeBase;
import fr.jozait.startbuildingapi.domain.model.project.ProjectKnowledgeBaseHelper;
import fr.jozait.startbuildingapi.domain.model.project.node.ProjectKnowledgeNode;
import fr.jozait.startbuildingapi.domain.repository.project.ProjectKnowledgeBaseRepository;
import fr.jozait.startbuildingapi.domain.response.ApiResponse;
import fr.jozait.startbuildingapi.domain.response.forge.CheckStatusDTO;
import fr.jozait.startbuildingapi.domain.response.forge.objectForgeDTO;
import fr.jozait.startbuildingapi.domain.response.forge.translateDTO;
import fr.jozait.startbuildingapi.domain.response.forge.uploadURLDTO;
import fr.jozait.startbuildingapi.exception.ApiError;
import fr.jozait.startbuildingapi.util.SbPrecondition;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@Primary
public class ForgeServiceHttpClientImpl implements ForgeService {

    Logger logger = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private ForgeProps forgeProps;
    @Autowired
    private ForgeServiceRestTemplateImpl otherForgeServiceRest;

    @Autowired
    private NodeDataRepository nodeData;
    @Autowired
    private ProjectKnowledgeBaseRepository projectKnowledgeBaseRepository;

    @Override
    public AuthForgeDTO authForge() {
        AutodeskAuthenticateResponse r = null;

        try {
            CloseableHttpClient httpclient = this.buildHttpClient();

            // String contentPost = "client_id=DVsvSv3Z9Z2bYN9AmWLzVFyRGFDUH3zh&client_secret=7ubsIjgVM1xxgt0B&grant_type=client_credentials&scope=code%3Aall%20data%3Awrite%20data%3Aread%20bucket%3Acreate%20bucket%3Adelete%20bucket%3Aread";
            String contentPost = String.format(
                    "client_id=%s&client_secret=%s",
                    forgeProps.getClientId(), forgeProps.getClientSecret()) + "&grant_type=client_credentials&scope=code%3Aall%20data%3Awrite%20data%3Aread%20bucket%3Acreate%20bucket%3Adelete%20bucket%3Aread";
            HttpPost httpPost = new HttpPost("https://developer.api.autodesk.com/authentication/v1/authenticate");
            httpPost.addHeader("Content-Type", "application/x-www-form-urlencoded");
            httpPost.addHeader("Accept", "*/*");
            httpPost.addHeader("Host", "developer.api.autodesk.com");
            httpPost.addHeader("Accept-Encoding", "gzip, deflate, br");
            //httpPost.addHeader("Content-Length", String.valueOf(contentPost.length()));

            httpPost.setEntity(new StringEntity(contentPost));
            CloseableHttpResponse response = httpclient.execute(httpPost);


            try {
                HttpEntity httpEntityResponse = response.getEntity();
                r = (AutodeskAuthenticateResponse) new ObjectMapper().readValue(httpEntityResponse.getContent(), AutodeskAuthenticateResponse.class);
            } finally {
                response.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (r != null) {
            return new AuthForgeDTO(r);
        }
        return null;
    }

    private CloseableHttpClient buildHttpClient() {
        HttpHost proxyHost = new HttpHost("127.0.0.1", 9090);
        //HttpRoutePlanner routePlanner = new DefaultProxyRoutePlanner(proxyHost);
        HttpClientBuilder clientBuilder = HttpClients.custom();
        //clientBuilder = clientBuilder.setRoutePlanner(routePlanner);
        CloseableHttpClient httpClient = clientBuilder.build();
        return httpClient;
    }

    public CheckStatusDTO checkStatus(String urn) {
        return otherForgeServiceRest.checkStatus(urn);
    }

    @Override
    public NodeData checkFile(String nodeId) {
        Optional<NodeData> node = nodeData.findByNodeId(nodeId);
        ApiResponse response = new ApiResponse();
        SbPrecondition.throwErrorOnCheckArgument(response, node.isPresent(), ApiError.PROJECT_NOT_FOUND);
        return node.get();
    }
    @Override
    public Object getMetadata(String nodeId) {
        return otherForgeServiceRest.getMetadata(nodeId);
    }


    @Override
    public translateDTO importFile(MultipartFile file, String nodeId, Long projectId) throws IOException {
        AuthForgeDTO forgeToken = this.authForge();

        String bucket = "startbuilding-philou-922";
        try {
            otherForgeServiceRest.createBucket(forgeToken, bucket);
        } catch (Exception ignored) {
        }
        uploadURLDTO uploadURL = this.obtainUrl(forgeToken, file.getOriginalFilename(), bucket);
        this.uploadTheFile(forgeToken, uploadURL.getUrls().get(0), file);
        objectForgeDTO urn = this.finalizeUpload(forgeToken, uploadURL, file.getOriginalFilename(), bucket);
        translateDTO result = this.translateFile(forgeToken, urn.getObjectId(), file.getOriginalFilename());

        /*
         we may not need a new node here, sometimes you want to update the ifc of a node, this fails because we are sending the same id
         */
        Optional<NodeData> optionalNodeData = nodeData.findByNodeId(nodeId);
        NodeData node;
        if (optionalNodeData.isPresent()) {
            node = optionalNodeData.get();
            node.setData(result.getUrn());
        } else {
           node = new NodeData(nodeId, result.getUrn());
        }
        try {
            nodeData.save(node);
        } catch (Exception ignored) {
        }
        Optional<ProjectKnowledgeBase> projectBaseOptional = projectKnowledgeBaseRepository.findFirstByProjectId(projectId);
        if (projectBaseOptional.isPresent()) {
            ProjectKnowledgeBase projectKnowledgeBase = projectBaseOptional.get();
            ProjectKnowledgeBaseHelper helper = ProjectKnowledgeBaseHelper.of(projectKnowledgeBase);
            ProjectKnowledgeNode node1 = helper.read(nodeId);
            if (node1 != null && node1.getAttributes() != null) {
                node1.getAttributes().setNodeType("model_3d").setData(result.getUrn());
                projectKnowledgeBaseRepository.save(projectKnowledgeBase);
            }
        }

        return result;
    }

    @Override
    public uploadURLDTO obtainUrl(AuthForgeDTO token, String filename, String bucket) {
        return otherForgeServiceRest.obtainUrl(token, filename, bucket);
    }

    @Override
    public void uploadTheFile(AuthForgeDTO token, String url, MultipartFile file) throws IOException {
        CloseableHttpClient httpclient = this.buildHttpClient();

        HttpPut httpPut = new HttpPut(url);
        httpPut.addHeader("Content-Type", "application/octet-stream");
        httpPut.addHeader("Accept", "*/*");
        httpPut.addHeader("Host", "com-autodesk-oss-direct-upload.s3-accelerate.amazonaws.com");
        httpPut.addHeader("Accept-Encoding", "gzip, deflate, br");

        httpPut.setEntity(new ByteArrayEntity(file.getBytes()));

        CloseableHttpResponse response = httpclient.execute(httpPut);
    }

    @Override
    public objectForgeDTO finalizeUpload(AuthForgeDTO token, uploadURLDTO key, String filename, String bucket) {
        return otherForgeServiceRest.finalizeUpload(token, key, filename, bucket);
    }

    @Override
    public translateDTO translateFile(AuthForgeDTO token, String urn, String filename) {
        return otherForgeServiceRest.translateFile(token, urn, filename);
    }
}
