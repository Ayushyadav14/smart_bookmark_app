'use client'

import { Bookmark } from '@/types'
import { createClient } from '@/utils/supabase/client'
import { Copy, ExternalLink, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function BookmarkItem({ bookmark }: { bookmark: Bookmark }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            const { error } = await supabase
                .from('bookmarks')
                .delete()
                .eq('id', bookmark.id)

            if (error) throw error

            toast.success('Bookmark deleted')

            // Refresh server data (fallback for same-tab if Realtime is slow)
            router.refresh()
        } catch (error: any) {
            toast.error('Failed to delete', { description: error.message })
            setIsDeleting(false)
        }
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(bookmark.url)
            toast.success('Copied to clipboard')
        } catch {
            toast.error('Failed to copy')
        }
    }

    return (
        <div className="group flex items-center justify-between p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-all">
            <div className="flex-1 min-w-0 mr-3 sm:mr-4">
                <h3 className="font-medium truncate text-foreground group-hover:text-primary transition-colors">
                    <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        {bookmark.title}
                        <ExternalLink className="h-3 w-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity" />
                    </a>
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{bookmark.url}</p>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleCopy}
                    className="p-2.5 sm:p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    title="Copy URL"
                >
                    <Copy className="h-4 w-4" />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2.5 sm:p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    title="Delete"
                >
                    {isDeleting ? (
                        <span className="h-4 w-4 block rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : (
                        <Trash2 className="h-4 w-4" />
                    )}
                </button>
            </div>
        </div>
    )
}
