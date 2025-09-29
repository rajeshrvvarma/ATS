// This function handles all calls to the Gemini API.

// It reads the secret API key from the Netlify environment variables.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

export const callGeminiAPI = async (prompt, systemInstruction) => {
    // If the API key is missing, return a clear error message.
    if (!apiKey) {
        console.error("VITE_GEMINI_API_KEY is not configured in Netlify.");
        return "The AI service is not configured correctly. The API key is missing.";
    }

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: {
            parts: [{ text: systemInstruction }]
        },
    };

    let retries = 3;
    let delay = 1000;

    while (retries > 0) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                // Check for a valid response, otherwise provide a helpful message.
                const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    return text;
                } else {
                    return "The AI generated an empty response. Please try rephrasing your question.";
                }
            } else {
                 console.error("API Error:", response.status, await response.text());
            }
        } catch (error) {
            console.error("Fetch call failed:", error);
        }

        retries--;
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
        }
    }

    // This is the fallback error message the user was seeing.
    return "Sorry, the AI service is currently unavailable. Please try again later.";
};

