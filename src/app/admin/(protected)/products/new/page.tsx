"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ImageUpload } from "@/components/admin/ImageUpload"

export default function AddProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    slug: "",
    price: "",
    original_price: "",
    condition_grade: "B",
    category: "laptop",
    stock_quantity: "1",
    description: "",
    cpu: "",
    ram: "",
    storage: "",
    images: [] as string[],
    is_featured: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const specs = {
      cpu: formData.cpu,
      ram: formData.ram,
      storage: formData.storage,
    }

    const { error } = await supabase.from("products").insert({
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      brand: formData.brand,
      category: formData.category,
      condition_grade: formData.condition_grade,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      stock_quantity: parseInt(formData.stock_quantity, 10),
      description: formData.description,
      specs: specs,
      images: formData.images,
      warranty_months: 6,
      is_active: true,
      is_featured: formData.is_featured,
    })

    setIsSubmitting(false)

    if (error) {
      alert("Error adding product: " + error.message)
    } else {
      router.push("/admin/products")
      router.refresh()
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Add Product</h1>
          <p className="text-[var(--text-secondary)] mt-1">Create a new product listing.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Basic Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[var(--text-secondary)] block mb-1">Product Name *</label>
                  <Input name="name" required value={formData.name} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-secondary)] block mb-1">Brand *</label>
                  <Input name="brand" required value={formData.brand} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[var(--text-secondary)] block mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm">
                    <option value="laptop">Laptop</option>
                    <option value="business">Business</option>
                    <option value="gaming">Gaming</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-secondary)] block mb-1">Condition</label>
                  <select name="condition_grade" value={formData.condition_grade} onChange={handleChange} className="flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm">
                    <option value="A">Grade A (Like New)</option>
                    <option value="B">Grade B (Good)</option>
                    <option value="C">Grade C (Fair)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-secondary)] block mb-1">Stock Qty *</label>
                  <Input type="number" name="stock_quantity" required value={formData.stock_quantity} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[var(--text-secondary)] block mb-1">Selling Price (₹) *</label>
                  <Input type="number" name="price" required value={formData.price} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-secondary)] block mb-1">Original Price (₹)</label>
                  <Input type="number" name="original_price" value={formData.original_price} onChange={handleChange} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="h-4 w-4 rounded accent-[var(--accent)]"
                />
                <span className="text-sm font-medium text-[var(--text-primary)]">Feature this product on Homepage (Best Deals)</span>
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Specifications</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[var(--text-secondary)] block mb-1">CPU</label>
                  <Input name="cpu" placeholder="e.g. i5-8350U" value={formData.cpu} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-secondary)] block mb-1">RAM</label>
                  <Input name="ram" placeholder="e.g. 8GB DDR4" value={formData.ram} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-secondary)] block mb-1">Storage</label>
                  <Input name="storage" placeholder="e.g. 256GB SSD" value={formData.storage} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)] block mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  className="flex min-h-[100px] w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Product Images</CardTitle></CardHeader>
            <CardContent>
              <ImageUpload 
                value={formData.images} 
                onChange={(images) => setFormData({ ...formData, images })} 
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/admin/products">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
