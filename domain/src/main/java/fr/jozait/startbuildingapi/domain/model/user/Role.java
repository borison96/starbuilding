package fr.jozait.startbuildingapi.domain.model.user;

import fr.jozait.startbuildingapi.domain.model.BaseEntity;

import javax.persistence.Entity;
import javax.persistence.Lob;

@Entity
public class Role extends BaseEntity {

    private String name;
    @Lob
    private String authorities;

    public Role() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAuthorities() {
        return authorities;
    }

    public void setAuthorities(String authorities) {
        this.authorities = authorities;
    }
}
