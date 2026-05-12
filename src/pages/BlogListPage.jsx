import React, { useEffect, useState } from "react";
import { Box, Button, Chip, CircularProgress, Container, Paper, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArticleIcon from "@mui/icons-material/Article";
import { useNavigate } from "react-router-dom";
import axiosInstance, { getStaticAssetUrl } from "../../utils/axiosConfig";

const BlogListPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get("/blogs");
        setBlogs(response.data.success ? response.data.data || [] : []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
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
            SEO-friendly guides for furniture, construction, interiors, wooden doors, windows, modular kitchens, and custom furniture.
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
                    overflow: "hidden"
                  }}
                >
                  <Box
                    sx={{
                      height: { xs: 190, sm: 220, md: 240 },
                      background: image
                        ? `url("${image}") center/cover no-repeat`
                        : "linear-gradient(135deg, #111827, #1A1A1A)"
                    }}
                  />
                  <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                    <Chip label={blog.category || "Guide"} size="small" sx={{ bgcolor: "#D4AF37", color: "#111827", fontWeight: 900, mb: 1.5 }} />
                    <Typography sx={{ fontSize: { xs: "1.12rem", md: "1.3rem" }, lineHeight: 1.25, fontWeight: 900, mb: 1, overflowWrap: "anywhere" }}>{blog.title}</Typography>
                    <Typography sx={{ color: "rgba(248,250,252,0.72)", lineHeight: 1.65, mb: 2, fontSize: { xs: "0.92rem", md: "1rem" } }}>{blog.excerpt}</Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(`/blogs/${blog.slug}`)}
                      sx={{ bgcolor: "#D4AF37", color: "#111827", fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#B88917" } }}
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
