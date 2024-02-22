package fr.jozait.startbuildingapi.domain.repository.rome;

import fr.jozait.startbuildingapi.domain.model.rome.Profession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProfessionRepository extends JpaRepository<Profession, Long> {
    Page<Profession> findAllByCodeRomeContaining(String codeRome, Pageable pageable);
    @Query(value = "SELECT p FROM Profession p WHERE " +
            "UPPER(p.appellation) LIKE UPPER(concat('%', ?1,'%')) OR " +
            "UPPER(p.codeOgr) LIKE UPPER(concat('%', ?1,'%')) OR " +
            "UPPER(p.codeRome) LIKE UPPER(concat('%', ?1,'%'))")
    Page<Profession> findAllByAttributeContaining(String like, Pageable pageable);
}
