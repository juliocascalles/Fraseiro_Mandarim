export interface ReelTimeItem {
  id: string;
  hanzi: string;
  pinyin: string;
  pt: string;
  tense: 'present' | 'past' | 'future';
}

export interface ReelSubjectItem {
  id: string;
  hanzi: string;
  pinyin: string;
  pt: string;
  person: '1s' | '2s' | '3s' | '1p';
}

export interface ReelLocationItem {
  id: string;
  hanzi: string; // e.g. "在超市"
  pinyin: string; // e.g. "zài chāoshì"
  pt: string; // e.g. "no supermercado"
}

export interface ReelVerbItem {
  id: string;
  hanzi: string;
  pinyin: string;
  lemma: string;
  conjugations: {
    present: Record<'1s' | '2s' | '3s' | '1p', string>;
    past: Record<'1s' | '2s' | '3s' | '1p', string>;
    future: Record<'1s' | '2s' | '3s' | '1p', string>;
  };
  allowedObjectIds: string[];
}

export interface ReelObjectItem {
  id: string;
  hanzi: string;
  pinyin: string;
  pt: string;
  category: 'food' | 'drink' | 'clothing' | 'thing';
}

export const TIME_REEL: ReelTimeItem[] = [
  { id: 'wanshang', hanzi: '晚上', pinyin: 'wǎnshang', pt: 'à noite', tense: 'present' },
  { id: 'zaoshang', hanzi: '早上', pinyin: 'zǎoshang', pt: 'de manhã', tense: 'present' },
  { id: 'xiawu', hanzi: '下午', pinyin: 'xiàwǔ', pt: 'à tarde', tense: 'present' },
  { id: 'jintian', hanzi: '今天', pinyin: 'jīntiān', pt: 'hoje', tense: 'present' },
  { id: 'zuotian', hanzi: '昨天', pinyin: 'zuótiān', pt: 'ontem', tense: 'past' },
  { id: 'mingtian', hanzi: '明天', pinyin: 'míngtiān', pt: 'amanhã', tense: 'future' },
  { id: 'zhongwu', hanzi: '中午', pinyin: 'zhōngwǔ', pt: 'ao meio-dia', tense: 'present' },
  { id: 'zhoumo', hanzi: '周末', pinyin: 'zhōumò', pt: 'no fim de semana', tense: 'present' },
];

export const SUBJECT_REEL: ReelSubjectItem[] = [
  { id: 'wo', hanzi: '我', pinyin: 'wǒ', pt: 'Eu', person: '1s' },
  { id: 'ni', hanzi: '你', pinyin: 'nǐ', pt: 'Você', person: '2s' },
  { id: 'ta_m', hanzi: '他', pinyin: 'tā', pt: 'Ele', person: '3s' },
  { id: 'ta_f', hanzi: '她', pinyin: 'tā', pt: 'Ela', person: '3s' },
  { id: 'women', hanzi: '我们', pinyin: 'wǒmen', pt: 'Nós', person: '1p' },
  { id: 'laoshi', hanzi: '老师', pinyin: 'lǎoshī', pt: 'O professor', person: '3s' },
  { id: 'baba', hanzi: '爸爸', pinyin: 'bàba', pt: 'O pai', person: '3s' },
  { id: 'mama', hanzi: '妈妈', pinyin: 'māma', pt: 'A mãe', person: '3s' },
  { id: 'pengyou', hanzi: '朋友', pinyin: 'péngyou', pt: 'O amigo', person: '3s' },
];

