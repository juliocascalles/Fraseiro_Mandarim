import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Sparkles, Volume2, RotateCcw, ChevronLeft, ChevronRight, 
  Check, Lightbulb, Compass, Flag,
  HelpCircle, ArrowRight, Star, CheckCircle2,
  X, PenTool, PlusSquare, BookOpen, Layers,
  RefreshCw, Smile, Award, Shuffle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HanziVisualFlashcard, Word } from '../types';
import { HANZI_VISUAL_FLASHCARDS } from '../data/flashcardsData';
import { speakMandarin } from '../utils/speech';

interface HanziFlashcardsModeProps {
  allWords: Word[];
  onOpenCanvasWithChar?: (char: string) => void;
  onSendToBuilder?: (words: Word[]) => void;
}

type CardResultStatus = 'unattempted' | 'first_try' | 'with_hint' | 'revealed';

interface FlashcardProgress {
  [cardId: string]: {
    status: CardResultStatus;
    attempts: number;
    usedHint: boolean;
  };
}

export const HanziFlashcardsMode: React.FC<HanziFlashcardsModeProps> = ({
  allWords,
  onOpenCanvasWithChar,
  onSendToBuilder,
}) => {
  // Deck and Shuffling State
  const [deck, setDeck] = useState<HanziVisualFlashcard[]>(HANZI_VISUAL_FLASHCARDS);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);

  // Navigation
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeTabMode, setActiveTabMode] = useState<'interactive_steps' | 'free_flip'>('interactive_steps');

  // Interactive 3-Step State for the active card
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [wrongAttempts, setWrongAttempts] = useState<string[]>([]);
  const [flipState, setFlipState] = useState<boolean>(false);

  // Keep deck in sync if base list updates and not in custom shuffle
  useEffect(() => {
    if (!isShuffled) {
      setDeck(HANZI_VISUAL_FLASHCARDS);
    }
  }, [isShuffled]);

  // Overall user progress
  const [progress, setProgress] = useState<FlashcardProgress>(() => {
    try {
      const saved = localStorage.getItem('hanzi_flashcards_progress_v2');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const activeCard: HanziVisualFlashcard = deck[currentIndex] || deck[0] || HANZI_VISUAL_FLASHCARDS[0];

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem('hanzi_flashcards_progress_v2', JSON.stringify(progress));
    } catch {}
  }, [progress]);

  // Reset interactive state when card index changes
  const resetCardInteractiveState = useCallback(() => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowHint(false);
    setIsRevealed(false);
    setWrongAttempts([]);
    setFlipState(false);
  }, []);

  // Shuffle & Reset deck handlers
  const handleShuffleDeck = useCallback(() => {
    const shuffled = [...HANZI_VISUAL_FLASHCARDS].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setIsShuffled(true);
    setCurrentIndex(0);
    resetCardInteractiveState();
  }, [resetCardInteractiveState]);

  const handleResetDeckOrder = useCallback(() => {
    setDeck(HANZI_VISUAL_FLASHCARDS);
    setIsShuffled(false);
    setCurrentIndex(0);
    resetCardInteractiveState();
  }, [resetCardInteractiveState]);

  // Generate options for the current card (1 correct + 3 distractors with pinyin and translation)
  const pinyinOptions = useMemo(() => {
    const correctOption = {
      id: activeCard.id,
      pinyin: activeCard.pinyin,
      pinyinRaw: activeCard.pinyinRaw || activeCard.pinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      translation: activeCard.translation,
      isCorrect: true,
    };

    let chosenDistractors: Array<{
      id: string;
      pinyin: string;
      pinyinRaw: string;
      translation: string;
      isCorrect: boolean;
    }> = [];

    if (activeCard.distractorOptions && activeCard.distractorOptions.length > 0) {
      chosenDistractors = activeCard.distractorOptions.slice(0, 3).map((d, idx) => ({
        id: `distractor_${idx}_${d.pinyin}`,
        pinyin: d.pinyin,
        pinyinRaw: d.pinyinRaw || d.pinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        translation: d.translation,
        isCorrect: false,
      }));
    } else {
      const otherCards = deck.filter(c => c.id !== activeCard.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      chosenDistractors = otherCards.map((c, idx) => ({
        id: `distractor_${idx}_${c.id}`,
        pinyin: c.pinyin,
        pinyinRaw: c.pinyinRaw || c.pinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        translation: c.translation,
        isCorrect: false,
      }));
    }

    return [correctOption, ...chosenDistractors].sort(() => 0.5 - Math.random());
  }, [activeCard.id, activeCard.pinyin, activeCard.pinyinRaw, activeCard.translation, activeCard.distractorOptions, deck]);

  useEffect(() => {
    resetCardInteractiveState();
  }, [currentIndex, resetCardInteractiveState]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  }, [currentIndex, deck.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(deck.length - 1);
    }
  }, [currentIndex, deck.length]);

  // STEP 1: Handle Selecting Pinyin
  const handleSelectPinyin = (option: typeof pinyinOptions[0]) => {
    // If already solved or revealed, don't re-handle
    if (isCorrect || isRevealed) return;

    setSelectedOption(option.id);

    if (option.isCorrect) {
      // Correct!
      setIsCorrect(true);
      speakMandarin(activeCard.hanzi);

      setProgress(prev => {
        const currentCardProgress = prev[activeCard.id];
        // If already solved previously, keep or update
        const newStatus: CardResultStatus = showHint || wrongAttempts.length > 0 ? 'with_hint' : 'first_try';
        return {
          ...prev,
          [activeCard.id]: {
            status: currentCardProgress?.status === 'first_try' ? 'first_try' : newStatus,
            attempts: (currentCardProgress?.attempts || 0) + 1,
            usedHint: showHint || (currentCardProgress?.usedHint ?? false),
          }
        };
      });
    } else {
      // Incorrect!
      setIsCorrect(false);
      setWrongAttempts(prev => [...new Set([...prev, option.id])]);
      
      setProgress(prev => {
        const currentCardProgress = prev[activeCard.id];
        return {
          ...prev,
          [activeCard.id]: {
            status: currentCardProgress?.status === 'first_try' ? 'first_try' : 'unattempted',
            attempts: (currentCardProgress?.attempts || 0) + 1,
            usedHint: showHint || (currentCardProgress?.usedHint ?? false),
          }
        };
      });
    }
  };

  // STEP 2: Show Hint ("se ela não conseguir, haverá um botão para mostrar a dica")
  const handleTriggerHint = () => {
    setShowHint(true);
  };

  // STEP 3: Give Up & Reveal Answer ("finalmente a pessoa pode desistir e ver qual era a resposta correta")
  const handleGiveUpAndReveal = () => {
    setIsRevealed(true);
    setIsCorrect(false);
    speakMandarin(activeCard.hanzi);

    setProgress(prev => {
      const currentCardProgress = prev[activeCard.id];
      return {
        ...prev,
        [activeCard.id]: {
          status: currentCardProgress?.status === 'first_try' ? 'first_try' : 'revealed',
          attempts: (currentCardProgress?.attempts || 0) + 1,
          usedHint: true,
        }
      };
    });
  };

  // Reset current card to try fresh
  const handleRetryCurrentCard = () => {
    resetCardInteractiveState();
  };

  // Audio helper
  const handlePlayAudio = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    speakMandarin(text);
  };

  // Insert into Sentence Builder
  const handleInsertCardToBuilder = (card: HanziVisualFlashcard, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!onSendToBuilder) return;

    const matched = allWords.filter(w => {
      if (card.hanzi.startsWith(w.hanzi) || w.hanzi.startsWith(card.hanzi.replace('儿', ''))) return true;
      if (w.label.toLowerCase() === card.pinyin.toLowerCase()) return true;
      return false;
    });

    if (matched.length > 0) {
      onSendToBuilder(matched.slice(0, 1));
    }
  };

  // Statistics
  const stats = useMemo(() => {
    let firstTry = 0;
    let withHint = 0;
    let revealed = 0;
    let unattempted = 0;

    HANZI_VISUAL_FLASHCARDS.forEach(card => {
      const p = progress[card.id];
      if (!p || p.status === 'unattempted') {
        unattempted++;
      } else if (p.status === 'first_try') {
        firstTry++;
      } else if (p.status === 'with_hint') {
        withHint++;
      } else if (p.status === 'revealed') {
        revealed++;
      }
    });

    return { firstTry, withHint, revealed, unattempted };
  }, [progress]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if ((e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4') && !isCorrect && !isRevealed) {
        const idx = parseInt(e.key) - 1;
        if (pinyinOptions[idx]) {
          handleSelectPinyin(pinyinOptions[idx]);
        }
      } else if ((e.key === 'd' || e.key === 'D') && !showHint && !isCorrect && !isRevealed) {
        setShowHint(true);
      } else if ((e.key === 'r' || e.key === 'R') && !isRevealed && !isCorrect) {
        handleGiveUpAndReveal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isCorrect, isRevealed, pinyinOptions, showHint]);

  return (
    <div className="w-full flex flex-col gap-5 max-w-5xl mx-auto px-2 sm:px-4 py-2">
      {/* Top Banner & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 p-5 rounded-3xl border border-amber-200/60 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Flashcards Mnemônicos dos Hanzis
              </h2>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
                {deck.length} Ideogramas • 3 Etapas
              </span>
              {isShuffled && (
                <span className="bg-purple-100 text-purple-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                  <Shuffle className="w-3 h-3 text-purple-600" />
                  Ordem Embaralhada
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              Veja primeiro somente o caractere chinês (Hanzi), selecione o pinyin e use a imagem mnemônica como dica!
            </p>
          </div>
        </div>

        {/* View Mode Switcher & Shuffle Control */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* Shuffle Toggle Button */}
          <button
            type="button"
            onClick={isShuffled ? handleResetDeckOrder : handleShuffleDeck}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
              isShuffled
                ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
            title={isShuffled ? 'Restaurar ordem original' : 'Embaralhar todos os flashcards aleatoriamente'}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{isShuffled ? 'Restaurar Ordem' : 'Embaralhar Cards'}</span>
          </button>

          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTabMode('interactive_steps')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTabMode === 'interactive_steps'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Modo interativo em 3 etapas: adivinhar pinyin, pedir dica ou desistir"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modo Interativo (3 Etapas)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTabMode('free_flip')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTabMode === 'free_flip'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Explorar e virar os cartões livremente com análise completa dos traços"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Biblioteca 3D</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Quick Selection Ribbon of Characters */}
      <div className="flex flex-col gap-2.5 bg-white p-3.5 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold text-slate-600 px-1 gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              Progresso nos Ideogramas ({deck.length}):
            </span>
            {isShuffled && (
              <button
                type="button"
                onClick={handleShuffleDeck}
                className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 underline cursor-pointer flex items-center gap-0.5"
                title="Embaralhar novamente a sequência"
              >
                <Shuffle className="w-3 h-3" />
                re-embaralhar
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              1ª Tentativa: {stats.firstTry}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
              <Lightbulb className="w-3 h-3 text-amber-600" />
              Com Dica: {stats.withHint}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
              <Flag className="w-3 h-3 text-slate-500" />
              Revelados: {stats.revealed}
            </span>
          </div>
        </div>

        {/* Character Buttons Ribbon - Shows ONLY Hanzi first, emojis revealed upon attempt */}
        <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-13 gap-1.5 pt-1">
          {deck.map((card, idx) => {
            const isSelected = idx === currentIndex;
            const cardProg = progress[card.id];
            const isFirstTry = cardProg?.status === 'first_try';
            const isWithHint = cardProg?.status === 'with_hint';
            const isRevealedCard = cardProg?.status === 'revealed';

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-500 to-rose-600 text-white border-amber-500 shadow-md scale-105 z-10'
                    : isFirstTry
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
                    : isWithHint
                    ? 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
                    : isRevealedCard
                    ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span className="font-bold text-base sm:text-lg leading-tight tracking-wide font-serif">
                  {card.hanzi}
                </span>
                <span className="text-xs leading-none mt-0.5 min-h-[14px] flex items-center justify-center">
                  {isFirstTry || isWithHint || isRevealedCard ? (
                    card.emoji
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 block" />
                  )}
                </span>
                {isFirstTry && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] font-black shadow-xs">
                    ✓
                  </span>
                )}
                {isWithHint && !isFirstTry && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[8px] font-black shadow-xs">
                    💡
                  </span>
                )}
                {isRevealedCard && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-slate-400 text-white rounded-full flex items-center justify-center text-[7px] font-black shadow-xs">
                    👁
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {activeTabMode === 'interactive_steps' ? (
        /* ============================================================ */
        /* MODO INTERATIVO EM 3 ETAPAS SOLICITADO PELO USUÁRIO */
        /* ============================================================ */
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Main Flashcard Card */}
          <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-amber-200/90 shadow-xl p-6 sm:p-8 flex flex-col justify-between transition-all">
            
            {/* Top Bar of the Card */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] uppercase tracking-wider">
                  {activeCard.category}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                  {activeCard.hskLevel}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  • Palavra {currentIndex + 1} de {deck.length}
                </span>
              </div>

              {/* Status pill */}
              <div className="flex items-center gap-1.5">
                {isCorrect ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Acertou!
                  </span>
                ) : isRevealed ? (
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1 border border-slate-200">
                    <Flag className="w-3.5 h-3.5 text-slate-500" />
                    Resposta Revelada
                  </span>
                ) : showHint ? (
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1 border border-amber-200 animate-pulse">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    Dica Ativada
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center gap-1 border border-indigo-200">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    Etapa 1: Adivinhe o Pinyin
                  </span>
                )}
              </div>
            </div>

            {/* Central Area: ETAPA 1 - PRIMEIRO SOMENTE O CARACTERE (HANZI), IMAGEM DEPOIS COMO DICA */}
            <div className="flex flex-col items-center justify-center my-6 text-center gap-3">
              
              {/* Hanzi mostrado SEM o Pinyin (isolado e em destaque) */}
              <div className="relative my-2">
                <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-slate-900 tracking-wider font-serif drop-shadow-xs select-none">
                  {activeCard.hanzi}
                </h1>
                
                {/* Visual Audio Button once correct or revealed */}
                {(isCorrect || isRevealed) && (
                  <button
                    type="button"
                    onClick={(e) => handlePlayAudio(activeCard.hanzi, e)}
                    className="absolute -top-2 -right-10 p-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 shadow-sm transition-transform active:scale-95 cursor-pointer"
                    title="Ouvir pronúncia oficial"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* IMAGEM MNEMÔNICA COMO DICA: aparece apenas quando solicitado como dica ou ao acertar/revelar */}
              {(showHint || isCorrect || isRevealed) ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="flex items-center justify-center gap-3 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 px-6 py-3 rounded-2xl shadow-xs max-w-lg w-full"
                >
                  <span className="text-4xl sm:text-5xl drop-shadow-sm select-none" role="img" aria-label="Visual mnemonic">
                    {activeCard.emoji}
                  </span>
                  <div className="text-left">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-amber-600 inline" />
                      Imagem Mnemônica (Dica Visual)
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                      {activeCard.visualDescription}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <button
                  type="button"
                  onClick={handleTriggerHint}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-500 hover:text-amber-800 text-xs font-medium transition-all cursor-pointer shadow-2xs"
                  title="A imagem mnemônica está oculta. Clique aqui para revelá-la como dica!"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Imagem mnemônica oculta • Ver como dica</span>
                </button>
              )}

              {/* Pinyin e tradução revelados (apenas se acertou ou desistiu) */}
              {(isCorrect || isRevealed) && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-300 px-5 py-2.5 rounded-2xl text-emerald-950 font-black shadow-xs flex-wrap justify-center"
                >
                  <span className="text-xl sm:text-2xl font-mono">
                    {activeCard.pinyin}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-emerald-900">
                    • {activeCard.translation}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakMandarin(activeCard.hanzi)}
                    className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-emerald-800 hover:text-emerald-950 cursor-pointer ml-1 shadow-2xs"
                    title="Ouvir áudio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </div>

            {/* SELEÇÃO DO PINYIN + TRADUÇÃO (Etapa 1) */}
            <div className="flex flex-col gap-2.5 mt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  {!isCorrect && !isRevealed ? (
                    <span>Selecione a alternativa correspondente (Pinyin + Tradução):</span>
                  ) : (
                    <span>Alternativas avaliadas:</span>
                  )}
                </span>
                {!isCorrect && !isRevealed && (
                  <span className="text-[11px] text-slate-600 font-medium">
                    (Dica: Teclas 1 a 4)
                  </span>
                )}
              </div>

              {/* 4 Pinyin + Translation Option Buttons */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {pinyinOptions.map((opt, idx) => {
                  const isSelected = selectedOption === opt.id;
                  const isWrong = wrongAttempts.includes(opt.id);
                  const isThisCorrect = opt.isCorrect;
                  const isSolved = isCorrect || isRevealed;

                  let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 hover:border-amber-300';
                  
                  if (isSolved) {
                    if (isThisCorrect) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-black shadow-md';
                    } else if (isWrong) {
                      btnStyle = 'bg-rose-50 border-rose-200 text-rose-400 opacity-60';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-50';
                    }
                  } else if (isWrong) {
                    btnStyle = 'bg-rose-50 border-rose-300 text-rose-700 opacity-70';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isSolved || isWrong}
                      onClick={() => handleSelectPinyin(opt)}
                      className={`relative p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all cursor-pointer ${btnStyle} active:scale-98`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-6 h-6 rounded-lg text-[11px] font-sans font-black flex items-center justify-center shrink-0 ${
                          isSolved && isThisCorrect ? 'bg-white/20 text-white' : 'bg-black/5 text-slate-700'
                        }`}>
                          {idx + 1}
                        </span>
                        <div className="flex flex-col text-left min-w-0">
                          <span className="font-mono text-base sm:text-lg font-bold leading-tight">
                            {opt.pinyin}
                          </span>
                          <span className={`text-xs sm:text-sm font-semibold truncate ${
                            isSolved && isThisCorrect 
                              ? 'text-white/95' 
                              : isWrong 
                              ? 'text-rose-600' 
                              : 'text-slate-600'
                          }`}>
                            {opt.translation}
                          </span>
                        </div>
                      </div>
                      
                      {isSolved && isThisCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-white shrink-0 ml-1" />
                      )}
                      {isWrong && (
                        <X className="w-5 h-5 text-rose-500 shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ETAPA 2: DICA DO DESENHO (Aparece ou fica disponível se a pessoa não conseguir) */}
            <div className="mt-4 flex flex-col gap-2">
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 p-4 rounded-2xl flex flex-col gap-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase tracking-wider">
                        <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500" />
                        <span>Dica Explicando o Desenho (Mnemônica):</span>
                      </div>
                      <span className="text-xl">{activeCard.emoji}</span>
                    </div>

                    <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-200">
                      "{activeCard.hintPhrase}"
                    </p>

                    {!isCorrect && !isRevealed && (
                      <span className="text-xs text-amber-800 font-medium">
                        👉 Agora tente novamente selecionar o pinyin correto acima!
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons for Hint & Give Up (Etapas 2 e 3) */}
              {!isCorrect && !isRevealed && (
                <div className="flex items-center justify-between gap-3 pt-2">
                  {/* Button ETAPA 2: Mostrar Dica */}
                  {!showHint ? (
                    <button
                      type="button"
                      onClick={handleTriggerHint}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs sm:text-sm border border-amber-300 shadow-xs transition-all cursor-pointer active:scale-95"
                      title="Mostrar a frase que explica o desenho deste caractere"
                    >
                      <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500" />
                      <span>Mostrar Dica do Desenho</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Dica ativa: tente selecionar o pinyin!
                    </span>
                  )}

                  {/* Button ETAPA 3: Desistir e ver a resposta correta */}
                  <button
                    type="button"
                    onClick={handleGiveUpAndReveal}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-600 font-bold text-xs transition-all cursor-pointer active:scale-95 ml-auto"
                    title="Desistir e revelar a resposta correta com a história completa"
                  >
                    <Flag className="w-3.5 h-3.5 text-rose-500" />
                    <span>Desistir e Ver Resposta</span>
                  </button>
                </div>
              )}
            </div>

            {/* SEÇÃO REVELADA / ACERTO (Explicação completa do Desenho + Componentes + Exemplo) */}
            {(isCorrect || isRevealed) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 border-t border-slate-200/80 pt-4 flex flex-col gap-3.5"
              >
                {/* Result header banner */}
                <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-slate-100 border-slate-200 text-slate-900'
                }`}>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>Excelente! Resposta correta: <strong>{activeCard.pinyin}</strong> ({activeCard.translation})</span>
                      </>
                    ) : (
                      <>
                        <Flag className="w-5 h-5 text-slate-500 shrink-0" />
                        <span>Resposta revelada: <strong>{activeCard.pinyin}</strong> ({activeCard.translation})</span>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => speakMandarin(activeCard.hanzi)}
                    className="p-1.5 rounded-xl bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs cursor-pointer"
                    title="Ouvir áudio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* História Mnemônica Completa do Desenho */}
                <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-2xl flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>História Visual Completa do Ideograma</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {activeCard.mnemonicStory}
                  </p>
                </div>

                {/* Radicais e Partes do Desenho */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeCard.components.map((comp, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                    >
                      <span className="text-lg font-bold font-serif text-amber-700 shrink-0 bg-white border border-slate-200 w-8 h-8 rounded-lg flex items-center justify-center shadow-2xs">
                        {comp.part}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          {comp.name}
                          <span className="text-[10px] font-mono text-slate-500 font-normal">({comp.pinyin})</span>
                        </span>
                        <span className="text-[11px] text-slate-600 mt-0.5 leading-tight">
                          {comp.visualRole}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Frase de Exemplo Prático */}
                <div className="bg-indigo-50/70 border border-indigo-100 p-3 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex flex-col text-xs">
                    <span className="font-bold text-indigo-950 text-sm tracking-wide">
                      {activeCard.exampleSentence.hanzi}
                    </span>
                    <span className="font-mono text-[11px] text-indigo-800">
                      {activeCard.exampleSentence.pinyin}
                    </span>
                    <span className="text-[11px] text-slate-600 italic mt-0.5">
                      "{activeCard.exampleSentence.portuguese}"
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakMandarin(activeCard.exampleSentence.hanzi)}
                    className="p-2 rounded-xl bg-white hover:bg-indigo-100 text-indigo-700 transition-colors shrink-0 shadow-2xs border border-indigo-200 cursor-pointer"
                    title="Ouvir frase de exemplo"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Action Buttons: Tentar Novamente / Próximo / Canvas / Frase */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    {onOpenCanvasWithChar && (
                      <button
                        type="button"
                        onClick={() => onOpenCanvasWithChar(activeCard.hanzi.charAt(0))}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                        title="Praticar traçado do caractere no Canvas"
                      >
                        <PenTool className="w-3.5 h-3.5 text-rose-500" />
                        <span>Treinar Traço</span>
                      </button>
                    )}
                    {onSendToBuilder && (
                      <button
                        type="button"
                        onClick={(e) => handleInsertCardToBuilder(activeCard, e)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-xs transition-colors cursor-pointer"
                        title="Inserir palavra no construtor de frases"
                      >
                        <PlusSquare className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Inserir na Frase</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRetryCurrentCard}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                      title="Reiniciar este cartão para treinar de novo"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Treinar De Novo</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      <span>Próximo Ideograma</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Navigation Controls Below Flashcard */}
          <div className="flex items-center justify-between w-full max-w-2xl px-2">
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior (←)</span>
            </button>

            <span className="text-xs font-semibold text-slate-500">
              Ideograma {currentIndex + 1} de {deck.length}
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <span>Próximo (→)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* MODO BIBLIOTECA 3D (Exploração livre dos cards) */
        /* ============================================================ */
        <div className="flex flex-col items-center gap-4 w-full">
          <div 
            className="w-full max-w-2xl min-h-[460px] perspective-1000 cursor-pointer select-none"
            onClick={() => setFlipState(prev => !prev)}
          >
            <motion.div
              className="w-full h-full relative rounded-3xl transition-transform duration-500 transform-style-3d shadow-xl"
              animate={{ rotateY: flipState ? 180 : 0 }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
            >
              {/* FRONT: Primeiro somente o caractere (Hanzi) */}
              <div className="absolute inset-0 backface-hidden w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-2 border-amber-200 bg-gradient-to-br from-white via-amber-50/40 to-rose-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase">
                      {activeCard.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {activeCard.hskLevel}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handlePlayAudio(activeCard.hanzi, e)}
                    className="p-2 rounded-xl bg-white hover:bg-amber-100 border border-slate-200 text-amber-700 shadow-2xs"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center my-6 text-center">
                  {/* Primeiro somente o caractere (Hanzi) */}
                  <h1 className="text-8xl sm:text-9xl font-black text-slate-900 font-serif drop-shadow-sm select-none">
                    {activeCard.hanzi}
                  </h1>

                  <div className="mt-4 flex items-center gap-2 bg-amber-100/80 hover:bg-amber-100 text-amber-900 px-4 py-2 rounded-2xl border border-amber-300 transition-colors shadow-2xs">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold">
                      Clique para virar e ver a imagem mnemônica como dica, pinyin e história
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-amber-100 pt-3 text-xs text-slate-500">
                  <span className="text-[11px] font-medium flex items-center gap-1.5 text-amber-800">
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    Clique para virar o cartão e ver a história dos traços
                  </span>
                  <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded-md">
                    {currentIndex + 1} / {deck.length}
                  </span>
                </div>
              </div>

              {/* BACK: Imagem Mnemônica (Dica), Pinyin, Tradução e Radicais */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-2 border-amber-400 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl drop-shadow-sm select-none" role="img" aria-label="Visual mnemonic">
                      {activeCard.emoji}
                    </span>
                    <span className="text-2xl font-bold font-serif text-amber-300">
                      {activeCard.hanzi}
                    </span>
                    <span className="font-mono text-sm text-amber-200 bg-white/10 px-2 py-0.5 rounded-lg">
                      {activeCard.pinyin}
                    </span>
                    <span className="text-xs text-slate-300 truncate">
                      — {activeCard.translation}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handlePlayAudio(activeCard.hanzi, e)}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-3 my-2 overflow-y-auto max-h-[300px] pr-1">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                    <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-xs uppercase mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Desenho e Mnemônica</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {activeCard.mnemonicStory}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeCard.components.map((comp, idx) => (
                      <div 
                        key={idx}
                        className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 text-xs"
                      >
                        <span className="text-xl font-bold font-serif text-amber-300 shrink-0 bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center">
                          {comp.part}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-100 flex items-center gap-1">
                            {comp.name}
                            <span className="text-[10px] font-mono text-amber-200/80">({comp.pinyin})</span>
                          </span>
                          <span className="text-[11px] text-slate-300 mt-0.5 leading-tight">
                            {comp.visualRole}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-500/10 border border-amber-400/20 p-2.5 rounded-2xl text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-amber-300 block">{activeCard.exampleSentence.hanzi}</span>
                      <span className="font-mono text-[10px] text-amber-200/80 block">{activeCard.exampleSentence.pinyin}</span>
                      <span className="text-[11px] text-slate-300 italic">"{activeCard.exampleSentence.portuguese}"</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handlePlayAudio(activeCard.exampleSentence.hanzi, e)}
                      className="p-1.5 rounded-xl bg-white/10 text-amber-300 shrink-0 ml-2"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Dica: {activeCard.retentionTip}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFlipState(false)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                  >
                    Virar Frente
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between w-full max-w-2xl px-2">
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <button
              type="button"
              onClick={() => setFlipState(prev => !prev)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{flipState ? 'Ver Frente' : 'Virar Cartão'}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
