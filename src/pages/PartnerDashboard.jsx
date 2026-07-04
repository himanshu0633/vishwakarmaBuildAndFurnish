import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import api from '../../utils/axiosConfig';
import { getStaticAssetUrl } from '../../utils/axiosConfig';

const billColumns = ['Customer', 'Mobile', 'Amount', 'Status', 'Date', 'Action'];

export default function PartnerDashboard() {
  const [tab, setTab] = useState('profile');
  const [summary, setSummary] = useState(null);
  const [bills, setBills] = useState([]);
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [productsServices, setProductsServices] = useState('');
  const [productForm, setProductForm] = useState({ service: '', name: '', description: '', image: null });

  const load = async () => {
    try {
      const [summaryRes, billsRes, servicesRes] = await Promise.all([
        api.get('/partners/dashboard/summary'),
        api.get('/marketplace/bills'),
        api.get('/services')
      ]);
      setSummary(summaryRes.data.data);
      setBills(billsRes.data.data || []);
      setServices(servicesRes.data.data || []);
      setProductsServices((summaryRes.data.data.partner.productsServices || []).join(', '));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load partner dashboard.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const verifyBill = async (billId, approved) => {
    try {
      setError('');
      await api.patch(`/marketplace/bills/${billId}/partner-verify`, { approved });
      setMessage(approved ? 'Bill verified successfully.' : 'Bill rejected successfully.');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update bill verification.');
    }
  };

  const saveServices = async () => {
    try {
      setError('');
      await api.post(`/partners/${summary.partner._id}/services`, { productsServices });
      setMessage('Products and services updated successfully.');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update products and services.');
    }
  };

  const addProduct = async () => {
    try {
      setError('');
      if (!productForm.service || !productForm.name) {
        setError('Please select a service and enter a product name.');
        return;
      }
      const data = new FormData();
      data.append('service', productForm.service);
      data.append('name', productForm.name);
      data.append('description', productForm.description);
      if (productForm.image) data.append('image', productForm.image);

      await api.post(`/partners/${summary.partner._id}/products`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('Product added successfully.');
      setProductForm({ service: '', name: '', description: '', image: null });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product.');
    }
  };

  if (!summary) {
    return <Box sx={{ bgcolor: '#111111', color: '#fff', minHeight: '70vh', p: 4 }}>Loading partner dashboard...</Box>;
  }

  const partner = summary.partner;

  return (
    <Box sx={{ bgcolor: '#111111', color: '#F5F5F5', minHeight: '70vh', py: 4 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" fontWeight={900} mb={1}>Partner Dashboard</Typography>
        <Typography sx={{ color: 'rgba(245,245,245,0.72)', mb: 2 }}>{partner.shopName} • <Chip size="small" label={partner.status} /></Typography>
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={2} sx={{ mb: 2 }}>
          {[
            ['Pending Bills', summary.stats.pendingBills],
            ['Verified Bills', summary.stats.verifiedBills],
            ['Rejected Bills', summary.stats.rejectedBills],
            ['Views', summary.stats.views],
            ['Clicks', summary.stats.clicks]
          ].map(([label, value]) => (
            <Grid item xs={12} sm={6} md={2.4} key={label}>
              <Paper sx={{ p: 2 }}><Typography color="text.secondary">{label}</Typography><Typography variant="h5" fontWeight={900}>{value}</Typography></Paper>
            </Grid>
          ))}
        </Grid>

        <Tabs value={tab} onChange={(event, value) => setTab(value)} sx={{ mb: 3 }}>
          {['profile', 'products', 'billVerification', 'customers', 'reviews', 'commission', 'analytics', 'notifications'].map(item => (
            <Tab key={item} value={item} label={item} />
          ))}
        </Tabs>

        {tab === 'profile' && (
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><Typography fontWeight={800}>Owner</Typography><Typography>{partner.ownerName}</Typography></Grid>
              <Grid item xs={12} md={4}><Typography fontWeight={800}>Mobile</Typography><Typography>{partner.mobile}</Typography></Grid>
              <Grid item xs={12} md={4}><Typography fontWeight={800}>WhatsApp</Typography><Typography>{partner.whatsappNumber}</Typography></Grid>
              <Grid item xs={12}><Typography fontWeight={800}>Shop Address</Typography><Typography>{partner.shopAddress}</Typography></Grid>
            </Grid>
          </Paper>
        )}

        {tab === 'products' && (
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={900} mb={2}>Services You Provide</Typography>
              <Stack spacing={2}>
                <TextField label="Services comma separated" value={productsServices} onChange={(e) => setProductsServices(e.target.value)} multiline minRows={3} />
                <Button variant="contained" onClick={saveServices}>Save Services</Button>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={900} mb={2}>Add Product by Service</Typography>
              <Stack spacing={2}>
                <TextField select label="Select Service" value={productForm.service} onChange={(e) => setProductForm({ ...productForm, service: e.target.value })}>
                  {services.map(service => <MenuItem key={service._id} value={service._id}>{service.name}</MenuItem>)}
                </TextField>
                <TextField label="Product Name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                <TextField label="Product Description" multiline minRows={3} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
                <Button variant="outlined" component="label">Product Image<input aria-label="Upload Product Image" hidden type="file" accept="image/*" onChange={(e) => setProductForm({ ...productForm, image: e.target.files?.[0] })} /></Button>
                <Button variant="contained" onClick={addProduct}>Add Product</Button>
              </Stack>
            </Paper>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
              {(partner.products || []).map(product => (
                <Paper key={product._id} sx={{ overflow: 'hidden' }}>
                  {product.image && <Box component="img" src={getStaticAssetUrl(product.image)} alt={product.name} sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', display: 'block' }} />}
                  <Box sx={{ p: 2 }}>
                    <Chip size="small" label={product.serviceName || 'Service'} sx={{ mb: 1 }} />
                    <Typography fontWeight={900}>{product.name}</Typography>
                    <Typography color="text.secondary">{product.description}</Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Stack>
        )}

        {tab === 'billVerification' && (
          <BillsTable rows={bills.filter(bill => bill.status === 'Pending Partner Verification')} action={(bill) => (
            <Stack direction="row" spacing={1}>
              <Button size="small" onClick={() => verifyBill(bill._id, true)}>Verify</Button>
              <Button size="small" color="error" onClick={() => verifyBill(bill._id, false)}>Reject</Button>
            </Stack>
          )} />
        )}

        {tab === 'customers' && <BillsTable rows={bills} />}
        {tab === 'reviews' && <ReviewTable rows={summary.reviews || []} />}
        {tab === 'commission' && <BillsTable rows={bills} />}
        {tab === 'analytics' && <Paper sx={{ p: 3 }}><Typography>Views {partner.views} • Clicks {partner.clicks} • Commission {partner.commissionPercent}%</Typography></Paper>}
        {tab === 'notifications' && <Notifications />}
      </Container>
    </Box>
  );
}

function BillsTable({ rows, action }) {
  return (
    <Paper sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead><TableRow>{billColumns.map(column => <TableCell key={column}>{column}</TableCell>)}</TableRow></TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row._id}>
              <TableCell>{row.user?.name}</TableCell>
              <TableCell>{row.user?.mobile}</TableCell>
              <TableCell>Rs. {Number(row.billAmount || 0).toLocaleString('en-IN')}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{action?.(row) || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

function ReviewTable({ rows }) {
  return (
    <Paper sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead><TableRow>{['Rating', 'Review', 'Status', 'Date'].map(column => <TableCell key={column}>{column}</TableCell>)}</TableRow></TableHead>
        <TableBody>{rows.map(row => <TableRow key={row._id}><TableCell>{row.rating}</TableCell><TableCell>{row.reviewText}</TableCell><TableCell>{row.status}</TableCell><TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell></TableRow>)}</TableBody>
      </Table>
    </Paper>
  );
}

function Notifications() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api.get('/marketplace/notifications').then((res) => setRows(res.data.data || []));
  }, []);
  return <ReviewTable rows={rows.map(row => ({ ...row, rating: row.title, reviewText: row.message, status: 'Unread' }))} />;
}
