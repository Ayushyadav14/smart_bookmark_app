import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import AddBookmarkForm from '@/components/AddBookmarkForm'
import BookmarkList from '@/components/BookmarkList'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Navbar userEmail={user.email || ''} userName={user.user_metadata?.full_name} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Your Bookmarks</h1>
            <p className="text-muted-foreground">
              Manage your private collection of links.
            </p>
          </div>

          <AddBookmarkForm />

          <BookmarkList initialBookmarks={bookmarks || []} />
        </div>
      </main>
    </div>
  )
}
