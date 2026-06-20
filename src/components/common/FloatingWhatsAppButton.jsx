import React from 'react';
import { Fab, Box } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const FloatingWhatsAppButton = () => {
  const handleClick = () => {
    const message = 'Hello Vishwakarma Build & Furnish, I want to discuss my requirement with your experts.';
    window.open(`https://wa.me/919416856468?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        right: { xs: 16, sm: 24, md: 32 },
        bottom: { xs: 80, sm: 24, md: 30 },
        zIndex: 1300,
      }}
    >
      <Fab
        onClick={handleClick}
        aria-label="Chat on WhatsApp"
        sx={{
          bgcolor: '#25D366',
          color: '#FFF',
          width: 56,
          height: 56,
          boxShadow: '0 10px 30px rgba(37, 211, 102, 0.4)',
          transition: 'transform 0.3s ease',
          animation: 'pulseWhatsApp 2s infinite',
          '&:hover': {
            bgcolor: '#1EBE5D',
            transform: 'scale(1.1)'
          },
          '& svg': {
            fontSize: 32
          }
        }}
      >
        <WhatsAppIcon />
      </Fab>

      <style>{`
        @keyframes pulseWhatsApp {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.6);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }
      `}</style>
    </Box>
  );
};

export default FloatingWhatsAppButton;
