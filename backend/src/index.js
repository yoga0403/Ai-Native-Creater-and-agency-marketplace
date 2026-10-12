import express from 'express';
import cors from 'cors';
<<<<<<< HEAD
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import initSqlJs from 'sql.js';
import { supabaseAdmin, supabaseEnabled } from './supabase.js';
import * as supabaseStore from './supabaseStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'creatorconnect.db');
const SQL = await initSqlJs();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));

const CATEGORIES = [
  { id: 'cat-bridal', name: 'Bridal & Wedding', tagline: 'Royal bridal editors and heritage wedding visual storytellers', description: 'AI creators designing luxury wedding films, zardozi motion, and bridal editorial reels.', imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', defaultAspectRatio: '9:16', sampleConcepts: ['Royal bridal reel', 'Heritage invitation animation'], popularTools: ['Runway Gen-3', 'ComfyUI'], creatorCount: 24 },
  { id: 'cat-fashion', name: 'Clothing & Fashion', tagline: 'High-fashion lookbooks and virtual runways', description: 'Creatives building AI fashion films with fabric motion and seasonal styling.', imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', defaultAspectRatio: '9:16', sampleConcepts: ['AI runway edit', 'Luxury lookbook campaign'], popularTools: ['Flux.1 Dev', 'Runway Gen-3'], creatorCount: 38 },
  { id: 'cat-drinks', name: 'Drinks & Beverage', tagline: 'Liquid splash ads and beverage promos', description: 'High-speed beverage commercials focusing on carbonation, texture, and packaging.', imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80', defaultAspectRatio: '9:16', sampleConcepts: ['Energy can launch', 'Sparkling hydration visuals'], popularTools: ['Midjourney v6.1', 'Runway Gen-3'], creatorCount: 19 }
];

const SEED_CREATORS = [
  {
    id: 'creator-bridal-1',
    name: 'Aanya Kapoor',
    handle: 'aanya_bridal_ai',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    headline: 'Royal Bridal Fashion & Heirloom Jewellery AI Video Director',
    bio: 'Pioneering Indian couture wedding promotional videos for luxury bridal brands.',
    location: 'Mumbai & New Delhi',
    category: 'Bridal & Wedding',
    platforms: ['Instagram', 'YouTube', 'TikTok'],
    followerCount: '340K',
=======
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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

// 8 Business Categories
let categories = [
  {
    id: "cat-bridal",
    name: "Bridal & Wedding",
    tagline: "Royal Lehengas, Animated Invitations & Heritage Highlight Reels",
    description: "Connect with AI creators specializing in festive wedding cinematics, slow-motion bridal attire, and luxury heirloom jewellery promotions.",
    imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    defaultAspectRatio: "9:16",
    sampleConcepts: [
      "Royal Heritage Velvet Lehenga 30s Instagram Reel with Gold Zardozi Macro",
      "Cinematic Animated E-Invitation with Palace Architecture & Royal Courtyard",
      "Festive Sangeet Highlight Concept with Coherent Family Character Models"
    ],
    popularTools: ["Runway Gen-3", "Midjourney v6.1", "ComfyUI Fabric LoRA", "Topaz 4K"],
    creatorCount: 24,
  },
  {
    id: "cat-clothing",
    name: "Clothing & Fashion",
    tagline: "Virtual Runways, Cyber Streetwear & Lookbook Commercials",
    description: "Generative fashion directors producing high-framerate fabric movement, virtual mannequin drops, and seasonal fashion campaigns for Instagram & TikTok.",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    defaultAspectRatio: "9:16",
    sampleConcepts: [
      "Iridescent Silk Avant-Garde Runway Sequence with Dynamic Lighting",
      "Cyberpunk Streetwear Hoodies in Tokyo Rain with Neon Water Reflections",
      "Sustainable Linen Resort-wear Summer Collection Lookbook"
    ],
    popularTools: ["Flux.1 Dev", "Runway Gen-3", "Pika 2.1", "Kling AI"],
    creatorCount: 38,
  },
  {
    id: "cat-drinks",
    name: "Drinks & Beverage",
    tagline: "High-Speed Liquid Splashes, Chilled Cans & Bar Mixology",
    description: "CPG beverage specialists creating photorealistic carbonated splashes, frozen moisture droplets, and dynamic advertising teasers for energy drinks & spirits.",
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    defaultAspectRatio: "9:16",
    sampleConcepts: [
      "Citrus Sparkling Soda Can Bursting Through Ice Crystals in Macro Strobe",
      "Smoky Obsidian Bourbon Bottle with Swirling Amber Liquid in Zero Gravity",
      "Summer Iced Matcha Latte Swirling with Oat Milk Foam in Slow Motion"
    ],
    popularTools: ["Midjourney v6.1", "Runway Gen-3", "After Effects", "Topaz Video"],
    creatorCount: 19,
  },
  {
    id: "cat-jewellery",
    name: "Jewellery & Accessories",
    tagline: "Macro Diamond Facets, Gold Filigree & Luxury Timepieces",
    description: "Ultra-high-definition product lighting and refraction masters showcasing solitaires, Kundan polki necklaces, and fine chronographs with zero blur.",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    defaultAspectRatio: "1:1",
    sampleConcepts: [
      "Emerald Cut Solitaire Ring with Ray-Traced Light Caustics & Velvet Cushion",
      "24K Polki Choker Heirloom Set Shimmering Under Golden Temple Chandelier",
      "Tourbillon Chronograph Mechanism in Floating Exploded 3D Perspective"
    ],
    popularTools: ["Flux.1 Dev", "ControlNet Depth", "Luma Dream Machine", "Magnific AI"],
    creatorCount: 22,
  },
  {
    id: "cat-beauty",
    name: "Beauty & Skincare",
    tagline: "Botanical Serum Textures, Dewy Skin & Cosmetic Promos",
    description: "Beauty commercial directors focusing on velvety emulsion spreads, water droplet physics, clean cosmetic packaging, and skin transformation visuals.",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    defaultAspectRatio: "9:16",
    sampleConcepts: [
      "Hyaluronic Acid Serum Dropper with Morning Dew Drops on Lotus Petal",
      "Velvet Matte Crimson Lipstick Slicing Smoothly Across White Marble",
      "Golden Hour Hydration Glow Transformation on Minimalist Clean Skin"
    ],
    popularTools: ["Flux.1 Dev", "Runway Gen-3", "Midjourney v6.1", "Photoshop"],
    creatorCount: 31,
  },
  {
    id: "cat-food",
    name: "Food & Restaurants",
    tagline: "Sizzling Gourmet Plating, Artisan Bakeries & Culinary Reels",
    description: "Sensory food advertising directors producing mouthwatering grill sizzles, melting cheese pulls, and artisan bakery behind-the-scenes sequences.",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    defaultAspectRatio: "9:16",
    sampleConcepts: [
      "A5 Wagyu Ribeye Sizzling on Binchotan Charcoal Grill with Rising Smoke",
      "Molten Dark Chocolate Lava Cake Cut Open in 120fps Macro Close-Up",
      "Woodfired Neapolitan Pizza Pull with Stretched Mozzarella & Fresh Basil"
    ],
    popularTools: ["Pika 2.1", "Runway Gen-3", "Midjourney v6.1", "ElevenLabs VO"],
    creatorCount: 27,
  },
  {
    id: "cat-travel",
    name: "Travel & Lifestyle",
    tagline: "Cinematic Drone Flythroughs, Luxury Resorts & Wanderlust",
    description: "Virtual travel producers crafting sweeping 4K aerial landscape flythroughs, cliffside infinity pool vistas, and boutique resort promotional teasers.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    defaultAspectRatio: "16:9",
    sampleConcepts: [
      "Santorini Cliffside Infinity Pool at Sunset with Pink Bougainvillea Petals",
      "Aurora Borealis Glowing Over Glass Igloo Luxury Retreat in Lapland",
      "Private Wooden Catamaran Sailing Crystal Turquoise Waters in Amalfi"
    ],
    popularTools: ["Runway Gen-3 Alpha", "Midjourney v6.1", "Topaz 4K Video", "Luma"],
    creatorCount: 29,
  },
  {
    id: "cat-electronics",
    name: "Electronics & Tech",
    tagline: "Exploded Device CADs, Holographic Gadgets & Cyber Accents",
    description: "Hard-surface generative 3D designers specializing in smartphone chassis reveals, titanium smartwatches, and futuristic consumer electronics.",
    imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80",
    defaultAspectRatio: "16:9",
    sampleConcepts: [
      "Titanium Cybernetic Smartwatch Floating with Sapphire Bezel Glare",
      "Exploded Internal Circuitry of ANC Wireless Earbuds in Zero Gravity",
      "Next-Gen OLED Foldable Smartphone Opening in Cyber Obsidian Chamber"
    ],
    popularTools: ["Flux.1 Dev", "ComfyUI Multi-ControlNet", "Blender AI", "Magnific AI"],
    creatorCount: 35,
  },
];

let creators = [
  {
    id: "creator-bridal-1",
    name: "Aanya Kapoor",
    handle: "aanya_bridal_ai",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    coverUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    headline: "Royal Bridal Fashion & Heirloom Jewellery AI Video Director",
    bio: "Pioneering Indian couture wedding promotional videos. Trained custom LoRAs for zari embroidery, bridal lehenga drapes, and Kundan polki jewellery with temporal consistency across 30-second Reels.",
    location: "Mumbai & New Delhi",
    category: "Bridal & Wedding",
    platforms: ["Instagram", "YouTube", "TikTok"],
    followerCount: "340K",
>>>>>>> 29237b25e9a45eed65d183c29fe34dc9e5084877
    isVerified: true,
    rating: 4.99,
    reviewsCount: 68,
    completedBriefs: 54,
    hourlyRate: 95,
<<<<<<< HEAD
    tools: ['Runway Gen-3', 'ComfyUI Fabric LoRA', 'Midjourney v6.1', 'Topaz Video AI'],
    styles: ['Royal Heritage', 'Cinematic Slow-Motion', 'Festive Warmth'],
    badges: ['Bridal Fashion Lead', '100% Coherence Guarantee'],
    portfolio: [
      {
        id: 'p-bridal-1',
        title: 'Royal Crimson Velvet Lehenga Cinematic Reveal',
        mediaUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
        videoUrl: '/videos/bridal-couture.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
        duration: '0:30',
        mediaType: 'video',
        category: 'Bridal & Wedding',
        prompt: 'Cinematic 35mm bridal reveal in a palace courtyard.',
        model: 'Runway Gen-3 Alpha + Custom LoRA',
        tools: ['Runway Gen-3', 'ComfyUI', 'Topaz Video AI'],
        aspectRatio: '9:16',
        createdAt: 'Yesterday'
      }
    ]
  },
  {
    id: 'creator-fashion-1',
    name: 'Elena Rostova',
    handle: 'elena_fashion_vfx',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    headline: 'AI Fashion Week Director • Virtual Mannequins & Seasonal Lookbooks',
    bio: 'Directing generative fashion films for Paris and Milan fashion houses.',
    location: 'Paris & London',
    category: 'Clothing & Fashion',
    platforms: ['Instagram', 'TikTok', 'YouTube'],
    followerCount: '520K',
=======
    tools: ["Runway Gen-3", "ComfyUI Fabric LoRA", "Midjourney v6.1", "Topaz Video AI"],
    styles: ["Royal Heritage", "Cinematic Slow-Motion", "Festive Warmth"],
    badges: ["Bridal Fashion Lead", "100% Coherence Guarantee", "Top Rated 2026"],
    portfolio: [
      {
        id: "p-bridal-1",
        title: "Royal Crimson Velvet Lehenga Cinematic Reveal",
        mediaUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "/videos/bridal-couture.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
        duration: "0:30",
        mediaType: "video",
        category: "Bridal & Wedding",
        prompt: "Cinematic 35mm slow motion tracking shot of an Indian bride twirling in a hand-embroidered royal crimson velvet lehenga inside a candlelit Jaipur palace courtyard, intricate gold zardozi embroidery shimmering, slow motion silk veil drape, warm golden hour tones, anamorphic 8k.",
        negativePrompt: "jitter, warped hands, distorted embroidery, cartoonish, low resolution",
        model: "Runway Gen-3 Alpha + Custom LoRA",
        seed: "982310492",
        sampler: "Motion Flow Engine v3",
        workflow: "Runway Gen-3 + ComfyUI Zardozi Checkpoint + Topaz 4K 60fps",
        tools: ["Runway Gen-3", "ComfyUI", "Topaz Video AI"],
        aspectRatio: "9:16",
        createdAt: "Yesterday",
      },
      {
        id: "p-bridal-2",
        title: "Heritage Polki Choker Necklace & Emerald Highlights",
        mediaUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "/videos/jewelry-macro.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
        duration: "0:25",
        mediaType: "video",
        category: "Bridal & Wedding",
        prompt: "Extreme macro slow-motion camera pan across uncut raw diamonds and Columbian emeralds on an antique 24k gold bridal necklace, candle light caustics refracting through jewels, studio black velvet backdrop.",
        model: "Flux.1 Dev + ControlNet",
        seed: "441029193",
        tools: ["Flux.1 Dev", "Runway Gen-3", "Magnific AI"],
        aspectRatio: "1:1",
        createdAt: "3 days ago",
      }
    ],
  },
  {
    id: "creator-fashion-1",
    name: "Elena Rostova",
    handle: "elena_fashion_vfx",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    coverUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    headline: "AI Fashion Week Director • Virtual Mannequins & Seasonal Lookbooks",
    bio: "Directing generative fashion films for Paris and Milan fashion houses. Specialist in textile physics, liquid organza fabrics, and hyper-realistic digital avatars with consistent wardrobe across scenes.",
    location: "Paris & London",
    category: "Clothing & Fashion",
    platforms: ["Instagram", "TikTok", "YouTube"],
    followerCount: "520K",
>>>>>>> 29237b25e9a45eed65d183c29fe34dc9e5084877
    isVerified: true,
    rating: 5.0,
    reviewsCount: 82,
    completedBriefs: 64,
    hourlyRate: 120,
<<<<<<< HEAD
    tools: ['Flux.1 Dev', 'Runway Gen-3', 'Kling AI', 'Pika 2.1'],
    styles: ['Haute Couture', 'Cyber Streetwear', 'Avant-Garde'],
    badges: ['Fashion Innovation Award', 'Vogue Featured'],
    portfolio: [{
      id: 'p-fashion-1',
      title: 'Metamorphosis: Iridescent Wing Silk Gown',
      mediaUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      videoUrl: '/videos/fashion-runway.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      duration: '0:28',
      mediaType: 'video',
      category: 'Clothing & Fashion',
      prompt: 'High-fashion runway featuring a deeply layered iridescent gown.',
      model: 'Flux.1 Dev + Runway Gen-3',
      tools: ['Flux.1', 'Runway Gen-3', 'Premiere Pro'],
      aspectRatio: '9:16',
      createdAt: '2 days ago'
    }]
  }
];

const SEED_BRIEFS = [
  {
    id: 'brief-bridal-1',
    brandName: 'Kalyan Heritage Silks',
    brandLogo: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=200&q=80',
    brandIndustry: 'Bridal & Wedding Fashion',
    title: '3x 30s Royal Heritage Bridal Lehenga Reels for Festive Launch',
    description: 'Seeking a luxury AI video creator for 3 festive reels with palace textures and bridal motion.',
    category: 'Bridal & Wedding',
    budgetMin: 1200,
    budgetMax: 2200,
    currency: 'USD',
    deadline: 'Nov 15, 2026',
    requiredTools: ['Runway Gen-3', 'ComfyUI Fabric LoRA'],
    deliverablesCount: 3,
    aspectRatio: '9:16 Vertical',
    resolution: '4K (1080x1920) 60fps',
    status: 'open',
    proposalsCount: 14,
    createdAt: '1 day ago',
    featured: true,
    userId: 'user-brand-1'
  },
  {
    id: 'brief-drinks-1',
    brandName: 'Velox Energy Drink',
    brandLogo: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=200&q=80',
    brandIndustry: 'Food & Beverage',
    title: 'Hyper-Dynamic Action Visuals with Liquid Splashes & Neon Light',
    description: 'Looking for an AI video artist to generate punchy 15s product ads for a new energy launch.',
    category: 'Drinks & Beverage',
    budgetMin: 900,
    budgetMax: 1600,
    currency: 'USD',
    deadline: 'Nov 20, 2026',
    requiredTools: ['Runway Gen-3', 'Midjourney v6.1'],
    deliverablesCount: 4,
    aspectRatio: '9:16 & 16:9',
    resolution: '4K UHD 60fps',
    status: 'open',
    proposalsCount: 9,
    createdAt: '2 days ago',
    featured: true,
    userId: 'user-brand-1'
  }
];

function ensureDatabase() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    const db = new SQL.Database();
    db.run(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        role TEXT NOT NULL,
        handle TEXT,
        company_name TEXT,
        avatar_url TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    db.run(`
      CREATE TABLE creator_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        name TEXT NOT NULL,
        handle TEXT,
        avatar_url TEXT,
        cover_url TEXT,
        headline TEXT,
        bio TEXT,
        location TEXT,
        category TEXT,
        platforms TEXT,
        follower_count TEXT,
        is_verified INTEGER DEFAULT 0,
        rating REAL,
        reviews_count INTEGER,
        completed_briefs INTEGER,
        hourly_rate INTEGER,
        tools TEXT,
        styles TEXT,
        badges TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `);

    db.run(`
      CREATE TABLE portfolio_items (
        id TEXT PRIMARY KEY,
        creator_id TEXT NOT NULL,
        title TEXT NOT NULL,
        media_url TEXT,
        video_url TEXT,
        thumbnail_url TEXT,
        duration TEXT,
        media_type TEXT,
        category TEXT,
        prompt TEXT,
        model TEXT,
        tools TEXT,
        aspect_ratio TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(creator_id) REFERENCES creator_profiles(id)
      );
    `);

    db.run(`
      CREATE TABLE brand_briefs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        brand_name TEXT NOT NULL,
        brand_logo TEXT,
        brand_industry TEXT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT,
        budget_min INTEGER,
        budget_max INTEGER,
        currency TEXT,
        deadline TEXT,
        required_tools TEXT,
        deliverables_count INTEGER,
        aspect_ratio TEXT,
        resolution TEXT,
        status TEXT,
        proposals_count INTEGER DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        featured INTEGER DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `);

    db.run(`
      CREATE TABLE proposals (
        id TEXT PRIMARY KEY,
        brief_id TEXT NOT NULL,
        creator_id TEXT NOT NULL,
        proposed_amount INTEGER,
        currency TEXT,
        estimated_days INTEGER,
        message TEXT,
        portfolio_items TEXT,
        status TEXT NOT NULL DEFAULT 'submitted',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(brief_id) REFERENCES brand_briefs(id)
      );
    `);

    db.run(`
      CREATE TABLE verification_records (
        id TEXT PRIMARY KEY,
        creator_id TEXT NOT NULL,
        label TEXT NOT NULL,
        status TEXT NOT NULL,
        evidence_ref TEXT,
        reviewer TEXT,
        verified_at TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(creator_id) REFERENCES creator_profiles(id)
      );
    `);

    const demoUser1 = {
      id: 'user-brand-1',
      name: 'Sarah Jenkins',
      email: 'brand@acme.com',
      password: 'password123',
      role: 'brand',
      handle: 'sarah_acme',
      company_name: 'Acme Luxury Brands',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    };

    const demoUser2 = {
      id: 'user-creator-1',
      name: 'Aanya Kapoor',
      email: 'creator@creatorconnect.ai',
      password: 'password123',
      role: 'creator',
      handle: 'aanya_bridal_ai',
      company_name: null,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    };

    [demoUser1, demoUser2].forEach((user) => {
      const { hash, salt } = hashPassword(user.password);
      db.run(
        'INSERT INTO users (id, name, email, password_hash, password_salt, role, handle, company_name, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [user.id, user.name, user.email, hash, salt, user.role, user.handle, user.company_name, user.avatar_url]
      );
    });

    SEED_CREATORS.forEach((creator) => {
      db.run(
        'INSERT INTO creator_profiles (id, user_id, name, handle, avatar_url, cover_url, headline, bio, location, category, platforms, follower_count, is_verified, rating, reviews_count, completed_briefs, hourly_rate, tools, styles, badges) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          creator.id,
          creator.id.includes('creator') ? 'user-creator-1' : 'user-brand-1',
          creator.name,
          creator.handle,
          creator.avatarUrl,
          creator.coverUrl,
          creator.headline,
          creator.bio,
          creator.location,
          creator.category,
          JSON.stringify(creator.platforms),
          creator.followerCount,
          creator.isVerified ? 1 : 0,
          creator.rating,
          creator.reviewsCount,
          creator.completedBriefs,
          creator.hourlyRate,
          JSON.stringify(creator.tools),
          JSON.stringify(creator.styles),
          JSON.stringify(creator.badges)
        ]
      );

      creator.portfolio.forEach((item) => {
        db.run(
          'INSERT INTO portfolio_items (id, creator_id, title, media_url, video_url, thumbnail_url, duration, media_type, category, prompt, model, tools, aspect_ratio, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            item.id,
            creator.id,
            item.title,
            item.mediaUrl,
            item.videoUrl,
            item.thumbnailUrl,
            item.duration,
            item.mediaType,
            item.category,
            item.prompt ?? '',
            item.model ?? '',
            JSON.stringify(item.tools ?? []),
            item.aspectRatio ?? '9:16',
            item.createdAt ?? new Date().toISOString()
          ]
        );
      });
    });

    SEED_BRIEFS.forEach((brief) => {
      db.run(
        'INSERT INTO brand_briefs (id, user_id, brand_name, brand_logo, brand_industry, title, description, category, budget_min, budget_max, currency, deadline, required_tools, deliverables_count, aspect_ratio, resolution, status, proposals_count, created_at, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          brief.id,
          brief.userId,
          brief.brandName,
          brief.brandLogo,
          brief.brandIndustry,
          brief.title,
          brief.description,
          brief.category,
          brief.budgetMin,
          brief.budgetMax,
          brief.currency,
          brief.deadline,
          JSON.stringify(brief.requiredTools),
          brief.deliverablesCount,
          brief.aspectRatio,
          brief.resolution,
          brief.status,
          brief.proposalsCount,
          brief.createdAt,
          brief.featured ? 1 : 0
        ]
      );
    });

    fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
    return db;
  }

  const fileBuffer = fs.readFileSync(DB_PATH);
  return new SQL.Database(new Uint8Array(fileBuffer));
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function normalizeRow(row) {
  const safe = { ...row };
  Object.keys(safe).forEach((key) => {
    if (typeof safe[key] === 'string' && (safe[key].startsWith('[') || safe[key].startsWith('{'))) {
      try {
        safe[key] = JSON.parse(safe[key]);
      } catch {
        // ignore parse errors for plain strings
      }
    }
    if (safe[key] === 1 || safe[key] === 0) {
      safe[key] = Number(safe[key]);
    }
  });
  return safe;
}

function saveDatabase(db) {
  fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
}

function fetchUsers(db) {
  const rows = db.exec('SELECT * FROM users ORDER BY created_at DESC');
  return rows.length ? rows[0].values.map((values) => {
    const entry = rows[0].columns.reduce((acc, col, idx) => {
      acc[col] = values[idx];
      return acc;
    }, {});
    return normalizeRow(entry);
  }) : [];
}

function fetchCreatorProfiles(db) {
  const rows = db.exec('SELECT * FROM creator_profiles ORDER BY created_at DESC');
  if (!rows.length) return [];
  return rows[0].values.map((values) => {
    const entry = rows[0].columns.reduce((acc, col, idx) => {
      acc[col] = values[idx];
      return acc;
    }, {});
    return normalizeRow(entry);
  });
}

function fetchPortfolioItems(db, creatorId) {
  const rows = db.exec('SELECT * FROM portfolio_items WHERE creator_id = ? ORDER BY created_at DESC', [creatorId]);
  if (!rows.length) return [];
  return rows[0].values.map((values) => {
    const entry = rows[0].columns.reduce((acc, col, idx) => {
      acc[col] = values[idx];
      return acc;
    }, {});
    return normalizeRow(entry);
  });
}

function fetchBriefs(db) {
  const rows = db.exec('SELECT * FROM brand_briefs ORDER BY created_at DESC');
  if (!rows.length) return [];
  return rows[0].values.map((values) => {
    const entry = rows[0].columns.reduce((acc, col, idx) => {
      acc[col] = values[idx];
      return acc;
    }, {});
    return normalizeRow(entry);
  });
}

function fetchProposals(db) {
  const rows = db.exec('SELECT * FROM proposals ORDER BY created_at DESC');
  if (!rows.length) return [];
  return rows[0].values.map((values) => {
    const entry = rows[0].columns.reduce((acc, col, idx) => {
      acc[col] = values[idx];
      return acc;
    }, {});
    return normalizeRow(entry);
  });
}

const db = supabaseEnabled ? null : ensureDatabase();

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function getUserByToken(token) {
  if (!token || !token.startsWith('demo-token-')) return null;
  const userId = token.replace(/^demo-token-/, '');
  const rows = db.exec('SELECT * FROM users WHERE id = ?', [userId]);
  if (!rows.length || !rows[0].values.length) return null;
  const user = rows[0].columns.reduce((acc, col, index) => {
    acc[col] = rows[0].values[0][index];
    return acc;
  }, {});
  const sanitized = normalizeRow(user);
  delete sanitized.password_hash;
  delete sanitized.password_salt;
  return sanitized;
}

async function authenticate(req) {
  const authHeader = req.headers.authorization || req.headers['x-auth-token'];
  if (!authHeader) return null;
  const token = String(authHeader).replace(/^Bearer\s+/i, '').trim();
  if (supabaseEnabled) return supabaseStore.authenticateSupabaseToken(token);
  return getUserByToken(token);
}

const requireAuth = asyncRoute(async (req, res, next) => {
  const user = await authenticate(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  req.user = user;
  next();
});

function requireRole(req, res, next, allowedRoles) {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'You do not have permission for this action.' });
  }
  next();
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', service: 'CreatorConnect AI API', timestamp: new Date().toISOString() });
});

