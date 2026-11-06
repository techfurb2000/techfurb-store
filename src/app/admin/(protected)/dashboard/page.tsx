"use client"

import { useEffect, useState } from "react"
import { getDashboardStats, getRecentOrders } from "@/lib/api/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, TrendingUp, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, activeProducts: 0, totalOrders: 0, newOrders: 0 })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [statsData, ordersData] = await Promise.all([
        getDashboardStats(),
        getRecentOrders()
      ])
      setStats(statsData)
      setRecentOrders(ordersData || [])
      setIsLoading(false)
    }
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        <p className="text-[var(--text-secondary)] mt-1">Overview of your store's performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Total Products</CardTitle>
            <Package className="h-4 w-4 text-[var(--text-secondary)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Active Products</CardTitle>
            <TrendingUp className="h-4 w-4 text-[var(--accent)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--accent)]">{stats.activeProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-[var(--text-secondary)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">New Orders</CardTitle>
            <AlertCircle className="h-4 w-4 text-[var(--warning)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--warning)]">{stats.newOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Your latest 5 orders.</p>
          </div>
          <Link href="/admin/orders" className="text-sm text-[var(--accent-alt)] hover:underline">
            View All
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[var(--text-secondary)] uppercase bg-[var(--bg-surface-alt)]">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Order ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3 rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-[var(--text-secondary)]">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[var(--bg-surface-alt)]/50 transition-colors">
                      <td className="px-6 py-4 font-mono">{order.order_number}</td>
                      <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{order.customer_name}</td>
                      <td className="px-6 py-4 text-[var(--text-secondary)]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium">₹{order.total_amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          order.status === 'New' ? 'secondary' : 
                          order.status === 'Confirmed' ? 'default' : 
                          order.status === 'Cancelled' ? 'destructive' : 'outline'
                        }>
                          {order.status}
                        </Badge>
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
