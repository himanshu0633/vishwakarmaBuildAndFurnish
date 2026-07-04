import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Build as ServicesIcon,
  Assignment as InquiriesIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Business as BusinessIcon,
  Gavel as GavelIcon,
  Collections as MediaIcon,
  Article as ArticleIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  Storefront as StorefrontIcon,
  Verified as VerifiedIcon,
  Favorite as FavoriteIcon,
  ReceiptLong as ReceiptLongIcon,
  AccountBalanceWallet as WalletIcon,
  Reviews as ReviewsIcon,
  Campaign as CampaignIcon,
  Assessment as ReportsIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Get current path without /admin prefix
  const getCurrentPath = () => {
    const path = location.pathname.replace('/admin/', '');
    return path === 'admin' ? 'dashboard' : path;
  };

  const currentPage = getCurrentPath();

  const menuItems = [
    // { text: 'Dashboard', icon: <DashboardIcon />, path: 'dashboard' },
    { text: 'Tenders', icon: <GavelIcon />, path: 'tenders' },
    { text: 'Categories', icon: <CategoryIcon />, path: 'categories' },
    { text: 'Services', icon: <ServicesIcon />, path: 'services' },
    { text: 'Service Media', icon: <MediaIcon />, path: 'service-media' },
    { text: 'Blogs', icon: <ArticleIcon />, path: 'blogs' },
    { text: 'About Page', icon: <BusinessIcon />, path: 'about-page' },
    { text: 'Gallery', icon: <MediaIcon />, path: 'gallery' },
    { text: 'Website Popups', icon: <CampaignIcon />, path: 'popups' },
    { text: 'Inquiries', icon: <InquiriesIcon />, path: 'inquiries' },
    { text: 'Marketplace Analytics', icon: <AnalyticsIcon />, path: 'marketplace/analytics' },
    { text: 'Users', icon: <PeopleIcon />, path: 'marketplace/users' },
    { text: 'Partners', icon: <StorefrontIcon />, path: 'marketplace/partners' },
    { text: 'Partner Verification', icon: <VerifiedIcon />, path: 'marketplace/verification' },
    { text: 'Leads', icon: <CampaignIcon />, path: 'marketplace/leads' },
    { text: 'Service Likes', icon: <FavoriteIcon />, path: 'marketplace/likes' },
    { text: 'Bills', icon: <ReceiptLongIcon />, path: 'marketplace/bills' },
    { text: 'Cashback', icon: <WalletIcon />, path: 'marketplace/cashback' },
    { text: 'Wallet', icon: <WalletIcon />, path: 'marketplace/wallet' },
    { text: 'Referrals', icon: <PeopleIcon />, path: 'marketplace/referrals' },
    { text: 'Partner Reviews', icon: <ReviewsIcon />, path: 'marketplace/reviews' },
    { text: 'Notifications', icon: <CampaignIcon />, path: 'marketplace/notifications' },
    { text: 'Reports', icon: <ReportsIcon />, path: 'marketplace/reports' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 280;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: 1 }}>
        {menuItems.map((item) => {
          const isActive = currentPage === item.path || (item.path === 'marketplace/analytics' && currentPage === 'marketplace');
          return (
            <ListItem
              key={item.text}
              disablePadding
              sx={{
                mb: 0.5,
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <ListItemButton
                onClick={() => {
                  navigate(`/admin/${item.path}`);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.1))'
                    : 'transparent',
                  borderLeft: isActive ? `3px solid #D4AF37` : '3px solid transparent',
                  '&:hover': {
                    background: 'rgba(212,175,55,0.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActive ? '#D4AF37' : 'rgba(245,245,245,0.6)',
                  minWidth: 40
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontWeight: isActive ? 'bold' : 'normal',
                      color: isActive ? '#D4AF37' : 'rgba(245,245,245,0.8)',
                      fontSize: '0.9rem'
                    } 
                  }}
                />
                {isActive && (
                  <Box sx={{ 
                    width: 4, 
                    height: 20, 
                    background: '#D4AF37',
                    borderRadius: 2
                  }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout Button */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(212,175,55,0.2)' }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            '&:hover': {
              background: 'rgba(244,67,54,0.1)'
            }
          }}
        >
          <ListItemIcon sx={{ color: '#e74c3c', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            sx={{ 
              '& .MuiTypography-root': { 
                color: '#e74c3c',
                fontWeight: 500
              } 
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#111111' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #111111 0%, #0F172A 50%, #1A1A1A 100%)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          borderBottom: '1px solid rgba(212,175,55,0.3)'
        }}
      >
        <Toolbar>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            <Box component="span" sx={{ color: '#D4AF37' }}>Industrial</Box>
            <Box component="span" sx={{ color: '#fff' }}> Equipment Solutions</Box>
          </Typography>
          
          <Box display="flex" alignItems="center" gap={2}>
            {/* Quick Stats */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2, mr: 2 }}>
              <Chip
                label="Admin Portal"
                size="small"
                sx={{
                  background: 'rgba(212,175,55,0.2)',
                  color: '#D4AF37',
                  '& .MuiChip-icon': { color: '#D4AF37' }
                }}
              />
            </Box>
            
            {/* User Menu */}
            <Box>
              <IconButton 
                color="inherit" 
                onClick={handleMenuOpen}
                sx={{
                  '&:hover': {
                    background: 'rgba(212,175,55,0.2)'
                  }
                }}
              >
                <Avatar sx={{ 
                  width: 32, 
                  height: 32,
                  background: 'linear-gradient(135deg, #D4AF37, #B88917)'
                }}>
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    background: 'linear-gradient(135deg, #0F172A, #111111)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: 2,
                    mt: 1
                  }
                }}
              >
                <MenuItem onClick={() => { navigate('/admin/profile'); handleMenuClose(); }} sx={{ color: '#fff' }}>
                  <AccountCircleIcon sx={{ mr: 1, color: '#D4AF37' }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { navigate('/admin/settings'); handleMenuClose(); }} sx={{ color: '#fff' }}>
                  <SettingsIcon sx={{ mr: 1, color: '#D4AF37' }} />
                  Settings
                </MenuItem>
                <Divider sx={{ borderColor: 'rgba(212,175,55,0.2)' }} />
                <MenuItem onClick={handleLogout} sx={{ color: '#e74c3c' }}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Desktop Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            mt: { xs: 7, sm: 8 },
            background: 'linear-gradient(135deg, #111111 0%, #1a2f38 100%)',
            borderRight: '1px solid rgba(212,175,55,0.2)',
            boxShadow: '2px 0 10px rgba(0,0,0,0.2)'
          },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 }, 
          mt: { xs: 7, sm: 8 },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #111111 0%, #0F172A 50%, #1A1A1A 100%)'
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </Container>
      </Box>

      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(245,245,245,0.05);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #D4AF37;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #B88917;
        }
      `}</style>
    </Box>
  );
};

export default Layout;
