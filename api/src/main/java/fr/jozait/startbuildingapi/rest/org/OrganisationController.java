package fr.jozait.startbuildingapi.rest.org;

import fr.jozait.startbuildingapi.domain.model.org.OrgMemberRelation;
import fr.jozait.startbuildingapi.domain.model.org.Organisation;
import fr.jozait.startbuildingapi.domain.model.org.form.CreateOrganisation;
import fr.jozait.startbuildingapi.domain.request.SingleValue;
import fr.jozait.startbuildingapi.domain.response.ApiResponse;
import fr.jozait.startbuildingapi.domain.response.org.OrgListMemberResponse;
import fr.jozait.startbuildingapi.domain.response.org.OrgMemberListResponse;
import fr.jozait.startbuildingapi.domain.response.org.OrgMemberResponse;
import fr.jozait.startbuildingapi.security.AppSecurityContextHolder;
import fr.jozait.startbuildingapi.service.org.OrganisationService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("${api.base.url}/organisation")
public class OrganisationController {
    private OrganisationService organisationService;

    @Autowired
    public void setOrganisationService(OrganisationService organisationService) {
        this.organisationService = organisationService;
    }

    @PostMapping
    @ApiOperation("Create an organisation")
    public ResponseEntity<ApiResponse<Organisation>> createOrganisation(@RequestBody @Valid CreateOrganisation form) {
        return ResponseEntity.ok(new ApiResponse<>(organisationService
                .createOrganisation(form, AppSecurityContextHolder.getPrincipal().getUser().getId())));
    }
    @PostMapping("/{id}/join/accept")
    @ApiOperation("Accept request to join organisation")
    public ResponseEntity<ApiResponse<Organisation>> acceptJoinRequest(@PathVariable Long id, @RequestBody SingleValue req) {
        return ResponseEntity.ok(new ApiResponse<>(organisationService.acceptJoinRequest(id, req.getValue())));
    }
    @PostMapping("/{id}/join/reject")
    @ApiOperation("Reject request to join organisation")
    public ResponseEntity<ApiResponse<Organisation>> rejectJoinRequest(@PathVariable Long id, @RequestBody SingleValue req) {
        return ResponseEntity.ok(new ApiResponse<>(organisationService.rejectJoinRequest(id, req.getValue())));
    }
    @ApiOperation("List organisation members")
    @GetMapping("/{id}/members")
    public ResponseEntity<ApiResponse<OrgMemberListResponse>> listMembers(@PathVariable Long id, Pageable pageable) {
        return ResponseEntity.ok(new ApiResponse<>(organisationService
                .listMembers(id, pageable, AppSecurityContextHolder.getPrincipal().getUser())));
    }
    @ApiOperation("List organisation members")
    @GetMapping("/joined")
    public ResponseEntity<ApiResponse<OrgListMemberResponse>> listMemberOrganisations(Pageable pageable) {
        return ResponseEntity.ok(new ApiResponse<>(organisationService
                .listMemberOrganisations(pageable, AppSecurityContextHolder.getPrincipal().getUser().getId())));
    }
    @ApiOperation("Get all organisations")
    @GetMapping("/created")
    public ResponseEntity<ApiResponse<Page<Organisation>>> listOrganisations(Pageable pageable) {
        return ResponseEntity.ok(new ApiResponse<>(organisationService
                .listOrganisations(pageable, AppSecurityContextHolder.getPrincipal().getUser().getId())));
    }
    @ApiOperation("Verify if member of organisation")
    @GetMapping("/member/verify")
    public ResponseEntity<ApiResponse<OrgMemberResponse>> listOrganisations() {
        return ResponseEntity.ok(new ApiResponse<>(organisationService.isMemberOf(AppSecurityContextHolder.getPrincipal().getUser())));
    }

}
