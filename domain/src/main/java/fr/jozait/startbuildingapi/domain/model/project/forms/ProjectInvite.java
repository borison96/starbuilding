package fr.jozait.startbuildingapi.domain.model.project.forms;

import javax.validation.constraints.NotNull;

public class ProjectInvite {
    private String email;
    @NotNull(message = "role_id_is_required")
    private Long roleId;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }
}
