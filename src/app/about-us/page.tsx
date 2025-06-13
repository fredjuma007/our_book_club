"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Sparkles, Send, CheckCircle } from "lucide-react"
import Footer from "@/components/footer"
import { useState } from "react"
import { getClient } from "@/lib/wix-client"
import { useRouter } from "next/navigation"

export default function AboutUs() {
  const router = useRouter()
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const client = getClient()

      // Submit to Wix CMS collection
      await client.items.insertDataItem({
        dataCollectionId: "Feedback", // Use your actual collection ID
        dataItem: {
          data: {
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            replied: false, // Boolean field - false when first submitted
            createdAt: new Date().toISOString(),
          },
        },
      })

      // Reset form and show success message
      setFormData({ email: "", subject: "", message: "" })
      setFeedbackSubmitted(true)

      // Reset success message after 5 seconds
      setTimeout(() => {
        setFeedbackSubmitted(false)
      }, 5000)
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("There was an error submitting your feedback. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f0e1] dark:bg-gray-900 selection:bg-green-700/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#15803d_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#22c55e_1px,transparent_0)] bg-[length:40px_40px] opacity-20" />

        <div className="max-w-screen-xl mx-auto py-16 px-4 lg:px-8 relative">
          {/* Floating Books */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute right-10 top-10 hidden lg:block animate-[bounce_6s_ease-in-out_infinite]"
          >
            <BookOpen className="w-16 h-16 text-green-700/30 transform rotate-12" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute left-20 bottom-10 hidden lg:block animate-[bounce_8s_ease-in-out_infinite]"
          >
            <Sparkles className="w-12 h-12 text-green-700/20 transform -rotate-12" />
          </motion.div>

          {/* Header Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative z-10"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-green-800 dark:text-green-500 font-serif mb-4 relative inline-block group">
              <span className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              About Us 🧑‍🏫
              <Sparkles className="absolute -right-8 -top-8 w-6 h-6 text-green-700/40 animate-spin-slow" />
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-serif max-w-2xl mx-auto">
              Welcome to our book club! We are a community of book lovers who gather to discuss, share, and celebrate
              our love for literature.
            </p>
          </motion.div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#fffaf0] dark:bg-gray-800 transform -skew-y-2" />
      </div>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 pb-16 relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Three Column Content for Vision, Book Selection, and Community Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-6">Our Vision</h2>
              <p className="text-gray-600 dark:text-gray-300 font-serif">
                Our vision is to build a vibrant community of readers who are passionate about sharing their love for
                books. We aim to create a welcoming and inclusive environment where everyone feels valued and inspired
                to explore new genres and authors.
              </p>
            </div>

            <div className="bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-6">
                How We Select & Review Books
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-serif">
                Our book club members nominate books they would like to read lead by the Book & Review moderator, and
                then we vote on the selections. We aim to choose a diverse range of genres and authors to keep our
                discussions engaging and thought-provoking. Different members take turns leading the discussion each
                month, and we encourage everyone to share their thoughts and insights.
              </p>
            </div>

            <div className="bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-6">
                Our Community Values
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-serif">
                At The Reading Circle, we believe in fostering a sense of community, respect, and empathy among our
                members. We encourage open and honest discussions, and we value diverse perspectives and experiences.
                Our goal is to create a safe and supportive space where everyone can share their thoughts and feelings
                about the books we read. We also believe in giving back to our community.
              </p>
            </div>
          </div>

          <div className="bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-6">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <Image
                  src="/gallery/Esther.jpg"
                  alt="Team Member 1"
                  width={100}
                  height={100}
                  className="rounded-full border-2 border-green-700"
                />
                <div>
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-500 font-serif">Esther Mboche</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-serif">Founder, Events Coordinator & Moderator</p>
                  <Link
                    href="https://wa.me/+254790964291?text=Hello%20Esther,%20Reaching%20out%20from%20The%20Reading%20Circle%20Website"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="link"
                      className="text-green-700 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400 p-0 mt-2 font-serif"
                    >
                      Chat with Esther
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src="/gallery/Brenda.jpg"
                  alt="Team Member 2"
                  width={100}
                  height={100}
                  className="rounded-full border-2 border-green-700"
                />
                <div>
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-500 font-serif">Brenda Frenjo</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-serif">Membership & Reviews Moderator</p>
                  <Link
                    href="https://wa.me/+254714747231?text=Hello%20Brenda,%20Reaching%20out%20from%20The%20Reading%20Circle%20Website"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="link"
                      className="text-green-700 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400 p-0 mt-2 font-serif"
                    >
                      Chat with Brenda
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src="/gallery/Juma.jpg"
                  alt="Team Member 3"
                  width={100}
                  height={100}
                  className="rounded-full border-2 border-green-700"
                />
                <div>
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-500 font-serif">Fred Juma</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-serif">Books & Reviews Moderator</p>
                  <Link
                    href="https://wa.me/+254710730243?text=Hello%20Fred,%20Reaching%20out%20from%20The%20Reading%20Circle%20Website"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="link"
                      className="text-green-700 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400 p-0 mt-2 font-serif"
                    >
                      Chat with Fred
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 space-y-6">
            <div className="relative inline-block">
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif">Join Our Community</h3>
              <div className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 hover:scale-x-100 transition-transform origin-left" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-serif max-w-2xl mx-auto">
              Become a part of our vibrant community of book lovers. Participate in discussions, attend events, and
              share your passion for reading with others.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
              <Link href="/join-us" className="w-full md:w-auto">
                <Button
                  variant="outline"
                  className="text-green-700 border-green-700 hover:bg-green-200 hover:text-white font-serif group relative overflow-hidden w-full md:w-auto"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <BookOpen className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                  JOIN US!
                </Button>
              </Link>
              <Link href="/club-events">
                <Button
                  variant="outline"
                  className="text-green-700 border-green-700 hover:bg-green-200 hover:text-white font-serif group relative overflow-hidden w-full md:w-auto"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <BookOpen className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                  Explore Our Events
                </Button>
              </Link>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="mt-16">
            <div className="bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700 p-6 md:p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-6 text-center">
                Send Us Feedback
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-serif mb-6 text-center">
                We'd love to hear from you! Share your thoughts, suggestions, or questions with us.
              </p>

              {feedbackSubmitted ? (
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-500 text-green-700 dark:text-green-300 p-6 rounded-lg text-center">
                  <CheckCircle className="w-12 h-12 text-green-700 mx-auto mb-4" />
                  <p className="font-serif text-lg font-medium">Thank you for your feedback!</p>
                  <p className="font-serif mt-2">We appreciate your input and will get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-600 dark:text-gray-300 font-serif">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-white dark:bg-gray-700 border-green-700/30"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-600 dark:text-gray-300 font-serif">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="bg-white dark:bg-gray-700 border-green-700/30"
                      placeholder="What's this about?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-600 dark:text-gray-300 font-serif">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      className="bg-white dark:bg-gray-700 border-green-700/30 min-h-[120px]"
                      placeholder="Share your thoughts with us..."
                    />
                  </div>
                  <div className="flex justify-center pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-700 hover:bg-green-800 text-white font-serif group relative overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-green-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Send className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                      {isSubmitting ? "Sending..." : "Send Feedback"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
        <Footer />
      </div>

      <style jsx global>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f8f5f0;
        border-radius: 10px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #15803d;
        border-radius: 10px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #166534;
      }
      
      .dark .custom-scrollbar::-webkit-scrollbar-track {
        background: #1f2937;
      }
      
      .dark .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #22c55e;
      }
      
      .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #16a34a;
      }
    `}</style>
    </div>
  )
}
