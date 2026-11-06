import { supabase } from "@/lib/supabase/client"

export type OrderInput = {
  items: any[]
  total_amount: number
  customer_name: string
  customer_phone: string
  customer_email?: string
  delivery_address: string
  city: string
  pincode: string
  payment_preference: string
  notes?: string
}

export async function createOrder(order: OrderInput) {
  // Generate order number locally since we can't select() it back due to RLS policies
  const timestamp = new Date().toISOString().slice(2,10).replace(/-/g, '');
  const randomStr = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const order_number = `ORD-${timestamp}-${randomStr}`;

  const orderWithNumber = {
    ...order,
    order_number
  };

  const { error } = await supabase
    .from("orders")
    .insert(orderWithNumber)
    // Removed .select() because anonymous users don't have SELECT permissions, 
    // which causes the INSERT to rollback with an RLS error if we try to return data.

  if (error) {
    console.error("Error creating order:", error)
    return { success: false, error: error.message }
  }

  // We return the locally generated order_number so the UI can still show it
  return { success: true, data: { order_number } }
}
