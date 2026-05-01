// api/translate.js
// Vercel serverless function — GROQ_API_KEY never leaves this server

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama3-8b-8192';

const LANGUAGE_NAMES = {
  en: 'English',
  fr: 'French',
  rw: 'Kinyarwanda',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, targetLang } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'No text provided' });
  }

  const apiKey = process.env.GROQ_API_KEY; // No REACT_APP_ prefix — server only
  if (!apiKey) {
    return res.status(500).json({ error: 'Translation service not configured' });
  }

  const langName = LANGUAGE_NAMES[targetLang] || 'English';

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 512,
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the given text into ${langName}. 
Return ONLY the translated text with no explanations, no quotes, no preamble. 
Keep the natural, personal tone of the original. If the text is already in ${langName}, return it unchanged.`,
          },
          { role: 'user', content: text },
        ],
      }),
    });

    if (!response.ok) throw new Error(`Groq error: ${response.status}`);
    const data = await response.json();
    const translated = data.choices?.[0]?.message?.content?.trim() || text;
    return res.status(200).json({ translated });
  } catch (error) {
    console.error('Translation failed:', error);
    return res.status(500).json({ error: 'Translation failed', fallback: text });
  }
}
