package fr.jozait.startbuildingapi.rest.project;

import fr.jozait.startbuildingapi.domain.model.project.*;
import fr.jozait.startbuildingapi.domain.model.project.forms.CreateProjectNodeForm;
import fr.jozait.startbuildingapi.domain.model.project.forms.UpdateProjectNodeForm;
import fr.jozait.startbuildingapi.domain.model.project.node.ProjectKnowledgeNode;
import fr.jozait.startbuildingapi.domain.model.project.node.ProjectNodeStatus;
import fr.jozait.startbuildingapi.domain.model.project.node.ProjectNodeType;
import fr.jozait.startbuildingapi.domain.request.ListValueRequest;
import fr.jozait.startbuildingapi.domain.request.project.CreateDocumentNodeRequest;
import fr.jozait.startbuildingapi.domain.response.ApiResponse;
import fr.jozait.startbuildingapi.ged.response.ListResourceResponse;
import fr.jozait.startbuildingapi.ged.response.SignedUrlResponse;
import fr.jozait.startbuildingapi.security.AppSecurityContextHolder;
import fr.jozait.startbuildingapi.service.project.ProjectNodeService;
import fr.jozait.startbuildingapi.util.AppUtils;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("${api.base.url}/project")
public class ProjectNodeController {
    @Autowired
    ProjectNodeService projectService;
    @ApiOperation("Creates a new project node")
    @PostMapping("/{projectId}/tree/node")
    public ResponseEntity<ApiResponse<ProjectKnowledgeBase>> createProjectNode(
            @PathVariable Long projectId,
            @RequestBody @Valid CreateProjectNodeForm nodeForm) {
        return ResponseEntity.ok(new ApiResponse<>(projectService
                .createProjectNode(projectId, AppSecurityContextHolder.getPrincipal().getUser().getId(), nodeForm)));
    }
    @ApiOperation("List available project node types")
    @GetMapping("/node/types")
    public ResponseEntity<ApiResponse<List<ProjectNodeType>>> listNodeTypes(@RequestParam(name = "project_id", required = false) Long projectId) {
        return ResponseEntity.ok(new ApiResponse<>(projectService
                .listProjectNodeTypes(projectId, AppSecurityContextHolder.getPrincipal().getUser().getId())));
    }
    @ApiOperation("Update a project node")
    @PostMapping("/{projectId}/tree/node/update")
    public ResponseEntity<ApiResponse<ProjectKnowledgeBase>> updateProjectNode(
            @PathVariable Long projectId,
            @RequestBody @Valid UpdateProjectNodeForm nodeForm) {
        return ResponseEntity.ok(new ApiResponse<>(projectService
                .updateNode(projectId, AppSecurityContextHolder.getPrincipal().getUser().getId(), nodeForm)));
    }
    @ApiOperation("Add a project node section")
    @PostMapping("/{projectId}/tree/node/{nodeId}/section")
    public ResponseEntity<ApiResponse<ProjectKnowledgeBase>> addProjectNodeSection(
            @PathVariable("projectId") Long projectId,
            @PathVariable("nodeId") String nodeId,
            @RequestBody @Valid ProjectKnowledgeSection section) {
        return ResponseEntity.ok(new ApiResponse<>(projectService.addNodeSection(
                projectId, nodeId, AppSecurityContextHolder.getPrincipal().getUser().getId(), section
        )));
    }
    @ApiOperation("Update a project node section")
    @PostMapping("/{projectId}/tree/node/{nodeId}/section/{sectionId}")
    public ResponseEntity<ApiResponse<ProjectKnowledgeBase>> updateProjectNodeSection(
            @PathVariable("projectId") Long projectId,
            @PathVariable("nodeId") String nodeId,
            @PathVariable("sectionId") String sectionId,
            @RequestBody @Valid ProjectKnowledgeSection section) {
        section.setId(sectionId);
        return ResponseEntity.ok(new ApiResponse<>(projectService.updateNodeSection(
                projectId, nodeId, AppSecurityContextHolder.getPrincipal().getUser().getId(), section
        )));
    }
    @ApiOperation("Update a project node section")
    @PostMapping("/{projectId}/tree/node/{nodeId}/section/{sectionId}/children")
    public ResponseEntity<ApiResponse<ProjectKnowledgeBase>> addChildrenToProjectNodeSection(
            @PathVariable("projectId") Long projectId,
            @PathVariable("nodeId") String nodeId,
            @PathVariable("sectionId") String sectionId,
            @RequestBody ListValueRequest<String> children) {
        return ResponseEntity.ok(new ApiResponse<>(projectService.addChildrenToNodeSection(
                projectId, nodeId, AppSecurityContextHolder.getPrincipal().getUser().getId(),
                sectionId, children.getValues()
        )));
    }
    @ApiOperation("Update a project node section")
    @PostMapping("/{projectId}/tree/node/{nodeId}/section/{sectionId}/children/remove")
    public ResponseEntity<ApiResponse<ProjectKnowledgeBase>> removeChildrenFromProjectNodeSection(
            @PathVariable("projectId") Long projectId,
            @PathVariable("nodeId") String nodeId,
            @PathVariable("sectionId") String sectionId,
            @RequestBody ListValueRequest<String> children) {
        return ResponseEntity.ok(new ApiResponse<>(projectService.removeChildrenFromNodeSection(
                projectId, nodeId, AppSecurityContextHolder.getPrincipal().getUser().getId(),
                sectionId, children.getValues()
        )));
    }
    @ApiOperation("Remove a project node section")
    @DeleteMapping("/{projectId}/tree/node/{nodeId}/section/{sectionId}")
    public ResponseEntity<ApiResponse<ProjectKnowledgeBase>> removeProjectNodeSection(
            @PathVariable("projectId") Long projectId,
            @PathVariable("nodeId") String nodeId,
            @PathVariable("sectionId") String sectionId) {
        return ResponseEntity.ok(new ApiResponse<>(projectService.removeNodeSection(
                projectId, nodeId, AppSecurityContextHolder.getPrincipal().getUser().getId(), sectionId
        )));
    }
    @ApiOperation("Delete a project node")
    @DeleteMapping("/{projectId}/tree/node/{nodeId}")
    public ResponseEntity<ApiResponse<ProjectKnowledgeBase>> deleteProjectNode(
            @PathVariable Long projectId,
            @PathVariable String nodeId) {
        return ResponseEntity.ok(new ApiResponse<>(projectService
                .deleteNode(projectId, AppSecurityContextHolder.getPrincipal().getUser().getId(), nodeId)));
    }
    @ApiOperation("Get a project node")
    @GetMapping("/{projectId}/tree/node/{nodeId}")
    public ResponseEntity<ApiResponse<ProjectKnowledgeNode>> getProjectNode(
            @PathVariable Long projectId,
            @PathVariable String nodeId) {
        return ResponseEntity.ok(new ApiResponse<>(projectService
                .getNode(projectId, AppSecurityContextHolder.getPrincipal().getUser().getId(), nodeId)));
    }
    @ApiOperation("List available project node statuses")
    @GetMapping("/node/statuses")
    public ResponseEntity<ApiResponse<List<ProjectNodeStatus>>> listNodeStatuses(@RequestParam(name = "project_id", required = false) Long projectId) {
        return ResponseEntity.ok(new ApiResponse<>(projectService
                .listProjectNodeStatuses(projectId, AppSecurityContextHolder.getPrincipal().getUser().getId())));
    }
    @ApiOperation("Update a project node section")
    @PostMapping("/{projectId}/tree/node/{nodeId}/sections/{sourceId}/{targetId}")
    public ResponseEntity<ApiResponse<ProjectKnowledgeBase>> moveChildBetweenProjectNodeSections(
            @PathVariable("projectId") Long projectId,
            @PathVariable("nodeId") String nodeId,
            @PathVariable("sourceId") String sourceId,
            @PathVariable("targetId") String targetId,
            @RequestBody ListValueRequest<String> children) {
        return ResponseEntity.ok(new ApiResponse<>(projectService.moveChildrenBetweenNodeSections(
                projectId, nodeId, AppSecurityContextHolder.getPrincipal().getUser().getId(),
                sourceId, targetId, children.getValues()
        )));
    }
    @ApiOperation("Add a document node")
    @PostMapping(value = "/{projectId}/tree/node/document", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ApiResponse<ProjectKnowledgeBase>> createDocumentNode(
            @PathVariable("projectId") Long projectId,
            @RequestParam MultipartFile file,
            @RequestParam(value = "parentNodeId", required = false) String parentNodeId,
            @RequestParam("name") String name,
            @RequestParam("prefix") String prefix,
            @RequestParam(value = "description", required = false) String description) throws IOException {
        CreateDocumentNodeRequest doc = new CreateDocumentNodeRequest();
        doc.setDescription(description);
        doc.setName(name);
        doc.setParentNodeId(parentNodeId);
        doc.setPrefix(prefix);
        doc.setFile(AppUtils.convertMultipartFileToFile(file));
        doc.setFileName(file.getOriginalFilename());
        return ResponseEntity.ok(new ApiResponse<>(
                projectService.createProjectDocumentNode(
                        projectId, AppSecurityContextHolder.getPrincipal().getUser().getId(), doc
                )));
    }
    @ApiOperation("Add a document to node")
    @PostMapping(value = "/{projectId}/tree/node/{nodeId}/document", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ApiResponse<ProjectKnowledgeBase>> addDocumentToNode(
            @PathVariable("projectId") Long projectId,
            @PathVariable("nodeId") String nodeId,
            @RequestParam MultipartFile file,
            @RequestParam("prefix") String prefix) throws IOException {
        CreateDocumentNodeRequest doc = new CreateDocumentNodeRequest();
        doc.setParentNodeId(nodeId);
        doc.setPrefix(prefix);
        doc.setFile(AppUtils.convertMultipartFileToFile(file));
        doc.setFileName(file.getOriginalFilename());
        return ResponseEntity.ok(new ApiResponse<>(
                projectService.addDocumentToNode(
                        projectId, AppSecurityContextHolder.getPrincipal().getUser().getId(), doc
                )));
    }
    @ApiOperation("List node files")
    @GetMapping("/{projectId}/tree/node/files")
    public ResponseEntity<ApiResponse<ListResourceResponse>> listNodeFiles(
            @PathVariable("projectId") Long projectId,
            @RequestParam("prefix") String prefix){
        return ResponseEntity.ok(new ApiResponse<>(
                projectService.listNodeFiles(
                        projectId, prefix, AppSecurityContextHolder.getPrincipal().getUser().getId()
                )));
    }
    @ApiOperation("Sign File Key")
    @GetMapping("/{projectId}/tree/node/files/signed")
    public ResponseEntity<ApiResponse<SignedUrlResponse>> signFileKey(
            @PathVariable("projectId") Long projectId,
            @RequestParam("key") String key){
        return ResponseEntity.ok(new ApiResponse<>(
                projectService.getSignedUrl(
                        projectId, key, AppSecurityContextHolder.getPrincipal().getUser().getId()
                )));
    }
}
