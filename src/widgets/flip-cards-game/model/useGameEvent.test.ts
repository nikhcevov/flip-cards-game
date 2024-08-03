import { renderHook } from '@testing-library/react'
import { act } from 'react'

import { GameEvent } from '../config/consts'

import { eventBus } from './events'
import { useGameEvent } from './useGameEvent'

describe('useGameEvent', () => {
  it('should initialize with the correct state', () => {
    const initialState = { score: 0 }
    const { result } = renderHook(() => useGameEvent(GameEvent.SCORE_CHANGED, initialState))
    expect(result.current).toStrictEqual(initialState)
  })

  it('should update state when event is emitted', () => {
    const initialState = { score: 0 }
    const { result } = renderHook(() => useGameEvent(GameEvent.SCORE_CHANGED, initialState))

    const newState = { score: 10 }
    act(() => {
      eventBus.emit(GameEvent.SCORE_CHANGED, newState)
    })

    expect(result.current).toStrictEqual(newState)
  })

  it('should clean up event listeners on unmount', () => {
    const initialState = { score: 0 }
    const { result, unmount } = renderHook(() => useGameEvent(GameEvent.SCORE_CHANGED, initialState))

    unmount()

    const newState = { score: 10 }
    act(() => {
      eventBus.emit(GameEvent.SCORE_CHANGED, newState)
    })

    expect(result.current).toStrictEqual(initialState)
  })
})