app.get('/api/categories', (req, res) => {
  res.json({ success: true, count: CATEGORIES.length, data: CATEGORIES });
});

app.get('/api/creators', asyncRoute(async (req, res) => {
  const { tool, category, search, platform } = req.query;
  const items = supabaseEnabled
    ? await supabaseStore.getSupabaseCreators()
    : fetchCreatorProfiles(db).map((creator) => ({
        ...creator,
        portfolio: fetchPortfolioItems(db, creator.id),
      }));

  let results = items;
  const q = search ? String(search).trim().toLowerCase() : '';
  if (q) {
    results = results.filter((creator) => {
      const text = [creator.name, creator.headline, creator.category, ...(creator.tools || []), ...(creator.styles || [])].join(' ').toLowerCase();
      return text.includes(q);
    });
  }

  if (tool && tool !== 'All') {
    results = results.filter((creator) => (creator.tools || []).some((toolName) => toolName.toLowerCase().includes(String(tool).toLowerCase())));
  }

  if (category && category !== 'All') {
    results = results.filter((creator) => {
      const categoryText = `${creator.category} ${(creator.portfolio || []).map((item) => item.category).join(' ')}`.toLowerCase();
      return categoryText.includes(String(category).toLowerCase());
    });
  }

  if (platform && platform !== 'All') {
    results = results.filter((creator) => (creator.platforms || []).some((platformName) => platformName.toLowerCase() === String(platform).toLowerCase()));
  }

  res.json({ success: true, count: results.length, data: results });
}));

