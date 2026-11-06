import { getProductBySlug } from "@/lib/api/products"
import { notFound } from "next/navigation"
import { Metadata, ResolvingMetadata } from "next"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ImageGallery } from "@/components/products/ImageGallery"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck } from "lucide-react"
import { AddToCartButton } from "@/components/store/AddToCartButton"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  const previousImages = (await parent).openGraph?.images || []
  const productImages = product.images?.length > 0 ? product.images : previousImages

  return {
    title: `${product.name} - Refurbished | TechFurb`,
    description: product.description || `Buy a refurbished ${product.name} in Grade ${product.condition_grade} condition at an unbeatable price.`,
    openGraph: {
      title: `${product.name} - Refurbished`,
      description: product.description || `Buy a refurbished ${product.name} in Grade ${product.condition_grade} condition at an unbeatable price.`,
      images: productImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - Refurbished`,
      description: product.description || `Buy a refurbished ${product.name} in Grade ${product.condition_grade} condition at an unbeatable price.`,
      images: productImages,
    }
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)

  if (!product || !product.is_active) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="w-full">
          <ImageGallery images={product.images || []} alt={product.name} />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <Badge variant={product.condition_grade === 'A' ? 'gradeA' : product.condition_grade === 'B' ? 'gradeB' : 'gradeC'} className="w-fit mb-4">
            Grade {product.condition_grade} Condition
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[var(--text-primary)]">{product.name}</h1>
          <p className="text-lg text-[var(--text-secondary)] mb-6">Brand: {product.brand}</p>
          
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-4xl font-bold text-[var(--text-primary)]">
              ₹{product.price.toLocaleString()}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xl line-through text-[var(--text-secondary)]">
                ₹{product.original_price.toLocaleString()}
              </span>
            )}
            {product.discount_percent > 0 && (
              <Badge variant="destructive" className="ml-2">
                Save {product.discount_percent}%
              </Badge>
            )}
          </div>

          <div className="bg-[var(--bg-surface-alt)] border border-[var(--border)] rounded-lg p-4 mb-8 flex items-center gap-3">
            <ShieldCheck className="text-[var(--accent)] h-6 w-6" />
            <div>
              <p className="font-semibold text-sm">Includes 6 Months Warranty</p>
              <p className="text-xs text-[var(--text-secondary)]">Tested and certified working</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-8 text-[var(--text-secondary)]">
            <ul className="list-disc pl-5 space-y-2">
              {(() => {
                if (!product.description) return <li>No description available.</li>;
                
                // First try splitting by newlines
                const lines = product.description.split('\n').filter(line => line.trim().length > 0);
                
                // If it's just one long paragraph without newlines, split by sentences
                if (lines.length === 1) {
                  const sentences = product.description.split(/\.\s+/).filter(s => s.trim().length > 0);
                  return sentences.map((sentence, i) => (
                    <li key={i}>{sentence.trim()}{!sentence.trim().endsWith('.') ? '.' : ''}</li>
                  ));
                }

                // Otherwise, use the lines as bullets
                return lines.map((line, i) => (
                  <li key={i}>{line.trim()}</li>
                ));
              })()}
            </ul>
          </div>

          {/* Checkout CTA */}
          <div className="mt-auto pt-8 border-t border-[var(--border)]">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold mb-6">Full Specifications</h2>
        <div className="border border-[var(--border)] rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-[var(--border)]">
              {product.specs && Object.entries(product.specs).map(([key, value], idx) => (
                <tr key={key} className={idx % 2 === 0 ? "bg-[var(--bg-surface-alt)]" : "bg-[var(--bg-surface)]"}>
                  <td className="px-6 py-4 font-medium text-[var(--text-secondary)] capitalize w-1/3">
                    {key.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 text-[var(--text-primary)]">
                    {Array.isArray(value) ? value.join(", ") : String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
