import { getActiveProducts } from "@/lib/api/products"
import Link from "next/link"
import Image from "next/image"
import { ProductCardCarousel } from "@/components/products/ProductCardCarousel"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProductsPage() {
  const products = await getActiveProducts()

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">All Laptops</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Basic Filters Sidebar (Static for now, can be made interactive later) */}
        <aside className="hidden md:block col-span-1 space-y-8">
          <div>
            <h3 className="font-semibold mb-4 text-[var(--text-primary)]">Categories</h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="cursor-pointer hover:text-[var(--text-primary)]">All</li>
              <li className="cursor-pointer hover:text-[var(--text-primary)]">Business</li>
              <li className="cursor-pointer hover:text-[var(--text-primary)]">Gaming</li>
              <li className="cursor-pointer hover:text-[var(--text-primary)]">Ultrabook</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-[var(--text-primary)]">Condition</h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="cursor-pointer hover:text-[var(--text-primary)]">Grade A (Like New)</li>
              <li className="cursor-pointer hover:text-[var(--text-primary)]">Grade B (Good)</li>
              <li className="cursor-pointer hover:text-[var(--text-primary)]">Grade C (Fair)</li>
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="col-span-1 md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <p className="text-[var(--text-secondary)]">No products found.</p>
            ) : (
              products.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.id}>
                  <Card className="h-full overflow-hidden hover:border-[var(--accent)] transition-colors duration-300 group">
                    <div className="relative aspect-[4/3] bg-white overflow-hidden">
                      <ProductCardCarousel images={product.images || []} alt={product.name} />
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
        </div>
      </div>
    </div>
  )
}
