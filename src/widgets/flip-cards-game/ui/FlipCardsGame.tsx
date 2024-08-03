import { Box, Paper } from '@mui/material'

import { GameSize } from '../config/types'

import { GameCanvas } from './GameCanvas'
import { GameStats } from './GameStats'

export const FlipCardsGame = () => {
  return (
    <Paper sx={{ display: 'flex', padding: '24px', gap: '16px', borderRadius: '32px', height: '100%' }}>
      <GameStats />

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          borderRadius: '8px',
          background: '#F2F2F2',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
        }}
      >
        <Paper
          sx={{
            padding: '12px',
            borderRadius: '12px',
            width: 'fit-content',
          }}
        >
          <GameCanvas size={GameSize['6x6']} />
        </Paper>
      </Box>
    </Paper>
  )
}
