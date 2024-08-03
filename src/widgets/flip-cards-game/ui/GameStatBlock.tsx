import { Box, Typography } from '@mui/material'
import type { FC } from 'react'

import { GameStatus } from '../config/types'
import { useGameControls } from '../model/useGameControls'

interface GameStatBlockProps {
  title: string
  value: string | number
}

const fontStyle = {
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: '24px',
}

export const GameStatBlock: FC<GameStatBlockProps> = ({ title, value }) => {
  const { gameStatus } = useGameControls({})

  return (
    <Box
      sx={{
        padding: '8px 12px',
        gap: '4px',
        borderRadius: '4px',
        backgroundColor: 'background.paper',
        width: '100%',
      }}
    >
      <Typography sx={fontStyle}>{title}</Typography>
      <Typography
        sx={{
          fontSize: '20px',
          fontWeight: 500,
          lineHeight: '24.2px',
          color: gameStatus === GameStatus.IN_PROGRESS ? '#E28DA0' : undefined,
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}
