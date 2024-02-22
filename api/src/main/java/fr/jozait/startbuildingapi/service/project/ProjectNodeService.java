package fr.jozait.startbuildingapi.service.project;

import com.google.common.base.Preconditions;
import fr.jozait.startbuildingapi.domain.model.org.OrganisationContext;
import fr.jozait.startbuildingapi.domain.model.project.*;
import fr.jozait.startbuildingapi.domain.model.project.forms.CreateProjectNodeForm;
import fr.jozait.startbuildingapi.domain.model.project.forms.UpdateProjectNodeForm;
import fr.jozait.startbuildingapi.domain.model.project.node.*;
import fr.jozait.startbuildingapi.domain.repository.project.ProjectKnowledgeBaseRepository;
import fr.jozait.startbuildingapi.domain.repository.project.ProjectNodeStatusRepository;
import fr.jozait.startbuildingapi.domain.repository.project.ProjectNodeTypeRepository;
import fr.jozait.startbuildingapi.domain.request.project.CreateDocumentNodeRequest;
import fr.jozait.startbuildingapi.exception.ApiError;
import fr.jozait.startbuildingapi.ged.response.ListResourceResponse;
import fr.jozait.startbuildingapi.ged.response.SignedUrlResponse;
import fr.jozait.startbuildingapi.ged.response.UploadResponse;
import fr.jozait.startbuildingapi.precondition.Precondition;
import fr.jozait.startbuildingapi.util.ACL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProjectNodeService {
    @Autowired
    ProjectUtil projectUtil;
    @Autowired
    ProjectKnowledgeBaseRepository projectKnowledgeBaseRepository;
    @Autowired
    ProjectNodeTypeRepository projectNodeTypeRepository;
    @Autowired
    ProjectNodeStatusRepository projectNodeStatusRepository;
    public ProjectKnowledgeBase createProjectNode(Long projectId, Long userId, CreateProjectNodeForm nodeForm) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(projectId);
        if (projectUtil.hasProjectAuthority(userId, project, ACL.CREATE)) {// validate project belongs to user
            ProjectNodeType projectNodeType;
            try {
                projectNodeType = projectUtil.getNodeTypeByIdOrThrowApiError(nodeForm.getTypeId());
            } catch (Exception e) {
                if (Objects.nonNull(nodeForm.getNodeType()) && !nodeForm.getNodeType().trim().isEmpty()) {
                    projectNodeType = projectUtil.getNodeTypeByLabelOrCreate(nodeForm.getNodeType().toLowerCase(), userId);
                } else {
                    throw e;
                }
            }
            ProjectKnowledgeNode projectKnowledgeNode = new ProjectKnowledgeNode();
            projectKnowledgeNode.getAttributes()
                    .setNodeType(projectNodeType.getLabel())
                    .setIconName(projectNodeType.getIconName())
                    .setDurationInSeconds(nodeForm.getDurationInSeconds())
                    .setLongitude(nodeForm.getLongitude())
                    .setLatitude(nodeForm.getLatitude())
                    .setStartsAt(nodeForm.getStartsAt())
                    .setStatus(nodeForm.getStatus())
                    .setData(nodeForm.getData())
                    .setEndsAt(nodeForm.getEndsAt())
                    .setDescription(nodeForm.getDescription());
            projectKnowledgeNode.setName(nodeForm.getName());
            // add empty node
            ProjectKnowledgeNode projectKnowledgeNodeNew = new ProjectKnowledgeNode();
            projectKnowledgeNodeNew.getAttributes()
                    .setNodeType("empty")
                    .setIconName("empty")
                    .setDescription("nouveau nœud");
            projectKnowledgeNodeNew.setName("");
            projectKnowledgeNode.appendChild(projectKnowledgeNodeNew);

            ProjectKnowledgeBase knowledgeBase = projectUtil.getKnowledgeBaseByProjectIdOrElseThrowApiError(projectId);

            ProjectKnowledgeBaseHelper
                    .of(knowledgeBase)
                    .insert(projectKnowledgeNode, nodeForm.getParentNodeId());
            return projectKnowledgeBaseRepository
                    .save(knowledgeBase);
        }
        throw ApiError.PROJECT_NOT_FOUND;
    }
    public ProjectKnowledgeBase updateNode(Long projectId, Long userId, UpdateProjectNodeForm nodeForm) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(projectId);
        if (projectUtil.hasProjectAuthority(userId, project, ACL.WRITE)) {// validate project belongs to user
            ProjectKnowledgeNode projectKnowledgeNode = new ProjectKnowledgeNode();
            projectKnowledgeNode.getAttributes()
                    .setId(nodeForm.getId())
                    .setDescription(nodeForm.getDescription())
                    .setDurationInSeconds(nodeForm.getDurationInSeconds())
                    .setIconName(nodeForm.getIconName())
                    .setLatitude(nodeForm.getLatitude())
                    .setStatus(nodeForm.getStatus())
                    .setStartsAt(nodeForm.getStartsAt())
                    .setData(nodeForm.getData())
                    .setEndsAt(nodeForm.getEndsAt())
                    .setLongitude(nodeForm.getLongitude());
            projectKnowledgeNode.setName(nodeForm.getName());
            ProjectKnowledgeBase knowledgeBase = projectUtil.getKnowledgeBaseByProjectIdOrElseThrowApiError(projectId);
            ProjectKnowledgeBaseHelper
                    .of(knowledgeBase)
                    .update(projectKnowledgeNode);
            return projectKnowledgeBaseRepository
                    .save(knowledgeBase);
        }
        throw ApiError.PROJECT_NOT_FOUND;
    }
    public ProjectKnowledgeBase addNodeSection(Long projectId, String nodeId, Long userId, ProjectKnowledgeSection section) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(projectId);
        if (projectUtil.hasProjectAuthority(userId, project, ACL.WRITE)) {// validate project belongs to user
            ProjectKnowledgeBase knowledgeBase = projectUtil.getKnowledgeBaseByProjectIdOrElseThrowApiError(projectId);
            ProjectKnowledgeBaseHelper helper = ProjectKnowledgeBaseHelper.of(knowledgeBase);
            ProjectKnowledgeNode node = helper.read(nodeId);
            section.setId(UUID.randomUUID().toString());
            node.getAttributes().getSections().add(section);
            helper.update(node);
            return projectKnowledgeBaseRepository
                    .save(knowledgeBase);
        }
        throw ApiError.PROJECT_NOT_FOUND;
    }
    public ProjectKnowledgeBase updateNodeSection(Long projectId, String nodeId, Long userId, ProjectKnowledgeSection source) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(projectId);
        if (projectUtil.hasProjectAuthority(userId, project, ACL.WRITE)) {// validate project belongs to user
            ProjectKnowledgeBase knowledgeBase = projectUtil.getKnowledgeBaseByProjectIdOrElseThrowApiError(projectId);
            ProjectKnowledgeBaseHelper helper = ProjectKnowledgeBaseHelper.of(knowledgeBase);
            ProjectKnowledgeNode node = helper.read(nodeId);
            int index = node.getAttributes().getSections().indexOf(source);
            ProjectKnowledgeSection target = node.getAttributes().getSections().get(index);
            target.setDescription(source.getDescription());
            target.setName(source.getName());
            node.getAttributes().getSections().set(index, target);
            helper.update(node);
            return projectKnowledgeBaseRepository
                    .save(knowledgeBase);
        }
        throw ApiError.PROJECT_NOT_FOUND;
    }
    public ProjectKnowledgeBase addChildrenToNodeSection(Long projectId, String nodeId, Long userId, String sectionId, List<String> children) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(projectId);
        if (projectUtil.hasProjectAuthority(userId, project, ACL.WRITE)) {// validate project belongs to user
            ProjectKnowledgeBase knowledgeBase = projectUtil.getKnowledgeBaseByProjectIdOrElseThrowApiError(projectId);
            ProjectKnowledgeBaseHelper helper = ProjectKnowledgeBaseHelper.of(knowledgeBase);
            ProjectKnowledgeNode node = helper.read(nodeId);
            ProjectKnowledgeSection source = new ProjectKnowledgeSection();
            source.setId(sectionId);
            int index = node.getAttributes().getSections().indexOf(source);
            ProjectKnowledgeSection target = node.getAttributes().getSections().get(index);
            target.getChildren().addAll(children);
            node.getAttributes().getSections().set(index, target);
            helper.update(node);
            return projectKnowledgeBaseRepository
                    .save(knowledgeBase);
        }
        throw ApiError.PROJECT_NOT_FOUND;
    }
    public ProjectKnowledgeBase removeChildrenFromNodeSection(Long projectId, String nodeId, Long userId, String sectionId, List<String> children) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(projectId);
        if (projectUtil.hasProjectAuthority(userId, project, ACL.WRITE)) {// validate project belongs to user
            ProjectKnowledgeBase knowledgeBase = projectUtil.getKnowledgeBaseByProjectIdOrElseThrowApiError(projectId);
            ProjectKnowledgeBaseHelper helper = ProjectKnowledgeBaseHelper.of(knowledgeBase);
            ProjectKnowledgeNode node = helper.read(nodeId);
            ProjectKnowledgeSection source = new ProjectKnowledgeSection();
            source.setId(sectionId);
            int index = node.getAttributes().getSections().indexOf(source);
            ProjectKnowledgeSection target = node.getAttributes().getSections().get(index);
            children.forEach(target.getChildren()::remove);
            node.getAttributes().getSections().set(index, target);
            helper.update(node);
            return projectKnowledgeBaseRepository
                    .save(knowledgeBase);
        }
        throw ApiError.PROJECT_NOT_FOUND;
    }
    public ProjectKnowledgeBase moveChildrenBetweenNodeSections(
            Long projectId, String nodeId, Long userId, String sourceId, String targetId, List<String> children
    ) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(projectId);
        if (projectUtil.hasProjectAuthority(userId, project, ACL.WRITE)) {// validate project belongs to user
            ProjectKnowledgeBase knowledgeBase = projectUtil.getKnowledgeBaseByProjectIdOrElseThrowApiError(projectId);
            ProjectKnowledgeBaseHelper helper = ProjectKnowledgeBaseHelper.of(knowledgeBase);
            ProjectKnowledgeNode node = helper.read(nodeId);
            ProjectKnowledgeSection source = new ProjectKnowledgeSection();
            source.setId(sourceId);
            ProjectKnowledgeSection target = new ProjectKnowledgeSection();
            target.setId(targetId);
            int sIndex = node.getAttributes().getSections().indexOf(source);
            int tIndex = node.getAttributes().getSections().indexOf(target);
            ProjectKnowledgeSection targetSection = node.getAttributes().getSections().get(tIndex);
            ProjectKnowledgeSection sourceSection = node.getAttributes().getSections().get(sIndex);
            List<String> removed = new ArrayList<>();
            children.forEach(child -> {
                if (sourceSection.getChildren().remove(child)) {
                    removed.add(child);
                }
            });
            if (removed.size() > 0) {
                targetSection.getChildren().addAll(removed);
                helper.update(node);
            }
            return projectKnowledgeBaseRepository
                    .save(knowledgeBase);
        }
        throw ApiError.PROJECT_NOT_FOUND;
    }
    public ProjectKnowledgeBase removeNodeSection(Long projectId, String nodeId, Long userId, String sectionId) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(projectId);
        if (projectUtil.hasProjectAuthority(userId, project, ACL.WRITE)) {// validate project belongs to user
            ProjectKnowledgeBase knowledgeBase = projectUtil.getKnowledgeBaseByProjectIdOrElseThrowApiError(projectId);
            ProjectKnowledgeBaseHelper helper = ProjectKnowledgeBaseHelper.of(knowledgeBase);
            ProjectKnowledgeNode node = helper.read(nodeId);
            ProjectKnowledgeSection section = new ProjectKnowledgeSection();
            section.setId(sectionId);
            node.getAttributes().getSections().remove(section);
            helper.update(node);
            return projectKnowledgeBaseRepository
                    .save(knowledgeBase);
        }
        throw ApiError.PROJECT_NOT_FOUND;
    }
    public ProjectKnowledgeBase deleteNode(Long projectId, Long userId, String nodeId) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(projectId);
        if (projectUtil.hasProjectAuthority(userId, project, ACL.WRITE)) {// validate project belongs to user
            ProjectKnowledgeBase knowledgeBase = projectUtil.getKnowledgeBaseByProjectIdOrElseThrowApiError(projectId);
            ProjectKnowledgeBaseHelper
                    .of(knowledgeBase)
                    .delete(nodeId);
            return projectKnowledgeBaseRepository
                    .save(knowledgeBase);
        }
        throw ApiError.PROJECT_NOT_FOUND;
    }
    public ProjectKnowledgeNode getNode(Long projectId, Long userId, String nodeId) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(projectId);
        if (projectUtil.hasProjectAuthority(userId, project, ACL.READ)) {// validate project belongs to user
            ProjectKnowledgeBase knowledgeBase = projectUtil.getKnowledgeBaseByProjectIdOrElseThrowApiError(projectId);
            return ProjectKnowledgeBaseHelper
                    .of(knowledgeBase)
                    .read(nodeId);
        }
        throw ApiError.PROJECT_NOT_FOUND;
    }
    public List<ProjectNodeType> listProjectNodeTypes(Long projectId, Long userId) {
        // list defaults
        // list ones that I created
        return projectNodeTypeRepository.findAllApplicableToProject(
                userId,
                projectId == null ? 0L : projectId
        );
    }
    public List<ProjectNodeStatus> listProjectNodeStatuses(Long projectId, Long userId) {
        // list defaults
        // list ones that I created
        return projectNodeStatusRepository.findAllApplicableToProject(
                userId,
                projectId == null ? 0L : projectId
        );
    }
    public ProjectKnowledgeBase createProjectDocumentNode(Long projectId, Long userId, CreateDocumentNodeRequest nodeForm) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(projectId);
        if (projectUtil.hasProjectAuthority(userId, project, ACL.CREATE)) {// validate project belongs to user
            // upload to s3
            StringBuilder dir = new StringBuilder();
            if (OrganisationContext.getId() != null) {
                dir.append("organisation").append("/");
                dir.append(OrganisationContext.getId()).append("/");
            }
            dir.append("projet").append("/")
                    .append(projectId).append("/");
            if (nodeForm.getPrefix() != null) {
                dir.append(nodeForm.getPrefix()).append("/");
            }
            ProjectKnowledgeNode projectKnowledgeNode = new ProjectKnowledgeNode();
            dir.append(projectKnowledgeNode.getAttributes().getId());
            UploadResponse uploadResponse = projectUtil.upload(dir.toString(), nodeForm.getFileName(), nodeForm.getFile());
            ProjectKnowledgeNodeDocument nodeDocument = new ProjectKnowledgeNodeDocument();
            nodeDocument.setDirectory(uploadResponse.getDirectory());
            nodeDocument.setFileName(uploadResponse.getFileName());
            nodeDocument.setMimeType(uploadResponse.getMimeType());
            nodeDocument.setUrl(uploadResponse.getKey());
            projectKnowledgeNode.getAttributes()
                    .setNodeType("documents")
                    .setIconName("doc")
                    .setDocuments(Collections.singletonList(nodeDocument))
                    .setDescription(nodeForm.getDescription());
            projectKnowledgeNode.setName(nodeForm.getName());
            // add empty node
            ProjectKnowledgeNode projectKnowledgeNodeNew = new ProjectKnowledgeNode();
            projectKnowledgeNodeNew.getAttributes()
                    .setNodeType("empty")
                    .setIconName("empty")
                    .setDescription("nouveau nœud");
            projectKnowledgeNodeNew.setName("");
            projectKnowledgeNode.appendChild(projectKnowledgeNodeNew);

            ProjectKnowledgeBase knowledgeBase = projectUtil.getKnowledgeBaseByProjectIdOrElseThrowApiError(projectId);

            ProjectKnowledgeBaseHelper
                    .of(knowledgeBase)
                    .insert(projectKnowledgeNode, nodeForm.getParentNodeId());
            return projectKnowledgeBaseRepository
                    .save(knowledgeBase);
        }
        throw ApiError.PROJECT_NOT_FOUND;
    }

    public ProjectKnowledgeBase addDocumentToNode(Long projectId, Long userId, CreateDocumentNodeRequest nodeForm) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(projectId);
        if (projectUtil.hasProjectAuthority(userId, project, ACL.CREATE)) {// validate project belongs to user
            // upload to s3
            StringBuilder dir = new StringBuilder();
            if (OrganisationContext.getId() != null) {
                dir.append("organisation").append("/");
                dir.append(OrganisationContext.getId()).append("/");
            }
            dir.append("projet").append("/")
                    .append(projectId).append("/");
            if (nodeForm.getPrefix() != null) {
                dir.append(nodeForm.getPrefix()).append("/");
            }
            UploadResponse uploadResponse = projectUtil.upload(dir.toString(), nodeForm.getFileName(), nodeForm.getFile());
            ProjectKnowledgeNodeDocument nodeDocument = new ProjectKnowledgeNodeDocument();
            nodeDocument.setDirectory(uploadResponse.getDirectory());
            nodeDocument.setFileName(uploadResponse.getFileName());
            nodeDocument.setMimeType(uploadResponse.getMimeType());
            nodeDocument.setUrl(uploadResponse.getKey());

            ProjectKnowledgeBase knowledgeBase = projectUtil.getKnowledgeBaseByProjectIdOrElseThrowApiError(projectId);

            ProjectKnowledgeBaseHelper helper = ProjectKnowledgeBaseHelper
                    .of(knowledgeBase);
            ProjectKnowledgeNode node = helper.read(nodeForm.getParentNodeId());
            if (node != null && node.getAttributes() != null) {
                node.getAttributes().getDocuments().add(nodeDocument);
            }
            return projectKnowledgeBaseRepository
                    .save(knowledgeBase);
        }
        throw ApiError.PROJECT_NOT_FOUND;
    }
    public ListResourceResponse listNodeFiles(Long projectId, String prefix, Long userId) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(projectId);
        if (projectUtil.hasProjectAuthority(userId, project, ACL.READ)) {// validate project belongs to user
            // upload to s3
            StringBuilder dir = new StringBuilder();
            if (OrganisationContext.getId() != null) {
                dir.append("organisation").append("/");
                dir.append(OrganisationContext.getId()).append("/");
            }
            dir.append("projet").append("/")
                    .append(projectId).append("/").append(prefix);
            return projectUtil.listFiles(dir.toString());
        }
        throw ApiError.PROJECT_NOT_FOUND;
    }
    public SignedUrlResponse getSignedUrl(Long projectId, String key, Long userId) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(projectId);
        Precondition.checkValue(
                () -> projectUtil.hasProjectAuthority(userId, project, ACL.READ),
                ApiError.PROJECT_NOT_FOUND
        );
        if (projectUtil.hasProjectAuthority(userId, project, ACL.READ)) {// validate project belongs to user
            // upload to s3
            return projectUtil.signKey(key);
        }
        throw ApiError.PROJECT_NOT_FOUND;
    }
}
