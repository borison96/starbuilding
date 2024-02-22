package fr.jozait.startbuildingapi.rest.rome;

import fr.jozait.startbuildingapi.domain.response.ApiResponse;
import fr.jozait.startbuildingapi.bootstrap.rome.ROMERestClient;
import fr.jozait.startbuildingapi.bootstrap.rome.ROMEAuthToken;
import fr.jozait.startbuildingapi.bootstrap.rome.ROMERecord;
import fr.jozait.startbuildingapi.domain.model.rome.Profession;
import fr.jozait.startbuildingapi.domain.repository.rome.ProfessionRepository;
import fr.jozait.startbuildingapi.service.rome.ROMEService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.base.url}/public/rome")
public class ROMEPublicController {
    @Autowired
    private ROMERestClient restClient;
    @Autowired
    private ROMEService romeService;

    @Autowired
    private ProfessionRepository professionRepository;

    @GetMapping("/test/login")
    public ResponseEntity<ApiResponse<ROMEAuthToken>> testLogin() {
        return ResponseEntity.ok(new ApiResponse<>(restClient.login()));
    }

    @GetMapping("/avance/search")
    public ResponseEntity<ApiResponse<List<ROMERecord>>> search(
            @RequestParam(name = "libelle") String libelle,
            @RequestParam(name = "nombre", required = false) String nombre,
            @RequestParam(name = "type", required = false) String type) {
        Map<String, String> params = new HashMap<>();
        if (libelle != null && !libelle.isEmpty()) {
            params.put("libelle", libelle);
        }
        if (nombre != null && !nombre.isEmpty()) {
            params.put("nombre", nombre);
        }
        if (type != null && !type.isEmpty()) {
            params.put("type", type);
        }
        return ResponseEntity.ok(new ApiResponse<>(restClient.search(params)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<Profession>>> searchByRomeLocally(
            @RequestParam(name = "q", required = false) String q, Pageable page) {
        Page<Profession> professionPage = professionRepository.findAllByAttributeContaining(q, page);
        return ResponseEntity.ok(new ApiResponse<>(professionPage));
    }
}
