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
  Home, Heart, Smile, AlertCircle
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
  { id: 'ta', label: 'ta', hanzi: '他', translation: 'ele/ela', category: 'pronoun', icon: User },
  { id: 'zhe', label: 'zhe', hanzi: '这', translation: 'este/isto', category: 'pronoun', icon: ArrowRight },
  { id: 'na_dem', label: 'nà', hanzi: '那', translation: 'aquele', category: 'pronoun', icon: ArrowRight },
  
  // Plural
  { id: 'men', label: 'men', hanzi: '们', translation: 'plural', category: 'plural', icon: Users },
  
  // Possessive
  { id: 'de', label: 'de', hanzi: '的', translation: 'de (posse)', category: 'possessive', icon: Tag },

  // Adverbs
  { id: 'dou', label: 'dou', hanzi: '都', translation: 'todos', category: 'adverb', icon: PlusSquare },
  { id: 'ye', label: 'yê', hanzi: '也', translation: 'também', category: 'adverb', icon: RefreshCcw },
  { id: 'bu', label: 'bù', hanzi: '不', translation: 'não', category: 'adverb', icon: XCircle },
  { id: 'zhi', label: 'zhi', hanzi: '只', translation: 'apenas', category: 'adverb', icon: Target },
  { id: 'hen', label: 'hen', hanzi: '很', translation: 'muito', category: 'adverb', icon: PlusSquare },
  
  // Prepositions
  { id: 'gei', label: 'gei', hanzi: '给', translation: 'para', category: 'preposition', icon: Tag },

  // Conjunctions
  { id: 'he_conj', label: 'he', hanzi: '和', translation: 'e', category: 'conjunction', icon: PlusSquare },

  // Verbs
  { id: 'shi', label: 'shi', hanzi: '是', translation: 'ser', category: 'verb', icon: UserCheck },
  { id: 'you_verb', label: 'you', hanzi: '有', translation: 'ter/haver', category: 'verb', icon: PlusSquare },
  { id: 'shuo', label: 'shuo', hanzi: '说', translation: 'falar', category: 'verb', icon: MessageSquare },
  { id: 'jiao', label: 'jiao', hanzi: '叫', translation: 'chamar-se', category: 'verb', icon: Tag },
  { id: 'xihuan', label: 'xihuan', hanzi: '喜欢', translation: 'gostar', category: 'verb', icon: Target },
  { id: 'zai', label: 'zai', hanzi: '在', translation: 'estar/em', category: 'verb', icon: Target },
  { id: 'keyi', label: 'ke yi', hanzi: '可以', translation: 'poder', category: 'verb', icon: UserCheck },
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
  { id: 'duoshao', label: 'duoshao', hanzi: 'duo shao', translation: 'quanto?', category: 'question', icon: HelpCircle },
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

  // Adjectives
  { id: 'da_adj', label: 'dà', hanzi: '大', translation: 'grande', category: 'adjective', icon: Tag },
  { id: 'xiao', label: 'xiao', hanzi: 'xiao', translation: 'pequeno', category: 'adjective', icon: Tag },
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
];

