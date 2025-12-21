// src/utils/aiLogic.js

// --- HELPER: PCM to WAV Converter (for TTS) ---
const pcmToWav = (base64PCM, sampleRate = 24000) => {
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

// --- CORE GEMINI CALL ---
export const callGemini = async (prompt, isJson = false, apiKey = "") => {
    const effectiveKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
    if (!effectiveKey) {
        console.warn("Gemini API Key is missing.");
        return null;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${effectiveKey}`;

    const generationConfig = isJson ? { responseMimeType: "application/json" } : {};
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig
    };

    try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        // Clean markdown code blocks if any
        text = text.replace(/^```json/, '').replace(/^```html/, '').replace(/^```/, '').replace(/```$/, '').trim();
        return text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return null;
    }
};

export const callGeminiTTS = async (text, apiKey = "") => {
    const effectiveKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
    if (!effectiveKey) return null;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${effectiveKey}`;
    
    // Simple math cleanup for TTS
    const cleanText = text.replace(/\$/g, ''); 

    const payload = {
      contents: [{ parts: [{ text: `Read this math text clearly: ${cleanText}` }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } }
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
         return pcmToWav(inlineData.data, 24000);
      }
      return null;
    } catch (e) {
      console.error("TTS failed", e);
      return null;
    }
};

// --- SPECIALIZED PROMPT BUILDERS ---

export const generateSpinWheelQuestion = async (topic, amount) => {
    // Map amount to Depth of Knowledge (DoK) or difficulty
    // GHS 1-5: Recall (DoK 1)
    // GHS 10-20: Skill/Concept (DoK 2)
    // GHS 50-100: Strategic Thinking (DoK 3)
    // GHS 200: Extended Thinking (DoK 4)
    
    let difficulty = "Very Easy (Recall)";
    if (amount >= 10) difficulty = "Medium (Skill application)";
    if (amount >= 50) difficulty = "Hard (Analysis/Problem Solving)";
    if (amount >= 200) difficulty = "Expert (Complex Real-world)";

    const prompt = `
      Generate a single high-quality Additional Mathematics question for the topic: "${topic}".
      
      Difficulty Level: ${difficulty} (Value: GHS ${amount}).
      Context: Use Ghanaian names (e.g., Kwame, Ama, Kofi) and contexts (e.g., markets, cedi, local geography) where appropriate for word problems.
      
      Return strictly JSON:
      {
        "type": "mcq",
        "question": "Question text here (use LaTeX $...$ for math)",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option A",
        "explanation": "Short explanation of the solution"
      }
    `;
    
    return callGemini(prompt, true);
};

export const generateConceptExplanation = async (topic, concept) => {
    const prompt = `
      Act as a friendly Ghanaian Mathematics Tutor.
      Explain the concept of "${concept}" under the topic "${topic}" to a Senior High School student.
      
      Guidelines:
      1. Use a "Scaffolding" approach: Start simple, build up to the formula.
      2. Use Ghanaian analogies or real-life examples (e.g., trotro routes for vectors, market profits for algebra).
      3. Format with HTML tags (<h3>, <p>, <ul>, <b>).
      4. Use LaTeX $...$ for all math expressions.
      5. Keep it engaging and intuitive.
    `;
    return callGemini(prompt, false);
};

export const generateExamQuestions = async (topic, count = 5) => {
    const prompt = `
      Create a mini-exam of ${count} questions for the topic: "${topic}".
      Include a mix of Multiple Choice (MCQ) and Short Answer.
      
      Context: Ghanaian SHS Additional Mathematics.
      
      Return strictly JSON:
      {
        "questions": [
          {
            "id": 1,
            "type": "mcq", 
            "text": "Question text...",
            "options": ["A", "B", "C", "D"],
            "correctAnswer": "A"
          },
          {
            "id": 2,
            "type": "short",
            "text": "Question text...",
            "correctAnswer": "Answer string" 
          }
        ]
      }
    `;
    return callGemini(prompt, true);
};
