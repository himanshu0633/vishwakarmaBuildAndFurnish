import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import api from '../../utils/axiosConfig';
import { useAuth } from '../contexts/AuthContext';

const initialRegister = {
  name: '',
  mobile: '',
  whatsappNumber: '',
  email: '',
  address: '',
  password: '',
  referralCode: '',
  otp: ''
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register } = useAuth();
  const referralFromUrl = useMemo(() => searchParams.get('ref') || searchParams.get('referral') || '', [searchParams]);
  const [mode, setMode] = useState(referralFromUrl ? 'register' : 'login');
  const [loginData, setLoginData] = useState({ email: '', password: '', target: '', otp: '', channel: 'email' });
  const [registerData, setRegisterData] = useState({ ...initialRegister, referralCode: referralFromUrl.toUpperCase() });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (referralFromUrl) {
      setMode('register');
      setRegisterData(prev => ({
        ...prev,
        referralCode: referralFromUrl.toUpperCase()
      }));
      setMessage('Referral code was filled from the invite link.');
    }
  }, [referralFromUrl]);

  const requestOtp = async (target, channel, purpose) => {
    try {
      setError('');
      const response = await api.post('/auth/request-otp', { target, channel: 'email', purpose });
      setMessage(`OTP generated${response.data.devOtp ? `: ${response.data.devOtp}` : ''}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to generate OTP. Please check your email address and try again.');
    }
  };

  const handlePasswordLogin = async () => {
    setLoading(true);
    setError('');
    const result = await login(loginData.email, loginData.password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleOtpLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.post('/auth/login/otp', {
        target: loginData.target,
        channel: 'email',
        otp: loginData.otp
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'OTP login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    const result = await register(registerData);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <Box sx={{ bgcolor: '#111111', minHeight: '100vh', py: 5, color: '#F5F5F5' }}>
      <Container maxWidth="sm">
        <Paper sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: '#F8FAFC',
          color: '#111827',
          border: '1px solid rgba(212,175,55,0.45)',
          boxShadow: '0 20px 70px rgba(0,0,0,0.32)',
          '& .MuiInputLabel-root': { color: '#334155' },
          '& .MuiInputBase-input': { color: '#111827' },
          '& .MuiOutlinedInput-root': {
            bgcolor: '#ffffff',
            '& fieldset': { borderColor: '#CBD5E1' },
            '&:hover fieldset': { borderColor: '#D4AF37' },
            '&.Mui-focused fieldset': { borderColor: '#B88917' }
          },
          '& .MuiTab-root': { color: '#334155', fontWeight: 800 },
          '& .Mui-selected': { color: '#B88917 !important' }
        }}>
          <Typography variant="h4" fontWeight={900} mb={2}>User Login / Register</Typography>
          <Tabs value={mode} onChange={(event, value) => setMode(value)} sx={{ mb: 2 }}>
            <Tab value="login" label="Login" />
            <Tab value="otp" label="OTP Login" />
            <Tab value="register" label="Register" />
          </Tabs>

          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {mode === 'login' && (
            <Stack spacing={2}>
              <TextField label="Email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} fullWidth />
              <TextField label="Password" type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} fullWidth />
              <Button variant="contained" disabled={loading} onClick={handlePasswordLogin}>Login</Button>
            </Stack>
          )}

          {mode === 'otp' && (
            <Stack spacing={2}>
              <TextField label="Email" value={loginData.target} onChange={(e) => setLoginData({ ...loginData, target: e.target.value })} fullWidth />
              <Button variant="outlined" onClick={() => requestOtp(loginData.target, 'email', 'login')}>Send Email OTP</Button>
              <TextField label="OTP" value={loginData.otp} onChange={(e) => setLoginData({ ...loginData, otp: e.target.value })} fullWidth />
              <Button variant="contained" disabled={loading} onClick={handleOtpLogin}>Login with OTP</Button>
            </Stack>
          )}

          {mode === 'register' && (
            <Stack spacing={2}>
              <TextField label="Name" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} fullWidth />
              <TextField label="Mobile Number" value={registerData.mobile} onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })} fullWidth />
              <TextField label="WhatsApp Number" value={registerData.whatsappNumber} onChange={(e) => setRegisterData({ ...registerData, whatsappNumber: e.target.value })} fullWidth />
              <TextField label="Email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} fullWidth />
              <TextField label="Address" value={registerData.address} onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })} fullWidth multiline minRows={2} />
              <TextField label="Password" type="password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} fullWidth />
              <TextField label="Referral Code Optional" value={registerData.referralCode} onChange={(e) => setRegisterData({ ...registerData, referralCode: e.target.value })} fullWidth />
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
              <Button variant="outlined" onClick={() => requestOtp(registerData.email, 'email', 'register')}>Send Email OTP</Button>
              <TextField label="Email OTP" value={registerData.otp} onChange={(e) => setRegisterData({ ...registerData, otp: e.target.value })} fullWidth />
              <Button variant="contained" disabled={loading} onClick={handleRegister}>Register</Button>
            </Stack>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
