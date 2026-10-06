# Product Requirements Document (PRD)

**Product name:** Artify
**Context:** Hackathon project (free-tier services only, no funding, no pilot partner)
**Version:** 0.5 (Draft)
**Date:** 06 Oct 2026
**Status:** Draft, open questions listed in Section 17

---

## 1. Overview

Artify is a web app that helps local artisans present their handmade products professionally without needing writing skills, English fluency, or photography expertise. An artisan uploads a photo of an article (a pot, a textile, a carved toy, etc.). The app enhances the image with AI. The artisan then speaks about the article in their own language. AI transcribes and interprets the speech and generates a detailed, polished product description that can be used for selling online.

## 2. Problem Statement

Local artisans often:
- Take low-quality photos (poor lighting, cluttered backgrounds) that undersell their work.
- Speak only a regional language and struggle to write product descriptions, especially in English or Hindi for wider markets.
- Have limited digital literacy and no access to marketing or copywriting help.
- Lose the story, technique, and cultural value of their craft because it is never documented.

As a result, high-quality handmade goods are undervalued and hard to sell outside their local area.

## 3. Goals and Non-Goals

### Goals
1. Let an artisan go from raw photo to a sale-ready listing (enhanced image + detailed description) in under 5 minutes.
2. Support voice input in local/regional languages so no typing is required.
3. Produce descriptions that capture materials, technique, cultural story, dimensions, care, and uniqueness.
4. Make the interface usable by low-literacy, first-time smartphone users.

