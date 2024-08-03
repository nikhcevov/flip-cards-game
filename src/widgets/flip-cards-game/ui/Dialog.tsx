import { Box, Divider, Dialog as MuiDialog, Typography } from '@mui/material'
import type { PropsWithChildren } from 'react'

interface DialogProps extends PropsWithChildren {
  open: boolean
  onClose: () => void
  title: string
  actions: React.ReactNode
}

export const Dialog: React.FC<DialogProps> = ({ open, onClose, title, children, actions }) => {
  return (
    <MuiDialog
      PaperProps={{
        sx: {
          padding: '24px 32px',
          gap: '16px',
          borderRadius: '32px',
          width: '400px',
        },
      }}
      open={open}
      onClose={onClose}
    >
      <Typography
        sx={{
          color: 'primary.main',
          fontSize: '20px',
          fontWeight: 500,
          lineHeight: '24.2px',
          textAlign: 'center',
        }}
      >
        {title}
      </Typography>

      <Divider />

      {children}

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>{actions}</Box>
    </MuiDialog>
  )
}
