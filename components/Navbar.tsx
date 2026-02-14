'use client'

import { createClient } from '@/utils/supabase/client'
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState, useRef, useEffect } from 'react'

export default function Navbar({ userEmail, userName }: { userEmail?: string; userName?: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

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
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8">
                <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
                    <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-inner">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                        </svg>
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Smart Bookmark
                    </span>
                </div>

                {userEmail && (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                            aria-expanded={isOpen}
                            aria-haspopup="true"
                        >
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                                <UserIcon className="h-5 w-5" />
                            </div>
                            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border bg-popover text-popover-foreground shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none transition-all animate-in fade-in zoom-in-95 duration-100 pb-1 z-50">
                                <div className="px-4 py-4 border-b border-border/50">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Account</p>
                                    <div className="space-y-0.5">
                                        <p className="text-xs text-muted-foreground font-medium">Logged in as:</p>
                                        <p className="text-sm font-semibold truncate text-foreground">
                                            {userName || userEmail}
                                        </p>
                                        {userName && (
                                            <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="p-1.5">
                                    <button
                                        onClick={handleSignOut}
                                        className="flex w-full items-center px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors font-medium group"
                                    >
                                        <div className="bg-destructive/10 p-1.5 rounded-md mr-3 transition-colors group-hover:bg-destructive/20">
                                            <LogOut className="h-4 w-4" />
                                        </div>
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
