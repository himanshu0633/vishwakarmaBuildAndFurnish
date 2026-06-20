import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';
import axiosInstance from '../../../utils/axiosConfig';

const sectionLabels = {
  hero: 'Hero Section',
  history: 'Company History',
  quality: 'Material / Budget',
  factory: 'Factory / Trust',
  warranty: 'Quality Assurance',
  experience: 'Experience',
  cta: 'Contact CTA'
};

const photosToText = (items = []) =>
  items.map((item) => `${item.title || ''}|${item.image || ''}`).join('\n');

const textToPhotos = (value = '') =>
  value
    .split('\n')
    .map((line) => {
      const [title, ...imageParts] = line.split('|');
      return {
        title: String(title || '').trim(),
        image: imageParts.join('|').trim()
      };
    })
    .filter((item) => item.title || item.image);

const AboutContentManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState([]);
  const [workshopPhotos, setWorkshopPhotos] = useState('');
  const [teamPhotos, setTeamPhotos] = useState('');
  const [serviceAreas, setServiceAreas] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/about-content');
      const data = response.data.data || {};
      setSections(data.sections || []);
      setWorkshopPhotos(photosToText(data.workshopPhotos || []));
      setTeamPhotos(photosToText(data.teamPhotos || []));
      setServiceAreas((data.serviceAreas || []).join(', '));
      setPhone(data.phone || '');
      setLocation(data.location || '');
    } catch (error) {
      console.error('Error fetching about content:', error);
      setSnackbar({ open: true, message: 'Failed to fetch about page content', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const updateSection = (index, field, value) => {
    setSections((current) =>
      current.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [field]: value } : section
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axiosInstance.put('/about-content', {
        sections,
        workshopPhotos: textToPhotos(workshopPhotos),
        teamPhotos: textToPhotos(teamPhotos),
        serviceAreas,
        phone,
        location
      });
      setSnackbar({ open: true, message: 'About page updated successfully', severity: 'success' });
      fetchContent();
    } catch (error) {
      console.error('Error saving about content:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to save about page',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 420 }}>
        <CircularProgress sx={{ color: '#D4AF37' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#111111', minHeight: '100vh', color: '#F8FAFC' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#D4AF37', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon /> About Page Editor
          </Typography>
          <Typography sx={{ color: 'rgba(248,250,252,0.7)', mt: 0.5 }}>
            Edit text and images section wise. Image field accepts full URL or uploaded image path.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={saving}
          onClick={handleSave}
          sx={{ bgcolor: '#D4AF37', color: '#111827', fontWeight: 900, textTransform: 'none', '&:hover': { bgcolor: '#B88917' } }}
        >
          {saving ? 'Saving...' : 'Save About Page'}
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 2.5 }}>
        {sections.map((section, index) => (
          <Paper key={section.key || index} elevation={0} sx={panelSx}>
            <Typography sx={{ color: '#D4AF37', fontWeight: 900, mb: 2 }}>
              {sectionLabels[section.key] || section.key || `Section ${index + 1}`}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <TextField label="Small Heading / Kicker" value={section.kicker || ''} onChange={(event) => updateSection(index, 'kicker', event.target.value)} sx={inputSx} fullWidth />
              <TextField label="Image URL" value={section.image || ''} onChange={(event) => updateSection(index, 'image', event.target.value)} sx={inputSx} fullWidth />
            </Box>
            <TextField label="Main Title" value={section.title || ''} onChange={(event) => updateSection(index, 'title', event.target.value)} sx={inputSx} fullWidth />
            <TextField label="Text 1" value={section.text || ''} onChange={(event) => updateSection(index, 'text', event.target.value)} sx={inputSx} fullWidth multiline minRows={2} />
            <TextField label="Text 2" value={section.text2 || ''} onChange={(event) => updateSection(index, 'text2', event.target.value)} sx={inputSx} fullWidth multiline minRows={2} />
          </Paper>
        ))}

        <Paper elevation={0} sx={panelSx}>
          <Typography sx={{ color: '#D4AF37', fontWeight: 900, mb: 2 }}>Factory / Workshop Photos</Typography>
          <TextField
            label="Photos, one per line: Title|Image URL"
            value={workshopPhotos}
            onChange={(event) => setWorkshopPhotos(event.target.value)}
            sx={inputSx}
            fullWidth
            multiline
            minRows={5}
          />
        </Paper>

        <Paper elevation={0} sx={panelSx}>
          <Typography sx={{ color: '#D4AF37', fontWeight: 900, mb: 2 }}>Team Photos</Typography>
          <TextField
            label="Photos, one per line: Title|Image URL"
            value={teamPhotos}
            onChange={(event) => setTeamPhotos(event.target.value)}
            sx={inputSx}
            fullWidth
            multiline
            minRows={4}
          />
        </Paper>

        <Paper elevation={0} sx={panelSx}>
          <Typography sx={{ color: '#D4AF37', fontWeight: 900, mb: 2 }}>Contact & Local Areas</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <TextField label="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} sx={inputSx} fullWidth />
            <TextField label="Location" value={location} onChange={(event) => setLocation(event.target.value)} sx={inputSx} fullWidth />
          </Box>
          <TextField
            label="Service Areas (comma separated)"
            value={serviceAreas}
            onChange={(event) => setServiceAreas(event.target.value)}
            sx={inputSx}
            fullWidth
            multiline
            minRows={2}
          />
        </Paper>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

const panelSx = {
  p: { xs: 2.5, md: 3 },
  bgcolor: '#111827',
  color: '#F8FAFC',
  border: '1px solid rgba(212,175,55,0.24)',
  borderRadius: 2,
  display: 'grid',
  gap: 2
};

const inputSx = {
  '& .MuiInputBase-root': {
    color: '#F8FAFC',
    bgcolor: '#0F172A'
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(248,250,252,0.68)'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(212,175,55,0.25)'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(212,175,55,0.5)'
  }
};

export default AboutContentManagement;
