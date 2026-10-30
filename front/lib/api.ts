const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082/api/v1';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Read stored auth token if in browser
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('hms_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `HTTP error! Status: ${response.status}`);
  }

  return data;
}

export const hmsApi = {
  // Auth
  login: (credentials: any) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (payload: any) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  profile: () => fetchApi('/auth/profile'),
  logout: () => fetchApi('/auth/logout', { method: 'POST' }),

  // Hotels
  getHotels: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchApi(`/hotels${query}`);
  },
  getHotel: (slug: string) => fetchApi(`/hotels/${slug}`),
  bookHotel: (payload: any) => fetchApi('/hotels/book', { method: 'POST', body: JSON.stringify(payload) }),

  // Hostels
  getHostels: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchApi(`/hostels${query}`);
  },
  getHostel: (slug: string) => fetchApi(`/hostels/${slug}`),
  applyHostelAdmission: (payload: any) => fetchApi('/hostels/admission', { method: 'POST', body: JSON.stringify(payload) }),

  // Apartments & Home Rentals (Economy, Premium, Luxurious)
  getApartments: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchApi(`/apartments${query}`);
  },
  getApartment: (slug: string) => fetchApi(`/apartments/${slug}`),
  bookApartment: (payload: any) => fetchApi('/apartments/book', { method: 'POST', body: JSON.stringify(payload) }),

  // Bookings
  getBookings: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchApi(`/bookings${query}`);
  },
  getBooking: (code: string) => fetchApi(`/bookings/${code}`),
  checkIn: (bookingId: number) => fetchApi(`/bookings/${bookingId}/check-in`, { method: 'POST' }),
  checkOut: (bookingId: number) => fetchApi(`/bookings/${bookingId}/check-out`, { method: 'POST' }),

  // Billing
  getBilling: () => fetchApi('/billing'),
  recordPayment: (payload: any) => fetchApi('/billing/payment', { method: 'POST', body: JSON.stringify(payload) }),

  // Dynamic RBAC
  getRbacMatrix: () => fetchApi('/rbac/matrix'),
  createRole: (payload: any) => fetchApi('/rbac/roles', { method: 'POST', body: JSON.stringify(payload) }),
  syncRolePermissions: (roleId: number, permissions: number[]) => fetchApi(`/rbac/roles/${roleId}/permissions`, { method: 'POST', body: JSON.stringify({ permissions }) }),
  syncUserRoles: (userId: number, roles: number[]) => fetchApi(`/rbac/users/${userId}/roles`, { method: 'POST', body: JSON.stringify({ roles }) }),

  // Stats
  getDashboardStats: () => fetchApi('/dashboard/stats'),

  // Owner Portal
  getOwnerProperties: () => fetchApi('/owner/properties'),
  createOwnerProperty: (payload: any) => fetchApi('/owner/properties', { method: 'POST', body: JSON.stringify(payload) }),
  createOwnerRoom: (propertyId: number, payload: any) => fetchApi(`/owner/properties/${propertyId}/rooms`, { method: 'POST', body: JSON.stringify(payload) }),
  getOwnerAnalytics: () => fetchApi('/owner/analytics'),

  // User / Student Finder Portal
  getUserBookings: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchApi(`/user/bookings${query}`);
  },
  payBookingBalance: (bookingId: number, payload: any) => fetchApi(`/user/bookings/${bookingId}/pay`, { method: 'POST', body: JSON.stringify(payload) }),
  cancelUserBooking: (bookingId: number) => fetchApi(`/user/bookings/${bookingId}/cancel`, { method: 'POST' }),
};

