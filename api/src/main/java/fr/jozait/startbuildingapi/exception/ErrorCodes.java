package fr.jozait.startbuildingapi.exception;

public enum ErrorCodes {
  BAD_USER_CREDENTIALS("bad_user_credentials", "B4001"),
  INVALID_INPUT_FORMAT("invalid_input_format", "I0001"),
  TOKEN_REFRESH_FAILED("failed_to_refresh_token", "T1000"),
  USER_PASSWORD_INVALID("user_password_is_invalid", "U3001"),
  USER_PHONE_INVALID("user_phone_number_is_invalid", "U3002"),
  USER_EMAIL_INVALID("user_email_address_is_invalid", "U3003"),
  USER_EMAIL_ALREADY_IN_USE("email_is_already_taken", "U1001"),
  USER_PHONE_ALREADY_IN_USE("phone_is_already_taken", "U1002");

  private String message;

  private String code;

  ErrorCodes(String message, String code) {
    this.message = message;
    this.code = code;
  }

  public String getMessage() {
    return message;
  }
  public String getCode(){
    return code;
  }
}
