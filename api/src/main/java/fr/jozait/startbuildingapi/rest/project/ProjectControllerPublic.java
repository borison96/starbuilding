package fr.jozait.startbuildingapi.rest.project;

import fr.jozait.startbuildingapi.service.project.ProjectService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("${api.base.url}/public/project")
public class ProjectControllerPublic {
    @Autowired
    ProjectService projectService;

    @ApiOperation("Accept project invitation")
    @GetMapping("/{id}/invite/accept")
    public RedirectView acceptInvite(@RequestParam String token,
                                     @PathVariable Long id) {
        return new RedirectView(projectService.acceptInvite(id, token));
    }
}
