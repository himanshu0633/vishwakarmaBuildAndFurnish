import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Collections as MediaIcon,
  Image as ImageIcon,
  Movie as VideoIcon,
  Compare as CompareIcon,
  Delete as DeleteIcon
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
  const [mediaUrls, setMediaUrls] = useState("");
  const [mediaSeoForm, setMediaSeoForm] = useState({ alt: "", title: "", caption: "" });
  const [urlResults, setUrlResults] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlUploading, setUrlUploading] = useState(false);
  const [deletingMediaKey, setDeletingMediaKey] = useState("");
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
  const parsedUrls = useMemo(
    () => mediaUrls.split(/[,\n]/).map(url => url.trim()).filter(Boolean),
    [mediaUrls]
  );

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
    setMediaUrls("");
    setMediaSeoForm({ alt: "", title: "", caption: "" });
    setUrlResults(null);
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
      formData.append("mediaAlt", mediaSeoForm.alt);
      formData.append("mediaTitle", mediaSeoForm.title);
      formData.append("mediaCaption", mediaSeoForm.caption);

      await axiosInstance.post(`/services/${selectedServiceId}/media`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSnackbar({ open: true, message: "Media uploaded successfully", severity: "success" });
      setFiles(emptyFiles);
      setMediaSeoForm({ alt: "", title: "", caption: "" });
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

  const handleUrlUpload = async () => {
    if (!selectedCategoryId) {
      setSnackbar({ open: true, message: "Select category first", severity: "error" });
      return;
    }

    if (!selectedServiceId) {
      setSnackbar({ open: true, message: "Select service first", severity: "error" });
      return;
    }

    if (parsedUrls.length === 0) {
      setSnackbar({ open: true, message: "Paste at least one image or video URL", severity: "error" });
      return;
    }

    if (parsedUrls.length > 10) {
      setSnackbar({ open: true, message: "You can add a maximum of 10 URLs at once", severity: "error" });
      return;
    }

    try {
      setUrlUploading(true);
      setUrlResults(null);
      const response = await axiosInstance.post(`/services/${selectedServiceId}/media-url`, {
        urls: parsedUrls,
        mediaAlt: mediaSeoForm.alt,
        mediaTitle: mediaSeoForm.title,
        mediaCaption: mediaSeoForm.caption
      });

      const results = response.data?.results || { images: [], videos: [], failed: [] };
      const addedCount = (results.images?.length || 0) + (results.videos?.length || 0);
      setUrlResults(results);
      setSnackbar({
        open: true,
        message: `${addedCount} media downloaded, ${results.failed?.length || 0} failed`,
        severity: addedCount ? "success" : "warning"
      });

      if (addedCount) {
        setMediaUrls("");
        setMediaSeoForm({ alt: "", title: "", caption: "" });
      }

      await fetchServicesByCategory(selectedCategoryId);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "URL download failed",
        severity: "error"
      });
    } finally {
      setUrlUploading(false);
    }
  };

  const handleMediaDelete = async (field, url) => {
    if (!selectedServiceId) return;

    const confirmed = window.confirm("Delete this media from the selected service?");
    if (!confirmed) return;

    const mediaKey = `${field}-${url}`;

    try {
      setDeletingMediaKey(mediaKey);
      await axiosInstance.delete(`/services/${selectedServiceId}/media`, {
        data: { field, url }
      });

      setSnackbar({
        open: true,
        message: "Media deleted successfully",
        severity: "success"
      });
      await fetchServicesByCategory(selectedCategoryId);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Media delete failed",
        severity: "error"
      });
    } finally {
      setDeletingMediaKey("");
    }
  };

  const buildMediaItems = (key, type) =>
    (selectedService?.[key] || []).map(src => ({ type, src, group: key, seo: getMediaSeo(src) }));

  const getMediaSeo = (src) =>
    (selectedService?.mediaSeo || []).find(item => item.url === src) || {};

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
              setMediaUrls("");
              setMediaSeoForm({ alt: "", title: "", caption: "" });
              setUrlResults(null);
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
                  aria-label={section.button}
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

        <Paper
          sx={{
            p: 2,
            mb: 3,
            background: "rgba(15,23,42,0.72)",
            border: "1px solid rgba(212,175,55,0.18)",
            borderRadius: 2
          }}
        >
          <Typography sx={{ color: "#F5F5F5", fontWeight: 800, mb: 0.5 }}>
            Image SEO Fields
          </Typography>
          <Typography sx={{ color: "rgba(245,245,245,0.58)", fontSize: "0.85rem", mb: 1.5 }}>
            Optional. Leave blank to auto-create text like Best Service Name design 2026 in Charkhi Dadri.
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
            <TextField
              fullWidth
              label="Image Alt Text"
              value={mediaSeoForm.alt}
              disabled={!selectedServiceId || uploading || urlUploading}
              onChange={(event) => setMediaSeoForm(prev => ({ ...prev, alt: event.target.value }))}
              placeholder="Best wooden door design 2026 in Charkhi Dadri"
              sx={inputStyles}
            />
            <TextField
              fullWidth
              label="Image Title"
              value={mediaSeoForm.title}
              disabled={!selectedServiceId || uploading || urlUploading}
              onChange={(event) => setMediaSeoForm(prev => ({ ...prev, title: event.target.value }))}
              placeholder="Best design 2026"
              sx={inputStyles}
            />
            <TextField
              fullWidth
              label="Image Caption"
              value={mediaSeoForm.caption}
              disabled={!selectedServiceId || uploading || urlUploading}
              onChange={(event) => setMediaSeoForm(prev => ({ ...prev, caption: event.target.value }))}
              placeholder="Custom service work by Vishwakarma Build & Furnish"
              sx={inputStyles}
            />
          </Box>
        </Paper>

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

        <Paper
          sx={{
            mt: 3,
            p: 2,
            background: "rgba(15,23,42,0.72)",
            border: "1px solid rgba(212,175,55,0.18)",
            borderRadius: 2
          }}
        >
          <Typography sx={{ color: "#F5F5F5", fontWeight: 800, mb: 0.5 }}>
            Paste Image / Video URLs
          </Typography>
          <Typography sx={{ color: "rgba(245,245,245,0.58)", fontSize: "0.85rem", mb: 1.5 }}>
            You can add up to 10 direct image/video URLs at once. Separate them with commas or new lines.
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Image / Video URLs"
            value={mediaUrls}
            disabled={!selectedServiceId || urlUploading}
            onChange={(event) => {
              setMediaUrls(event.target.value);
              setUrlResults(null);
            }}
            placeholder="https://example.com/photo1.jpg, https://example.com/video1.mp4"
            sx={inputStyles}
          />
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap", mt: 1.5 }}>
            <Button
              startIcon={<DownloadIcon />}
              variant="contained"
              disabled={!selectedServiceId || urlUploading || parsedUrls.length === 0 || parsedUrls.length > 10}
              onClick={handleUrlUpload}
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
              {urlUploading ? "Downloading..." : "Download & Save URLs"}
            </Button>
            <Typography sx={{ color: parsedUrls.length > 10 ? "#F87171" : "rgba(245,245,245,0.7)", fontSize: "0.9rem" }}>
              {parsedUrls.length}/10 URLs
            </Typography>
          </Box>

          {urlResults && (
            <Box sx={{ mt: 2, display: "grid", gap: 1 }}>
              <Alert severity={(urlResults.images?.length || 0) + (urlResults.videos?.length || 0) ? "success" : "warning"}>
                {(urlResults.images?.length || 0)} images, {(urlResults.videos?.length || 0)} videos saved. {(urlResults.failed?.length || 0)} failed.
              </Alert>
              {!!urlResults.failed?.length && (
                <Paper sx={{ p: 1.5, background: "rgba(127,29,29,0.28)", border: "1px solid rgba(248,113,113,0.3)" }}>
                  <Typography sx={{ color: "#FCA5A5", fontWeight: 800, mb: 1 }}>
                    These URLs were not downloaded:
                  </Typography>
                  {urlResults.failed.map((item, index) => (
                    <Typography key={`${item.url}-${index}`} sx={{ color: "rgba(254,226,226,0.9)", fontSize: "0.85rem", overflowWrap: "anywhere", mb: 0.6 }}>
                      {item.url} - {item.reason}
                    </Typography>
                  ))}
                </Paper>
              )}
            </Box>
          )}
        </Paper>
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
                    const mediaKey = `${group.key}-${item.src}`;
                    const isDeleting = deletingMediaKey === mediaKey;
                    return (
                      <Paper
                        key={mediaKey}
                        sx={{
                          position: "relative",
                          overflow: "hidden",
                          background: "#0F172A",
                          border: "1px solid rgba(212,175,55,0.2)"
                        }}
                      >
                        <Tooltip title="Delete media">
                          <span>
                            <IconButton
                              aria-label="Delete media"
                              disabled={!!deletingMediaKey}
                              onClick={() => handleMediaDelete(group.key, item.src)}
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                zIndex: 2,
                                color: "#FFFFFF",
                                bgcolor: "rgba(127,29,29,0.9)",
                                border: "1px solid rgba(254,202,202,0.35)",
                                "&:hover": {
                                  bgcolor: "rgba(185,28,28,0.95)"
                                },
                                "&.Mui-disabled": {
                                  color: "rgba(255,255,255,0.65)",
                                  bgcolor: "rgba(127,29,29,0.45)"
                                }
                              }}
                            >
                              {isDeleting ? <CircularProgress size={20} sx={{ color: "#FFFFFF" }} /> : <DeleteIcon fontSize="small" />}
                            </IconButton>
                          </span>
                        </Tooltip>
                        {item.type === "video" ? (
                          <Box component="video" src={src} controls sx={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
                        ) : (
                          <Box
                            component="img"
                            src={src}
                            alt={item.seo?.alt || selectedService?.name || "Service media"}
                            title={item.seo?.title || item.seo?.alt || selectedService?.name || "Service media"}
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
                        {(item.seo?.alt || item.seo?.caption) && (
                          <Box sx={{ p: 1.2, borderTop: "1px solid rgba(212,175,55,0.16)" }}>
                            {item.seo?.alt && (
                              <Typography sx={{ color: "#D4AF37", fontWeight: 800, fontSize: "0.78rem", overflowWrap: "anywhere" }}>
                                Alt: {item.seo.alt}
                              </Typography>
                            )}
                            {item.seo?.caption && (
                              <Typography sx={{ color: "rgba(245,245,245,0.66)", fontSize: "0.75rem", mt: 0.4, overflowWrap: "anywhere" }}>
                                {item.seo.caption}
                              </Typography>
                            )}
                          </Box>
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
