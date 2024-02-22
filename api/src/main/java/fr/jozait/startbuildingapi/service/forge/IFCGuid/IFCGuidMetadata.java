package fr.jozait.startbuildingapi.service.forge.IFCGuid;

public class IFCGuidMetadata {
    private String name;
    private String role;
    private String guid;

    public IFCGuidMetadata() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getGuid() {
        return guid;
    }

    public void setGuid(String guid) {
        this.guid = guid;
    }
}
