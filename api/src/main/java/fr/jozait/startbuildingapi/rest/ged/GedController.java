package fr.jozait.startbuildingapi.rest.ged;

import fr.jozait.startbuildingapi.domain.response.ApiResponse;
import fr.jozait.startbuildingapi.ged.response.ListResourceResponse;
import fr.jozait.startbuildingapi.ged.response.SignedUrlResponse;
import fr.jozait.startbuildingapi.ged.response.UploadResponse;
import fr.jozait.startbuildingapi.service.ged.GedService;
import fr.jozait.startbuildingapi.util.AppUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("${api.base.url}/ged")
public class GedController {
    private GedService gedService;

    @Autowired
    public void setGedService(GedService gedService) {
        this.gedService = gedService;
    }
    @PostMapping("/test")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadFile(@RequestParam MultipartFile file) throws IOException {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        gedService.upload(file.getOriginalFilename(), AppUtils.convertMultipartFileToFile(file))
                )
        );
    }
    @GetMapping("/sign")
    public ResponseEntity<ApiResponse<SignedUrlResponse>> signUrl(@RequestParam("key") String key) {
        return ResponseEntity.ok(new ApiResponse<>(gedService.signResource(key)));
    }
    @GetMapping("/list")
    public ResponseEntity<ApiResponse<ListResourceResponse>> listObjects(@RequestParam(value = "prefix", required = false) String prefix) {
        return ResponseEntity.ok(new ApiResponse<>(gedService.listObjects(prefix)));
    }
    @GetMapping("/rename")
    public ResponseEntity<ApiResponse<UploadResponse>> renameObject(@RequestParam("key") String key, @RequestParam("name") String name) {
        return ResponseEntity.ok(new ApiResponse<>(gedService.renameObject(key, name)));
    }
}
