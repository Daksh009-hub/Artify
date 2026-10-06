import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const DEFAULT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-1.5-flash';
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-1.5-flash';

/**
 * Execute a Gemini API call with timeout and exponential backoff retry.
 */
export const callGeminiWithRetry = async (fn, maxRetries = 3, timeoutMs = 25000) => {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  let attempt = 0;
  let delay = 1000;

  while (attempt < maxRetries) {
    try {
      // Timeout promise
      let timeoutId;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`Gemini request timed out after ${timeoutMs / 1000} seconds.`));
        }, timeoutMs);
      });

      const result = await Promise.race([fn(), timeoutPromise]);
      clearTimeout(timeoutId);
      return result;
    } catch (err) {
      attempt++;
      const isRateLimit = err.status === 429 ||
        (err.message && (err.message.includes('429') || err.message.includes('RESOURCE_EXHAUSTED')));
      const isServerUnavailable = err.status === 503 ||
        (err.message && err.message.includes('503'));

      if ((isRateLimit || isServerUnavailable) && attempt < maxRetries) {
        console.warn(`Gemini rate limited/unavailable. Retrying attempt ${attempt}/${maxRetries} after ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        delay *= 2; // exponential backoff
      } else {
        throw err;
      }
    }
  }
};

/**
 * Get Generative Model instance with standard generation config
 */
export const getGenerativeModel = (modelName = DEFAULT_MODEL, config = {}) => {
  if (!genAI) {
    throw new Error('Google Gemini API client is not initialized. Please set GEMINI_API_KEY in .env');
  }
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.2,
      ...config
    }
  });
};

export default {
  genAI,
  callGeminiWithRetry,
  getGenerativeModel
};
