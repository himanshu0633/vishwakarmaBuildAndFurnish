import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import KeyIcon from '@mui/icons-material/Key';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import ApartmentIcon from '@mui/icons-material/Apartment';
import brandLogo from '../assets/logo.png';
import api from '../../utils/axiosConfig';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithOtp, user } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' (password) or 'otp'
  const [loginData, setLoginData] = useState({ email: '', password: '', target: '', otp: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // If already logged in, redirect immediately to relevant dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'client' || user.clientId) {
        navigate('/dashboard/project', { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin/clients', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const requestOtp = async (target) => {
    if (!target) {
      setError('Please enter your registered email to receive an OTP.');
      return;
    }
    try {
      setOtpSending(true);
      setError('');
      setMessage('');
      const response = await api.post('/auth/request-otp', { target, channel: 'email', purpose: 'login' });
      setOtpSent(true);
      setMessage(response.data.message || `OTP sent successfully to ${target}! Please check your inbox.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to generate OTP. Please check your email address and try again.');
    } finally {
      setOtpSending(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    if (e) e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setError('Please enter both email address and password.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(loginData.email, loginData.password);
    setLoading(false);
    if (result.success) {
      if (result.user?.role === 'client' || result.user?.clientId) {
        navigate('/dashboard/project');
      } else if (result.user?.role === 'admin') {
        navigate('/admin/clients');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error || 'Invalid email or password.');
    }
  };

  const handleOtpLogin = async (e) => {
    if (e) e.preventDefault();
    if (!loginData.target || !loginData.otp) {
      setError('Please enter both email and the 6-digit OTP code.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await loginWithOtp(loginData.target, loginData.otp);
    setLoading(false);
    if (result.success) {
      if (result.user?.role === 'client' || result.user?.clientId) {
        navigate('/dashboard/project');
      } else if (result.user?.role === 'admin') {
        navigate('/admin/clients');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error || 'Invalid or expired OTP code.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#050811',
        backgroundImage: `
          radial-gradient(ellipse 90% 60% at 50% -15%, rgba(212, 175, 55, 0.15) 0%, rgba(15, 23, 42, 0) 70%),
          radial-gradient(circle at 10% 90%, rgba(180, 83, 9, 0.1) 0%, transparent 40%),
          linear-gradient(180deg, #090D16 0%, #030712 100%)
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, sm: 6 },
        px: 2,
        color: '#F8FAFC',
        position: 'relative'
      }}
    >
      {/* Top Brand Link */}
      <Box
        component={RouterLink}
        to="/"
        sx={{
          position: { xs: 'relative', sm: 'absolute' },
          top: { sm: 32 },
          left: { sm: 32 },
          mb: { xs: 3, sm: 0 },
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          color: '#94A3B8',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 600,
          px: 2,
          py: 1,
          borderRadius: '999px',
          bgcolor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease',
          '&:hover': {
            color: '#D4AF37',
            borderColor: 'rgba(212, 175, 55, 0.4)',
            bgcolor: 'rgba(212, 175, 55, 0.08)'
          }
        }}
      >
        <ArrowBackIcon sx={{ fontSize: 16 }} />
        <span>Back to Website</span>
      </Box>

      <Container maxWidth="sm" sx={{ maxWidth: { xs: '100%', sm: '560px', md: '580px' }, px: { xs: 1, sm: 0 } }}>
        {/* Main Luxury Glass Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4.5, md: 5 },
            bgcolor: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(24px)',
            border: '1.5px solid rgba(212, 175, 55, 0.45)',
            borderRadius: '24px',
            boxShadow: '0 25px 70px rgba(0,0,0,0.85), 0 0 45px rgba(212, 175, 55, 0.15)',
            color: '#F8FAFC',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Top Golden Glow Bar */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)'
            }}
          />

          {/* Logo / Brand Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              component="img"
              src={brandLogo}
              alt="Vishwakarma Build & Furnish Logo"
              sx={{
                height: { xs: 80, sm: 105 },
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
                mx: 'auto',
                mb: 1.5,
                filter: 'drop-shadow(0 8px 24px rgba(212, 175, 55, 0.35))',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.03)'
                }
              }}
            />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '20px', sm: '23px' },
                letterSpacing: '0.6px',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F59E0B 50%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.25,
                textTransform: 'uppercase'
              }}
            >
              Vishwakarma Build & Furnish
            </Typography>

            <Typography
              variant="caption"
              sx={{
                display: 'inline-block',
                color: '#D4AF37',
                fontWeight: 800,
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                mt: 0.8,
                px: 1.5,
                py: 0.3,
                borderRadius: '6px',
                bgcolor: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.25)'
              }}
            >
              Client & Customer Portal
            </Typography>

            {/* Quick Context Pill */}
            <Box
              sx={{
                mt: 2,
                p: 1.2,
                borderRadius: '10px',
                bgcolor: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.22)',
                color: '#E2E8F0',
                fontSize: '12px',
                lineHeight: 1.4
              }}
            >
              Track your live construction progress, milestones, payments & download verified slips.
            </Box>
          </Box>

          {/* Login Tabs (Password & OTP Only - Register Removed) */}
          <Tabs
            value={mode}
            onChange={(e, val) => {
              setMode(val);
              setError('');
              setMessage('');
            }}
            variant="fullWidth"
            sx={{
              mb: 3,
              bgcolor: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '12px',
              p: '4px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              minHeight: 44,
              '& .MuiTabs-indicator': {
                bgcolor: '#D4AF37',
                height: '100%',
                borderRadius: '10px',
                zIndex: 0
              }
            }}
          >
            <Tab
              value="login"
              icon={<KeyIcon sx={{ fontSize: 17 }} />}
              iconPosition="start"
              label="Password Login"
              sx={{
                minHeight: 38,
                zIndex: 1,
                fontWeight: 700,
                fontSize: '13px',
                textTransform: 'none',
                color: '#94A3B8',
                borderRadius: '10px',
                transition: 'color 0.2s ease',
                '&.Mui-selected': {
                  color: '#0F172A !important',
                  fontWeight: 800
                }
              }}
            />
            <Tab
              value="otp"
              icon={<MarkEmailReadIcon sx={{ fontSize: 17 }} />}
              iconPosition="start"
              label="Email OTP"
              sx={{
                minHeight: 38,
                zIndex: 1,
                fontWeight: 700,
                fontSize: '13px',
                textTransform: 'none',
                color: '#94A3B8',
                borderRadius: '10px',
                transition: 'color 0.2s ease',
                '&.Mui-selected': {
                  color: '#0F172A !important',
                  fontWeight: 800
                }
              }}
            />
          </Tabs>

          {/* Feedback Messages */}
          {message && (
            <Alert
              severity="success"
              sx={{
                mb: 2.5,
                bgcolor: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                color: '#86EFAC',
                fontSize: '12.5px',
                '& .MuiAlert-icon': { color: '#4ADE80' }
              }}
            >
              {message}
            </Alert>
          )}

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2.5,
                bgcolor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#FCA5A5',
                fontSize: '12.5px',
                '& .MuiAlert-icon': { color: '#F87171' }
              }}
            >
              {error}
            </Alert>
          )}

          {/* MODE 1: PASSWORD LOGIN */}
          {mode === 'login' && (
            <Box component="form" onSubmit={handlePasswordLogin}>
              <Stack spacing={2.2}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#CBD5E1', fontWeight: 600, mb: 0.8, fontSize: '12.5px' }}>
                    Email Address / User ID
                  </Typography>
                  <TextField
                    placeholder="Enter registered email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    fullWidth
                    size="medium"
                    autoComplete="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon sx={{ color: '#D4AF37', fontSize: 20 }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        transition: 'all 0.2s',
                        '& fieldset': { border: 'none' },
                        '&:hover': {
                          border: '1px solid rgba(212, 175, 55, 0.6)',
                          bgcolor: 'rgba(15, 23, 42, 0.85)'
                        },
                        '&.Mui-focused': {
                          border: '1.5px solid #D4AF37',
                          boxShadow: '0 0 12px rgba(212, 175, 55, 0.25)'
                        }
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#CBD5E1', fontWeight: 600, mb: 0.8, fontSize: '12.5px' }}>
                    Password
                  </Typography>
                  <TextField
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    fullWidth
                    size="medium"
                    autoComplete="current-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ color: '#D4AF37', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#94A3B8' }}
                          >
                            {showPassword ? <VisibilityOff sx={{ fontSize: 19 }} /> : <Visibility sx={{ fontSize: 19 }} />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        transition: 'all 0.2s',
                        '& fieldset': { border: 'none' },
                        '&:hover': {
                          border: '1px solid rgba(212, 175, 55, 0.6)',
                          bgcolor: 'rgba(15, 23, 42, 0.85)'
                        },
                        '&.Mui-focused': {
                          border: '1.5px solid #D4AF37',
                          boxShadow: '0 0 12px rgba(212, 175, 55, 0.25)'
                        }
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.8, fontSize: '11px' }}>
                    🔑 Credentials were sent to your email by Vishwakarma Build & Furnish
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                  sx={{
                    mt: 1,
                    py: 1.4,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #B45309 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '14.5px',
                    letterSpacing: '0.4px',
                    textTransform: 'none',
                    boxShadow: '0 8px 25px rgba(212, 175, 55, 0.35)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #E2C044 0%, #C26309 100%)',
                      boxShadow: '0 10px 30px rgba(212, 175, 55, 0.5)',
                      transform: 'translateY(-1px)'
                    },
                    '&:disabled': {
                      background: 'rgba(212, 175, 55, 0.3)',
                      color: 'rgba(255, 255, 255, 0.5)'
                    }
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={18} sx={{ color: '#FFFFFF' }} />
                      <span>Logging in...</span>
                    </Box>
                  ) : (
                    'Login to Portal →'
                  )}
                </Button>
              </Stack>
            </Box>
          )}

          {/* MODE 2: EMAIL OTP LOGIN */}
          {mode === 'otp' && (
            <Box component="form" onSubmit={handleOtpLogin}>
              <Stack spacing={2.2}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#CBD5E1', fontWeight: 600, mb: 0.8, fontSize: '12.5px' }}>
                    Registered Email
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      placeholder="Enter registered email"
                      value={loginData.target}
                      onChange={(e) => setLoginData({ ...loginData, target: e.target.value })}
                      fullWidth
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon sx={{ color: '#D4AF37', fontSize: 20 }} />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(15, 23, 42, 0.7)',
                          borderRadius: '12px',
                          color: '#FFFFFF',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          '& fieldset': { border: 'none' },
                          '&:hover': { border: '1px solid rgba(212, 175, 55, 0.6)' },
                          '&.Mui-focused': { border: '1.5px solid #D4AF37' }
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      disabled={otpSending || !loginData.target}
                      onClick={() => requestOtp(loginData.target)}
                      sx={{
                        px: 2,
                        minWidth: 105,
                        borderRadius: '12px',
                        borderColor: '#D4AF37',
                        color: '#FACC15',
                        fontWeight: 700,
                        fontSize: '12px',
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: '#F59E0B',
                          bgcolor: 'rgba(212, 175, 55, 0.1)'
                        },
                        '&:disabled': {
                          borderColor: 'rgba(255, 255, 255, 0.15)',
                          color: 'rgba(255, 255, 255, 0.3)'
                        }
                      }}
                    >
                      {otpSending ? <CircularProgress size={16} sx={{ color: '#D4AF37' }} /> : (otpSent ? 'Resend' : 'Get OTP')}
                    </Button>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#CBD5E1', fontWeight: 600, mb: 0.8, fontSize: '12.5px' }}>
                    Enter 6-Digit OTP Code
                  </Typography>
                  <TextField
                    placeholder="e.g. 481920"
                    value={loginData.otp}
                    onChange={(e) => setLoginData({ ...loginData, otp: e.target.value })}
                    fullWidth
                    size="medium"
                    inputProps={{
                      maxLength: 6,
                      style: { letterSpacing: '4px', textAlign: 'center', fontSize: '18px', fontWeight: 700 }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        borderRadius: '12px',
                        color: '#FACC15',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        '& fieldset': { border: 'none' },
                        '&:hover': { border: '1px solid rgba(212, 175, 55, 0.6)' },
                        '&.Mui-focused': { border: '1.5px solid #D4AF37' }
                      }
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !loginData.otp}
                  fullWidth
                  sx={{
                    mt: 1,
                    py: 1.4,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #B45309 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '14.5px',
                    letterSpacing: '0.4px',
                    textTransform: 'none',
                    boxShadow: '0 8px 25px rgba(212, 175, 55, 0.35)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #E2C044 0%, #C26309 100%)',
                      boxShadow: '0 10px 30px rgba(212, 175, 55, 0.5)'
                    },
                    '&:disabled': {
                      background: 'rgba(212, 175, 55, 0.3)',
                      color: 'rgba(255, 255, 255, 0.5)'
                    }
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={18} sx={{ color: '#FFFFFF' }} />
                      <span>Verifying...</span>
                    </Box>
                  ) : (
                    'Verify & Login →'
                  )}
                </Button>
              </Stack>
            </Box>
          )}

          {/* Support Helpline Footer */}
          <Box
            sx={{
              mt: 3.5,
              pt: 2.5,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'center'
            }}
          >
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
              Need help accessing your client portal?
            </Typography>
            <Box
              component="a"
              href="tel:+919416856468"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.8,
                color: '#D4AF37',
                textDecoration: 'none',
                fontSize: '12.5px',
                fontWeight: 700,
                '&:hover': { textDecoration: 'underline', color: '#F59E0B' }
              }}
            >
              <PhoneIcon sx={{ fontSize: 14 }} />
              <span>Call Helpline: +91 9416856468</span>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
