// HTTP 에러 코드 상수
export const ApiErrorCode = {
    AuthRequired: "AUTH_REQUIRED",
    AuthTokenExpired: "AUTH_TOKEN_EXPIRED",
    PermissionDenied: "PERMISSION_DENIED",
  
    ValidationFailed: "VALIDATION_FAILED",
    ResourceNotFound: "RESOURCE_NOT_FOUND",
    DuplicateResource: "DUPLICATE_RESOURCE",
    RateLimited: "RATE_LIMITED",
  
    InternalError: "INTERNAL_ERROR",
  } as const;
  
  export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];
  