package fr.jozait.startbuildingapi.domain.repository.project;

import fr.jozait.startbuildingapi.domain.model.project.ProjectMemberKey;
import fr.jozait.startbuildingapi.domain.model.project.ProjectMemberRelation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectMemberRelationRepository extends JpaRepository<ProjectMemberRelation, ProjectMemberKey> {
    Page<ProjectMemberRelation> findAllById_ProjectId(Long id, Pageable pageable);
    Page<ProjectMemberRelation> findAllById_MemberId(Long id, Pageable pageable);
    List<ProjectMemberRelation> findAllById_MemberId(Long id);
    List<ProjectMemberRelation> findAllById_ProjectIdIn(List<Long> ids);
}
