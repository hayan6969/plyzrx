# PlyzRX Admin Dashboard

This document describes the Admin Dashboard implementation for PlyzRX.

## Overview

The admin dashboard is a protected area accessible only to administrators. It provides functionality to view payment logs and user information.

## Routes

- `/admin` - Main admin dashboard (protected)
- `/admin/login` - Admin login page

## Features

### Authentication
- The admin authentication is handled separately from the main user authentication
- Uses Appwrite Cloud for admin authentication
- Client-side authentication with localStorage storage for session persistence

### Dashboard
The admin dashboard includes:
1. **Payment Logs Table**
   - User ID
   - Username
   - Date & Time
   - Payment From
   - Web/Mobile platform indicator
   - Player ID
   - Payment Amount
   - Payment ID

2. **Users Table**
   - User ID
   - Tier 1 status (boolean)
   - Tier 2 status (boolean)
   - Tier 3 status (boolean)

## Setup

1. Create an Appwrite account at [https://appwrite.io/](https://appwrite.io/)
2. Create a new project in Appwrite Cloud
3. Set up authentication in your Appwrite project
   - Go to "Auth" in the Appwrite console
   - Enable Email/Password authentication
   - Set your domains (for production)
4. Update the `.env` file with your Appwrite project details:
   ```
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   ```

5. Create an admin user:
   
   Option 1: Run the helper script:
   ```
   node src/scripts/createAdminAccount.js
   ```
   
   Option 2: Use the Appwrite console:
   - Go to "Auth" -> "Users"
   - Click "Create User"
   - Fill in the details (email, password, name)

## Troubleshooting

If you encounter issues with authentication:

1. **401 Unauthorized errors**: 
   - Check that your Appwrite project ID and endpoint are correct in `.env`
   - Verify that email/password authentication is enabled in Appwrite
   - Check browser console for more detailed error messages

2. **Login works but redirect fails**:
   - The code now uses client-side storage to maintain authentication state
   - Admin authentication is checked on the client side, not in middleware
   - Make sure cookies and localStorage are enabled in your browser

3. **"Cannot read properties of undefined" errors**:
   - This happens when trying to use Appwrite methods on the server
   - All Appwrite code is now properly isolated to client-side components

## Security Notes

- Admin authentication is completely separate from user authentication
- No signup functionality is provided for admin users (must be created manually)
- Authentication is handled client-side for better compatibility

## Customization

To customize the tables or add more features to the admin dashboard:
1. Edit `src/app/admin/page.tsx` to add new UI components
2. Expand the dashboard with more tabs as needed
3. Connect to real data sources instead of mock data 