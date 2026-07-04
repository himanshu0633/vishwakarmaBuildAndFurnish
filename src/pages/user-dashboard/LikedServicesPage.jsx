import { Box, Button, Chip, IconButton, Paper, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ShareIcon from '@mui/icons-material/Share';
import { useNavigate } from 'react-router-dom';
import { getStaticAssetUrl } from '../../../utils/axiosConfig';
import { useDashboard } from './DashboardContext';
import EmptyState from './EmptyState';

export default function LikedServicesPage() {
  const navigate = useNavigate();
  const { likes, setMessage } = useDashboard();

  const shareService = async (service) => {
    const url = `${window.location.origin}/services/${service.slug}`;
    if (navigator.share) {
      await navigator.share({ title: service.name, text: `Check this service: ${service.name}`, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    setMessage('Service link copied.');
  };

  if (!likes?.length) {
    return (
      <EmptyState
        icon={<FavoriteBorderIcon />}
        title="No liked services yet"
        subtitle="Liked services will appear here for quick access."
        actionLabel="Browse Services"
        onAction={() => navigate('/services')}
      />
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography fontWeight={900} sx={{ color: '#0F172A' }}>{likes.length} liked services</Typography>
          <Typography sx={{ color: '#64748B' }}>Open and share the services you are interested in.</Typography>
        </Box>
        <Button variant="outlined" onClick={() => navigate('/services')}>Explore More</Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
        {likes.map((like) => {
          const service = like.service || {};
          const image = like.imageUrl || service.heroImage || service.images?.[0] || '';
          return (
            <Paper key={like._id} sx={{ overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
              <Box sx={{ position: 'relative', bgcolor: '#0F172A' }}>
                {image ? (
                  <Box component="img" src={getStaticAssetUrl(image)} alt={service.name} sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <Box sx={{ aspectRatio: '16/10', display: 'grid', placeItems: 'center', color: '#D4AF37' }}><FavoriteIcon sx={{ fontSize: 60 }} /></Box>
                )}
                <Chip icon={<FavoriteIcon />} label="Liked" size="small" sx={{ position: 'absolute', top: 10, left: 10, bgcolor: '#D4AF37', color: '#111111', fontWeight: 900 }} />
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight={900} sx={{ color: '#0F172A', mb: 0.5 }}>{service.name || 'Service'}</Typography>
                <Typography sx={{ color: '#64748B', minHeight: 44 }}>{service.shortDescription || service.priceStarting || 'Service details available on service page.'}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography sx={{ color: '#64748B', fontSize: 13 }}>Liked {new Date(like.createdAt).toLocaleDateString()}</Typography>
                  <Box>
                    <IconButton onClick={() => shareService(service)}><ShareIcon /></IconButton>
                    <IconButton onClick={() => navigate(`/services/${service.categoryId?.slug || "wooden-work-services"}/${service.slug}`)}><OpenInNewIcon /></IconButton>
                  </Box>
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
