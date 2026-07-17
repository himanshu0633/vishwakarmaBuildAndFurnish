import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";

const mapGoogleReview = (review) => ({
  name: review.name || "Google User",
  role: review.relativeTime ? `Google Review • ${review.relativeTime}` : "Google Review",
  rating: Number(review.rating) || 5,
  service: "Google Review",
  text: review.text || "",
  profilePhotoUrl: review.profilePhotoUrl || "",
  source: review.source || "Google"
});

const useGoogleReviews = (fallbackReviews = []) => {
  const [googleReviews, setGoogleReviews] = useState([]);
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchGoogleReviews = async () => {
      try {
        const response = await axiosInstance.get("/google-reviews");
        if (!mounted || !response.data?.success) return;

        setGoogleReviews((response.data.data || []).map(mapGoogleReview).filter((review) => review.text));
        setBusiness(response.data.business || null);
      } catch (error) {
        console.error("Google reviews unavailable:", error);
      }
    };

    fetchGoogleReviews();

    return () => {
      mounted = false;
    };
  }, []);

  const reviews = useMemo(
    () => (googleReviews.length ? googleReviews : fallbackReviews),
    [fallbackReviews, googleReviews]
  );

  return {
    reviews,
    business,
    isGoogleReviews: googleReviews.length > 0
  };
};

export default useGoogleReviews;
