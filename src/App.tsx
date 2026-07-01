/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  User, Users, MessageSquare, UserCheck, Globe, 
  Flag, Type, HelpCircle, Search, Info, PlusSquare, 
  RefreshCcw, XCircle, Target, FileText, GraduationCap, 
  Briefcase, Tag, Trash2, ArrowRight, Book, Cat, Dog, 
  Droplets, Coffee, CupSoda, Milk, Utensils, Soup,
  Sparkles, X, CheckCircle2, RefreshCw
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
  | 'question' 
  | 'guo' 
  | 'possessive' 
  | 'thing'
  | 'adjective'
  | 'number'
  | 'preposition'
  | 'etiquette';

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
  
  // Plural
  { id: 'men', label: 'men', hanzi: '们', translation: 'plural', category: 'plural', icon: Users },
  
  // Possessive
  { id: 'de', label: 'de', hanzi: '的', translation: 'de (posse)', category: 'possessive', icon: Tag },

  // Adverbs
  { id: 'dou', label: 'dou', hanzi: '都', translation: 'todos', category: 'adverb', icon: PlusSquare },
  { id: 'ye', label: 'ye', hanzi: '也', translation: 'também', category: 'adverb', icon: RefreshCcw },
  { id: 'bu', label: 'bù', hanzi: '不', translation: 'não', category: 'adverb', icon: XCircle },
  { id: 'zhi', label: 'zhi', hanzi: '只', translation: 'apenas', category: 'adverb', icon: Target },
  { id: 'hen', label: 'hen', hanzi: '很', translation: 'muito', category: 'adverb', icon: PlusSquare },
  
  // Prepositions
  { id: 'gei', label: 'gei', hanzi: '给', translation: 'para', category: 'preposition', icon: Tag },

  // Verbs
  { id: 'shi', label: 'shi', hanzi: '是', translation: 'ser', category: 'verb', icon: UserCheck },
  { id: 'shuo', label: 'shuo', hanzi: '说', translation: 'falar', category: 'verb', icon: MessageSquare },
  { id: 'jiao', label: 'jiao', hanzi: '叫', translation: 'chamar-se', category: 'verb', icon: Tag },
  { id: 'xihuan', label: 'xihuan', hanzi: '喜欢', translation: 'gostar', category: 'verb', icon: Target },
  { id: 'zai', label: 'zai', hanzi: '在', translation: 'estar/em', category: 'verb', icon: Target },
  { id: 'keyi', label: 'ke yi', hanzi: '可以', translation: 'poder', category: 'verb', icon: UserCheck },
  { id: 'da_call', label: 'da', hanzi: '打', translation: 'ligar', category: 'verb', icon: MessageSquare },
  { id: 'fa_verb', label: 'fa', hanzi: '发', translation: 'enviar', category: 'verb', icon: PlusSquare },
  { id: 'zhidao', label: 'zhidao', hanzi: '知道', translation: 'saber/conhecer', category: 'verb', icon: FileText },
  { id: 'zuo', label: 'zuo', hanzi: '坐', translation: 'sentar', category: 'verb', icon: UserCheck },
  { id: 'he', label: 'he', hanzi: '喝', translation: 'beber', category: 'verb', icon: Coffee },
  { id: 'jin', label: 'jin', hanzi: '进', translation: 'entrar', category: 'verb', icon: ArrowRight },

  // Questions
  { id: 'ma', label: 'ma', hanzi: '吗', translation: '?', category: 'question', icon: HelpCircle },
  { id: 'na', label: 'na', hanzi: '哪', translation: 'qual', category: 'question', icon: Search },
  { id: 'shenme', label: 'shenme', hanzi: '什么', translation: 'o quê', category: 'question', icon: Info },
  { id: 'duoshao', label: 'duoshao', hanzi: 'duo shao', translation: 'quanto?', category: 'question', icon: HelpCircle },
  { id: 'nali', label: 'nali', hanzi: '哪里', translation: 'onde?', category: 'question', icon: Search },
  { id: 'zenmeyang', label: 'zenmeyang', hanzi: '怎么样', translation: 'como é...?', category: 'question', icon: HelpCircle },

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
  { id: 'shui', label: 'shui', hanzi: '水', translation: 'água', category: 'thing', icon: Droplets },
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

  // Numbers
  { id: 'yao', label: 'yao', hanzi: '幺', translation: '1', category: 'number', icon: Type },
  { id: 'er', label: 'er', hanzi: '二', translation: '2', category: 'number', icon: Type },
  { id: 'san', label: 'san', hanzi: '三', translation: '3', category: 'number', icon: Type },
  { id: 'si', label: 'si', hanzi: '四', translation: '4', category: 'number', icon: Type },
  { id: 'wu', label: 'wu', hanzi: '五', translation: '5', category: 'number', icon: Type },
  { id: 'liu', label: 'liu', hanzi: '六', translation: '6', category: 'number', icon: Type },
  { id: 'qi', label: 'qi', hanzi: '七', translation: '7', category: 'number', icon: Type },
  { id: 'ba', label: 'ba', hanzi: '八', translation: '8', category: 'number', icon: Type },
  { id: 'jiu', label: 'jiu', hanzi: '九', translation: '9', category: 'number', icon: Type },
  { id: 'ling', label: 'ling', hanzi: '零', translation: '0', category: 'number', icon: Type },

  // Etiquette
  { id: 'qing', label: 'qing', hanzi: '请', translation: 'por favor', category: 'etiquette', icon: UserCheck },
  { id: 'xie_xie', label: 'xie xie', hanzi: '谢谢', translation: 'obrigado', category: 'etiquette', icon: UserCheck },
];

