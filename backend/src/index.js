import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = new Set(
  (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV !== 'production' && /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    try {
      const { hostname, protocol } = new URL(origin);
      return callback(null, protocol === 'https:' && hostname.endsWith('.vercel.app'));
    } catch {
      return callback(null, false);
    }
  },
}));
app.use(express.json());

// Serve static video files with proper MIME type and HTTP byte range support
app.use('/videos', express.static(path.join(__dirname, '../public/videos'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
    }
  }
}));

// 10 Business Categories
let categories = [
  {
    id: "cat-jewellery",
    name: "Jewellery & Accessories",
    tagline: "Necklaces, Bridal Polki, Gold Collections & Fine Watches",
    description: "Connect with specialized creators showcasing solitaires, 22K gold temple jewellery, diamond necklaces, Kundan earrings, and luxury timepieces with macro brilliance.",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    videoPreviewUrl: "/videos/jewelry-macro.mp4",
    defaultAspectRatio: "1:1",
    sampleConcepts: [
      "Royal 22K Gold Temple Necklace Bridal Reveal with Macro Shimmer",
      "Emerald & Polki Choker Handcrafted Collection Promo Reel",
      "Solitaire Diamond Engagement Ring 360 Turntable with Light Caustics"
    ],
    popularTools: ["Flux.1 Dev", "ControlNet Depth", "Luma Dream Machine", "Magnific AI"],
    creatorCount: 28,
  },
  {
    id: "cat-clothing",
    name: "Clothing & Fashion",
    tagline: "Sarees, Bridal Lehengas, Designer Dresses & Boutique Reels",
    description: "Discover fashion influencers and video creators specializing in saree draping reels, festive boutique launches, ethnic kurtas, western runway lines, and streetwear lookbooks.",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    videoPreviewUrl: "/videos/fashion-runway.mp4",
    defaultAspectRatio: "9:16",
    sampleConcepts: [
      "Banarasi Silk Saree Festive Draping & Boutique Walkthrough 30s Reel",
      "Autumn Haute Couture Lookbook with Dynamic Fabric Physics",
      "Handcrafted Embroidered Velvet Lehenga Bridal Showcase"
    ],
    popularTools: ["Runway Gen-3", "Flux.1 Dev", "Pika 2.1", "Kling AI"],
    creatorCount: 42,
  },
  {
    id: "cat-colleges",
    name: "Colleges & Education",
    tagline: "Campus Tours, Student Life, Course Promos & Admission Ads",
    description: "Partner with genuine education vloggers, student-life creators, and campus documentary filmmakers who produce engaging campus tours, admission campaigns, and student testimonials.",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
    videoPreviewUrl: "/videos/cinematic-reel.mp4",
    defaultAspectRatio: "9:16",
    sampleConcepts: [
      "High-Energy Campus Tour Reel: Drone Flythrough to Modern Tech Labs",
      "Day in the Life of a Computer Science Student: Admission Hook Video",
      "MBA Placement Highlights & International Exchange Testimonials"
    ],
    popularTools: ["Runway Gen-3", "Premiere Pro", "Midjourney v6.1", "Topaz Video"],
    creatorCount: 31,
  },
  {
    id: "cat-food",
    name: "Restaurants & Food",
    tagline: "Mouthwatering Reels, Menu Highlights & Dining Walkthroughs",
    description: "Sensory food reviewers, local food vloggers, and culinary storytellers capturing sizzling grills, cheese pulls, chef table dining, and local cafe promotions.",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    videoPreviewUrl: "/videos/culinary-wagyu.mp4",
    defaultAspectRatio: "9:16",
    sampleConcepts: [
      "Signature Charcoal Woodfired Sizzle Reel with Chef Storytelling",
      "Weekend Brunch Menu Highlights: 15s Punchy Tasting Tour",
      "Craft Cocktail Mixology Bar Sequence with Ambient Slow-Mo"
    ],
    popularTools: ["Pika 2.1", "Runway Gen-3", "ElevenLabs VO", "Topaz Video"],
    creatorCount: 35,
  },
  {
    id: "cat-beauty",
    name: "Beauty & Skincare",
    tagline: "Serum Textures, Dewy Skin Transformations & Makeup Tutorials",
    description: "Beauty vloggers and cosmetic visualists crafting clean aesthetic product unboxings, skin texture close-ups, organic skincare reels, and shade swatch demos.",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    videoPreviewUrl: "/videos/luxury-macro.mp4",
    defaultAspectRatio: "9:16",
    sampleConcepts: [
      "Hyaluronic Dewy Serum Dropper Texture & Skin Glow Testimonial",
      "Matte Lip Shade Swatch Reel with Clean Aesthetic Lighting",
      "Clean Organic Hair Oil Natural Routine Reel"
    ],
    popularTools: ["Flux.1 Dev", "Runway Gen-3", "Photoshop", "Magnific AI"],
    creatorCount: 30,
  },
  {
    id: "cat-electronics",
    name: "Electronics & Tech",
    tagline: "Gadget Unboxings, Exploded Hardware CADs & Feature Reviews",
    description: "Hardware reviewers and tech visualists producing smartphone reveals, ANC headphone tests, creator setups, and futuristic consumer electronics unboxings.",
    imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80",
    videoPreviewUrl: "/videos/cinematic-reel.mp4",
    defaultAspectRatio: "16:9",
    sampleConcepts: [
      "Titanium Smartwatch Unboxing & Haptic Feedback Feature Spotlight",
      "Ultra-Fast Gaming Laptop Exploded Cooling System CGI & Real Benchmarks",
      "Wireless Noise-Canceling Earbuds Commuter Test in City Subways"
    ],
    popularTools: ["Flux.1 Dev", "ComfyUI Multi-ControlNet", "Blender AI", "Magnific AI"],
    creatorCount: 36,
  },
  {
    id: "cat-travel",
    name: "Travel & Tourism",
    tagline: "Drone Landscapes, Luxury Resort Tours & Destination Guides",
    description: "Wanderlust filmmakers and tourism creators capturing 4K panoramic drone flythroughs, boutique villa reviews, adventure travel reels, and resort hospitality.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    videoPreviewUrl: "/videos/travel-drone.mp4",
    defaultAspectRatio: "16:9",
    sampleConcepts: [
      "Luxury Cliffside Resort Infinity Pool Sunset 4K Drone Tour",
      "Hidden Mountain Homestay & Organic Farm Experience Reel",
      "Weekend City Staycation Itinerary: Best Cafes & Heritage Sights"
    ],
    popularTools: ["Runway Gen-3 Alpha", "Midjourney v6.1", "Topaz 4K Video", "Luma"],
    creatorCount: 26,
  },
  {
    id: "cat-fitness",
    name: "Healthcare & Fitness",
    tagline: "Workout Routines, Supplement Unboxings & Wellness Clinics",
    description: "Certified trainers, holistic nutritionists, and wellness creators reviewing fitness gear, protein nutrition, gym facilities, and healthy lifestyle routines.",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    videoPreviewUrl: "/videos/drinks-burst.mp4",
    defaultAspectRatio: "9:16",
    sampleConcepts: [
      "High-Intensity Functional Fitness Gym Walkthrough & Member Spotlight",
      "Clean Plant Protein Smoothie Reel with Nutritional Breakdown",
      "Holistic Wellness Clinic Physiotherapy & Posture Rehab Reel"
    ],
    popularTools: ["Runway Gen-3", "Premiere Pro", "CapCut", "Flux.1"],
    creatorCount: 22,
  },
  {
    id: "cat-realestate",
    name: "Real Estate & Housing",
    tagline: "Luxury Villa Walkthroughs, Model Flats & Architecture Tours",
    description: "Architectural filmmakers and property walkthrough specialists showcasing gated villas, penthouse penthouses, real estate launches, and commercial spaces.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    videoPreviewUrl: "/videos/travel-drone.mp4",
    defaultAspectRatio: "16:9",
    sampleConcepts: [
      "4BHK Luxury Gated Villa Master Bedroom & Deck Cinematic Walkthrough",
      "Sky Penthouse 360 City View & Smart Home Automation Showcase",
      "Commercial Co-Working Space Launch Promo with Startup Energy"
    ],
    popularTools: ["Runway Gen-3", "Luma Dream Machine", "Topaz 4K Video"],
    creatorCount: 20,
  },
  {
    id: "cat-local",
    name: "Local Businesses & Startups",
    tagline: "Artisan Bakeries, Boutique Studios & Startup Founder Stories",
    description: "Hyper-local creators driving footfall and brand affinity for independent cafes, dental practices, craft breweries, boutique agencies, and early-stage startups.",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80",
    videoPreviewUrl: "/videos/culinary-wagyu.mp4",
    defaultAspectRatio: "9:16",
    sampleConcepts: [
      "Neighborhood Sourdough Bakery 5 AM Behind-the-Scenes Story",
      "Independent Eco-Friendly Clothing Boutique Local Discovery Reel",
      "Early-Stage Tech Startup Founder Journey & Office Culture Spotlight"
    ],
    popularTools: ["CapCut", "Runway Gen-3", "Midjourney v6.1"],
    creatorCount: 29,
  },
];

