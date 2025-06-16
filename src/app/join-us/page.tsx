"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion } from "framer-motion"
import { BookOpen, Sparkles, CheckCircle, BookMarked, Info, CalendarCheck } from "lucide-react"
import Footer from "@/components/footer"
import { getClient } from "@/lib/wix-client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function JoinUs() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"application" | "guidelines">("application")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    readingFrequency: "",
    favoriteBook: "",
    discussionComfort: "",
    readGuidelines: "",
    howDidYouHear: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const client = getClient()

      // Submit to Wix CMS collection
      await client.items.insertDataItem({
        dataCollectionId: "ClubApplications", // Use your actual collection ID
        dataItem: {
          data: {
            name: formData.name,
            phoneNumber: formData.phoneNumber,
            readingFrequency: formData.readingFrequency,
            favoriteBook: formData.favoriteBook,
            discussionComfort: formData.discussionComfort,
            readGuidelines: formData.readGuidelines,
            howDidYouHear: formData.howDidYouHear,
            pending: true, // Boolean field - true for pending, false for done
            createdAt: new Date().toISOString(),
          },
        },
      })

      setIsSuccess(true)

      // Reset form after successful submission
      setTimeout(() => {
        router.push("/books")
      }, 3000)
    } catch (error) {
      console.error("Error submitting form:", error)
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
              Join Our Club 📚
              <Sparkles className="absolute -right-8 -top-8 w-6 h-6 text-green-700/40 animate-spin-slow" />
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-serif max-w-2xl mx-auto">
              We're excited to welcome you to our community of book lovers. Please fill out the form below to join The
              Reading Circle.
            </p>
          </motion.div>

          {/* Navigation Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() => setActiveTab("application")}
              className={`${
                activeTab === "application"
                  ? "bg-green-700 text-white"
                  : "text-green-700 border-green-700 hover:bg-green-200"
              } font-serif relative overflow-hidden group px-4 py-2 rounded-md border cursor-pointer flex items-center`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <BookMarked className="w-4 h-4 mr-2" />
              Application Form
            </button>
            <button
              onClick={() => setActiveTab("guidelines")}
              className={`${
                activeTab === "guidelines"
                  ? "bg-green-700 text-white"
                  : "text-green-700 border-green-700 hover:bg-green-200"
              } font-serif relative overflow-hidden group px-4 py-2 rounded-md border cursor-pointer flex items-center`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Info className="w-4 h-4 mr-2" />
              Club Guidelines
            </button>
          </div>
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
          {activeTab === "application" && (
            <>
              {isSuccess ? (
                <div className="bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700 p-6 md:p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-700 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-4">
                    Application Submitted!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 font-serif">
                    Thank you for your interest in joining The Reading Circle. We'll review your application and get
                    back to you soon.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700 p-6 md:p-8"
                >
                  <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-6">
                    Membership Application
                  </h2>

                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-600 dark:text-gray-300 font-serif">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="bg-white dark:bg-gray-700 border-green-700/30"
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-gray-600 dark:text-gray-300 font-serif">
                          Phone Number
                        </Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          required
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="bg-white dark:bg-gray-700 border-green-700/30"
                          placeholder="+254 700 000 000"
                        />
                      </div>
                    </div>

                    {/* Reading Questions */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="readingFrequency" className="text-gray-600 dark:text-gray-300 font-serif">
                          How often do you read, and how much time are you willing to commit to reading each month?
                        </Label>
                        <Textarea
                          id="readingFrequency"
                          name="readingFrequency"
                          required
                          value={formData.readingFrequency}
                          onChange={handleChange}
                          className="bg-white dark:bg-gray-700 border-green-700/30 min-h-[100px]"
                          placeholder="Share your reading habits and time commitment..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="favoriteBook" className="text-gray-600 dark:text-gray-300 font-serif">
                          Can you describe one of your favorite books or authors and why they resonate with you?
                        </Label>
                        <Textarea
                          id="favoriteBook"
                          name="favoriteBook"
                          required
                          value={formData.favoriteBook}
                          onChange={handleChange}
                          className="bg-white dark:bg-gray-700 border-green-700/30 min-h-[100px]"
                          placeholder="Tell us about your favorite books or authors..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="discussionComfort" className="text-gray-600 dark:text-gray-300 font-serif">
                          Are you comfortable discussing books with a group and sharing your opinions in a respectful
                          manner?
                        </Label>
                        <Textarea
                          id="discussionComfort"
                          name="discussionComfort"
                          required
                          value={formData.discussionComfort}
                          onChange={handleChange}
                          className="bg-white dark:bg-gray-700 border-green-700/30 min-h-[100px]"
                          placeholder="Describe your comfort level with group discussions..."
                        />
                      </div>
                    </div>

                    {/* New Radio Button Fields */}
                    <div className="space-y-6">
                      {/* Guidelines Question */}
                      <div className="space-y-3">
                        <Label className="text-gray-600 dark:text-gray-300 font-serif">
                          Have you read the club guidelines?
                        </Label>
                        <RadioGroup
                          value={formData.readGuidelines}
                          onValueChange={(value) => handleRadioChange("readGuidelines", value)}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="guidelines-yes" />
                            <Label
                              htmlFor="guidelines-yes"
                              className="text-sm font-serif text-gray-700 dark:text-gray-300"
                            >
                              Yes, I have read and understand the guidelines
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="guidelines-no" />
                            <Label
                              htmlFor="guidelines-no"
                              className="text-sm font-serif text-gray-700 dark:text-gray-300"
                            >
                              No, I haven't read them yet
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="partially" id="guidelines-partially" />
                            <Label
                              htmlFor="guidelines-partially"
                              className="text-sm font-serif text-gray-700 dark:text-gray-300"
                            >
                              I've read them partially
                            </Label>
                          </div>
                        </RadioGroup>
                        {formData.readGuidelines === "no" || formData.readGuidelines === "partially" ? (
                          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 p-3 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-300 font-serif">
                              We recommend reading our{" "}
                              <button
                                type="button"
                                onClick={() => setActiveTab("guidelines")}
                                className="underline hover:text-blue-600 dark:hover:text-blue-200"
                              >
                                Club Guidelines
                              </button>{" "}
                              before submitting your application.
                            </p>
                          </div>
                        ) : null}
                      </div>

                      {/* How did you hear about us */}
                      <div className="space-y-3">
                        <Label className="text-gray-600 dark:text-gray-300 font-serif">
                          How did you hear about our book club?
                        </Label>
                        <RadioGroup
                          value={formData.howDidYouHear}
                          onValueChange={(value) => handleRadioChange("howDidYouHear", value)}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="social-media" id="hear-social" />
                            <Label
                              htmlFor="hear-social"
                              className="text-sm font-serif text-gray-700 dark:text-gray-300"
                            >
                              Social Media (Instagram, TikTok, Facebook, X)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="friend-referral" id="hear-friend" />
                            <Label
                              htmlFor="hear-friend"
                              className="text-sm font-serif text-gray-700 dark:text-gray-300"
                            >
                              Friend or family referral
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="online-search" id="hear-search" />
                            <Label
                              htmlFor="hear-search"
                              className="text-sm font-serif text-gray-700 dark:text-gray-300"
                            >
                              Online search (Google, etc.)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="local-event" id="hear-event" />
                            <Label htmlFor="hear-event" className="text-sm font-serif text-gray-700 dark:text-gray-300">
                              Local event or community board
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="library" id="hear-library" />
                            <Label
                              htmlFor="hear-library"
                              className="text-sm font-serif text-gray-700 dark:text-gray-300"
                            >
                              Library or bookstore
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="friend-referral" id="hear-friend" />
                            <Label
                              htmlFor="hear-friend"
                              className="text-sm font-serif text-gray-700 dark:text-gray-300"
                            >
                              ALX Africa
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="hear-other" />
                            <Label htmlFor="hear-other" className="text-sm font-serif text-gray-700 dark:text-gray-300">
                              Other
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.readGuidelines || !formData.howDidYouHear}
                      className="w-full bg-green-700 hover:bg-green-800 text-white font-serif group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-green-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {isSubmitting ? "Submitting..." : "Join Us"}
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}

          {activeTab === "guidelines" && (
            <div className="bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-6">
                Welcome to The Reading Circle!✨
              </h2>
              <div
                className="text-gray-600 dark:text-gray-300 font-serif space-y-4 mt-4 overflow-y-auto pr-2 custom-scrollbar"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#15803d #f8f5f0",
                }}
              >
                <p>
                  We're excited to have you join us on this literary journey! To ensure we all get the most out of our
                  shared reading experience, we've set a few guidelines for active participation:
                </p>

                <div className="space-y-4 mt-2">
                  <div className="flex gap-3">
                    <span className="font-bold">1.</span>
                    <div>
                      <h3 className="font-bold">Read Before Meetings📖</h3>
                      <p>
                        Each member is expected to read the selected book before our discussions. Our goal is to dive
                        deep into the themes, characters, and plotlines, and this can only happen when everyone is
                        prepared.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="font-bold">2.</span>
                    <div>
                      <h3 className="font-bold">Engage in Discussions 💭</h3>
                      <p>
                        We encourage open, thoughtful dialogue. Share your opinions, ask questions, and explore
                        different perspectives. Whether you loved or disliked the book, your voice matters.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="font-bold">3.</span>
                    <div>
                      <h3 className="font-bold">Weekly/Bi-weekly Check-ins 🔄</h3>
                      <p>
                        To help keep us all on track, we'll have check-ins where members can share their progress,
                        thoughts, or challenges. This way, we stay connected with the book throughout the month.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="font-bold">4.</span>
                    <div>
                      <h3 className="font-bold">Contribute Beyond Reading 💬</h3>
                      <p>
                        You can lead discussions, suggest books, or even host a session. We value everyone's input and
                        want to ensure everyone gets a chance to shine.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="font-bold">5.</span>
                    <div>
                      <h3 className="font-bold">Be Respectful 🫡</h3>
                      <p>
                        We thrive on diversity in opinions, but let's always maintain respect and kindness in our
                        conversations.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-4">
                  We believe that our book club is not just about reading—it's about growing through conversation and
                  collaboration. By staying engaged, we'll all make this a rewarding experience!
                </p>

                <div className="mt-8 text-center">
                  <Button
                    onClick={() => setActiveTab("application")}
                    className="bg-green-700 hover:bg-green-800 text-white font-serif group relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-green-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    Apply to Join
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-12 space-y-6">
            <div className="relative inline-block">
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif">Want to know more?</h3>
              <div className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 hover:scale-x-100 transition-transform origin-left" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-serif max-w-2xl mx-auto">
              Explore our upcoming events and learn more about our community.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
              <Link href="/about-us">
                <Button
                  variant="outline"
                  className="text-green-700 border-green-700 hover:bg-green-200 hover:text-white font-serif group relative overflow-hidden w-full md:w-auto"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Info className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                  About Us
                </Button>
              </Link>
              <Link href="/club-events">
                <Button
                  variant="outline"
                  className="text-green-700 border-green-700 hover:bg-green-200 hover:text-white font-serif group relative overflow-hidden w-full md:w-auto"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CalendarCheck className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                  Explore Events
                </Button>
              </Link>
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
