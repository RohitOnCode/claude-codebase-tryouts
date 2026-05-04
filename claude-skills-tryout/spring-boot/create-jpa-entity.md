---
description: Use when the user wants to create a database entity, JPA model, repository, persistence layer, or domain object in a Spring Boot project
---

# Skill: Create JPA Entity with Repository and Service

Generate a complete persistence layer: JPA entity, repository, and service for any domain object.

## Instructions

1. Ask the user for:
   - The entity name (e.g. `Order`, `Customer`)
   - All fields, their types, and constraints (nullable, unique, length)
   - Any relationships (OneToMany, ManyToOne, ManyToMany) and the related entity
   - Whether soft delete is needed (`deletedAt` timestamp)
   - Whether audit fields are needed (createdAt, updatedAt, createdBy)

2. Generate:
   - A `@Entity` class with Lombok (`@Data`/`@Builder`/`@NoArgsConstructor`/`@AllArgsConstructor`)
   - A `JpaRepository` interface with any custom query methods needed
   - A `@Service` class implementing business logic and mapping to DTOs
   - An `@EntityNotFoundException` thrown when entity is not found

3. Rules:
   - Use `@MappedSuperclass` base class for audit fields — do not repeat them in every entity
   - Use `FetchType.LAZY` for all relationships by default
   - Never expose the entity directly — always map to a DTO in the service
   - Use `@Column` annotations explicitly (don't rely on defaults)
   - Use `Long` as the ID type with `@GeneratedValue(strategy = GenerationType.IDENTITY)`

## Example Output

```java
// Base audit entity
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
public abstract class BaseEntity {
    @CreatedDate
    @Column(updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}

// Entity
@Entity
@Table(name = "orders")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Order extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String referenceNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderItem> items = new ArrayList<>();
}

// Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByCustomerId(Long customerId, Pageable pageable);
    Optional<Order> findByReferenceNumber(String referenceNumber);
}

// Service
@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public Page<OrderResponse> findByCustomer(Long customerId, Pageable pageable) {
        return orderRepository.findByCustomerId(customerId, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public OrderResponse findById(Long id) {
        return orderRepository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Order not found: " + id));
    }

    public OrderResponse create(OrderRequest request) {
        Order order = Order.builder()
                .referenceNumber(generateReference())
                .status(OrderStatus.PENDING)
                .build();
        return toResponse(orderRepository.save(order));
    }

    private OrderResponse toResponse(Order o) {
        return new OrderResponse(o.getId(), o.getReferenceNumber(), o.getStatus(), o.getCreatedAt());
    }

    private String generateReference() {
        return "ORD-" + System.currentTimeMillis();
    }
}
```

## Checklist Before Delivering
- [ ] `FetchType.LAZY` on all relationships
- [ ] Audit fields via `@MappedSuperclass` base class
- [ ] Entity never exposed directly — DTO mapping in service
- [ ] `@Transactional(readOnly = true)` on read methods
- [ ] `EntityNotFoundException` thrown for missing records
- [ ] `@Column` annotations explicit on all fields
