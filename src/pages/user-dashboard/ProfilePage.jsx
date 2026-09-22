import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Chip,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  InputAdornment
} from '@mui/material';
import {
  Person,
  Phone,
  WhatsApp,
  Email,
  LocationOn,
  CalendarToday,
  Edit as EditIcon,
  Lock as LockIcon,
  CheckCircle,
  ArrowBack as ArrowBackIcon,
  Engineering as EngineeringIcon,
  Apartment as ApartmentIcon,
  Badge as BadgeIcon,
  ContentCopy as ContentCopyIcon,
  SupportAgent as SupportAgentIcon,
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
  CurrencyRupee as CurrencyRupeeIcon
} from '@mui/icons-material';
import api from '../../../utils/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePage() {
  const { user: authUser, setUser: setAuthUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [clientData, setClientData] = useState(null);

  // Edit Profile Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    mobile: '',
    whatsappNumber: '',
    address: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Change Password Modal
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Feedback Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Safe formatting helper to prevent .trim() or object crashes
  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') return 'Not provided';
    const str = String(value).trim();
    return str !== '' ? str : 'Not provided';
  };

  // Fetch full profile and linked client project
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/profile');
      if (res.data && res.data.success) {
        setProfileData(res.data.user);
        setClientData(res.data.client);
        if (res.data.user) {
          setEditForm({
            name: res.data.user.name || '',
            mobile: res.data.user.mobile || '',
            whatsappNumber: res.data.user.whatsappNumber || '',
            address: res.data.user.address || ''
          });
        }
      }
    } catch (err) {
      console.warn('Fallback: loading profile from auth context or client portal', err);
      // Fallback to client portal me
      try {
        const cRes = await api.get('/clients/portal/me');
        if (cRes.data && cRes.data.data) {
          setClientData(cRes.data.data.client);
        }
      } catch (cErr) {
        // Ignored
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const currentUser = profileData || authUser || {};
  const isClient = currentUser.role === 'client' || Boolean(currentUser.clientId) || Boolean(clientData);

  // Handle Edit Profile Submission
  const handleSaveProfile = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await api.put('/auth/profile', editForm);
      if (res.data && res.data.success) {
        setProfileData(res.data.user);
        if (setAuthUser) {
          setAuthUser(res.data.user);
        }
        setSnackbar({ open: true, message: 'Profile details updated successfully!', severity: 'success' });
        setEditModalOpen(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to update profile details.',
        severity: 'error'
      });
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Change Password Submission
  const handleChangePassword = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSnackbar({ open: true, message: 'New password and confirm password do not match!', severity: 'warning' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setSnackbar({ open: true, message: 'New password must be at least 6 characters long!', severity: 'warning' });
      return;
    }

    try {
      setSavingPassword(true);
      const res = await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      if (res.data && res.data.success) {
        setSnackbar({ open: true, message: 'Password changed successfully!', severity: 'success' });
        setPasswordModalOpen(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to change password. Please verify current password.',
        severity: 'error'
      });
    } finally {
      setSavingPassword(false);
    }
  };

  // Format creation date
  const memberDate = (() => {
    const raw = currentUser.createdAt || clientData?.createdAt;
    if (!raw) return 'Active Member';
    try {
      return new Date(raw).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Active Member';
    }
  })();

  // Contact items
  const cleanMobile = currentUser.mobile || clientData?.phone;
  const rawWhatsApp = currentUser.whatsappNumber || currentUser.mobile || clientData?.phone;
  const cleanWhatsAppNumber = rawWhatsApp ? String(rawWhatsApp).replace(/\D/g, '') : '';

  const profileInfo = [
    {
      icon: <Phone sx={{ color: '#F5B72E', fontSize: 22 }} />,
      label: 'Mobile Number (मोबाइल नंबर)',
      value: cleanMobile,
      link: cleanMobile ? `tel:${cleanMobile}` : null
    },
    {
      icon: <WhatsApp sx={{ color: '#25D366', fontSize: 22 }} />,
      label: 'WhatsApp Number (व्हाट्सएप)',
      value: rawWhatsApp,
      link: cleanWhatsAppNumber ? `https://wa.me/${cleanWhatsAppNumber}` : null
    },
    {
      icon: <Email sx={{ color: '#38BDF8', fontSize: 22 }} />,
      label: 'Email Address (ईमेल आईडी)',
      value: currentUser.email || clientData?.email,
      link: currentUser.email || clientData?.email ? `mailto:${currentUser.email || clientData?.email}` : null
    },
    {
      icon: <LocationOn sx={{ color: '#F43F5E', fontSize: 22 }} />,
      label: 'Address / Site Location (पता)',
      value: currentUser.address || clientData?.location,
      link: null
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10 }}>
        <CircularProgress size={44} sx={{ color: '#F5B72E' }} />
        <Typography sx={{ mt: 2, color: '#E2E8F0', fontWeight: 700 }}>
          Loading user profile & account details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* 1. TOP NAVIGATION & HEADER */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(isClient ? '/dashboard/project' : '/')}
            sx={{
              borderColor: 'rgba(245, 183, 46, 0.4)',
              color: '#F5B72E',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '8px',
              px: 1.8,
              '&:hover': {
                borderColor: '#F5B72E',
                bgcolor: 'rgba(245, 183, 46, 0.1)'
              }
            }}
          >
            {isClient ? 'Back to Construction Project (प्रोजेक्ट पर लौटें)' : 'Back to Website'}
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Phone sx={{ fontSize: 16 }} />}
            href="tel:+919416856468"
            sx={{
              color: '#94A3B8',
              borderColor: 'rgba(255, 255, 255, 0.12)',
              textTransform: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: '8px',
              '&:hover': { color: '#FFF', borderColor: '#F5B72E' }
            }}
          >
            Support: +91 9416856468
          </Button>
        </Box>
      </Box>

      {/* 2. PROFILE HERO CARD */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: '#0D1527',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
        }}
      >
        {/* Cover Gradient Banner */}
        <Box
          sx={{
            height: { xs: 100, sm: 130 },
            background: 'linear-gradient(135deg, #0B1120 0%, #17233D 55%, #3B2E05 100%)',
            position: 'relative',
            borderBottom: '1px solid rgba(245, 183, 46, 0.2)'
          }}
        />

        {/* Profile Content */}
        <Box sx={{ px: { xs: 2.5, sm: 3.5 }, pb: 3.5, pt: 0, position: 'relative' }}>
          {/* Avatar floating */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'flex-end' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mt: { xs: -6, sm: -7 },
              mb: 2.5
            }}
          >
            <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 2.5 }}>
              <Avatar
                sx={{
                  width: { xs: 85, sm: 105 },
                  height: { xs: 85, sm: 105 },
                  bgcolor: '#0F172A',
                  color: '#F5B72E',
                  border: '3.5px solid #F5B72E',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
                  fontSize: { xs: 36, sm: 46 },
                  fontWeight: 900
                }}
              >
                {(currentUser.name || clientData?.name || 'U').charAt(0).toUpperCase()}
              </Avatar>

              <Box sx={{ pt: { xs: 1, sm: 0 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#FFFFFF', fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>
                    {currentUser.name || clientData?.name || 'User Profile'}
                  </Typography>
                  <Chip
                    icon={<CheckCircle sx={{ fontSize: '15px !important', color: '#10B981 !important' }} />}
                    label={isClient ? 'VERIFIED CLIENT' : 'ACTIVE USER'}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(16, 185, 129, 0.15)',
                      color: '#10B981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontWeight: 800,
                      fontSize: '0.72rem',
                      height: 24,
                      borderRadius: '6px'
                    }}
                  />
                </Box>
                <Typography sx={{ color: '#94A3B8', fontSize: '0.85rem', mt: 0.3 }}>
                  Account ID: {currentUser.id || currentUser._id || 'N/A'} • Member since {memberDate}
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1.2, width: { xs: '100%', sm: 'auto' }, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setEditModalOpen(true)}
                sx={{
                  background: 'linear-gradient(135deg, #F5B72E 0%, #D97706 100%)',
                  color: '#0F172A',
                  fontWeight: 800,
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 2,
                  py: 0.8,
                  fontSize: '0.85rem',
                  flex: { xs: 1, sm: 'none' }
                }}
              >
                Edit Profile (एडिट)
              </Button>

              <Button
                variant="outlined"
                size="small"
                startIcon={<LockIcon />}
                onClick={() => setPasswordModalOpen(true)}
                sx={{
                  color: '#CBD5E1',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 2,
                  py: 0.8,
                  fontSize: '0.85rem',
                  flex: { xs: 1, sm: 'none' },
                  '&:hover': { borderColor: '#F5B72E', color: '#F5B72E' }
                }}
              >
                Change Password
              </Button>
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 2.5 }} />

          {/* 3. CONTACT DETAILS GRID */}
          <Grid container spacing={2.5}>
            {profileInfo.map((info, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: '#131B2E',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'rgba(245, 183, 46, 0.3)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    {info.icon}
                    <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {info.label}
                    </Typography>
                  </Box>

                  {info.link ? (
                    <Typography
                      component="a"
                      href={info.link}
                      target={info.link.startsWith('http') ? '_blank' : '_self'}
                      rel="noreferrer"
                      sx={{
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        textDecoration: 'none',
                        wordBreak: 'break-word',
                        '&:hover': { color: '#F5B72E', textDecoration: 'underline' }
                      }}
                    >
                      {formatValue(info.value)}
                    </Typography>
                  ) : (
                    <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.92rem', wordBreak: 'break-word' }}>
                      {formatValue(info.value)}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Referral Code Box (if regular user or client has code) */}
          {currentUser.referralCode && (
            <Box
              sx={{
                mt: 2.5,
                p: 2,
                borderRadius: 2.5,
                bgcolor: 'rgba(245, 183, 46, 0.08)',
                border: '1px dashed rgba(245, 183, 46, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1.5
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <BadgeIcon sx={{ color: '#F5B72E', fontSize: 24 }} />
                <Box>
                  <Typography sx={{ color: '#F5B72E', fontWeight: 800, fontSize: '0.88rem' }}>
                    Your Exclusive Referral Code (रेफरल कोड)
                  </Typography>
                  <Typography sx={{ color: '#CBD5E1', fontSize: '0.78rem' }}>
                    Share with friends or family building their homes to unlock cash rewards & discounts.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ bgcolor: '#0B1120', color: '#FFFFFF', px: 2, py: 0.6, borderRadius: '6px', fontWeight: 900, letterSpacing: '1px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {currentUser.referralCode}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => {
                    navigator.clipboard.writeText(currentUser.referralCode);
                    setSnackbar({ open: true, message: 'Referral code copied to clipboard!', severity: 'success' });
                  }}
                  sx={{ color: '#F5B72E', borderColor: '#F5B72E', textTransform: 'none', fontWeight: 700 }}
                >
                  Copy
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* 4. LINKED CONSTRUCTION PROJECT CARD (If Client) */}
      {clientData && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: 3,
            bgcolor: '#0D1527',
            border: '1px solid rgba(245, 183, 46, 0.3)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <EngineeringIcon sx={{ color: '#F5B72E', fontSize: 28 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                  Linked Construction Project (संबंधित कंस्ट्रक्शन प्रोजेक्ट)
                </Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>
                  Active project site being executed by Vishwakarma Build & Furnish
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={() => navigate('/dashboard/project')}
              sx={{
                background: 'linear-gradient(135deg, #F5B72E 0%, #D97706 100%)',
                color: '#0F172A',
                fontWeight: 800,
                textTransform: 'none',
                borderRadius: '8px',
                px: 2.5,
                py: 0.8
              }}
            >
              Open Live Site Report (लाइव रिपोर्ट देखें) →
            </Button>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600 }}>CLIENT PROJECT NAME</Typography>
              <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem' }}>{clientData.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600 }}>SITE LOCATION</Typography>
              <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem' }}>{clientData.location}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600 }}>TOTAL CONTRACT BUDGET</Typography>
              <Typography sx={{ color: '#F5B72E', fontWeight: 800, fontSize: '0.95rem' }}>
                ₹ {Number(clientData.contractAmount || 0).toLocaleString('en-IN')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600 }}>AADHAR NUMBER</Typography>
              <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem' }}>
                {clientData.aadharNo || 'Provided on File'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* 5. HELPLINE & EMERGENCY SUPPORT */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          bgcolor: '#0B1120',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SupportAgentIcon sx={{ color: '#F5B72E', fontSize: 32 }} />
          <Box>
            <Typography sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.95rem' }}>
              Need Help with your Profile or Construction Project?
            </Typography>
            <Typography sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
              Our project coordinators are available 7 days a week: 9:00 AM – 8:00 PM
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<Phone />}
            href="tel:+919416856468"
            sx={{
              bgcolor: '#131B2E',
              color: '#F5B72E',
              border: '1px solid rgba(245, 183, 46, 0.4)',
              fontWeight: 800,
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': { bgcolor: '#1a243d' }
            }}
          >
            Call Site Manager: +91 9416856468
          </Button>
        </Box>
      </Paper>

      {/* ========================================================================= */}
      {/* DIALOG 1: EDIT PROFILE MODAL */}
      {/* ========================================================================= */}
      <Dialog
        open={editModalOpen}
        onClose={() => !savingProfile && setEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0D1527',
            color: '#F5F5F5',
            border: '1.5px solid rgba(212,175,55,0.4)',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#0B1120', color: '#F5B72E', fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Edit Profile Details (प्रोफाइल अपडेट करें)</span>
          <IconButton onClick={() => setEditModalOpen(false)} disabled={savingProfile} sx={{ color: '#94A3B8' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSaveProfile}>
          <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.2 }}>
            <TextField
              label="Full Name (पूरा नाम) *"
              required
              fullWidth
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              InputLabelProps={{ sx: { color: '#94A3B8' } }}
              sx={{ '& .MuiOutlinedInput-root': { color: '#FFF', bgcolor: '#131B2E' } }}
            />

            <TextField
              label="Mobile Number (10 Digit Mobile) *"
              required
              fullWidth
              type="tel"
              value={editForm.mobile}
              onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
              InputLabelProps={{ sx: { color: '#94A3B8' } }}
              sx={{ '& .MuiOutlinedInput-root': { color: '#FFF', bgcolor: '#131B2E' } }}
            />

            <TextField
              label="WhatsApp Number (व्हाट्सएप नंबर)"
              fullWidth
              type="tel"
              value={editForm.whatsappNumber}
              onChange={(e) => setEditForm({ ...editForm, whatsappNumber: e.target.value })}
              helperText="For site construction updates and payment receipts"
              InputLabelProps={{ sx: { color: '#94A3B8' } }}
              FormHelperTextProps={{ sx: { color: '#94A3B8' } }}
              sx={{ '& .MuiOutlinedInput-root': { color: '#FFF', bgcolor: '#131B2E' } }}
            />

            <TextField
              label="Site Location / Address (पता)"
              multiline
              rows={2}
              fullWidth
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              InputLabelProps={{ sx: { color: '#94A3B8' } }}
              sx={{ '& .MuiOutlinedInput-root': { color: '#FFF', bgcolor: '#131B2E' } }}
            />
          </DialogContent>

          <DialogActions sx={{ p: 2.5, bgcolor: '#0B1120', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Button onClick={() => setEditModalOpen(false)} disabled={savingProfile} sx={{ color: '#94A3B8' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={savingProfile}
              sx={{
                background: 'linear-gradient(135deg, #F5B72E 0%, #D97706 100%)',
                color: '#0F172A',
                fontWeight: 800
              }}
            >
              {savingProfile ? 'Saving Changes...' : 'Save Profile (सेव करें)'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG 2: CHANGE PASSWORD MODAL */}
      {/* ========================================================================= */}
      <Dialog
        open={passwordModalOpen}
        onClose={() => !savingPassword && setPasswordModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0D1527',
            color: '#F5F5F5',
            border: '1.5px solid rgba(212,175,55,0.4)',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#0B1120', color: '#F5B72E', fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Change Password (पासवर्ड बदलें)</span>
          <IconButton onClick={() => setPasswordModalOpen(false)} disabled={savingPassword} sx={{ color: '#94A3B8' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleChangePassword}>
          <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.2 }}>
            <TextField
              label="Current Password (वर्तमान पासवर्ड) *"
              type={showCurrentPass ? 'text' : 'password'}
              required
              fullWidth
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              InputLabelProps={{ sx: { color: '#94A3B8' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowCurrentPass(!showCurrentPass)} edge="end" sx={{ color: '#94A3B8' }}>
                      {showCurrentPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ '& .MuiOutlinedInput-root': { color: '#FFF', bgcolor: '#131B2E' } }}
            />

            <TextField
              label="New Password (नया पासवर्ड) *"
              type={showNewPass ? 'text' : 'password'}
              required
              fullWidth
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              helperText="Minimum 6 characters"
              InputLabelProps={{ sx: { color: '#94A3B8' } }}
              FormHelperTextProps={{ sx: { color: '#94A3B8' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPass(!showNewPass)} edge="end" sx={{ color: '#94A3B8' }}>
                      {showNewPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ '& .MuiOutlinedInput-root': { color: '#FFF', bgcolor: '#131B2E' } }}
            />

            <TextField
              label="Confirm New Password (पासवर्ड पुनः दर्ज करें) *"
              type="password"
              required
              fullWidth
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              InputLabelProps={{ sx: { color: '#94A3B8' } }}
              sx={{ '& .MuiOutlinedInput-root': { color: '#FFF', bgcolor: '#131B2E' } }}
            />
          </DialogContent>

          <DialogActions sx={{ p: 2.5, bgcolor: '#0B1120', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Button onClick={() => setPasswordModalOpen(false)} disabled={savingPassword} sx={{ color: '#94A3B8' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={savingPassword}
              sx={{
                background: 'linear-gradient(135deg, #F5B72E 0%, #D97706 100%)',
                color: '#0F172A',
                fontWeight: 800
              }}
            >
              {savingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', fontWeight: 700 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
