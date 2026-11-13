/**
 * PlanVibe Sri Lanka - Default Data & Configurations
 * Tailored for Sri Lankan Weddings, Corporate Events, Parties & Ceremonies
 * All currency values in Sri Lankan Rupees (LKR / Rs.)
 */

const LKR_CURRENCY = "Rs.";

const SRI_LANKA_DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota", "Jaffna", "Kurunegala", "Puttalam",
  "Anuradhapura", "Polonnaruwa", "Badulla", "Ratnapura", "Kegalle"
];

const SRI_LANKA_PACKAGES = [
  {
    id: "pkg-silver",
    name: "Silver Araliya Package",
    badge: "Popular for Birthdays & Parties",
    basePrice: 450000,
    priceDisplay: "Rs. 450,000",
    maxGuests: 75,
    features: [
      "Full event coordination & on-site manager",
      "Standard floral table decor & entrance arch",
      "DJ sound system & mood lighting",
      "Welcome mocktails & appetizer bites",
      "Professional photographer (4 hours coverage)",
      "Standard digital invitations & RSVP tracker"
    ]
  },
  {
    id: "pkg-gold",
    name: "Golden Nelum Banquet Package",
    badge: "Best for Corporate & Homecomings",
    basePrice: 1650000,
    priceDisplay: "Rs. 1,650,000",
    maxGuests: 200,
    features: [
      "Dedicated senior event planner & 4 coordinators",
      "Luxury thematic ballroom & stage decoration",
      "Live 5-piece pop/baila band & pro audio rig",
      "Grand Sri Lankan buffet (Mutton/Chicken/Seafood)",
      "Full HD photography & 4K cinematic highlight reel",
      "Custom LED digital photobooth with instant prints",
      "Dessert bar with Watalappan, fruit tarts & ice cream"
    ]
  },
  {
    id: "pkg-royal",
    name: "Royal Ceylon Poruwa & Wedding Grand",
    badge: "Ultimate Poruwa & Luxury Wedding",
    basePrice: 4200000,
    priceDisplay: "Rs. 4,200,000",
    maxGuests: 400,
    features: [
      "Master Poruwa ceremony coordination & Ashtaka",
      "Traditional Kandyan Magul Bera drummers & dance troupe",
      "Lavish fresh flower floral styling & fairy-light canopy",
      "5-Star luxury hotel banquet menu with carving stations",
      "Live acoustic reception duo + top party band & DJ",
      "Drone cinematography & live streaming for overseas guests",
      "Bridal retinue flowers, bouquets & table centerpieces",
      "Multi-tier celebration cake structure & souvenir boxes"
    ]
  }
];

