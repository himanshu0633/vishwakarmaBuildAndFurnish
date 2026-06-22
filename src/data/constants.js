// Service Categories Data
export const serviceCategories = [
  {
    category: "Home Services",
    icon: "🏠",
    services: [
      { name: "Electrician", emoji: "⚡", desc: "Wiring, repairs, installations", price: "₹500/hr", popular: true },
      { name: "Plumber", emoji: "🔧", desc: "Pipe fitting, leak repairs", price: "₹450/hr", popular: true },
      { name: "Carpenter", emoji: "🔨", desc: "Furniture, woodwork", price: "₹600/hr", popular: true },
      { name: "White Wash", emoji: "🎨", desc: "Painting, whitewashing", price: "₹15/sqft", popular: true },
      { name: "Wall Makeover", emoji: "🖼️", desc: "Wallpaper, texture painting", price: "₹25/sqft", popular: false }
    ]
  },
  {
    category: "Manpower Services",
    icon: "👥",
    services: [
      { name: "Security Guards", emoji: "🛡️", desc: "24/7 security personnel", price: "₹12,000/month", popular: true },
      { name: "Bouncers", emoji: "💪", desc: "Event security", price: "₹2,500/event", popular: false },
      { name: "Housekeeping Staff", emoji: "🧹", desc: "Cleaning staff", price: "₹8,000/month", popular: true },
      { name: "Office Peons", emoji: "👨‍💼", desc: "Office assistants", price: "₹10,000/month", popular: false },
      { name: "Drivers", emoji: "🚗", desc: "Professional drivers", price: "₹15,000/month", popular: true }
    ]
  },
  {
    category: "Event Management",
    icon: "🎉",
    services: [
      { name: "School Events", emoji: "🏫", desc: "Annual day, sports day", price: "Starting ₹25,000", popular: true },
      { name: "College Events", emoji: "🎓", desc: "Fests, cultural events", price: "Starting ₹50,000", popular: true },
      { name: "Corporate Events", emoji: "🏢", desc: "Conferences, parties", price: "Starting ₹75,000", popular: true },
      { name: "Wedding Planning", emoji: "💒", desc: "Full wedding management", price: "Custom quote", popular: false },
      { name: "Birthday Parties", emoji: "🎂", desc: "Party organization", price: "Starting ₹15,000", popular: true }
    ]
  },
  {
    category: "Office Equipment",
    icon: "💻",
    services: [
      { name: "Office Equipment Supply", emoji: "📠", desc: "Printers, scanners, furniture", price: "Best price", popular: true },
      { name: "IT Equipment", emoji: "🖥️", desc: "Computers, laptops, servers", price: "Competitive rates", popular: true },
      { name: "Office Furniture", emoji: "🪑", desc: "Desks, chairs, cabinets", price: "Bulk discounts", popular: true },
      { name: "Security Systems", emoji: "📹", desc: "CCTV, access control1234567890123456789", price: "Custom installation", popular: false },
      { name: "AC & HVAC", emoji: "❄️", desc: "Installation & maintenance", price: "Service contract", popular: true }
    ]
  }
];

// Tenders Data
export const tenders = [
  { 
    id: 1,
    title: "School Annual Day Event Management", 
    location: "Delhi", 
    status: "open", 
    budget: "₹50,000 - ₹75,000", 
    deadline: "5 days left", 
    category: "Event Management",
    client: "Delhi Public School"
  },
  { 
    id: 2,
    title: "Office Electrical Work", 
    location: "Mumbai", 
    status: "open", 
    budget: "₹25,000 - ₹35,000", 
    deadline: "3 days left", 
    category: "Home Services",
    client: "Tech Corp India"
  },
  { 
    id: 3,
    title: "College Fest Management", 
    location: "Bangalore", 
    status: "booked", 
    budget: "₹1,50,000 - ₹2,00,000", 
    deadline: "Closed", 
    category: "Event Management",
    client: "IIT Bangalore"
  },
  { 
    id: 4,
    title: "Security Guards Required", 
    location: "Gurgaon", 
    status: "open", 
    budget: "₹40,000 - ₹50,000/month", 
    deadline: "7 days left", 
    category: "Manpower Services",
    client: "DLF Corporate Park"
  },
  { 
    id: 5,
    title: "Office Equipment Supply", 
    location: "Pune", 
    status: "open", 
    budget: "₹1,00,000 - ₹1,50,000", 
    deadline: "10 days left", 
    category: "Office Equipment",
    client: "Infosys Technologies"
  },
  { 
    id: 6,
    title: "White Wash & Painting Work", 
    location: "Chennai", 
    status: "open", 
    budget: "₹30,000 - ₹45,000", 
    deadline: "4 days left", 
    category: "Home Services",
    client: "Apartment Complex"
  }
];

