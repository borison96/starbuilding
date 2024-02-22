package fr.jozait.startbuildingapi.service.forge;

public class AuthForgeDTO {
    private String access_token;

    private String token_type;

    private Number expires_in;

    public AuthForgeDTO() {
    }

    public AuthForgeDTO(AutodeskAuthenticateResponse response) {
        this.access_token = response.getAccessToken();
        this.token_type = response.getTokenType();
        this.expires_in = Integer.parseInt(response.getExpiresIn());
    }

    public String getAccess_token() {
        return access_token;
    }

    public void setAccess_token(String access_token) {
        this.access_token = access_token;
    }

    public String getToken_type() {
        return token_type;
    }

    public void setToken_type(String token_type) {
        this.token_type = token_type;
    }

    public Number getExpires_in() {
        return expires_in;
    }

    public void setExpires_in(Number expires_in) {
        this.expires_in = expires_in;
    }
}
