import { Typography, TextField, Button, Paper, Stack, MenuItem } from '@mui/material';

const categories = ['Home Services', 'Manpower Services', 'Event Management', 'Office Equipment'];

export default function PostTenderPage() {
  return (
    <Paper sx={{ maxWidth: 620, mx: 'auto', p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>Post Tender / Requirement</Typography>
      <Stack spacing={2}>
        <TextField label="Title" fullWidth />
        <TextField label="Category" select fullWidth>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </TextField>
        <TextField label="Location" fullWidth />
        <TextField label="Budget" fullWidth />
        <TextField label="Deadline" fullWidth />
        <TextField label="Description" multiline minRows={3} fullWidth />
        <Button variant="contained">Submit</Button>
      </Stack>
    </Paper>
  );
}
