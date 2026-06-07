---
description: Add a new REST endpoint or controller method to an existing Spring Boot resource, following consistent request/response conventions. Use when the user wants to expose a new API operation (search, filter, status update, report, etc.).
---

# REST API Scaffolder

Add a new endpoint to an existing `@RestController`, or extend a service with a
new query/operation. Use `$ARGUMENTS` to describe the desired endpoint
(e.g. "GET /api/claims/overdue" or "PATCH endpoint to reassign a claim's provider").

## Conventions used in this codebase

- Read endpoints return `ResponseEntity.ok(...)`.
- Create endpoints return `ResponseEntity.status(HttpStatus.CREATED).body(...)`.
- Delete endpoints return `ResponseEntity.noContent().build()`.
- Partial updates use `@PatchMapping` with a small `Map<String, String>` or DTO body
  (see `ClaimController#updateClaimStatus` for the pattern).
- Filtering is done via optional `@RequestParam` query params, falling back to
  "get all" when absent (see `PatientController#getAllPatients`,
  `ClaimController#getAllClaims`).
- Cross-entity lookups are exposed as nested paths, e.g. `/api/claims/patient/{patientId}`.

## Steps

1. Add the query/derived method to the repository if the data access doesn't
   already exist (`findByXxx`, a `@Query`, or an aggregate like `countByStatus`).
2. Add a thin orchestration method to the service — no business logic in controllers.
3. Add the controller method with the correct HTTP verb, path, and `ResponseEntity` wrapping.
4. If the endpoint returns aggregated/cross-entity data, consider a DTO in `dto/`
   (see `DashboardStatsDto`) instead of exposing entities directly.
5. Confirm validation (`@Valid`) and exception handling rely on the existing
   `GlobalExceptionHandler` rather than ad hoc try/catch blocks.

## Quick smoke test

After adding an endpoint, verify it with curl against the running app
(default port 8080):

```bash
curl -s http://localhost:8080/api/<path> | python3 -m json.tool
```
