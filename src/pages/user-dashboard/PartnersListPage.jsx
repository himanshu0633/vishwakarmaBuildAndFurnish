import { Box, Button, Chip, Paper, Typography } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useNavigate } from 'react-router-dom';
import { getStaticAssetUrl } from '../../../utils/axiosConfig';
import { useDashboard } from './DashboardContext';
import EmptyState from './EmptyState';

export default function PartnersListPage() {
  const navigate = useNavigate();
  const { partners } = useDashboard();

  if (!partners?.length) {
    return (
      <EmptyState
        icon={<StorefrontIcon />}
        title="No verified partners"
        subtitle="Partners will appear here after admin verification."
      />
    );
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
      {partners.map((partner) => {
        const image = partner.shopImages?.[0] || partner.productImages?.[0] || partner.products?.find(product => product.image)?.image || '';
        return (
          <Paper key={partner._id} sx={{ overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            {image ? (
              <Box component="img" src={getStaticAssetUrl(image)} alt={partner.shopName} sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', display: 'block' }} />
            ) : (
              <Box sx={{ aspectRatio: '16/10', display: 'grid', placeItems: 'center', bgcolor: '#0F172A', color: '#D4AF37' }}><StorefrontIcon sx={{ fontSize: 64 }} /></Box>
            )}
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'start', mb: 1 }}>
                <Typography variant="h6" fontWeight={900} sx={{ color: '#0F172A' }}>{partner.shopName}</Typography>
                <Chip size="small" label={partner.status} color={partner.status === 'Verified' ? 'success' : 'warning'} />
              </Box>
              <Typography sx={{ color: '#334155', fontWeight: 800 }}>{partner.ownerName}</Typography>
              <Typography sx={{ color: '#64748B', mt: 0.5, minHeight: 42 }}>{partner.shopAddress}</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 1.5 }}>
                {(partner.productsServices || []).slice(0, 3).map(service => <Chip key={service} size="small" label={service} />)}
              </Box>
              <Button fullWidth variant="contained" onClick={() => navigate(`/partners/${partner._id}`)} sx={{ bgcolor: '#D4AF37', color: '#111111', fontWeight: 900, '&:hover': { bgcolor: '#B88917' } }}>
                View Partner
              </Button>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
}
