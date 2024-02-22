package fr.jozait.startbuildingapi.service.user;

import fr.jozait.startbuildingapi.domain.model.org.Organisation;
import fr.jozait.startbuildingapi.domain.request.RegisterUserDAO;
import fr.jozait.startbuildingapi.domain.request.UpdateUserDetailsDAO;
import fr.jozait.startbuildingapi.domain.response.ApiResponse;
import fr.jozait.startbuildingapi.domain.response.UserDAO;
import fr.jozait.startbuildingapi.exception.ApiException;
import fr.jozait.startbuildingapi.domain.model.user.User;
import fr.jozait.startbuildingapi.domain.repository.UserRepository;
import fr.jozait.startbuildingapi.domain.repository.org.OrganisationRepository;
import fr.jozait.startbuildingapi.exception.ErrorCodes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class UserService {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    @Autowired
    private OrganisationRepository organisationRepository;

    @Autowired
    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public ApiResponse<UserDAO> registerUser(RegisterUserDAO registerUserDAO) {
        // email must be unique
        validateNewEmailOrThrowApiException(registerUserDAO.getEmail());
//        validateNewPhoneOrThrowApiException(registerUserDAO.getPhone());
        User user = new User();
        user.setEmail(registerUserDAO.getEmail());
        user.setFirstName(registerUserDAO.getFirstName());
        user.setLastName(registerUserDAO.getLastName());
        user.setPassword(passwordEncoder.encode(registerUserDAO.getPassword()));
        user.setPhone(registerUserDAO.getPhone());
        user.setPhoneFixed(registerUserDAO.getPhoneFixed());
        user.setUserType(registerUserDAO.getUserType());
        user.setPortfolioUrl(registerUserDAO.getPortfolioUrl());
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        UserDAO userDAO = new UserDAO(userRepository.save(user));
        return new ApiResponse<>(userDAO);
    }

    public ApiResponse<User> updateUserDetails(UpdateUserDetailsDAO userDetails, User user) {
        // firstName
        if (userDetails.getFirstName() != null && !userDetails.getFirstName().isEmpty()) {
               user.setFirstName(userDetails.getFirstName());
        }
        // lastName
        if (userDetails.getLastName() != null && !userDetails.getLastName().isEmpty()) {
            user.setLastName(userDetails.getLastName());
        }
        // phone
        if (userDetails.getPhone() != null && !userDetails.getPhone().isEmpty()) {
            validateNewPhoneOrThrowApiException(userDetails.getPhone());
            user.setPhone(userDetails.getPhone());
        }
        // portfolioUrl
        if (userDetails.getPortfolioUrl() != null && !userDetails.getPortfolioUrl().isEmpty()) {
            user.setPortfolioUrl(userDetails.getPortfolioUrl());
        }
        // phone fixed
        if (userDetails.getPhoneFixed() != null && !userDetails.getPhoneFixed().isEmpty()) {
            user.setPhoneFixed(userDetails.getPhoneFixed());
        }
        user.setUpdatedAt(Instant.now());
        return new ApiResponse<>(userRepository.save(user));
    }
    public Page<Organisation> listOrganisations(Pageable pageable) {
        return organisationRepository.findAll(pageable);
    }

    public Page<Organisation> searchOrganisation(String q, Pageable pageable) {
        return organisationRepository.searchAttributesLike(q, pageable);
    }
    private void validateNewEmailOrThrowApiException(String email) {
        Optional<User> optionalUser = userRepository.findFirstByEmail(email);
        if (optionalUser.isPresent()) {
            throw new ApiException(ErrorCodes.USER_EMAIL_ALREADY_IN_USE.getMessage(), HttpStatus.CONFLICT, HttpStatus.CONFLICT.toString());
        }
    }
    private void validateNewPhoneOrThrowApiException(String phone) {
        Optional<User> optionalUser = userRepository.findFirstByPhone(phone);
        if (optionalUser.isPresent()) {
            throw new ApiException(ErrorCodes.USER_PHONE_ALREADY_IN_USE.getMessage(), HttpStatus.CONFLICT, HttpStatus.CONFLICT.toString());
        }
    }
}
