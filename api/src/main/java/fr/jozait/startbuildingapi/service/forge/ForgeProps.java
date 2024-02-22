package fr.jozait.startbuildingapi.service.forge;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties("forge")
public class ForgeProps {
    private String clientId;
    private String clientSecret;
    private String forgeHost;
    private String tokenEndpoint;
    private String scopes;
    private  String bucketsEndpoint;

    public String getBucketsEndpoint() {
        return bucketsEndpoint;
    }

    public void setBucketsEndpoint(String getBucketsEndpoint) {
        this.bucketsEndpoint = getBucketsEndpoint;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getForgeHost() {
        return forgeHost;
    }

    public void setForgeHost(String forgeHost) {
        this.forgeHost = forgeHost;
    }

    public String getTokenEndpoint() {
        return tokenEndpoint;
    }

    public void setTokenEndpoint(String tokenEndpoint) {
        this.tokenEndpoint = tokenEndpoint;
    }

    public String getScopes() {
        return scopes;
    }

    public void setScopes(String scopes) {
        this.scopes = scopes;
    }
}
