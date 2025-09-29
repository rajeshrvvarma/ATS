// src/api/gemini.js

/**
 * Handles API calls to the Gemini model with exponential backoff for retries.
 * @param {string} prompt - The user's prompt to send to the model.
 * @param {string} systemInstruction - The system instruction to guide the model's behavior.
 * @returns {Promise<string>} - The generated text response from the model.
 */
export const callGeminiAPI = async (prompt, systemInstruction) => {
    // The API key is handled by the execution environment (e.g., Canvas).
    // In a real-world deployment, you would use environment variables.
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: {
            parts: [{ text: systemInstruction }]
        },
    };

    let response;
    let retries = 3;
    let delay = 1000;

    while (retries > 0) {
        try {
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                // Safely access the text from the response
                return result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response right now.";
            }
        } catch (error) {
            console.error("API call failed:", error);
            // Don't log retries as user-facing errors
        }

        retries--;
        if (retries > 0) {
             await new Promise(resolve => setTimeout(resolve, delay));
             delay *= 2; // Exponential backoff
        }
    }

    return "Sorry, the AI service is currently unavailable. Please try again later.";
};
