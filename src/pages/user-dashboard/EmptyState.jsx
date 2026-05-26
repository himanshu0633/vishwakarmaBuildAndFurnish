import { Box, Button, Typography } from '@mui/material';

export default function EmptyState({ icon, title, subtitle, actionLabel, onAction }) {
  return (
    <Box sx={{ textAlign: 'center', py: 7, px: 2 }}>
      <Box sx={{ color: '#D4AF37', mb: 1.5, '& svg': { fontSize: 72 } }}>{icon}</Box>
      <Typography variant="h5" fontWeight={900} sx={{ color: '#0F172A', mb: 0.7 }}>{title}</Typography>
      <Typography sx={{ color: '#64748B', mb: actionLabel ? 2.5 : 0 }}>{subtitle}</Typography>
      {actionLabel && (
        <Button variant="contained" onClick={onAction} sx={{ bgcolor: '#D4AF37', color: '#111111', fontWeight: 900, '&:hover': { bgcolor: '#B88917' } }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
