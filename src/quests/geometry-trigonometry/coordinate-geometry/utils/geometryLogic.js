// src/quests/geometry-trigonometry/coordinate-geometry/utils/geometryLogic.js

// --- HELPER: PCM to WAV Converter ---
export const pcmToWav = (base64PCM, sampleRate = 24000) => {
    const binaryString = window.atob(base64PCM);
    const len = binaryString.length;
    const buffer = new ArrayBuffer(44 + len);
    const view = new DataView(buffer);
    
    const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + len, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, len, true);
    
    const bytes = new Uint8Array(buffer, 44);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    return new Blob([buffer], { type: 'audio/wav' });
  };

// --- GEMINI API INTEGRATION ---
export const callGemini = async (prompt, isJson = false, apiKey = "") => {
    // Check environment variable as fallback if not passed directly
    const effectiveKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;

    // If no API key is provided, return mock or null to avoid errors if not configured
    if (!effectiveKey) {
        console.warn("Gemini API Key is missing.");
        return null;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${effectiveKey}`;

    const generationConfig = isJson ? {
        responseMimeType: "application/json"
    } : {};

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig
    };

    let attempt = 0;
    const maxRetries = 3;
    const delays = [1000, 2000, 4000];

    while (attempt <= maxRetries) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
        
        text = text.replace(/^```json/, '').replace(/^```html/, '').replace(/^```/, '').replace(/```$/, '').trim();
        
        if (!isJson) {
            text = text.replace(/\$\$/g, '$'); 
            text = text.replace(/\\\[/g, '$');
            text = text.replace(/\\\]/g, '$');
        }
        
        return text;

      } catch (error) {
        console.error("Gemini API Error:", error);
        if (attempt === maxRetries) return null;
        await new Promise(resolve => setTimeout(resolve, delays[attempt]));
        attempt++;
      }
    }
  };

  export const callGeminiTTS = async (text, apiKey = "") => {
    const effectiveKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;

    // If no API key is provided, return null
    if (!effectiveKey) {
        return null;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${effectiveKey}`;
    
    const cleanText = text.replace(/\$/g, '');

    const payload = {
      contents: [{ parts: [{ text: `Read this math clue clearly for a student: ${cleanText}` }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Aoede" 
            }
          }
        }
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`TTS API Error: ${response.status}`);

      const data = await response.json();
      const inlineData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      
      if (inlineData) {
         let sampleRate = 24000;
         if (inlineData.mimeType) {
             const match = inlineData.mimeType.match(/rate=(\d+)/);
             if (match) sampleRate = parseInt(match[1], 10);
         }
         return pcmToWav(inlineData.data, sampleRate);
      }
      return null;
    } catch (e) {
      console.error("TTS failed", e);
      return null;
    }
  };
