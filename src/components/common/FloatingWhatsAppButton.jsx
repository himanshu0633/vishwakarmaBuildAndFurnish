import React from 'react';
import { Fab, Box } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const FloatingWhatsAppButton = () => {
  const handleClick = () => {
    const message = 'Hello Vishwakarma Build & Furnish, I want to discuss my requirement with your experts.';
    window.open(`https://wa.me/919416856468?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return null;
};

export default FloatingWhatsAppButton;
