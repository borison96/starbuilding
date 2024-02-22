package fr.jozait.startbuildingapi.domain.model.org;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.jozait.startbuildingapi.domain.model.project.ProjectInvitation;
import fr.jozait.startbuildingapi.domain.model.user.User;

import java.util.Objects;
@JsonIgnoreProperties({"email"})
public class OrgJoinRequest extends ProjectInvitation {
    protected Long userId;
    protected User user;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        OrgJoinRequest that = (OrgJoinRequest) o;
        return userId.equals(that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), userId);
    }
}
