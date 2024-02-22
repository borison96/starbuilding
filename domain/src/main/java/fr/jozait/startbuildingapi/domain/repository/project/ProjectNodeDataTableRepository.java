package fr.jozait.startbuildingapi.domain.repository.project;

import fr.jozait.startbuildingapi.domain.model.project.node.ProjectNodeDataTable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectNodeDataTableRepository extends JpaRepository<ProjectNodeDataTable, String> {
}
