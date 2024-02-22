package fr.jozait.startbuildingapi.domain.response.forge;

public class translateDTO {
    private String result;
    private String urn;

    public translateDTO(String result, String urn) {
        this.result = result;
        this.urn = urn;
    }

    public translateDTO() {
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getUrn() {
        return urn;
    }

    public void setUrn(String urn) {
        this.urn = urn;
    }
}
