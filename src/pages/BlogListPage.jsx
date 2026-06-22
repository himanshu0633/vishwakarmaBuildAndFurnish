import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, CircularProgress, Container, Paper, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArticleIcon from "@mui/icons-material/Article";
import { useNavigate } from "react-router-dom";
import axiosInstance, { getStaticAssetUrl } from "../../utils/axiosConfig";
import { simpleBusinessStructuredData, buildPageUrl, useSeo } from "../utils/seo";

const BlogListPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchTopics = useMemo(() => {
    const serviceTopics = services.flatMap((service) => {
      const name = service.name || "";

      return [
        `${name} images Charkhi Dadri`,
        `latest ${name} design Haryana`,
        `best ${name} in Charkhi Dadri`
      ];
    });

    return [...new Set(serviceTopics.filter(Boolean))].slice(0, 90);
  }, [services]);
  const seoKeywords = useMemo(
    () => [
      ...searchTopics,
      "best furniture Charkhi Dadri",
      "custom furniture Haryana",
      "Vishwakarma Build Furnish CKD"
    ],
    [searchTopics]
  );

  useSeo({
    title: "Blogs | Vishwakarma Build & Furnish",
    description:
      "Read Vishwakarma Build & Furnish blogs for all services including images, latest designs, material guidance, custom furniture, interiors and construction work in Charkhi Dadri, Haryana.",
    path: "/blogs",
    keywords: seoKeywords,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Vishwakarma Build & Furnish Blog",
      url: buildPageUrl("/blogs"),
      publisher: simpleBusinessStructuredData,
      blogPost: blogs.slice(0, 10).map((blog) => ({
        "@type": "BlogPosting",
        headline: blog.title,
        description: blog.seoDescription || blog.excerpt,
        url: buildPageUrl(`/blogs/${blog.slug}`)
      }))
    }
  });

  useEffect(() => {
    const fetchBlogPageData = async () => {
      try {
        const [blogsResponse, servicesResponse] = await Promise.all([
          axiosInstance.get("/blogs"),
          axiosInstance.get("/services")
        ]);

        setBlogs(blogsResponse.data.success ? blogsResponse.data.data || [] : []);
        setServices(servicesResponse.data.success ? servicesResponse.data.data || [] : []);
      } catch (error) {
        console.error("Error fetching blog page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPageData();
  }, []);

  return (
    <Box sx={{ bgcolor: "#0F172A", color: "#F8FAFC", minHeight: "100vh" }}>
      <Box sx={{ py: { xs: 6, sm: 8, md: 12 }, background: "linear-gradient(135deg, #111111 0%, #0F172A 100%)" }}>
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Chip icon={<ArticleIcon />} label="Blog" sx={{ bgcolor: "rgba(212,175,55,0.14)", color: "#D4AF37", fontWeight: 800, mb: 2 }} />
          <Typography sx={{ fontSize: { xs: "2rem", sm: "2.6rem", md: "4rem" }, lineHeight: 1.1, fontWeight: 900, mb: 1, overflowWrap: "anywhere" }}>
            Vishwakarma Build & Furnish Blog
          </Typography>
          <Typography sx={{ maxWidth: 820, mx: "auto", color: "rgba(248,250,252,0.75)", lineHeight: 1.8, fontSize: { xs: "0.95rem", sm: "1rem" } }}>
            Images, latest designs, material guidance, price ideas, and custom work tips for every Vishwakarma Build & Furnish service in Charkhi Dadri, Haryana.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 9 }, px: { xs: 2, sm: 3 } }}>
        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#D4AF37" }} />
          </Box>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" }, gap: { xs: 2, md: 3 } }}>
            {blogs.map((blog) => {
              const image = getStaticAssetUrl(blog.coverImage || blog.relatedServices?.[0]?.heroImage || blog.relatedServices?.[0]?.images?.[0] || "");

              return (
                <Paper
                  key={blog._id}
                  elevation={0}
                  sx={{
                    bgcolor: "#111827",
                    color: "#F8FAFC",
                    border: "1px solid rgba(212,175,55,0.28)",
                    borderRadius: { xs: 2, sm: 3 },
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%"
                  }}
                >
                  <Box
                    component="img"
                    src={image}
                    alt={`${blog.title} - ${blog.category || "Furniture"} in Charkhi Dadri Haryana`}
                    title={`${blog.title} - ${blog.category || "Furniture"} in Charkhi Dadri Haryana`}
                    sx={{
                      width: "100%",
                      height: { xs: 190, sm: 220, md: 240 },
                      display: image ? "block" : "none",
                      objectFit: "cover",
                      bgcolor: "#111827"
                    }}
                  />
                  {!image && <Box sx={{ height: { xs: 190, sm: 220, md: 240 }, background: "linear-gradient(135deg, #111827, #1A1A1A)" }} />}
                  <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 }, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <Box>
                      <Chip label={blog.category || "Guide"} size="small" sx={{ bgcolor: "#D4AF37", color: "#111827", fontWeight: 900, mb: 1.5 }} />
                      <Typography sx={{ fontSize: { xs: "1.12rem", md: "1.3rem" }, lineHeight: 1.25, fontWeight: 900, mb: 1, overflowWrap: "anywhere" }}>{blog.title}</Typography>
                      <Typography sx={{ color: "rgba(248,250,252,0.72)", lineHeight: 1.65, mb: 2, fontSize: { xs: "0.92rem", md: "1rem" } }}>{blog.excerpt}</Typography>
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(`/blogs/${blog.slug}`)}
                      sx={{ bgcolor: "#D4AF37", color: "#111827", fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#B88917" }, mt: "auto" }}
                    >
                      Read Article
                    </Button>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default BlogListPage;
