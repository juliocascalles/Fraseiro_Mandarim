import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  ChevronRight, 
  Trash2, 
  Award, 
  Play, 
  Pause, 
  HelpCircle,
  Clock,
  Flame,
  ArrowRight,
  Info,
  RefreshCw,
  Zap,
  Ear
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Word } from '../types';
import { speakMandarin } from '../utils/speech';
import { 
  getRecordedMistakes, 
  getTopProblemWords, 
  recordWordPronunciationOutcome, 
  resetWordMistake, 
  clearAllMistakes, 
  getAdaptiveDrillSentence, 
  evaluateSpokenProximity,
  DRILL_SENTENCES,
  PronunciationDrillSentence,
  ProblemWordRecord,
  WordPronunciationEvaluation
} from '../utils/pronunciationStorage';

interface PronunciationModeProps {
  allWords?: Word[];
  builderSequence?: Word[];
}

export const PronunciationMode: React.FC<PronunciationModeProps> = ({
  allWords = [],
  builderSequence = []
}) => {
  // Current active drill sentence
  const [currentSentence, setCurrentSentence] = useState<PronunciationDrillSentence>(() => {
    return getAdaptiveDrillSentence().sentence;
  });
  const [focusedProblemWord, setFocusedProblemWord] = useState<ProblemWordRecord | undefined>(() => {
    return getAdaptiveDrillSentence().prioritizedWord;
  });

  // Recorded mistakes from localStorage
  const [mistakesList, setMistakesList] = useState<ProblemWordRecord[]>([]);

  // Audio recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Analysis result
  const [evaluationResult, setEvaluationResult] = useState<{
    transcript: string;
    pinyin: string;
    portuguese: string;
    accuracyScore: number;
    feedback: string;
    wordsEvaluation: WordPronunciationEvaluation[];
    failedWordIds: string[];
    passedWordIds: string[];
    provider: 'gemini' | 'browser_fallback';
  } | null>(null);

  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [activeTabSubMode, setActiveTabSubMode] = useState<'adaptive' | 'custom' | 'history'>('adaptive');
  const [selectedWordDetail, setSelectedWordDetail] = useState<WordPronunciationEvaluation | null>(null);

  // Audio refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recordedAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const browserTranscriptRef = useRef<string>('');

  // Load mistakes from localStorage on mount and when updated
  const refreshMistakes = () => {
    const list = getTopProblemWords(20);
    setMistakesList(list);
  };

  useEffect(() => {
    refreshMistakes();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Show transient notifications
  const triggerNotification = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // Next drill prioritizing mistakes
  const handleNextDrill = () => {
    setEvaluationResult(null);
    setRecordedAudioUrl(null);
    setSelectedWordDetail(null);
    const { sentence, prioritizedWord } = getAdaptiveDrillSentence(currentSentence.id);
    setCurrentSentence(sentence);
    setFocusedProblemWord(prioritizedWord);
  };

  // Load custom phrase from builder sequence if available
  const handleLoadBuilderPhrase = () => {
    if (!builderSequence || builderSequence.length === 0) {
      triggerNotification('O construtor está vazio. Adicione palavras no construtor para usá-las aqui!');
      return;
    }

    const hanzi = builderSequence.map(w => w.hanzi).join('');
    const pinyin = builderSequence.map(w => w.label).join(' ');
    const portuguese = builderSequence.map(w => w.translation).join(' ');

    const customSentence: PronunciationDrillSentence = {
      id: `custom-${Date.now()}`,
      hanzi,
      pinyin,
      portuguese,
      words: builderSequence.map(w => ({
        id: w.id,
        hanzi: w.hanzi,
        pinyin: w.label,
        translation: w.translation
      })),
      targetWordIds: builderSequence.map(w => w.id),
      level: 'Intermediário',
      toneFocusTip: 'Frase construída por você! Pratique a fluidez e a melodia entre os ideogramas.'
    };

    setCurrentSentence(customSentence);
    setFocusedProblemWord(undefined);
    setEvaluationResult(null);
    setRecordedAudioUrl(null);
    setActiveTabSubMode('adaptive');
    triggerNotification('Frase do construtor carregada para treino de pronúncia!');
  };

  // Play model native audio
  const handleSpeakModel = (rate = 0.85) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentSentence.hanzi);
      utterance.lang = 'zh-CN';
      utterance.rate = rate;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find(
        v => v.lang.toLowerCase().startsWith('zh') || 
             v.lang.toLowerCase().includes('cmn') || 
             v.name.toLowerCase().includes('chinese') ||
             v.name.toLowerCase().includes('mandarin')
      );
      if (zhVoice) utterance.voice = zhVoice;
      window.speechSynthesis.speak(utterance);
    } else {
      speakMandarin(currentSentence.hanzi);
    }
  };

  // Toggle play recorded user audio
  const handleTogglePlayRecorded = () => {
    if (!recordedAudioUrl) return;

    if (!recordedAudioElementRef.current) {
      recordedAudioElementRef.current = new Audio(recordedAudioUrl);
      recordedAudioElementRef.current.onended = () => setIsPlayingRecorded(false);
    } else {
      recordedAudioElementRef.current.src = recordedAudioUrl;
    }

    if (isPlayingRecorded) {
      recordedAudioElementRef.current.pause();
      setIsPlayingRecorded(false);
    } else {
      recordedAudioElementRef.current.play().then(() => {
        setIsPlayingRecorded(true);
      }).catch(err => {
        console.warn('Erro ao reproduzir gravação:', err);
        setIsPlayingRecorded(false);
      });
    }
  };

  // Start microphone recording
  const startRecording = async () => {
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      setEvaluationResult(null);
      setRecordedAudioUrl(null);
      browserTranscriptRef.current = '';
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // Setup audio level visualizer
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (!isRecording && !mediaRecorderRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            requestAnimationFrame(updateLevel);
          }
        };
        requestAnimationFrame(updateLevel);
      } catch (e) {
        console.warn('AudioContext visualizer unsupported:', e);
      }

      // Try browser Web Speech API in parallel as high-speed speech-to-text
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = 'zh-CN';
          recognition.interimResults = true;
          recognition.continuous = true;
          recognition.onresult = (event: any) => {
            let finalStr = '';
            for (let i = 0; i < event.results.length; i++) {
              finalStr += event.results[i][0].transcript;
            }
            browserTranscriptRef.current = finalStr;
          };
          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (recErr) {
          console.warn('SpeechRecognition browser initialization error:', recErr);
        }
      }

      // MediaRecorder for capturing audio blob
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        } else {
          mimeType = '';
        }
      }

      const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all stream audio tracks
        stream.getTracks().forEach(track => track.stop());
        if (speechRecognitionRef.current) {
          try { speechRecognitionRef.current.stop(); } catch (_) {}
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(() => {});
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        const localUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(localUrl);

        // Process audio with GenAI API / Speech-to-Text
        await processRecordedAudio(audioBlob, mimeType || 'audio/webm');
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(s => {
          if (s >= 15) {
            stopRecording();
            return 15;
          }
          return s + 1;
        });
      }, 1000);

    } catch (err: any) {
      console.error('Erro ao acessar microfone:', err);
      setIsRecording(false);
      triggerNotification('Permissão de microfone negada ou indisponível no navegador.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (!isRecording && !mediaRecorderRef.current) return;
    setIsRecording(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  // Convert blob to Base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Send audio to Gemini API / fallback evaluator and update localStorage
  const processRecordedAudio = async (blob: Blob, mimeType: string) => {
    setIsAnalyzing(true);

    try {
      const base64Audio = await blobToBase64(blob);

      // Call our enhanced /api/transcribe-audio endpoint
      const response = await fetch('/api/transcribe-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64Audio,
          mimeType,
          targetPhrase: currentSentence.hanzi,
          targetWords: currentSentence.words
        })
      });

      if (response.ok) {
        const data = await response.json();

        // If Gemini returned word evaluation, use it; otherwise augment
        const rawWordsEval: WordPronunciationEvaluation[] = Array.isArray(data.wordsEvaluation) && data.wordsEvaluation.length > 0
          ? data.wordsEvaluation
          : currentSentence.words.map(w => {
              const cleanTranscript = (data.transcript || '').replace(/[\s\p{P}]/gu, '');
              const isFound = cleanTranscript.includes(w.hanzi);
              return {
                wordId: w.id,
                hanzi: w.hanzi,
                pinyin: w.pinyin,
                spokenPinyin: isFound ? w.pinyin : undefined,
                isCorrect: isFound,
                errorType: isFound ? 'none' : 'phoneme',
                tip: isFound ? 'Bem articulado!' : `A palavra ${w.hanzi} (${w.pinyin}) não foi percebida com nitidez.`
              };
            });

        // Track errors and update localStorage
        const failedIds: string[] = [];
        const passedIds: string[] = [];

        for (const item of rawWordsEval) {
          const matchingWord = currentSentence.words.find(w => w.hanzi === item.hanzi || w.id === item.wordId);
          if (matchingWord) {
            if (item.isCorrect) {
              passedIds.push(matchingWord.id);
              recordWordPronunciationOutcome(matchingWord, true, undefined, currentSentence.hanzi);
            } else {
              failedIds.push(matchingWord.id);
              recordWordPronunciationOutcome(
                matchingWord, 
                false, 
                item.tip || `Dificuldade detectada em ${item.hanzi} (${item.pinyin})`,
                currentSentence.hanzi
              );
            }
          }
        }

        refreshMistakes();

        setEvaluationResult({
          transcript: data.transcript || browserTranscriptRef.current || 'Transcrição não gerada',
          pinyin: data.pinyin || '',
          portuguese: data.portuguese || '',
          accuracyScore: typeof data.accuracyScore === 'number' ? data.accuracyScore : 85,
          feedback: data.feedback || 'Pronúncia analisada!',
          wordsEvaluation: rawWordsEval,
          failedWordIds: failedIds,
          passedWordIds: passedIds,
          provider: 'gemini'
        });

        // Notification for successes or failures
        if (data.accuracyScore >= 90) {
          triggerNotification('🎉 Excelente! Pronúncia muito próxima do padrão nativo!');
        } else if (failedIds.length > 0) {
          triggerNotification(`⚠️ Registramos ${failedIds.length} palavra(s) no seu histórico para reforço.`);
        }

      } else {
        throw new Error(`Servidor retornou status ${response.status}`);
      }

    } catch (apiErr: any) {
      console.warn('Falha no reconhecimento Gemini, aplicando avaliador em navegador:', apiErr);

      // Client-side fallback using browser transcription or acoustic approximation
      const spoken = browserTranscriptRef.current || '';
      const fallbackEval = evaluateSpokenProximity(currentSentence.hanzi, currentSentence.pinyin, spoken);

      const mappedWordsEval: WordPronunciationEvaluation[] = currentSentence.words.map(w => {
        const isMatched = spoken.includes(w.hanzi);
        return {
          wordId: w.id,
          hanzi: w.hanzi,
          pinyin: w.pinyin,
          isCorrect: isMatched,
          errorType: isMatched ? 'none' : 'phoneme',
          tip: isMatched ? 'Pronunciado com clareza' : `Atenção ao som de ${w.hanzi} (${w.pinyin})`
        };
      });

      const failedIds: string[] = [];
      const passedIds: string[] = [];

      for (const w of currentSentence.words) {
        const isMatch = spoken.includes(w.hanzi);
        if (isMatch) {
          passedIds.push(w.id);
          recordWordPronunciationOutcome(w, true, undefined, currentSentence.hanzi);
        } else {
          failedIds.push(w.id);
          recordWordPronunciationOutcome(w, false, `Falha de reconhecimento em ${w.hanzi}`, currentSentence.hanzi);
        }
      }

      refreshMistakes();

      setEvaluationResult({
        transcript: spoken || '(Áudio captado sem correspondência clara)',
        pinyin: '',
        portuguese: '',
        accuracyScore: fallbackEval.similarityScore || 65,
        feedback: fallbackEval.feedback,
        wordsEvaluation: mappedWordsEval,
        failedWordIds: failedIds,
        passedWordIds: passedIds,
        provider: 'browser_fallback'
      });

      triggerNotification('Avaliação realizada com sucesso via reconhecimento local.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Check if a word in the sentence is a known problem word for the user
  const sentenceProblemWords = useMemo(() => {
    const recorded = getRecordedMistakes();
    return currentSentence.words
      .filter(w => recorded[w.id] && recorded[w.id].failCount > 0)
      .map(w => recorded[w.id]);
  }, [currentSentence, mistakesList]);

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 pb-28">
      {/* Toast Notification */}
      <AnimatePresence>
        {notificationToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 max-w-md text-xs sm:text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{notificationToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-rose-900 via-rose-800 to-indigo-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden border border-rose-700/50">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/30 text-rose-200 border border-rose-400/30 flex items-center gap-1.5">
                <Mic className="w-3 h-3 text-rose-300" />
                Modo Pronúncia & Voz
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30">
                GenAI Speech-to-Text • v1.2026.11.05
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
              <span>Treino de Pronúncia & Tons</span>
              <span className="font-serif text-rose-300 font-normal text-lg sm:text-2xl">
                (发音训练)
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 max-w-2xl leading-relaxed">
              Fale pelo microfone, receba avaliação imediata de proximidade com IA do Gemini, identifique desvios de tom e pratique frases adaptadas às suas palavras mais erradas.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 shrink-0">
            <div className="text-center px-2 border-r border-white/20">
              <div className="text-base sm:text-lg font-black text-amber-300">
                {mistakesList.length}
              </div>
              <div className="text-[10px] text-rose-100 font-medium">
                Erros Registrados
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTabSubMode(activeTabSubMode === 'history' ? 'adaptive' : 'history')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-rose-950 hover:bg-rose-50 transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
              <span>{activeTabSubMode === 'history' ? 'Voltar ao Treino' : 'Ver Dificuldades'}</span>
            </button>
          </div>
        </div>

        {/* Sub-modes selector */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/10 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTabSubMode('adaptive')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTabSubMode === 'adaptive'
                ? 'bg-white text-rose-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Treino Adaptativo (Foco em Erros)</span>
            {mistakesList.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={handleLoadBuilderPhrase}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTabSubMode === 'custom'
                ? 'bg-white text-rose-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="Usar frase montada atualmente no construtor de frases"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Praticar Minha Frase do Construtor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSubMode('history')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTabSubMode === 'history'
                ? 'bg-white text-rose-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
            <span>Histórico de Falhas no localStorage ({mistakesList.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTabSubMode === 'history' ? (
        /* History & Mistakes View */
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-md border border-slate-200 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Palavras Críticas e Dificuldades do Usuário</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dados salvos localmente no seu navegador (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">localStorage: fraseiro_pronunciation_mistakes_v1</code>).
              </p>
            </div>

            {mistakesList.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Deseja realmente limpar todo o histórico de pronúncias problemáticas?')) {
                    clearAllMistakes();
                    refreshMistakes();
                    triggerNotification('Histórico de falhas limpo com sucesso.');
                  }
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar Histórico</span>
              </button>
            )}
          </div>

          {mistakesList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500/60" />
              <div className="text-sm font-bold text-slate-700">
                Nenhuma palavra problemática registrada ainda!
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                À medida que você realiza os exercícios com o microfone, as palavras com falhas de tom ou fonética serão salvas aqui e ganharão prioridade nos próximos treinos.
              </p>
              <button
                type="button"
                onClick={() => setActiveTabSubMode('adaptive')}
                className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 cursor-pointer shadow-sm"
              >
                Iniciar Primeiro Treino
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {mistakesList.map((item) => (
                <div
                  key={item.wordId}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl font-black font-serif text-slate-900">
                        {item.hanzi}
                      </span>
                      <div>
                        <div className="text-xs font-extrabold text-indigo-700">
                          {item.pinyin}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {item.portuguese}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200">
                        {item.failCount} falha{item.failCount > 1 ? 's' : ''}
                      </span>
                      {item.successCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          {item.successCount} acerto{item.successCount > 1 ? 's' : ''}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          resetWordMistake(item.wordId);
                          refreshMistakes();
                          triggerNotification(`Dificuldade de [${item.hanzi}] resetada.`);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remover esta palavra do histórico"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {item.lastErrorReason && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200/60 leading-snug">
                      <strong>Último feedback:</strong> {item.lastErrorReason}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => speakMandarin(item.hanzi)}
                      className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Ouvir Pronúncia Nativa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        // Find a sentence targeting this word
                        const matching = DRILL_SENTENCES.find(s => s.targetWordIds.includes(item.wordId) || s.hanzi.includes(item.hanzi));
                        if (matching) {
                          setCurrentSentence(matching);
                          setFocusedProblemWord(item);
                          setActiveTabSubMode('adaptive');
                          setEvaluationResult(null);
                        } else {
                          triggerNotification(`Nenhuma frase pré-configurada contém [${item.hanzi}].`);
                        }
                      }}
                      className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Treinar Esta Palavra</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Active Exercise Card: App diz a frase -> Usuário repete -> Avaliação */
        <div className="space-y-6">
          {/* Banner de Palavra Priorizada */}
          {sentenceProblemWords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-black shrink-0">
                  ⚠️
                </div>
                <div>
                  <span className="font-black text-amber-950">Treino Adaptativo Ativo:</span>{' '}
                  Esta frase foi priorizada porque contém palavras que você costuma errar:{' '}
                  <span className="font-bold underline">
                    {sentenceProblemWords.map(w => `${w.hanzi} (${w.pinyin} - ${w.failCount}x)`).join(', ')}
                  </span>
                </div>
              </div>

              <span className="text-[10px] uppercase font-black tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full shrink-0 hidden sm:inline">
                Alta Prioridade
              </span>
            </motion.div>
          )}

          {/* Drill Main Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
            {/* Step 1: Ouça a Frase Modelo */}
            <div className="space-y-3 pb-6 border-b border-slate-100">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 flex items-center gap-1.5">
                  <Ear className="w-3.5 h-3.5" />
                  Passo 1: O App diz a Frase
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSpeakModel(0.85)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-indigo-200/60 shadow-2xs"
                    title="Ouvir em velocidade normal de fala"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Ouvir Normal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSpeakModel(0.65)}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-200/60 shadow-2xs"
                    title="Ouvir em velocidade lenta para perceber cada tom nitidamente"
                  >
                    <span>🐢</span>
                    <span>Ouvir Lento (0.65x)</span>
                  </button>
                </div>
              </div>

              {/* Large Sentence Card */}
              <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white text-center space-y-3 shadow-inner">
                {/* Pinyin display */}
                <div className="text-sm sm:text-base md:text-lg font-bold text-amber-300 tracking-wide">
                  {currentSentence.pinyin}
                </div>

                {/* Hanzi display */}
                <div className="text-3xl sm:text-4xl md:text-5xl font-black font-serif tracking-widest text-white py-1">
                  {currentSentence.words.map((w, idx) => {
                    const isProblematic = sentenceProblemWords.some(pw => pw.hanzi === w.hanzi || pw.wordId === w.id);
                    return (
                      <span
                        key={idx}
                        className={`inline-block mx-0.5 transition-all ${
                          isProblematic 
                            ? 'text-amber-300 underline decoration-amber-400 decoration-wavy underline-offset-8' 
                            : 'text-white'
                        }`}
                        title={isProblematic ? `Palavra que você mais erra: ${w.pinyin} (${w.translation})` : `${w.pinyin} - ${w.translation}`}
                      >
                        {w.hanzi}
                      </span>
                    );
                  })}
                </div>

                {/* Portuguese translation */}
                <div className="text-xs sm:text-sm text-slate-300 font-medium italic pt-1">
                  "{currentSentence.portuguese}"
                </div>

                {/* Tip for tone focus */}
                {currentSentence.toneFocusTip && (
                  <div className="mt-3 text-[11px] text-amber-200/90 bg-white/5 py-1.5 px-3 rounded-xl border border-white/10 inline-flex items-center gap-1.5 max-w-lg mx-auto">
                    <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong>Dica de Tom:</strong> {currentSentence.toneFocusTip}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Sua Vez de Falar (Microfone) */}
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" />
                  Passo 2: Sua Vez de Repetir a Frase
                </span>
              </div>

              {/* Central Mic Interaction */}
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative">
                  {/* Pulsing ring when recording */}
                  {isRecording && (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.1, 0.6] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        className="absolute inset-0 rounded-full bg-rose-500 blur-md -z-10"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        className="absolute inset-0 rounded-full bg-rose-400 blur-lg -z-20"
                      />
                    </>
                  )}

                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isAnalyzing}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center gap-1 shadow-2xl transition-all cursor-pointer select-none active:scale-95 ${
                      isAnalyzing
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : isRecording
                        ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-300 shadow-rose-600/50'
                        : 'bg-gradient-to-tr from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white shadow-rose-500/30 hover:shadow-indigo-500/40'
                    }`}
                  >
                    {isAnalyzing ? (
                      <RefreshCw className="w-8 h-8 animate-spin" />
                    ) : isRecording ? (
                      <div className="w-8 h-8 rounded-md bg-white shadow-xs" />
                    ) : (
                      <Mic className="w-8 h-8 sm:w-10 sm:h-10" />
                    )}
                  </button>
                </div>

                {/* Status Message */}
                <div className="mt-4 space-y-1">
                  <div className="text-sm font-black text-slate-800">
                    {isAnalyzing
                      ? 'Processando áudio e avaliando tons com Gemini...'
                      : isRecording
                      ? `Gravando... Fale agora! (00:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds})`
                      : 'Toque no microfone e pronuncie a frase em voz alta'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {isRecording
                      ? 'Toque novamente no botão para concluir a gravação'
                      : 'O app transcreverá seu áudio, medirá a proximidade e apontará desvios'}
                  </div>
                </div>

                {/* Audio Level Waves Bar (Live Feedback) */}
                {isRecording && (
                  <div className="flex items-center gap-1 mt-4 h-6 px-4 py-1 rounded-full bg-slate-100">
                    {[0.4, 0.7, 1.0, 0.6, 0.8, 1.2, 0.5, 0.9, 0.7, 0.3].map((multiplier, idx) => (
                      <motion.div
                        key={idx}
                        animate={{ height: `${Math.max(4, Math.min(24, (audioLevel * multiplier) / 3))}px` }}
                        transition={{ duration: 0.1 }}
                        className="w-1.5 rounded-full bg-rose-500"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Recorded Audio Playback Bar (Side-by-side comparison) */}
              {recordedAudioUrl && !isRecording && (
                <div className="inline-flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200 text-xs">
                  <span className="text-slate-600 font-bold flex items-center gap-1.5">
                    <Ear className="w-3.5 h-3.5 text-indigo-600" />
                    Sua gravação:
                  </span>
                  <button
                    type="button"
                    onClick={handleTogglePlayRecorded}
                    className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-bold flex items-center gap-1 hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    {isPlayingRecorded ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isPlayingRecorded ? 'Pausar' : 'Ouvir Minha Voz'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSpeakModel(0.85)}
                    className="px-3 py-1 rounded-xl bg-slate-200 text-slate-800 font-bold flex items-center gap-1 hover:bg-slate-300 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Comparar com Nativo</span>
                  </button>
                </div>
              )}
            </div>

            {/* Step 3: Avaliação de Proximidade & Destaque dos Erros */}
            {evaluationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 border-t border-slate-100 space-y-5"
              >
                {/* Score Header */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Score Circular Badge */}
                    <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black shadow-md shrink-0 ${
                      evaluationResult.accuracyScore >= 90
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                        : evaluationResult.accuracyScore >= 70
                        ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                        : 'bg-rose-500 text-white shadow-rose-500/20'
                    }`}>
                      <span className="text-xl leading-none">{evaluationResult.accuracyScore}%</span>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold opacity-90 mt-0.5">
                        Acurácia
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900">
                          {evaluationResult.accuracyScore >= 90
                            ? 'Pronúncia Excelente! (太棒了)'
                            : evaluationResult.accuracyScore >= 70
                            ? 'Bom Progresso! (很好)'
                            : 'Pratique Mais os Tons (再试一次)'}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700">
                          {evaluationResult.provider === 'gemini' ? 'Gemini 3.8 Flash' : 'Reconhecimento Local'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 max-w-lg leading-relaxed">
                        {evaluationResult.feedback}
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={startRecording}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Repetir Frase</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextDrill}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                    >
                      <span>Próxima Frase</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Transcrição Capturada vs Frase Alvo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-black text-slate-500 uppercase tracking-wider text-[10px]">
                      Frase Alvo Esperada:
                    </span>
                    <div className="text-sm font-black text-slate-900 font-serif">
                      {currentSentence.hanzi}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      {currentSentence.pinyin}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-black text-slate-500 uppercase tracking-wider text-[10px]">
                      O que o App ouviu na sua voz:
                    </span>
                    <div className="text-sm font-black text-indigo-700 font-serif">
                      {evaluationResult.transcript || 'Nenhum caractere detectado'}
                    </div>
                    {evaluationResult.pinyin && (
                      <div className="text-xs text-slate-600 font-medium">
                        {evaluationResult.pinyin}
                      </div>
                    )}
                  </div>
                </div>

                {/* Destaque Visual dos Erros Palavra por Palavra */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <span>Destaque Palavra por Palavra:</span>
                      <span className="text-slate-400 font-normal">
                        (Toque em qualquer card para ver a dica fonética)
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Verde = Correto • Vermelho = Falha de tom/palavra
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                    {evaluationResult.wordsEvaluation.map((wordEval, idx) => {
                      const isFailed = !wordEval.isCorrect;
                      const isSelected = selectedWordDetail?.hanzi === wordEval.hanzi;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedWordDetail(wordEval)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                            isSelected
                              ? 'ring-2 ring-indigo-500 shadow-md'
                              : 'shadow-2xs hover:shadow-xs'
                          } ${
                            wordEval.isCorrect
                              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                              : 'bg-rose-50/80 border-rose-300 text-rose-950'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-75">
                              {wordEval.pinyin}
                            </span>
                            {wordEval.isCorrect ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            )}
                          </div>

                          <div className="text-2xl font-black font-serif my-0.5">
                            {wordEval.hanzi}
                          </div>

                          <div className="text-[11px] font-bold line-clamp-1">
                            {wordEval.isCorrect ? (
                              <span className="text-emerald-700">Acertou!</span>
                            ) : (
                              <span className="text-rose-700">
                                {wordEval.errorType === 'tone' ? 'Erro de Tom' : 'Verificar'}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Detailed Selected Word Drawer/Box */}
                  {selectedWordDetail && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`p-4 rounded-2xl border text-xs space-y-2 mt-3 ${
                        selectedWordDetail.isCorrect
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black font-serif">
                            {selectedWordDetail.hanzi}
                          </span>
                          <span className="font-extrabold text-sm">
                            {selectedWordDetail.pinyin}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            selectedWordDetail.isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                          }`}>
                            {selectedWordDetail.isCorrect ? 'Pronúncia Correta' : 'Ajustar Articulação'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => speakMandarin(selectedWordDetail.hanzi)}
                          className="px-2.5 py-1 rounded-xl bg-white/80 hover:bg-white text-slate-800 font-bold text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3 text-indigo-600" />
                          <span>Ouvir Som Isolado</span>
                        </button>
                      </div>

                      {selectedWordDetail.spokenPinyin && (
                        <div className="text-[11px]">
                          <strong>Ouvido no áudio:</strong> {selectedWordDetail.spokenPinyin}
                        </div>
                      )}

                      {selectedWordDetail.tip && (
                        <div className="text-[11px] leading-relaxed">
                          <strong>Dica fonética:</strong> {selectedWordDetail.tip}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
