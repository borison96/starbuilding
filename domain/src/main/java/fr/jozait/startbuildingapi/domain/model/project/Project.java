package fr.jozait.startbuildingapi.domain.model.project;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.jozait.startbuildingapi.domain.model.BaseEntityWithAudit;
import fr.jozait.startbuildingapi.domain.model.JsonWrapper;
import fr.jozait.startbuildingapi.domain.model.project.node.ProjectNodeStatus;
import fr.jozait.startbuildingapi.domain.model.project.node.ProjectNodeType;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.*;

@Entity
@JsonIgnoreProperties({"createdAt", "updatedAt", "version", "members", "organisations", "projectNodeTypes", "projectNodeStatuses"})
public class Project extends BaseEntityWithAudit {
    private Long creatorId;
    @ManyToMany
    @JoinTable(
            name = "projects_project_node_type",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "type_id")
    )
    private List<ProjectNodeType> projectNodeTypes = new ArrayList<>();
    @ManyToMany
    @JoinTable(
            name = "projects_project_node_status",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "status_id")
    )
    private List<ProjectNodeStatus> projectNodeStatuses = new ArrayList<>();
    private Long parentId;
    private String name;
    private String code;
    private String description;
    private String picture;
    private Double longitude;
    private Double latitude;
    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb")
    private JsonWrapper<Set<ProjectInvitation>> invitations = new JsonWrapper<>(new HashSet<>());

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public JsonWrapper<Set<ProjectInvitation>> getInvitations() {
        return invitations;
    }

    public void setInvitations(JsonWrapper<Set<ProjectInvitation>> invitations) {
        this.invitations = invitations;
    }

    public List<ProjectNodeType> getProjectNodeTypes() {
        return projectNodeTypes;
    }

    public void setProjectNodeTypes(List<ProjectNodeType> projectNodeTypes) {
        this.projectNodeTypes = projectNodeTypes;
    }

    public List<ProjectNodeStatus> getProjectNodeStatuses() {
        return projectNodeStatuses;
    }

    public void setProjectNodeStatuses(List<ProjectNodeStatus> projectNodeStatuses) {
        this.projectNodeStatuses = projectNodeStatuses;
    }
}
