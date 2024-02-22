package fr.jozait.startbuildingapi.bootstrap.rome;

public class ROMERecord {
    private String libelle;
    private Double score;
    private String reference;
    private String typeReference;
    private String codeROME;

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getTypeReference() {
        return typeReference;
    }

    public void setTypeReference(String typeReference) {
        this.typeReference = typeReference;
    }

    public String getCodeROME() {
        return codeROME;
    }

    public void setCodeROME(String codeROME) {
        this.codeROME = codeROME;
    }
}
