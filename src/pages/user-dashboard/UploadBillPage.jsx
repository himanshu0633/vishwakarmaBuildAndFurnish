import { useState } from 'react';
import { Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import api from '../../../utils/axiosConfig';
import { getErrorMessage, useDashboard } from './DashboardContext';

export default function UploadBillPage() {
  const { partners, setMessage, setError, loadDashboard } = useDashboard();
  const [billForm, setBillForm] = useState({ partner: '', billAmount: '', billNumber: '', purchaseDate: '', remark: '', billImage: null });

  const uploadBill = async () => {
    try {
      setError('');
      setMessage('');
      if (!billForm.partner || !billForm.billAmount || !billForm.purchaseDate || !billForm.billImage) {
        setError('Please select a partner, enter bill amount and purchase date, and upload a bill image.');
        return;
      }

      const data = new FormData();
      Object.entries(billForm).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      await api.post('/marketplace/bills', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('Bill uploaded successfully. Partner verification is pending.');
      setBillForm({ partner: '', billAmount: '', billNumber: '', purchaseDate: '', remark: '', billImage: null });
      loadDashboard();
    } catch (error) {
      setError(getErrorMessage(error, 'Bill upload failed. Please check the form and try again.'));
    }
  };

  return (
    <Paper sx={{ p: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
      <Stack spacing={2}>
        <Box>
          <Typography fontWeight={900} sx={{ color: '#0F172A' }}>Upload Purchase Bill</Typography>
          <Typography sx={{ color: '#64748B' }}>Select a verified partner and upload your bill image to start cashback verification.</Typography>
        </Box>
        <TextField select label="Partner Select" value={billForm.partner} onChange={(e) => setBillForm({ ...billForm, partner: e.target.value })}>
          {partners.map(partner => <MenuItem key={partner._id} value={partner._id}>{partner.shopName}</MenuItem>)}
        </TextField>
        <TextField label="Bill Amount" type="number" value={billForm.billAmount} onChange={(e) => setBillForm({ ...billForm, billAmount: e.target.value })} />
        <TextField label="Bill Number Optional" value={billForm.billNumber} onChange={(e) => setBillForm({ ...billForm, billNumber: e.target.value })} />
        <TextField label="Purchase Date" type="date" InputLabelProps={{ shrink: true }} value={billForm.purchaseDate} onChange={(e) => setBillForm({ ...billForm, purchaseDate: e.target.value })} />
        <TextField label="Remark Optional" value={billForm.remark} onChange={(e) => setBillForm({ ...billForm, remark: e.target.value })} multiline minRows={2} />
        <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
          {billForm.billImage ? billForm.billImage.name : 'Bill Image'}
          <input hidden type="file" accept="image/*" onChange={(e) => setBillForm({ ...billForm, billImage: e.target.files?.[0] })} />
        </Button>
        <Button variant="contained" onClick={uploadBill} sx={{ bgcolor: '#D4AF37', color: '#111111', fontWeight: 900, '&:hover': { bgcolor: '#B88917' } }}>Upload Bill</Button>
      </Stack>
    </Paper>
  );
}
