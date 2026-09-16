/**
 * Pronunciation audio utility for Mandarin (zh-CN) using Web Speech API
 */
export function speakMandarin(text: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.85; // Slightly slower for language learners
    utterance.pitch = 1.0;

    // Pick Chinese voice if available
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(
      v => v.lang.toLowerCase().startsWith('zh') || 
           v.lang.toLowerCase().includes('cmn') || 
           v.name.toLowerCase().includes('chinese') ||
           v.name.toLowerCase().includes('mandarin')
    );
    if (zhVoice) {
      utterance.voice = zhVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    return false;
  }
}
