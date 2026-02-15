# Build Stage
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app
COPY . .
# Skip tests to speed up build and avoid environment dependency issues during build
RUN sed -i 's/\r$//' gradlew
RUN chmod +x gradlew
RUN ./gradlew clean build -x test

# Run Stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the port
EXPOSE 8080

# Environment variables should be passed at runtime using -e or env file
# ENTRYPOINT assumes PORT env var is handled by Render or defaults to 8080 in app
ENTRYPOINT ["java", "-jar", "app.jar"]
