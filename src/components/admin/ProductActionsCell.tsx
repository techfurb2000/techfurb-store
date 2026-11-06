"use client"

import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { deleteProduct } from "@/lib/api/admin"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function ProductActionsCell({ productId, productName }: { productId: string, productName: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${productName}? This action cannot be undone.`)) {
      setIsDeleting(true)
      const result = await deleteProduct(productId)
      if (result.success) {
        router.refresh()
      } else {
        alert("Failed to delete product.")
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-[var(--text-secondary)] hover:text-[var(--accent-alt)]" 
        disabled={isDeleting}
        onClick={() => router.push(`/admin/products/edit/${productId}`)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDelete}
        disabled={isDeleting}
        className="h-8 w-8 text-[var(--text-secondary)] hover:text-[var(--danger)]"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
