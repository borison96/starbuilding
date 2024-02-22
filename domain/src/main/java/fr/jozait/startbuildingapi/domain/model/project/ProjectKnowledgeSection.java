package fr.jozait.startbuildingapi.domain.model.project;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

public class ProjectKnowledgeSection {
    private String id;
    private String name;
    private String description;
    private Set<String> children = new HashSet<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<String> getChildren() {
        if (children == null) {
            children = new HashSet<>();
        }
        return children;
    }

    public void setChildren(Set<String> children) {
        this.children = children;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProjectKnowledgeSection)) return false;
        ProjectKnowledgeSection that = (ProjectKnowledgeSection) o;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
