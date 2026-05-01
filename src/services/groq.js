// src/services/groq.js
// Calls your Vercel serverless function — no API key in the browser

export async function translateText(text, targetLang) {
  if (!text || !text.trim()) return text;

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.translated || text;
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // Graceful fallback to original
  }
}

export async function translateDriverProfile(driver, targetLang) {
  if (targetLang === 'en') return driver; // No translation needed for English source

  const [translatedBio, translatedExperience] = await Promise.all([
    translateText(driver.bio, targetLang),
    translateText(driver.experience, targetLang),
  ]);

  return { ...driver, bio: translatedBio, experience: translatedExperience };
}
