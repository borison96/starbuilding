package fr.jozait.startbuildingapi.exception;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.http.HttpStatus;

@JsonIgnoreProperties({"stackTrace", "cause", "suppressed", "localizedMessage"})
public class ApiError extends RuntimeException {
    public static final ApiError PROJECT_TYPE_NOT_FOUND = new ApiError("P3004", "Project Type not found", HttpStatus.NOT_FOUND);
    public static final ApiError PROJECT_NOT_FOUND = new ApiError("P1004", "Project not found", HttpStatus.NOT_FOUND);
    public static final ApiError PROJECT_NODE_DATATABLE_NOT_FOUND = new ApiError("P1014",
            "Project node data table not found", HttpStatus.NOT_FOUND);
    public static final ApiError PROJECT_HAS_NO_KNOWLEDGE_BASE = new ApiError(
            "P4004", "Project has no knowledge base", HttpStatus.BAD_REQUEST);
    public static final ApiError PROJECT_ROLE_NOT_FOUND = new ApiError("P2004", "Project role not found", HttpStatus.NOT_FOUND);
    public static final ApiError PROJECT_INVITATION_EXPIRED = new ApiError("P4001", "Project invitation expired", HttpStatus.NOT_FOUND);
    public static final ApiError PROJECT_INVITATION_NOT_FOUND = new ApiError("P4004", "Project invitation not found", HttpStatus.NOT_FOUND);
    public static final ApiError ORGANISATION_NOT_FOUND = new ApiError("O1004", "Organisation not found", HttpStatus.NOT_FOUND);
    public static final ApiError ORG_JOIN_REQUEST_NOT_FOUND = new ApiError("O2004", "Request to join Organisation not found", HttpStatus.NOT_FOUND);
    public static final ApiError ORG_JOIN_REQUEST_EXPIRED = new ApiError("O2001", "Request to join Organisation expired", HttpStatus.NOT_FOUND);
    public static final ApiError ORG_ROLE_NOT_FOUND = new ApiError("O2004", "Organisation role not found", HttpStatus.NOT_FOUND);
    public static final ApiError USER_NOT_FOUND = new ApiError("U4004", "User not found", HttpStatus.NOT_FOUND);

    public static final ApiError USER_UNAUTHORIZED = new ApiError("U401",
            "User is not authenticated", HttpStatus.UNAUTHORIZED);
    public static final ApiError INVALID_TOKEN = new ApiError("T400",
            "Invalid token", HttpStatus.UNAUTHORIZED);
    public static final ApiError INVALID_REFRESH_TOKEN = new ApiError("T405",
            "Invalid refresh token", HttpStatus.UNAUTHORIZED);
    public static final ApiError REFRESH_TOKEN_WRONG_USE = new ApiError("T405",
            "This looks like a refresh token", HttpStatus.UNAUTHORIZED);
    public static final ApiError EXPIRED_TOKEN = new ApiError("T401",
            "Expired token", HttpStatus.UNAUTHORIZED);
    public static final ApiError INVALID_RESOURCE_ID = new ApiError("T404",
            "Invalid Resource id supplied with token", HttpStatus.UNAUTHORIZED);
    public static final ApiError BAD_REQUEST_DATA = new ApiError("P1014",
            "Bad request data", HttpStatus.BAD_REQUEST);

    public static final ApiError CYCLIC_REFERENCE = new ApiError("CR401",
            "Cyclic reference detected", HttpStatus.CONFLICT);
    private String code;
    private HttpStatus status;
    private StringBuilder detail = new StringBuilder();

    public ApiError(String code, String message, HttpStatus status) {
        super(message);
        this.code = code;
        this.status = status;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDetail() {
        return detail.toString();
    }

    public void setDetail(StringBuilder detail) {
        this.detail = detail;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public void setStatus(HttpStatus status) {
        this.status = status;
    }

    public ApiError addDetail(StringBuilder detail) {
        this.detail.append(detail);
        return this;
    }
}
