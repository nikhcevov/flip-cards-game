import { Box, Button, Typography } from '@mui/material'
import type React from 'react'

import { ReactComponent as IconCoin } from 'src/shared/icons/Coin.svg'

import { GameEvent } from '../config/consts'
import { useGameEvent } from '../model/useGameEvent'

import { Dialog } from './Dialog'

interface ScoreDialogProps {
  open: boolean
  onClose: () => void
}

const textStyle = {
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center',
}

export const ScoreDialog: React.FC<ScoreDialogProps> = ({ open, onClose }) => {
  const { score } = useGameEvent(GameEvent.SCORE_CHANGED, { score: 0 })

  return (
    <Dialog
      actions={
        <Button color="primary" variant="contained" onClick={onClose}>
          Continue
        </Button>
      }
      open={open}
      title="Game finished"
      onClose={onClose}
    >
      <Typography sx={textStyle} variant="h6">
        Your result <b>{score}</b> points!
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <Typography sx={textStyle} variant="h6">
          You get
        </Typography>
        <IconCoin />
        <b>{1000}</b>
      </Box>
    </Dialog>
  )
}
