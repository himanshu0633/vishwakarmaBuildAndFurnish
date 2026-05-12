import React from "react";
import { Box, Chip, Container, Stack, Typography } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { motion } from "framer-motion";
import { colors, stats } from "../../data/constants";

const trustBadges = [
  { icon: <VerifiedIcon />, label: "Verified Partners" },
  { icon: <WorkspacePremiumIcon />, label: "Quality Assured" },
  { icon: <SupportAgentIcon />, label: "Dedicated Support" }
];

const TrustStrip = () => {
  return (
    <Box
      sx={{
        bgcolor: colors.light,
        borderBottom: `1px solid ${colors.secondary}33`,
        py: { xs: 3, md: 4 }
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={{ xs: 2, md: 3 }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 3 }}
            sx={{ width: "100%" }}
          >
            {stats.map((item) => (
              <motion.div key={item.label} whileHover={{ y: -2 }}>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: colors.navy }}
                  >
                    {item.number}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.label}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Stack>

          <Stack direction="row" flexWrap="wrap" gap={1}>
            {trustBadges.map((badge) => (
              <Chip
                key={badge.label}
                icon={badge.icon}
                label={badge.label}
                sx={{
                  bgcolor: `${colors.navy}0D`,
                  border: `1px solid ${colors.secondary}4D`,
                  color: colors.navy,
                  fontWeight: 600,
                  "& .MuiChip-icon": { color: colors.accent }
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default TrustStrip;
