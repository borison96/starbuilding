package fr.jozait.startbuildingapi.service.project;


import fr.jozait.startbuildingapi.domain.model.org.Organisation;
import fr.jozait.startbuildingapi.domain.model.org.OrganisationContext;
import fr.jozait.startbuildingapi.domain.model.project.Project;
import fr.jozait.startbuildingapi.domain.model.project.ProjectKnowledgeBase;
import fr.jozait.startbuildingapi.domain.repository.UserRepository;
import fr.jozait.startbuildingapi.domain.repository.project.ProjectMemberRelationRepository;
import fr.jozait.startbuildingapi.domain.response.project.ProjectListResponse;
import fr.jozait.startbuildingapi.domain.model.user.User;
import fr.jozait.startbuildingapi.domain.repository.org.OrganisationRepository;
import fr.jozait.startbuildingapi.domain.repository.project.ProjectKnowledgeBaseRepository;
import fr.jozait.startbuildingapi.domain.repository.project.ProjectNodeTypeRepository;
import fr.jozait.startbuildingapi.domain.repository.project.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private ProjectNodeTypeRepository projectNodeTypeRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ProjectKnowledgeBaseRepository projectKnowledgeBaseRepository;
    @Mock
    private OrganisationRepository organisationRepository;
    @Mock
    private ProjectMemberRelationRepository memberRelationRepository;
    @Mock
    private ProjectUtil projectUtil;
    @InjectMocks
    private ProjectService projectService;
    private User testUser;
    @BeforeEach
    void setup() {
        testUser = new User();
        testUser.setEmail("nouks@joza-it.fr");
        testUser.setPhone("12345678");
        testUser.setFirstName("nouks");
        testUser.setLastName("joza");
        testUser.setId(1L);
    }
    @Test
    void givenProjectIds_WhenBulkLoadKnowledgeTree_ThenCallRepository() {
        List<Long> ids = new ArrayList<>();
        projectService.findProjectKnowledgeBaseByProjectIdIn(ids);
        verify(projectUtil, times(1)).findProjectKnowledgeBaseByProjectIdIn(ids);
    }
    @Test
    void givenCallToListProjects_WhenOrganisationSelected_ThenCallOrgRepository() {
        OrganisationContext.setId(1L);
        Organisation organisation = new Organisation();
        organisation.setId(1L);
        when(organisationRepository.findById(anyLong())).thenReturn(Optional.of(organisation));
        projectService.listProjects(testUser.getId());
        verify(organisationRepository, times(1)).findById(OrganisationContext.getId());
        verify(projectRepository, times(0)).findAllUngroupedProjectsByCreatorId(testUser.getId());
    }
    @Test
    void givenCallToListProjects_WhenOrganisationNotSelected_ThenCallProjectRepository() {
        OrganisationContext.setId(null);
        projectService.listProjects(testUser.getId());
        verify(organisationRepository, times(0)).findById(OrganisationContext.getId());
        verify(projectRepository, times(1)).findAllUngroupedProjectsByCreatorId(testUser.getId());
    }
    @Test
    void givenCallToListProjects_WhenOrganisationSelected_ThenReturnProjectsAndKnowledgeBases() {
        ProjectKnowledgeBase pb = new ProjectKnowledgeBase();
        pb.setProjectId(1L);
        Project pr1 = new Project();
        pr1.setId(1L);
        ProjectKnowledgeBase pb2 = new ProjectKnowledgeBase();
        pb2.setProjectId(2L);
        Project pr2 = new Project();
        pr2.setId(2L);
        OrganisationContext.setId(1L);
        Organisation organisation = new Organisation();
        organisation.setId(1L);
        when(organisationRepository.findById(anyLong())).thenReturn(Optional.of(organisation));
        when(projectRepository.findAllProjectsByOrganisationId(OrganisationContext.getId())).thenReturn(Arrays.asList(pr1, pr2));
        when(projectUtil.hasProjectAuthority(anyLong(), any(), anyList())).thenReturn(true);
        Map<Long, ProjectKnowledgeBase> baseMap = new HashMap<>();
        baseMap.put(1L, pb);
        baseMap.put(2L, pb2);
        when(projectUtil.findProjectKnowledgeBaseByProjectIdIn(anyList())).thenReturn(baseMap);
        ProjectListResponse listResponse = projectService.listProjects(testUser.getId());
        assertEquals(listResponse.getKnowledgeBaseMap().get(1L), pb);
        assertEquals(listResponse.getKnowledgeBaseMap().get(2L), pb2);
        assertTrue(listResponse.getProjects().contains(pr1));
        assertTrue(listResponse.getProjects().contains(pr2));
    }
    @Test
    void givenCallToListProjects_WhenOrganisationNotSelected_ThenReturnProjectsAndKnowledgeBases() {
        ProjectKnowledgeBase pb = new ProjectKnowledgeBase();
        pb.setProjectId(1L);
        Project pr1 = new Project();
        pr1.setId(1L);
        ProjectKnowledgeBase pb2 = new ProjectKnowledgeBase();
        pb2.setProjectId(2L);
        Project pr2 = new Project();
        pr2.setId(2L);
        OrganisationContext.setId(null);
        when(projectRepository.findAllUngroupedProjectsByCreatorId(testUser.getId())).thenReturn(Arrays.asList(pr1, pr2));
        Map<Long, ProjectKnowledgeBase> baseMap = new HashMap<>();
        baseMap.put(1L, pb);
        baseMap.put(2L, pb2);
        when(projectUtil.findProjectKnowledgeBaseByProjectIdIn(anyList())).thenReturn(baseMap);
        ProjectListResponse listResponse = projectService.listProjects(testUser.getId());
        assertEquals(listResponse.getKnowledgeBaseMap().get(1L), pb);
        assertEquals(listResponse.getKnowledgeBaseMap().get(2L), pb2);
        assertTrue(listResponse.getProjects().contains(pr1));
        assertTrue(listResponse.getProjects().contains(pr2));
    }

}