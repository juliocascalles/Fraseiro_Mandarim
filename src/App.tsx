/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  User, Users, MessageSquare, UserCheck, Globe, 
  Flag, Type, HelpCircle, Search, Info, PlusSquare, 
  RefreshCcw, XCircle, Target, FileText, GraduationCap, 
  Briefcase, Tag, Trash2, ArrowRight, Book, Cat, Dog, 
  Droplets, Coffee, CupSoda, Milk, Utensils, Soup,
  Sparkles, X, CheckCircle2, RefreshCw, ExternalLink,
  Home, Heart, Smile, AlertCircle, Play, CornerDownLeft,
  ListOrdered, PauseCircle, Award, BookOpen, Coins, Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/// --- Types ---
type Category = 
  | 'pronoun' 
  | 'plural' 
  | 'adverb' 
  | 'verb' 
  | 'country' 
  | 'suffix' 
  | 'noun' 
  | 'family'
  | 'classifier'
  | 'question' 
  | 'guo' 
  | 'possessive' 
  | 'thing'
  | 'adjective'
  | 'number'
  | 'preposition'
  | 'etiquette'
  | 'conjunction';

interface Word {
  id: string;
  label: string;
  hanzi: string;
  translation: string;
  category: Category;
  icon: React.ElementType;
  requiresGuo?: boolean;
}

// --- Data ---
const WORDS: Word[] = [
  // Pronouns
  { id: 'wo', label: 'wo', hanzi: '我', translation: 'eu', category: 'pronoun', icon: User },
  { id: 'ni', label: 'ni', hanzi: '你', translation: 'você', category: 'pronoun', icon: User },
  { id: 'nin', label: 'nín', hanzi: '您', translation: 'o senhor / a senhora (você formal)', category: 'pronoun', icon: UserCheck },
  { id: 'ta', label: 'ta', hanzi: '他', translation: 'ele/ela', category: 'pronoun', icon: User },
  { id: 'dajia', label: 'dàjiā', hanzi: '大家', translation: 'todos / todo mundo', category: 'pronoun', icon: Users },
  { id: 'zhe', label: 'zhe', hanzi: '这', translation: 'este/isto', category: 'pronoun', icon: ArrowRight },
  { id: 'na_dem', label: 'nà', hanzi: '那', translation: 'aquele', category: 'pronoun', icon: ArrowRight },
  
  // Plural
  { id: 'men', label: 'men', hanzi: '们', translation: 'plural', category: 'plural', icon: Users },
  
  // Possessive
  { id: 'de', label: 'de', hanzi: '的', translation: 'de (posse)', category: 'possessive', icon: Tag },

  // Adverbs
  { id: 'dou', label: 'dou', hanzi: '都', translation: 'todos', category: 'adverb', icon: PlusSquare },
  { id: 'ye', label: 'yê', hanzi: '也', translation: 'também', category: 'adverb', icon: RefreshCcw },
  { id: 'bu', label: 'bù', hanzi: '不', translation: 'não (presente/futuro)', category: 'adverb', icon: XCircle },
  { id: 'mei', label: 'méi', hanzi: '没', translation: 'não (ter/passado)', category: 'adverb', icon: XCircle },
  { id: 'zhi', label: 'zhi', hanzi: '只', translation: 'apenas', category: 'adverb', icon: Target },
  { id: 'hen', label: 'hen', hanzi: '很', translation: 'muito', category: 'adverb', icon: PlusSquare },
  { id: 'yidian', label: 'yìdiǎn', hanzi: '一点', translation: 'um pouco', category: 'adverb', icon: Sparkles },
  
  // Prepositions
  { id: 'gei', label: 'gei', hanzi: '给', translation: 'para', category: 'preposition', icon: Tag },

  // Conjunctions
  { id: 'he_conj', label: 'he', hanzi: '和', translation: 'e', category: 'conjunction', icon: PlusSquare },

  // Verbs & Auxiliary/Modal Verbs
  { id: 'shi', label: 'shi', hanzi: '是', translation: 'ser', category: 'verb', icon: UserCheck },
  { id: 'you_verb', label: 'you', hanzi: '有', translation: 'ter/haver', category: 'verb', icon: PlusSquare },
  { id: 'shuo', label: 'shuo', hanzi: '说', translation: 'falar', category: 'verb', icon: MessageSquare },
  { id: 'jiao', label: 'jiao', hanzi: '叫', translation: 'chamar-se', category: 'verb', icon: Tag },
  { id: 'xihuan', label: 'xihuan', hanzi: '喜欢', translation: 'gostar', category: 'verb', icon: Target },
  { id: 'zai', label: 'zai', hanzi: '在', translation: 'estar/em', category: 'verb', icon: Target },
  { id: 'keyi', label: 'ke yi', hanzi: '可以', translation: 'poder (permissão)', category: 'verb', icon: UserCheck },
  { id: 'hui', label: 'huì', hanzi: '会', translation: 'poder/saber (habilidade adquirida)', category: 'verb', icon: Award },
  { id: 'da_call', label: 'da', hanzi: '打', translation: 'ligar', category: 'verb', icon: MessageSquare },
  { id: 'fa_verb', label: 'fa', hanzi: '发', translation: 'enviar', category: 'verb', icon: PlusSquare },
  { id: 'zhidao', label: 'zhidao', hanzi: '知道', translation: 'saber/conhecer', category: 'verb', icon: FileText },
  { id: 'zuo', label: 'zuo', hanzi: '坐', translation: 'sentar', category: 'verb', icon: UserCheck },
  { id: 'he', label: 'hé', hanzi: '喝', translation: 'beber', category: 'verb', icon: Coffee },
  { id: 'jin', label: 'jin', hanzi: '进', translation: 'entrar', category: 'verb', icon: ArrowRight },

  // Family & Home
  { id: 'jia', label: 'jia', hanzi: '家', translation: 'casa/família', category: 'family', icon: Home },
  { id: 'baba', label: 'baba', hanzi: '爸爸', translation: 'pai', category: 'family', icon: User },
  { id: 'mama', label: 'mama', hanzi: '妈妈', translation: 'mãe', category: 'family', icon: Heart },
  { id: 'gege', label: 'gege', hanzi: '哥哥', translation: 'irmão mais velho', category: 'family', icon: Users },
  { id: 'jiejie', label: 'jiejie', hanzi: '姐姐', translation: 'irmã mais velha', category: 'family', icon: Heart },
  { id: 'didi', label: 'didi', hanzi: '弟弟', translation: 'irmão mais novo', category: 'family', icon: Smile },
  { id: 'meimei', label: 'meimei', hanzi: '妹妹', translation: 'irmã mais nova', category: 'family', icon: Heart },
  { id: 'yeye', label: 'yeye', hanzi: '爷爷', translation: 'avô', category: 'family', icon: UserCheck },
  { id: 'nainai', label: 'nainai', hanzi: '奶奶', translation: 'avó', category: 'family', icon: Heart },

  // Classifiers / Measure Words
  { id: 'kou', label: 'kou', hanzi: '口', translation: 'boca (membros)', category: 'classifier', icon: MessageSquare },
  { id: 'ge_class', label: 'ge', hanzi: '个', translation: 'unidade (classif.)', category: 'classifier', icon: Tag },

  // Questions
  { id: 'ma', label: 'ma', hanzi: '吗', translation: '?', category: 'question', icon: HelpCircle },
  { id: 'ji', label: 'ji', hanzi: '几', translation: 'quantos?', category: 'question', icon: HelpCircle },
  { id: 'na', label: 'na', hanzi: '哪', translation: 'qual', category: 'question', icon: Search },
  { id: 'shenme', label: 'shenme', hanzi: '什么', translation: 'o quê', category: 'question', icon: Info },
  { id: 'duoshao', label: 'duōshao', hanzi: '多少', translation: 'quanto?', category: 'question', icon: HelpCircle },
  { id: 'nali', label: 'nali', hanzi: '哪里', translation: 'onde?', category: 'question', icon: Search },
  { id: 'zenmeyang', label: 'zenmeyang', hanzi: '怎么样', translation: 'como é...?', category: 'question', icon: HelpCircle },
  { id: 'shei', label: 'shéi', hanzi: '谁', translation: 'quem', category: 'question', icon: HelpCircle },

  // Countries
  { id: 'baxi', label: 'baxi', hanzi: '巴西', translation: 'Brasil', category: 'country', icon: Globe },
  { id: 'jianada', label: 'jianada', hanzi: '加拿大', translation: 'Canadá', category: 'country', icon: Globe },
  { id: 'putaoya', label: 'putaoya', hanzi: '葡萄牙', translation: 'Portugal', category: 'country', icon: Globe },
  { id: 'fa', label: 'fa', hanzi: '法', translation: 'França', category: 'country', icon: Globe, requiresGuo: true },
  { id: 'ying', label: 'ying', hanzi: '英', translation: 'Inglaterra', category: 'country', icon: Globe, requiresGuo: true },

  // Gentilics parts
  { id: 'guo', label: 'guo', hanzi: '国', translation: 'país', category: 'guo', icon: Flag },
  { id: 'yu', label: 'yu', hanzi: '语', translation: 'idioma', category: 'suffix', icon: Type },
  { id: 'ren', label: 'ren', hanzi: '人', translation: 'pessoa', category: 'suffix', icon: Users },

  // Nouns
  { id: 'hanyu', label: 'Hanyu', hanzi: '汉语', translation: 'mandarim (língua)', category: 'noun', icon: BookOpen },
  { id: 'zaoshang', label: 'zǎoshang', hanzi: '早上', translation: 'manhã (cedo / bom dia)', category: 'noun', icon: Sun },
  { id: 'mingzi', label: 'ming zi', hanzi: '名字', translation: 'nome', category: 'noun', icon: FileText },
  { id: 'tongxue', label: 'tongxue', hanzi: '同学', translation: 'colega', category: 'noun', icon: GraduationCap },
  { id: 'laoshi', label: 'laoshi', hanzi: '老师', translation: 'professor', category: 'noun', icon: Briefcase },
  { id: 'gongzuo', label: 'gongzuo', hanzi: '工作', translation: 'trabalho', category: 'noun', icon: Briefcase },
  { id: 'pengyou', label: 'pengyou', hanzi: '朋友', translation: 'amigo(a)', category: 'noun', icon: Users },
  { id: 'nan', label: 'nan', hanzi: '男', translation: 'masculino', category: 'noun', icon: User },
  { id: 'nü', label: 'nü', hanzi: '女', translation: 'feminino', category: 'noun', icon: User },
  { id: 'haoma', label: 'haoma', hanzi: '号码', translation: 'número', category: 'noun', icon: FileText },
  { id: 'dianhua', label: 'dianhua', hanzi: '电话', translation: 'telefone', category: 'noun', icon: Briefcase },
  { id: 'youjian', label: 'youjian', hanzi: '邮件', translation: 'email', category: 'noun', icon: FileText },
  { id: 'xuesheng', label: 'xuesheng', hanzi: '学生', translation: 'estudante', category: 'noun', icon: GraduationCap },
  { id: 'xuexiao', label: 'xuexiao', hanzi: '学校', translation: 'escola', category: 'noun', icon: Book },
  { id: 'daxue', label: 'daxue', hanzi: '大学', translation: 'universidade', category: 'noun', icon: GraduationCap },
  { id: 'Huawei', label: 'Huawei', hanzi: '华为', translation: 'Huawei', category: 'noun', icon: Briefcase },

  // Things (Coisas)
  { id: 'shu', label: 'shu', hanzi: '书', translation: 'livro', category: 'thing', icon: Book },
  { id: 'mao', label: 'mao', hanzi: '猫', translation: 'gato', category: 'thing', icon: Cat },
  { id: 'gou', label: 'gou', hanzi: '狗', translation: 'cachorro', category: 'thing', icon: Dog },
  { id: 'shui', label: 'shuî', hanzi: '水', translation: 'água', category: 'thing', icon: Droplets },
  { id: 'cha', label: 'cha', hanzi: '茶', translation: 'chá', category: 'thing', icon: CupSoda },
  { id: 'kafei', label: 'kafei', hanzi: '咖啡', translation: 'café', category: 'thing', icon: Coffee },
  { id: 'mifan', label: 'mifan', hanzi: '米饭', translation: 'arroz', category: 'thing', icon: Utensils },
  { id: 'mianbao', label: 'mianbao', hanzi: '面包', translation: 'pão', category: 'thing', icon: Milk },
  { id: 'tang', label: 'tang', hanzi: '汤', translation: 'sopa', category: 'thing', icon: Soup },
  { id: 'qian', label: 'qián', hanzi: '钱', translation: 'dinheiro (preço)', category: 'thing', icon: Coins },

  // Adjectives
  { id: 'hao', label: 'hǎo', hanzi: '好', translation: 'bom / bem (olá)', category: 'adjective', icon: Smile },
  { id: 'da_adj', label: 'dà', hanzi: '大', translation: 'grande', category: 'adjective', icon: Tag },
  { id: 'xiao', label: 'xiǎo', hanzi: '小', translation: 'pequeno', category: 'adjective', icon: Tag },
  { id: 'gaoxing', label: 'gaoxing', hanzi: '高兴', translation: 'feliz', category: 'adjective', icon: UserCheck },
  { id: 'mang', label: 'mang', hanzi: '忙', translation: 'ocupado', category: 'adjective', icon: Briefcase },
  { id: 'lei', label: 'lei', hanzi: '累', translation: 'cansado', category: 'adjective', icon: Briefcase },
  { id: 'congming', label: 'congming', hanzi: '聪明', translation: 'inteligente', category: 'adjective', icon: GraduationCap },
  { id: 'piaoliang', label: 'piaoliang', hanzi: '漂亮', translation: 'bonito(a)', category: 'adjective', icon: Tag },
  { id: 'shuai', label: 'shuai', hanzi: '帅', translation: 'bonito (homem)', category: 'adjective', icon: User },

  // Numbers (0 to 9 + liang)
  { id: 'ling', label: 'ling', hanzi: '零', translation: '0', category: 'number', icon: Type },
  { id: 'yi', label: 'yi', hanzi: '一', translation: '1', category: 'number', icon: Type },
  { id: 'yao', label: 'yao', hanzi: '幺', translation: '1 (tel)', category: 'number', icon: Type },
  { id: 'er', label: 'er', hanzi: '二', translation: '2 (dígito)', category: 'number', icon: Type },
  { id: 'liang', label: 'liang', hanzi: '两', translation: '2 (quantidade)', category: 'number', icon: Type },
  { id: 'san', label: 'san', hanzi: '三', translation: '3', category: 'number', icon: Type },
  { id: 'si', label: 'si', hanzi: '四', translation: '4', category: 'number', icon: Type },
  { id: 'wu', label: 'wu', hanzi: '五', translation: '5', category: 'number', icon: Type },
  { id: 'liu', label: 'liu', hanzi: '六', translation: '6', category: 'number', icon: Type },
  { id: 'qi', label: 'qi', hanzi: '七', translation: '7', category: 'number', icon: Type },
  { id: 'ba', label: 'ba', hanzi: '八', translation: '8', category: 'number', icon: Type },
  { id: 'jiu', label: 'jiu', hanzi: '九', translation: '9', category: 'number', icon: Type },

  // Etiquette
  { id: 'qing', label: 'qing', hanzi: '请', translation: 'por favor', category: 'etiquette', icon: UserCheck },
  { id: 'xie_xie', label: 'xie xie', hanzi: '谢谢', translation: 'obrigado', category: 'etiquette', icon: UserCheck },
  { id: 'zaijian', label: 'zài jiàn', hanzi: '再见', translation: 'tchau / até logo', category: 'etiquette', icon: Smile },
];

