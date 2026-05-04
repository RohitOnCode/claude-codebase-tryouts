---
description: Use when the user wants to add authentication, JWT security, login, token-based auth, or Spring Security configuration to a Spring Boot project
---

# Skill: Add JWT Security to Spring Boot

Configure Spring Security with JWT authentication for a Spring Boot REST API.

## Instructions

1. Ask the user for:
   - The User entity field used as the username (email or username)
   - Token expiry duration (e.g. 15 minutes for access, 7 days for refresh)
   - Which endpoints should be public (e.g. `/api/auth/**`, `/actuator/health`)
   - Whether refresh tokens are needed
   - Roles/authorities needed (e.g. `ROLE_USER`, `ROLE_ADMIN`)

2. Generate:
   - `pom.xml` dependencies (`spring-boot-starter-security`, `jjwt`)
   - `JwtService` for token creation and validation
   - `JwtAuthenticationFilter` that validates the token on each request
   - `SecurityConfig` with `SecurityFilterChain` bean
   - `AuthController` with login and (optionally) refresh endpoints

3. Rules:
   - Use the functional `SecurityFilterChain` bean style (not `WebSecurityConfigurerAdapter`)
   - Store the JWT secret in `application.properties` — never hardcode it
   - Use `HS256` algorithm minimum; prefer `RS256` for production
   - Stateless session: `SessionCreationPolicy.STATELESS`
   - Validate token signature, expiry, and that the user still exists on each request

## Example Output

```java
// JwtService
@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiry-ms:900000}")
    private long expiryMs;

    public String generateToken(UserDetails user) {
        return Jwts.builder()
                .subject(user.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiryMs))
                .signWith(getKey())
                .compact();
    }

    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isValid(String token, UserDetails user) {
        return extractUsername(token).equals(user.getUsername())
                && !parseClaims(token).getExpiration().before(new Date());
    }

    private Claims parseClaims(String token) {
        return Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token).getPayload();
    }

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }
}

// JWT Filter
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails user = userDetailsService.loadUserByUsername(username);
            if (jwtService.isValid(token, user)) {
                var auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(request, response);
    }
}

// Security Config
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/actuator/health").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

```properties
# application.properties
app.jwt.secret=your-256-bit-base64-encoded-secret-here
app.jwt.expiry-ms=900000
```

## Checklist Before Delivering
- [ ] JWT secret externalized to `application.properties`
- [ ] `SessionCreationPolicy.STATELESS` configured
- [ ] Filter extends `OncePerRequestFilter`
- [ ] Token validated for signature AND expiry AND user existence
- [ ] Public endpoints explicitly permitted
- [ ] `@EnableMethodSecurity` added for `@PreAuthorize` support
- [ ] `BCryptPasswordEncoder` registered as a bean
