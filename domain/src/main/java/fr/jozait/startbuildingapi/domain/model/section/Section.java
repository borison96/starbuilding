package fr.jozait.startbuildingapi.domain.model.section;

import fr.jozait.startbuildingapi.domain.model.JsonWrapper;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Section {
    public static final String PROJECT = "PROJECT";
    public static final String ORGANISATION = "ORGANISATION";
    public static final String TEAM = "TEAM";
    @EmbeddedId
    private SectionKey id;
    private String name;
    private String description;
    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb")
    private JsonWrapper<List<Long>> children = new JsonWrapper<>(new ArrayList<>());

    public SectionKey getId() {
        return id;
    }

    public void setId(SectionKey id) {
        this.id = id;
    }

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

    public JsonWrapper<List<Long>> getChildren() {
        return children;
    }

    public void setChildren(JsonWrapper<List<Long>> children) {
        this.children = children;
    }
}
