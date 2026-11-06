import { Word } from '../types';

export interface ProblemWordRecord {
  wordId: string;
  hanzi: string;
  pinyin: string;
  portuguese: string;
  failCount: number;
  successCount: number;
  lastFailedAt: number;
  lastErrorReason?: string;
  recentPhrases: string[];
}

export interface WordPronunciationEvaluation {
  wordId?: string;
  hanzi: string;
  pinyin: string;
  spokenPinyin?: string;
  spokenHanzi?: string;
  isCorrect: boolean;
  errorType?: 'none' | 'tone' | 'phoneme' | 'omitted' | 'substituted';
  tip?: string;
}

export interface PronunciationDrillSentence {
  id: string;
  hanzi: string;
  pinyin: string;
  portuguese: string;
  words: { id: string; hanzi: string; pinyin: string; translation: string }[];
  targetWordIds: string[];
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  toneFocusTip: string;
}

const STORAGE_KEY = 'fraseiro_pronunciation_mistakes_v1';

/**
 * Carrega todos os registros de palavras problemáticas do localStorage
 */
export function getRecordedMistakes(): Record<string, ProblemWordRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler erros de pronúncia do localStorage:', err);
    return {};
  }
}

/**
 * Salva os registros no localStorage
 */
export function saveRecordedMistakes(records: Record<string, ProblemWordRecord>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Erro ao salvar erros de pronúncia no localStorage:', err);
  }
}

/**
 * Retorna as palavras com maior número de falhas ordenadas decrescentemente
 */
export function getTopProblemWords(limit = 10): ProblemWordRecord[] {
  const records = getRecordedMistakes();
  return Object.values(records)
    .filter(r => r.failCount > 0)
    .sort((a, b) => {
      // Prioridade: maior número de erros relativos aos acertos, depois timestamp
      const netErrorsA = a.failCount * 2 - a.successCount;
      const netErrorsB = b.failCount * 2 - b.successCount;
      if (netErrorsB !== netErrorsA) {
        return netErrorsB - netErrorsA;
      }
      return b.lastFailedAt - a.lastFailedAt;
    })
    .slice(0, limit);
}

/**
 * Registra o resultado da pronúncia de uma palavra específica
 */
export function recordWordPronunciationOutcome(
  word: { id: string; hanzi: string; pinyin: string; translation?: string },
  isCorrect: boolean,
  reason?: string,
  phraseHanzi?: string
): ProblemWordRecord {
  const records = getRecordedMistakes();
  const existing = records[word.id] || {
    wordId: word.id,
    hanzi: word.hanzi,
    pinyin: word.pinyin,
    portuguese: word.translation || '',
    failCount: 0,
    successCount: 0,
    lastFailedAt: 0,
    recentPhrases: []
  };

  if (isCorrect) {
    existing.successCount += 1;
    // Reduz ligeiramente a taxa de erro para não ficar preso eternamente
    if (existing.failCount > 0 && existing.successCount % 2 === 0) {
      existing.failCount = Math.max(0, existing.failCount - 1);
    }
  } else {
    existing.failCount += 1;
    existing.lastFailedAt = Date.now();
    if (reason) {
      existing.lastErrorReason = reason;
    }
    if (phraseHanzi && !existing.recentPhrases.includes(phraseHanzi)) {
      existing.recentPhrases.unshift(phraseHanzi);
      if (existing.recentPhrases.length > 3) existing.recentPhrases.pop();
    }
  }

  records[word.id] = existing;
  saveRecordedMistakes(records);
  return existing;
}

/**
 * Remove uma palavra do registro de erros
 */
export function resetWordMistake(wordId: string): void {
  const records = getRecordedMistakes();
  if (records[wordId]) {
    delete records[wordId];
    saveRecordedMistakes(records);
  }
}

/**
 * Limpa todo o histórico de pronúncias problemáticas
 */
