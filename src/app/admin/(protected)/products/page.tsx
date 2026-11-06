"use client"

import { useEffect, useState } from "react"
import { getAllAdminProducts } from "@/lib/api/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Loader2 } from "lucide-react"
import Image from "next/image"
import { ProductActionsCell } from "@/components/admin/ProductActionsCell"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      const data = await getAllAdminProducts()
      setProducts(data || [])
      setIsLoading(false)
    }
    loadProducts()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Products</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage your store's inventory.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[var(--text-secondary)] uppercase bg-[var(--bg-surface-alt)]">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Product</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 rounded-tr-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                      No products found. Add a product to get started.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-[var(--bg-surface-alt)]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 bg-white rounded overflow-hidden border border-[var(--border)] flex-shrink-0">
                            {product.images?.[0] ? (
                              <Image src={product.images[0]} alt={product.name} fill className="object-contain" sizes="40px" />
                            ) : (
                              <div className="w-full h-full bg-gray-200"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-[var(--text-primary)]">{product.name}</div>
                            <div className="text-xs text-[var(--text-secondary)]">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        ₹{product.price.toLocaleString()}
                        {product.discount_percent > 0 && (
                          <span className="ml-2 text-xs text-[var(--danger)]">(-{product.discount_percent}%)</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {product.stock_quantity > 0 ? (
                          <span>{product.stock_quantity} in stock</span>
                        ) : (
                          <span className="text-[var(--danger)]">Out of stock</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={product.is_active ? 'default' : 'secondary'}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ProductActionsCell productId={product.id} productName={product.name} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
