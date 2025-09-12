"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"

export function CartButton() {
  const [cartCount, setCartCount] = useState(0)

  return (
    <Button
      variant="outline"
      className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-serif relative bg-transparent"
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      Cart
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </Button>
  )
}
