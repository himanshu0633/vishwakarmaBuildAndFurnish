import React, { useEffect, useState } from "react";
import { Box, Button, Chip, CircularProgress, Container, Paper, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArticleIcon from "@mui/icons-material/Article";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance, { getStaticAssetUrl } from "../../../utils/axiosConfig";

const BlogSection = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/blogs?featured=true&limit=3");
        setBlogs(response.data.success ? response.data.data || [] : []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <Box sx={{ py: 7, bgcolor: "#111111", display: "grid", placeItems: "center" }}>
        <CircularProgress sx={{ color: "#D4AF37" }} />
      </Box>
    );
  }

  if (!blogs.length) return null;

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 }, bgcolor: "#111111", color: "#F8FAFC" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Chip
            icon={<ArticleIcon />}
            label="Latest Guides"
            sx={{ bgcolor: "rgba(212,175,55,0.14)", color: "#D4AF37", fontWeight: 800, mb: 2 }}
          />
          <Typography sx={{ fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 900, mb: 1 }}>
            Furniture & Interior Blog
          </Typography>
          <Typography sx={{ maxWidth: 760, mx: "auto", color: "rgba(248,250,252,0.72)", lineHeight: 1.7 }}>
            Useful ideas for wooden doors, windows, modular kitchens, beds, and premium home finishing.
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 3 }}>
          {blogs.map((blog, index) => {
            const image = getStaticAssetUrl(blog.coverImage || blog.relatedServices?.[0]?.heroImage || blog.relatedServices?.[0]?.images?.[0] || "");

            return (
              <Paper
                key={blog._id}
                component={motion.article}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08 }}
                elevation={0}
                sx={{
                  bgcolor: "#111827",
                  color: "#F8FAFC",
                  border: "1px solid rgba(212,175,55,0.28)",
                  borderRadius: 3,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  "&:hover": {
                    borderColor: "#D4AF37",
                    transform: "translateY(-6px)",
                    boxShadow: "0 20px 44px rgba(0,0,0,0.34)"
                  },
                  "&:hover .blog-card-image": {
                    transform: "scale(1.06)"
                  },
                  transition: "all 0.28s ease"
                }}
              >
                <Box sx={{ height: 230, overflow: "hidden", bgcolor: "#0F172A" }}>
                  <Box
                    className="blog-card-image"
                    sx={{
                      width: "100%",
                      height: "100%",
                      background: image
                        ? `linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.38)), url("${image}") center/cover no-repeat`
                        : "linear-gradient(135deg, #0F172A, #1A1A1A)",
                      transition: "transform 0.45s ease"
                    }}
                  />
                </Box>
                <Box sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <Box>
                    <Chip
                      label={blog.category || "Guide"}
                      size="small"
                      sx={{ bgcolor: "rgba(212,175,55,0.92)", color: "#111827", fontWeight: 900, mb: 1.5 }}
                    />
                    <Typography sx={{ fontSize: "1.25rem", fontWeight: 900, mb: 1 }}>
                      {blog.title}
                    </Typography>
                    <Typography sx={{ color: "rgba(248,250,252,0.72)", lineHeight: 1.65, mb: 2 }}>
                      {blog.excerpt}
                    </Typography>
                  </Box>
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate(`/blogs/${blog.slug}`)}
                    sx={{ color: "#D4AF37", fontWeight: 900, textTransform: "none", px: 0, mt: "auto", width: "fit-content" }}
                  >
                    Read More
                  </Button>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default BlogSection;
