"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, X, Upload } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // NOTE: Assumes a public bucket named "product-images" exists in Supabase.
      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      onChange([...value, publicUrl])
    } catch (err: any) {
      setError(err.message || "Failed to upload image. Make sure the 'product-images' bucket exists and is public.")
      console.error("Upload error:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading}
          className="max-w-[300px]"
        />
        {isUploading && <Loader2 className="h-5 w-5 animate-spin text-[var(--text-secondary)]" />}
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative w-24 h-24 border border-[var(--border)] rounded-md overflow-hidden bg-[var(--bg-surface-alt)]">
              <Image 
                src={url} 
                alt="Product image" 
                fill 
                className="object-cover" 
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
