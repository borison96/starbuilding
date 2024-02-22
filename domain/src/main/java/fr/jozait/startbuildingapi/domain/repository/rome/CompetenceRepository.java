package fr.jozait.startbuildingapi.domain.repository.rome;

import fr.jozait.startbuildingapi.domain.model.rome.Competence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompetenceRepository extends JpaRepository<Competence, Long> {
}
