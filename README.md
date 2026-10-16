# Elysian Estates — Ultra-Luxury Real Estate & Interactive 3D Platform with Dynamic CMS

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21%20%2F%2025-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-gold)](#)

> **Elysian Estates** is an original ultra-luxury real estate web application built for the world's most discerning high-net-worth clientele. Inspired by the visual elegance, bespoke property presentation, and spatial fidelity of prime global brokerages, Elysian Estates combines interactive 3D spatial models (Three.js / WebGL) with an enterprise-grade Content Management System (CMS) enabling website owners to manage every page, property, and menu dynamically without code modification.

---

## 🏛️ Key Features

### 1. Immersive User Experience & Visual Identity
- **Original Luxury Brand Aesthetic:** Obsidian black (`#0B0C10`, `#14171F`) and Champagne Gold (`#D4AF37`, `#F3E5AB`, `#E0AA3E`) color palette with elegant serif typography (**Cinzel**) and modern clean sans-serif typography (**Plus Jakarta Sans**).
- **Interactive 3D Spatial Viewer:** Explore architectural properties in real-time 3D using Three.js and React Three Fiber with orbit navigation, wireframe toggle, dynamic lighting environment switchers (Daylight, Golden Hour Sunset, Midnight Studio), and fullscreen inspection.
- **Graceful Photography Fallback:** Automatic zero-layout-shift fallback to ultra-high-resolution architectural photography if 3D hardware acceleration is unavailable.
- **Advanced Luxury Filtering:** Filter penthouses, sky villas, and mansions by district (Palm Jumeirah, Downtown Dubai, Dubai Marina, Emirates Hills), transaction type (Buy / Rent), price range, and bedroom suites.
- **VIP Concierge & Chauffeur Viewing Scheduler:** Integrated booking modals for private helicopter or limousine tour appointments.

### 2. Fully Dynamic Content Management System (CMS)
Accessible via the secured administrative portal at `/admin`:
- **Dynamic Page Builder (`/admin/pages`):** Add, edit, toggle, reorder, and configure modular section blocks (Hero 3D banners, showcases, metrics, split narratives) across public pages with instant preview.
- **Revisions & Version Rollback:** Save named snapshot revisions and review chronological revision logs.
- **Luxury Properties Catalog (`/admin/properties`):** Tabbed property creation with specs, 3D GLTF URLs, floorplans, coordinates, and amenity pills.
- **Masterplan Developments (`/admin/projects`):** Manage branded off-plan communities, handover years, starting prices, and developer portfolios.
- **Centralized Media Library (`/admin/media`):** Media repository supporting images, 3D GLTF/GLB models, video walkthroughs, and PDFs with 1-click URL copying.
- **Navigation Menu Builder (`/admin/navigation`):** Reorder and customize header navbar and multi-column footer menus in real time.
- **Global Settings (`/admin/settings`):** Live configuration of site name, tagline, brand accent colors, VIP phone numbers, currencies (AED, USD, EUR, GBP), and SEO meta defaults.
- **VIP Inquiries & CRM Pipeline (`/admin/enquiries`):** Track high-net-worth leads across pipeline states (`NEW`, `CONTACTED`, `QUALIFIED`, `VIEWING_SCHEDULED`, `CLOSED`) with private agent notes.
- **Editorial Journal (`/admin/blog`):** Publish luxury real estate market forecasts and architectural spotlights.
- **Role-Based Access Control (`/admin/users`):** Granular security enforcement across `ROLE_SUPER_ADMIN`, `ROLE_ADMIN`, `ROLE_CONTENT_MANAGER`, and `ROLE_AGENT`.

---

## 📂 Project Architecture

```
realestate-platform/
├── backend/                             # Spring Boot 3 Java Application
│   ├── src/main/java/com/realestate/aura/
│   │   ├── auth/                        # JWT authentication & login endpoints
│   │   ├── blog/                        # Journal articles & categories
│   │   ├── cms/                         # Revision snapshots & rollback
│   │   ├── common/                      # Response DTOs & public content API
│   │   ├── config/                      # Security, CORS, and OpenAPI config
│   │   ├── dashboard/                   # Real-time KPI statistics API
│   │   ├── developer/                   # Master developers
│   │   ├── enquiry/                     # VIP inquiries & viewing requests
│   │   ├── exception/                   # Global exception handling advice
│   │   ├── location/                    # Districts and prime locations
│   │   ├── media/                       # Media asset library
│   │   ├── navigation/                  # Header & footer menus
│   │   ├── page/                        # CMS pages & section blocks
│   │   ├── project/                     # Developments & masterplans
│   │   ├── property/                    # Luxury property catalog & 3D models
│   │   ├── security/                    # JWT filters & Spring Security config
│   │   ├── settings/                    # Global website settings
│   │   └── user/                        # Staff & RBAC permissions
│   ├── src/main/resources/
│   │   ├── db/migration/                # Flyway V1 (Schema) & V2 (Seed Data)
│   │   ├── application.yml              # Base Spring configuration
│   │   ├── application-dev.yml          # H2 MySQL-compatibility mode
│   │   └── application-mysql.yml        # Production MySQL 8.0 configuration
│   └── pom.xml                          # Maven build dependencies
├── frontend/                            # React 19 + TypeScript + Vite SPA
│   ├── src/
│   │   ├── admin/                       # CMS administrative suites
│   │   ├── components/                  # 3D viewers, layout, property cards
│   │   ├── context/                     # AuthContext & SettingsContext
│   │   ├── pages/                       # Public client pages (Home, Listings, etc.)
│   │   ├── services/                    # Typed REST API client
│   │   └── types/                       # Shared TypeScript definitions
│   ├── package.json
│   ├── vite.config.ts                   # Vite & proxy configuration
│   └── tsconfig.app.json                # TypeScript compiler options
├── database/
│   └── init.sql                         # Standalone MySQL 8.0 DDL schema
├── docs/
│   ├── ARCHITECTURE.md                  # Comprehensive architectural blueprints
│   ├── API_DOCUMENTATION.md             # Complete REST API specification
│   └── DEPLOYMENT_GUIDE.md              # Production deployment & Docker guide
├── docker-compose.yml                   # Multi-container orchestration
└── README.md
```

---

## ⚡ Quickstart (Zero-Setup Development)

The backend includes an embedded H2 database configured in **MySQL Compatibility Mode** (`MODE=MySQL`), requiring **no external database server** to run immediately.

### 1. Start Backend
```powershell
cd backend
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```
The backend initializes on `http://localhost:8080` with automatic Flyway schema generation and pre-seeded luxury listings, CMS sections, and administrator accounts.
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **H2 Console:** `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:realestate_db;MODE=MySQL`)

