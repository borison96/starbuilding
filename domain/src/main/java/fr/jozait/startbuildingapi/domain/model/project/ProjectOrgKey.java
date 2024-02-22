package fr.jozait.startbuildingapi.domain.model.project;

import javax.persistence.Column;
import java.io.Serializable;

public class ProjectOrgKey implements Serializable {
    @Column(name = "organisation_id")
    private Long organisationId;
    @Column(name = "project_id")
    private Long projectId;

    public Long getOrganisationId() {
        return organisationId;
    }

    public void setOrganisationId(Long organisationId) {
        this.organisationId = organisationId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}
