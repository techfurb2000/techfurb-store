"use client"

import { useState } from "react"
import { useCartStore } from "@/store/useCartStore"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createOrder } from "@/lib/api/orders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().min(5, "Delivery address is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().min(6, "Valid pincode is required"),
  payment_preference: z.enum(["COD", "Bank Transfer", "UPI Manual"]),
  notes: z.string().optional(),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderAmount, setOrderAmount] = useState(0)
  const [orderPaymentPref, setOrderPaymentPref] = useState("")
  const [showQRScreen, setShowQRScreen] = useState(false)
  const [pendingFormData, setPendingFormData] = useState<CheckoutFormValues | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      payment_preference: "COD",
    }
  })

  const onSubmit = async (data: CheckoutFormValues) => {
    if (data.payment_preference === "UPI Manual") {
      setPendingFormData(data)
      setOrderAmount(getTotalPrice())
      setShowQRScreen(true)
      return
    }
    await processOrder(data)
  }

  const processOrder = async (data: CheckoutFormValues) => {
    setIsSubmitting(true)
    
    const orderItems = items.map(item => ({
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }))

    const result = await createOrder({
      items: orderItems,
      total_amount: getTotalPrice(),
      customer_name: data.name,
      customer_phone: data.phone,
      customer_email: data.email,
      delivery_address: data.address,
      city: data.city,
      pincode: data.pincode,
      payment_preference: data.payment_preference,
      notes: data.notes,
    })
    setIsSubmitting(false)

    if (result.success && result.data) {
      setIsSuccess(true)
      setOrderId(result.data.order_number)
      setOrderAmount(getTotalPrice())
      setOrderPaymentPref(data.payment_preference)
      clearCart()
    } else {
      alert(`Failed to place order. Error: ${result.error || "Unknown Error"}`)
    }
  }

  if (showQRScreen && pendingFormData) {
    const upiId = "9850035270@ybl"
    const upiUrl = `upi://pay?pa=${upiId}&pn=TechFurb&am=${orderAmount}&cu=INR`

    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Almost there! 🚀</h1>
          <p className="text-lg text-[var(--text-secondary)] mb-6">
            Scan the QR code below to pay <strong className="text-[var(--text-primary)]">₹{orderAmount.toLocaleString()}</strong>.
          </p>
          <div className="bg-white p-6 rounded-2xl inline-block shadow-lg border border-[var(--border)] mb-6">
            <QRCodeSVG value={upiUrl} size={200} />
            <p className="font-mono text-sm mt-4 text-black">{upiId}</p>
          </div>
          <div className="bg-[var(--bg-surface-alt)] border border-[var(--border)] p-4 rounded-xl mb-8">
            <p className="font-bold text-[var(--danger)]">Important:</p>
            <p className="text-sm text-[var(--text-secondary)]">Please complete the payment on your UPI app, then click the button below to confirm your order.</p>
          </div>
          <Button 
            size="lg" 
            className="w-full sm:w-auto text-lg px-12 py-6"
            onClick={() => {
              setShowQRScreen(false)
              processOrder(pendingFormData)
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Payment Done"}
          </Button>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    const isUPI = orderPaymentPref === "UPI Manual"

    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 text-green-500 mb-8">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-lg text-[var(--text-secondary)] mb-8">Thank you for your purchase. We will contact you shortly to confirm delivery.</p>
        
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] p-6 rounded-xl mb-8">
          <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-2">Your Order Number</p>
          <p className="font-mono text-3xl font-bold text-[var(--accent)]">{orderId}</p>
        </div>

        {isUPI && (
          <div className="bg-[var(--bg-surface-alt)] border border-[var(--border)] p-4 rounded-xl mb-8 inline-block text-left">
            <p className="font-bold text-[var(--text-primary)] mb-2">Final Step!</p>
            <p className="text-sm text-[var(--text-secondary)]">Please send the screenshot of your payment to us via WhatsApp so we can process your order.</p>
          </div>
        )}
        <div className="w-full"></div>
        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => window.open(`https://wa.me/919850035270?text=Hi! I just placed an order on TechFurb. Order ID: ${orderId}${isUPI ? '. Here is my payment screenshot: ' : ''}`, '_blank')}>
            Confirm via WhatsApp
          </Button>
          <Link href="/products">
            <Button size="lg" variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-md">
        <div className="bg-[var(--bg-surface)] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-[var(--text-secondary)] mb-8">Looks like you haven't added any laptops to your cart yet.</p>
        <Link href="/products">
          <Button size="lg" className="w-full">Browse Laptops</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-[var(--text-primary)]">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0 flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 aspect-video sm:aspect-square bg-white flex-shrink-0 border-r border-[var(--border)]">
                  {item.images?.[0] ? (
                    <Image src={item.images[0]} alt={item.name} fill className="object-contain p-2" />
                  ) : (
                    <div className="w-full h-full bg-gray-200"></div>
                  )}
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Link href={`/products/${item.slug}`} className="hover:underline">
                        <h3 className="font-bold text-lg text-[var(--text-primary)]">{item.name}</h3>
                      </Link>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">{item.brand} • Grade {item.condition_grade}</p>
                    </div>
                    <p className="font-bold text-lg">₹{item.price.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center border border-[var(--border)] rounded-md">
                      <button 
                        className="px-3 py-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                      <button 
                        className="px-3 py-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-[var(--danger)] hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Checkout Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 md:p-8 sticky top-24">
            <h3 className="text-xl font-bold mb-6 border-b border-[var(--border)] pb-4">Checkout Details</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Shipping</span>
                <span className="text-[var(--accent)] font-medium">Free</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-4 border-t border-[var(--border)]">
                <span>Total</span>
                <span>₹{getTotalPrice().toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Input placeholder="Full Name *" {...register("name")} />
                {errors.name && <p className="text-[var(--danger)] text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Input placeholder="Phone Number *" type="tel" {...register("phone")} />
                {errors.phone && <p className="text-[var(--danger)] text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <Input placeholder="Email Address (Optional)" type="email" {...register("email")} />
                {errors.email && <p className="text-[var(--danger)] text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Input placeholder="Delivery Address *" {...register("address")} />
                {errors.address && <p className="text-[var(--danger)] text-xs mt-1">{errors.address.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input placeholder="City *" {...register("city")} />
                  {errors.city && <p className="text-[var(--danger)] text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <Input placeholder="Pincode *" {...register("pincode")} />
                  {errors.pincode && <p className="text-[var(--danger)] text-xs mt-1">{errors.pincode.message}</p>}
                </div>
              </div>
              <div>
                <select 
                  {...register("payment_preference")}
                  className="flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="UPI Manual">Pay Online (UPI QR Code)</option>
                </select>
              </div>
              
              <Button type="submit" size="lg" className="w-full mt-4" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