app.post('/api/portfolio', requireAuth, asyncRoute(async (req, res) => {
  const { creatorId, title, mediaUrl, videoUrl, thumbnailUrl, duration, category, prompt, model, tools, aspectRatio } = req.body;
  if (supabaseEnabled) {
    const { data: creator, error } = await supabaseAdmin
      .from('creator_profiles')
      .select('id, owner_user_id')
      .eq('id', creatorId)
      .maybeSingle();
    if (error) throw error;
    if (!creator) return res.status(404).json({ success: false, message: 'Creator not found.' });
    if (creator.owner_user_id && creator.owner_user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You cannot edit another creator portfolio.' });
    }

    const itemId = `p-${Date.now()}`;
    const data = await supabaseStore.insertSupabasePortfolioItem({
      id: itemId,
      creator_id: creatorId,
      title: title || 'New AI Portfolio Asset',
      media_url: mediaUrl || thumbnailUrl || '',
      video_url: videoUrl || '',
      thumbnail_url: thumbnailUrl || '',
      duration: duration || '0:30',
      media_type: videoUrl ? 'video' : 'image',
      category: category || 'General',
      prompt: prompt || 'Commercial AI visual asset generation',
      model: model || 'Runway Gen-3 / Flux.1',
      tools: tools || ['Runway Gen-3', 'Flux.1'],
      aspect_ratio: aspectRatio || '9:16',
    });
    return res.status(201).json({ success: true, message: 'Portfolio asset added.', data });
  }

  const creator = db.exec('SELECT * FROM creator_profiles WHERE id = ?', [creatorId]);
  if (!creator.length || !creator[0].values.length) {
    return res.status(404).json({ success: false, message: 'Creator not found.' });
  }

  const itemId = `p-${Date.now()}`;
  const mediaType = videoUrl ? 'video' : 'image';
  db.run(
    'INSERT INTO portfolio_items (id, creator_id, title, media_url, video_url, thumbnail_url, duration, media_type, category, prompt, model, tools, aspect_ratio, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      itemId,
      creatorId,
      title || 'New AI Portfolio Asset',
      mediaUrl || thumbnailUrl || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      videoUrl || '',
      thumbnailUrl || '',
      duration || '0:30',
      mediaType,
      category || 'General',
      prompt || 'Commercial AI visual asset generation',
      model || 'Runway Gen-3 / Flux.1',
      JSON.stringify(tools || ['Runway Gen-3', 'Flux.1']),
      aspectRatio || '9:16',
      new Date().toISOString()
    ]
  );

  saveDatabase(db);
  res.status(201).json({ success: true, message: 'Portfolio asset added.', data: { id: itemId } });
}));

