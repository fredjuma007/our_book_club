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
    const productResponse = await client.items.getDataItem(productId, {
      dataCollectionId: "Merchandise",
    })

    const product = productResponse?.data as Product | undefined

    if (!product) {
      return notFound()
    }

    return <ProductPageClient product={product} />
  } catch (error) {
    console.error("Error fetching product data:", error)
    return notFound()
  }
}
