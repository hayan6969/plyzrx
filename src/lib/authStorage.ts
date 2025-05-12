// Client-side storage utilities for admin authentication

// Set admin authentication in localStorage
export const setAdminAuth = (sessionId: string, email: string): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem("admin-auth", "true");
  localStorage.setItem("admin-session", sessionId);
  localStorage.setItem("admin-email", email);
};

// Clear admin authentication from localStorage
export const clearAdminAuth = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("admin-auth");
  localStorage.removeItem("admin-session");
  localStorage.removeItem("admin-email");
};

// Check if admin is authenticated from localStorage
export const isAdminAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;

  return localStorage.getItem("admin-auth") === "true";
};

// Get admin email from localStorage
export const getAdminEmail = (): string | null => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("admin-email");
};

// Get admin session ID from localStorage
export const getAdminSessionId = (): string | null => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("admin-session");
};
