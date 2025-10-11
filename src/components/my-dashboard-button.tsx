"use client"

import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function MyDashboardButton() {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link href="/dashboard">
        <Button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 font-serif group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
          <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <User className="w-4 h-4 relative z-10" />
          <span className="relative z-10">My Dashboard</span>
        </Button>
      </Link>
    </motion.div>
  )
}
