import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Collections as MediaIcon,
  Image as ImageIcon,
  Movie as VideoIcon,
  Compare as CompareIcon
} from "@mui/icons-material";
import axiosInstance, { logStaticAssetUrl } from "../../../utils/axiosConfig";
import { getCategoryEmoji, getCategoryName } from "../../utils/catalogSchema";

const emptyFiles = {
  images: [],
  beforeImages: [],
  afterImages: [],
  videos: []
};

const fileSections = [
  {
    key: "images",
    title: "Multiple Images",
    button: "Choose Images",
    accept: "image/*",
    icon: <ImageIcon />,
    helper: "Gallery, work photos, product/service images"
  },
  {
    key: "beforeImages",
    title: "Before Images",
    button: "Choose Before Images",
    accept: "image/*",
    icon: <CompareIcon />,
    helper: "Before work/project condition images"
  },
  {
    key: "afterImages",
    title: "After Images",
    button: "Choose After Images",
    accept: "image/*",
    icon: <CompareIcon />,
    helper: "After completion/result images"
  },
  {
    key: "videos",
    title: "Videos / Reels",
    button: "Choose Videos / Reels",
    accept: "video/*",
    icon: <VideoIcon />,
    helper: "Short videos, reels, walkthroughs"
  }
];

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    color: "#F5F5F5",
    "& fieldset": { borderColor: "rgba(212,175,55,0.3)" },
    "&:hover fieldset": { borderColor: "#D4AF37" },
    "&.Mui-focused fieldset": { borderColor: "#D4AF37" }
  },
  "& .MuiInputLabel-root": { color: "rgba(245,245,245,0.7)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#D4AF37" },
  "& .MuiSelect-icon": { color: "#D4AF37" }
};

