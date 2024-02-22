package fr.jozait.startbuildingapi.domain.response.forge;

public class CheckStatusDTO {
    private String urn;

    private String status;

    private String progress;

    public CheckStatusDTO(String urn, String status, String progress) {
        this.urn = urn;
        this.status = status;
        this.progress = progress;
    }

    public CheckStatusDTO() {

    }

    public String getUrn() {
        return urn;
    }

    public void setUrn(String urn) {
        this.urn = urn;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getProgress() {
        return progress;
    }

    public void setProgress(String progress) {
        this.progress = progress;
    }
}
