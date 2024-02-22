package fr.jozait.startbuildingapi.domain.model.project.node;

import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ProjectNodeDataTable {
    @Id
    private String id;
    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb")
    private DataTable dataTable;

    public ProjectNodeDataTable() {}
    public ProjectNodeDataTable(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public DataTable getDataTable() {
        if (dataTable == null) {
            dataTable = new DataTable();
        }
        return dataTable;
    }

    public void setDataTable(DataTable dataTable) {
        this.dataTable = dataTable;
    }
}
