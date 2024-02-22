package fr.jozait.startbuildingapi.rest.org;

import fr.jozait.startbuildingapi.domain.model.org.OrgJoinRequest;
import fr.jozait.startbuildingapi.domain.request.SingleValue;
import fr.jozait.startbuildingapi.domain.response.ApiResponse;
import fr.jozait.startbuildingapi.service.org.OrganisationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base.url}/public/organisation")
public class OrgControllerPublic {
    private OrganisationService organisationService;

    @Autowired
    public void setOrganisationService(OrganisationService organisationService) {
        this.organisationService = organisationService;
    }
    @PostMapping("/{id}/join")
    public ResponseEntity<ApiResponse<OrgJoinRequest>> requestToJoinOrg(
            @PathVariable(name = "id") Long id, @RequestBody SingleValue body) {
        return ResponseEntity.ok(new ApiResponse<>(organisationService.requestToJoinOrganisation(id, body.getValue())));
    }
}
