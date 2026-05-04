---
description: Use when the user wants to create a service layer, add caching, implement business logic, or use Caffeine/Redis cache in a Spring Boot project
---

# Skill: Create Service Layer with Caching

Generate a Spring Boot service with business logic, validation, and Spring Cache integration.

## Instructions

1. Ask the user for:
   - The service name and the resource it manages
   - The business rules / validations that must be enforced
   - Which methods should be cached and what the eviction strategy is
   - Whether events need to be published on state changes
   - The cache provider (in-memory via Caffeine, or Redis)

2. Generate:
   - A `@Service` class with full business logic
   - Spring Cache annotations (`@Cacheable`, `@CachePut`, `@CacheEvict`)
   - Cache configuration bean (Caffeine or Redis)
   - Domain events published via `ApplicationEventPublisher`
   - Clear exception messages for rule violations

3. Rules:
   - Never put caching annotations in the controller — only in the service
   - Use `@CachePut` on update to refresh the cache without evicting
   - Use `@CacheEvict(allEntries = true)` on delete conservatively
   - Annotate read-only methods with `@Transactional(readOnly = true)`
   - Publish events after successful persistence, not before
   - Always use a cache name constant — never a magic string

## Example Output

```java
// Cache name constants
public final class CacheNames {
    public static final String PRODUCTS = "products";
    public static final String PRODUCT_BY_ID = "product-by-id";
    private CacheNames() {}
}

// Cache configuration (Caffeine)
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager(
                CacheNames.PRODUCTS, CacheNames.PRODUCT_BY_ID
        );
        manager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(500)
                .expireAfterWrite(Duration.ofMinutes(10))
                .recordStats());
        return manager;
    }
}

// Domain event
public record ProductCreatedEvent(Long productId, String name, BigDecimal price) {}

// Service
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Cacheable(value = CacheNames.PRODUCTS)
    @Transactional(readOnly = true)
    public Page<ProductResponse> findAll(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::toResponse);
    }

    @Cacheable(value = CacheNames.PRODUCT_BY_ID, key = "#id")
    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        return productRepository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    @CacheEvict(value = CacheNames.PRODUCTS, allEntries = true)
    public ProductResponse create(ProductRequest request) {
        validateUniqueProductName(request.name());

        Product product = Product.builder()
                .name(request.name())
                .price(request.price())
                .stock(request.stock())
                .build();

        Product saved = productRepository.save(product);
        log.info("Product created: id={}, name={}", saved.getId(), saved.getName());
        eventPublisher.publishEvent(new ProductCreatedEvent(saved.getId(), saved.getName(), saved.getPrice()));

        return toResponse(saved);
    }

    @CachePut(value = CacheNames.PRODUCT_BY_ID, key = "#id")
    @CacheEvict(value = CacheNames.PRODUCTS, allEntries = true)
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));

        if (!product.getName().equals(request.name())) {
            validateUniqueProductName(request.name());
        }

        product.setName(request.name());
        product.setPrice(request.price());
        product.setStock(request.stock());

        return toResponse(productRepository.save(product));
    }

    @Caching(evict = {
        @CacheEvict(value = CacheNames.PRODUCT_BY_ID, key = "#id"),
        @CacheEvict(value = CacheNames.PRODUCTS, allEntries = true)
    })
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", id);
        }
        productRepository.deleteById(id);
        log.info("Product deleted: id={}", id);
    }

    private void validateUniqueProductName(String name) {
        if (productRepository.existsByNameIgnoreCase(name)) {
            throw new BusinessRuleException("Product with name '" + name + "' already exists");
        }
    }

    private ProductResponse toResponse(Product p) {
        return new ProductResponse(p.getId(), p.getName(), p.getPrice(), p.getStock());
    }
}
```

## Checklist Before Delivering
- [ ] Cache names as constants — no magic strings
- [ ] `@CachePut` on update (not evict + re-fetch)
- [ ] `@Transactional(readOnly = true)` on read methods
- [ ] Events published after save, not before
- [ ] Business rules validated before persistence
- [ ] `@EnableCaching` on configuration class
- [ ] Cache TTL and max size configured