app.get('/api/briefs', asyncRoute(async (req, res) => {
  if (supabaseEnabled) {
    const data = await supabaseStore.getSupabaseBriefs();
    return res.json({ success: true, count: data.length, data });
  }
  const briefs = fetchBriefs(db).map((brief) => ({ ...brief, requiredTools: Array.isArray(brief.required_tools) ? brief.required_tools : JSON.parse(brief.required_tools || '[]') }));
  res.json({ success: true, count: briefs.length, data: briefs });
}));

app.post('/api/briefs', requireAuth, asyncRoute(async (req, res) => {
  const { title, description, category, budgetMin, budgetMax, brandName, brandLogo, brandIndustry, deadline, requiredTools, deliverablesCount, aspectRatio, resolution, status } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description are required.' });
  }

  const briefId = `brief-${Date.now()}`;
  const payload = {
    id: briefId,
    user_id: req.user.id,
    brand_name: brandName || req.user.company_name || 'Acme Brand Studio',
    brand_logo: brandLogo || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=200&q=80',
    brand_industry: brandIndustry || 'Creative Agency',
    title,
    description,
    category: category || 'Advertising & Commercial',
    budget_min: Number(budgetMin || 500),
    budget_max: Number(budgetMax || 1200),
    currency: 'USD',
    deadline: deadline || 'TBD',
    required_tools: JSON.stringify(Array.isArray(requiredTools) ? requiredTools : ['Flux.1', 'ComfyUI']),
    deliverables_count: Number(deliverablesCount || 3),
    aspect_ratio: aspectRatio || '16:9',
    resolution: resolution || '4K',
    status: status || 'open',
    proposals_count: 0,
    created_at: new Date().toISOString(),
    featured: 1
  };

  if (supabaseEnabled) {
    const data = await supabaseStore.insertSupabaseBrief({
      ...payload,
      required_tools: JSON.parse(payload.required_tools),
      featured: true,
    });
    return res.status(201).json({ success: true, message: 'Brief saved successfully.', data });
  }

  db.run(
    'INSERT INTO brand_briefs (id, user_id, brand_name, brand_logo, brand_industry, title, description, category, budget_min, budget_max, currency, deadline, required_tools, deliverables_count, aspect_ratio, resolution, status, proposals_count, created_at, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [payload.id, payload.user_id, payload.brand_name, payload.brand_logo, payload.brand_industry, payload.title, payload.description, payload.category, payload.budget_min, payload.budget_max, payload.currency, payload.deadline, payload.required_tools, payload.deliverables_count, payload.aspect_ratio, payload.resolution, payload.status, payload.proposals_count, payload.created_at, payload.featured]
  );

  saveDatabase(db);
  res.status(201).json({ success: true, message: 'Brief saved successfully.', data: { ...payload, requiredTools: JSON.parse(payload.required_tools) } });
}));

