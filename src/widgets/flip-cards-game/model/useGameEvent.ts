import { useEffect, useState } from 'react'

import type { GameEvent } from '../config/consts'
import type { EventPayloadTypes } from '../config/types'

import { eventBus } from './events'

export const useGameEvent = <T extends EventPayloadTypes[K], K extends GameEvent>(event: K, initialState: T) => {
  const [state, setState] = useState<T>(initialState)

  useEffect(() => {
    const handleEventChange = (data: unknown) => {
      setState(data as T)
    }

    const unsubscribe = eventBus.on(event, handleEventChange)

    return () => {
      unsubscribe()
    }
  }, [event])

  return state
}
