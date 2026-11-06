import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

import { CartIcon } from "@/components/store/CartIcon"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/Website Logo.png" alt="TechFurb Logo" width={40} height={40} className="object-contain" priority />
          <span className="font-bold tracking-tight text-2xl">
            <span className="text-yellow-400">Tech</span><span className="text-white">Furb</span>
          </span>
        </Link>
        <nav className="hidden md:flex ml-10 gap-6 text-sm font-medium text-[var(--text-secondary)]">
          <Link href="/products" className="hover:text-[var(--text-primary)] transition-colors">
            Products
          </Link>
          <Link href="/about" className="hover:text-[var(--text-primary)] transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-[var(--text-primary)] transition-colors">
            Contact
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search products</span>
          </Button>
          <CartIcon />
        </div>
      </div>
    </header>
  )
}
