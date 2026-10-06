import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, RotateCcw, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const VoiceRecorder = ({ onRecordingComplete, isProcessing = false }) => {
  const { t, i18n } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Guided prompt cues based on selected language
  const promptQuestions = {
    hi: [
      'यह क्या है और इसका क्या नाम है?',
      'यह किस सामग्री (कच्चे माल) से बना है?',
      'इसे बनाने में कितना समय लगता है और क्या तकनीक है?',
      'इसकी कोई खास कहानी या सांस्कृतिक परंपरा?',
      'इसका आकार और अनुमानित मूल्य क्या है?'
    ],
    pa: [
      'ਇਹ ਕੀ ਹੈ ਅਤੇ ਇਸਦਾ ਨਾਂ ਕੀ ਹੈ?',
      'ਇਹ ਕਿਹੜੀ ਸਮੱਗਰੀ ਤੋਂ ਬਣਿਆ ਹੈ?',
      'ਇਸਨੂੰ ਬਣਾਉਣ ਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗਦਾ ਹੈ?',
      'ਕੋਈ ਖਾਸ ਪਰੰਪਰਾ ਜਾਂ ਵਿਰਸੇ ਦੀ ਕਹਾਣੀ?',
      'ਇਸਦਾ ਨਾਪ ਅਤੇ ਕੀਮਤ ਕਿੰਨੀ ਹੈ?'
    ],
    mr: [
      'हे काय आहे आणि याचे नाव काय?',
      'हे कोणत्या साहित्यापासून बनवले आहे?',
      'बनवण्यासाठी किती वेळ लागतो?',
      'यामागे कोणती परंपरा किंवा कथा आहे?',
      'याचा आकार आणि अंदाजे किंमत काय आहे?'
    ],
    ta: [
      'இது என்ன, இதன் பெயர் என்ன?',
      'இது எந்த மூலப்பொருளால் செய்யப்பட்டது?',
      'இதைச் செய்ய எவ்வளவு நேரம் ஆகும்?',
      'இதன் பின்னணியில் உள்ள கதை அல்லது பாரம்பரியம்?',
      'இதன் அளவு மற்றும் விலை என்ன?'
    ],
    en: [
      'What is this article and what is it called?',
      'What natural materials is it made of?',
      'What technique is used and how long does it take?',
      'Is there a cultural story or heritage behind it?',
      'What are the dimensions and the price?'
    ]
  };

  const currentQuestions = promptQuestions[i18n.language] || promptQuestions.hi;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMsg(null);
    audioChunksRef.current = [];
    setSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || 'audio/webm'
        });
        setHasRecorded(true);
        // Stop all tracks to turn off mic indicator
        stream.getTracks().forEach(track => track.stop());

        if (onRecordingComplete) {
          onRecordingComplete(audioBlob);
        }
      };

      mediaRecorder.start(250); // collect in 250ms chunks
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev >= 180) { // 3 minutes maximum
            stopRecording();
            return 180;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error('Microphone access error:', err);
      setErrorMsg('कृपया माइक्रोफ़ोन की अनुमति दें (Please allow microphone access)');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleReset = () => {
    setHasRecorded(false);
    setSeconds(0);
    audioChunksRef.current = [];
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Guided Questions Box */}
      <div className="w-full bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-left shadow-xs">
        <div className="flex items-center gap-2 text-artify-terracotta font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>बोलते समय ये बातें बताएं (Helpful Cues):</span>
        </div>
        <ul className="space-y-1.5 text-xs text-stone-700">
          {currentQuestions.map((q, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-amber-800 font-bold">•</span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </div>

      {errorMsg && (
        <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Recording Display & Big Button */}
      <div className="flex flex-col items-center gap-3 py-4">
        {/* Animated Ripple / Waveform Indicator */}
        <div className="relative">
          {isRecording && (
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
          )}

          {!isRecording ? (
            <button
              type="button"
              disabled={isProcessing}
              onClick={startRecording}
              className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-artify-terracotta to-amber-500 text-white flex flex-col items-center justify-center shadow-xl shadow-amber-900/25 hover:scale-105 active:scale-95 transition disabled:opacity-50"
              aria-label="Start recording"
            >
              <Mic className="w-10 h-10 mb-1" />
              <span className="text-[11px] font-bold">बोलें</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="relative w-24 h-24 rounded-full bg-red-600 text-white flex flex-col items-center justify-center shadow-xl shadow-red-900/30 hover:scale-105 active:scale-95 transition animate-pulse"
              aria-label="Stop recording"
            >
              <Square className="w-9 h-9 mb-1" />
              <span className="text-[11px] font-bold">रोकें</span>
            </button>
          )}
        </div>

        {/* Timer & Status */}
        <div className="text-center">
          <div className="text-lg font-mono font-bold text-stone-800">
            {formatTime(seconds)} <span className="text-xs text-stone-600 font-normal">/ 3:00</span>
          </div>
          <div className="text-xs font-semibold text-stone-600 mt-0.5">
            {isRecording
              ? 'सुन रहे हैं... कृपया बोलते रहें (Recording...)'
              : isProcessing
              ? 'AI आवाज़ को समझ रहा है... (Analyzing speech...)'
              : hasRecorded
              ? 'ऑडियो रिकॉर्ड हो गया (Recorded)'
              : 'माइक दबाकर बोलना शुरू करें (Tap to speak)'}
          </div>
        </div>

        {/* Re-record button */}
        {hasRecorded && !isRecording && !isProcessing && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>पुनः रिकॉर्ड करें (Re-record)</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
