package fr.jozait.startbuildingapi.domain.model.project.forms;

import javax.validation.constraints.NotNull;
import java.util.List;

public class ProjectInviteForm {
    @NotNull(message = "invitations_is_required")
    private List<ProjectInvite> invitations;

    public List<ProjectInvite> getInvitations() {
        return invitations;
    }

    public void setInvitations(List<ProjectInvite> invitations) {
        this.invitations = invitations;
    }
}
