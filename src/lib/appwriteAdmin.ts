import { Client, Account, ID } from "appwrite";

// Initialize Appwrite Client - this should only run on the client side
let client: Client;
let account: Account;

// Initialize the client only on the client side
if (typeof window !== "undefined") {
  client = new Client()
    .setEndpoint(
      process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
        "https://cloud.appwrite.io/v1"
    )
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

  account = new Account(client);
}

// Admin Authentication Functions
export const loginAdmin = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot login from server side");
    }

    // Create a session with email and password
    const session = await account.createEmailPasswordSession(email, password);

    // Store auth info in localStorage for our own middleware checks
    localStorage.setItem("admin-auth", "true");
    localStorage.setItem("admin-session", session.$id);
    localStorage.setItem("admin-email", email);

    return true;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

export const logoutAdmin = async (): Promise<boolean> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot logout from server side");
    }

    await account.deleteSession("current");

    // Clear our own auth markers
    localStorage.removeItem("admin-auth");
    localStorage.removeItem("admin-session");
    localStorage.removeItem("admin-email");

    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};

export const checkAdminAuth = async (): Promise<boolean> => {
  try {
    if (typeof window === "undefined") {
      return false; // Server-side auth check defaults to false
    }

    // First check our localStorage flag (for client-side checks)
    const isAdmin = localStorage.getItem("admin-auth") === "true";
    if (isAdmin) return true;

    // As a fallback, try to get the account from Appwrite
    try {
      const currentAccount = await account.get();
      return !!currentAccount.$id;
    } catch {
      return false;
    }
  } catch {
    return false;
  }
};

// Function to initialize admin account (run this once during setup)
export const createAdminAccount = async (
  email: string,
  password: string,
  name: string
): Promise<boolean> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot create account from server side");
    }

    await account.create(ID.unique(), email, password, name);
    return true;
  } catch (error) {
    console.error("Failed to create admin account:", error);
    return false;
  }
};