let creators = [
  {
    id: "creator-jewel-1",
    name: "Priya & Dev Sharma",
    handle: "priya_gem_studio",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    coverUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
    headline: "Fine Jewellery & Bridal Gold Promotional Video Directors",
    bio: "Specializing in high-refraction macro shots, diamond sparkle caustics, and traditional 22K gold temple jewellery reels. Over 40+ jewellery brand collabs with verified engagement across Instagram & YouTube.",
    location: "Jaipur & Mumbai, India",
    languages: ["English", "Hindi", "Gujarati"],
    category: "Jewellery & Accessories",
    specializations: ["Bridal Jewellery", "Gold Collections", "Diamond Solitaires", "Kundan Chokers", "Luxury Watches"],
    platforms: ["Instagram", "YouTube", "Facebook"],
    followerCount: "215K",
    isVerified: true,
    rating: 4.97,
    reviewsCount: 48,
    completedBriefs: 41,
    hourlyRate: 90,
    pricing: { startingRate: 400, hourlyRate: 90, perReelRate: 450, currency: "USD" },
    preferredFormats: ["Reel", "Review", "Short Video"],
    availability: "Available for immediate campaigns",
    tools: ["Flux.1 Dev", "ControlNet Canny", "Luma Dream Machine", "Magnific AI"],
    styles: ["Macro Light Caustics", "Luxury Velvet Backdrops", "Ultra-High Refraction"],
    badges: ["Top Rated Jewellery 2026", "Macro Perfectionist"],
    portfolio: [
      {
        id: "p-jewel-1",
        title: "24K Royal Kundan Polki Choker Macro Reveal",
        mediaUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "/videos/jewelry-macro.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
        duration: "0:25",
        mediaType: "video",
        category: "Jewellery & Accessories",
        prompt: "Ultra-macro 8k slow motion camera pan across uncut raw diamonds and Columbian emeralds on an antique 24k gold bridal necklace, candle light caustics refracting through jewels.",
        model: "Flux.1 Dev + ControlNet",
        tools: ["Flux.1 Dev", "Luma Dream Machine"],
        aspectRatio: "1:1",
        createdAt: "2 days ago",
      }
    ],
  },
  {
    id: "creator-fashion-1",
    name: "Aanya Kapoor & Studio",
    handle: "aanya_bridal_ai",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    coverUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    headline: "Ethnic Wear, Sarees & Bridal Boutique Promotion Influencer",
    bio: "Creating viral saree draping reels, bridal lehenga lookbooks, and designer boutique walkthroughs. Known for authentic cinematic slow-motion and vibrant festival colors.",
    location: "New Delhi & Mumbai, India",
    languages: ["English", "Hindi", "Punjabi"],
    category: "Clothing & Fashion",
    specializations: ["Saree Draping", "Bridal Lehengas", "Festive Collections", "Boutique Walkthroughs"],
    platforms: ["Instagram", "YouTube", "TikTok"],
    followerCount: "340K",
    isVerified: true,
    rating: 4.99,
    reviewsCount: 68,
    completedBriefs: 54,
    hourlyRate: 95,
    pricing: { startingRate: 500, hourlyRate: 95, perReelRate: 550, currency: "USD" },
    preferredFormats: ["Reel", "Review", "Short Video"],
    availability: "Available for festive season bookings",
    tools: ["Runway Gen-3", "ComfyUI Fabric LoRA", "Midjourney v6.1", "Topaz Video AI"],
    styles: ["Royal Heritage", "Cinematic Slow-Motion", "Festive Warmth"],
    badges: ["Bridal Fashion Lead", "Top Rated 2026"],
    portfolio: [
      {
        id: "p-fashion-1",
        title: "Royal Crimson Velvet Lehenga Cinematic Reveal",
        mediaUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "/videos/bridal-couture.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
        duration: "0:30",
        mediaType: "video",
        category: "Clothing & Fashion",
        prompt: "Cinematic 35mm slow motion tracking shot of an Indian bride twirling in a hand-embroidered royal crimson velvet lehenga inside a candlelit Jaipur palace courtyard.",
        model: "Runway Gen-3 Alpha",
        tools: ["Runway Gen-3", "ComfyUI"],
        aspectRatio: "9:16",
        createdAt: "Yesterday",
      }
    ],
  },
  {
    id: "creator-edu-1",
    name: "Rohan Varma",
    handle: "rohan_campus_vlogs",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    coverUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    headline: "Campus Tour Creator & Higher-Ed Admission Campaign Video Producer",
    bio: "Helping universities and colleges drive applications through authentic campus life reels, faculty spotlights, modern lab walk-throughs, and student career testimonials.",
    location: "Bengaluru & Pune, India",
    languages: ["English", "Hindi"],
    category: "Colleges & Education",
    specializations: ["Campus Tours", "Student Life Vlogs", "Admission Campaigns", "Course Reviews"],
    platforms: ["YouTube", "Instagram", "LinkedIn"],
    followerCount: "180K",
    isVerified: true,
    rating: 4.95,
    reviewsCount: 38,
    completedBriefs: 32,
    hourlyRate: 80,
    pricing: { startingRate: 350, hourlyRate: 80, perReelRate: 400, currency: "USD" },
    preferredFormats: ["Campus Tour", "Reel", "Review"],
    availability: "Available for Fall/Spring admission cycles",
    tools: ["Runway Gen-3", "Premiere Pro", "Midjourney v6.1"],
    styles: ["High Energy Student Life", "Modern Campus Aerials"],
    badges: ["Higher-Ed Specialist", "Youth Audience Reach"],
    portfolio: [
      {
        id: "p-edu-1",
        title: "Modern Tech University Campus Tour & Innovation Labs",
        mediaUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "/videos/cinematic-reel.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
        duration: "0:45",
        mediaType: "video",
        category: "Colleges & Education",
        prompt: "Dynamic college campus tour with FPV drone gliding past modern glass architecture, students collaborating in robotics lab, vibrant central lawn.",
        model: "Runway Gen-3 Alpha",
        tools: ["Runway Gen-3", "Premiere Pro"],
        aspectRatio: "9:16",
        createdAt: "2 days ago",
      }
    ],
  },
  {
    id: "creator-food-1",
    name: "Marco Rossi & Tanya",
    handle: "rossi_culinary_ai",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    coverUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    headline: "Sensory Food Reviewer & Restaurant Promotion Director",
    bio: "Creating high-engagement gourmet reels, grill sizzles, cocktail mixology videos, and restaurant ambience tours that fill tables. Trusted by 50+ restaurants and cloud kitchens.",
    location: "Rome & New York",
    languages: ["English", "Italian", "Spanish"],
    category: "Restaurants & Food",
    specializations: ["Food Reviews", "Restaurant Promos", "Menu Highlights", "Chef Interviews"],
    platforms: ["Instagram", "TikTok", "YouTube"],
    followerCount: "260K",
    isVerified: true,
    rating: 4.94,
    reviewsCount: 39,
    completedBriefs: 31,
    hourlyRate: 85,
    pricing: { startingRate: 300, hourlyRate: 85, perReelRate: 380, currency: "USD" },
    preferredFormats: ["Reel", "Review", "Short Video"],
    availability: "Available for tasting shoots this week",
    tools: ["Pika 2.1", "Runway Gen-3", "Midjourney v6.1"],
    styles: ["Appetite Appeal", "Dynamic Sizzle", "Artisan Warmth"],
    badges: ["Sensory Food Master", "Fast 48h Turnaround"],
    portfolio: [
      {
        id: "p-food-1",
        title: "Artisan Binchotan Wagyu Sizzle Reel",
        mediaUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "/videos/culinary-wagyu.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        duration: "0:30",
        mediaType: "video",
        category: "Restaurants & Food",
        prompt: "Ultra-close macro slow motion of marbled A5 Japanese Wagyu steak searing on glowing red Binchotan coals, fat bubbling with audible sizzle.",
        model: "Pika 2.1 + Runway Gen-3",
        tools: ["Pika 2.1", "Runway Gen-3"],
        aspectRatio: "9:16",
        createdAt: "3 days ago",
      }
    ],
  }
];

