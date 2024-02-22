package fr.jozait.startbuildingapi.rest.auth;

import fr.jozait.startbuildingapi.domain.model.user.User;
import fr.jozait.startbuildingapi.domain.repository.UserRepository;
import fr.jozait.startbuildingapi.domain.request.LoginDAO;
import fr.jozait.startbuildingapi.domain.response.ApiResponse;
import fr.jozait.startbuildingapi.exception.ApiError;
import fr.jozait.startbuildingapi.security.JwtService;
import fr.jozait.startbuildingapi.domain.request.RefreshTokenRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

@RestController
@RequestMapping("${api.base.url}/public/auth")
public class AuthController {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @PostMapping(path = "/sign-in")
    public ResponseEntity<ApiResponse<JwtService.JWTResponse>> signIn(@RequestBody @Valid LoginDAO loginRequestDTO, HttpServletRequest request) {
        User user = userRepository.findFirstByEmail(loginRequestDTO.getUsername())
                .orElseThrow(() -> ApiError.USER_UNAUTHORIZED);
        // check password
        if (passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            return ResponseEntity.ok(new  ApiResponse<>(jwtService.encode(user.getEmail(), user.getId())));
        }
        throw ApiError.USER_UNAUTHORIZED;
    }
    @PostMapping("/token/refresh")
    public ResponseEntity<ApiResponse<JwtService.JWTResponse>> refreshToken(@RequestBody @Valid RefreshTokenRequest tokenRequest, HttpServletRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(jwtService.refresh(tokenRequest.getRefreshToken())));
    }
}
