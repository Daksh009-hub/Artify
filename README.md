# Artify 🎨

> **Empowering local artisans with AI** — Transforming craft photos and regional voice descriptions into professional, multi-language e-commerce listings in under 5 minutes without writing skills, English fluency, or photography expertise.

[![Hackathon Project](https://img.shields.io/badge/Project-Artify%20Hackathon-orange.svg)](https://github.com/Daksh009-hub/Artify)
[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Express%20%7C%20MySQL%20%7C%20Gemini-blue.svg)](https://github.com/Daksh009-hub/Artify)

---

## 🌟 Overview & Problem Solved

Rural and traditional Indian craftspeople often face significant digital barriers:
- Low-quality smartphone photos taken in cluttered spaces undersell their craftsmanship.
- Speaking only regional dialects (Hindi, Punjabi, Haryanvi, Marathi, Tamil), they struggle to compose written product copy in English/Hindi for online buyers.
- The cultural heritage, ancestral techniques, and material stories behind their handmade creations are lost undocumented.

**Artify** solves this with a mobile-first, voice-first progressive web application:
1. **Photo Upload & AI Enhancement**: Auto-corrects brightness, contrast, and textures with `sharp` and cleans backgrounds with Google Gemini vision models, with an interactive Before/After comparison slider and 1-tap revert.
2. **In-Browser Regional Voice Input**: Artisans simply tap the mic and speak in their native tongue.
3. **Single-Call Transcription & Attribute Extraction**: Gemini transcribes speech, translates to English, and structures craft attributes (materials, techniques, dimensions, care, story, and spoken price) while cross-checking against the photo for discrepancies. Audio is deleted immediately in a `finally` block (zero permanent storage).
4. **Grounded Multi-Language Copy Generation**: AI generates polished, culturally respectful product descriptions across 3 languages (Spoken Language, English, Hindi) with tone presets (Traditional/Storytelling, Simple/Direct, Premium/Boutique) and text-to-speech readback.
5. **Direct WhatsApp Sales**: Public login-free product page with transparent INR pricing and a direct "Chat on WhatsApp" (`wa.me`) button with prefilled product inquiries.
6. **Public Storefront**: Buyers can browse, search, and filter authentic crafts by category, material, state, and price.

---

## 🏗 Architecture & Tech Stack

```
artify/
  ├── client/                 # React + Vite PWA (Mobile-first, 360px+)
  │   ├── src/
  │   │   ├── pages/          # Login, Dashboard, NewArticle (Wizard), Storefront, ProductPage, ArtisanPage, Profile
  │   │   ├── components/     # BeforeAfterSlider, VoiceRecorder, PhotoCapture, ReviewSummary, DescriptionEditor, ProductCard, WhatsAppButton
  │   │   ├── i18n/           # English, Hindi, Punjabi, Marathi, Tamil (+ Haryanvi fallback)
  │   │   └── lib/            # API client, Firebase Auth context
  └── server/                 # Express REST API (ES Modules)
      ├── src/
      │   ├── routes/         # /auth, /articles, /public
      │   ├── services/       # gemini.js, enhance.js (sharp + gemini), cloudinary.js, firebaseAdmin.js
      │   ├── middleware/     # auth (JWT), rateLimit, upload (multer memory), errorHandler
      │   ├── db/             # schema.prisma, seed.js
      │   └── prompts/        # extraction.js, description.js, enhancement.js
```

---

## 🚀 Quick Start & Setup

### 1. Prerequisites
- Node.js (v18+)
- MySQL (v8.0+) or TiDB Serverless account (free tier)

### 2. Clone the Repository
```bash
git clone https://github.com/Daksh009-hub/Artify.git
cd Artify
```

### 3. Server Configuration
```bash
cd server
npm install
```

Copy `.env.example` to `.env` and fill in your credentials:
```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173

# MySQL or TiDB Serverless URL
DATABASE_URL="mysql://<user>:<password>@<host>:3306/artify"

# Authentication Secret
JWT_SECRET="super_secret_artify_jwt_key"

# Google Gemini API
GEMINI_API_KEY="your_gemini_api_key"
GEMINI_TEXT_MODEL="gemini-1.5-flash"
GEMINI_IMAGE_MODEL="gemini-1.5-flash"

# Cloudinary (Optional, falls back to inline data URIs if omitted)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Rate limiting
DAILY_LISTING_CAP=20
```

Push database schema & seed initial craft data:
```bash
# Push schema tables
npx prisma db push

# Seed 8 authentic Indian craft artisans and products
npm run db:seed

# Start backend server
npm run dev
```

### 4. Client Setup
In a new terminal:
```bash
cd client
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser (or open Chrome DevTools Mobile View at 375px/360px).

---

## 📱 Demo Artisan Logins
For hackathon demonstrations, the app provides instant 1-tap test logins:
- **सुनीता देवी (Sunita Devi)** — Sanganeri Block Print Textiles (Rajasthan)
- **गुरप्रीत सिंह (Gurpreet Singh)** — Bagh Phulkari Embroidery (Punjab)
- **महादेव कांबळे (Mahadev Kamble)** — Kolhapuri Leather Crafts (Maharashtra)
- **मुத்துவேல் (Muthuvel Sthapathi)** — Chola Bronze Sculpting (Tamil Nadu)

---

## 🔒 Privacy & Safety Features
- **Zero Audio Storage**: Audio recordings are processed purely in memory buffers and destroyed immediately in a `finally` block once transcribed.
- **WhatsApp Consent**: Artisan phone numbers are only displayed on public storefront listings if explicit verification and public consent have been confirmed.
- **Hallucination Prevention**: Prompts strictly constrain descriptions to verified attributes and visibly confirmed product details.
- **AI Labeling**: AI-enhanced images are clearly labeled with an "AI-Enhanced" badge on public buyer pages.

---

## 📄 License
MIT License. Built for the Hackathon.
