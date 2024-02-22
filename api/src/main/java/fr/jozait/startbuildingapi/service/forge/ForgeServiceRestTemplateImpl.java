package fr.jozait.startbuildingapi.service.forge;

import fr.jozait.startbuildingapi.domain.response.ApiResponse;
import fr.jozait.startbuildingapi.domain.response.forge.*;
import fr.jozait.startbuildingapi.exception.ApiError;
import fr.jozait.startbuildingapi.exception.ApiException;
import fr.jozait.startbuildingapi.exception.ErrorCodes;
import fr.jozait.startbuildingapi.service.forge.IFCGuid.IFCGuid;
import fr.jozait.startbuildingapi.util.AppUtils;
import fr.jozait.startbuildingapi.util.SbPrecondition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.DefaultUriBuilderFactory;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.*;
import java.util.Base64;
import java.util.HashMap;
import java.util.Optional;

@Service
public class ForgeServiceRestTemplateImpl implements ForgeService {
    Logger logger = LoggerFactory.getLogger(this.getClass());
    private ForgeProps forgeProps;
    @Autowired
    private NodeDataRepository nodeData;

    private RestTemplate restTemplate;

    private RestTemplate createRestTemplate() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();

        Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("127.0.0.1", 9090));
        //requestFactory.setProxy(proxy);

        return new RestTemplate(requestFactory);
    }

    @Autowired
    public ForgeServiceRestTemplateImpl(ForgeProps forgeProps) {
        this.forgeProps = forgeProps;
        this.restTemplate = createRestTemplate();
    }

    @Override
    public AuthForgeDTO authForge() {
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", "client_credentials");
        requestBody.add("client_id", forgeProps.getClientId());
        requestBody.add("client_secret", forgeProps.getClientSecret());
        requestBody.add("scope", forgeProps.getScopes());
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(
                requestBody,
                HttpHeaders.readOnlyHttpHeaders(headers));
        try {
            ResponseEntity<AuthForgeDTO> entity = restTemplate.postForEntity(
                    forgeProps.getForgeHost() + forgeProps.getTokenEndpoint(),
                    request,
                    AuthForgeDTO.class
            );
            return entity.getBody();
        } catch (Exception httpEx) {
            throw new ApiException(ErrorCodes.BAD_USER_CREDENTIALS.getMessage(), HttpStatus.UNAUTHORIZED, ErrorCodes.BAD_USER_CREDENTIALS.toString());
        }
    }

    //change param value
    @Override
    public translateDTO importFile(MultipartFile file, String nodeId, Long projectId) throws IOException {
        AuthForgeDTO forgeToken = authForge();

        String bucket = "startbuilding-philou9";

        createBucket(forgeToken, bucket);
        uploadURLDTO uploadURL = obtainUrl(forgeToken, file.getOriginalFilename(), bucket);
        uploadTheFile(forgeToken, uploadURL.getUrls().get(0), file);
        objectForgeDTO urn = finalizeUpload(forgeToken, uploadURL, file.getOriginalFilename(), bucket);
        translateDTO result = translateFile(forgeToken, urn.getObjectId(), file.getOriginalFilename());

        NodeData node = new NodeData(nodeId, result.getUrn());
        nodeData.save(node);

        return result;
    }

    private class Body {
        private String bucketKey;
        private String access;
        private String policyKey;

        public Body(String bucketKey, String access, String policyKey) {
            this.bucketKey = bucketKey;
            this.access = access;
            this.policyKey = policyKey;
        }

        public String getBucketKey() {
            return bucketKey;
        }

        public void setBucketKey(String bucketKey) {
            this.bucketKey = bucketKey;
        }

        public String getAccess() {
            return access;
        }

        public void setAccess(String access) {
            this.access = access;
        }

        public String getPolicyKey() {
            return policyKey;
        }

        public void setPolicyKey(String policyKey) {
            this.policyKey = policyKey;
        }
    }

    public void createBucket(AuthForgeDTO token, String bucket) {
        Body body = new Body(bucket, "full", "persistent");

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token.getAccess_token());
        headers.add("Content-Type", "application/json");

        HttpEntity<Body> request = new HttpEntity<>(
                body,
                headers
        );

        try {
            ResponseEntity<BucketDTO> entity = restTemplate.exchange(
                    "https://developer.api.autodesk.com/oss/v2/buckets",
                    HttpMethod.POST,
                    request,
                    BucketDTO.class
            );
        } catch (HttpClientErrorException e) {
            logger.error(e.getMessage());
        }
    }

    @Override
    public uploadURLDTO obtainUrl(AuthForgeDTO token, String filename, String bucket) {
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(
                AppUtils.createBearerHeader(token.getAccess_token())
        );
        ResponseEntity<uploadURLDTO> entity = restTemplate.exchange(
                "https://developer.api.autodesk.com/oss/v2/buckets/" + bucket + "/objects/" + filename + "/signeds3upload?minutesExpiration=5",
                HttpMethod.GET,
                request,
                uploadURLDTO.class
        );
        return entity.getBody();
    }


    @Override
    public void uploadTheFile(AuthForgeDTO token, String url, MultipartFile file) throws IOException {

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();

        Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("127.0.0.1", 9090));
        requestFactory.setProxy(proxy);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.add("Accept", "*/*");
        headers.add("Accept-Encoding", "gzip, deflate, br");

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("filename", file.getOriginalFilename());
        body.add("file", file.getBytes());


        HttpEntity request = new HttpEntity<>(file.getBytes(), headers);

        URI uri = UriComponentsBuilder.fromUriString(url.substring(0, url.indexOf("?") - 1)).build().toUri();
        uri = UriComponentsBuilder
                .fromUri(uri)
                .queryParam("uploadId", "{uploadId}")
                .queryParam("partNumber", "{partNumber}")
                .queryParam("X-Amz-Security-Token", "{X-Amz-Security-Token}")
                .queryParam("X-Amz-Algorithm", "{X-Amz-Algorithm}")
                .queryParam("X-Amz-Date", "{X-Amz-Date}")
                .queryParam("X-Amz-SignedHeaders", "{X-Amz-SignedHeaders}")
                .queryParam("X-Amz-Expires", "{X-Amz-Expires}")
                .queryParam("X-Amz-Credential", "{X-Amz-Credential}")
                .queryParam("X-Amz-Signature", "{X-Amz-Signature}")

                .build(substringXXX(url, "?uploadId"),
                        substringXXX(url, "&partNumber"),
                        substringXXX(url, "&X-Amz-Security-Token"),
                        substringXXX(url, "&X-Amz-Algorithm"),
                        substringXXX(url, "&X-Amz-Date"),
                        substringXXX(url, "&X-Amz-SignedHeaders"),
                        substringXXX(url, "&X-Amz-Expires"),
                        substringXXX(url, "&X-Amz-Credential"),
                        substringXXX(url, "&X-Amz-Signature"));


                /*
                .build("9uAf85xOu6Npxd9qpPg9haPP9AgySRYMKnRHKxT0WwjAWsZEnmQzLbNrAcNCnDBXAMyQgiHuu26XGkBn5LopxbLnZ68gdklK_AAejlL.IQmMstJWwj3rFpws4jmhSPW4ygxv5SqDcM7mGKNnkILo8w--",
                        "1",
                        "IQoJb3JpZ2luX2VjEIP//////////wEaCXVzLWVhc3QtMSJHMEUCIAkELRjAJXBg3FHNHz3rvIqfHgd8ECzG7uT8SihKrMGFAiEAmPSg7Dx4bScOLpbL/253+ZcFpL0MI2UPs1aJZOO6pSgq2wQIrP//////////ARAAGgw2MDQ3MzMwMDk0MDMiDMR+9nQx/QD1iepPUCqvBM5w8HpNjpdHzvvOK8M7C3r4kQgfiB89MfSkIN/1y5Eh2mtsQRwrffcQB4WCn6TVHLLT0saWzbkQJMHzCYMCn8onywbTRRVFoAsNSATBduZK7/PsvmTt1brCuKl/z5iYM3jKe5YdieC0A2c541dnzGt5jiCEFKeYvThcUA92XTp04nfc74iS7hmSfUh1tcD6dDZ5iNzImtVY8jICXKZv++p6jX9kJjQ5Iu1rgJoWakzube6+xMbdwnsLZ0QkdhmJfflnWNkeZfq9Mp3P+laPwYIfRQsxpPfytNRjRgB3GirfDNxkDq4FMyIeGswv5ZEDzu30w1gtUbSc+HtvUt8eJqT3DyN7A1FA9gCs7uA4cuzli4/0PUCyZO/KjJLIDZot0rQurYkSBpQj+h87/z7L2+0WKOSQqhcJaowqSpRf4VYCCUm98hqdiYZIAiSVIH79Cu76wLdJNN1rVoraIakmvEsMYJCv1OjY0ALwUDVAe7zdP/UGGseK1F111Uv2Oi1Lnnv6NJo0oSHDPxGWVfZKpHTWEaRJ5CKNBcNkuWX9c3TfNT+oTzM2VLuqnam277v5QutBwVz09e79OsznC0XP//+49q6B5QuNDFnq5QeXFg/9/EPHTIjmp2I3IpjsvIe4GZTqaC5awZDO5cNEXvSI5hCB8nmAoD97MeJdUmbvG5qk3oEYyK6D8+gAM34IzEgL3skNo8bsEtUH6eNfMh+YhtXpv77lZRyTHbMgVTeu3h4wkYeSlgY6qQGLhAEYO+rSyyfMPc1ZtSemJ5RqFu3ExAKq917xF8LMXO5XaEIEqRrwf8k2cbglePAAX3vi3jq73eKOX2vMIWUQ02DJXZew+y2kIpqWtBs5Zo5YFLurGLctz+XyFU7PJJYzPNh4HXzNdINhlcFBq4TNtdphQ5oURdnGPY35RaDou3tQjT5m0oqZGJdk1pLe+5BYXnzNw6UIMkgiV7addCEpkoXZct4//5t6",
                        "AWS4-HMAC-SHA256",
                        "20220705T192427Z",
                        "host",
                        "299",
                        "ASIAYZTHFNX5U4WAHCDN/20220705/us-east-1/s3/aws4_request",
                        "793e116b4a5b3750d7a11e4939ec6cf5969310711fb2e0505bd730f442d1b375<");*/

        String baseUrl = url.substring(0, url.indexOf("?") - 1);
        DefaultUriBuilderFactory factory = new DefaultUriBuilderFactory(baseUrl);
        factory.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.TEMPLATE_AND_VALUES);

        restTemplate.setUriTemplateHandler(factory);

        ResponseEntity<String> entity = this.restTemplate.exchange(
                uri,
                HttpMethod.PUT,
                request,
                String.class
        );
    }

    private String substringXXX(String url, String param) {
        int beginIdx = url.indexOf(param) + param.length() + 1;
        int endIdx = url.indexOf("&", beginIdx + 1);

        if (endIdx == -1) {
            try {
                return url.substring(beginIdx);
                //  return URLDecoder.decode(url.substring(beginIdx), "UTF-8");
            } catch (Exception e) {
                return "";
            }
        }
        try {
            return url.substring(beginIdx, endIdx);
            //return URLDecoder.decode(url.substring(beginIdx, endIdx), "UTF-8");
        } catch (Exception e) {
            return "";
        }
    }

    @Override
    public objectForgeDTO finalizeUpload(AuthForgeDTO token, uploadURLDTO key, String filename, String bucket) {
        HashMap<String, String> requestBody = new HashMap<>();
        requestBody.put("uploadKey", key.getUploadKey());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token.getAccess_token());
        headers.add("Content-Type", "application/json");

        HttpEntity<HashMap<String, String>> request = new HttpEntity<>(
                requestBody,
                headers
        );

        ResponseEntity<objectForgeDTO> entity = restTemplate.exchange(
                "https://developer.api.autodesk.com/oss/v2/buckets/" + bucket + "/objects/" + filename + "/signeds3upload",
                HttpMethod.POST,
                request,
                objectForgeDTO.class
        );
        return entity.getBody();
    }


    class MyObject {
        private URNInfo input;
        private OutputInfo output;

        public MyObject() {

        }


        public MyObject(URNInfo input, OutputInfo output) {
            this.input = input;
            this.output = output;

        }

        public URNInfo getInput() {
            return input;
        }

        public void setInput(URNInfo input) {
            this.input = input;
        }

        public OutputInfo getOutput() {
            return output;
        }

        public void setOutput(OutputInfo output) {
            this.output = output;
        }
    }


    @Override
    public translateDTO translateFile(AuthForgeDTO token, String urn, String filename) {
        URNInfo input = new URNInfo(Base64.getEncoder().encodeToString(urn.getBytes()), filename);
        OutputInfo output = new OutputInfo();

        MyObject requestBody = new MyObject(input, output);
        // MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        // requestBody.add("input", String.valueOf(input));
        // requestBody.add("output", String.valueOf(output));

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token.getAccess_token());
        headers.add("Content-Type", "application/json");
        headers.add("x-ads-force", "true");

        HttpEntity<MyObject> request = new HttpEntity<>(
                requestBody,
                headers
        );

        ResponseEntity<translateDTO> entity = restTemplate.exchange(
                "https://developer.api.autodesk.com/modelderivative/v2/designdata/job",
                HttpMethod.POST,
                request,
                translateDTO.class
        );
        return entity.getBody();
    }

    @Override
    public CheckStatusDTO checkStatus(String urn) {
        AuthForgeDTO token = authForge();

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(
            AppUtils.createBearerHeader(token.getAccess_token())
        );
        ResponseEntity<CheckStatusDTO> entity = restTemplate.exchange(
                "https://developer.api.autodesk.com/modelderivative/v2/designdata/"+urn+"/manifest",
                HttpMethod.GET,
                request,
                CheckStatusDTO.class
        );
        return entity.getBody();
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
        AuthForgeDTO token = authForge();
        Optional<NodeData> node = nodeData.findByNodeId(nodeId);
        ApiResponse response = new ApiResponse();
        SbPrecondition.throwErrorOnCheckArgument(response, node.isPresent(), ApiError.PROJECT_NOT_FOUND);
        String urn = node.get().getData();

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(
                AppUtils.createBearerHeader(token.getAccess_token())
        );

        ResponseEntity<IFCGuid> entity = restTemplate.exchange(
                "https://developer.api.autodesk.com/modelderivative/v2/designdata/"+urn+"/metadata",
                HttpMethod.GET,
                request,
                IFCGuid.class
        );

        ResponseEntity<Object> entity2 = restTemplate.exchange(
                "https://developer.api.autodesk.com/modelderivative/v2/designdata/"+urn+"/metadata/"+entity.getBody().getData().getMetadata().get(0).getGuid(),
                HttpMethod.GET,
                request,
                Object.class
        );

        return entity2.getBody();
    }
}

