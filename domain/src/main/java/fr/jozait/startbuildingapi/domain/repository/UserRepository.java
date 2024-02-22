package fr.jozait.startbuildingapi.domain.repository;

import fr.jozait.startbuildingapi.domain.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findFirstByEmail(String email);
    Optional<User> findFirstByPhone(String phone);
}
