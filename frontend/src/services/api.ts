import type {
  ApiResponse,
  PagedResponse,
  Property,
  Project,
  Location,
  Page,
  PageSection,
  NavigationItem,
  Enquiry,
  BlogPost,
  Testimonial,
  TeamMember,
  MediaAsset,
  ContentRevision,
  User,
  Amenity,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (typeof payload.exp === 'number') {
      return Date.now() >= payload.exp * 1000;
    }
    return false;
  } catch {
    return true;
  }
}

export function getAuthToken(): string | null {
  const token = localStorage.getItem('elysian_token');
  if (!token) return null;
  if (isTokenExpired(token)) {
    localStorage.removeItem('elysian_token');
    localStorage.removeItem('elysian_user');
    window.dispatchEvent(new Event('auth_logout'));
    return null;
  }
  return token;
}

export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  // If calling an admin endpoint and user is not authenticated, fail fast and log out
  if (endpoint.startsWith('/admin') && !token) {
    window.dispatchEvent(new Event('auth_logout'));
    throw new Error('Authentication required: Your session has expired or you are not logged in.');
  }

  // Merge default Content-Type, Authorization header, and any custom options.headers
  const mergedHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, { ...options, headers: mergedHeaders });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson && errJson.message) {
        errorMsg = errJson.message;
      }
    } catch {
      // fallback
    }

    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      localStorage.removeItem('elysian_token');
      localStorage.removeItem('elysian_user');
      window.dispatchEvent(new Event('auth_logout'));
      errorMsg = 'Session expired. Please log in again.';
    } else if (response.status === 403 && !endpoint.includes('/auth/login')) {
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem('elysian_token');
        localStorage.removeItem('elysian_user');
        window.dispatchEvent(new Event('auth_logout'));
        errorMsg = 'Session expired. Please log in again.';
      } else {
        errorMsg = errorMsg || 'Access Denied: You do not have permission for this resource.';
      }
    }

    throw new Error(errorMsg);
  }

  const json: ApiResponse<T> = await response.json();
  return json.data;
}