// Map of multi-word / compound pinyins to dictionary ID
const COMPOUND_PINYIN_MAP: Record<string, string> = {
  'mei': 'mei',
  'hui': 'hui',
  'zao shang': 'zaoshang',
  'zaoshang': 'zaoshang',
  'da jia': 'dajia',
  'dajia': 'dajia',
  'zai jian': 'zaijian',
  'zaijian': 'zaijian',
  'yi dian': 'yidian',
  'yidian': 'yidian',
  'yi dianr': 'yidian',
  'yidianr': 'yidian',
  'yi dian dian': 'yidian',
  'yidiandian': 'yidian',
  'han yu': 'hanyu',
  'hanyu': 'hanyu',
  'xie xie': 'xie_xie',
  'xiexie': 'xie_xie',
  'ke yi': 'keyi',
  'keyi': 'keyi',
  'duo shao': 'duoshao',
  'duoshao': 'duoshao',
  'ming zi': 'mingzi',
  'mingzi': 'mingzi',
  'tong xue': 'tongxue',
  'tongxue': 'tongxue',
  'lao shi': 'laoshi',
  'laoshi': 'laoshi',
  'peng you': 'pengyou',
  'pengyou': 'pengyou',
  'xue sheng': 'xuesheng',
  'xuesheng': 'xuesheng',
  'xue xiao': 'xuexiao',
  'xuexiao': 'xuexiao',
  'da xue': 'daxue',
  'daxue': 'daxue',
  'dian hua': 'dianhua',
  'dianhua': 'dianhua',
  'hao ma': 'haoma',
  'haoma': 'haoma',
  'you jian': 'youjian',
  'youjian': 'youjian',
  'gong zuo': 'gongzuo',
  'gongzuo': 'gongzuo',
  'jia na da': 'jianada',
  'jianada': 'jianada',
  'pu tao ya': 'putaoya',
  'putaoya': 'putaoya',
  'ba xi': 'baxi',
  'baxi': 'baxi',
  'gao xing': 'gaoxing',
  'gaoxing': 'gaoxing',
  'cong ming': 'congming',
  'congming': 'congming',
  'piao liang': 'piaoliang',
  'piaoliang': 'piaoliang',
  'mi fan': 'mifan',
  'mifan': 'mifan',
  'mian bao': 'mianbao',
  'mianbao': 'mianbao',
  'zhi dao': 'zhidao',
  'zhidao': 'zhidao',
  'zen me yang': 'zenmeyang',
  'zenme yang': 'zenmeyang',
  'zenmeyang': 'zenmeyang',
  'na li': 'nali',
  'nali': 'nali',
  'shen me': 'shenme',
  'shenme': 'shenme',
  'ba ba': 'baba',
  'baba': 'baba',
  'ma ma': 'mama',
  'mama': 'mama',
  'ge ge': 'gege',
  'gege': 'gege',
  'jie jie': 'jiejie',
  'jiejie': 'jiejie',
  'di di': 'didi',
  'didi': 'didi',
  'mei mei': 'meimei',
  'meimei': 'meimei',
  'ye ye': 'yeye',
  'yeye': 'yeye',
  'nai nai': 'nainai',
  'nainai': 'nainai',
};

// Helper for natural/fluent idiomatic translation of Mandarin phrases to Portuguese
function getNaturalTranslation(seq: Word[]): string {
  if (seq.length === 0) return '';
  
  const key = seq.map(w => {
    if (w.id === 'zaoshang') return 'zao shang';
    if (w.id === 'dajia') return 'da jia';
    if (w.id === 'zaijian') return 'zai jian';
    if (w.id === 'laoshi') return 'lao shi';
    if (w.id === 'tongxue') return 'tong xue';
    if (w.id === 'pengyou') return 'peng you';
    if (w.id === 'duoshao') return 'duo shao';
    if (w.id === 'zenmeyang') return 'zen me yang';
    if (w.id === 'kafei') return 'ka fei';
    if (w.id === 'xie_xie') return 'xie xie';
    return w.id;
  }).join(' ');

  const IDIOMS: Record<string, string> = {
    'ni hao': 'Olá! / Oi!',
    'nin hao': 'Olá! (formal / com respeito)',
    'ni men hao': 'Olá a todos! / Olá a vocês!',
    'da jia hao': 'Olá a todos!',
    'zao shang hao': 'Bom dia!',
    'lao shi hao': 'Olá, professor(a)!',
    'tong xue hao': 'Olá, colegas/alunos!',
    'peng you hao': 'Olá, amigo(a)!',
    'ni hao ma': 'Como vai você? / Tudo bem?',
    'nin hao ma': 'Como vai o senhor/a senhora?',
    'ni men hao ma': 'Como vocês estão? / Tudo bem com vocês?',
    'wo hen hao': 'Eu estou muito bem.',
    'wo ye hen hao': 'Eu também estou muito bem.',
    'wo ye xihuan kafei': 'Eu também gosto de café.',
    'wo ye xihuan cha': 'Eu também gosto de chá.',
    'wo ye shi laoshi': 'Eu também sou professor(a).',
    'wo ye shi xuesheng': 'Eu também sou estudante/aluno(a).',
    'wo ye shi baxi ren': 'Eu também sou brasileiro(a).',
    'wo ye bu zhidao': 'Eu também não sei.',
    'bu hao': 'Não estou bem / Ruim.',
    'hao de': 'Certo / Está bem / Ok.',
    'hao bu hao': 'Que tal? / Está de acordo?',
    'xie xie': 'Obrigado(a)!',
    'xie xie ni': 'Obrigado a você!',
    'xie xie nin': 'Muito obrigado ao senhor/à senhora!',
    'xie xie da jia': 'Obrigado a todos!',
    'zai jian': 'Tchau! / Até logo!',
    'lao shi zai jian': 'Tchau, professor(a)! / Até logo!',
    'tong xue zai jian': 'Tchau, colegas! / Até logo!',
    'da jia zai jian': 'Tchau a todos! / Até logo!',
    'zai jian lao shi': 'Tchau, professor(a)!',
    'zai jian da jia': 'Tchau a todos!',
    'qing zuo': 'Por favor, sente-se.',
    'qing he cha': 'Por favor, tome um chá.',
    'qing he ka fei': 'Por favor, tome um café.',
    'qing he shui': 'Por favor, beba água.',
    'qing jin': 'Por favor, entre.',
    'qing shuo': 'Por favor, pode falar.',
    'duo shao qian': 'Quanto custa? / Qual o preço?',
    'zhe ge duo shao qian': 'Quanto custa este aqui?',
    'na_dem ge duo shao qian': 'Quanto custa aquele lá?',
    'ba xi zen me yang': 'Como é o Brasil?',
    'zhong guo zen me yang': 'Como é a China?',
    'ka fei zen me yang': 'Como está o café?',
    'cha zen me yang': 'Como está o chá?',
    'gong zuo zen me yang': 'Como está o trabalho?',
    'zhe ge zen me yang': 'Que tal este?',
  };

  if (IDIOMS[key]) {
    return IDIOMS[key];
  }

  return seq.map(w => w.translation).join(' ');
}

