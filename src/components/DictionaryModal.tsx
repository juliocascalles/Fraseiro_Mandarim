import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, Search, Volume2, Sparkles, Filter, BookOpen, 
  Check, Copy, Plus, ChevronRight, Layers, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Word, Category, HskLevel } from '../types';
import { speakMandarin } from '../utils/speech';

interface DictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: Word[];
  onSelectWord?: (word: Word) => void;
  availableWordIds?: string[];
}

// Category metadata with readable Portuguese labels and styling
const CATEGORY_INFO: Record<Category, { label: string; color: string; bg: string }> = {
  pronoun: { label: 'Pronomes', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  verb: { label: 'Verbos & Ações', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  adverb: { label: 'Advérbios', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  family: { label: 'Família & Casa', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
  noun: { label: 'Substantivos & Lugares', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
  thing: { label: 'Alimentos & Objetos', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  adjective: { label: 'Adjetivos', color: 'text-yellow-800', bg: 'bg-yellow-50 border-yellow-200' },
  question: { label: 'Perguntas & Interrogativos', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  classifier: { label: 'Classificadores & Idade', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' },
  country: { label: 'Países', color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-200' },
  suffix: { label: 'Sufixos & Gentílicos', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  guo: { label: 'País (国)', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' },
  plural: { label: 'Plural (们)', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  possessive: { label: 'Posse (的)', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
  number: { label: 'Números', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200' },
  preposition: { label: 'Preposição (给)', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  etiquette: { label: 'Cortesia & Cumprimentos', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  conjunction: { label: 'Conjunções (和, 因为)', color: 'text-pink-700', bg: 'bg-pink-50 border-pink-200' },
  particle: { label: 'Partícula Sugestão (吧)', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
};

export const DictionaryModal: React.FC<DictionaryModalProps> = ({
  isOpen,
  onClose,
  words,
  onSelectWord,
  availableWordIds = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedHskLevel, setSelectedHskLevel] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset search when opening
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleCopy = (word: Word) => {
    navigator.clipboard.writeText(`${word.hanzi} (${word.label}) - ${word.translation}`);
    setCopiedId(word.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSpeak = (word: Word) => {
    setSpeakingId(word.id);
    speakMandarin(word.hanzi);
    setTimeout(() => setSpeakingId(null), 1200);
  };

  // Filter words
  const filteredWords = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return words.filter(w => {
      // Category filter
      if (selectedCategory !== 'all' && w.category !== selectedCategory) {
        return false;
      }
      // HSK Level filter
      if (selectedHskLevel !== 'all' && w.hskLevel !== selectedHskLevel) {
        return false;
      }
      // Search query
      if (q) {
        const matchesLabel = w.label.toLowerCase().includes(q);
        const matchesHanzi = w.hanzi.includes(q);
        const matchesTranslation = w.translation.toLowerCase().includes(q);
        const matchesId = w.id.toLowerCase().includes(q);
        return matchesLabel || matchesHanzi || matchesTranslation || matchesId;
      }
      return true;
    });
  }, [words, searchQuery, selectedCategory, selectedHskLevel]);

  // Group filtered words by category
  const groupedWords = useMemo(() => {
    const groups: { category: Category; label: string; words: Word[] }[] = [];
    const categoryOrder: Category[] = [
      'pronoun', 'etiquette', 'verb', 'family', 'noun', 'thing', 
      'adjective', 'question', 'classifier', 'particle', 'adverb', 
      'number', 'country', 'suffix', 'preposition', 'conjunction', 'plural', 'possessive'
    ];

    categoryOrder.forEach(cat => {
      const catWords = filteredWords.filter(w => w.category === cat);
      if (catWords.length > 0) {
        groups.push({
          category: cat,
          label: CATEGORY_INFO[cat]?.label || cat,
          words: catWords,
        });
      }
    });

    return groups;
  }, [filteredWords]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="dictionary-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          id="dictionary-modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-indigo-50/40">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-2xl text-white shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dicionário Visual de Mandarim</h2>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {words.length} Termos
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Consulte ideogramas (Hanzi), pronúncia (Pinyin) e traduções lado a lado por categoria e nível.
                </p>
              </div>
            </div>

            <button
              id="close-dictionary-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Fechar dicionário (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Controls Bar: Search & Filters */}
          <div className="p-4 md:px-6 bg-slate-50/80 border-b border-slate-100 flex flex-col gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="dictionary-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por Hanzi, Pinyin ou significado (ex: wǒ, comer, 咖啡, amigo)..."
                className="w-full pl-10 pr-9 py-2.5 bg-white rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter pills: HSK Level & Category */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
              {/* Difficulty Level Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  Nível:
                </span>
                {[
                  { id: 'all', label: 'Todos os Níveis' },
                  { id: 'HSK 1', label: 'HSK 1 (Iniciante)' },
                  { id: 'HSK 2', label: 'HSK 2 (Intermediário)' },
                ].map(level => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedHskLevel(level.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedHskLevel === level.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>

              {/* Category Filter Select */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  id="dictionary-category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                  <option value="all">Todas as Categorias ({words.length})</option>
                  <option value="pronoun">Pronomes</option>
                  <option value="verb">Verbos & Ações</option>
                  <option value="family">Família & Casa</option>
                  <option value="noun">Substantivos & Locais</option>
                  <option value="thing">Alimentos & Objetos</option>
                  <option value="adjective">Adjetivos</option>
                  <option value="question">Perguntas</option>
                  <option value="particle">Partícula de Sugestão (吧)</option>
                  <option value="classifier">Classificadores & Idade</option>
                  <option value="adverb">Advérbios</option>
                  <option value="number">Números</option>
                  <option value="country">Países</option>
                  <option value="etiquette">Cortesia & Cumprimentos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Words List Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6 bg-slate-50/30">
            {groupedWords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 gap-2">
                <BookOpen className="w-10 h-10 text-slate-300 stroke-1" />
                <p className="text-sm font-semibold text-slate-700">Nenhuma palavra encontrada</p>
                <p className="text-xs text-slate-400">
                  Tente alterar os termos da busca ou redefinir os filtros de nível e categoria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedHskLevel('all');
                  }}
                  className="mt-2 px-4 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              groupedWords.map(group => {
                const categoryStyle = CATEGORY_INFO[group.category] || {
                  label: group.label,
                  color: 'text-slate-700',
                  bg: 'bg-slate-50 border-slate-200',
                };

                return (
                  <div key={group.category} className="flex flex-col gap-2.5">
                    {/* Category Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border uppercase tracking-wider ${categoryStyle.bg} ${categoryStyle.color}`}>
                          {group.label}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          ({group.words.length} {group.words.length === 1 ? 'palavra' : 'palavras'})
                        </span>
                      </div>
                    </div>

                    {/* Table-Like Side-by-Side Word Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {group.words.map(word => {
                        const Icon = word.icon;
                        const isAvailableInSentence = availableWordIds.includes(word.id);
                        const isSpeaking = speakingId === word.id;
                        const isCopied = copiedId === word.id;

                        return (
                          <div
                            key={word.id}
                            id={`dict-card-${word.id}`}
                            className="bg-white rounded-2xl p-3.5 border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between gap-3 group"
                          >
                            {/* Side-by-side Hanzi, Pinyin & Translation */}
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`p-2.5 rounded-xl ${categoryStyle.bg} shrink-0`}>
                                <Icon className={`w-4 h-4 ${categoryStyle.color}`} />
                              </div>

                              <div className="flex flex-col min-w-0">
                                <div className="flex items-baseline gap-2">
                                  {/* Hanzi */}
                                  <span className="text-xl font-bold text-slate-900 leading-tight">
                                    {word.hanzi}
                                  </span>
                                  {/* Pinyin */}
                                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50/70 px-1.5 py-0.5 rounded border border-indigo-100">
                                    {word.label}
                                  </span>
                                  {/* HSK Level Tag */}
                                  {word.hskLevel && (
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                                      {word.hskLevel}
                                    </span>
                                  )}
                                </div>

                                {/* Translation in Portuguese */}
                                <span className="text-xs text-slate-600 truncate mt-0.5 font-medium">
                                  {word.translation}
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 shrink-0">
                              {/* Pronunciation TTS Button */}
                              <button
                                onClick={() => handleSpeak(word)}
                                className={`p-2 rounded-xl transition-all cursor-pointer ${
                                  isSpeaking
                                    ? 'bg-indigo-600 text-white scale-105'
                                    : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                                }`}
                                title="Ouvir pronúncia em mandarim"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>

                              {/* Copy Button */}
                              <button
                                onClick={() => handleCopy(word)}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Copiar ideograma e pronúncia"
                              >
                                {isCopied ? (
                                  <Check className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>

                              {/* Insert into active sentence button if available */}
                              {onSelectWord && (
                                <button
                                  onClick={() => {
                                    onSelectWord(word);
                                  }}
                                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                                    isAvailableInSentence
                                      ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white'
                                      : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                                  }`}
                                  title={
                                    isAvailableInSentence
                                      ? 'Adicionar à frase ativa'
                                      : 'Adicionar à frase'
                                  }
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">{filteredWords.length}</span>
              <span>de {words.length} termos exibidos</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
              >
                Concluído
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
