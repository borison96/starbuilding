package fr.jozait.startbuildingapi.service.project;

import fr.jozait.startbuildingapi.domain.model.project.Project;
import fr.jozait.startbuildingapi.domain.model.project.node.DataTable;
import fr.jozait.startbuildingapi.domain.model.project.node.ProjectNodeDataTable;
import fr.jozait.startbuildingapi.domain.repository.project.ProjectNodeDataTableRepository;
import fr.jozait.startbuildingapi.exception.ApiError;
import fr.jozait.startbuildingapi.precondition.Precondition;
import fr.jozait.startbuildingapi.util.ACL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class ProjectNodeDataTableService {
    private ProjectNodeDataTableRepository projectNodeDataTableRepository;
    private ProjectUtil projectUtil;

    @Autowired
    public void setProjectNodeDataTableRepository(ProjectNodeDataTableRepository projectNodeDataTableRepository) {
        this.projectNodeDataTableRepository = projectNodeDataTableRepository;
    }

    @Autowired
    public void setProjectUtil(ProjectUtil projectUtil) {
        this.projectUtil = projectUtil;
    }

    public ProjectNodeDataTable createTable(String nodeId, Long projectId, Long userId) {
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(projectId);
        Precondition.checkValue(
                projectUtil.hasProjectAuthority(userId, project, ACL.WRITE),
                ApiError.PROJECT_NOT_FOUND
        );
        return projectNodeDataTableRepository.save(new ProjectNodeDataTable(nodeId));
    }
    public ProjectNodeDataTable addColumn(String colName, String colType, String nodeId, Long projectId, Long userId) {
        checkPreconditions(projectId, userId, colName, colType, nodeId);
        ProjectNodeDataTable  dataTable = findDataTableByNodeId(nodeId);
        String safeName = DataTable.safeColumnName(colName, dataTable.getDataTable().getColumns());
        dataTable.getDataTable().getColumns()
                .put(Instant.now().toEpochMilli(),
                        new String[]{safeName, colType, String.valueOf(Instant.now().toEpochMilli())});
        return projectNodeDataTableRepository.save(dataTable);
    }
    public ProjectNodeDataTable updateColumn(Long colId, String colName, String colType, String nodeId, Long projectId, Long userId) {
        checkPreconditions(projectId, userId, colId, colName, colType, nodeId);
        ProjectNodeDataTable  dataTable = findDataTableByNodeId(nodeId);
        Map<Long, String[]> columns = dataTable.getDataTable().getColumns();
        String safeName = DataTable.safeColumnName(colName, columns);
        String order = String.valueOf(Instant.now().toEpochMilli());
        if (columns.get(colId).length > 2) {
            order = columns.get(colId)[2];
        }
        columns.put(colId, new String[]{safeName, colType, order});
        return projectNodeDataTableRepository.save(dataTable);
    }
    public ProjectNodeDataTable addRow(String colName, String nodeId, Long projectId, Long userId) {
        checkPreconditions(projectId, userId, colName, nodeId);
        ProjectNodeDataTable  dataTable = findDataTableByNodeId(nodeId);
        dataTable.getDataTable().getRows().put(Instant.now().toEpochMilli(), Collections.EMPTY_MAP);
        return projectNodeDataTableRepository.save(dataTable);
    }
    public ProjectNodeDataTable updateCell(Long rowId, Long colId, String value, String nodeId, Long projectId, Long userId) {
        checkPreconditions(projectId, userId, rowId, colId, nodeId);
        ProjectNodeDataTable  dataTable = findDataTableByNodeId(nodeId);
        dataTable.getDataTable().getRows().get(rowId).put(colId, value);
        return projectNodeDataTableRepository.save(dataTable);
    }
    public ProjectNodeDataTable deleteColumn(Long colId, String nodeId, Long projectId, Long userId) {
        checkPreconditions(projectId, userId, colId, nodeId);
        ProjectNodeDataTable  dataTable = findDataTableByNodeId(nodeId);
        Map<Long, String[]> columns = dataTable.getDataTable().getColumns();
        String[] values = columns.get(colId);
        columns.put(colId, new String[]{values[0], values[1], values[2], "deleted"});
        return projectNodeDataTableRepository.save(dataTable);
    }
    public ProjectNodeDataTable deleteRow(Long rowId, String nodeId, Long projectId, Long userId) {
        checkPreconditions(projectId, userId, rowId, nodeId);
        ProjectNodeDataTable  dataTable = findDataTableByNodeId(nodeId);
        dataTable.getDataTable().getRows().get(rowId).put(0L, "deleted");
        return projectNodeDataTableRepository.save(dataTable);
    }
    public void checkPreconditions(Long projectId, Long userId, Object... extras) {
        Precondition.checkValue(Arrays.stream(extras).noneMatch(Objects::isNull), ApiError.BAD_REQUEST_DATA);
        Project project = projectUtil.getProjectByIdOrElseThrowApiError(projectId);
        Precondition.checkValue(
                projectUtil.hasProjectAuthority(userId, project, ACL.WRITE),
                ApiError.PROJECT_NOT_FOUND
        );
    }
    public ProjectNodeDataTable findDataTableByNodeId(String nodeId) {
        return projectNodeDataTableRepository.findById(nodeId)
                .orElseThrow(() -> ApiError.PROJECT_NODE_DATATABLE_NOT_FOUND);
    }
}