app.post('/api/proposals', requireAuth, asyncRoute(async (req, res) => {
  const { briefId, proposedAmount, estimatedDays, message, portfolioItems } = req.body;

  if (!briefId || !proposedAmount) {
    return res.status(400).json({ success: false, message: 'Brief and proposed amount are required.' });
  }

  if (supabaseEnabled) {
    const { data: brief, error } = await supabaseAdmin
      .from('brand_briefs')
      .select('id')
      .eq('id', briefId)
      .maybeSingle();
    if (error) throw error;
    if (!brief) return res.status(404).json({ success: false, message: 'Brief not found.' });

    const data = await supabaseStore.insertSupabaseProposal({
      id: `prop-${Date.now()}`,
      brief_id: briefId,
      creator_user_id: req.user.id,
      proposed_amount: Number(proposedAmount),
      currency: 'USD',
      estimated_days: Number(estimatedDays || 7),
      message: message || '',
      portfolio_items: Array.isArray(portfolioItems) ? portfolioItems : [],
      status: 'submitted',
    });
    return res.status(201).json({
      success: true,
      message: 'Proposal successfully submitted to brand escrow queue.',
      data: {
        id: data.id,
        briefId: data.brief_id,
        proposedAmount: data.proposed_amount,
        estimatedDays: data.estimated_days,
        message: data.message,
        status: data.status,
      },
    });
  }

  const briefRows = db.exec('SELECT * FROM brand_briefs WHERE id = ?', [briefId]);
  if (!briefRows.length || !briefRows[0].values.length) {
    return res.status(404).json({ success: false, message: 'Brief not found.' });
  }

  const proposalId = `prop-${Date.now()}`;
  db.run(
    'INSERT INTO proposals (id, brief_id, creator_id, proposed_amount, currency, estimated_days, message, portfolio_items, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [proposalId, briefId, req.user.id, Number(proposedAmount), 'USD', Number(estimatedDays || 7), message || '', JSON.stringify(Array.isArray(portfolioItems) ? portfolioItems : []), 'submitted', new Date().toISOString()]
  );

  const current = briefRows[0].values[0];
  const briefRecord = briefRows[0].columns.reduce((acc, col, index) => {
    acc[col] = current[index];
    return acc;
  }, {});
  const nextCount = Number(briefRecord.proposals_count || 0) + 1;
  db.run('UPDATE brand_briefs SET proposals_count = ? WHERE id = ?', [nextCount, briefId]);
  saveDatabase(db);

  res.status(201).json({ success: true, message: 'Proposal successfully submitted to brand escrow queue.', data: { id: proposalId, briefId, proposedAmount, estimatedDays, message, status: 'submitted' } });
}));

