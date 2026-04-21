FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml first
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy source
COPY src src

# Build jar
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy jar
COPY --from=builder /app/target/*.jar app.jar

# Render uses dynamic port
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
