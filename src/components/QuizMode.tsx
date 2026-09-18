import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Sparkles, CheckCircle2, XCircle, Volume2, ArrowRight, RotateCcw, 
  HelpCircle, Shuffle, Award, Trophy, Flame, Check, X, 
  BookOpen, ChevronRight, Layers, Lightbulb, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Word, HskLevel, QuizQuestion, QuizOption, ContextualGrammarTip, PhraseValidationReport } from '../types';
import { CURATED_QUIZ_QUESTIONS, getRandomQuizQuestion, shuffleArray } from '../data/quizQuestions';
import { GrammarTipBalloon } from './GrammarTipBalloon';
import { speakMandarin } from '../utils/speech';
import { generateGrammarOrderTip } from '../utils/grammarTips';

interface QuizModeProps {
  allWords: Word[];
  validateAndBuildPhrase: (input: string) => PhraseValidationReport;
  onOpenDictionary?: () => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  allWords,
  validateAndBuildPhrase,
  onOpenDictionary,
}) => {
  // Filters & Game Configuration
  const [hskFilter, setHskFilter] = useState<HskLevel | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'fill_blank' | 'order_words'>('ALL');
  const [gameMode, setGameMode] = useState<'round10' | 'endless'>('round10');

  // Stats & Progress
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [roundQuestionIndex, setRoundQuestionIndex] = useState<number>(1);
  const [isRoundFinished, setIsRoundFinished] = useState<boolean>(false);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<string[]>([]);

  // Current Question State
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>(() => {
    return getRandomQuizQuestion('ALL', 'ALL');
  });

  // User Response State
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showGrammarTip, setShowGrammarTip] = useState<boolean>(true);
  const [activeTip, setActiveTip] = useState<ContextualGrammarTip | null>(null);

  // State specifically for 'order_words' questions
  const [orderedTiles, setOrderedTiles] = useState<Word[]>([]);
  const [availableTiles, setAvailableTiles] = useState<Word[]>([]);
  const [orderErrorTip, setOrderErrorTip] = useState<ContextualGrammarTip | null>(null);

  // Map word strings from question to actual Word objects
  const setupOrderTiles = useCallback((question: QuizQuestion) => {
    if (question.type !== 'order_words' || !question.correctSequenceHanzi) return;
    
    // Find matching words from allWords for the characters in correctSequenceHanzi
    const targetText = question.correctSequenceHanzi;
    const tiles: Word[] = [];
    let remaining = targetText;

    // Greedy search in allWords
    while (remaining.length > 0) {
      let matched = false;
      // Try longest match first
      for (let len = Math.min(remaining.length, 4); len >= 1; len--) {
        const sub = remaining.slice(0, len);
        const word = allWords.find(w => w.hanzi === sub);
        if (word) {
          tiles.push(word);
          remaining = remaining.slice(len);
          matched = true;
          break;
        }
      }
      if (!matched) {
        // Fallback dummy word
        const char = remaining.slice(0, 1);
        tiles.push({
          id: `custom_${char}`,
          label: char,
          hanzi: char,
          translation: char,
          category: 'noun',
          icon: HelpCircle,
        });
        remaining = remaining.slice(1);
      }
    }

    setOrderedTiles([]);
    setAvailableTiles(shuffleArray(tiles));
    setOrderErrorTip(null);
  }, [allWords]);

  // Sorteia nova pergunta
  const drawNewQuestion = useCallback((hsk = hskFilter, type = typeFilter) => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setActiveTip(null);
    setOrderErrorTip(null);

    const nextQ = getRandomQuizQuestion(hsk, type, answeredQuestionIds);
    setCurrentQuestion(nextQ);
    setupOrderTiles(nextQ);
  }, [hskFilter, typeFilter, answeredQuestionIds, setupOrderTiles]);

  // Initialize order tiles when question changes to order_words
  useEffect(() => {
    if (currentQuestion.type === 'order_words') {
      setupOrderTiles(currentQuestion);
    }
  }, [currentQuestion, setupOrderTiles]);

  // Handle Fill-In-The-Blank Option Click
  const handleSelectOption = (option: QuizOption) => {
    if (isAnswered) return;

    setSelectedOptionId(option.id);
    setIsAnswered(true);
    const correct = option.isCorrect;
    setIsCorrect(correct);

    setTotalAnswered(prev => prev + 1);
    setAnsweredQuestionIds(prev => [...prev, currentQuestion.id]);

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setScore(prev => prev + 10 + (newStreak > 1 ? newStreak * 2 : 0));
      setCorrectAnswersCount(prev => prev + 1);
      setActiveTip(null);
      // Auto-pronounce sentence on correct response
      speakMandarin(currentQuestion.fullHanzi);
    } else {
      setStreak(0);
      // Attach grammar tip for explanation
      if (option.grammarTip) {
        setActiveTip(option.grammarTip);
      } else {
        // Construct contextual tip
        setActiveTip({
          title: currentQuestion.grammarRuleTitle,
          ruleName: currentQuestion.categoryName,
          explanation: option.explanation || currentQuestion.grammarExplanation,
          solutionTip: `A opção correta é "${currentQuestion.options?.find(o => o.isCorrect)?.hanzi}" (${currentQuestion.options?.find(o => o.isCorrect)?.pinyin}).`,
          exampleCorrect: currentQuestion.fullHanzi,
          exampleIncorrect: `${currentQuestion.prefixHanzi || ''} [ ${option.hanzi} ] ${currentQuestion.suffixHanzi || ''}`,
        });
      }
    }
  };

  // Handle tile addition in 'order_words'
  const handleAddTile = (word: Word, index: number) => {
    if (isAnswered) return;
    
    // Check if adding this word violates grammatical order right now
    const newSeq = [...orderedTiles, word];
    setOrderedTiles(newSeq);
    setAvailableTiles(prev => prev.filter((_, idx) => idx !== index));
    setOrderErrorTip(null);
  };

  // Handle tile removal in 'order_words'
  const handleRemoveTile = (index: number) => {
    if (isAnswered) return;
    const removed = orderedTiles[index];
    setOrderedTiles(prev => prev.filter((_, idx) => idx !== index));
    setAvailableTiles(prev => [...prev, removed]);
    setOrderErrorTip(null);
  };

  // Verify 'order_words' submission
  const handleVerifyOrder = () => {
    if (isAnswered) return;
    const assembledHanzi = orderedTiles.map(w => w.hanzi).join('');
    const targetHanzi = currentQuestion.correctSequenceHanzi || '';

    const correct = assembledHanzi === targetHanzi;
    setIsAnswered(true);
    setIsCorrect(correct);
    setTotalAnswered(prev => prev + 1);
    setAnsweredQuestionIds(prev => [...prev, currentQuestion.id]);

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setScore(prev => prev + 15 + (newStreak > 1 ? newStreak * 3 : 0));
      setCorrectAnswersCount(prev => prev + 1);
      setOrderErrorTip(null);
      speakMandarin(currentQuestion.fullHanzi);
    } else {
      setStreak(0);
      // Run grammar validation report on the sequence to find the exact rule broken
      const tip = generateGrammarOrderTip(orderedTiles.slice(0, -1), orderedTiles[orderedTiles.length - 1]);
      setOrderErrorTip(tip || {
        title: currentQuestion.grammarRuleTitle,
        ruleName: 'Ordem Sintática no Mandarim',
        explanation: currentQuestion.grammarExplanation,
        solutionTip: 'A ordem canônica esperada em mandarim é Sujeito + Advérbio/Locativo + Verbo + Objeto + Partícula.',
        exampleCorrect: currentQuestion.fullHanzi,
        exampleIncorrect: assembledHanzi,
      });
    }
  };

  // Reset tile order for current question
  const handleResetOrder = () => {
    if (isAnswered) {
      setIsAnswered(false);
      setIsCorrect(false);
    }
    setupOrderTiles(currentQuestion);
  };

  // Advance to next question or conclude round
  const handleNextQuestion = () => {
    if (gameMode === 'round10' && roundQuestionIndex >= 10) {
      setIsRoundFinished(true);
    } else {
      setRoundQuestionIndex(prev => prev + 1);
      drawNewQuestion();
    }
  };

  // Restart Round
  const handleRestartRound = () => {
    setScore(0);
    setStreak(0);
    setRoundQuestionIndex(1);
    setTotalAnswered(0);
    setCorrectAnswersCount(0);
    setIsRoundFinished(false);
    setAnsweredQuestionIds([]);
    drawNewQuestion();
  };

  // Keyboard shortcut listener (Enter = advance when answered)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isAnswered && !isRoundFinished) {
        e.preventDefault();
        handleNextQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, isRoundFinished, handleNextQuestion]);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Quiz Top Header & Controls */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200">
            <Shuffle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
                Modo Quiz de Gramática
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                Sorteio Interativo
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete as frases sorteadas e domine a ordem gramatical com feedback imediato.
            </p>
          </div>
        </div>

        {/* Live Score, Streak & Stats Bar */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-amber-600 leading-none">Streak</span>
              <span className="text-xs font-black">{streak} {streak > 1 ? 'seguidos' : ''}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-900">
            <Trophy className="w-4 h-4 text-indigo-600" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-indigo-600 leading-none">Pontos</span>
              <span className="text-xs font-black">{score} pts</span>
            </div>
          </div>

          {gameMode === 'round10' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
              <span>{roundQuestionIndex}</span>
              <span className="text-slate-400">/</span>
              <span>10</span>
            </div>
          )}

          <button
            onClick={() => drawNewQuestion()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            title="Sortear uma frase diferente"
          >
            <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Sortear Nova</span>
          </button>
        </div>
      </div>

      {/* Filter and Mode Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/70 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-slate-500 text-[11px] uppercase mr-1">Formato:</span>
          {(['ALL', 'fill_blank', 'order_words'] as const).map(type => (
            <button
              key={type}
              onClick={() => {
                setTypeFilter(type);
                drawNewQuestion(hskFilter, type);
              }}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                typeFilter === type
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {type === 'ALL' && '🎲 Misto'}
              {type === 'fill_blank' && '🧩 Preencher Lacuna'}
              {type === 'order_words' && '🔀 Ordenar Frase'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-slate-500 text-[11px] uppercase mr-1">Nível:</span>
          {(['ALL', 'HSK 1', 'HSK 2'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => {
                setHskFilter(lvl);
                drawNewQuestion(lvl, typeFilter);
              }}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                hskFilter === lvl
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {lvl === 'ALL' ? 'Todos' : lvl}
            </button>
          ))}

          <button
            onClick={() => setGameMode(prev => prev === 'round10' ? 'endless' : 'round10')}
            className="ml-2 px-2.5 py-1 rounded-xl font-bold bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200 cursor-pointer"
            title="Alternar entre rodada de 10 perguntas e modo infinito"
          >
            {gameMode === 'round10' ? '🏆 10 Perguntas' : '♾️ Infinito'}
          </button>
        </div>
      </div>

      {/* Main Question Card or Round Finished Screen */}
      {isRoundFinished ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 border-2 border-indigo-200 shadow-lg flex flex-col items-center text-center gap-6"
        >
          <div className="p-4 rounded-3xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Trophy className="w-14 h-14" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Rodada Completa
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              {correctAnswersCount >= 8 ? 'Excelente Domínio Gramatical!' : 'Bom Treino Gramatical!'}
            </h3>
            <p className="text-slate-600 text-sm max-w-md mt-2">
              Você concluiu as 10 frases sorteadas praticando os padrões fundamentais do mandarim.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Pontuação</span>
              <span className="text-xl font-black text-indigo-600 mt-0.5">{score}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Acertos</span>
              <span className="text-xl font-black text-emerald-600 mt-0.5">{correctAnswersCount} / 10</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Aproveitamento</span>
              <span className="text-xl font-black text-slate-800 mt-0.5">{Math.round((correctAnswersCount / 10) * 100)}%</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Melhor Streak</span>
              <span className="text-xl font-black text-amber-600 mt-0.5">{bestStreak} 🔥</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handleRestartRound}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jogar Nova Rodada</span>
            </button>
            <button
              onClick={() => {
                setGameMode('endless');
                setIsRoundFinished(false);
                drawNewQuestion();
              }}
              className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
            >
              Modo Infinito Livre
            </button>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-md flex flex-col gap-6"
          >
            {/* Question Meta Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-indigo-100 text-indigo-800">
                  {currentQuestion.hskLevel}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  • {currentQuestion.categoryName}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{currentQuestion.grammarRuleTitle}</span>
              </div>
            </div>

            {/* Target Meaning in Portuguese */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Tradução Alvo:
              </span>
              <h3 className="text-lg md:text-xl font-bold text-slate-800 leading-snug">
                "{currentQuestion.portuguese}"
              </h3>
            </div>

            {/* QUESTION TYPE 1: FILL IN THE BLANK (Preencher Lacuna) */}
            {currentQuestion.type === 'fill_blank' && (
              <div className="flex flex-col gap-6">
                {/* Sentence Banner with Blank Slot */}
                <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-200/80 flex flex-col items-center justify-center text-center gap-3">
                  <div className="flex flex-wrap items-center justify-center gap-2 text-2xl md:text-3xl font-extrabold text-slate-900 tracking-wide font-sans">
                    {currentQuestion.prefixHanzi && (
                      <span>{currentQuestion.prefixHanzi}</span>
                    )}

                    {/* The Interactive Blank Slot */}
                    <span
                      className={`inline-flex items-center justify-center px-4 py-1.5 rounded-xl border-2 transition-all min-w-[70px] ${
                        isAnswered
                          ? isCorrect
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                            : 'bg-rose-500 text-white border-rose-600 shadow-md'
                          : 'bg-white border-indigo-400 text-indigo-600 shadow-inner border-dashed animate-pulse'
                      }`}
                    >
                      {isAnswered ? (
                        currentQuestion.options?.find(o => o.id === selectedOptionId)?.hanzi || '?'
                      ) : (
                        <span className="text-sm font-bold text-indigo-400">?</span>
                      )}
                    </span>

                    {currentQuestion.suffixHanzi && (
                      <span>{currentQuestion.suffixHanzi}</span>
                    )}
                  </div>

                  {/* Pinyin reveal on answer */}
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm font-medium text-slate-600 mt-1"
                    >
                      <span className="font-mono text-indigo-700 font-bold">{currentQuestion.fullPinyin}</span>
                      <button
                        onClick={() => speakMandarin(currentQuestion.fullHanzi)}
                        className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors cursor-pointer"
                        title="Ouvir pronúncia"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Options Grid (4 Candidates) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQuestion.options?.map(option => {
                    const isSelected = selectedOptionId === option.id;
                    const isTheCorrectOption = option.isCorrect;

                    let buttonStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-indigo-300 hover:shadow-xs';

                    if (isAnswered) {
                      if (isSelected) {
                        buttonStyle = isCorrect
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-[101%]'
                          : 'bg-rose-500 text-white border-rose-600 shadow-md';
                      } else if (isTheCorrectOption) {
                        buttonStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-400/40';
                      } else {
                        buttonStyle = 'bg-slate-50 border-slate-100 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={option.id}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(option)}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${buttonStyle}`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="text-xl md:text-2xl font-bold font-sans">
                            {option.hanzi}
                          </span>
                          <div className="flex flex-col">
                            <span className="font-mono text-xs font-bold opacity-80">
                              {option.pinyin}
                            </span>
                            <span className="text-xs opacity-75 truncate max-w-[170px] sm:max-w-[210px]">
                              {option.translation}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 ml-2">
                          {isAnswered && isTheCorrectOption && (
                            <div className="p-1 rounded-full bg-emerald-600 text-white">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                          {isAnswered && isSelected && !isCorrect && (
                            <div className="p-1 rounded-full bg-rose-600 text-white">
                              <X className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* QUESTION TYPE 2: ORDER WORDS (Ordenar Palavras) */}
            {currentQuestion.type === 'order_words' && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    Toque nas palavras na ordem sintática correta do mandarim:
                  </span>
                  <button
                    onClick={handleResetOrder}
                    disabled={orderedTiles.length === 0}
                    className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 disabled:opacity-40 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Recomeçar</span>
                  </button>
                </div>

                {/* Construction Work Area / Slots */}
                <div className="p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 min-h-[90px] flex flex-wrap items-center gap-2">
                  {orderedTiles.length === 0 ? (
                    <span className="text-xs font-medium text-slate-400 italic">
                      Selecione os blocos abaixo para posicioná-los aqui...
                    </span>
                  ) : (
                    orderedTiles.map((tile, idx) => (
                      <motion.button
                        key={`${tile.id}-${idx}`}
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        onClick={() => handleRemoveTile(idx)}
                        disabled={isAnswered}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-indigo-200 text-slate-800 shadow-xs hover:border-red-300 hover:bg-red-50/30 transition-all cursor-pointer group"
                      >
                        <span className="font-bold text-base">{tile.hanzi}</span>
                        <span className="font-mono text-[10px] text-slate-400">{tile.label}</span>
                        {!isAnswered && (
                          <X className="w-3 h-3 text-slate-300 group-hover:text-red-500" />
                        )}
                      </motion.button>
                    ))
                  )}
                </div>

                {/* Scrambled Word Tile Bank */}
                <div className="flex flex-wrap gap-2.5 p-3 rounded-2xl bg-slate-100/70 border border-slate-200/80 min-h-[60px]">
                  {availableTiles.length === 0 && !isAnswered && (
                    <div className="w-full flex items-center justify-between text-xs text-indigo-700 font-bold px-2 py-1">
                      <span>Todos os blocos foram organizados!</span>
                      <button
                        onClick={handleVerifyOrder}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Validar Sequência</span>
                      </button>
                    </div>
                  )}

                  {availableTiles.map((tile, idx) => (
                    <motion.button
                      key={`${tile.id}-avail-${idx}`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddTile(tile, idx)}
                      disabled={isAnswered}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-slate-800 shadow-xs transition-all cursor-pointer"
                    >
                      <span className="font-bold text-base">{tile.hanzi}</span>
                      <span className="font-mono text-[10px] text-slate-400">{tile.label}</span>
                      <span className="text-[10px] text-slate-400">({tile.translation})</span>
                    </motion.button>
                  ))}
                </div>

                {/* Validation Button when tiles are placed */}
                {!isAnswered && availableTiles.length > 0 && orderedTiles.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleVerifyOrder}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verificar Ordem Atual</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* IMMEDIATE FEEDBACK SECTION */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border-2 flex flex-col gap-4 shadow-sm transition-all ${
                  isCorrect
                    ? 'bg-emerald-50/90 border-emerald-300 text-slate-800'
                    : 'bg-rose-50/90 border-rose-300 text-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <AlertCircle className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            isCorrect
                              ? 'bg-emerald-200 text-emerald-900'
                              : 'bg-rose-200 text-rose-900'
                          }`}
                        >
                          {isCorrect ? '✨ Ordem Correta!' : '⚠️ Erro de Ordem Gramatical'}
                        </span>
                        {isCorrect && (
                          <span className="text-xs font-bold text-emerald-800">
                            +10 pts {streak > 1 ? `• Bônus Streak 🔥` : ''}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-slate-900 mt-1">
                        {isCorrect
                          ? 'Excelente! Você aplicou a regra corretamente.'
                          : 'A frase não segue a ordem gramatical do mandarim.'}
                      </h4>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-lg text-slate-900 font-sans">
                          {currentQuestion.fullHanzi}
                        </span>
                        <span className="font-mono text-xs text-slate-600">
                          ({currentQuestion.fullPinyin})
                        </span>
                        <button
                          onClick={() => speakMandarin(currentQuestion.fullHanzi)}
                          className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-600 shadow-xs transition-colors cursor-pointer"
                          title="Ouvir frase completa"
                        >
                          <Volume2 className="w-4 h-4 text-indigo-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <span>Próxima</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Embedded Grammar Rule Explanation & Tip Balloon on Error */}
                {!isCorrect && (activeTip || orderErrorTip) && (
                  <div className="pt-2 border-t border-rose-200/80">
                    <GrammarTipBalloon
                      tip={activeTip || orderErrorTip!}
                      pointerPosition="top-left"
                    />
                  </div>
                )}

                {/* Didactic Grammar Rule summary when correct */}
                {isCorrect && (
                  <div className="pt-2 border-t border-emerald-200/80 flex items-start gap-2 text-xs text-emerald-900">
                    <BookOpen className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-800 block">
                        Nota Gramatical:
                      </span>
                      <p className="mt-0.5 leading-relaxed">
                        {currentQuestion.grammarExplanation}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Bottom Actions Ribbon */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
              <span className="italic">
                {isAnswered
                  ? 'Pressione Enter para continuar para a próxima pergunta'
                  : 'Selecione uma opção para obter validação instantânea'}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