export const LOCATION_REEL: ReelLocationItem[] = [
  { id: 'chaoshi', hanzi: '在超市', pinyin: 'zài chāoshì', pt: 'no supermercado' },
  { id: 'shangdian', hanzi: '在商店', pinyin: 'zài shāngdiàn', pt: 'na loja' },
  { id: 'fuzhuangdian', hanzi: '在服装店', pinyin: 'zài fúzhuāngdiàn', pt: 'na loja de roupas' },
  { id: 'fanguan', hanzi: '在饭馆', pinyin: 'zài fànguǎn', pt: 'no restaurante' },
  { id: 'xuexiao', hanzi: '在学校', pinyin: 'zài xuéxiào', pt: 'na escola' },
  { id: 'gongyuan', hanzi: '在公园', pinyin: 'zài gōngyuán', pt: 'no parque' },
  { id: 'jia', hanzi: '在家', pinyin: 'zài jiā', pt: 'em casa' },
  { id: 'shudian', hanzi: '在书店', pinyin: 'zài shūdiàn', pt: 'na livraria' },
];

export const VERB_REEL: ReelVerbItem[] = [
  {
    id: 'mai_sell',
    hanzi: '卖',
    pinyin: 'mài',
    lemma: 'vender',
    conjugations: {
      present: { '1s': 'vendo', '2s': 'vende', '3s': 'vende', '1p': 'vendemos' },
      past: { '1s': 'vendi', '2s': 'vendeu', '3s': 'vendeu', '1p': 'vendemos' },
      future: { '1s': 'vou vender', '2s': 'vai vender', '3s': 'vai vender', '1p': 'vamos vender' },
    },
    allowedObjectIds: ['pingguo', 'shuiguo', 'yifu', 'waitao', 'duanxiu', 'shu', 'dangao', 'cha', 'kafei'],
  },
  {
    id: 'mai_buy',
    hanzi: '买',
    pinyin: 'mǎi',
    lemma: 'comprar',
    conjugations: {
      present: { '1s': 'compro', '2s': 'compra', '3s': 'compra', '1p': 'compramos' },
      past: { '1s': 'comprei', '2s': 'comprou', '3s': 'comprou', '1p': 'compramos' },
      future: { '1s': 'vou comprar', '2s': 'vai comprar', '3s': 'vai comprar', '1p': 'vamos comprar' },
    },
    allowedObjectIds: ['pingguo', 'shuiguo', 'yifu', 'waitao', 'duanxiu', 'shu', 'dangao', 'cha', 'kafei', 'mianbao'],
  },
  {
    id: 'chi',
    hanzi: '吃',
    pinyin: 'chī',
    lemma: 'comer',
    conjugations: {
      present: { '1s': 'como', '2s': 'come', '3s': 'come', '1p': 'comemos' },
      past: { '1s': 'comi', '2s': 'comeu', '3s': 'comeu', '1p': 'comemos' },
      future: { '1s': 'vou comer', '2s': 'vai comer', '3s': 'vai comer', '1p': 'vamos comer' },
    },
    allowedObjectIds: ['pingguo', 'shuiguo', 'dangao', 'mifan', 'miantiao', 'mianbao'],
  },
  {
    id: 'he',
    hanzi: '喝',
    pinyin: 'hē',
    lemma: 'beber',
    conjugations: {
      present: { '1s': 'bebo', '2s': 'bebe', '3s': 'bebe', '1p': 'bebemos' },
      past: { '1s': 'bebi', '2s': 'bebeu', '3s': 'bebeu', '1p': 'bebemos' },
      future: { '1s': 'vou beber', '2s': 'vai beber', '3s': 'vai beber', '1p': 'vamos beber' },
    },
    allowedObjectIds: ['cha', 'kafei', 'shui', 'kele'],
  },
  {
    id: 'kan',
    hanzi: '看',
    pinyin: 'kàn',
    lemma: 'ver/ler',
    conjugations: {
      present: { '1s': 'leio', '2s': 'lê', '3s': 'lê', '1p': 'lemos' },
      past: { '1s': 'li', '2s': 'leu', '3s': 'leu', '1p': 'lemos' },
      future: { '1s': 'vou ler', '2s': 'vai ler', '3s': 'vai ler', '1p': 'vamos ler' },
    },
    allowedObjectIds: ['shu', 'zhaopian'],
  },
  {
    id: 'zhao',
    hanzi: '找',
    pinyin: 'zhǎo',
    lemma: 'procurar',
    conjugations: {
      present: { '1s': 'procuro', '2s': 'procura', '3s': 'procura', '1p': 'procuramos' },
      past: { '1s': 'procurei', '2s': 'procurou', '3s': 'procurou', '1p': 'procuramos' },
      future: { '1s': 'vou procurar', '2s': 'vai procurar', '3s': 'vai procurar', '1p': 'vamos procurar' },
    },
    allowedObjectIds: ['shu', 'yifu', 'shouji', 'qian', 'waitao'],
  },
];

