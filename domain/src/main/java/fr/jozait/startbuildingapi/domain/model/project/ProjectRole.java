package fr.jozait.startbuildingapi.domain.model.project;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.jozait.startbuildingapi.domain.model.BaseEntity;

import javax.persistence.Entity;

@Entity
@JsonIgnoreProperties({"version"})
public class ProjectRole extends BaseEntity {
    protected String name;
    protected String description;

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
}
