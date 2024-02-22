package fr.jozait.startbuildingapi.bootstrap.rome;

import fr.jozait.startbuildingapi.exception.ApiException;
import fr.jozait.startbuildingapi.util.AppUtils;
import fr.jozait.startbuildingapi.exception.ErrorCodes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ROMERestClient {
    private ROMEProps romeProps;
    private RestTemplate restTemplate;
    private Logger logger = LoggerFactory.getLogger(ROMERestClient.class);

    @Autowired
    public ROMERestClient(ROMEProps romeProps, @Qualifier("restTemplate") RestTemplate restTemplate) {
        this.romeProps = romeProps;
        this.restTemplate = restTemplate;
    }

    public ROMEAuthToken login() {
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", "client_credentials");
        requestBody.add("client_id", romeProps.getClientId());
        requestBody.add("client_secret", romeProps.getClientSecret());
        requestBody.add("scope", getScopes(romeProps.getScopes()));
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(
                requestBody,
                HttpHeaders.readOnlyHttpHeaders(headers));
        try {
            ResponseEntity<ROMEAuthToken> entity = restTemplate.postForEntity(
                    romeProps.getTokenHost() + romeProps.getTokenEndpoint() + "?realm=" + romeProps.getRealm(),
                    request,
                    ROMEAuthToken.class
            );
            return entity.getBody();
        } catch (Exception httpEx) {
            throw new ApiException(ErrorCodes.BAD_USER_CREDENTIALS.getMessage(), HttpStatus.UNAUTHORIZED, ErrorCodes.BAD_USER_CREDENTIALS.toString());
        }
    }

    public List<ROMERecord> search(Map<String, String> params) {
        ROMEAuthToken authToken = login();
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(
                AppUtils.createBearerHeader(authToken.getAccessToken())
        );
        logger.info("search params: {}", params);

        ResponseEntity<List> entity = restTemplate.exchange(
                romeProps.getApiHost()
                        + romeProps.getRealm()
                        + romeProps.getApiSearchEndpoint()
                        + AppUtils.QueryString.fromMap(params),
                HttpMethod.GET,
                request,
                List.class
        );
        return entity.getBody();
    }

    private String getScopes(String value) {
        if (value != null) {
            String scopes = Arrays.stream(value.trim().split(",")).map(
                    s -> "api_" + s.trim()
            ).collect(Collectors.joining(" ")) + " application_" + romeProps.getClientId();
            logger.info("Rome scopes add: {}", scopes);
            return scopes;
        }
        return null;
    }

}
