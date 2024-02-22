package fr.jozait.startbuildingapi.domain.repository;

import fr.jozait.startbuildingapi.domain.model.user.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
}