const DEFAULT_EVENTS = [
  {
    id: "evt-sl-1",
    bookingRef: "PV-LK-2026-9041",
    title: "Kasun & Dinithi's Poruwa Ceremony & Reception",
    category: "Poruwa Wedding",
    themeColor: "rose",
    date: "2026-12-19",
    time: "09:30",
    venue: "Shangri-La Hotel, Grand Ballroom, Colombo 02",
    district: "Colombo",
    description: "Traditional Sri Lankan Poruwa ceremony according to astrological auspicious times (Nekath), followed by a grand banquet reception, oil lamp lighting, and celebration baila dance.",
    budget: 4800000,
    status: "In Progress",
    coverEmoji: "🪷",
    clientName: "Kasun Bandara",
    clientPhone: "+94 77 345 8899",
    clientEmail: "kasun.bandara@gmail.com",
    packageType: "Royal Ceylon Poruwa & Wedding Grand",
    tasks: [
      { id: "t1-1", title: "Verify auspicious Nekath times with the astrologer for Poruwa entry", category: "Tradition", priority: "High", completed: true, dueDate: "2026-11-20" },
      { id: "t1-2", title: "Confirm traditional Magul Bera and Kandyan dance troupe (Channa-Upuli)", category: "Entertainment", priority: "High", completed: true, dueDate: "2026-11-25" },
      { id: "t1-3", title: "Finalize Poruwa floral architecture & Gokkola craft arch", category: "Decor", priority: "High", completed: true, dueDate: "2026-12-01" },
      { id: "t1-4", title: "Tasting session for traditional Kiribath, Watalappan, and buffet spread", category: "Catering", priority: "Medium", completed: true, dueDate: "2026-12-05" },
      { id: "t1-5", title: "Prepare betel leaves (Bulath Hurulla) & brass oil lamp wicks", category: "Tradition", priority: "High", completed: false, dueDate: "2026-12-12" },
      { id: "t1-6", title: "Coordinate wedding cake piece gift boxes for 300 guests", category: "Favors", priority: "Medium", completed: false, dueDate: "2026-12-14" },
      { id: "t1-7", title: "Confirm Papare band for evening celebratory dance session", category: "Music", priority: "Medium", completed: false, dueDate: "2026-12-15" }
    ],
    guests: [
      { id: "g1-1", name: "Deshabandu Nihal Senanayake", email: "senanayake.n@ceylonholdings.lk", status: "Attending", plusOnes: 1, notes: "VIP Table 1 • Non-Veg" },
      { id: "g1-2", name: "Dr. Rohini Gunasekara", email: "rohini.guna@gmail.com", status: "Attending", plusOnes: 0, notes: "Table 4 • Pure Vegetarian" },
      { id: "g1-3", name: "Malith & Chamari Perera", email: "malith.p@dialog.lk", status: "Attending", plusOnes: 2, notes: "Table 6 • Halal preferred" },
      { id: "g1-4", name: "Suresh Weerasinghe", email: "suresh.w@kandyexports.com", status: "Awaiting", plusOnes: 1, notes: "Traveling from Kandy" },
      { id: "g1-5", name: "Anoma Wickramasinghe", email: "anoma.w@gmail.com", status: "Attending", plusOnes: 0, notes: "Vegetarian" },
      { id: "g1-6", name: "Ruwan Jayatillake", email: "ruwan.j@austrade.gov.au", status: "Declined", plusOnes: 0, notes: "Currently overseas in Melbourne" }
    ],
    expenses: [
      { id: "e1-1", title: "Shangri-La Grand Ballroom & Menu Booking Advance", category: "Venue", amount: 2400000, status: "Paid" },
      { id: "e1-2", title: "Gokkola & Lotus Poruwa Decor Structure", category: "Decor", amount: 680000, status: "Paid" },
      { id: "e1-3", title: "Kandyan Dancers, Magul Bera & Ashtaka Leader", category: "Tradition", amount: 220000, status: "Paid" },
      { id: "e1-4", title: "Studio 3000 Cinematography & Golden Hour Drone", category: "Media", amount: 550000, status: "Paid" },
      { id: "e1-5", title: "Papare Brass Band & Evening Live Sound", category: "Entertainment", amount: 180000, status: "Pending" }
    ],
    timeline: [
      { id: "tm1-1", time: "09:15", title: "Groom & Bride Arrival with Magul Bera Procession", description: "Traditional welcoming with Jayamangala Gatha and betel leaf offering." },
      { id: "tm1-2", time: "09:48", title: "Auspicious Poruwa Ascent (Nekath Time)", description: "Poruwa rituals, tying of Pirith Nool, blessing coconut water release." },
      { id: "tm1-3", time: "10:30", title: "Traditional Brass Oil Lamp Lighting & Kiribath Toast", description: "Lighting of the oil lamp by close family elders." },
      { id: "tm1-4", time: "12:15", title: "Grand Ceylon Buffet Lunch Service", description: "Traditional Lamprais, yellow rice, mutton black curry, and Watalappan." },
      { id: "tm1-5", time: "14:00", title: "First Dance, Papare Band & Baila Extravaganza", description: "High-energy celebration music and group dances." }
    ],
    vendors: [
      { id: "v1-1", name: "Ceylon Lotus Poruwa Artisans", service: "Poruwa Floral & Traditional Craft", contact: "+94 77 712 3456 | lotusdecor.lk", status: "Confirmed" },
      { id: "v1-2", name: "Ravana Beats & Kandyan Troupe", service: "Traditional Magul Bera & Dancers", contact: "+94 71 456 7890 | bookings@ravanabeats.lk", status: "Confirmed" },
      { id: "v1-3", name: "Lumina Ceylon Studio", service: "Full HD Video & Drone Team", contact: "+94 11 289 9000 | photo@luminaceylon.com", status: "Confirmed" },
      { id: "v1-4", name: "Colombo Brass Papare Stars", service: "Live Papare & Party Brass", contact: "+94 76 890 1234", status: "Confirmed" }
    ]
  },
  {
    id: "evt-sl-2",
    bookingRef: "PV-LK-2026-7712",
    title: "Dialog Axiata Annual Corporate Gala & Awards Night",
    category: "Corporate Gala",
    themeColor: "indigo",
    date: "2026-11-28",
    time: "18:30",
    venue: "BMICH Banquet Hall, Colombo 07",
    district: "Colombo",
    description: "Annual leadership gala celebrating team achievements across Sri Lanka with live entertainment, five-course banquet, and executive awards ceremony.",
    budget: 6500000,
    status: "Confirmed",
    coverEmoji: "🏆",
    clientName: "Dialog Corporate Relations",
    clientPhone: "+94 11 710 1000",
    clientEmail: "events@dialog.lk",
    packageType: "Golden Nelum Banquet Package",
    tasks: [
      { id: "t2-1", title: "Inspect BMICH stage LED backdrop and audio beam arrays", category: "Tech", priority: "High", completed: true, dueDate: "2026-11-15" },
      { id: "t2-2", title: "Order custom crystal executive excellence trophies", category: "Awards", priority: "High", completed: true, dueDate: "2026-11-18" },
      { id: "t2-3", title: "Finalize multi-cuisine executive buffet with BMICH catering", category: "Catering", priority: "Medium", completed: false, dueDate: "2026-11-22" },
      { id: "t2-4", title: "Brief English & Sinhala bilingual Master of Ceremonies", category: "Program", priority: "Medium", completed: false, dueDate: "2026-11-25" }
    ],
    guests: [
      { id: "g2-1", name: "Supun Weerasinghe (Group CEO)", email: "ceo.office@dialog.lk", status: "Attending", plusOnes: 1, notes: "Head Table" },
      { id: "g2-2", name: "Pradeep De Almeida (CTO)", email: "cto@dialog.lk", status: "Attending", plusOnes: 0, notes: "Head Table" },
      { id: "g2-3", name: "Kasturi Chellaraja", email: "kasturi.c@industry.lk", status: "Attending", plusOnes: 0, notes: "Guest Speaker" }
    ],
    expenses: [
      { id: "e2-1", title: "BMICH Hall Booking & Lighting Grid Rental", category: "Venue", amount: 2800000, status: "Paid" },
      { id: "e2-2", title: "Executive 5-Star Buffet for 350 Guests", category: "Catering", amount: 2100000, status: "Paid" },
      { id: "e2-3", title: "Sound, Intelligent Lighting & LED Video Walls", category: "Tech", amount: 950000, status: "Paid" }
    ],
    timeline: [
      { id: "tm2-1", time: "18:30", title: "Registration & Welcome Cocktail in Main Foyer", description: "Live jazz saxophonist performance." },
      { id: "tm2-2", time: "19:15", title: "National Anthem & Traditional Lamp Lighting", description: "Official commencement by the board of directors." },
      { id: "tm2-3", time: "20:00", title: "Excellence Awards Distribution Ceremony", description: "Recognition of top engineering & customer service divisions." },
      { id: "tm2-4", time: "21:30", title: "Executive Gala Dinner & Live Pop/Baila Band", description: "Performance by leading Sri Lankan pop sensation." }
    ],
    vendors: [
      { id: "v2-1", name: "Axiom Sound & Visuals Colombo", service: "AV, 4K LED Screen & Lighting", contact: "+94 11 445 6677", status: "Confirmed" },
      { id: "v2-2", name: "Mount Lavinia Hotel Outdoor Catering", service: "5-Course Banquet Service", contact: "+94 11 271 1441", status: "Confirmed" }
    ]
  },
  {
    id: "evt-sl-3",
    bookingRef: "PV-LK-2026-6219",
    title: "Shenal's 21st Tropical Beach Sunset Celebration",
    category: "Beach Party",
    themeColor: "amber",
    date: "2026-12-05",
    time: "16:30",
    venue: "Jetwing Lighthouse Beach Lawn, Galle",
    district: "Galle",
    description: "Vibrant beachside 21st milestone party with live seafood BBQ grill stations, coconut cocktail huts, acoustic band, and golden hour fireworks over the Indian Ocean.",
    budget: 950000,
    status: "In Progress",
    coverEmoji: "🥥",
    clientName: "Shenal De Silva",
    clientPhone: "+94 77 990 1122",
    clientEmail: "shenal.desilva@yahoo.com",
    packageType: "Silver Araliya Package",
    tasks: [
      { id: "t3-1", title: "Order custom tropical coconut cocktail bar setup", category: "Bar", priority: "High", completed: true, dueDate: "2026-11-20" },
      { id: "t3-2", title: "Confirm seafood BBQ menu: jumbo prawns, seer fish & calamari", category: "Catering", priority: "High", completed: true, dueDate: "2026-11-28" },
      { id: "t3-3", title: "Secure beach firework permission from local authorities", category: "Logistics", priority: "Medium", completed: false, dueDate: "2026-12-01" }
    ],
    guests: [
      { id: "g3-1", name: "Tavisha Fernando", email: "tavisha.f@gmail.com", status: "Attending", plusOnes: 1, notes: "Seafood lover" },
      { id: "g3-2", name: "Dilan Jayasuriya", email: "djayasuriya@outlook.com", status: "Attending", plusOnes: 0, notes: "" },
      { id: "g3-3", name: "Kaveesha Mendis", email: "kavee.mendis@gmail.com", status: "Awaiting", plusOnes: 1, notes: "" }
    ],
    expenses: [
      { id: "e3-1", title: "Jetwing Lighthouse Ocean Lawn Hire", category: "Venue", amount: 350000, status: "Paid" },
      { id: "e3-2", title: "Galle Fresh Seafood BBQ & Dessert Station", category: "Catering", amount: 380000, status: "Paid" },
      { id: "e3-3", title: "Sunset Acoustic Trio & DJ Sound Rig", category: "Entertainment", amount: 120000, status: "Pending" }
    ],
    timeline: [
      { id: "tm3-1", time: "16:30", title: "Guests Arrive & King Coconut Welcome Drinks", description: "Acoustic island vibes and lawn games." },
      { id: "tm3-2", time: "18:00", title: "Sunset 21st Birthday Toast & Cake Cutting", description: "Ocean sunset photo session." },
      { id: "tm3-3", time: "19:00", title: "Live Seafood BBQ & Beach Bonfire", description: "Seer fish steaks, devilled prawns, and tropical fruit punch." },
      { id: "tm3-4", time: "20:30", title: "DJ Beach Dance Party & Fireworks", description: "Baila classics & summer chart hits." }
    ],
    vendors: [
      { id: "v3-1", name: "Southern Tides Acoustic Trio", service: "Acoustic Live Music", contact: "+94 91 224 8899", status: "Confirmed" },
      { id: "v3-2", name: "Galle Fort Bakes & Pastry", service: "Custom 3-Tier Birthday Cake", contact: "+94 77 112 3344", status: "Confirmed" }
    ]
  }
];

const CATEGORIES = [
  { name: "Poruwa Wedding", emoji: "🪷", color: "rose" },
  { name: "Homecoming", emoji: "💍", color: "purple" },
  { name: "Corporate Gala", emoji: "🏆", color: "indigo" },
  { name: "Birthday Party", emoji: "🎂", color: "emerald" },
  { name: "Beach Party", emoji: "🥥", color: "amber" },
  { name: "Pirith & Almsgiving", emoji: "☸️", color: "amber" },
  { name: "Big Match / Cricket", emoji: "🏏", color: "sky" },
  { name: "Avurudu Celebration", emoji: "🌞", color: "rose" }
];

const SRI_LANKAN_BANKS = [
  { name: "Commercial Bank of Ceylon", account: "8002918291", branch: "Colombo Fort Main Branch" },
  { name: "Bank of Ceylon (BOC)", account: "0001928374", branch: "Head Office Branch" },
  { name: "Hatton National Bank (HNB)", account: "0992817263", branch: "City Office Colombo" },
  { name: "Sampath Bank", account: "0109283741", branch: "Colombo Super Branch" }
];
