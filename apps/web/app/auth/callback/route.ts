import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log('Callback URL:', requestUrl.toString())
  console.log('Code present:', !!code)

  if (code) {
    // Await cookies() since it returns a Promise in Next.js 16
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
    }
    
    console.log('Auth successful, redirecting to dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  console.log('No code found, redirecting to login')
  return NextResponse.redirect(new URL('/login?error=no_code', request.url))
}