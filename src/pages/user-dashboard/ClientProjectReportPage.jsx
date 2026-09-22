import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse
} from '@mui/material';
import {
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  ReceiptLong as ReceiptIcon,
  AccountBalanceWallet as WalletIcon,
  Engineering as EngineeringIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  Print as PrintIcon,
  Verified as VerifiedIcon,
  ZoomIn as ZoomInIcon,
  Apartment as ApartmentIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Videocam as VideocamIcon,
  Image as ImageIcon,
  PlayCircle as PlayCircleIcon,
  CalendarToday as CalendarIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  LocalOffer as TagIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
  CurrencyRupee as CurrencyRupeeIcon
} from '@mui/icons-material';
import api, { getStaticAssetUrl, getFallbackAssetUrl } from '../../../utils/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';
import PaymentSlipModal from '../../components/admin/PaymentSlipModal';

const ClientProjectReportPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0); // 0: Steps, 1: Media, 2: Payments, 3: Agreement

  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Expanded milestones state (first milestone open by default)
  const [expandedSteps, setExpandedSteps] = useState({ 0: true });

  const toggleStep = (idx) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Site Media filter and preview state
  const [mediaFilter, setMediaFilter] = useState('all'); // 'all', 'image', 'video'
  const [selectedPhotoForModal, setSelectedPhotoForModal] = useState(null);

  // Payment Slip state
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [slipModalOpen, setSlipModalOpen] = useState(false);

  // Agreement Lightbox state
  const [agreementModalOpen, setAgreementModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fetchProjectReport = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/clients/portal/me');
      if (res.data && res.data.data) {
        setProjectData(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching client project report:', err);
      setError(
        err.response?.data?.message ||
          'No active construction project was found linked to your account. If you are an existing client, please contact your project manager or administrator.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectReport();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 12 }}>
        <CircularProgress size={46} sx={{ color: '#D4AF37' }} />
        <Typography sx={{ mt: 2.5, color: '#E2E8F0', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.5px' }}>
          Loading your construction project dashboard...
        </Typography>
        <Typography variant="caption" sx={{ color: '#94A3B8', mt: 0.5 }}>
          Fetching real-time site milestones, verified slips and accounts
        </Typography>
      </Box>
    );
  }

  if (error || !projectData || !projectData.client) {
    return (
      <Paper
        sx={{
          p: { xs: 3, sm: 5 },
          bgcolor: 'rgba(15, 23, 42, 0.95)',
          border: '1.5px solid rgba(212, 175, 55, 0.35)',
          borderRadius: 3,
          textAlign: 'center',
          maxWidth: 680,
          mx: 'auto',
          my: 4,
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
        }}
      >
        <ApartmentIcon sx={{ fontSize: 52, color: '#D4AF37', mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#FFFFFF', mb: 1 }}>
          Client Project Portal
        </Typography>
        <Typography sx={{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: 1.6, mb: 3 }}>
          {error || 'No active construction project is linked with this account yet. Please contact Vishwakarma Build & Furnish support to connect your on-site project.'}
        </Typography>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5
          }}
        >
          <PhoneIcon sx={{ color: '#D4AF37' }} />
          <Typography sx={{ fontWeight: 800, color: '#FACC15', fontSize: '1rem' }}>
            Helpline: +91 9416856468 / +91 9812739343
          </Typography>
        </Box>
      </Paper>
    );
  }

  const { client, financials, steps, payments } = projectData;
  const siteMedia = client.siteMedia || [];
  const imagesCount = siteMedia.filter((m) => m.mediaType === 'image').length;
  const videosCount = siteMedia.filter((m) => m.mediaType === 'video').length;
  const filteredMedia = siteMedia.filter((m) =>
    mediaFilter === 'all' ? true : m.mediaType === mediaFilter
  );
  const progressPct = client.progressPercentage || 0;

  // Check if agreement is a PDF document
  const isAgreementPdf = Boolean(client.agreementImage && /\.pdf(\?.*)?$/i.test(client.agreementImage));

  // Resolve agreement image / PDF URL with fallbacks
  const getResolvedAgreementUrl = () => {
    if (!client.agreementImage) return '';
    const raw = client.agreementImage.trim();
    if (/^https?:\/\//i.test(raw)) return raw;
    const staticUrl = getStaticAssetUrl(raw);
    return staticUrl;
  };

  const agreementUrl = getResolvedAgreementUrl();

  const handleImageError = (e) => {
    if (!imageError) {
      setImageError(true);
      const fallback = getFallbackAssetUrl(client.agreementImage);
      if (fallback && e.target.src !== fallback) {
        e.target.src = fallback;
      }
    }
  };

  const formatSiteDate = (dateVal) => {
    if (!dateVal) return null;
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return null;
    }
  };

  const startDateFormatted = formatSiteDate(client.startDate || client.createdAt);
  const endDateFormatted = formatSiteDate(client.expectedEndDate || client.completionDate || client.targetDate);

  const contractAmount = Number(financials?.contractAmount || client.contractAmount || 0);
  const totalPaid = Number(financials?.totalPaid || 0);
  const paidPct = contractAmount > 0 ? Math.round((totalPaid / contractAmount) * 100) : 0;
  const remainingBalance = Number(financials?.remainingBalance ?? (contractAmount - totalPaid));
  const serviceRate = financials?.serviceRate || client.serviceRate;
  const serviceRateUnit = financials?.serviceRateUnit || client.serviceRateUnit || (Number(serviceRate) > 0 ? 'Agreed rate unit' : 'Included in Total Budget');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* 0. TOP MOBILE HEADER: Hamburger + Title + Back to Website */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              bgcolor: '#131B2E',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              p: 1,
              '&:hover': { bgcolor: '#1E293B' }
            }}
          >
            <MenuIcon sx={{ fontSize: 22 }} />
          </IconButton>
          <Typography sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: { xs: '1.2rem', sm: '1.35rem' }, letterSpacing: '-0.3px' }}>
            Client Dashboard
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon sx={{ fontSize: '18px !important' }} />}
          onClick={() => navigate('/')}
          sx={{
            color: '#F5B72E',
            borderColor: 'rgba(245, 183, 46, 0.4)',
            bgcolor: 'rgba(245, 183, 46, 0.05)',
            borderRadius: '24px',
            px: { xs: 1.8, sm: 2.5 },
            py: 0.8,
            fontSize: { xs: '0.78rem', sm: '0.85rem' },
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: 'none',
            whiteSpace: 'nowrap',
            '&:hover': {
              borderColor: '#F5B72E',
              bgcolor: 'rgba(245, 183, 46, 0.15)'
            }
          }}
        >
          Back to Website
        </Button>
      </Box>

      {/* NAVIGATION DRAWER (CLIPPED BENEATH WEBSITE HEADER) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          zIndex: 1200
        }}
        ModalProps={{
          sx: {
            zIndex: 1200,
            top: { xs: '104px', sm: '112px', md: '144px' },
            '& .MuiBackdrop-root': {
              top: { xs: '104px', sm: '112px', md: '144px' }
            }
          }
        }}
        PaperProps={{
          sx: {
            width: { xs: 290, sm: 320 },
            top: { xs: '104px', sm: '112px', md: '144px' },
            height: {
              xs: 'calc(100vh - 104px)',
              sm: 'calc(100vh - 112px)',
              md: 'calc(100vh - 144px)'
            },
            bgcolor: '#0B1120',
            color: '#FFFFFF',
            borderRight: '1px solid rgba(245, 183, 46, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 2.5,
            boxShadow: '10px 0 30px rgba(0,0,0,0.7)'
          }
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2, mb: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Box>
              <Typography sx={{ fontWeight: 900, color: '#F5B72E', fontSize: '1.05rem', letterSpacing: '0.3px' }}>
                Vishwakarma
              </Typography>
              <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600 }}>
                Build & Furnish Portal
              </Typography>
            </Box>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#94A3B8', '&:hover': { color: '#FFF' } }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.04)', borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.08)', mb: 2.5 }}>
            <Typography sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.9rem' }}>
              {user?.name || client.name}
            </Typography>
            <Typography sx={{ color: '#94A3B8', fontSize: '0.78rem' }}>
              {client.phone ? `+91 ${client.phone}` : (user?.email || 'Verified Client')}
            </Typography>
          </Box>

          <List sx={{ p: 0 }}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate('/dashboard/project');
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  bgcolor: 'rgba(245, 183, 46, 0.15)',
                  border: '1px solid rgba(245, 183, 46, 0.35)',
                  color: '#F5B72E'
                }}
              >
                <ListItemIcon sx={{ color: '#F5B72E', minWidth: 38 }}>
                  <EngineeringIcon />
                </ListItemIcon>
                <ListItemText
                  primary="My Project (मेरा प्रोजेक्ट)"
                  primaryTypographyProps={{ fontWeight: 800, fontSize: '0.88rem' }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate('/dashboard/profile');
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  color: '#CBD5E1',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF' }
                }}
              >
                <ListItemIcon sx={{ color: '#94A3B8', minWidth: 38 }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary="My Profile & Details"
                  primaryTypographyProps={{ fontWeight: 700, fontSize: '0.88rem' }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate('/');
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  color: '#CBD5E1',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF' }
                }}
              >
                <ListItemIcon sx={{ color: '#94A3B8', minWidth: 38 }}>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Back to Website (मुख्य वेबसाइट)"
                  primaryTypographyProps={{ fontWeight: 700, fontSize: '0.88rem' }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  if (logout) logout();
                  setDrawerOpen(false);
                  navigate('/login');
                }}
                sx={{
                  borderRadius: 2,
                  color: '#F87171',
                  '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }
                }}
              >
                <ListItemIcon sx={{ color: '#F87171', minWidth: 38 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Logout (लॉगआउट)"
                  primaryTypographyProps={{ fontWeight: 700, fontSize: '0.88rem' }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        <Box sx={{ pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Typography sx={{ color: '#94A3B8', fontSize: '0.72rem', fontWeight: 600, mb: 0.5 }}>
            Project Site Support & Helpline
          </Typography>
          <Typography sx={{ color: '#F5B72E', fontSize: '0.8rem', fontWeight: 800 }}>
            +91 9416856468 / +91 9812739343
          </Typography>
        </Box>
      </Drawer>

      {/* 1. HERO PROJECT BANNER */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.2, sm: 3 },
          background: 'radial-gradient(ellipse at top right, rgba(30, 41, 59, 0.7) 0%, #0D1527 65%, #0A0F1D 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Luxury Villa Watermark Background on Right */}
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: { xs: '100%', md: '55%' },
            backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Watermark Cursive Text */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 12, md: 20 },
            right: { xs: 16, md: 32 },
            fontFamily: '"Playfair Display", "Dancing Script", cursive, "Brush Script MT", Georgia, serif',
            fontStyle: 'italic',
            fontSize: { xs: '1.1rem', sm: '1.4rem', md: '1.8rem' },
            color: 'rgba(255, 255, 255, 0.2)',
            letterSpacing: '1px',
            userSelect: 'none',
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          Building Your Dreams Together~
        </Box>

        <Box sx={{ position: 'relative', zIndex: 2 }}>
          {/* Badges */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.2, flexWrap: 'wrap' }}>
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: '#10B981 !important', ml: 0.5 }} />}
              label="VERIFIED CLIENT"
              size="small"
              sx={{
                bgcolor: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontWeight: 800,
                fontSize: '0.7rem',
                letterSpacing: '0.5px'
              }}
            />
            <Chip
              label={client.status ? client.status.toUpperCase() : 'IN PROGRESS'}
              size="small"
              sx={{
                bgcolor: client.status === 'completed' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                color: client.status === 'completed' ? '#4ADE80' : '#3B82F6',
                border: `1px solid ${client.status === 'completed' ? 'rgba(74, 222, 128, 0.35)' : 'rgba(59, 130, 246, 0.35)'}`,
                fontWeight: 800,
                fontSize: '0.7rem'
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#FFFFFF',
              fontSize: { xs: '1.5rem', sm: '1.9rem' },
              lineHeight: 1.2,
              mb: 0.6
            }}
          >
            {client.name}’s Site Dashboard
          </Typography>

          {/* Subtitle */}
          <Typography sx={{ color: '#94A3B8', fontSize: '0.85rem', mb: 1.8 }}>
            Track your construction progress, milestones and everything in one place.
          </Typography>

          {/* Site Metadata Badges: location & phone */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {client.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, bgcolor: 'rgba(255,255,255,0.04)', px: 1.2, py: 0.5, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <LocationIcon sx={{ fontSize: 15, color: '#F5B72E' }} />
                <Typography sx={{ color: '#CBD5E1', fontSize: '0.8rem' }}>{client.location}</Typography>
              </Box>
            )}
            {client.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, bgcolor: 'rgba(255,255,255,0.04)', px: 1.2, py: 0.5, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <PhoneIcon sx={{ fontSize: 15, color: '#F5B72E' }} />
                <Typography sx={{ color: '#CBD5E1', fontSize: '0.8rem' }}>+91 {client.phone}</Typography>
              </Box>
            )}
            {client.aadharNo && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, bgcolor: 'rgba(255,255,255,0.04)', px: 1.2, py: 0.5, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Typography sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>Aadhaar:</Typography>
                <Typography sx={{ color: '#CBD5E1', fontWeight: 700, fontSize: '0.8rem' }}>{client.aadharNo}</Typography>
              </Box>
            )}
          </Box>

          {/* Scope Row if categories/services exist in DB */}
          {((client.categories && client.categories.length > 0) || (client.services && client.services.length > 0)) && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, alignItems: 'center', mb: 2 }}>
              <Typography sx={{ color: '#F5B72E', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.5px' }}>
                Scope:
              </Typography>
              {client.categories &&
                client.categories.map((cat, i) => (
                  <Chip
                    key={i}
                    label={`${typeof cat === 'object' ? (cat.emoji || '🏗️') : '🏗️'} ${typeof cat === 'object' ? cat.name : cat}`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(245, 183, 46, 0.1)',
                      color: '#F5B72E',
                      fontWeight: 800,
                      border: '1px solid rgba(245, 183, 46, 0.35)',
                      fontSize: '0.72rem'
                    }}
                  />
                ))}
              {client.services &&
                client.services.map((s, i) => (
                  <Chip
                    key={i}
                    label={typeof s === 'object' ? (s.name || s.title) : s}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.05)',
                      color: '#CBD5E1',
                      fontSize: '0.72rem',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}
                  />
                ))}
            </Box>
          )}

          {/* Project Start & Expected Completion Cards INSIDE HERO at Bottom (2-column grid) */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, pt: 0.5 }}>
            {/* Project Start Date */}
            <Box
              sx={{
                bgcolor: 'rgba(11, 18, 33, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.2
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '8px',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94A3B8',
                  flexShrink: 0
                }}
              >
                <CalendarIcon sx={{ fontSize: 16 }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.64rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Project Start
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#FFFFFF', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {startDateFormatted || 'Active'}
                </Typography>
              </Box>
            </Box>

            {/* Expected Completion Date */}
            <Box
              sx={{
                bgcolor: 'rgba(11, 18, 33, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.2
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '8px',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94A3B8',
                  flexShrink: 0
                }}
              >
                <CalendarIcon sx={{ fontSize: 16 }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.64rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Expected Completion
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#FFFFFF', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {endDateFormatted || 'On Schedule'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* 2. TWO STACKED CARDS: LIVE PROGRESS + SITE AGREEMENT */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Card 1: Live Construction Progress */}
        <Box
          sx={{
            p: 2,
            bgcolor: '#0D1527',
            borderRadius: '14px',
            border: '1px solid rgba(245, 183, 46, 0.25)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.35)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: 'rgba(245, 183, 46, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5B72E' }}>
                <EngineeringIcon sx={{ fontSize: 17 }} />
              </Box>
              <Typography sx={{ fontWeight: 800, color: '#F5B72E', fontSize: '0.8rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Live Construction Progress
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 900, color: '#F5B72E', fontSize: '1.45rem', lineHeight: 1 }}>
              {progressPct}%
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progressPct}
            sx={{
              height: 9,
              borderRadius: 5,
              bgcolor: 'rgba(255,255,255,0.08)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #F5B72E 0%, #EAB308 100%)',
                borderRadius: 5
              }
            }}
          />

          <Typography sx={{ color: '#94A3B8', fontSize: '0.74rem', mt: 0.9 }}>
            Verified by on-site milestone inspection checkpoints
          </Typography>
        </Box>

        {/* Card 2: View Signed Site Agreement */}
        <Box
          onClick={() => {
            setActiveTab(3);
            if (client.agreementImage) {
              setAgreementModalOpen(true);
            }
          }}
          sx={{
            p: 1.8,
            bgcolor: '#0D1527',
            borderRadius: '14px',
            border: '1px solid rgba(245, 183, 46, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
            '&:hover': {
              borderColor: '#F5B72E',
              bgcolor: 'rgba(17, 27, 49, 0.95)'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: 'rgba(245, 183, 46, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F5B72E'
              }}
            >
              <DescriptionIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.9rem' }}>
                View Signed Site Agreement
              </Typography>
              <Typography sx={{ color: '#F5B72E', fontSize: '0.74rem', fontWeight: 600 }}>
                (साइट एग्रीमेंट)
              </Typography>
            </Box>
          </Box>
          <ChevronRightIcon sx={{ color: '#F5B72E', fontSize: 22 }} />
        </Box>
      </Box>

      {/* 3. FINANCIAL OVERVIEW CARDS (PERFECT 2x2 GRID ON MOBILE, 4x1 ON DESKTOP) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: { xs: 1.2, sm: 1.5 }
        }}
      >
        {/* Card 1: Total Contract Budget */}
        <Card
          elevation={0}
          sx={{
            bgcolor: '#0D1527',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            p: { xs: 1.5, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: 0,
            overflow: 'hidden',
            transition: 'transform 0.2s ease, border-color 0.2s ease',
            '&:hover': { borderColor: 'rgba(245, 183, 46, 0.4)' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1, gap: 0.5 }}>
            <Typography sx={{ color: '#94A3B8', fontWeight: 800, fontSize: { xs: '0.62rem', sm: '0.72rem' }, textTransform: 'uppercase', letterSpacing: '0.4px', lineHeight: 1.25, minWidth: 0 }}>
              Total Contract Budget
            </Typography>
            <Box sx={{ width: { xs: 26, sm: 30 }, height: { xs: 26, sm: 30 }, borderRadius: '50%', bgcolor: 'rgba(245, 183, 46, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5B72E', flexShrink: 0 }}>
              <CurrencyRupeeIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
            </Box>
          </Box>
          <Typography sx={{ fontWeight: 900, color: '#FFFFFF', fontSize: { xs: '1.15rem', sm: '1.5rem' }, mb: 0.3, letterSpacing: '-0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
            ₹ {Number(contractAmount).toLocaleString('en-IN')}
          </Typography>
          <Typography sx={{ color: '#94A3B8', fontSize: { xs: '0.68rem', sm: '0.72rem' }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Agreed contract value
          </Typography>
        </Card>

        {/* Card 2: Total Amount Paid */}
        <Card
          elevation={0}
          sx={{
            bgcolor: '#0D1527',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            p: { xs: 1.5, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: 0,
            overflow: 'hidden',
            transition: 'transform 0.2s ease, border-color 0.2s ease',
            '&:hover': { borderColor: 'rgba(34, 197, 94, 0.4)' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1, gap: 0.5 }}>
            <Typography sx={{ color: '#94A3B8', fontWeight: 800, fontSize: { xs: '0.62rem', sm: '0.72rem' }, textTransform: 'uppercase', letterSpacing: '0.4px', lineHeight: 1.25, minWidth: 0 }}>
              Total Amount Paid
            </Typography>
            <Box sx={{ width: { xs: 26, sm: 30 }, height: { xs: 26, sm: 30 }, borderRadius: '50%', bgcolor: 'rgba(34, 197, 94, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E', flexShrink: 0 }}>
              <CheckCircleIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
            </Box>
          </Box>
          <Typography sx={{ fontWeight: 900, color: '#22C55E', fontSize: { xs: '1.15rem', sm: '1.5rem' }, mb: 0.3, letterSpacing: '-0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
            ₹ {Number(totalPaid).toLocaleString('en-IN')}
          </Typography>
          <Typography sx={{ color: '#94A3B8', fontSize: { xs: '0.68rem', sm: '0.72rem' }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {paidPct}% of payment received
          </Typography>
        </Card>

        {/* Card 3: Remaining Balance Due */}
        <Card
          elevation={0}
          sx={{
            bgcolor: '#0D1527',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            p: { xs: 1.5, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: 0,
            overflow: 'hidden',
            transition: 'transform 0.2s ease, border-color 0.2s ease',
            '&:hover': { borderColor: 'rgba(239, 68, 68, 0.4)' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1, gap: 0.5 }}>
            <Typography sx={{ color: '#94A3B8', fontWeight: 800, fontSize: { xs: '0.62rem', sm: '0.72rem' }, textTransform: 'uppercase', letterSpacing: '0.4px', lineHeight: 1.25, minWidth: 0 }}>
              Remaining Balance Due
            </Typography>
            <Box sx={{ width: { xs: 26, sm: 30 }, height: { xs: 26, sm: 30 }, borderRadius: '50%', bgcolor: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', flexShrink: 0 }}>
              <PersonIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
            </Box>
          </Box>
          <Typography sx={{ fontWeight: 900, color: '#EF4444', fontSize: { xs: '1.15rem', sm: '1.5rem' }, mb: 0.3, letterSpacing: '-0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
            ₹ {Number(remainingBalance).toLocaleString('en-IN')}
          </Typography>
          <Typography sx={{ color: '#94A3B8', fontSize: { xs: '0.68rem', sm: '0.72rem' }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Due across upcoming steps
          </Typography>
        </Card>

        {/* Card 4: Agreed Work Rate */}
        <Card
          elevation={0}
          sx={{
            bgcolor: '#0D1527',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            p: { xs: 1.5, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: 0,
            overflow: 'hidden',
            transition: 'transform 0.2s ease, border-color 0.2s ease',
            '&:hover': { borderColor: 'rgba(59, 130, 246, 0.4)' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1, gap: 0.5 }}>
            <Typography sx={{ color: '#94A3B8', fontWeight: 800, fontSize: { xs: '0.62rem', sm: '0.72rem' }, textTransform: 'uppercase', letterSpacing: '0.4px', lineHeight: 1.25, minWidth: 0 }}>
              Agreed Work Rate
            </Typography>
            <Box sx={{ width: { xs: 26, sm: 30 }, height: { xs: 26, sm: 30 }, borderRadius: '50%', bgcolor: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', flexShrink: 0 }}>
              <TagIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
            </Box>
          </Box>
          <Typography sx={{ fontWeight: 900, color: '#38BDF8', fontSize: { xs: '1.15rem', sm: '1.5rem' }, mb: 0.3, letterSpacing: '-0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
            {Number(serviceRate) > 0 ? `₹ ${Number(serviceRate).toLocaleString('en-IN')}` : 'Included'}
          </Typography>
          <Typography sx={{ color: '#94A3B8', fontSize: { xs: '0.68rem', sm: '0.72rem' }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {serviceRateUnit}
          </Typography>
        </Card>
      </Box>

      {/* 4. FREESTANDING NAVIGATION TAB PILLS (HORIZONTAL SCROLLABLE) */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          flexWrap: 'nowrap',
          pb: 0.5,
          pt: 0.5,
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <Button
          onClick={() => setActiveTab(0)}
          startIcon={<EngineeringIcon sx={{ fontSize: '17px !important', color: activeTab === 0 ? '#111827' : '#F5B72E' }} />}
          sx={{
            bgcolor: activeTab === 0 ? '#F5B72E' : '#0D1527',
            color: activeTab === 0 ? '#111827' : '#CBD5E1',
            border: activeTab === 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '30px',
            px: { xs: 1.8, sm: 2.2 },
            py: { xs: 0.7, sm: 0.85 },
            fontWeight: 800,
            fontSize: { xs: '0.76rem', sm: '0.82rem' },
            textTransform: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            lineHeight: 1.2,
            boxShadow: activeTab === 0 ? '0 4px 15px rgba(245, 183, 46, 0.35)' : 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: activeTab === 0 ? '#EAB308' : 'rgba(30, 41, 59, 0.8)',
              color: activeTab === 0 ? '#000000' : '#FFFFFF'
            }
          }}
        >
          <Box sx={{ textAlign: 'left' }}>
            <div>Construction Steps</div>
            <div style={{ fontSize: '0.65rem', opacity: activeTab === 0 ? 0.9 : 0.7 }}>(चरण)</div>
          </Box>
        </Button>

        <Button
          onClick={() => setActiveTab(1)}
          startIcon={<PhotoLibraryIcon sx={{ fontSize: '17px !important', color: activeTab === 1 ? '#111827' : '#F5B72E' }} />}
          sx={{
            bgcolor: activeTab === 1 ? '#F5B72E' : '#0D1527',
            color: activeTab === 1 ? '#111827' : '#CBD5E1',
            border: activeTab === 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '30px',
            px: { xs: 1.8, sm: 2.2 },
            py: { xs: 0.7, sm: 0.85 },
            fontWeight: 800,
            fontSize: { xs: '0.76rem', sm: '0.82rem' },
            textTransform: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            boxShadow: activeTab === 1 ? '0 4px 15px rgba(245, 183, 46, 0.35)' : 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: activeTab === 1 ? '#EAB308' : 'rgba(30, 41, 59, 0.8)',
              color: activeTab === 1 ? '#000000' : '#FFFFFF'
            }
          }}
        >
          Photos ({siteMedia.length})
        </Button>

        <Button
          onClick={() => setActiveTab(2)}
          startIcon={<ReceiptIcon sx={{ fontSize: '17px !important', color: activeTab === 2 ? '#111827' : '#F5B72E' }} />}
          sx={{
            bgcolor: activeTab === 2 ? '#F5B72E' : '#0D1527',
            color: activeTab === 2 ? '#111827' : '#CBD5E1',
            border: activeTab === 2 ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '30px',
            px: { xs: 1.8, sm: 2.2 },
            py: { xs: 0.7, sm: 0.85 },
            fontWeight: 800,
            fontSize: { xs: '0.76rem', sm: '0.82rem' },
            textTransform: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            boxShadow: activeTab === 2 ? '0 4px 15px rgba(245, 183, 46, 0.35)' : 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: activeTab === 2 ? '#EAB308' : 'rgba(30, 41, 59, 0.8)',
              color: activeTab === 2 ? '#000000' : '#FFFFFF'
            }
          }}
        >
          Payments ({payments.length})
        </Button>

        <Button
          onClick={() => setActiveTab(3)}
          startIcon={<DescriptionIcon sx={{ fontSize: '17px !important', color: activeTab === 3 ? '#111827' : '#F5B72E' }} />}
          sx={{
            bgcolor: activeTab === 3 ? '#F5B72E' : '#0D1527',
            color: activeTab === 3 ? '#111827' : '#CBD5E1',
            border: activeTab === 3 ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '30px',
            px: { xs: 1.8, sm: 2.2 },
            py: { xs: 0.7, sm: 0.85 },
            fontWeight: 800,
            fontSize: { xs: '0.76rem', sm: '0.82rem' },
            textTransform: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            boxShadow: activeTab === 3 ? '0 4px 15px rgba(245, 183, 46, 0.35)' : 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: activeTab === 3 ? '#EAB308' : 'rgba(30, 41, 59, 0.8)',
              color: activeTab === 3 ? '#000000' : '#FFFFFF'
            }
          }}
        >
          Agreement (एग्रीमेंट)
        </Button>
      </Box>

      {/* 5. TAB CONTENT AREA */}
      <Box>
        {/* TAB 0: STEPS & CHECKPOINTS */}
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: { xs: '1.05rem', sm: '1.25rem' }, lineHeight: 1.2 }}>
                  Milestone Construction Stages
                </Typography>
                <Typography sx={{ color: '#F5B72E', fontSize: '0.78rem', fontWeight: 600 }}>
                  (माइलस्टोन निर्माण के चरण)
                </Typography>
              </Box>
              <Chip
                label={`Total ${steps.length} Milestones`}
                size="small"
                sx={{
                  bgcolor: 'rgba(245, 183, 46, 0.12)',
                  color: '#F5B72E',
                  border: '1px solid rgba(245, 183, 46, 0.3)',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  borderRadius: '8px'
                }}
              />
            </Box>

            {steps.length === 0 ? (
              <Box
                sx={{
                  p: 5,
                  textAlign: 'center',
                  bgcolor: '#0D1527',
                  border: '1.5px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: 3
                }}
              >
                <EngineeringIcon sx={{ fontSize: 44, color: '#F5B72E', mb: 1.5 }} />
                <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800, mb: 0.5 }}>
                  No Construction Milestones Created Yet
                </Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: '0.85rem', maxWidth: 450, mx: 'auto' }}>
                  Your site supervisor will set up construction milestones and checkpoints as work progresses.
                </Typography>
              </Box>
            ) : (
              steps.map((step, idx) => {
                const totalPts = step.points ? step.points.length : 0;
                const completedPts = step.points ? step.points.filter((p) => p.completed).length : (step.completed ? 1 : 0);
                const isExpanded = Boolean(expandedSteps[idx]);

                return (
                  <Paper
                    key={step._id || idx}
                    elevation={0}
                    sx={{
                      bgcolor: '#0D1527',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s ease',
                      '&:hover': {
                        borderColor: 'rgba(245, 183, 46, 0.4)'
                      }
                    }}
                  >
                    {/* Header Row (Clickable Accordion Trigger) */}
                    <Box
                      onClick={() => toggleStep(idx)}
                      sx={{
                        p: { xs: 1.8, sm: 2.2 },
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 1.5,
                        userSelect: 'none',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' }
                      }}
                    >
                      {/* Left: Step Number Circle + Title */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            bgcolor: '#F5B72E',
                            color: '#111827',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: '1.05rem',
                            boxShadow: '0 3px 10px rgba(245, 183, 46, 0.25)',
                            flexShrink: 0
                          }}
                        >
                          {idx + 1}
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.95rem', lineHeight: 1.3 }}>
                            Step {idx + 1}: {step.title}
                          </Typography>
                          <Typography sx={{ color: '#94A3B8', fontSize: '0.76rem', mt: 0.2 }}>
                            {completedPts} of {totalPts} checkpoints completed
                          </Typography>
                        </Box>
                      </Box>

                      {/* Right: Badges & Expand Chevron */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 0.8, width: { xs: '100%', sm: 'auto' }, pl: { xs: 6.2, sm: 0 } }}>
                        {/* Top row badges */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap' }}>
                          <Chip
                            label={`${step.percentage || 0}%`}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(245, 183, 46, 0.12)',
                              color: '#F5B72E',
                              fontWeight: 800,
                              border: '1px solid rgba(245, 183, 46, 0.3)',
                              fontSize: '0.7rem',
                              height: 22,
                              borderRadius: '6px'
                            }}
                          />
                          {step.amountExpected > 0 && (
                            <Chip
                              label={`₹ ${Number(step.amountExpected).toLocaleString('en-IN')}`}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.06)',
                                color: '#FFFFFF',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                height: 22,
                                borderRadius: '6px'
                              }}
                            />
                          )}
                          <Box
                            sx={{
                              color: '#F5B72E',
                              display: 'flex',
                              alignItems: 'center',
                              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                              transition: 'transform 0.25s ease'
                            }}
                          >
                            <ChevronRightIcon sx={{ fontSize: 20 }} />
                          </Box>
                        </Box>

                        {/* Bottom row badge: Payment status */}
                        <Chip
                          label={step.isPaid ? 'Payment Received' : 'Payment Pending'}
                          size="small"
                          sx={{
                            bgcolor: step.isPaid ? 'rgba(34, 197, 94, 0.15)' : '#2D1519',
                            color: step.isPaid ? '#22C55E' : '#F87171',
                            border: `1px solid ${step.isPaid ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                            fontWeight: 800,
                            fontSize: '0.7rem',
                            height: 22,
                            borderRadius: '6px'
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Collapsible Checkpoints Section */}
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)' }} />
                      <Box sx={{ p: { xs: 1.8, sm: 2.2 }, pt: { xs: 1.5, sm: 1.8 }, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {step.points && step.points.length > 0 ? (
                          step.points.map((pt, pIdx) => (
                            <Box
                              key={pIdx}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 1.2,
                                px: 1.6,
                                borderRadius: '10px',
                                bgcolor: pt.completed ? 'rgba(34, 197, 94, 0.06)' : '#131B2E',
                                border: `1px solid ${pt.completed ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255, 255, 255, 0.05)'}`,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  bgcolor: pt.completed ? 'rgba(34, 197, 94, 0.1)' : '#182238'
                                }
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, minWidth: 0 }}>
                                {pt.completed ? (
                                  <CheckCircleIcon sx={{ color: '#22C55E', fontSize: 18, flexShrink: 0 }} />
                                ) : (
                                  <Box
                                    sx={{
                                      width: 16,
                                      height: 16,
                                      borderRadius: '50%',
                                      border: '2px solid #64748B',
                                      flexShrink: 0
                                    }}
                                  />
                                )}
                                <Typography
                                  sx={{
                                    fontSize: '0.85rem',
                                    color: pt.completed ? '#E2E8F0' : '#CBD5E1',
                                    fontWeight: pt.completed ? 700 : 500,
                                    lineHeight: 1.3
                                  }}
                                >
                                  {pt.title}
                                </Typography>
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexShrink: 0, ml: 1 }}>
                                {pt.completed && (
                                  <Chip
                                    label="Site Verified"
                                    size="small"
                                    sx={{
                                      height: 20,
                                      fontSize: '0.64rem',
                                      bgcolor: 'rgba(34, 197, 94, 0.2)',
                                      color: '#22C55E',
                                      fontWeight: 800,
                                      borderRadius: '6px'
                                    }}
                                  />
                                )}
                                <ChevronRightIcon sx={{ color: '#64748B', fontSize: 16 }} />
                              </Box>
                            </Box>
                          ))
                        ) : (
                          <Typography sx={{ color: '#94A3B8', fontSize: '0.8rem', fontStyle: 'italic', py: 0.5 }}>
                            All stage requirements actively monitored on site.
                          </Typography>
                        )}
                      </Box>

                      {/* Milestone Site Photos & Media Uploaded by Admin for this Step */}
                      {(() => {
                        const stepMedia = (projectData?.siteMedia || []).filter(
                          (m) => m.stepTitle && m.stepTitle.trim().toLowerCase() === (step.title || '').trim().toLowerCase()
                        );
                        if (stepMedia.length === 0) return null;
                        return (
                          <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
                              <PhotoLibraryIcon sx={{ color: '#F5B72E', fontSize: 17 }} />
                              <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#F5B72E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Site Photos for this Stage (चरण की फोटो) ({stepMedia.length})
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
                              {stepMedia.map((m, smIdx) => {
                                const isVid = m.mediaType === 'video';
                                const src = getStaticAssetUrl(m.url);
                                return (
                                  <Box
                                    key={m._id || smIdx}
                                    onClick={() => setSelectedPhotoForModal(m)}
                                    sx={{
                                      width: 110,
                                      minWidth: 110,
                                      borderRadius: '8px',
                                      overflow: 'hidden',
                                      cursor: 'pointer',
                                      bgcolor: '#0B0F19',
                                      border: '1px solid rgba(255, 255, 255, 0.1)',
                                      transition: 'all 0.2s',
                                      '&:hover': {
                                        borderColor: '#F5B72E',
                                        transform: 'scale(1.04)'
                                      }
                                    }}
                                  >
                                    {isVid ? (
                                      <Box sx={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#000' }}>
                                        <PlayCircleIcon sx={{ color: '#F5B72E', fontSize: 30 }} />
                                      </Box>
                                    ) : (
                                      <Box
                                        component="img"
                                        src={src}
                                        alt={m.title || 'Step photo'}
                                        onError={(e) => {
                                          const fallback = getFallbackAssetUrl(m.url);
                                          if (fallback && e.target.src !== fallback) {
                                            e.target.src = fallback;
                                          }
                                        }}
                                        sx={{ width: '100%', height: 72, objectFit: 'cover', display: 'block' }}
                                      />
                                    )}
                                    <Typography
                                      noWrap
                                      sx={{
                                        p: 0.5,
                                        fontSize: '0.66rem',
                                        color: '#CBD5E1',
                                        textAlign: 'center',
                                        fontWeight: 600
                                      }}
                                    >
                                      {m.title || 'Site photo'}
                                    </Typography>
                                  </Box>
                                );
                              })}
                            </Box>
                          </Box>
                        );
                      })()}
                    </Collapse>
                  </Paper>
                );
              })
            )}
          </Box>
        )}

        {/* TAB 1: SITE PHOTOS & VIDEOS (साइट फोटो एवं वीडियो) */}
        {activeTab === 1 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              bgcolor: '#0D1527',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                  Live Site Photos & Videos (साइट फोटो एवं वीडियो गैलरी)
                </Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                  Real-time construction pictures and work milestone video updates uploaded by on-site team
                </Typography>
              </Box>

              {/* Filter Chips */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`All (${siteMedia.length})`}
                  onClick={() => setMediaFilter('all')}
                  sx={{
                    bgcolor: mediaFilter === 'all' ? '#F5B72E' : 'rgba(255, 255, 255, 0.05)',
                    color: mediaFilter === 'all' ? '#111827' : '#94A3B8',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: mediaFilter === 'all' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px'
                  }}
                />
                <Chip
                  icon={<ImageIcon sx={{ fontSize: '16px !important', color: mediaFilter === 'image' ? '#111827 !important' : '#F5B72E !important' }} />}
                  label={`Photos (${imagesCount})`}
                  onClick={() => setMediaFilter('image')}
                  sx={{
                    bgcolor: mediaFilter === 'image' ? '#F5B72E' : 'rgba(255, 255, 255, 0.05)',
                    color: mediaFilter === 'image' ? '#111827' : '#94A3B8',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: mediaFilter === 'image' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px'
                  }}
                />
                <Chip
                  icon={<VideocamIcon sx={{ fontSize: '16px !important', color: mediaFilter === 'video' ? '#111827 !important' : '#F5B72E !important' }} />}
                  label={`Videos (${videosCount})`}
                  onClick={() => setMediaFilter('video')}
                  sx={{
                    bgcolor: mediaFilter === 'video' ? '#F5B72E' : 'rgba(255, 255, 255, 0.05)',
                    color: mediaFilter === 'video' ? '#111827' : '#94A3B8',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: mediaFilter === 'video' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px'
                  }}
                />
              </Box>
            </Box>

            {filteredMedia.length === 0 ? (
              <Box
                sx={{
                  p: 6,
                  textAlign: 'center',
                  bgcolor: 'rgba(0,0,0,0.2)',
                  border: '1.5px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: 3
                }}
              >
                <PhotoLibraryIcon sx={{ fontSize: 50, color: '#F5B72E', mb: 1.5 }} />
                <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800, mb: 0.5 }}>
                  No Site Media Uploaded Yet
                </Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: 460, mx: 'auto' }}>
                  Site engineers and supervisors will upload milestone photos and site construction videos here.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2.5}>
                {filteredMedia.map((media, mIdx) => {
                  const isVideo = media.mediaType === 'video';
                  const mediaSrc = getStaticAssetUrl(media.url);

                  return (
                    <Grid item xs={12} sm={6} md={4} key={media._id || mIdx}>
                      <Paper
                        elevation={0}
                        sx={{
                          overflow: 'hidden',
                          borderRadius: 3,
                          bgcolor: '#131B2E',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          transition: 'transform 0.2s, border-color 0.2s',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            borderColor: '#F5B72E'
                          }
                        }}
                      >
                        {isVideo ? (
                          <Box sx={{ bgcolor: '#000', position: 'relative' }}>
                            <video
                              controls
                              playsInline
                              preload="metadata"
                              style={{
                                width: '100%',
                                height: '220px',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                              src={mediaSrc}
                              onError={(e) => {
                                const fallback = getFallbackAssetUrl(media.url);
                                if (fallback && e.target.src !== fallback) {
                                  e.target.src = fallback;
                                }
                              }}
                            />
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              position: 'relative',
                              height: 220,
                              bgcolor: '#0B0F19',
                              cursor: 'pointer',
                              overflow: 'hidden',
                              '&:hover .img-hover-overlay': { opacity: 1 },
                              '&:hover img': { transform: 'scale(1.05)' }
                            }}
                            onClick={() => setSelectedPhotoForModal(media)}
                          >
                            <Box
                              component="img"
                              src={mediaSrc}
                              alt={media.title || 'Site photo'}
                              onError={(e) => {
                                const fallback = getFallbackAssetUrl(media.url);
                                if (fallback && e.target.src !== fallback) {
                                  e.target.src = fallback;
                                }
                              }}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease'
                              }}
                            />
                            <Box
                              className="img-hover-overlay"
                              sx={{
                                position: 'absolute',
                                inset: 0,
                                bgcolor: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                                color: '#F5B72E',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                opacity: 0,
                                transition: 'opacity 0.25s ease'
                              }}
                            >
                              <ZoomInIcon sx={{ fontSize: 26 }} />
                              <span>Click to Zoom</span>
                            </Box>
                          </Box>
                        )}

                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, gap: 1 }}>
                            <Chip
                              label={isVideo ? 'SITE VIDEO' : 'SITE PHOTO'}
                              size="small"
                              sx={{
                                height: 22,
                                bgcolor: isVideo ? 'rgba(244, 63, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                                color: isVideo ? '#fb7185' : '#38bdf8',
                                border: `1px solid ${isVideo ? '#fb7185' : '#38bdf8'}`,
                                fontWeight: 800,
                                fontSize: '0.68rem',
                                borderRadius: '6px'
                              }}
                            />
                            <Typography sx={{ color: '#94A3B8', fontSize: '0.74rem' }}>
                              {media.createdAt ? new Date(media.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                            </Typography>
                          </Box>

                          <Typography sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.96rem', mb: 0.5 }}>
                            {media.title || (isVideo ? 'Site Inspection Video' : 'Construction Progress Photo')}
                          </Typography>

                          {media.stepTitle && (
                            <Chip
                              label={`Phase: ${media.stepTitle}`}
                              size="small"
                              sx={{
                                mb: 0.8,
                                bgcolor: 'rgba(245, 183, 46, 0.12)',
                                color: '#F5B72E',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                borderRadius: '6px'
                              }}
                            />
                          )}

                          {media.caption && (
                            <Typography sx={{ color: '#CBD5E1', display: 'block', mt: 0.5, lineHeight: 1.4, fontSize: '0.82rem' }}>
                              {media.caption}
                            </Typography>
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Paper>
        )}

        {/* TAB 2: PAYMENTS & OFFICIAL SLIPS */}
        {activeTab === 2 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              bgcolor: '#0D1527',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                  Verified Payment Receipts (आधिकारिक रसीदें)
                </Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                  Click "Download Official Slip" to save or print GST payment receipts
                </Typography>
              </Box>
            </Box>

            {payments.length === 0 ? (
              <Alert
                severity="info"
                sx={{
                  bgcolor: 'rgba(245, 183, 46, 0.08)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(245, 183, 46, 0.25)',
                  borderRadius: 2
                }}
              >
                No payment transactions recorded yet. Whenever you make a payment, your digital receipt slip will appear here automatically.
              </Alert>
            ) : (
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  bgcolor: '#131B2E',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 2.5,
                  overflowX: 'auto'
                }}
              >
                <Table sx={{ minWidth: 620 }}>
                  <TableHead sx={{ bgcolor: '#0B0F19' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#F5B72E', fontWeight: 800, fontSize: '0.82rem' }}>RECEIPT NO</TableCell>
                      <TableCell sx={{ color: '#F5B72E', fontWeight: 800, fontSize: '0.82rem' }}>DATE</TableCell>
                      <TableCell sx={{ color: '#F5B72E', fontWeight: 800, fontSize: '0.82rem' }}>PAYMENT MODE</TableCell>
                      <TableCell sx={{ color: '#F5B72E', fontWeight: 800, fontSize: '0.82rem' }}>MILESTONE STAGE</TableCell>
                      <TableCell sx={{ color: '#F5B72E', fontWeight: 800, fontSize: '0.82rem', textAlign: 'right' }}>AMOUNT</TableCell>
                      <TableCell sx={{ color: '#F5B72E', fontWeight: 800, fontSize: '0.82rem', textAlign: 'center' }}>ACTION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((p) => (
                      <TableRow
                        key={p._id}
                        sx={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' }
                        }}
                      >
                        <TableCell sx={{ color: '#FFFFFF', fontWeight: 800 }}>
                          <Box sx={{ display: 'inline-block', bgcolor: 'rgba(245, 183, 46, 0.12)', px: 1.2, py: 0.4, borderRadius: '6px', border: '1px solid rgba(245, 183, 46, 0.3)', color: '#F5B72E', fontSize: '0.82rem' }}>
                            {p.receiptNo}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: '#CBD5E1', fontSize: '0.88rem' }}>
                          {new Date(p.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell sx={{ color: '#E2E8F0', fontSize: '0.88rem' }}>
                          {p.paymentMode || 'Cash'}
                          {p.transactionRef && (
                            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', fontSize: '0.74rem' }}>
                              Ref: {p.transactionRef}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ color: '#CBD5E1', fontSize: '0.88rem' }}>
                          {p.stepTitle || 'General Site Milestone'}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Typography sx={{ fontWeight: 900, color: '#22C55E', fontSize: '1.05rem' }}>
                            ₹ {Number(p.amount).toLocaleString('en-IN')}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<ReceiptIcon sx={{ fontSize: 16 }} />}
                            onClick={() => {
                              setSelectedPayment(p);
                              setSlipModalOpen(true);
                            }}
                            sx={{
                              background: 'linear-gradient(135deg, #F5B72E 0%, #D97706 100%)',
                              color: '#111827',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              textTransform: 'none',
                              px: 1.8,
                              py: 0.6,
                              borderRadius: '8px',
                              boxShadow: '0 3px 10px rgba(245, 183, 46, 0.3)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                                transform: 'translateY(-1px)'
                              }
                            }}
                          >
                            Download Slip
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}

        {/* TAB 3: SIGNED SITE AGREEMENT */}
        {activeTab === 3 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              bgcolor: '#0D1527',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                  Signed Site Agreement Document (हस्ताक्षरित एग्रीमेंट)
                </Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: '0.85rem', mt: 0.3 }}>
                  Official verified construction agreement copy for {client.name}'s project site.
                </Typography>
              </Box>

              {client.agreementImage && (
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button
                    variant="contained"
                    startIcon={<ZoomInIcon />}
                    onClick={() => setAgreementModalOpen(true)}
                    sx={{
                      background: 'linear-gradient(135deg, #F5B72E 0%, #D97706 100%)',
                      color: '#111827',
                      fontWeight: 800,
                      textTransform: 'none',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      px: 2
                    }}
                  >
                    Full Size Zoom
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    href={agreementUrl}
                    target="_blank"
                    download
                    sx={{
                      borderColor: '#F5B72E',
                      color: '#F5B72E',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      '&:hover': { bgcolor: 'rgba(245, 183, 46, 0.1)', borderColor: '#FBBF24' }
                    }}
                  >
                    Download Original
                  </Button>
                </Box>
              )}
            </Box>

            {client.agreementImage ? (
              <Box
                sx={{
                  p: { xs: 2, sm: 3 },
                  bgcolor: '#131B2E',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 3,
                  textAlign: 'center'
                }}
              >
                {isAgreementPdf ? (
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <DescriptionIcon sx={{ color: '#F5B72E', fontSize: 24 }} />
                      <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem' }}>
                        Official Signed Site Agreement (PDF Preview)
                      </Typography>
                    </Box>
                    <Box
                      component="iframe"
                      src={agreementUrl}
                      title="Signed Site Agreement PDF"
                      sx={{
                        width: '100%',
                        height: { xs: '450px', sm: '650px' },
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 2,
                        bgcolor: '#0B0F19'
                      }}
                    />
                  </Box>
                ) : (
                  /* Image Preview Canvas */
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'inline-block',
                      maxWidth: '100%',
                      cursor: 'pointer',
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      '&:hover .zoom-overlay': { opacity: 1 }
                    }}
                    onClick={() => setAgreementModalOpen(true)}
                  >
                    <Box
                      component="img"
                      src={agreementUrl}
                      alt="Site Agreement"
                      onError={handleImageError}
                      sx={{
                        display: 'block',
                        maxWidth: '100%',
                        maxHeight: { xs: '380px', sm: '550px' },
                        objectFit: 'contain',
                        bgcolor: '#0B0F19'
                      }}
                    />
                    {/* Hover Zoom Overlay */}
                    <Box
                      className="zoom-overlay"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        color: '#F5B72E',
                        fontWeight: 800,
                        fontSize: '1rem',
                        opacity: 0,
                        transition: 'opacity 0.25s ease'
                      }}
                    >
                      <ZoomInIcon sx={{ fontSize: 28 }} />
                      <span>Click to view Fullscreen & Zoom</span>
                    </Box>
                  </Box>
                )}

                <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Typography sx={{ color: '#94A3B8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <VerifiedIcon sx={{ fontSize: 16, color: '#10B981' }} />
                    Signed & verified by Vishwakarma Build & Furnish
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  p: 6,
                  textAlign: 'center',
                  bgcolor: 'rgba(0,0,0,0.2)',
                  border: '1.5px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: 3
                }}
              >
                <DescriptionIcon sx={{ fontSize: 48, color: '#F5B72E', mb: 1.5 }} />
                <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800, mb: 0.5 }}>
                  Agreement Document Being Processed
                </Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: 450, mx: 'auto', mb: 2.5 }}>
                  Your official signed agreement is being digitized and uploaded by the site manager. It will appear here shortly.
                </Typography>
                <Button
                  variant="outlined"
                  href="tel:+919416856468"
                  startIcon={<PhoneIcon />}
                  sx={{ color: '#F5B72E', borderColor: '#F5B72E', textTransform: 'none', fontWeight: 700 }}
                >
                  Contact Support: +91 9416856468
                </Button>
              </Box>
            )}
          </Paper>
        )}
      </Box>

      {/* Payment Slip Modal */}
      {selectedPayment && (
        <PaymentSlipModal
          open={slipModalOpen}
          onClose={() => {
            setSlipModalOpen(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
          client={client}
          financials={financials}
        />
      )}

      {/* Fullscreen Agreement Image Lightbox Modal */}
      {client.agreementImage && (
        <Dialog
          open={agreementModalOpen}
          onClose={() => setAgreementModalOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#0B0F19',
              border: '1.5px solid rgba(212,175,55,0.4)',
              borderRadius: 3,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: '#0F172A',
              color: '#D4AF37',
              fontWeight: 800,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1.8,
              borderBottom: '1px solid rgba(212,175,55,0.2)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DescriptionIcon sx={{ color: '#D4AF37' }} />
              <Typography sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.1rem' }}>
                Signed Site Agreement: {client.name}
              </Typography>
            </Box>
            <IconButton onClick={() => setAgreementModalOpen(false)} sx={{ color: '#94A3B8', '&:hover': { color: '#FFF' } }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ bgcolor: '#050811', textAlign: 'center', p: { xs: 1.5, sm: 2.5 }, overflowY: 'auto' }}>
            {isAgreementPdf ? (
              <Box
                component="iframe"
                src={agreementUrl}
                title="Signed Agreement Fullscreen PDF"
                sx={{
                  width: '100%',
                  height: '80vh',
                  border: 'none',
                  borderRadius: 2
                }}
              />
            ) : (
              <Box
                component="img"
                src={agreementUrl}
                alt="Signed Agreement Fullscreen"
                onError={handleImageError}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  borderRadius: 2,
                  objectFit: 'contain',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
                }}
              />
            )}
          </DialogContent>

          <DialogActions
            sx={{
              bgcolor: '#0F172A',
              p: 2,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="caption" sx={{ color: '#94A3B8', pl: 1 }}>
              Vishwakarma Build & Furnish • Verified Official Agreement Copy
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                href={agreementUrl}
                target="_blank"
                download
                variant="contained"
                startIcon={<DownloadIcon />}
                sx={{
                  bgcolor: '#D4AF37',
                  color: '#0F172A',
                  fontWeight: 800,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#F59E0B' }
                }}
              >
                Download File
              </Button>
              <Button onClick={() => setAgreementModalOpen(false)} sx={{ color: '#CBD5E1', fontWeight: 700, textTransform: 'none' }}>
                Close
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      )}

      {/* Fullscreen Site Photo Lightbox Modal */}
      {selectedPhotoForModal && (
        <Dialog
          open={Boolean(selectedPhotoForModal)}
          onClose={() => setSelectedPhotoForModal(null)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#0B0F19',
              border: '1.5px solid rgba(212,175,55,0.4)',
              borderRadius: 3,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: '#0F172A',
              color: '#D4AF37',
              fontWeight: 800,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1.8,
              borderBottom: '1px solid rgba(212,175,55,0.2)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ImageIcon sx={{ color: '#D4AF37' }} />
              <Typography sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.05rem' }}>
                {selectedPhotoForModal.title || 'Construction Progress Photo'}
              </Typography>
            </Box>
            <IconButton onClick={() => setSelectedPhotoForModal(null)} sx={{ color: '#94A3B8', '&:hover': { color: '#FFF' } }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ bgcolor: '#050811', textAlign: 'center', p: { xs: 2, sm: 3 }, overflowY: 'auto' }}>
            <Box
              component="img"
              src={getStaticAssetUrl(selectedPhotoForModal.url)}
              alt={selectedPhotoForModal.title || 'Site photo full'}
              onError={(e) => {
                const fallback = getFallbackAssetUrl(selectedPhotoForModal.url);
                if (fallback && e.target.src !== fallback) {
                  e.target.src = fallback;
                }
              }}
              sx={{
                maxWidth: '100%',
                maxHeight: '75vh',
                borderRadius: 2,
                objectFit: 'contain',
                boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
              }}
            />
            {selectedPhotoForModal.caption && (
              <Typography sx={{ color: '#CBD5E1', mt: 2, fontSize: '0.95rem' }}>
                {selectedPhotoForModal.caption}
              </Typography>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              bgcolor: '#0F172A',
              p: 2,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {selectedPhotoForModal.stepTitle && (
                <Chip
                  label={`Milestone: ${selectedPhotoForModal.stepTitle}`}
                  size="small"
                  sx={{ bgcolor: 'rgba(212,175,55,0.15)', color: '#FACC15', fontWeight: 700 }}
                />
              )}
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                {selectedPhotoForModal.createdAt ? new Date(selectedPhotoForModal.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                href={getStaticAssetUrl(selectedPhotoForModal.url)}
                target="_blank"
                download
                variant="contained"
                startIcon={<DownloadIcon />}
                sx={{
                  bgcolor: '#D4AF37',
                  color: '#0F172A',
                  fontWeight: 800,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#F59E0B' }
                }}
              >
                Download Original
              </Button>
              <Button onClick={() => setSelectedPhotoForModal(null)} sx={{ color: '#CBD5E1', fontWeight: 700, textTransform: 'none' }}>
                Close
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ClientProjectReportPage;
