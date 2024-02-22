package fr.jozait.startbuildingapi.rest.forge;

import fr.jozait.startbuildingapi.domain.response.ApiResponse;
import fr.jozait.startbuildingapi.service.forge.AuthForgeDTO;
import fr.jozait.startbuildingapi.domain.response.forge.CheckStatusDTO;
import fr.jozait.startbuildingapi.domain.response.forge.translateDTO;
import fr.jozait.startbuildingapi.service.forge.ForgeService;
import fr.jozait.startbuildingapi.service.forge.NodeData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("${api.base.url}/public/forge")
public class ForgeController {
    @Autowired
    private ForgeService forgeService;

    @PostMapping("/authenticate")
    public ResponseEntity<ApiResponse<AuthForgeDTO>> auth() {
        return ResponseEntity.ok(new ApiResponse<>(forgeService.authForge()));
    }

    @PostMapping("/upload/{nodeId}")
    public ResponseEntity<ApiResponse<translateDTO>> upload(
            @RequestPart("file") MultipartFile file,
            @PathVariable("nodeId") String nodeId,
            @RequestParam(value = "projectId", required = false) Long projectId
            ) throws IOException {
        return ResponseEntity.ok(new ApiResponse<>(forgeService.importFile(file, nodeId, projectId)));
    }

    @GetMapping("/check/{nodeId}")
    public ResponseEntity<ApiResponse<NodeData>> checkNode(@PathVariable("nodeId") String nodeId) {
        return ResponseEntity.ok(new ApiResponse<>(forgeService.checkFile(nodeId)));
    }

    @GetMapping("/upload/status/{urn}")
    public ResponseEntity<ApiResponse<CheckStatusDTO>> check(@PathVariable("urn") String urn) {
        return ResponseEntity.ok(new ApiResponse<>(forgeService.checkStatus(urn)));
    }

    @GetMapping("/metadata/{nodeId}")
    public ResponseEntity<ApiResponse<Object>> getNodeData(@PathVariable("nodeId") String nodeId) {
        return ResponseEntity.ok(new ApiResponse<>(forgeService.getMetadata(nodeId)));
    }
}
