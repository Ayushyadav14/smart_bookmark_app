'use client'

import { createClient } from '@/utils/supabase/client'
import { LogOut, User as UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function Navbar({ userEmail }: { userEmail: string }) {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            router.refresh()
            router.push('/login')
        } catch (error: any) {
            toast.error('Error signing out')
        }
    }

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between mx-auto px-4">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <div className="bg-primary text-primary-foreground p-1 rounded">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                        </svg>
                    </div>
                    <span>Bookmarks</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground hidden sm:flex">
                        <UserIcon className="h-4 w-4" />
                        <span>{userEmail}</span>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-destructive/10 hover:text-destructive h-9 px-4 py-2"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                    </button>
                </div>
            </div>
        </nav>
    )
}
