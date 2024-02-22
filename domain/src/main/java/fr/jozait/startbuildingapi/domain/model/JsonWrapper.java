package fr.jozait.startbuildingapi.domain.model;

public class JsonWrapper<T> {
    public JsonWrapper() {
    }

    public JsonWrapper(T values) {
        this.values = values;
    }

    private T values;

    public T getValues() {
        return values;
    }

    public void setValues(T values) {
        this.values = values;
    }
}
