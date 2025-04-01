"use client"

import type React from "react"

import { useCallback, useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import {
  Rotate3dIcon as Rotate,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  Gamepad2,
  Music,
  Music2,
  RotateCcw,
  RotateCw,
} from "lucide-react"
import { motion } from "framer-motion"

// Define tetromino shapes
const TETROMINOS = {
  0: { shape: [[0]], color: "0, 0, 0" },
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "80, 227, 230", // sky
  },
  J: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    color: "36, 95, 223", // blueberry
  },
  L: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    color: "255, 173, 36", // sunshine
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "255, 217, 36", // sunshine lighter
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "48, 211, 56", // grass
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "232, 61, 198", // candy
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "227, 78, 78", // cherry
  },
}

// Random tetromino generator
const randomTetromino = () => {
  const tetrominos = "IJLOSTZ"
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)]
  return TETROMINOS[randTetromino as keyof typeof TETROMINOS]
}

// Create stage
const createStage = () =>
  Array.from(Array(20), () =>
    Array(10)
      .fill(null)
      .map(() => [0, "clear"] as [number, string]),
  )

// Check collision
const checkCollision = (player: Player, stage: Stage, { x: moveX, y: moveY }: { x: number; y: number }) => {
  for (let y = 0; y < player.tetromino.shape.length; y++) {
    for (let x = 0; x < player.tetromino.shape[y].length; x++) {
      // 1. Check that we're on a tetromino cell
      if (player.tetromino.shape[y][x] !== 0) {
        if (
          // 2. Check that our move is inside the game area height (y)
          !stage[y + player.pos.y + moveY] ||
          // 3. Check that our move is inside the game area width (x)
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          // 4. Check that the cell we're moving to isn't set to clear
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== "clear"
        ) {
          return true
        }
      }
    }
  }
  return false
}

type Cell = [number, string]
type Stage = Cell[][]

interface Player {
  pos: {
    x: number
    y: number
  }
  tetromino: {
    shape: number[][]
    color: string
  }
  collided: boolean
}

interface TouchPosition {
  x: number
  y: number
}

