export const BASE_URL = 'https://lsync-1-0-0-1.onrender.com';
export const API_URL = `${BASE_URL}/api`;

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && !options.skipAuth ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      throw new Error(data.message || data.error || `Request failed (${response.status})`);
    }

    return data;
  } catch (err) {
    if (err.message === 'Load failed' || err.message === 'Failed to fetch') {
      throw new Error('Server is waking up or unreachable. Please wait 15 seconds and try again.');
    }
    throw err;
  }
}