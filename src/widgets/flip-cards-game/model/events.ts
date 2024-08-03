import type { GameEvent } from '../config/consts'
import type { EventPayloadTypes } from '../config/types'

type EventCallback<T extends GameEvent> = (data: EventPayloadTypes[T]) => void
type Listeners = Record<GameEvent, EventCallback<GameEvent>[]>

class EventBus {
  private listeners: Listeners

  constructor() {
    this.listeners = {} as Listeners
  }

  on<T extends GameEvent>(event: T, callback: EventCallback<T>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback as EventCallback<GameEvent>)

    return () => {
      this.off(event, callback)
    }
  }

  off<T extends GameEvent>(event: T, callback: EventCallback<T>): void {
    if (!this.listeners[event]) {
      return
    }

    this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback)
  }

  emit<T extends GameEvent>(event: T, data?: EventPayloadTypes[T]): void {
    if (!this.listeners[event]) {
      return
    }

    this.listeners[event].forEach((callback) => callback(data))
  }
}

export const eventBus = new EventBus()