app.get('/api/projects/:id', (req, res) => {
  res.json({ success: true, data: { id: req.params.id, briefTitle: 'Royal Heritage Bridal Lehenga 30s Campaign', brandName: 'Kalyan Heritage Silks', creatorName: 'Aanya Kapoor', totalBudget: 1800, status: 'active', milestones: [{ id: 'm-1', title: 'Milestone 1', description: 'Deliver the initial proof', amount: 600, dueDate: 'Oct 14, 2026', status: 'approved' }] } });
});

app.patch('/api/projects/:id/milestones/:milestoneId', requireAuth, (req, res) => {
  const { status, feedback } = req.body;
  res.json({ success: true, message: 'Milestone updated.', data: { id: req.params.milestoneId, status, feedback } });
});

app.post('/api/ai/copilot', (req, res) => {
  const rawPrompt = String(req.body?.prompt || '').trim();
  if (!rawPrompt) {
    return res.status(400).json({ success: false, message: 'A rough campaign idea is required.' });
  }

  const normalized = rawPrompt.toLowerCase();
  const contentType = /video|reel|ad|commercial|product/.test(normalized) ? 'Short-form commercial video' : 'Social content package';
  const style = /luxury|premium|high-end/.test(normalized) ? 'premium cinematic' : /youth|playful|vibrant/.test(normalized) ? 'bold lifestyle' : 'clean editorial';
  const platform = /instagram|tiktok/.test(normalized) ? 'Instagram Reels / TikTok' : /youtube/.test(normalized) ? 'YouTube + Shorts' : 'Cross-platform social';
  const tools = /product|tech|gadget/.test(normalized) ? ['Runway Gen-3', 'Flux.1 Dev', 'ComfyUI'] : /beauty|fashion/.test(normalized) ? ['Flux.1 Dev', 'Kling AI', 'Runway Gen-3'] : ['Runway Gen-3 Alpha', 'Flux.1 Dev', 'Topaz Video'];

  const result = {
    title: `${contentType} for ${rawPrompt.slice(0, 24).trim() || 'Brand campaign'}`,
    description: `Create a ${style} campaign shaped around the idea: "${rawPrompt}". Focus on a concise story arc, attention-grabbing hook, and motion-friendly product visuals across ${platform}.`,
    requiredTools: tools,
    deliverablesCount: 3,
    budgetMin: 900,
    budgetMax: 2200,
    aspectRatio: '9:16 vertical + 16:9 master',
    promptFormula: `${style} marketing visual, hero product in focus, strong lighting, consistent motion, social-ready editing, polished transitions`,
    demoMode: !process.env.OPENAI_API_KEY,
    notes: process.env.OPENAI_API_KEY ? 'AI generation is configured via environment variables.' : 'No AI API key detected. This response is a labelled demo-mode brief generation.'
  };

  res.json({ success: true, data: result });
});

app.post('/api/auth/login', asyncRoute(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  if (supabaseEnabled) {
    try {
      const result = await supabaseStore.loginSupabaseUser(String(email).trim().toLowerCase(), String(password));
      return res.json({ success: true, message: 'Signed in successfully.', ...result });
    } catch (error) {
      if (error.status === 400 || error.status === 401) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
      throw error;
    }
  }

  const rows = db.exec('SELECT * FROM users WHERE email = ?', [String(email).trim().toLowerCase()]);
  if (!rows.length || !rows[0].values.length) {
    return res.status(401).json({ success: false, message: 'No account found for this email.' });
  }

  const userRow = rows[0].columns.reduce((acc, col, index) => {
    acc[col] = rows[0].values[0][index];
    return acc;
  }, {});
  const storedHash = userRow.password_hash;
  const storedSalt = userRow.password_salt;
  const computed = crypto.pbkdf2Sync(String(password), storedSalt, 100000, 64, 'sha512').toString('hex');

  if (computed !== storedHash) {
    return res.status(401).json({ success: false, message: 'Incorrect password.' });
  }

  const user = normalizeRow(userRow);
  delete user.password_hash;
  delete user.password_salt;
  res.json({ success: true, message: 'Signed in successfully.', token: `demo-token-${user.id}`, user });
}));

app.post('/api/auth/forgot-password', asyncRoute(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  if (supabaseEnabled) {
    await supabaseStore.sendSupabasePasswordReset(email);
    return res.json({ success: true, message: 'If this email is registered, password reset instructions will be sent.' });
  }

  const rows = db.exec('SELECT id FROM users WHERE email = ?', [String(email).trim().toLowerCase()]);
  if (!rows.length || !rows[0].values.length) {
    return res.status(404).json({ success: false, message: 'No account found with this email address.' });
  }

  res.json({ success: true, message: 'Password reset link sent. Demo password remains: password123' });
}));

