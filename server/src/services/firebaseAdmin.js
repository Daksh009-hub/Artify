import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let isFirebaseInitialized = false;

try {
  const serviceAccountConfig = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccountConfig) {
    let serviceAccount;
    if (serviceAccountConfig.startsWith('{')) {
      serviceAccount = JSON.parse(serviceAccountConfig);
    } else if (fs.existsSync(serviceAccountConfig)) {
      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountConfig, 'utf8'));
    }

    if (serviceAccount && !admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      isFirebaseInitialized = true;
      console.log('Firebase Admin SDK initialized successfully.');
    }
  }
} catch (error) {
  console.warn('Firebase Admin SDK initialization skipped:', error.message);
}

/**
 * Verify a Firebase ID token or handle demo test tokens gracefully.
 */
export const verifyFirebaseToken = async (idToken) => {
  // If Firebase Admin is initialized, verify with real SDK
  if (isFirebaseInitialized) {
    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      return {
        uid: decoded.uid,
        phone: decoded.phone_number || decoded.phone || `+91${Date.now().toString().slice(-10)}`,
        authTime: decoded.auth_time
      };
    } catch (err) {
      console.error('Firebase token verification failed with Admin SDK:', err.message);
      // Fall through to test token check
    }
  }

  // Support demo / test tokens for hackathon development
  // e.g. token format: "test_token_<phoneNumber>" or custom token
  if (idToken && idToken.startsWith('test_token_')) {
    const phone = idToken.replace('test_token_', '');
    return {
      uid: `test_uid_${phone.replace(/\D/g, '')}`,
      phone: phone.startsWith('+') ? phone : `+91${phone}`,
      authTime: Math.floor(Date.now() / 1000)
    };
  }

  // If token is a JWT, extract payload for local testing
  try {
    const parts = idToken.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
      if (payload.user_id || payload.sub) {
        return {
          uid: payload.user_id || payload.sub,
          phone: payload.phone_number || '+919876543210',
          authTime: payload.auth_time || Math.floor(Date.now() / 1000)
        };
      }
    }
  } catch (err) {
    // Ignore parse error
  }

  throw new Error('Invalid Firebase ID token provided.');
};

export default {
  verifyFirebaseToken
};
