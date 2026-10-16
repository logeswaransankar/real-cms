-- ============================================================================
-- ELYSIAN ESTATES - ULTRA-LUXURY REAL ESTATE PLATFORM
-- DATABASE INITIALIZATION & SCHEMA DDL (MySQL 8.0+)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS realestate_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE realestate_db;

-- 1. Security & RBAC
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    avatar_url VARCHAR(500),
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

-- 2. Locations & Developers
CREATE TABLE IF NOT EXISTS locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    city VARCHAR(100) NOT NULL DEFAULT 'Dubai',
    country VARCHAR(100) NOT NULL DEFAULT 'United Arab Emirates',
    description TEXT,
    hero_image VARCHAR(500),
    is_popular BOOLEAN DEFAULT FALSE,
    property_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS developers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    logo_url VARCHAR(500),
    description TEXT,
    website_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Projects & Developments
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    developer_id BIGINT,
    location_id BIGINT,
    starting_price DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'AED',
    completion_date VARCHAR(50),
    completion_year INT,
    status VARCHAR(50) DEFAULT 'UNDER_CONSTRUCTION',
    description LONGTEXT,
    short_description VARCHAR(500),
    hero_image VARCHAR(500),
    featured_image_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    amenities_json JSON,
    payment_plan_json JSON,
    unit_types_json JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_dev FOREIGN KEY (developer_id) REFERENCES developers (id) ON DELETE SET NULL,
    CONSTRAINT fk_project_loc FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE SET NULL
);

-- 4. Amenities Catalog
CREATE TABLE IF NOT EXISTS amenities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(100),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Properties & Real Estate Listings
CREATE TABLE IF NOT EXISTS properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    slug VARCHAR(250) NOT NULL UNIQUE,
    reference_number VARCHAR(50) NOT NULL UNIQUE,
    description LONGTEXT,
    short_description VARCHAR(500),
    price DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'AED',
    transaction_type VARCHAR(20) DEFAULT 'SALE',
    property_type VARCHAR(50) NOT NULL,
    location_id BIGINT,
    developer_id BIGINT,
    project_id BIGINT,
    address VARCHAR(300),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    built_up_area_sqft DECIMAL(10,2) NOT NULL,
    plot_area_sqft DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'PUBLISHED',
    furnishing_status VARCHAR(50) DEFAULT 'FURNISHED',
    handover_date VARCHAR(50),
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT TRUE,
    is_archived BOOLEAN DEFAULT FALSE,

    -- Interactive 3D Spatial Viewer fields
    model3d_url VARCHAR(500),
    model3d_enabled BOOLEAN DEFAULT FALSE,
    model3d_type VARCHAR(50) DEFAULT 'GLTF_GLB',
    model3d_title VARCHAR(200),
    model3d_camera_preset VARCHAR(100),
    model3d_lighting_preset VARCHAR(100),
    featured_image_url VARCHAR(500),
    fallback_image_url VARCHAR(500),
    virtual_tour_url VARCHAR(500),
    video_url VARCHAR(500),
    floorplan_url VARCHAR(500),

    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_prop_loc FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE SET NULL,
    CONSTRAINT fk_prop_dev FOREIGN KEY (developer_id) REFERENCES developers (id) ON DELETE SET NULL,
    CONSTRAINT fk_prop_proj FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS property_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    caption VARCHAR(255),
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prop_img FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS property_amenities (
    property_id BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,
    PRIMARY KEY (property_id, amenity_id),
    CONSTRAINT fk_pa_prop FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
    CONSTRAINT fk_pa_amen FOREIGN KEY (amenity_id) REFERENCES amenities (id) ON DELETE CASCADE
);

-- 6. Dynamic CMS Pages & Modular Sections
CREATE TABLE IF NOT EXISTS pages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    og_image VARCHAR(500),
    is_published BOOLEAN DEFAULT TRUE,
    version INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS page_sections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    page_id BIGINT NOT NULL,
    section_key VARCHAR(100) NOT NULL,
    section_type VARCHAR(50) NOT NULL,
    title VARCHAR(250),
    subtitle VARCHAR(250),
    content_json LONGTEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    background_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_section_page FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE
);

-- 7. CMS Revisions & Rollback History
CREATE TABLE IF NOT EXISTS content_revisions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    version_number INT NOT NULL,
    title VARCHAR(200),
    snapshot_json LONGTEXT NOT NULL,
    created_by_name VARCHAR(150),
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Media Library Assets
CREATE TABLE IF NOT EXISTS media_assets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) DEFAULT 'IMAGE',
    mime_type VARCHAR(100),
    file_size BIGINT,
    alt_text VARCHAR(255),
    caption VARCHAR(255),
    folder VARCHAR(100) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Navigation Menus
CREATE TABLE IF NOT EXISTS navigation_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    menu_location VARCHAR(30) NOT NULL DEFAULT 'HEADER',
    label VARCHAR(100) NOT NULL,
    path VARCHAR(255) NOT NULL,
    parent_id BIGINT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_external BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Global Website Settings
CREATE TABLE IF NOT EXISTS website_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value LONGTEXT,
    setting_group VARCHAR(50) DEFAULT 'GENERAL',
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 11. VIP Inquiries & Private Viewings
CREATE TABLE IF NOT EXISTS enquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    message LONGTEXT NOT NULL,
    enquiry_type VARCHAR(50) DEFAULT 'PROPERTY_INQUIRY',
    property_id BIGINT,
    project_id BIGINT,
    status VARCHAR(50) DEFAULT 'NEW',
    admin_notes LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_enq_prop FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE SET NULL,
    CONSTRAINT fk_enq_proj FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE SET NULL
);

-- 12. Editorial Journal & Blog
CREATE TABLE IF NOT EXISTS blog_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    slug VARCHAR(250) NOT NULL UNIQUE,
    excerpt VARCHAR(500),
    content LONGTEXT NOT NULL,
    featured_image_url VARCHAR(500),
    author_name VARCHAR(150) DEFAULT 'Elysian Editorial Team',
    category_id BIGINT,
    read_time_minutes INT DEFAULT 5,
    is_published BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_blog_cat FOREIGN KEY (category_id) REFERENCES blog_categories (id) ON DELETE SET NULL
);

-- Indexes for ultra-fast luxury search & filtering
CREATE INDEX idx_prop_slug ON properties (slug);
CREATE INDEX idx_prop_price ON properties (price);
CREATE INDEX idx_prop_type ON properties (property_type);
CREATE INDEX idx_prop_status ON properties (status);
CREATE INDEX idx_page_slug ON pages (slug);
CREATE INDEX idx_proj_slug ON projects (slug);
