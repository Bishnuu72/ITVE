const API_BASE = import.meta.env.VITE_API_URL; // Adjust if backend port changes

// Helper to get token (enhanced logging for debug)
const getToken = () => {
  const token = localStorage.getItem("token");
  const tokenExists = !!token && token.trim() !== "";
  if (!tokenExists) {
    console.warn("⚠️ No auth token found in localStorage. Value:", token ? `"${token}" (empty)` : 'null/undefined');
    console.warn("💡 Ensure login sets localStorage.setItem('token', data.token); and key is exactly 'token'.");
  } else {
    console.log(`✅ Auth token found. Length: ${token.length} chars (sent in header).`);
  }
  return token;
};

const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const tokenExists = !!token && token.trim() !== "";
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(tokenExists && { Authorization: `Bearer ${token}` }), // Only add if valid token
    },
    ...options,
  };

  console.log(`🔗 API Request: ${endpoint} (Token present: ${tokenExists})`);

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  console.log(`📡 API Response Status: ${response.status} for ${endpoint}`);

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    let errorData = {};
    if (contentType && contentType.includes("application/json")) {
      errorData = await response.json().catch(() => ({}));
    }
    const errorMessage = errorData.message || response.statusText || "API request failed";
    
    // Specific handling for 401 Unauthorized
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized: Token missing, invalid, or expired. Clearing localStorage.");
      localStorage.removeItem("token"); // Clear invalid/expired token
      throw new Error(`Authentication failed: ${errorMessage}. Please log in again.`);
    }
    
    // Specific handling for 403 Forbidden (role issue)
    if (response.status === 403) {
      console.error("❌ 403 Forbidden: Insufficient permissions for this action.");
      throw new Error(`Access denied: ${errorMessage}. Check your role.`);
    }
    
    // Other errors (e.g., 500)
    console.error(`❌ API Error ${response.status}: ${errorMessage}`);
    throw new Error(errorMessage);
  }
  
  return response.json();
};

// Fee Operations
export const getFees = () => apiRequest("/fees");
export const getFeeById = (id) => apiRequest(`/fees/${id}`);
export const addFee = (data) => apiRequest("/fees", { method: "POST", body: JSON.stringify(data) });
export const updateFee = (id, data) => apiRequest(`/fees/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteFee = (id) => apiRequest(`/fees/${id}`, { method: "DELETE" });

// Student Fetch (for selection in AddFee) - Assumes returns [{ _id, name, ... }]
export const getAllStudents = () => apiRequest("/students");

// Centre Fetch (for selection in AddFee) - Hits controller's getAllCentres, filters active
export const getAllCentres = async () => {
  const centres = await apiRequest("/centres"); // Controller excludes 'Deleted'
  // Filter to active/approved centres for safety (adjust based on your needs)
  const activeCentres = centres.filter(c => 
    (c.status === 'Active' || c.status === 'Pending') || c.approved === true
  );
  console.log(`📊 Fetched ${activeCentres.length} active centres.`);
  return activeCentres;
};

// Auth Operations (for login/register)
export const loginUser = (data) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(data) });
export const registerUser = (data) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(data) });