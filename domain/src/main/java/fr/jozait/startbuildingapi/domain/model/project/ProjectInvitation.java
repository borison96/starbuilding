package fr.jozait.startbuildingapi.domain.model.project;

import java.time.Instant;
import java.util.Objects;

public class ProjectInvitation {
    protected String token;
    protected Long roleId;
    protected Long createdAt = Instant.now().toEpochMilli();
    protected Long expiresInDays = 7L;
    protected String email;
    protected String link;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public Long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }

    public Long getExpiresInDays() {
        return expiresInDays;
    }

    public void setExpiresInDays(Long expiresInDays) {
        this.expiresInDays = expiresInDays;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProjectInvitation that = (ProjectInvitation) o;
        return Objects.equals(email, that.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(email);
    }
}
