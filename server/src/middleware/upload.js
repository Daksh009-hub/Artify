import multer from 'multer';

// Use memory storage for client-side uploads
const storage = multer.memoryStorage();

// Image upload filter
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(jpg|jpeg|png|webp|heic)$/i)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, WEBP, HEIC) are allowed'), false);
  }
};

// Audio upload filter
const audioFilter = (req, file, cb) => {
  const allowedMimes = [
    'audio/webm',
    'audio/wav',
    'audio/mpeg',
    'audio/mp4',
    'audio/ogg',
    'audio/m4a',
    'audio/x-m4a',
    'audio/aac'
  ];
  if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(webm|wav|mp3|m4a|ogg|aac)$/i)) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files (WEBM, WAV, MP3, M4A, OGG) are allowed'), false);
  }
};

export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB max
});

export const uploadAudio = multer({
  storage,
  fileFilter: audioFilter,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});
