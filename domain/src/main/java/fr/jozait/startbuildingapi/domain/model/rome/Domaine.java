package fr.jozait.startbuildingapi.domain.model.rome;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.jozait.startbuildingapi.domain.model.BaseEntity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table
@JsonIgnoreProperties({"competences", "version"})
public class Domaine extends BaseEntity {

    private String codeRome;
    private String appellation;
    @OneToMany(mappedBy = "domaine")
    private List<Competence> competences = new ArrayList<>();

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

    public List<Competence> getCompetences() {
        return competences;
    }

    public void setCompetences(List<Competence> competences) {
        this.competences = competences;
    }

}
