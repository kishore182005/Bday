import dotenv from 'dotenv';
dotenv.config();

/**
 * Service to generate personalized romantic birthday messages using Gemini AI.
 * Includes intelligent graceful fallbacks so the user's experience is NEVER interrupted
 * even if the API key is not yet set, offline, or experiencing network hiccups.
 */

const FALLBACK_MESSAGES = [
  "My dearest Sharmila, unakku birthday wish panna oru simple 'Happy Birthday' nu sonna podhathu. Un smile-ku naan romba weak, and having you in my life makes every ordinary day feel magical. Since 17/01/2024, you turned my world into an endless paradise. Happy Birthday my favourite human! ❤️",
  "Happy Birthday, my beautiful Sharmila ❤️ You don't just exist in my world—you make it breathe, dream, and flourish. Nee pesura konjam neram kooda, enakku full day happiness. May this 13th of October shower you with boundless blessings and sweet smiles!",
  "To the most radiant girl in the universe, Sharmila: Happy Birthday! Distance irundhaalum, my heart-ku nee always closest. I loved you yesterday, I adore you today, and I will choose you in every lifetime. En world-la favourite person? Obviously YOU! ❤️"
];

export async function generateRomanticMessage({ girlfriendName = 'Sharmila', nickname = 'En Thangom', memories = [], tone = 'poetic' } = {}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    console.warn('⚠️ [Gemini Service] GEMINI_API_KEY not configured. Utilizing premium curated romantic fallback message for Sharmila.');
    const randomFallback = FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
    return {
      success: true,
      message: randomFallback.replace(/Sharmila/g, girlfriendName),
      source: 'fallback-curated',
      note: 'To use live Gemini AI generation, provide a valid GEMINI_API_KEY in your .env file.'
    };
  }

  try {
    // Try using @google/genai first, or fetch standard Gemini REST API
    const prompt = `You are a deeply romantic, poetic, cinematic writer crafting an unforgettable, intimate birthday letter for a boyfriend to give his girlfriend.

Girlfriend's Name: ${girlfriendName}
${nickname ? `Sweet Nickname: ${nickname}` : ''}
Tone: Romantic, cinematic, emotional, dreamy, deeply affectionate, not cheesy or generic.
Context:
${memories && memories.length ? `Special memories to weave subtly into the message: ${memories.map(m => m.title || m).join(', ')}` : 'A couple deeply in love celebrating her birthday.'}

Instructions:
1. Write a 3 to 4 paragraph deeply moving, elegant love letter wishing her a Happy Birthday.
2. Make it feel authentic, cinematic, like dialogue from a romantic masterpiece.
3. Express genuine gratitude for her presence, her laugh, her quirks, and how she makes ordinary life feel magical.
4. End with an evocative, romantic promise for the future.
5. Do NOT include markdown meta headers like "Dear..." or "Subject:" - start straight with her name or an intimate opening, and end with a romantic signoff.`;

    // Direct REST call to Gemini 2.5 Flash / 1.5 Flash endpoint using fetch (compatible with any Node 18+)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.85,
            topP: 0.95,
            maxOutputTokens: 500
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error response:', errText);
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('No candidate text received from Gemini API');
    }

    return {
      success: true,
      message: candidateText.trim(),
      source: 'gemini-ai'
    };
  } catch (error) {
    console.error('Error during Gemini API generation:', error.message);
    const randomFallback = FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
    return {
      success: true,
      message: randomFallback.replace(/Elena/g, girlfriendName),
      source: 'fallback-error',
      error: error.message
    };
  }
}
