import { Box, Typography, Button } from '@mui/material';

export default function NotFoundPage({ onNavigate }) {
  return (
    <Box textAlign="center" py={8}>
      <Typography variant="h3" fontWeight={700}>404</Typography>
      <Typography sx={{ mt: 1, mb: 3 }}>Page not found</Typography>
      <Button onClick={() => onNavigate('/')} variant="contained">Go Home</Button>
    </Box>
  );
}