let collaborations = [
  {
    id: "collab-101",
    businessId: "biz-kalyan",
    businessName: "Kalyan Heritage Jewellers",
    businessLogo: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&q=80",
    creatorId: "creator-jewel-1",
    creatorName: "Priya & Dev Sharma",
    campaignTitle: "Bridal Diamond & Polki Choker Festive Teaser",
    productService: "Handcrafted 24K Polki Bridal Choker Set",
    requirements: "2x 30s Instagram Reels with extreme macro gemstone lighting caustics and velvet display turntable.",
    budget: 1200,
    deadline: "2026-11-15",
    message: "Hi Priya & Dev! We love your macro caustics on the solitaire ring. We would love to collaborate on our upcoming Diwali bridal launch.",
    status: "Accepted",
    createdAt: "2026-10-20T10:30:00Z",
    updatedAt: "2026-10-21T14:15:00Z"
  },
  {
    id: "collab-102",
    businessId: "biz-stxavier",
    businessName: "St. Xavier Institute of Technology",
    businessLogo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=200&q=80",
    creatorId: "creator-edu-1",
    creatorName: "Rohan Varma",
    campaignTitle: "2027 Tech Admissions Campus Tour Series",
    productService: "AI & Computer Science B.Tech Admissions",
    requirements: "1x 60s Campus Tour + 2x 15s Reels on modern AI labs and campus life.",
    budget: 1500,
    deadline: "2026-11-30",
    message: "Hello Rohan! We watched your recent tech campus vlog and the student engagement was fantastic. We want you to direct our admission highlight video.",
    status: "Pending",
    createdAt: "2026-10-22T09:00:00Z",
    updatedAt: "2026-10-22T09:00:00Z"
  }
];

