const API_URL = import.meta.env.VITE_API_URL;

// A customized fetch wrapper that automatically injects the JWT token
// into the Authorization header for every request.

export async function authenticatedFetch (endpoint, token, options={}){

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(data?.error || data?.message || "Request failed");
    }

    return data;
}