// Utility for Chinese numbers according to standard Mandarin grammar rules
// 4.1 - Dezenas com 十 (shí): 二十 (20), 十二 (12)
// 4.2 - Centenas com 百 (bǎi): 三百 (300)
// 4.3 - Milhar com 千 (qiān): 二千 (2000)
// 4.4 - Miríade / Dez mil com 万 (wàn): 一万 (10.000)
// 4.4.1 - Blocos de 4 dígitos (sistema quadridigital chinês): 12345 -> 一万 二千 三百 四十五
// 4.5 - O zero (零 / líng) como "buraco" no meio do número: 一万零五 (10.005)

export interface ChineseNumberResult {
  num: number;
  hanzi: string;
  pinyin: string;
  pinyinSpaced: string;
  portuguese: string;
  breakdown: string;
  ruleTags: string[];
}

const DIGIT_HANZI: Record<number, string> = {
  0: '零',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '七',
  8: '八',
  9: '九',
};

const DIGIT_PINYIN: Record<number, string> = {
  0: 'líng',
  1: 'yī',
  2: 'èr',
  3: 'sān',
  4: 'sì',
  5: 'wǔ',
  6: 'liù',
  7: 'qī',
  8: 'bā',
  9: 'jiǔ',
};

const DIGIT_PINYIN_CLEAN: Record<number, string> = {
  0: 'ling',
  1: 'yi',
  2: 'er',
  3: 'san',
  4: 'si',
  5: 'wu',
  6: 'liu',
  7: 'qi',
  8: 'ba',
  9: 'jiu',
};

// Portuguese numbers to full words (por extenso)
export function portugueseNumberToWords(n: number): string {
  if (n === 0) return 'zero';
  if (n < 0) return 'menos ' + portugueseNumberToWords(-n);

  const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  if (n < 10) return units[n];
  if (n < 20) return teens[n - 10];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    return u === 0 ? tens[t] : `${tens[t]} e ${units[u]}`;
  }
  if (n === 100) return 'cem';
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const rem = n % 100;
    return rem === 0 ? hundreds[h] : `${hundreds[h]} e ${portugueseNumberToWords(rem)}`;
  }
  if (n < 1000000) {
    const thousands = Math.floor(n / 1000);
    const rem = n % 1000;
    const thStr = thousands === 1 ? 'mil' : `${portugueseNumberToWords(thousands)} mil`;
    if (rem === 0) return thStr;
    const separator = rem < 100 || rem % 100 === 0 ? ' e ' : ' ';
    return `${thStr}${separator}${portugueseNumberToWords(rem)}`;
  }
  if (n < 1000000000) {
    const millions = Math.floor(n / 1000000);
    const rem = n % 1000000;
    const mStr = millions === 1 ? 'um milhão' : `${portugueseNumberToWords(millions)} milhões`;
    if (rem === 0) return mStr;
    const separator = rem < 100 ? ' e ' : ' ';
    return `${mStr}${separator}${portugueseNumberToWords(rem)}`;
  }
  return n.toLocaleString('pt-BR');
}

/**
 * Converts an integer from 0 to 9999 into Chinese characters and pinyin tokens.
 * Handles the "ling" hole rule inside the 4-digit section.
 */
