package fr.jozait.startbuildingapi.service;

import fr.jozait.startbuildingapi.domain.request.RegisterUserDAO;
import fr.jozait.startbuildingapi.domain.request.UpdateUserDetailsDAO;
import fr.jozait.startbuildingapi.domain.response.ApiResponse;
import fr.jozait.startbuildingapi.domain.response.UserDAO;
import fr.jozait.startbuildingapi.exception.ApiException;
import fr.jozait.startbuildingapi.domain.model.user.User;
import fr.jozait.startbuildingapi.domain.repository.UserRepository;
import fr.jozait.startbuildingapi.exception.ErrorCodes;
import fr.jozait.startbuildingapi.service.user.UserService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @InjectMocks
    private UserService userService;

    @Test
    void validateNewEmailOrThrowApiException_ShouldCallUserRepositoryFindFirstByEmail() {
        when(userRepository.findFirstByEmail(anyString())).thenReturn(Optional.empty());
        RegisterUserDAO userDAO = new RegisterUserDAO();
        userDAO.setEmail("nouks@joza-it.fr");
        userService.registerUser(userDAO);
        verify(userRepository, times(1)).findFirstByEmail(anyString());
    }
    @Test
    void validateNewEmailOrThrowApiException_ShouldThrowWhenEmailAlreadyExists() {
        when(userRepository.findFirstByEmail(anyString())).thenReturn(Optional.of(new User()));
        RegisterUserDAO userDAO = new RegisterUserDAO();
        userDAO.setEmail("nouks@joza-it.fr");
        userDAO.setPhone("12345678");
        ApiException exception = assertThrows(ApiException.class, () -> userService.registerUser(userDAO));
        verify(userRepository, times(1)).findFirstByEmail(anyString());
        assertEquals(exception.getCode(), HttpStatus.CONFLICT.toString());
        Assertions.assertEquals(exception.getMessage(), ErrorCodes.USER_EMAIL_ALREADY_IN_USE.getMessage());
    }
    @Test
    void registerUser_ShouldCallUserRepositorySave(){
        when(userRepository.findFirstByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any())).thenReturn(new User());
        RegisterUserDAO userDAO = new RegisterUserDAO();
        userDAO.setEmail("nouks@joza-it.fr");
        userDAO.setPhone("12345678");
        userService.registerUser(userDAO);
        verify(userRepository, times(1)).save(any());
    }
    @Test
    void registerUser_ShouldReturnApiResponseWithUserDAO(){
        when(userRepository.findFirstByEmail(anyString())).thenReturn(Optional.empty());
        RegisterUserDAO userDAO = new RegisterUserDAO();
        userDAO.setEmail("nouks@joza-it.fr");
        userDAO.setPhone("12345678");
        userDAO.setFirstName("nouks");
        userDAO.setLastName("joza");
        userDAO.setPassword("12546joza");
        when(passwordEncoder.encode(anyString())).thenReturn("");
        when(userRepository.save(any())).thenAnswer(invocationOnMock -> invocationOnMock.getArgument(0, User.class));
        ApiResponse<UserDAO> response =  userService.registerUser(userDAO);
        verify(userRepository, times(1)).save(any());
        assertEquals(response.getContent().getEmail(), userDAO.getEmail());
        assertEquals(response.getContent().getPhone(), userDAO.getPhone());
        assertEquals(response.getContent().getFirstName(), userDAO.getFirstName());
        assertEquals(response.getContent().getLastName(), userDAO.getLastName());
    }
    @Test
    void updateUserDetails_ShouldCallUserRepositorySave() {
        UpdateUserDetailsDAO userDetailsDAO = new UpdateUserDetailsDAO();
        when(userRepository.save(any())).thenReturn(new User());
        userService.updateUserDetails(userDetailsDAO, new User());
        verify(userRepository, times(1)).save(any());
    }
    @Test
    void updateUserDetails_ShouldReturnValidApiResponse(){
        UpdateUserDetailsDAO userDetailsDAO = new UpdateUserDetailsDAO();
        userDetailsDAO.setFirstName("sammy");
        userDetailsDAO.setLastName("Babes");
        userDetailsDAO.setPhoneFixed("456");
        User user = new User();
        user.setFirstName("nnouks");
        user.setLastName("joza");
        user.setPhoneFixed("123");
        when(userRepository.save(any())).thenAnswer(invocationOnMock -> invocationOnMock.getArgument(0, User.class));
        ApiResponse<User> response = userService.updateUserDetails(userDetailsDAO, user);
        assertEquals(response.getContent().getLastName(), userDetailsDAO.getLastName());
        assertEquals(response.getContent().getFirstName(), userDetailsDAO.getFirstName());
        assertEquals(response.getContent().getPhoneFixed(), userDetailsDAO.getPhoneFixed());
    }
}