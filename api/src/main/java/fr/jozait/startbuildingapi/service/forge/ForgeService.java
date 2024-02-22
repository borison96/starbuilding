package fr.jozait.startbuildingapi.service.forge;

import fr.jozait.startbuildingapi.domain.response.forge.CheckStatusDTO;
import fr.jozait.startbuildingapi.domain.response.forge.objectForgeDTO;
import fr.jozait.startbuildingapi.domain.response.forge.translateDTO;
import fr.jozait.startbuildingapi.domain.response.forge.uploadURLDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ForgeService {
    AuthForgeDTO authForge();

    //change param value
    translateDTO importFile(MultipartFile file, String nodeId, Long projectId) throws IOException;

    uploadURLDTO obtainUrl(AuthForgeDTO token, String filename, String bucket);

    void uploadTheFile(AuthForgeDTO token, String url, MultipartFile file) throws IOException;

    objectForgeDTO finalizeUpload(AuthForgeDTO token, uploadURLDTO key, String filename, String bucket);

    translateDTO translateFile(AuthForgeDTO token, String urn, String filename);

    CheckStatusDTO checkStatus(String urn);

    NodeData checkFile(String nodeId);

    Object getMetadata(String nodeId);
}
