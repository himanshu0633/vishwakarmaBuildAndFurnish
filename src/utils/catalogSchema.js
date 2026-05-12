export const makeSlug = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getCategoryName = (category = {}) =>
  category?.name || category?.category || "";

export const getCategoryEmoji = (category = {}) =>
  category?.emoji || category?.icon || "📦";

export const getServiceDescription = (service = {}) =>
  service?.shortDescription || service?.desc || service?.description || "";

export const getServiceFullDescription = (service = {}) =>
  service?.fullDescription || service?.shortDescription || service?.desc || service?.description || "";

export const asCommaText = (value) => {
  if (Array.isArray(value)) return value.join(", ");
  return value || "";
};

export const parseCommaText = (value) =>
  value
    .toString()
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);

export const faqToText = (faq = []) =>
  Array.isArray(faq)
    ? faq.map(item => `${item.question || ""}|${item.answer || ""}`).join("\n")
    : "";

export const parseFaqText = (value = "") =>
  value
    .split("\n")
    .map(line => {
      const [question, ...answerParts] = line.split("|");
      return {
        question: question?.trim() || "",
        answer: answerParts.join("|").trim()
      };
    })
    .filter(item => item.question || item.answer);