export default function App() {
  const [sequence, setSequence] = useState<Word[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [translation, setTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState('');

  // Clear any existing translation when the sequence of words changes
  useEffect(() => {
    setTranslation('');
    setTranslationError('');
    setIsTranslating(false);
  }, [sequence]);

  const handleTranslate = async () => {
    if (sequence.length === 0) return;

    setIsTranslating(true);
    setTranslationError('');
    setTranslation('');

    const text = sequence.map(w => w.hanzi).join('');
    const wordsInfo = sequence.map(w => ({
      id: w.id,
      hanzi: w.hanzi,
      pinyin: w.label,
      translationLiteral: w.translation,
      category: w.category
    }));

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, wordsInfo }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor');
      }

      const data = await response.json();
      setTranslation(data.translation);
    } catch (err: any) {
      console.error('Translation error:', err);
      setTranslationError('Não foi possível obter a tradução automática no momento.');
    } finally {
      setIsTranslating(false);
    }
  };

  const addWord = (word: Word) => {
    setSequence([...sequence, word]);
    setSearchQuery(''); // Clear the search query after selecting a word
  };
  const removeLast = () => setSequence(sequence.slice(0, -1));
  const clearSequence = () => setSequence([]);

  // Helper to check if a sequence of words forms a valid/complete sentence
  const checkIsValid = (seq: Word[]) => {
    if (seq.length === 0) return false;
    const last = seq[seq.length - 1];

    // If it ends with question particle 'ma'
    if (last.id === 'ma') return true;

    // If last is noun, country, suffix, adjective, number, thing
    if (['noun', 'country', 'suffix', 'adjective', 'number', 'thing'].includes(last.category)) {
      // Exception: baxi, jianada, putaoya need a suffix or noun
      if (['baxi', 'jianada', 'putaoya'].includes(last.id)) return false;
      if (last.id === 'nan' || last.id === 'nü') return false;
      if (last.id === 'dianhua') return seq.some(w => w.id === 'da_call');
      return true;
    }

    // If it's a verb, but NOT some auxiliary/transitive verbs requiring objects
    if (last.category === 'verb') {
      if (['shi', 'shuo', 'jiao', 'xihuan', 'zai', 'keyi', 'da_call', 'fa_verb', 'zhidao', 'he'].includes(last.id)) {
        return false;
      }
      return true;
      // 'zuo' (sentar), 'jin' (entrar) are valid intransitive endings!
    }

    // If ending in etiquette like xie xie
    if (last.id === 'xie_xie') return true;

    return false;
  };

  // Filter words by search query for the palette
  const filteredWords = useMemo(() => {
    if (!searchQuery) return WORDS;
    const q = searchQuery.toLowerCase().trim();
    return WORDS.filter(w => 
      w.label.toLowerCase().includes(q) || 
      w.hanzi.includes(q) || 
      w.translation.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // --- Rule Logic ---
  const availableWords = useMemo(() => {
    const getBaseWords = (): Word[] => {
      if (sequence.length === 0) {
        // Começa com pronome ou etiqueta (ex: qing, xie xie)
        return WORDS.filter(w => w.category === 'pronoun' || w.category === 'etiquette');
      }

      const last = sequence[sequence.length - 1];
      const prev = sequence.length > 1 ? sequence[sequence.length - 2] : null;
      
      // Find active verb in the sequence
      const activeVerb = [...sequence].reverse().find(w => w.category === 'verb');
      const verbExists = sequence.some(w => w.category === 'verb');
      const hasQuestion = sequence.some(w => ['na', 'shenme', 'duoshao', 'nali', 'zenmeyang'].includes(w.id));
      const activePreposition = [...sequence].reverse().find(w => w.category === 'preposition');

      // Case: Etiquette selected
      if (last.category === 'etiquette') {
        if (last.id === 'qing') {
          // qing (por favor) can be followed by: zuo (sentar), he (beber), jin (entrar)
          return WORDS.filter(w => ['zuo', 'he', 'jin'].includes(w.id));
        }
        if (last.id === 'xie_xie') {
          // xie xie can be followed by pronoun (ex: xie xie ni)
          return WORDS.filter(w => w.category === 'pronoun');
        }
        return [];
      }

      // Case: Preposition selected (ex: gei)
      if (last.category === 'preposition') {
        if (last.id === 'gei') {
          // Must be followed by recipient (pronoun, noun)
          return WORDS.filter(w => w.category === 'pronoun' || w.category === 'noun');
        }
        return [];
      }

      // Case: Pronoun selected (wo, ni, ta, zhe)
      if (last.category === 'pronoun') {
        // If we just had a preposition like 'gei' + pronoun (ex: wo gei ni), we must follow with a verb
        if (prev?.category === 'preposition' && prev.id === 'gei') {
          // verbs suitable after gei + recipient: da_call, fa_verb, shuo
          return WORDS.filter(w => ['da_call', 'fa_verb', 'shuo'].includes(w.id));
        }

        // If a verb exists in the sequence
        if (verbExists) {
          // Pronoun as Object
          if (activeVerb?.id === 'xihuan') {
            // After xihuan + pronoun: can end or take 'ma' (if not already question)
            return WORDS.filter(w => {
              if (w.id === 'ma' && !hasQuestion && !sequence.some(s => s.id === 'ma')) return true;
              return false;
            });
          }
          
          // General object pronoun
          return WORDS.filter(w => {
            if (['plural', 'possessive'].includes(w.category)) return true;
            if (w.id === 'ma' && !hasQuestion && !sequence.some(s => s.id === 'ma')) return true;
            return false;
          });
        } else {
          // Pronoun as Subject
          return WORDS.filter(w => {
            // Can take: plural (except for 'zhe'), possessive 'de', adverb, verb, or adjective (sem verbo)
            if (w.category === 'plural' && last.id !== 'zhe') return true;
            if (['possessive', 'adverb', 'verb', 'adjective'].includes(w.category)) return true;
            if (w.category === 'preposition') return true; // ex: wo gei ...
            return false;
          });
        }
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
        // Must be followed by noun, country, thing or adjective (compound)
        return WORDS.filter(w => ['noun', 'country', 'thing', 'adjective'].includes(w.category));
      }

      // Case: Adverb selected (hen, bu, dou, ye, zhi)
      if (last.category === 'adverb') {
        if (last.id === 'hen') {
          // 'hen' is used with adjectives for emphasis
          return WORDS.filter(w => w.category === 'adjective');
        }
        if (last.id === 'bu') {
          // 'bu' can negate verbs or adjectives
          return WORDS.filter(w => w.category === 'verb' || w.category === 'adjective');
        }
        // 'dou', 'ye', 'zhi' can go to verb or other adverbs (e.g. 'ye hen', 'dou hen', 'ye bu')
        return WORDS.filter(w => w.category === 'verb' || ['hen', 'bu'].includes(w.id));
      }

      // Case: Verb selected
      if (last.category === 'verb') {
        if (last.id === 'xihuan') {
          const subjectPronoun = sequence.find(w => w.category === 'pronoun');
          return WORDS.filter(w => {
            if (w.category === 'thing') return true;
            // Exclude subject pronoun to avoid "wo xihuan wo"
            if (w.category === 'pronoun' && w.id !== subjectPronoun?.id && w.id !== 'zhe') return true;
            return false;
          });
        }

        if (last.id === 'shuo') {
          // No nouns (mingzi, tongxue, laoshi) directly after shuo
          return WORDS.filter(w => {
            if (w.id === 'na' || w.id === 'shenme') return true;
            if (w.category === 'country') {
              // baxi and jianada don't form idioms, hide them
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
          // zai can be followed by location questions (nali) or nouns of places (xuexiao, daxue)
          return WORDS.filter(w => w.id === 'nali' || ['xuexiao', 'daxue', 'country'].includes(w.category));
        }

        if (last.id === 'keyi') {
          // keyi (poder) can be followed by action verbs or preposition 'gei'
          return WORDS.filter(w => ['zuo', 'he', 'jin'].includes(w.id) || w.id === 'gei');
        }

        if (last.id === 'da_call') {
          // da (dial) -> dianhua (phone)
          return WORDS.filter(w => w.id === 'dianhua');
        }

        if (last.id === 'fa_verb') {
          // fa (send) -> youjian (email)
          return WORDS.filter(w => w.id === 'youjian');
        }

        if (last.id === 'zhidao') {
          // zhidao can take nouns/things/pronouns
          return WORDS.filter(w => ['noun', 'thing', 'pronoun', 'question'].includes(w.category));
        }

        if (last.id === 'he') {
          // he (drink) -> beverage things
          return WORDS.filter(w => ['shui', 'cha', 'kafei', 'tang'].includes(w.id));
        }

        // Default verb output: can follow with nouns, countries, pronouns, questions
        return WORDS.filter(w => {
          if (['na', 'shenme', 'duoshao', 'nali', 'zenmeyang'].includes(w.id)) return true;
          if (['noun', 'country', 'pronoun', 'thing'].includes(w.category)) return true;
          return false;
        });
      }

      // Case: Question particles
      if (last.id === 'na' || last.id === 'shenme') {
        return WORDS.filter(w => {
          if (last.id === 'na' && w.id === 'guo') return true;
          if (w.category === 'country' && activeVerb?.id === 'shuo') {
            return !['baxi', 'jianada'].includes(w.id);
          }
          if (last.id === 'shenme' && w.id === 'mingzi') return true;
          if (last.id === 'shenme' && w.id === 'gongzuo') return true;
          return ['noun', 'country', 'thing'].includes(w.category);
        });
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
          // verbs suitable after gei + recipient: da_call, fa_verb, shuo
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

        // If we are stating a phone number
        if (last.category === 'number') {
          return WORDS.filter(w => w.category === 'number' || w.id === 'ma');
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

    // Leave question particles (like 'ma') available after standard complete sentence is formed
    if (checkIsValid(sequence)) {
      const hasQuestion = sequence.some(w => ['na', 'shenme', 'duoshao', 'nali', 'zenmeyang'].includes(w.id));
      const hasMa = sequence.some(w => w.id === 'ma');
      if (!hasQuestion && !hasMa) {
        const maWord = WORDS.find(w => w.id === 'ma');
        if (maWord && !baseWords.some(w => w.id === 'ma')) {
          return [...baseWords, maWord];
        }
      }
    }

    return baseWords;
  }, [sequence]);

  // Helper to check if sequence forms a complete/valid clause
  const isValidSentence = useMemo(() => {
    return checkIsValid(sequence);
  }, [sequence]);

  // Check if word is clickable (available to select)
  const isWordClickable = (word: Word) => {
    return availableWords.some(w => w.id === word.id);
  };

  // Get background color for categories
  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'pronoun': return 'bg-blue-50';
      case 'verb': return 'bg-green-50';
      case 'adverb': return 'bg-yellow-50';
      case 'question': return 'bg-purple-50';
      case 'noun': return 'bg-amber-50';
      case 'country': return 'bg-teal-50';
      case 'plural': return 'bg-indigo-50';
      case 'possessive': return 'bg-rose-100';
      case 'thing': return 'bg-orange-50';
      case 'adjective': return 'bg-yellow-50';
      case 'number': return 'bg-teal-50';
      case 'preposition': return 'bg-orange-100';
      case 'etiquette': return 'bg-sky-100';
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
              <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Sentencing Logic Engine v1.7</p>
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

        {/* Active Sequence Board */}
        <div className="bg-slate-50 rounded-2xl p-5 md:p-6 border border-slate-100/80 min-h-[140px] flex flex-col justify-between relative overflow-hidden group">
          {sequence.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
              <Sparkles className="w-8 h-8 text-indigo-400/60 mb-2 animate-pulse" />
              <p className="text-sm font-medium">Toque nas palavras abaixo para construir uma frase</p>
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100/60 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-indigo-700">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Tradução</span>
              </div>
              
              <button
                onClick={handleTranslate}
                disabled={isTranslating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isTranslating ? 'Traduzindo...' : 'Traduzir com IA'}
              </button>
            </div>

            <div className="min-h-[2rem] flex items-center">
              {isTranslating ? (
                <div className="flex items-center gap-1.5 text-xs text-indigo-500 font-semibold uppercase tracking-wider animate-pulse">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
                  </span>
                  Traduzindo frase com IA...
                </div>
              ) : translationError ? (
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-lg font-medium text-slate-700">
                    {sequence.map(w => w.translation).join(' ')}
                  </p>
                  <span className="text-[10px] text-amber-600 bg-amber-50 self-start px-2 py-0.5 rounded-full font-semibold border border-amber-100">
                    Tradução Literal (Erro na API do Tradutor)
                  </span>
                </div>
              ) : translation ? (
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-lg font-semibold text-indigo-900 transition-all duration-300">
                    {translation}
                  </p>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 self-start px-2 py-0.5 rounded-full font-semibold border border-emerald-100">
                    Tradução por Inteligência Artificial
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-lg font-medium text-slate-700 transition-all duration-300">
                    {sequence.map(w => w.translation).join(' ')}
                  </p>
                  <span className="text-[10px] text-slate-500 bg-slate-100 self-start px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                    Tradução Literal (Aguardando Tradução com IA)
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-indigo-100/50 pt-2.5 mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block">Pinyin</span>
                <span className="font-mono text-[11px] text-indigo-600 font-semibold">
                  {sequence.map(w => w.label).join(' ')}
                </span>
              </div>
              
              {/* Only show literal translation row if the AI translation is NOT available */}
              {!translation && (
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block">Tradução Literal</span>
                  <span className="text-slate-600 font-medium">
                    {sequence.map(w => w.translation).join(' ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prominent Search Bar Section */}
        <div className="bg-slate-50 hover:bg-slate-100/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 border-2 border-slate-200/80 rounded-2xl p-5 flex flex-col gap-3 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Pesquisar Pinyins Disponíveis</span>
          </div>
          <div className="relative">
            <input
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

        {/* Word Palette Board */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <PlusSquare className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Palavras Disponíveis</span>
          </div>

          {filteredWords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs font-medium">Nenhuma palavra encontrada para "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold mt-1.5 underline cursor-pointer"
              >
                Limpar pesquisa
              </button>
            </div>
          ) : (
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
          )}
        </div>

        {/* Grammar Help Panel */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/80 text-xs text-slate-500 flex flex-col gap-1.5">
          <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">Dicas Rápidas de Gramática:</span>
          <ul className="list-disc pl-4 space-y-1">
            <li>Para fazer perguntas de sim/não, adicione a partícula de pergunta <strong className="text-indigo-600">ma (吗)</strong> no final.</li>
            <li>A preposição <strong className="text-indigo-600">gei (给 - para...)</strong> é usada antes do destinatário e do verbo (ex: <strong className="font-mono text-[11px] text-indigo-700">wo gei ni da dianhua</strong> = eu te ligo).</li>
            <li>Para o verbo <strong className="text-indigo-600">jiao (叫 - chamar-se)</strong>, use a sequência: Sujeito + jiao + nome.</li>
            <li>Nomes de países que requerem sufixo usam <strong className="text-indigo-600">guo (国)</strong> (ex: <strong className="font-mono text-[11px] text-indigo-700">fa guo</strong> = França).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
