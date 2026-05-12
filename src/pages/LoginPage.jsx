import { Box, Typography, TextField, Button, Paper, Stack } from '@mui/material';

export default function LoginPage() {
  return (
    <Paper sx={{ maxWidth: 480, mx: 'auto', p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>Login</Typography>
      <Stack spacing={2}>
        <TextField label="Email" fullWidth />
        <TextField label="Password" type="password" fullWidth />
        <Button variant="contained">Login</Button>
      </Stack>
    </Paper>
  );
}
