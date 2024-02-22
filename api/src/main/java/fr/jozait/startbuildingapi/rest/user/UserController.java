package fr.jozait.startbuildingapi.rest.user;

import fr.jozait.startbuildingapi.domain.model.user.User;
import fr.jozait.startbuildingapi.domain.request.UpdateUserDetailsDAO;
import fr.jozait.startbuildingapi.domain.response.ApiResponse;
import fr.jozait.startbuildingapi.domain.response.UserDAO;
import fr.jozait.startbuildingapi.security.AppSecurityContextHolder;
import fr.jozait.startbuildingapi.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("${api.base.url}/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/details")
    public ResponseEntity<ApiResponse<User>> getUserDetails() {
        return ResponseEntity.ok(new ApiResponse<>(AppSecurityContextHolder.getPrincipal().getUser()));
    }
    @PostMapping("/details/update")
    public ResponseEntity<ApiResponse<User>> updateUserDetails(@RequestBody @Valid UpdateUserDetailsDAO userDetails) {
        return ResponseEntity.ok(userService.updateUserDetails(userDetails, AppSecurityContextHolder.getPrincipal().getUser()));
    }
}
