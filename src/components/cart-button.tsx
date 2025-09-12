"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

export function CartButton() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Load cart count from localStorage
    const updateCartCount = () => {
      const savedCart = localStorage.getItem("bookClubCart")
      if (savedCart) {
        const cart = JSON.parse(savedCart)
        const totalItems = cart.reduce((total: number, item: any) => total + item.quantity, 0)
        setCartCount(totalItems)
      } else {
        setCartCount(0)
      }
    }

    // Initial load
    updateCartCount()

    // Listen for storage changes (when cart is updated in other tabs/components)
    const handleStorageChange = () => {
      updateCartCount()
    }

    window.addEventListener("storage", handleStorageChange)

    // Custom event for same-tab updates
    window.addEventListener("cartUpdated", updateCartCount)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  return (
    <Button
      variant="outline"
      className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-serif relative bg-transparent"
      asChild
    >
      <Link href="/cart">
        <ShoppingCart className="w-4 h-4 mr-2" />
        Cart
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Link>
    </Button>
  )
}
