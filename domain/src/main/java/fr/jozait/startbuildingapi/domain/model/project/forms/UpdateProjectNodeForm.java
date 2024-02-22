package fr.jozait.startbuildingapi.domain.model.project.forms;

import fr.jozait.startbuildingapi.domain.model.project.ProjectKnowledgeSection;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

public class UpdateProjectNodeForm {
    private @NotBlank(message = "id_is_required")
    String id;
    private String name;
    private String description;
    private String iconName;
    private String status;
    private Long durationInSeconds;
    private Double longitude;
    private Double latitude;
    private Long startsAt;
    private Long endsAt;
    private String data;
    private List<ProjectKnowledgeSection> sections;

    public @NotNull(message = "id_is_required") String getId() {
        return id;
    }

    public void setId(@NotNull(message = "id_is_required") String id) {
        this.id = id;
    }

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

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getDurationInSeconds() {
        return durationInSeconds;
    }

    public void setDurationInSeconds(Long durationInSeconds) {
        this.durationInSeconds = durationInSeconds;
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

    public Long getStartsAt() {
        return startsAt;
    }

    public void setStartsAt(Long startsAt) {
        this.startsAt = startsAt;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public Long getEndsAt() {
        return endsAt;
    }

    public void setEndsAt(Long endsAt) {
        this.endsAt = endsAt;
    }

    public List<ProjectKnowledgeSection> getSections() {
        return sections;
    }

    public void setSections(List<ProjectKnowledgeSection> sections) {
        this.sections = sections;
    }
}
