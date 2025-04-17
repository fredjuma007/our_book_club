"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Heart,
  Home,
  Baby,
  BookOpen,
  Utensils,
  Phone,
  Copy,
  CheckCheck,
  Calendar,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { useState, useEffect } from "react"
import Footer from "@/components/footer"

export default function DonatePage() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("needs")
  const [showDonationModal, setShowDonationModal] = useState(false)

  // Donation tracking state
  const [donationAmount, setDonationAmount] = useState(13600)
  const [donationGoal, setDonationGoal] = useState(15000)
  const [donorCount, setDonorCount] = useState(26)
  const [donationPercentage, setDonationPercentage] = useState(0)

  // Calculate percentage whenever amount or goal changes
  useEffect(() => {
    const percentage = (donationAmount / donationGoal) * 100
    setDonationPercentage(percentage)
  }, [donationAmount, donationGoal])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative bg-green-50 min-h-screen text-green-800 dark:text-green-400 overflow-x-hidden selection:bg-green-700/30">
      {/* Animated background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,#15803d_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#22c55e_1px,transparent_0)] bg-[length:30px_30px] opacity-30 animate-fade" />

      {/* Main overlay */}
      <div className="fixed inset-0 bg-white/60 dark:bg-black/70 backdrop-blur-sm" />

      <div className="relative">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/childrens-home.jpg"
              alt="Children at Better Living Children's Home"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-green-900/70 backdrop-blur-[2px]"></div>
          </div>

          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block relative mb-4">
                <Heart className="w-16 h-16 mx-auto text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-pulse" />
                <Sparkles className="absolute -right-4 -top-4 w-6 h-6 text-green-300 animate-spin-slow" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-serif mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Support Our Community Outreach
              </h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto font-serif mb-8">
                Join us with ALX COMMUNITY COTERIE Club for a visit to the Better Living Children's Home this Easter
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white gap-2 group relative overflow-hidden rounded-full shadow-[0_4px_0_0_#166534] py-7"
                  onClick={() => setShowDonationModal(true)}
                >
                  <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <Heart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  Donate Now
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-4 border-green-700 text-green-700 dark:text-white hover:bg-green-700/10 dark:hover:bg-white/20 gap-2 group rounded-full shadow-[0_4px_0_0_#166534] dark:shadow-[0_4px_0_0_rgba(255,255,255,0.3)] py-7 relative overflow-hidden"
                >
                  <Link href="/#events">
                  <span className="absolute inset-0 bg-green-700/10 dark:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Calendar className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  View Events
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Donation Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-[0_8px_0_0_#166534] overflow-hidden border-4 border-green-700/70 max-w-3xl mx-auto mb-16"
            >
              <div className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 font-serif">
                  Donation Progress (second target)
                  </h3>
                  <span className="text-lg text-green-700 dark:text-green-500 font-bold font-serif">
                    {donationAmount.toLocaleString()}/{donationGoal.toLocaleString()} KSh
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-6 bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-green-500 rounded-full relative"
                    style={{ width: `${donationPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-50 animate-pulse"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-green-700 animate-pulse" />
                    <span className="text-gray-700 dark:text-gray-300 font-serif">
                      {donorCount} donors have contributed
                    </span>
                  </div>
                  <span className="text-green-700 dark:text-green-500 font-serif">
                    {donationPercentage.toFixed(1)}% of goal
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About the Children's Home */}
        <section className="py-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 font-serif mb-4 relative inline-block group">
                Better Living Children's Home
                <span className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-serif">
                Located in Zimmerman, the home cares for children aged 3 months to 18 years
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left side: Info card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-[0_6px_0_0_#166534] border-4 border-green-700/70">
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 font-serif mb-4 flex items-center">
                    <Home className="w-6 h-6 mr-2 text-green-700" />
                    About the Home
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 font-serif mb-4">
                    Better Living Children's Home provides shelter, care, and education to vulnerable children. The home
                    currently supports children of various ages, from infants to teenagers preparing for college.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 font-serif mb-4">
                    Our Book Club is organizing a community service togather with ALX Communitie Coterie Club visit this Easter to provide essential supplies and
                    spend quality time with the children.
                  </p>
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-500 font-serif">
                    <Calendar className="w-5 h-5" />
                    <span>Easter Visit: April 19th, 2025</span>
                  </div>
                </div>
              </motion.div>

              {/* Right side: Gallery */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 gap-4"
              >
                {/* Featured image */}
                <div
                  className="relative aspect-square rounded-2xl overflow-hidden border-4 border-green-700/70 shadow-[0_4px_0_0_#166534] transform hover:scale-105 transition-transform duration-300"
                  style={{ transform: "rotate(2deg)" }}
                >
                  <Image src="/childrens-home.jpg" alt="Children's Home Image" fill className="object-cover" />
                </div>

                {/* Other gallery images */}
                {["/images.jpeg", "/children1.jpg"].map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-2xl overflow-hidden border-4 border-green-700/70 shadow-[0_4px_0_0_#166534] transform hover:scale-105 transition-transform duration-300"
                    style={{ transform: `rotate(${index % 2 === 0 ? "2deg" : "-2deg"})` }}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Children's Home Gallery Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Needs and Donation Methods Tabs */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-white dark:bg-gray-800 p-2 rounded-full shadow-md">
                <button
                  onClick={() => setActiveTab("needs")}
                  className={`px-6 py-3 rounded-full font-bold font-serif transition-all duration-300 ${
                    activeTab === "needs"
                      ? "bg-green-700 text-white shadow-[0_2px_0_0_#166534]"
                      : "text-green-800 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                  }`}
                >
                  Needs
                </button>
                <button
                  onClick={() => setActiveTab("donate")}
                  className={`px-6 py-3 rounded-full font-bold font-serif transition-all duration-300 ${
                    activeTab === "donate"
                      ? "bg-green-700 text-white shadow-[0_2px_0_0_#166534]"
                      : "text-green-800 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                  }`}
                >
                  How to Donate
                </button>
              </div>
            </div>

            {activeTab === "needs" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-3 gap-6"
              >
                {[
                  {
                    title: "Baby Essentials",
                    icon: Baby,
                    items: [
                      "Diapers (Pampers)",
                      "Baby formula (Naan)",
                      "Special uji mix",
                      "Baby clothes",
                      "Baby wipes",
                    ],
                  },
                  {
                    title: "Education Support",
                    icon: BookOpen,
                    items: ["School fees", "Notebooks and stationery", "Textbooks", "School uniforms", "Backpacks"],
                  },
                  {
                    title: "Food Supplies",
                    icon: Utensils,
                    items: ["Rice", "Beans", "Maize flour", "Cooking oil", "Fruits and vegetables"],
                  },
                ].map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-[0_6px_0_0_#166534] border-4 border-green-700/70 hover:shadow-[0_8px_0_0_#166534] transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-700/10 transition-colors duration-300">
                      <category.icon className="w-8 h-8 text-green-700 dark:text-green-400 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 font-serif mb-4">
                      {category.title}
                    </h3>
                    <ul className="space-y-2">
                      {category.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-serif">
                          <ChevronRight className="w-4 h-4 text-green-700 dark:text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "donate" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto"
              >
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-[0_6px_0_0_#166534] border-4 border-green-700/70">
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 font-serif mb-6">
                    Donation Methods
                  </h3>

                  <div className="space-y-6">
                    {/* M-Pesa */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl">
                  <h4 className="text-xl font-bold text-green-800 dark:text-green-400 font-serif mb-2 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-green-700" />
                    M-Pesa : Reading Circle
                  </h4>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 font-serif mb-1">Treasurer Number:</p>
                      <div className="flex items-center gap-2">
                        <span className="text-green-800 dark:text-green-400 font-bold font-serif">+254111910451</span>
                        <button
                          onClick={() => copyToClipboard("247247")}
                          className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors"
                        >
                          {copied ? (
                            <CheckCheck className="w-4 h-4 text-green-700" />
                          ) : (
                            <Copy className="w-4 h-4 text-green-700" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 font-serif mb-1">Account Number:</p>
                      <div className="flex items-center gap-2">
                        <span className="text-green-800 dark:text-green-400 font-bold font-serif">Brian Obiero</span>
                        <button
                          onClick={() => copyToClipboard("READING-CIRCLE")}
                          className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors"
                        >
                          {copied ? (
                            <CheckCheck className="w-4 h-4 text-green-700" />
                          ) : (
                            <Copy className="w-4 h-4 text-green-700" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* M-Pesa 2 */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl">
                  <h4 className="text-xl font-bold text-green-800 dark:text-green-400 font-serif mb-2 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-green-700" />
                    M-Pesa: Community Coterie
                  </h4>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 font-serif mb-1">Treasurer Number:</p>
                      <div className="flex items-center gap-2">
                        <span className="text-green-800 dark:text-green-400 font-bold font-serif">0758200357</span>
                        <button
                          onClick={() => copyToClipboard("247247")}
                          className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors"
                        >
                          {copied ? (
                            <CheckCheck className="w-4 h-4 text-green-700" />
                          ) : (
                            <Copy className="w-4 h-4 text-green-700" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 font-serif mb-1">Account Number:</p>
                      <div className="flex items-center gap-2">
                        <span className="text-green-800 dark:text-green-400 font-bold font-serif">Grace Kamau</span>
                        <button
                          onClick={() => copyToClipboard("READING-CIRCLE")}
                          className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors"
                        >
                          {copied ? (
                            <CheckCheck className="w-4 h-4 text-green-700" />
                          ) : (
                            <Copy className="w-4 h-4 text-green-700" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>


                    {/* In-Kind Donations */}
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl">
                      <h4 className="text-xl font-bold text-green-800 dark:text-green-400 font-serif mb-2">
                        In-Kind Donations
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 font-serif mb-2">
                        You can also donate items directly. Please contact us to arrange drop-off or pick-up.
                      </p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-700" />
                        <span className="text-green-800 dark:text-green-400 font-bold font-serif">
                        +254790964291 (Reading Circle) or 
                        +2540726502351 (Community Coterie)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 font-serif mb-6 relative inline-block group">
                Make a Difference Today
                <span className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 font-serif mb-8">
                Your contribution, no matter how small, can make a significant impact in the lives of these children.
                Join us in spreading joy and support this Easter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-green-700 hover:bg-green-800 text-white gap-2 group relative overflow-hidden rounded-full shadow-[0_4px_0_0_#166534] py-7"
                  onClick={() => setShowDonationModal(true)}
                >
                  <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <Heart className="w-5 h-5 animate-pulse" />
                  Donate Now
                </Button>
                {/*<Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-4 border-green-600 text-green-700 dark:text-green-400 hover:bg-green-700/20 gap-2 group rounded-full shadow-[0_4px_0_0_#166534] py-7 relative overflow-hidden"
                >
                  <Link href="/club-events">
                  <span className="absolute inset-0 bg-green-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  Join the Event
                  </Link>
                </Button> */}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
        {/* Donation Modal */}
        {showDonationModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-[0_8px_0_0_#166534] border-4 border-green-700/70 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 font-serif flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-green-700 animate-pulse" />
                  How to Donate
                </h3>
                <button
                  onClick={() => setShowDonationModal(false)}
                  className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* M-Pesa */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl">
                  <h4 className="text-xl font-bold text-green-800 dark:text-green-400 font-serif mb-2 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-green-700" />
                    M-Pesa : Reading Circle
                  </h4>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 font-serif mb-1">Treasurer Number:</p>
                      <div className="flex items-center gap-2">
                        <span className="text-green-800 dark:text-green-400 font-bold font-serif">+254111910451</span>
                        <button
                          onClick={() => copyToClipboard("247247")}
                          className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors"
                        >
                          {copied ? (
                            <CheckCheck className="w-4 h-4 text-green-700" />
                          ) : (
                            <Copy className="w-4 h-4 text-green-700" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 font-serif mb-1">Account Number:</p>
                      <div className="flex items-center gap-2">
                        <span className="text-green-800 dark:text-green-400 font-bold font-serif">Brian Obiero</span>
                        <button
                          onClick={() => copyToClipboard("READING-CIRCLE")}
                          className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors"
                        >
                          {copied ? (
                            <CheckCheck className="w-4 h-4 text-green-700" />
                          ) : (
                            <Copy className="w-4 h-4 text-green-700" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* M-Pesa 2 */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl">
                  <h4 className="text-xl font-bold text-green-800 dark:text-green-400 font-serif mb-2 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-green-700" />
                    M-Pesa: Community Coterie
                  </h4>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 font-serif mb-1">Treasurer Number:</p>
                      <div className="flex items-center gap-2">
                        <span className="text-green-800 dark:text-green-400 font-bold font-serif">0758200357</span>
                        <button
                          onClick={() => copyToClipboard("247247")}
                          className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors"
                        >
                          {copied ? (
                            <CheckCheck className="w-4 h-4 text-green-700" />
                          ) : (
                            <Copy className="w-4 h-4 text-green-700" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 font-serif mb-1">Account Number:</p>
                      <div className="flex items-center gap-2">
                        <span className="text-green-800 dark:text-green-400 font-bold font-serif">Grace Kamau</span>
                        <button
                          onClick={() => copyToClipboard("READING-CIRCLE")}
                          className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors"
                        >
                          {copied ? (
                            <CheckCheck className="w-4 h-4 text-green-700" />
                          ) : (
                            <Copy className="w-4 h-4 text-green-700" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* In-Kind Donations */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl">
                  <h4 className="text-xl font-bold text-green-800 dark:text-green-400 font-serif mb-2">
                    In-Kind Donations
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 font-serif mb-2">
                    You can also donate items directly. Please contact us to arrange drop-off or pick-up.
                  </p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-700" />
                    <span className="text-green-800 dark:text-green-400 font-bold font-serif">
                        +254790964291 (Reading Circle) or 
                        +2540726502351 (Community Coterie)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-green-200 dark:border-green-800">
                <Button
                  size="lg"
                  className="w-full bg-green-700 hover:bg-green-800 text-white gap-2 group relative overflow-hidden rounded-full shadow-[0_4px_0_0_#166534] py-7"
                  onClick={() => setShowDonationModal(false)}
                >
                  <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
