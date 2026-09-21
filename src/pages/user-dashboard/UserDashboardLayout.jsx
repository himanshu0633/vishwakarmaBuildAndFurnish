import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StorefrontIcon from '@mui/icons-material/Storefront';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ReviewsIcon from '@mui/icons-material/Reviews';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EngineeringIcon from '@mui/icons-material/Engineering';
import api from '../../../utils/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardProvider } from './DashboardContext';

export const dashboardItems = [
  { value: 'project', label: 'My Construction Project (मेरा प्रोजेक्ट)', icon: <EngineeringIcon />, highlight: true },
  { value: 'profile', label: 'Profile', icon: <AccountCircleIcon /> },
  { value: 'liked', label: 'Liked Services', icon: <FavoriteIcon /> },
  
  { value: 'upload', label: 'Upload Bill', icon: <UploadFileIcon /> },
  { value: 'bills', label: 'My Bills', icon: <ReceiptLongIcon /> },
  { value: 'wallet', label: 'Cashback Wallet', icon: <AccountBalanceWalletIcon /> },
  { value: 'referrals', label: 'My Referrals', icon: <GroupAddIcon /> },
  { value: 'reviews', label: 'My Reviews', icon: <ReviewsIcon /> },
  { value: 'notifications', label: 'Notifications', icon: <NotificationsIcon /> }
];

export default function UserDashboardLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [partners, setPartners] = useState([]);
  const [likes, setLikes] = useState([]);
  const [bills, setBills] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [referrals, setReferrals] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const activeSection = location.pathname.split('/').filter(Boolean)[1] || 'profile';

  const loadDashboard = async () => {
    const [partnersRes, likesRes, billsRes, walletRes, referralsRes, reviewsRes] = await Promise.allSettled([
      api.get('/partners'),
      api.get('/marketplace/likes/me'),
      api.get('/marketplace/bills'),
      api.get('/marketplace/wallet/me'),
      api.get('/marketplace/referrals/me'),
      api.get('/marketplace/reviews')
    ]);

    if (partnersRes.status === 'fulfilled') setPartners(partnersRes.value.data.data || []);
    if (likesRes.status === 'fulfilled') setLikes(likesRes.value.data.data || []);
    if (billsRes.status === 'fulfilled') setBills(billsRes.value.data.data || []);
    if (walletRes.status === 'fulfilled') setWallet(walletRes.value.data.data);
    if (referralsRes.status === 'fulfilled') setReferrals(referralsRes.value.data.data);
    if (reviewsRes.status === 'fulfilled') setReviews(reviewsRes.value.data.data || []);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

    const isClient = user?.role === 'client' || Boolean(user?.clientId);
    const items = isClient
      ? [
          { value: 'project', label: 'My Construction Project (मेरा प्रोजेक्ट)', icon: <EngineeringIcon />, highlight: true },
          { value: 'profile', label: 'My Profile & Details', icon: <AccountCircleIcon /> },
        ]
      : dashboardItems;

    return (
    <DashboardProvider value={{ user, partners, likes, bills, wallet, referrals, reviews, message, setMessage, error, setError, loadDashboard }}>
      <Box sx={{ bgcolor: '#111111', color: '#F5F5F5', minHeight: '70vh', py: 4 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" fontWeight={900} mb={1}>
            {isClient ? 'Client Construction Dashboard' : 'User Dashboard'}
          </Typography>
          <Typography sx={{ color: 'rgba(245,245,245,0.7)', mb: 2 }}>
            {user?.name} {isClient ? '• Live Site Tracking & Verified Accounts' : `• Referral Code: ${user?.referralCode || 'Generating'}`}
          </Typography>
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, gap: 2.5, alignItems: 'start' }}>
            <Paper sx={{ bgcolor: '#0F172A', border: '1px solid rgba(212,175,55,0.25)', overflow: 'hidden' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(212,175,55,0.18)' }}>
                <Typography fontWeight={900} sx={{ color: '#D4AF37' }}>
                  {isClient ? 'Client Account' : 'My Account'}
                </Typography>
                <Typography sx={{ color: 'rgba(245,245,245,0.68)', fontSize: 13 }}>{user?.email}</Typography>
              </Box>
              <List sx={{ p: 1 }}>
                {items.map(item => {
                  const active = activeSection === item.value;
                  return (
                    <ListItem key={item.value} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        onClick={() => navigate(`/dashboard/${item.value}`)}
                        sx={{
                          borderRadius: 1.5,
                          bgcolor: active
                            ? 'rgba(212,175,55,0.22)'
                            : item.highlight
                            ? 'rgba(212,175,55,0.08)'
                            : 'transparent',
                          borderLeft: active ? '3px solid #D4AF37' : item.highlight ? '2px solid rgba(212,175,55,0.4)' : '3px solid transparent',
                          '&:hover': { bgcolor: 'rgba(212,175,55,0.14)' }
                        }}
                      >
                        <ListItemIcon sx={{ color: active ? '#D4AF37' : item.highlight ? '#FACC15' : 'rgba(245,245,245,0.62)', minWidth: 38 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          sx={{
                            '& .MuiTypography-root': {
                              color: active ? '#D4AF37' : item.highlight ? '#FFFFFF' : 'rgba(245,245,245,0.82)',
                              fontWeight: active || item.highlight ? 900 : 700,
                              fontSize: '0.92rem'
                            }
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Paper>

            <Paper sx={{
              p: { xs: 1.5, md: 2.5 },
              bgcolor: activeSection === 'project' ? '#0B1120' : '#F8FAFC',
              color: activeSection === 'project' ? '#F5F5F5' : '#111827',
              border: activeSection === 'project' ? '1px solid rgba(212,175,55,0.3)' : '1px solid #E2E8F0',
              minWidth: 0,
              '& .MuiPaper-root': { color: activeSection === 'project' ? '#F5F5F5' : '#111827' }
            }}>
              <Typography variant="h5" fontWeight={900} mb={2} sx={{ color: activeSection === 'project' ? '#D4AF37' : 'inherit' }}>
                {dashboardItems.find(item => item.value === activeSection)?.label || 'Profile'}
              </Typography>
              <Outlet />
            </Paper>
          </Box>
        </Container>
      </Box>
    </DashboardProvider>
  );
}
