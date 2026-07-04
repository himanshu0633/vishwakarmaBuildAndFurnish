import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import api from '../../utils/axiosConfig';

export default function PartnerRegisterPage() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    shopName: '',
    ownerName: '',
    mobile: '',
    whatsappNumber: '',
    email: '',
    password: '',
    shopAddress: '',
    commissionPercent: '',
    gstNumber: '',
    latitude: '',
    longitude: ''
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const [shopImages, setShopImages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/services').then((res) => setServices(res.data.data || []));
  }, []);

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const toggleService = (serviceName) => {
    setSelectedServices(prev => (
      prev.includes(serviceName)
        ? prev.filter(item => item !== serviceName)
        : [...prev, serviceName]
    ));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Current location is not available in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
        setMessage('Current location added successfully.');
      },
      () => setError('Please allow location permission to use current location.')
    );
  };

  const submit = async () => {
    try {
      setError('');
      setMessage('');
      if (!form.shopName || !form.ownerName || !form.mobile || !form.email || !form.password || !form.shopAddress) {
        setError('Please fill shop name, owner name, mobile, email, password, and shop address.');
        return;
      }
      if (!selectedServices.length) {
        setError('Please select at least one service you provide.');
        return;
      }
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (!['latitude', 'longitude'].includes(key)) data.append(key, value);
      });
      data.append('productsServices', selectedServices.join(','));
      data.append('currentLocation', JSON.stringify({
        lat: Number(form.latitude),
        lng: Number(form.longitude),
        address: form.shopAddress
      }));
      shopImages.forEach(file => data.append('shopImages', file));

      const response = await api.post('/partners/register', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      localStorage.setItem('token', response.data.token);
      setMessage('Partner registration submitted successfully. Your shop will appear on the website after admin verification. You can add service-wise products from your dashboard.');
    } catch (err) {
      setError(err.response?.data?.message || 'Partner registration failed. Please check the form and try again.');
    }
  };

  return (
    <Box sx={{ bgcolor: '#111111', minHeight: '70vh', py: 4 }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: { xs: 2, md: 3 }, bgcolor: '#F8FAFC', color: '#111827' }}>
          <Typography variant="h4" fontWeight={900} mb={1}>Partner Register</Typography>
          <Typography sx={{ color: '#475569', mb: 2 }}>
            Select the services you provide while registering. After admin verification, you can add product names, descriptions, and images from your partner dashboard.
          </Typography>
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Stack spacing={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField label="Shop Name" value={form.shopName} onChange={(e) => setField('shopName', e.target.value)} />
              <TextField label="Owner Name" value={form.ownerName} onChange={(e) => setField('ownerName', e.target.value)} />
              <TextField label="Mobile" value={form.mobile} onChange={(e) => setField('mobile', e.target.value)} />
              <TextField label="WhatsApp Number" value={form.whatsappNumber} onChange={(e) => setField('whatsappNumber', e.target.value)} />
              <TextField label="Email" value={form.email} onChange={(e) => setField('email', e.target.value)} />
              <TextField label="Password" type="password" value={form.password} onChange={(e) => setField('password', e.target.value)} />
              <TextField label="Commission %" type="number" value={form.commissionPercent} onChange={(e) => setField('commissionPercent', e.target.value)} />
              <TextField label="GST Optional" value={form.gstNumber} onChange={(e) => setField('gstNumber', e.target.value)} />
            </Box>

            <TextField label="Shop Address" value={form.shopAddress} onChange={(e) => setField('shopAddress', e.target.value)} multiline minRows={2} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="outlined" startIcon={<MyLocationIcon />} onClick={useCurrentLocation}>Use Current Location</Button>
              <TextField label="Latitude" value={form.latitude} onChange={(e) => setField('latitude', e.target.value)} />
              <TextField label="Longitude" value={form.longitude} onChange={(e) => setField('longitude', e.target.value)} />
            </Stack>

            <Box>
              <Typography fontWeight={900} mb={1}>Which services do you provide?</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1 }}>
                {services.map(service => (
                  <FormControlLabel
                    key={service._id}
                    control={<Checkbox checked={selectedServices.includes(service.name)} onChange={() => toggleService(service.name)} />}
                    label={service.name}
                  />
                ))}
              </Box>
            </Box>

            <Button variant="outlined" component="label">
              Shop Images
              <input aria-label="Upload Shop Images" hidden multiple type="file" accept="image/*" onChange={(e) => setShopImages([...e.target.files])} />
            </Button>
            <Button variant="contained" onClick={submit}>Submit Partner Registration</Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
