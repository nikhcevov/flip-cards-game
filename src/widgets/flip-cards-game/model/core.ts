import { GameEvent } from '../config/consts'
import { GameSize, GameStatus } from '../config/types'
import { shuffleArray } from '../lib/shuffleArray'

import { eventBus } from './events'

const GAME_SIZE_MAP = {
  [GameSize['4x4']]: 4,
  [GameSize['6x6']]: 6,
}

const CONFIG = {
  previewTime: 5000,
  checkMatchTime: 600,
  scorePerMatch: 10,
  cardWidth: 100,
  cardHeight: 100,
  cardMargin: 10,
  timeLimit: 60 * 3, // 5 minutes
}

interface Card {
  x: number
  y: number
  image: string
  flipped: boolean
  matched: boolean
  element: HTMLElement | null
}

export class GameCore {
  private container: HTMLElement
  private cards: Card[] = []
  private flippedCards: Card[] = []
  private isCheckingMatch = false
  private score = 0
  private flippedCardsCount = 0
  private cols: number
  private rows: number
  private remainingTime = CONFIG.timeLimit
  private timerInterval: NodeJS.Timeout | null = null
  private gameStatus: GameStatus = GameStatus.INITIAL

  constructor(container: HTMLElement, size: GameSize) {
    this.container = container

    this.cols = GAME_SIZE_MAP[size]
    this.rows = GAME_SIZE_MAP[size]

    this.container.style.width = `${this.cols * (CONFIG.cardWidth + CONFIG.cardMargin) - CONFIG.cardMargin}px`
    this.container.style.height = `${this.rows * (CONFIG.cardHeight + CONFIG.cardMargin) - CONFIG.cardMargin}px`
    this.container.style.position = 'relative'

    this.container.addEventListener('click', this.handleCardClick.bind(this))
    this.container.addEventListener('mousemove', this.handleCardHover.bind(this))

    eventBus.on(GameEvent.GAME_STARTED, this.onGameStarted.bind(this))
    eventBus.on(GameEvent.GAME_ENDED, this.onGameEnded.bind(this))

    this.init()
  }

  private setGameStatus(status: GameStatus) {
    this.gameStatus = status
    eventBus.emit(GameEvent.GAME_STATUS_CHANGED, { status: this.gameStatus })
  }

  private destroyCard(card: Card) {
    if (card.element && this.container.contains(card.element)) {
      this.container.removeChild(card.element)
      card.element = null
    }
  }

  private destroyCards() {
    this.cards.forEach(this.destroyCard.bind(this))
  }

  private createCards() {
    const imageSources = Array.from(
      { length: (this.rows * this.cols) / 2 },
      (_, i) => `/emoji-animal-set/image${i + 1}.png`,
    )
    const images = [...imageSources, ...imageSources]
    shuffleArray(images)
    this.cards = []

    for (let i = 0; i < this.rows * this.cols; i++) {
      const card: Card = {
        x: (i % this.cols) * (CONFIG.cardWidth + CONFIG.cardMargin),
        y: Math.floor(i / this.cols) * (CONFIG.cardHeight + CONFIG.cardMargin),
        image: images[i],
        flipped: false,
        matched: false,
        element: null,
      }
      this.cards.push(card)
    }
  }

  private drawCard(card: Card) {
    this.destroyCard(card)

    card.element = document.createElement('div')
    card.element.style.width = `${CONFIG.cardWidth}px`
    card.element.style.height = `${CONFIG.cardHeight}px`
    card.element.style.position = 'absolute'
    card.element.style.left = `${card.x}px`
    card.element.style.top = `${card.y}px`
    card.element.style.background = '#FFFFFF'
    card.element.style.border = '1px solid #E0D6F6'
    card.element.style.borderRadius = '10px'
    card.element.style.boxShadow = '2px 4px 6px 2px #7C779940'
    card.element.classList.add('card')
    card.element.style.backgroundImage = card.flipped || card.matched ? `url(${card.image})` : 'none'
    card.element.style.backgroundSize = 'cover'

    this.container.appendChild(card.element)
  }

  private drawCards() {
    this.cards.forEach(this.drawCard.bind(this))
  }

