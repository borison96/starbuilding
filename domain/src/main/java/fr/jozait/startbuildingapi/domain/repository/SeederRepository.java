package fr.jozait.startbuildingapi.domain.repository;

import fr.jozait.startbuildingapi.domain.model.seed.Seeder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SeederRepository extends JpaRepository<Seeder, Long> {
    Optional<Seeder> findFirstByTableNameAndStatus(String tableName, Boolean status);
}
