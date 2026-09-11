import axios from 'axios';

// Backend base URL (Spring Boot runs on 8081 by default - see backend/application.properties)
export const API_BASE_URL = 'http://localhost:8081/api';

const http = axios.create({ baseURL: API_BASE_URL });

// Attach the bearer token (if any) to every request automatically.
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralised error normalisation so pages can show a friendly message
// instead of raw axios/console errors.
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      (error?.response?.status === 401 && 'Please log in to continue.') ||
      (error?.response?.status === 403 && 'You do not have permission to do this.') ||
      (error?.code === 'ERR_NETWORK' && 'Cannot reach the server. Please try again.') ||
      'Something went wrong. Please try again.';
    return Promise.reject({ ...error, friendlyMessage: message });
  }
);

export default http;
