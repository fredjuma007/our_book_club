import Image from "next/image"

interface LoadingScreenProps {
  message?: string
  submessage?: string
}

export function LoadingScreen({
  message = "Loading...",
  submessage = "Please wait while we prepare everything for you",
}: LoadingScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
      <div className="text-center space-y-6 px-4">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border border-teal-500/30">
            <Image src="/logo.jpg" alt="Reading Circle Logo" fill className="object-cover" priority />
          </div>
        </div>

        {/* Animated spinner */}
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-teal-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-400 animate-spin"></div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-teal-400">{message}</h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto">{submessage}</p>
        </div>
      </div>
    </div>
  )
}
