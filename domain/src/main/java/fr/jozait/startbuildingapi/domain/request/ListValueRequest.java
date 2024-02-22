package fr.jozait.startbuildingapi.domain.request;

import java.util.List;

public class ListValueRequest<T> {
    private List<T> values;

    public List<T> getValues() {
        return values;
    }

    public void setValues(List<T> values) {
        this.values = values;
    }
}
