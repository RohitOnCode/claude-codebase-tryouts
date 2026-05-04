---
description: Use when the user wants to add error handling, exception handling, global error responses, or structured API error formats in a Spring Boot project
---

# Skill: Add Global Exception Handler

Add a centralized exception handling layer to a Spring Boot application.

## Instructions

1. Ask the user for:
   - Which exception types need custom handling (validation errors, not found, unauthorized, etc.)
   - The desired error response format (fields to include)
   - Whether to include stack traces in non-production environments
   - Any domain-specific exceptions already defined in the project

2. Generate:
   - A standard `ApiError` record as the error response body
   - A `@RestControllerAdvice` class handling all exception types
   - Custom exception classes for common domain errors

3. Rules:
   - Use `@RestControllerAdvice`, not `@ControllerAdvice`
   - Always return `ResponseEntity<ApiError>` — never a raw object
   - Log errors at appropriate levels (`warn` for 4xx, `error` for 5xx)
   - Include a unique `traceId` from MDC for observability
   - Never expose internal stack traces in the response body
   - Handle `MethodArgumentNotValidException` to extract field-level validation errors

## Example Output

```java
// Standard error response
public record ApiError(
    int status,
    String error,
    String message,
    String traceId,
    Instant timestamp,
    Map<String, String> fieldErrors  // null for non-validation errors
) {
    public static ApiError of(HttpStatus status, String message) {
        return new ApiError(status.value(), status.getReasonPhrase(), message,
                MDC.get("traceId"), Instant.now(), null);
    }

    public static ApiError ofValidation(HttpStatus status, Map<String, String> fieldErrors) {
        return new ApiError(status.value(), status.getReasonPhrase(), "Validation failed",
                MDC.get("traceId"), Instant.now(), fieldErrors);
    }
}

// Custom exceptions
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, Object id) {
        super(resource + " not found with id: " + id);
    }
}

public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String message) { super(message); }
}

// Global handler
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiError.of(HttpStatus.NOT_FOUND, ex.getMessage()));
    }

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ApiError> handleBusinessRule(BusinessRuleException ex) {
        log.warn("Business rule violation: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(ApiError.of(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "Invalid value",
                        (a, b) -> a
                ));
        log.warn("Validation failed: {}", fieldErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiError.ofValidation(HttpStatus.BAD_REQUEST, fieldErrors));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiError.of(HttpStatus.FORBIDDEN, "Access denied"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex) {
        log.error("Unexpected error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiError.of(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred"));
    }
}
```

## Checklist Before Delivering
- [ ] `@RestControllerAdvice` used
- [ ] All handlers return `ResponseEntity<ApiError>`
- [ ] Field-level validation errors extracted
- [ ] `traceId` included for observability
- [ ] Stack traces never in response body
- [ ] Logging at correct levels (warn for 4xx, error for 5xx)
- [ ] Generic `Exception` catch-all as last handler
