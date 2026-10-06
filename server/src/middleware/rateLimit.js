import rateLimit from 'express-rate-limit';
import prisma from '../db/prisma.js';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  }
});

// Daily listing creation cap per artisan (default 20 listings/day)
export const checkDailyListingCap = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next();
    }

    const maxListings = parseInt(process.env.DAILY_LISTING_CAP || '20', 10);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayCount = await prisma.article.count({
      where: {
        artisanId: userId,
        createdAt: {
          gte: startOfDay
        }
      }
    });

    if (todayCount >= maxListings) {
      return res.status(429).json({
        success: false,
        error: {
          message: `Daily limit of ${maxListings} listings reached. Please try again tomorrow.`,
          code: 'DAILY_CAP_REACHED'
        }
      });
    }

    next();
  } catch (error) {
    console.error('Error checking daily listing cap:', error);
    next(); // don't block on rate limit check error
  }
};