export const OBJECT_REEL: ReelObjectItem[] = [
  { id: 'pingguo', hanzi: '苹果', pinyin: 'píngguǒ', pt: 'maçãs', category: 'food' },
  { id: 'shuiguo', hanzi: '水果', pinyin: 'shuǐguǒ', pt: 'frutas', category: 'food' },
  { id: 'dangao', hanzi: '蛋糕', pinyin: 'dàngāo', pt: 'bolo', category: 'food' },
  { id: 'mifan', hanzi: '米饭', pinyin: 'mǐfàn', pt: 'arroz', category: 'food' },
  { id: 'miantiao', hanzi: '面条', pinyin: 'miàntiáo', pt: 'macarrão', category: 'food' },
  { id: 'mianbao', hanzi: '面包', pinyin: 'miànbāo', pt: 'pão', category: 'food' },
  { id: 'cha', hanzi: '茶', pinyin: 'chá', pt: 'chá', category: 'drink' },
  { id: 'kafei', hanzi: '咖啡', pinyin: 'kāfēi', pt: 'café', category: 'drink' },
  { id: 'shui', hanzi: '水', pinyin: 'shuǐ', pt: 'água', category: 'drink' },
  { id: 'kele', hanzi: '可乐', pinyin: 'kělè', pt: 'refrigerante', category: 'drink' },
  { id: 'yifu', hanzi: '衣服', pinyin: 'yīfu', pt: 'roupas', category: 'clothing' },
  { id: 'waitao', hanzi: '外套', pinyin: 'wàitào', pt: 'casacos', category: 'clothing' },
  { id: 'duanxiu', hanzi: '短袖', pinyin: 'duǎnxiù', pt: 'camisetas', category: 'clothing' },
  { id: 'shu', hanzi: '书', pinyin: 'shū', pt: 'livros', category: 'thing' },
  { id: 'shouji', hanzi: '手机', pinyin: 'shǒujī', pt: 'o celular', category: 'thing' },
  { id: 'qian', hanzi: '钱', pinyin: 'qián', pt: 'dinheiro', category: 'thing' },
  { id: 'zhaopian', hanzi: '照片', pinyin: 'zhàopiàn', pt: 'fotos', category: 'thing' },
];

export interface SlotSentence {
  time: ReelTimeItem;
  subject: ReelSubjectItem;
  location: ReelLocationItem;
  verb: ReelVerbItem;
  object: ReelObjectItem;
  chinese: string;
  pinyin: string;
  translation: string;
}

/**
 * Monta a tradução precisa em português para a combinação de faixas da máquina.
 * Exemplo do usuário: 晚上他在超市卖 苹果 = "Ele vende maçãs no supermercado à noite."
 */
export function buildSlotTranslation(
  time: ReelTimeItem,
  subject: ReelSubjectItem,
  location: ReelLocationItem,
  verb: ReelVerbItem,
  object: ReelObjectItem
): string {
  const tense = time.tense;
  let verbStr = verb.conjugations[tense][subject.person] || verb.conjugations.present[subject.person];

  // Ajuste especial para 'kan': com fotos/mapas traduz como 'vê/olha', com livros como 'lê'
  if (verb.id === 'kan') {
    if (object.id === 'zhaopian') {
      verbStr = tense === 'past' 
        ? (subject.person === '1s' ? 'vi' : subject.person === '1p' ? 'vimos' : 'viu')
        : tense === 'future'
        ? (subject.person === '1s' ? 'vou ver' : subject.person === '1p' ? 'vamos ver' : 'vai ver')
        : (subject.person === '1s' ? 'vejo' : subject.person === '1p' ? 'vemos' : 'vê');
    }
  }

  // Formato elegante da frase em português:
  // "[Sujeito] [verbo conjugado] [objeto] [local com 'zai'] [tempo]."
  // Ex: "Ele vende maçãs no supermercado à noite."
  return `${subject.pt} ${verbStr} ${object.pt} ${location.pt} ${time.pt}.`;
}

