package fr.jozait.startbuildingapi.rest.project;

import fr.jozait.startbuildingapi.domain.model.org.Organisation;
import fr.jozait.startbuildingapi.domain.model.project.Project;
import fr.jozait.startbuildingapi.domain.model.project.ProjectKnowledgeBase;
import fr.jozait.startbuildingapi.domain.model.project.ProjectMemberRelation;
import fr.jozait.startbuildingapi.domain.model.project.ProjectRole;
import fr.jozait.startbuildingapi.domain.model.project.forms.CreateProjectForm;
import fr.jozait.startbuildingapi.domain.model.project.forms.ProjectInviteForm;
import fr.jozait.startbuildingapi.domain.request.ListValueRequest;
import fr.jozait.startbuildingapi.domain.response.ApiResponse;
import fr.jozait.startbuildingapi.domain.response.project.ProjectListResponse;
import fr.jozait.startbuildingapi.domain.response.project.ProjectResponse;
import fr.jozait.startbuildingapi.ged.response.ListResourceResponse;
import fr.jozait.startbuildingapi.security.AppSecurityContextHolder;
import fr.jozait.startbuildingapi.service.project.ProjectService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("${api.base.url}/project")
public class ProjectController {
    @Autowired
    private ProjectService projectService;
    @ApiOperation("Get all projects")
    @GetMapping
    public ResponseEntity<ApiResponse<ProjectListResponse>> listProjects() {
        return ResponseEntity.ok(new ApiResponse<>(projectService
                .listProjects(AppSecurityContextHolder.getPrincipal().getUser().getId())));
    }
    @ApiOperation("Get all organisations")
    @GetMapping("/organisation/all")
    public ResponseEntity<ApiResponse<Page<Organisation>>> listOrganisations(Pageable pageable) {
        return ResponseEntity.ok(new ApiResponse<>(projectService
                .listOrganisations(pageable, AppSecurityContextHolder.getPrincipal().getUser().getId())));
    }
    @ApiOperation("Creates a new project")
    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(@RequestBody @Valid CreateProjectForm projectForm) {
        return ResponseEntity.ok(new ApiResponse<>(projectService
                .createProject(AppSecurityContextHolder.getPrincipal().getUser().getId(), projectForm)));
    }
    @ApiOperation("Updates a project")
    @PostMapping("/{id}/update")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(@PathVariable Long id, @RequestBody CreateProjectForm projectForm) {
        return ResponseEntity.ok(new ApiResponse<>(projectService
                .updateProject(id, projectForm, AppSecurityContextHolder.getPrincipal().getUser().getId())));
    }

    @ApiOperation("Loads the knowledge tree for the project")
    @GetMapping("/{projectId}/tree")
    public ResponseEntity<ApiResponse<ProjectKnowledgeBase>> loadKnowledgeTree(@PathVariable Long projectId) {
        return ResponseEntity.ok(new ApiResponse<>(projectService
                .getProjectKnowledgeBaseByProjectId(projectId, AppSecurityContextHolder.getPrincipal().getUser().getId())));
    }
    @ApiOperation("Loads the knowledge tree for projects by id values")
    @PostMapping("/tree")
    public ResponseEntity<ApiResponse<Map<Long, ProjectKnowledgeBase>>> bulkLoadKnowledgeTree(@RequestBody ListValueRequest<Long> idValues) {
        return ResponseEntity.ok(new ApiResponse<>(projectService
                .findProjectKnowledgeBaseByProjectIdIn(idValues.getValues())));
    }
    @ApiOperation("List available project roles")
    @GetMapping("/roles")
    public ResponseEntity<ApiResponse<Page<ProjectRole>>> listProjectRoles(Pageable pageable) {
        return ResponseEntity.ok(new ApiResponse<>(projectService.listProjectRoles(pageable)));
    }
    @ApiOperation("Invite members to project")
    @PostMapping("/{id}/invite")
    public ResponseEntity<ApiResponse<Project>> inviteMembers(
            @RequestBody @Valid ProjectInviteForm form, @PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(new ApiResponse<>(projectService
                .inviteMembers(id, form.getInvitations(), AppSecurityContextHolder.getPrincipal().getUser())));
    }
    @ApiOperation("List project members")
    @GetMapping("/{id}/members")
    public ResponseEntity<ApiResponse<Page<ProjectMemberRelation>>> listMembers(@PathVariable Long id, Pageable pageable) {
        return ResponseEntity.ok(new ApiResponse<>(projectService
                .listMembers(id, pageable, AppSecurityContextHolder.getPrincipal().getUser().getId())));
    }
    @ApiOperation("List all projects user has been invited to")
    @GetMapping("/joined")
    public ResponseEntity<ApiResponse<Page<ProjectMemberRelation>>> listInvited(Pageable pageable) {
        return ResponseEntity.ok(new ApiResponse<>(projectService
                .listMemberProjects(pageable, AppSecurityContextHolder.getPrincipal().getUser().getId())));
    }
    @ApiOperation("List project files")
    @GetMapping("/{projectId}/files")
    public ResponseEntity<ApiResponse<ListResourceResponse>> listNodeFiles(
            @PathVariable("projectId") Long projectId){
        return ResponseEntity.ok(new ApiResponse<>(
                projectService.listProjectFiles(
                        projectId, AppSecurityContextHolder.getPrincipal().getUser().getId()
                )));
    }
}