let messages = {
  'collab-101': [
    {
      id: 'msg-1',
      collaborationId: 'collab-101',
      senderId: 'biz-kalyan',
      senderName: 'Kalyan Heritage Jewellers',
      senderRole: 'brand',
      content: 'Hi Priya & Dev! Can you deliver 2 reels with extreme diamond caustics by Nov 15th?',
      createdAt: '2026-10-20T11:00:00Z'
    },
    {
      id: 'msg-2',
      collaborationId: 'collab-101',
      senderId: 'creator-jewel-1',
      senderName: 'Priya & Dev Sharma',
      senderRole: 'creator',
      content: 'Hello! Absolutely, we have specialized macro turntables ready for bridal Kundan jewellery.',
      createdAt: '2026-10-20T12:30:00Z'
    }
  ]
};

// Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CreatorConnect AI API', timestamp: new Date().toISOString() });
});

app.get('/api/categories', (req, res) => {
  res.json({ success: true, count: categories.length, data: categories });
});

app.get('/api/creators', (req, res) => {
  const { tool, category, search, platform, format } = req.query;
  let results = [...creators];

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.headline.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.specializations && c.specializations.some(s => s.toLowerCase().includes(q))) ||
      c.tools.some(t => t.toLowerCase().includes(q))
    );
  }
  if (category && category !== 'All') {
    results = results.filter(c =>
      c.category.toLowerCase().includes(String(category).toLowerCase())
    );
  }
  if (platform && platform !== 'All') {
    results = results.filter(c => c.platforms.some(p => p.toLowerCase() === String(platform).toLowerCase()));
  }
  if (format && format !== 'All') {
    results = results.filter(c => c.preferredFormats && c.preferredFormats.some(f => f.toLowerCase() === String(format).toLowerCase()));
  }

  res.json({ success: true, count: results.length, data: results });
});

