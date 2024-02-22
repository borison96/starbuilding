package fr.jozait.startbuildingapi.domain.response;

import java.util.ArrayList;
import java.util.List;

public class ApiResponse<T> {
    private T content;
    private List<T> errors = new ArrayList<>();

    public ApiResponse() {
    }
    public ApiResponse(T content) {
        this.content = content;
    }

    public T getContent() {
        return content;
    }

    public void setContent(T content) {
        this.content = content;
    }

    public List<T> getErrors() {
        return errors;
    }

    public void setErrors(List<T> errors) {
        this.errors = errors;
    }
}
