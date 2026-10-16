# Elysian Estates — Production Deployment Guide

## 1. Overview
This guide provides complete instructions for building, containerizing, and deploying the **Elysian Estates** platform across on-premise servers, cloud Virtual Machines (AWS EC2, GCP Compute Engine, Azure VM), or Docker Swarm/Kubernetes environments.

---

## 2. Environment Prerequisites
- **Java Virtual Machine:** Java 21 or Java 25 LTS (OpenJDK / Eclipse Temurin)
- **Node.js Runtime:** Node.js v20+ LTS & npm 10+
- **Database Engine:** MySQL 8.0+ (or AWS Aurora MySQL)
- **Containerization (Optional):** Docker 24+ and Docker Compose v2+

---

## 3. Configuration Profiles

### 3.1 Spring Boot Application Profiles
1. **`dev` (Zero-Setup Development):**
   - Automatically uses H2 in MySQL-compatibility mode (`MODE=MySQL`).
   - Requires zero external database installation.
   - Automatically runs Flyway migrations `V1` and `V2` (seeds complete luxury demo portfolio and CMS content).
2. **`mysql` (Production Database):**
   - Connects to dedicated MySQL 8.0 instance.
   - Configured via environment variables:
     ```env
     SPRING_PROFILES_ACTIVE=mysql
     DB_HOST=localhost
     DB_PORT=3306
     DB_NAME=realestate_db
     DB_USERNAME=root
     DB_PASSWORD=your_secure_password
     JWT_SECRET=c2VjdXJlX2VseXNpYW5fZXN0YXRlc19sdXh1cnlfcmVhbF9lc3RhdGVfdG9rZW5fa2V5XzIwMjZfcHJvZHVjdGlvbl81MTJiaXQ=
     ```

---

## 4. Building Production Artifacts

### 4.1 Backend Build (JAR)
From the repository root:
```bash
cd backend
mvn clean package -DskipTests
```
The resulting executable JAR will be located at:
`backend/target/aura-0.0.1-SNAPSHOT.jar`

### 4.2 Frontend Build (Static Bundle)
From the repository root:
```bash
cd frontend
npm install
npm run build
```
The optimized production bundle will be generated in `frontend/dist/`.

---

## 5. Running with Docker & Docker Compose

### 5.1 Docker Compose Specification (`docker-compose.yml`)
The platform includes a root `docker-compose.yml` providing a complete 3-tier production topology:
1. **`db`:** MySQL 8.0 with persistent storage volume and healthcheck.
2. **`backend`:** Spring Boot 3 running on Java 21/25 with wait-for-database dependencies.
3. **`frontend`:** NGINX Alpine serving the static Vite bundle with reverse proxy forwarding `/api` to the Spring Boot container.

### 5.2 Start the Stack
```bash
docker compose up -d --build
```
- Public Website & Admin Portal: `http://localhost`
- Backend Direct: `http://localhost:8080`
- Swagger UI Documentation: `http://localhost:8080/swagger-ui.html`

---

## 6. Seed Credentials for Initial Access

Once deployed, the database automatically includes pre-seeded accounts:

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `admin@elysian-estates.com` | `AdminSecurePass2026!` |
| **Content Manager** | `editor@elysian-estates.com` | `AdminSecurePass2026!` |
| **Private Broker** | `agent@elysian-estates.com` | `AdminSecurePass2026!` |

> **Security Advisory:** After initial deployment in a public production environment, immediately log in to `/admin` and change the Super Admin password via the Staff & Roles manager or directly in the database.
