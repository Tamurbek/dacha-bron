export const API_BASE_URL = import.meta.env.VITE_API_URL || '';
export const API_V1_URL = API_BASE_URL.endsWith('/api/v1') ? API_BASE_URL : `${API_BASE_URL}/api/v1`;
