import React, { useEffect, useMemo, useState } from "react";
import { Box, Chip, CircularProgress, Container, FormControl, InputLabel, MenuItem, Paper, Select, Typography, Pagination } from "@mui/material";
import CollectionsIcon from "@mui/icons-material/Collections";
import axiosInstance, { getStaticAssetUrl } from "../../utils/axiosConfig";
import { simpleBusinessStructuredData, buildPageUrl, useSeo, getImageAlt } from "../utils/seo";

const GalleryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [categoriesList, setCategoriesList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedService, setSelectedService] = useState("All");
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch filter metadata once on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, servRes] = await Promise.all([
          axiosInstance.get("/categories"),
          axiosInstance.get("/services")
        ]);
        setCategoriesList(catRes.data.success ? catRes.data.data || [] : catRes.data || []);
        setServicesList(servRes.data.success ? servRes.data.data || [] : servRes.data || []);
      } catch (error) {
        console.error("Error fetching filters data:", error);
      }
    };
    fetchMetadata();
  }, []);

  // Filter services list based on selected category
  const filteredServicesList = useMemo(() => {
    if (selectedCategory === "All") return servicesList;
    return servicesList.filter(
      (service) =>
        service.categoryId?.name?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [servicesList, selectedCategory]);

  // Fetch gallery items dynamically
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 50,
          includeServiceMedia: "true"
        };
        if (selectedCategory !== "All") {
          params.category = selectedCategory;
        }
        if (selectedService !== "All") {
          params.service = selectedService;
        }

        const response = await axiosInstance.get("/gallery", { params });
        if (response.data.success) {
          const fetchedItems = response.data.data || [];
          const shuffled = [...fetchedItems].sort(() => Math.random() - 0.5);
          setItems(shuffled);
          setTotalPages(response.data.pagination?.totalPages || 1);
        } else {
          setItems([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [page, selectedCategory, selectedService]);

  useSeo({
    title: "Gallery | Vishwakarma Build & Furnish",
    description:
      "View Vishwakarma Build & Furnish gallery for modular kitchen, wardrobe, wooden doors, windows, construction, renovation and interior work in Charkhi Dadri, Haryana.",
    path: "/gallery",
    keywords: [
      "construction work gallery Charkhi Dadri",
      "modular kitchen photos Charkhi Dadri",
      "wardrobe design Charkhi Dadri",
      "interior work photos Haryana",
      "Vishwakarma Build & Furnish gallery"
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: "Vishwakarma Build & Furnish Work Gallery",
      description: "Construction, furniture and interior project photos in Charkhi Dadri, Haryana.",
      url: buildPageUrl("/gallery"),
      publisher: simpleBusinessStructuredData,
      associatedMedia: items.slice(0, 20).map((item) => ({
        "@type": "ImageObject",
        name: item.title || item.category || "Vishwakarma Build & Furnish work",
        description: item.description || `${item.category || "Construction and interior"} work by Vishwakarma Build & Furnish in Charkhi Dadri, Haryana`,
        contentUrl: getStaticAssetUrl(item.image)
      }))
    }
  });

  const getGalleryAlt = (item) => {
    const serviceName = item.title || item.category || "construction and interior work";
    const category = item.category ? `${item.category} ` : "";
    const defaultAlt = `${category}${serviceName} by Vishwakarma Build & Furnish in Charkhi Dadri Haryana`;

    return getImageAlt(item.title || item.category, defaultAlt);
  };

  return (
    <Box sx={{ bgcolor: "#111111", color: "#F8FAFC", minHeight: "100vh" }}>
      <Box sx={{ py: { xs: 8, md: 11 }, background: "linear-gradient(135deg, #111111 0%, #0F172A 100%)", borderBottom: "1px solid rgba(212,175,55,0.28)" }}>
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Chip icon={<CollectionsIcon />} label="Gallery" sx={{ bgcolor: "rgba(212,175,55,0.16)", color: "#D4AF37", fontWeight: 900, mb: 2, "& .MuiChip-icon": { color: "#D4AF37" } }} />
          <Typography sx={{ fontSize: { xs: "2.4rem", md: "4rem" }, fontWeight: 900, lineHeight: 1.08, mb: 1.5 }}>
            Our Work Gallery
          </Typography>
          <Typography sx={{ maxWidth: 780, mx: "auto", color: "rgba(248,250,252,0.74)", lineHeight: 1.75 }}>
            Workshop photos, workers, construction sites, furniture manufacturing, and completed interiors.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        {/* Filters Panel */}
        <Box
          sx={{
            mb: 5,
            p: 3,
            borderRadius: 4,
            border: "1px solid rgba(212,175,55,0.2)",
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 3,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <FormControl sx={{ minWidth: 220, "& .MuiOutlinedInput-root": { color: "#F8FAFC", "& fieldset": { borderColor: "rgba(212,175,55,0.3)" }, "&:hover fieldset": { borderColor: "#D4AF37" }, "&.Mui-focused fieldset": { borderColor: "#D4AF37" } }, "& .MuiInputLabel-root": { color: "rgba(248,250,252,0.6)" }, "& .MuiInputLabel-root.Mui-focused": { color: "#D4AF37" } }}>
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              id="category-filter"
              value={selectedCategory}
              label="Category"
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedService("All");
                setPage(1);
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#0F172A",
                    color: "#F8FAFC",
                    border: "1px solid rgba(212,175,55,0.3)",
                    "& .MuiMenuItem-root:hover": { bgcolor: "rgba(212,175,55,0.12)" },
                    "& .MuiMenuItem-root.Mui-selected": { bgcolor: "#D4AF37", color: "#111111" }
                  }
                }
              }}
            >
              <MenuItem value="All">All Categories</MenuItem>
              {categoriesList.map((cat) => (
                <MenuItem key={cat._id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 220, "& .MuiOutlinedInput-root": { color: "#F8FAFC", "& fieldset": { borderColor: "rgba(212,175,55,0.3)" }, "&:hover fieldset": { borderColor: "#D4AF37" }, "&.Mui-focused fieldset": { borderColor: "#D4AF37" } }, "& .MuiInputLabel-root": { color: "rgba(248,250,252,0.6)" }, "& .MuiInputLabel-root.Mui-focused": { color: "#D4AF37" } }}>
            <InputLabel id="service-filter-label">Service</InputLabel>
            <Select
              labelId="service-filter-label"
              id="service-filter"
              value={selectedService}
              label="Service"
              onChange={(e) => {
                setSelectedService(e.target.value);
                setPage(1);
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#0F172A",
                    color: "#F8FAFC",
                    border: "1px solid rgba(212,175,55,0.3)",
                    "& .MuiMenuItem-root:hover": { bgcolor: "rgba(212,175,55,0.12)" },
                    "& .MuiMenuItem-root.Mui-selected": { bgcolor: "#D4AF37", color: "#111111" }
                  }
                }
              }}
            >
              <MenuItem value="All">All Services</MenuItem>
              {filteredServicesList.map((serv) => (
                <MenuItem key={serv._id} value={serv.slug}>
                  {serv.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#D4AF37" }} />
          </Box>
        ) : (
          <>
            {items.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography sx={{ color: "rgba(248,250,252,0.5)", fontSize: "1.2rem" }}>
                  No work photos found matching the selected filters.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 3 }}>
                {items.map((item) => {
                  const image = getStaticAssetUrl(item.image);

                  return (
                    <Paper
                      key={item._id}
                      elevation={0}
                      sx={{
                        minHeight: { xs: 260, md: 330 },
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: 3,
                        border: "1px solid rgba(212,175,55,0.24)",
                        bgcolor: "#0F172A",
                        transition: "0.28s ease",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          borderColor: "#D4AF37",
                          boxShadow: "0 20px 45px rgba(0,0,0,0.35)"
                        },
                        "&:hover .gallery-photo": {
                          transform: "scale(1.06)"
                        }
                      }}
                    >
                      <Box
                        component="img"
                        className="gallery-photo"
                        src={image}
                        alt={getGalleryAlt(item)}
                        title={getGalleryAlt(item)}
                        loading="lazy"
                        sx={{
                          width: "100%",
                          height: { xs: 260, md: 330 },
                          display: "block",
                          objectFit: "cover",
                          transition: "transform 0.35s ease"
                        }}
                      />
                      <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(17,17,17,0.05), rgba(15,23,42,0.88))" }} />
                      <Box sx={{ position: "absolute", left: 20, right: 20, bottom: 20 }}>
                        <Chip label={item.category} size="small" sx={{ bgcolor: "#D4AF37", color: "#111111", fontWeight: 900, mb: 1 }} />
                        <Typography sx={{ color: "#F8FAFC", fontWeight: 900, fontSize: "1.25rem", textShadow: "0 8px 20px rgba(0,0,0,0.5)" }}>
                          {item.title}
                        </Typography>
                        {item.description && (
                          <Typography sx={{ color: "rgba(248,250,252,0.74)", fontSize: "0.92rem", mt: 0.5 }}>
                            {item.description}
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => {
                    setPage(value);
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#F8FAFC",
                      borderColor: "rgba(212,175,55,0.3)",
                      "&:hover": {
                        bgcolor: "rgba(212,175,55,0.12)",
                        borderColor: "#D4AF37"
                      },
                      "&.Mui-selected": {
                        bgcolor: "#D4AF37",
                        color: "#111111",
                        fontWeight: 900,
                        "&:hover": {
                          bgcolor: "#D4AF37"
                        }
                      }
                    }
                  }}
                  variant="outlined"
                  shape="rounded"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default GalleryPage;
