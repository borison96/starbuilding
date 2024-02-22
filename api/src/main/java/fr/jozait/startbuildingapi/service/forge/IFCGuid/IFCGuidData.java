package fr.jozait.startbuildingapi.service.forge.IFCGuid;

import java.util.ArrayList;
import java.util.List;

public class IFCGuidData {
    private String type;

    private List<IFCGuidMetadata> metadata;

    public IFCGuidData() {
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<IFCGuidMetadata> getMetadata() {
        return metadata;
    }

    public void setMetadata(List<IFCGuidMetadata> metadata) {
        this.metadata = metadata;
    }
}