  private checkMatch() {
    if (this.flippedCards.length === 2) {
      this.isCheckingMatch = true
      const [card1, card2] = this.flippedCards
      if (card1.image === card2.image) {
        card1.matched = true
        card2.matched = true
        this.score += CONFIG.scorePerMatch
        eventBus.emit(GameEvent.SCORE_CHANGED, { score: this.score })
        this.isCheckingMatch = false
        this.checkIsGameComplete()
      } else {
        setTimeout(() => {
          card1.flipped = false
          card2.flipped = false
          this.isCheckingMatch = false
          this.drawCard(card1)
          this.drawCard(card2)
        }, CONFIG.checkMatchTime)
      }
      this.flippedCards = []
    }
  }

  private checkIsGameComplete() {
    if (this.cards.every((card) => card.matched)) {
      eventBus.emit(GameEvent.GAME_ENDED)
    }
  }

  private getPointerPosition(event: MouseEvent) {
    const rect = this.container.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return { x, y }
  }

  private getIsCardHovered(card: Card, x: number, y: number) {
    return x > card.x && x < card.x + CONFIG.cardWidth && y > card.y && y < card.y + CONFIG.cardHeight
  }

  private handleCardClick(event: MouseEvent) {
    if (this.isCheckingMatch || this.gameStatus !== GameStatus.IN_PROGRESS) {
      return
    }
    const { x, y } = this.getPointerPosition(event)

    this.cards.forEach((card) => {
      if (this.getIsCardHovered(card, x, y) && !card.flipped && !card.matched) {
        card.flipped = true
        this.flippedCards.push(card)
        this.flippedCardsCount += 1
        eventBus.emit(GameEvent.FLIPPED_CARDS_COUNT_CHANGED, { count: this.flippedCardsCount })
        this.drawCard(card)
        this.checkMatch()
      }
    })
  }

  private handleCardHover(event: MouseEvent) {
    if (this.gameStatus !== GameStatus.IN_PROGRESS) {
      this.container.style.cursor = 'default'
      return
    }

    const { x, y } = this.getPointerPosition(event)

    const hoveredCard = this.cards.find((card) => this.getIsCardHovered(card, x, y) && !card.flipped && !card.matched)

    if (hoveredCard) {
      this.container.style.cursor = 'pointer'
    } else {
      this.container.style.cursor = 'default'
    }
  }

  private async previewCards() {
    const snakeSize = 10

    const flip = (index: number) => {
      this.cards[index].flipped = true
      const el = this.cards[index].element
      if (el) {
        el.style.backgroundImage = `url(${this.cards[index].image})`
      }
    }

    const unflip = (index: number) => {
      this.cards[index].flipped = false
      const el = this.cards[index].element
      if (el) {
        el.style.backgroundImage = 'none'
      }
    }

    const oneFlipTime = CONFIG.previewTime / (this.cards.length + snakeSize)

    const flipCard = async (index: number) => {
      if (index < this.cards.length + snakeSize) {
        if (index < this.cards.length) {
          flip(index)
        }

        const tailIndex = index - snakeSize
        if (tailIndex >= 0) {
          unflip(tailIndex)
        }

        await new Promise((resolve) => setTimeout(resolve, oneFlipTime))
        await flipCard(index + 1)
      }
    }

    await flipCard(0)
  }

  private async onGameStarted() {
    this.setGameStatus(GameStatus.STARTING)
    this.flippedCards = []
    this.flippedCardsCount = 0
    eventBus.emit(GameEvent.FLIPPED_CARDS_COUNT_CHANGED, { count: this.flippedCardsCount })
    this.score = 0
    eventBus.emit(GameEvent.SCORE_CHANGED, { score: this.score })
    this.remainingTime = CONFIG.timeLimit
    eventBus.emit(GameEvent.TIME_CHANGED, { seconds: this.remainingTime })
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
    }

    this.destroyCards()
    this.createCards()
    this.drawCards()
    await this.previewCards()

    this.setGameStatus(GameStatus.IN_PROGRESS)
    this.timerInterval = setInterval(() => {
      this.remainingTime -= 1
      eventBus.emit(GameEvent.TIME_CHANGED, { seconds: this.remainingTime })
      if (this.remainingTime <= 0) {
        eventBus.emit(GameEvent.GAME_ENDED)
      }
    }, 1000)
  }

  private onGameEnded() {
    this.setGameStatus(GameStatus.INITIAL)
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
    }
  }

  private init() {
    this.createCards()
    this.drawCards()
  }
}
