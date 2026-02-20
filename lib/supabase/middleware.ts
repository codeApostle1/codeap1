import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAdminProtectedRoute = path.startsWith('/admin') && !path.startsWith('/admin/login')

  if (isAdminProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isAdminProtectedRoute && user) {
    const admins = process.env.ADMIN_EMAILS?.split(',').map((email) => email.trim().toLowerCase()) ?? []
    if (admins.length > 0 && !admins.includes(user.email?.toLowerCase() ?? '')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}
