package fr.jozait.startbuildingapi.rest.user;

import fr.jozait.startbuildingapi.domain.model.org.Organisation;
import fr.jozait.startbuildingapi.domain.request.RegisterUserDAO;
import fr.jozait.startbuildingapi.domain.response.ApiResponse;
import fr.jozait.startbuildingapi.domain.response.UserDAO;
import fr.jozait.startbuildingapi.service.user.UserService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("${api.base.url}/public/users")
public class UserControllerPublic {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDAO>> useRegistration(@RequestBody @Valid RegisterUserDAO userDAO) {
        return ResponseEntity.ok(userService.registerUser(userDAO));
    }
    @ApiOperation("Get all organisations")
    @GetMapping("/organisations")
    public ResponseEntity<ApiResponse<Page<Organisation>>> listOrganisations(Pageable pageable) {
        return ResponseEntity.ok(new ApiResponse<>(userService.listOrganisations(pageable)));
    }
    @ApiOperation("Search organisation by any attribute matching query")
    @GetMapping("/organisations/search")
    public ResponseEntity<ApiResponse<Page<Organisation>>> searchOrganisations(
            @RequestParam(name = "q") String q, Pageable pageable) {
        return ResponseEntity.ok(new ApiResponse<>(userService.searchOrganisation(q, pageable)));
    }
}
