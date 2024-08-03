import { Box, Tooltip, Typography } from '@mui/material'
import type { FC } from 'react'

import { ReactComponent as IconCoin } from 'src/shared/icons/Coin.svg'
import { ReactComponent as IconMoreFilled } from 'src/shared/icons/MoreFilled.svg'

interface PointsWidgetProps {
  scoreAmount: number
  coinsAmount: number
}

const fontStyle = {
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '24.2px',
  textAlign: 'center',
}

export const PointsWidget: FC<PointsWidgetProps> = ({ scoreAmount, coinsAmount }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flexDirection: 'column',
        padding: '8px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '24px',
            textAlign: 'center',
          }}
        >
          Points to currency
        </Typography>
        <Tooltip title="Earn points, get currency! Each X points turn into X game currency. Use successes to buy and upgrade in the game.">
          <IconMoreFilled />
        </Tooltip>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <Typography sx={fontStyle}>{scoreAmount} points =</Typography>
        <IconCoin />
        <Typography sx={fontStyle}>{coinsAmount}</Typography>
      </Box>
    </Box>
  )
}
