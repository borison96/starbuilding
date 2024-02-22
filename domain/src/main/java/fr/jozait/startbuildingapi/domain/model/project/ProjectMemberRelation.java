package fr.jozait.startbuildingapi.domain.model.project;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.jozait.startbuildingapi.domain.model.user.User;

import javax.persistence.*;

@Entity
@JsonIgnoreProperties({"id"})
public class ProjectMemberRelation {
    @EmbeddedId
    private ProjectMemberKey id;
    private Long projectRoleId;

    public ProjectMemberKey getId() {
        return id;
    }

    public void setId(ProjectMemberKey id) {
        this.id = id;
    }

    public Long getProjectRoleId() {
        return projectRoleId;
    }

    public void setProjectRoleId(Long projectRoleId) {
        this.projectRoleId = projectRoleId;
    }
}
