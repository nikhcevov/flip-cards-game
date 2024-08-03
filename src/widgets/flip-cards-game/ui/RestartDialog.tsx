import { Box, Button, Typography } from '@mui/material'
import type React from 'react'

import { Dialog } from './Dialog'

interface RestartDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
}

const textStyle = {
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center',
}

export const RestartDialog: React.FC<RestartDialogProps> = ({ open, onClose, onSubmit }) => {
  return (
    <Dialog
      actions={
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <Button color="primary" variant="outlined" onClick={onClose}>
            Back
          </Button>
          <Button color="primary" variant="contained" onClick={onSubmit}>
            Start new game
          </Button>
        </Box>
      }
      open={open}
      title="Restart game?"
      onClose={onClose}
    >
      <Typography sx={textStyle} variant="h6">
        The result will be lost, and the bonus attempt will be spent.
      </Typography>
    </Dialog>
  )
}