export const api = {
  // Public Endpoints
  public: {
    getSettings: () => request<Record<string, string>>('/public/settings'),
    getNavigation: (location = 'HEADER') =>
      request<NavigationItem[]>(`/public/navigation?location=${location}`),
    getPage: (slug: string) => request<Page>(`/public/pages/${slug}`),
    getProperties: (params: Record<string, string | number | boolean | undefined> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          query.append(k, String(v));
        }
      });
      return request<PagedResponse<Property>>(`/public/properties?${query.toString()}`);
    },
    getFeaturedProperties: () => request<Property[]>('/public/properties/featured'),
    getPropertyBySlug: (slug: string) => request<Property>(`/public/properties/${slug}`),
    getSimilarProperties: (id: number) => request<Property[]>(`/public/properties/${id}/similar`),
    getAllAmenities: () => request<Amenity[]>('/public/properties/amenities'),

    getProjects: (featured?: boolean) => {
      const q = featured !== undefined ? `?featured=${featured}` : '';
      return request<Project[]>(`/public/projects${q}`);
    },
    getProjectBySlug: (slug: string) => request<Project>(`/public/projects/${slug}`),

    getLocations: (popular?: boolean) => {
      const q = popular !== undefined ? `?popular=${popular}` : '';
      return request<Location[]>(`/public/locations${q}`);
    },
    getLocationBySlug: (slug: string) => request<Location>(`/public/locations/${slug}`),

    getArticles: (page = 0, size = 6) =>
      request<PagedResponse<BlogPost>>(`/public/blog?page=${page}&size=${size}`),
    getLatestArticles: () => request<BlogPost[]>('/public/blog/latest'),
    getArticleBySlug: (slug: string) => request<BlogPost>(`/public/blog/${slug}`),

    getTestimonials: () => request<Testimonial[]>('/public/testimonials'),
    getTeam: () => request<TeamMember[]>('/public/team'),

    submitEnquiry: (data: unknown) =>
      request<Enquiry>('/public/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    scheduleViewing: (data: unknown) =>
      request<Enquiry>('/public/viewing-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
  },

  // Auth
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{ token: string; id: number; email: string; fullName: string; avatarUrl?: string; roles: string[] }>(
        '/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        }
      ),
  },

  // Admin Endpoints
  admin: {
    getDashboardStats: () =>
      request<{
        totalProperties: number;
        publishedProperties: number;
        draftProperties: number;
        totalProjects: number;
        totalEnquiries: number;
        newEnquiries: number;
        recentProperties: Property[];
        recentEnquiries: Enquiry[];
      }>('/admin/dashboard', { headers: getAuthHeaders() }),

    // CMS Pages & Sections
    getPages: () => request<Page[]>('/admin/pages', { headers: getAuthHeaders() }),
    getPageById: (id: number) => request<Page>(`/admin/pages/${id}`, { headers: getAuthHeaders() }),
    getPageBySlug: (slug: string) => request<Page>(`/admin/pages/slug/${slug}`, { headers: getAuthHeaders() }),
    updatePage: (id: number, data: Partial<Page>) =>
      request<Page>(`/admin/pages/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    addSection: (pageId: number, data: unknown) =>
      request<PageSection>(`/admin/pages/${pageId}/sections`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    updateSection: (sectionId: number, data: unknown) =>
      request<PageSection>(`/admin/pages/sections/${sectionId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    deleteSection: (sectionId: number) =>
      request<void>(`/admin/pages/sections/${sectionId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),
    reorderSections: (pageId: number, sectionIds: number[]) =>
      request<void>(`/admin/pages/${pageId}/sections/reorder`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ sectionIds }),
      }),

    // Revisions & Rollback
    getRevisions: (entityType: string, entityId: number) =>
      request<ContentRevision[]>(`/admin/revisions/${entityType}/${entityId}`, { headers: getAuthHeaders() }),
    saveRevision: (entityType: string, entityId: number, data: { title: string; snapshotJson: string; isPublished: boolean }) =>
      request<ContentRevision>(`/admin/revisions/${entityType}/${entityId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    rollbackRevision: (revisionId: number) =>
      request<ContentRevision>(`/admin/revisions/${revisionId}/rollback`, {
        method: 'POST',
        headers: getAuthHeaders(),
      }),

    // Properties CRUD
    getProperties: () => request<Property[]>('/admin/properties', { headers: getAuthHeaders() }),
    getPropertyById: (id: number) => request<Property>(`/admin/properties/${id}`, { headers: getAuthHeaders() }),
    createProperty: (data: unknown) =>
      request<Property>('/admin/properties', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    updateProperty: (id: number, data: unknown) =>
      request<Property>(`/admin/properties/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    deleteProperty: (id: number) =>
      request<void>(`/admin/properties/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),

    // Projects CRUD
    getProjects: () => request<Project[]>('/admin/projects', { headers: getAuthHeaders() }),
    createProject: (data: { project: Partial<Project>; developerId?: number; locationId?: number }) =>
      request<Project>('/admin/projects', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    updateProject: (id: number, data: { project: Partial<Project>; developerId?: number; locationId?: number }) =>
      request<Project>(`/admin/projects/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    deleteProject: (id: number) =>
      request<void>(`/admin/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),

    // Locations CRUD
    getLocations: () => request<Location[]>('/admin/locations', { headers: getAuthHeaders() }),
    createLocation: (data: Partial<Location>) =>
      request<Location>('/admin/locations', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    updateLocation: (id: number, data: Partial<Location>) =>
      request<Location>(`/admin/locations/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    deleteLocation: (id: number) =>
      request<void>(`/admin/locations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),

    // Media Library
    getMedia: () => request<MediaAsset[]>('/admin/media', { headers: getAuthHeaders() }),
    uploadMedia: async (file: File, altText = '', caption = '', folder = 'general') => {
      const token = localStorage.getItem('elysian_token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('altText', altText);
      formData.append('caption', caption);
      formData.append('folder', folder);

      const res = await fetch(`${API_BASE}/admin/media/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const json: ApiResponse<MediaAsset> = await res.json();
      return json.data;
    },
    registerExternalMedia: (asset: Partial<MediaAsset>) =>
      request<MediaAsset>('/admin/media/register-external', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(asset),
      }),
    deleteMedia: (id: number) =>
      request<void>(`/admin/media/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),

    // Navigation
    getNavigation: (location?: string) => {
      const q = location ? `?location=${location}` : '';
      return request<NavigationItem[]>(`/admin/navigation${q}`, { headers: getAuthHeaders() });
    },
    createNavigationItem: (item: Partial<NavigationItem>) =>
      request<NavigationItem>('/admin/navigation', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(item),
      }),
    updateNavigationItem: (id: number, item: Partial<NavigationItem>) =>
      request<NavigationItem>(`/admin/navigation/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(item),
      }),
    deleteNavigationItem: (id: number) =>
      request<void>(`/admin/navigation/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),

    // Global Settings
    getSettings: () => request<{ key: string; value: string; group: string; description: string }[]>('/admin/settings', { headers: getAuthHeaders() }),
    updateSettings: (updates: Record<string, string>) =>
      request<void>('/admin/settings', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      }),

    // Enquiries & Leads
    getEnquiries: () => request<Enquiry[]>('/admin/enquiries', { headers: getAuthHeaders() }),
    updateEnquiryStatus: (id: number, status: string, adminNotes?: string) =>
      request<Enquiry>(`/admin/enquiries/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, adminNotes }),
      }),
    deleteEnquiry: (id: number) =>
      request<void>(`/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),

    // Editorial Blog
    getArticles: () => request<BlogPost[]>('/admin/blog', { headers: getAuthHeaders() }),
    createArticle: (data: { post: Partial<BlogPost>; categoryId?: number }) =>
      request<BlogPost>('/admin/blog', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    updateArticle: (id: number, data: { post: Partial<BlogPost>; categoryId?: number }) =>
      request<BlogPost>(`/admin/blog/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    deleteArticle: (id: number) =>
      request<void>(`/admin/blog/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),

    // Users (RBAC)
    getUsers: () => request<User[]>('/admin/users', { headers: getAuthHeaders() }),
    createUser: (data: unknown) =>
      request<User>('/admin/users', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    updateUser: (id: number, data: unknown) =>
      request<User>(`/admin/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    deleteUser: (id: number) =>
      request<void>(`/admin/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),
  },
};
