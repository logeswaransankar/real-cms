-- V2__seed_initial_data.sql: Realistic Seed Data for Elysian Real Estate

-- 1. Roles
INSERT INTO roles (name, description) VALUES
('ROLE_SUPER_ADMIN', 'Full system access and security administration'),
('ROLE_ADMIN', 'Website operations and content management'),
('ROLE_CONTENT_EDITOR', 'Manage pages, articles, and media assets'),
('ROLE_PROPERTY_MANAGER', 'Manage property listings, projects, and client enquiries');

-- 2. Users (BCrypt hash for 'AdminSecurePass2026!')
-- Hash: $2a$10$lPoOCcMBFsjsmKU8RfbOS.mG5RcJrSaWhzAuoUT2A7kugyvMh9PgC
INSERT INTO users (email, password, full_name, avatar_url, is_active) VALUES
('admin@elysian-estates.com', '$2a$10$lPoOCcMBFsjsmKU8RfbOS.mG5RcJrSaWhzAuoUT2A7kugyvMh9PgC', 'Lord Alexander Sterling', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', TRUE),
('editor@elysian-estates.com', '$2a$10$lPoOCcMBFsjsmKU8RfbOS.mG5RcJrSaWhzAuoUT2A7kugyvMh9PgC', 'Elena Rostova', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80', TRUE),
('agent@elysian-estates.com', '$2a$10$lPoOCcMBFsjsmKU8RfbOS.mG5RcJrSaWhzAuoUT2A7kugyvMh9PgC', 'Tariq Al-Mansoor', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', TRUE);

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4);

-- 3. Locations
INSERT INTO locations (name, slug, city, country, description, hero_image, is_popular, property_count) VALUES
('Downtown Dubai', 'downtown-dubai', 'Dubai', 'United Arab Emirates', 'The vibrant epicentre of luxury living, featuring the Burj Khalifa, Dubai Mall, and world-class opera.', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', TRUE, 4),
('Palm Jumeirah', 'palm-jumeirah', 'Dubai', 'United Arab Emirates', 'The world-famed archipelago island offering bespoke beachfront villas, private marinas, and royal residences.', 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80', TRUE, 3),
('Dubai Marina', 'dubai-marina', 'Dubai', 'United Arab Emirates', 'Riviera-style waterfront promenades flanked by soaring residential skyscrapers and luxury yachts.', 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1200&q=80', TRUE, 2),
('Dubai Hills Estate', 'dubai-hills-estate', 'Dubai', 'United Arab Emirates', 'The green heart of Dubai, blending championship 18-hole golf courses with contemporary architectural mansions.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', TRUE, 2),
('City Walk & Al Wasl', 'city-walk-al-wasl', 'Dubai', 'United Arab Emirates', 'An exclusive urban sanctuary surrounded by lush private parklands, curated cafes, and contemporary low-rise pavilions.', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', TRUE, 2);

-- 4. Developers
INSERT INTO developers (name, slug, logo_url, description, website_url) VALUES
('Meraas Holding', 'meraas', 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80', 'Renowned master creator of urban waterfront and park destinations like City Walk, Bluewaters, and BVLGARI Residences.', 'https://meraas.ae'),
('Omniyat', 'omniyat', 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80', 'Pioneering ultra-luxury architectural masterpieces designed by Pritzker-prize winning architects.', 'https://omniyat.com'),
('Emaar Properties', 'emaar', 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80', 'Global icon behind Downtown Dubai, Dubai Hills Estate, and world-renowned skyline destinations.', 'https://emaar.com');

-- 5. Projects
INSERT INTO projects (name, slug, developer_id, location_id, starting_price, currency, completion_date, status, description, hero_image, is_featured, is_published, amenities_json, payment_plan_json, unit_types_json) VALUES
('Castleton at Central Park', 'castleton-central-park', 1, 5, 2850000.00, 'AED', 'Q3 2026', 'OFF_PLAN', 'Castleton at Central Park in City Walk offers panoramic green park views with lush hanging gardens, state-of-the-art wellness clubs, and seamless indoor-outdoor terrace living.', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80', TRUE, TRUE, '["Infinity Pool", "Central Park Access", "Dog Park", "Tennis & Squash Courts", "Private Spa"]', '{"downPayment": "20%", "duringConstruction": "50%", "onHandover": "30%"}', '["1 Bedroom (820 sq.ft)", "2 Bedrooms (1,340 sq.ft)", "3 Bedrooms (2,100 sq.ft)", "4 Bedroom Penthouse (3,800 sq.ft)"]'),
('The Lana Residences, Dorchester Collection', 'the-lana-residences', 2, 1, 18500000.00, 'AED', 'Ready to Move', 'READY', 'Managed by Dorchester Collection, offering bespoke luxury on the Marasi Bay Marina with private boat docks and Michelin-starred dining services.', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', TRUE, TRUE, '["Dorchester Concierge", "Private Marina Berth", "Rooftop Infinity Lounge", "Sommelier Cellar"]', '{"onBooking": "100% Cash / Mortgage Ready"}', '["3 Bedroom Residence", "4 Bedroom Duplex", "5 Bedroom Sky Palace"]'),
('Golf Grand Residences', 'golf-grand-residences', 3, 4, 3400000.00, 'AED', 'Q1 2027', 'OFF_PLAN', 'Commanding frontline vistas over the championship 18-hole golf course with infinity lagoon pools and exclusive residents clubhouses.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', TRUE, TRUE, '["Championship Golf Course", "Lagoon Pool", "Outdoor Cinema", "Clubhouse Gym"]', '{"downPayment": "10%", "duringConstruction": "70%", "onHandover": "20%"}', '["1 Bedroom Luxury", "2 Bedroom Golf View", "3 Bedroom Executive"]');

-- 6. Amenities
INSERT INTO amenities (name, slug, icon, category) VALUES
('Private Infinity Pool', 'private-infinity-pool', 'waves', 'Wellness'),
('24/7 Royal Concierge', '24-7-royal-concierge', 'bell', 'Services'),
('Private Elevator', 'private-elevator', 'arrow-up-circle', 'Luxury'),
('Smart Home Automation', 'smart-home-automation', 'cpu', 'Technology'),
('Panoramic Skyline View', 'panoramic-skyline-view', 'eye', 'Views'),
('Private Spa & Hammam', 'private-spa-hammam', 'sparkles', 'Wellness'),
('Temperature-Controlled Wine Cellar', 'wine-cellar', 'wine', 'Luxury'),
('Private Cinema Room', 'private-cinema-room', 'film', 'Entertainment'),
('Direct Beach Access', 'direct-beach-access', 'sun', 'Lifestyle'),
('Championship Golf Course', 'golf-course', 'flag', 'Sports'),
('Private Helipad Access', 'helipad-access', 'shield', 'Exclusive'),
('Valet Parking', 'valet-parking', 'car', 'Services');

-- 7. Properties (12 Sample Properties with 3D model configuration)
INSERT INTO properties (
    title, slug, reference_number, description, price, currency, transaction_type, property_type,
    location_id, developer_id, project_id, address, bedrooms, bathrooms, area_sqft, status, furnished_status,
    completion_date, payment_plan, is_featured, is_published,
    model_3d_url, model_3d_enabled, model_3d_title, model_3d_camera_preset, model_3d_lighting_preset,
    fallback_image_url, video_url, tour_360_url,
    meta_title, meta_description, canonical_url, og_image
) VALUES
(
    'The Sky Penthouse at Castleton, City Walk',
    'sky-penthouse-castleton-city-walk',
    'ELY-CW-001',
    'A crowning architectural jewel overlooking the lush private canopies of Central Park and the dazzling Downtown skyline. Featuring double-height 7-metre ceilings, Italian Calacatta marble finishes, seamless wraparound glass terraces, and a private sky pool with glass cantilevered edges. Inspired by nature and crafted for the global connoisseur.',
    12850000.00, 'AED', 'BUY', 'PENTHOUSE',
    5, 1, 1, 'Building 2, Central Park, City Walk, Al Wasl, Dubai', 4, 5, 4250.00, 'OFF_PLAN', 'FURNISHED',
    'Q3 2026', '60/40 Post-Handover Payment Plan', TRUE, TRUE,
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', TRUE, 'Interactive 3D Architectural Pavilion', 'FRONT_ELEVATION', 'GOLDEN_HOUR',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'https://www.youtube.com/watch?v=ScMzIvxBSi4', 'https://my.matterport.com/show/?m=sample',
    'Sky Penthouse at Castleton | Elysian Estates',
    'Ultra-luxury 4-bedroom sky penthouse in City Walk with private pool and park views.',
    'https://elysian-estates.com/properties/sky-penthouse-castleton-city-walk',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
),
(
    'Bespoke Oceanfront Villa on Palm Jumeirah Frond G',
    'bespoke-oceanfront-villa-palm-jumeirah',
    'ELY-PJ-002',
    'Situated on the prestigious Billionaires Row on Palm Jumeirah, this custom signature mansion commands 120 feet of private white sand beach. Designed by SAOTA, it showcases organic basalt stone, full glass pocket doors, infinity edge lap pool, and a private yacht mooring facility.',
    65000000.00, 'AED', 'BUY', 'VILLA',
    2, 2, NULL, 'Frond G, Palm Jumeirah, Dubai', 6, 8, 14200.00, 'READY', 'FURNISHED',
    'Ready to Move', 'Direct Bank Transfer / Crypto Accepted', TRUE, TRUE,
    NULL, FALSE, 'Bespoke Palm Villa 3D Tour', 'AERIAL_VIEW', 'STUDIO',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    'https://www.youtube.com/watch?v=ScMzIvxBSi4', NULL,
    'Palm Jumeirah Oceanfront Villa | Elysian Estates',
    'Rare 6-bedroom custom beachfront mansion on Palm Jumeirah with private marina berth.',
    'https://elysian-estates.com/properties/bespoke-oceanfront-villa-palm-jumeirah',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
),
(
    'The Lana Residences Duplex by Dorchester',
    'the-lana-residences-duplex-dorchester',
    'ELY-DT-003',
    'An elite waterfront duplex residence on Marasi Bay Canal. Managed directly by the Dorchester Collection with 24-hour white glove butler service, private chef on call, Valcucine kitchen cabinetry, and panoramic vistas of the Burj Khalifa reflection on the water.',
    28900000.00, 'AED', 'BUY', 'DUPLEX',
    1, 2, 2, 'Marasi Drive, Downtown Canal District, Dubai', 4, 5, 6800.00, 'READY', 'FURNISHED',
    'Ready', 'Standard 100% On Transfer', TRUE, TRUE,
    NULL, FALSE, NULL, 'FRONT_ELEVATION', 'GOLDEN_HOUR',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    NULL, NULL,
    'Dorchester Duplex at The Lana | Elysian Estates',
    'Exclusive 4-bedroom duplex serviced by Dorchester Collection with private marina access.',
    'https://elysian-estates.com/properties/the-lana-residences-duplex-dorchester',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
),
(
    'Fairway View Contemporary Mansion at Dubai Hills',
    'fairway-view-mansion-dubai-hills',
    'ELY-DH-004',
    'Perched gracefully on the 18th hole of Dubai Hills championship golf course, this modern minimalist mansion incorporates zen courtyards, subterranean car gallery for 6 supercars, private cinema, and lush olive tree lightwells.',
    42000000.00, 'AED', 'BUY', 'VILLA',
    4, 3, NULL, 'Fairway Vistas, Dubai Hills Estate, Dubai', 6, 7, 11500.00, 'READY', 'SEMI_FURNISHED',
    'Ready', 'Mortgage Eligible', TRUE, TRUE,
    NULL, FALSE, NULL, 'FRONT_ELEVATION', 'ARCHITECTURAL_SUN',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    NULL, NULL,
    'Dubai Hills Fairway Mansion | Elysian Estates',
    'Ultra-luxury 6-bedroom golf mansion in Dubai Hills Estate with 6-car subterranean gallery.',
    'https://elysian-estates.com/properties/fairway-view-mansion-dubai-hills',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
),
(
    'High-Floor Marina Promenade Penthouse',
    'marina-promenade-penthouse',
    'ELY-DM-005',
    'Perched above the superyacht berths of Dubai Marina, this 3-bedroom corner penthouse offers 270-degree nautical vistas, wrap-around sunset decking, private jacuzzi, and smart biometric access.',
    8900000.00, 'AED', 'BUY', 'PENTHOUSE',
    3, 3, NULL, 'Marina Promenade Tower, Dubai Marina', 3, 4, 3100.00, 'READY', 'FURNISHED',
    'Ready', 'Cash / Mortgage', FALSE, TRUE,
    NULL, FALSE, NULL, 'FRONT_ELEVATION', 'GOLDEN_HOUR',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    NULL, NULL,
    'Dubai Marina Promenade Penthouse | Elysian Estates',
    'Panoramic 3-bedroom penthouse overlooking superyachts in Dubai Marina.',
    'https://elysian-estates.com/properties/marina-promenade-penthouse',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
),
(
    'Designer Garden Apartment at City Walk Central Park',
    'designer-garden-apartment-city-walk',
    'ELY-CW-006',
    'Step directly from your private outdoor dining terrace onto the rolling manicured lawns of Central Park. High ceilings, Gaggenau kitchen appliances, and bespoke lighting fixtures throughout.',
    3450000.00, 'AED', 'BUY', 'APARTMENT',
    5, 1, 1, 'Building 1, Central Park, City Walk, Al Wasl, Dubai', 2, 3, 1550.00, 'OFF_PLAN', 'FURNISHED',
    'Q3 2026', '50/50 Payment Plan', FALSE, TRUE,
    NULL, FALSE, NULL, 'FRONT_ELEVATION', 'STUDIO',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    NULL, NULL,
    '2 Bedroom Garden Residence City Walk | Elysian Estates',
    'Designer 2-bedroom garden residence with park access in City Walk.',
    'https://elysian-estates.com/properties/designer-garden-apartment-city-walk',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
),
(
    'Waterfront Boulevard Residence with Burj Khalifa View',
    'waterfront-boulevard-residence-downtown',
    'ELY-DT-007',
    'Ultra-prime luxury rental situated on Sheikh Mohammed Bin Rashid Boulevard. Fully interior designed by Minotti with floor-to-ceiling windows framing direct views of the Burj Khalifa and the Dubai Fountains.',
    380000.00, 'AED', 'RENT', 'APARTMENT',
    1, 3, NULL, 'Boulevard Point, Downtown Dubai', 2, 3, 1780.00, 'READY', 'FURNISHED',
    'Available Immediately', 'Annual Contract (Up to 4 Cheques)', TRUE, TRUE,
    NULL, FALSE, NULL, 'FRONT_ELEVATION', 'GOLDEN_HOUR',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    NULL, NULL,
    'Downtown Luxury Boulevard Rental | Elysian Estates',
    'Luxury 2-bedroom apartment for rent with direct Burj Khalifa fountain views.',
    'https://elysian-estates.com/properties/waterfront-boulevard-residence-downtown',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
),
(
    'Private Sanctuary Townhouse at Dubai Hills Golf Grove',
    'sanctuary-townhouse-dubai-hills',
    'ELY-DH-008',
    'A tranquil family sanctuary with private rooftop terrace, integrated solar panels, private pool, and direct access to cycling paths, tennis courts, and king-size community clubhouse.',
    6200000.00, 'AED', 'BUY', 'TOWNHOUSE',
    4, 3, 3, 'Golf Grove, Dubai Hills Estate, Dubai', 4, 5, 3350.00, 'READY', 'SEMI_FURNISHED',
    'Ready', 'Mortgage Eligible', FALSE, TRUE,
    NULL, FALSE, NULL, 'FRONT_ELEVATION', 'ARCHITECTURAL_SUN',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    NULL, NULL,
    'Dubai Hills Golf Grove Townhouse | Elysian Estates',
    'Modern 4-bedroom townhouse with rooftop terrace in Dubai Hills Estate.',
    'https://elysian-estates.com/properties/sanctuary-townhouse-dubai-hills',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
),
(
    'Modernist Sky Villa on Palm Jumeirah Crescent',
    'modernist-sky-villa-palm-crescent',
    'ELY-PJ-009',
    'A visionary duplex residence situated on the Palm Crescent featuring dual private elevators, triple infinity plunge pools, and uninterrupted horizons of the Arabian Gulf.',
    32000000.00, 'AED', 'BUY', 'PENTHOUSE',
    2, 2, NULL, 'The Crescent, Palm Jumeirah, Dubai', 5, 6, 7800.00, 'READY', 'FURNISHED',
    'Ready', 'Private Broker Arrangement', TRUE, TRUE,
    NULL, FALSE, NULL, 'FRONT_ELEVATION', 'GOLDEN_HOUR',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    NULL, NULL,
    'Palm Crescent Sky Villa | Elysian Estates',
    'Duplex sky villa with private plunge pools and Arabian Gulf horizons.',
    'https://elysian-estates.com/properties/modernist-sky-villa-palm-crescent',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'
),
(
    'Executive Marina Suite with Sunset Terrace',
    'executive-marina-suite-sunset-terrace',
    'ELY-DM-010',
    'A sleek, turn-key pied-à-terre featuring smart circadian lighting, custom walnut joinery, and peaceful marina views. Ideal for investors with an attractive 8.2% projected net rental yield.',
    2150000.00, 'AED', 'BUY', 'APARTMENT',
    3, 3, NULL, 'Silverene Tower, Dubai Marina, Dubai', 1, 2, 920.00, 'READY', 'FURNISHED',
    'Ready', 'Immediate Title Deed', FALSE, TRUE,
    NULL, FALSE, NULL, 'FRONT_ELEVATION', 'STUDIO',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    NULL, NULL,
    'Marina 1-Bedroom Executive Suite | Elysian Estates',
    'High-yield 1-bedroom luxury apartment with sunset balcony in Dubai Marina.',
    'https://elysian-estates.com/properties/executive-marina-suite-sunset-terrace',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
);

-- 8. Property Images
INSERT INTO property_images (property_id, image_url, alt_text, display_order, is_cover) VALUES
(1, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', 'Castleton Penthouse Living Room', 1, TRUE),
(1, 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', 'Castleton Marble Kitchen and Dining', 2, FALSE),
(1, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', 'Master Suite with Skyline Terrace', 3, FALSE),
(1, 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80', 'Private Infinity Pool at Sunset', 4, FALSE),

(2, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80', 'Palm Jumeirah Oceanfront Villa Exterior', 1, TRUE),
(2, 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80', 'Modernist Villa Interior with Courtyard', 2, FALSE),
(2, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80', 'Beachfront Deck and Pool', 3, FALSE),

(3, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', 'The Lana Dorchester Duplex Lounge', 1, TRUE),
(3, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 'Dorchester Marina View Balcony', 2, FALSE),

(4, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 'Dubai Hills Golf Mansion Front', 1, TRUE),
(4, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', 'Golf Course Lawn and Infinity Pool', 2, FALSE);

-- 9. Property Amenities Linkage
INSERT INTO property_amenities (property_id, amenity_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7),
(2, 1), (2, 2), (2, 3), (2, 8), (2, 9), (2, 11),
(3, 2), (3, 4), (3, 5), (3, 7), (3, 12),
(4, 1), (4, 4), (4, 8), (4, 10), (4, 12);

-- 10. CMS Pages
INSERT INTO pages (title, slug, meta_title, meta_description, is_published, version) VALUES
('Home', 'home', 'Elysian Estates | Ultra-Luxury Real Estate & Penthouses', 'Discover bespoke architectural properties, waterfront mansions, and luxury developments in prime destinations.', TRUE, 1),
('About Us', 'about', 'About Elysian Estates | Elite Architectural Real Estate Advisory', 'Learn about our heritage, elite leadership team, and unrivaled advisory services in ultra-prime markets.', TRUE, 1),
('Contact & Concierge', 'contact', 'Private Client Concierge | Elysian Estates', 'Connect with our global private office for discrete property acquisitions and confidential viewings.', TRUE, 1),
('Privacy Policy', 'privacy', 'Privacy Policy | Elysian Estates', 'Our commitment to confidential client privacy and international data security standards.', TRUE, 1),
('Terms of Service', 'terms', 'Terms & Conditions | Elysian Estates', 'Legal terms and conditions governing the use of Elysian Estates services.', TRUE, 1);

-- 11. CMS Page Sections for 'Home'
INSERT INTO page_sections (page_id, section_type, title, subtitle, content_json, display_order, is_visible, background_image) VALUES
(1, 'HERO_SECTION', 'Architectural Masterpieces in the World’s Most Coveted Addresses', 'Bespoke residences, beachfront mansions, and private sky palaces curated with absolute distinction.', 
'{"ctaPrimaryText": "Explore Portfolio", "ctaPrimaryUrl": "/properties", "ctaSecondaryText": "Discover Developments", "ctaSecondaryUrl": "/projects", "enable3DHero": true, "stats": [{"label": "Portfolio Value", "value": "$4.8B+"}, {"label": "Private Residences", "value": "150+"}, {"label": "Global Offices", "value": "12"}]}',
1, TRUE, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80'),

(1, 'FEATURED_PROPERTIES', 'Curated Private Residences', 'Handpicked listings representing the pinnacle of architectural excellence and finish.',
'{"limit": 6, "showFilterTabs": true, "viewAllUrl": "/properties"}',
2, TRUE, NULL),

(1, 'DEVELOPMENTS_SHOWCASE', 'Iconic Master Developments', 'Pioneering off-plan architectural landmarks crafted by globally acclaimed developers.',
'{"viewAllUrl": "/projects"}',
3, TRUE, NULL),

(1, 'LOCATIONS_GRID', 'Explore Premier Destinations', 'From pristine private island crescents to dynamic cultural districts.',
'{"viewAllUrl": "/locations"}',
4, TRUE, NULL),

(1, 'ABOUT_OVERVIEW', 'Redefining the Luxury Real Estate Experience', 'At Elysian Estates, we bridge visionary architecture with discerning collectors worldwide.',
'{"paragraph1": "We provide discrete, advisory-led brokerage for generational estates, architectural penthouses, and bespoke developments.", "paragraph2": "With an unparalleled global network and deep market intelligence, our advisory ensures total privacy and transaction excellence.", "yearsInMarket": "18 Years of Advisory Excellence", "bulletPoints": ["Confidential Off-Market Transactions", "Virtual & 3D Interactive Previews", "Bespoke Portfolio Advisory"], "imageUrl": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"}',
5, TRUE, NULL),

(1, 'TESTIMONIALS', 'The Voice of Distinction', 'Endorsements from high-net-worth investors and family offices worldwide.',
'{}',
6, TRUE, NULL),

(1, 'LATEST_ARTICLES', 'Editorial & Market Insights', 'Quarterly wealth intelligence, architectural spotlights, and luxury market forecasts.',
'{"viewAllUrl": "/blog"}',
7, TRUE, NULL),

(1, 'NEWSLETTER_CTA', 'Receive Confidential Private Collection Dossiers', 'Subscribe to our weekly private portfolio briefing sent exclusively to accredited clients.',
'{"buttonText": "Subscribe to Dossier", "placeholder": "Enter your corporate or private email"}',
8, TRUE, NULL);

-- 12. Global Website Settings
INSERT INTO website_settings (setting_key, setting_value, setting_group, description) VALUES
('site_name', 'ELYSIAN ESTATES', 'BRANDING', 'Official luxury brand name displayed on website'),
('site_tagline', 'Curated Architectural Masterpieces & Luxury Residences', 'BRANDING', 'Hero slogan and subtitle'),
('brand_color_primary', '#0b0f17', 'APPEARANCE', 'Deep obsidian dark tone'),
('brand_color_accent', '#c5a880', 'APPEARANCE', 'Warm champagne bronze accent tone'),
('contact_email', 'concierge@elysian-estates.com', 'CONTACT', 'Main private advisory email'),
('contact_phone', '+971 4 800 ELYSIAN', 'CONTACT', 'Main concierge phone line'),
('office_address', 'Level 48, Boulevard Plaza Tower 1, Downtown Dubai, United Arab Emirates', 'CONTACT', 'Headquarters physical address'),
('default_currency', 'AED', 'LOCALIZATION', 'Default listing currency'),
('currency_symbol', 'AED', 'LOCALIZATION', 'Currency display symbol'),
('social_instagram', 'https://instagram.com/elysianestates', 'SOCIAL', 'Instagram URL'),
('social_linkedin', 'https://linkedin.com/company/elysianestates', 'SOCIAL', 'LinkedIn URL'),
('seo_default_title', 'Elysian Estates | Ultra-Luxury Real Estate & Penthouses', 'SEO', 'Default meta title'),
('seo_default_description', 'Discover bespoke architectural properties, waterfront mansions, and luxury developments in prime destinations.', 'SEO', 'Default meta description');

-- 13. Navigation Items (Header & Footer)
INSERT INTO navigation_items (menu_location, label, path, parent_id, display_order, is_active, is_external) VALUES
('HEADER', 'Properties', '/properties', NULL, 1, TRUE, FALSE),
('HEADER', 'Developments', '/projects', NULL, 2, TRUE, FALSE),
('HEADER', 'Locations', '/locations', NULL, 3, TRUE, FALSE),
('HEADER', 'About Us', '/about', NULL, 4, TRUE, FALSE),
('HEADER', 'Journal', '/blog', NULL, 5, TRUE, FALSE),
('HEADER', 'Contact', '/contact', NULL, 6, TRUE, FALSE),

('FOOTER', 'Explore Properties', '/properties', NULL, 1, TRUE, FALSE),
('FOOTER', 'Featured Projects', '/projects', NULL, 2, TRUE, FALSE),
('FOOTER', 'Prime Locations', '/locations', NULL, 3, TRUE, FALSE),
('FOOTER', 'About Elysian', '/about', NULL, 4, TRUE, FALSE),
('FOOTER', 'Market Intelligence', '/blog', NULL, 5, TRUE, FALSE),
('FOOTER', 'Private Concierge', '/contact', NULL, 6, TRUE, FALSE),
('FOOTER', 'Privacy Policy', '/privacy', NULL, 7, TRUE, FALSE),
('FOOTER', 'Terms of Service', '/terms', NULL, 8, TRUE, FALSE);

-- 14. Blog Categories & Posts
INSERT INTO blog_categories (name, slug, description) VALUES
('Market Intelligence', 'market-intelligence', 'Analytical forecasts and prime property trends'),
('Architecture & Design', 'architecture-design', 'Profiles of world-renowned architects and material craftsmanship'),
('Lifestyle & Horizons', 'lifestyle-horizons', 'Private aviation, yachting, and prime waterfront living');

INSERT INTO blog_posts (title, slug, category_id, summary, content, featured_image, author_name, author_avatar, is_published, meta_title, meta_description) VALUES
(
    'The Rise of Branded Architectural Residences in Dubai and Beyond',
    'rise-of-branded-architectural-residences',
    1,
    'How hospitality partnerships with Dorchester, Aman, and Bulgari are setting new global benchmarks in ultra-prime residential valuation.',
    '<p>In recent years, the global prime residential landscape has witnessed an unprecedented convergence between hospitality legends and visionary architecture. Discerning buyers are no longer seeking merely square footage; they are curating lifestyles anchored in bespoke concierge culture, private marina berths, and Pritzker-prize aesthetic pedigree.</p><p>Developments such as The Lana Residences managed by the Dorchester Collection demonstrate that branded residences command a sustained premium of over 35% compared to non-branded luxury properties.</p>',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    'Lord Alexander Sterling',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    TRUE,
    'Branded Residences in Dubai | Elysian Market Report',
    'Analysis of the surge in branded luxury developments and long-term capital preservation.'
),
(
    'Biophilic Design and Indoor-Outdoor Living in City Walk’s Castleton',
    'biophilic-design-city-walk-castleton',
    2,
    'Exploring the architectural harmony of glass pavilions wrapped in suspended hanging gardens and open parklands.',
    '<p>City Walk Central Park redefines urban residential design through biophilic integration. The architectural philosophy centres around deep shaded balconies, natural limestone cladding, and an organic connection to over 230,000 square metres of lush greenery.</p><p>For owners at Castleton, floor-to-ceiling double-glazed façades invite natural sunlight while preserving thermal efficiency in high summer.</p>',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'Elena Rostova',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    TRUE,
    'Castleton Architecture & Biophilic Design | Elysian Journal',
    'An in-depth look at sustainable architectural luxury at Central Park City Walk.'
);

-- 15. Testimonials
INSERT INTO testimonials (author_name, author_title, company, quote, avatar_url, rating, is_featured, display_order) VALUES
('Sheikh Faisal Bin Mansoor', 'Managing Partner', 'Gulf Sovereign Capital', 'Elysian Estates orchestrated our acquisition of a trophy beachfront villa with absolute discretion and precision. Their 3D interactive models and architectural insight were indispensable.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 5, TRUE, 1),
('Countess Vivienne De Saint-Germain', 'Private Collector', 'Saint-Germain Family Office', 'From private jet landing in Dubai to the signing of our City Walk penthouse, the advisory team provided white-glove concierge execution of the highest order.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', 5, TRUE, 2),
('Marcus Vance', 'Founder & CIO', 'Vance Tech Ventures (Zurich)', 'The dynamic CMS and digital viewing capabilities allowed my family in Switzerland to thoroughly inspect every floor plan and lighting nuance before committing. Exceptional.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', 5, TRUE, 3);

-- 16. Team Members
INSERT INTO team_members (name, role_title, bio, photo_url, email, phone, display_order) VALUES
('Lord Alexander Sterling', 'Founder & Senior Managing Partner', 'Over 25 years advising royal family offices, institutional developers, and UHNW clients on architectural acquisitions.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'sterling@elysian-estates.com', '+971 4 800 1100', 1),
('Elena Rostova', 'Head of Architectural Advisory & Private Clients', 'Former architect specializing in contemporary European minimalism and bespoke turnkey penthouse estates.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', 'elena@elysian-estates.com', '+971 4 800 1101', 2),
('Tariq Al-Mansoor', 'Director of Off-Plan & Master Developments', 'Leads strategic partnerships with Meraas, Emaar, and Omniyat across GCC flagship projects.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'tariq@elysian-estates.com', '+971 4 800 1102', 3);

-- 17. Sample Enquiries
INSERT INTO enquiries (full_name, email, phone, message, enquiry_type, property_id, status, admin_notes) VALUES
('Sir Charles Henderson', 'c.henderson@londoncapital.co.uk', '+44 20 7946 0912', 'Interested in scheduling a private confidential viewing for the Sky Penthouse at Castleton during my visit to Dubai next Tuesday.', 'PROPERTY_INQUIRY', 1, 'NEW', 'VIP client visiting from London Mayfair. Arrange chauffeur pick-up.');