export default function TetrisGame() {
  const [stage, setStage] = useState<Stage>(createStage())
  const [player, setPlayer] = useState<Player>({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0],
    collided: false,
  })
  const [gameOver, setGameOver] = useState(false)
  const [dropTime, setDropTime] = useState<null | number>(null)
  const [score, setScore] = useState(0)
  const [rows, setRows] = useState(0)
  const [level, setLevel] = useState(1)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { toast } = useToast()
  const isMobile = useMobile()

  // Touch controls
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null)
  const [touchEnd, setTouchEnd] = useState<TouchPosition | null>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const touchThreshold = 30 // minimum distance for swipe detection

  // Reset game
  const startGame = () => {
    setStage(createStage())
    setDropTime(1000)
    resetPlayer()
    setGameOver(false)
    setScore(0)
    setRows(0)
    setLevel(1)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
    setIsMusicPlaying(false)
  }

  const pauseGame = () => {
    if (dropTime) {
      setDropTime(null)
    } else {
      setDropTime(1000 / level)
    }
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error)
          toast({
            title: "Audio playback failed",
            description: "Browser may require user interaction first",
            variant: "destructive",
          })
        })
      }
      setIsMusicPlaying(!isMusicPlaying)
    }
  }

  // Update stage
  const updateStage = useCallback(
    (prevStage: Stage): Stage => {
      // First flush the stage
      const newStage: Stage = prevStage.map((row) =>
        row.map((cell) => (cell[1] === "clear" ? ([0, "clear"] as Cell) : cell)),
      )

      // Then draw the tetromino
      player.tetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newStage[y + player.pos.y][x + player.pos.x] = [value, `${player.collided ? "merged" : "clear"}`]
          }
        })
      })

      // Then check if we collided
      if (player.collided) {
        resetPlayer()
        return sweepRows(newStage)
      }

      return newStage
    },
    [player],
  )

  // Sweep completed rows
  const sweepRows = (newStage: Stage): Stage => {
    let rowsCleared = 0
    const stage = newStage.reduce((acc, row) => {
      if (row.findIndex((cell) => cell[0] === 0) === -1) {
        rowsCleared += 1
        // Create a properly typed new row with explicit Cell type
        acc.unshift(
          Array(newStage[0].length)
            .fill(0)
            .map(() => [0, "clear"] as Cell),
        )
        return acc
      }
      acc.push(row)
      return acc
    }, [] as Stage)

    if (rowsCleared > 0) {
      setRows((prev) => prev + rowsCleared)
      setScore((prev) => prev + rowsCleared * 100 * level)

      // Show toast for cleared rows
      if (rowsCleared === 4) {
        toast({
          title: "Tetris!",
          description: "You cleared 4 rows at once!",
        })
      } else if (rowsCleared > 0) {
        toast({
          title: `${rowsCleared} ${rowsCleared === 1 ? "Row" : "Rows"} Cleared!`,
          description: `+${rowsCleared * 100 * level} points`,
        })
      }
    }

    return stage
  }

  // Reset player
  const resetPlayer = useCallback(() => {
    setPlayer({
      pos: { x: 4, y: 0 },
      tetromino: randomTetromino(),
      collided: false,
    })
  }, [])

  // Player movement
  const movePlayer = (dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      setPlayer((prev) => ({
        ...prev,
        pos: { ...prev.pos, x: prev.pos.x + dir },
      }))
    }
  }

  // Rotate tetromino
  const rotate = (matrix: number[][], dir: number) => {
    // Make the rows become cols (transpose)
    const rotatedTetro = matrix.map((_, index) => matrix.map((col) => col[index]))
    // Reverse each row to get a rotated matrix
    if (dir > 0) return rotatedTetro.map((row) => row.reverse())
    return rotatedTetro.reverse()
  }

  const playerRotate = (dir: number) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player))
    clonedPlayer.tetromino.shape = rotate(clonedPlayer.tetromino.shape, dir)

    // This is to check collision when rotating near the walls
    const pos = clonedPlayer.pos.x
    let offset = 1
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset
      offset = -(offset + (offset > 0 ? 1 : -1))
      if (offset > clonedPlayer.tetromino.shape[0].length) {
        rotate(clonedPlayer.tetromino.shape, -dir)
        clonedPlayer.pos.x = pos
        return
      }
    }

    setPlayer(clonedPlayer)
  }

  // Drop tetromino
  const drop = () => {
    // Increase level when player has cleared 10 rows
    if (rows >= level * 10) {
      setLevel((prev) => prev + 1)
      setDropTime(1000 / (level + 1))
      toast({
        title: `Level ${level + 1}!`,
        description: "Speed increased!",
      })
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      setPlayer((prev) => ({
        ...prev,
        pos: { ...prev.pos, y: prev.pos.y + 1 },
        collided: false,
      }))
    } else {
      // Game over
      if (player.pos.y < 1) {
        setGameOver(true)
        setDropTime(null)
        toast({
          title: "Game Over!",
          description: `Your score: ${score}`,
          variant: "destructive",
        })
      }
      setPlayer((prev) => ({
        ...prev,
        collided: true,
      }))
    }
  }

  // Hard drop
  const dropPlayer = () => {
    // Save the current drop time
    const savedDropTime = dropTime

    // Pause automatic dropping
    setDropTime(null)

    // Perform hard drop
    hardDrop()

    // Restore drop time after a short delay to prevent infinite loops
    setTimeout(() => {
      if (!gameOver) {
        setDropTime(savedDropTime)
      }
    }, 100)
  }

  const hardDrop = () => {
    const newY = player.pos.y
    let tempY = newY

    // First calculate the final position without updating state
    while (!checkCollision({ ...player, pos: { ...player.pos, y: tempY + 1 } }, stage, { x: 0, y: 0 })) {
      tempY++
    }

    // Then update the state once with the final position
    setPlayer((prev) => ({
      ...prev,
      pos: { ...prev.pos, y: tempY },
      collided: true,
    }))
  }

  // Key controls
  const move = ({ keyCode, repeat }: { keyCode: number; repeat: boolean }) => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1)
      } else if (keyCode === 39) {
        movePlayer(1)
      } else if (keyCode === 40) {
        if (!repeat) {
          dropPlayer()
        }
      } else if (keyCode === 38) {
        playerRotate(1)
      } else if (keyCode === 32) {
        hardDrop()
      }
    }
  }

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (gameOver || !dropTime) return

    const touchObj = e.touches[0]
    setTouchStart({
      x: touchObj.clientX,
      y: touchObj.clientY,
    })
    setTouchEnd(null)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (gameOver || !dropTime || !touchStart) return

    const touchObj = e.touches[0]
    setTouchEnd({
      x: touchObj.clientX,
      y: touchObj.clientY,
    })
  }

  const handleTouchEnd = () => {
    if (gameOver || !dropTime || !touchStart || !touchEnd) return

    const xDiff = touchStart.x - touchEnd.x
    const yDiff = touchStart.y - touchEnd.y

    // Determine if it was a swipe (horizontal or vertical)
    if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > touchThreshold) {
      // Horizontal swipe
      if (xDiff > 0) {
        // Swipe left
        movePlayer(-1)
      } else {
        // Swipe right
        movePlayer(1)
      }
    } else if (Math.abs(yDiff) > touchThreshold) {
      // Vertical swipe
      if (yDiff > 0) {
        // Swipe up - rotate
        playerRotate(1)
      } else {
        // Swipe down - soft drop
        dropPlayer()
      }
    } else {
      // Tap - rotate
      playerRotate(1)
    }

    // Reset touch positions
    setTouchStart(null)
    setTouchEnd(null)
  }

  // Interval for dropping tetromino
  useInterval(() => {
    drop()
  }, dropTime)

  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      move({ keyCode: e.keyCode, repeat: e.repeat })
    }

    const handleKeyUp = ({ keyCode }: { keyCode: number }) => {
      if (!gameOver) {
        if (keyCode === 40) {
          setDropTime(1000 / level)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp as any)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp as any)
    }
  }, [gameOver, dropPlayer, level])

  // Update stage
  useEffect(() => {
    setStage((prev) => updateStage(prev))
  }, [player, updateStage])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-3 relative"
    >
      {/* Audio Element for Tetris Music */}
      <audio
        ref={audioRef}
        loop
        src="https://assets.codepen.io/21542/TetrisTheme.mp3"
        onEnded={() => setIsMusicPlaying(false)}
      />

      {/* Music Control */}
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMusic}
          className="w-8 h-8 rounded-full bg-white/80 dark:bg-blueberry/80 hover:bg-white dark:hover:bg-blueberry border-2 border-candy shadow-childish"
        >
          {isMusicPlaying ? (
            <Music2 className="h-4 w-4 text-candy" />
          ) : (
            <Music className="h-4 w-4 text-blueberry dark:text-sky" />
          )}
          <span className="sr-only">{isMusicPlaying ? "Pause Music" : "Play Music"}</span>
        </Button>

        <audio 
        ref={audioRef} 
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tetris-kxnh5j7hpNEcFspAndlU2huV5n6dvk.mp3" 
        />
      </div>
      
      {/* Start Game Button for Mobile - Visible at the top */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-md mb-2"
        >
          <Button
            onClick={startGame}
            className="w-full bg-candy hover:bg-candy/90 text-white rounded-full py-6 shadow-childish relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Play className="h-5 w-5 mr-2 animate-pulse" />
            {gameOver ? "Play Again" : dropTime ? "Restart Game" : "Start Game"}
            <Sparkles className="h-4 w-4 ml-2 animate-spin-slow" />
          </Button>
        </motion.div>
      )}

      <div className="flex flex-col items-center md:flex-row md:items-start gap-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card
            className="p-4 bg-white dark:bg-blueberry/80 border-4 border-candy shadow-childish hover:shadow-childish-lg transition-all duration-300"
            ref={gameAreaRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative">
              {gameOver && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 rounded-xl">
                  <div className="text-center p-6">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Trophy className="w-16 h-16 mx-auto text-sunshine mb-4 animate-pulse" />
                      <h2 className="text-2xl font-bold text-red-500 mb-2">Game Over</h2>
                      <p className="text-white mb-4 text-xl">Score: {score}</p>
                      <Button
                        onClick={startGame}
                        className="bg-candy hover:bg-candy/90 text-white rounded-full shadow-childish relative overflow-hidden group"
                      >
                        <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <Play className="h-4 w-4 mr-2" />
                        Play Again
                      </Button>
                    </motion.div>
                  </div>
                </div>
              )}
              <div
                className="grid border-4 border-sky bg-blueberry/90 rounded-xl overflow-hidden"
                style={{
                  gridTemplateRows: `repeat(${20}, minmax(0, 1fr))`,
                  gridTemplateColumns: `repeat(${10}, minmax(0, 1fr))`,
                  gap: "1px",
                }}
              >
                {stage.map((row, y) =>
                  row.map((cell, x) => (
                    <div
                      key={`${y}-${x}`}
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                      style={{
                        background:
                          cell[0] !== 0
                            ? `rgba(${TETROMINOS[Object.keys(TETROMINOS)[cell[0]] as keyof typeof TETROMINOS].color}, 1)`
                            : "rgba(20, 20, 30, 1)",
                        border: cell[0] !== 0 ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
                        boxShadow: cell[0] !== 0 ? "inset 0 0 8px rgba(255, 255, 255, 0.3)" : "none",
                        borderRadius: "2px",
                      }}
                    />
                  )),
                )}
              </div>
              {isMobile && !gameOver && dropTime && (
                <div className="text-center mt-2 text-xs text-blueberry/70 dark:text-sky/70 bg-white/50 dark:bg-blueberry/50 p-2 rounded-full border-2 border-dashed border-sky">
                  <p>Swipe to move • Tap to rotate</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-3 bg-white dark:bg-blueberry/80 border-4 border-sky shadow-childish hover:shadow-childish-lg transition-all duration-300">
              <div className="text-center mb-2">
                <h2 className="text-lg font-bold text-blueberry dark:text-sky flex items-center justify-center">
                  <Trophy className="w-4 h-4 mr-2 text-sunshine" />
                  Stats
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-1 text-blueberry dark:text-sky text-sm">
                <div className="text-right font-bold">Score:</div>
                <div className="font-bold text-candy">{score}</div>
                <div className="text-right font-bold">Rows:</div>
                <div className="font-bold text-sky">{rows}</div>
                <div className="text-right font-bold">Level:</div>
                <div className="font-bold text-sunshine">{level}</div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {isMobile ? (
              <Card className="p-4 bg-white dark:bg-blueberry/80 border-4 border-sunshine shadow-childish hover:shadow-childish-lg transition-all duration-300">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-blueberry dark:text-sky flex items-center justify-center">
                    <Gamepad2 className="w-5 h-5 mr-2 text-candy" />
                    Controls
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
                  {/* Top row - rotate */}
                  <div className="col-start-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => playerRotate(1)}
                      className="w-14 h-14 bg-candy hover:bg-candy/80 text-white rounded-full shadow-childish relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Rotate className="h-6 w-6" />
                      <span className="sr-only">Rotate</span>
                    </Button>
                  </div>

                  {/* Middle row - left, hard drop, right */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => movePlayer(-1)}
                    className="w-14 h-14 bg-sky hover:bg-sky/80 text-white rounded-full shadow-childish relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <ChevronLeft className="h-6 w-6" />
                    <span className="sr-only">Move Left</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={hardDrop}
                    className="w-14 h-14 bg-sunshine hover:bg-sunshine/80 text-blueberry rounded-full shadow-childish relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <ChevronDown className="h-6 w-6" />
                    <span className="sr-only">Hard Drop</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => movePlayer(1)}
                    className="w-14 h-14 bg-sky hover:bg-sky/80 text-white rounded-full shadow-childish relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <ChevronRight className="h-6 w-6" />
                    <span className="sr-only">Move Right</span>
                  </Button>
                </div>

                {!gameOver && dropTime && (
                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={pauseGame}
                      variant="outline"
                      className="bg-blueberry/10 hover:bg-blueberry/20 text-blueberry dark:text-sky border-2 border-sky rounded-full shadow-childish"
                    >
                      {dropTime ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-4 bg-white dark:bg-blueberry/80 border-4 border-sunshine shadow-childish hover:shadow-childish-lg transition-all duration-300">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-blueberry dark:text-sky flex items-center justify-center">
                    <Gamepad2 className="w-5 h-5 mr-2 text-candy" />
                    Controls
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-2 text-blueberry dark:text-sky mb-4 bg-white/50 dark:bg-blueberry/50 p-3 rounded-xl border-2 border-dashed border-sky">
                  <div className="text-right font-bold">Move:</div>
                  <div className="font-bold">← →</div>
                  <div className="text-right font-bold">Rotate:</div>
                  <div className="font-bold">↑</div>
                  <div className="text-right font-bold">Soft Drop:</div>
                  <div className="font-bold">↓</div>
                  <div className="text-right font-bold">Hard Drop:</div>
                  <div className="font-bold">Space</div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => movePlayer(-1)}
                    className="bg-sky hover:bg-sky/80 text-white shadow-childish"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={dropPlayer}
                    className="bg-sunshine hover:bg-sunshine/80 text-blueberry shadow-childish"
                  >
                    <ArrowDown className="h-4 w-4 font-bold" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => movePlayer(1)}
                    className="bg-sky hover:bg-sky/80 text-white shadow-childish"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => playerRotate(-1)}
                    className="bg-candy hover:bg-candy/80 text-white shadow-childish"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={hardDrop}
                    className="bg-sunshine hover:bg-sunshine/80 text-blueberry shadow-childish"
                  >
                    <ArrowDown className="h-4 w-4 font-bold" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => playerRotate(1)}
                    className="bg-candy hover:bg-candy/80 text-white shadow-childish"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2 justify-center mt-4">
                  <Button
                    onClick={startGame}
                    className="bg-candy hover:bg-candy/90 text-white flex-1 rounded-full shadow-childish relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <Play className="h-4 w-4 mr-2" />
                    {gameOver ? "Play Again" : "New Game"}
                    <Sparkles className="h-4 w-4 ml-2 animate-spin-slow" />
                  </Button>
                  {!gameOver && (
                    <Button
                      onClick={pauseGame}
                      variant="outline"
                      className="bg-blueberry/10 hover:bg-blueberry/20 text-blueberry dark:text-sky border-2 border-sky rounded-full shadow-childish"
                    >
                      {dropTime ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// Custom hook for interval
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useCallback(callback, [callback])

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(savedCallback, delay)
      return () => clearInterval(id)
    }
  }, [delay, savedCallback])
}

