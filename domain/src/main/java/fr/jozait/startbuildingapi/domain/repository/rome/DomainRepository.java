package fr.jozait.startbuildingapi.domain.repository.rome;

import fr.jozait.startbuildingapi.domain.model.rome.Domaine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DomainRepository extends JpaRepository<Domaine, Long> {
}
