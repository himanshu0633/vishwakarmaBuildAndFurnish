import { useState } from 'react';
import { Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import ReviewsIcon from '@mui/icons-material/Reviews';
import api from '../../../utils/axiosConfig';
import DataTable from './DataTable';
import { getErrorMessage, useDashboard } from './DashboardContext';
import EmptyState from './EmptyState';

export default function ReviewsPage() {
  const { partners, reviews, setMessage, setError, loadDashboard } = useDashboard();
  const [reviewForm, setReviewForm] = useState({ partner: '', rating: 5, reviewText: '', bill: '', image: null });

  const submitReview = async () => {
    try {
      setError('');
      setMessage('');
      if (!reviewForm.partner || !reviewForm.rating || !reviewForm.reviewText.trim()) {
        setError('Please select a partner, choose a rating, and write your review.');
        return;
      }

      const data = new FormData();
      Object.entries(reviewForm).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      await api.post('/marketplace/reviews', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('Review submitted successfully. It will appear after admin approval.');
      setReviewForm({ partner: '', rating: 5, reviewText: '', bill: '', image: null });
      loadDashboard();
    } catch (error) {
      setError(getErrorMessage(error, 'Review submission failed. Please check the form and try again.'));
    }
  };

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Stack spacing={2}>
          <Box>
            <Typography fontWeight={900} sx={{ color: '#0F172A' }}>Submit Partner Review</Typography>
            <Typography sx={{ color: '#64748B' }}>Your review will appear on the partner profile after admin approval.</Typography>
          </Box>
          <TextField select label="Partner" value={reviewForm.partner} onChange={(e) => setReviewForm({ ...reviewForm, partner: e.target.value })}>
            {partners.map(partner => <MenuItem key={partner._id} value={partner._id}>{partner.shopName}</MenuItem>)}
          </TextField>
          <TextField label="Rating 1-5" type="number" value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })} />
          <TextField label="Review Text" multiline minRows={3} value={reviewForm.reviewText} onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })} />
          <Button variant="outlined" component="label">Review Image Optional<input aria-label="Upload Review Image" hidden type="file" accept="image/*" onChange={(e) => setReviewForm({ ...reviewForm, image: e.target.files?.[0] })} /></Button>
          <Button variant="contained" onClick={submitReview} sx={{ bgcolor: '#D4AF37', color: '#111111', fontWeight: 900, '&:hover': { bgcolor: '#B88917' } }}>Submit Review</Button>
        </Stack>
      </Paper>
      {reviews.length ? (
        <DataTable rows={reviews} columns={['Partner', 'Rating', 'Review', 'Status']} render={(row) => [row.partner?.shopName, row.rating, row.reviewText, row.status]} />
      ) : (
        <EmptyState icon={<ReviewsIcon />} title="No reviews yet" subtitle="Submitted review status will appear here." />
      )}
    </Stack>
  );
}
