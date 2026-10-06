import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';
import { verifyFirebaseToken } from '../services/firebaseAdmin.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/verify
router.post('/verify', async (req, res, next) => {
  try {
    const { firebaseIdToken, uiLanguage = 'hi' } = req.body;

    if (!firebaseIdToken) {
      return res.status(400).json({
        success: false,
        error: { message: 'firebaseIdToken is required' }
      });
    }

    const { uid, phone } = await verifyFirebaseToken(firebaseIdToken);

    // Upsert User
    let user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
      include: { profile: true }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid: uid,
          phone: phone,
          uiLanguage: uiLanguage,
          role: 'artisan',
          profile: {
            create: {
              displayName: 'कारीगर (Artisan)',
              whatsappNumber: phone,
              whatsappVerified: true, // auto-verified since login is on the same number
              whatsappPublicConsent: true
            }
          }
        },
        include: { profile: true }
      });
    }

    // Generate App JWT
    const secret = process.env.JWT_SECRET || 'artify_default_jwt_secret';
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: user.role },
      secret,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        uiLanguage: user.uiLanguage,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Error during auth verification:', error);
    next(error);
  }
});

// GET /api/me
router.get('/me', requireAuth, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      phone: req.user.phone,
      role: req.user.role,
      uiLanguage: req.user.uiLanguage,
      profile: req.user.profile
    }
  });
});

// PUT /api/me/profile
router.put('/me/profile', requireAuth, async (req, res, next) => {
  try {
    const {
      displayName,
      craftType,
      village,
      city,
      state,
      yearsExperience,
      bio,
      photoUrl,
      whatsappNumber,
      whatsappPublicConsent,
      uiLanguage
    } = req.body;

    // Update user uiLanguage if provided
    if (uiLanguage) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { uiLanguage }
      });
    }

    // Verify WhatsApp number matches registered phone or keep verified status
    const isMatchingPhone = whatsappNumber && (whatsappNumber === req.user.phone);

    const updatedProfile = await prisma.artisanProfile.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        displayName: displayName || 'कारीगर (Artisan)',
        craftType,
        village,
        city,
        state,
        yearsExperience: yearsExperience ? parseInt(yearsExperience, 10) : null,
        bio,
        photoUrl,
        whatsappNumber: whatsappNumber || req.user.phone,
        whatsappVerified: isMatchingPhone ? true : Boolean(req.user.profile?.whatsappVerified),
        whatsappPublicConsent: Boolean(whatsappPublicConsent)
      },
      update: {
        ...(displayName && { displayName }),
        ...(craftType !== undefined && { craftType }),
        ...(village !== undefined && { village }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(yearsExperience !== undefined && { yearsExperience: yearsExperience ? parseInt(yearsExperience, 10) : null }),
        ...(bio !== undefined && { bio }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(whatsappNumber !== undefined && {
          whatsappNumber,
          whatsappVerified: isMatchingPhone ? true : req.user.profile?.whatsappVerified
        }),
        ...(whatsappPublicConsent !== undefined && { whatsappPublicConsent: Boolean(whatsappPublicConsent) })
      }
    });

    res.json({
      success: true,
      profile: updatedProfile
    });
  } catch (error) {
    next(error);
  }
});

export default router;
