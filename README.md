# Smart Bookmark App

A premium, real-time bookmark manager built with **Next.js 15** and **Supabase**.

## Features

- **Google Authentication**: Secure login via Google OAuth (Supabase Auth).
- **Real-time Updates**: Bookmarks sync instantly across tabs and devices.
- **Private Bookmarks**: Row Level Security (RLS) ensures data privacy.
- **Responsive UI**: Polished interface using Tailwind CSS and Lucide Icons.
- **Toast Notifications**: Interactive feedback for all actions.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**: `sonner` (Toasts), `clsx`, `tailwind-merge`

## Getting Started

### Prerequisites

- Node.js 18+ installed.
- A Supabase project.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/smart-bookmark-app.git
    cd smart-bookmark-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Database Setup (Supabase)

1.  Create a new table `bookmarks`.
2.  Enable RLS (Row Level Security).
3.  Add policies for `SELECT`, `INSERT`, `DELETE` based on `auth.uid()`.

## Deployment

### 1. Deploy to Vercel
The easiest way to deploy is using the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ayushyadav14/smart-bookmark-app&root-directory=Desktop/Smart_Bookmark_App)

1.  Click the button above.
2.  Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Vercel Environment Variables when prompted.
3.  Deploy!

### 2. Download via Curl
If you want to download this project folder directly via terminal:

```bash
curl -L https://github.com/Ayushyadav14/smart-bookmark-app/archive/refs/heads/main.zip -o project.zip && unzip project.zip "smart-bookmark-app-main/Desktop/Smart_Bookmark_App/*" -d .
```

## Challenges & Solutions

### 1. Cross-Browser Realtime Synchronization
**Problem**: Real-time updates worked within the same browser (multiple tabs) but failed across different browsers (Chrome vs Firefox vs Safari) when using the same account. INSERT events synced correctly, but DELETE events required manual page refresh.

**Root Cause**: 
- Supabase Realtime with RLS requires an explicit `user_id` filter in the subscription to work across independent client sessions
- By default, PostgreSQL DELETE events only include the primary key in `payload.old`, not the `user_id` field needed for filtering

**Solution**: 
1. Added `filter: user_id=eq.${user.id}` to the realtime subscription in `BookmarkList.tsx`
2. Set `REPLICA IDENTITY FULL` on the `bookmarks` table to ensure DELETE events include all columns (including `user_id`) in `payload.old`

```sql
ALTER TABLE bookmarks REPLICA IDENTITY FULL;
```

This ensures each browser session gets its own filtered subscription and DELETE events can be properly filtered by `user_id`.

### 2. Next.js App Router Authentication
**Problem**: Handling authentication cookies across Server Components, Client Components, and Middleware in the new Next.js App Router (Next.js 15).

**Solution**: Used `@supabase/ssr` which provides specialized `createClient` functions for each context (Server, Client, Middleware). This ensures that the Auth session is correctly persisted and refreshed via cookies, allowing for protected routes and seamless server-side rendering of user data.

### 3. Google OAuth Account Selection
**Problem**: After signing out, clicking "Sign in with Google" would automatically reuse the previously logged-in account instead of showing the account chooser. This made it difficult for reviewers to test multi-user isolation.

**Solution**: Added `queryParams: { prompt: 'select_account' }` to the OAuth configuration in `app/login/page.tsx`. This forces Google to always display the account selection screen, even if a user is already signed in to a Google account in their browser.

### 4. Async Cleanup in React useEffect
**Problem**: Initial implementation of the realtime subscription used an async function that returned a cleanup function, but the cleanup wasn't being called properly, breaking the subscription lifecycle.

**Solution**: Refactored to declare the `channel` variable outside the async function and reference it in the cleanup, ensuring proper subscription teardown on component unmount.

