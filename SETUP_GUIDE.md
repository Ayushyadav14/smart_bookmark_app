# Setup Guide: Supabase & Google OAuth

Since I cannot access your personal accounts, I have created this guide to help you set up the backend.

## Part 1: Create Supabase Project (The Database)

1.  **Open Dashboard**: I have opened [https://supabase.com/dashboard](https://supabase.com/dashboard) for you.
2.  **Sign In**: Log in with GitHub or your email.
3.  **New Project**:
    *   Click **"New Project"**.
    *   Choose your Organization.
    *   **Name**: `Smart Bookmark App`
    *   **Password**: Click "Generate a password" (Save this somewhere safe!).
    *   **Region**: Select a region close to you (e.g., US East, Europe West).
    *   Click **"Create new project"**.
4.  **Wait**: It takes about 2 minutes to provision.

## Part 2: Get API Keys (Connect to Code)

1.  Once the project is ready (green "Active" badge):
2.  Click the **Settings (Gear Icon)** at the bottom of the left sidebar.
3.  Click **"API"**.
4.  Look for **Project URL** and **anon public** key.
5.  **Action**: Copy these keys. We will put them in your `.env.local` file.

## Part 3: Google OAuth Setup (The Login)

This is the tricky part. Follow carefully.

### Step 3.1: Prep Supabase
1.  In Supabase Dashboard, go to **Authentication** (User icon in sidebar) -> **Providers**.
2.  Click **Google**.
3.  Keep this tab open. You will need to copy the **"Callback URL (for OAuth)"** (it looks like `https://<your-project-id>.supabase.co/auth/v1/callback`).

### Step 3.2: Google Cloud Console
1.  I have opened [https://console.cloud.google.com/](https://console.cloud.google.com/) for you.
2.  **New Project**:
    *   Click the dropdown in the top left (next to Google Cloud logo).
    *   Click **"New Project"**.
    *   Name: `Smart Bookmark Auth`.
    *   Click **Create**.
3.  **Select Project**: Click "Select Project" in the notification or the dropdown.
4.  **OAuth Consent Screen**:
    *   Search for "OAuth consent screen" in the top search bar.
    *   Select **External**. Click **Create**.
    *   **App Information**:
        *   App name: `Smart Bookmark App`
        *   User support email: Select your email.
    *   **Developer Contact Information**: Enter your email.
    *   Click **Save and Continue** (skip Scopes and Test Users for now, just keep clicking Save).
    *   **Publish App**: Click "Publish App" and confirm (otherwise it expires in 7 days).

### Step 3.3: Get credentials
1.  Go to **Credentials** (Left sidebar).
2.  Click **+ Create Credentials** -> **OAuth client ID**.
3.  **Application type**: `Web application`.
4.  **Authorized redirect URIs**:
    *   Click **+ Add URI**.
    *   **Paste the Callback URL** you copied from Supabase (Step 3.1).
    *   **CRITICAL**: Also add `http://localhost:3000/auth/callback` if you plan to handle auth there, but usually Supabase handles it. For now, just the Supabase Callback URL is enough for the popup.
    *   (*Note: Actually, for Supabase Auth Helper, we usually just need the Supabase URL. Let's stick to that.*)
5.  Click **Create**.
6.  **Copy**: Your **Client ID** and **Client Secret**.

### Step 3.4: Finish in Supabase
1.  Go back to the Supabase **Google Provider** tab.
2.  Paste the **Client ID** and **Client Secret**.
3.  Click **Save**.

## You are done!
Reply to me with the **Supabase URL** and **Anon Key**, and I will handle the rest of the code!
