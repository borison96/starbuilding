package fr.jozait.startbuildingapi.domain.model.project.forms;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;


public class CreateProjectForm {
    @NotBlank(message = "blank_name_not_allowed")
    @Size(min = 3, message = "min_3_characters")
    private String name;
    private String description;
    private Double longitude;
    private Double latitude;
    private String status;
    @Pattern(
            regexp = "^(?:https?:\\/\\/|data:image)",
            message = "invalid_picture_url"
    )
    private String picture;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
