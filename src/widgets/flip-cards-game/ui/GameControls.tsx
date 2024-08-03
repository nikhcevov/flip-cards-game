import { Button } from '@mui/material'
import { type FC, useState } from 'react'

import { GameStatus } from '../config/types'
import { useGameControls } from '../model/useGameControls'

import { RestartDialog } from './RestartDialog'
import { ScoreDialog } from './ScoreDialog'

export const GameControls: FC = () => {
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false)
  const [restartDialogOpen, setRestartDialogOpen] = useState(false)

  const { startGame, gameStatus } = useGameControls({
    onGameEnded: () => setScoreDialogOpen(true),
  })

  const handleStartGame = () => {
    if (gameStatus === GameStatus.IN_PROGRESS) {
      setRestartDialogOpen(true)
    } else {
      startGame()
    }
  }

  return (
    <>
      <ScoreDialog open={scoreDialogOpen} onClose={() => setScoreDialogOpen(false)} />
      <RestartDialog
        open={restartDialogOpen}
        onClose={() => setRestartDialogOpen(false)}
        onSubmit={() => {
          setRestartDialogOpen(false)
          startGame()
        }}
      />
      <Button
        color="primary"
        disabled={gameStatus === GameStatus.STARTING}
        sx={{
          width: '100%',
        }}
        variant="contained"
        onClick={handleStartGame}
      >
        {gameStatus === GameStatus.IN_PROGRESS ? 'Restart game' : 'Start game'}
      </Button>
    </>
  )
}