function convertSectionUnder10000(
  n: number,
  isHigherSectionPresent: boolean
): { hanzi: string; pinyinTokens: string[]; cleanTokens: string[] } {
  if (n === 0) return { hanzi: '', pinyinTokens: [], cleanTokens: [] };

  const q = Math.floor(n / 1000); // thousands (千)
  const b = Math.floor((n % 1000) / 100); // hundreds (百)
  const s = Math.floor((n % 100) / 10); // tens (十)
  const u = n % 10; // units

  let hanzi = '';
  const pinyinTokens: string[] = [];
  const cleanTokens: string[] = [];

  const addZero = () => {
    if (!hanzi.endsWith('零')) {
      hanzi += '零';
      pinyinTokens.push('líng');
      cleanTokens.push('ling');
    }
  };

  // If higher section (万) exists and thousands is 0, but this section is not completely 0,
  // we must start this section with a 'ling' (零) hole!
  // e.g. 10005 -> 1 wan + (0 qian, 0 bai, 0 shi, 5 u) -> 一万零五
  // e.g. 10050 -> 一万零五十
  if (isHigherSectionPresent && q === 0) {
    addZero();
  }

  // Thousands
  if (q > 0) {
    hanzi += DIGIT_HANZI[q] + '千';
    pinyinTokens.push(DIGIT_PINYIN[q], 'qiān');
    cleanTokens.push(DIGIT_PINYIN_CLEAN[q], 'qian');
  }

  // Hundreds
  if (b > 0) {
    hanzi += DIGIT_HANZI[b] + '百';
    pinyinTokens.push(DIGIT_PINYIN[b], 'bǎi');
    cleanTokens.push(DIGIT_PINYIN_CLEAN[b], 'bai');
  } else if (q > 0 && (s > 0 || u > 0)) {
    // Gap between thousands and tens/units (e.g., 2005 or 2050) -> ling
    addZero();
  }

  // Tens
  if (s > 0) {
    // If it's a standalone 10-19 and no thousands or hundreds: "shí" (十), "shí èr" (十二)
    // Otherwise "yī shí" (一百一十二) or "èr shí" (二十)
    if (s === 1 && q === 0 && b === 0 && !isHigherSectionPresent) {
      hanzi += '十';
      pinyinTokens.push('shí');
      cleanTokens.push('shi');
    } else {
      hanzi += DIGIT_HANZI[s] + '十';
      pinyinTokens.push(DIGIT_PINYIN[s], 'shí');
      cleanTokens.push(DIGIT_PINYIN_CLEAN[s], 'shi');
    }
  } else if (b > 0 && u > 0) {
    // Gap between hundreds and units (e.g. 105, 305) -> ling
    addZero();
  }

  // Units
  if (u > 0) {
    hanzi += DIGIT_HANZI[u];
    pinyinTokens.push(DIGIT_PINYIN[u]);
    cleanTokens.push(DIGIT_PINYIN_CLEAN[u]);
  }

  return { hanzi, pinyinTokens, cleanTokens };
}

/**
 * Converts any non-negative integer into standard Chinese, strictly adhering to:
 * - 4.1: Dezenas com 十: 二十 ("er shi") é 20, 十二 ("shi er") é 12
 * - 4.2: Centenas com 百: 三百 ("san bai") é 300
 * - 4.3: Milhar com 千: 二千 ("er qian") é 2000
 * - 4.4: Wan 万 (10 mil): 一万 ("yi wan") é 10.000
 * - 4.4.1: Blocos de 4 dígitos: 12345 -> 一万 二千 三百 四十五 ("yi wan er qian san bai si shi wu")
 * - 4.5: Zero (零 / líng) intermediário como "buraco": 一万零五 ("yi wan ling wu") é 10.005
 */
