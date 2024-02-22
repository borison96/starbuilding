package fr.jozait.startbuildingapi.domain.request;

public class ROMELocalSearch {
    private String libelle;
    private Integer nombre;
    private String type;
    private String codeRome;

    public ROMELocalSearch() {
    }

    public ROMELocalSearch(
            String libelle,
            Integer nombre,
            String type,
            String codeRome) {
        this.libelle = libelle;
        this.nombre = nombre;
        this.type = type;
        this.codeRome = codeRome;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public Integer getNombre() {
        return nombre;
    }

    public void setNombre(Integer nombre) {
        this.nombre = nombre;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCodeRome() {
        return codeRome;
    }

    public void setCodeRome(String codeRome) {
        this.codeRome = codeRome;
    }
}
