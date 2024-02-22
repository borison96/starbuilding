package fr.jozait.startbuildingapi.domain.repository.org;

import fr.jozait.startbuildingapi.domain.model.org.OrgRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrgRoleRepository extends JpaRepository<OrgRole, Long> {
    Optional<OrgRole> findFirstByNameIgnoreCase(String n);
}
