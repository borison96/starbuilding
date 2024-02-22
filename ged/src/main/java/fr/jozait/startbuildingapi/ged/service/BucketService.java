package fr.jozait.startbuildingapi.ged.service;

import fr.jozait.startbuildingapi.ged.response.ListResourceResponse;
import fr.jozait.startbuildingapi.ged.response.SignedUrlResponse;
import fr.jozait.startbuildingapi.ged.response.UploadResponse;

import java.io.File;

public interface BucketService {
    UploadResponse upload(String fileName, File file);
    UploadResponse upload(String directory, String fileName, File file);
    SignedUrlResponse signResource(String resourceKey, Long validitySeconds);
    ListResourceResponse listObjects(String prefix);
    UploadResponse renameObject(String key, String name);
}