app.post('/api/auth/register', asyncRoute(async (req, res) => {
  const { name, email, password, role, handle, companyName } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  if (supabaseEnabled) {
    let result;
    try {
      result = await supabaseStore.registerSupabaseUser({ name, email, password, role, handle, companyName });
    } catch (error) {
      if (error.status === 400 || error.status === 422) {
        return res.status(409).json({ success: false, message: error.message || 'Unable to create this account.' });
      }
      throw error;
    }

    if (result.requiresEmailConfirmation) {
      return res.status(202).json({
        success: true,
        requiresEmailConfirmation: true,
        message: 'Account created. Confirm your email address, then sign in.',
        user: result.user,
      });
    }

    return res.status(201).json({ success: true, message: 'Account created successfully.', ...result });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = db.exec('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
  if (existing.length && existing[0].values.length) {
    return res.status(409).json({ success: false, message: 'An account already exists with that email.' });
  }

  const userId = `user-${Date.now()}`;
  const passwordSpec = hashPassword(String(password));
  db.run(
    'INSERT INTO users (id, name, email, password_hash, password_salt, role, handle, company_name, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      userId,
      String(name).trim(),
      normalizedEmail,
      passwordSpec.hash,
      passwordSpec.salt,
      role || 'brand',
      handle || String(name).trim().toLowerCase().replace(/\s+/g, '_'),
      companyName || (role === 'brand' ? 'Creative Studio' : null),
      role === 'brand'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    ]
  );

  const user = {
    id: userId,
    name: String(name).trim(),
    email: normalizedEmail,
    role: role || 'brand',
    handle: handle || String(name).trim().toLowerCase().replace(/\s+/g, '_'),
    company_name: companyName || (role === 'brand' ? 'Creative Studio' : null),
    avatar_url: role === 'brand' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  };

  saveDatabase(db);
  res.status(201).json({ success: true, message: 'Account created successfully.', token: `demo-token-${userId}`, user });
}));

app.get('/api/auth/me', requireAuth, (req, res) => res.json({ success: true, user: req.user }));

app.use((error, req, res, next) => {
  console.error('API request failed:', error.message);
  res.status(500).json({ success: false, message: 'The server could not complete this request.' });
});

app.listen(PORT, () => {
  console.log(`CreatorConnect AI API running on http://localhost:${PORT} (${supabaseEnabled ? 'Supabase' : 'local SQLite'} storage)`);
=======
    tools: ["Flux.1 Dev", "Runway Gen-3", "Kling AI", "Pika 2.1", "Topaz Video"],
    styles: ["Haute Couture", "Cyber Streetwear", "Avant-Garde"],
    badges: ["Fashion Innovation Award", "Vogue Featured", "Runway Master"],
    portfolio: [
      {
        id: "p-fashion-1",
        title: "Metamorphosis: Iridescent Wing Silk Gown",
        mediaUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "/videos/fashion-runway.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
        duration: "0:28",
        mediaType: "video",
        category: "Clothing & Fashion",
        prompt: "High fashion editorial runway tracking shot of an ethereal model walking on water mirror runway, wearing an iridescent holographic silk gown that flutters with butterfly wing physics, Vogue Italia style, 8k crisp texture.",
        model: "Flux.1 Dev + Runway Gen-3",
        seed: "77291048",
        tools: ["Flux.1", "Runway Gen-3", "Premiere Pro"],
        aspectRatio: "9:16",
        createdAt: "2 days ago",
      }
    ],
  },
  {
    id: "creator-drinks-1",
    name: "Julian Cruz",
    handle: "cruz_beverage_ai",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    coverUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80",
    headline: "Commercial Beverage VFX Director • Liquid Splashes & Chilled Cans",
    bio: "Engineering frozen water droplet dynamics, condensation trails, carbonation fizz, and high-speed splash commercials for global beverage brands.",
    location: "Los Angeles & Mexico City",
    category: "Drinks & Beverage",
    platforms: ["Instagram", "YouTube", "Facebook"],
    followerCount: "280K",
    isVerified: true,
    rating: 4.97,
    reviewsCount: 49,
    completedBriefs: 42,
    hourlyRate: 105,
    tools: ["Midjourney v6.1", "Runway Gen-3", "After Effects", "Topaz Video AI"],
    styles: ["High-Speed Frozen Motion", "Vibrant Commercial", "Macro Droplets"],
    badges: ["Beverage Specialist", "Label Fidelity Guarantee"],
    portfolio: [
      {
        id: "p-drinks-1",
        title: "Electric Lime Sparkling Can Splash Explosion",
        mediaUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "/videos/drinks-burst.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
        duration: "0:20",
        mediaType: "video",
        category: "Drinks & Beverage",
        prompt: "Ultra slow motion 1000fps commercial shot of a condensation-dripping electric green soda can bursting through crystal clear ice water with flying lime wedges and sparkling fizz, studio strobe lighting, razor sharp.",
        model: "Midjourney v6.1 + Runway Gen-3",
        seed: "99140281",
        tools: ["Midjourney v6.1", "Runway Gen-3", "After Effects"],
        aspectRatio: "9:16",
        createdAt: "3 days ago",
      }
    ],
  },
  {
    id: "creator-jewellery-1",
    name: "Priya & Dev",
    handle: "priya_gem_studio",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    coverUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
    headline: "Fine Jewellery & Luxury Timepiece Photorealistic CGI Director",
    bio: "Creating high-refraction gemstones, flawless prongs, and 24K filigree animations for Cartier, Tanishq, and independent bespoke jewellery designers.",
    location: "Jaipur & Dubai",
    category: "Jewellery & Accessories",
    platforms: ["Instagram", "Facebook", "YouTube"],
    followerCount: "195K",
    isVerified: true,
    rating: 4.96,
    reviewsCount: 41,
    completedBriefs: 36,
    hourlyRate: 90,
    tools: ["Flux.1 Dev", "ControlNet Canny", "Luma Dream Machine", "Magnific AI"],
    styles: ["Macro Light Caustics", "Luxury Velvet", "Ultra-High Refraction"],
    badges: ["Gemological Fidelity", "Macro Perfectionist"],
    portfolio: [
      {
        id: "p-jewel-1",
        title: "Cushion Cut Solitaire Diamond Floating Sparkle",
        mediaUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "/videos/jewelry-macro.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
        duration: "0:25",
        mediaType: "video",
        category: "Jewellery & Accessories",
        prompt: "Ultra-macro 8k slow motion turntable of a flawless 5-carat cushion cut diamond ring on a platinum micro-pave band, rainbow dispersion light refractions scattering across dark textured slate.",
        model: "Flux.1 Dev + ControlNet",
        seed: "88410294",
        tools: ["Flux.1", "Luma Dream Machine"],
        aspectRatio: "1:1",
        createdAt: "1 day ago",
      }
    ],
  },
  {
    id: "creator-electronics-1",
    name: "Marcus Vance",
    handle: "vance_ai",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    coverUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80",
    headline: "Senior AI Hard-Surface Tech Director • Gadget CAD & Cyber Visuals",
    bio: "Engineering character-consistent gadget assets, exploded electronics animations, and cybernetic hardware reveals for Sony, Samsung, and top hardware startups.",
    location: "Tokyo & San Francisco",
    category: "Electronics & Tech",
    platforms: ["YouTube", "Instagram", "Facebook"],
    followerCount: "390K",
    isVerified: true,
    rating: 4.98,
    reviewsCount: 89,
    completedBriefs: 73,
    hourlyRate: 110,
    tools: ["Flux.1 Dev", "ComfyUI Multi-ControlNet", "Blender AI", "Magnific AI"],
    styles: ["Cyberpunk", "Titanium CAD", "Exploded Geometry"],
    badges: ["Top Rated 2026", "Hardware Specialist"],
    portfolio: [
      {
        id: "p-tech-1",
        title: "Titanium Cybernetic Chronograph Exploded Assembly",
        mediaUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "/videos/cinematic-reel.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        duration: "0:30",
        mediaType: "video",
        category: "Electronics & Tech",
        prompt: "Commercial luxury product photography of a matte black ceramic chronograph floating in zero gravity, ambient rim lighting with subtle sapphire streaks, studio softbox.",
        model: "Flux.1 Dev + ComfyUI",
        seed: "142985102",
        tools: ["Flux.1 Dev", "ComfyUI", "Magnific AI"],
        aspectRatio: "16:9",
        createdAt: "4 days ago",
      }
    ],
  }
];

let briefs = [
  {
    id: "brief-bridal-1",
    brandName: "Kalyan Heritage Silks",
    brandLogo: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=200&q=80",
    brandIndustry: "Bridal & Wedding Fashion",
    title: "3x 30s Royal Heritage Bridal Lehenga Reels for Festive Launch",
    description: "Seeking an elite AI video creator to produce 3 Reels (9:16 vertical) highlighting hand-zardozi silk textures, palace archway silhouettes, and royal wedding highlights with flawless fabric motion.",
    category: "Bridal & Wedding",
    budgetMin: 1200,
    budgetMax: 2200,
    currency: "USD",
    deadline: "Nov 15, 2026",
    requiredTools: ["Runway Gen-3", "ComfyUI Fabric LoRA", "Topaz Video AI"],
    deliverablesCount: 3,
    aspectRatio: "9:16 Vertical",
    resolution: "4K (1080x1920) 60fps",
    status: "open",
    proposalsCount: 14,
    createdAt: "1 day ago",
  },
  {
    id: "brief-drinks-1",
    brandName: "Velox Energy Drink",
    brandLogo: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=200&q=80",
    brandIndustry: "Food & Beverage",
    title: "Hyper-Dynamic Action Visuals with Liquid Splashes & Neon Light",
    description: "Looking for an AI video artist to generate 4 punchy 15s short-form videos for an energy drink can breaking sound barriers with glowing electric fluid splashes.",
    category: "Drinks & Beverage",
    budgetMin: 900,
    budgetMax: 1600,
    currency: "USD",
    deadline: "Nov 20, 2026",
    requiredTools: ["Runway Gen-3", "Midjourney v6.1", "Topaz Video"],
    deliverablesCount: 4,
    aspectRatio: "9:16 & 16:9",
    resolution: "4K UHD 60fps",
    status: "open",
    proposalsCount: 9,
    createdAt: "2 days ago",
  }
];

let project = {
  id: "proj-101",
  briefTitle: "Royal Heritage Bridal Lehenga 30s Campaign",
  brandName: "Kalyan Heritage Silks",
  creatorName: "Aanya Kapoor",
  totalBudget: 1800,
  status: "active",
  milestones: [
    {
      id: "m-1",
      title: "Milestone 1: 3x Style Explorations & Fabric Motion Proof",
      description: "Submit 5-second velvet drape test and jewellery sparkle proof in 9:16.",
      amount: 600,
      dueDate: "Oct 14, 2026",
      status: "approved",
      deliverableUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
      clientFeedback: "Approved! The gold embroidery reflection at 0:02 is stunning. Proceed with full 30s cut.",
    },
    {
      id: "m-2",
      title: "Milestone 2: Final 4K 60fps 30s Commercial Video & Prompt Receipt",
      description: "Deliver final color-graded MP4 master, social cutdown, and raw generation seed receipt.",
      amount: 1200,
      dueDate: "Oct 22, 2026",
      status: "submitted",
      deliverableUrl: "/videos/bridal-couture.mp4",
    },
  ],
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CreatorConnect AI API', timestamp: new Date().toISOString() });
});

