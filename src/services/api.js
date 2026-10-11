import { loveData } from '../data/loveData';

const API_BASE = '/api';

/**
 * Generate a personalized romantic birthday message via Gemini AI endpoint.
 * Automatically falls back to high quality romantic text if offline or backend is absent.
 */
export async function generateAiBirthdayMessage(customPromptDetails = {}) {
  try {
    const response = await fetch(`${API_BASE}/ai/generate-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        girlfriendName: customPromptDetails.girlfriendName || loveData.girlfriendName,
        nickname: customPromptDetails.nickname || loveData.nickname,
        memories: customPromptDetails.memories || loveData.memories.map((m) => m.title),
        tone: 'poetic',
        save: true
      })
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message,
      source: data.source || 'ai'
    };
  } catch (error) {
    console.warn('API call failed, using graceful client-side fallback:', error.message);
    const fallbacks = loveData.aiFeature.defaultFallbacks;
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return {
      success: true,
      message: randomFallback.replace(/Elena/g, customPromptDetails.girlfriendName || loveData.girlfriendName),
      source: 'offline-fallback',
      note: 'Generated using local romantic poetry.'
    };
  }
}

/**
 * Fetch relationship memories (from MongoDB if active, otherwise loveData.js)
 */
export async function getMemories() {
  try {
    const res = await fetch(`${API_BASE}/memories`);
    if (res.ok) {
      const result = await res.json();
      if (result.data && result.data.length > 0) {
        return result.data;
      }
    }
  } catch (err) {
    console.log('Using local memory data:', err.message);
  }
  return loveData.memories;
}

/**
 * Save custom memory
 */
export async function saveMemory(memoryData) {
  try {
    const res = await fetch(`${API_BASE}/memories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memoryData)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Could not save memory to server:', err.message);
  }
  return { success: true, data: memoryData };
}

/**
 * Fetch birthday messages
 */
export async function getBirthdayMessages() {
  try {
    const res = await fetch(`${API_BASE}/birthday`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Using default birthday letter');
  }
  return { success: true, data: [] };
}
