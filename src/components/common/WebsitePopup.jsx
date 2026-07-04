import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CallIcon from "@mui/icons-material/Call";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useLocation } from "react-router-dom";
import axiosInstance, { getStaticAssetUrl } from "../../../utils/axiosConfig";

const todayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

const storageKey = (popupId, path, type) => `site-popup:${type}:${popupId}:${path}:${todayKey()}`;

const WebsitePopup = () => {
  const location = useLocation();
  const [popups, setPopups] = useState([]);
  const [activePopup, setActivePopup] = useState(null);

  const path = location.pathname || "/";

  const eligiblePopups = useMemo(
    () => popups.filter((popup) => {
      const seen = localStorage.getItem(storageKey(popup._id, path, "seen"));
      const snoozedUntil = Number(localStorage.getItem(storageKey(popup._id, path, "snooze")) || 0);
      return !seen && Date.now() >= snoozedUntil;
    }),
    [popups, path]
  );

  useEffect(() => {
    let cancelled = false;

    const fetchPopups = async () => {
      try {
        const response = await axiosInstance.get(`/popups?path=${encodeURIComponent(path)}`);
        if (!cancelled) {
          setActivePopup(null);
          setPopups(response.data.success ? response.data.data || [] : []);
        }
      } catch (error) {
        console.error("Error fetching website popups:", error);
      }
    };

    fetchPopups();

    return () => {
      cancelled = true;
    };
  }, [path]);

  useEffect(() => {
    if (activePopup || !eligiblePopups.length) return undefined;

    const nextPopup = eligiblePopups[0];
    const timer = window.setTimeout(() => {
      setActivePopup(nextPopup);
      axiosInstance.post(`/popups/${nextPopup._id}/track`, { action: "view" }).catch(() => {});
    }, Math.max(Number(nextPopup.initialDelaySeconds) || 0, 0) * 1000);

    return () => window.clearTimeout(timer);
  }, [activePopup, eligiblePopups]);

  const markSeen = (popup) => {
    localStorage.setItem(storageKey(popup._id, path, "seen"), "1");
  };

  const closePopup = () => {
    if (!activePopup) return;

    axiosInstance.post(`/popups/${activePopup._id}/track`, { action: "close" }).catch(() => {});

    if (activePopup.showAgainAfterClose) {
      const delayMs = Math.max(Number(activePopup.closeDelaySeconds) || 0, 0) * 1000;
      localStorage.setItem(storageKey(activePopup._id, path, "snooze"), String(Date.now() + delayMs));
    } else {
      markSeen(activePopup);
    }

    setActivePopup(null);
  };

  const handleCall = () => {
    if (!activePopup) return;
    markSeen(activePopup);
    axiosInstance.post(`/popups/${activePopup._id}/track`, { action: "call" }).catch(() => {});
    window.location.href = `tel:${activePopup.phone || "9416856468"}`;
    setActivePopup(null);
  };

  const handleWhatsApp = () => {
    if (!activePopup) return;
    markSeen(activePopup);
    axiosInstance.post(`/popups/${activePopup._id}/track`, { action: "whatsapp" }).catch(() => {});
    const phone = activePopup.phone || "9416856468";
    const message = activePopup.whatsappMessage || "Hello Vishwakarma Build & Furnish, I am interested in your services.";
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, "_blank");
    setActivePopup(null);
  };

  return (
    <Modal open={!!activePopup} onClose={closePopup}>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "grid",
          placeItems: "center",
          bgcolor: "rgba(0,0,0,0.68)",
          p: 2,
          zIndex: 1600
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 440,
            bgcolor: "#111827",
            border: "1px solid rgba(212,175,55,0.42)",
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 26px 70px rgba(0,0,0,0.46)"
          }}
        >
          <IconButton
            aria-label="Close popup"
            onClick={closePopup}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 2,
              bgcolor: "rgba(17,24,39,0.82)",
              color: "#F8FAFC",
              "&:hover": { bgcolor: "rgba(17,24,39,0.96)" }
            }}
          >
            <CloseIcon />
          </IconButton>
          {activePopup?.image && (
            <Box
              component="img"
              src={getStaticAssetUrl(activePopup.image)}
              alt={activePopup.title || "Vishwakarma Build & Furnish offer"}
              sx={{ width: "100%", display: "block", maxHeight: "68vh", objectFit: "contain", bgcolor: "#050816" }}
            />
          )}
          <Box sx={{ p: 2, display: "grid", gap: 1.5 }}>
            {activePopup?.title && (
              <Typography sx={{ color: "#F8FAFC", fontWeight: 900, textAlign: "center", overflowWrap: "anywhere" }}>
                {activePopup.title}
              </Typography>
            )}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<CallIcon />}
                onClick={handleCall}
                sx={{ bgcolor: "#D4AF37", color: "#111111", fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#B88917" } }}
              >
                Call
              </Button>
              <Button
                variant="outlined"
                startIcon={<WhatsAppIcon />}
                onClick={handleWhatsApp}
                sx={{ borderColor: "#25D366", color: "#25D366", fontWeight: 900, textTransform: "none" }}
              >
                WhatsApp
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default WebsitePopup;
