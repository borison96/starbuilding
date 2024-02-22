package fr.jozait.startbuildingapi.ged.response;

import java.util.List;

public class ListResourceResponse {
    private List<ResourceKeyResponse> objects;
    private List<String> commonPrefixes;

    public List<ResourceKeyResponse> getObjects() {
        return objects;
    }

    public void setObjects(List<ResourceKeyResponse> objects) {
        this.objects = objects;
    }

    public List<String> getCommonPrefixes() {
        return commonPrefixes;
    }

    public void setCommonPrefixes(List<String> commonPrefixes) {
        this.commonPrefixes = commonPrefixes;
    }
}