// Stats Data
export const stats = [
  { number: "10,000+", label: "Services Completed", emoji: "✅" },
  { number: "500+", label: "Verified Professionals", emoji: "👨‍🔧" },
  { number: "98%", label: "Customer Satisfaction", emoji: "⭐" },
  { number: "24/7", label: "Customer Support", emoji: "🎯" }
];

// Testimonials Data
export const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Home Owner, Charkhi Dadri",
    rating: 5,
    service: "House Construction",
    text: "The team completed the work from foundation to finishing with proper planning. Plumbing, electrical, tiles, and paint coordination were handled smoothly."
  },
  {
    name: "Sunita Devi",
    role: "Kitchen Renovation Client",
    rating: 5,
    service: "Modular Kitchen",
    text: "The kitchen storage and finishing were better than expected. The team gave clear guidance on measurement, material selection, and installation."
  },
  {
    name: "Amit Sharma",
    role: "Interior Work Client",
    rating: 5,
    service: "Wardrobe & TV Unit",
    text: "The custom wardrobe, TV unit, and door work were delivered with a neat finish. Practical designs were suggested according to the available space."
  },
  {
    name: "Pooja Rani",
    role: "Renovation Client",
    rating: 4.5,
    service: "Home Renovation",
    text: "The old house renovation, including bathroom, tiles, paint, and repair work, was handled well. Estimate and work stages were discussed clearly in advance."
  }
];

// How It Works Data
export const howItWorks = [
  { step: "01", title: "Post Your Requirement", desc: "Tell us what service you need - electrician, event, manpower, etc.", emoji: "📝", color: "#0F172A" },
  { step: "02", title: "Get Multiple Quotes", desc: "Receive competitive bids from verified service providers", emoji: "💰", color: "#D4AF37" },
  { step: "03", title: "Compare & Choose", desc: "Check ratings, reviews, and prices to select the best", emoji: "⭐", color: "#D4AF37" },
  { step: "04", title: "Service Delivered", desc: "Get your work done and pay securely", emoji: "🎯", color: "#F5F5F5" }
];

// Banners Data
export const banners = [
  {
    title: "Find Trusted Service Providers",
    subtitle: "Electricians, Plumbers, Carpenters & More",
    description: "Connect with verified professionals for all your service needs",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  },
  {
    title: "Complete Event Management",
    subtitle: "School, College & Corporate Events",
    description: "Professional event organizers for all your occasions",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  },
  {
    title: "Manpower & Security Services",
    subtitle: "Trained Professionals at Your Service",
    description: "Security guards, bouncers, housekeeping staff available",
    image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  },
  {
    title: "Office Equipment Solutions",
    subtitle: "Complete Office Setup",
    description: "Get best deals on office equipment, furniture, and IT infrastructure",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  }
];

// Branding Data
export const branding = {
  name: "Vishwakarma Build & Furnish",
  tagline: "From Foundation to Furniture"
};

export const socialLinks = {
  instagram: "https://www.instagram.com/vishwakarmabuildandfurnish/",
  facebook: "https://www.facebook.com/profile.php?id=61590438730532&sk=directory_category"
};

// Colors
export const colors = {
  primary: "#111111",
  secondary: "#D4AF37",
  accent: "#D4AF37",
  navy: "#0F172A",
  charcoal: "#1A1A1A",
  dark: "#111111",
  light: "#F5F5F5",
  text: "#F5F5F5"
};