// Helper to check if a sequence of words forms a valid/complete sentence
function checkIsValid(seq: Word[]): boolean {
  if (seq.length === 0) return false;
  const last = seq[seq.length - 1];

  // If it ends with a question particle or question pronoun (except 'na' and 'ji')
  if (last.category === 'question' && last.id !== 'na' && last.id !== 'ji') return true;

  // Check if the sentence has an interrogative particle or word
  const hasQuestion = seq.some(w => ['na', 'shenme', 'duoshao', 'nali', 'zenmeyang', 'shei', 'ji', 'ma'].includes(w.id));
  const verbExists = seq.some(w => w.category === 'verb');

  // If last is noun, country, suffix, adjective, number, thing, family
  if (['noun', 'country', 'suffix', 'adjective', 'number', 'thing', 'family'].includes(last.category)) {
    // Exception: standalone country names baxi, jianada, putaoya need a suffix or noun
    if (['baxi', 'jianada', 'putaoya'].includes(last.id)) return false;
    if (last.id === 'nan' || last.id === 'nü') return false;
    if (last.id === 'dianhua') return seq.some(w => w.id === 'da_call');
    
    // If last is 'ren' (e.g. 'wo jia you si kou ren', 'ni jia you ji kou ren', 'wo shi baxi ren')
    if (last.id === 'ren') return true;

    // If last is family member or thing or noun, valid if there is a verb or adjective or question or negative mei
    if (['family', 'thing', 'noun'].includes(last.category)) {
      if (verbExists || seq.some(w => w.category === 'adjective' || w.id === 'mei') || hasQuestion) {
        return true;
      }
      return false;
    }

    if (last.category === 'adjective') return true;
    if (last.category === 'number') return true;
    return true;
  }

  // If ending in yidian (e.g. wo hui shuo yidian, wo zhidao yidian)
  if (last.id === 'yidian') {
    return verbExists;
  }

  // If it's a verb, but NOT transitive verbs requiring objects (unless negated or preceded by auxiliary verbs keyi/hui/qing in short dialogue)
  if (last.category === 'verb') {
    const isNegated = seq.some(w => w.id === 'bu' || w.id === 'mei');
    const isModalOrPolite = seq.some(w => ['keyi', 'hui', 'qing'].includes(w.id));
    if (last.id === 'zhidao') return true; // 'wo zhidao' or 'wo bu zhidao' is a complete valid clause
    if ((isNegated || isModalOrPolite) && ['shuo', 'he', 'xihuan'].includes(last.id)) return true; // 'ni keyi shuo', 'wo hui shuo', 'wo bu shuo', 'wo mei shuo', 'qing shuo'
    if (['shi', 'jiao', 'zai', 'keyi', 'hui', 'da_call', 'fa_verb', 'you_verb'].includes(last.id)) {
      return false;
    }
    return true;
    // 'zuo' (sentar), 'jin' (entrar) are valid intransitive endings!
  }

  // If ending in etiquette like xie xie, zai jian, or affirmation like hao de
  if (last.category === 'etiquette' && (last.id === 'xie_xie' || last.id === 'zaijian')) return true;
  if (last.id === 'de' && seq.length === 2 && seq[0].id === 'hao') return true;

  return false;
}

