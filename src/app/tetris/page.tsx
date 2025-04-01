import TetrisGame from "@/components/tetris-game"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f9f3ff] dark:bg-blueberry selection:bg-candy/30">
      {/* Hero Section - Made more compact */}
      <div className="relative overflow-hidden py-4">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 star-bg animate-fade" />

        <div className="max-w-screen-xl mx-auto px-4 lg:px-8 relative">
          {/* Header Content - Reduced vertical spacing */}
          <div className="text-center relative z-10">
            
            
          </div>
        </div>

        {/* Decorative Bottom Wave - Reduced height */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-white dark:bg-blueberry/80 transform -skew-y-2" />
      </div>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 pb-8 relative">
        <TetrisGame />
      </div>
    </main>
  )
}

