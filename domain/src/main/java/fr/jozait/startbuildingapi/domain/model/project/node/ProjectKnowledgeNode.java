package fr.jozait.startbuildingapi.domain.model.project.node;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectKnowledgeNode {
    private String name;
    private ProjectKnowledgeNodeAttributes attributes = new ProjectKnowledgeNodeAttributes();
    private List<ProjectKnowledgeNode> children = new ArrayList<>();
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ProjectKnowledgeNode> getChildren() {
        children.sort((a, b) -> {
            if (Objects.nonNull(a.getAttributes()) && Objects.nonNull(a.getAttributes().getNodeType()) && a.getAttributes().getNodeType().equals("empty")) return 1;
            if (Objects.nonNull(b.getAttributes()) && Objects.nonNull(b.getAttributes().getNodeType()) && b.getAttributes().getNodeType().equals("empty")) return -1;
            return 0;
        });
        return children;
    }

    public void setChildren(List<ProjectKnowledgeNode> children) {
        this.children = children;
    }
    public ProjectKnowledgeNode appendChild(ProjectKnowledgeNode child) {
        if (this.children == null){ this.children = new ArrayList<>();}
        if (this.equals(child)) { throw new  IllegalArgumentException("Cyclic reference detected"); }
        this.children.add(child);
        return this;
    }
    public ProjectKnowledgeNode removeChild(ProjectKnowledgeNode child) {
        if (this.children != null) {
            this.children.remove(child);
        }
        return this;
    }
    public ProjectKnowledgeNodeAttributes getAttributes() {
        return attributes;
    }
    public void setAttributes(ProjectKnowledgeNodeAttributes attributes) {
        this.attributes = attributes;
    }

    public ProjectKnowledgeNode update(ProjectKnowledgeNode child) {
        if (child.getName() != null && !child.getName().isEmpty()) {
            this.setName(child.getName());
        }
        if (child.getAttributes().getDescription() != null && !child.getAttributes().getDescription().isEmpty()) {
            this.getAttributes().setDescription(child.getAttributes().getDescription());
        }
        if (child.getAttributes().getData() != null && !child.getAttributes().getData().isEmpty()) {
            this.getAttributes().setData(child.getAttributes().getData());
        }
        if (child.getAttributes().getData() != null && !child.getAttributes().getData().isEmpty()) {
            this.getAttributes().setData(child.getAttributes().getData());
        }
        if (child.getAttributes().getNodeType() != null && !child.getAttributes().getNodeType().isEmpty()) {
            this.getAttributes().setNodeType(child.getAttributes().getNodeType());
        }
        if (child.getAttributes().getDurationInSeconds() != null) {
            this.getAttributes().setDurationInSeconds(child.getAttributes().getDurationInSeconds());
        }
        if (child.getAttributes().getIconName() != null && !child.getAttributes().getIconName().isEmpty()) {
            this.getAttributes().setIconName(child.getAttributes().getIconName());
        }
        if (child.getAttributes().getLatitude() != null && !child.getAttributes().getLatitude().equals(0.0)) {
            this.getAttributes().setLatitude(child.getAttributes().getLatitude());
        }
        if (child.getAttributes().getLongitude() != null && !child.getAttributes().getLongitude().equals(0.0)) {
            this.getAttributes().setLongitude(child.getAttributes().getLongitude());
        }
        if (child.getAttributes().getStartsAt() != null && !child.getAttributes().getStartsAt().equals(0L)) {
            this.getAttributes().setStartsAt(child.getAttributes().getStartsAt());
        }
        if (child.getAttributes().getStatus() != null && !child.getAttributes().getStatus().isEmpty()) {
            this.getAttributes().setStatus(child.getAttributes().getStatus());
        }
        if (child.getAttributes().getEndsAt() != null && !child.getAttributes().getEndsAt().equals(0L)) {
            this.getAttributes().setEndsAt(child.getAttributes().getEndsAt());
        }
        if (child.getAttributes().getReporter() != null && !child.getAttributes().getReporter().isEmpty()) {
            this.getAttributes().setReporter(child.getAttributes().getReporter());
        }
        if (child.getAttributes().getWatchers() != null) {
            this.getAttributes().setWatchers(child.getAttributes().getWatchers());
        }
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProjectKnowledgeNode)) return false;
        ProjectKnowledgeNode that = (ProjectKnowledgeNode) o;
        return Objects.equals(attributes.getId(), that.getAttributes().getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(attributes.getId());
    }
}
