import { Card, CardContent, Typography, Box } from '@mui/material'
import Icon from '@mdi/react'
import {
  mdiWrench,
  mdiClockTimeThreeOutline,
  mdiProgressWrench,
  mdiCheckCircle
} from '@mdi/js'

// Map icon names to actual icon paths
const iconMap = {
  'mdi:wrench': mdiWrench,
  'mdi:clock-time-four-outline': mdiClockTimeThreeOutline,
  'mdi:progress-wrench': mdiProgressWrench,
  'mdi:check-circle': mdiCheckCircle
}

export default function StatisticsCard({ title, stats, icon, color }) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}.light`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon
              path={iconMap[icon] || mdiWrench}
              size={2}
              color={`${color}.main`}
            />
          </Box>
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {stats}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}