export function convertNumberToChinese(num: number): ChineseNumberResult {
  const n = Math.floor(Math.abs(num));

  if (n === 0) {
    return {
      num: 0,
      hanzi: '零',
      pinyin: 'líng',
      pinyinSpaced: 'ling',
      portuguese: 'zero',
      breakdown: 'Número zero (零 / líng).',
      ruleTags: ['4.5 (Zero)'],
    };
  }

  const ruleTags: string[] = [];

  // Group into blocks of 4 digits:
  // Section 0: 1 to 9999 (unidades, dezenas 十, centenas 百, milhares 千)
  // Section 1: 万 (wan - 10^4 a 10^7)
  // Section 2: 亿 (yi - 10^8+)
  const sectionLow = n % 10000;
  const sectionWan = Math.floor((n % 100000000) / 10000);
  const sectionYi = Math.floor(n / 100000000);

  let hanzi = '';
  const pinyinTokens: string[] = [];
  const cleanTokens: string[] = [];

  // 1. Yi section (亿 - 100 milhões)
  if (sectionYi > 0) {
    const yiPart = convertSectionUnder10000(sectionYi, false);
    hanzi += yiPart.hanzi + '亿';
    pinyinTokens.push(...yiPart.pinyinTokens, 'yì');
    cleanTokens.push(...yiPart.cleanTokens, 'yi');
    ruleTags.push('Bloco 亿 (10^8)');
  }

  // 2. Wan section (万 - 10 mil / miríade)
  if (sectionWan > 0) {
    const hasHigher = sectionYi > 0;
    const wanPart = convertSectionUnder10000(sectionWan, hasHigher);
    hanzi += wanPart.hanzi + '万';
    pinyinTokens.push(...wanPart.pinyinTokens, 'wàn');
    cleanTokens.push(...wanPart.cleanTokens, 'wan');
    ruleTags.push('4.4 (万 / wàn = 10 mil)');
    ruleTags.push('4.4.1 (Agrupamento quadridigital)');
  } else if (sectionYi > 0 && sectionLow > 0) {
    // If wan section is completely 0 between yi and low
    if (!hanzi.endsWith('零')) {
      hanzi += '零';
      pinyinTokens.push('líng');
      cleanTokens.push('ling');
    }
  }

  // 3. Low section (< 10000)
  if (sectionLow > 0) {
    const hasHigher = sectionWan > 0 || sectionYi > 0;
    const lowPart = convertSectionUnder10000(sectionLow, hasHigher);
    hanzi += lowPart.hanzi;
    pinyinTokens.push(...lowPart.pinyinTokens);
    cleanTokens.push(...lowPart.cleanTokens);
  }

  // Tag applicable rules based on number features
  if (n >= 10 && n <= 99) {
    ruleTags.push('4.1 (Dezena com 十 / shí)');
  }
  if (n >= 100 && n <= 999) {
    ruleTags.push('4.2 (Centena com 百 / bǎi)');
  }
  if (n >= 1000 && n <= 9999) {
    ruleTags.push('4.3 (Milhar com 千 / qiān)');
  }
  if (hanzi.includes('零')) {
    ruleTags.push('4.5 (Zero 零 / líng como "buraco" intermediário)');
  }

  const portugueseWords = portugueseNumberToWords(n);
  const formattedPortuguese = `${portugueseWords} (${n.toLocaleString('pt-BR')})`;

  // Explanation breakdown
  const parts: string[] = [];
  if (sectionWan > 0) {
    parts.push(`[${sectionWan} 万 = ${sectionWan * 10000}]`);
  }
  const q = Math.floor(sectionLow / 1000);
  const b = Math.floor((sectionLow % 1000) / 100);
  const s = Math.floor((sectionLow % 100) / 10);
  const u = sectionLow % 10;

  if (q > 0) parts.push(`[${q} 千 = ${q * 1000}]`);
  if (b > 0) parts.push(`[${b} 百 = ${b * 100}]`);
  if (s > 0) parts.push(`[${s} 十 = ${s * 10}]`);
  if (u > 0) parts.push(`[${u} unidade(s)]`);

  let breakdown = `Valor: ${n.toLocaleString('pt-BR')} = ${parts.join(' + ')}.`;
  if (hanzi.includes('零')) {
    breakdown += ` O caractere "零" (líng) preenche a casa decimal vazia intermediária.`;
  }

  return {
    num: n,
    hanzi,
    pinyin: pinyinTokens.join(' '),
    pinyinSpaced: cleanTokens.join(' '),
    portuguese: formattedPortuguese,
    breakdown,
    ruleTags: Array.from(new Set(ruleTags)),
  };
}

/**
 * Recognizes a sequence of Chinese word tokens (Word IDs or labels) that form a number,
 * and calculates its integer value and natural Portuguese translation.
 */