export default function App() {
  const [sequence, setSequence] = useState<Word[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const addWord = (word: Word) => {
    setSequence([...sequence, word]);
    setSearchQuery(''); // Clear the search query after selecting a word
    
    // Focus search input on the next tick
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };
  const removeLast = () => setSequence(sequence.slice(0, -1));
  const clearSequence = () => setSequence([]);

  // Helper to check if a sequence of words forms a valid/complete sentence
  const checkIsValid = (seq: Word[]) => {
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

      // If last is family member or thing or noun, valid if there is a verb or adjective or question
      if (['family', 'thing', 'noun'].includes(last.category)) {
        if (verbExists || seq.some(w => w.category === 'adjective') || hasQuestion) {
          return true;
        }
        return false;
      }

      if (last.category === 'adjective') return true;
      if (last.category === 'number') return true;
      return true;
    }

    // If it's a verb, but NOT transitive verbs requiring objects
    if (last.category === 'verb') {
      if (['shi', 'shuo', 'jiao', 'xihuan', 'zai', 'keyi', 'da_call', 'fa_verb', 'zhidao', 'he', 'you_verb'].includes(last.id)) {
        return false;
      }
      return true;
      // 'zuo' (sentar), 'jin' (entrar) are valid intransitive endings!
    }

    // If ending in etiquette like xie xie
    if (last.id === 'xie_xie') return true;

    return false;
  };

  // --- Rule Logic ---
  const availableWords = useMemo(() => {
    const getBaseWords = (): Word[] => {
      if (sequence.length === 0) {
        // Can start with pronoun, etiquette, shei, family members, or jia
        return WORDS.filter(w => 
          w.category === 'pronoun' || 
          w.category === 'etiquette' || 
          w.category === 'family' ||
          w.id === 'shei'
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
          return WORDS.filter(w => ['zuo', 'he', 'jin'].includes(w.id));
        }
        if (last.id === 'xie_xie') {
          return WORDS.filter(w => w.category === 'pronoun' || w.category === 'family');
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
            if (w.category === 'preposition') return true; // ex: wo gei ...
            if (['zhe', 'na_dem'].includes(last.id)) {
              if (w.category === 'classifier' || w.category === 'thing' || w.category === 'noun') return true;
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

      // Case: Adverb selected (hen, bu, dou, ye, zhi)
      if (last.category === 'adverb') {
        if (last.id === 'hen') {
          return WORDS.filter(w => w.category === 'adjective');
        }
        if (last.id === 'bu') {
          return WORDS.filter(w => w.category === 'verb' || w.category === 'adjective');
        }
        return WORDS.filter(w => w.category === 'verb' || ['hen', 'bu'].includes(w.id));
      }

      // Case: Verb selected
      if (last.category === 'verb') {
        if (last.id === 'you_verb') {
          // you can take numbers, question particles (ji, shenme, duoshao), classifiers, family members, things, nouns
          return WORDS.filter(w => {
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
            if (w.id === 'na' || w.id === 'shenme') return true;
            if (w.category === 'country') {
              return !['baxi', 'jianada'].includes(w.id);
            }
            if (w.category === 'pronoun') return true;
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
          return WORDS.filter(w => ['zuo', 'he', 'jin'].includes(w.id) || w.id === 'gei');
        }

        if (last.id === 'da_call') {
          return WORDS.filter(w => w.id === 'dianhua');
        }

        if (last.id === 'fa_verb') {
          return WORDS.filter(w => w.id === 'youjian');
        }

        if (last.id === 'zhidao') {
          return WORDS.filter(w => ['noun', 'thing', 'pronoun', 'question', 'family'].includes(w.category));
        }

        if (last.id === 'he') {
          return WORDS.filter(w => ['shui', 'cha', 'kafei', 'tang'].includes(w.id));
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
          // ge -> family members, nouns, things, suffix ren
          return WORDS.filter(w => {
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
        if (last.requiresGuo && activeVerb?.id === 'shi') {
          return WORDS.filter(w => w.id === 'guo');
        }
        
        return WORDS.filter(w => {
          if (w.category !== 'suffix') return false;
          const supportsLanguageSuffix = !['baxi', 'jianada'].includes(last.id);

          if (activeVerb?.id === 'shuo') {
            return w.id === 'yu' && supportsLanguageSuffix;
          }
          if (activeVerb?.id === 'shi') {
            return w.id === 'ren';
          }
          return true;
        });
      }

      // Case: Guo selected
      if (last.category === 'guo') {
        return WORDS.filter(w => w.id === 'ren');
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

        // General endings
        const isComposto = sequence.some(w => w.category === 'possessive');
        if (!verbExists && isComposto && last.category !== 'adjective') {
          return WORDS.filter(w => ['adverb', 'verb', 'adjective', 'question'].includes(w.category));
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

      // Rule for adding 'ye' (também) as a clause connector
      if (checkIsValid(sequence) && last.category !== 'question' && last.id !== 'xie_xie' && last.id !== 'qing') {
        const yeWord = WORDS.find(w => w.id === 'ye');
        if (yeWord && !finalWords.some(w => w.id === 'ye')) {
          finalWords.push(yeWord);
        }
      }
    }

    return finalWords;
  }, [sequence]);

  // Helper to check if sequence forms a complete/valid clause
  const isValidSentence = useMemo(() => {
    return checkIsValid(sequence);
  }, [sequence]);

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
      words = words.filter(w => 
        w.label.toLowerCase().includes(q) || 
        w.hanzi.includes(q) || 
        w.translation.toLowerCase().includes(q)
      );
    }
    return words;
  }, [searchQuery, availableWords]);

  // All words matching the search query in the entire vocabulary
  const matchingDictionaryWords = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return WORDS.filter(w => 
      w.label.toLowerCase().includes(q) || 
      w.hanzi.includes(q) || 
      w.translation.toLowerCase().includes(q)
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Limpar
          </button>
        </div>

        {/* Prominent Search Bar Section */}
        <div className="bg-slate-50 hover:bg-slate-100/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 border-2 border-slate-200/80 rounded-2xl p-5 flex flex-col gap-3 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Pesquisar Pinyins Disponíveis</span>
          </div>
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Digite o pinyin, ideograma (hanzi) ou tradução em português..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 text-sm bg-white text-slate-800 rounded-xl border border-slate-200/80 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 font-medium shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

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
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center text-slate-500 flex flex-col items-center justify-center gap-1.5">
            <HelpCircle className="w-6 h-6 text-slate-400 mb-1" />
            <p className="text-sm font-medium">Nenhuma palavra encontrada para "{searchQuery}"</p>
            <p className="text-xs text-slate-400">Verifique a ortografia do pinyin, ideograma ou tradução em português.</p>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block mb-1">Pronúncia (Pinyin)</span>
                  <span className="font-mono text-xs text-indigo-600 font-semibold bg-indigo-50/50 px-2 py-1 rounded-lg inline-block">
                    {sequence.map(w => w.label).join(' ')}
                  </span>
                </div>
                
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block mb-1">Tradução Literal</span>
                  <span className="text-xs text-slate-600 font-medium italic">
                    {sequence.map(w => w.translation).join(' ')}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-medium italic">
              * Clique no botão acima para abrir o Google Tradutor em outra aba e visualizar a tradução contextualizada e fluida.
            </p>
          </div>
        )}

        {/* Grammar Help Panel */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/80 text-xs text-slate-500 flex flex-col gap-1.5">
          <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">Dicas Rápidas de Gramática:</span>
          <ul className="list-disc pl-4 space-y-1">
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
