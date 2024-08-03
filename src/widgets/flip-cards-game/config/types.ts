import type { GameEvent } from './consts'

export enum GameSize {
  '4x4' = '4x4',
  '6x6' = '6x6',
}

export enum GameStatus {
  INITIAL = 'INITIAL',
  STARTING = 'STARTING',
  IN_PROGRESS = 'IN_PROGRESS',
}

export interface EventPayloadTypes {
  [GameEvent.GAME_STARTED]: undefined
  [GameEvent.GAME_ENDED]: undefined
  [GameEvent.SCORE_CHANGED]: {
    score: number
  }
  [GameEvent.FLIPPED_CARDS_COUNT_CHANGED]: {
    count: number
  }
  [GameEvent.TIME_CHANGED]: {
    seconds: number
  }
  [GameEvent.GAME_STATUS_CHANGED]: {
    status: GameStatus
  }
}
