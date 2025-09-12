"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, Phone, CreditCard } from "lucide-react"
import { convertWixImageToUrl } from "@/lib/wix-client"

interface CartItem {
  _id: string
  name: string
  category: string
  price: number
  description?: string
  image?: any
  inStock: boolean
  featured: boolean
  quantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("bookClubCart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
    setIsLoading(false)
  }, [])

  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart)
    localStorage.setItem("bookClubCart", JSON.stringify(newCart))
  }

  const updateQuantity = (id: string, change: number) => {
    const newCart = cartItems.map((item) => {
      if (item._id === id) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    updateCart(newCart)
  }

  const removeItem = (id: string) => {
    const newCart = cartItems.filter((item) => item._id !== id)
    updateCart(newCart)
  }

  const clearCart = () => {
    updateCart([])
  }

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f0e1] dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-emerald-600 mx-auto mb-4 animate-pulse" />
          <p className="text-emerald-700 font-serif text-lg">Loading your cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f0e1] dark:bg-gray-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#059669_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#10b981_1px,transparent_0)] bg-[length:40px_40px] opacity-20" />

        <div className="max-w-screen-xl mx-auto py-16 px-4 lg:px-8 relative">
          <div className="mb-8">
            <Button
              variant="outline"
              className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-serif bg-transparent"
              asChild
            >
              <Link href="/store">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 dark:text-emerald-500 font-serif mb-4">
              Shopping Cart 🛒
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-serif">
              {totalItems > 0 ? `${totalItems} item${totalItems > 1 ? "s" : ""} in your cart` : "Your cart is empty"}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 pb-16">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-emerald-600/50 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-500 font-serif mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-serif mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-serif px-8 py-3">
              <Link href="/store">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-500 font-serif">Cart Items</h2>
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="border-red-500 text-red-600 hover:bg-red-50 font-serif bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </div>

              {cartItems.map((item) => (
                <Card
                  key={item._id}
                  className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={convertWixImageToUrl(item.image) || "/placeholder.svg"}
                            alt={item.name}
                            width={100}
                            height={100}
                            className="rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center border border-emerald-200 dark:border-emerald-700">
                            <ShoppingCart className="w-8 h-8 text-emerald-500" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-500 font-serif">
                              {item.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className="border-emerald-600 text-emerald-700 dark:text-emerald-400 font-serif"
                            >
                              {item.category}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item._id, -1)}
                              disabled={item.quantity <= 1}
                              className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="text-lg font-bold text-emerald-800 dark:text-emerald-400 min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item._id, 1)}
                              className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400 font-serif">
                              KES {(item.price * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              KES {item.price.toLocaleString()} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-emerald-800 dark:text-emerald-500 font-serif">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-serif text-gray-600 dark:text-gray-300">Subtotal ({totalItems} items)</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 font-serif">
                      KES {totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-serif text-gray-600 dark:text-gray-300">Shipping</span>
                    <span className="font-serif text-emerald-700 dark:text-emerald-400">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold font-serif text-emerald-800 dark:text-emerald-500">Total</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 font-serif">
                      KES {totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button
                      asChild
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-serif py-6 text-lg"
                    >
                      <Link href="/checkout">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Proceed to Checkout
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-serif py-6 text-lg bg-transparent"
                      asChild
                    >
                      <a href="tel:+254700000000">
                        <Phone className="w-5 h-5 mr-2" />
                        Order by Call
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
