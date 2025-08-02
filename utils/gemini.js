require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

const getGeminiResponse = async (message) => {
  try {
    console.log('Calling Gemini API with message:', message);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API success, data:', data);

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
  } catch (error) {
    console.error('Error in getGeminiResponse:', error);
    throw error;
  }
};

module.exports = getGeminiResponse;
