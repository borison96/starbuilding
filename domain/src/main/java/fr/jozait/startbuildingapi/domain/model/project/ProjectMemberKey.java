package fr.jozait.startbuildingapi.domain.model.project;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ProjectMemberKey implements Serializable {
    @Column(name = "project_id")
    private Long projectId;
    @Column(name = "member_id")
    private Long memberId;

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProjectMemberKey that = (ProjectMemberKey) o;
        return projectId.equals(that.projectId) && memberId.equals(that.memberId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(projectId, memberId);
    }
}
