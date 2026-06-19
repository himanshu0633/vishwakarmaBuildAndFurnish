import React from 'react';
import { Button } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const FloatingWhatsAppButton = () => {
  const handleClick = () => {
    const message = 'Hello Vishwakarma Build & Furnish, I want to discuss my requirement with your experts.';
    window.open(`https://wa.me/919416856468?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      variant="contained"
      startIcon={<WhatsAppIcon />}
      onClick={handleClick}
      aria-label="Discuss with our experts on WhatsApp"
      sx={{
        position: 'fixed',
        right: { xs: 12, sm: 20, md: 28 },
        bottom: { xs: 86, sm: 26, md: 30 },
        zIndex: 1300,
        bgcolor: '#25D366',
        color: '#07130B',
        borderRadius: '999px',
        px: { xs: 1.7, sm: 2.3 },
        py: { xs: 1.1, sm: 1.25 },
        minHeight: 48,
        maxWidth: { xs: 'calc(100vw - 24px)', sm: 320 },
        fontWeight: 900,
        fontSize: { xs: '0.78rem', sm: '0.92rem' },
        lineHeight: 1.2,
        textTransform: 'none',
        boxShadow: '0 14px 34px rgba(37, 211, 102, 0.35)',
        border: '1px solid rgba(255,255,255,0.28)',
        whiteSpace: 'normal',
        textAlign: 'left',
        '& .MuiButton-startIcon': {
          mr: { xs: 0.8, sm: 1 },
          '& svg': { fontSize: { xs: 22, sm: 24 } }
        },
        '&:hover': {
          bgcolor: '#1EBE5D',
          boxShadow: '0 16px 38px rgba(37, 211, 102, 0.44)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      Discuss with our experts
    </Button>
  );
};

export default FloatingWhatsAppButton;