const ServiceMediaManagement = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [files, setFiles] = useState(emptyFiles);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const selectedCategory = useMemo(
    () => categories.find(category => category._id === selectedCategoryId),
    [categories, selectedCategoryId]
  );

  const selectedService = useMemo(
    () => services.find(service => service._id === selectedServiceId),
    [services, selectedServiceId]
  );

  const selectedCount = Object.values(files).reduce((total, list) => total + list.length, 0);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await axiosInstance.get("/categories");
      const list = response.data.success ? response.data.data || [] : [];
      setCategories(list);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to load categories",
        severity: "error"
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchServicesByCategory = async (categoryId) => {
    if (!categoryId) {
      setServices([]);
      return;
    }

    try {
      setLoadingServices(true);
      const response = await axiosInstance.get(`/services?categoryId=${encodeURIComponent(categoryId)}`);
      const list = response.data.success ? response.data.data || [] : [];
      setServices(list);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to load services",
        severity: "error"
      });
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedServiceId("");
    setFiles(emptyFiles);
    fetchServicesByCategory(selectedCategoryId);
  }, [selectedCategoryId]);

  const handleFileChange = (key, fileList) => {
    setFiles(prev => ({
      ...prev,
      [key]: [...fileList]
    }));
  };

  const handleUpload = async () => {
    if (!selectedCategoryId) {
      setSnackbar({ open: true, message: "Select category first", severity: "error" });
      return;
    }

    if (!selectedServiceId) {
      setSnackbar({ open: true, message: "Select service first", severity: "error" });
      return;
    }

    if (selectedCount === 0) {
      setSnackbar({ open: true, message: "Select images or videos", severity: "error" });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();

      Object.entries(files).forEach(([key, fileList]) => {
        fileList.forEach(file => formData.append(key, file));
      });

      await axiosInstance.post(`/services/${selectedServiceId}/media`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSnackbar({ open: true, message: "Media uploaded successfully", severity: "success" });
      setFiles(emptyFiles);
      await fetchServicesByCategory(selectedCategoryId);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Upload failed",
        severity: "error"
      });
    } finally {
      setUploading(false);
    }
  };

  const buildMediaItems = (key, type) =>
    (selectedService?.[key] || []).map(src => ({ type, src, group: key }));

  const mediaGroups = [
    { key: "images", title: "Images", items: buildMediaItems("images", "image") },
    { key: "beforeImages", title: "Before Images", items: buildMediaItems("beforeImages", "image") },
    { key: "afterImages", title: "After Images", items: buildMediaItems("afterImages", "image") },
    { key: "videos", title: "Videos / Reels", items: buildMediaItems("videos", "video") }
  ];

  if (loadingCategories) {
    return (
      <Box sx={{ minHeight: 400, display: "grid", placeItems: "center" }}>
        <CircularProgress sx={{ color: "#D4AF37" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #111111 0%, #0F172A 50%, #1A1A1A 100%)",
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        minHeight: "100%"
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(135deg, #F5F5F5, #D4AF37)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            mb: 1
          }}
        >
          Service Media
        </Typography>
        <Typography sx={{ color: "rgba(245,245,245,0.7)" }}>
          Select category, select service, then upload images, before/after images, and videos/reels.
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 3,
          mb: 4,
          background: "rgba(245,245,245,0.05)",
          border: "1px solid rgba(212,175,55,0.2)",
          borderRadius: 3
        }}
      >
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mb: 3 }}>
          <TextField
            select
            fullWidth
            label="1. Select Category"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            sx={inputStyles}
          >
            <MenuItem value="">
              <em>Select Category</em>
            </MenuItem>
            {categories.map(category => (
              <MenuItem key={category._id} value={category._id}>
                {getCategoryEmoji(category)} {getCategoryName(category)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="2. Select Service"
            value={selectedServiceId}
            disabled={!selectedCategoryId || loadingServices}
            onChange={(e) => {
              setSelectedServiceId(e.target.value);
              setFiles(emptyFiles);
            }}
            sx={inputStyles}
          >
            <MenuItem value="">
              <em>{selectedCategoryId ? "Select Service" : "Select category first"}</em>
            </MenuItem>
            {services.map(service => (
              <MenuItem key={service._id} value={service._id}>
                {service.emoji || "🔧"} {service.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {selectedCategory && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            <Chip
              label={`${getCategoryEmoji(selectedCategory)} ${getCategoryName(selectedCategory)}`}
              sx={{ bgcolor: "rgba(212,175,55,0.18)", color: "#D4AF37", fontWeight: 800 }}
            />
            <Chip
              label={`${services.length} services`}
              sx={{ bgcolor: "rgba(245,245,245,0.08)", color: "#F5F5F5" }}
            />
          </Box>
        )}

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2, mb: 3 }}>
          {fileSections.map(section => (
            <Paper
              key={section.key}
              sx={{
                p: 2,
                background: "rgba(15,23,42,0.72)",
                border: "1px solid rgba(212,175,55,0.18)",
                borderRadius: 2
              }}
            >
              <Typography sx={{ color: "#F5F5F5", fontWeight: 800, mb: 0.5 }}>
                {section.title}
              </Typography>
              <Typography sx={{ color: "rgba(245,245,245,0.58)", fontSize: "0.85rem", mb: 1.5 }}>
                {section.helper}
              </Typography>
              <Button
                component="label"
                startIcon={section.icon}
                variant="outlined"
                disabled={!selectedServiceId}
                sx={{
                  borderColor: "#D4AF37",
                  color: "#D4AF37",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#D4AF37",
                    background: "rgba(212,175,55,0.1)"
                  }
                }}
              >
                {section.button}
                <input
                  hidden
                  type="file"
                  multiple
                  accept={section.accept}
                  onChange={(e) => handleFileChange(section.key, e.target.files)}
                />
              </Button>
              {files[section.key].length > 0 && (
                <Typography sx={{ color: "rgba(245,245,245,0.72)", mt: 1 }}>
                  {files[section.key].length} file(s) selected
                </Typography>
              )}
            </Paper>
          ))}
        </Box>

        <Button
          startIcon={<UploadIcon />}
          variant="contained"
          disabled={uploading || selectedCount === 0}
          onClick={handleUpload}
          sx={{
            background: "linear-gradient(135deg, #D4AF37, #B88917)",
            color: "#111111",
            fontWeight: 800,
            textTransform: "none",
            "&:disabled": {
              color: "rgba(17,17,17,0.45)",
              background: "rgba(212,175,55,0.35)"
            }
          }}
        >
          {uploading ? "Uploading..." : `Upload ${selectedCount || ""}`.trim()}
        </Button>
      </Paper>

      <Typography variant="h6" sx={{ color: "#D4AF37", fontWeight: 800, mb: 2 }}>
        Existing Media {selectedService ? `- ${selectedService.name}` : ""}
      </Typography>

      {!selectedService ? (
        <Paper sx={{ p: 3, background: "rgba(245,245,245,0.05)", color: "rgba(245,245,245,0.7)", border: "1px solid rgba(212,175,55,0.2)" }}>
          <MediaIcon sx={{ color: "#D4AF37", mr: 1, verticalAlign: "middle" }} />
          Select category and service to view uploaded media.
        </Paper>
      ) : (
        <Box sx={{ display: "grid", gap: 3 }}>
          {mediaGroups.map(group => (
            <Box key={group.key}>
              <Typography sx={{ color: "#F5F5F5", fontWeight: 800, mb: 1 }}>
                {group.title} ({group.items.length})
              </Typography>
              {group.items.length === 0 ? (
                <Paper sx={{ p: 2, background: "rgba(245,245,245,0.04)", color: "rgba(245,245,245,0.58)", border: "1px solid rgba(212,175,55,0.14)" }}>
                  No {group.title.toLowerCase()} uploaded yet.
                </Paper>
              ) : (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 2 }}>
                  {group.items.map((item) => {
                    const src = logStaticAssetUrl(`service-media:${selectedService?.name || "service"}`, item.src);
                    return (
                      <Paper key={`${group.key}-${item.src}`} sx={{ overflow: "hidden", background: "#0F172A", border: "1px solid rgba(212,175,55,0.2)" }}>
                        {item.type === "video" ? (
                          <Box component="video" src={src} controls sx={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
                        ) : (
                          <Box
                            component="img"
                            src={src}
                            alt={selectedService?.name || "Service media"}
                            onError={(event) => {
                              console.error("[media-url] service media image failed", {
                                service: selectedService?.name,
                                rawUrl: item.src,
                                renderedSrc: event.currentTarget.src
                              });
                            }}
                            sx={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }}
                          />
                        )}
                      </Paper>
                    );
                  })}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ServiceMediaManagement;
