import { Word, PronunciationEvaluation, PronunciationWordMatch } from '../types';

/**
 * Normalizes Chinese text and pinyin for comparison
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'，。！？、“”]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

/**
 * Tokenizes and identifies dictionary words inside a Chinese transcript
 * using greedy longest-matching against the app's dictionary.
 */
export function identifyWordsInTranscript(
  transcript: string,
  allWords: Word[]
): { recognized: PronunciationWordMatch[]; unknown: string[]; orderedWords: Word[] } {
  const cleanTranscript = transcript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'，。！？、“”]/g, '').trim();
  if (!cleanTranscript) {
    return { recognized: [], unknown: [], orderedWords: [] };
  }

  // Sort words by Hanzi length descending (longest match first)
  const sortedWords = [...allWords].sort((a, b) => b.hanzi.length - a.hanzi.length);

  const recognized: PronunciationWordMatch[] = [];
  const orderedWords: Word[] = [];
  const unknown: string[] = [];

  let currentIndex = 0;
  while (currentIndex < cleanTranscript.length) {
    let matchedWord: Word | null = null;
    let matchLength = 0;

    // Try matching dictionary words at currentIndex
    for (const w of sortedWords) {
      if (cleanTranscript.startsWith(w.hanzi, currentIndex)) {
        matchedWord = w;
        matchLength = w.hanzi.length;
        break;
      }
    }

    if (matchedWord) {
      recognized.push({
        word: matchedWord,
        matchedText: matchedWord.hanzi,
        isRecognized: true,
        pinyin: matchedWord.label,
      });
      orderedWords.push(matchedWord);
      currentIndex += matchLength;
    } else {
      // Unrecognized character or token
      const char = cleanTranscript[currentIndex];
      if (char.trim()) {
        unknown.push(char);
      }
      currentIndex += 1;
    }
  }

  return { recognized, unknown, orderedWords };
}

/**
 * Evaluates spoken Mandarin against grammar rules and optional target sentence
 */
export function evaluatePronunciation(
  transcript: string,
  allWords: Word[],
  checkIsValidSentence: (sequence: Word[]) => boolean,
  targetHanzi?: string,
  targetPinyin?: string
): PronunciationEvaluation {
  const { recognized, unknown, orderedWords } = identifyWordsInTranscript(transcript, allWords);

  // Check grammar validity of the ordered words
  const isGrammarValid = checkIsValidSentence(orderedWords);

  // Analyze grammatical order
  let orderFollowed = true;
  let grammarTitle = 'Estrutura Correta';
  let grammarDesc = 'As palavras reconhecidas formam uma frase gramaticalmente coesa em Mandarim.';
  const missingElements: string[] = [];

  const hasPronoun = orderedWords.some(w => w.category === 'pronoun');
  const hasVerb = orderedWords.some(w => w.category === 'verb');
  const hasTime = orderedWords.some(w => w.id === 'jintian' || w.id === 'mingtian' || w.id === 'zuotian' || w.id === 'xianzai');
  const hasPlace = orderedWords.some(w => w.id === 'zai' || w.id === 'xuexiao' || w.id === 'chaoshi');

  if (orderedWords.length > 0) {
    // Check if Time or Place came after Verb without complement
    const firstVerbIndex = orderedWords.findIndex(w => w.category === 'verb');
    const timeIndex = orderedWords.findIndex(w => w.id === 'jintian' || w.id === 'mingtian' || w.id === 'zuotian');

    if (firstVerbIndex !== -1 && timeIndex !== -1 && timeIndex > firstVerbIndex) {
      orderFollowed = false;
      grammarTitle = 'Aviso de Ordem Temporal';
      grammarDesc = 'No Mandarim, marcadores de tempo (como 今天/明天) devem anteceder o verbo da ação (Sujeito + Tempo + Verbo + Objeto).';
    } else if (!hasVerb && !orderedWords.some(w => w.category === 'adjective' || w.category === 'etiquette')) {
      orderFollowed = false;
      grammarTitle = 'Frase Incompleta';
      grammarDesc = 'A sentença parece não conter um verbo ou predicado adjetival final.';
      missingElements.push('Verbo de Ação ou Predicado');
    } else if (isGrammarValid) {
      grammarTitle = 'Regra Gramatical Cumprida! ✅';
      grammarDesc = 'Ordem respeitada com sucesso (SVO / Tempo e Local antes do Verbo).';
    } else {
      grammarTitle = 'Frase Parcialmente Formada';
      grammarDesc = 'Palavras reconhecidas no dicionário, mas a frase precisa de um complemento ou objeto para fechamento.';
    }
  } else {
    orderFollowed = false;
    grammarTitle = 'Nenhuma Palavra do Dicionário Identificada';
    grammarDesc = 'Fale mais perto do microfone com clareza nos tons, ou selecione uma frase exemplo.';
  }

  // Calculate score
  let score = 0;
  if (orderedWords.length > 0) {
    // Base score from recognition
    const recognitionRatio = orderedWords.length / (orderedWords.length + unknown.length);
    score += Math.round(recognitionRatio * 50);

    // Grammar bonus
    if (isGrammarValid) score += 35;
    else if (orderFollowed) score += 20;
    else score += 10;

    // Bonus for length and complexity
    score += Math.min(15, orderedWords.length * 3);
  }

  score = Math.min(100, Math.max(0, score));

  // Comparison with target if provided
  let targetComparison: PronunciationEvaluation['targetComparison'] | undefined;
  if (targetHanzi) {
    const normTarget = normalizeText(targetHanzi);
    const normTranscript = normalizeText(transcript);
    const isExact = normTarget === normTranscript;

    // Simple character overlap accuracy
    let matchChars = 0;
    for (const char of normTranscript) {
      if (normTarget.includes(char)) matchChars++;
    }
    const accuracy = normTarget.length > 0 
      ? Math.min(100, Math.round((matchChars / normTarget.length) * 100))
      : 0;

    targetComparison = {
      targetHanzi,
      targetPinyin: targetPinyin || '',
      isExactMatch: isExact,
      accuracyPercent: isExact ? 100 : accuracy,
    };

    if (isExact) score = 100;
  }

  // Fluency feedback message
  let fluencyFeedback = '';
  if (score >= 90) {
    fluencyFeedback = 'Excelente pronúncia! Pronúncia nítida, vocabulário perfeitamente mapeado e gramática impecável.';
  } else if (score >= 70) {
    fluencyFeedback = 'Muito bom! A maior parte das palavras foi reconhecida e a ordem estrutural está correta.';
  } else if (score >= 50) {
    fluencyFeedback = 'Bom esforço! Atenção aos tons do Mandarim e à dicção das consoantes iniciais (zh, ch, sh, j, q, x).';
  } else {
    fluencyFeedback = 'Tente novamente falando pausadamente cada sílaba. Use o botão de áudio para ouvir o modelo antes de repetir.';
  }

  return {
    rawTranscript: transcript,
    recognizedWords: recognized,
    unknownTokens: unknown,
    isValidGrammar: isGrammarValid,
    grammarDiagnostic: {
      title: grammarTitle,
      description: grammarDesc,
      orderFollowed,
      missingElements: missingElements.length > 0 ? missingElements : undefined,
    },
    score,
    fluencyFeedback,
    targetComparison,
  };
}