// Pure function returning all allowed words for a given sequence
function getAvailableWordsForSequence(sequence: Word[]): Word[] {
  const getBaseWords = (): Word[] => {
    if (sequence.length === 0) {
      // Can start with pronoun, etiquette, shei, duoshao, family members, things, nouns, countries, or hao
      return WORDS.filter(w => 
        w.category === 'pronoun' || 
        w.category === 'etiquette' || 
        w.category === 'family' ||
        w.category === 'country' ||
        w.id === 'shei' ||
        w.id === 'duoshao' ||
        w.id === 'hao' ||
        w.category === 'thing' ||
        w.category === 'noun'
      );
    }

    const last = sequence[sequence.length - 1];
    const prev = sequence.length > 1 ? sequence[sequence.length - 2] : null;
    
    // Find active verb in the sequence
    const activeVerb = [...sequence].reverse().find(w => w.category === 'verb');
    const verbExists = sequence.some(w => w.category === 'verb');
    const hasQuestion = sequence.some(w => ['na', 'shenme', 'duoshao', 'nali', 'zenmeyang', 'shei', 'ji'].includes(w.id));

    // Case: shei selected as subject
    if (last.id === 'shei' && !verbExists) {
      return WORDS.filter(w => w.category === 'verb' || w.category === 'adverb');
    }

    // Case: Etiquette selected
    if (last.category === 'etiquette') {
      if (last.id === 'qing') {
        return WORDS.filter(w => ['zuo', 'he', 'jin', 'shuo', 'keyi'].includes(w.id));
      }
      if (last.id === 'xie_xie') {
        return WORDS.filter(w => w.category === 'pronoun' || w.category === 'family' || w.id === 'dajia');
      }
      if (last.id === 'zaijian') {
        return WORDS.filter(w => ['laoshi', 'tongxue', 'pengyou', 'dajia'].includes(w.id));
      }
      return [];
    }

    // Case: Preposition selected (ex: gei)
    if (last.category === 'preposition') {
      if (last.id === 'gei') {
        // Must be followed by recipient (pronoun, noun, family)
        return WORDS.filter(w => w.category === 'pronoun' || w.category === 'noun' || w.category === 'family');
      }
      return [];
    }

    // Case: Conjunction selected (ex: he_conj)
    if (last.category === 'conjunction') {
      if (last.id === 'he_conj') {
        // Must be followed by pronoun, noun, family, thing, country
        return WORDS.filter(w => {
          if (['pronoun', 'noun', 'family', 'thing', 'country'].includes(w.category)) {
            return !['zhe', 'na_dem', 'nan', 'nü', 'dianhua', 'haoma', 'gongzuo'].includes(w.id);
          }
          return false;
        });
      }
      return [];
    }

    // Case: Pronoun selected (wo, ni, ta, zhe, na_dem)
    if (last.category === 'pronoun') {
      // If we just had a preposition like 'gei' + pronoun (ex: wo gei ni), we must follow with a verb
      if (prev?.category === 'preposition' && prev.id === 'gei') {
        return WORDS.filter(w => ['da_call', 'fa_verb', 'shuo'].includes(w.id));
      }

      // If a verb exists in the sequence (Pronoun as Object)
      if (verbExists) {
        if (activeVerb?.id === 'xihuan') {
          return WORDS.filter(w => {
            if (w.id === 'ma' && !hasQuestion && !sequence.some(s => s.id === 'ma')) return true;
            return false;
          });
        }
        
        return WORDS.filter(w => {
          if (['plural', 'possessive'].includes(w.category)) return true;
          if (w.id === 'ma' && !hasQuestion && !sequence.some(s => s.id === 'ma')) return true;
          return false;
        });
      } else {
        // Pronoun as Subject:
        // Rule 1: Dispensa o possessivo "de" para elementos da família e casa (wo jia, wo baba, etc.)
        return WORDS.filter(w => {
          // Can take family members directly or jia
          if (w.category === 'family') return true;
          // Can take plural (except for 'zhe' and 'na_dem')
          if (w.category === 'plural' && last.id !== 'zhe' && last.id !== 'na_dem') return true;
          if (['possessive', 'adverb', 'verb', 'adjective'].includes(w.category)) return true;
          if (w.id === 'zenmeyang') return true;
          if (w.category === 'preposition') return true; // ex: wo gei ...
          if (['zhe', 'na_dem'].includes(last.id)) {
            if (w.category === 'classifier' || w.category === 'thing' || w.category === 'noun' || w.id === 'duoshao') return true;
          }
          return false;
        });
      }
    }

    // Case: Family & Home selected (jia, baba, mama, gege, jiejie, didi, meimei, yeye, nainai)
    if (last.category === 'family') {
      // If recipient after preposition 'gei' (ex: wo gei mama...)
      if (prev?.category === 'preposition' && prev.id === 'gei') {
        return WORDS.filter(w => ['da_call', 'fa_verb', 'shuo'].includes(w.id));
      }

      // If last is 'jia' (casa / família)
      if (last.id === 'jia') {
        return WORDS.filter(w => {
          if (w.category === 'verb') return true; // ex: you_verb, shi, zai
          if (w.category === 'adverb') return true; // ex: hen, dou, ye, bu
          if (w.category === 'possessive') return true; // ex: jia de...
          if (['zenmeyang', 'duoshao'].includes(w.id)) return true;
          return false;
        });
      }

      // Family member as object (after verb)
      if (verbExists) {
        return WORDS.filter(w => {
          if (w.category === 'plural' || w.category === 'possessive') return true;
          if (w.id === 'ma' && !hasQuestion && !sequence.some(s => s.id === 'ma')) return true;
          return false;
        });
      }

      // Family member as subject (before verb)
      return WORDS.filter(w => {
        if (w.category === 'plural' || w.category === 'possessive') return true;
        if (['adverb', 'verb', 'adjective', 'preposition'].includes(w.category)) return true;
        if (w.id === 'zenmeyang') return true;
        return false;
      });
    }

    // Case: Plural selected (men)
    if (last.category === 'plural') {
      if (verbExists) {
        return WORDS.filter(w => {
          if (w.category === 'possessive') return true;
          if (w.id === 'ma' && !hasQuestion && !sequence.some(s => s.id === 'ma')) return true;
          return false;
        });
      } else {
        return WORDS.filter(w => ['possessive', 'adverb', 'verb', 'adjective', 'preposition'].includes(w.category));
      }
    }

    // Case: Possessive selected (de)
    if (last.category === 'possessive') {
      // Must be followed by noun, country, thing, family, or adjective (compound)
      return WORDS.filter(w => ['noun', 'country', 'thing', 'family', 'adjective'].includes(w.category));
    }

    // Case: Adverb selected (hen, bu, mei, dou, ye, zhi, yidian)
    if (last.category === 'adverb') {
      if (last.id === 'yidian') {
        // 'yidian' (一点 - um pouco): followed by nouns (hanyu, etc.), things (shui, cha, etc.), adjectives (mang, lei, etc.) or question particle ma
        return WORDS.filter(w => {
          if (w.id === 'hanyu') return true;
          if (['thing', 'noun', 'adjective'].includes(w.category)) {
            return !['nan', 'nü', 'haoma', 'dianhua'].includes(w.id);
          }
          if (w.id === 'ma') return true;
          return false;
        });
      }
      if (last.id === 'hen') {
        return WORDS.filter(w => w.category === 'adjective');
      }
      if (last.id === 'bu') {
        // In Mandarin, 'bu' cannot negate 'you' (ter/haver) -> must use 'mei' (没)
        return WORDS.filter(w => (w.category === 'verb' && w.id !== 'you_verb') || w.category === 'adjective');
      }
      if (last.id === 'mei') {
        // 'mei' (没) negates 'you' (ter/haver) and past actions, or directly precedes nouns/things in colloquial speech (e.g. wo mei gongzuo)
        // Note: 'shi' is negated with 'bu shi' (不是), not 'mei shi'
        return WORDS.filter(w => (w.category === 'verb' && w.id !== 'shi') || ['noun', 'thing', 'family'].includes(w.category));
      }
      return WORDS.filter(w => w.category === 'verb' || ['hen', 'bu', 'mei'].includes(w.id));
    }

    // Case: Verb selected
    if (last.category === 'verb') {
      if (last.id === 'you_verb') {
        // you can take numbers, question particles (ji, shenme, duoshao), classifiers, family members, things, nouns, or yidian (e.g. you yidian mang)
        return WORDS.filter(w => {
          if (w.id === 'yidian') return true;
          if (['number', 'classifier', 'family', 'thing', 'noun'].includes(w.category)) return true;
          if (['ji', 'shenme', 'duoshao', 'shei'].includes(w.id)) return true;
          if (w.category === 'pronoun' && !['zhe', 'na_dem'].includes(w.id)) return true;
          return false;
        });
      }

      if (last.id === 'xihuan') {
        const subjectPronoun = sequence.find(w => w.category === 'pronoun');
        return WORDS.filter(w => {
          if (['thing', 'family'].includes(w.category)) return true;
          if (w.category === 'question') return ['shei', 'shenme'].includes(w.id);
          if (w.category === 'pronoun' && w.id !== subjectPronoun?.id && w.id !== 'zhe') return true;
          return false;
        });
      }

      if (last.id === 'shuo') {
        return WORDS.filter(w => {
          if (w.id === 'hanyu' || w.id === 'yidian' || w.id === 'na' || w.id === 'shenme') return true;
          if (w.category === 'country') {
            return !['baxi', 'jianada'].includes(w.id);
          }
          if (w.category === 'pronoun') return true;
          if (w.id === 'ma') return true;
          return false;
        });
      }

      if (last.id === 'jiao') {
        return WORDS.filter(w => w.id === 'shenme' || w.category === 'noun' || w.category === 'pronoun');
      }

      if (last.id === 'zai') {
        return WORDS.filter(w => w.id === 'nali' || ['xuexiao', 'daxue', 'country'].includes(w.category) || w.id === 'jia');
      }

      if (last.id === 'keyi') {
        // 'keyi' (可以 - poder / permissão): seguido de ações (shuo, zuo, he, jin, da_call, fa_verb) ou preposição gei
        return WORDS.filter(w => ['shuo', 'zuo', 'he', 'jin', 'da_call', 'fa_verb'].includes(w.id) || w.id === 'gei');
      }

      if (last.id === 'hui') {
        // 'hui' (会 - poder / saber como habilidade adquirida): seguido de ações (shuo, zuo, he, da_call, fa_verb, jin)
        return WORDS.filter(w => ['shuo', 'zuo', 'he', 'da_call', 'fa_verb', 'jin'].includes(w.id));
      }

      if (last.id === 'da_call') {
        return WORDS.filter(w => w.id === 'dianhua');
      }

      if (last.id === 'fa_verb') {
        return WORDS.filter(w => w.id === 'youjian');
      }

      if (last.id === 'zhidao') {
        return WORDS.filter(w => w.id === 'yidian' || ['noun', 'thing', 'pronoun', 'question', 'family'].includes(w.category));
      }

      if (last.id === 'he') {
        return WORDS.filter(w => ['shui', 'cha', 'kafei', 'tang', 'yidian'].includes(w.id));
      }

      // Default verb output (e.g. 'shi'): can follow with nouns, countries, pronouns, family, questions, things, numbers
      return WORDS.filter(w => {
        if (['na', 'shenme', 'duoshao', 'nali', 'zenmeyang', 'shei', 'ji'].includes(w.id)) return true;
        if (['noun', 'country', 'pronoun', 'thing', 'family', 'number'].includes(w.category)) return true;
        return false;
      });
    }

    // Case: Question particles
    if (last.category === 'question') {
      if (last.id === 'duoshao') {
        // 'duoshao' (多少 - quanto): followed by 'qian' (dinheiro / preço), 'ren', 'ge_class', 'kou', 'xuesheng', 'laoshi', things, nouns
        return WORDS.filter(w => ['qian', 'ren', 'ge_class', 'kou', 'xuesheng', 'laoshi', 'tongxue'].includes(w.id) || ['thing', 'noun'].includes(w.category));
      }

      if (last.id === 'ji') {
        // 'ji' is question particle for quantity (family/things < 10)
        // Followed by: classifier (kou, ge_class), family members directly, things, or nouns (ren, etc.)
        return WORDS.filter(w => {
          if (w.category === 'classifier') return true;
          if (w.category === 'family' && w.id !== 'jia') return true;
          if (['ren', 'pengyou', 'tongxue', 'xuesheng', 'laoshi'].includes(w.id)) return true;
          if (['shu', 'mao', 'gou'].includes(w.id)) return true;
          return false;
        });
      }

      if (last.id === 'na' || last.id === 'shenme') {
        return WORDS.filter(w => {
          if (last.id === 'na' && w.id === 'guo') return true;
          if (w.category === 'country' && activeVerb?.id === 'shuo') {
            return !['baxi', 'jianada'].includes(w.id);
          }
          if (last.id === 'shenme' && w.id === 'mingzi') return true;
          if (last.id === 'shenme' && w.id === 'gongzuo') return true;
          return ['noun', 'country', 'thing', 'family'].includes(w.category);
        });
      }
    }

    // Case: Classifiers (kou, ge_class)
    if (last.category === 'classifier') {
      if (last.id === 'kou') {
        // kou -> ren (most common family measure: kou ren) or family members
        return WORDS.filter(w => w.id === 'ren' || (w.category === 'family' && w.id !== 'jia'));
      }
      if (last.id === 'ge_class') {
        // ge -> family members, nouns, things, suffix ren, question (duoshao, zenmeyang)
        return WORDS.filter(w => {
          if (w.id === 'duoshao' || w.id === 'zenmeyang') return true;
          if (w.category === 'family' && w.id !== 'jia') return true;
          if (['noun', 'thing'].includes(w.category)) {
            return !['nan', 'nü', 'haoma', 'dianhua'].includes(w.id);
          }
          if (w.id === 'ren') return true;
          return false;
        });
      }
    }

    // Case: Country selected
    if (last.category === 'country') {
      if (verbExists) {
        if (last.requiresGuo && activeVerb?.id === 'shi') {
          return WORDS.filter(w => w.id === 'guo' || w.id === 'ren');
        }
        
        return WORDS.filter(w => {
          if (w.category !== 'suffix') return false;
          const supportsLanguageSuffix = !['baxi', 'jianada', 'putaoya'].includes(last.id);

          if (activeVerb?.id === 'shuo') {
            return w.id === 'yu' && supportsLanguageSuffix;
          }
          if (activeVerb?.id === 'shi') {
            return w.id === 'ren';
          }
          return true;
        });
      } else {
        // Country as subject or topic (e.g. "baxi zenmeyang?", "zhongguo hen da", "baxi ren", "fayu")
        return WORDS.filter(w => {
          if (w.id === 'zenmeyang') return true;
          if (last.requiresGuo && w.id === 'guo') return true;
          if (w.id === 'ren') return true;
          const supportsLanguageSuffix = !['baxi', 'jianada', 'putaoya'].includes(last.id);
          if (w.id === 'yu' && supportsLanguageSuffix) return true;
          if (['adverb', 'verb', 'adjective', 'possessive'].includes(w.category)) return true;
          return false;
        });
      }
    }

    // Case: Guo selected
    if (last.category === 'guo') {
      if (verbExists) {
        return WORDS.filter(w => w.id === 'ren');
      } else {
        return WORDS.filter(w => {
          if (w.id === 'ren' || w.id === 'zenmeyang') return true;
          if (['adverb', 'verb', 'adjective', 'possessive'].includes(w.category)) return true;
          return false;
        });
      }
    }

    // Case: Suffix, Noun, Thing, Adjective, Number
    if (
      last.category === 'suffix' || 
      last.category === 'noun' || 
      last.category === 'thing' || 
      last.category === 'adjective' ||
      last.category === 'number'
    ) {
      // Sub-rules for nested noun compound combinations
      if (prev?.category === 'preposition' && prev.id === 'gei') {
        return WORDS.filter(w => ['da_call', 'fa_verb', 'shuo'].includes(w.id));
      }

      if (last.id === 'nan' || last.id === 'nü') {
        return WORDS.filter(w => w.id === 'pengyou');
      }
      if (last.id === 'dianhua') {
        return WORDS.filter(w => w.id === 'haoma' || w.id === 'da_call');
      }
      if (last.id === 'haoma') {
        return WORDS.filter(w => w.id === 'duoshao' || w.category === 'number' || w.id === 'shi');
      }
      if (last.id === 'gongzuo') {
        return WORDS.filter(w => w.id === 'zenmeyang' || w.category === 'adjective' || w.category === 'verb');
      }

      // If number selected (e.g. si, liang, er, san...):
      // Can be followed by classifier (kou, ge_class), family members directly (ex: wo you liang didi), things (liang mao), nouns (ren), or other digits (phone number)
      if (last.category === 'number') {
        return WORDS.filter(w => {
          if (w.category === 'classifier') return true;
          if (w.category === 'family' && w.id !== 'jia') return true;
          if (['thing', 'number'].includes(w.category)) return true;
          if (['ren', 'pengyou', 'xuesheng', 'laoshi'].includes(w.id)) return true;
          if (w.id === 'ma') return true;
          return false;
        });
      }

      // Adjective endings
      if (last.category === 'adjective') {
        return WORDS.filter(w => {
          if (w.id === 'ma') return true;
          if (last.id === 'hao' && (w.id === 'de' || w.id === 'bu')) return true;
          return false;
        });
      }

      // General endings
      if (!verbExists && !hasQuestion) {
        return WORDS.filter(w => ['adverb', 'verb', 'adjective', 'question', 'possessive'].includes(w.category));
      }

      // Questions are final, but can have 'ma' if not a question already
      if (!hasQuestion && !sequence.some(w => w.id === 'ma')) {
        return WORDS.filter(w => w.id === 'ma');
      }

      return [];
    }

    return [];
  };

  const baseWords = getBaseWords();
  let finalWords = [...baseWords];

  // Leave question particles (like 'ma') available after standard complete sentence is formed
  if (checkIsValid(sequence)) {
    const hasQuestion = sequence.some(w => ['na', 'shenme', 'duoshao', 'nali', 'zenmeyang', 'shei', 'ji'].includes(w.id));
    const hasMa = sequence.some(w => w.id === 'ma');
    if (!hasQuestion && !hasMa) {
      const maWord = WORDS.find(w => w.id === 'ma');
      if (maWord && !finalWords.some(w => w.id === 'ma')) {
        finalWords.push(maWord);
      }
    }
  }

  if (sequence.length > 0) {
    const last = sequence[sequence.length - 1];
    
    // Rule for adding 'he_conj' (conjunction "e")
    const nounCategories = ['suffix', 'noun', 'thing', 'country', 'pronoun', 'family'];
    const restrictedIds = ['zhe', 'na_dem', 'nan', 'nü', 'dianhua', 'haoma', 'gongzuo'];
    if (nounCategories.includes(last.category) && !restrictedIds.includes(last.id)) {
      const heConjWord = WORDS.find(w => w.id === 'he_conj');
      if (heConjWord && !finalWords.some(w => w.id === 'he_conj')) {
        finalWords.push(heConjWord);
      }
    }
  }

  return finalWords;
}

