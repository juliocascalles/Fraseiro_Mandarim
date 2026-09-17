import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  MessageSquare, Volume2, Send, Sparkles, CheckCircle2, 
  Award, ArrowRight, RotateCcw, Lightbulb, Check, Eye, EyeOff, 
  ChevronRight, ChevronLeft, Plus, X, Search, BookOpen, Coffee,
  Briefcase, ShoppingBag, Utensils, Users, ArrowUpRight, HelpCircle,
  Clock, Flame, CornerDownLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Word, DialogueScenario, DialogueStep, DialogueMessage, PhraseValidationReport } from '../types';
import { DIALOGUE_SCENARIOS } from '../data/dialogueScenarios';
import { speakMandarin } from '../utils/speech';

interface DialogueModeProps {
  allWords: Word[];
  getAvailableWords: (sequence: Word[]) => Word[];
  checkIsValidSentence: (sequence: Word[]) => boolean;
  getNaturalTranslation: (sequence: Word[]) => string;
  validateAndBuildPhrase: (input: string) => PhraseValidationReport;
  onOpenDictionary?: () => void;
}

export const DialogueMode: React.FC<DialogueModeProps> = ({
  allWords,
  getAvailableWords,
  checkIsValidSentence,
  getNaturalTranslation,
  validateAndBuildPhrase,
  onOpenDictionary,
}) => {
  // Scenario selection
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('restaurant');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Current active scenario and step
  const currentScenario = useMemo(() => {
    return DIALOGUE_SCENARIOS.find(s => s.id === selectedScenarioId) || DIALOGUE_SCENARIOS[0];
  }, [selectedScenarioId]);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const currentStep: DialogueStep | undefined = currentScenario.steps[currentStepIndex];

  // Conversation history
  const [messages, setMessages] = useState<DialogueMessage[]>([]);
  
  // Input methods
  const [inputMode, setInputMode] = useState<'blocks' | 'typing'>('blocks');
  const [currentSequence, setCurrentSequence] = useState<Word[]>([]);
  const [typedInput, setTypedInput] = useState<string>('');
  
  // UI state
  const [showTranslations, setShowTranslations] = useState<boolean>(true);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isScenarioCompleted, setIsScenarioCompleted] = useState<boolean>(false);
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set());
  const [freeChatMode, setFreeChatMode] = useState<boolean>(false);
  const [searchWordQuery, setSearchWordQuery] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingInputRef = useRef<HTMLInputElement>(null);

  // Initialize conversation when scenario changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsScenarioCompleted(false);
    setCurrentSequence([]);
    setTypedInput('');
    setShowSuggestions(false);

    if (currentScenario.steps.length > 0) {
      const firstStep = currentScenario.steps[0];
      const initialMsg: DialogueMessage = {
        id: `char-start-${Date.now()}`,
        sender: 'character',
        characterName: firstStep.characterSpeakerName || `${currentScenario.character.name} (${currentScenario.character.hanziName})`,
        hanzi: firstStep.characterPromptHanzi,
        pinyin: firstStep.characterPromptPinyin,
        portuguese: firstStep.characterPromptPortuguese,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([initialMsg]);
    }
  }, [selectedScenarioId]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiLoading]);

  // Handle word block insertion
  const handleAddWord = (word: Word) => {
    setCurrentSequence(prev => [...prev, word]);
  };

  const handleRemoveLastWord = () => {
    setCurrentSequence(prev => prev.slice(0, -1));
  };

  const handleClearSequence = () => {
    setCurrentSequence([]);
  };

  // Assembled string from current word sequence
  const assembledHanzi = useMemo(() => {
    return currentSequence.map(w => w.hanzi).join('');
  }, [currentSequence]);

  const assembledPinyin = useMemo(() => {
    return currentSequence.map(w => w.label).join(' ');
  }, [currentSequence]);

  const assembledTranslation = useMemo(() => {
    if (currentSequence.length === 0) return '';
    return getNaturalTranslation(currentSequence);
  }, [currentSequence, getNaturalTranslation]);

  // Recommended words for the current step
  const stepRecommendedWords = useMemo(() => {
    if (!currentStep) return [];
    const ids = currentStep.recommendedWords;
    return allWords.filter(w => ids.includes(w.id) || ids.includes(w.label));
  }, [currentStep, allWords]);

  // Filtered extra words
  const filteredAllWords = useMemo(() => {
    if (!searchWordQuery) return allWords.slice(0, 24);
    const q = searchWordQuery.toLowerCase().trim();
    return allWords.filter(w => 
      w.label.toLowerCase().includes(q) ||
      w.hanzi.includes(q) ||
      w.translation.toLowerCase().includes(q)
    );
  }, [allWords, searchWordQuery]);

  // Send message
  const handleSendMessage = async (customHanzi?: string, customPinyin?: string, customPt?: string) => {
    let finalHanzi = '';
    let finalPinyin = '';
    let finalPt = '';

    if (customHanzi) {
      finalHanzi = customHanzi;
      finalPinyin = customPinyin || '';
      finalPt = customPt || '';
    } else if (inputMode === 'blocks') {
      if (currentSequence.length === 0) return;
      finalHanzi = assembledHanzi;
      finalPinyin = assembledPinyin;
      finalPt = assembledTranslation;
    } else {
      if (!typedInput.trim()) return;
      // Validate typed input
      const rep = validateAndBuildPhrase(typedInput);
      if (rep.validWords.length > 0) {
        finalHanzi = rep.validWords.map(w => w.hanzi).join('');
        finalPinyin = rep.validWords.map(w => w.label).join(' ');
        finalPt = getNaturalTranslation(rep.validWords);
      } else {
        finalHanzi = typedInput.trim();
        finalPinyin = typedInput.trim();
        finalPt = 'Frase digitada pelo estudante';
      }
    }

    if (!finalHanzi) return;

    // Speak user phrase briefly
    speakMandarin(finalHanzi);

    // Create user message
    const userMsg: DialogueMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      hanzi: finalHanzi,
      pinyin: finalPinyin,
      portuguese: finalPt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setCurrentSequence([]);
    setTypedInput('');
    setShowSuggestions(false);
    setIsAiLoading(true);

    // Evaluate response and trigger interlocutor
    try {
      // Call /api/dialogue
      const response = await fetch('/api/dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle: currentScenario.title,
          characterName: currentStep?.characterSpeakerName || currentScenario.character.name,
          characterRole: currentScenario.character.role,
          history: newHistory.slice(-4).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            hanzi: m.hanzi,
            pinyin: m.pinyin,
            portuguese: m.portuguese
          })),
          userMessageHanzi: finalHanzi,
          userMessagePinyin: finalPinyin,
          stepGoal: currentStep?.promptGoal || 'Continuar conversa'
        })
      });

      const data = await response.json();

      let replyHanzi = '';
      let replyPinyin = '';
      let replyPt = '';
      let feedbackComment = data?.feedback || 'Muito bem! Resposta natural.';

      if (data && data.replyHanzi && data.provider === 'gemini') {
        replyHanzi = data.replyHanzi;
        replyPinyin = data.replyPinyin;
        replyPt = data.replyPortuguese;
      } else if (currentStep) {
        // Use curated scenario reply
        replyHanzi = currentStep.characterSuccessReplyHanzi;
        replyPinyin = currentStep.characterSuccessReplyPinyin;
        replyPt = currentStep.characterSuccessReplyPortuguese;
      } else {
        replyHanzi = '好啊！你的汉语越来越好了，我们继续！';
        replyPinyin = 'Hǎo a! Nǐ de hànyǔ yuè lái yuè hǎo le, wǒmen jìxù!';
        replyPt = 'Legal! Seu chinês está cada vez melhor, vamos continuar!';
      }

      // Attach feedback to user message
      userMsg.feedback = {
        isSuccess: true,
        comment: feedbackComment,
      };

      // Speak reply automatically
      setTimeout(() => {
        speakMandarin(replyHanzi);
      }, 300);

      // Create character response message
      const charMsg: DialogueMessage = {
        id: `char-${Date.now()}`,
        sender: 'character',
        characterName: currentStep?.characterSpeakerName || `${currentScenario.character.name} (${currentScenario.character.hanziName})`,
        hanzi: replyHanzi,
        pinyin: replyPinyin,
        portuguese: replyPt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Check next step
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < currentScenario.steps.length) {
        // Next step available
        setCurrentStepIndex(nextIndex);
        const nextStep = currentScenario.steps[nextIndex];
        
        // Push character reply, followed shortly by the next step's opening prompt if distinct
        setMessages(prev => [...prev, charMsg]);

        // If next step has a prompt from another character or continues, add it after a short delay
        setTimeout(() => {
          const nextPromptMsg: DialogueMessage = {
            id: `char-prompt-${Date.now()}`,
            sender: 'character',
            characterName: nextStep.characterSpeakerName || `${currentScenario.character.name} (${currentScenario.character.hanziName})`,
            hanzi: nextStep.characterPromptHanzi,
            pinyin: nextStep.characterPromptPinyin,
            portuguese: nextStep.characterPromptPortuguese,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages(prev => [...prev, nextPromptMsg]);
          speakMandarin(nextStep.characterPromptHanzi);
        }, 1200);

      } else {
        // Scenario completed!
        setMessages(prev => [...prev, charMsg]);
        setIsScenarioCompleted(true);
        setCompletedScenarios(prev => new Set(prev).add(currentScenario.id));
      }

    } catch (err) {
      console.error('Dialogue error:', err);
      // Fallback offline flow
      if (currentStep) {
        const charMsg: DialogueMessage = {
          id: `char-fallback-${Date.now()}`,
          sender: 'character',
          characterName: currentStep.characterSpeakerName || currentScenario.character.name,
          hanzi: currentStep.characterSuccessReplyHanzi,
          pinyin: currentStep.characterSuccessReplyPinyin,
          portuguese: currentStep.characterSuccessReplyPortuguese,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, charMsg]);
        speakMandarin(currentStep.characterSuccessReplyHanzi);

        const nextIndex = currentStepIndex + 1;
        if (nextIndex < currentScenario.steps.length) {
          setCurrentStepIndex(nextIndex);
          const nextStep = currentScenario.steps[nextIndex];
          setTimeout(() => {
            const nextPromptMsg: DialogueMessage = {
              id: `char-prompt-fb-${Date.now()}`,
              sender: 'character',
              characterName: nextStep.characterSpeakerName || currentScenario.character.name,
              hanzi: nextStep.characterPromptHanzi,
              pinyin: nextStep.characterPromptPinyin,
              portuguese: nextStep.characterPromptPortuguese,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, nextPromptMsg]);
            speakMandarin(nextStep.characterPromptHanzi);
          }, 1200);
        } else {
          setIsScenarioCompleted(true);
          setCompletedScenarios(prev => new Set(prev).add(currentScenario.id));
        }
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  // Restart current scenario
  const handleRestartScenario = () => {
    setCurrentStepIndex(0);
    setIsScenarioCompleted(false);
    setCurrentSequence([]);
    setTypedInput('');
    setShowSuggestions(false);
    if (currentScenario.steps.length > 0) {
      const firstStep = currentScenario.steps[0];
      const initialMsg: DialogueMessage = {
        id: `char-start-${Date.now()}`,
        sender: 'character',
        characterName: firstStep.characterSpeakerName || `${currentScenario.character.name} (${currentScenario.character.hanziName})`,
        hanzi: firstStep.characterPromptHanzi,
        pinyin: firstStep.characterPromptPinyin,
        portuguese: firstStep.characterPromptPortuguese,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([initialMsg]);
      speakMandarin(firstStep.characterPromptHanzi);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Top Header & Scenario Selection */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-1">
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs uppercase tracking-wider font-bold">Modo Diálogo Interativo</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
              Simulador de Conversação em Mandarim
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Interaja com interlocutores nativos em situações cotidianas reais: convidar amigos para restaurantes, interagir com garçons, fazer compras ou encarar entrevistas de emprego em empresas chinesas.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowTranslations(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                showTranslations 
                  ? 'bg-slate-100 border-slate-300 text-slate-700' 
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700'
              }`}
              title={showTranslations ? 'Ocultar traduções para imersão' : 'Exibir traduções em português'}
            >
              {showTranslations ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showTranslations ? 'Ocultar Tradução' : 'Mostrar Tradução'}</span>
            </button>

            <button
              type="button"
              onClick={handleRestartScenario}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer shadow-xs"
              title="Reiniciar este diálogo do começo"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>
        </div>

        {/* Scenario Carousel / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {DIALOGUE_SCENARIOS.map((scenario) => {
            const isSelected = scenario.id === selectedScenarioId;
            const isCompleted = completedScenarios.has(scenario.id);

            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setSelectedScenarioId(scenario.id)}
                className={`relative flex flex-col p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {isCompleted && (
                  <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 rounded-full p-1 shadow-xs" title="Cenário Concluído!">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-2xl">{scenario.iconEmoji}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{scenario.difficulty}</span>
                    <h3 className={`font-bold text-sm ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                      {scenario.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  {scenario.subtitle}
                </p>

                <div className="mt-auto flex items-center justify-between text-[11px] font-medium pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="text-sm">{scenario.character.avatarEmoji}</span>
                    <span>{scenario.character.name}</span>
                  </div>
                  <span className="text-slate-400">{scenario.steps.length} etapas</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dialogue Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Chat Stream & Interactive Stage */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Active Stage & Mission Info Banner */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shrink-0">
                {currentScenario.iconEmoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    {currentScenario.title}
                  </span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                    Etapa {Math.min(currentStepIndex + 1, currentScenario.steps.length)} de {currentScenario.steps.length}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800">
                  {currentStep?.title || 'Conversa Livre Concluída'}
                </h4>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="hidden sm:flex items-center gap-1.5">
              {currentScenario.steps.map((st, i) => (
                <div
                  key={st.id}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i < currentStepIndex 
                      ? 'bg-emerald-500' 
                      : i === currentStepIndex 
                        ? 'bg-indigo-600 ring-2 ring-indigo-200 scale-125' 
                        : 'bg-slate-200'
                  }`}
                  title={`Etapa ${i + 1}: ${st.title}`}
                />
              ))}
            </div>
          </div>

          {/* Current Step Objective Card */}
          {currentStep && !isScenarioCompleted && (
            <motion.div
              layout
              className="bg-linear-to-r from-amber-50 to-orange-50/70 border border-amber-200/80 rounded-2xl p-4 shadow-xs flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Sua Missão nesta Etapa:</span>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowSuggestions(prev => !prev)}
                  className="flex items-center gap-1 text-xs text-amber-800 hover:text-amber-950 font-bold bg-amber-100/70 hover:bg-amber-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>{showSuggestions ? 'Ocultar Dicas' : 'Ver Dicas de Resposta'}</span>
                </button>
              </div>

              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {currentStep.promptGoal}
              </p>

              {/* Suggestions Accordion */}
              <AnimatePresence>
                {showSuggestions && currentStep.suggestedAnswers && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden flex flex-col gap-2 pt-2 border-t border-amber-200/60 mt-1"
                  >
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                      Respostas Modelo e Expressões Naturais:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {currentStep.suggestedAnswers.map((sug, sIdx) => (
                        <div 
                          key={sIdx}
                          className="bg-white/90 border border-amber-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs"
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-slate-900">{sug.hanzi}</span>
                              <button
                                type="button"
                                onClick={() => speakMandarin(sug.hanzi)}
                                className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                                title="Ouvir pronúncia"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-xs text-indigo-700 font-semibold">{sug.pinyin}</span>
                            <span className="text-xs text-slate-600">{sug.portuguese}</span>
                            {sug.explanation && (
                              <span className="text-[11px] text-amber-700 mt-0.5">💡 {sug.explanation}</span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSendMessage(sug.hanzi, sug.pinyin, sug.portuguese)}
                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                          >
                            <span>Usar esta fala</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Chat Messages Log */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4 min-h-[380px] max-h-[480px] overflow-y-auto">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-lg shrink-0 shadow-xs ${
                    isUser ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {isUser ? '👤' : currentScenario.character.avatarEmoji}
                  </div>

                  {/* Bubble Content */}
                  <div className={`flex flex-col gap-1 rounded-2xl p-4 shadow-xs ${
                    isUser 
                      ? 'bg-indigo-600 text-white rounded-tr-xs' 
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs'
                  }`}>
                    <div className="flex items-center justify-between gap-3 text-[11px] opacity-80 mb-0.5">
                      <span className="font-bold">
                        {isUser ? 'Você' : (msg.characterName || currentScenario.character.name)}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Hanzi */}
                    <div className="flex items-baseline justify-between gap-3">
                      <span className={`text-xl font-bold tracking-wide ${isUser ? 'text-white' : 'text-slate-900'}`}>
                        {msg.hanzi}
                      </span>
                      <button
                        type="button"
                        onClick={() => speakMandarin(msg.hanzi)}
                        className={`p-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                          isUser ? 'text-indigo-200 hover:text-white' : 'text-slate-400 hover:text-indigo-600'
                        }`}
                        title="Ouvir fala"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Pinyin */}
                    <span className={`text-xs font-semibold ${isUser ? 'text-indigo-100' : 'text-indigo-700'}`}>
                      {msg.pinyin}
                    </span>

                    {/* Portuguese Translation */}
                    {showTranslations && (
                      <p className={`text-xs mt-1 pt-1.5 border-t leading-relaxed ${
                        isUser 
                          ? 'border-indigo-500/60 text-indigo-100' 
                          : 'border-slate-200/80 text-slate-600'
                      }`}>
                        {msg.portuguese}
                      </p>
                    )}

                    {/* Sutil Feedback tag for user answers */}
                    {msg.feedback && (
                      <div className="mt-2 pt-2 border-t border-indigo-500/40 flex items-start gap-1.5 text-[11px] text-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />
                        <span>{msg.feedback.comment}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {isAiLoading && (
              <div className="flex items-center gap-3 mr-auto max-w-[85%]">
                <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-lg border border-slate-200 shadow-xs">
                  {currentScenario.character.avatarEmoji}
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-xs p-4 flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>{currentScenario.character.name} está respondendo...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Scenario Completed Celebration Banner */}
          {isScenarioCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-sm shrink-0">
                  <Award className="w-8 h-8 text-emerald-100" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-950">
                    Parabéns! Você concluiu este Diálogo!
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Você praticou todas as {currentScenario.steps.length} etapas de conversação em "{currentScenario.title}".
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleRestartScenario}
                  className="px-4 py-2.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Repetir Cenário
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = DIALOGUE_SCENARIOS.findIndex(s => s.id === selectedScenarioId);
                    const nextScenario = DIALOGUE_SCENARIOS[(currentIndex + 1) % DIALOGUE_SCENARIOS.length];
                    setSelectedScenarioId(nextScenario.id);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  <span>Próximo Cenário</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Input Control Deck */}
          {!isScenarioCompleted && (
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
              {/* Input Mode Toggle (Blocos vs Digitação) */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInputMode('blocks')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      inputMode === 'blocks'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Blocos de Palavras
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputMode('typing');
                      setTimeout(() => typingInputRef.current?.focus(), 50);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      inputMode === 'typing'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Digitação Direta (Pinyin / Hanzi)
                  </button>
                </div>

                <span className="text-[11px] text-slate-400 font-medium">
                  {inputMode === 'blocks' ? 'Clique nas palavras para compor sua fala' : 'Digite a frase em pinyin ou caracteres'}
                </span>
              </div>

              {/* Mode A: Word Blocks Composition Area */}
              {inputMode === 'blocks' ? (
                <div className="flex flex-col gap-3">
                  {/* Current Sequence Ribbon */}
                  <div className="min-h-[58px] p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                    {currentSequence.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">
                        Selecione as palavras abaixo para montar sua frase de resposta...
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-2 items-center">
                        {currentSequence.map((w, idx) => (
                          <div
                            key={`${w.id}-${idx}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-800"
                          >
                            <span className="text-indigo-600">{w.label}</span>
                            <span>{w.hanzi}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentSequence(prev => prev.filter((_, i) => i !== idx));
                              }}
                              className="text-slate-400 hover:text-rose-600 transition-colors ml-0.5 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {currentSequence.length > 0 && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={handleRemoveLastWord}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
                          title="Apagar última palavra"
                        >
                          <CornerDownLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleClearSequence}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Limpar frase"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Realtime Sentence Preview */}
                  {currentSequence.length > 0 && (
                    <div className="flex flex-col gap-1 px-1 text-xs">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-slate-900">{assembledHanzi}</span>
                        <span className="text-indigo-700 font-semibold">{assembledPinyin}</span>
                      </div>
                      <span className="text-slate-500 italic">{assembledTranslation}</span>
                    </div>
                  )}

                  {/* Recommended Vocabulary Chips */}
                  {stepRecommendedWords.length > 0 && (
                    <div className="flex flex-col gap-1.5 pt-1">
                      <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                        Vocabulário Recomendado para esta Etapa:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {stepRecommendedWords.map((word) => (
                          <button
                            key={word.id}
                            type="button"
                            onClick={() => handleAddWord(word)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/80 text-slate-800 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                          >
                            <span className="font-bold">{word.hanzi}</span>
                            <span className="text-indigo-600 font-mono text-[11px]">{word.label}</span>
                            <span className="text-slate-500 text-[10px]">({word.translation})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick word palette search */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={searchWordQuery}
                      onChange={(e) => setSearchWordQuery(e.target.value)}
                      placeholder="Buscar mais palavras por pinyin ou português..."
                      className="w-full text-xs text-slate-700 bg-transparent outline-none placeholder:text-slate-400"
                    />
                    {searchWordQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchWordQuery('')}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* More Words Chips */}
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pt-1">
                    {filteredAllWords.map((word) => (
                      <button
                        key={word.id}
                        type="button"
                        onClick={() => handleAddWord(word)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs transition-colors cursor-pointer"
                        title={word.translation}
                      >
                        <span className="font-bold">{word.hanzi}</span>
                        <span className="text-[10px] text-slate-500">{word.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Mode B: Direct Typing Area */
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <input
                      ref={typingInputRef}
                      type="text"
                      value={typedInput}
                      onChange={(e) => setTypedInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isAiLoading && typedInput.trim()) {
                          handleSendMessage();
                        }
                      }}
                      placeholder="Ex: wo xiang he cha / 我想喝茶"
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm font-medium text-slate-800 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Dica: Você pode digitar em Pinyin sem tons (ex: <code>wo xiang he cha</code>) ou diretamente em caracteres chineses.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  {inputMode === 'blocks' ? `${currentSequence.length} palavras na frase` : 'Pressione Enter ou clique em Enviar'}
                </span>

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={isAiLoading || (inputMode === 'blocks' ? currentSequence.length === 0 : !typedInput.trim())}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Resposta ao Interlocutor</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Col: Character Profile & Scenario Details */}
        <div className="flex flex-col gap-4">
          
          {/* Character Bio Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Seu Interlocutor</span>
            </div>

            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl shrink-0 shadow-xs">
                {currentScenario.character.avatarEmoji}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-base text-slate-900">{currentScenario.character.name}</h3>
                  <span className="text-xs font-semibold text-slate-500 font-mono">({currentScenario.character.hanziName})</span>
                </div>
                <span className="text-xs font-semibold text-indigo-600">{currentScenario.character.role}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {currentScenario.character.description}
            </p>

            {currentScenario.secondaryCharacter && (
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                  {currentScenario.secondaryCharacter.avatarEmoji}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">
                    {currentScenario.secondaryCharacter.name} ({currentScenario.secondaryCharacter.hanziName})
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {currentScenario.secondaryCharacter.role}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Scenario Stages Checklist */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between text-slate-700 font-bold text-xs uppercase tracking-wider">
              <span>Etapas do Diálogo</span>
              <span className="text-indigo-600">
                {completedScenarios.has(currentScenario.id) ? '100%' : `${Math.round((currentStepIndex / currentScenario.steps.length) * 100)}%`}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {currentScenario.steps.map((st, idx) => {
                const isPast = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex && !isScenarioCompleted;

                return (
                  <div
                    key={st.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs transition-all ${
                      isPast 
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-700' 
                        : isCurrent 
                          ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 font-semibold shadow-xs' 
                          : 'bg-slate-50/40 border-slate-200/60 text-slate-400'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isPast ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : isCurrent ? (
                        <div className="w-3.5 h-3.5 rounded-full bg-indigo-600 flex items-center justify-center text-[9px] text-white font-bold">
                          {idx + 1}
                        </div>
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[9px] text-slate-400">
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="font-medium">{st.title}</span>
                      {isCurrent && (
                        <span className="text-[11px] text-indigo-700 font-normal mt-0.5">
                          {st.promptGoal}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Audio & Dictionary Helper */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col gap-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Dicas de Prática Oral</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Use o botão de alto-falante <Volume2 className="w-3.5 h-3.5 inline text-indigo-600" /> para ouvir a pronúncia natural com tons de cada frase. Repita em voz alta para treinar seu ritmo de fala!
            </p>
            {onOpenDictionary && (
              <button
                type="button"
                onClick={onOpenDictionary}
                className="mt-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-indigo-700 font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                <span>Consultar Dicionário Completo HSK</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
