package fr.jozait.startbuildingapi.exception;

import fr.jozait.startbuildingapi.domain.response.ApiResponse;
import fr.jozait.startbuildingapi.domain.response.ApiResponseError;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {
    Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(value = {MethodArgumentNotValidException.class})
    public ResponseEntity<ApiResponse<ValidationErrorResponse>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex,
                                                                                                      HttpServletRequest request) {
        logger.warn("Handling Error: MethodArgumentNotValidException");
        List<FieldError> fieldErrorList = ex.getBindingResult().getFieldErrors();
        ApiResponse<ValidationErrorResponse> apiResponse = new ApiResponse<>();
        for (FieldError fieldError : fieldErrorList) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.setDefaultMessage(fieldError.getDefaultMessage());
            errorResponse.setField(fieldError.getField());
            errorResponse.setCode(fieldError.getCode());
            errorResponse.setMessage(fieldError.getDefaultMessage());
            apiResponse.getErrors().add(errorResponse);
        }
        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {HttpMessageNotReadableException.class})
    public ResponseEntity<ApiResponse<ErrorResponse>> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException ex, HttpServletRequest request
    ) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setCode(ErrorCodes.INVALID_INPUT_FORMAT.toString());
        String dev_message = ex.getMessage();
        String message = null;
        if (dev_message != null) {
            if (dev_message.contains("expected format") && dev_message.contains(";")) {
                message = dev_message.substring(dev_message.indexOf("expected format"), dev_message.indexOf(';'));
            } else {
                message = dev_message;
            }

        }
        errorResponse.setMessage(message);
        logger.warn("Handling Error: HttpMessageNotReadableException, {}, {}", ErrorCodes.INVALID_INPUT_FORMAT, message);
        ApiResponse<ErrorResponse> apiResponse = new ApiResponse<>();
        apiResponse.getErrors().add(errorResponse);
        return new ResponseEntity<>(apiResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @ExceptionHandler(value = {ApiException.class})
    public ResponseEntity<ApiResponse<ErrorResponse>> handleApiException(ApiException ex, HttpServletRequest request) {
        logger.warn("Handling Error: {}, {}", ex.getCode(), ex.getHttpStatus());
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setCode(ex.getCode());
        errorResponse.setMessage(ex.getMessage());
        ApiResponse<ErrorResponse> apiResponse = new ApiResponse<>();
        apiResponse.getErrors().add(errorResponse);
        return new ResponseEntity<>(apiResponse, ex.getHttpStatus());
    }

    @ExceptionHandler(value = {ApiError.class})
    public ResponseEntity<ApiResponse<ApiError>> handleApiError(ApiError ex, HttpServletRequest request) {
        logger.warn("Handling Error: {}", ex.getCode());
        ApiResponse<ApiError> apiResponse = new ApiResponse<>();
        apiResponse.getErrors().add(ex);
        return new ResponseEntity<>(apiResponse, ex.getStatus());
    }


    @ExceptionHandler(value = {ApiResponseError.class})
    public ResponseEntity<ApiResponse<Long>> handleApiResponseError(ApiResponseError are, ServletWebRequest request) {
        ApiResponse<Long> response = new ApiResponse();
        response.getErrors().addAll(are.getResponse().getErrors());
        logger.warn("Handling Error: {}", are.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(value = {Exception.class})
    public ResponseEntity<ApiResponse<ErrorResponse>> handleException(Exception ex, HttpServletRequest request) {
        logger.warn("Handling Error: {}, {}", ex.getMessage(), ex.getCause());
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setCode(HttpStatus.INTERNAL_SERVER_ERROR.toString());
        errorResponse.setMessage(ex.getMessage());
        ApiResponse<ErrorResponse> apiResponse = new ApiResponse<>();
        apiResponse.getErrors().add(errorResponse);
        return new ResponseEntity<>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
