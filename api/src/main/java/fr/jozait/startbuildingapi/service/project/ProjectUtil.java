package fr.jozait.startbuildingapi.service.project;

import fr.jozait.startbuildingapi.domain.model.project.*;
import fr.jozait.startbuildingapi.domain.model.project.node.ProjectNodeType;
import fr.jozait.startbuildingapi.domain.model.user.User;
import fr.jozait.startbuildingapi.domain.repository.UserRepository;
import fr.jozait.startbuildingapi.domain.repository.project.*;
import fr.jozait.startbuildingapi.exception.ApiError;
import fr.jozait.startbuildingapi.ged.response.ListResourceResponse;
import fr.jozait.startbuildingapi.ged.response.SignedUrlResponse;
import fr.jozait.startbuildingapi.ged.response.UploadResponse;
import fr.jozait.startbuildingapi.ged.service.BucketService;
import fr.jozait.startbuildingapi.util.AppUtils;
import fr.jozait.startbuildingapi.util.UIProps;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectUtil {
    @Autowired
    private UIProps uiProps;
    @Autowired
    private ProjectNodeTypeRepository projectNodeTypeRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ProjectMemberRelationRepository memberRelationRepository;
    @Autowired
    private ProjectRoleRepository projectRoleRepository;
    @Autowired
    private ProjectKnowledgeBaseRepository projectKnowledgeBaseRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BucketService bucketService;
    @Value("${aws.s3.url-validity-seconds}")
    private Long urlValiditySeconds;

    public ProjectNodeType getNodeTypeByLabelOrCreate(String name, Long userId) {
        return projectNodeTypeRepository
                .findFirstByLabelIgnoreCase(name)
                .orElseGet(() -> projectNodeTypeRepository
                        .save(new ProjectNodeType(userId, name)));
    }
    public ProjectNodeType getNodeTypeByIdOrThrowApiError(Long id) {
        return projectNodeTypeRepository.findById(id).orElseThrow(() -> ApiError.PROJECT_TYPE_NOT_FOUND);
    }
    public Project getProjectByIdOrElseThrowApiError(Long id) {
        return projectRepository
                .findById(id)
                .orElseThrow(() -> ApiError.PROJECT_NOT_FOUND);
    }
    public boolean hasProjectAuthority(Long userId, Project project, List<ProjectMemberRelation> memberRelations) {
        if (project.getCreatorId() == null) {
            return  true;
        } else if (project.getCreatorId().equals(userId)) return true;
        return memberRelations.stream().anyMatch(r -> r.getId().getMemberId().equals(userId));
    }
    public boolean hasProjectAuthority(Long userId, Project project, String[] roleNames) {
        if (project.getCreatorId() == null) {
            return  true;
        } else if (project.getCreatorId().equals(userId)) return true;
        else {
            // get project Relation
            ProjectMemberKey pKey = new ProjectMemberKey();
            pKey.setProjectId(project.getId());
            pKey.setMemberId(userId);
            Optional<ProjectMemberRelation> optional = memberRelationRepository.findById(pKey);
            if (optional.isPresent()) {
                try {
                    ProjectRole role = projectRoleRepository.getById(optional.get().getProjectRoleId());
                    String n = role.getName().toLowerCase();
                    return Arrays.stream(roleNames).anyMatch(r -> r.toLowerCase().equals(n));
                } catch (Exception e) {
                    return false;
                }
            }
            return false;
        }
    }
    public ProjectKnowledgeBase getKnowledgeBaseByProjectIdOrElseThrowApiError(Long id){
        return projectKnowledgeBaseRepository
                .findFirstByProjectId(id)
                .orElseThrow(() -> ApiError.PROJECT_HAS_NO_KNOWLEDGE_BASE);
    }
    public ProjectRole getProjectRoleByIdOrElseThrowApiError(Long id) {
        return projectRoleRepository.findById(id).orElseThrow(() -> ApiError.PROJECT_ROLE_NOT_FOUND);
    }
    public ProjectRole getProjectRoleByNameOrElseCreate(String name) {
        return projectRoleRepository.findFirstByNameIgnoreCase(name).orElseGet(() -> {
            ProjectRole r = new ProjectRole();
            r.setName(name);
            r.setDescription("");
            return projectRoleRepository.save(r);
        });
    }
    public String getUIHost() {
        String hostProps = uiProps.getHost();
        if (hostProps == null || hostProps.isEmpty() || hostProps.equals("/")) {
            try {
                hostProps = AppUtils.getServerHost();
            } catch (Exception ignored){}
        }
        return hostProps;
    }

    public Map<Long, ProjectKnowledgeBase> findProjectKnowledgeBaseByProjectIdIn(List<Long> ids) {
        Map<Long, ProjectKnowledgeBase> result = new HashMap<>();
        projectKnowledgeBaseRepository.findAllByProjectIdIn(ids).forEach(
                projectKnowledgeBase -> result.put(projectKnowledgeBase.getProjectId(), projectKnowledgeBase)
        );
        return result;
    }
    public Map<Long, User> findProjectCreatorsByProjects(List<Project> projects) {
        Map<Long, User> result = new HashMap<>();
        List<Long> userIds = projects.stream().map(Project::getCreatorId).collect(Collectors.toList());
        List<User> users = userRepository.findAllById(userIds);
        projects.forEach(
                project -> users.stream()
                        .filter(user -> user.getId().equals(project.getCreatorId()))
                        .findAny().ifPresent(u -> result.put(project.getId(), u))
        );
        return result;
    }
    public UploadResponse upload(String dir, String fileName, File file) {
        return bucketService.upload(dir, fileName, file);
    }
    public ListResourceResponse listFiles(String prefix) {
        return bucketService.listObjects(prefix);
    }
    public SignedUrlResponse signKey(String key) {
        return bucketService.signResource(key, urlValiditySeconds);
    }
}
