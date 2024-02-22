package fr.jozait.startbuildingapi.domain.model.project.node;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.jozait.startbuildingapi.domain.model.BaseEntity;
import fr.jozait.startbuildingapi.domain.model.user.User;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@JsonIgnoreProperties({"creator", "version"})
public class ProjectNodeStatus extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;
    private String label;
    private String iconName;

    public ProjectNodeStatus() {
    }

    public ProjectNodeStatus(User creator, String label) {
        this.creator = creator;
        this.label = label;
        this.iconName = label;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
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
