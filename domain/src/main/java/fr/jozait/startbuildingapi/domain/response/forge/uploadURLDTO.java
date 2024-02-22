package fr.jozait.startbuildingapi.domain.response.forge;

import java.util.List;

public class uploadURLDTO {
    private String uploadKey;
    private String uploadExpiration;
    private String urlExpiration;
    private List<String> urls;

    public uploadURLDTO(String uploadKey, String uploadExpiration, String urlExpiration, List<String> urls) {
        this.uploadKey = uploadKey;
        this.uploadExpiration = uploadExpiration;
        this.urlExpiration = urlExpiration;
        this.urls = urls;
    }

    public uploadURLDTO() {

    }

    public String getUploadKey() {
        return uploadKey;
    }

    public void setUploadKey(String uploadKey) {
        this.uploadKey = uploadKey;
    }

    public String getUploadExpiration() {
        return uploadExpiration;
    }

    public void setUploadExpiration(String uploadExpiration) {
        this.uploadExpiration = uploadExpiration;
    }

    public String getUrlExpiration() {
        return urlExpiration;
    }

    public void setUrlExpiration(String urlExpiration) {
        this.urlExpiration = urlExpiration;
    }

    public List<String> getUrls() {
        return urls;
    }

    public void setUrls(List<String> urls) {
        this.urls = urls;
    }
}
