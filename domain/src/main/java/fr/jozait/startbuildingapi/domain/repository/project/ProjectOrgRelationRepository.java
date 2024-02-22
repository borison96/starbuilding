package fr.jozait.startbuildingapi.domain.repository.project;

import fr.jozait.startbuildingapi.domain.model.project.ProjectOrgKey;
import fr.jozait.startbuildingapi.domain.model.project.ProjectOrgRelation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectOrgRelationRepository extends JpaRepository<ProjectOrgRelation, ProjectOrgKey> {
}
