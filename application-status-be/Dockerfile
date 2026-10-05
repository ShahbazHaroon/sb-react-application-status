# --------------------
# Build stage
# --------------------
FROM maven:3.9.9-eclipse-temurin-17 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy only POM files first to leverage Docker cache
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
# If the projects splits into multiple modules, you'll need to copy all child pom.xml files before dependency:go-offline.

# Use Docker build cache for Maven dependencies
# This ensures that ~/.m2 is cached between builds
# Download dependencies as a separate layer — only re-runs when pom.xml changes
RUN --mount=type=cache,target=/root/.m2 mvn dependency:go-offline -B

# Copy full source code and build
COPY src ./src

# Build application
RUN --mount=type=cache,target=/root/.m2 mvn clean package -DskipTests -B

# Get the final JAR name from Maven
RUN echo "Final JAR:" && ls -l target

# --------------------
# Runtime stage
# --------------------
FROM eclipse-temurin:17-jre-jammy AS runtime

#ARG APP_NAME=application-status-be

# curl is used by the compose healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy only the built JAR (avoid copying everything) into the container at /app
COPY --from=builder /app/target/*.jar app.jar

# Run as non-root user
# Create non-root user (use fixed UID/GID for reproducibility)
RUN groupadd -r -g 1001 spring && useradd -r -u 1001 -g spring spring

# Create log directory and set ownership/permissions before switching user
RUN mkdir -p /var/log && \
    chown -R spring:spring /var/log && \
    chmod -R 755 /var/log

# Switch to non-root user
USER spring

# Expose the port your application will run on (change if your app uses different port)
EXPOSE 8080

# Use ENTRYPOINT for immutable command and CMD for arguments
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
CMD []