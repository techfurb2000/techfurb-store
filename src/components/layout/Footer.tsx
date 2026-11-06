import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-surface)] py-8 mt-auto">
      <div className="container mx-auto px-4 md:px-8 text-sm text-[var(--text-secondary)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">TechFurb</h4>
            <p className="max-w-xs">Premium refurbished laptops at unbeatable prices. Tested, certified, and ready for you.</p>
          </div>
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="hover:text-[var(--text-primary)]">All Laptops</Link></li>
              <li><Link href="/about" className="hover:text-[var(--text-primary)]">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--text-primary)]">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/warranty" className="hover:text-[var(--text-primary)]">Warranty Policy</Link></li>
              <li><Link href="/faq" className="hover:text-[var(--text-primary)]">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-[var(--text-primary)]">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>Email: supporttechfurb@gmail.com</li>
              <li>Phone: +1 234 567 890</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 TechFurb. All rights reserved.</p>
          <Link href="/admin" className="text-xs text-[var(--text-secondary)] opacity-60 hover:opacity-100 transition-opacity">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
