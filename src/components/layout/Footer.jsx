import React from "react";
import { Box, Button, Container, Divider, IconButton, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArticleIcon from "@mui/icons-material/Article";
import ChairIcon from "@mui/icons-material/Chair";
import ConstructionIcon from "@mui/icons-material/Construction";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ImageIcon from "@mui/icons-material/Image";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { colors, branding, socialLinks } from "../../data/constants";
import iesLogo from "../../assets/logo.png";

const phone = "9416856468";
const googleMapsLocationUrl = "https://maps.app.goo.gl/V9mPoFxvSJm3hCM69";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "Home", icon: <HomeIcon />, link: "/" },
    { name: "About", icon: <InfoIcon />, link: "/about" },
    { name: "Construction", icon: <ConstructionIcon />, link: "/services/construction-services" },
    { name: "Wooden Work", icon: <ChairIcon />, link: "/services/wooden-work-services" },
    { name: "Interior", icon: <DesignServicesIcon />, link: "/services/interior-services" },
    { name: "Construction Guide", icon: <ConstructionIcon />, link: "/house-construction-guide" },
    { name: "Gallery", icon: <ImageIcon />, link: "/gallery" },
    { name: "Blog", icon: <ArticleIcon />, link: "/blogs" },
    // { name: "Partners", icon: <StorefrontIcon />, link: "/partners" },
    // { name: "Become a Partner", icon: <StorefrontIcon />, link: "/partner/register" },
    { name: "Contact", icon: <PhoneIcon />, link: "/contact" }
  ];

  const services = [
    { name: "Wooden Doors", link: "/services/wooden-doors-charkhi-dadri" },
    { name: "Wooden Windows", link: "/services/wooden-windows-charkhi-dadri" },
    { name: "Ply Board Door", link: "/services/ply-board-door-charkhi-dadri" },
    { name: "Wooden Jali Doors", link: "/services/wooden-jali-single-double-doors-charkhi-dadri" },
    { name: "Double Bed", link: "/services/double-bed-charkhi-dadri" },
    { name: "Modular Kitchen", link: "/services/modular-kitchen-charkhi-dadri" },
  ];

  return (
    <Box sx={{ bgcolor: "#111111", color: "#F8FAFC", position: "relative", mt: "auto", pb: { xs: '140px', md: 0 } }}>
      <Box sx={{ height: 4, background: "linear-gradient(90deg, #D4AF37, #B88917, #D4AF37)" }} />

      <IconButton
        onClick={scrollToTop}
        sx={{
          position: "absolute",
          top: -20,
          right: { xs: 16, md: 32 },
          bgcolor: "#D4AF37",
          color: "#111111",
          width: 42,
          height: 42,
          "&:hover": { bgcolor: "#B88917", transform: "translateY(-4px)" },
          transition: "all 0.25s ease"
        }}
      >
        <ArrowUpwardIcon />
      </IconButton>

      <Container sx={{ py: { xs: 5, md: 7 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.35fr 0.9fr 1fr 1fr" }, gap: 4 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box component="img" src={iesLogo} alt={branding.name} title={`${branding.name} Logo`} sx={{ width: 46, height: 46, objectFit: "contain" }} />
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: "1.15rem", lineHeight: 1.15 }}>
                  {branding.name}
                </Typography>
                <Typography sx={{ color: "#D4AF37", fontSize: "0.85rem", fontWeight: 700 }}>
                  From Foundation to Furniture
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ color: "rgba(248,250,252,0.72)", lineHeight: 1.75, mb: 2.5 }}>
              Premium house construction, custom furniture manufacturing, and modern interior solutions in Charkhi Dadri, Haryana. Serving Charkhi Dadri, Rohtak, Bhiwani, and nearby regions in Haryana.
            </Typography>
            <Stack direction="row" spacing={1.2} flexWrap="wrap">
              <Button href={`tel:+91${phone}`} title="Call Now" startIcon={<PhoneIcon />} variant="contained" sx={goldButtonSx}>
                Call Now
              </Button>
              <Button href={`https://wa.me/91${phone}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" startIcon={<WhatsAppIcon />} variant="outlined" sx={outlineButtonSx}>
                WhatsApp
              </Button>
            </Stack>
            <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
              <IconButton
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow us on Facebook"
                sx={socialIconSx}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow us on Instagram"
                sx={socialIconSx}
              >
                <InstagramIcon />
              </IconButton>
            </Stack>
          </Box>

          <Box>
            <FooterTitle>Quick Links</FooterTitle>
            <Stack spacing={1.2}>
              {quickLinks.map((item) => (
                <FooterLink key={item.name} href={item.link} icon={item.icon}>
                  {item.name}
                </FooterLink>
              ))}
            </Stack>
          </Box>

          <Box>
            <FooterTitle>Our Services</FooterTitle>
            <Stack spacing={1.2}>
              {services.map((item) => (
                <FooterLink key={item.name} href={item.link}>
                  {item.name}
                </FooterLink>
              ))}
            </Stack>
          </Box>

          <Box>
            <FooterTitle>Contact Info</FooterTitle>
            <Stack spacing={1.7}>
              <ContactRow icon={<PhoneIcon />} href={`tel:+91${phone}`}>
                +91 {phone}
              </ContactRow>
              <ContactRow icon={<WhatsAppIcon />} href={`https://wa.me/91${phone}`}>
                Chat on WhatsApp
              </ContactRow>
              <ContactRow icon={<EmailIcon />} href="mailto:info@vishwakarmabuildandfurnish.in">
                info@vishwakarmabuildandfurnish.in
              </ContactRow>
              <ContactRow icon={<LocationOnIcon />} href={googleMapsLocationUrl}>
                Vishwakarma Build and Furnish, Charkhi Dadri
              </ContactRow>
            </Stack>
            <Box sx={{ mt: 2.5, p: 2, bgcolor: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.24)", borderRadius: 2 }}>
              <Typography sx={{ color: "#D4AF37", fontWeight: 900 }}>Business Hours</Typography>
              <Typography sx={{ color: "rgba(248,250,252,0.78)", fontSize: "0.9rem" }}>
                Monday - Sunday, 7:00 AM - 8:00 PM
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4, bgcolor: "rgba(212,175,55,0.16)" }} />

        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Typography sx={{ color: "rgba(248,250,252,0.58)", fontSize: "0.82rem", textAlign: "center" }}>
            © 2026 Vishwakarma Build & Furnish. All rights reserved.
          </Typography>
          <Link
            component={RouterLink}
            to="/website-info"
            title="Need a website like this for your business? Know more"
            underline="none"
            sx={{
              color: "#D4AF37",
              fontSize: "0.82rem",
              fontWeight: 800,
              textAlign: "center",
              "&:hover": { color: "#F8FAFC" }
            }}
          >
            Need a website like this for your business? Know more
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

