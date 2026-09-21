import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import EngineeringIcon from '@mui/icons-material/Engineering';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import ChairIcon from '@mui/icons-material/Chair';
import ConstructionIcon from '@mui/icons-material/Construction';
import ImageIcon from '@mui/icons-material/Image';
import CallIcon from '@mui/icons-material/Call';
import ArticleIcon from '@mui/icons-material/Article';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import iesLogo from "../../assets/logo.png";
import { colors, branding } from "../../data/constants";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [accountAnchor, setAccountAnchor] = useState(null);

  const isClientUser = user?.role === "client" || Boolean(user?.clientId);

  const accountPath = user?.role === "admin"
    ? "/admin/clients"
    : user?.role === "partner"
      ? "/partner/dashboard"
      : isClientUser
        ? "/dashboard/project"
        : "/dashboard";

  const accountLabel = user?.role === "admin"
    ? "Admin Panel"
    : user?.role === "partner"
      ? "Partner"
      : isClientUser
        ? "Client Dashboard"
        : "Profile";

  const baseNavItems = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "About", icon: <InfoIcon />, path: "/about" },
    { label: "Construction", icon: <ConstructionIcon />, path: "/services/construction-services" },
    { label: "Wooden Work", icon: <ChairIcon />, path: "/services/wooden-work-services" },
    { label: "Interior", icon: <EngineeringIcon />, path: "/services/interior-services" },
    { label: "Build Guide", icon: <EngineeringIcon />, path: "/house-construction-guide" },
    { label: "Gallery", icon: <ImageIcon />, path: "/gallery" },
    // { label: "Blog", icon: <ArticleIcon />, path: "/blogs" },
    // { label: "Partners", icon: <StorefrontIcon />, path: "/partners" },
    { label: "Contact", icon: <CallIcon />, path: "/contact" },
  ];

  const navItems = user
    ? [...baseNavItems, { label: accountLabel, icon: <AccountCircleIcon />, path: accountPath, account: true }]
    : [...baseNavItems, { label: "Client Portal", icon: <AccountCircleIcon />, path: "/loginuser", loginBtn: true }];

  const mobileBaseNavItems = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "Construction", icon: <ConstructionIcon />, path: "/services/construction-services" },
    { label: "Wooden Work", icon: <ChairIcon />, path: "/services/wooden-work-services" },
    { label: "Interior", icon: <EngineeringIcon />, path: "/services/interior-services" },
    { label: "Gallery", icon: <ImageIcon />, path: "/gallery" },
    { label: "About", icon: <InfoIcon />, path: "/about" },
    { label: "Contact", icon: <CallIcon />, path: "/contact" },
  ];

  const mobileNavItems = user
    ? [...mobileBaseNavItems.slice(0, 4), { label: isClientUser ? "Client Portal" : accountLabel, icon: <AccountCircleIcon />, path: accountPath }]
    : [...mobileBaseNavItems.slice(0, 4), { label: "Client Portal", icon: <AccountCircleIcon />, path: "/loginuser" }];

  // Get current active route index
  const getActiveRouteIndex = (items = navItems) => {
    const currentPath = location.pathname;
    const index = items.findIndex(item => item.path === currentPath || currentPath.startsWith(item.path + "/"));
    return index !== -1 ? index : 0;
  };

  const [mobileNavValue, setMobileNavValue] = useState(getActiveRouteIndex(mobileNavItems));

  // Update active state when route changes
  useEffect(() => {
    setMobileNavValue(getActiveRouteIndex(mobileNavItems));
  }, [location.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setAccountAnchor(null);
    navigate("/");
  };

  // Responsive spacer height
  const getSpacerHeight = () => {
    if (isMobile) return "104px";  // Mobile header + announcement height
    if (isTablet) return "112px";  // Tablet header + announcement height
    return "144px";                 // Desktop header + announcement height
  };

  return (
    <>
      {/* Fixed Header */}
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: colors.primary,
          borderBottom: `1px solid ${colors.secondary}4D`,
          boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
          zIndex: 1100
        }}
      >
        <Toolbar sx={{
          justifyContent: "space-between",
          py: { xs: 1.1, sm: 1.25, md: 1.4 },
          minHeight: { xs: "68px", sm: "76px", md: "108px" },
          px: { xs: 2, sm: 3, md: 4 }
        }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.2, sm: 1.6, md: 2 },
              cursor: "pointer"
            }}
            onClick={() => handleNavigation("/")}
          >
            <Box
              component="img"
              src={iesLogo}
              alt="IES Logo"
              title="Vishwakarma Build & Furnish Logo"
              sx={{
                height: { xs: 48, sm: 56, md: 88 },
                width: { xs: 48, sm: 56, md: 88 },
                objectFit: "contain",
                borderRadius: 1.2,
                flexShrink: 0
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  lineHeight: 1.2,
                  color: colors.light,
                  fontSize: { xs: "0.95rem", sm: "1.08rem", md: "1.35rem" }
                }}
              >
                {branding.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: colors.secondary,
                  fontSize: { xs: "0.68rem", sm: "0.75rem", md: "0.82rem" },
                  display: { xs: "none", sm: "block" }
                }}
              >
                {branding.tagline}
              </Typography>
            </Box>
          </Box>

          {/* Mobile Right Action */}
          {isMobile && (
            <Button
              onClick={() => handleNavigation(user ? accountPath : "/loginuser")}
              sx={{
                background: "linear-gradient(135deg, #F3E5AB 0%, #D4AF37 55%, #AA7C11 100%)",
                color: "#0F172A",
                fontSize: "0.74rem",
                fontWeight: 900,
                textTransform: "none",
                py: 0.5,
                px: 1.4,
                borderRadius: "20px",
                border: "1px solid rgba(243, 229, 171, 0.7)",
                boxShadow: "0 2px 8px rgba(212,175,55,0.3)",
                whiteSpace: "nowrap",
                flexShrink: 0
              }}
            >
              {user ? (isClientUser ? "🏗️ Project" : "Dashboard") : "🔑 Portal"}
            </Button>
          )}

          {/* Desktop Navigation - Always visible on larger screens */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: { sm: 0.4, md: 0.6, lg: 1.2 }, minWidth: 0 }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                if (item.account && user) {
                  return (
                    <Button
                      key={item.label}
                      onClick={(event) => setAccountAnchor(event.currentTarget)}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        background: "linear-gradient(135deg, #F3E5AB 0%, #D4AF37 55%, #AA7C11 100%)",
                        color: "#0F172A",
                        border: "1px solid rgba(243, 229, 171, 0.8)",
                        borderRadius: "24px",
                        fontSize: { md: "0.78rem", lg: "0.85rem" },
                        fontWeight: 900,
                        textTransform: "none",
                        px: { md: 1.2, lg: 1.6 },
                        py: 0.55,
                        height: 38,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        boxShadow: "0 3px 12px rgba(212, 175, 55, 0.35)",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          background: "linear-gradient(135deg, #FFFFFF 0%, #E2C044 55%, #B8860B 100%)",
                          boxShadow: "0 6px 18px rgba(212, 175, 55, 0.5)",
                          transform: "translateY(-1px)"
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: "#0F172A",
                          color: "#D4AF37",
                          fontSize: 12,
                          fontWeight: 900,
                          border: "1.5px solid rgba(212, 175, 55, 0.8)"
                        }}
                      >
                        {user.name?.charAt(0)?.toUpperCase() || "C"}
                      </Avatar>
                      <Typography
                        component="span"
                        sx={{
                          color: "#0F172A",
                          fontWeight: 900,
                          fontSize: { md: "0.78rem", lg: "0.85rem" },
                          letterSpacing: "0.2px",
                          whiteSpace: "nowrap",
                          lineHeight: 1
                        }}
                      >
                        {item.label}
                      </Typography>
                      <KeyboardArrowDownIcon
                        sx={{
                          fontSize: 18,
                          color: "#0F172A",
                          transition: "transform 0.2s",
                          transform: accountAnchor ? "rotate(180deg)" : "none",
                          ml: -0.3
                        }}
                      />
                    </Button>
                  );
                }

                if (item.loginBtn && !user) {
                  return (
                    <Button
                      key={item.label}
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        color: "#0F172A",
                        background: "linear-gradient(135deg, #F3E5AB 0%, #D4AF37 55%, #AA7C11 100%)",
                        border: "1px solid rgba(243, 229, 171, 0.8)",
                        borderRadius: "24px",
                        fontSize: { md: "0.78rem", lg: "0.85rem" },
                        fontWeight: 900,
                        textTransform: "none",
                        px: { md: 1.4, lg: 1.8 },
                        py: 0.55,
                        height: 38,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        boxShadow: "0 3px 12px rgba(212, 175, 55, 0.35)",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          background: "linear-gradient(135deg, #FFFFFF 0%, #E2C044 55%, #B8860B 100%)",
                          boxShadow: "0 6px 18px rgba(212, 175, 55, 0.45)",
                          transform: "translateY(-1px)"
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                }

                return (
                  <Button
                    key={item.label}
                    sx={{
                      color: isActive ? colors.secondary : colors.light,
                      borderBottom: isActive ? `2px solid ${colors.secondary}` : "none",
                      borderRadius: 0,
                      fontSize: { md: "0.78rem", lg: "0.9rem" },
                      minWidth: "auto",
                      px: { md: 0.9, lg: 1.2 },
                      "&:hover": {
                        color: colors.secondary,
                        backgroundColor: "rgba(212,175,55,0.1)",
                        borderBottom: `2px solid ${colors.secondary}`,
                      }
                    }}
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.label}
                  </Button>
                );
              })}
              <Menu
                anchorEl={accountAnchor}
                open={Boolean(accountAnchor)}
                onClose={() => setAccountAnchor(null)}
                PaperProps={{
                  sx: {
                    mt: 1,
                    bgcolor: "#0F172A",
                    color: "#F8FAFC",
                    border: "1.5px solid rgba(212,175,55,0.35)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
                    minWidth: 220
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1.2, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <Typography sx={{ fontWeight: 800, fontSize: "14px", color: "#FACC15" }}>
                    {user?.name || "Client"}
                  </Typography>
                  <Typography sx={{ fontSize: "12px", color: "#94A3B8" }}>
                    {user?.email}
                  </Typography>
                </Box>
                <MenuItem
                  onClick={() => { navigate(accountPath); setAccountAnchor(null); }}
                  sx={{
                    py: 1.2,
                    fontWeight: 700,
                    color: "#FFFFFF",
                    "&:hover": { bgcolor: "rgba(212,175,55,0.15)", color: "#FACC15" }
                  }}
                >
                  <DashboardIcon sx={{ mr: 1.2, color: "#D4AF37", fontSize: 20 }} />
                  {isClientUser ? "Client Dashboard" : `${accountLabel} Dashboard`}
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    py: 1.2,
                    fontWeight: 700,
                    color: "#F87171",
                    "&:hover": { bgcolor: "rgba(239,68,68,0.15)", color: "#EF4444" }
                  }}
                >
                  <LogoutIcon sx={{ mr: 1.2, fontSize: 20 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>

        <Box
          sx={{
            height: 36,
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            bgcolor: "#0F172A",
            borderTop: "1px solid rgba(212,175,55,0.22)",
            borderBottom: "1px solid rgba(212,175,55,0.32)",
            position: "relative",
            "&:before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, #0F172A 0%, transparent 10%, transparent 90%, #0F172A 100%)",
              zIndex: 2,
              pointerEvents: "none"
            }
          }}
        >
          <Typography
            key={location.pathname}
            component="div"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              minWidth: "100%",
              justifyContent: "center",
              whiteSpace: "nowrap",
              color: colors.light,
              fontWeight: 800,
              fontSize: { xs: "0.72rem", sm: "0.8rem", md: "0.9rem" },
              animation: "announcementMarquee 29s linear infinite",
              pr: 4,
              "& span": { color: colors.secondary },
              "@keyframes announcementMarquee": {
                "0%": { transform: "translateX(0)" },
                "17%": { transform: "translateX(0)" },
                "100%": { transform: "translateX(-100%)" }
              }
            }}
          >
            <Box component="span">Premium Deal Alert</Box>
            Every project is customized, so pricing depends on the quality, design, and scope of work selected by the client. We give you the best deal in every service.
            <Box component="span">Vishwakarma Build & Furnish</Box>
          </Typography>
        </Box>
      </AppBar>

      {/* Responsive Spacer to prevent content from hiding under fixed header */}
      <Box sx={{ height: getSpacerHeight() }} />

      {/* Mobile Bottom Navigation - Only visible on mobile */}
      {isMobile && (
        <>
          <Paper 
            sx={{ 
              position: 'fixed', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              zIndex: 1100,
              bgcolor: colors.primary,
              borderTop: `1px solid ${colors.secondary}4D`,
              borderRadius: 0,
              boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }} 
            elevation={3}
          >
            <BottomNavigation
              showLabels
              value={mobileNavValue}
              onChange={(event, newValue) => {
                setMobileNavValue(newValue);
                handleNavigation(mobileNavItems[newValue].path);
              }}
              sx={{
                bgcolor: colors.primary,
                height: { xs: "64px", sm: "66px" },
                overflow: "hidden",
                justifyContent: "space-between",
                px: 0,
                '& .MuiBottomNavigationAction-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  flex: "1 1 0",
                  minWidth: 0,
                  maxWidth: "none",
                  px: 0.2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: colors.secondary,
                    transform: 'translateY(-2px)',
                  },
                  '&.Mui-selected': {
                    color: colors.secondary,
                    transform: 'translateY(-2px)',
                  },
                },
                '& .MuiBottomNavigationAction-label': {
                  width: "100%",
                  fontSize: { xs: '9px', sm: '10px' },
                  lineHeight: 1.1,
                  whiteSpace: "normal",
                  overflowWrap: "anywhere",
                  '&.Mui-selected': {
                    fontSize: { xs: '9px', sm: '10px' },
                  },
                },
              }}
            >
              {mobileNavItems.map((item) => (
                <BottomNavigationAction 
                  key={item.label} 
                  label={item.label} 
                  icon={item.icon}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: { xs: '20px', sm: '22px' },
                    },
                  }}
                />
              ))}
            </BottomNavigation>
          </Paper>

          {/* Add padding at bottom for mobile to prevent content from hiding under bottom navigation */}
          {/* <Box sx={{ height: "65px" }} /> */}
        </>
      )}
    </>
  );
};

export default Header;
