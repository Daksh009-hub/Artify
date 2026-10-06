export const buildExtractionPrompt = (languageCode) => {
  const languageNames = {
    hi: 'Hindi (हिंदी)',
    pa: 'Punjabi (ਪੰਜਾਬੀ)',
    hne: 'Haryanvi (हरियाणवी dialect / Hindi script)',
    mr: 'Marathi (मराठी)',
    ta: 'Tamil (தமிழ்)'
  };

  const langName = languageNames[languageCode] || 'Hindi';

  return `
You are an expert cultural craft archivist and cataloguer for Indian rural artisans.
The audio provided is an artisan describing their handmade article in ${langName}.
You also have an image of the article being described.

TASK:
1. Accurately transcribe the spoken audio in its native script (${langName}).
2. Translate the transcript into natural English.
3. Extract structured product details strictly from what the artisan stated in the audio and what is visibly verifiable in the product image.
4. Extract the price: If the artisan mentioned an amount (e.g. "paanch sau rupaye", "500", "panj sau", "ainuru"), parse it into a numeric INR value. If no price is mentioned, return null.
5. Cross-check the artisan's speech against the image: If speech claims a material, shape, or color that directly conflicts with what is seen in the image (e.g. speech says "brass pot" but image is clearly red terracotta clay), flag it in "image_mismatches".
6. Identify which important attributes were not mentioned (missing fields) and generate up to 3 helpful follow-up questions in ${langName} asking the artisan to clarify them.

STRICT GROUNDING RULES:
- DO NOT invent, hallucinate, or extrapolate facts, materials, historical dates, or certifications.
- If a field was not mentioned and cannot be confirmed from the image, you MUST return null for that field.

Return ONLY a valid JSON object matching this exact schema:
{
  "transcript": "Original transcription in native script",
  "transcript_en": "English translation of transcription",
  "category": "Pottery | Textiles | Woodwork | Metalcraft | Jewellery | Painting | Other (or null)",
  "material": "e.g. Terracotta clay, Brass, Mulberry Silk (or null)",
  "technique": "e.g. Wheel-thrown, Handloom, Block print (or null)",
  "dimensions": "e.g. 10 inches tall, 2 meters (or null)",
  "colors": "e.g. Indigo blue and earthy red (or null)",
  "time_to_make": "e.g. 3 days, 1 week (or null)",
  "uses": "e.g. Home decor, festive rituals, gifting (or null)",
  "story": "Cultural tradition, motif meaning, or personal craft story mentioned (or null)",
  "care": "Washing/maintenance instructions mentioned (or null)",
  "price_inr": 500.0,
  "artisan_name": "Artisan name if stated (or null)",
  "missing_fields": ["dimensions", "care"],
  "follow_up_questions": [
    "क्या आप इसका माप (साइज) बता सकते हैं?",
    "इसकी देखभाल या सफाई कैसे करनी चाहिए?"
  ],
  "image_mismatches": []
}
`;
};
