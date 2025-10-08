// This function handles all calls to the Gemini API.

export const callGeminiAPI = async (prompt, systemInstruction) => {
    // It reads the secret API key from the Netlify environment variables.
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        // Don't log sensitive configuration details in production
        return "The AI service is not configured correctly. Please contact support.";
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: {
            parts: [{ text: systemInstruction }]
        },
    };

    let retries = 3;
    let delay = 1500; // Increased initial delay for better stability

    while (retries > 0) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    return text;
                } else {
                    // This handles cases where the API returns a success status but an empty response
                    return "The AI generated an empty response. Please try rephrasing your question.";
                }
            } else {
                 // Log error for debugging but don't expose sensitive details
                 if (import.meta.env.DEV) {
                     console.error("API Error:", response.status, await response.text());
                 }
            }
        } catch (error) {
            // Only log in development mode to prevent information leakage
            if (import.meta.env.DEV) {
                console.error("Fetch call failed:", error);
            }
        }

        retries--;
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
        }
    }

    // This is the fallback error message.
    return "Sorry, the AI service is currently unavailable. Please check your connection and try again later.";
};

