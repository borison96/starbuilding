package fr.jozait.startbuildingapi.domain.model.seed;

import fr.jozait.startbuildingapi.domain.model.BaseEntity;

import javax.persistence.*;

@Entity
@Table
public class Seeder extends BaseEntity {
    private String tableName;
    private Boolean status;

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

}
