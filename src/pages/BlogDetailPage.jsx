import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Modal,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import DescriptionIcon from "@mui/icons-material/Description";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import LayersIcon from "@mui/icons-material/Layers";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import SpeedIcon from "@mui/icons-material/Speed";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import HomeIcon from "@mui/icons-material/Home";

import { useNavigate, useParams } from "react-router-dom";
import axiosInstance, { getStaticAssetUrl } from "../../utils/axiosConfig";
import { businessStructuredData, buildPageUrl, useSeo } from "../utils/seo";
import { useQuoteModal } from "../contexts/QuoteModalContext";

const defaultLocalAreas = [
  "Charkhi Dadri",
  "Bhiwani",
  "Mahendragarh",
  "Rewari",
  "Rohtak",
  "Jhajjar",
  "Dadri nearby villages",
  "Bhiwani nearby villages",
  "Mahendragarh nearby villages",
  "Rewari nearby villages",
  "Rohtak nearby villages",
  "Jhajjar nearby villages"
];

const defaultProcess = [
  { title: "Requirement Discussion", description: "We understand your design, measurements, budget, material preference, and timeline." },
  { title: "Site Visit & Measurement", description: "Our team checks the site and confirms practical execution details before quotation." },
  { title: "Design & Quotation", description: "You receive design suggestions, material options, price range, and a clear work plan." },
  { title: "Manufacturing & Execution", description: "Furniture, interior, or construction work is handled with skilled workers and quality checks." },
  { title: "Final Finishing", description: "We complete fitting, finishing, cleaning, and handover after customer review." }
];

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#F8FAFC",
    bgcolor: "rgba(255, 255, 255, 0.03)",
    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
    "&:hover fieldset": { borderColor: "rgba(212, 175, 55, 0.5)" },
    "&.Mui-focused fieldset": { borderColor: "#D4AF37" }
  },
  "& .MuiInputLabel-root": {
    color: "rgba(248, 250, 252, 0.6)",
    "&.Mui-focused": { color: "#D4AF37" }
  },
  "& .MuiFormHelperText-root": { color: "#EF4444" }
};

const trustBadges = [
  {
    title: "Custom Design",
    desc: "Customized plans as per your needs",
    icon: <DesignServicesIcon sx={{ fontSize: 32, color: "#D4AF37" }} />,
  },
  {
    title: "Quality Materials",
    desc: "Best quality material with warranty",
    icon: <LayersIcon sx={{ fontSize: 32, color: "#D4AF37" }} />,
  },
  {
    title: "Skilled Team",
    desc: "Experienced & professional team",
    icon: <EngineeringIcon sx={{ fontSize: 32, color: "#D4AF37" }} />,
  },
  {
    title: "Timely Delivery",
    desc: "On-time project completion",
    icon: <AccessTimeIcon sx={{ fontSize: 32, color: "#D4AF37" }} />,
  },
  {
    title: "Transparent Work",
    desc: "Clear process and regular updates",
    icon: <FactCheckIcon sx={{ fontSize: 32, color: "#D4AF37" }} />,
  },
  {
    title: "Affordable Pricing",
    desc: "Best quality at reasonable price",
    icon: <LocalOfferIcon sx={{ fontSize: 32, color: "#D4AF37" }} />,
  },
];

