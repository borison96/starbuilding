package fr.jozait.startbuildingapi.ged.response;

import java.util.Date;

public class SignedUrlResponse {
    private String url;
    private Long validitySeconds;
    private Date expiresAt;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Long getValiditySeconds() {
        return validitySeconds;
    }

    public void setValiditySeconds(Long validitySeconds) {
        this.validitySeconds = validitySeconds;
    }

    public Date getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Date expiresAt) {
        this.expiresAt = expiresAt;
    }
}
