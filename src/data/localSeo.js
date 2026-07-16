export const serviceAreas = [
  {
    name: "Charkhi Dadri",
    slug: "charkhi-dadri",
    intro: "Local workshop and site service for homes, shops, offices, and renovation projects in Charkhi Dadri."
  },
  {
    name: "Bhiwani",
    slug: "bhiwani",
    intro: "Construction, wooden furniture, modular kitchen, doors, POP, paint, and interior work support for Bhiwani clients."
  },
  {
    name: "Rohtak",
    slug: "rohtak",
    intro: "Custom furniture, house construction, door work, wardrobe, and interior finishing services for Rohtak projects."
  },
  {
    name: "Mahendragarh",
    slug: "mahendragarh",
    intro: "Material-guided construction and furniture work for Mahendragarh homes, shops, and renovation requirements."
  },
  {
    name: "Rewari",
    slug: "rewari",
    intro: "Wooden work, modular kitchen, house construction, paint, POP, and interior service planning for Rewari customers."
  },
  {
    name: "Jhajjar",
    slug: "jhajjar",
    intro: "Furniture manufacturing, wooden doors, interiors, civil work, and finishing services for Jhajjar and nearby areas."
  }
];

export const localSeoServices = [
  {
    name: "Wooden Doors",
    path: "/services/furniture-services/wooden-doors-charkhi-dadri",
    searches: ["lakdi ka darwaza", "darwaza banane wala", "door ka kaam", "main door design"]
  },
  {
    name: "House Construction",
    path: "/services/construction-services/house-construction-charkhi-dadri",
    searches: ["ghar banane wala", "makan ka thekedar", "ghar ka kaam", "construction wala"]
  },
  {
    name: "Modular Kitchen",
    path: "/services/furniture-services/modular-kitchen-charkhi-dadri",
    searches: ["kitchen banane wala", "rasoi design", "modular kitchen ka kaam", "designer kitchen"]
  },
  {
    name: "Sofa Set",
    path: "/services/furniture-services/sofa-set-charkhi-dadri",
    searches: ["sofa banane wala", "sofa set ka kaam", "custom sofa", "designer sofa"]
  },
  {
    name: "POP Design",
    path: "/services/interior-services/pop-design-charkhi-dadri",
    searches: ["pop ka kaam", "pop mistri", "false ceiling ka kaam", "chhat ka pop"]
  },
  {
    name: "Electrical Work",
    path: "/services/construction-services/electrical-work-charkhi-dadri",
    searches: ["bijli ka kaam", "wiring karne wala", "light fitting", "electric ka kaam"]
  },
  {
    name: "Paint Work",
    path: "/services/construction-services/paint-work-charkhi-dadri",
    searches: ["paint ka kaam", "painter", "rang rogan", "wall paint"]
  },
  {
    name: "Tiles & Marble Work",
    path: "/services/construction-services/tiles-marble-work-charkhi-dadri",
    searches: ["tiles lagane wala", "marble ka kaam", "farsh ka kaam", "flooring work"]
  }
];

export const getServiceAreaBySlug = (slug = "") =>
  serviceAreas.find((area) => area.slug === slug);
