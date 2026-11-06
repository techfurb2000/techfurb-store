import { supabase } from "@/lib/supabase/client"

export async function getDashboardStats() {
  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })
  const { count: activeProducts } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true)
  const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })
  const { count: newOrders } = await supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "New")

  return {
    totalProducts: totalProducts || 0,
    activeProducts: activeProducts || 0,
    totalOrders: totalOrders || 0,
    newOrders: newOrders || 0,
  }
}

export async function getRecentOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, total_amount, status, created_at, items")
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching recent orders", error)
    return []
  }

  return data
}

export async function getAllOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all orders", error)
    return []
  }

  return data
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)

  if (error) {
    console.error("Error updating order status", error)
    return false
  }

  return true
}

export async function getAllAdminProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching admin products", error)
    return []
  }

  return data
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting product", error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

export async function updateProduct(id: string, data: any) {
  const { error } = await supabase
    .from("products")
    .update(data)
    .eq("id", id)

  if (error) {
    console.error("Error updating product", error)
    return { success: false, error: error.message }
  }
  return { success: true }
}
