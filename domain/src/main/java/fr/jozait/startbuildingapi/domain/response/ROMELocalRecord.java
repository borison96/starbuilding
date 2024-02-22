package fr.jozait.startbuildingapi.domain.response;

import fr.jozait.startbuildingapi.domain.model.rome.Competence;
import fr.jozait.startbuildingapi.domain.model.rome.Domaine;
import fr.jozait.startbuildingapi.domain.model.rome.Profession;

import java.util.Objects;

public class ROMELocalRecord {
    private String libelle;
    private String domaine;
    private String competence;
    private String metier;
    private String codeROME;
    private String reference;

    public ROMELocalRecord() {
    }

    public ROMELocalRecord(String libelle, Profession profession) {
        this.libelle = libelle;
        if (Objects.nonNull(profession)) {
            Competence competencePojo = profession.getCompetence();
            if (Objects.nonNull(competencePojo)) {
                this.competence = competencePojo.getAppellation();
                Domaine domain = competencePojo.getDomaine();
                if (Objects.nonNull(domain)) {
                    this.domaine = domain.getAppellation();
                }

            }
            this.metier = profession.getAppellation();
            this.codeROME = profession.getCodeRome();
            this.reference = profession.getCodeOgr();
        }
    }

    public ROMELocalRecord(
            String libelle,
            String domaine,
            String competence,
            String metier,
            String codeROME,
            String reference) {
        this.libelle = libelle;
        this.domaine = domaine;
        this.competence = competence;
        this.metier = metier;
        this.codeROME = codeROME;
        this.reference = reference;
    }

    public String getLibelle() {
        return libelle;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public String getDomaine() {
        return domaine;
    }

    public void setDomaine(String domaine) {
        this.domaine = domaine;
    }

    public String getCompetence() {
        return competence;
    }

    public void setCompetence(String competence) {
        this.competence = competence;
    }

    public String getMetier() {
        return metier;
    }

    public void setMetier(String metier) {
        this.metier = metier;
    }

    public String getCodeROME() {
        return codeROME;
    }

    public void setCodeROME(String codeROME) {
        this.codeROME = codeROME;
    }
}