### 2. Start Frontend
```powershell
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔐 Pre-Seeded Administrative Credentials

| Account Role | Email | Password | Scope |
|---|---|---|---|
| **Super Admin** | `admin@elysian-estates.com` | `AdminSecurePass2026!` | Complete platform control, staff & RBAC |
| **Content Manager** | `editor@elysian-estates.com` | `AdminSecurePass2026!` | Page Builder, revisions, journal, media |
| **Private Broker** | `agent@elysian-estates.com` | `AdminSecurePass2026!` | Properties view, inquiries CRM, viewings |

Administrative Portal URL: `http://localhost:5173/admin` (or `/admin/login`)

---

## 🐳 Docker Compose Deployment

To deploy the entire production stack (MySQL 8.0 + Spring Boot 3 + NGINX React SPA):

```bash
docker compose up -d --build
```

- **Frontend Application:** `http://localhost:5173` (or `http://localhost` if using standard NGINX port 80)
- **Backend API:** `http://localhost:8080/api`
- **MySQL Database:** `localhost:3306` (`realestate_db` / `realestate_user`)

---

## 🧪 Acceptance Testing & Verification

1. **Public Exploration:**
   - Navigate to `/` to view the ambient 3D geometric pavilion, live CMS banner, and featured estates.
   - Go to `/properties` and filter by "PENTHOUSE" or sort by price.
   - Click on *"The Celestial Sky Villa"* (`/properties/the-celestial-sky-villa`) to launch the interactive 3D spatial viewer. Rotate the camera, switch lighting to "Golden Hour", and toggle wireframe mode.
   - Submit a private viewing request using the VIP tour modal.
2. **CMS Governance (`/admin`):**
   - Log in using `admin@elysian-estates.com` / `AdminSecurePass2026!`.
   - Access **Page Builder (`/admin/pages`)**; reorder sections or edit the JSON payload and observe instant updates on the public page.
   - Open **Properties (`/admin/properties`)** to add or edit luxury residences.
   - Review leads in **Enquiries & Leads (`/admin/enquiries`)** and update pipeline statuses to `QUALIFIED`.
   - Adjust global site branding or currency in **Global Settings (`/admin/settings`)**.
