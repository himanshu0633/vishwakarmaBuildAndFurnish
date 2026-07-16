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

const localSearchPatterns = [
  "banane wala",
  "ka kaam",
  "karne wala",
  "lagane wala",
  "lakdi",
  "darwaza",
  "khidki",
  "ghar",
  "makan",
  "makaan",
  "thekedar",
  "bijli",
  "electric ka",
  "pop",
  "paint",
  "rang",
  "sofa",
  "furniture",
  "badhai",
  "rasoi",
  "almari",
  "palang",
  "farsh",
  "marble",
  "tiles"
];

const uniqueByLower = (items = []) => {
  const seen = new Set();

  return items
    .map(item => String(item || "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter(item => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

export const getLocalSearchTags = (service = {}, limit = 12) => {
  const serviceName = service?.name || "";
  const baseTags = [
    ...(service?.tags || []),
    `${serviceName} banane wala`,
    `${serviceName} ka kaam`,
    `${serviceName} ka kaam karne wala`
  ];

  return uniqueByLower(baseTags)
    .filter(tag => {
      const lower = tag.toLowerCase();
      return localSearchPatterns.some(pattern => lower.includes(pattern));
    })
    .slice(0, limit);
};

export const buildLocalSearchFaqs = (service = {}, city = "Charkhi Dadri") => {
  const serviceName = service?.name || "service";
  const localTags = getLocalSearchTags(service);

  if (!localTags.length) return [];

  const topSearches = localTags.slice(0, 8).join(", ");
  const primarySearch = localTags[0];

  return [
    {
      question: `${city} me ${serviceName} ko aur kis naam se search karte hain?`,
      answer: `Local customers ${serviceName} ke liye ${topSearches} jaise words bhi search karte hain. Vishwakarma Build & Furnish ${city} aur nearby Haryana areas me in requirements ke liye service provide karta hai.`
    },
    {
      question: `Kya aap ${primarySearch} ka kaam ${city} me karte hain?`,
      answer: `Haan, Vishwakarma Build & Furnish ${primarySearch}, ${serviceName} design, material selection, quotation, fitting aur finishing ka kaam ${city} me karta hai.`
    }
  ];
};
