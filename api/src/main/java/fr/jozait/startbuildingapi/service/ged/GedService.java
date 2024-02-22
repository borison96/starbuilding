package fr.jozait.startbuildingapi.service.ged;

import fr.jozait.startbuildingapi.ged.response.ListResourceResponse;
import fr.jozait.startbuildingapi.ged.response.SignedUrlResponse;
import fr.jozait.startbuildingapi.ged.response.UploadResponse;
import fr.jozait.startbuildingapi.ged.service.BucketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class GedService {
    private BucketService bucketService;
    @Value("${aws.s3.url-validity-seconds}")
    private Long validitySeconds;

    @Autowired
    public void setBucketService(@Qualifier("s3") BucketService bucketService) {
        this.bucketService = bucketService;
    }
    public UploadResponse upload(String fileName, File file) {
        return bucketService.upload(fileName, file);
    }
    public SignedUrlResponse signResource(String resourceKey) {
        return bucketService.signResource(resourceKey, validitySeconds);
    }
    public ListResourceResponse listObjects(String prefix) {
        return bucketService.listObjects(prefix);
    }
    public UploadResponse renameObject(String key, String name) {
        return bucketService.renameObject(key, name);
    }
}
