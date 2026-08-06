# Fraud Transaction Detector

A comprehensive fraud detection system built with Spring Boot backend, machine learning service, and modern frontend.

## Project Structure

```
.
├── backend/          # Spring Boot application
├── frontend/         # Frontend application
├── ml-service/       # Machine learning service
└── docs/            # Documentation
```

## Backend Setup

### Prerequisites
- Java 17+
- PostgreSQL
- Maven

### Configuration
1. Copy `application.properties.template` to `application.properties`
2. Update database credentials in `application.properties`

### Running the Backend
```bash
cd backend/fraud-detector
./mvnw spring-boot:run
```

## License
MIT
