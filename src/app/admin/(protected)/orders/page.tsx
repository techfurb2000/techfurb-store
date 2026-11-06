"use client"

import { useEffect, useState } from "react"
import { getAllOrders } from "@/lib/api/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect"
import { Loader2 } from "lucide-react"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      const data = await getAllOrders()
      setOrders(data || [])
      setIsLoading(false)
    }
    loadOrders()
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
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Orders</h1>
        <p className="text-[var(--text-secondary)] mt-1">Manage and update customer orders.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[var(--text-secondary)] uppercase bg-[var(--bg-surface-alt)]">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Order ID</th>
                  <th className="px-6 py-3">Customer Info</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3 rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-[var(--bg-surface-alt)]/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{order.order_number}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-[var(--text-primary)]">{order.customer_name}</div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          {order.customer_phone} {order.customer_email ? `| ${order.customer_email}` : ''}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-1 break-words max-w-[250px]">
                          {order.delivery_address}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          {order.city} - {order.pincode}
                        </div>
                        <div className="mt-2 text-xs font-semibold text-[var(--accent)]">
                          {order.payment_preference}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {order.items && order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-start text-xs border-b border-[var(--border)] last:border-0 pb-1 last:pb-0">
                              <span className="font-medium truncate max-w-[150px]" title={item.name}>{item.name}</span>
                              <span className="text-[var(--text-secondary)] ml-2">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[var(--text-secondary)]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium">₹{order.total_amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
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
