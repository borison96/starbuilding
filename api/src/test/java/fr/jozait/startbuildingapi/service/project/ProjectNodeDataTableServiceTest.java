package fr.jozait.startbuildingapi.service.project;

import fr.jozait.startbuildingapi.domain.model.project.node.DataTable;
import fr.jozait.startbuildingapi.domain.model.project.node.ProjectNodeDataTable;
import fr.jozait.startbuildingapi.domain.repository.project.ProjectNodeDataTableRepository;
import fr.jozait.startbuildingapi.util.ACL;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
public class ProjectNodeDataTableServiceTest {
    @Mock
    private ProjectUtil projectUtil;
    @Mock
    private ProjectNodeDataTableRepository projectNodeDataTableRepository;
    @InjectMocks
    private ProjectNodeDataTableService projectNodeDataTableService;
    @Test
    public void givenUserHasAuthority_whenCreateTable_thenCreateAndReturnTable() {
        when(projectUtil.hasProjectAuthority(anyLong(), any(), eq(ACL.WRITE))).thenReturn(true);
        when(projectNodeDataTableRepository.save(any())).thenAnswer(val -> val.getArgument(0));
        ProjectNodeDataTable dataTable = projectNodeDataTableService.createTable("nodeId", 1L, 1L);
        assertEquals(dataTable.getId(), "nodeId");
    }
    @Test
    public void givenAnyColName_whenColName_thenReturnSafeColName() {
        Map<Long, String[]> nameMap = new HashMap<>();
        nameMap.put(1L, new String[]{"name", "type"});
        String safeName = DataTable.safeColumnName("name", nameMap);
        assertEquals("name_1", safeName);
    }
    @Test
    public void givenAnyColName_whenColNames_thenReturnSafeColName() {
        Map<Long, String[]> nameMap = new HashMap<>();
        nameMap.put(1L, new String[]{"name", "type"});
        nameMap.put(2L, new String[]{"name_3", "type"});
        String safeName = DataTable.safeColumnName("name", nameMap);
        assertEquals("name_4", safeName);
    }
    @Test
    public void givenAnyColName_whenNoColName_thenReturnSafeColName() {
        Map<Long, String[]> nameMap = new HashMap<>();
        String safeName = DataTable.safeColumnName("name", nameMap);
        assertEquals("name", safeName);

        Map<Long, String[]> nameMap2 = new HashMap<>();
        nameMap2.put(1L, new String[]{"big name", "type"});
        String safeName2 = DataTable.safeColumnName("name", nameMap2);
        assertEquals("name", safeName2);
    }
}
