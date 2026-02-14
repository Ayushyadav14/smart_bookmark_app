'use client'

import { Bookmark } from '@/types'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import BookmarkItem from './BookmarkItem'
import { toast } from 'sonner'
import { BookmarkIcon } from 'lucide-react'

export default function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const supabase = createClient()

    useEffect(() => {
        let channel: ReturnType<typeof supabase.channel> | null = null

        // Get the current user and set up realtime subscription
        const setupRealtimeSubscription = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                console.warn('No user found for realtime subscription')
                return
            }

            // Set up the subscription with user_id filter for RLS compatibility
            channel = supabase
                .channel('realtime bookmarks')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'bookmarks',
                        filter: `user_id=eq.${user.id}`, // CRITICAL: Filter by user_id for cross-browser sync
                    },
                    (payload) => {
                        console.log('Realtime Change:', payload)

                        if (payload.eventType === 'INSERT') {
                            setBookmarks((prev) => [payload.new as Bookmark, ...prev])
                        } else if (payload.eventType === 'DELETE') {
                            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
                        } else if (payload.eventType === 'UPDATE') {
                            setBookmarks((prev) => prev.map(b => b.id === payload.new.id ? payload.new as Bookmark : b))
                        }
                    }
                )
                .subscribe((status) => {
                    console.log('Realtime Connection Status:', status)
                })
        }

        // Start the subscription
        setupRealtimeSubscription()

        // Cleanup subscription on unmount
        return () => {
            if (channel) {
                supabase.removeChannel(channel)
            }
        }
    }, [supabase])

    // Sync with server-side data updates (e.g. after router.refresh())
    useEffect(() => {
        setBookmarks(initialBookmarks)
    }, [initialBookmarks])

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center p-4 bg-muted rounded-full mb-4">
                    <BookmarkIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No bookmarks yet</h3>
                <p className="text-muted-foreground">Add your first bookmark to get started.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
                <BookmarkItem key={bookmark.id} bookmark={bookmark} />
            ))}
        </div>
    )
}