/**
 * Gera uma frase compatível e natural a partir dos 5 slots do caça-níqueis.
 */
export function createSlotSentence(
  time: ReelTimeItem,
  subject: ReelSubjectItem,
  location: ReelLocationItem,
  verb: ReelVerbItem,
  object: ReelObjectItem
): SlotSentence {
  const chinese = `${time.hanzi}${subject.hanzi}${location.hanzi}${verb.hanzi}${object.hanzi}`;
  const pinyin = `${time.pinyin} ${subject.pinyin} ${location.pinyin} ${verb.pinyin} ${object.pinyin}`;
  const translation = buildSlotTranslation(time, subject, location, verb, object);

  return {
    time,
    subject,
    location,
    verb,
    object,
    chinese,
    pinyin,
    translation,
  };
}

/**
 * Cria 4 opções de múltipla escolha com 1 correta e 3 distratores gramaticais plausíveis.
 */
export function generateSlotOptions(current: SlotSentence): {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}[] {
  const correctText = current.translation;

  // Distrator 1: Troca o verbo principal (ex: vendeu por comprou ou comeu)
  const otherVerbs = VERB_REEL.filter(v => v.id !== current.verb.id);
  const altVerb = otherVerbs[Math.floor(Math.random() * otherVerbs.length)];
  const distractor1 = buildSlotTranslation(current.time, current.subject, current.location, altVerb, current.object);

  // Distrator 2: Troca o local (ex: no supermercado por no restaurante ou na escola)
  const otherLocations = LOCATION_REEL.filter(l => l.id !== current.location.id);
  const altLocation = otherLocations[Math.floor(Math.random() * otherLocations.length)];
  const distractor2 = buildSlotTranslation(current.time, current.subject, altLocation, current.verb, current.object);

  // Distrator 3: Troca o advérbio de tempo ou o sujeito (ex: de noite por de manhã, ou ele por você)
  const otherTimes = TIME_REEL.filter(t => t.id !== current.time.id);
  const altTime = otherTimes[Math.floor(Math.random() * otherTimes.length)];
  const distractor3 = buildSlotTranslation(altTime, current.subject, current.location, current.verb, current.object);

  // Cria array de opções e remove duplicatas caso ocorram
  const rawOptions = [
    { id: 'correct', text: correctText, isCorrect: true },
    { id: 'dist_verb', text: distractor1, isCorrect: false },
    { id: 'dist_loc', text: distractor2, isCorrect: false },
    { id: 'dist_time', text: distractor3, isCorrect: false },
  ];

  // Garante textos únicos
  const uniqueOptions: typeof rawOptions = [];
  const seenTexts = new Set<string>();

  for (const opt of rawOptions) {
    if (!seenTexts.has(opt.text)) {
      seenTexts.add(opt.text);
      uniqueOptions.push(opt);
    }
  }

  // Se faltou opções por coincidência, adiciona variações de sujeito
  if (uniqueOptions.length < 4) {
    const otherSubjects = SUBJECT_REEL.filter(s => s.id !== current.subject.id);
    for (const altSubj of otherSubjects) {
      const altText = buildSlotTranslation(current.time, altSubj, current.location, current.verb, current.object);
      if (!seenTexts.has(altText)) {
        seenTexts.add(altText);
        uniqueOptions.push({ id: `dist_subj_${altSubj.id}`, text: altText, isCorrect: false });
        if (uniqueOptions.length >= 4) break;
      }
    }
  }

  // Embaralha as opções
  return uniqueOptions.sort(() => Math.random() - 0.5);
}
