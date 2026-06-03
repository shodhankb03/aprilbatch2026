# Builder stage
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app
COPY HelloWorldServer.java ./
RUN javac HelloWorldServer.java

# Runtime stage
FROM eclipse-temurin:17-jre AS runtime
WORKDIR /app
COPY --from=builder /app/*.class ./
EXPOSE 8080
CMD ["java", "HelloWorldServer"]
