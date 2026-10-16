-- V1__init_schema.sql: Elysian Real Estate Schema

CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

CREATE TABLE locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'United Arab Emirates',
    description TEXT,
    hero_image VARCHAR(500),
    is_popular BOOLEAN DEFAULT FALSE,
    property_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE developers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    logo_url VARCHAR(500),
    description TEXT,
    website_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    developer_id BIGINT,
    location_id BIGINT,
    starting_price DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'AED',
    completion_date VARCHAR(50),
    status VARCHAR(50) DEFAULT 'OFF_PLAN',
    description TEXT,
    hero_image VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    amenities_json TEXT,
    payment_plan_json TEXT,
    unit_types_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_projects_developer FOREIGN KEY (developer_id) REFERENCES developers (id) ON DELETE SET NULL,
    CONSTRAINT fk_projects_location FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE SET NULL
);

CREATE TABLE project_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    is_cover BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_project_images_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

CREATE TABLE amenities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(100) DEFAULT 'check',
    category VARCHAR(50) DEFAULT 'General'
);

CREATE TABLE properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    reference_number VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'AED',
    transaction_type VARCHAR(20) NOT NULL DEFAULT 'BUY', -- BUY, RENT
    property_type VARCHAR(50) NOT NULL, -- APARTMENT, PENTHOUSE, VILLA, TOWNHOUSE, DUPLEX
    location_id BIGINT,
    developer_id BIGINT,
    project_id BIGINT,
    address VARCHAR(255),
    bedrooms INT NOT NULL DEFAULT 1,
    bathrooms INT NOT NULL DEFAULT 1,
    area_sqft DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'READY', -- READY, OFF_PLAN
    furnished_status VARCHAR(30) DEFAULT 'FURNISHED', -- FURNISHED, SEMI_FURNISHED, UNFURNISHED
    completion_date VARCHAR(50),
    payment_plan VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    is_archived BOOLEAN DEFAULT FALSE,
    
    -- 3D Interactive Configuration
    model_3d_url VARCHAR(500),
    model_3d_enabled BOOLEAN DEFAULT FALSE,
    model_3d_title VARCHAR(150),
    model_3d_camera_preset VARCHAR(50) DEFAULT 'FRONT_ELEVATION',
    model_3d_lighting_preset VARCHAR(50) DEFAULT 'GOLDEN_HOUR',
    fallback_image_url VARCHAR(500),
    
    video_url VARCHAR(500),
    tour_360_url VARCHAR(500),
    floor_plans_json TEXT,
    nearby_landmarks_json TEXT,
    
    -- SEO Metadata
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    canonical_url VARCHAR(500),
    og_image VARCHAR(500),
    views_count BIGINT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_properties_location FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE SET NULL,
    CONSTRAINT fk_properties_developer FOREIGN KEY (developer_id) REFERENCES developers (id) ON DELETE SET NULL,
    CONSTRAINT fk_properties_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE SET NULL
);

CREATE TABLE property_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    is_cover BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_property_images_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
);

CREATE TABLE property_amenities (
    property_id BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,
    PRIMARY KEY (property_id, amenity_id),
    CONSTRAINT fk_prop_amenities_prop FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
    CONSTRAINT fk_prop_amenities_amenity FOREIGN KEY (amenity_id) REFERENCES amenities (id) ON DELETE CASCADE
);

CREATE TABLE pages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    og_image VARCHAR(500),
    is_published BOOLEAN DEFAULT TRUE,
    version INT DEFAULT 1,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE page_sections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    page_id BIGINT NOT NULL,
    section_type VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    content_json LONGTEXT,
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    background_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_page_sections_page FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE
);

CREATE TABLE content_revisions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- PAGE, PROPERTY, SETTINGS
    entity_id BIGINT NOT NULL,
    revision_number INT NOT NULL,
    title VARCHAR(255),
    snapshot_json LONGTEXT NOT NULL,
    created_by VARCHAR(150),
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE media_assets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- IMAGE, VIDEO, MODEL_3D, DOCUMENT
    mime_type VARCHAR(100),
    file_size BIGINT,
    dimensions VARCHAR(50),
    alt_text VARCHAR(255),
    caption VARCHAR(255),
    folder VARCHAR(100) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE navigation_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    menu_location VARCHAR(30) NOT NULL DEFAULT 'HEADER', -- HEADER, FOOTER
    label VARCHAR(100) NOT NULL,
    path VARCHAR(255) NOT NULL,
    parent_id BIGINT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_external BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_nav_parent FOREIGN KEY (parent_id) REFERENCES navigation_items (id) ON DELETE CASCADE
);

CREATE TABLE website_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value LONGTEXT,
    setting_group VARCHAR(50) DEFAULT 'GENERAL',
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    enquiry_type VARCHAR(50) DEFAULT 'GENERAL', -- GENERAL, PROPERTY_INQUIRY, PROJECT_INQUIRY, VIEWING_REQUEST
    property_id BIGINT,
    project_id BIGINT,
    status VARCHAR(30) DEFAULT 'NEW', -- NEW, CONTACTED, QUALIFIED, CLOSED
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_enquiries_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE SET NULL,
    CONSTRAINT fk_enquiries_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE SET NULL
);

CREATE TABLE viewing_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    enquiry_id BIGINT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(50) NOT NULL,
    viewing_type VARCHAR(30) DEFAULT 'IN_PERSON', -- IN_PERSON, VIDEO_CALL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_viewing_enquiry FOREIGN KEY (enquiry_id) REFERENCES enquiries (id) ON DELETE CASCADE
);

CREATE TABLE blog_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blog_posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category_id BIGINT,
    summary VARCHAR(500),
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(500),
    author_name VARCHAR(150) DEFAULT 'Editorial Team',
    author_avatar VARCHAR(500),
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    views_count BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_blog_category FOREIGN KEY (category_id) REFERENCES blog_categories (id) ON DELETE SET NULL
);

CREATE TABLE testimonials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(150) NOT NULL,
    author_title VARCHAR(150),
    company VARCHAR(150),
    quote TEXT NOT NULL,
    avatar_url VARCHAR(500),
    rating INT DEFAULT 5,
    is_featured BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    role_title VARCHAR(150) NOT NULL,
    bio TEXT,
    photo_url VARCHAR(500),
    email VARCHAR(150),
    phone VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favourites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    session_id VARCHAR(100),
    property_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_fav_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(150),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices for rapid querying and search
CREATE INDEX idx_properties_slug ON properties (slug);
CREATE INDEX idx_properties_status ON properties (status);
CREATE INDEX idx_properties_type ON properties (property_type);
CREATE INDEX idx_properties_price ON properties (price);
CREATE INDEX idx_properties_location ON properties (location_id);
CREATE INDEX idx_pages_slug ON pages (slug);
CREATE INDEX idx_enquiries_status ON enquiries (status);
