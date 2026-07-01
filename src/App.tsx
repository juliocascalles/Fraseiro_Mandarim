/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  User, Users, MessageSquare, UserCheck, Globe, 
  Flag, Type, HelpCircle, Search, Info, PlusSquare, 
  RefreshCcw, XCircle, Target, FileText, GraduationCap, 
  Briefcase, Tag, Trash2, ArrowRight, Book, Cat, Dog, 
  Droplets, Coffee, CupSoda, Milk, Utensils, Soup
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
  { id: 'da_call', label: 'da', hanzi: '打', translation: 'ligar (fone)', category: 'verb', icon: MessageSquare },
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

  // --- Rule Logic ---
  const availableWords = useMemo(() => {
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
        // keyi (poder) can be followed by action verbs
        return WORDS.filter(w => ['zuo', 'he', 'jin'].includes(w.id));
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
  }, [sequence]);

  const addWord = (word: Word) => {
    setSequence([...sequence, word]);
  };

  const clear = () => setSequence([]);

  const removeLast = () => setSequence(sequence.slice(0, -1));

  const getCategoryColor = (category: Category) => {
    switch (category) {
      case 'pronoun': return 'bg-blue-50';
      case 'verb': return 'bg-red-50';
      case 'country': return 'bg-emerald-50';
      case 'adverb': return 'bg-amber-50';
      case 'question': return 'bg-purple-50';
      case 'noun': return 'bg-slate-50';
      case 'suffix': return 'bg-pink-50';
      case 'guo': return 'bg-cyan-50';
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
    <div className="min-h-screen bg-[#F5F5F0] text-[#141414] font-sans p-4 md:p-8 flex flex-col gap-8">
      {/* Header */}
      <header className="flex justify-between items-center bg-white p-6 rounded-[32px] shadow-sm border border-black/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-[#00FF00]">
            <MessageSquare size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-display uppercase tracking-tight">Fraseiro Mandarim</h1>
            <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Sentencing Logic Engine v1.7</p>
          </div>
        </div>
        <button 
          onClick={clear}
          className="p-3 hover:bg-black hover:text-white rounded-full transition-all duration-200 border border-black/20"
          title="Limpar frase"
        >
          <Trash2 size={24} />
        </button>
      </header>

      {/* Main UI Area */}
      <main className="flex-1 flex flex-col gap-12 max-w-4xl mx-auto w-full">
        
        {/* Step Indicators / Action Buttons */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Elementos Disponíveis</span>
            <div className="h-[1px] flex-1 bg-black/5" />
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {availableWords.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {availableWords.map((word) => {
                  const Icon = word.icon;
                  const bgColor = getCategoryColor(word.category);
                  return (
                    <motion.button
                      key={word.id}
                      initial={{ scale: 0.8, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.8, opacity: 0, y: -20 }}
                      whileHover={{ y: -8, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addWord(word)}
                      className={`flex flex-col items-center justify-center p-3 w-16 h-16 sm:w-24 sm:h-24 ${bgColor} border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform group`}
                    >
                      <span className="text-lg sm:text-xl font-bold leading-none mb-1 group-hover:scale-110 transition-transform">{word.hanzi}</span>
                      <span className="text-[9px] font-bold uppercase text-center leading-tight tracking-wider">{word.label}</span>
                      <span className="text-[8px] opacity-40 font-medium text-center leading-tight">({word.translation})</span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 text-center py-12 px-8 bg-white border-4 border-black rounded-[48px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-sm mx-auto"
              >
                <div className="w-20 h-20 bg-[#00FF00] border-4 border-black rounded-full flex items-center justify-center -mt-20 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <ArrowRight size={40} />
                </div>
                <div>
                  <p className="font-display text-3xl uppercase leading-none mb-2">Frase terminada</p>
                  <p className="text-xs text-black/50 font-medium px-4 leading-relaxed">Você seguiu todas as regras gramaticais com sucesso.</p>
                </div>
                <button 
                  onClick={clear}
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#00FF00] hover:text-black transition-colors"
                >
                  Recomeçar Jornada
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Sentence Carousel */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-black/20" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Sequência Construída</span>
            <div className="h-[1px] flex-1 bg-black/5" />
          </div>

          <div className="bg-white/40 border-2 border-dashed border-black/10 rounded-[48px] p-10 min-h-[220px] flex items-center overflow-x-auto relative">
            <div className="flex gap-6 mx-auto snap-x">
              <AnimatePresence mode="popLayout">
                {sequence.map((word, index) => {
                  const Icon = word.icon;
                  const bgColor = getCategoryColor(word.category);
                  return (
                    <motion.div
                      key={`${word.id}-${index}`}
                      layout
                      initial={{ scale: 0, x: 100 }}
                      animate={{ scale: 1, x: 0 }}
                      exit={{ scale: 0, x: -100 }}
                      className="flex flex-col items-center gap-3 group relative snap-center"
                    >
                      <div className={`w-20 h-28 sm:w-28 sm:h-36 ${bgColor} border-2 border-black rounded-3xl flex flex-col items-center justify-center shadow-xl transform group-hover:-rotate-3 transition-transform relative overflow-hidden`}>
                        <div className="absolute top-2 right-2 opacity-10">
                          <Icon size={40} />
                        </div>
                        <span className="text-3xl sm:text-4xl font-bold relative z-10">{word.hanzi}</span>
                        <span className="text-xs font-display uppercase mt-3 tracking-tight relative z-10">{word.label}</span>
                        <span className="text-[10px] font-medium opacity-50 relative z-10">({word.translation})</span>
                        <div className="absolute bottom-0 inset-x-0 h-1 bg-black/5" />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 bg-black text-white text-[8px] font-mono rounded-full">{index + 1}</div>
                        <span className="text-[8px] font-bold uppercase opacity-30 tracking-widest">{word.category}</span>
                      </div>
                      
                      {index === sequence.length - 1 && (
                        <button 
                          onClick={removeLast}
                          className="absolute -top-3 -right-3 bg-white text-red-500 hover:bg-black p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black z-20"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </motion.div>
                  );
                })}
                {sequence.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4 text-black/10 text-center select-none"
                  >
                    <PlusSquare size={48} strokeWidth={1} />
                    <p className="font-display text-4xl uppercase tracking-tighter opacity-50">Sua frase aqui</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

      </main>

      {/* Footer / Info */}
      <footer className="text-center p-12 border-t border-black/5 mt-12 bg-white/30 rounded-t-[64px]">
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Regras de Sintaxe</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[8px] font-bold uppercase tracking-widest text-black/50">
            <div className="p-3 bg-white rounded-xl border border-black/5 shadow-sm">
              <div className="mb-2 text-black">1. Pronome</div>
              Na posição inicial
            </div>
            <div className="p-3 bg-white rounded-xl border border-black/5 shadow-sm">
              <div className="mb-2 text-black">2. Advérbio</div>
              Precede o verbo
            </div>
            <div className="p-3 bg-white rounded-xl border border-black/5 shadow-sm">
              <div className="mb-2 text-black">3. Verbo</div>
              Define o gentílico
            </div>
            <div className="p-3 bg-white rounded-xl border border-black/5 shadow-sm">
              <div className="mb-2 text-black">4. Interrogação</div>
              Final ou Poscrita
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
