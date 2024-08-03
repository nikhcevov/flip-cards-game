import { useCallback, useEffect, useState } from 'react'

import { GameEvent } from '../config/consts'
import { GameStatus } from '../config/types'

import { eventBus } from './events'

type UseGameControlsType = (props: { onGameStarted?: () => void; onGameEnded?: () => void }) => {
  startGame: () => void
  stopGame: () => void
  gameStatus: GameStatus
}

export const useGameControls: UseGameControlsType = ({ onGameStarted, onGameEnded }) => {
  const [gameStatus, setGameStatus] = useState(GameStatus.INITIAL)

  const startGame = useCallback(() => {
    eventBus.emit(GameEvent.GAME_STARTED)
  }, [])

  const stopGame = useCallback(() => {
    eventBus.emit(GameEvent.GAME_ENDED)
  }, [])

  useEffect(() => {
    const handleGameStarted = () => {
      onGameStarted?.()
    }
    const handleGameEnded = () => {
      onGameEnded?.()
    }

    const handleGameStatusChanged = ({ status }: { status: GameStatus }) => {
      setGameStatus(status)
    }

    eventBus.on(GameEvent.GAME_STARTED, handleGameStarted)
    eventBus.on(GameEvent.GAME_ENDED, handleGameEnded)
    eventBus.on(GameEvent.GAME_STATUS_CHANGED, handleGameStatusChanged)

    return () => {
      eventBus.off(GameEvent.GAME_STARTED, handleGameStarted)
      eventBus.off(GameEvent.GAME_ENDED, handleGameEnded)
      eventBus.off(GameEvent.GAME_STATUS_CHANGED, handleGameStatusChanged)
    }
  }, [onGameEnded, onGameStarted])

  return { startGame, stopGame, gameStatus }
}