// Categories Endpoint
app.get('/api/categories', (req, res) => {
  res.json({ success: true, count: categories.length, data: categories });
});

// Creators Endpoints
app.get('/api/creators', (req, res) => {
  const { tool, category, search, platform } = req.query;
  let results = [...creators];

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.headline.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.tools.some(t => t.toLowerCase().includes(q))
    );
  }
  if (tool && tool !== 'All') {
    results = results.filter(c => c.tools.some(t => t.toLowerCase().includes(String(tool).toLowerCase())));
  }
  if (category && category !== 'All') {
    results = results.filter(c =>
      c.category.toLowerCase().includes(String(category).toLowerCase()) ||
      c.portfolio.some(p => p.category.toLowerCase().includes(String(category).toLowerCase()))
    );
  }
  if (platform && platform !== 'All') {
    results = results.filter(c => c.platforms.some(p => p.toLowerCase() === String(platform).toLowerCase()));
  }

  res.json({ success: true, count: results.length, data: results });
});

// Add Portfolio Item Endpoint
app.post('/api/portfolio', (req, res) => {
  const { creatorId, title, mediaUrl, videoUrl, thumbnailUrl, duration, category, prompt, model, tools, aspectRatio } = req.body;
  const creator = creators.find(c => c.id === creatorId);
  if (!creator) {
    return res.status(404).json({ success: false, message: 'Creator not found' });
  }

  const newItem = {
    id: `p-${Date.now()}`,
    title: title || 'New AI Portfolio Asset',
    mediaUrl: mediaUrl || thumbnailUrl || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    videoUrl,
    thumbnailUrl,
    duration: duration || '0:30',
    mediaType: videoUrl ? 'video' : 'image',
    category: category || creator.category,
    prompt: prompt || 'Commercial AI visual asset generation',
    model: model || 'Runway Gen-3 / Flux.1',
    tools: tools || ['Runway Gen-3', 'Flux.1'],
    aspectRatio: aspectRatio || '9:16',
    createdAt: 'Just now'
  };

  creator.portfolio.unshift(newItem);
  res.status(201).json({ success: true, message: 'Asset added to portfolio', data: newItem });
});

// Briefs Endpoints
app.get('/api/briefs', (req, res) => {
  res.json({ success: true, count: briefs.length, data: briefs });
});

app.post('/api/briefs', (req, res) => {
  const newBrief = {
    id: `brief-${Date.now()}`,
    createdAt: 'Just now',
    proposalsCount: 0,
    status: 'open',
    ...req.body
  };
  briefs.unshift(newBrief);
  res.status(201).json({ success: true, data: newBrief });
});

// Proposals Endpoint
app.post('/api/proposals', (req, res) => {
  const { briefId, proposedAmount, estimatedDays, coverPitch } = req.body;
  res.status(201).json({
    success: true,
    message: 'Proposal successfully submitted to brand escrow queue',
    data: { id: `prop-${Date.now()}`, briefId, proposedAmount, estimatedDays, coverPitch, status: 'submitted' }
  });
});

// Project & Escrow Deal Room
app.get('/api/projects/:id', (req, res) => {
  res.json({ success: true, data: project });
});

app.patch('/api/projects/:id/milestones/:milestoneId', (req, res) => {
  const { milestoneId } = req.params;
  const { status, feedback } = req.body;

  project.milestones = project.milestones.map(m => {
    if (m.id === milestoneId) {
      return { ...m, status: status || m.status, clientFeedback: feedback || m.clientFeedback };
    }
    return m;
  });

  res.json({ success: true, message: `Milestone ${milestoneId} updated`, data: project });
});

// AI Brief Co-Pilot Endpoint
app.post('/api/ai/copilot', (req, res) => {
  const { prompt } = req.body;
  
  const structuredResponse = {
    title: '30s Cinematic Promotional Video with Scene Storyboard',
    description: `High-fidelity commercial video campaign based on: "${prompt || 'Social promotional campaign'}". Multi-aspect ratio cutdowns (9:16 & 16:9).`,
    requiredTools: ['Runway Gen-3 Alpha', 'Flux.1 Dev', 'Topaz Video 4K', 'ElevenLabs Audio'],
    deliverablesCount: 3,
    budgetMin: 1100,
    budgetMax: 2200,
    aspectRatio: '9:16 Vertical & 16:9 Master',
    promptFormula: 'Cinematic 35mm slow motion commercial tracking shot, warm golden hour tones, luxury brand aesthetic, 4K 60fps temporal coherence'
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
    companyName: 'Acme Luxury Brands',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    handle: 'sarah_acme'
  },
  {
    id: 'user-creator-1',
    name: 'Aanya Kapoor',
    email: 'creator@creatorconnect.ai',
    password: 'password123',
    role: 'creator',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    handle: 'aanya_bridal_ai'
  }
];

// Authentication Endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'No account found with this email address. Please sign up or check your email.'
    });
  }

  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect password. Please verify your password or use "Forgot Password".'
    });
  }

  const { password: _, ...userWithoutPass } = user;
  res.json({
    success: true,
    message: 'Signed in successfully',
    token: `demo-token-${user.id}`,
    user: userWithoutPass
  });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required' });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'No account found with this email address.'
    });
  }

  res.json({
    success: true,
    message: `Password reset link sent to ${email}. (Demo password is: password123)`
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, handle, companyName } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: 'Account with this email already exists' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password,
    role: role || 'brand',
    handle: handle || name.toLowerCase().replace(/\s+/g, '_'),
    companyName: companyName || (role === 'brand' ? 'Creative Studio' : undefined),
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

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    user: users[0]
  });
});

app.listen(PORT, () => {
  console.log(`CreatorConnect AI API running on http://localhost:${PORT}`);
>>>>>>> 29237b25e9a45eed65d183c29fe34dc9e5084877
});
