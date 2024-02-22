package fr.jozait.startbuildingapi.bootstrap.rome;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties("rome")
public class ROMEProps {
    private String clientId;
    private String clientSecret;
    private String tokenHost;
    private String tokenEndpoint;
    private String scopes;
    private String realm;
    private String apiHost;
    private String apiSearchEndpoint;
    private String bootstrapCsv;
    private String bootstrapDomains;

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

    public String getTokenHost() {
        return tokenHost;
    }

    public void setTokenHost(String tokenHost) {
        this.tokenHost = tokenHost;
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

    public String getRealm() {
        return realm;
    }

    public void setRealm(String realm) {
        this.realm = realm;
    }

    public String getApiHost() {
        return apiHost;
    }

    public void setApiHost(String apiHost) {
        this.apiHost = apiHost;
    }

    public String getApiSearchEndpoint() {
        return apiSearchEndpoint;
    }

    public void setApiSearchEndpoint(String apiSearchEndpoint) {
        this.apiSearchEndpoint = apiSearchEndpoint;
    }

    public String getBootstrapCsv() {
        return bootstrapCsv;
    }

    public void setBootstrapCsv(String bootstrapCsv) {
        this.bootstrapCsv = bootstrapCsv;
    }

    public String getBootstrapDomains() {
        return bootstrapDomains;
    }

    public void setBootstrapDomains(String bootstrapDomains) {
        this.bootstrapDomains = bootstrapDomains;
    }
}