const FooterTitle = ({ children }) => (
  <Typography sx={{ color: "#D4AF37", fontWeight: 900, fontSize: "1.05rem", mb: 2, position: "relative", display: "inline-block", "&:after": { content: '""', position: "absolute", left: 0, bottom: -7, width: 38, height: 2, bgcolor: "#D4AF37" } }}>
    {children}
  </Typography>
);

const getLinkTitle = (children) => {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children
      .map(child => (typeof child === "string" || typeof child === "number" ? child : ""))
      .join("")
      .trim();
  }
  return undefined;
};

const FooterLink = ({ href, icon, children }) => (
  <Link href={href} title={getLinkTitle(children)} underline="none" sx={{ display: "flex", alignItems: "center", gap: 1, color: "rgba(248,250,252,0.72)", fontSize: "0.92rem", transition: "0.2s ease", "& svg": { fontSize: 17, color: "#D4AF37" }, "&:hover": { color: "#D4AF37", transform: "translateX(4px)" } }}>
    {icon}
    {children}
  </Link>
);

const ContactRow = ({ href, icon, children }) => (
  <Link href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" title={getLinkTitle(children)} underline="none" sx={{ display: "flex", gap: 1.2, alignItems: "flex-start", color: "rgba(248,250,252,0.74)", fontSize: "0.9rem", wordBreak: "break-word", "& svg": { color: "#D4AF37", fontSize: 20, mt: 0.1 }, "&:hover": { color: "#D4AF37" } }}>
    {icon}
    <span>{children}</span>
  </Link>
);

const goldButtonSx = {
  bgcolor: "#D4AF37",
  color: "#111111",
  fontWeight: 900,
  textTransform: "none",
  "&:hover": { bgcolor: "#B88917" }
};

const outlineButtonSx = {
  borderColor: "#D4AF37",
  color: "#D4AF37",
  fontWeight: 900,
  textTransform: "none",
  "&:hover": { borderColor: "#D4AF37", bgcolor: "rgba(212,175,55,0.1)" }
};

const socialIconSx = {
  color: "#D4AF37",
  border: "1px solid rgba(212,175,55,0.3)",
  bgcolor: "rgba(212,175,55,0.05)",
  transition: "all 0.3s ease",
  "&:hover": {
    color: "#111111",
    bgcolor: "#D4AF37",
    borderColor: "#D4AF37",
    transform: "translateY(-3px)",
    boxShadow: "0 4px 12px rgba(212,175,55,0.25)"
  }
};

export default Footer;
