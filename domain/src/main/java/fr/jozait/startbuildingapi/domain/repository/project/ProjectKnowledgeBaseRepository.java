package fr.jozait.startbuildingapi.domain.repository.project;

import fr.jozait.startbuildingapi.domain.model.project.ProjectKnowledgeBase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectKnowledgeBaseRepository extends JpaRepository<ProjectKnowledgeBase, Long> {
    Optional<ProjectKnowledgeBase> findFirstByProjectId(Long id);
    List<ProjectKnowledgeBase> findAllByProjectIdIn(List<Long> ids);
}
