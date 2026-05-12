/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  User, Users, MessageSquare, UserCheck, Globe, 
  Flag, Type, HelpCircle, Search, Info, PlusSquare, 
  RefreshCcw, XCircle, Target, FileText, GraduationCap, 
  Briefcase, Tag, Trash2, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Category = 'pronoun' | 'plural' | 'adverb' | 'verb' | 'country' | 'suffix' | 'noun' | 'question' | 'guo' | 'possessive';

interface Word {
  id: string;
  label: string;
  category: Category;
  icon: React.ElementType;
  requiresGuo?: boolean;
}

// --- Data ---
const WORDS: Word[] = [
  // Pronouns
  { id: 'wo', label: 'wo', category: 'pronoun', icon: User },
  { id: 'ni', label: 'ni', category: 'pronoun', icon: User },
  { id: 'ta', label: 'ta', category: 'pronoun', icon: User },
  
  // Plural
  { id: 'men', label: 'men', category: 'plural', icon: Users },
  
  // Possessive
  { id: 'de', label: 'de', category: 'possessive', icon: Tag },

  // Adverbs
  { id: 'dou', label: 'dou', category: 'adverb', icon: PlusSquare }, // todos
  { id: 'ye', label: 'ye', category: 'adverb', icon: RefreshCcw }, // também
  { id: 'bu', label: 'bù', category: 'adverb', icon: XCircle }, // não
  { id: 'zhi', label: 'zhi', category: 'adverb', icon: Target }, // apenas
  
  // Verbs
  { id: 'shi', label: 'shi', category: 'verb', icon: UserCheck }, // ser
  { id: 'shuo', label: 'shuo', category: 'verb', icon: MessageSquare }, // falar
  { id: 'jiao', label: 'jiao', category: 'verb', icon: Tag }, // chamar

  // Questions
  { id: 'ma', label: 'ma', category: 'question', icon: HelpCircle }, // end particle
  { id: 'na', label: 'na', category: 'question', icon: Search }, // qual?
  { id: 'shenme', label: 'shenme', category: 'question', icon: Info }, // que?

  // Countries
  { id: 'baxi', label: 'baxi', category: 'country', icon: Globe },
  { id: 'jianada', label: 'jianada', category: 'country', icon: Globe },
  { id: 'putaoya', label: 'putaoya', category: 'country', icon: Globe },
  { id: 'fa', label: 'fa', category: 'country', icon: Globe, requiresGuo: true },
  { id: 'ying', label: 'ying', category: 'country', icon: Globe, requiresGuo: true },

  // Gentilics parts
  { id: 'guo', label: 'guo', category: 'guo', icon: Flag },
  { id: 'yu', label: 'yu', category: 'suffix', icon: Type }, // idioma
  { id: 'ren', label: 'ren', category: 'suffix', icon: Users }, // nacionalidade

  // Nouns
  { id: 'mingzi', label: 'ming zi', category: 'noun', icon: FileText },
  { id: 'tongxue', label: 'tongxue', category: 'noun', icon: GraduationCap },
  { id: 'laoshi', label: 'laoshi', category: 'noun', icon: Briefcase },
];

export default function App() {
  const [sequence, setSequence] = useState<Word[]>([]);

  // --- Rule Logic ---
  const availableWords = useMemo(() => {
    if (sequence.length === 0) {
      // 2 - A frase deve começar sempre com um pronome
      return WORDS.filter(w => w.category === 'pronoun');
    }

    const last = sequence[sequence.length - 1];
    const prev = sequence.length > 1 ? sequence[sequence.length - 2] : null;
    
    // Find active verb in the sequence for rule 10 and 11
    const activeVerb = [...sequence].reverse().find(w => w.category === 'verb');

    // Rule 2/3 - Pronoun selected
    if (last.category === 'pronoun') {
      // Can be followed by men (plural), possessive (de), adverb, verb, or noun (Rule 3 composition)
      return WORDS.filter(w => ['plural', 'possessive', 'adverb', 'verb', 'noun'].includes(w.category));
    }

    // Rule 3/4 - Plural selected
    if (last.category === 'plural') {
      // Followed by possessive (de), adverb, verb, or noun
      return WORDS.filter(w => ['possessive', 'adverb', 'verb', 'noun'].includes(w.category));
    }

    // Rule 3 - Possessive selected
    if (last.category === 'possessive') {
      // After 'de', must come a noun to form a compound
      return WORDS.filter(w => ['noun', 'country'].includes(w.category));
    }

    // Rule 5 - After adverb must come a verb
    if (last.category === 'adverb') {
      return WORDS.filter(w => w.category === 'verb');
    }

    // Rule 6/8 - Verb selected
    if (last.category === 'verb') {
      // Can follow with: substantivo, pronome composto, na/shenme
      return WORDS.filter(w => {
        // Particles na and shenme
        if (w.id === 'na' || w.id === 'shenme') return true;
        // Substantivo or Country
        if (['noun', 'country'].includes(w.category)) return true;
        // Pronome (to start a "composto" if allowed by rule 6)
        if (w.category === 'pronoun') return true;
        return false;
      });
    }

    // Rule 8 - Question particles na/shenme selected
    if (last.id === 'na' || last.id === 'shenme') {
      return WORDS.filter(w => ['noun', 'country'].includes(w.category));
    }

    // Rule 9/12 - Country selected
    if (last.category === 'country') {
      // Logic fix (a): 'guo' is ONLY for nationalities (shi) in specific countries
      if (last.requiresGuo && activeVerb?.id === 'shi') {
        return WORDS.filter(w => w.id === 'guo');
      }
      
      // Rule 10/11: Filter suffix by verb
      return WORDS.filter(w => {
        if (w.category !== 'suffix') return false;
        if (activeVerb?.id === 'shuo') return w.id === 'yu';
        if (activeVerb?.id === 'shi') return w.id === 'ren';
        return true;
      });
    }

    // Rule 12 - Guo selected
    if (last.category === 'guo') {
      return WORDS.filter(w => {
        // Logic fix (a): 'guo' only combines with nationality 'ren'
        return w.id === 'ren';
      });
    }

    // Rule 7/Suffix/Noun selected
    if (last.category === 'suffix' || last.category === 'noun') {
      const isComposto = sequence.some(w => w.category === 'possessive');
      const verbExists = sequence.some(w => w.category === 'verb');

      // If noun was picked as part of a possessive before a verb (Rule 4)
      if (!verbExists && isComposto) {
        return WORDS.filter(w => ['adverb', 'verb'].includes(w.category));
      }

      const hasQuestion = sequence.some(w => ['na', 'shenme'].includes(w.id));
      // Only show 'ma' if it's not already a question with na/shenme
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
            <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Sentencing Logic Engine v1.0</p>
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
                      <Icon size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-bold uppercase text-center leading-tight tracking-wider">{word.label}</span>
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
                        <Icon size={32} className="relative z-10" />
                        <span className="text-xs font-display uppercase mt-4 tracking-tight relative z-10">{word.label}</span>
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
