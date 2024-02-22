package fr.jozait.startbuildingapi.domain.response;

import fr.jozait.startbuildingapi.domain.model.user.User;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Objects;

public class UserDAO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Long roleId;
    private String phoneFixed;
    private String portfolioUrl;
    private String userType;
    private LocalDateTime emailVerifiedAt;
    private Boolean emailVerified;
    private Instant createdAt;
    private Instant updatedAt;

    public UserDAO(User user) {
        if (Objects.nonNull(user)) {
            this.id = user.getId();
            this.firstName = user.getFirstName();
            this.lastName = user.getLastName();
            this.roleId = user.getRoleId();
            this.phoneFixed = user.getPhoneFixed();
            this.portfolioUrl = user.getPortfolioUrl();
            this.userType = user.getUserType();
            this.email = user.getEmail();
            this.phone = user.getPhone();
            this.createdAt = user.getCreatedAt();
            this.updatedAt = user.getUpdatedAt();
            this.emailVerifiedAt = user.getEmailVerifiedAt();
            this.emailVerified = user.getEmailVerifiedAt() != null;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
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

    public LocalDateTime getEmailVerifiedAt() {
        return emailVerifiedAt;
    }

    public void setEmailVerifiedAt(LocalDateTime emailVerifiedAt) {
        this.emailVerifiedAt = emailVerifiedAt;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