const FloatingSidebar = ({ onQuoteClick }) => {
  const phone = "9416856468";
  return (
    <Box
      sx={{
        position: "fixed",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1000,
        display: { xs: "none", sm: "flex" },
        flexDirection: "column",
        bgcolor: "#0F172A",
        border: "1px solid rgba(212, 175, 55, 0.3)",
        borderRight: "none",
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      {[
        {
          label: "Call Now",
          icon: <PhoneIcon sx={{ fontSize: 20 }} />,
          href: `tel:+91${phone}`,
        },
        {
          label: "WhatsApp",
          icon: <WhatsAppIcon sx={{ fontSize: 20 }} />,
          href: `https://wa.me/91${phone}`,
          target: "_blank",
        },
        {
          label: "Get Quote",
          icon: <DescriptionIcon sx={{ fontSize: 20 }} />,
          onClick: onQuoteClick,
        },
        {
          label: "Reviews",
          icon: <StarIcon sx={{ fontSize: 20 }} />,
          href: "https://maps.app.goo.gl/V9mPoFxvSJm3hCM69",
          target: "_blank",
        },
      ].map((item, idx) => {
        const content = (
          <Box
            key={idx}
            onClick={item.onClick}
            component={item.href ? "a" : "div"}
            href={item.href}
            target={item.target}
            rel={item.target ? "noopener noreferrer" : undefined}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 1.5,
              px: 1.2,
              width: 72,
              cursor: "pointer",
              textDecoration: "none",
              color: "#F8FAFC",
              borderBottom: idx < 3 ? "1px solid rgba(212, 175, 55, 0.15)" : "none",
              transition: "all 0.3s ease",
              "& svg": {
                color: item.label === "WhatsApp" ? "#25D366" : "#D4AF37",
                mb: 0.5,
                transition: "transform 0.3s ease",
              },
              "&:hover": {
                bgcolor: "rgba(212, 175, 55, 0.12)",
                color: "#D4AF37",
                "& svg": {
                  transform: "scale(1.2)",
                },
              },
            }}
          >
            {item.icon}
            <Typography sx={{ fontSize: "10px", fontWeight: 700, textAlign: "center" }}>
              {item.label}
            </Typography>
          </Box>
        );
        return content;
      })}
    </Box>
  );
};

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { openQuote } = useQuoteModal();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quote form state in Hero
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    phone: "",
    service: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Image lightbox state
  const [galleryOpen, setGalleryOpen] = useState(false);

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState(false);

  const handleFaqChange = (panel) => (event, isExpanded) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/blogs/slug/${slug}`);
        setBlog(response.data.success ? response.data.data : null);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleWhatsApp = () => {
    const message = `Hello Vishwakarma Build & Furnish, I read this blog and want consultation: ${blog?.title}`;
    window.open(`https://wa.me/919416856468?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setQuoteForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const errors = {};
    if (!quoteForm.name.trim()) errors.name = "Name is required";
    if (!quoteForm.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^[0-9]{10}$/.test(quoteForm.phone.trim())) {
      errors.phone = "Enter a valid 10-digit number";
    }
    if (!quoteForm.service) errors.service = "Select a service";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setFormSubmitting(true);
      await axiosInstance.post("/inquiries", {
        customerName: quoteForm.name,
        phone: quoteForm.phone,
        serviceName: quoteForm.service,
        address: quoteForm.address,
        categoryName: "Blog Landing Page Quote",
        message: `Quote requested from blog post: ${blog?.title || "N/A"}`,
      });
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error submitting blog landing page quote:", error);
      setFormErrors({ api: "Failed to submit request. Please try again." });
    } finally {
      setFormSubmitting(false);
    }
  };

  const selectedBlogImages = (blog?.blogImages?.length ? blog.blogImages : [blog?.blogImage]).filter(Boolean).slice(0, 9);
  const heroImage = getStaticAssetUrl(blog?.coverImage || selectedBlogImages[0] || blog?.relatedServices?.[0]?.heroImage || blog?.relatedServices?.[0]?.images?.[0] || "");
  const primaryService = blog?.relatedServices?.filter(Boolean)?.[0];
  const blogGalleryImages = selectedBlogImages.length
    ? selectedBlogImages
    : [blog?.coverImage || primaryService?.heroImage || primaryService?.images?.[0]].filter(Boolean);
  const blogGalleryImageUrls = blogGalleryImages.slice(0, 9).map((image) => getStaticAssetUrl(image));
  const localAreas = blog?.localAreas?.length ? blog.localAreas : defaultLocalAreas;
  const benefits = blog?.benefits?.length
    ? blog.benefits
    : [
        `Customized ${primaryService?.name || blog?.title || "service"} planning according to your space and budget`,
        "Transparent material guidance before final quotation",
        "Skilled workmanship for durable fitting and premium finishing",
        "Local support across Charkhi Dadri, Bhiwani, Mahendragarh, Rewari, Rohtak, Jhajjar and nearby villages"
      ];
  const processSteps = blog?.process?.length ? blog.process : defaultProcess;
  const priceRange = blog?.priceRange || primaryService?.priceStarting || "Custom quote after site measurement";
  const serviceSearchTopics = useMemo(() => {
    const serviceName = primaryService?.name || "";
    const topicSource = serviceName || blog?.title || "";

    return [
      `${topicSource} images Charkhi Dadri`,
      `latest ${topicSource} design Haryana`,
      `best ${topicSource} in Charkhi Dadri`,
      `${topicSource} price in Charkhi Dadri`,
      `${topicSource} material and finishing`,
      `${topicSource} custom work Haryana`
    ].filter((topic) => topic.trim().length > 24);
  }, [blog?.title, primaryService?.name]);
  const seoKeywords = [
    ...(blog?.tags || []),
    ...serviceSearchTopics,
    blog?.title,
    blog?.category,
    "Charkhi Dadri",
    "Haryana",
    "wooden door images",
    "latest furniture design"
  ].filter(Boolean);

  // Re-cycle images to ALWAYS have at least 5 images for the premium collage layout
  const collageImages = useMemo(() => {
    if (!blogGalleryImageUrls.length) return [];
    const list = [];
    for (let i = 0; i < 5; i++) {
      list.push(blogGalleryImageUrls[i % blogGalleryImageUrls.length]);
    }
    return list;
  }, [blogGalleryImageUrls]);

  useSeo({
    title: blog?.seoTitle || blog?.title || "Furniture Blog",
    description: blog?.seoDescription || blog?.excerpt || "Furniture and interior design guide by Vishwakarma Build & Furnish.",
    path: slug ? `/blogs/${slug}` : "/blogs",
    image: heroImage,
    type: "article",
    keywords: seoKeywords,
    structuredData: blog
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": `${buildPageUrl(`/blogs/${blog.slug}`)}#article`,
              headline: blog.title,
              description: blog.seoDescription || blog.excerpt,
              image: blogGalleryImageUrls.length ? blogGalleryImageUrls : [heroImage],
              datePublished: blog.publishedAt,
              dateModified: blog.updatedAt || blog.publishedAt,
              mainEntityOfPage: buildPageUrl(`/blogs/${blog.slug}`),
              author: {
                "@type": "Organization",
                name: "Vishwakarma Build & Furnish"
              },
              publisher: businessStructuredData,
              about: (blog.relatedServices || []).filter(Boolean).map((service) => ({
                "@type": "Service",
                name: service.name,
                url: buildPageUrl(`/services/${service.categoryId?.slug || "furniture"}/${service.slug}`)
              }))
            },
            {
              "@type": "Service",
              "@id": `${buildPageUrl(`/blogs/${blog.slug}`)}#service`,
              name: primaryService?.name || blog.title,
              description: blog.seoDescription || blog.excerpt,
              provider: businessStructuredData,
              areaServed: localAreas,
              serviceArea: localAreas.map((area) => ({
                "@type": "Place",
                name: area
              })),
              offers: {
                "@type": "Offer",
                priceCurrency: "INR",
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "INR",
                  description: priceRange
                }
              },
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
                reviewBody: "Professional workmanship, clear pricing, and good finishing quality."
              }
            },
            {
              "@type": "ImageGallery",
              "@id": `${buildPageUrl(`/blogs/${blog.slug}`)}#images`,
              name: `${blog.title} Images`,
              image: blogGalleryImageUrls.map((imageUrl, index) => ({
                "@type": "ImageObject",
                contentUrl: imageUrl,
                url: imageUrl,
                name: `${blog.title} image ${index + 1}`,
                caption: `${blog.title} ${primaryService?.name || "service"} design in Charkhi Dadri Haryana`
              }))
            },
            {
              "@type": "FAQPage",
              "@id": `${buildPageUrl(`/blogs/${blog.slug}`)}#faq`,
              mainEntity: (blog.faq || []).filter((item) => item.question || item.answer).map((item) => ({
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
              "@id": `${buildPageUrl(`/blogs/${blog.slug}`)}#breadcrumbs`,
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: buildPageUrl("/")
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Blogs",
                  item: buildPageUrl("/blogs")
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: blog.title,
                  item: buildPageUrl(`/blogs/${blog.slug}`)
                }
              ]
            }
          ]
        }
      : null
  });

  if (loading) {
    return (
      <Box sx={{ minHeight: "70vh", bgcolor: "#0F172A", display: "grid", placeItems: "center" }}>
        <CircularProgress sx={{ color: "#D4AF37" }} />
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box sx={{ minHeight: "70vh", bgcolor: "#0F172A", color: "#F8FAFC", display: "grid", placeItems: "center", textAlign: "center", px: 2 }}>
        <Box>
          <Typography sx={{ fontSize: "2rem", fontWeight: 900, mb: 2 }}>Blog not found</Typography>
          <Button onClick={() => navigate("/blogs")} sx={{ color: "#D4AF37", fontWeight: 900 }}>Back to Blogs</Button>
        </Box>
      </Box>
    );
  }

  const paragraphs = String(blog.content || "").split("\n").map((item) => item.trim()).filter(Boolean);

  const serviceCategoryName = blog.category?.replace("Services", "").trim() || "House Construction";

  const serviceCards = [
    {
      title: `Custom ${serviceCategoryName}`,
      desc: "Homes, shops, offices & renovation projects",
      icon: <HomeIcon sx={{ fontSize: 24, color: "#D4AF37" }} />
    },
    {
      title: "Quality Assurance",
      desc: "Best materials and skilled workmanship",
      icon: <VerifiedIcon sx={{ fontSize: 24, color: "#D4AF37" }} />
    },
    {
      title: "On Time Delivery",
      desc: "Timely completion with quality check",
      icon: <SpeedIcon sx={{ fontSize: 24, color: "#D4AF37" }} />
    },
    {
      title: "Customer Satisfaction",
      desc: "Client happiness is our top priority",
      icon: <SentimentSatisfiedIcon sx={{ fontSize: 24, color: "#D4AF37" }} />
    }
  ];

  return (
    <Box sx={{ bgcolor: "#0F172A", color: "#F8FAFC", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      {/* Floating Sidebar Menu */}
      <FloatingSidebar onQuoteClick={openQuote} />

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: { xs: 450, md: 580 },
          display: "flex",
          alignItems: "center",
          py: { xs: 6, md: 8 },
          position: "relative",
          background: heroImage
            ? `linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%), url("${heroImage}") center/cover no-repeat`
            : "linear-gradient(135deg, #111111, #0F172A)"
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.25fr 0.75fr" },
              gap: 4,
              alignItems: "center"
            }}
          >
            {/* Left Column: Text & CTAs */}
            <Box>
              <Chip
                label={blog.category || "Construction Services"}
                sx={{
                  bgcolor: "rgba(212, 175, 55, 0.12)",
                  color: "#D4AF37",
                  border: "1px solid rgba(212, 175, 55, 0.3)",
                  fontWeight: 800,
                  mb: 2.5
                }}
              />
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: "2.2rem", sm: "3rem", md: "4.2rem" },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  mb: 2.5,
                  color: "#F8FAFC"
                }}
              >
                {blog.title}
              </Typography>
              <Typography
                sx={{
                  color: "rgba(248, 250, 252, 0.8)",
                  lineHeight: 1.75,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  mb: 4,
                  maxWidth: 650
                }}
              >
                {blog.excerpt}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    const el = document.getElementById("recent-projects");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  sx={{
                    bgcolor: "#D4AF37",
                    color: "#111827",
                    fontWeight: 900,
                    px: 3.5,
                    py: 1.25,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    "&:hover": { bgcolor: "#B88917" }
                  }}
                >
                  Explore {serviceCategoryName}
                </Button>
                <Button
                  variant="outlined"
                  href="https://wa.me/919416856468"
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<WhatsAppIcon sx={{ color: "#25D366" }} />}
                  sx={{
                    borderColor: "rgba(212, 175, 55, 0.5)",
                    color: "#F8FAFC",
                    bgcolor: "rgba(15, 23, 42, 0.4)",
                    fontWeight: 900,
                    px: 3.5,
                    py: 1.25,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    "&:hover": { borderColor: "#D4AF37", bgcolor: "rgba(212, 175, 55, 0.08)" }
                  }}
                >
                  WhatsApp Us
                </Button>
              </Box>
            </Box>

            {/* Right Column: Quote Form */}
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  bgcolor: "rgba(15, 23, 42, 0.75)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(212, 175, 55, 0.35)",
                  borderRadius: 3,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                }}
              >
                <Typography sx={{ color: "#F8FAFC", fontWeight: 900, fontSize: "1.4rem", mb: 0.5 }}>
                  Get Free Quote
                </Typography>
                <Typography sx={{ color: "rgba(248, 250, 252, 0.6)", fontSize: "0.85rem", mb: 3 }}>
                  We will contact you shortly
                </Typography>

                {formSubmitted ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 60, color: "#D4AF37", mb: 2 }} />
                    <Typography sx={{ color: "#F8FAFC", fontWeight: 800, fontSize: "1.2rem", mb: 1 }}>
                      Request Submitted!
                    </Typography>
                    <Typography sx={{ color: "rgba(248, 250, 252, 0.7)", fontSize: "0.9rem" }}>
                      Thank you. Our team will get back to you shortly.
                    </Typography>
                  </Box>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    {formErrors.api && (
                      <Typography sx={{ color: "#EF4444", fontSize: "0.85rem", mb: 2, fontWeight: 700 }}>
                        {formErrors.api}
                      </Typography>
                    )}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
                      <TextField
                        label="Your Name"
                        name="name"
                        value={quoteForm.name}
                        onChange={handleFormChange}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        fullWidth
                        variant="outlined"
                        sx={textFieldSx}
                      />
                      <TextField
                        label="Mobile Number"
                        name="phone"
                        value={quoteForm.phone}
                        onChange={handleFormChange}
                        error={!!formErrors.phone}
                        helperText={formErrors.phone}
                        fullWidth
                        variant="outlined"
                        sx={textFieldSx}
                      />
                      <TextField
                        select
                        label="Select Service"
                        name="service"
                        value={quoteForm.service}
                        onChange={handleFormChange}
                        error={!!formErrors.service}
                        helperText={formErrors.service}
                        fullWidth
                        variant="outlined"
                        sx={textFieldSx}
                      >
                        {[
                          "Complete House Construction",
                          "Modular Kitchen",
                          "False Ceiling & POP Design",
                          "Custom Wardrobe & Cabinets",
                          "Wooden Doors & Windows",
                          "Wooden Jali Doors",
                          "PVC Wall Paneling",
                          "Luxury Sofa Set & Beds",
                          "Home Renovation & Painting",
                          "Tiles & Marble Work",
                          "Other / Custom Inquiry"
                        ].map((srv, idx) => (
                          <MenuItem key={idx} value={srv}>{srv}</MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        label="Your Location"
                        name="address"
                        value={quoteForm.address}
                        onChange={handleFormChange}
                        fullWidth
                        variant="outlined"
                        sx={textFieldSx}
                      />
                      <Button
                        type="submit"
                        disabled={formSubmitting}
                        variant="contained"
                        fullWidth
                        sx={{
                          bgcolor: "#D4AF37",
                          color: "#111827",
                          fontWeight: 900,
                          py: 1.4,
                          mt: 1,
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: "1rem",
                          "&:hover": { bgcolor: "#B88917" }
                        }}
                      >
                        {formSubmitting ? <CircularProgress size={24} sx={{ color: "#111827" }} /> : "Send Request"}
                      </Button>
                      <Typography sx={{ color: "rgba(248, 250, 252, 0.45)", fontSize: "0.75rem", textAlign: "center", mt: 1 }}>
                        🔒 100% Privacy Guaranteed
                      </Typography>
                    </Box>
                  </form>
                )}
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Trust Strip */}
      <Container maxWidth="lg" sx={{ mt: -4, mb: 8, position: "relative", zIndex: 10 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(6, 1fr)" },
            gap: 2
          }}
        >
          {trustBadges.map((badge, idx) => (
            <Paper
              key={idx}
              elevation={0}
              sx={{
                p: 2,
                height: "100%",
                textAlign: "center",
                bgcolor: "#111827",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#D4AF37",
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(212, 175, 55, 0.15)",
                },
              }}
            >
              <Box sx={{ mb: 1 }}>{badge.icon}</Box>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, mb: 0.5, color: "#F8FAFC" }}>
                {badge.title}
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: "rgba(248, 250, 252, 0.6)", lineHeight: 1.3 }}>
                {badge.desc}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>

      {/* Main Content Layout */}
      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 10 } }}>
        <Box
          id="recent-projects"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) 340px" },
            gap: 4
          }}
        >
          {/* Left Column: Recent Projects Grid */}
          <Box>
            <Typography variant="h3" sx={{ color: "#F8FAFC", fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 3 }}>
              Our Recent {serviceCategoryName} Projects
            </Typography>

            <Box sx={{ mb: 3 }}>
              {collageImages.length >= 5 ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1.2fr 0.8fr" },
                    gap: 1.5
                  }}
                >
                  {/* Left: Large Image */}
                  <Box
                    component="img"
                    src={collageImages[0]}
                    alt={`${blog.title} Project 1`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      minHeight: { xs: 260, sm: 380 },
                      maxHeight: { xs: 320, sm: "none" },
                      objectFit: "cover",
                      borderRadius: 3,
                      border: "1px solid rgba(212, 175, 55, 0.25)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#D4AF37",
                        boxShadow: "0 4px 20px rgba(212, 175, 55, 0.15)"
                      }
                    }}
                  />
                  {/* Right: 2x2 Grid of Small Images */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: 1.5
                    }}
                  >
                    {[1, 2, 3, 4].map((idx) => (
                      <Box
                        key={idx}
                        component="img"
                        src={collageImages[idx]}
                        alt={`${blog.title} Project ${idx + 1}`}
                        sx={{
                          width: "100%",
                          aspectRatio: "4/3",
                          objectFit: "cover",
                          borderRadius: 2.5,
                          border: "1px solid rgba(212, 175, 55, 0.2)",
                          display: "block",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            borderColor: "#D4AF37",
                            boxShadow: "0 4px 20px rgba(212, 175, 55, 0.15)"
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: blogGalleryImageUrls.length === 1 ? "1fr" : blogGalleryImageUrls.length === 2 ? "1fr 1fr" : "repeat(3, 1fr)"
                    },
                    gap: 1.5
                  }}
                >
                  {blogGalleryImageUrls.map((url, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={url}
                      alt={`${blog.title} Project ${index + 1}`}
                      sx={{
                        width: "100%",
                        aspectRatio: "4/3",
                        objectFit: "cover",
                        borderRadius: 3,
                        border: "1px solid rgba(212, 175, 55, 0.2)",
                        display: "block",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "#D4AF37",
                          boxShadow: "0 4px 20px rgba(212, 175, 55, 0.15)"
                        }
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {blogGalleryImageUrls.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 4, width: "100%" }}>
                <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(212, 175, 55, 0.2)" }} />
                <Button
                  variant="outlined"
                  onClick={() => setGalleryOpen(true)}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    mx: 2,
                    borderColor: "rgba(212, 175, 55, 0.4)",
                    color: "#F8FAFC",
                    textTransform: "none",
                    fontWeight: 800,
                    px: 3,
                    py: 0.75,
                    borderRadius: 2,
                    whiteSpace: "nowrap",
                    "&:hover": { borderColor: "#D4AF37", bgcolor: "rgba(212, 175, 55, 0.08)" }
                  }}
                >
                  View More Projects
                </Button>
                <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(212, 175, 55, 0.2)" }} />
              </Box>
            )}
          </Box>

          {/* Right Column: Sidebar */}
          <Box sx={{ display: "grid", gap: 3, alignSelf: "start" }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "#111827",
                border: "1px solid rgba(212, 175, 55, 0.25)",
                borderRadius: 3
              }}
            >
              <Typography sx={{ color: "#D4AF37", fontWeight: 900, fontSize: "1.15rem", mb: 1 }}>
                Need this service?
              </Typography>
              <Typography sx={{ color: "rgba(248, 250, 252, 0.72)", fontSize: "0.9rem", lineHeight: 1.6, mb: 3.5 }}>
                Get a free consultation for design, material, quality, and budget.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                startIcon={<WhatsAppIcon />}
                onClick={handleWhatsApp}
                sx={{
                  bgcolor: "#D4AF37",
                  color: "#111827",
                  fontWeight: 900,
                  py: 1.25,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  "&:hover": { bgcolor: "#B88917" }
                }}
              >
                WhatsApp Us
              </Button>
            </Paper>

            {!!blog.relatedServices?.length && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: "#111827",
                  border: "1px solid rgba(212, 175, 55, 0.25)",
                  borderRadius: 3
                }}
              >
                <Typography sx={{ color: "#D4AF37", fontWeight: 900, fontSize: "1.15rem", mb: 0.5 }}>
                  Main Furniture Services
                </Typography>
                <Typography sx={{ color: "rgba(248, 250, 252, 0.6)", fontSize: "0.82rem", mb: 3 }}>
                  Our most demanded custom furniture work.
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {blog.relatedServices.filter(Boolean).map((service) => (
                    <Button
                      key={service._id}
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(`/services/${service.categoryId?.slug || "furniture"}/${service.slug}`)}
                      sx={{
                        justifyContent: "space-between",
                        color: "#F8FAFC",
                        borderColor: "rgba(212, 175, 55, 0.35)",
                        bgcolor: "rgba(212, 175, 55, 0.05)",
                        textTransform: "none",
                        fontWeight: 800,
                        py: 1.2,
                        px: 2,
                        borderRadius: 2,
                        textAlign: "left",
                        "&:hover": {
                          borderColor: "#D4AF37",
                          bgcolor: "rgba(212, 175, 55, 0.15)",
                          transform: "translateX(4px)"
                        },
                        transition: "all 0.3s ease"
                      }}
                    >
                      {service.name}
                    </Button>
                  ))}
                </Box>
              </Paper>
            )}
          </Box>
        </Box>

        {/* Four-Column Info Block */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: 4,
            mt: 10,
            mb: 10
          }}
        >
          {/* Column 1: Benefits */}
          <Box>
            <Typography sx={{ color: "#D4AF37", fontWeight: 900, fontSize: "1.2rem", mb: 3 }}>
              Benefits
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {benefits.map((benefit, idx) => (
                <Box key={idx} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <CheckCircleOutlineIcon sx={{ color: "#D4AF37", fontSize: 20, mt: 0.3 }} />
                  <Typography sx={{ color: "rgba(248, 250, 252, 0.8)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                    {benefit}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Column 2: Our Process */}
          <Box>
            <Typography sx={{ color: "#D4AF37", fontWeight: 900, fontSize: "1.2rem", mb: 3 }}>
              Our Process
            </Typography>
            <Box sx={{ position: "relative", pl: 4 }}>
              <Box
                sx={{
                  position: "absolute",
                  left: 17,
                  top: 20,
                  bottom: 20,
                  width: "2px",
                  background: "linear-gradient(180deg, #D4AF37 0%, rgba(212, 175, 55, 0.1) 100%)",
                  zIndex: 1,
                }}
              />
              {processSteps.map((step, idx) => (
                <Box key={idx} sx={{ position: "relative", mb: idx === processSteps.length - 1 ? 0 : 3, zIndex: 2 }}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: -32,
                      top: 0,
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: "#0F172A",
                      border: "2px solid #D4AF37",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 3,
                    }}
                  >
                    <Typography sx={{ fontSize: "11px", fontWeight: 900, color: "#D4AF37" }}>
                      {String(idx + 1).padStart(2, "0")}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: "#D4AF37", fontWeight: 800, fontSize: "0.95rem", mb: 0.5 }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ color: "rgba(248, 250, 252, 0.7)", fontSize: "0.85rem", lineHeight: 1.4 }}>
                    {step.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Column 3: Price Range */}
          <Box>
            <Typography sx={{ color: "#D4AF37", fontWeight: 900, fontSize: "1.2rem", mb: 3 }}>
              Price Range
            </Typography>
            <Typography sx={{ color: "rgba(248, 250, 252, 0.6)", fontSize: "0.85rem", mb: 2 }}>
              Custom quote after site measurement.
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: "rgba(212, 175, 55, 0.04)",
                border: "1px solid rgba(212, 175, 55, 0.25)",
                borderRadius: 3,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bgcolor: "rgba(212, 175, 55, 0.12)",
                  py: 0.75,
                  px: 2,
                  borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 900, color: "#D4AF37", letterSpacing: 1 }}>
                  Custom Pricing
                </Typography>
              </Box>
              <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 1.5, mb: 3.5 }}>
                {[
                  "Depends on Area",
                  "Material Quality",
                  "Design Complexity",
                  "Finishing Type"
                ].map((item, idx) => (
                  <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleOutlineIcon sx={{ color: "#D4AF37", fontSize: 16 }} />
                    <Typography sx={{ color: "#F8FAFC", fontSize: "0.85rem", fontWeight: 500 }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Button
                fullWidth
                variant="contained"
                onClick={openQuote}
                sx={{
                  bgcolor: "#D4AF37",
                  color: "#111827",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  textTransform: "none",
                  py: 1,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#B88917" }
                }}
              >
                Request Quote
              </Button>
            </Paper>
          </Box>

          {/* Column 4: Local Service Areas */}
          <Box>
            <Typography sx={{ color: "#D4AF37", fontWeight: 900, fontSize: "1.2rem", mb: 3 }}>
              Local Service Areas
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {localAreas.map((area, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    py: 0.8,
                    px: 1.5,
                    borderRadius: 2,
                    bgcolor: "rgba(248, 250, 252, 0.05)",
                    border: "1px solid rgba(248, 250, 252, 0.1)",
                    color: "#F8FAFC",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(212, 175, 55, 0.08)",
                      borderColor: "#D4AF37",
                      color: "#D4AF37",
                    }
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 14 }} />
                  <Typography sx={{ fontSize: "0.8rem", fontWeight: 700 }}>{area}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Content Paragraphs & Stacked Trust Cards */}
        <Box sx={{ mt: 10, mb: 10 }}>
          <Typography variant="h3" sx={{ color: "#F8FAFC", fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 4 }}>
            {serviceCategoryName} in Charkhi Dadri
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.45fr 0.95fr" },
              gap: 4
            }}
          >
            {/* Left: Paragraphs */}
            <Box>
              {paragraphs.map((paragraph, index) => (
                <Typography
                  key={index}
                  sx={{
                    fontSize: "1rem",
                    color: "rgba(248, 250, 252, 0.78)",
                    lineHeight: 1.85,
                    mb: 3,
                    textAlign: "justify",
                  }}
                >
                  {paragraph}
                </Typography>
              ))}
            </Box>

            {/* Right: Stack of 4 Trust Cards */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {serviceCards.map((card, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    bgcolor: "#111827",
                    border: "1px solid rgba(212, 175, 55, 0.15)",
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 2.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#D4AF37",
                      transform: "translateX(6px)",
                      boxShadow: "0 4px 20px rgba(212, 175, 55, 0.1)"
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      bgcolor: "rgba(212, 175, 55, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ color: "#F8FAFC", fontWeight: 800, fontSize: "1.05rem", mb: 0.5 }}>
                      {card.title}
                    </Typography>
                    <Typography sx={{ color: "rgba(248, 250, 252, 0.6)", fontSize: "0.85rem" }}>
                      {card.desc}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>

        {/* FAQ Section */}
        {!!blog.faq?.length && (
          <Box sx={{ mt: 10, mb: 10 }}>
            <Typography variant="h3" sx={{ color: "#F8FAFC", fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 4, textAlign: "center" }}>
              Frequently Asked Questions
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                gap: 2
              }}
            >
              {blog.faq.filter(f => f.question || f.answer).map((item, idx) => (
                <Accordion
                  key={idx}
                  expanded={expandedFaq === `panel${idx}`}
                  onChange={handleFaqChange(`panel${idx}`)}
                  sx={{
                    bgcolor: "#111827",
                    color: "#F8FAFC",
                    border: "1px solid rgba(212, 175, 55, 0.15)",
                    borderRadius: "8px !important",
                    overflow: "hidden",
                    mb: 1.5,
                    "&:before": { display: "none" },
                    "&.Mui-expanded": {
                      borderColor: "#D4AF37",
                      boxShadow: "0 4px 20px rgba(212, 175, 55, 0.12)"
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      expandedFaq === `panel${idx}` ? (
                        <RemoveIcon sx={{ color: "#D4AF37" }} />
                      ) : (
                        <AddIcon sx={{ color: "#D4AF37" }} />
                      )
                    }
                    sx={{ py: 1 }}
                  >
                    <Typography sx={{ fontWeight: 800, fontSize: "0.95rem" }}>
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ borderTop: "1px solid rgba(212, 175, 55, 0.1)", pt: 2, pb: 2.5 }}>
                    <Typography sx={{ color: "rgba(248, 250, 252, 0.72)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Box>
        )}

        {/* Bottom CTA Banner */}
        <Paper
          elevation={0}
          sx={{
            mt: 8,
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
            background: heroImage
              ? `linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%), url("${heroImage}") center/cover no-repeat`
              : "linear-gradient(135deg, #111111, #0F172A)",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
          }}
        >
          <Typography variant="h3" sx={{ color: "#F8FAFC", fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.8rem" }, mb: 2 }}>
            Ready to Build Your Dream Home?
          </Typography>
          <Typography sx={{ color: "rgba(248, 250, 252, 0.8)", maxWidth: 650, mx: "auto", mb: 4, fontSize: "1rem" }}>
            Get expert guidance, free site visit, and best quote for your project.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={openQuote}
              sx={{
                bgcolor: "#D4AF37",
                color: "#111827",
                fontWeight: 900,
                px: 4,
                py: 1.25,
                borderRadius: 2.5,
                textTransform: "none",
                fontSize: "0.95rem",
                "&:hover": { bgcolor: "#B88917" }
              }}
            >
              Get Free Quote
            </Button>
            <Button
              variant="outlined"
              href="https://wa.me/919416856468"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<WhatsAppIcon />}
              sx={{
                borderColor: "#D4AF37",
                color: "#D4AF37",
                fontWeight: 900,
                px: 4,
                py: 1.25,
                borderRadius: 2.5,
                textTransform: "none",
                fontSize: "0.95rem",
                "&:hover": { borderColor: "#D4AF37", bgcolor: "rgba(212, 175, 55, 0.08)" }
              }}
            >
              WhatsApp Us
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Lightbox / Gallery Modal */}
      <Modal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 900,
            maxHeight: "90vh",
            bgcolor: "#0F172A",
            border: "1px solid rgba(212, 175, 55, 0.4)",
            boxShadow: 24,
            borderRadius: 3,
            p: 4,
            overflowY: "auto",
          }}
        >
          <IconButton
            onClick={() => setGalleryOpen(false)}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "rgba(248, 250, 252, 0.6)",
              "&:hover": { color: "#D4AF37" },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" sx={{ color: "#D4AF37", fontWeight: 900, mb: 3 }}>
            Project Gallery - {blog.title}
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2 }}>
            {blogGalleryImageUrls.map((url, idx) => (
              <Box
                key={idx}
                component="img"
                src={url}
                alt={`${blog.title} Gallery ${idx + 1}`}
                sx={{
                  width: "100%",
                  aspectRatio: "4/3",
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              />
            ))}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default BlogDetailPage;
