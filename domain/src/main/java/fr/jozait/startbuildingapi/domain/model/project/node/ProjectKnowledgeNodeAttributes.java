package fr.jozait.startbuildingapi.domain.model.project.node;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.jozait.startbuildingapi.domain.model.project.ProjectKnowledgeSection;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectKnowledgeNodeAttributes {
    private String id = UUID.randomUUID().toString().replaceAll("-", "");
    private String description;
    private String nodeType;
    private String iconName;
    private String status;
    private Long durationInSeconds;
    private Double longitude;
    private Double latitude;
    private Long startsAt;
    private Long endsAt;
    private String data;
    private List<String> assignees = new ArrayList<>();
    private List<String> watchers = new ArrayList<>();
    private String reporter;

    private List<ProjectKnowledgeSection> sections = new ArrayList<>();
    private List<ProjectKnowledgeNodeDocument> documents = new ArrayList<>();

    public String getId() {
        return id;
    }

    public ProjectKnowledgeNodeAttributes setId(String id) {
        this.id = id;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public ProjectKnowledgeNodeAttributes setDescription(String description) {
        this.description = description;
        return this;
    }

    public String getNodeType() {
        return nodeType;
    }

    public ProjectKnowledgeNodeAttributes setNodeType(String nodeType) {
        this.nodeType = nodeType;
        return this;
    }

    public String getIconName() {
        return iconName;
    }

    public ProjectKnowledgeNodeAttributes setIconName(String iconName) {
        this.iconName = iconName;
        return this;
    }

    public String getStatus() {
        return status;
    }

    public ProjectKnowledgeNodeAttributes setStatus(String status) {
        this.status = status;
        return this;
    }

    public Long getDurationInSeconds() {
        return durationInSeconds;
    }

    public ProjectKnowledgeNodeAttributes setDurationInSeconds(Long durationInSeconds) {
        this.durationInSeconds = durationInSeconds;
        return this;
    }

    public Double getLongitude() {
        return longitude;
    }

    public ProjectKnowledgeNodeAttributes setLongitude(Double longitude) {
        this.longitude = longitude;
        return this;
    }

    public Double getLatitude() {
        return latitude;
    }

    public ProjectKnowledgeNodeAttributes setLatitude(Double latitude) {
        this.latitude = latitude;
        return this;
    }

    public Long getStartsAt() {
        return startsAt;
    }

    public ProjectKnowledgeNodeAttributes setStartsAt(Long startsAt) {
        this.startsAt = startsAt;
        return this;
    }

    public String getData() {
        return data;
    }

    public ProjectKnowledgeNodeAttributes setData(String data) {
        this.data = data;
        return this;
    }

    public List<String> getAssignees() {
        return assignees;
    }

    public ProjectKnowledgeNodeAttributes setAssignees(List<String> assignees) {
        this.assignees = assignees;
        return this;
    }

    public List<String> getWatchers() {
        return watchers;
    }

    public ProjectKnowledgeNodeAttributes setWatchers(List<String> watchers) {
        this.watchers = watchers;
        return this;
    }

    public String getReporter() {
        return reporter;
    }

    public ProjectKnowledgeNodeAttributes setReporter(String reporter) {
        this.reporter = reporter;
        return  this;
    }

    public Long getEndsAt() {
        return endsAt;
    }

    public ProjectKnowledgeNodeAttributes setEndsAt(Long endsAt) {
        this.endsAt = endsAt;
        return this;
    }

    public List<ProjectKnowledgeSection> getSections() {
        return sections;
    }

    public ProjectKnowledgeNodeAttributes setSections(List<ProjectKnowledgeSection> sections) {
        this.sections = sections;
        return this;
    }

    public List<ProjectKnowledgeNodeDocument> getDocuments() {
        return documents;
    }

    public ProjectKnowledgeNodeAttributes setDocuments(List<ProjectKnowledgeNodeDocument> documents) {
        this.documents = documents;
        return this;
    }
}
