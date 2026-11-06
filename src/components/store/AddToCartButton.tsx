"use client"

import { Product } from "@/lib/api/products"
import { useCartStore } from "@/store/useCartStore"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const [isAdded, setIsAdded] = useState(false)
  const router = useRouter()

  const handleAddToCart = () => {
    addItem(product, 1)
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <div className="flex gap-4">
      <Button 
        size="lg" 
        className="flex-1" 
        onClick={handleAddToCart}
        variant={isAdded ? "secondary" : "default"}
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        {isAdded ? "Added to Cart" : "Add to Cart"}
      </Button>
      <Button 
        size="lg" 
        variant="outline"
        onClick={() => {
          addItem(product, 1)
          router.push("/cart")
        }}
      >
        Buy Now
      </Button>
    </div>
  )
}