// Function to normalize pinyin / search text (remove diacritics, lowercase, strip punctuation)
function normalizePinyinText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Calculate Levenshtein edit distance between two strings
function levenshteinDistance(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  const dp: number[][] = [];
  for (let i = 0; i <= al; i++) {
    dp[i] = [i];
  }
  for (let j = 0; j <= bl; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[al][bl];
}

// Find candidate words in vocabulary for a given token (exact match)
function findCandidatesForToken(rawToken: string): Word[] {
  const norm = normalizePinyinText(rawToken);
  if (!norm && !rawToken.trim()) return [];

  // 1. Check compound pinyin map
  const mappedId = COMPOUND_PINYIN_MAP[norm];
  if (mappedId) {
    const word = WORDS.find(w => w.id === mappedId);
    if (word) return [word];
  }

  // 2. Direct Hanzi match
  const hanziMatches = WORDS.filter(w => w.hanzi === rawToken.trim());
  if (hanziMatches.length > 0) return hanziMatches;

  // 3. Direct ID match
  const idMatches = WORDS.filter(w => w.id === norm);
  if (idMatches.length > 0) return idMatches;

  // 4. Normalized Label match
  const labelMatches = WORDS.filter(w => normalizePinyinText(w.label) === norm);
  if (labelMatches.length > 0) return labelMatches;

  // 5. Special aliases (nu/nv for nü)
  if (norm === 'nu' || norm === 'nv') {
    const nuWord = WORDS.find(w => w.id === 'nü');
    if (nuWord) return [nuWord];
  }

  // 6. Portuguese exact translation match
  const transMatches = WORDS.filter(w => normalizePinyinText(w.translation) === norm);
  if (transMatches.length > 0) return transMatches;

  return [];
}

// Find closest word in vocabulary for a given misspelled or approximate token
function findClosestWordForToken(
  rawToken: string,
  previousWords: Word[] = []
): { word: Word; score: number; pinyinKey: string } | null {
  const norm = normalizePinyinText(rawToken);
  if (!norm) return null;

  // Words that are grammatically allowed after previousWords (if provided)
  const allowed = previousWords.length > 0 ? getAvailableWordsForSequence(previousWords) : [];

  let bestMatch: { word: Word; score: number; pinyinKey: string } | null = null;
  let highestScore = -Infinity;

  for (const word of WORDS) {
    const wordPinyins = [
      normalizePinyinText(word.label),
      normalizePinyinText(word.id.replace(/_.*$/, '')),
    ];

    // Add compound pinyin keys
    for (const [mapKey, mappedId] of Object.entries(COMPOUND_PINYIN_MAP)) {
      if (mappedId === word.id) {
        wordPinyins.push(mapKey);
      }
    }

    const isGrammaticallyAllowed = allowed.some(aw => aw.id === word.id);

    for (const targetPinyin of wordPinyins) {
      if (!targetPinyin) continue;

      const dist = levenshteinDistance(norm, targetPinyin);
      const maxLen = Math.max(norm.length, targetPinyin.length);
      
      const maxAllowedDist = maxLen <= 3 ? 1 : maxLen <= 5 ? 2 : 3;
      if (dist > maxAllowedDist) continue;

      // Base score
      let score = 1 - (dist / maxLen);

      // Prefix match bonus (e.g. "xihua" -> "xihuan", "laosh" -> "laoshi")
      if (targetPinyin.startsWith(norm) || norm.startsWith(targetPinyin)) {
        score += 0.25;
      }

      // Substring bonus
      if (targetPinyin.includes(norm) || norm.includes(targetPinyin)) {
        score += 0.15;
      }

      // Vowel / diphthong similarity (e.g. "ko" vs "kou", "ho" vs "hao", "she" vs "shei", "laosh" vs "laoshi")
      if (
        (norm.endsWith('o') && targetPinyin.endsWith('ou')) ||
        (norm.endsWith('o') && targetPinyin.endsWith('ao')) ||
        (norm.endsWith('e') && targetPinyin.endsWith('ei')) ||
        (norm.endsWith('n') && targetPinyin.endsWith('ng')) ||
        (norm.startsWith('sh') && targetPinyin.startsWith('s')) ||
        (norm.startsWith('zh') && targetPinyin.startsWith('z')) ||
        (norm.startsWith('ch') && targetPinyin.startsWith('c'))
      ) {
        score += 0.25;
      }

      // Grammatical alignment bonus (e.g. after "si", measure word "kou" is expected)
      if (isGrammaticallyAllowed) {
        score += 0.40;
      }

      if (score > highestScore && score >= 0.45) {
        highestScore = score;
        bestMatch = {
          word,
          score,
          pinyinKey: targetPinyin,
        };
      }
    }

    // Check Portuguese translation similarity (e.g. "obrigdo" -> "obrigado")
    const normTrans = normalizePinyinText(word.translation);
    const transDist = levenshteinDistance(norm, normTrans);
    const transMaxLen = Math.max(norm.length, normTrans.length);
    if (transDist <= 2 && transMaxLen > 3) {
      let transScore = (1 - transDist / transMaxLen) + (isGrammaticallyAllowed ? 0.35 : 0);
      if (transScore > highestScore && transScore >= 0.5) {
        highestScore = transScore;
        bestMatch = {
          word,
          score: transScore,
          pinyinKey: word.label,
        };
      }
    }
  }

  return bestMatch;
}

export interface DidYouMeanPart {
  text: string;
  isChanged: boolean;
  word?: Word;
}

export interface DidYouMeanResult {
  originalQuery: string;
  suggestedText: string;
  parts: DidYouMeanPart[];
  hasCorrections: boolean;
  suggestedWords: Word[];
}

// Generate "Did you mean" suggestion for search queries / full phrases
function getDidYouMeanSuggestion(input: string, currentActiveSequence: Word[] = []): DidYouMeanResult | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const tokens = tokenizePhraseInput(trimmed);
  if (tokens.length === 0) return null;

  const parts: DidYouMeanPart[] = [];
  const suggestedTokens: string[] = [];
  const suggestedWords: Word[] = [];
  let hasCorrections = false;
  let trackedSeq: Word[] = [...currentActiveSequence];

  // Case 1: Single token search
  if (tokens.length === 1) {
    const rawToken = tokens[0];
    const exactMatches = findCandidatesForToken(rawToken);

    // If exact match already exists in dictionary, no correction needed
    if (exactMatches.length > 0) {
      return null;
    }

    const closest = findClosestWordForToken(rawToken, currentActiveSequence);
    if (closest) {
      const suggestedPinyin = closest.pinyinKey || closest.word.label;
      return {
        originalQuery: input,
        suggestedText: suggestedPinyin,
        parts: [{
          text: suggestedPinyin.toUpperCase(),
          isChanged: true,
          word: closest.word,
        }],
        hasCorrections: true,
        suggestedWords: [closest.word],
      };
    }
    return null;
  }

  // Case 2: Multi-word phrase query (e.g. "wo jia you si ko ren", "wo bu you gongzuo")
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const exactMatches = findCandidatesForToken(token);

    if (exactMatches.length > 0) {
      // Valid word found
      const allowed = getAvailableWordsForSequence(trackedSeq);
      let validMatch = exactMatches.find(c => allowed.some(a => a.id === c.id));

      // Special Grammar Auto-Correction: "bu you" -> "mei you" (negating 'you' with 'mei')
      if (
        !validMatch &&
        exactMatches.some(c => c.id === 'you_verb') &&
        trackedSeq.length > 0 &&
        trackedSeq[trackedSeq.length - 1].id === 'bu'
      ) {
        const meiWord = WORDS.find(w => w.id === 'mei')!;
        trackedSeq[trackedSeq.length - 1] = meiWord;

        if (parts.length > 0) {
          parts[parts.length - 1] = {
            text: 'MEI',
            isChanged: true,
            word: meiWord,
          };
          suggestedTokens[suggestedTokens.length - 1] = 'mei';
        }
        hasCorrections = true;

        const updatedAllowed = getAvailableWordsForSequence(trackedSeq);
        validMatch = exactMatches.find(c => updatedAllowed.some(a => a.id === c.id)) || exactMatches[0];
      } else if (
        !validMatch &&
        exactMatches.some(c => c.id === 'shi') &&
        trackedSeq.length > 0 &&
        trackedSeq[trackedSeq.length - 1].id === 'mei'
      ) {
        // "mei shi" -> "bu shi"
        const buWord = WORDS.find(w => w.id === 'bu')!;
        trackedSeq[trackedSeq.length - 1] = buWord;

        if (parts.length > 0) {
          parts[parts.length - 1] = {
            text: 'BU',
            isChanged: true,
            word: buWord,
          };
          suggestedTokens[suggestedTokens.length - 1] = 'bu';
        }
        hasCorrections = true;

        const updatedAllowed = getAvailableWordsForSequence(trackedSeq);
        validMatch = exactMatches.find(c => updatedAllowed.some(a => a.id === c.id)) || exactMatches[0];
      }

      if (!validMatch) {
        validMatch = exactMatches[0];
      }

      trackedSeq.push(validMatch);
      suggestedWords.push(validMatch);
      suggestedTokens.push(token);
      parts.push({
        text: token,
        isChanged: false,
        word: validMatch,
      });
    } else {
      // Token is misspelled (e.g. "ko" in "wo jia you si ko ren")
      const closest = findClosestWordForToken(token, trackedSeq);
      if (closest) {
        hasCorrections = true;
        const replacementPinyin = closest.pinyinKey || closest.word.label;
        suggestedTokens.push(replacementPinyin);
        suggestedWords.push(closest.word);
        trackedSeq.push(closest.word);
        parts.push({
          text: replacementPinyin.toUpperCase(), // Highlight in UPPERCASE (e.g. KOU)
          isChanged: true,
          word: closest.word,
        });
      } else {
        // Unknown token without close match
        suggestedTokens.push(token);
        parts.push({
          text: token,
          isChanged: false,
        });
      }
    }
  }

  if (!hasCorrections) {
    return null;
  }

  const suggestedText = suggestedTokens.join(' ');
  return {
    originalQuery: input,
    suggestedText,
    parts,
    hasCorrections: true,
    suggestedWords,
  };
}

