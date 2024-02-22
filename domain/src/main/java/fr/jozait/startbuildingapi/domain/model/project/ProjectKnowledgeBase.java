package fr.jozait.startbuildingapi.domain.model.project;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.jozait.startbuildingapi.domain.model.BaseEntity;
import fr.jozait.startbuildingapi.domain.model.project.node.ProjectKnowledgeNode;
import org.hibernate.annotations.Type;

import javax.persistence.*;

@Entity
@JsonIgnoreProperties({"project", "version"})
public class ProjectKnowledgeBase extends BaseEntity {
    private Long projectId;
    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb")
    private ProjectKnowledgeNode tree;

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public ProjectKnowledgeNode getTree() {
        return tree;
    }

    public void setTree(ProjectKnowledgeNode tree) {
        this.tree = tree;
    }
}
