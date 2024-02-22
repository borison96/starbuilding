package fr.jozait.startbuildingapi.service.project;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.jozait.startbuildingapi.domain.model.JsonWrapper;
import fr.jozait.startbuildingapi.domain.model.org.Organisation;
import fr.jozait.startbuildingapi.domain.model.org.OrganisationContext;
import fr.jozait.startbuildingapi.domain.model.project.*;
import fr.jozait.startbuildingapi.domain.model.project.forms.CreateProjectForm;
import fr.jozait.startbuildingapi.domain.model.project.forms.ProjectInvite;
import fr.jozait.startbuildingapi.domain.model.project.node.ProjectKnowledgeNode;
import fr.jozait.startbuildingapi.domain.model.project.node.ProjectNodeType;
import fr.jozait.startbuildingapi.domain.model.user.User;
import fr.jozait.startbuildingapi.domain.repository.UserRepository;
import fr.jozait.startbuildingapi.domain.repository.org.OrganisationRepository;
import fr.jozait.startbuildingapi.domain.repository.project.*;
import fr.jozait.startbuildingapi.domain.response.project.ProjectListResponse;
import fr.jozait.startbuildingapi.domain.response.project.ProjectResponse;
import fr.jozait.startbuildingapi.exception.ApiError;
import fr.jozait.startbuildingapi.exception.ApiException;
import fr.jozait.startbuildingapi.ged.response.ListResourceResponse;
import fr.jozait.startbuildingapi.service.mail.EmailAddress;
import fr.jozait.startbuildingapi.service.mail.EmailUtil;
import fr.jozait.startbuildingapi.util.ACL;
import fr.jozait.startbuildingapi.util.AppUtils;
import fr.jozait.startbuildingapi.util.UIProps;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectService {
    private Logger logger = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ProjectKnowledgeBaseRepository projectKnowledgeBaseRepository;
    @Autowired
    private OrganisationRepository organisationRepository;
    @Autowired
    private ProjectRoleRepository projectRoleRepository;
    @Value("${api.base.url}")
    private String apiBaseUrl;
    @Autowired
    private EmailUtil emailUtil;
    @Autowired
    private UIProps uiProps;
    @Autowired
    private ProjectMemberRelationRepository memberRelationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectOrgRelationRepository projectOrgRelationRepository;
    @Autowired
    private ProjectUtil projectUtil;

    public ProjectResponse createProject(Long userId, CreateProjectForm form) {
        // check for project node type
        // save project
        Project project = new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .convertValue(form, Project.class);
        project.setCreatorId(userId);
        project.setCreatedAt(Instant.now());
        project.setUpdatedAt(Instant.now());
        projectRepository.save(project);
        if (OrganisationContext.getId() != null) {
            // save the relationship
            ProjectOrgKey projectOrgKey = new ProjectOrgKey();
            projectOrgKey.setProjectId(project.getId());
            projectOrgKey.setOrganisationId(OrganisationContext.getId());
            ProjectOrgRelation relation = new ProjectOrgRelation();
            relation.setId(projectOrgKey);
            projectOrgRelationRepository.save(relation);
        }
        ProjectKnowledgeBase knowledgeBase = projectKnowledgeBaseRepository
                .save(createNewKnowledgeBaseForProject(project, form.getStatus(), userId));
        return  new ProjectResponse(project, knowledgeBase);
    }

    public ProjectResponse updateProject(Long id, CreateProjectForm form, Long userId) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(id);
        ProjectKnowledgeBase knowledgeBase;
        try {
            knowledgeBase = projectUtil.getKnowledgeBaseByProjectIdOrElseThrowApiError(id);
        } catch (ApiException e) {
            knowledgeBase = createNewKnowledgeBaseForProject(project, userId);
        }
        // save project
        if (form.getName() != null && !form.getName().trim().isEmpty()) {
            project.setName(form.getName());
            knowledgeBase.getTree().setName(form.getName());
        }
        if (form.getDescription() != null && !form.getDescription().trim().isEmpty()) {
            project.setDescription(form.getDescription());
            knowledgeBase.getTree().getAttributes().setDescription(form.getDescription());
        }
        if (form.getLatitude() != null) {
            project.setLatitude(form.getLatitude());
            knowledgeBase.getTree().getAttributes().setLatitude(form.getLatitude());
        }
        if (form.getLongitude() != null) {
            project.setLatitude(form.getLongitude());
            knowledgeBase.getTree().getAttributes().setLongitude(form.getLongitude());
        }
        projectRepository.save(project);
        projectKnowledgeBaseRepository.save(knowledgeBase);
        return  new ProjectResponse(project, knowledgeBase);
    }
    public ProjectKnowledgeBase createNewKnowledgeBaseForProject(Project project, String status, Long userId) {
        // create knowledge base
        ProjectKnowledgeBase knowledgeBase = new ProjectKnowledgeBase();
        knowledgeBase.setProjectId(project.getId());
        // create first node
        ProjectNodeType projectNodeType = projectUtil.getNodeTypeByLabelOrCreate("projet", userId);
        ProjectKnowledgeNode projectKnowledgeNode = new ProjectKnowledgeNode();
        projectKnowledgeNode.getAttributes()
                .setNodeType(projectNodeType.getLabel())
                .setIconName(projectNodeType.getIconName())
                .setLongitude(project.getLongitude())
                .setLatitude(project.getLatitude())
                .setWatchers(Collections.singletonList(project.getCreatorId().toString()))
                .setStatus(status == null ? "todo" : status)
                .setDescription(project.getDescription());
        projectKnowledgeNode.setName(project.getName());
        // add empty node
        ProjectNodeType projectNodeTypeNew = projectUtil.getNodeTypeByLabelOrCreate("empty", userId);
        ProjectKnowledgeNode projectKnowledgeNodeNew = new ProjectKnowledgeNode();
        projectKnowledgeNodeNew.getAttributes()
                .setNodeType("empty")
                .setIconName("empty")
                .setDescription("nouveau nœud");
        projectKnowledgeNodeNew.setName("");
        projectKnowledgeNode.appendChild(projectKnowledgeNodeNew);

        ProjectKnowledgeBaseHelper
                .of(knowledgeBase)
                .insert(projectKnowledgeNode, null);
        return knowledgeBase;
    }
    public ProjectKnowledgeBase createNewKnowledgeBaseForProject(Project project, Long userId) {
        return createNewKnowledgeBaseForProject(project, "todo", userId);
    }
    public ProjectKnowledgeBase getProjectKnowledgeBaseByProjectId(Long id, Long userId) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(id);
        if (projectUtil.hasProjectAuthority(userId, project, ACL.READ)) {// validate project belongs to user
            return projectKnowledgeBaseRepository
                    .findFirstByProjectId(project.getId())
                    .orElseThrow(() -> ApiError.PROJECT_HAS_NO_KNOWLEDGE_BASE);
        }
        throw ApiError.PROJECT_NOT_FOUND;
    }
    public ProjectListResponse listProjects(Long userId) {
        // list projects under my org
        List<Project> projects;
        Map<Long, ProjectKnowledgeBase> baseMap;
        if (OrganisationContext.getId() != null) {
            Optional<Organisation> optional = organisationRepository.findById(OrganisationContext.getId());
            List<ProjectMemberRelation> relations = memberRelationRepository.findAllById_MemberId(userId);
            if (optional.isPresent()) {
                projects = projectRepository.findAllProjectsByOrganisationId(optional.get().getId());
                baseMap = projectUtil.findProjectKnowledgeBaseByProjectIdIn(projects.stream()
                        .filter(p -> projectUtil.hasProjectAuthority(userId, p, relations))
                        .map(p -> p.getId()).collect(Collectors.toList()));
                return new ProjectListResponse(projects, baseMap, projectUtil.findProjectCreatorsByProjects(projects));
            }
        }
        // list projects without org
        projects = projectRepository.findAllUngroupedProjectsByCreatorId(userId);
        baseMap = projectUtil.findProjectKnowledgeBaseByProjectIdIn(projects.stream()
                .map(p -> p.getId()).collect(Collectors.toList()));
        return new ProjectListResponse(projects, baseMap, projectUtil.findProjectCreatorsByProjects(projects));
    }
    public Page<ProjectMemberRelation> listMemberProjects(Pageable pageable, Long userId) {
        return memberRelationRepository.findAllById_MemberId(userId, pageable);
    }
    public Page<Organisation> listOrganisations(Pageable pageable, Long userId) {
        // list organisations I created and also those I have access to
        return organisationRepository.findAllByCreatorIdOrderByIdDesc(
                userId,
                pageable);
    }
    public Page<ProjectRole> listProjectRoles(Pageable pageable) {
        return projectRoleRepository.findAll(pageable);
    }
    public Project inviteMembers(Long id, List<ProjectInvite> projectInvites, User user) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(id);
        if (project.getInvitations() == null) {
            project.setInvitations(new JsonWrapper<>(new HashSet<>()));
        }
        ProjectRole projectRole = null;
        for (ProjectInvite invite : projectInvites) {
            // create token
            String inviteToken = UUID.randomUUID().toString().replaceAll("-","");
            ProjectInvitation invitation = new ProjectInvitation();
            if (projectRole == null) {
                projectRole = projectUtil.getProjectRoleByIdOrElseThrowApiError(invite.getRoleId());
            } else if (!projectRole.getId().equals(invite.getRoleId())) {
                projectRole = projectUtil.getProjectRoleByIdOrElseThrowApiError(invite.getRoleId());
            }
            invitation.setEmail(invite.getEmail());
            invitation.setRoleId(projectRole.getId());
            invitation.setToken(inviteToken);
            try {
                // generate link
                String host = AppUtils.getServerHost().replaceFirst("http:", "https:");
                String acceptLink = host + apiBaseUrl +
                        "/public/project/" + project.getId() + "/invite/accept?token=" + inviteToken;
                String declineLink = host + apiBaseUrl +
                        "/public/project/" + project.getId() + "/invite/decline?token=" + inviteToken;
                invitation.setLink(acceptLink);
                // add invite
                project.getInvitations().getValues().remove(invitation);
                project.getInvitations().getValues().add(invitation);
                // send email
                Context ctx = new Context();
                ctx.setVariable("userName", AppUtils.getUserNameForMail(user));
                ctx.setVariable("projectName", project.getName());
                ctx.setVariable("acceptLink", acceptLink);
                ctx.setVariable("declineLink", declineLink);
                ctx.setVariable("expiresIn", invitation.getExpiresInDays() + " jours");
                ctx.setVariable("logoUrl", projectUtil.getUIHost().replaceFirst("http:", "https:") + "/logo.png");
                emailUtil.send("project-invitation", ctx, "Nouvelle invitation", new EmailAddress(invite.getEmail()));
            } catch (Exception ignored) {
                ignored.printStackTrace();
            }
        }
        return projectRepository.save(project);
    }

    public String acceptInvite(Long id, String token) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(id);
        // process invite
        ProjectInvitation invitation = processInvitation(project, token);
        Optional<User> memberOptional = userRepository.findFirstByEmail(invitation.getEmail());
        if (!memberOptional.isPresent()) {
            return projectUtil.getUIHost() + "/auth/login?status=want_sign_up" + "&next=" + invitation.getLink();
        }
        // invalidate invitation
        project.getInvitations().getValues().remove(invitation);
        // get role
        ProjectRole projectRole = projectUtil.getProjectRoleByIdOrElseThrowApiError(invitation.getRoleId());
        ProjectMemberRelation relation = new ProjectMemberRelation();
        ProjectMemberKey memberKey = new ProjectMemberKey();
        memberKey.setMemberId(memberOptional.get().getId());
        memberKey.setProjectId(project.getId());
        relation.setId(memberKey);
        relation.setProjectRoleId(projectRole.getId());
        memberRelationRepository.save(relation);
        projectRepository.save(project);
        // add user to project with role
        return  projectUtil.getUIHost() + uiProps.getProjectInviteSuccessUrl() + "?status=success";
    }

    public Page<ProjectMemberRelation> listMembers(Long id, Pageable pageable, Long userId) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(id);
        if (projectUtil.hasProjectAuthority(userId, project, ACL.WRITE)) {// validate project belongs to user
            return memberRelationRepository.findAllById_ProjectId(project.getId(), pageable);
        }
        throw ApiError.PROJECT_NOT_FOUND;
    }
    public ProjectInvitation processInvitation(Project project, String token) {
        // get the invitation
        for (ProjectInvitation invite: project.getInvitations().getValues()) {
            if (invite.getToken().equals(token)) {
                // validate if expired
                Instant expiresAt = Instant.ofEpochMilli(invite.getCreatedAt())
                        .plus(invite.getExpiresInDays(), ChronoUnit.DAYS);
                if (Instant.now().isBefore(expiresAt)) return invite;
                throw ApiError.PROJECT_INVITATION_EXPIRED;
            }
        }
        throw ApiError.PROJECT_INVITATION_NOT_FOUND;
    }

    public Map<Long, ProjectKnowledgeBase>  findProjectKnowledgeBaseByProjectIdIn(List<Long> ids) {
       return projectUtil.findProjectKnowledgeBaseByProjectIdIn(ids);
    }
    public ListResourceResponse listProjectFiles(Long projectId, Long userId) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(projectId);
        if (projectUtil.hasProjectAuthority(userId, project, ACL.READ)) {// validate project belongs to user
            // upload to s3
            StringBuilder dir = new StringBuilder();
            if (OrganisationContext.getId() != null) {
                dir.append("organisation").append("/");
                dir.append(OrganisationContext.getId()).append("/");
            }
            dir.append("projet").append("/")
                    .append(projectId).append("/");
            return projectUtil.listFiles(dir.toString());
        }
        throw ApiError.PROJECT_NOT_FOUND;
    }
}
