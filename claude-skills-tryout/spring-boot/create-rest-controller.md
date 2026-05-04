---
description: Use when the user wants to create a REST API, controller, CRUD endpoints, or HTTP endpoints in a Spring Boot project
---

# Skill: Create Spring Boot REST Controller

Generate a complete REST controller with CRUD endpoints for any resource.

## Instructions

1. Ask the user for:
   - The resource name (e.g. `Product`, `Order`, `Employee`)
   - The fields of the resource (name, type, constraints)
   - The base URL path (e.g. `/api/v1/products`)
   - Which operations to include (GET all, GET by ID, POST, PUT, DELETE)
   - Whether pagination is needed for GET all

2. Generate:
   - A `record`-based request/response DTO
   - A `@RestController` class with proper `@RequestMapping`
   - All requested endpoints with correct HTTP methods and status codes
   - Input validation using `@Valid` and Bean Validation annotations
   - A service interface call (not direct repository access in the controller)

3. Rules:
   - Use constructor injection (not `@Autowired` on fields)
   - Return `ResponseEntity<T>` for all endpoints
   - Use `@Valid` on request body parameters
   - Use `Pageable` for paginated GET all endpoints
   - 201 Created for POST, 204 No Content for DELETE
   - Keep controller thin — no business logic

## Example Output

```java
package com.example.api.product;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.net.URI;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAll(Pageable pageable) {
        return ResponseEntity.ok(productService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request) {
        ProductResponse created = productService.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

// DTOs
record ProductRequest(
    @NotBlank String name,
    @NotNull @DecimalMin("0.0") BigDecimal price,
    @NotNull @Min(0) Integer stock
) {}

record ProductResponse(Long id, String name, BigDecimal price, Integer stock) {}
```

## Checklist Before Delivering
- [ ] Constructor injection used (no `@Autowired` on fields)
- [ ] `ResponseEntity<T>` returned from all methods
- [ ] Correct HTTP status codes (200, 201, 204)
- [ ] `@Valid` applied to request bodies
- [ ] Location header set on POST
- [ ] No business logic in the controller
