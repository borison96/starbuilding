package fr.jozait.startbuildingapi.domain.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class RegisterUserDAO {
    private String firstName;
    private String lastName;
    @NotBlank(message = "blank_email_not_allowed")
    @Email(message = "invalid_email_format")
    private String email;
    @NotBlank(message = "blank_password_not_allowed")
    @Size(min = 8, message = "invalid_password_length_min_8")
    @Pattern(
            regexp = "(.*[^\\p{L}\\p{N}]+.*)+",
            message = "invalid_password_format"
    )
    private String password;
    private String role;
    @Pattern(
            regexp = "(?:07|06)\\s*(?:[\\s.-]*\\d){8}",
            message = "invalid_phone_format"
    )
    @Size(max = 12, message = "invalid_phone_length_max_12")
    private String phone;
    @Pattern(
            regexp = "0[1-5]\\s*(?:[\\s.-]*\\d){8}",
            message = "invalid_fixed_phone_format"
    )
    @Size(max = 12, message = "invalid_phone_length_max_12")
    private String phoneFixed;
    @Pattern(
            regexp = "^https?:\\/\\/",
            message = "invalid_url_start_with_http_https"
    )
    private String portfolioUrl;
    private String userType;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPhoneFixed() {
        return phoneFixed;
    }

    public void setPhoneFixed(String phoneFixed) {
        this.phoneFixed = phoneFixed;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }
}
