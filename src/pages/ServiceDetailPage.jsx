import React, { useEffect, useState, useRef } from "react";
import { Box, Button, Chip, CircularProgress, Container, Paper, Typography, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate, useParams } from "react-router-dom";
import { useQuoteModal } from "../contexts/QuoteModalContext";
import axiosInstance, { getStaticAssetUrl } from "../../utils/axiosConfig";
import { getCategoryName, getServiceDescription, getServiceFullDescription } from "../utils/catalogSchema";
import { buildServiceSeo, simpleBusinessStructuredData, buildPageUrl, useSeo, getImageAlt } from "../utils/seo";

const ServiceDetailPage = () => {
  const { categorySlug, serviceSlug } = useParams();
  const navigate = useNavigate();
  const { openQuote } = useQuoteModal();

  const isMobile = window.innerWidth < 600;
  const galleryPageSize = isMobile ? 10 : 15;
  const galleryTopRef = useRef(null);
  const galleryBottomRef = useRef(null);
  const paginationScrollTarget = useRef("");

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
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
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/services/slug/${serviceSlug}`);
        setService(res.data.data);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceSlug]);

  useEffect(() => {
    setMediaPage(1);
  }, [serviceSlug]);

  useEffect(() => {
    if (!service?.slug) return;

    const fetchServiceMedia = async () => {
      try {
        setMediaLoading(true);
        const response = await axiosInstance.get(`/services/slug/${service.slug}/media?page=${mediaPage}&limit=${galleryPageSize}`);
        if (response.data.success) {
          setMediaData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching service media:", error);
      } finally {
        setMediaLoading(false);
        if (paginationScrollTarget.current === "top" && galleryTopRef.current) {
          galleryTopRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        } else if (paginationScrollTarget.current === "bottom" && galleryBottomRef.current) {
          galleryBottomRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        paginationScrollTarget.current = "";
      }
    };

    fetchServiceMedia();
  }, [service?.slug, mediaPage, galleryPageSize]);

  const serviceImage = getStaticAssetUrl(service?.heroImage || service?.images?.[0] || "");
  const serviceImageUrls = [
    service?.heroImage,
    ...(service?.images || []),
    ...(service?.beforeImages || []),
    ...(service?.afterImages || [])
  ].filter(Boolean).slice(0, 12).map((image) => getStaticAssetUrl(image));

  const categoryName = service?.categoryId?.name || getCategoryName(service?.categoryId);
  const serviceSeo = buildServiceSeo(service?.name || "Service");
  const localServiceAreas = ["Charkhi Dadri", "Bhiwani", "Mahendragarh", "Rewari", "Rohtak", "Jhajjar", "Nearby villages", "Haryana"];

  useSeo({
    title: service?.seoTitle || (service?.name ? `${service.name} in Charkhi Dadri | Vishwakarma Build & Furnish` : "Service Detail"),
    description: service?.seoDescription || service?.shortDescription || `Premium ${service?.name} services in Charkhi Dadri Haryana.`,
    path: serviceSlug ? `/services/${categorySlug}/${serviceSlug}` : "/services",
    image: serviceImage,
    keywords: [
      ...(serviceSeo.keywords || []),
      ...(service?.tags || []),
      service?.name,
      `${service?.name} images`,
      `latest ${service?.name} design`,
      `best ${service?.name} in Charkhi Dadri`,
      "Haryana"
    ],
    structuredData: service
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "@id": `${buildPageUrl(`/services/${categorySlug}/${service.slug}`)}#service`,
              name: service.name,
              description: service.seoDescription || getServiceFullDescription(service),
              image: serviceImageUrls.length ? serviceImageUrls : [serviceImage],
              provider: simpleBusinessStructuredData,
              areaServed: localServiceAreas,
              serviceArea: localServiceAreas.map((area) => ({ "@type": "Place", name: area })),
              category: categoryName,
              url: buildPageUrl(`/services/${categorySlug}/${service.slug}`),
              offers: service.priceStarting
                ? {
                    "@type": "Offer",
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      priceCurrency: "INR",
                      description: service.priceStarting
                    }
                  }
                : undefined,
              review: {
                "@type": "Review",
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "5",
                  bestRating: "5"
                },
                author: {
                  "@type": "Person",
                  name: "Local Customer"
                },
                reviewBody: `Reliable ${service.name} service with clear pricing and good finishing quality.`
              }
            },
            {
              "@type": "ImageGallery",
              "@id": `${buildPageUrl(`/services/${categorySlug}/${service.slug}`)}#images`,
              name: `${service.name} Images`,
              image: serviceImageUrls.map((imageUrl, index) => ({
                "@type": "ImageObject",
                contentUrl: imageUrl,
                url: imageUrl,
                name: `${service.name} image ${index + 1}`,
                caption: `${service.name} design and work in Charkhi Dadri Haryana`
              }))
            },
            {
              "@type": "FAQPage",
              "@id": `${buildPageUrl(`/services/${categorySlug}/${service.slug}`)}#faq`,
              mainEntity: (service.faq || []).filter((item) => item.question || item.answer).map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer
                }
              }))
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${buildPageUrl(`/services/${categorySlug}/${service.slug}`)}#breadcrumbs`,
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: buildPageUrl("/") },
                { "@type": "ListItem", position: 2, name: categoryName || "Services", item: buildPageUrl(`/services/${categorySlug}`) },
                { "@type": "ListItem", position: 3, name: service.name, item: buildPageUrl(`/services/${categorySlug}/${service.slug}`) }
              ]
            }
          ]
        }
      : null
  });

  const shareMediaOnWhatsApp = (serviceName, mediaUrl) => {
    const message = `Hello Vishwakarma Build & Furnish, I am interested in ${serviceName}. Please share details for this image: ${mediaUrl}`;
    window.open(`https://wa.me/919416856468?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareServicePage = async () => {
    const url = window.location.href;
    const title = service?.name ? `${service.name} | Vishwakarma Build & Furnish` : document.title;
    const text = service?.name
      ? `Check this ${service.name} service by Vishwakarma Build & Furnish`
      : "Check this service by Vishwakarma Build & Furnish";

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      alert("Service page link copied");
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error sharing service page:", error);
      }
    }
  };

  const likeService = async (imageUrl = "") => {
    await axiosInstance.post("/marketplace/likes", {
      serviceId: service._id,
      imageUrl
    });
    navigate("/dashboard");
  };

  const goToMediaPage = (direction) => {
    paginationScrollTarget.current = direction > 0 ? "top" : "bottom";
    setMediaPage(prev => Math.max(prev + direction, 1));
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center", bgcolor: "#111111" }}>
        <CircularProgress sx={{ color: "#D4AF37" }} />
      </Box>
    );
  }

  if (!service) {
    return <Box sx={{ minHeight: "60vh", bgcolor: "#111111", color: "#fff", p: 4 }}>Service not found</Box>;
  }

  const heroImage = service.heroImage || "";
  const heroImageUrl = heroImage ? getStaticAssetUrl(heroImage) : "";
  const filteredMediaItems = (mediaData.items || []).filter(mediaItem => mediaItem.url !== heroImage);
  const lightboxItems = filteredMediaItems
    .filter(mediaItem => mediaItem.type === "image")
    .map((mediaItem, index) => ({
      ...mediaItem,
      index,
      src: getStaticAssetUrl(mediaItem.url)
    }));

  const openLightbox = (mediaItem) => {
    const index = lightboxItems.findIndex(item => item.url === mediaItem.url);
    setSelectedMedia(lightboxItems[index] || null);
  };

  const showLightboxItem = (direction) => {
    if (!lightboxItems.length) return;
    setSelectedMedia(prev => {
      const currentIndex = prev?.index ?? 0;
      const nextIndex = (currentIndex + direction + lightboxItems.length) % lightboxItems.length;
      return lightboxItems[nextIndex];
    });
  };

  const galleryGroups = filteredMediaItems.reduce((groups, mediaItem) => {
    const existingGroup = groups.find(group => group.title === mediaItem.title);
    if (existingGroup) {
      existingGroup.items.push(mediaItem);
    } else {
      groups.push({ title: mediaItem.title, items: [mediaItem] });
    }
    return groups;
  }, []);

  const features = service.features?.length ? service.features : [
    "Premium Materials",
    "Modern Designs",
    "Custom Sizes",
    "Expert Craftsmanship"
  ];

  const relatedServices = service.relatedServices || [];

  const getRelatedImage = (relService) => {
    const image = relService.heroImage || relService.images?.[0] || "";
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
            label={categoryName || "Service"}
            sx={{ bgcolor: "rgba(212,175,55,0.18)", color: "#D4AF37", mb: 2, fontWeight: 800 }}
          />
          <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: "2.15rem", sm: "2.7rem", md: "4.4rem" }, lineHeight: 1.08, overflowWrap: "anywhere", mb: 2, maxWidth: 900 }}>
            {service.name}
          </Typography>
          <Typography sx={{ color: "rgba(245,245,245,0.82)", maxWidth: 760, fontSize: { xs: "1rem", md: "1.18rem" }, lineHeight: 1.75, mb: 3 }}>
            {getServiceDescription(service)}
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={() => openQuote(service.name)}
              sx={{ bgcolor: "#D4AF37", color: "#111111", fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#B88917" } }}
            >
              Get Quote
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)} sx={{ borderColor: "#D4AF37", color: "#D4AF37", textTransform: "none" }}>
              Back
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={shareServicePage}
              sx={{ borderColor: "#D4AF37", color: "#D4AF37", textTransform: "none" }}
            >
              Share
            </Button>
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
                <Box ref={galleryTopRef} />
                {galleryGroups.map(group => (
                  <Box key={group.title} sx={{ mb: 4 }}>
                    <Typography sx={{ fontWeight: 900, fontSize: "1.25rem", mb: 1.5, color: "#F5F5F5" }}>
                      {group.title}
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: { xs: 1, sm: 2 } }}>
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
                                  alt={getImageAlt(service.name, `${service.name} ${group.title} design and work in Charkhi Dadri Haryana`)}
                                  title={getImageAlt(service.name, `${service.name} ${group.title} design and work in Charkhi Dadri Haryana`)}
                                  onClick={() => openLightbox(mediaItem)}
                                  sx={{
                                    width: "100%",
                                    display: "block",
                                    aspectRatio: { xs: "1/1", sm: "16/9" },
                                    objectFit: "cover",
                                    bgcolor: "#050816",
                                    cursor: "zoom-in",
                                    transition: "transform 0.35s ease"
                                  }}
                                />
                                <Button
                                  size="small"
                                  startIcon={<ShareIcon />}
                                  onClick={() => shareMediaOnWhatsApp(service.name, src)}
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
                <Box ref={galleryBottomRef} />
                {mediaData.totalPages > 1 && (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 2, flexWrap: "wrap" }}>
                    <Button
                      disabled={!mediaData.hasPrev}
                      onClick={() => goToMediaPage(-1)}
                      variant="outlined"
                      sx={{ borderColor: "#D4AF37", color: "#D4AF37", textTransform: "none", minWidth: { xs: 130, sm: 0 } }}
                    >
                      Previous
                    </Button>
                    <Typography sx={{ color: "#F5F5F5", fontWeight: 900, minWidth: { xs: "100%", sm: 0 }, textAlign: "center", order: { xs: -1, sm: 0 } }}>
                      Page {mediaData.page} / {mediaData.totalPages}
                    </Typography>
                    <Button
                      disabled={!mediaData.hasNext}
                      onClick={() => goToMediaPage(1)}
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
                {getServiceFullDescription(service)}
              </Typography>
            </Paper>

            {service.faq?.length > 0 && (
              <Paper sx={{ p: { xs: 3, md: 4 }, bgcolor: "#0F172A", color: "#F5F5F5", border: "1px solid rgba(212,175,55,0.22)", borderRadius: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "#D4AF37", mb: 2 }}>FAQ</Typography>
                {service.faq.map((faqItem, index) => (
                  <Box key={index} sx={{ py: 1.8, borderBottom: index === service.faq.length - 1 ? "none" : "1px solid rgba(212,175,55,0.14)" }}>
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
              {service.priceStarting && (
                <Typography sx={{ color: "#F5F5F5", fontWeight: 900, mb: 1.5 }}>
                  {service.priceStarting}
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
              {relatedServices.map((relService) => {
                const image = getRelatedImage(relService);

                return (
                  <Paper
                    key={relService._id}
                    onClick={() => navigate(`/services/${categorySlug}/${relService.slug}`)}
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
                        ? `linear-gradient(180deg, rgba(17,17,17,0.36), rgba(15,23,42,0.94)), url("${image}") center/100% 100% no-repeat`
                        : "#111827",
                      transition: "0.28s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        borderColor: "#D4AF37",
                        boxShadow: "0 10px 24px rgba(0,0,0,0.5)",
                        background: image
                          ? `linear-gradient(180deg, rgba(17,17,17,0.25), rgba(15,23,42,0.96)), url("${image}") center/100% 100% no-repeat`
                          : "#111827"
                      }
                    }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: 900, fontSize: "1.45rem", mb: 1, zIndex: 2 }}>
                      {relService.name}
                    </Typography>
                    <Typography sx={{ color: "rgba(245,245,245,0.78)", mb: 2, lineHeight: 1.55 }}>
                      {getServiceDescription(relService) || "Explore this related service for your project."}
                    </Typography>
                    {relService.priceStarting && (
                      <Typography sx={{ color: "#D4AF37", fontWeight: 900 }}>
                        {relService.priceStarting}
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
              alt={getImageAlt(service.name, `${service.name} ${selectedMedia?.title || "work"} preview in Charkhi Dadri Haryana`)}
              title={getImageAlt(service.name, `${service.name} ${selectedMedia?.title || "work"} preview in Charkhi Dadri Haryana`)}
              sx={{
                width: "100%",
                maxHeight: "78vh",
                display: "block",
                objectFit: "contain",
                bgcolor: "#050816"
              }}
            />
            {lightboxItems.length > 1 && (
              <>
                <IconButton
                  onClick={() => showLightboxItem(-1)}
                  sx={{
                    position: "absolute",
                    left: { xs: 8, md: 14 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: { xs: 42, md: 54 },
                    height: { xs: 42, md: 54 },
                    bgcolor: "rgba(17,17,17,0.78)",
                    color: "#F5F5F5",
                    border: "1px solid rgba(212,175,55,0.32)",
                    "&:hover": { bgcolor: "rgba(17,17,17,0.95)", color: "#D4AF37" }
                  }}
                >
                  <KeyboardArrowLeftIcon fontSize="large" />
                </IconButton>
                <IconButton
                  onClick={() => showLightboxItem(1)}
                  sx={{
                    position: "absolute",
                    right: { xs: 8, md: 14 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: { xs: 42, md: 54 },
                    height: { xs: 42, md: 54 },
                    bgcolor: "rgba(17,17,17,0.78)",
                    color: "#F5F5F5",
                    border: "1px solid rgba(212,175,55,0.32)",
                    "&:hover": { bgcolor: "rgba(17,17,17,0.95)", color: "#D4AF37" }
                  }}
                >
                  <KeyboardArrowRightIcon fontSize="large" />
                </IconButton>
              </>
            )}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, gap: 1, p: 1.5, bgcolor: "#111827" }}>
              <Typography sx={{ color: "#F5F5F5", fontWeight: 800, overflowWrap: "anywhere" }}>
                {service.name}{lightboxItems.length > 1 ? ` (${(selectedMedia?.index ?? 0) + 1}/${lightboxItems.length})` : ""}
              </Typography>
              <Button
                startIcon={<ShareIcon />}
                onClick={() => selectedMedia && shareMediaOnWhatsApp(service.name, selectedMedia.src)}
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
};

export default ServiceDetailPage;
