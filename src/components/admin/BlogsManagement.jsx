import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Article as ArticleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import axiosInstance, { getStaticAssetUrl } from '../../../utils/axiosConfig';

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  blogImage: '',
  blogImages: [],
  categoryId: '',
  category: 'Furniture',
  relatedServices: [],
  faq: '',
  priceRange: '',
  benefits: '',
  process: '',
  localAreas: '',
  seoTitle: '',
  seoDescription: '',
  tags: '',
  featured: true,
  isActive: true,
  order: 0
};

const BlogsManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imagePage, setImagePage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchServices();
  }, []);

  const activeServices = useMemo(
    () => services.filter((service) => service.isActive !== false),
    [services]
  );

  const filteredServices = useMemo(
    () => activeServices.filter((service) => {
      if (!formData.categoryId) return true;
      return (service.categoryId?._id || service.categoryId) === formData.categoryId;
    }),
    [activeServices, formData.categoryId]
  );

  const selectedPrimaryService = useMemo(
    () => activeServices.find((service) => service._id === formData.relatedServices[0]),
    [activeServices, formData.relatedServices]
  );

  const selectedServiceImages = useMemo(() => {
    if (!selectedPrimaryService) return [];
    return Array.from(new Set([
      selectedPrimaryService.heroImage,
      ...(selectedPrimaryService.images || []),
      ...(selectedPrimaryService.beforeImages || []),
      ...(selectedPrimaryService.afterImages || [])
    ].filter(Boolean)));
  }, [selectedPrimaryService]);

  const pagedServiceImages = useMemo(
    () => selectedServiceImages.slice((imagePage - 1) * 10, imagePage * 10),
    [selectedServiceImages, imagePage]
  );

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/blogs?includeInactive=true');
      setBlogs(response.data.success ? response.data.data || [] : []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to fetch blogs',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories?includeInactive=true');
      setCategories(response.data.success ? response.data.data || [] : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get('/services?includeInactive=true');
      setServices(response.data.success ? response.data.data || [] : []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleOpenDialog = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        coverImage: blog.coverImage || '',
        blogImage: blog.blogImage || '',
        blogImages: (blog.blogImages?.length ? blog.blogImages : [blog.blogImage]).filter(Boolean).slice(0, 9),
        categoryId: blog.categoryId?._id || blog.categoryId || blog.relatedServices?.[0]?.categoryId?._id || blog.relatedServices?.[0]?.categoryId || '',
        category: blog.category || blog.categoryId?.name || 'Furniture',
        relatedServices: (blog.relatedServices || []).map((service) => service?._id || service).filter(Boolean),
        faq: (blog.faq || []).map((item) => `${item.question || ''}|${item.answer || ''}`).join('\n'),
        priceRange: blog.priceRange || '',
        benefits: (blog.benefits || []).join(', '),
        process: (blog.process || []).map((item) => `${item.title || ''}|${item.description || ''}`).join('\n'),
        localAreas: (blog.localAreas || []).join(', '),
        seoTitle: blog.seoTitle || '',
        seoDescription: blog.seoDescription || '',
        tags: (blog.tags || []).join(', '),
        featured: Boolean(blog.featured),
        isActive: blog.isActive !== false,
        order: blog.order || 0
      });
    } else {
      setEditingBlog(null);
      setFormData(emptyForm);
    }

    setImagePage(1);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBlog(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setSnackbar({ open: true, message: 'Title and content are required', severity: 'error' });
      return;
    }

    const payload = {
      ...formData,
      blogImages: formData.blogImages.slice(0, 9),
      blogImage: formData.blogImages[0] || formData.blogImage,
      category: categories.find((category) => category._id === formData.categoryId)?.name || formData.category,
      order: Number(formData.order) || 0,
      tags: formData.tags,
      relatedServices: formData.relatedServices
    };

    try {
      if (editingBlog) {
        await axiosInstance.put(`/blogs/${editingBlog._id}`, payload);
      } else {
        await axiosInstance.post('/blogs', payload);
      }

      setSnackbar({
        open: true,
        message: editingBlog ? 'Blog updated successfully' : 'Blog created successfully',
        severity: 'success'
      });
      handleCloseDialog();
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to save blog',
        severity: 'error'
      });
    }
  };

  const handleToggle = async (blog, field) => {
    try {
      const payload = {
        ...blog,
        categoryId: blog.categoryId?._id || blog.categoryId || '',
        blogImage: blog.blogImage || '',
        blogImages: (blog.blogImages?.length ? blog.blogImages : [blog.blogImage]).filter(Boolean).slice(0, 9),
        faq: (blog.faq || []).map((item) => `${item.question || ''}|${item.answer || ''}`).join('\n'),
        priceRange: blog.priceRange || '',
        benefits: blog.benefits || [],
        process: (blog.process || []).map((item) => `${item.title || ''}|${item.description || ''}`).join('\n'),
        localAreas: blog.localAreas || [],
        relatedServices: (blog.relatedServices || []).map((service) => service?._id || service).filter(Boolean),
        tags: blog.tags || [],
        [field]: !blog[field]
      };

      await axiosInstance.put(`/blogs/${blog._id}`, payload);
      setBlogs((current) =>
        current.map((item) => (item._id === blog._id ? { ...item, [field]: !blog[field] } : item))
      );
      setSnackbar({ open: true, message: 'Blog status updated', severity: 'success' });
    } catch (error) {
      console.error('Error updating blog:', error);
      setSnackbar({ open: true, message: 'Failed to update blog', severity: 'error' });
    }
  };

  const handleDelete = async (blog) => {
    if (!window.confirm(`Deactivate "${blog.title}" blog?`)) return;

    try {
      await axiosInstance.delete(`/blogs/${blog._id}`);
      setBlogs((current) =>
        current.map((item) => (item._id === blog._id ? { ...item, isActive: false } : item))
      );
      setSnackbar({ open: true, message: 'Blog moved to inactive', severity: 'success' });
    } catch (error) {
      console.error('Error deleting blog:', error);
      setSnackbar({ open: true, message: 'Failed to deactivate blog', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#111111', minHeight: '100vh', color: '#F8FAFC' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#D4AF37', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1.55rem', sm: '2.125rem' }, overflowWrap: 'anywhere' }}>
            <ArticleIcon /> Blogs Management
          </Typography>
          <Typography sx={{ color: 'rgba(248,250,252,0.7)', mt: 0.5 }}>
            Add or edit SEO blogs and connect them with services.
          </Typography>
        </Box>
        <Button
          fullWidth={isMobile}
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#D4AF37', color: '#111111', fontWeight: 900, textTransform: 'none', '&:hover': { bgcolor: '#B88917' } }}
        >
          Add Blog
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#111827', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 2, overflowX: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#D4AF37' }} />
          </Box>
        ) : (
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                {['Image', 'Title', 'Category', 'Related Services', 'Status', 'Actions'].map((heading) => (
                  <TableCell key={heading} sx={{ color: '#D4AF37', fontWeight: 900, borderColor: 'rgba(212,175,55,0.18)' }}>
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {blogs.map((blog) => {
                const image = getStaticAssetUrl(blog.coverImage || blog.blogImages?.[0] || blog.blogImage || blog.relatedServices?.[0]?.heroImage || blog.relatedServices?.[0]?.images?.[0] || '');

                return (
                  <TableRow key={blog._id} hover sx={{ '&:hover': { bgcolor: 'rgba(212,175,55,0.06)' } }}>
                    <TableCell sx={{ borderColor: 'rgba(212,175,55,0.12)' }}>
                      <Box
                        sx={{
                          width: 86,
                          height: 58,
                          borderRadius: 1.5,
                          bgcolor: '#0F172A',
                          background: image ? `url("${image}") center/cover no-repeat` : '#0F172A',
                          border: '1px solid rgba(212,175,55,0.2)'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#F8FAFC', borderColor: 'rgba(212,175,55,0.12)', maxWidth: 320 }}>
                      <Typography sx={{ fontWeight: 900, overflowWrap: 'anywhere' }}>{blog.title}</Typography>
                      <Typography sx={{ color: 'rgba(248,250,252,0.6)', fontSize: '0.82rem', overflowWrap: 'anywhere' }}>{blog.slug}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#F8FAFC', borderColor: 'rgba(212,175,55,0.12)' }}>{blog.category}</TableCell>
                    <TableCell sx={{ borderColor: 'rgba(212,175,55,0.12)' }}>
                      <Box sx={{ display: 'flex', gap: 0.7, flexWrap: 'wrap' }}>
                        {(blog.relatedServices || []).filter(Boolean).slice(0, 3).map((service) => (
                          <Chip key={service._id || service} label={service.name || 'Service'} size="small" sx={{ bgcolor: 'rgba(212,175,55,0.14)', color: '#D4AF37' }} />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderColor: 'rgba(212,175,55,0.12)' }}>
                      <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                        <Chip label={blog.isActive ? 'Active' : 'Inactive'} size="small" color={blog.isActive ? 'success' : 'default'} />
                        {blog.featured && <Chip icon={<StarIcon />} label="Featured" size="small" sx={{ bgcolor: '#D4AF37', color: '#111827' }} />}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderColor: 'rgba(212,175,55,0.12)' }}>
                      <IconButton onClick={() => handleToggle(blog, 'isActive')} sx={{ color: blog.isActive ? '#2ecc71' : '#95a5a6' }}>
                        {blog.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                      <IconButton onClick={() => handleToggle(blog, 'featured')} sx={{ color: blog.featured ? '#D4AF37' : '#95a5a6' }}>
                        <StarIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDialog(blog)} sx={{ color: '#D4AF37' }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(blog)} sx={{ color: '#e74c3c' }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth fullScreen={isMobile} PaperProps={{ sx: { bgcolor: '#111827', color: '#F8FAFC' } }}>
        <DialogTitle sx={{ color: '#D4AF37', fontWeight: 900 }}>
          {editingBlog ? 'Edit Blog' : 'Add Blog'}
        </DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
          <TextField label="Title" value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} fullWidth sx={inputSx} />
          <TextField label="Excerpt" value={formData.excerpt} onChange={(event) => setFormData({ ...formData, excerpt: event.target.value })} fullWidth multiline minRows={2} sx={inputSx} />
          <TextField label="Content" value={formData.content} onChange={(event) => setFormData({ ...formData, content: event.target.value })} fullWidth multiline minRows={8} sx={inputSx} />
          <TextField label="Cover Image URL (Optional)" value={formData.coverImage} onChange={(event) => setFormData({ ...formData, coverImage: event.target.value })} fullWidth sx={inputSx} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <TextField
              select
              label="Category"
              value={formData.categoryId}
              onChange={(event) => {
                const category = categories.find((item) => item._id === event.target.value);
                setFormData({
                  ...formData,
                  categoryId: event.target.value,
                  category: category?.name || 'Furniture',
                  relatedServices: [],
                  blogImage: '',
                  blogImages: []
                });
                setImagePage(1);
              }}
              fullWidth
              sx={inputSx}
            >
              <MenuItem value="">Select Category</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
              ))}
            </TextField>
            <TextField label="Order" type="number" value={formData.order} onChange={(event) => setFormData({ ...formData, order: event.target.value })} fullWidth sx={inputSx} />
          </Box>
          <TextField
            select
            label="Service"
            value={formData.relatedServices[0] || ''}
            onChange={(event) => {
              const service = activeServices.find((item) => item._id === event.target.value);
              const fallbackImage = service?.heroImage || service?.images?.[0] || '';
              setFormData({
                ...formData,
                relatedServices: event.target.value ? [event.target.value] : [],
                blogImage: fallbackImage,
                blogImages: fallbackImage ? [fallbackImage] : [],
                coverImage: formData.coverImage || fallbackImage
              });
              setImagePage(1);
            }}
            fullWidth
            disabled={!formData.categoryId}
            sx={inputSx}
          >
            <MenuItem value="">{formData.categoryId ? 'Select Service' : 'Select category first'}</MenuItem>
            {filteredServices.map((service) => (
              <MenuItem key={service._id} value={service._id}>{service.name}</MenuItem>
            ))}
          </TextField>
          {!!selectedServiceImages.length && (
            <Paper sx={{ p: 2, bgcolor: '#0F172A', border: '1px solid rgba(212,175,55,0.22)', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                <Typography sx={{ color: '#D4AF37', fontWeight: 900 }}>Select Blog Images From Service</Typography>
                <Chip label={`${formData.blogImages.length}/9 selected`} size="small" sx={{ bgcolor: 'rgba(212,175,55,0.16)', color: '#D4AF37', fontWeight: 800 }} />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1.5 }}>
                {pagedServiceImages.map((image) => {
                  const imageUrl = getStaticAssetUrl(image);
                  const selected = formData.blogImages.includes(image);
                  return (
                    <Box
                      key={image}
                      onClick={() => {
                        const nextImages = selected
                          ? formData.blogImages.filter((item) => item !== image)
                          : [...formData.blogImages, image].slice(0, 9);

                        if (!selected && formData.blogImages.length >= 9) {
                          setSnackbar({ open: true, message: 'You can select a maximum of 9 images', severity: 'warning' });
                          return;
                        }

                        setFormData({
                          ...formData,
                          blogImages: nextImages,
                          blogImage: nextImages[0] || '',
                          coverImage: formData.coverImage || nextImages[0] || image
                        });
                      }}
                      sx={{
                        cursor: 'pointer',
                        border: selected ? '3px solid #D4AF37' : '1px solid rgba(212,175,55,0.22)',
                        borderRadius: 1.5,
                        overflow: 'hidden',
                        bgcolor: '#111827',
                        position: 'relative'
                      }}
                    >
                      <Box component="img" src={imageUrl} alt="Service media" sx={{ width: 1, aspectRatio: '16 / 10', objectFit: 'cover', display: 'block' }} />
                      {selected && (
                        <Chip
                          label={formData.blogImages.indexOf(image) + 1}
                          size="small"
                          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: '#D4AF37', color: '#111827', fontWeight: 900 }}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
              {selectedServiceImages.length > 10 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination
                    count={Math.ceil(selectedServiceImages.length / 10)}
                    page={imagePage}
                    onChange={(_, page) => setImagePage(page)}
                    sx={{
                      '& .MuiPaginationItem-root': { color: '#F8FAFC' },
                      '& .Mui-selected': { bgcolor: '#D4AF37 !important', color: '#111827', fontWeight: 900 }
                    }}
                  />
                </Box>
              )}
            </Paper>
          )}
          <TextField
            label="FAQ (one per line: Question|Answer)"
            value={formData.faq}
            onChange={(event) => setFormData({ ...formData, faq: event.target.value })}
            fullWidth
            multiline
            minRows={3}
            placeholder="Leave blank to auto-generate common FAQs"
            sx={inputSx}
          />
          <TextField
            label="Price Range"
            value={formData.priceRange}
            onChange={(event) => setFormData({ ...formData, priceRange: event.target.value })}
            fullWidth
            placeholder="Example: Starts from Rs. 1,200/sq ft or Custom quote after measurement"
            sx={inputSx}
          />
          <TextField
            label="Benefits (comma separated)"
            value={formData.benefits}
            onChange={(event) => setFormData({ ...formData, benefits: event.target.value })}
            fullWidth
            multiline
            minRows={2}
            placeholder="Leave blank to auto-generate benefits"
            sx={inputSx}
          />
          <TextField
            label="Process (one per line: Step Title|Description)"
            value={formData.process}
            onChange={(event) => setFormData({ ...formData, process: event.target.value })}
            fullWidth
            multiline
            minRows={3}
            placeholder="Leave blank to auto-generate process"
            sx={inputSx}
          />
          <TextField
            label="Local Areas (comma separated)"
            value={formData.localAreas}
            onChange={(event) => setFormData({ ...formData, localAreas: event.target.value })}
            fullWidth
            multiline
            minRows={2}
            placeholder="Charkhi Dadri, Bhiwani, Mahendragarh, Rewari, Rohtak, Jhajjar, nearby villages"
            sx={inputSx}
          />
          <TextField label="SEO Title" value={formData.seoTitle} onChange={(event) => setFormData({ ...formData, seoTitle: event.target.value })} fullWidth sx={inputSx} />
          <TextField label="SEO Description" value={formData.seoDescription} onChange={(event) => setFormData({ ...formData, seoDescription: event.target.value })} fullWidth multiline minRows={2} sx={inputSx} />
          <TextField label="Tags (comma separated, optional)" value={formData.tags} onChange={(event) => setFormData({ ...formData, tags: event.target.value })} fullWidth placeholder="Leave blank for improved auto tags" sx={inputSx} />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControlLabel control={<Switch checked={formData.featured} onChange={(event) => setFormData({ ...formData, featured: event.target.checked })} />} label="Featured" />
            <FormControlLabel control={<Switch checked={formData.isActive} onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })} />} label="Active" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 2.5 }, flexDirection: { xs: 'column-reverse', sm: 'row' }, '& > :not(style) ~ :not(style)': { ml: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 } } }}>
          <Button onClick={handleCloseDialog} sx={{ color: 'rgba(248,250,252,0.72)', textTransform: 'none' }}>Cancel</Button>
          <Button fullWidth={isMobile} onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#D4AF37', color: '#111827', fontWeight: 900, textTransform: 'none', '&:hover': { bgcolor: '#B88917' } }}>
            {editingBlog ? 'Update Blog' : 'Create Blog'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
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

export default BlogsManagement;
