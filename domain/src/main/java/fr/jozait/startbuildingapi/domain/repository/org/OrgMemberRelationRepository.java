package fr.jozait.startbuildingapi.domain.repository.org;

import fr.jozait.startbuildingapi.domain.model.org.OrgMemberKey;
import fr.jozait.startbuildingapi.domain.model.org.OrgMemberRelation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrgMemberRelationRepository extends JpaRepository<OrgMemberRelation, OrgMemberKey> {
    Page<OrgMemberRelation> findAllById_MemberId(Long id, Pageable pageable);
    Page<OrgMemberRelation> findAllById_OrgId(Long id, Pageable pageable);
}
