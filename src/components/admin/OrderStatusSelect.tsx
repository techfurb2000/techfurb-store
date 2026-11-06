"use client"

import { useState } from "react"
import { updateOrderStatus } from "@/lib/api/admin"

export function OrderStatusSelect({ orderId, initialStatus }: { orderId: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setIsUpdating(true)
    const success = await updateOrderStatus(orderId, newStatus)
    if (success) {
      setStatus(newStatus)
    } else {
      alert("Failed to update status")
    }
    setIsUpdating(false)
  }

  return (
    <select
      value={status}
      onChange={handleStatusChange}
      disabled={isUpdating}
      className={`text-xs font-semibold rounded-full px-2.5 py-1 border-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
        status === 'New' ? 'bg-[var(--accent-alt)] text-white' :
        status === 'Contacted' ? 'bg-[var(--warning)] text-[#0B0F14]' :
        status === 'Confirmed' ? 'bg-[var(--accent)] text-[#0B0F14]' :
        status === 'Delivered' ? 'bg-green-700 text-white' :
        status === 'Cancelled' ? 'bg-[var(--danger)] text-white' :
        'bg-[var(--bg-surface-alt)] text-[var(--text-primary)]'
      }`}
    >
      <option value="New">New</option>
      <option value="Contacted">Contacted</option>
      <option value="Confirmed">Confirmed</option>
      <option value="Delivered">Delivered</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  )
}