app.get('/api/collaborations', (req, res) => {
  res.json({ success: true, count: collaborations.length, data: collaborations });
});

app.post('/api/collaborations', (req, res) => {
  const newCollab = {
    id: `collab-${Date.now()}`,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body
  };
  collaborations.unshift(newCollab);
  res.status(201).json({ success: true, data: newCollab });
});

app.patch('/api/collaborations/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const collab = collaborations.find(c => c.id === id);
  if (!collab) {
    return res.status(404).json({ success: false, message: 'Collaboration request not found' });
  }
  collab.status = status;
  collab.updatedAt = new Date().toISOString();
  res.json({ success: true, data: collab });
});

app.get('/api/collaborations/:id/messages', (req, res) => {
  const { id } = req.params;
  res.json({ success: true, data: messages[id] || [] });
});

app.post('/api/collaborations/:id/messages', (req, res) => {
  const { id } = req.params;
  const { senderId, senderName, senderRole, content } = req.body;
  const newMsg = {
    id: `msg-${Date.now()}`,
    collaborationId: id,
    senderId,
    senderName,
    senderRole,
    content,
    createdAt: new Date().toISOString()
  };
  if (!messages[id]) messages[id] = [];
  messages[id].push(newMsg);
  res.status(201).json({ success: true, data: newMsg });
});

