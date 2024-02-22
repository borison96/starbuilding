package fr.jozait.startbuildingapi.domain.model.rome;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.jozait.startbuildingapi.domain.model.BaseEntity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table
@JsonIgnoreProperties({"professions", "domaine","version"})
public class Competence extends BaseEntity {
    private String codeRome;
    private String appellation;
    @ManyToOne
    @JoinColumn(name = "domaine_id")
    private Domaine domaine;
    @OneToMany(mappedBy = "competence")
    private List<Profession> professions = new ArrayList<>();

    public String getCodeRome() {
        return codeRome;
    }

    public void setCodeRome(String codeRome) {
        this.codeRome = codeRome;
    }

    public String getAppellation() {
        return appellation;
    }

    public void setAppellation(String appellation) {
        this.appellation = appellation;
    }

    public Domaine getDomaine() {
        return domaine;
    }

    public void setDomaine(Domaine domaine) {
        this.domaine = domaine;
    }

    public List<Profession> getProfessions() {
        return professions;
    }

    public void setProfessions(List<Profession> professions) {
        this.professions = professions;
    }

}
