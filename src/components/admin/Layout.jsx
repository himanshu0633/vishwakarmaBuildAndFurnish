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
  Avatar,
  Menu,
  MenuItem,
  Divider,
  InputBase,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Category as CategoryIcon,
  Build as ServicesIcon,
  Assignment as InquiriesIcon,
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Business as BusinessIcon,
  Collections as MediaIcon,
  Article as ArticleIcon,
  Settings as SettingsIcon,
  Campaign as CampaignIcon,
  Engineering as ClientsIcon,
  Inventory2 as MaterialsIcon,
  Search as SearchIcon,
  NotificationsNone as NotificationsIcon,
  ExitToApp as LogoutIcon,
  HomeWork as HomeWorkIcon
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
    { text: 'Clients & Projects', icon: <ClientsIcon />, path: 'clients' },
    { text: 'Materials Catalog', icon: <MaterialsIcon />, path: 'materials' },
    { text: 'Categories', icon: <CategoryIcon />, path: 'categories' },
    { text: 'Services', icon: <ServicesIcon />, path: 'services' },
    { text: 'Service Media', icon: <MediaIcon />, path: 'service-media' },
    { text: 'Blogs', icon: <ArticleIcon />, path: 'blogs' },
    { text: 'About Page', icon: <BusinessIcon />, path: 'about-page' },
    { text: 'Gallery', icon: <MediaIcon />, path: 'gallery' },
    { text: 'Website Popups', icon: <CampaignIcon />, path: 'popups' },
    { text: 'Inquiries', icon: <InquiriesIcon />, path: 'inquiries' },
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

  const drawerWidth = 250;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0a0e17' }}>
      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: 1.5, pt: 1.5 }}>
        {menuItems.map((item) => {
          const isActive = currentPage === item.path || (item.path === 'clients' && (currentPage === '' || currentPage === 'clients' || currentPage.startsWith('clients/')));
          return (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ mb: 0.6, borderRadius: '10px', overflow: 'hidden' }}
            >
              <ListItemButton
                onClick={() => {
                  navigate(`/admin/${item.path}`);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: '10px',
                  py: 1,
                  px: 1.5,
                  background: isActive 
                    ? 'rgba(245, 183, 46, 0.14)'
                    : 'transparent',
                  border: isActive ? '1px solid rgba(245, 183, 46, 0.28)' : '1px solid transparent',
                  '&:hover': {
                    background: isActive ? 'rgba(245, 183, 46, 0.2)' : 'rgba(255, 255, 255, 0.04)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActive ? '#f5b72e' : '#8b949e',
                  minWidth: 36,
                  '& svg': { fontSize: 20 }
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#f5b72e' : '#8b949e',
                      fontSize: '0.86rem'
                    } 
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Promo Card at bottom of sidebar */}
      <Box sx={{ p: 2, m: 1.5, mb: 1.5, bgcolor: '#111726', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
        <Typography sx={{ fontSize: '1.2rem', mb: 0.5, lineHeight: 1 }}>👑</Typography>
        <Typography sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.84rem', lineHeight: 1.3 }}>
          Build Better
        </Typography>
        <Typography sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.84rem', lineHeight: 1.3 }}>
          Manage Smarter
        </Typography>
        <Typography sx={{ color: '#6e7681', fontSize: '0.72rem', mt: 0.8, lineHeight: 1.4 }}>
          From foundation to furniture we make it simple.
        </Typography>
      </Box>

      {/* Logout Button */}
      <Box sx={{ p: 1.5, px: 2, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: '10px',
            color: '#8b949e',
            py: 0.8,
            '&:hover': {
              color: '#ef4444',
              bgcolor: 'rgba(239, 68, 68, 0.08)'
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 34 }}>
            <LogoutIcon sx={{ fontSize: 19 }} />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            sx={{ 
              '& .MuiTypography-root': { 
                fontSize: '0.85rem',
                fontWeight: 600
              } 
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#0a0d14' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: '#0a0d14',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important', px: { xs: 2, sm: 3 }, gap: 2 }}>
          {/* Brand Logo & Title on the left */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: { md: 230 } }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                bgcolor: 'rgba(245, 183, 46, 0.15)',
                border: '1px solid rgba(245, 183, 46, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f5b72e'
              }}
            >
              <HomeWorkIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: '#ffffff', fontSize: '0.98rem', lineHeight: 1.15 }}>
                Vishwakarma
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#f5b72e', fontWeight: 600, letterSpacing: '0.4px' }}>
                Build & Furnish
              </Typography>
            </Box>
          </Box>

          {/* Toggle Button for Mobile or Desktop */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ color: '#8b949e', ml: { xs: 0, md: 1 }, mr: 1 }}
          >
            <MenuIcon sx={{ fontSize: 20 }} />
          </IconButton>
          
          {/* Global Search Bar */}
          <Box 
            sx={{ 
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '9px',
              px: 1.5,
              py: 0.5,
              width: { sm: 320, md: 400 },
              gap: 1
            }}
          >
            <SearchIcon sx={{ color: '#6e7681', fontSize: 18 }} />
            <InputBase
              placeholder="Search clients, projects, services, materials..."
              sx={{ 
                color: '#ffffff', 
                fontSize: '0.82rem', 
                flex: 1,
                '& ::placeholder': { color: '#6e7681', opacity: 1 }
              }}
            />
            <Box sx={{
              bgcolor: 'rgba(255, 255, 255, 0.06)',
              color: '#8b949e',
              fontSize: '0.68rem',
              fontWeight: 700,
              px: 0.7,
              py: 0.2,
              borderRadius: '5px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              ⌘ K
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          
          {/* Right Header items: Notifications & Admin Profile */}
          <Box display="flex" alignItems="center" gap={2}>
            {/* Notification Bell */}
            <IconButton 
              sx={{ 
                color: '#8b949e',
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                width: 36,
                height: 36,
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#fff' }
              }}
            >
              <Badge 
                badgeContent={3} 
                sx={{ 
                  '& .MuiBadge-badge': { 
                    bgcolor: '#ef4444', 
                    color: '#fff', 
                    fontSize: '0.62rem', 
                    height: 15, 
                    minWidth: 15,
                    fontWeight: 700
                  } 
                }}
              >
                <NotificationsIcon sx={{ fontSize: 19 }} />
              </Badge>
            </IconButton>

            {/* Admin Avatar & Profile Dropdown */}
            <Box 
              onClick={handleMenuOpen}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.2, 
                cursor: 'pointer',
                p: 0.5,
                pr: 1,
                borderRadius: '10px',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 34, 
                  height: 34,
                  bgcolor: '#f5b72e',
                  color: '#0a0d14',
                  fontWeight: 800,
                  fontSize: '0.9rem'
                }}
              >
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '0.84rem', lineHeight: 1.1 }}>
                  Admin
                </Typography>
                <Typography sx={{ color: '#6e7681', fontSize: '0.7rem', lineHeight: 1.1 }}>
                  Administrator
                </Typography>
              </Box>
            </Box>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  background: '#111625',
                  border: '1px solid rgba(245, 183, 46, 0.25)',
                  borderRadius: '10px',
                  mt: 1,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
                }
              }}
            >
              <MenuItem onClick={() => { navigate('/admin/profile'); handleMenuClose(); }} sx={{ color: '#fff', fontSize: '0.85rem' }}>
                <AccountCircleIcon sx={{ mr: 1, color: '#f5b72e', fontSize: 18 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate('/admin/settings'); handleMenuClose(); }} sx={{ color: '#fff', fontSize: '0.85rem' }}>
                <SettingsIcon sx={{ mr: 1, color: '#f5b72e', fontSize: 18 }} />
                Settings
              </MenuItem>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
              <MenuItem onClick={handleLogout} sx={{ color: '#ef4444', fontSize: '0.85rem' }}>
                <LogoutIcon sx={{ mr: 1, fontSize: 18 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar Drawer */}
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
            mt: '64px',
            height: 'calc(100% - 64px)',
            background: '#0a0e17',
            borderRight: '1px solid rgba(255, 255, 255, 0.06)'
          },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3, md: 3.5 }, 
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          background: '#0a0d14',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          overflowX: 'auto'
        }}
      >
        <Box sx={{ maxWidth: 1680, mx: 'auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>

          {/* Footer matching reference design */}
          <Box 
            sx={{ 
              mt: 5, 
              pt: 3, 
              pb: 2, 
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1.5,
              color: '#6e7681',
              fontSize: '0.8rem'
            }}
          >
            <Typography variant="body2" sx={{ color: '#6e7681', fontSize: '0.8rem' }}>
              © 2024 Vishwakarma Build & Furnish. All rights reserved.
            </Typography>
            <Typography variant="body2" sx={{ color: '#6e7681', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              Built with <span style={{ color: '#ef4444' }}>❤️</span> for Better Homes
            </Typography>
          </Box>
        </Box>
      </Box>

      <style>{`
        ::-webkit-scrollbar {
          width: 7px;
          height: 7px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0a0d14;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #1c2438;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #f5b72e;
        }
      `}</style>
    </Box>
  );
};

export default Layout;

