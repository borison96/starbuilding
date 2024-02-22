package fr.jozait.startbuildingapi.domain.repository.project;

import fr.jozait.startbuildingapi.domain.model.project.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByIdAndCreatorId(Long id, Long creatorId);
    @Query(value = "select * from project left outer join organisation_projects on project.id = organisation_projects.project_id where project.creator_id = ?1 and organisation_projects.organisation_id is null;", nativeQuery = true)
    List<Project> findAllUngroupedProjectsByCreatorId(Long id);
    @Query(value = "select * from organisation_projects right outer join project on project.id = organisation_projects.project_id  where organisation_projects.organisation_id = ?1 and organisation_projects.project_id is not null;", nativeQuery = true)
    List<Project> findAllProjectsByOrganisationId(Long id);
    Page<Project> findAllByCreatorIdOrderByIdDesc(Long creatorId, Pageable pageable);
}
