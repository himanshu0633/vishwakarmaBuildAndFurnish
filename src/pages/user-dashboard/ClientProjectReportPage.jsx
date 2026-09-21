import React, { useState, useEffect } from 'react';
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
  IconButton
} from '@mui/material';
import {
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
  PlayCircle as PlayCircleIcon
} from '@mui/icons-material';
import api, { getStaticAssetUrl } from '../../../utils/axiosConfig';
import PaymentSlipModal from '../../components/admin/PaymentSlipModal';

const ClientProjectReportPage = () => {
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0); // 0: Steps, 1: Media, 2: Payments, 3: Agreement

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

  // Resolve agreement image URL with fallbacks
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
      // Try fallback direct port or relative path
      if (client.agreementImage && !e.target.src.includes(':4001')) {
        e.target.src = `http://localhost:4001${client.agreementImage.startsWith('/') ? client.agreementImage : `/${client.agreementImage}`}`;
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* 1. HERO PROJECT BANNER */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0B0F19 100%)',
          border: '1.5px solid rgba(212, 175, 55, 0.4)',
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(212,175,55,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Gold Accent Strip */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)'
          }}
        />

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.5, flexWrap: 'wrap' }}>
              <Chip
                icon={<VerifiedIcon sx={{ fontSize: '15px !important', color: '#D4AF37 !important' }} />}
                label="VERIFIED CLIENT PROJECT"
                size="small"
                sx={{
                  bgcolor: 'rgba(212, 175, 55, 0.15)',
                  color: '#FACC15',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  fontWeight: 900,
                  fontSize: '0.74rem',
                  letterSpacing: '0.5px'
                }}
              />
              <Chip
                label={client.status ? client.status.toUpperCase() : 'IN PROGRESS'}
                size="small"
                sx={{
                  bgcolor: client.status === 'completed' ? 'rgba(74,222,128,0.2)' : 'rgba(56,189,248,0.2)',
                  color: client.status === 'completed' ? '#4ade80' : '#38bdf8',
                  border: `1px solid ${client.status === 'completed' ? '#4ade80' : '#38bdf8'}`,
                  fontWeight: 800,
                  fontSize: '0.72rem'
                }}
              />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F59E0B 55%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.75rem', sm: '2.25rem' },
                lineHeight: 1.2,
                mb: 1.5
              }}
            >
              {client.name}’s Site Dashboard
            </Typography>

            {/* Site Metadata Badges */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, color: '#CBD5E1', fontSize: '0.9rem', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, bgcolor: 'rgba(255,255,255,0.04)', px: 1.4, py: 0.5, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <LocationIcon sx={{ fontSize: 18, color: '#D4AF37' }} />
                <span>{client.location || 'Site Location'}</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, bgcolor: 'rgba(255,255,255,0.04)', px: 1.4, py: 0.5, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <PhoneIcon sx={{ fontSize: 18, color: '#D4AF37' }} />
                <span>+91 {client.phone}</span>
              </Box>
              {client.aadharNo && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, bgcolor: 'rgba(255,255,255,0.04)', px: 1.4, py: 0.5, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>Aadhar:</Typography>
                  <span style={{ fontWeight: 700 }}>{client.aadharNo}</span>
                </Box>
              )}
            </Box>

            {/* Category & Service Tags */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Scope:
              </Typography>
              {client.categories &&
                client.categories.map((cat, i) => (
                  <Chip
                    key={i}
                    label={`${typeof cat === 'object' ? (cat.emoji || '🏗️') : ''} ${typeof cat === 'object' ? cat.name : 'Category'}`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(212,175,55,0.15)',
                      color: '#D4AF37',
                      fontWeight: 800,
                      border: '1px solid rgba(212,175,55,0.35)',
                      fontSize: '0.74rem'
                    }}
                  />
                ))}
              {client.services &&
                client.services.map((s, i) => (
                  <Chip
                    key={i}
                    label={typeof s === 'object' ? (s.name || s.title) : 'Service'}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.06)',
                      color: '#FFFFFF',
                      fontSize: '0.74rem',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  />
                ))}
            </Box>
          </Grid>

          {/* Overall Progress Gauge Card */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                p: { xs: 2.5, sm: 3 },
                bgcolor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(16px)',
                borderRadius: 2.5,
                border: '1.5px solid rgba(212,175,55,0.35)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Live Construction Progress
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 950,
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F59E0B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {progressPct}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={progressPct}
                sx={{
                  height: 14,
                  borderRadius: 7,
                  bgcolor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #D4AF37 0%, #F59E0B 50%, #10B981 100%)',
                    borderRadius: 7
                  }
                }}
              />

              <Typography variant="caption" sx={{ color: '#94A3B8', mt: 1, display: 'block', textAlign: 'right' }}>
                Verified by on-site milestone inspection checkpoints
              </Typography>

              {/* Quick Agreement Jump Button */}
              {client.agreementImage && (
                <Button
                  fullWidth
                  variant="contained"
                  size="medium"
                  startIcon={<DescriptionIcon />}
                  onClick={() => setActiveTab(3)}
                  sx={{
                    mt: 2.2,
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(180,83,9,0.25) 100%)',
                    color: '#FACC15',
                    border: '1px solid #D4AF37',
                    fontWeight: 800,
                    fontSize: '13px',
                    textTransform: 'none',
                    py: 1,
                    borderRadius: '8px',
                    boxShadow: '0 4px 15px rgba(212,175,55,0.2)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #D4AF37 0%, #B45309 100%)',
                      color: '#0F172A',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  📑 View Signed Site Agreement (एग्रीमेंट देखें) &rarr;
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 2. FINANCIAL OVERVIEW CARDS */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              bgcolor: 'rgba(15, 23, 42, 0.85)',
              border: '1.5px solid rgba(212,175,55,0.35)',
              borderRadius: 2.5,
              backdropFilter: 'blur(12px)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Contract Budget
                </Typography>
                <ApartmentIcon sx={{ color: '#D4AF37', fontSize: 20 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 950, color: '#FFFFFF', letterSpacing: '0.4px' }}>
                ₹ {Number(financials?.contractAmount || 0).toLocaleString('en-IN')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.6 }}>
                Agreed contract value
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              bgcolor: 'rgba(15, 23, 42, 0.85)',
              border: '1.5px solid rgba(74, 222, 128, 0.35)',
              borderRadius: 2.5,
              backdropFilter: 'blur(12px)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#4ADE80', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Amount Paid
                </Typography>
                <CheckCircleIcon sx={{ color: '#4ADE80', fontSize: 20 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 950, color: '#4ADE80', letterSpacing: '0.4px' }}>
                ₹ {Number(financials?.totalPaid || 0).toLocaleString('en-IN')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.6 }}>
                {financials?.paymentCount || 0} verified payment receipt(s)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              bgcolor: 'rgba(15, 23, 42, 0.85)',
              border: `1.5px solid ${financials?.remainingBalance > 0 ? 'rgba(248, 113, 113, 0.35)' : 'rgba(74, 222, 128, 0.35)'}`,
              borderRadius: 2.5,
              backdropFilter: 'blur(12px)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ color: financials?.remainingBalance > 0 ? '#F87171' : '#4ADE80', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Remaining Balance Due
                </Typography>
                <WalletIcon sx={{ color: financials?.remainingBalance > 0 ? '#F87171' : '#4ADE80', fontSize: 20 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 950, color: financials?.remainingBalance > 0 ? '#F87171' : '#4ADE80', letterSpacing: '0.4px' }}>
                ₹ {Number(financials?.remainingBalance || 0).toLocaleString('en-IN')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.6 }}>
                Due across upcoming milestone phases
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              bgcolor: 'rgba(15, 23, 42, 0.85)',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              borderRadius: 2.5,
              backdropFilter: 'blur(12px)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Agreed Work Rate
                </Typography>
                <DescriptionIcon sx={{ color: '#38BDF8', fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 950, color: '#FACC15' }}>
                {Number(financials?.serviceRate) > 0 ? `₹ ${Number(financials.serviceRate).toLocaleString('en-IN')}` : 'Included in Budget'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.6 }}>
                {financials?.serviceRateUnit || 'Per agreement contract'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 3. MAIN NAVIGATION TABS (Material Deliveries Removed) */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'rgba(15, 23, 42, 0.9)',
          border: '1.5px solid rgba(212,175,55,0.3)',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 15px 45px rgba(0,0,0,0.5)'
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          sx={{
            px: 2,
            bgcolor: 'rgba(15, 23, 42, 0.98)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            '& .MuiTab-root': {
              color: '#94A3B8',
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '0.94rem',
              py: 2,
              px: 3,
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                color: '#FACC15',
                fontWeight: 900
              }
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#D4AF37',
              height: 3,
              borderRadius: 3
            }
          }}
        >
          <Tab
            icon={<EngineeringIcon sx={{ fontSize: 20 }} />}
            iconPosition="start"
            label="Construction Steps & Milestones (साइट प्रोग्रेस)"
          />
          <Tab
            icon={<PhotoLibraryIcon sx={{ fontSize: 20 }} />}
            iconPosition="start"
            label={`Site Photos & Videos (${siteMedia.length})`}
          />
          <Tab
            icon={<ReceiptIcon sx={{ fontSize: 20 }} />}
            iconPosition="start"
            label={`Verified Payment Slips (${payments.length})`}
          />
          <Tab
            icon={<DescriptionIcon sx={{ fontSize: 20 }} />}
            iconPosition="start"
            label="Signed Site Agreement (एग्रीमेंट देखें)"
          />
        </Tabs>

        <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          {/* TAB 0: STEPS & CHECKPOINTS */}
          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#D4AF37' }}>
                  Milestone Construction Stages (चरणबद्ध निर्माण एवं जांच बिंदु)
                </Typography>
                <Chip
                  label={`Total ${steps.length} Milestones`}
                  size="small"
                  sx={{ bgcolor: 'rgba(212,175,55,0.12)', color: '#FACC15', border: '1px solid rgba(212,175,55,0.3)', fontWeight: 700 }}
                />
              </Box>

              {steps.map((step, idx) => {
                const totalPts = step.points ? step.points.length : 0;
                const completedPts = step.points ? step.points.filter((p) => p.completed).length : (step.completed ? 1 : 0);
                const isAllDone = totalPts > 0 ? completedPts === totalPts : step.completed;

                return (
                  <Paper
                    key={step._id || idx}
                    elevation={0}
                    sx={{
                      p: 2.8,
                      bgcolor: isAllDone ? 'rgba(74,222,128,0.03)' : 'rgba(255,255,255,0.02)',
                      border: `1.5px solid ${isAllDone ? 'rgba(74,222,128,0.45)' : 'rgba(212,175,55,0.25)'}`,
                      borderRadius: 2.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        border: `1.5px solid ${isAllDone ? '#4ADE80' : '#D4AF37'}`
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 1.5,
                        mb: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {isAllDone ? (
                          <CheckCircleIcon sx={{ color: '#4ADE80', fontSize: 26 }} />
                        ) : (
                          <UncheckedIcon sx={{ color: '#D4AF37', fontSize: 26 }} />
                        )}
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#FFFFFF', fontSize: '1.05rem' }}>
                            {step.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                            {completedPts} of {totalPts} checkpoints completed
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={`${step.percentage || 0}% Weightage`}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(212,175,55,0.15)',
                            color: '#FACC15',
                            fontWeight: 800,
                            border: '1px solid rgba(212,175,55,0.3)',
                            fontSize: '0.74rem'
                          }}
                        />
                        {step.amountExpected > 0 && (
                          <Chip
                            label={`₹ ${Number(step.amountExpected).toLocaleString('en-IN')}`}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.06)',
                              color: '#FFFFFF',
                              fontWeight: 700,
                              fontSize: '0.74rem'
                            }}
                          />
                        )}
                        <Chip
                          label={step.isPaid ? 'Payment Received' : 'Payment Pending'}
                          size="small"
                          sx={{
                            bgcolor: step.isPaid ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
                            color: step.isPaid ? '#4ADE80' : '#F87171',
                            border: `1px solid ${step.isPaid ? '#4ADE80' : '#F87171'}`,
                            fontWeight: 800,
                            fontSize: '0.72rem'
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Checkpoints List */}
                    {step.points && step.points.length > 0 && (
                      <Box sx={{ pl: { xs: 1, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {step.points.map((pt, pIdx) => (
                          <Box
                            key={pIdx}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              p: 1.2,
                              borderRadius: '8px',
                              bgcolor: pt.completed ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.02)',
                              border: `1px solid ${pt.completed ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'}`
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                              {pt.completed ? (
                                <CheckCircleIcon sx={{ color: '#4ADE80', fontSize: 18 }} />
                              ) : (
                                <UncheckedIcon sx={{ color: '#64748B', fontSize: 18 }} />
                              )}
                              <Typography
                                sx={{
                                  fontSize: '0.88rem',
                                  color: pt.completed ? '#E2E8F0' : '#94A3B8',
                                  fontWeight: pt.completed ? 700 : 500
                                }}
                              >
                                {pt.title}
                              </Typography>
                            </Box>

                            {pt.completed && (
                              <Chip
                                label="Site Verified"
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.68rem',
                                  bgcolor: 'rgba(74,222,128,0.2)',
                                  color: '#4ADE80',
                                  fontWeight: 800
                                }}
                              />
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Paper>
                );
              })}
            </Box>
          )}

          {/* TAB 1: SITE PHOTOS & VIDEOS (साइट फोटो एवं वीडियो) */}
          {activeTab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#D4AF37' }}>
                    Live Site Photos & Videos (साइट फोटो एवं वीडियो गैलरी)
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Real-time construction pictures and work milestone video updates uploaded by on-site team
                  </Typography>
                </Box>

                {/* Filter Chips */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`All (${siteMedia.length})`}
                    onClick={() => setMediaFilter('all')}
                    sx={{
                      bgcolor: mediaFilter === 'all' ? '#D4AF37' : 'rgba(255,255,255,0.06)',
                      color: mediaFilter === 'all' ? '#0F172A' : '#CBD5E1',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: '1px solid rgba(212,175,55,0.3)'
                    }}
                  />
                  <Chip
                    icon={<ImageIcon sx={{ fontSize: '16px !important', color: mediaFilter === 'image' ? '#0F172A !important' : '#D4AF37 !important' }} />}
                    label={`Photos (${imagesCount})`}
                    onClick={() => setMediaFilter('image')}
                    sx={{
                      bgcolor: mediaFilter === 'image' ? '#D4AF37' : 'rgba(255,255,255,0.06)',
                      color: mediaFilter === 'image' ? '#0F172A' : '#CBD5E1',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: '1px solid rgba(212,175,55,0.3)'
                    }}
                  />
                  <Chip
                    icon={<VideocamIcon sx={{ fontSize: '16px !important', color: mediaFilter === 'video' ? '#0F172A !important' : '#D4AF37 !important' }} />}
                    label={`Videos (${videosCount})`}
                    onClick={() => setMediaFilter('video')}
                    sx={{
                      bgcolor: mediaFilter === 'video' ? '#D4AF37' : 'rgba(255,255,255,0.06)',
                      color: mediaFilter === 'video' ? '#0F172A' : '#CBD5E1',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: '1px solid rgba(212,175,55,0.3)'
                    }}
                  />
                </Box>
              </Box>

              {filteredMedia.length === 0 ? (
                <Paper
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    bgcolor: 'rgba(0,0,0,0.3)',
                    border: '1.5px dashed rgba(212,175,55,0.3)',
                    borderRadius: 3
                  }}
                >
                  <PhotoLibraryIcon sx={{ fontSize: 50, color: '#D4AF37', mb: 1.5 }} />
                  <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800, mb: 0.5 }}>
                    No Site Media Uploaded Yet
                  </Typography>
                  <Typography sx={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: 460, mx: 'auto' }}>
                    Site engineers and supervisors will upload milestone photos and site construction videos here.
                  </Typography>
                </Paper>
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
                            borderRadius: 2.5,
                            bgcolor: 'rgba(15, 23, 42, 0.85)',
                            border: '1.5px solid rgba(212, 175, 55, 0.3)',
                            transition: 'transform 0.2s, border-color 0.2s',
                            '&:hover': {
                              transform: 'translateY(-3px)',
                              borderColor: '#D4AF37'
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
                                  color: '#FACC15',
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
                                  fontSize: '0.68rem'
                                }}
                              />
                              <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.74rem' }}>
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
                                  bgcolor: 'rgba(212,175,55,0.12)',
                                  color: '#FACC15',
                                  fontSize: '0.72rem',
                                  fontWeight: 700
                                }}
                              />
                            )}

                            {media.caption && (
                              <Typography variant="caption" sx={{ color: '#CBD5E1', display: 'block', mt: 0.5, lineHeight: 1.4 }}>
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
            </Box>
          )}

          {/* TAB 2: PAYMENTS & OFFICIAL SLIPS */}
          {activeTab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#D4AF37' }}>
                  Verified Payment Receipts (आधिकारिक रसीदें)
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Click "Download Official Slip" to save or print GST payment receipts
                </Typography>
              </Box>

              {payments.length === 0 ? (
                <Alert
                  severity="info"
                  sx={{
                    bgcolor: 'rgba(212,175,55,0.08)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(212,175,55,0.25)',
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
                    bgcolor: 'rgba(0,0,0,0.3)',
                    border: '1.5px solid rgba(212,175,55,0.3)',
                    borderRadius: 2.5,
                    overflow: 'hidden'
                  }}
                >
                  <Table>
                    <TableHead sx={{ bgcolor: 'rgba(15,23,42,0.95)' }}>
                      <TableRow>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 800, fontSize: '0.82rem' }}>RECEIPT NO</TableCell>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 800, fontSize: '0.82rem' }}>DATE</TableCell>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 800, fontSize: '0.82rem' }}>PAYMENT MODE</TableCell>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 800, fontSize: '0.82rem' }}>MILESTONE STAGE</TableCell>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 800, fontSize: '0.82rem', textAlign: 'right' }}>AMOUNT</TableCell>
                        <TableCell sx={{ color: '#D4AF37', fontWeight: 800, fontSize: '0.82rem', textAlign: 'center' }}>ACTION</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payments.map((p) => (
                        <TableRow
                          key={p._id}
                          sx={{
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                            '&:hover': { bgcolor: 'rgba(212,175,55,0.05)' }
                          }}
                        >
                          <TableCell sx={{ color: '#FFFFFF', fontWeight: 800 }}>
                            <Box sx={{ display: 'inline-block', bgcolor: 'rgba(212,175,55,0.15)', px: 1.2, py: 0.4, borderRadius: '6px', border: '1px solid rgba(212,175,55,0.3)', color: '#FACC15', fontSize: '0.82rem' }}>
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
                            <Typography sx={{ fontWeight: 900, color: '#4ADE80', fontSize: '1.05rem' }}>
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
                                background: 'linear-gradient(135deg, #D4AF37 0%, #B45309 100%)',
                                color: '#FFFFFF',
                                fontWeight: 800,
                                fontSize: '0.78rem',
                                textTransform: 'none',
                                px: 1.8,
                                py: 0.6,
                                borderRadius: '8px',
                                boxShadow: '0 3px 10px rgba(212,175,55,0.3)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #E2C044 0%, #C26309 100%)',
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
            </Box>
          )}

          {/* TAB 3: SIGNED SITE AGREEMENT (Prominently Showcased) */}
          {activeTab === 3 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#D4AF37' }}>
                    Signed Site Agreement Document (हस्ताक्षरित एग्रीमेंट)
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.3 }}>
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
                        background: 'linear-gradient(135deg, #D4AF37 0%, #B45309 100%)',
                        color: '#FFFFFF',
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
                        borderColor: '#D4AF37',
                        color: '#FACC15',
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        '&:hover': { bgcolor: 'rgba(212,175,55,0.1)', borderColor: '#F59E0B' }
                      }}
                    >
                      Download Original
                    </Button>
                  </Box>
                )}
              </Box>

              {client.agreementImage ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    bgcolor: 'rgba(0,0,0,0.4)',
                    border: '1.5px solid rgba(212,175,55,0.35)',
                    borderRadius: 3,
                    textAlign: 'center'
                  }}
                >
                  {/* Image Preview Canvas */}
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
                        bgcolor: 'rgba(0,0,0,0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        color: '#FACC15',
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

                  <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="caption" sx={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <VerifiedIcon sx={{ fontSize: 16, color: '#4ADE80' }} />
                      Signed & verified by Vishwakarma Build & Furnish
                    </Typography>
                  </Box>
                </Paper>
              ) : (
                <Paper
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    bgcolor: 'rgba(0,0,0,0.3)',
                    border: '1.5px dashed rgba(212,175,55,0.3)',
                    borderRadius: 3
                  }}
                >
                  <DescriptionIcon sx={{ fontSize: 48, color: '#D4AF37', mb: 1.5 }} />
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
                    sx={{ color: '#D4AF37', borderColor: '#D4AF37', textTransform: 'none', fontWeight: 700 }}
                  >
                    Contact Support: +91 9416856468
                  </Button>
                </Paper>
              )}
            </Box>
          )}
        </Box>
      </Paper>

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

          <DialogContent sx={{ bgcolor: '#050811', textAlign: 'center', p: { xs: 2, sm: 3 }, overflowY: 'auto' }}>
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
