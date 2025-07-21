const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function apiRequest(endpoint, options = {}) {
    return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });
}
