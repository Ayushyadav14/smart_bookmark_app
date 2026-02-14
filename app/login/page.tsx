'use client'

import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import Navbar from '@/components/Navbar'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    const handleLogin = async () => {
        try {
            setIsLoading(true)
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                    queryParams: {
                        prompt: 'select_account', // Always show account chooser
                    },
                },
            })

            if (error) {
                throw error
            }
        } catch (error: any) {
            toast.error('Login failed', {
                description: error.message,
            })
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-blue-50/30">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 bg-background p-10 rounded-2xl shadow-xl border border-border/50 backdrop-blur-sm">
                    <div className="text-center space-y-3">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
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
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome</h1>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                            Sign in to access your private real-time bookmark manager.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Button
                            variant="outline"
                            className="w-full h-12 text-base font-semibold hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                            ) : (
                                <svg
                                    className="mr-3 h-5 w-5"
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fab"
                                    data-icon="google"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 488 512"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                                    ></path>
                                </svg>
                            )}
                            Sign in with Google
                        </Button>
                    </div>

                    <div className="text-center">
                        <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">
                            Secure Authentication via Supabase
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}

function Button({ className, variant, ...props }: any) {
    let baseStyles = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50"
    let variantStyles = variant === 'outline'
        ? "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
        : "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"

    return <button className={`${baseStyles} ${variantStyles} ${className}`} {...props} />
}
