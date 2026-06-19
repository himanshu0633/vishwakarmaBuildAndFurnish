import React, { useEffect, useState } from "react";
import { Box, Button, Chip, CircularProgress, Container, IconButton, Modal, Paper, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance, { getStaticAssetUrl, logStaticAssetUrl } from "../../utils/axiosConfig";
import {
  getCategoryEmoji,
  getCategoryName,
  getServiceDescription,
  getServiceFullDescription
} from "../utils/catalogSchema";
import { buildPageUrl, buildServiceSeo, businessStructuredData, useSeo } from "../utils/seo";

const CatalogSlugPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sliderTick, setSliderTick] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPage, setMediaPage] = useState(1);
  const [mediaData, setMediaData] = useState({
    items: [],
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
    hasPrev: false,
    hasNext: false
  });
  const [mediaLoading, setMediaLoading] = useState(false);

  useEffect(() => {
    const fetchCatalogItem = async () => {
      try {
        setLoading(true);

        try {
          const categoryRes = await axiosInstance.get(`/categories/slug/${slug}`);
          setType("category");
          setItem(categoryRes.data.data);
          return;
        } catch (categoryError) {
          const serviceRes = await axiosInstance.get(`/services/slug/${slug}`);
          setType("service");
          setItem(serviceRes.data.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogItem();
  }, [slug]);

  useEffect(() => {
    setMediaPage(1);
  }, [slug]);

  useEffect(() => {
    if (type !== "service" || !item?.slug) return;

    const fetchServiceMedia = async () => {
      try {
        setMediaLoading(true);
        const response = await axiosInstance.get(`/services/slug/${item.slug}/media?page=${mediaPage}&limit=15`);
        if (response.data.success) {
          setMediaData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching service media:", error);
      } finally {
        setMediaLoading(false);
      }
    };

    fetchServiceMedia();
  }, [type, item?.slug, mediaPage]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSliderTick(prev => prev + 1);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const getServiceImages = (service) => [
    ...(service.images || []),
    ...(service.beforeImages || []),
    ...(service.afterImages || [])
  ];

  const itemName = type === "service" ? item?.name : getCategoryName(item);
  const serviceSeo = type === "service" ? buildServiceSeo(itemName) : null;
  const seoPath = slug ? `/services/${slug}` : "/services";

  useSeo({
    title:
      type === "service"
        ? item?.seoTitle || serviceSeo?.title
        : itemName
          ? `${itemName} Services in Charkhi Dadri`
          : "Construction, Furniture & Interior Services in Charkhi Dadri",
    description:
      type === "service"
        ? item?.seoDescription || serviceSeo?.description
        : item?.description || "Explore construction, furniture, modular kitchen, wardrobe and interior services by Vishwakarma Build & Furnish in Charkhi Dadri, Haryana.",
    path: seoPath,
    image: type === "service" ? getStaticAssetUrl(item?.heroImage || item?.images?.[0] || "") : undefined,
    keywords:
      type === "service"
        ? [...(serviceSeo?.keywords || []), ...(item?.tags || [])]
        : [
            `${itemName || "services"} Charkhi Dadri`,
            `${itemName || "services"} Haryana`,
            "Vishwakarma Build & Furnish",
            "construction services Charkhi Dadri",
            "interior services Charkhi Dadri"
          ],
    structuredData:
      type === "service" && item
        ? {
            "@context": "https://schema.org",
            "@type": "Service",
            name: item.name,
            description: item.seoDescription || getServiceFullDescription(item),
            image: getStaticAssetUrl(item.heroImage || item.images?.[0] || ""),
            provider: businessStructuredData,
            areaServed: businessStructuredData.areaServed,
            category: getCategoryName(item.categoryId) || "Construction and Interior",
            url: buildPageUrl(seoPath)
          }
        : null
  });

  const shareMediaOnWhatsApp = (serviceName, mediaUrl) => {
    const message = `Hello Vishwakarma Build & Furnish, I am interested in ${serviceName}. Please share details for this image: ${mediaUrl}`;
    window.open(`https://wa.me/919416856468?text=${encodeURIComponent(message)}`, "_blank");
  };

  const likeService = async (imageUrl = "") => {
    await axiosInstance.post("/marketplace/likes", {
      serviceId: item._id,
      imageUrl
    });
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center", bgcolor: "#111111" }}>
        <CircularProgress sx={{ color: "#D4AF37" }} />
      </Box>
    );
  }

  if (!item) {
    return <Box sx={{ minHeight: "60vh", bgcolor: "#111111", color: "#fff", p: 4 }}>Page not found</Box>;
  }

  if (type === "service") {
    const heroImage = item.heroImage || item.images?.[0] || item.beforeImages?.[0] || item.afterImages?.[0] || "";
    const heroImageUrl = heroImage ? getStaticAssetUrl(heroImage) : "";
    const galleryGroups = mediaData.items.reduce((groups, mediaItem) => {
      const existingGroup = groups.find(group => group.title === mediaItem.title);
      if (existingGroup) {
        existingGroup.items.push(mediaItem);
      } else {
        groups.push({ title: mediaItem.title, items: [mediaItem] });
      }
      return groups;
    }, []);
    const features = item.features?.length ? item.features : [
      "Premium Materials",
      "Modern Designs",
      "Custom Sizes",
      "Expert Craftsmanship"
    ];
    const relatedServices = item.relatedServices || [];
    const getRelatedImage = (service) => {
      const image = service.heroImage || service.images?.[0] || "";
      return image ? getStaticAssetUrl(image) : "";
    };

    return (
      <Box sx={{ bgcolor: "#111111", color: "#F5F5F5" }}>
        <Box
          sx={{
            minHeight: { xs: 460, md: 560 },
            display: "flex",
            alignItems: "center",
            background: heroImageUrl
              ? `linear-gradient(90deg, rgba(17,17,17,0.92), rgba(15,23,42,0.76), rgba(17,17,17,0.42)), url("${heroImageUrl}") center/cover no-repeat`
              : "linear-gradient(135deg, #111111 0%, #0F172A 100%)",
            borderBottom: "1px solid rgba(212,175,55,0.25)"
          }}
        >
          <Container sx={{ py: { xs: 5, md: 0 } }}>
            <Chip
              label={getCategoryName(item.categoryId) || "Service"}
              sx={{ bgcolor: "rgba(212,175,55,0.18)", color: "#D4AF37", mb: 2, fontWeight: 800 }}
            />
            <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: "2.15rem", sm: "2.7rem", md: "4.4rem" }, lineHeight: 1.08, overflowWrap: "anywhere", mb: 2, maxWidth: 900 }}>
              {item.name}
            </Typography>
            <Typography sx={{ color: "rgba(245,245,245,0.82)", maxWidth: 760, fontSize: { xs: "1rem", md: "1.18rem" }, lineHeight: 1.75, mb: 3 }}>
              {getServiceDescription(item)}
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                href={`https://wa.me/919416856468?text=${encodeURIComponent(`Hello Vishwakarma Build & Furnish, I want a quote for ${item.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ bgcolor: "#D4AF37", color: "#111111", fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#B88917" } }}
              >
                Get Quote
              </Button>
              <Button variant="outlined" onClick={() => navigate(-1)} sx={{ borderColor: "#D4AF37", color: "#D4AF37", textTransform: "none" }}>
                Back
              </Button>
              {/* <Button
                variant="outlined"
                startIcon={<FavoriteIcon />}
                onClick={() => likeService(heroImage)}
                sx={{ borderColor: "#D4AF37", color: "#D4AF37", textTransform: "none" }}
              >
                Like Service
              </Button> */}
            </Box>
          </Container>
        </Box>

        <Container sx={{ py: { xs: 6, md: 9 } }}>
          {(galleryGroups.length > 0 || mediaLoading) && (
            <Box sx={{ mb: { xs: 5, md: 7 } }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap", mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: "#D4AF37" }}>
                  Gallery
                </Typography>
                <Typography sx={{ color: "rgba(245,245,245,0.72)", fontWeight: 800 }}>
                  Page {mediaData.page} of {mediaData.totalPages} • {mediaData.total} media
                </Typography>
              </Box>
              {mediaLoading ? (
                <Box sx={{ display: "grid", placeItems: "center", py: 5 }}>
                  <CircularProgress sx={{ color: "#D4AF37" }} />
                </Box>
              ) : (
                <>
                  {galleryGroups.map(group => (
                    <Box key={group.title} sx={{ mb: 4 }}>
                      <Typography sx={{ fontWeight: 900, fontSize: "1.25rem", mb: 1.5, color: "#F5F5F5" }}>
                        {group.title}
                      </Typography>
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2 }}>
                        {group.items.map((mediaItem) => {
                          const src = getStaticAssetUrl(mediaItem.url);
                          return (
                            <Paper
                              key={`${mediaItem.field}-${mediaItem.url}`}
                              sx={{
                                overflow: "hidden",
                                bgcolor: "#0F172A",
                                border: "1px solid rgba(212,175,55,0.2)",
                                borderRadius: 2,
                                position: "relative",
                                "&:hover .gallery-image": {
                                  transform: "scale(1.08)"
                                }
                              }}
                            >
                              {mediaItem.type === "video" ? (
                                <Box component="video" src={src} controls sx={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "contain", bgcolor: "#050816" }} />
                              ) : (
                                <>
                                  <Box
                                    className="gallery-image"
                                    component="img"
                                    src={src}
                                    alt={`${item.name} ${group.title} design and work in Charkhi Dadri Haryana`}
                                    onClick={() => setSelectedMedia({ src, title: group.title })}
                                    sx={{
                                      width: "100%",
                                      display: "block",
                                      aspectRatio: "16/9",
                                      objectFit: "contain",
                                      bgcolor: "#050816",
                                      cursor: "zoom-in",
                                      transition: "transform 0.35s ease"
                                    }}
                                  />
                                  <Button
                                    size="small"
                                    startIcon={<ShareIcon />}
                                    onClick={() => shareMediaOnWhatsApp(item.name, src)}
                                    sx={{
                                      position: "absolute",
                                      right: 10,
                                      bottom: 10,
                                      bgcolor: "rgba(17,17,17,0.82)",
                                      color: "#D4AF37",
                                      border: "1px solid rgba(212,175,55,0.36)",
                                      textTransform: "none",
                                      fontWeight: 800,
                                      "&:hover": { bgcolor: "rgba(15,23,42,0.95)" }
                                    }}
                                  >
                                    Share
                                  </Button>
                                  <Button
                                    size="small"
                                    startIcon={<FavoriteIcon />}
                                    onClick={() => likeService(mediaItem.url)}
                                    sx={{
                                      position: "absolute",
                                      left: 10,
                                      bottom: 10,
                                      bgcolor: "rgba(17,17,17,0.82)",
                                      color: "#D4AF37",
                                      border: "1px solid rgba(212,175,55,0.36)",
                                      textTransform: "none",
                                      fontWeight: 800,
                                      "&:hover": { bgcolor: "rgba(15,23,42,0.95)" }
                                    }}
                                  >
                                    Like
                                  </Button>
                                </>
                              )}
                            </Paper>
                          );
                        })}
                      </Box>
                    </Box>
                  ))}
                  {mediaData.totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2, flexWrap: "wrap" }}>
                      <Button
                        disabled={!mediaData.hasPrev}
                        onClick={() => setMediaPage(prev => Math.max(prev - 1, 1))}
                        variant="outlined"
                        sx={{ borderColor: "#D4AF37", color: "#D4AF37", textTransform: "none", minWidth: { xs: 130, sm: 0 } }}
                      >
                        Previous
                      </Button>
                      <Button
                        disabled={!mediaData.hasNext}
                        onClick={() => setMediaPage(prev => prev + 1)}
                        variant="contained"
                        sx={{ bgcolor: "#D4AF37", color: "#111111", fontWeight: 900, textTransform: "none", minWidth: { xs: 130, sm: 0 }, "&:hover": { bgcolor: "#B88917" } }}
                      >
                        Next Page
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </Box>
          )}

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.55fr 0.95fr" }, gap: 3, alignItems: "start" }}>
            <Box>
              <Paper sx={{ p: { xs: 3, md: 4 }, bgcolor: "#0F172A", color: "#F5F5F5", border: "1px solid rgba(212,175,55,0.22)", borderRadius: 3, mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: "#D4AF37", mb: 2 }}>
                  Service Details
                </Typography>
                <Typography sx={{ color: "rgba(245,245,245,0.78)", fontSize: "1rem", lineHeight: 1.85 }}>
                  {getServiceFullDescription(item)}
                </Typography>
              </Paper>

              {item.faq?.length > 0 && (
                <Paper sx={{ p: { xs: 3, md: 4 }, bgcolor: "#0F172A", color: "#F5F5F5", border: "1px solid rgba(212,175,55,0.22)", borderRadius: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: "#D4AF37", mb: 2 }}>FAQ</Typography>
                  {item.faq.map((faqItem, index) => (
                    <Box key={index} sx={{ py: 1.8, borderBottom: index === item.faq.length - 1 ? "none" : "1px solid rgba(212,175,55,0.14)" }}>
                      <Typography sx={{ fontWeight: 900, color: "#F5F5F5", mb: 0.5 }}>{faqItem.question}</Typography>
                      <Typography sx={{ color: "rgba(245,245,245,0.72)" }}>{faqItem.answer}</Typography>
                    </Box>
                  ))}
                </Paper>
              )}
            </Box>

            <Box sx={{ display: "grid", gap: 3 }}>
              <Paper sx={{ p: 3, bgcolor: "#111827", color: "#F5F5F5", border: "1px solid rgba(212,175,55,0.26)", borderRadius: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "#D4AF37", mb: 2 }}>
                  Features
                </Typography>
                <Box sx={{ display: "grid", gap: 1 }}>
                  {features.map(feature => (
                    <Typography key={feature} sx={{ color: "rgba(245,245,245,0.82)" }}>
                      ✔ {feature}
                    </Typography>
                  ))}
                </Box>
              </Paper>

              <Paper sx={{ p: 3, bgcolor: "#111827", color: "#F5F5F5", border: "1px solid rgba(212,175,55,0.26)", borderRadius: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "#D4AF37", mb: 1 }}>
                  Price Note
                </Typography>
                {item.priceStarting && (
                  <Typography sx={{ color: "#F5F5F5", fontWeight: 900, mb: 1.5 }}>
                    {item.priceStarting}
                  </Typography>
                )}
                <Typography sx={{ color: "rgba(245,245,245,0.74)", lineHeight: 1.7 }}>
                  Pricing depends on your required quality, materials, customization, and project quantity.
                </Typography>
              </Paper>
            </Box>
          </Box>

          {relatedServices.length > 0 && (
            <Box sx={{ mt: { xs: 5, md: 7 } }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#D4AF37", mb: 3 }}>
                Related Services
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 3 }}>
                {relatedServices.map((service) => {
                  const image = getRelatedImage(service);

                  return (
                    <Paper
                      key={service._id}
                      onClick={() => navigate(`/services/${service.slug}`)}
                      sx={{
                        minHeight: 250,
                        p: 3,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        overflow: "hidden",
                        position: "relative",
                        borderRadius: 3,
                        border: "1px solid rgba(212,175,55,0.24)",
                        color: "#F5F5F5",
                        background: image
                          ? `linear-gradient(180deg, rgba(17,17,17,0.36), rgba(15,23,42,0.94)), url("${image}") center/cover no-repeat`
                          : "#111827",
                        transition: "0.28s ease",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          borderColor: "#D4AF37",
                          boxShadow: "0 18px 42px rgba(0,0,0,0.32)"
                        }
                      }}
                    >
                      <Typography sx={{ fontSize: "2rem", mb: 1 }}>{service.emoji || "🔧"}</Typography>
                      <Typography sx={{ fontWeight: 900, fontSize: "1.35rem", mb: 1 }}>
                        {service.name}
                      </Typography>
                      <Typography sx={{ color: "rgba(245,245,245,0.78)", mb: 2, lineHeight: 1.55 }}>
                        {getServiceDescription(service) || "Explore this related service for your project."}
                      </Typography>
                      {service.priceStarting && (
                        <Typography sx={{ color: "#D4AF37", fontWeight: 900 }}>
                          {service.priceStarting}
                        </Typography>
                      )}
                    </Paper>
                  );
                })}
              </Box>
            </Box>
          )}
        </Container>
        <Modal open={!!selectedMedia} onClose={() => setSelectedMedia(null)}>
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.9)",
              display: "grid",
              placeItems: "center",
              p: { xs: 1.5, md: 4 }
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 1100,
                maxHeight: "88vh",
                bgcolor: "#050816",
                border: "1px solid rgba(212,175,55,0.34)",
                borderRadius: 2,
                overflow: "hidden"
              }}
            >
              <Box
                component="img"
                src={selectedMedia?.src || ""}
                alt={`${item.name} ${selectedMedia?.title || "work"} preview in Charkhi Dadri Haryana`}
                sx={{
                  width: "100%",
                  maxHeight: "78vh",
                  display: "block",
                  objectFit: "contain",
                  bgcolor: "#050816"
                }}
              />
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, gap: 1, p: 1.5, bgcolor: "#111827" }}>
                <Typography sx={{ color: "#F5F5F5", fontWeight: 800, overflowWrap: "anywhere" }}>
                  {item.name}
                </Typography>
                <Button
                  startIcon={<ShareIcon />}
                  onClick={() => selectedMedia && shareMediaOnWhatsApp(item.name, selectedMedia.src)}
                  sx={{ color: "#D4AF37", textTransform: "none", fontWeight: 900, justifyContent: "center" }}
                >
                  Share on WhatsApp
                </Button>
                <Button
                  startIcon={<FavoriteIcon />}
                  onClick={() => selectedMedia && likeService(selectedMedia.src)}
                  sx={{ color: "#D4AF37", textTransform: "none", fontWeight: 900, justifyContent: "center" }}
                >
                  Like Image
                </Button>
              </Box>
              <IconButton
                onClick={() => setSelectedMedia(null)}
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  bgcolor: "rgba(17,17,17,0.78)",
                  color: "#F5F5F5",
                  "&:hover": { bgcolor: "rgba(17,17,17,0.95)" }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </Modal>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#111111", color: "#F5F5F5", py: { xs: 6, md: 9 } }}>
      <Container>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Chip label="Services" sx={{ bgcolor: "rgba(212,175,55,0.18)", color: "#D4AF37", mb: 2 }} />
          <Typography variant="h2" sx={{ fontWeight: 900, fontSize: { xs: "2.1rem", md: "3.5rem" } }}>
            {getCategoryEmoji(item)} {getCategoryName(item)}
          </Typography>
          <Typography sx={{ color: "rgba(245,245,245,0.72)", maxWidth: 720, mx: "auto", mt: 2 }}>
            {item.description}
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(3, 1fr)" }, gap: 3, alignItems: "stretch" }}>
          {(item.services || []).map(service => {
            const serviceImages = getServiceImages(service);
            const activeImage = serviceImages.length
              ? logStaticAssetUrl(`category-card:${service.name}`, serviceImages[sliderTick % serviceImages.length])
              : "";

            return (
              <Paper
                key={service._id}
                onClick={() => navigate(`/services/${service.slug}`)}
                sx={{
                  p: 3,
                  cursor: "pointer",
                  minHeight: 230,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 1,
                  bgcolor: "rgba(245,245,245,0.05)",
                  background: activeImage
                    ? `linear-gradient(180deg, rgba(17,17,17,0.58), rgba(15,23,42,0.92)), url("${activeImage}") center/cover no-repeat`
                    : "rgba(245,245,245,0.05)",
                  color: "#F5F5F5",
                  border: "1px solid rgba(212,175,55,0.2)",
                  borderRadius: 2,
                  transition: "0.25s",
                  "&:hover": { borderColor: "#D4AF37", transform: "translateY(-4px)" }
                }}
              >
                <Typography sx={{ fontSize: "2.4rem", mb: 1 }}>{service.emoji || "🔧"}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, overflowWrap: "anywhere" }}>{service.name}</Typography>
                <Typography sx={{ color: "rgba(245,245,245,0.78)", mb: 2 }}>
                  {getServiceDescription(service)}
                </Typography>
                {service.priceStarting && <Typography sx={{ color: "#D4AF37", fontWeight: 800 }}>{service.priceStarting}</Typography>}
              </Paper>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default CatalogSlugPage;
