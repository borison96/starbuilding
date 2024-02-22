package fr.jozait.startbuildingapi.domain.model.org;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;

@Entity
public class OrgMemberRelation {
    @EmbeddedId
    private OrgMemberKey id;
    private Long orgRoleId;

    public OrgMemberKey getId() {
        return id;
    }

    public void setId(OrgMemberKey id) {
        this.id = id;
    }

    public Long getOrgRoleId() {
        return orgRoleId;
    }

    public void setOrgRoleId(Long orgRoleId) {
        this.orgRoleId = orgRoleId;
    }
}
