package fr.jozait.startbuildingapi.domain.repository.org;

import fr.jozait.startbuildingapi.domain.model.org.Organisation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrganisationRepository extends JpaRepository<Organisation, Long> {
    Page<Organisation> findAllByCreatorIdOrderByIdDesc(Long creatorId, Pageable pageable);
    @Query(value = "SELECT o FROM Organisation o WHERE " +
            "UPPER(o.name) LIKE UPPER(concat('%', ?1,'%')) OR " +
            "UPPER(o.code) LIKE UPPER(concat('%', ?1,'%')) OR " +
            "UPPER(o.address) LIKE UPPER(concat('%', ?1,'%')) OR " +
            "UPPER(o.corporateName) LIKE UPPER(concat('%', ?1,'%')) OR " +
            "UPPER(o.sector) LIKE UPPER(concat('%', ?1,'%')) OR " +
            "UPPER(o.legalStructure) LIKE UPPER(concat('%', ?1,'%')) OR " +
            "UPPER(o.postalCode) LIKE UPPER(concat('%', ?1,'%')) OR " +
            "UPPER(o.town) LIKE UPPER(concat('%', ?1,'%')) OR " +
            "UPPER(o.region) LIKE UPPER(concat('%', ?1,'%')) OR " +
            "UPPER(o.country) LIKE UPPER(concat('%', ?1,'%'))")
    Page<Organisation> searchAttributesLike(String like, Pageable pageable);
}
