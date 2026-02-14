'use client'

import { createClient } from '@/utils/supabase/client'
import { Link, Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { isValidUrl } from '@/utils/helpers' // We'll create this or inline it

export default function AddBookmarkForm() {
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!url) return

        // Basic URL validation
        try {
            new URL(url)
        } catch {
            toast.error('Please enter a valid URL (e.g., https://google.com)')
            return
        }

        setIsLoading(true)

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) {
                throw new Error('You must be logged in to add bookmarks')
            }

            const { error } = await supabase.from('bookmarks').insert({
                title: title || url, // Fallback to URL if title is empty
                url,
                user_id: user.id,
            })

            if (error) throw error

            toast.success('Bookmark added!')
            setUrl('')
            setTitle('')

            // Refresh server data (fallback for same-tab if Realtime is slow)
            router.refresh()
        } catch (error: any) {
            toast.error('Failed to add bookmark', {
                description: error.message,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8 p-4 bg-card rounded-lg border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                    <label htmlFor="url" className="sr-only">URL</label>
                    <div className="relative">
                        <Link className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                            id="url"
                            type="text"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 pl-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        />
                    </div>
                </div>
                <div className="flex-1 space-y-2">
                    <label htmlFor="title" className="sr-only">Title</label>
                    <input
                        id="title"
                        type="text"
                        placeholder="Title (optional)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
