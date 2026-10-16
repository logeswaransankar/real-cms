# Elysian Estates — REST API Specification

Comprehensive documentation of all public and administrative REST API endpoints in the Elysian Estates platform.

## 1. Authentication & Security Endpoints

### `POST /api/auth/login`
Authenticate administrative staff or agents and receive a stateless JWT Bearer token.

- **Request Body:**
  ```json
  {
    "email": "admin@elysian-estates.com",
    "password": "AdminSecurePass2026!"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Authentication successful",
    "data": {
      "token": "eyJhbGciOiJIUzUxMiJ9...",
      "id": 1,
      "email": "admin@elysian-estates.com",
      "fullName": "Alexander Vance",
      "avatarUrl": "https://images.unsplash.com/...",
      "roles": ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]
    },
    "timestamp": "2026-10-13T19:50:00Z"
  }
  ```

---

## 2. Public Client Endpoints (`/api/public/*`)

### `GET /api/public/settings`
Returns global brand, contact, currency, and SEO key-value pairs.

### `GET /api/public/navigation?location={HEADER|FOOTER}`
Returns active navigation hierarchy for header navbar or footer columns.

### `GET /api/public/pages/{slug}`
Returns CMS page metadata and ordered sections with structured JSON content payloads.

### `GET /api/public/properties`
Search and filter property listings with pagination.
- **Query Parameters:**
  - `transactionType`: `SALE` or `RENT`
  - `propertyType`: `PENTHOUSE`, `VILLA`, `APARTMENT`, `MANSION`
  - `locationId`: filter by district
  - `minPrice`, `maxPrice`: numeric bounds
  - `bedrooms`: minimum bedrooms
  - `page` (default 0), `size` (default 12), `sort` (e.g. `price,desc` or `createdAt,desc`)

### `GET /api/public/properties/featured`
Returns top luxury properties highlighted on the homepage.

### `GET /api/public/properties/{slug}`
Returns complete property profile: specs, gallery, amenities, 3D model GLTF URL, coordinates, and handover dates.

### `GET /api/public/properties/{id}/similar`
Returns up to 3 similar residences in the same district or category.

### `GET /api/public/projects`
Returns masterplan developments (`?featured=true` filter supported).

### `GET /api/public/projects/{slug}`
Returns masterplan development overview, handover year, and developer details.

### `GET /api/public/locations`
Returns prime districts (`?popular=true` filter supported).

### `GET /api/public/blog`
Paginated market intelligence and architectural journal articles.

### `GET /api/public/testimonials`
Returns verified client quotes and endorsements.

### `GET /api/public/team`
Returns executive leadership and senior private brokers directory.

### `POST /api/public/enquiries`
Submit confidential property inquiry.

### `POST /api/public/viewing-requests`
Submit scheduled private VIP chauffeur or helicopter viewing request.

---

## 3. Dynamic CMS & Administration Endpoints (`/api/admin/*`)
*Requires `Authorization: Bearer <token>`*

### Dashboard & Analytics
- `GET /api/admin/dashboard`: Real-time KPI counts (properties, developments, leads, pipeline status).

### Dynamic CMS Pages & Modular Sections
- `GET /api/admin/pages`: List all CMS pages.
- `GET /api/admin/pages/{id}`: Get page by ID with section blocks.
- `PUT /api/admin/pages/{id}`: Update page title, slug, SEO meta tags, and live status.
- `POST /api/admin/pages/{pageId}/sections`: Add modular section block.
- `PUT /api/admin/pages/sections/{sectionId}`: Update section key, JSON content payload, and visibility.
- `DELETE /api/admin/pages/sections/{sectionId}`: Remove section block.
- `POST /api/admin/pages/{pageId}/sections/reorder`: Persist updated sort orders.

### Content Revision History & Rollback
- `GET /api/admin/revisions/{entityType}/{entityId}`: Fetch chronological snapshot revisions.
- `POST /api/admin/revisions/{entityType}/{entityId}`: Create instant named snapshot.

### Properties Catalog Management
- `GET /api/admin/properties`: List all estate records.
- `POST /api/admin/properties`: Publish new luxury listing with 3D models and media.
- `PUT /api/admin/properties/{id}`: Update listing details.
- `DELETE /api/admin/properties/{id}`: Delete property listing.

### Masterplan Developments
- `GET /api/admin/projects`: List all developments.
- `POST /api/admin/projects`: Create development masterplan.
- `PUT /api/admin/projects/{id}`: Update development.
- `DELETE /api/admin/projects/{id}`: Delete development.

### Media & 3D Asset Library
- `GET /api/admin/media`: Retrieve all media library assets.
- `POST /api/admin/media/upload`: Multipart file upload (images, models, floorplans).
- `POST /api/admin/media/register-external`: Register external CDN asset or GLTF URL.
- `DELETE /api/admin/media/{id}`: Remove asset from repository.

### Navigation Builder
- `GET /api/admin/navigation`: List menu links.
- `POST /api/admin/navigation`: Add navigation item.
- `PUT /api/admin/navigation/{id}`: Update navigation link.
- `DELETE /api/admin/navigation/{id}`: Remove navigation item.

### Global Settings
- `GET /api/admin/settings`: Retrieve grouped settings list.
- `PUT /api/admin/settings`: Batch update website configurations.

### Leads & VIP Inquiries
- `GET /api/admin/enquiries`: List all client inquiries.
- `PATCH /api/admin/enquiries/{id}/status`: Update pipeline status and private broker notes.
- `DELETE /api/admin/enquiries/{id}`: Remove inquiry.

### Editorial Journal
- `GET /api/admin/blog`: List all articles.
- `POST /api/admin/blog`: Publish new journal article.
- `PUT /api/admin/blog/{id}`: Update article.
- `DELETE /api/admin/blog/{id}`: Delete article.

### Staff & Role-Based Access Control
- `GET /api/admin/users`: List administrative staff (*Super Admin only*).
- `POST /api/admin/users`: Create staff account and assign roles.
- `PUT /api/admin/users/{id}`: Update staff profile and role permissions.
- `DELETE /api/admin/users/{id}`: Revoke staff access.
