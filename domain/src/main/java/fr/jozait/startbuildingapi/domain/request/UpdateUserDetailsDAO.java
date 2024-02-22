package fr.jozait.startbuildingapi.domain.request;

import javax.validation.constraints.Pattern;

public class UpdateUserDetailsDAO {
    private String firstName;
    private String lastName;
    @Pattern(
            regexp = "(?:(?:\\+|00)33|0)\\s*[1-9](?:[\\s.-]*\\d{2}){4}",
            message = "invalid_phone_format"
    )
    private String phone;
    @Pattern(
            regexp = "(?:(?:\\+|00)33|0)\\s*[1-9](?:[\\s.-]*\\d{2}){4}",
            message = "invalid_phone_format"
    )
    private String phoneFixed;
    @Pattern(
            regexp = "https?:\\/\\/",
            message = "invalid_url_start_with_http_https"
    )
    private String portfolioUrl;

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
}
