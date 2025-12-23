// src/utils/aiLogic.js

// ... (previous imports and helpers same) ...
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
    let difficulty = "Very Easy (Recall)";
    if (amount >= 10) difficulty = "Medium (Skill application)";
    if (amount >= 50) difficulty = "Hard (Analysis/Problem Solving)";
    if (amount >= 200) difficulty = "Expert (Complex Real-world)";

    const prompt = `
      Generate a single high-quality Additional Mathematics question for the topic: "${topic}".
      Difficulty Level: ${difficulty} (Value: GHS ${amount}).
      Context: Use Ghanaian names and contexts.
      Use LaTeX $...$ for inline math.
      Return strictly JSON:
      { "type": "mcq", "question": "...", "options": [...], "correctAnswer": "...", "explanation": "..." }
    `;
    return callGemini(prompt, true);
};

export const generateConceptExplanation = async (topic, concept) => {
    const prompt = `
      Act as a Ghanaian Mathematics Tutor. You are helping a student with the topic: "${topic}".
      The student asked about: "${concept}".

      TASK:
      1. Check if the concept is relevant to the topic "${topic}" or general mathematics.
      2. If it is UNRELATED (e.g. asking about sports, politics, or something completely non-math), return "related": false.
      3. If it is RELATED, provide a clear explanation using Scaffolding and LaTeX $...$.
      4. Suggest 3 other areas/sub-topics under this topic that can be explored.
      5. If a diagram is helpful, provide valid SVG code.

      Return strictly JSON:
      {
        "related": true,
        "message": "Only set this if related is false. Suggest searching for something relevant to ${topic}.",
        "htmlContent": "<p>Basic HTML content with $math$...</p>",
        "svg": "<svg ...>...</svg>" (optional, null if not needed),
        "suggestions": ["Subtopic 1", "Subtopic 2", "Subtopic 3"]
      }
    `;
    return callGemini(prompt, true);
};

export const generateExamQuestions = async (topic, count = 5) => {
    const prompt = `Create mini-exam of ${count} questions for "${topic}". Context: Ghana. Use LaTeX $...$. Return strictly JSON: { "questions": [...] }`;
    return callGemini(prompt, true);
};

export const generateRiddle = async (topic, count = 1) => {
    const prompt = `
      Create ${count} fun math riddle(s) about "${topic}".
      Return strictly JSON: 
      { "riddles": [ 
          { "riddle": "...", "answer": "...", "hint": "..." } 
      ] }
    `;
    return callGemini(prompt, true);
};

export const generateRearrange = async (topic, count = 1) => {
    const prompt = `
      Create ${count} 'Rearrange the Steps' problem(s) for solving a standard problem in "${topic}".
      Return strictly JSON: 
      { "sets": [
          {
            "problem": "Solve for x...", 
            "steps": [
               { "id": 1, "text": "Step 1 text..." },
               { "id": 2, "text": "Step 2 text..." } 
            ]
          }
      ] }
      The steps array should be in the CORRECT logical order. The UI will shuffle them.
    `;
    return callGemini(prompt, true);
};

export const generateErrorCorrection = async (topic, count = 1) => {
    const prompt = `
      Create ${count} 'Identify the Error' problem(s) for "${topic}".
      Provide a solution path where ONE step is deliberately wrong.
      Return strictly JSON: 
      { "problems": [
          {
            "problem": "...",
            "steps": [
               { "id": 1, "text": "Correct step..." },
               { "id": 2, "text": "The WRONG step..." },
               { "id": 3, "text": "Follow up step..." }
            ],
            "errorStepId": 2,
            "correction": "The correct calculation should be..."
          }
      ] }
    `;
    return callGemini(prompt, true);
};

export const generateHotspot = async (topic, count = 1) => {
    const prompt = `
      Create ${count} 'Visual Hotspot' challenge description(s) for "${topic}".
      Since we cannot generate images, describe a scenario where the student must identify a part.
      Return strictly JSON: 
      { "challenges": [
          {
            "description": "Imagine a triangle ABC...",
            "question": "Which vertex corresponds to...",
            "options": ["A", "B", "C"],
            "correctAnswer": "A",
            "explanation": "Vertex A is the..."
          }
      ] }
    `;
    return callGemini(prompt, true);
};
