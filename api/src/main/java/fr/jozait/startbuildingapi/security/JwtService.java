package fr.jozait.startbuildingapi.security;

import fr.jozait.startbuildingapi.exception.ApiError;
import fr.jozait.startbuildingapi.security.props.AuthServerProps;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.crypto.DefaultJwtSignatureValidator;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.spec.SecretKeySpec;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtService {
    @Autowired
    private AuthServerProps authServerProps;
    public OAuthResponse decode(String token) {
        String[]  chunks = token.split("\\.");
        if (chunks.length < 3) throw ApiError.INVALID_TOKEN;
        Base64.Decoder decoder = Base64.getUrlDecoder();
        JSONObject header = new JSONObject(new String(decoder.decode(chunks[0])));
        JSONObject payload = new JSONObject(new String(decoder.decode(chunks[1])));
        if (isExpired(payload)) {
            throw ApiError.EXPIRED_TOKEN;
        }
        if (!payload.getString("aud").equals(authServerProps.getClientId())) {
            throw ApiError.INVALID_RESOURCE_ID;
        }
        // verify
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.forName(header.getString("alg"));
        SecretKeySpec secretKeySpec = new SecretKeySpec(authServerProps.getSigningKey().getBytes(),
                signatureAlgorithm.getJcaName());
        DefaultJwtSignatureValidator validator = new DefaultJwtSignatureValidator(signatureAlgorithm, secretKeySpec);
        if (!validator.isValid(chunks[0] + "." + chunks[1], chunks[2])) {
            throw ApiError.INVALID_TOKEN;
        }
        return new OAuthResponse()
                .setUserName(payload.has("user_name") ? payload.getString("user_name") : null)
                .setRefresh(payload.has("is_refresh") && payload.getBoolean("is_refresh"))
                .setUserId(payload.has("user_id") ? payload.getLong("user_id") : null);
    }
    public JWTResponse encode(String userName, Long userId) {
        String[] scope = {"read", "write", "trust"};
        String jwt = Jwts.builder()
                .claim("user_name", userName)
                .claim("user_id", userId)
                .claim("scope", scope)
                .setAudience(authServerProps.getClientId())
                .setExpiration(Date.from(
                        Instant.now().plus(authServerProps.getAccessTokenValiditySeconds(), ChronoUnit.SECONDS)))
                .signWith(SignatureAlgorithm.HS256, authServerProps.getSigningKey().getBytes())
                .compact();
        String refresh = Jwts.builder()
                .claim("user_name", userName)
                .claim("user_id", userId)
                .claim("scope", scope)
                .claim("is_refresh", true)
                .setAudience(authServerProps.getClientId())
                .setExpiration(Date.from(
                        Instant.now().plus(authServerProps.getRefreshTokenValiditySeconds(), ChronoUnit.SECONDS)))
                .signWith(SignatureAlgorithm.HS256, authServerProps.getSigningKey().getBytes())
                .compact();
        return new JWTResponse().setAccess_token(jwt)
                .setRefresh_token(refresh)
                .setExpires_in((long) authServerProps.getAccessTokenValiditySeconds())
                .setUser_id(userId)
                .setToken_type("bearer")
                .setScope(String.join(",", scope));
    }
    public JWTResponse refresh(String rToken) {
        OAuthResponse response = decode(rToken);
        if (response.getRefresh()) {
            return encode(response.getUserName(), response.getUserId());
        }
        throw ApiError.INVALID_REFRESH_TOKEN;
    }
    public boolean isExpired(JSONObject payload) {
        Instant exp = Instant.ofEpochSecond(payload.getLong("exp"));
        return exp.isBefore(Instant.now());
    }
    public static class OAuthResponse {
        private Long userId;
        private String userName;
        private Boolean refresh;

        public Long getUserId() {
            return userId;
        }

        public OAuthResponse setUserId(Long userId) {
            this.userId = userId;
            return this;
        }

        public String getUserName() {
            return userName;
        }

        public OAuthResponse setUserName(String userName) {
            this.userName = userName;
            return this;
        }

        public Boolean getRefresh() {
            return refresh;
        }

        public OAuthResponse setRefresh(Boolean refresh) {
            this.refresh = refresh;
            return this;
        }
    }
    public static class JWTResponse {
        private String scope;
        private String access_token;
        private String token_type;
        private String refresh_token;
        private Long expires_in;
        private Long user_id;

        public String getScope() {
            return scope;
        }

        public JWTResponse setScope(String scope) {
            this.scope = scope;
            return this;
        }

        public String getAccess_token() {
            return access_token;
        }

        public JWTResponse setAccess_token(String access_token) {
            this.access_token = access_token;
            return this;
        }

        public String getToken_type() {
            return token_type;
        }

        public JWTResponse setToken_type(String token_type) {
            this.token_type = token_type;
            return this;
        }

        public String getRefresh_token() {
            return refresh_token;
        }

        public JWTResponse setRefresh_token(String refresh_token) {
            this.refresh_token = refresh_token;
            return this;
        }

        public Long getExpires_in() {
            return expires_in;
        }

        public JWTResponse setExpires_in(Long expires_in) {
            this.expires_in = expires_in;
            return this;
        }

        public Long getUser_id() {
            return user_id;
        }

        public JWTResponse setUser_id(Long user_id) {
            this.user_id = user_id;
            return this;
        }
    }
}
