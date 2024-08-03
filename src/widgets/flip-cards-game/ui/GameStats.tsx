import { Box, Typography } from '@mui/material'

import { GameEvent } from '../config/consts'
import { formatTime } from '../lib/formatTime'
import { useGameEvent } from '../model/useGameEvent'

import { GameControls } from './GameControls'
import { GameStatBlock } from './GameStatBlock'
import { PointsWidget } from './PointsWidget'

export const GameStats = () => {
  const { seconds: remainingTime } = useGameEvent(GameEvent.TIME_CHANGED, { seconds: 0 })
  const { score } = useGameEvent(GameEvent.SCORE_CHANGED, { score: 0 })
  const { count: flippedCardsCount } = useGameEvent(GameEvent.FLIPPED_CARDS_COUNT_CHANGED, { count: 0 })

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        borderRadius: '8px',
        padding: '12px',
        gap: '8px',
      }}
    >
      <Box
        sx={{
          width: 315,
          padding: '8px 12px',
          gap: '4px',
        }}
      >
        <Typography
          sx={{
            fontSize: '20px',
            fontWeight: 500,
            lineHeight: '24.2px',
            textAlign: 'center',
          }}
        >
          Game rules
        </Typography>
        <Typography>
          A game for finding pairs and earning points, requiring attention and quick reaction. The ability to play an unlimited
          number of times, and the first game per day will give you game currency.
        </Typography>
      </Box>

      <GameStatBlock title="Time to the end of the game" value={formatTime(remainingTime)} />
      <GameStatBlock title="Number of flips" value={flippedCardsCount} />
      <GameStatBlock title="Current result" value={score} />

      <GameControls />

      <PointsWidget coinsAmount={5} scoreAmount={10} />
    </Box>
  )
}
