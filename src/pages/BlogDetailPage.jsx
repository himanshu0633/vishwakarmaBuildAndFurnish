import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, CircularProgress, Container, Paper, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance, { getStaticAssetUrl } from "../../utils/axiosConfig";
import { businessStructuredData, buildPageUrl, useSeo } from "../utils/seo";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const selectedBlogImages = (blog?.blogImages?.length ? blog.blogImages : [blog?.blogImage]).filter(Boolean).slice(0, 9);
  const heroImage = getStaticAssetUrl(blog?.coverImage || selectedBlogImages[0] || blog?.relatedServices?.[0]?.heroImage || blog?.relatedServices?.[0]?.images?.[0] || "");
  const primaryService = blog?.relatedServices?.filter(Boolean)?.[0];
  const blogGalleryImages = selectedBlogImages.length
    ? selectedBlogImages
    : [blog?.coverImage || primaryService?.heroImage || primaryService?.images?.[0]].filter(Boolean);
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
          "@type": "BlogPosting",
          headline: blog.title,
          description: blog.seoDescription || blog.excerpt,
          image: heroImage,
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
          })),
          mainEntity: (blog.faq || []).filter((item) => item.question || item.answer).map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer
            }
          }))
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

  return (
    <Box sx={{ bgcolor: "#0F172A", color: "#F8FAFC", minHeight: "100vh" }}>
      <Box
        sx={{
          minHeight: { xs: 360, sm: 430, md: 540 },
          display: "flex",
          alignItems: "flex-end",
          background: heroImage
            ? `linear-gradient(180deg, rgba(17,17,17,0.42), rgba(15,23,42,0.94)), url("${heroImage}") center/cover no-repeat`
            : "linear-gradient(135deg, #111111, #0F172A)"
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 5, sm: 7, md: 9 }, px: { xs: 2, sm: 3 } }}>
          <Chip label={blog.category || "Guide"} sx={{ bgcolor: "#D4AF37", color: "#111827", fontWeight: 900, mb: 2 }} />
          <Typography sx={{ maxWidth: 960, fontSize: { xs: "2rem", sm: "2.8rem", md: "4.4rem" }, fontWeight: 900, lineHeight: 1.08, mb: 2, overflowWrap: "anywhere" }}>
            {blog.title}
          </Typography>
          <Typography sx={{ maxWidth: 820, color: "rgba(248,250,252,0.78)", lineHeight: 1.75, fontSize: { xs: "0.96rem", md: "1.08rem" } }}>
            {blog.excerpt}
          </Typography>
          {!!serviceSearchTopics.length && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 3, maxWidth: 920 }}>
              {serviceSearchTopics.map((topic) => (
                <Chip
                  key={topic}
                  label={topic}
                  sx={{
                    bgcolor: "rgba(248,250,252,0.1)",
                    color: "rgba(248,250,252,0.88)",
                    border: "1px solid rgba(212,175,55,0.28)",
                    maxWidth: "100%",
                    "& .MuiChip-label": { whiteSpace: "normal", overflowWrap: "anywhere" }
                  }}
                />
              ))}
            </Box>
          )}
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 5, md: 9 }, px: { xs: 2, sm: 3 } }}>
        {heroImage && (
          <Box
            component="img"
            src={heroImage}
            alt={`${blog.title} image and design in Charkhi Dadri Haryana`}
            sx={{ width: 1, height: 1, opacity: 0, position: "absolute", pointerEvents: "none" }}
          />
        )}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) 340px" }, gap: { xs: 3, md: 4 } }}>
          <Paper elevation={0} sx={{ bgcolor: "#111827", color: "#F8FAFC", border: "1px solid rgba(212,175,55,0.22)", borderRadius: { xs: 2, md: 3 }, p: { xs: 2.2, sm: 3, md: 5 }, minWidth: 0 }}>
            {!!blogGalleryImages.length && (
              <Box sx={{ mb: 3.5 }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 1.5 }}>
                  {blogGalleryImages.slice(0, 9).map((image, index) => (
                    <Box
                      key={`${image}-${index}`}
                      component="img"
                      src={getStaticAssetUrl(image)}
                      alt={`${blog.title} ${primaryService?.name || ''} ${index + 1}`}
                      sx={{ width: 1, aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 2, border: "1px solid rgba(212,175,55,0.28)", display: "block" }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            {primaryService && (
              <Box sx={{ mb: 4, p: { xs: 2.5, md: 3.5 }, bgcolor: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.28)", borderRadius: 2.5, textAlign: "center" }}>
                <Typography sx={{ color: "#F8FAFC", fontWeight: 900, fontSize: { xs: "1.2rem", md: "1.6rem" }, mb: 1 }}>
                  Explore {primaryService.name}
                </Typography>
                <Typography sx={{ color: "rgba(248,250,252,0.72)", lineHeight: 1.7, mb: 2 }}>
                  View more to explore this service's designs, images, and complete details.
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate(`/services/${primaryService.categoryId?.slug || "furniture"}/${primaryService.slug}`)}
                  sx={{ bgcolor: "#D4AF37", color: "#111827", fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#B88917" } }}
                >
                  View More
                </Button>
              </Box>
            )}
            {paragraphs.map((paragraph, index) => (
              <Typography
                key={`${paragraph}-${index}`}
                component={index === 0 ? "h2" : "p"}
                sx={{
                  fontSize: index === 0 ? { xs: "1.35rem", sm: "1.7rem", md: "2.2rem" } : { xs: "0.96rem", md: "1.02rem" },
                  fontWeight: index === 0 ? 900 : 400,
                  color: index === 0 ? "#F8FAFC" : "rgba(248,250,252,0.78)",
                  lineHeight: index === 0 ? 1.25 : 1.9,
                  mb: 2.5,
                  overflowWrap: "anywhere"
                }}
              >
                {paragraph}
              </Typography>
            ))}
            {!!blog.faq?.length && (
              <Box sx={{ mt: 4 }}>
                <Typography sx={{ color: "#D4AF37", fontWeight: 900, fontSize: { xs: "1.35rem", md: "1.8rem" }, mb: 2 }}>
                  Frequently Asked Questions
                </Typography>
                <Box sx={{ display: "grid", gap: 1.5 }}>
                  {blog.faq.filter((item) => item.question || item.answer).map((item, index) => (
                    <Paper key={`${item.question}-${index}`} elevation={0} sx={{ bgcolor: "#0F172A", color: "#F8FAFC", border: "1px solid rgba(212,175,55,0.18)", borderRadius: 2, p: 2 }}>
                      <Typography sx={{ color: "#F8FAFC", fontWeight: 900, mb: 0.8 }}>{item.question}</Typography>
                      <Typography sx={{ color: "rgba(248,250,252,0.74)", lineHeight: 1.75 }}>{item.answer}</Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}
          </Paper>

          <Box sx={{ display: "grid", gap: 2, alignSelf: "start" }}>
            {!!serviceSearchTopics.length && (
              <Paper elevation={0} sx={{ bgcolor: "#111827", color: "#F8FAFC", border: "1px solid rgba(212,175,55,0.28)", borderRadius: 3, p: 3 }}>
                <Typography sx={{ color: "#D4AF37", fontWeight: 900, mb: 1 }}>Related Searches</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {serviceSearchTopics.map((topic) => (
                    <Chip
                      key={topic}
                      label={topic}
                      size="small"
                      sx={{
                        bgcolor: "rgba(212,175,55,0.12)",
                        color: "#F8FAFC",
                        border: "1px solid rgba(212,175,55,0.24)",
                        height: "auto",
                        "& .MuiChip-label": { whiteSpace: "normal", py: 0.8, overflowWrap: "anywhere" }
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            )}

            <Paper elevation={0} sx={{ bgcolor: "#111827", color: "#F8FAFC", border: "1px solid rgba(212,175,55,0.28)", borderRadius: 3, p: 3 }}>
              <Typography sx={{ color: "#D4AF37", fontWeight: 900, mb: 1 }}>Need this service?</Typography>
              <Typography sx={{ color: "rgba(248,250,252,0.72)", lineHeight: 1.7, mb: 2 }}>
                Get a free consultation for design, material, quality, and budget.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                startIcon={<WhatsAppIcon />}
                onClick={handleWhatsApp}
                sx={{ bgcolor: "#D4AF37", color: "#111827", fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#B88917" } }}
              >
                WhatsApp Us
              </Button>
            </Paper>

            {!!blog.relatedServices?.length && (
              <Paper elevation={0} sx={{ bgcolor: "#111827", color: "#F8FAFC", border: "1px solid rgba(212,175,55,0.28)", borderRadius: 3, p: 3 }}>
                <Typography sx={{ color: "#D4AF37", fontWeight: 900, mb: 0.5 }}>Main Furniture Services</Typography>
                <Typography sx={{ color: "rgba(248,250,252,0.64)", fontSize: "0.86rem", lineHeight: 1.6, mb: 2 }}>
                  Our most demanded custom furniture work.
                </Typography>
                <Box sx={{ display: "grid", gap: 1.2 }}>
                  {blog.relatedServices.filter(Boolean).map((service) => (
                    <Button
                      key={service._id}
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(`/services/${service.categoryId?.slug || "furniture"}/${service.slug}`)}
                      sx={{
                        justifyContent: "space-between",
                        gap: 1,
                        color: "#F8FAFC",
                        borderColor: "rgba(212,175,55,0.52)",
                        bgcolor: "rgba(212,175,55,0.08)",
                        textTransform: "none",
                        fontWeight: 900,
                        whiteSpace: "normal",
                        textAlign: "left",
                        overflowWrap: "anywhere",
                        animation: "relatedServiceBlink 1.45s ease-in-out infinite",
                        "&:hover": {
                          borderColor: "#D4AF37",
                          bgcolor: "rgba(212,175,55,0.18)",
                          transform: "translateX(4px)"
                        },
                        "@keyframes relatedServiceBlink": {
                          "0%, 100%": {
                            boxShadow: "0 0 0 rgba(212,175,55,0)",
                            borderColor: "rgba(212,175,55,0.45)"
                          },
                          "50%": {
                            boxShadow: "0 0 18px rgba(212,175,55,0.38)",
                            borderColor: "#D4AF37"
                          }
                        }
                      }}
                      variant="outlined"
                    >
                      {service.name}
                    </Button>
                  ))}
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogDetailPage;
