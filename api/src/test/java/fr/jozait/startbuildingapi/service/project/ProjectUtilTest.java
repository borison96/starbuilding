package fr.jozait.startbuildingapi.service.project;

import fr.jozait.startbuildingapi.domain.model.project.ProjectKnowledgeBase;
import fr.jozait.startbuildingapi.domain.repository.project.ProjectKnowledgeBaseRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProjectUtilTest {
    @Mock
    private ProjectKnowledgeBaseRepository projectKnowledgeBaseRepository;
    @InjectMocks
    private ProjectUtil projectUtil;
    @Test
    void givenProjectIds_WhenBulkLoadKnowledgeTree_ThenReturnMap() {
        ProjectKnowledgeBase pb = new ProjectKnowledgeBase();
        pb.setProjectId(1L);
        ProjectKnowledgeBase pb2 = new ProjectKnowledgeBase();
        pb2.setProjectId(2L);
        List<Long> ids = Arrays.asList(1L, 2L);
        when(projectKnowledgeBaseRepository.findAllByProjectIdIn(ids)).thenReturn(Arrays.asList(pb, pb2));
        Map<Long, ProjectKnowledgeBase> baseMap = projectUtil.findProjectKnowledgeBaseByProjectIdIn(ids);
        assertEquals(baseMap.get(1L), pb);
        assertEquals(baseMap.get(2L), pb2);
    }
}
