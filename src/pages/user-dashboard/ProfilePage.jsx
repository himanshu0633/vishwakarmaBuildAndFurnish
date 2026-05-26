import { Grid, Paper, Typography, Avatar, Box, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import { useDashboard } from './DashboardContext';
import { Phone, WhatsApp, Email, LocationOn, Person, CalendarToday } from '@mui/icons-material';

export default function ProfilePage() {
  const { user } = useDashboard();

  // Helper function to format display of empty/undefined values
  const formatValue = (value) => {
    return value && value.trim() !== '' ? value : 'Not provided';
  };

  // Profile info items configuration
  const profileInfo = [
    { 
      icon: <Phone sx={{ color: '#1976d2' }} />, 
      label: 'Mobile Number', 
      value: user?.mobile,
      link: user?.mobile ? `tel:${user.mobile}` : null
    },
    { 
      icon: <WhatsApp sx={{ color: '#25D366' }} />, 
      label: 'WhatsApp Number', 
      value: user?.whatsappNumber,
      link: user?.whatsappNumber ? `https://wa.me/${user.whatsappNumber.replace(/\D/g, '')}` : null
    },
    { 
      icon: <Email sx={{ color: '#ea4335' }} />, 
      label: 'Email Address', 
      value: user?.email,
      link: user?.email ? `mailto:${user.email}` : null
    }
  ];

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 0, 
        overflow: 'hidden',
        borderRadius: 2,
        border: '1px solid #E2E8F0',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          boxShadow: 6
        }
      }}
    >
      {/* Header Section with Cover */}
      <Box
        sx={{
          height: 120,
          background: 'linear-gradient(135deg, #0F172A 0%, #111111 55%, #B88917 100%)',
          position: 'relative'
        }}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            position: 'absolute',
            bottom: -40,
            left: 24,
            border: '4px solid white',
            bgcolor: '#D4AF37',
            color: '#111111',
            boxShadow: 3
          }}
        >
          <Person sx={{ fontSize: 50 }} />
        </Avatar>
      </Box>

      {/* Profile Content */}
      <Box sx={{ p: 3, pt: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {user?.name || 'User Profile'}
            </Typography>
          <Chip 
              label="Active" 
              size="small" 
              sx={{ fontWeight: 900, bgcolor: '#ECFDF5', color: '#047857' }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Contact Information Grid */}
        <Grid container spacing={3}>
          {profileInfo.map((info, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ mt: 0.5 }}>{info.icon}</Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {info.label}
                  </Typography>
                  {info.link ? (
                    <Typography 
                      component="a" 
                      href={info.link}
                      sx={{ 
                        display: 'block',
                        color: 'text.primary',
                        fontWeight: 500,
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {formatValue(info.value)}
                    </Typography>
                  ) : (
                    <Typography fontWeight={500}>
                      {formatValue(info.value)}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          ))}

          {/* Address Section - Full Width */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <LocationOn sx={{ color: '#ff5722', mt: 0.5 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Address
                </Typography>
                <Typography fontWeight={500}>
                  {formatValue(user?.address)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Additional Stats or Information (Optional) */}
        {user?.memberSince && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <CalendarToday sx={{ color: 'text.secondary', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                Member since {new Date(user.memberSince).toLocaleDateString()}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
}
