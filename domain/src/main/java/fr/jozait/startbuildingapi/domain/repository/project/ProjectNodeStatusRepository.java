package fr.jozait.startbuildingapi.domain.repository.project;

import fr.jozait.startbuildingapi.domain.model.project.node.ProjectNodeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProjectNodeStatusRepository extends JpaRepository<ProjectNodeStatus, Long> {
    Optional<ProjectNodeStatus> findFirstByLabelIgnoreCase(String name);
    @Query(value = "select * from project_node_status left outer join projects_project_node_status on project_node_status.id = projects_project_node_status.status_id where projects_project_node_status.project_id = ?2 or project_node_status.creator_id = ?1 or project_node_status.creator_id is null;", nativeQuery = true)
    List<ProjectNodeStatus> findAllApplicableToProject(Long userId, Long projectId);
}
