import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const PhotoCapture = ({ onPhotoSelected, isUploading = false }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Client-side compression
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1600;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve({ file: compressedFile, previewUrl: canvas.toDataURL('image/jpeg', 0.85) });
              } else {
                reject(new Error('Canvas compression failed'));
              }
            },
            'image/jpeg',
            0.85
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    try {
      const { file: compressedFile, previewUrl } = await compressImage(file);
      setPreview(previewUrl);
      if (onPhotoSelected) {
        onPhotoSelected(compressedFile, previewUrl);
      }
    } catch (err) {
      console.error('Image compression error:', err);
      setErrorMsg('फोटो लोड करने में समस्या हुई। कृपया दोबारा प्रयास करें।');
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Capture / Upload Options */}
      {!preview ? (
        <div className="w-full flex flex-col gap-3">
          {/* Real-time Tips Box */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-left shadow-xs">
            <div className="flex items-center gap-2 text-artify-terracotta font-bold text-xs uppercase tracking-wider mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>अच्छी फोटो के लिए सुझाव (Photo Tips):</span>
            </div>
            <ul className="text-xs text-stone-700 space-y-1">
              <li>• उत्पाद को सादे कपड़े या फर्श पर रखें।</li>
              <li>• प्राकृतिक और पर्याप्त रोशनी का ध्यान रखें।</li>
              <li>• कैमरा स्थिर रखें ताकि फोटो धुंधली न हो।</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-tr from-artify-terracotta to-amber-600 text-white rounded-2xl shadow-md hover:opacity-95 active:scale-98 transition"
            >
              <Camera className="w-8 h-8 mb-2" />
              <span className="text-sm font-bold">कैमरा खोलें</span>
              <span className="text-[10px] text-amber-100">Take Photo</span>
            </button>

            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 bg-white border border-stone-300 text-stone-800 rounded-2xl shadow-sm hover:bg-stone-50 active:scale-98 transition"
            >
              <ImageIcon className="w-8 h-8 mb-2 text-artify-terracotta" />
              <span className="text-sm font-bold">गैलरी से चुनें</span>
              <span className="text-[10px] text-stone-600">From Gallery</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center gap-3">
          <div className="relative w-full aspect-square max-w-sm rounded-2xl overflow-hidden shadow-md border border-stone-200">
            <img src={preview} alt="Selected Craft" className="w-full h-full object-cover" />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold">{t('wizard.enhancing')}</span>
              </div>
            )}
          </div>

          {!isUploading && (
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-xs text-stone-600 hover:text-stone-900 underline font-semibold"
            >
              दूसरी फोटो चुनें (Change Photo)
            </button>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};

export default PhotoCapture;
