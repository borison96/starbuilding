package fr.jozait.startbuildingapi.domain.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class LoginDAO {
    @NotBlank(message = "blank_username_not_allowed")
    private String username;
    @NotBlank(message = "blank_password_not_allowed")
    @NotBlank(message = "blank_password_not_allowed")
    @Size(min = 8, message = "invalid_password_length_min_8")
    @Pattern(
            regexp = "(.*[^\\p{L}\\p{N}]+.*)+",
            message = "invalid_password_format"
    )
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
