const API_BASE = "http://localhost:5000/odata";

export async function apiGet(path) {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error("API error");
    return res.json();
}