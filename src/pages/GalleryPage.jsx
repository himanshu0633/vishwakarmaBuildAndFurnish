import React, { useEffect, useMemo, useState } from "react";
import { Box, Chip, CircularProgress, Container, Paper, Typography } from "@mui/material";
import CollectionsIcon from "@mui/icons-material/Collections";
import axiosInstance, { getStaticAssetUrl } from "../../utils/axiosConfig";
import { businessStructuredData, buildPageUrl, useSeo, getImageAlt } from "../utils/seo";

const GalleryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/gallery");
        setItems(response.data.success ? response.data.data || [] : []);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const categories = useMemo(() => ["All", ...new Set(items.map((item) => item.category).filter(Boolean))], [items]);
  const filteredItems = selectedCategory === "All" ? items : items.filter((item) => item.category === selectedCategory);

  useSeo({
    title: "Construction, Furniture & Interior Work Gallery in Charkhi Dadri",
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
      publisher: businessStructuredData,
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
        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#D4AF37" }} />
          </Box>
        ) : (
          <>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", mb: 4 }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => setSelectedCategory(category)}
                  sx={{
                    bgcolor: selectedCategory === category ? "#D4AF37" : "rgba(212,175,55,0.12)",
                    color: selectedCategory === category ? "#111111" : "#F8FAFC",
                    fontWeight: 900
                  }}
                />
              ))}
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 3 }}>
              {filteredItems.map((item) => {
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
          </>
        )}
      </Container>
    </Box>
  );
};

export default GalleryPage;
