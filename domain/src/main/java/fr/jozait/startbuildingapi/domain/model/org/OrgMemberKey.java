package fr.jozait.startbuildingapi.domain.model.org;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class OrgMemberKey implements Serializable {
    @Column(name = "org_id")
    private Long orgId;
    @Column(name = "member_id")
    private Long memberId;

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrgMemberKey that = (OrgMemberKey) o;
        return orgId.equals(that.orgId) && memberId.equals(that.memberId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orgId, memberId);
    }
}
