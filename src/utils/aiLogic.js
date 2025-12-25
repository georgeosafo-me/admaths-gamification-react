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

export const generateSpinWheelQuestion = async (topic, amount, count = 1) => {
    let difficulty = "Very Easy (Recall)";
    if (amount >= 10) difficulty = "Medium (Skill application)";
    if (amount >= 50) difficulty = "Hard (Analysis/Problem Solving)";
    if (amount >= 200) difficulty = "Expert (Complex Real-world)";

    const prompt = `
      Generate ${count} high-quality Additional Mathematics question(s) for the topic: "${topic}".
      Difficulty Level: ${difficulty} (Value: GHS ${amount}).
      Context: Use Ghanaian names and contexts.
      Use LaTeX $...$ for inline math.
      Return strictly JSON:
      { "questions": [
          { "type": "mcq", "question": "...", "options": [...], "correctAnswer": "...", "explanation": "..." }
      ] }
    `;
    return callGemini(prompt, true);
};

export const checkAnswerSimilarity = async (userAnswer, correctAnswer) => {
    const prompt = `
      Compare the student's answer: "${userAnswer}"
      With the correct answer: "${correctAnswer}"
      
      Determine if they have the same meaning or if the student's answer is at least 80% similar/correct in the context of a math riddle.
      Ignore casing and minor typos.
      
      Return strictly JSON:
      {
        "isCorrect": true/false,
        "similarity": 0.0 to 1.0,
        "feedback": "Short feedback on why it is correct or wrong."
      }
    `;
    const result = await callGemini(prompt, true);
    try {
        return JSON.parse(result);
    } catch (e) {
        console.error("Error parsing similarity check", e);
        // Fallback to basic check
        const basicSim = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
        return { isCorrect: basicSim, similarity: basicSim ? 1.0 : 0.0, feedback: "" };
    }
};

export const generateCrossword = async (topic, templateInstructions) => {
    const prompt = `
      You are a puzzle generator. Create a JSON object for a math crossword with THREE distinct difficulty levels.
      Each level must be a valid, interlocking puzzle that fits the EXACT same grid structure below.

      GRID STRUCTURE:
      ${templateInstructions}

      TOPIC: ${topic}.

      REQUIREMENTS:
      1. "easy": DoK Level 1. Direct application of formulas. Simple integer answers.
      2. "medium": DoK Level 2. Multi-step or working backwards.
      3. "hard": DoK Level 3. Strategic thinking, combining concepts.

      CRITICAL: The answers (and thus the "solution" object) MUST BE DIFFERENT for each level, but must always fit the digit slots.

      RETURN JSON with this exact structure:
      {
        "easy": {
          "solution": { "0-2": "digit", ... },
          "clues": { "across": [...], "down": [...] }
        },
        "medium": {
          "solution": { "0-2": "digit", ... },
          "clues": { "across": [...], "down": [...] }
        },
        "hard": {
           "solution": { "0-2": "digit", ... },
           "clues": { "across": [...], "down": [...] }
        }
      }
      
      For Clues: Use "text" for the question (with $math$) and "question" for the concept title.
      Use LaTeX $...$ for all math notation.
    `;

    return callGemini(prompt, true);
};

export const generateSpinWheelAllAmounts = async (topic, amounts) => {
    const prompt = `
      Generate ONE unique Additional Mathematics question for EACH of the following prize values: ${amounts.join(', ')}.
      Topic: "${topic}".
      
      Difficulty Guide:
      - Low values (1-5): Easy/Recall.
      - Medium values (10-50): Medium/Application.
      - High values (100-200): Hard/Analysis.

      Context: Ghana. Use LaTeX $...$.
      Return strictly JSON:
      { "questions": [
          { "amount": 1, "type": "mcq", "question": "...", "options": [...], "correctAnswer": "...", "explanation": "..." },
          ...
      ] }
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
      6. Include a "scaffolding" object with:
         - "analogy": A simple layman's explanation.
         - "activity": An interactive mini-step. Provide "steps" (list of strings showing what AI does first) and "question" (what user should do next) and "answer" (short correct answer).
      7. Include "recommendations": A list of 2 suggested activity IDs (from: 'quest', 'spin-wheel', 'riddle', 'rearrange', 'error-correction', 'hotspot', 'exam-mode') to build further intuition. Also provide a "reason" for each recommendation.

      Return strictly JSON:
      {
        "related": true,
        "message": "Only set this if related is false. Suggest searching for something relevant to ${topic}.",
        "htmlContent": "<p>Basic HTML content with $math$...</p>",
        "svg": "<svg ...>...</svg>" (optional, null if not needed),
        "suggestions": ["Subtopic 1", "Subtopic 2", "Subtopic 3"],
        "scaffolding": {
            "analogy": "...",
            "activity": {
                "steps": ["Step 1...", "Step 2..."],
                "question": "...",
                "answer": "..."
            }
        },
        "recommendations": [
            { "id": "quest", "label": "Quest", "reason": "..." },
            { "id": "riddle", "label": "Riddle", "reason": "..." }
        ]
      }
    `;
    return callGemini(prompt, true);
};

export const generateExamQuestions = async (topic, count = 20) => {
    // We split into two batches for robustness
    const batch1Count = Math.floor(count / 2);
    const batch2Count = count - batch1Count;

    const prompt1 = `
      Create an Exam Section A with ${batch1Count} questions for "${topic}".
      Question Types: Mixture of MCQ (Multiple Choice), MSQ (Multiple Select), and Boolean (True/False).
      Context: Ghana SHS Additional Mathematics.
      Use LaTeX $...$ for math.
      
      Return strictly JSON:
      { "questions": [
          { 
            "id": "unique_id_1",
            "type": "mcq", // or "msq", "boolean"
            "text": "Question text...", 
            "options": ["A", "B", "C", "D"], 
            "correctAnswer": "A" // or ["A", "C"] for msq
          }
      ] }
    `;

    const prompt2 = `
      Create an Exam Section B with ${batch2Count} structured questions for "${topic}".
      Question Types: "structured" (Multi-step fill-in).
      Context: Ghana SHS Additional Mathematics.
      Use LaTeX $...$ for math.
      
      For "structured" questions, provide a series of logical steps the student must answer.
      
      Return strictly JSON:
      { "questions": [
          { 
            "id": "unique_id_11",
            "type": "structured",
            "text": "Main problem text...", 
            "steps": [
               { "label": "Step 1: Find derivative", "answer": "2x" },
               { "label": "Step 2: Solve for x", "answer": "5" }
            ]
          }
      ] }
    `;

    try {
        const [res1, res2] = await Promise.all([
            callGemini(prompt1, true),
            callGemini(prompt2, true)
        ]);

        const q1 = res1 ? JSON.parse(res1).questions : [];
        const q2 = res2 ? JSON.parse(res2).questions : [];
        
        return JSON.stringify({ questions: [...q1, ...q2] });
    } catch (e) {
        console.error("Exam generation failed", e);
        return null;
    }
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
