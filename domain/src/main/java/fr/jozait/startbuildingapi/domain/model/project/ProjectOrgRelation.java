package fr.jozait.startbuildingapi.domain.model.project;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "organisation_projects")
public class ProjectOrgRelation {
    @EmbeddedId
    private ProjectOrgKey id;

    public ProjectOrgKey getId() {
        return id;
    }

    public void setId(ProjectOrgKey id) {
        this.id = id;
    }
}
