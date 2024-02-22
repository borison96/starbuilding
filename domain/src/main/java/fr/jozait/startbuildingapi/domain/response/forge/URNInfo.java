package fr.jozait.startbuildingapi.domain.response.forge;

public class URNInfo {
    private String urn;
    private String rootFilename;
    private boolean compressedUrn;

    public URNInfo(String urn, String rootFilename) {
        this.urn = urn;
        this.rootFilename = rootFilename;
        this.compressedUrn = false;
    }

    public URNInfo() {
    }

    public String getUrn() {
        return urn;
    }

    public void setUrn(String urn) {
        this.urn = urn;
    }

    public String getRootFilename() {
        return rootFilename;
    }

    public void setRootFilename(String rootFilename) {
        this.rootFilename = rootFilename;
    }

    public boolean getCompressedUrn() {
        return compressedUrn;
    }

    public void setCompressedUrn(boolean compressedUrn) {
        this.compressedUrn = compressedUrn;
    }
}
