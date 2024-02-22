package fr.jozait.startbuildingapi.util;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties("ui")
public class UIProps {
    private String host;
    private String projectInviteSuccessUrl;

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getProjectInviteSuccessUrl() {
        return projectInviteSuccessUrl;
    }

    public void setProjectInviteSuccessUrl(String projectInviteSuccessUrl) {
        this.projectInviteSuccessUrl = projectInviteSuccessUrl;
    }
}
