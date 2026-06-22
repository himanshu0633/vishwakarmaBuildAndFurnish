import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, Container, Paper, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useParams } from 'react-router-dom';
import api, { getStaticAssetUrl } from '../../utils/axiosConfig';

export default function PartnerDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/partners/${id}`).then((res) => setData(res.data.data));
  }, [id]);

  const partner = data?.partner;
  const groupedProducts = useMemo(() => {
    return (partner?.products || []).reduce((groups, product) => {
      const key = product.serviceName || 'Other Products';
      groups[key] = [...(groups[key] || []), product];
      return groups;
    }, {});
  }, [partner]);

  if (!partner) {
    return <Box sx={{ bgcolor: '#111111', color: '#fff', minHeight: '70vh', p: 4 }}>Loading partner details...</Box>;
  }

  const heroImage = partner.shopImages?.[0] || partner.productImages?.[0] || partner.products?.find(product => product.image)?.image || '';
  const location = partner.currentLocation || {};
  const mapsHref = location.lat && location.lng
    ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
    : undefined;

  return (
    <Box sx={{ bgcolor: '#111111', color: '#F5F5F5', minHeight: '70vh' }}>
      <Box sx={{
        minHeight: { xs: 360, md: 470 },
        display: 'flex',
        alignItems: 'end',
        background: heroImage
          ? `linear-gradient(180deg, rgba(17,17,17,0.2), rgba(17,17,17,0.92)), url("${getStaticAssetUrl(heroImage)}") center/cover no-repeat`
          : 'linear-gradient(135deg, #111111, #0F172A)',
        borderBottom: '1px solid rgba(212,175,55,0.28)'
      }}>
        <Container sx={{ py: 5 }}>
          <Chip label={partner.status} sx={{ bgcolor: 'rgba(212,175,55,0.18)', color: '#D4AF37', mb: 2 }} />
          <Typography variant="h2" sx={{ fontWeight: 900, color: '#fff' }}>{partner.shopName}</Typography>
          <Typography sx={{ color: 'rgba(245,245,245,0.8)', fontSize: '1.1rem' }}>{partner.ownerName}</Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.8fr 1.2fr' }, gap: 3, mb: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={900} mb={2}>Shop Details</Typography>
            <Info icon={<PhoneIcon />} label="Mobile" value={partner.mobile} />
            <Info icon={<WhatsAppIcon />} label="WhatsApp" value={partner.whatsappNumber} />
            <Info icon={<LocationOnIcon />} label="Address" value={partner.shopAddress} />
            {(location.lat || location.lng) && <Typography sx={{ mt: 1 }}>Lat: {location.lat || '-'} • Lng: {location.lng || '-'}</Typography>}
            {mapsHref && <Button href={mapsHref} target="_blank" rel="noopener noreferrer" sx={{ mt: 2 }}>Open Location</Button>}
          </Paper>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={900} mb={2}>Services</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(partner.productsServices || []).map(service => <Chip key={service} label={service} />)}
            </Box>
          </Paper>
        </Box>

        {Object.entries(groupedProducts).map(([serviceName, products]) => (
          <Box key={serviceName} sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#D4AF37', mb: 2 }}>{serviceName}</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
              {products.map(product => (
                <Paper key={product._id} sx={{ overflow: 'hidden', bgcolor: '#0F172A', color: '#F5F5F5', border: '1px solid rgba(212,175,55,0.22)' }}>
                  {product.image && <Box component="img" src={getStaticAssetUrl(product.image)} alt={product.name} title={product.name} sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', display: 'block' }} />}
                  <Box sx={{ p: 2 }}>
                    <Typography fontWeight={900}>{product.name}</Typography>
                    <Typography sx={{ color: 'rgba(245,245,245,0.72)', mt: 1 }}>{product.description}</Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        ))}
      </Container>
    </Box>
  );
}

function Info({ icon, label, value }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 1.5 }}>
      <Box sx={{ color: '#D4AF37', mt: 0.2 }}>{icon}</Box>
      <Box>
        <Typography fontWeight={900}>{label}</Typography>
        <Typography>{value || '-'}</Typography>
      </Box>
    </Box>
  );
}
