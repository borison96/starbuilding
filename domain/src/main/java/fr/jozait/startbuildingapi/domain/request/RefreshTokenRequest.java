package fr.jozait.startbuildingapi.domain.request;

import javax.validation.constraints.NotBlank;

public class RefreshTokenRequest {
    @NotBlank(message = "refresh_token_is_required")
    private String refreshToken;

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
