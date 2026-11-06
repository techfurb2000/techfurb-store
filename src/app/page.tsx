import Link from "next/link"
import Image from "next/image"
import { getFeaturedProducts } from "@/lib/api/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Truck, RefreshCcw, ThumbsUp } from "lucide-react"

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[var(--bg-surface-alt)] to-[var(--bg-primary)] px-4 py-24 md:px-8">
        <div className="container mx-auto flex flex-col items-center text-center">
          <Badge variant="secondary" className="mb-6">
            Trusted by 500+ Customers
          </Badge>
          <h1 className="mb-6 max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            Premium Refurbished Laptops at <span className="text-[var(--accent)]">Unbeatable Prices</span>
          </h1>
          <p className="mb-10 max-w-2xl text-lg text-[var(--text-secondary)] md:text-xl">
            High-performance, fully tested, and certified laptops for business, gaming, and everyday use. Quality you can trust.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto font-semibold">
                Shop Now
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
            <ShieldCheck className="h-8 w-8 text-[var(--accent)]" />
            <h3 className="font-semibold text-sm md:text-base">Tested & Certified</h3>
            <p className="text-xs text-[var(--text-secondary)]">Rigorous quality checks</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
            <ThumbsUp className="h-8 w-8 text-[var(--accent)]" />
            <h3 className="font-semibold text-sm md:text-base">Warranty Included</h3>
            <p className="text-xs text-[var(--text-secondary)]">Peace of mind guaranteed</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
            <Truck className="h-8 w-8 text-[var(--accent)]" />
            <h3 className="font-semibold text-sm md:text-base">Free Delivery</h3>
            <p className="text-xs text-[var(--text-secondary)]">On all orders</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
            <RefreshCcw className="h-8 w-8 text-[var(--accent)]" />
            <h3 className="font-semibold text-sm md:text-base">Easy Returns</h3>
            <p className="text-xs text-[var(--text-secondary)]">7-day return policy</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Best Deals</h2>
          <Link href="/products" className="text-sm font-medium text-[var(--accent-alt)] hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.length === 0 ? (
            <p className="text-[var(--text-secondary)] col-span-full">No products available at the moment. Run the SQL script to seed the database.</p>
          ) : (
            featuredProducts.map((product) => (
              <Link href={`/products/${product.slug}`} key={product.id}>
                <Card className="h-full overflow-hidden hover:border-[var(--accent)] transition-colors duration-300 group">
                  <div className="relative aspect-[4/3] bg-white overflow-hidden">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <Badge variant={product.condition_grade === 'A' ? 'gradeA' : product.condition_grade === 'B' ? 'gradeB' : 'gradeC'}>
                        Grade {product.condition_grade}
                      </Badge>
                    </div>
                    {product.discount_percent > 0 && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="destructive">
                          -{product.discount_percent}%
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex flex-col gap-2">
                    <h3 className="font-semibold truncate text-[var(--text-primary)]" title={product.name}>
                      {product.name}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] truncate">
                      {product.specs?.cpu} • {product.specs?.ram} • {product.specs?.storage}
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-[var(--text-primary)]">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm line-through text-[var(--text-secondary)]">
                          ₹{product.original_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
