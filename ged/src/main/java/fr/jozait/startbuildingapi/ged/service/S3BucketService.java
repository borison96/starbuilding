package fr.jozait.startbuildingapi.ged.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import fr.jozait.startbuildingapi.ged.response.ResourceKeyResponse;
import fr.jozait.startbuildingapi.ged.response.ListResourceResponse;
import fr.jozait.startbuildingapi.ged.response.SignedUrlResponse;
import fr.jozait.startbuildingapi.ged.response.UploadResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.net.URLConnection;
import java.time.Instant;
import java.util.Arrays;
import java.util.Date;
import java.util.stream.Collectors;

@Service("s3")
public class S3BucketService implements BucketService {
    @Value("${aws.s3.bucket}")
    private String bucket;
    private AmazonS3 s3;

    @Autowired
    public void setS3(AmazonS3 s3) {
        this.s3 = s3;
    }

    @Override
    public UploadResponse upload(String fileName, File file) {
        return upload("", fileName, file);
    }

    @Override
    public UploadResponse upload(String directory, String fileName, File file) {
        String[] dirParts = directory.split("/");
        String dirName = BucketUtils.safeDirAndFileName(
                Arrays.stream(dirParts).filter(p -> !p.trim().isEmpty()).collect(Collectors.joining("/"))
        );
        String keyName = BucketUtils.safeDirAndFileName(dirName.isEmpty() ? fileName : dirName + "/" + fileName);
        PutObjectResult result = s3.putObject(bucket, keyName, file);
        UploadResponse response = new UploadResponse();
        response.setBucket(bucket);
        response.setDirectory(dirName);
        response.setFileName(fileName);
        response.setKey(keyName);
        if (result.getMetadata() != null) {
            response.setUserMetadata(result.getMetadata().getUserMetadata());
        }
        response.setMimeType(URLConnection.guessContentTypeFromName(file.getName()));
        file.delete();
        return response;
    }

    @Override
    public SignedUrlResponse signResource(String resourceKey, Long validitySeconds) {
        Date exp = Date.from(Instant.now().plusSeconds(validitySeconds));
        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucket, resourceKey)
                .withMethod(HttpMethod.GET)
                .withExpiration(exp);
        String url = s3.generatePresignedUrl(request).toExternalForm();
        SignedUrlResponse response = new SignedUrlResponse();
        response.setExpiresAt(exp);
        response.setUrl(url);
        response.setValiditySeconds(validitySeconds);
        return response;
    }

    @Override
    public ListResourceResponse listObjects(String prefix) {
        ListObjectsRequest request = new ListObjectsRequest()
                .withBucketName(bucket).withDelimiter("/");
        if (prefix != null) {
            String[] dirParts = prefix.split("/");
            String dirName = Arrays.stream(dirParts).filter(p -> !p.trim().isEmpty()).collect(Collectors.joining("/"));
            if (!dirName.isEmpty()) {
                request = request.withPrefix(dirName + "/");
            }
        }
        ObjectListing listing = s3.listObjects(request);
        ListResourceResponse response = new ListResourceResponse();
        response.setObjects(listing.getObjectSummaries().stream().map(ob -> {
            ResourceKeyResponse keyResponse = new ResourceKeyResponse();
            keyResponse.setKey(ob.getKey());
            if (ob.getOwner() != null) {
                keyResponse.setOwner(ob.getOwner().getDisplayName());
            }
            keyResponse.setLastModifiedAt(ob.getLastModified());
            keyResponse.setSize(ob.getSize());
            return keyResponse;
        }).collect(Collectors.toList()));
        response.setCommonPrefixes(listing.getCommonPrefixes());
        return response;
    }

    @Override
    public UploadResponse renameObject(String key, String name) {
        // copy
        CopyObjectRequest request = new CopyObjectRequest(bucket, key, bucket, name);
        CopyObjectResult copyResult = s3.copyObject(request);
        // delete
        DeleteObjectRequest deleteRequest = new DeleteObjectRequest(bucket, key);
        s3.deleteObject(deleteRequest);
        UploadResponse response = new UploadResponse();
        response.setBucket(bucket);
        int in = name.lastIndexOf("/");
        String fileName = name;
        if (in > 0) {
            response.setDirectory(name.substring(0, in));
            fileName = name.substring(in);
        }
        response.setFileName(fileName);
        response.setKey(name);
        response.setMimeType(URLConnection.guessContentTypeFromName(fileName));
        return response;
    }
}