// Split input string into tokens (supporting Hanzi or Pinyin words)
function tokenizePhraseInput(input: string): string[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  // If input contains Chinese characters, greedily match against dictionary
  const hasChinese = /[\u4e00-\u9fa5]/.test(trimmed);
  if (hasChinese) {
    const hanziDict = [...WORDS].sort((a, b) => b.hanzi.length - a.hanzi.length);
    const tokens: string[] = [];
    let i = 0;
    while (i < trimmed.length) {
      if (/[ \t\n\r,，.。!！?？"']/.test(trimmed[i])) {
        i++;
        continue;
      }
      let matched = false;
      for (const w of hanziDict) {
        if (trimmed.startsWith(w.hanzi, i)) {
          tokens.push(w.hanzi);
          i += w.hanzi.length;
          matched = true;
          break;
        }
      }
      if (!matched) {
        tokens.push(trimmed[i]);
        i++;
      }
    }
    return tokens;
  }

  // Latin / Pinyin tokenization
  const rawWords = trimmed
    .split(/[\s,，.。!！?？"'\-]+/)
    .map(w => w.trim())
    .filter(Boolean);

  const tokens: string[] = [];
  let i = 0;
  while (i < rawWords.length) {
    const norm = normalizePinyinText(rawWords[i]);

    // Handle compound negatives written without spaces (meiyou -> mei + you, buyou -> bu + you, buhui -> bu + hui, bukeyi -> bu + keyi)
    if (norm === 'meiyou') {
      tokens.push('mei', 'you');
      i++;
      continue;
    }
    if (norm === 'buyou') {
      tokens.push('bu', 'you');
      i++;
      continue;
    }
    if (norm === 'buhui') {
      tokens.push('bu', 'hui');
      i++;
      continue;
    }
    if (norm === 'bukeyi') {
      tokens.push('bu', 'keyi');
      i++;
      continue;
    }
    if (norm === 'zhege') {
      tokens.push('zhe', 'ge');
      i++;
      continue;
    }
    if (norm === 'nage') {
      tokens.push('na', 'ge');
      i++;
      continue;
    }
    if (norm === 'duoshaoqian') {
      tokens.push('duo shao', 'qian');
      i++;
      continue;
    }
    if (norm === 'nihao') {
      tokens.push('ni', 'hao');
      i++;
      continue;
    }
    if (norm === 'ninhao') {
      tokens.push('nin', 'hao');
      i++;
      continue;
    }
    if (norm === 'nimenhao') {
      tokens.push('ni', 'men', 'hao');
      i++;
      continue;
    }
    if (norm === 'henhao') {
      tokens.push('hen', 'hao');
      i++;
      continue;
    }
    if (norm === 'buhao') {
      tokens.push('bu', 'hao');
      i++;
      continue;
    }
    if (norm === 'haode') {
      tokens.push('hao', 'de');
      i++;
      continue;
    }
    if (norm === 'haobuhao') {
      tokens.push('hao', 'bu', 'hao');
      i++;
      continue;
    }
    if (norm === 'nihaoma') {
      tokens.push('ni', 'hao', 'ma');
      i++;
      continue;
    }
    if (norm === 'ninhaoma') {
      tokens.push('nin', 'hao', 'ma');
      i++;
      continue;
    }
    if (norm === 'zaoshanghao') {
      tokens.push('zaoshang', 'hao');
      i++;
      continue;
    }
    if (norm === 'dajiahao') {
      tokens.push('dajia', 'hao');
      i++;
      continue;
    }
    if (norm === 'zaijian') {
      tokens.push('zaijian');
      i++;
      continue;
    }
    if (norm === 'zaoshang') {
      tokens.push('zaoshang');
      i++;
      continue;
    }
    if (norm === 'dajia') {
      tokens.push('dajia');
      i++;
      continue;
    }

    // Try 3-word window
    if (i + 2 < rawWords.length) {
      const triKey = `${normalizePinyinText(rawWords[i])} ${normalizePinyinText(rawWords[i + 1])} ${normalizePinyinText(rawWords[i + 2])}`;
      if (COMPOUND_PINYIN_MAP[triKey]) {
        tokens.push(`${rawWords[i]} ${rawWords[i + 1]} ${rawWords[i + 2]}`);
        i += 3;
        continue;
      }
    }
    // Try 2-word window
    if (i + 1 < rawWords.length) {
      const biKey = `${normalizePinyinText(rawWords[i])} ${normalizePinyinText(rawWords[i + 1])}`;
      if (COMPOUND_PINYIN_MAP[biKey]) {
        tokens.push(`${rawWords[i]} ${rawWords[i + 1]}`);
        i += 2;
        continue;
      }
    }
    // Single word
    tokens.push(rawWords[i]);
    i++;
  }

  return tokens;
}

export interface PhraseValidationStep {
  token: string;
  word: Word | null;
  status: 'valid' | 'invalid_grammar' | 'unknown_word' | 'unprocessed';
  errorMessage?: string;
  ruleHint?: string;
  position: number;
}

export interface PhraseValidationReport {
  rawInput: string;
  steps: PhraseValidationStep[];
  success: boolean;
  stoppedAtIndex: number | null;
  errorReason?: string;
  validWords: Word[];
  isCompleteSentence: boolean;
  suggestion?: DidYouMeanResult | null;
}

// Function to validate and assemble a full phrase token by token
function validateAndBuildPhrase(input: string): PhraseValidationReport {
  const tokens = tokenizePhraseInput(input);
  if (tokens.length === 0) {
    return {
      rawInput: input,
      steps: [],
      success: false,
      stoppedAtIndex: null,
      validWords: [],
      isCompleteSentence: false,
      suggestion: null,
    };
  }

  const steps: PhraseValidationStep[] = [];
  const currentSeq: Word[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const rawToken = tokens[i];
    const candidates = findCandidatesForToken(rawToken);

    if (candidates.length === 0) {
      // Word does not exist in dictionary - try to find closest match
      const closest = findClosestWordForToken(rawToken, currentSeq);
      const suggestionText = closest
        ? ` Você quis dizer "${closest.pinyinKey || closest.word.label}" (${closest.word.hanzi} - ${closest.word.translation})?`
        : '';

      steps.push({
        token: rawToken,
        word: closest ? closest.word : null,
        status: 'unknown_word',
        errorMessage: `A palavra "${rawToken}" (posição ${i + 1}) não foi encontrada no vocabulário.${suggestionText}`,
        ruleHint: closest
          ? `Sugestão: Substitua "${rawToken}" por "${closest.pinyinKey || closest.word.label}" (${closest.word.hanzi} - ${closest.word.translation}).`
          : 'Verifique a ortografia do pinyin, ideograma ou significado.',
        position: i + 1,
      });

      // Mark remaining tokens as unprocessed
      for (let j = i + 1; j < tokens.length; j++) {
        steps.push({
          token: tokens[j],
          word: null,
          status: 'unprocessed',
          position: j + 1,
        });
      }

      const suggestion = getDidYouMeanSuggestion(input, []);

      return {
        rawInput: input,
        steps,
        success: false,
        stoppedAtIndex: i,
        errorReason: `A palavra "${rawToken}" não foi encontrada no vocabulário.${suggestionText}`,
        validWords: currentSeq,
        isCompleteSentence: checkIsValid(currentSeq),
        suggestion,
      };
    }

    // Get available words for current sequence state
    const allowed = getAvailableWordsForSequence(currentSeq);
    
    // Check if any candidate is in allowed words
    const validCandidate = candidates.find(c => allowed.some(aw => aw.id === c.id));

    if (validCandidate) {
      // Step is grammatically valid!
      currentSeq.push(validCandidate);
      steps.push({
        token: rawToken,
        word: validCandidate,
        status: 'valid',
        position: i + 1,
      });
    } else {
      // Word exists, BUT cannot be placed in this grammatical position!
      const candidate = candidates[0];
      let explanation = '';
      if (i === 0) {
        explanation = `A frase não pode começar com a palavra "${candidate.label}" (${candidate.hanzi} - ${candidate.translation}). No mandarim, inicie com o sujeito (pronome, membro da família ou expressão de cortesia).`;
      } else {
        const prevWord = currentSeq[currentSeq.length - 1];
        if (prevWord.id === 'bu' && candidates.some(c => c.id === 'you_verb')) {
          explanation = `O verbo "you" (有 - ter/haver) e ações no passado não aceitam a negação com "bu" (不). Em vez de "bu", use "mei" (没). Exemplo: "wo mei you gongzuo" (Eu não tenho trabalho/emprego).`;
        } else if (prevWord.id === 'mei' && candidates.some(c => c.id === 'shi')) {
          explanation = `O verbo "shi" (是 - ser) deve ser negado com "bu" (不是 - não ser), enquanto "mei" (没) é reservado para "you" (没有) e ações no passado.`;
        } else {
          explanation = `Após "${prevWord.label}" (${prevWord.hanzi} - ${prevWord.translation}), a palavra "${candidate.label}" (${candidate.hanzi} - ${candidate.translation}) não é permitida pela ordem gramatical.`;
        }
      }

      steps.push({
        token: rawToken,
        word: candidate,
        status: 'invalid_grammar',
        errorMessage: 'A palavra existe, mas não pode ser inserida porque não está na ordem correta para formar uma frase.',
        ruleHint: explanation,
        position: i + 1,
      });

      // Mark remaining tokens as unprocessed
      for (let j = i + 1; j < tokens.length; j++) {
        steps.push({
          token: tokens[j],
          word: null,
          status: 'unprocessed',
          position: j + 1,
        });
      }

      const suggestion = getDidYouMeanSuggestion(input, []);

      return {
        rawInput: input,
        steps,
        success: false,
        stoppedAtIndex: i,
        errorReason: 'A palavra existe, mas não pode ser inserida porque não está na ordem correta para formar uma frase.',
        validWords: currentSeq,
        isCompleteSentence: checkIsValid(currentSeq),
        suggestion,
      };
    }
  }

  // All steps passed successfully!
  return {
    rawInput: input,
    steps,
    success: true,
    stoppedAtIndex: null,
    validWords: currentSeq,
    isCompleteSentence: checkIsValid(currentSeq),
    suggestion: null,
  };
}

export default function App() {
  const [sequence, setSequence] = useState<Word[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [validationReport, setValidationReport] = useState<PhraseValidationReport | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const addWord = (word: Word) => {
    setSequence([...sequence, word]);
    setSearchQuery('');
    setValidationReport(null);
    
    // Focus search input on the next tick
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };
  const removeLast = () => {
    setSequence(sequence.slice(0, -1));
    setValidationReport(null);
  };
  const clearSequence = () => {
    setSequence([]);
    setValidationReport(null);
  };

  // Available words for current sequence state
  const availableWords = useMemo(() => {
    return getAvailableWordsForSequence(sequence);
  }, [sequence]);

  // Helper to check if sequence forms a complete/valid clause
  const isValidSentence = useMemo(() => {
    return checkIsValid(sequence);
  }, [sequence]);

  // Tokens detected in search query
  const tokensInQuery = useMemo(() => {
    return tokenizePhraseInput(searchQuery);
  }, [searchQuery]);

  const isMultiWordQuery = tokensInQuery.length > 1;

  // "Did you mean" suggestion based on current search input
  const didYouMean = useMemo(() => {
    return getDidYouMeanSuggestion(searchQuery, sequence);
  }, [searchQuery, sequence]);

  // Handle phrase validation and assembly
  const handleValidateAndBuildPhrase = (inputToValidate?: string) => {
    const text = inputToValidate !== undefined ? inputToValidate : searchQuery;
    if (!text.trim()) return;

    const report = validateAndBuildPhrase(text);
    setValidationReport(report);

    if (report.validWords.length > 0) {
      setSequence(report.validWords);
    }
    
    if (report.success) {
      setSearchQuery('');
    }
  };

  // Keyboard handler for search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isMultiWordQuery) {
        handleValidateAndBuildPhrase(searchQuery);
      } else if (filteredWords.length > 0) {
        addWord(filteredWords[0]);
      } else if (didYouMean && didYouMean.hasCorrections) {
        setSearchQuery(didYouMean.suggestedText);
        handleValidateAndBuildPhrase(didYouMean.suggestedText);
      } else if (searchQuery.trim()) {
        handleValidateAndBuildPhrase(searchQuery);
      }
    }
  };

  // Check if word is clickable (available to select)
  const isWordClickable = (word: Word) => {
    return availableWords.some(w => w.id === word.id);
  };

  // Filter words by search query and grammar availability for the palette
  const filteredWords = useMemo(() => {
    // Only show words that are currently available to select (grammatically allowed)
    let words = WORDS.filter(w => availableWords.some(aw => aw.id === w.id));

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const normQ = normalizePinyinText(searchQuery);
      words = words.filter(w => 
        normalizePinyinText(w.label).includes(normQ) || 
        normalizePinyinText(w.id).includes(normQ) ||
        w.hanzi.includes(q) || 
        normalizePinyinText(w.translation).includes(normQ)
      );
    }
    return words;
  }, [searchQuery, availableWords]);

  // All words matching the search query in the entire vocabulary
  const matchingDictionaryWords = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const normQ = normalizePinyinText(searchQuery);
    return WORDS.filter(w => 
      normalizePinyinText(w.label).includes(normQ) || 
      normalizePinyinText(w.id).includes(normQ) ||
      w.hanzi.includes(q) || 
      normalizePinyinText(w.translation).includes(normQ)
    );
  }, [searchQuery]);

  // Words matching search query that cannot be inserted at this grammatical position
  const unavailableMatchingWords = useMemo(() => {
    return matchingDictionaryWords.filter(w => !availableWords.some(aw => aw.id === w.id));
  }, [matchingDictionaryWords, availableWords]);

  // Get background color for categories
  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'pronoun': return 'bg-blue-50';
      case 'verb': return 'bg-green-50';
      case 'adverb': return 'bg-yellow-50';
      case 'question': return 'bg-purple-50';
      case 'noun': return 'bg-amber-50';
      case 'family': return 'bg-emerald-50';
      case 'classifier': return 'bg-amber-100';
      case 'country': return 'bg-teal-50';
      case 'plural': return 'bg-indigo-50';
      case 'possessive': return 'bg-rose-100';
      case 'thing': return 'bg-orange-50';
      case 'adjective': return 'bg-yellow-50';
      case 'number': return 'bg-cyan-50';
      case 'preposition': return 'bg-orange-100';
      case 'etiquette': return 'bg-sky-100';
      case 'conjunction': return 'bg-pink-100';
      default: return 'bg-white';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4 md:p-8 flex flex-col items-center justify-center">
      {/* Main App Container */}
      <div className="w-full max-w-4xl bg-white text-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col gap-6 border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl text-white shadow-md">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-display uppercase tracking-tight">Fraseiro Mandarim</h1>
              <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Sentencing Logic Engine v1.8.26</p>
            </div>
          </div>
          <button 
            onClick={clearSequence}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Limpar
          </button>
        </div>

        {/* Prominent Search & Sentence Input Bar Section */}
        <div className="bg-slate-50 hover:bg-slate-100/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 border-2 border-slate-200/80 rounded-2xl p-5 flex flex-col gap-3 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Pesquisar Palavra ou Digitar Frase Completa
              </span>
            </div>
            {isMultiWordQuery && (
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Frase detectada ({tokensInQuery.length} palavras)
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Ex: wo jia you si kou ren, ni hao, 我喜欢喝茶 ou busque palavras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-4 pr-10 py-3 text-sm bg-white text-slate-800 rounded-xl border border-slate-200/80 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 font-medium shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title="Limpar texto"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {searchQuery.trim() && (
              <button
                onClick={() => handleValidateAndBuildPhrase(searchQuery)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {isMultiWordQuery ? 'Montar e Validar' : 'Validar'}
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <CornerDownLeft className="w-3.5 h-3.5 text-slate-400" />
            <span>Pressione <strong>Enter</strong> para validar uma frase completa palavra por palavra ou selecionar termos.</span>
          </p>
        </div>

        {/* "Você quis dizer..." Suggestion Banner when typos are detected in the search/phrase */}
        {didYouMean && didYouMean.hasCorrections && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-indigo-50/95 via-sky-50/80 to-blue-50/95 border-2 border-indigo-200/90 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs shrink-0 mt-0.5 sm:mt-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-wrap items-baseline gap-1.5 text-sm">
                <span className="text-slate-600 font-medium">Você quis dizer:</span>
                <button
                  onClick={() => {
                    setSearchQuery(didYouMean.suggestedText);
                    handleValidateAndBuildPhrase(didYouMean.suggestedText);
                  }}
                  className="inline-flex items-center gap-1 font-mono text-xs sm:text-sm font-semibold bg-white hover:bg-indigo-50/50 border border-indigo-200/80 px-2.5 py-1 rounded-xl shadow-xs hover:border-indigo-300 transition-all cursor-pointer group text-slate-800"
                  title="Clique para aplicar a frase sugerida e validar"
                >
                  <span className="text-slate-800">
                    {didYouMean.parts.map((part, idx) => (
                      <React.Fragment key={idx}>
                        {idx > 0 && ' '}
                        {part.isChanged ? (
                          <strong className="text-indigo-700 font-bold bg-indigo-100/90 px-1.5 py-0.5 rounded uppercase tracking-wider text-xs border border-indigo-200">
                            {part.text}
                          </strong>
                        ) : (
                          <span>{part.text}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </span>
                  <span className="text-slate-400 font-normal">?</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setSearchQuery(didYouMean.suggestedText);
                handleValidateAndBuildPhrase(didYouMean.suggestedText);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer shrink-0"
            >
              <span>Aplicar Sugestão</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* Step-by-Step Sentence Validation Report Card */}
        {validationReport && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col gap-4 rounded-2xl p-5 border-2 shadow-md transition-all ${
              validationReport.success
                ? 'bg-emerald-50/90 border-emerald-300 text-slate-800'
                : 'bg-rose-50/90 border-rose-300 text-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    validationReport.success
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {validationReport.success ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <AlertCircle className="w-6 h-6" />
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Validação Passo a Passo
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        validationReport.success
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-rose-200 text-rose-900'
                      }`}
                    >
                      {validationReport.success
                        ? `${validationReport.steps.length} / ${validationReport.steps.length} Válidas`
                        : `Interrompido na Palavra ${validationReport.stoppedAtIndex! + 1}`}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {validationReport.success
                      ? 'Frase montada e validada com sucesso!'
                      : validationReport.errorReason}
                  </h3>

                  {!validationReport.success && validationReport.steps[validationReport.stoppedAtIndex!]?.ruleHint && (
                    <p className="text-xs text-rose-900 font-medium mt-1 leading-relaxed">
                      {validationReport.steps[validationReport.stoppedAtIndex!].ruleHint}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setValidationReport(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-black/5 transition-colors cursor-pointer"
                title="Fechar relatório"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Word-by-Word Timeline / Stepper */}
            <div className="border-t border-black/10 pt-3 flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Progresso Palavra por Palavra:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {validationReport.steps.map((step, idx) => {
                  const isSuccess = step.status === 'valid';
                  const isError = step.status === 'invalid_grammar' || step.status === 'unknown_word';
                  const isUnprocessed = step.status === 'unprocessed';

                  return (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                          isSuccess
                            ? 'bg-emerald-100/90 border-emerald-300 text-emerald-950 shadow-sm'
                            : isError
                            ? 'bg-rose-100 border-rose-400 text-rose-950 ring-2 ring-rose-400/50 shadow-sm'
                            : 'bg-slate-100/80 border-slate-200 text-slate-400 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] font-mono font-bold text-slate-400">#{step.position}</span>
                            <span className="font-mono font-bold">{step.word ? step.word.label : step.token}</span>
                          </div>
                          {step.word && (
                            <span className="text-sm font-semibold text-slate-900 leading-tight">
                              {step.word.hanzi}
                            </span>
                          )}
                          {step.word && (
                            <span className="text-[10px] text-slate-500 truncate leading-none">
                              {step.word.translation}
                            </span>
                          )}
                        </div>

                        <div className="ml-1 shrink-0">
                          {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          {isError && <XCircle className="w-4 h-4 text-rose-600" />}
                          {isUnprocessed && <PauseCircle className="w-4 h-4 text-slate-400" />}
                        </div>
                      </div>

                      {idx < validationReport.steps.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Context action bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-3">
              <span className="text-[11px] text-slate-600">
                {validationReport.success ? (
                  <span>A frase foi inserida na área ativa abaixo.</span>
                ) : (
                  <span>
                    A validação foi interrompida no erro. {validationReport.validWords.length > 0 ? 'A sequência válida inicial foi mantida.' : ''}
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2">
                {!validationReport.success && validationReport.suggestion && validationReport.suggestion.hasCorrections && (
                  <button
                    onClick={() => {
                      setSearchQuery(validationReport.suggestion!.suggestedText);
                      handleValidateAndBuildPhrase(validationReport.suggestion!.suggestedText);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Corrigir e Montar</span>
                  </button>
                )}
                <button
                  onClick={() => setValidationReport(null)}
                  className="px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm transition-all cursor-pointer"
                >
                  Fechar Aviso
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Word Palette Board (Available words right below search bar) */}
        {filteredWords.length > 0 && (
          <div className="flex flex-col gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600 font-semibold">
                <PlusSquare className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Palavras Disponíveis</span>
              </div>
              {searchQuery && unavailableMatchingWords.length > 0 && (
                <span className="text-[11px] text-amber-700 font-medium bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-lg">
                  {unavailableMatchingWords.length} indisponível(is) pela ordem gramatical
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[260px] overflow-y-auto pr-1">
              {filteredWords.map(word => {
                const Icon = word.icon;
                const clickable = isWordClickable(word);
                return (
                  <button
                    key={word.id}
                    onClick={() => clickable && addWord(word)}
                    disabled={!clickable}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                      clickable 
                        ? `${getCategoryBg(word.category)} border-slate-200/80 text-slate-700 hover:scale-[102%] hover:shadow-md active:scale-95 cursor-pointer` 
                        : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-xl ${clickable ? 'bg-white shadow-sm text-slate-600' : 'text-slate-300'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none">{word.label}</span>
                      <span className="font-semibold text-sm truncate mt-0.5">{word.hanzi}</span>
                      <span className="text-[10px] text-slate-400 truncate leading-none mt-0.5">{word.translation}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Feedback when search finds existing words that cannot be inserted at current grammar stage */}
        {searchQuery.trim() !== '' && filteredWords.length === 0 && matchingDictionaryWords.length > 0 && (
          <div className="flex flex-col gap-3.5 bg-amber-50/90 border-2 border-amber-200/90 rounded-2xl p-5 shadow-sm text-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-amber-950">
                  A palavra existe, mas não pode ser inserida porque não está na ordem correta para formar uma frase.
                </p>
                <p className="text-xs text-amber-800/80 mt-1">
                  A estrutura gramatical do mandarim exige uma sequência ordenada (ex: Sujeito + Verbo + Objeto, ou Sujeito + Adjetivo). Siga a sequência gramatical para poder utilizá-la.
                </p>
              </div>
            </div>

            <div className="border-t border-amber-200/70 pt-3 flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Palavra(s) encontrada(s) no vocabulário:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {matchingDictionaryWords.map(word => {
                  const Icon = word.icon;
                  return (
                    <div
                      key={word.id}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-amber-200 bg-white/90 opacity-70 cursor-not-allowed select-none"
                      title="Não permitida na posição gramatical atual"
                    >
                      <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-amber-700 font-bold leading-none">{word.label}</span>
                        <span className="font-semibold text-sm truncate mt-0.5 text-slate-800">{word.hanzi}</span>
                        <span className="text-[10px] text-slate-500 truncate leading-none mt-0.5">{word.translation}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Feedback when searched word does not exist in vocabulary at all */}
        {searchQuery.trim() !== '' && filteredWords.length === 0 && matchingDictionaryWords.length === 0 && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="flex flex-col items-center justify-center gap-1.5">
              <HelpCircle className="w-6 h-6 text-slate-400 mb-0.5" />
              <p className="text-sm font-medium text-slate-700">Nenhuma palavra encontrada para "{searchQuery}"</p>
              <p className="text-xs text-slate-400">Verifique a ortografia do pinyin, ideograma ou tradução em português.</p>
            </div>

            {didYouMean && didYouMean.suggestedWords.length > 0 && (
              <div className="w-full border-t border-slate-200/80 pt-3.5 flex flex-col gap-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                  Palavras aproximadas sugeridas:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {didYouMean.suggestedWords.map(word => {
                    const Icon = word.icon;
                    const clickable = isWordClickable(word);
                    return (
                      <button
                        key={word.id}
                        onClick={() => clickable && addWord(word)}
                        disabled={!clickable}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                          clickable
                            ? `${getCategoryBg(word.category)} border-indigo-200 text-slate-700 hover:scale-[102%] hover:shadow-md active:scale-95 cursor-pointer`
                            : 'bg-white/70 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                        }`}
                        title={clickable ? 'Clique para adicionar à frase' : 'Indisponível na posição gramatical atual'}
                      >
                        <div className={`p-1.5 rounded-lg ${clickable ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-indigo-600 font-bold leading-none">{word.label}</span>
                          <span className="font-semibold text-sm truncate mt-0.5 text-slate-900">{word.hanzi}</span>
                          <span className="text-[10px] text-slate-500 truncate leading-none mt-0.5">{word.translation}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Sequence Board */}
        <div className="bg-slate-50 rounded-2xl p-5 md:p-6 border border-slate-100/80 min-h-[140px] flex flex-col justify-between relative overflow-hidden group">
          {sequence.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
              <Sparkles className="w-8 h-8 text-indigo-400/60 mb-2 animate-pulse" />
              <p className="text-sm font-medium">Toque nas palavras acima para construir uma frase</p>
              <p className="text-xs text-slate-400/80 mt-1">A gramática mandarim será validada em tempo real</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5 items-center">
              <AnimatePresence mode="popLayout">
                {sequence.map((word, idx) => {
                  const Icon = word.icon;
                  return (
                    <motion.div
                      key={`${word.id}-${idx}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -15 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/60 shadow-sm cursor-pointer select-none transition-all ${getCategoryBg(word.category)} hover:scale-105`}
                      onClick={idx === sequence.length - 1 ? removeLast : undefined}
                    >
                      <span className="font-mono text-[10px] text-slate-400 font-semibold">{word.label}</span>
                      <span className="font-semibold text-sm">{word.hanzi}</span>
                      {idx === sequence.length - 1 && (
                        <X className="w-3 h-3 text-slate-400 hover:text-red-500 ml-0.5" />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Live Validation Indicator */}
          {sequence.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100/80 pt-4 mt-4">
              <div className="flex items-center gap-2">
                {isValidSentence ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Gramática Correta
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 animate-pulse">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Frase Incompleta
                  </div>
                )}
              </div>

              <button 
                onClick={clearSequence}
                className="p-1 rounded-lg hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors"
                title="Limpar frase"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Translation Panel */}
        {sequence.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100/60 flex flex-col gap-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-indigo-700">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider font-sans">Tradução</span>
              </div>
              
              <a
                href={`https://translate.google.com/?sl=zh-CN&tl=pt&text=${encodeURIComponent(sequence.map(w => w.hanzi).join(''))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer font-sans"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Abrir no Google Tradutor
              </a>
            </div>

            <div className="bg-white/80 rounded-xl p-4 border border-indigo-100/40 flex flex-col gap-3">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block mb-1">Frase Gerada (Mandarim)</span>
                <span className="text-xl font-semibold text-slate-800 leading-normal">
                  {sequence.map(w => w.hanzi).join('')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-3">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block mb-1">Pronúncia (Pinyin)</span>
                  <span className="font-mono text-xs text-indigo-600 font-semibold bg-indigo-50/50 px-2 py-1 rounded-lg inline-block">
                    {sequence.map(w => w.label).join(' ')}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block mb-1">Tradução Natural</span>
                  <span className="text-xs text-indigo-900 font-semibold bg-white px-2 py-1 rounded-lg border border-indigo-100 inline-block">
                    {getNaturalTranslation(sequence)}
                  </span>
                </div>
                
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block mb-1">Tradução Literal</span>
                  <span className="text-xs text-slate-600 font-medium italic block py-1">
                    {sequence.map(w => w.translation).join(' ')}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-medium italic">
              * Clique no botão acima para abrir o Google Tradutor em outra aba e ouvir o áudio ou praticar a pronúncia.
            </p>
          </div>
        )}

        {/* Grammar Help Panel */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/80 text-xs text-slate-500 flex flex-col gap-1.5">
          <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">Dicas Rápidas de Gramática & Expressões:</span>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong className="text-indigo-600">Cumprimentos em Mandarim:</strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 mt-1.5 font-sans">
                <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/70"><strong className="text-indigo-700 font-mono text-[11px]">nǐ hǎo (你好)</strong>: Olá</div>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/70"><strong className="text-indigo-700 font-mono text-[11px]">nǐ hǎo ma? (你好吗？)</strong>: Como vai você?</div>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/70"><strong className="text-indigo-700 font-mono text-[11px]">wǒ hěn hǎo (我很好)</strong>: Estou muito bem</div>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/70"><strong className="text-indigo-700 font-mono text-[11px]">zǎoshang hǎo (早上好)</strong>: Bom dia</div>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/70"><strong className="text-indigo-700 font-mono text-[11px]">dàjiā hǎo (大家好)</strong>: Olá a todos!</div>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/70"><strong className="text-indigo-700 font-mono text-[11px]">zài jiàn (再见)</strong>: Tchau / Até logo</div>
              </div>
            </li>
            <li><strong className="text-indigo-600">Posição do "ye" (也 - também):</strong> Em mandarim, <strong className="text-indigo-600">yě (也)</strong> é um advérbio e deve vir <strong>SEMPRE antes do verbo ou adjetivo</strong> (<em className="text-slate-600">Sujeito + 也 + Verbo/Adjetivo + Objeto</em>). Exemplo correto: <strong className="font-mono text-[11px] text-indigo-700">wǒ yě xǐhuan kāfēi (我也喜欢咖啡)</strong> = <em>Eu também gosto de café</em>, ou <strong className="font-mono text-[11px] text-indigo-700">wǒ yě hěn hǎo (我也很好)</strong> = <em>Eu também estou muito bem</em>. <strong>Nunca</strong> coloque <em>ye</em> no final da frase (ao contrário do português "eu gosto de café também" ou do inglês "too").</li>
            <li><strong className="text-indigo-600">Saudações e Qualidade ("hao"):</strong> A palavra <strong className="text-indigo-600">hǎo (好)</strong> significa "bom / bem" e forma cumprimentos e respostas como <strong className="font-mono text-[11px] text-indigo-700">nín hǎo (您好)</strong> = olá formal, <strong className="font-mono text-[11px] text-indigo-700">lǎoshī hǎo (老师好)</strong> = olá professor, <strong className="font-mono text-[11px] text-indigo-700">hěn hǎo (很好)</strong> = muito bem, <strong className="font-mono text-[11px] text-indigo-700">bù hǎo (不好)</strong> = não está bem/ruim, <strong className="font-mono text-[11px] text-indigo-700">hǎo de (好的)</strong> = ok/certo, e perguntas como <strong className="font-mono text-[11px] text-indigo-700">hǎo bù hǎo? (好不好？)</strong> = que tal / está de acordo?.</li>
            <li><strong className="text-indigo-600">Perguntar "Como é / Como está?" ("zenmeyang"):</strong> Use <strong className="text-indigo-600">zěnmeyàng (怎么样)</strong> após um tópico ou sujeito para perguntar sobre a qualidade, estado ou opinião a respeito de países, comidas, bebidas, trabalho ou pessoas (ex: <strong className="font-mono text-[11px] text-indigo-700">baxi zenmeyang?</strong> = como é o Brasil?, <strong className="font-mono text-[11px] text-indigo-700">kafei zenmeyang?</strong> = como está o café?, <strong className="font-mono text-[11px] text-indigo-700">cha zenmeyang?</strong> = como está o chá?, <strong className="font-mono text-[11px] text-indigo-700">gongzuo zenmeyang?</strong> = como está o trabalho?, <strong className="font-mono text-[11px] text-indigo-700">zhe ge zenmeyang?</strong> = que tal este?).</li>
            <li><strong className="text-indigo-600">Perguntar Preço ("duo shao qian"):</strong> Use <strong className="text-indigo-600">duōshao qián (多少钱)</strong> para perguntar o valor ou preço de itens ou demonstrativos (ex: <strong className="font-mono text-[11px] text-indigo-700">zhe ge duo shao qian?</strong> = quanto custa isto?, <strong className="font-mono text-[11px] text-indigo-700">kafei duo shao qian?</strong> = quanto custa o café?, <strong className="font-mono text-[11px] text-indigo-700">duo shao qian?</strong> = quanto custa?).</li>
            <li><strong className="text-indigo-600">Expressão "Um Pouco" ("yidian"):</strong> Use <strong className="text-indigo-600">yìdiǎn (一点)</strong> para expressar pequenas quantidades após verbos de ação ou antes de substantivos e adjetivos (ex: <strong className="font-mono text-[11px] text-indigo-700">wo hui shuo yidian Hanyu</strong> = eu falo um pouco de mandarim, <strong className="font-mono text-[11px] text-indigo-700">he yidian shui</strong> = beber um pouco d'água, <strong className="font-mono text-[11px] text-indigo-700">wo you yidian mang</strong> = estou um pouco ocupado).</li>
            <li><strong className="text-indigo-600">Poder/Capacidade ("keyi" vs "hui"):</strong> Use <strong className="text-indigo-600">keyi (可以)</strong> para <em>permissão, autorização ou possibilidade</em> (ex: <strong className="font-mono text-[11px] text-indigo-700">ni keyi shuo</strong> = você pode falar / tem permissão, <strong className="font-mono text-[11px] text-indigo-700">wo keyi jin ma?</strong> = posso entrar?). Use <strong className="text-indigo-600">hui (会)</strong> para <em>capacidade adquirida ou habilidade aprendida</em> através de estudo/treino (ex: <strong className="font-mono text-[11px] text-indigo-700">wo hui shuo Hanyu</strong> = eu sei/posso falar mandarim, <strong className="font-mono text-[11px] text-indigo-700">ni hui shuo Hanyu ma?</strong> = você sabe falar mandarim?).</li>
            <li><strong className="text-indigo-600">Negação ("bu" vs "mei"):</strong> Use <strong className="text-indigo-600">bu (不)</strong> para presente/futuro e com o verbo <em>shi</em> (<strong className="font-mono text-[11px] text-indigo-700">bu shi</strong>). Para o verbo <strong className="text-indigo-600">you (有 - ter/haver)</strong> e ações no passado, use sempre <strong className="text-indigo-600">mei (没)</strong> (ex: <strong className="font-mono text-[11px] text-indigo-700">wo mei you gongzuo</strong> = eu não tenho emprego, <strong className="font-mono text-[11px] text-indigo-700">wo mei shuo</strong> = eu não falei).</li>
            <li><strong className="text-indigo-600">Família & Posse:</strong> Membros da família e <strong className="text-indigo-600">jia (家 - casa/família)</strong> dispensam o possessivo <em>de</em> (ex: <strong className="font-mono text-[11px] text-indigo-700">wo jia</strong> = minha família/casa, <strong className="font-mono text-[11px] text-indigo-700">wo baba</strong> = meu pai).</li>
            <li><strong className="text-indigo-600">Membros da Família:</strong> Usa-se o classificador figurativo <strong className="text-indigo-600">kou (口 - bocas/membros)</strong> para contar pessoas na família (ex: <strong className="font-mono text-[11px] text-indigo-700">wo jia you si kou ren</strong> = minha família tem 4 pessoas).</li>
            <li><strong className="text-indigo-600">Perguntas de Quantidade:</strong> Use <strong className="text-indigo-600">ji (几)</strong> para perguntar quantidades (ex: <strong className="font-mono text-[11px] text-indigo-700">ni jia you ji kou ren?</strong> = quantas pessoas tem na sua família?).</li>
            <li><strong className="text-indigo-600">Quantidade vs Dígito:</strong> Use <strong className="text-indigo-600">liang (两)</strong> para quantidades de coisas/pessoas (ex: <strong className="font-mono text-[11px] text-indigo-700">wo you liang didi</strong> = tenho 2 irmãos mais novos) e <strong className="text-indigo-600">er (二)</strong> para dígitos.</li>
            <li><strong className="text-indigo-600">Perguntas de Sim/Não:</strong> Adicione a partícula <strong className="text-indigo-600">ma (吗)</strong> ao final da frase.</li>
            <li><strong className="text-indigo-600">Preposição gei:</strong> <strong className="text-indigo-600">gei (给 - para...)</strong> é colocada antes do destinatário e do verbo (ex: <strong className="font-mono text-[11px] text-indigo-700">wo gei ni da dianhua</strong>).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
