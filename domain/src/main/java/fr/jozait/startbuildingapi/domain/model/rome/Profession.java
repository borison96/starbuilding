package fr.jozait.startbuildingapi.domain.model.rome;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.jozait.startbuildingapi.domain.model.BaseEntity;

import javax.persistence.*;

@Entity
@Table
@JsonIgnoreProperties({"competence", "version"})
public class Profession extends BaseEntity {

    private String codeRome;
    private String appellation;

    private String codeOgr;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competence_id")
    private Competence competence;

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

    public Competence getCompetence() {
        return competence;
    }

    public void setCompetence(Competence competence) {
        this.competence = competence;
    }

    public String getCodeOgr() {
        return codeOgr;
    }

    public void setCodeOgr(String codeOgr) {
        this.codeOgr = codeOgr;
    }

}
