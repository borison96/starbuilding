package fr.jozait.startbuildingapi.domain.model.project.node;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.jozait.startbuildingapi.domain.model.BaseEntity;
import fr.jozait.startbuildingapi.domain.model.user.User;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@JsonIgnoreProperties({"version"})
public class ProjectNodeType extends BaseEntity {
    private Long creatorId;
    private String label;

    private String iconName;

    public ProjectNodeType() {
    }

    public ProjectNodeType(Long creatorId, String label) {
        this.creatorId = creatorId;
        this.label = label;
        this.iconName = label;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }
}