export function parseChineseNumberWordIds(ids: string[]): {
  value: number;
  hanzi: string;
  pinyin: string;
  portuguese: string;
} | null {
  if (ids.length === 0) return null;

  // Map word IDs to numeric tokens
  const tokenMap: Record<string, { type: 'digit' | 'multiplier' | 'zero'; val: number; hanzi: string; pinyin: string }> = {
    'ling': { type: 'zero', val: 0, hanzi: '零', pinyin: 'líng' },
    'yi': { type: 'digit', val: 1, hanzi: '一', pinyin: 'yī' },
    'yao': { type: 'digit', val: 1, hanzi: '幺', pinyin: 'yāo' },
    'er': { type: 'digit', val: 2, hanzi: '二', pinyin: 'èr' },
    'liang': { type: 'digit', val: 2, hanzi: '两', pinyin: 'liǎng' },
    'san': { type: 'digit', val: 3, hanzi: '三', pinyin: 'sān' },
    'si': { type: 'digit', val: 4, hanzi: '四', pinyin: 'sì' },
    'wu': { type: 'digit', val: 5, hanzi: '五', pinyin: 'wǔ' },
    'liu': { type: 'digit', val: 6, hanzi: '六', pinyin: 'liù' },
    'qi': { type: 'digit', val: 7, hanzi: '七', pinyin: 'qī' },
    'ba': { type: 'digit', val: 8, hanzi: '八', pinyin: 'bā' },
    'jiu': { type: 'digit', val: 9, hanzi: '九', pinyin: 'jiǔ' },
    'shi_num': { type: 'multiplier', val: 10, hanzi: '十', pinyin: 'shí' },
    'shi': { type: 'multiplier', val: 10, hanzi: '十', pinyin: 'shí' },
    'bai': { type: 'multiplier', val: 100, hanzi: '百', pinyin: 'bǎi' },
    'qian_num': { type: 'multiplier', val: 1000, hanzi: '千', pinyin: 'qiān' },
    'qian': { type: 'multiplier', val: 1000, hanzi: '千', pinyin: 'qiān' },
    'wan_num': { type: 'multiplier', val: 10000, hanzi: '万', pinyin: 'wàn' },
    'wan': { type: 'multiplier', val: 10000, hanzi: '万', pinyin: 'wàn' },
  };

  // Check if all tokens are numbers
  for (const id of ids) {
    if (!tokenMap[id]) return null;
  }

  // Chinese numeral parsing algorithm (supporting 万 wan 10^4)
  let total = 0;
  let section = 0;
  let currentDigit = 0;
  let hasCurrentDigit = false;

  for (let i = 0; i < ids.length; i++) {
    const item = tokenMap[ids[i]];

    if (item.type === 'digit') {
      currentDigit = item.val;
      hasCurrentDigit = true;
    } else if (item.type === 'zero') {
      // zero doesn't add value directly, marks hole
      hasCurrentDigit = false;
      currentDigit = 0;
    } else if (item.type === 'multiplier') {
      const mult = item.val;
      if (mult === 10000) {
        // 万 (wan) applies to the entire accumulated section
        const valToMultiply = hasCurrentDigit ? section + currentDigit : (section > 0 ? section : 1);
        total += valToMultiply * 10000;
        section = 0;
        currentDigit = 0;
        hasCurrentDigit = false;
      } else {
        // 十 (10), 百 (100), 千 (1000)
        const digitVal = hasCurrentDigit ? currentDigit : 1;
        section += digitVal * mult;
        currentDigit = 0;
        hasCurrentDigit = false;
      }
    }
  }

  if (hasCurrentDigit) {
    section += currentDigit;
  }
  total += section;

  const result = convertNumberToChinese(total);
  return {
    value: total,
    hanzi: result.hanzi,
    pinyin: result.pinyin,
    portuguese: result.portuguese,
  };
}
