package fr.jozait.startbuildingapi.domain.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@JsonIgnoreProperties({"stackTrace", "cause", "suppressed", "localizedMessage"})
public class ApiResponseError extends RuntimeException {

    private ApiResponse response;

    public ApiResponseError(ApiResponse response) {
        super();
        this.response = response;
    }

    public ApiResponse getResponse() {
        return response;
    }

    public void setResponse(ApiResponse response) {
        this.response = response;
    }
}