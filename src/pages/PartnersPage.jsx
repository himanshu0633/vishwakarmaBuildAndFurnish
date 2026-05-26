import { useEffect, useState } from 'react';
import { Box, Button, Chip, Container, Paper, Typography } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useNavigate } from 'react-router-dom';
import api, { getStaticAssetUrl } from '../../utils/axiosConfig';

export default function PartnersPage() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    api.get('/partners').then((res) => setPartners(res.data.data || []));
  }, []);

  return (
    <Box sx={{ bgcolor: '#111111', color: '#F5F5F5', minHeight: '70vh', py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#D4AF37', mb: 1 }}>
          Verified Partners
        </Typography>
        <Typography sx={{ color: 'rgba(245,245,245,0.75)', mb: 4 }}>
          Yahan sirf admin verified partners show honge. Partner card par click karke shop details, location aur service-wise products dekhein.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2.5 }}>
          {partners.map((partner) => {
            const image = partner.shopImages?.[0] || partner.productImages?.[0] || partner.products?.find(product => product.image)?.image || '';
            return (
              <Paper
                key={partner._id}
                onClick={() => navigate(`/partners/${partner._id}`)}
                sx={{
                  overflow: 'hidden',
                  bgcolor: '#0F172A',
                  color: '#F5F5F5',
                  border: '1px solid rgba(212,175,55,0.28)',
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#D4AF37', transform: 'translateY(-3px)' },
                  transition: '0.2s ease'
                }}
              >
                {image ? (
                  <Box component="img" src={getStaticAssetUrl(image)} alt={partner.shopName} sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <Box sx={{ aspectRatio: '16/10', display: 'grid', placeItems: 'center', bgcolor: '#111827' }}><StorefrontIcon sx={{ fontSize: 64, color: '#D4AF37' }} /></Box>
                )}
                <Box sx={{ p: 2 }}>
                  <Chip size="small" label={partner.status} sx={{ bgcolor: 'rgba(212,175,55,0.16)', color: '#D4AF37', mb: 1 }} />
                  <Typography variant="h6" fontWeight={900}>{partner.shopName}</Typography>
                  <Typography sx={{ color: 'rgba(245,245,245,0.72)' }}>{partner.ownerName}</Typography>
                  <Typography sx={{ color: 'rgba(245,245,245,0.72)', mt: 1 }}>{partner.shopAddress}</Typography>
                  <Typography sx={{ color: '#D4AF37', mt: 1, fontWeight: 800 }}>{partner.products?.length || 0} products</Typography>
                </Box>
              </Paper>
            );
          })}
        </Box>

        <Button variant="contained" onClick={() => navigate('/partner/register')} sx={{ mt: 4, bgcolor: '#D4AF37', color: '#111111', fontWeight: 900 }}>
          Become a Partner
        </Button>
      </Container>
    </Box>
  );
}
