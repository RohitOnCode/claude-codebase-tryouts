---
description: Scaffold a new JPA entity (model, repository, service, controller) following this project's layered architecture. Use when the user wants to add a new domain object/resource to a Spring Boot backend.
---

# JPA Entity Scaffolder

Generate a complete vertical slice for a new domain entity, mirroring the
existing layered structure (`model` → `repository` → `service` → `controller`).
Use `$ARGUMENTS` as the entity name (e.g. `Appointment`).

## Steps

1. **Model** (`model/<Entity>.java`)
   - `@Entity`, `@Table(name = "<snake_case_plural>")`
   - Lombok `@Data @NoArgsConstructor @AllArgsConstructor`
   - `@Id @GeneratedValue(strategy = GenerationType.IDENTITY)`
   - `createdAt`/`updatedAt` timestamps with `@PrePersist`/`@PreUpdate`
   - Use `@ManyToOne(fetch = FetchType.LAZY)` for relations; avoid bidirectional
     `@OneToMany` unless truly needed (prefer `@JsonManagedReference`/`@JsonBackReference`
     when you do).

2. **Repository** (`repository/<Entity>Repository.java`)
   - `extends JpaRepository<Entity, Long>`
   - Add only the finder/query methods the feature actually needs.

3. **Service** (`service/<Entity>Service.java`)
   - `@Service @RequiredArgsConstructor @Transactional`
   - CRUD methods that throw `ResourceNotFoundException` on missing IDs
   - Keep business logic here, not in the controller.

4. **Controller** (`controller/<Entity>Controller.java`)
   - `@RestController @RequestMapping("/api/<plural-kebab-case>") @RequiredArgsConstructor`
   - Standard REST verbs returning `ResponseEntity<T>`
   - `@Valid @RequestBody` for create/update; `201 CREATED` on create, `204 NO_CONTENT` on delete

5. **Wire up CORS** — confirm the new `/api/**` path is covered by the existing
   `CorsConfig` mapping (it usually already is via the wildcard).

6. **Sample data** — optionally add seed rows to `data.sql` so the H2 in-memory
   database has something to show on startup.

## Conventions to follow

- Package root: `com.medicalbilling.<layer>`
- Use constructor injection via `@RequiredArgsConstructor`, never field injection.
- Validation annotations (`@NotBlank`, `@Email`, etc.) belong on the entity or a DTO,
  and are enforced via `@Valid` in the controller.
- Reuse `GlobalExceptionHandler` and `ResourceNotFoundException` rather than writing
  new exception-handling code.
