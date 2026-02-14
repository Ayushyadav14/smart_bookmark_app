'use client'

import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

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
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/40">
            <div className="w-full max-w-sm space-y-8 bg-background p-8 rounded-lg shadow-lg border">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to manage your bookmarks
                    </p>
                </div>

                <Button
                    variant="outline"
                    className="w-full h-12 text-base font-medium"
                    onClick={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <svg
                            className="mr-2 h-5 w-5"
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
        </div>
    )
}

function Button({ className, variant, ...props }: any) {
    // Quick inline button component for now since we don't have the full shadcn/ui library setup automated
    // We will replace this with proper components later if needed, but for now standard tailwind is enough
    let baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    let variantStyles = variant === 'outline'
        ? "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
        : "bg-primary text-primary-foreground shadow hover:bg-primary/90"

    return <button className={`${baseStyles} ${variantStyles} ${className}`} {...props} />
}
