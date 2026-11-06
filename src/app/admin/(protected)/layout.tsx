"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, LogOut, Loader2 } from "lucide-react"

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      const isAllowedAdmin = session?.user?.email === adminEmail
      
      if (!session || !isAllowedAdmin) {
        if (session && !isAllowedAdmin) {
          // If logged in but not an admin, sign out automatically for security
          await supabase.auth.signOut()
        }
        router.replace("/admin")
      } else {
        setIsLoading(false)
      }
    }
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
        const isAllowedAdmin = session?.user?.email === adminEmail

        if (event === "SIGNED_OUT" || !session || !isAllowedAdmin) {
          router.replace("/admin")
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    )
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  ]

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--border)] bg-[var(--bg-surface)] hidden md:flex flex-col">
        <div className="p-6 border-b border-[var(--border)]">
          <span className="font-bold text-xl text-[var(--text-primary)]">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-alt)] hover:text-[var(--text-primary)]"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-[var(--border)]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-[var(--text-secondary)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--bg-surface)]">
          <span className="font-bold text-lg text-[var(--text-primary)]">Admin Panel</span>
          <button onClick={handleLogout} className="text-[var(--text-secondary)]">
            <LogOut className="h-6 w-6" />
          </button>
        </header>
        {/* Mobile Nav Tabs */}
        <nav className="md:hidden flex border-b border-[var(--border)] bg-[var(--bg-surface)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex-1 flex justify-center py-3 border-b-2 transition-colors ${
                  isActive
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-transparent text-[var(--text-secondary)]"
                }`}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            )
          })}
        </nav>
        
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
