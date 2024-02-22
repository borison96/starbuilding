package fr.jozait.startbuildingapi.domain.repository.project;

import fr.jozait.startbuildingapi.domain.model.project.node.ProjectNodeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProjectNodeTypeRepository extends JpaRepository<ProjectNodeType, Long> {
    Optional<ProjectNodeType> findFirstByLabelIgnoreCase(String name);
    @Query(value = "select * from project_node_type left outer join projects_project_node_type on project_node_type.id = projects_project_node_type.type_id where projects_project_node_type.project_id = ?2 or project_node_type.creator_id = ?1 or project_node_type.creator_id is null;", nativeQuery = true)
    List<ProjectNodeType> findAllApplicableToProject(Long userId, Long projectId);
}
