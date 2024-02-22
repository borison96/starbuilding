package fr.jozait.startbuildingapi.exception;

import org.springframework.http.HttpStatus;
public class ApiException extends RuntimeException {
    private HttpStatus httpStatus;
    private String code;
  public ApiException(String message, HttpStatus httpStatus, String code) {
    super(message);
    this.httpStatus = httpStatus;
    this.code = code;
  }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public void setHttpStatus(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
