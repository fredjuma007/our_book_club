import { getServerClient } from "@/lib/wix"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import ProductPageClient from "./ProductPageClient"

// This forces the page to be dynamically rendered and not cached
export const dynamic = "force-dynamic"
export const revalidate = 0

interface Product {
  _id: string
  name: string
  category: string
  price: number
  description?: string
  image?: any
  inStock: boolean
  featured: boolean
}

interface PageProps {
  params: { productId: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const paramsObj = await params
  return {
    title: `Product Details - ${paramsObj.productId}`,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const paramsObj = await params
  const productId = paramsObj.productId

  const client = await getServerClient()

  try {
    const productResponse = await client.items.get("Merchandise", productId)

    // console.log("[v0] Raw product data from Wix:", JSON.stringify(productResponse, null, 2))

    if (!productResponse) {
      return notFound()
    }

    const product: Product = {
      _id: productResponse._id,
      name: productResponse.title_fld, // Map title_fld to name
      category: productResponse.category,
      price: productResponse.price,
      description: productResponse.description_fld, // Map description_fld to description
      image: productResponse.image_fld, // Map image_fld to image
      inStock: productResponse.inStock ?? true,
      featured: productResponse.featured ?? false,
    }

    // console.log("[v0] Mapped product data:", product)

    if (!product.name) {
      return notFound()
    }

    return <ProductPageClient product={product} />
  } catch (error) {
    console.error("Error fetching product data:", error)
    return notFound()
  }
}
