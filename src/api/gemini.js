// Provider-agnostic AI caller with safe GPT-5 enablement and fallbacks.

const callOpenAI = async (prompt, systemInstruction) => {
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!openaiKey) return null;

    // If explicitly enabled, attempt GPT-5; otherwise honor configured model or fallback.
    const enableGpt5 = String(import.meta.env.VITE_ENABLE_GPT5 || '').toLowerCase() === 'true';
    const requestedModel = enableGpt5 ? 'gpt-5' : (import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini');
    const fallbackModel = import.meta.env.VITE_OPENAI_FALLBACK_MODEL || 'gpt-4o-mini';

    const chatBody = {
        model: requestedModel,
        messages: [
            ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
            { role: 'user', content: prompt }
        ],
        temperature: 0.7
    };

    const doRequest = async (model) => {
        const body = { ...chatBody, model };
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify(body)
        });
        return res;
    };

    // Try requested model first, then fallback if needed
    let res = await doRequest(requestedModel);
    if (!res.ok && fallbackModel && fallbackModel !== requestedModel) {
        if (import.meta.env.DEV) {
            console.warn('OpenAI model failed, falling back:', requestedModel, '->', fallbackModel, await res.text());
        }
        res = await doRequest(fallbackModel);
    }

    if (!res.ok) {
        if (import.meta.env.DEV) console.error('OpenAI API error:', res.status, await res.text());
        return null;
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    return text || null;
};

const callGemini = async (prompt, systemInstruction) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return null;

    const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-preview-05-20';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {})
    };

    const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        if (import.meta.env.DEV) console.error('Gemini API error:', res.status, await res.text());
        return null;
    }

    const result = await res.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;
};

export const callGeminiAPI = async (prompt, systemInstruction = '') => {
    // Read provider; default to gemini for backward compatibility.
    const provider = (import.meta.env.VITE_AI_PROVIDER || 'gemini').toLowerCase();

    // Exponential backoff across calls regardless of provider
    let retries = 3;
    let delay = 1500;

    while (retries > 0) {
        try {
            let text = null;
            if (provider === 'openai') {
                text = await callOpenAI(prompt, systemInstruction);
                // If OpenAI not configured/failed, try Gemini as safety net
                if (!text) text = await callGemini(prompt, systemInstruction);
            } else {
                text = await callGemini(prompt, systemInstruction);
                // If Gemini not configured/failed and GPT-5 is enabled, optionally try OpenAI
                if (!text) text = await callOpenAI(prompt, systemInstruction);
            }

            if (text) return text;
        } catch (err) {
            if (import.meta.env.DEV) console.error('AI call failed:', err);
        }

        retries--;
        if (retries > 0) {
            await new Promise(r => setTimeout(r, delay));
            delay *= 2;
        }
    }

    return "Sorry, the AI service is currently unavailable. Please check your connection and try again later.";
};

// Backward-compatible export names
export const generateGeminiResponse = callGeminiAPI;
export const analyzeWithGemini = callGeminiAPI;