export function clearAllMistakes(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Banco de frases de treinamento de pronúncia com mapeamento de palavras e dicas de tons
 */
export const DRILL_SENTENCES: PronunciationDrillSentence[] = [
  {
    id: 'drill-mai-pingguo',
    hanzi: '我想买苹果',
    pinyin: 'wǒ xiǎng mǎi píngguǒ',
    portuguese: 'Eu quero comprar maçãs',
    words: [
      { id: 'wo', hanzi: '我', pinyin: 'wǒ', translation: 'eu' },
      { id: 'xiang', hanzi: '想', pinyin: 'xiǎng', translation: 'querer' },
      { id: 'mai', hanzi: '买', pinyin: 'mǎi', translation: 'comprar' },
      { id: 'pingguo', hanzi: '苹果', pinyin: 'píngguǒ', translation: 'maçã' }
    ],
    targetWordIds: ['mai', 'xiang', 'pingguo'],
    level: 'Iniciante',
    toneFocusTip: 'Cuidado com mǎi (买 - 3º tom descendente-ascendente). Não confunda com mài (卖 - 4º tom descendente).'
  },
  {
    id: 'drill-chaoshi-yidalimian',
    hanzi: '他想去超市买意大利面',
    pinyin: 'tā xiǎng qù chāoshì mǎi yìdàlìmiàn',
    portuguese: 'Ele quer ir ao supermercado comprar macarrão',
    words: [
      { id: 'ta', hanzi: '他', pinyin: 'tā', translation: 'ele' },
      { id: 'xiang', hanzi: '想', pinyin: 'xiǎng', translation: 'querer' },
      { id: 'qu_verb', hanzi: '去', pinyin: 'qù', translation: 'ir' },
      { id: 'chaoshi', hanzi: '超市', pinyin: 'chāoshì', translation: 'supermercado' },
      { id: 'mai', hanzi: '买', pinyin: 'mǎi', translation: 'comprar' },
      { id: 'yidalimian', hanzi: '意大利面', pinyin: 'yìdàlìmiàn', translation: 'macarrão' }
    ],
    targetWordIds: ['qu_verb', 'chaoshi', 'mai', 'yidalimian'],
    level: 'Intermediário',
    toneFocusTip: 'Atenção aos tons rápidos de chāoshì (1º tom alto plano + 4º tom descendente).'
  },
  {
    id: 'drill-mama-rang-wan',
    hanzi: '妈妈不让我玩',
    pinyin: 'māma bù ràng wǒ wán',
    portuguese: 'Mamãe não me deixa brincar / jogar',
    words: [
      { id: 'mama', hanzi: '妈妈', pinyin: 'māma', translation: 'mãe' },
      { id: 'bu', hanzi: '不', pinyin: 'bù', translation: 'não' },
      { id: 'rang', hanzi: '让', pinyin: 'ràng', translation: 'deixar/permitir' },
      { id: 'wo', hanzi: '我', pinyin: 'wǒ', translation: 'eu/me' },
      { id: 'wan', hanzi: '玩', pinyin: 'wán', translation: 'brincar/jogar' }
    ],
    targetWordIds: ['rang', 'wan', 'mama'],
    level: 'Iniciante',
    toneFocusTip: 'Pronuncie ràng (4º tom incisivo) e wán (2º tom ascendente suave).'
  },
  {
    id: 'drill-deng-yixia',
    hanzi: '等一下，等等我',
    pinyin: 'děng yíxià, děngdeng wǒ',
    portuguese: 'Espere um pouco, me espere!',
    words: [
      { id: 'deng', hanzi: '等', pinyin: 'děng', translation: 'esperar' },
      { id: 'yixia', hanzi: '一下', pinyin: 'yíxià', translation: 'um pouquinho' },
      { id: 'dengdeng', hanzi: '等等', pinyin: 'děngdeng', translation: 'espere' },
      { id: 'wo', hanzi: '我', pinyin: 'wǒ', translation: 'eu/me' }
    ],
    targetWordIds: ['deng', 'yixia'],
    level: 'Iniciante',
    toneFocusTip: 'Em děngdeng, o segundo děng vira tom neutro e suave. Em yíxià, o yī sobe para o 2º tom por regra de sandhi.'
  },
  {
    id: 'drill-shi-yifu',
    hanzi: '我可以试一下衣服吗',
    pinyin: 'wǒ kěyǐ shì yíxià yīfu ma',
    portuguese: 'Eu posso experimentar a roupa?',
    words: [
      { id: 'wo', hanzi: '我', pinyin: 'wǒ', translation: 'eu' },
      { id: 'keyi', hanzi: '可以', pinyin: 'kěyǐ', translation: 'poder' },
      { id: 'shi_try', hanzi: '试', pinyin: 'shì', translation: 'experimentar' },
      { id: 'yixia', hanzi: '一下', pinyin: 'yíxià', translation: 'um pouco' },
      { id: 'yifu', hanzi: '衣服', pinyin: 'yīfu', translation: 'roupa' },
      { id: 'ma', hanzi: '吗', pinyin: 'ma', translation: '?' }
    ],
    targetWordIds: ['shi_try', 'keyi', 'yifu'],
    level: 'Intermediário',
    toneFocusTip: 'shì (试 - experimentar) usa o 4º tom forte, diferindo de shí (10) ou shì (是 - ser).'
  },
  {
    id: 'drill-tai-gui-le',
    hanzi: '这件衣服太贵了',
    pinyin: 'zhè jiàn yīfu tài guì le',
    portuguese: 'Esta roupa está muito cara!',
    words: [
      { id: 'zhe', hanzi: '这', pinyin: 'zhè', translation: 'esta' },
      { id: 'jian_cloth', hanzi: '件', pinyin: 'jiàn', translation: 'unidade' },
      { id: 'yifu', hanzi: '衣服', pinyin: 'yīfu', translation: 'roupa' },
      { id: 'tai', hanzi: '太', pinyin: 'tài', translation: 'muito/demais' },
      { id: 'gui', hanzi: '贵', pinyin: 'guì', translation: 'cara' },
      { id: 'le_past', hanzi: '了', pinyin: 'le', translation: 'partícula' }
    ],
    targetWordIds: ['gui', 'jian_cloth', 'tai'],
    level: 'Iniciante',
    toneFocusTip: 'A estrutura tài...le expressa exclamação enfática. guì (4º tom) cai com firmeza.'
  },
  {
    id: 'drill-baxiren-chayou',
    hanzi: '我是巴西人，我喜欢喝中国茶',
    pinyin: 'wǒ shì bāxī rén, wǒ xǐhuan hē zhōngguó chá',
    portuguese: 'Eu sou brasileiro, gosto de tomar chá chinês',
    words: [
      { id: 'wo', hanzi: '我', pinyin: 'wǒ', translation: 'eu' },
      { id: 'shi', hanzi: '是', pinyin: 'shì', translation: 'ser' },
      { id: 'baxiren', hanzi: '巴西人', pinyin: 'bāxī rén', translation: 'brasileiro' },
      { id: 'xihuan', hanzi: '喜欢', pinyin: 'xǐhuan', translation: 'gostar' },
      { id: 'he', hanzi: '喝', pinyin: 'hē', translation: 'beber' },
      { id: 'zhongguocha', hanzi: '中国茶', pinyin: 'zhōngguó chá', translation: 'chá chinês' }
    ],
    targetWordIds: ['shi', 'xihuan', 'he'],
    level: 'Intermediário',
    toneFocusTip: 'hē (喝 - 1º tom alto mantido) e chá (茶 - 2º tom ascendente).'
  },
  {
    id: 'drill-duoshao-qian',
    hanzi: '请问，这个多少钱',
    pinyin: 'qǐngwèn, zhè ge duōshao qián',
    portuguese: 'Com licença, quanto custa este?',
    words: [
      { id: 'qingwen', hanzi: '请问', pinyin: 'qǐngwèn', translation: 'com licença' },
      { id: 'zhe', hanzi: '这', pinyin: 'zhè', translation: 'este' },
      { id: 'ge_class', hanzi: '个', pinyin: 'ge', translation: 'unidade' },
      { id: 'duoshao', hanzi: '多少', pinyin: 'duōshao', translation: 'quanto' },
      { id: 'qian', hanzi: '钱', pinyin: 'qián', translation: 'dinheiro' }
    ],
    targetWordIds: ['duoshao', 'qian'],
    level: 'Iniciante',
    toneFocusTip: 'duōshao tem o primeiro tom alto e o shao neutro; qián sobe no 2º tom.'
  },
  {
    id: 'drill-mao-keai',
    hanzi: '那只猫真可爱',
    pinyin: 'nà zhī māo zhēn kě’ài',
    portuguese: 'Aquele gato é muito fofo',
    words: [
      { id: 'na_dem', hanzi: '那', pinyin: 'nà', translation: 'aquele' },
      { id: 'zhi_animal', hanzi: '只', pinyin: 'zhī', translation: 'unidade' },
      { id: 'mao', hanzi: '猫', pinyin: 'māo', translation: 'gato' },
      { id: 'zhen', hanzi: '真', pinyin: 'zhēn', translation: 'realmente' },
      { id: 'keai', hanzi: '可爱', pinyin: 'kě’ài', translation: 'fofo/adorável' }
    ],
    targetWordIds: ['zhi_animal', 'mao', 'zhen', 'keai'],
    level: 'Iniciante',
    toneFocusTip: 'Três primeiros tons seguidos em māo zhēn kě... Mantenha a voz no topo e depois caia em ài.'
  },
  {
    id: 'drill-shei-cidian',
    hanzi: '这本词典是老师的',
    pinyin: 'zhè běn cídiǎn shì lǎoshī de',
    portuguese: 'Este dicionário é do professor',
    words: [
      { id: 'zhe', hanzi: '这', pinyin: 'zhè', translation: 'este' },
      { id: 'ben', hanzi: '本', pinyin: 'běn', translation: 'volume' },
      { id: 'cidian', hanzi: '词典', pinyin: 'cídiǎn', translation: 'dicionário' },
      { id: 'shi', hanzi: '是', pinyin: 'shì', translation: 'ser' },
      { id: 'laoshi', hanzi: '老师', pinyin: 'lǎoshī', translation: 'professor' },
      { id: 'de', hanzi: '的', pinyin: 'de', translation: 'de (posse)' }
    ],
    targetWordIds: ['ben', 'cidian', 'laoshi', 'de'],
    level: 'Intermediário',
    toneFocusTip: 'cídiǎn combina 2º tom ascendente com 3º tom baixo; lǎoshī tem 3º tom seguido de 1º tom alto.'
  }
];

/**
 * Seleciona a próxima frase de treino priorizando as palavras que o usuário mais errou
 */
export function getAdaptiveDrillSentence(currentId?: string): {
  sentence: PronunciationDrillSentence;
  prioritizedWord?: ProblemWordRecord;
  hasProblemWords: boolean;
} {
  const topProblems = getTopProblemWords(5);

  if (topProblems.length > 0) {
    // Procura frases que contenham as palavras mais erradas
    for (const problem of topProblems) {
      const matchingSentence = DRILL_SENTENCES.find(s => 
        s.id !== currentId && 
        (s.targetWordIds.includes(problem.wordId) || s.hanzi.includes(problem.hanzi))
      );
      if (matchingSentence) {
        return {
          sentence: matchingSentence,
          prioritizedWord: problem,
          hasProblemWords: true
        };
      }
    }
  }

  // Se não houver palavras problemáticas ou se nenhuma frase casou, seleciona alternada
  const pool = DRILL_SENTENCES.filter(s => s.id !== currentId);
  const selected = pool[Math.floor(Math.random() * pool.length)] || DRILL_SENTENCES[0];
  return {
    sentence: selected,
    prioritizedWord: topProblems[0],
    hasProblemWords: topProblems.length > 0
  };
}

/**
 * Algoritmo de proximidade fonética e textual entre o alvo e o áudio reconhecido
 * (Usado para avaliação imediata ou fallback caso a API esteja sem chave)
 */
export function evaluateSpokenProximity(
  targetHanzi: string,
  targetPinyin: string,
  spokenText: string
): {
  similarityScore: number;
  wordEvaluations: WordPronunciationEvaluation[];
  failedWords: string[];
  feedback: string;
} {
  const cleanTarget = targetHanzi.replace(/[\s\p{P}]/gu, '');
  const cleanSpoken = spokenText.replace(/[\s\p{P}]/gu, '');

  if (!cleanSpoken) {
    return {
      similarityScore: 0,
      wordEvaluations: cleanTarget.split('').map(char => ({
        hanzi: char,
        pinyin: '',
        isCorrect: false,
        errorType: 'omitted',
        tip: 'Não foi detectada voz para este caractere.'
      })),
      failedWords: cleanTarget.split(''),
      feedback: 'Nenhum som em chinês foi captado. Tente falar mais perto do microfone.'
    };
  }

  // Levenshtein distance on characters
  const m = cleanTarget.length;
  const n = cleanSpoken.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (cleanTarget[i - 1] === cleanSpoken[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  const distance = dp[m][n];
  const maxLen = Math.max(m, n, 1);
  const charSimilarity = Math.max(0, Math.round((1 - distance / maxLen) * 100));

  // Avaliação caractere a caractere
  const wordEvaluations: WordPronunciationEvaluation[] = [];
  const failedWords: string[] = [];

  for (let i = 0; i < cleanTarget.length; i++) {
    const char = cleanTarget[i];
    const isFoundInSpoken = cleanSpoken.includes(char);
    const isExactIndexMatch = cleanSpoken[i] === char;

    if (isExactIndexMatch || isFoundInSpoken) {
      wordEvaluations.push({
        hanzi: char,
        pinyin: '',
        isCorrect: true,
        errorType: 'none',
        tip: 'Pronúncia articulada corretamente!'
      });
    } else {
      wordEvaluations.push({
        hanzi: char,
        pinyin: '',
        isCorrect: false,
        errorType: 'phoneme',
        tip: `O caractere ${char} não foi reconhecido com clareza.`
      });
      failedWords.push(char);
    }
  }

  let feedback = 'Bom esforço!';
  if (charSimilarity >= 90) {
    feedback = 'Excelente pronúncia! Muito próximo do chinês nativo.';
  } else if (charSimilarity >= 70) {
    feedback = 'Boa aproximação! Pratique mais os tons das palavras destacadas em vermelho.';
  } else {
    feedback = 'Tente ouvir novamente o modelo nativo com ritmo mais lento e repita com calma.';
  }

  return {
    similarityScore: charSimilarity,
    wordEvaluations,
    failedWords,
    feedback
  };
}
