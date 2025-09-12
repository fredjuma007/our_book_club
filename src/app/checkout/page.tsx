"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Phone, MapPin, User, Loader2 } from "lucide-react"
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

interface CheckoutForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [form, setForm] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  })

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("bookClubCart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
    setIsLoading(false)
  }, [])

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleMpesaPayment = async () => {
    if (!form.firstName || !form.lastName || !form.phone || !form.email) {
      alert("Please fill in all required fields")
      return
    }

    setIsProcessing(true)

    try {
      // Simulate Mpesa Daraja API call
      // In a real implementation, you would call your backend API here
      const response = await fetch("/api/mpesa/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
          phone: form.phone,
          orderDetails: {
            items: cartItems,
            customer: form,
            total: totalAmount,
          },
        }),
      })

      if (response.ok) {
        // Clear cart and redirect to success page
        localStorage.removeItem("bookClubCart")
        alert("Payment initiated! Please check your phone for the M-Pesa prompt.")
        // In a real app, you'd redirect to a success page
      } else {
        throw new Error("Payment failed")
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment failed. Please try again or contact support.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f0e1] dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="w-16 h-16 text-emerald-600 mx-auto mb-4 animate-pulse" />
          <p className="text-emerald-700 font-serif text-lg">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f0e1] dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="w-24 h-24 text-emerald-600/50 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-500 font-serif mb-4">
            No items to checkout
          </h2>
          <p className="text-gray-600 dark:text-gray-300 font-serif mb-8">
            Your cart is empty. Add some items before proceeding to checkout.
          </p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-serif px-8 py-3">
            <Link href="/store">Start Shopping</Link>
          </Button>
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
              <Link href="/cart">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Cart
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 dark:text-emerald-500 font-serif mb-4">
              Checkout
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-serif">
              Complete your order for {totalItems} item{totalItems > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-emerald-800 dark:text-emerald-500 font-serif flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="font-serif text-emerald-800 dark:text-emerald-400">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="border-emerald-200 focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="font-serif text-emerald-800 dark:text-emerald-400">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="border-emerald-200 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="font-serif text-emerald-800 dark:text-emerald-400">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="font-serif text-emerald-800 dark:text-emerald-400">
                    Phone Number (M-Pesa) *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="254700000000"
                    value={form.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-emerald-800 dark:text-emerald-500 font-serif flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address" className="font-serif text-emerald-800 dark:text-emerald-400">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500"
                    placeholder="Street address, building, apartment"
                  />
                </div>

                <div>
                  <Label htmlFor="city" className="font-serif text-emerald-800 dark:text-emerald-400">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500"
                    placeholder="Nairobi, Mombasa, etc."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-emerald-800 dark:text-emerald-500 font-serif">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 pb-3 border-b border-emerald-100 dark:border-emerald-800 last:border-b-0"
                  >
                    <div className="flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={convertWixImageToUrl(item.image) || "/placeholder.svg"}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                        />
                      ) : (
                        <div className="w-15 h-15 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center border border-emerald-200 dark:border-emerald-700">
                          <CreditCard className="w-6 h-6 text-emerald-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-emerald-800 dark:text-emerald-500 font-serif text-sm">
                        {item.name}
                      </h4>
                      <div className="flex justify-between items-center mt-1">
                        <Badge
                          variant="outline"
                          className="border-emerald-600 text-emerald-700 dark:text-emerald-400 font-serif text-xs"
                        >
                          Qty: {item.quantity}
                        </Badge>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 font-serif text-sm">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-serif text-gray-600 dark:text-gray-300">Subtotal</span>
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
                </div>
              </CardContent>
            </Card>

            {/* Payment Options */}
            <Card className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-emerald-800 dark:text-emerald-500 font-serif">
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleMpesaPayment}
                  disabled={isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-serif py-6 text-lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay with M-Pesa - KES {totalAmount.toLocaleString()}
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <span className="text-gray-500 font-serif">or</span>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-serif py-6 text-lg bg-transparent"
                  asChild
                >
                  <a href="tel:+254700000000">
                    <Phone className="w-5 h-5 mr-2" />
                    Order by Call: +254 700 000 000
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
