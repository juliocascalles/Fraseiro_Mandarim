import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Target, Sparkles, CheckCircle2, AlertCircle, ArrowRight, 
  RotateCcw, HelpCircle, Volume2, Award, ChevronLeft, 
  ChevronRight, Lightbulb, Check, X, Search, BookOpen, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Word, PracticeChallenge, PhraseValidationReport } from '../types';
import { GrammarTipBalloon } from './GrammarTipBalloon';
import { PRACTICE_CHALLENGES } from '../data/challenges';
import { speakMandarin } from '../utils/speech';

interface PracticeModeProps {
  allWords: Word[];
  getAvailableWords: (sequence: Word[]) => Word[];
  checkIsValidSentence: (sequence: Word[]) => boolean;
  getNaturalTranslation: (sequence: Word[]) => string;
  validateAndBuildPhrase: (input: string) => PhraseValidationReport;
  onOpenDictionary?: () => void;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  allWords,
  getAvailableWords,
  checkIsValidSentence,
  getNaturalTranslation,
  validateAndBuildPhrase,
  onOpenDictionary,
}) => {
  // Practice state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedHskLevel, setSelectedHskLevel] = useState<string>('all');
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);
  const [currentSequence, setCurrentSequence] = useState<Word[]>([]);
  const [typedInput, setTypedInput] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [validationReport, setValidationReport] = useState<PhraseValidationReport | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Filter challenges based on filters
  const filteredChallenges = useMemo(() => {
    return PRACTICE_CHALLENGES.filter(c => {
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      if (selectedHskLevel !== 'all' && c.hskLevel !== selectedHskLevel) return false;
      return true;
    });
  }, [selectedCategory, selectedHskLevel]);

  // Current active challenge
  const activeChallenge: PracticeChallenge | undefined = filteredChallenges[currentChallengeIndex] || filteredChallenges[0];

  // Reset challenge state when challenge changes
  useEffect(() => {
    setCurrentSequence([]);
    setTypedInput('');
    setShowHint(false);
    setShowSolution(false);
    setIsSuccess(false);
    setValidationReport(null);
  }, [currentChallengeIndex, selectedCategory, selectedHskLevel]);

  // Normalization helper for checking Hanzi phrase equality (strips punctuation and whitespace)
  const normalizeHanzi = (text: string) => {
    return text
      .replace(/[\s\u3000,\.!\?，。！？、~～:：;；"'“”‘’\(\)（）\[\]【】\-_—–\u200B-\u200D\uFEFF]/g, '')
      .trim();
  };

  // Current sequence in pure Hanzi
  const currentSequenceHanzi = useMemo(() => {
    return normalizeHanzi(currentSequence.map(w => w.hanzi).join(''));
  }, [currentSequence]);

  // Check if current sequence satisfies the challenge (USING ONLY HANZI)
  useEffect(() => {
    if (!activeChallenge || currentSequence.length === 0) {
      setIsSuccess(false);
      return;
    }

    const currentHanzi = currentSequenceHanzi;
    const targetHanziOptions = [
      activeChallenge.targetHanzi,
      ...(activeChallenge.targetHanziList || [])
    ].map(normalizeHanzi);

    const isMatched = targetHanziOptions.some(target => target === currentHanzi);

    if (isMatched && checkIsValidSentence(currentSequence)) {
      if (!isSuccess) {
        setIsSuccess(true);
        setStreak(prev => prev + 1);
        setCompletedIds(prev => new Set([...prev, activeChallenge.id]));
        // Speak completed mandarin phrase
        const hanziText = currentSequence.map(w => w.hanzi).join('');
        speakMandarin(hanziText);
      }
    }
  }, [currentSequence, activeChallenge, currentSequenceHanzi, checkIsValidSentence, isSuccess]);

  // Grammatically allowed words for the next position
  const availableWords = useMemo(() => {
    return getAvailableWords(currentSequence);
  }, [currentSequence, getAvailableWords]);

  // Words filtered in real-time as the user types in the input box
  const displayedWords = useMemo(() => {
    const query = typedInput.trim();
    if (!query) return availableWords;

    const normalizeQuery = (text: string) => {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ü/g, 'v')
        .trim();
    };

    const normQuery = normalizeQuery(query);
    const tokens = query.split(/\s+/).filter(Boolean);
    const lastToken = tokens.length > 0 ? normalizeQuery(tokens[tokens.length - 1]) : '';

    return availableWords.filter(word => {
      const normLabel = normalizeQuery(word.label);
      const normTranslation = normalizeQuery(word.translation);
      const normId = normalizeQuery(word.id);
      const hanzi = word.hanzi;

      // 1. Direct match with full query
      if (
        normLabel.includes(normQuery) ||
        normTranslation.includes(normQuery) ||
        normId.includes(normQuery) ||
        hanzi.includes(query)
      ) {
        return true;
      }

      // 2. Match with last token (for multi-word typing)
      if (lastToken && lastToken !== normQuery) {
        if (
          normLabel.includes(lastToken) ||
          normTranslation.includes(lastToken) ||
          normId.includes(lastToken) ||
          (tokens[tokens.length - 1] && hanzi.includes(tokens[tokens.length - 1]))
        ) {
          return true;
        }
      }

      // 3. Match with any individual token typed
      return tokens.some(tok => {
        const normTok = normalizeQuery(tok);
        return (
          normLabel.includes(normTok) ||
          normTranslation.includes(normTok) ||
          normId.includes(normTok) ||
          hanzi.includes(tok)
        );
      });
    });
  }, [availableWords, typedInput]);

  // Add word to sequence
  const handleAddWord = (word: Word) => {
    if (isSuccess) return;
    const nextSeq = [...currentSequence, word];
    setCurrentSequence(nextSeq);
    setTypedInput('');
    setValidationReport(null);
  };

  // Remove last word
  const handleRemoveLast = () => {
    if (isSuccess || currentSequence.length === 0) return;
    setCurrentSequence(currentSequence.slice(0, -1));
    setValidationReport(null);
  };

  // Clear current sequence
  const handleClear = () => {
    setCurrentSequence([]);
    setTypedInput('');
    setValidationReport(null);
    setIsSuccess(false);
  };

  // Validate typed phrase
  const handleValidateTyped = (text: string) => {
    if (!text.trim()) return;
    const report = validateAndBuildPhrase(text);
    setValidationReport(report);
    if (report.validWords.length > 0) {
      setCurrentSequence(report.validWords);
    }
  };

  // Next challenge
  const handleNextChallenge = () => {
    if (currentChallengeIndex < filteredChallenges.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
    } else {
      setCurrentChallengeIndex(0);
    }
  };

  // Previous challenge
  const handlePrevChallenge = () => {
    if (currentChallengeIndex > 0) {
      setCurrentChallengeIndex(prev => prev - 1);
    } else {
      setCurrentChallengeIndex(filteredChallenges.length - 1);
    }
  };

  // Category palette bg
  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'pronoun': return 'bg-blue-50';
      case 'verb': return 'bg-emerald-50';
      case 'adverb': return 'bg-amber-50';
      case 'question': return 'bg-purple-50';
      case 'noun': return 'bg-slate-50';
      case 'family': return 'bg-rose-50';
      case 'classifier': return 'bg-teal-50';
      case 'country': return 'bg-cyan-50';
      case 'plural': return 'bg-indigo-50';
      case 'possessive': return 'bg-rose-100';
      case 'thing': return 'bg-orange-50';
      case 'adjective': return 'bg-yellow-50';
      case 'number': return 'bg-sky-50';
      case 'preposition': return 'bg-orange-100';
      case 'etiquette': return 'bg-blue-50';
      case 'conjunction': return 'bg-pink-50';
      case 'particle': return 'bg-purple-100';
      default: return 'bg-white';
    }
  };

  if (!activeChallenge) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-100">
        <p className="text-slate-600 font-medium">Nenhum desafio encontrado para estes filtros.</p>
        <button
          onClick={() => {
            setSelectedCategory('all');
            setSelectedHskLevel('all');
          }}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
        >
          Limpar Filtros
        </button>
      </div>
    );
  }

  return (
    <div id="practice-mode-container" className="flex flex-col gap-6 w-full">
      {/* Practice Header & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-indigo-50/80 via-white to-blue-50/80 p-4 sm:p-5 rounded-2xl border border-indigo-100/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl text-white shadow-xs">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Modo Prática de Tradução
              </h2>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Desafio {currentChallengeIndex + 1} / {filteredChallenges.length}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Traduza a frase do português para o mandarim palavra por palavra com validação em tempo real.
            </p>
          </div>
        </div>

        {/* Streak & Score Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold shadow-xs">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span>Streak: {streak}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{completedIds.size} Concluídos</span>
          </div>
        </div>
      </div>

      {/* Category & Level Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Tópico:
          </span>
          {[
            { id: 'all', label: 'Todos os Tópicos' },
            { id: 'greetings', label: 'Cumprimentos' },
            { id: 'family_age', label: 'Família & Idade' },
            { id: 'weather_climate', label: 'Clima & Tempo' },
            { id: 'quantities_comparison', label: 'Quantidades & Amigos' },
            { id: 'intentions_feelings', label: 'Intenções (想/在)' },
            { id: 'causes_reasons', label: 'Causas (为什么/因为)' },
            { id: 'origin_location', label: 'Origem & Locais' },
            { id: 'invitations_impressions', label: 'Convites (吧)' },
            { id: 'abilities_politeness', label: 'Habilidades & Modais' },
            { id: 'shopping_prices', label: 'Preços & Opiniões' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentChallengeIndex(0);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/70 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Level toggle */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Nível:
          </span>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'HSK 1', label: 'HSK 1' },
            { id: 'HSK 2', label: 'HSK 2' },
          ].map(lvl => (
            <button
              key={lvl.id}
              onClick={() => {
                setSelectedHskLevel(lvl.id);
                setCurrentChallengeIndex(0);
              }}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedHskLevel === lvl.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Challenge Card */}
      <div 
        id="current-practice-card"
        className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md flex flex-col gap-6 relative overflow-hidden"
      >
        {/* Navigation Arrows & Topic Pill */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
              {activeChallenge.categoryName}
            </span>
            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 text-slate-600 uppercase tracking-wider">
              {activeChallenge.hskLevel}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevChallenge}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              title="Desafio anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400 font-mono font-semibold px-1">
              {currentChallengeIndex + 1}/{filteredChallenges.length}
            </span>
            <button
              onClick={handleNextChallenge}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              title="Próximo desafio"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Portuguese Prompt to Translate */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Traduza para o Mandarim:
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            "{activeChallenge.portuguese}"
          </h3>
        </div>

        {/* Optional Hint & Solution Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>{showHint ? 'Ocultar Dica' : 'Ver Dica Gramatical'}</span>
            </button>

            <button
              onClick={() => setShowSolution(!showSolution)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>{showSolution ? 'Ocultar Solução' : 'Ver Resposta'}</span>
            </button>
          </div>

          {currentSequence.length > 0 && !isSuccess && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar frase</span>
            </button>
          )}
        </div>

        {/* Hint Display */}
        {showHint && activeChallenge.contextHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5"
          >
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-bold">Dica da frase:</span>
              <span>{activeChallenge.contextHint}</span>
            </div>
          </motion.div>
        )}

        {/* Solution Display */}
        {showSolution && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Solução Esperada:
              </span>
              <button
                onClick={() => speakMandarin(activeChallenge.targetHanzi)}
                className="p-1 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                title="Ouvir pronúncia"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-slate-900">{activeChallenge.targetHanzi}</span>
              <span className="font-mono text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                {activeChallenge.targetPinyinList[0]}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 italic mt-0.5">{activeChallenge.grammarNote}</p>
          </motion.div>
        )}

        {/* Construction Work Area / Token Sequence */}
        <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col gap-3 min-h-[120px] justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Sua Construção em Mandarim:
            </span>
            {currentSequence.length > 0 && (
              <span className="text-[11px] font-mono text-slate-400 font-semibold">
                {currentSequence.length} {currentSequence.length === 1 ? 'palavra' : 'palavras'}
              </span>
            )}
          </div>

          {currentSequence.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4 text-center text-slate-400 gap-1">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
              <p className="text-xs font-semibold text-slate-600">Selecione as palavras abaixo para montar a tradução</p>
              <p className="text-[11px] text-slate-400">A ordem gramatical é checada automaticamente a cada palavra adicionada.</p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <AnimatePresence mode="popLayout">
                {currentSequence.map((word, idx) => {
                  const isLast = idx === currentSequence.length - 1;
                  return (
                    <motion.div
                      key={`${word.id}-${idx}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      onClick={isLast ? handleRemoveLast : undefined}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs cursor-pointer select-none transition-all ${getCategoryBg(
                        word.category
                      )} hover:scale-105`}
                      title={isLast ? 'Clique para remover última palavra' : undefined}
                    >
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{word.label}</span>
                      <span className="font-bold text-sm text-slate-900">{word.hanzi}</span>
                      {isLast && (
                        <X className="w-3 h-3 text-slate-400 hover:text-rose-600 ml-0.5" />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Generated Hanzi & Natural Translation Preview */}
          {currentSequence.length > 0 && (
            <div className="border-t border-slate-200/80 pt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-800">
                  {currentSequence.map(w => w.hanzi).join('')}
                </span>
                <span className="font-mono text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {currentSequence.map(w => w.label).join(' ')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakMandarin(currentSequence.map(w => w.hanzi).join(''))}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white transition-colors cursor-pointer"
                  title="Ouvir frase gerada"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Celebratory Success Feedback Card */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 shadow-md flex flex-col gap-3.5 text-slate-800"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-xs shrink-0">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Excelente! Tradução Perfeita
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full uppercase">
                      +1 Ponto
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                    {activeChallenge.targetHanzi} ({activeChallenge.targetPinyinList[0]})
                  </h4>
                  <p className="text-xs text-emerald-950 font-medium mt-1 leading-relaxed">
                    {activeChallenge.grammarNote}
                  </p>
                </div>
              </div>

              <button
                onClick={() => speakMandarin(activeChallenge.targetHanzi)}
                className="p-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors shrink-0 cursor-pointer"
                title="Ouvir novamente"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="border-t border-emerald-200 pt-3 flex items-center justify-end">
              <button
                id="next-practice-challenge-btn"
                onClick={handleNextChallenge}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                <span>Próximo Desafio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Contextual Grammar Help Balloon when validation fails */}
        {validationReport && !validationReport.success && (
          validationReport.contextualGrammarTip ? (
            <GrammarTipBalloon
              tip={validationReport.contextualGrammarTip}
              pointerPosition="top-center"
              onClose={() => setValidationReport(null)}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-slate-800 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex flex-col text-xs">
                <span className="font-bold text-rose-900">
                  {validationReport.errorReason || 'Erro na sequência gramatical'}
                </span>
                {validationReport.steps[validationReport.stoppedAtIndex!]?.ruleHint && (
                  <p className="text-rose-800 mt-1">
                    {validationReport.steps[validationReport.stoppedAtIndex!].ruleHint}
                  </p>
                )}
              </div>
            </motion.div>
          )
        )}

        {/* Quick Type Search & Validate Bar */}
        {!isSuccess && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ou digite em pinyin/hanzi (ex: wo hen hao, 你好)..."
                  value={typedInput}
                  onChange={(e) => setTypedInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleValidateTyped(typedInput);
                    }
                  }}
                  className="w-full pl-3.5 pr-8 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-all"
                />
                {typedInput && (
                  <button
                    onClick={() => setTypedInput('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {typedInput.trim() && (
                <button
                  onClick={() => handleValidateTyped(typedInput)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0"
                >
                  Validar
                </button>
              )}
            </div>
          </div>
        )}

        {/* Grammatically Available Word Palette (Filtered dynamically as user types) */}
        {!isSuccess && (
          <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Palavras Disponíveis no Passo Atual:
                </span>
                {typedInput.trim() && (
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                    {displayedWords.length} de {availableWords.length} filtradas
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400">
                (Apenas opções gramaticalmente válidas são habilitadas)
              </span>
            </div>

            {displayedWords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 px-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 gap-2">
                <Search className="w-5 h-5 text-slate-400" />
                <p className="text-xs font-semibold text-slate-600">
                  Nenhuma palavra válida encontrada para "{typedInput.trim()}"
                </p>
                <p className="text-[11px] text-slate-400">
                  Você pode pressionar <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[10px]">Enter</kbd> para validar a frase inteira ou limpar a busca.
                </p>
                <button
                  onClick={() => setTypedInput('')}
                  className="mt-1 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Limpar busca
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {displayedWords.map(word => {
                  const Icon = word.icon;
                  return (
                    <button
                      key={word.id}
                      id={`practice-word-${word.id}`}
                      onClick={() => handleAddWord(word)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/90 text-left transition-all ${getCategoryBg(
                        word.category
                      )} hover:scale-[102%] hover:shadow-sm active:scale-95 cursor-pointer`}
                    >
                      <div className="p-1.5 rounded-lg bg-white shadow-2xs text-slate-700">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none">
                          {word.label}
                        </span>
                        <span className="font-bold text-sm text-slate-900 truncate mt-0.5">
                          {word.hanzi}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate leading-none mt-0.5">
                          {word.translation}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
