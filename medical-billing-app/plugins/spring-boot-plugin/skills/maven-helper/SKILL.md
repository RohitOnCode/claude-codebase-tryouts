---
description: Run Maven build, test, and dependency commands for Spring Boot projects. Use when the user wants to build, test, run, or inspect dependencies of a Spring Boot / Maven project.
---

# Maven Helper

Generic helper for everyday Maven workflows in a Spring Boot project. Locate the
directory containing `pom.xml` (e.g. `backend/`) and run commands from there.

## Common commands

- Build (skip tests): `mvn clean package -DskipTests`
- Full build with tests: `mvn clean verify`
- Run the app: `mvn spring-boot:run`
- Run all tests: `mvn test`
- Run a single test class: `mvn test -Dtest=ClassNameTest`
- Run a single test method: `mvn test -Dtest=ClassNameTest#methodName`
- Show dependency tree: `mvn dependency:tree`
- Check for outdated dependencies: `mvn versions:display-dependency-updates`
- Format/validate the POM: `mvn validate`

## Guidance

- Always `cd` into the module directory that contains `pom.xml` before running Maven.
- Prefer `mvn -q` for quieter output when you only need pass/fail status.
- When a build fails, scroll to the first `ERROR` block — Maven repeats the
  summary at the bottom but the root cause is usually higher up in the log.
- For Spring Boot apps using an embedded database (e.g. H2), `mvn spring-boot:run`
  is sufficient for local testing — no separate DB setup needed.

Use `$ARGUMENTS` as additional Maven flags or goals if the user supplies them,
e.g. `/spring-boot-plugin:maven-helper -Dtest=PatientServiceTest`.
