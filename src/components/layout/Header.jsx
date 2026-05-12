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
import iesLogo from "../../assets/logo.png";
import { colors, branding } from "../../data/constants";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "About", icon: <InfoIcon />, path: "/about" },
    { label: "Construction", icon: <ConstructionIcon />, path: "/services/construction-services" },
    { label: "Furniture", icon: <ChairIcon />, path: "/services/furniture-services" },
    { label: "Interior", icon: <EngineeringIcon />, path: "/services/interior-services" },
    { label: "Gallery", icon: <ImageIcon />, path: "/gallery" },
    { label: "Blog", icon: <ArticleIcon />, path: "/blogs" },
    { label: "Contact", icon: <CallIcon />, path: "/contact" },
  ];

  const mobileNavItems = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "Furniture", icon: <ChairIcon />, path: "/services/furniture-services" },
    { label: "Construction", icon: <ConstructionIcon />, path: "/services/construction-services" },
    { label: "Interior", icon: <EngineeringIcon />, path: "/services/interior-services" },
    { label: "About", icon: <InfoIcon />, path: "/about" },
    { label: "Contact", icon: <CallIcon />, path: "/contact" },
  ];

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

  // Responsive spacer height
  const getSpacerHeight = () => {
    if (isMobile) return "92px";  // Mobile header + announcement height
    if (isTablet) return "100px";  // Tablet header + announcement height
    return "108px";                 // Desktop header + announcement height
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
          py: 1,
          minHeight: { xs: "56px", sm: "64px", md: "72px" },
          px: { xs: 2, sm: 3, md: 4 }
        }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 1.5 },
              cursor: "pointer"
            }}
            onClick={() => handleNavigation("/")}
          >
            <Box
              component="img"
              src={iesLogo}
              alt="IES Logo"
              sx={{
                height: { xs: 32, sm: 36, md: 42 },
                width: { xs: 32, sm: 36, md: 42 },
                objectFit: "contain",
                borderRadius: 1
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
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" }
                }}
              >
                {branding.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: colors.secondary,
                  fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                  display: { xs: "none", sm: "block" }
                }}
              >
                {branding.tagline}
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation - Always visible on larger screens */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: { sm: 0.5, lg: 1.5 }, minWidth: 0 }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
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
            <Box component="span">Vishwakarma Build & Furnish CKD</Box>
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
              boxShadow: "0 -2px 10px rgba(0,0,0,0.1)"
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
