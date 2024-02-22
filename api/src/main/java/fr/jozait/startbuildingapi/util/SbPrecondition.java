package fr.jozait.startbuildingapi.util;

import fr.jozait.startbuildingapi.domain.response.ApiResponse;
import fr.jozait.startbuildingapi.domain.response.ApiResponseError;
import fr.jozait.startbuildingapi.exception.ApiError;

public class SbPrecondition {

    public static void checkArgument(ApiResponse response, boolean condition, ApiError error) {
        if (!condition && !response.getErrors().contains(error)) {
            response.getErrors().add(error);
        }
    }

    public static void throwErrorOnCheckArgument(ApiResponse response, boolean condition, ApiError error) {
        if (!condition && !response.getErrors().contains(error)) {
            response.getErrors().add(error);
        }
        continueIfNoError(response);
    }

    public static void continueIfNoError(ApiResponse response) {
        if (response.getErrors().size() > 0) {
            throw new ApiResponseError(response);
        }
    }
}
