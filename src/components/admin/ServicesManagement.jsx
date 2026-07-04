import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Checkbox,
  MenuItem,
  Switch,
  FormControlLabel,
  InputAdornment,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  EmojiEmotions as EmojiIcon,
  Description as DescriptionIcon,
  Whatshot as WhatshotIcon,
  Label as LabelIcon,
  Image as ImageIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import axiosInstance, { logStaticAssetUrl } from "../../../utils/axiosConfig";
import {
  asCommaText,
  faqToText,
  getCategoryEmoji,
  getCategoryName,
  getServiceDescription,
  makeSlug,
  parseCommaText,
  parseFaqText
} from "../../utils/catalogSchema";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const ServicesManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [relatedSearch, setRelatedSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    emoji: "🔧",
    heroImage: "",
    images: "",
    popular: false,
    featured: false,
    priceStarting: "",
    seoTitle: "",
    seoDescription: "",
    tags: "",
    faq: "",
    isActive: true,
    categoryId: "",
    relatedServices: []
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    fetchData();
  }, [categoryFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch Categories
      const categoriesRes = await axiosInstance.get("/categories");
      console.log("Categories:", categoriesRes.data);

      let categoriesList = [];
      if (Array.isArray(categoriesRes.data)) {
        categoriesList = categoriesRes.data;
      } else if (categoriesRes.data.success) {
        categoriesList = categoriesRes.data.data || [];
      }
      setCategories(categoriesList);

      // Fetch Services
      const servicesUrl = categoryFilter
        ? `/services?includeInactive=true&categoryId=${encodeURIComponent(categoryFilter)}`
        : "/services?includeInactive=true";
      const servicesRes = await axiosInstance.get(servicesUrl);
      console.log("Services:", servicesRes.data);

      let servicesList = [];
      if (Array.isArray(servicesRes.data)) {
        servicesList = servicesRes.data;
      } else if (servicesRes.data.success) {
        servicesList = servicesRes.data.data || [];
      }
      setServices(servicesList);

      const allServicesRes = await axiosInstance.get("/services?includeInactive=true");
      if (allServicesRes.data.success) {
        setAllServices(allServicesRes.data.data || []);
      }

    } catch (error) {
      console.error("Fetch error:", error);
      setSnackbar({
        open: true,
        message: "Failed to load data",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (service = null) => {
    if (service) {
      setEditingService(service);
      const description = getServiceDescription(service);
      setFormData({
        name: service.name || "",
        slug: service.slug || makeSlug(service.name || ""),
        shortDescription: service.shortDescription || service.desc || "",
        fullDescription: service.fullDescription || service.description || description,
        emoji: service.emoji || "🔧",
        heroImage: service.heroImage || "",
        images: asCommaText(service.images),
        popular: service.popular || false,
        featured: service.featured || false,
        priceStarting: service.priceStarting || service.price || "",
        seoTitle: service.seoTitle || "",
        seoDescription: service.seoDescription || "",
        tags: asCommaText(service.tags),
        faq: faqToText(service.faq),
        isActive: service.isActive !== false,
        categoryId: service.categoryId?._id || service.categoryId || "",
        relatedServices: (service.relatedServices || []).map(related => related._id || related)
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        slug: "",
        shortDescription: "",
        fullDescription: "",
        emoji: "🔧",
        heroImage: "",
        images: "",
        popular: false,
        featured: false,
        priceStarting: "",
        seoTitle: "",
        seoDescription: "",
        tags: "",
        faq: "",
        isActive: true,
        categoryId: "",
        relatedServices: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingService(null);
    setMediaFiles([]);
    setFormData({
      name: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      emoji: "🔧",
      heroImage: "",
      images: "",
      popular: false,
      featured: false,
      priceStarting: "",
      seoTitle: "",
      seoDescription: "",
      tags: "",
      faq: "",
      isActive: true,
      categoryId: "",
      relatedServices: []
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setSnackbar({
        open: true,
        message: "Service name required",
        severity: "error"
      });
      return;
    }

    if (!formData.categoryId) {
      setSnackbar({
        open: true,
        message: "Select category",
        severity: "error"
      });
      return;
    }

    try {
      const payload = {
        categoryId: formData.categoryId,
        name: formData.name,
        slug: formData.slug || makeSlug(formData.name),
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        emoji: formData.emoji,
        heroImage: formData.heroImage,
        images: parseCommaText(formData.images),
        popular: formData.popular,
        featured: formData.featured,
        priceStarting: formData.priceStarting,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        tags: parseCommaText(formData.tags),
        faq: parseFaqText(formData.faq),
        relatedServices: formData.relatedServices,
        isActive: formData.isActive
      };

      let savedService = editingService;

      if (editingService) {
        const res = await axiosInstance.put(`/services/${editingService._id}`, payload);
        savedService = res.data.data;
        setSnackbar({
          open: true,
          message: "Service updated successfully",
          severity: "success"
        });
      } else {
        const res = await axiosInstance.post("/services", payload);
        savedService = res.data.data;
        setSnackbar({
          open: true,
          message: "Service created successfully",
          severity: "success"
        });
      }

      if (mediaFiles.length > 0 && savedService?._id) {
        const uploadData = new FormData();
        mediaFiles.forEach(file => uploadData.append("images", file));

        await axiosInstance.post(`/services/${savedService._id}/media`, uploadData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Operation failed",
        severity: "error"
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axiosInstance.delete(`/services/${id}`);
        setSnackbar({
          open: true,
          message: "Service deleted successfully",
          severity: "success"
        });
        fetchData();
      } catch (error) {
        console.error(error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Delete failed",
          severity: "error"
        });
      }
    }
  };

  const getServiceImages = (service) => [
    ...(service.images || []),
    ...(service.beforeImages || []),
    ...(service.afterImages || [])
  ];

  const filteredServices = services.filter(service => {
    if (statusFilter === "active") return service.isActive !== false;
    if (statusFilter === "inactive") return service.isActive === false;
    return true;
  });

  const handleRowHeroImageUpload = async (serviceId, fileList) => {
    const files = [...fileList];

    if (!files.length) return;

    try {
      const uploadData = new FormData();
      uploadData.append("heroImage", files[0]);

      await axiosInstance.post(`/services/${serviceId}/media`, uploadData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSnackbar({
        open: true,
        message: "Hero image uploaded successfully",
        severity: "success"
      });
      fetchData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Hero image upload failed",
        severity: "error"
      });
    }
  };

  const handleMediaDelete = async (serviceId, field, url) => {
    try {
      await axiosInstance.delete(`/services/${serviceId}/media`, {
        data: { field, url }
      });

      setSnackbar({
        open: true,
        message: "Image deleted successfully",
        severity: "success"
      });
      fetchData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Image delete failed",
        severity: "error"
      });
    }
  };

  const getRelatedServiceIds = (service) =>
    (service.relatedServices || []).map(related => related._id || related);

  const buildServiceUpdatePayload = (service, overrides = {}) => ({
    categoryId: service.categoryId?._id || service.categoryId,
    name: service.name,
    shortDescription: service.shortDescription || "",
    fullDescription: service.fullDescription || "",
    emoji: service.emoji || "🔧",
    popular: service.popular || false,
    featured: service.featured || false,
    priceStarting: service.priceStarting || "",
    features: service.features || [],
    faq: service.faq || [],
    relatedServices: getRelatedServiceIds(service),
    isActive: service.isActive !== false,
    ...overrides
  });

  const handleRelatedServicesUpdate = async (service, relatedIds) => {
    const relatedServiceObjects = relatedIds
      .map(id => allServices.find(item => item._id === id))
      .filter(Boolean);

    setServices(prevServices =>
      prevServices.map(item =>
        item._id === service._id
          ? { ...item, relatedServices: relatedServiceObjects }
          : item
      )
    );

    setAllServices(prevServices =>
      prevServices.map(item =>
        item._id === service._id
          ? { ...item, relatedServices: relatedServiceObjects }
          : item
      )
    );

    try {
      await axiosInstance.put(
        `/services/${service._id}`,
        buildServiceUpdatePayload(service, { relatedServices: relatedIds })
      );

      setSnackbar({
        open: true,
        message: "Related services updated successfully",
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Related services update failed",
        severity: "error"
      });
      fetchData();
    }
  };

  const handleStatusToggle = async (service) => {
    try {
      await axiosInstance.put(
        `/services/${service._id}`,
        buildServiceUpdatePayload(service, { isActive: !(service.isActive !== false) })
      );

      setSnackbar({
        open: true,
        message: `Service ${service.isActive ? "inactive" : "active"} successfully`,
        severity: "success"
      });
      fetchData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Status update failed",
        severity: "error"
      });
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        sx={{
          background: "linear-gradient(135deg, #111111 0%, #0F172A 100%)",
          borderRadius: 2
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <LabelIcon sx={{ fontSize: 60, color: "#D4AF37", mr: 2 }} />
        </motion.div>
        <CircularProgress size={50} sx={{ color: '#D4AF37' }} />
      </Box>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <Box sx={{
        background: "linear-gradient(135deg, #111111 0%, #0F172A 50%, #1A1A1A 100%)",
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        minHeight: '100%'
      }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                background: "linear-gradient(135deg, #fff, #D4AF37)",
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 1
              }}
            >
              Services Management
            </Typography>
            <Typography sx={{ color: 'rgba(245,245,245,0.7)' }}>
              Manage your services across all categories
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(135deg, #D4AF37, #B88917)',
              borderRadius: '30px',
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(212,175,55,0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Add Service
          </Button>
        </Box>

        {/* Category Filter */}
        <Paper
          sx={{
            mb: 3,
            p: 2,
            background: 'rgba(245,245,245,0.05)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: 3
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' }
            }}
          >
            <TextField
              select
              label="Filter by Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              size="small"
              sx={{
                minWidth: { xs: '100%', sm: 280 },
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                '& .MuiSelect-icon': { color: '#D4AF37' }
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {getCategoryEmoji(cat)} {getCategoryName(cat)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
              sx={{
                minWidth: { xs: '100%', sm: 190 },
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                '& .MuiSelect-icon': { color: '#D4AF37' }
              }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active Only</MenuItem>
              <MenuItem value="inactive">Inactive Only</MenuItem>
            </TextField>
            {categoryFilter && (
              <Button
                onClick={() => setCategoryFilter("")}
                sx={{
                  color: '#D4AF37',
                  borderColor: 'rgba(212,175,55,0.4)',
                  textTransform: 'none'
                }}
                variant="outlined"
              >
                Clear Filter
              </Button>
            )}
            <Typography sx={{ color: 'rgba(245,245,245,0.7)', ml: { sm: 'auto' } }}>
              Showing {filteredServices.length} service{filteredServices.length === 1 ? "" : "s"}
            </Typography>
          </Box>
        </Paper>

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{
            background: 'rgba(245,245,245,0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            overflowX: 'auto',
            border: '1px solid rgba(212,175,55,0.2)'
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{
                background: 'rgba(212,175,55,0.1)',
                '& th': {
                  color: '#D4AF37',
                  fontWeight: 'bold',
                  fontSize: { xs: '0.8rem', sm: '0.9rem' }
                }
              }}>
                <TableCell>Icon</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                {!isMobile && <TableCell>Description</TableCell>}
                <TableCell>Category</TableCell>
                <TableCell>Related</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Popular</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography sx={{ color: 'rgba(245,245,245,0.7)' }}>
                      No services found
                    </Typography>
                    <Button
                      onClick={() => handleOpenDialog()}
                      sx={{ mt: 2, color: '#D4AF37' }}
                    >
                      Create your first service
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service, idx) => (
                  <motion.tr
                    key={service._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      background: hoveredRow === idx ? 'rgba(212,175,55,0.1)' : 'transparent',
                      transition: 'background 0.3s ease'
                    }}
                  >
                    <TableCell>
                      <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                        {service.emoji || "🔧"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {service.heroImage ? (
                          <Box sx={{ position: "relative", width: 72, height: 54, flex: "0 0 auto" }}>
                            <Box
                              component="img"
                              src={logStaticAssetUrl(`admin-services:${service.name}`, service.heroImage)}
                              alt={service.name}
                              onError={(event) => {
                                console.error("[media-url] admin services hero image failed", {
                                  service: service.name,
                                  rawUrl: service.heroImage,
                                  renderedSrc: event.currentTarget.src
                                });
                              }}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 1,
                                border: "1px solid rgba(212,175,55,0.35)"
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleMediaDelete(service._id, "heroImage", service.heroImage)}
                              sx={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                width: 22,
                                height: 22,
                                bgcolor: "#b91c1c",
                                color: "#fff",
                                "&:hover": { bgcolor: "#ef4444" }
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              width: 72,
                              height: 54,
                              borderRadius: 1,
                              border: "1px dashed rgba(212,175,55,0.35)",
                              display: "grid",
                              placeItems: "center",
                              color: "rgba(245,245,245,0.45)"
                            }}
                          >
                            <ImageIcon fontSize="small" />
                          </Box>
                        )}
                        <Box>
                          <IconButton
                            component="label"
                            size="small"
                            sx={{
                              color: "#D4AF37",
                              border: "1px solid rgba(212,175,55,0.35)",
                              "&:hover": { background: "rgba(212,175,55,0.14)" }
                            }}
                          >
                            <CloudUploadIcon fontSize="small" />
                            <input
                              aria-label="Upload service hero image"
                              hidden
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleRowHeroImageUpload(service._id, e.target.files)}
                            />
                          </IconButton>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="medium" sx={{ color: '#fff' }}>
                        {service.name}
                      </Typography>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Typography sx={{ color: 'rgba(245,245,245,0.7)', fontSize: '0.8rem' }}>
                          {getServiceDescription(service)?.length > 50
                              ? getServiceDescription(service).substring(0, 50) + "..."
                              : getServiceDescription(service) || "No description"}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <Chip
                        label={getCategoryName(service.categoryId) || "N/A"}
                        size="small"
                        sx={{
                          background: 'rgba(212,175,55,0.2)',
                          color: '#D4AF37',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={getRelatedServiceIds(service)}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleRelatedServicesUpdate(
                            service,
                            typeof value === "string" ? value.split(",") : value
                          );
                        }}
                        SelectProps={{
                          multiple: true,
                          renderValue: (selected) => selected.length ? `${selected.length} selected` : "Add related"
                        }}
                        sx={{
                          minWidth: 150,
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                            '&:hover fieldset': { borderColor: '#D4AF37' },
                            '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                          },
                          '& .MuiSelect-icon': { color: '#D4AF37' }
                        }}
                      >
                        <MenuItem
                          disableRipple
                          onClick={(event) => event.stopPropagation()}
                          sx={{
                            position: "sticky",
                            top: 0,
                            zIndex: 2,
                            bgcolor: "#111827",
                            "&:hover": { bgcolor: "#111827" }
                          }}
                        >
                          <TextField
                            autoFocus
                            size="small"
                            placeholder="Search services..."
                            value={relatedSearch}
                            onChange={(event) => setRelatedSearch(event.target.value)}
                            onClick={(event) => event.stopPropagation()}
                            onKeyDown={(event) => event.stopPropagation()}
                            fullWidth
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                                '&:hover fieldset': { borderColor: '#D4AF37' },
                                '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                              },
                              '& input::placeholder': { color: 'rgba(245,245,245,0.55)', opacity: 1 }
                            }}
                          />
                        </MenuItem>
                        {allServices
                          .filter(related => related._id !== service._id)
                          .filter(related => related.isActive !== false)
                          .filter(related =>
                            related.name?.toLowerCase().includes(relatedSearch.toLowerCase().trim())
                          )
                          .map((related) => (
                            <MenuItem key={related._id} value={related._id}>
                              <Checkbox
                                checked={getRelatedServiceIds(service).includes(related._id)}
                                sx={{
                                  color: 'rgba(212,175,55,0.6)',
                                  '&.Mui-checked': { color: '#D4AF37' }
                                }}
                              />
                              {related.emoji || "🔧"} {related.name}
                            </MenuItem>
                          ))}
                      </TextField>
                      {service.relatedServices?.length > 0 && (
                        <Typography sx={{ color: "rgba(245,245,245,0.58)", fontSize: "0.72rem", mt: 0.75 }}>
                          {service.relatedServices.map(related => related.name || "Related").join(", ")}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant={service.isActive !== false ? "contained" : "outlined"}
                        onClick={() => handleStatusToggle(service)}
                        sx={{
                          minWidth: 118,
                          borderRadius: "18px",
                          textTransform: "none",
                          fontWeight: 800,
                          fontSize: "0.78rem",
                          color: service.isActive !== false ? "#111111" : "#D4AF37",
                          borderColor: "#D4AF37",
                          background: service.isActive !== false
                            ? "linear-gradient(135deg, #D4AF37, #B88917)"
                            : "transparent",
                          "&:hover": {
                            borderColor: "#D4AF37",
                            background: service.isActive !== false
                              ? "linear-gradient(135deg, #B88917, #D4AF37)"
                              : "rgba(212,175,55,0.12)"
                          }
                        }}
                      >
                        {service.isActive !== false ? "Make Inactive" : "Make Active"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {service.popular && (
                        <Chip
                          label="Popular"
                          size="small"
                          icon={<WhatshotIcon sx={{ fontSize: 14 }} />}
                          sx={{
                            background: 'linear-gradient(135deg, #D4AF37, #B88917)',
                            color: '#fff',
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                      {service.featured && (
                        <Chip
                          label="Featured"
                          size="small"
                          sx={{
                            ml: service.popular ? 1 : 0,
                            background: 'rgba(212,175,55,0.18)',
                            color: '#D4AF37',
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(service)}
                        sx={{
                          color: '#D4AF37',
                          '&:hover': { background: 'rgba(212,175,55,0.2)' }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(service._id)}
                        sx={{
                          '&:hover': { background: 'rgba(244,67,54,0.2)' }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog - Industrial Theme */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #0F172A, #111111)',
              borderRadius: 3,
              border: '1px solid rgba(212,175,55,0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }
          }}
        >
          <DialogTitle sx={{
            color: '#D4AF37',
            fontWeight: 'bold',
            borderBottom: '1px solid rgba(212,175,55,0.3)',
            pb: 2
          }}>
            {editingService ? "Edit Service" : "Add Service"}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {/* Category Dropdown */}
            <TextField
              select
              fullWidth
              label="Category"
              margin="normal"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon sx={{ color: '#D4AF37' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                '& .MuiSelect-icon': { color: '#D4AF37' }
              }}
            >
              <MenuItem value="">
                <em>Select Category</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {getCategoryEmoji(cat)} {getCategoryName(cat)}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Related Services"
              margin="normal"
              value={formData.relatedServices}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  relatedServices: typeof value === "string" ? value.split(",") : value
                });
              }}
              SelectProps={{
                multiple: true,
                renderValue: (selected) =>
                  selected
                    .map(id => allServices.find(service => service._id === id)?.name)
                    .filter(Boolean)
                    .join(", ")
              }}
              helperText="Select services to show on this service detail page"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                '& .MuiSelect-icon': { color: '#D4AF37' },
                '& .MuiFormHelperText-root': { color: 'rgba(245,245,245,0.5)' }
              }}
            >
              {allServices
                .filter(service => service._id !== editingService?._id)
                .map((service) => (
                  <MenuItem key={service._id} value={service._id}>
                    <Checkbox
                      checked={formData.relatedServices.includes(service._id)}
                      sx={{
                        color: 'rgba(212,175,55,0.6)',
                        '&.Mui-checked': { color: '#D4AF37' }
                      }}
                    />
                    {service.emoji || "🔧"} {service.name}
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              fullWidth
              label="Service Name"
              margin="normal"
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData({
                  ...formData,
                  name,
                  slug: editingService ? formData.slug : makeSlug(name)
                });
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LabelIcon sx={{ color: '#D4AF37' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' }
              }}
            />
            <TextField
              fullWidth
              label="Slug"
              margin="normal"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: makeSlug(e.target.value) })}
              helperText="SEO-friendly URL slug"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                '& .MuiFormHelperText-root': { color: 'rgba(245,245,245,0.5)' }
              }}
            />

            <TextField
              fullWidth
              label="Short Description"
              margin="normal"
              multiline
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon sx={{ color: '#D4AF37' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' }
              }}
            />
            <TextField
              fullWidth
              label="Full Description"
              margin="normal"
              multiline
              rows={4}
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' }
              }}
            />

            <TextField
              fullWidth
              label="Emoji"
              margin="normal"
              value={formData.emoji}
              onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
              helperText="You can use any emoji (e.g., 🔧, ⚡, 🏠)"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmojiIcon sx={{ color: '#D4AF37' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                '& .MuiFormHelperText-root': { color: 'rgba(245,245,245,0.5)' }
              }}
            />
            <TextField
              fullWidth
              label="Hero Image URL"
              margin="normal"
              value={formData.heroImage}
              onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
              helperText="URL or path of the hero image (e.g. uploads/services/service-xxxx.jpg)"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                '& .MuiFormHelperText-root': { color: 'rgba(245,245,245,0.5)' }
              }}
            />
            <TextField
              fullWidth
              label="Image URLs"
              margin="normal"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              helperText="Comma separated image URLs"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                '& .MuiFormHelperText-root': { color: 'rgba(245,245,245,0.5)' }
              }}
            />
            <TextField
              fullWidth
              label="Price Starting"
              margin="normal"
              value={formData.priceStarting}
              onChange={(e) => setFormData({ ...formData, priceStarting: e.target.value })}
              placeholder="e.g., Starting ₹25,000"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' }
              }}
            />
            <TextField
              fullWidth
              label="Tags"
              margin="normal"
              value={formData.tags}
              disabled
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              helperText="Comma separated tags, e.g. kitchen, furniture, interior"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                '& .MuiFormHelperText-root': { color: 'rgba(245,245,245,0.5)' }
              }}
            />
            <TextField
              fullWidth
              label="FAQ"
              margin="normal"
              multiline
              rows={3}
              value={formData.faq}
              onChange={(e) => setFormData({ ...formData, faq: e.target.value })}
              helperText="One per line: Question|Answer"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                '& .MuiFormHelperText-root': { color: 'rgba(245,245,245,0.5)' }
              }}
            />
            <Button
              component="label"
              variant="outlined"
              sx={{
                mt: 2,
                borderColor: "#D4AF37",
                color: "#D4AF37",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#D4AF37",
                  background: "rgba(212,175,55,0.1)"
                }
              }}
            >
              Upload Images
              <input
                aria-label="Upload Images"
                hidden
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setMediaFiles([...e.target.files])}
              />
            </Button>
            {mediaFiles.length > 0 && (
              <Typography sx={{ color: "rgba(245,245,245,0.7)", mt: 1, fontSize: "0.85rem" }}>
                {mediaFiles.length} file(s) selected
              </Typography>
            )}
            <TextField
              fullWidth
              label="SEO Title"
              margin="normal"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' }
              }}
            />
            <TextField
              fullWidth
              label="SEO Description"
              margin="normal"
              multiline
              rows={2}
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(212,175,55,0.3)' },
                  '&:hover fieldset': { borderColor: '#D4AF37' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(245,245,245,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' }
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.popular}
                  onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#D4AF37',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#D4AF37',
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WhatshotIcon sx={{ color: '#D4AF37', fontSize: 18 }} />
                  <Typography sx={{ color: '#fff' }}>Popular Service</Typography>
                </Box>
              }
              sx={{ mt: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#D4AF37' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#D4AF37' },
                  }}
                />
              }
              label={<Typography sx={{ color: '#fff' }}>Featured Service</Typography>}
              sx={{ mt: 2, ml: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#D4AF37' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#D4AF37' },
                  }}
                />
              }
              label={<Typography sx={{ color: '#fff' }}>Active Service</Typography>}
              sx={{ mt: 2, ml: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(212,175,55,0.3)' }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                color: 'rgba(245,245,245,0.7)',
                '&:hover': { color: '#fff' }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                background: 'linear-gradient(135deg, #D4AF37, #B88917)',
                borderRadius: '30px',
                px: 3,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 5px 15px rgba(212,175,55,0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {editingService ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            sx={{
              background: snackbar.severity === 'success'
                ? 'linear-gradient(135deg, #0F172A, #111111)'
                : 'linear-gradient(135deg, #4a0e0e, #2a0a0a)',
              color: '#fff',
              border: `1px solid ${snackbar.severity === 'success' ? '#2ecc71' : '#e74c3c'}`,
              '& .MuiAlert-icon': {
                color: snackbar.severity === 'success' ? '#2ecc71' : '#e74c3c'
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </motion.div>
  );
};

export default ServicesManagement;
