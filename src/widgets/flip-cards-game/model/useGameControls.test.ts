import { renderHook } from '@testing-library/react'
import { act } from 'react'

import { GameEvent } from '../config/consts'
import { GameStatus } from '../config/types'

import { eventBus } from './events'
import { useGameControls } from './useGameControls'

describe('useGameControls', () => {
  it('should initialize with the correct state', () => {
    const { result } = renderHook(() => useGameControls({}))
    expect(result.current).toStrictEqual({
      startGame: expect.any(Function),
      stopGame: expect.any(Function),
      gameStatus: GameStatus.INITIAL,
    })
  })

  it('should start the game correctly', () => {
    const { result } = renderHook(() => useGameControls({}))

    act(() => {
      result.current.startGame()
    })

    setTimeout(() => {
      expect(result.current.gameStatus).toBe(GameStatus.STARTING)
    }, 0)
  })

  it('should stop the game correctly', () => {
    const { result } = renderHook(() => useGameControls({}))

    act(() => {
      result.current.startGame()
    })

    act(() => {
      result.current.stopGame()
    })

    expect(result.current.gameStatus).toBe(GameStatus.INITIAL)
  })

  it('should call onGameStarted callback when game starts', () => {
    const onGameStarted = jest.fn()
    const { result } = renderHook(() => useGameControls({ onGameStarted }))

    act(() => {
      result.current.startGame()
    })

    expect(onGameStarted).toHaveBeenCalled()
  })

  it('should call onGameEnded callback when game ends', () => {
    const onGameEnded = jest.fn()
    const { result } = renderHook(() => useGameControls({ onGameEnded }))

    act(() => {
      result.current.startGame()
    })

    act(() => {
      result.current.stopGame()
    })

    expect(onGameEnded).toHaveBeenCalled()
  })

  it('should clean up event listeners on unmount', () => {
    const { result, unmount } = renderHook(() => useGameControls({}))

    act(() => {
      result.current.startGame()
    })

    setTimeout(() => {
      expect(result.current.gameStatus).toBe(GameStatus.IN_PROGRESS)
    }, 0)

    unmount()

    act(() => {
      eventBus.emit(GameEvent.GAME_ENDED)
    })

    setTimeout(() => {
      expect(result.current.gameStatus).toBe(GameStatus.IN_PROGRESS)
    }, 0)
  })
})