### Non-Goals (v1)
- Payments, checkout, shipping, or order management (buyers are redirected to the artisan's WhatsApp).
- Buyer accounts, reviews, or wishlists (browsing is public and login-free).
- Paid plans or commissions (the product is free for artisans in v1).
- Authenticity certification or blockchain provenance.

## 4. Target Users

**Primary:** Local artisans and craftspeople (potters, weavers, woodcarvers, embroiderers, metalworkers, jewellery makers, etc.), many of whom are rural, speak a regional language, and use a budget Android phone.

**Secondary:**
- Artisan cooperatives, NGOs, and self-help groups who onboard artisans in bulk.
- Buyers/visitors who view the public product pages.
- Admins/moderators.

### Persona: Sunita, 42, block-print textile artisan
- Speaks Hindi and a local dialect, limited English, reads slowly.
- Uses a budget Android phone on patchy 4G.
- Wants to sell to customers outside her town but doesn't know how to describe her work.

## 5. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|-----------|
| US1 | Artisan | upload a photo from my camera or gallery | I can start a listing quickly |
| US2 | Artisan | have my photo cleaned up automatically | my product looks professional |
| US3 | Artisan | choose between original and enhanced photo | I stay in control of how my work looks |
| US4 | Artisan | speak about my article in my own language | I don't need to type or write |
| US5 | Artisan | see what the AI understood from my speech | I can correct mistakes |
| US6 | Artisan | get a detailed description generated for me | I can sell without writing skills |
| US7 | Artisan | edit the description by voice or text | the final text is accurate |
| US8 | Artisan | get the description in multiple languages | I can reach more buyers |
| US9 | Artisan | save, share, and download my listing | I can post it on WhatsApp, Instagram, or marketplaces |
| US10 | Buyer | view a public product page | I can learn about the product and artisan |
| US11 | Admin | review flagged content | the platform stays safe |

## 6. User Flow

1. **Sign up / log in** with phone number + OTP (language chosen on first screen).
2. **Home** shows "Add new article" with a large camera/upload button and icons plus voice prompts.
3. **Upload photo** (camera or gallery); guidance overlay suggests good lighting and plain background.
4. **AI image enhancement** runs; user sees before/after and picks one (or retakes).
5. **Voice description**: user taps mic and speaks about the article. Prompt cues (spoken and visual) ask: What is it? What is it made of? How do you make it? How long does it take? Who is it for? Any story or tradition behind it? Size and price (optional).
6. **Transcription and interpretation**: speech to text in the local language, then AI extracts structured details (material, technique, dimensions, use, story, region, etc.).
7. **Review**: user hears/reads the AI summary of what it understood and can re-record or correct.
8. **Description generated**: detailed, structured description in the artisan's language plus selected target languages.
9. **Edit and approve**: edit by text or voice.
10. **Save and share**: listing saved to the artisan's catalog; shareable link, PDF/image card, WhatsApp share.

## 7. Functional Requirements

### 7.1 Authentication and Profile
- FR-1.1: Phone number + OTP login; no password.
- FR-1.2: Language selection at first launch (changeable anytime).
- FR-1.3: Artisan profile: name, photo (optional), craft type, village/city/state, years of experience, short bio (can be voice generated).
- FR-1.4: The artisan's WhatsApp number must be verified with an OTP before it is shown publicly. Verification uses Firebase Phone Authentication (free tier). The login number and WhatsApp number may be the same, in which case one verification is enough.

### 7.2 Image Upload
- FR-2.1: Upload from camera or gallery; support JPG, PNG, HEIC.
- FR-2.2: Support multiple photos per article (v1: up to 5; first is the hero image).
- FR-2.3: Client-side compression for low bandwidth; resumable upload.
- FR-2.4: Real-time capture tips (lighting, framing, blur warning).

### 7.3 AI Image Enhancement
- FR-3.1: Auto-enhance: brightness, contrast, color correction, sharpening, noise reduction, upscaling.
- FR-3.2: Background cleanup/removal with options: clean white, soft neutral, or original.
- FR-3.3: Preserve the true color, texture, and shape of the product. The AI must not alter the craft, add or remove design elements, or misrepresent the item.
- FR-3.4: Before/after slider; one-tap revert to original.
- FR-3.5: Label enhanced images as "AI-enhanced" in metadata and on the public page for buyer trust.
- FR-3.6: Processing time target: under 15 seconds per image.

### 7.4 Voice Input
- FR-4.1: In-browser audio recording (up to 3 minutes per recording, multiple recordings allowed).
- FR-4.2: Voice input and UI supported in five launch languages: Hindi, Punjabi, Haryanvi, Marathi, and Tamil. Haryanvi has little dedicated speech-recognition support, so it will be handled as a Hindi-family dialect with a dialect-tuned vocabulary and a mandatory transcript confirmation step (see Risks).
- FR-4.3: Handle dialects, code-mixing (e.g., Hindi + English words), background noise, and craft-specific vocabulary.
- FR-4.4: Visible recording indicator, waveform, pause/resume, re-record.
- FR-4.5: Guided prompt questions displayed and optionally read aloud.
- FR-4.6: Upload of pre-recorded audio is optional.

### 7.5 Speech-to-Text and Interpretation
- FR-5.1: Transcribe audio in the spoken language; show the transcript.
- FR-5.2: AI extracts structured fields: article type, materials, technique/process, dimensions, colors, time to make, uses, cultural/regional significance, story, care instructions, price (if mentioned), artisan name.
- FR-5.3: Detect missing important details and ask follow-up questions (by voice and text), e.g., "What material is this made of?"
- FR-5.4: Cross-check spoken details against the image (e.g., the image shows brass but speech says clay) and flag mismatches for user confirmation.
- FR-5.5: Show a "what I understood" confirmation summary in the artisan's language before generating the final description.

### 7.6 Description Generation
- FR-6.1: Generate a detailed description, including: title, short tagline, full description, materials, technique/process, dimensions, colors, uses, cultural/heritage story, care instructions, "about the artisan", and suggested tags/keywords.
- FR-6.2: Output in the artisan's own language (for their verification) and in English and Hindi by default, since the target buyers are online customers. Other launch languages are optional outputs.
- FR-6.3: Tone options: Traditional/Storytelling, Simple/Direct, Premium/Boutique.
- FR-6.4: Must not hallucinate. Only include facts provided by the artisan or clearly visible in the image; unverifiable claims are left out or marked for confirmation.
- FR-6.5: Read-aloud (text-to-speech) of the generated description in the artisan's language so low-literacy users can verify it.
- FR-6.6: Edit by typing or by voice command (e.g., "make it shorter", "add that it takes 3 days to make").
- FR-6.7: Regenerate with different tone or length.

### 7.7 Catalog and Sharing
- FR-7.1: Artisan dashboard listing all articles with status (Draft, Published).
- FR-7.2: Public shareable product page (mobile-first, no buyer login) with image gallery, description, **price** (set by the artisan, in INR), and artisan profile. The primary call to action is a "Chat on WhatsApp" button that redirects the buyer to the artisan's WhatsApp number (wa.me link) with a pre-filled message naming the product and page link. Artisans must confirm and consent to showing their WhatsApp number publicly.
- FR-7.2a: On-platform buyer accounts, cart, and payments are out of scope; all buyer-artisan communication and sales happen on WhatsApp.
- FR-7.5 (Buyer browsing): A public, login-free storefront where buyers can browse all published articles from all artisans. Includes a home feed, search by keyword, filters (craft/category, material, state/region, price range, language), sorting (newest, price), pagination or infinite scroll, and artisan profile pages listing that artisan's items. Only published items appear.
- FR-7.6: Price is a required field before publishing; the artisan can speak it ("five hundred rupees") and the AI converts it to a number for confirmation.
- FR-7.3: Export: downloadable product card (image), PDF, and copy-text.
- FR-7.4: Edit, duplicate, delete articles.

### 7.8 Admin and Moderation
- FR-8.1: Admin panel to view users, articles, and flagged content.
- FR-8.2: Automated content safety checks on images, audio transcripts, and descriptions.
- FR-8.3: Basic analytics: users, articles created, languages used, completion rate.

## 8. Non-Functional Requirements

- **Performance:** Image enhancement under 15 s; transcription under 10 s for a 1-minute recording; description generation under 15 s.
- **Connectivity:** Works on 3G/4G; compress uploads; retry on failure; draft auto-save so progress isn't lost.
- **Accessibility and usability:** Large touch targets, icon-first UI, voice guidance, high contrast, minimal text, support for low-literacy users, WCAG 2.1 AA where applicable.
- **Responsive:** Mobile-first web app (PWA, installable), works on low-end Android devices and modern browsers (Chrome, Firefox, Safari, Edge).
- **Scalability:** Handle bursts when cooperatives onboard many artisans simultaneously.
- **Reliability:** 99.5% uptime target.
- **Localization:** All UI strings translatable; right-to-left and non-Latin scripts supported.
- **Accuracy targets (to validate):** Speech transcription word error rate under 20% for supported languages; at least 90% of generated descriptions accepted with minor or no edits.

## 9. AI/ML Components

| Component | Purpose | Notes |
|-----------|---------|-------|
| Image enhancement | Quality improvement, background cleanup | Must be faithful to the real product; no generative alteration of design |
| Image understanding (vision) | Identify article type, material, color, visible features | Used to cross-check speech |
| Speech-to-text (multilingual) | Transcribe regional languages and dialects | Needs strong Indic language support |
| Language understanding / extraction | Structure the transcript into product attributes | Handles code-mixing and informal speech |
| Description generation (LLM) | Write detailed, culturally sensitive descriptions | Grounded only in provided facts |
| Translation | Multi-language output | Human-review option for key languages |
| Text-to-speech | Read back description and prompts | Natural voices in local languages |

Providers are decided (see 9.1 Tech Stack).

### 9.1 Tech Stack

The app uses a MERN-style stack with MySQL in place of MongoDB (React, Express, Node.js, MySQL). All services should have a usable free tier because the project has no funding.

| Layer | Choice | Notes |
|-------|--------|-------|
| Code structure | Plain JavaScript in a single monorepo: `/client` (React + Vite) and `/server` (Express) | Decided; fastest for a hackathon |
| Frontend | React (Vite), PWA, i18n library (e.g., react-i18next) | Mobile-first, installable, Noto fonts for Devanagari, Gurmukhi, and Tamil scripts |
| Backend | Node.js + Express | REST API; background job queue for AI tasks (e.g., BullMQ + Redis) |
| Database | MySQL-compatible TiDB Serverless (free tier); local MySQL in Docker for development | Decided. Accessed via an ORM such as Prisma or Sequelize; SSL connection required; use LIKE/full-text search for the storefront |
| Auth | Firebase Phone Authentication (free tier) for OTP; backend verifies the Firebase ID token and issues its own JWT session | Decided. Use Firebase test phone numbers for the demo to avoid SMS quota limits. The same OTP flow verifies the WhatsApp number |
| File storage | Cloudinary (free tier) for original and enhanced images, with CDN thumbnails for the storefront | Decided. Audio is never uploaded to Cloudinary; it is held in server memory/temp storage only until transcribed, then deleted |
| AI services | Google Gemini API (free tier) as the single provider for audio transcription/understanding, image understanding, description generation, and translation | Decided. Rate limits and daily quotas apply, so use per-user caps and retry with backoff. Image enhancement uses sharp on the server plus Gemini image editing for background cleanup (see Section 7.3 and Open Questions). TTS is optional |
| Hosting | Local run for the hackathon demo (client + server on a laptop, connected to the free cloud services above); optional later deployment to Vercel (frontend) and Render (backend) | Decided: no live deployment required, so free-tier cold starts are not a concern for the demo |

Core tables (indicative): users, artisan_profiles, articles, article_images, transcripts, article_attributes, descriptions (with language and version), shares/page_views, moderation_flags.

## 10. Data and Content

- **Stored:** user profile, original images, enhanced images, audio recordings, transcripts, structured attributes, generated descriptions, edit history.
- **Retention:** Audio recordings are permanently deleted as soon as transcription is completed (and any re-record is finished). Only the transcript and structured details are kept. Audio is never used for model training.
- **Ownership:** The artisan owns all uploaded content and generated descriptions.

## 11. Privacy, Security, and Ethics

- Explicit consent for photo, voice, and data processing in the user's language, ideally explained by audio.
- Compliance with applicable data protection law (e.g., India's DPDP Act 2023).
- Encrypted data in transit and at rest; signed URLs for media.
- Voice data not used to train models without explicit opt-in.
- Cultural sensitivity: descriptions must respect and accurately represent traditions; avoid exoticizing or fabricating heritage claims.
- Transparency: AI-enhanced images and AI-assisted text are labeled.
- Rate limiting and abuse prevention on upload and generation endpoints.

## 12. Success Metrics

| Metric | Target (first 6 months, to be validated) |
|--------|-------------------------------------------|
| Time from upload to published listing | under 5 minutes median |
| Onboarding completion (sign-up to first listing) | 60%+ |
| Description acceptance without major edits | 80%+ |
| Artisans creating 3+ listings | 40%+ |
| Weekly active artisans (WAU) | Set after pilot |
| Transcription satisfaction (user rating) | 4/5+ |
| Share rate of published listings | 50%+ |

## 13. Assumptions

- Artisans have a smartphone with a camera, microphone, and intermittent internet.
- Artisans onboard themselves, with no partner organization, so the first-run experience must be fully self-explanatory (voice-guided, icon-led, with a short demo).
- The primary buyers are online customers reached through links shared on WhatsApp and social media.
- Third-party AI services are available at acceptable cost and quality for the target languages.

## 14. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Poor speech recognition for dialects/noise | Wrong descriptions | Confirmation step, transcript editing, follow-up questions, noise guidance |
| AI hallucinating details or heritage claims | Loss of trust, misrepresentation | Ground generation strictly in provided facts; flag unverifiable items |
| Image enhancement changes the product's look | Buyer disappointment | Faithful enhancement, original vs enhanced toggle, "AI-enhanced" label |
| Low digital literacy | Drop-off | Voice-first UI, icons, guided onboarding, cooperative-led training |
| Poor connectivity | Failed uploads | Compression, resumable uploads, draft auto-save |
| Free-tier limits on AI, SMS/OTP, hosting, and storage | Demo breaks or is throttled | Prefer generous free tiers, per-user daily listing caps, image compression, caching, graceful error messages, a pre-recorded fallback demo |
| Haryanvi not well supported by speech models | Poor transcripts for a launch language | Treat as Hindi-family dialect, build a custom vocabulary, collect consented corrections during the pilot, keep the confirm-and-edit step mandatory |
| Public WhatsApp numbers exposed to spam or harassment | Artisan safety | Explicit consent, option to hide number and use a masked link, report/block tools |
| Privacy of voice/image data | Legal and trust risk | Consent, minimal retention, encryption |

## 15. Release Plan

### Hackathon scope (must-have for the demo)
1. Phone OTP login with WhatsApp number verification (free service)
2. Photo upload, AI enhancement, before/after toggle
3. Voice recording in the five launch languages, transcription, confirmation step
4. Auto-generated description in the artisan's language, English, and Hindi, including price
5. Publish, public product page, and WhatsApp redirect button
6. Public storefront: browse all items with search and filters

Nice-to-have if time permits: text-to-speech read-back, voice edit commands, PDF/card export, moderation panel.

### Full plan

**Phase 0 – Discovery (2–3 weeks):** Interview 10–15 artisans, finalize languages, evaluate AI vendors, prototype.

**Phase 1 – MVP (8–10 weeks):**
- Phone OTP login, language selection
- Photo upload + AI enhancement
- Voice recording + transcription + description generation in 2–3 languages
- Edit, save, share link/PDF

**Phase 2 – Pilot (4–6 weeks):** Onboard a cooperative, gather feedback, tune prompts and models.

**Phase 3 – Expansion:** More languages, multi-photo and video, buyer-facing marketplace/discovery, cooperative dashboards, WhatsApp bot, offline-first mode.

## 16. Future Enhancements (Backlog)

- Buyer marketplace with search, categories, and inquiries
- Payments and logistics integration
- Auto-generated social media posts and captions
- Price suggestion based on materials and effort
- Video story generation from photo + voice
- QR code on physical product linking to the artisan's story
- Offline mode with later sync
- Craft authenticity and GI-tag support

## 17. Open Questions

**Resolved (v0.3):** Launch languages (Hindi, Punjabi, Haryanvi, Marathi, Tamil); buyers are online customers; WhatsApp redirect; self-serve onboarding; free product; audio deleted after transcription; React + Express + Node + MySQL; price shown on public page; English and Hindi auto-generated; WhatsApp number verified via a free service; buyers can browse all artisans' items; hackathon project with no funding or pilot; name is Artify.

**Tech stack decisions (all resolved):**
*(Resolved: Gemini free tier is the single AI provider for speech, vision, text, and translation.)*
*(Resolved: Firebase Phone Auth for OTP login and WhatsApp number verification.)*
*(Resolved: image enhancement uses the sharp library on the Node server for auto brightness, contrast, sharpening, and noise reduction, plus Gemini image editing for background cleanup. Because generative edits can alter the product, the app compares the result against the original and falls back to the sharp-only version if the check fails. Users can always revert to the original.)*
*(Resolved: Cloudinary free tier for images.)*
*(Resolved: TiDB Serverless free tier for the demo database.)*
*(Resolved: JavaScript, single monorepo with /client and /server.)*
*(Resolved: a local run is acceptable for the hackathon, so a live deployment is optional. Record a backup screen recording of the full flow.)*
*(Resolved: no deadline or team constraints; the PRD will be handed to the Antigravity coding agent, so Section 19 contains build instructions.)*

## 18. Glossary

- **Artisan:** A skilled maker of handmade goods.
- **PWA:** Progressive Web App, a web app installable on a phone home screen.
- **STT/TTS:** Speech-to-text / text-to-speech.
- **DPDP Act:** India's Digital Personal Data Protection Act, 2023.

## 19. Implementation Guide (for the AI coding agent)

This section turns the requirements above into concrete build instructions. If anything here conflicts with an earlier section, this section wins for implementation details.

### 19.1 Ground rules for the agent
- Build in the phases of Section 19.7. Finish and run-test each phase before starting the next.
- Use plain JavaScript (ES modules), no TypeScript. Do not add features outside this PRD.
- The project runs locally for the hackathon demo. Keep every secret in `.env` files; never hard-code keys. Provide `.env.example` files.
- Check the current official documentation for Gemini, Firebase, Cloudinary, TiDB and Prisma/Sequelize before coding against them, and use current model names (do not rely on memory). Use a Gemini model that supports audio input for transcription and a Gemini image-capable model for background cleanup.
- All user-facing text must come from translation files (hi, pa, mr, ta, en). Haryanvi uses the Hindi UI strings.
- Every AI call needs: a timeout, retry with exponential backoff on rate limits, a clear user-facing error, and a per-user daily cap (default 20 listings/day, configurable).
- Mobile-first UI: large buttons, icons plus short text, minimal typing, sticky primary action, works at 360px width.
- Write a short `README.md` with setup and run steps, and a seed script with 8-10 sample artisans/articles so the storefront is not empty in the demo.

### 19.2 Repository structure
```
artify/
  client/                 # React + Vite PWA
    src/
      pages/              # Login, Onboarding, Dashboard, NewArticle (wizard), EditArticle,
                          # Storefront, ProductPage, ArtisanPage
      components/         # PhotoCapture, BeforeAfterSlider, VoiceRecorder, ReviewSummary,
                          # DescriptionEditor, ProductCard, Filters, WhatsAppButton
      i18n/               # en.json, hi.json, pa.json, mr.json, ta.json
      lib/                # api client, firebase init, auth context
  server/
    src/
      routes/             # auth, profile, articles, public
      services/           # gemini.js, enhance.js (sharp + gemini), cloudinary.js, firebaseAdmin.js
      middleware/         # auth (JWT), rateLimit, upload (multer, memory storage), errorHandler
      db/                 # schema (Prisma or Sequelize models), migrations, seed.js
      prompts/            # extraction.js, description.js, enhancement.js
    index.js
  README.md
```

### 19.3 Environment variables
Server: `PORT`, `DATABASE_URL` (MySQL/TiDB, SSL enabled), `JWT_SECRET`, `GEMINI_API_KEY`, `GEMINI_TEXT_MODEL`, `GEMINI_IMAGE_MODEL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `FIREBASE_SERVICE_ACCOUNT` (path or JSON), `CLIENT_ORIGIN`, `DAILY_LISTING_CAP`.
Client: `VITE_API_URL`, `VITE_FIREBASE_*` (Firebase web config).

### 19.4 Database schema (MySQL)
- **users**: id, firebase_uid (unique), phone (unique), role (`artisan`|`admin`), ui_language, created_at
- **artisan_profiles**: user_id (PK, FK), display_name, craft_type, village, city, state, years_experience, bio, photo_url, whatsapp_number, whatsapp_verified (bool), whatsapp_public_consent (bool)
- **articles**: id, artisan_id (FK users), status (`draft`|`published`), title, tagline, category, price_inr (decimal 10,2, required to publish), spoken_language (`hi`|`pa`|`hne`|`mr`|`ta`), material, technique, dimensions, colors, time_to_make, uses, story, care, tags (JSON), hero_image_id, created_at, published_at
- **article_images**: id, article_id (FK), original_url, enhanced_url, cloudinary_public_id, enhancement_method (`sharp`|`sharp+gemini`|`none`), is_hero, position
- **transcripts**: id, article_id (FK), language, text, confirmed (bool), created_at (audio is never stored)
- **descriptions**: id, article_id (FK), language (`en`|`hi`|`pa`|`mr`|`ta`), tone, title, tagline, body, version, updated_at
- **whatsapp_clicks**: id, article_id (FK), created_at
- **moderation_flags** (optional): id, article_id, reason, status, created_at
Add indexes on articles(status, category, state via profile, price_inr, published_at) and a FULLTEXT index on title, tagline, material, tags for storefront search.

### 19.5 API endpoints (REST, JSON)
Auth and profile
- `POST /api/auth/verify` body `{ firebaseIdToken }`: verify with Firebase Admin, upsert user, return app JWT
- `GET /api/me`, `PUT /api/me/profile` (includes WhatsApp number; mark `whatsapp_verified` only when the Firebase-verified phone matches or a second verification succeeds)

Artisan article workflow (JWT required)
- `POST /api/articles` create draft
- `POST /api/articles/:id/images` multipart image: upload original to Cloudinary, run enhancement, return `{ originalUrl, enhancedUrl, method }`
- `POST /api/articles/:id/images/:imageId/choose` body `{ use: "original" | "enhanced" }`
- `POST /api/articles/:id/audio` multipart audio + `{ language }`: transcribe and extract in one Gemini call, delete audio immediately, return `{ transcript, extracted, missingFields, followUpQuestions, imageMismatchWarnings }`
- `PUT /api/articles/:id/details` save the user-confirmed fields (including price)
- `POST /api/articles/:id/describe` body `{ tone }`: generate descriptions in the spoken language, English, and Hindi
- `PUT /api/articles/:id/descriptions/:lang` manual edit
- `POST /api/articles/:id/publish` (requires price, hero image, and a verified, consented WhatsApp number)
- `GET /api/articles/mine`, `GET/PUT/DELETE /api/articles/:id`

Public (no login)
- `GET /api/public/articles?q=&category=&material=&state=&minPrice=&maxPrice=&lang=&sort=newest|price_asc|price_desc&page=&pageSize=`
- `GET /api/public/articles/:id` (includes description in requested `lang`, falling back to English)
- `GET /api/public/artisans/:id` (profile plus published items)
- `POST /api/public/articles/:id/whatsapp-click` (log click; the client then opens `https://wa.me/<number>?text=<prefilled>`)

### 19.6 AI pipeline rules
1. **Enhancement:** run `sharp` first (auto-rotate, normalise, mild brightness/contrast, sharpen, resize to max 2000px). Then ask Gemini for background cleanup only. Compare the result with the sharp output (size/aspect ratio check plus a Gemini yes/no "does this show the same product with unchanged design, color and shape?" check). If any check fails or the call errors, use the sharp-only image. Always keep the original.
2. **Transcription and extraction (single call):** send audio plus the article's hero image and the spoken-language code. Prompt requires JSON output with: `transcript` (in the original script), `transcript_en` (English translation), and fields `category, material, technique, dimensions, colors, time_to_make, uses, story, care, price_inr, artisan_name`. Unknown fields must be `null`, never guessed. Return `missing_fields` and up to 3 short follow-up questions in the spoken language. Return `image_mismatches` if speech and image disagree (e.g., material).
3. **Description generation:** input is only the confirmed fields plus the visible-image facts. Output JSON per language with `title, tagline, body, tags`. Rules in the prompt: no invented facts, history, awards, or claims; omit unknown fields; respect the chosen tone; keep the body 120-220 words; the native-language version must be natural, not a literal translation.
4. **Price parsing:** convert spoken amounts ("paanch sau rupaye", "ਪੰਜ ਸੌ", "ஐநூறு ரூபாய்") into a number; always show it for confirmation before saving.
5. Never persist or log audio. Delete it from memory/temp files in a `finally` block.
6. Label enhanced images as "AI-enhanced" on the product page.

### 19.7 Build order and acceptance criteria
1. **Foundation:** monorepo, Express server with health route, MySQL connection and migrations, React shell with i18n and language picker. *Done when:* both apps run and the DB tables exist.
2. **Auth:** Firebase phone OTP (test numbers allowed), `/api/auth/verify`, JWT, profile form with WhatsApp number. *Done when:* a user can sign in and save a profile with a verified number.
3. **Photo and enhancement:** capture/upload, Cloudinary storage, enhancement pipeline, before/after slider and choice. *Done when:* an uploaded photo returns an enhanced version in under 15 s, with fallback working.
4. **Voice to details:** recorder, audio upload, extraction JSON, review screen with editable fields, follow-up questions, price confirmation. *Done when:* a Hindi recording produces correct editable fields and the audio is not stored anywhere.
5. **Descriptions:** generation in the spoken language, English, and Hindi; edit and regenerate. *Done when:* all three versions are saved and editable.
6. **Publish and product page:** publish checks, public page with gallery, price, descriptions, artisan profile, AI-enhanced label, and the WhatsApp button. *Done when:* the WhatsApp link opens a chat with the pre-filled message.
7. **Storefront:** home feed, search, filters, sort, pagination, artisan page, seed data. *Done when:* filters and search return correct results across at least 10 seeded items.
8. **Polish:** loading states, error messages, empty states, PWA manifest, per-user caps, README, demo script. *Nice-to-have if time permits:* text-to-speech read-back, voice edit commands, PDF/card export.

### 19.8 Test checklist
- OTP login with a Firebase test number; second login reuses the same user.
- A publish attempt without price or verified WhatsApp is blocked with a clear message.
- Audio is confirmed deleted after transcription (no file on disk, nothing in Cloudinary or the DB).
- The enhancement fallback works when the Gemini image call is forced to fail.
- The extraction returns `null` rather than invented values when the speaker doesn't mention a field.
- Storefront shows only published items; draft items never appear in public routes.
- UI works at 360px width in all five languages, including Devanagari, Gurmukhi, and Tamil fonts.

