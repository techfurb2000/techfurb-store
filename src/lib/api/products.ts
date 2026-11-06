import { supabase } from "@/lib/supabase/client"

export type Product = {
  id: string
  slug: string
  name: string
  brand: string
  model: string | null
  category: string
  condition_grade: "A" | "B" | "C"
  price: number
  original_price: number | null
  discount_percent: number
  stock_quantity: number
  is_active: boolean
  is_featured: boolean
  description: string | null
  specs: any
  images: string[]
  warranty_months: number
  created_at: string
  updated_at: string
}

export async function getActiveProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data as Product[]
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(4)

  if (error) {
    console.error("Error fetching featured products:", error)
    return []
  }

  // Fallback: If no products are explicitly marked featured, show latest active products
  if (!data || data.length === 0) {
    const { data: latestData, error: latestError } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(4)

    if (latestError) {
      console.error("Error fetching latest fallback products:", latestError)
      return []
    }
    return (latestData || []) as Product[]
  }

  return data as Product[]
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return data as Product
}
