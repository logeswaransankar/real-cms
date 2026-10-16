export type TransactionType = 'BUY' | 'RENT' | 'SALE';
export type PropertyType = 'APARTMENT' | 'PENTHOUSE' | 'VILLA' | 'TOWNHOUSE' | 'DUPLEX' | 'MANSION';
export type PropertyStatus = 'READY' | 'OFF_PLAN' | 'PUBLISHED' | 'DRAFT' | 'SOLD' | 'RESERVED';
export type FurnishedStatus = 'FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED';

export interface Location {
  id: number;
  name: string;
  slug: string;
  city: string;
  country: string;
  description?: string;
  heroImage?: string;
  popular?: boolean;
  propertyCount?: number;
}

export interface Developer {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  websiteUrl?: string;
}

export interface Project {
  id: number;
  name: string;
  slug: string;
  developer?: Developer;
  location?: Location;
  startingPrice?: number;
  currency?: string;
  completionDate?: string;
  completionYear?: number;
  status?: string;
  description?: string;
  shortDescription?: string;
  heroImage?: string;
  featuredImageUrl?: string;
  featured?: boolean;
  isFeatured?: boolean;
  published?: boolean;
  amenitiesJson?: string;
  paymentPlanJson?: string;
  unitTypesJson?: string;
}

export interface Amenity {
  id: number;
  name: string;
  slug?: string;
  icon?: string;
  category?: string;
}

export interface PropertyImage {
  id?: number;
  imageUrl: string;
  altText?: string;
  caption?: string;
  displayOrder?: number;
  cover?: boolean;
  isPrimary?: boolean;
}

export interface Property {
  id: number;
  title: string;
  slug: string;
  referenceNumber: string;
  description?: string;
  shortDescription?: string;
  price: number;
  currency: string;
  transactionType?: TransactionType;
  listingType?: string;
  propertyType: PropertyType;
  location?: Location;
  developer?: Developer;
  project?: Project;
  address?: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft?: number;
  builtUpAreaSqFt?: number;
  plotAreaSqFt?: number;
  status: PropertyStatus | string;
  furnishedStatus?: FurnishedStatus;
  furnishingStatus?: string;
  completionDate?: string;
  paymentPlan?: string;
  featured?: boolean;
  isFeatured?: boolean;
  isVerified?: boolean;
  published?: boolean;
  archived?: boolean;

  // 3D Model Configuration
  model3dUrl?: string;
  model3dEnabled?: boolean;
  model3dType?: string;
  model3dTitle?: string;
  model3dCameraPreset?: string;
  model3dLightingPreset?: string;
  fallbackImageUrl?: string;
  featuredImageUrl?: string;

  videoUrl?: string;
  tour360Url?: string;
  virtualTourUrl?: string;
  floorplanUrl?: string;
  floorPlansJson?: string;
  nearbyLandmarksJson?: string;

  latitude?: number;
  longitude?: number;

  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  viewsCount?: number;

  images: PropertyImage[];
  amenities: Amenity[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PageSection {
  id: number;
  sectionKey?: string;
  sectionType: string;
  title?: string;
  subtitle?: string;
  contentJson?: string | any;
  sortOrder?: number;
  displayOrder?: number;
  isActive?: boolean;
  visible?: boolean;
  backgroundImage?: string;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  published?: boolean;
  isPublished?: boolean;
  version?: number;
  sections?: PageSection[];
}

export interface NavigationItem {
  id: number;
  menuLocation: 'HEADER' | 'FOOTER' | string;
  label?: string;
  title?: string;
  path?: string;
  url?: string;
  target?: string;
  parentId?: number;
  displayOrder: number;
  active?: boolean;
  isActive?: boolean;
  external?: boolean;
}

export interface Enquiry {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  enquiryType?: string;
  property?: Property;
  project?: Project;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'VIEWING_SCHEDULED' | 'CLOSED' | string;
  adminNotes?: string;
  createdAt: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  featuredImageUrl?: string;
  authorName?: string;
  authorAvatar?: string;
  readTimeMinutes?: number;
  published?: boolean;
  isPublished?: boolean;
  isFeatured?: boolean;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  viewsCount?: number;
  createdAt?: string;
  category?: {
    id: number;
    name: string;
    slug?: string;
  };
}

export interface Testimonial {
  id: number;
  authorName: string;
  authorTitle?: string;
  company?: string;
  quote: string;
  avatarUrl?: string;
  rating: number;
}

export interface TeamMember {
  id: number;
  name: string;
  roleTitle: string;
  bio?: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
}

export interface MediaAsset {
  id: number;
  filename?: string;
  fileName?: string;
  originalName?: string;
  url?: string;
  fileUrl: string;
  fileType: 'IMAGE' | 'VIDEO' | 'MODEL_3D' | 'DOCUMENT' | string;
  mimeType?: string;
  fileSize?: number;
  dimensions?: string;
  altText?: string;
  caption?: string;
  folder?: string;
  createdAt?: string;
}

export interface ContentRevision {
  id: number;
  entityType: string;
  entityId: number;
  revisionNumber?: number;
  versionNumber?: number;
  title?: string;
  snapshotJson: string;
  createdBy?: string;
  createdByName?: string;
  published?: boolean;
  isPublished?: boolean;
  createdAt: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  active?: boolean;
  isActive?: boolean;
  roles?: any;
}

export interface AuthState {
  token: string | null;
  user: {
    id: number;
    email: string;
    fullName: string;
    avatarUrl?: string;
    roles: string[];
  } | null;
  isAuthenticated: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
