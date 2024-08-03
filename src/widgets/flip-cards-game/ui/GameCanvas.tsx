import { type FC, useEffect, useRef } from 'react'

import type { GameSize } from '../config/types'
import { GameCore } from '../model/core'

interface GameCanvasProps {
  size: GameSize
}

export const GameCanvas: FC<GameCanvasProps> = ({ size }) => {
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      new GameCore(canvasRef.current, size)
    }
  }, [size])

  return <div ref={canvasRef} />
}