app.post('/api/ai/copilot', (req, res) => {
  const { prompt, category } = req.body;
  const structuredResponse = {
    title: `${category || 'Product'} Commercial Video Reel Campaign`,
    description: `Targeted advertisement video campaign based on: "${prompt || 'Product Promotion'}". High aesthetic production with vertical 9:16 cuts and authentic creator storytelling.`,
    requiredTools: ['Runway Gen-3 Alpha', 'Flux.1 Dev', 'Premiere Pro'],
    deliverablesCount: 3,
    budgetMin: 1000,
    budgetMax: 2000,
    aspectRatio: '9:16 Vertical'
  };
  res.json({ success: true, data: structuredResponse });
});

// In-memory Users Store
let users = [
  {
    id: 'user-brand-1',
    name: 'Sarah Jenkins',
    email: 'brand@acme.com',
    password: 'password123',
    role: 'brand',
    companyName: 'Kalyan Heritage Jewellers',
    category: 'Jewellery & Accessories',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    handle: 'sarah_kalyan'
  },
  {
    id: 'user-creator-1',
    name: 'Priya Sharma',
    email: 'creator@creatorconnect.ai',
    password: 'password123',
    role: 'creator',
    category: 'Jewellery & Accessories',
    specialization: 'Bridal Jewellery & Diamond Caustics',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    handle: 'priya_gem_studio'
  }
];

// Authentication Endpoints - Supports any email & password (auto-creates if new)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  let user = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    // Auto-create new user account on the fly for any entered email
    const rawUsername = cleanEmail.split('@')[0].replace(/[._-]+/g, ' ');
    const formattedName = rawUsername
      .split(' ')
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'Creator User';

    const isCreator = cleanEmail.includes('creator') || cleanEmail.includes('video') || cleanEmail.includes('studio');
    const role = isCreator ? 'creator' : 'brand';

    user = {
      id: `user-${Date.now()}`,
      name: formattedName,
      email: cleanEmail,
      password: password,
      role: role,
      companyName: role === 'brand' ? `${formattedName}'s Brand` : undefined,
      category: 'Jewellery & Accessories',
      specialization: role === 'creator' ? 'Fashion & Jewellery Reels' : undefined,
      avatarUrl: role === 'brand'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      handle: cleanEmail.split('@')[0],
      createdAt: new Date().toISOString()
    };
    users.push(user);
  } else {
    // If existing, accept the password entered
    user.password = password;
  }

  const { password: _, ...userWithoutPass } = user;
  res.json({
    success: true,
    message: 'Signed in successfully',
    token: `token-${user.id}`,
    user: userWithoutPass
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, companyName, category, specialization, platform } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists. Please log in.' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: role || 'brand',
    companyName: role === 'brand' ? (companyName || `${name}'s Brand`) : undefined,
    category: category || 'Jewellery & Accessories',
    specialization: role === 'creator' ? (specialization || 'Content Creation') : undefined,
    platform: platform || 'Instagram',
    handle: name.toLowerCase().replace(/\s+/g, '_'),
    avatarUrl: role === 'brand'
      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  };

  users.push(newUser);
  const { password: _, ...safeUser } = newUser;

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token: `demo-token-${newUser.id}`,
    user: safeUser
  });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'No account found with this email address.'
    });
  }

  res.json({
    success: true,
    message: `Password reset instructions have been dispatched to ${email}. (Demo password is: password123)`
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No authorization header provided.' });
  }

  const token = authHeader.replace('Bearer ', '');
  const user = users.find(u => `demo-token-${u.id}` === token) || users[0];
  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

app.listen(PORT, () => {
  console.log(`CreatorConnect AI API listening on port ${PORT}`);
});
