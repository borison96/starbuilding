package fr.jozait.startbuildingapi.domain.response.org;

import fr.jozait.startbuildingapi.domain.model.org.OrgMemberRelation;
import fr.jozait.startbuildingapi.domain.model.org.OrgRole;
import fr.jozait.startbuildingapi.domain.model.user.User;
import org.springframework.data.domain.Page;

import java.util.List;

public class OrgMemberListResponse {
    private List<User> members;
    private List<OrgMemberRelation> memberRoleRelations;
    private List<OrgRole> roles;
    private Page<OrgMemberRelation> pageInfo;

    public List<User> getMembers() {
        return members;
    }

    public void setMembers(List<User> members) {
        this.members = members;
    }

    public List<OrgMemberRelation> getMemberRoleRelations() {
        return memberRoleRelations;
    }

    public void setMemberRoleRelations(List<OrgMemberRelation> memberRoleRelations) {
        this.memberRoleRelations = memberRoleRelations;
    }

    public List<OrgRole> getRoles() {
        return roles;
    }

    public void setRoles(List<OrgRole> roles) {
        this.roles = roles;
    }

    public Page<OrgMemberRelation> getPageInfo() {
        return pageInfo;
    }

    public void setPageInfo(Page<OrgMemberRelation> pageInfo) {
        this.pageInfo = pageInfo;
    }
}
