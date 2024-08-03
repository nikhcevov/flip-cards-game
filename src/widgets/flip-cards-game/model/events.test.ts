import { GameEvent } from '../config/consts'

import { eventBus } from './events'

describe('EventBus', () => {
  it('should register and call event listeners', () => {
    const callback = jest.fn()
    eventBus.on(GameEvent.SCORE_CHANGED, callback)

    eventBus.emit(GameEvent.SCORE_CHANGED, { score: 10 })

    expect(callback).toHaveBeenCalledWith({ score: 10 })
  })

  it('should unregister event listeners', () => {
    const callback = jest.fn()
    const off = eventBus.on(GameEvent.SCORE_CHANGED, callback)

    off()
    eventBus.emit(GameEvent.SCORE_CHANGED, { score: 10 })

    expect(callback).not.toHaveBeenCalled()
  })

  it('should handle multiple listeners for the same event', () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    eventBus.on(GameEvent.SCORE_CHANGED, callback1)
    eventBus.on(GameEvent.SCORE_CHANGED, callback2)

    eventBus.emit(GameEvent.SCORE_CHANGED, { score: 10 })

    expect(callback1).toHaveBeenCalledWith({ score: 10 })
    expect(callback2).toHaveBeenCalledWith({ score: 10 })
  })

  it('should not call listeners after they are unregistered', () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const off1 = eventBus.on(GameEvent.SCORE_CHANGED, callback1)
    eventBus.on(GameEvent.SCORE_CHANGED, callback2)

    off1()
    eventBus.emit(GameEvent.SCORE_CHANGED, { score: 10 })

    expect(callback1).not.toHaveBeenCalled()
    expect(callback2).toHaveBeenCalledWith({ score: 10 })
  })
})
