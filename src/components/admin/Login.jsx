// frontend/src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Link,
  IconButton,
  InputAdornment,
  Divider,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BusinessIcon from '@mui/icons-material/Business';
import SecurityIcon from '@mui/icons-material/Security';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FactoryIcon from '@mui/icons-material/Factory';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('savedEmail', email);
      } else {
        localStorage.removeItem('savedEmail');
      }
      navigate('/admin/tenders');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleDemoLogin = () => {
    setEmail('admin@industrialsolutions.com');
    setPassword('Admin@2026');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #111111 0%, #0F172A 50%, #1A1A1A 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Industrial Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0
      }}>
        {/* Rotating Gears */}
        <Box sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '150px',
          height: '150px',
          opacity: 0.1,
          animation: 'rotate 20s linear infinite'
        }}>
          <EngineeringIcon sx={{ fontSize: 150, color: '#fff' }} />
        </Box>
        <Box sx={{
          position: 'absolute',
          bottom: '15%',
          right: '5%',
          width: '200px',
          height: '200px',
          opacity: 0.1,
          animation: 'rotateReverse 25s linear infinite'
        }}>
          <FactoryIcon sx={{ fontSize: 200, color: '#fff' }} />
        </Box>
        
        {/* Floating Circles */}
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
              background: `radial-gradient(circle, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0) 70%)`,
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </Box>

      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes rotateReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-3deg); }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={scaleIn}
        style={{ width: '100%', maxWidth: '450px', margin: '0 16px', zIndex: 1 }}
      >
        <Card 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.98)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
            boxShadow: isHovered 
              ? '0 30px 60px rgba(0,0,0,0.3)' 
              : '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          {/* Animated Header with Gradient */}
          <Box sx={{
            background: 'linear-gradient(135deg, #0F172A 0%, #111111 100%)',
            p: 4,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Animated Overlay */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(245,245,245,0.1), transparent)',
              transform: 'translateX(-100%)',
              animation: 'gradientShift 3s infinite',
              pointerEvents: 'none'
            }} />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <Box sx={{
                width: 80,
                height: 80,
                margin: '0 auto 16px',
                background: 'rgba(212,175,55,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)'
              }}>
                <AdminPanelSettingsIcon sx={{ fontSize: 50, color: '#D4AF37' }} />
              </Box>
            </motion.div>
            
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 'bold', 
              color: 'white',
              mb: 1,
              fontSize: { xs: '1.75rem', sm: '2rem' }
            }}>
              Admin Portal
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(245,245,245,0.85)' }}>
              Vishwakarma Build & Furnish
            </Typography>
          </Box>

          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <motion.div variants={fadeInUp}>
              {/* Stats Badges */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 1.5, 
                mb: 3,
                flexWrap: 'wrap'
              }}>
                <Chip
                  icon={<SecurityIcon sx={{ fontSize: 16 }} />}
                  label="Secure Access"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(212,175,55,0.1)',
                    color: '#D4AF37',
                    fontWeight: 500,
                    '& .MuiChip-icon': { color: '#D4AF37' }
                  }}
                />
                <Chip
                  icon={<DashboardIcon sx={{ fontSize: 16 }} />}
                  label="Full Control"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(212,175,55,0.1)',
                    color: '#D4AF37',
                    fontWeight: 500,
                    '& .MuiChip-icon': { color: '#D4AF37' }
                  }}
                />
              </Box>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Alert 
                      severity="error" 
                      sx={{ mb: 3, borderRadius: 2 }}
                      onClose={() => setError('')}
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  required
                  autoComplete="email"
                  placeholder="admin@industrialsolutions.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: '#D4AF37' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: '#D4AF37',
                        borderWidth: 2
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#D4AF37',
                        borderWidth: 2
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#D4AF37'
                    }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: '#D4AF37' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          size="small"
                          sx={{ color: '#D4AF37' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: '#D4AF37',
                        borderWidth: 2
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#D4AF37',
                        borderWidth: 2
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#D4AF37'
                    }
                  }}
                />

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mt: 2,
                  mb: 3
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ 
                        marginRight: '8px', 
                        cursor: 'pointer',
                        accentColor: '#D4AF37'
                      }}
                    />
                    <label htmlFor="rememberMe" style={{ fontSize: '0.875rem', color: '#666', cursor: 'pointer' }}>
                      Remember me
                    </label>
                  </Box>
                  <Link 
                    href="#" 
                    underline="hover" 
                    sx={{ 
                      fontSize: '0.875rem', 
                      color: '#D4AF37',
                      cursor: 'pointer',
                      fontWeight: 500,
                      '&:hover': { color: '#B88917' }
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                    mb: 2, 
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #D4AF37, #B88917)',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(245,245,245,0.3), transparent)',
                      transition: 'left 0.5s ease'
                    },
                    '&:hover::before': {
                      left: '100%'
                    },
                    '&:hover': {
                      background: 'linear-gradient(135deg, #B88917, #D4AF37)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(212,175,55,0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : (
                    <>
                      <LoginIcon sx={{ mr: 1 }} />
                      Login to Dashboard
                    </>
                  )}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleDemoLogin}
                  sx={{
                    mb: 3,
                    py: 1.2,
                    borderRadius: 2,
                    borderColor: '#D4AF37',
                    color: '#D4AF37',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#B88917',
                      backgroundColor: 'rgba(212,175,55,0.08)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  🔑 Use Demo Credentials
                </Button>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="caption" sx={{ color: '#999', fontWeight: 500 }}>
                    Demo Credentials
                  </Typography>
                </Divider>

                <Box sx={{ 
                  bgcolor: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
                  p: 2.5, 
                  borderRadius: 2,
                  border: '1px solid #e9ecef'
                }}>
                  <Box sx={{ mb: 1.5, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 600, mb: 1 }}>
                      Quick Login for Testing
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center',
                      gap: 2,
                      flexWrap: 'wrap'
                    }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#666' }}>Email:</Typography>
                        <Typography variant="body2" sx={{ color: '#D4AF37', fontWeight: 500, fontFamily: 'monospace' }}>
                          admin@industrialsolutions.com
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#666' }}>Password:</Typography>
                        <Typography variant="body2" sx={{ color: '#D4AF37', fontWeight: 500, fontFamily: 'monospace' }}>
                          Admin@2026
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </form>

              {/* Footer Note */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#999', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <BusinessIcon sx={{ fontSize: 14 }} />
                  Vishwakarma Build & Furnish Admin Portal
                </Typography>
              </Box>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Login;