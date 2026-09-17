import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Mic, MicOff, Volume2, Sparkles, CheckCircle2, AlertCircle, 
  RotateCcw, ArrowRight, BookOpen, Layers, Check, HelpCircle,
  Play, Radio, VolumeX, ShieldCheck, Flame, Award, Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Word, PronunciationEvaluation } from '../types';
import { evaluatePronunciation } from '../utils/pronunciationAnalyzer';
import { speakMandarin } from '../utils/speech';

interface PronunciationModeProps {
  allWords: Word[];
  checkIsValidSentence: (sequence: Word[]) => boolean;
  getNaturalTranslation: (sequence: Word[]) => string;
  builderPhrase?: {
    hanzi: string;
    pinyin: string;
    portuguese: string;
    words: Word[];
  };
  onSendToBuilder?: (words: Word[]) => void;
  onOpenDictionary?: () => void;
}

const PRESET_PRACTICE_PHRASES = [
  {
    id: 'p1',
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    portuguese: 'Olá / Tudo bem?',
    level: 'HSK 1',
    category: 'Cumprimento',
    tip: 'Pronuncie os dois terceiros tons com a regra do sandhi: o primeiro vira 2º tom (ní hǎo)!'
  },
  {
    id: 'p2',
    hanzi: '我是巴西人',
    pinyin: 'wǒ shì bāxī rén',
    portuguese: 'Eu sou brasileiro(a).',
    level: 'HSK 1',
    category: 'Nacionalidade',
    tip: 'Mantenha "shì" com 4º tom forte e seco descendente.'
  },
  {
    id: 'p3',
    hanzi: '我想喝茶',
    pinyin: 'wǒ xiǎng hē chá',
    portuguese: 'Eu quero beber chá.',
    level: 'HSK 1',
    category: 'Ação Cotidiana',
    tip: '"hē" é 1º tom alto e sustentado; "chá" é 2º tom ascendente.'
  },
  {
    id: 'p4',
    hanzi: '今天天气很好',
    pinyin: 'jīntiān tiānqì hěn hǎo',
    portuguese: 'Hoje o tempo está muito bom.',
    level: 'HSK 1',
    category: 'Clima & Dia',
    tip: 'Tempo vem antes do predicado. "hěn hǎo" sofre sandhi tonal para "hén hǎo".'
  },
  {
    id: 'p5',
    hanzi: '他在学校看书',
    pinyin: 'tā zài xuéxiào kàn shū',
    portuguese: 'Ele está na escola lendo livro.',
    level: 'HSK 1',
    category: 'Localização & Verbo',
    tip: 'Regra gramatical: Local (在学校) obrigatoriamente antes da ação (看书).'
  },
  {
    id: 'p6',
    hanzi: '这个多少钱',
    pinyin: 'zhège duōshao qián',
    portuguese: 'Quanto custa este?',
    level: 'HSK 2',
    category: 'Compras',
    tip: '"qián" sobe com 2º tom como uma pergunta em português.'
  },
  {
    id: 'p7',
    hanzi: '我有一只猫',
    pinyin: 'wǒ yǒu yī zhī māo',
    portuguese: 'Eu tenho um gato.',
    level: 'HSK 1',
    category: 'Animais & Classificadores',
    tip: 'Use o classificador "zhī" (只) com 1º tom para pequenos animais.'
  },
  {
    id: 'p8',
    hanzi: '你叫什么名字',
    pinyin: 'nǐ jiào shénme míngzi',
    portuguese: 'Qual é o seu nome?',
    level: 'HSK 1',
    category: 'Apresentação',
    tip: 'Perguntas com "shénme" não levam a partícula "ma" no final.'
  }
];

export const PronunciationMode: React.FC<PronunciationModeProps> = ({
  allWords,
  checkIsValidSentence,
  getNaturalTranslation,
  builderPhrase,
  onSendToBuilder,
  onOpenDictionary
}) => {
  // Practice Target
  const [selectedTarget, setSelectedTarget] = useState<typeof PRESET_PRACTICE_PHRASES[0] | null>(PRESET_PRACTICE_PHRASES[0]);
  const [isFreeSpeech, setIsFreeSpeech] = useState<boolean>(false);

  // Speech / Audio Recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [transcript, setTranscript] = useState<string>('');
  const [recognizedPinyin, setRecognizedPinyin] = useState<string>('');
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Evaluation state
  const [evaluation, setEvaluation] = useState<PronunciationEvaluation | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<any>(null);

  // Clean up media streams and audio context on unmount
  useEffect(() => {
    return () => {
      stopAudioCapture();
    };
  }, []);

  const stopAudioCapture = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (_) {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (_) {}
      audioContextRef.current = null;
    }
    setAudioLevel(0);
    setIsRecording(false);
  };

  // Run evaluation
  const runEvaluation = (text: string, extraAiData?: { pinyin?: string; feedback?: string; score?: number }) => {
    const targetHanzi = isFreeSpeech ? undefined : selectedTarget?.hanzi;
    const targetPinyin = isFreeSpeech ? undefined : selectedTarget?.pinyin;

    const result = evaluatePronunciation(
      text,
      allWords,
      checkIsValidSentence,
      targetHanzi,
      targetPinyin
    );

    // If Gemini provided an AI accuracy score or feedback, enrich the evaluation
    if (extraAiData) {
      if (extraAiData.score && extraAiData.score > 0) {
        // Blend rule-based score with acoustic AI score
        result.score = Math.round((result.score * 0.4) + (extraAiData.score * 0.6));
      }
      if (extraAiData.feedback) {
        result.fluencyFeedback = extraAiData.feedback;
      }
    }

    setEvaluation(result);
  };

  // Start recording using MediaRecorder and audio analysis
  const startRecording = async () => {
    setSpeechError(null);
    setTranscript('');
    setRecognizedPinyin('');
    setAiFeedback('');
    setEvaluation(null);
    setRecordingSeconds(0);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setSpeechError('Seu navegador não suporta gravação de áudio via microfone.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      streamRef.current = stream;

      // Setup Web Audio API Analyser for visual volume feedback
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
          animationFrameRef.current = requestAnimationFrame(updateLevel);
        };
        updateLevel();
      } catch (audioErr) {
        console.warn('AudioContext visualization not available:', audioErr);
      }

      // Determine best audio mimeType supported by browser
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size < 100) {
          setSpeechError('Áudio muito curto ou vazio. Fale algo no microfone.');
          setIsProcessing(false);
          return;
        }

        // Send to backend Gemini audio transcriber
        await handleSendAudioToBackend(audioBlob, mimeType);
      };

      mediaRecorder.start(250); // Slice chunks every 250ms
      setIsRecording(true);

      // Start elapsed timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 15) {
            // Auto stop after 15 seconds
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err: any) {
      console.error('Erro ao acessar o microfone:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setSpeechError('Permissão do microfone negada. Permita o acesso ao microfone nas configurações do navegador.');
      } else if (err.name === 'NotFoundError') {
        setSpeechError('Nenhum microfone foi detectado no seu dispositivo.');
      } else {
        setSpeechError(`Erro ao inicializar gravação: ${err.message || String(err)}`);
      }
      stopAudioCapture();
    }
  };

  // Stop recording and process
  const stopRecording = () => {
    if (!isRecording) return;
    setIsRecording(false);
    setIsProcessing(true);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setAudioLevel(0);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.error('Erro ao parar MediaRecorder:', err);
        setIsProcessing(false);
      }
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Convert Blob to Base64 and send to /api/transcribe-audio
  const handleSendAudioToBackend = async (audioBlob: Blob, mimeType: string) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        try {
          const targetPhrase = !isFreeSpeech && selectedTarget ? selectedTarget.hanzi : undefined;
          const res = await fetch('/api/transcribe-audio', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              audioBase64: base64Audio,
              mimeType,
              targetPhrase
            })
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `Erro do servidor (${res.status})`);
          }

          const data = await res.json();
          if (!data.transcript) {
            setSpeechError('Nenhuma fala em mandarim pôde ser detectada com clareza no áudio. Fale mais alto e próximo ao microfone.');
            setIsProcessing(false);
            return;
          }

          setTranscript(data.transcript);
          if (data.pinyin) setRecognizedPinyin(data.pinyin);
          if (data.feedback) setAiFeedback(data.feedback);

          // Run grammar rules & dictionary validation
          runEvaluation(data.transcript, {
            pinyin: data.pinyin,
            feedback: data.feedback,
            score: data.accuracyScore
          });

        } catch (postErr: any) {
          console.error('Erro na requisição /api/transcribe-audio:', postErr);
          setSpeechError(`Falha ao reconhecer áudio: ${postErr.message || 'Erro de conexão'}`);
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = () => {
        setSpeechError('Erro ao converter o áudio gravado.');
        setIsProcessing(false);
      };

    } catch (err: any) {
      console.error('Erro ao processar áudio:', err);
      setSpeechError(`Erro no áudio: ${err.message}`);
      setIsProcessing(false);
    }
  };

  // Quick test with sample text (useful for demo/instant practice)
  const handleSimulateSpeech = (text: string) => {
    setTranscript(text);
    setSpeechError(null);
    runEvaluation(text);
    speakMandarin(text);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-semibold mb-1">
            <Mic className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider font-bold">Laboratório de Pronúncia & Gramática Oral</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Teste de Pronúncia com Avaliação Gramatical
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Fale frases em Mandarim no microfone. O sistema transcreve sua fala em tempo real, identifica quais palavras pertencem ao dicionário e verifica se a ordem gramatical pré-estabelecida foi cumprida!
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenDictionary && (
            <button
              type="button"
              onClick={onOpenDictionary}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Ver Dicionário</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Target Phrase & Recording Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Speech Tester Stage */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          
          {/* Active Target Banner */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isFreeSpeech ? 'Modo de Fala Livre' : 'Frase Alvo para Praticar'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsFreeSpeech(false);
                    if (!selectedTarget) setSelectedTarget(PRESET_PRACTICE_PHRASES[0]);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    !isFreeSpeech 
                      ? 'bg-rose-600 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Frase Guiada
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFreeSpeech(true);
                    setSelectedTarget(null);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isFreeSpeech 
                      ? 'bg-rose-600 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Fala Livre
                </button>
              </div>
            </div>

            {!isFreeSpeech && selectedTarget ? (
              <div className="flex flex-col gap-2 bg-rose-50/50 border border-rose-100 rounded-2xl p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-wide">
                      {selectedTarget.hanzi}
                    </span>
                    <span className="text-sm font-semibold text-rose-700 font-mono mt-0.5">
                      {selectedTarget.pinyin}
                    </span>
                    <span className="text-xs text-slate-600 mt-1">
                      {selectedTarget.portuguese}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => speakMandarin(selectedTarget.hanzi)}
                    className="w-12 h-12 rounded-2xl bg-white border border-rose-200 hover:border-rose-300 text-rose-600 flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                    title="Ouvir pronúncia nativa"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {selectedTarget.tip && (
                  <div className="flex items-start gap-2 pt-2 border-t border-rose-100/80 text-[11px] text-rose-800">
                    <Lightbulb className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{selectedTarget.tip}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed">
                No <strong>Modo Fala Livre</strong>, você pode falar qualquer frase em chinês no microfone. O app detectará automaticamente todas as palavras que constam no vocabulário e fará o teste gramatical das regras de composição!
              </div>
            )}

            {/* Quick builder phrase importer if available */}
            {builderPhrase && builderPhrase.hanzi && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs">
                <div className="flex flex-col">
                  <span className="font-bold text-indigo-900">Frase montada no Construtor:</span>
                  <span className="text-slate-700">{builderPhrase.hanzi} ({builderPhrase.pinyin})</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTarget({
                      id: 'builder-custom',
                      hanzi: builderPhrase.hanzi,
                      pinyin: builderPhrase.pinyin,
                      portuguese: builderPhrase.portuguese,
                      level: 'HSK 1',
                      category: 'Construtor',
                      tip: 'Frase importada do seu construtor de frases.'
                    });
                    setIsFreeSpeech(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors cursor-pointer"
                >
                  Usar como Alvo
                </button>
              </div>
            )}
          </div>

          {/* Microphone Central Recording Unit */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-5 relative overflow-hidden">
            {/* Pulsing ring animation when recording */}
            <div className="relative flex items-center justify-center">
              {isRecording && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1.6], opacity: [0.6, 0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
                    className="absolute w-24 h-24 rounded-full bg-rose-400"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1.4], opacity: [0.8, 0.4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.25, ease: 'easeOut' }}
                    className="absolute w-24 h-24 rounded-full bg-rose-500"
                  />
                </>
              )}

              {isProcessing ? (
                <div className="w-24 h-24 rounded-full bg-indigo-50 border-4 border-indigo-200 flex flex-col items-center justify-center shadow-md animate-pulse">
                  <Sparkles className="w-8 h-8 text-indigo-600 animate-spin" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-700 mt-1">Analisando...</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-md cursor-pointer ${
                    isRecording
                      ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-200 scale-105 animate-pulse'
                      : 'bg-gradient-to-tr from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white hover:scale-105'
                  }`}
                  title={isRecording ? 'Clique para concluir a gravação e avaliar' : 'Clique para começar a gravar seu áudio'}
                >
                  {isRecording ? (
                    <>
                      <Radio className="w-8 h-8 animate-pulse mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Parar</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-8 h-8 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Gravar</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Audio Waveform Volume Bar during recording */}
            {isRecording && (
              <div className="w-full max-w-xs flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5 justify-center h-8">
                  {[0.4, 0.7, 1.2, 0.9, 1.5, 0.8, 1.3, 0.6, 1.1, 0.5].map((factor, idx) => {
                    const height = Math.max(6, Math.min(32, Math.round((audioLevel * factor) / 3)));
                    return (
                      <motion.div
                        key={idx}
                        className="w-1.5 bg-rose-500 rounded-full transition-all duration-75"
                        style={{ height: `${height}px` }}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                  <span>Gravando: 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds} / 00:15</span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1 max-w-md">
              <span className="text-sm font-bold text-slate-800">
                {isProcessing
                  ? 'Processando áudio com Inteligência Artificial...'
                  : isRecording
                    ? 'Ouvindo sua pronúncia... Clique em "Parar" quando terminar.'
                    : 'Toque em "Gravar" e fale em Mandarim no microfone'}
              </span>
              <p className="text-xs text-slate-400">
                O áudio gravado é transcrito e avaliado diretamente pelo modelo de IA em Mandarim e comparado com as regras do app.
              </p>
            </div>

            {/* Simulated / Quick Test Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-100 w-full max-w-lg">
              <span className="text-[11px] font-bold text-slate-400">Teste Rápido sem Microfone:</span>
              {selectedTarget && (
                <button
                  type="button"
                  onClick={() => handleSimulateSpeech(selectedTarget.hanzi)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                  title="Simular teste com a frase alvo atual"
                >
                  <Play className="w-3 h-3 text-rose-600" />
                  <span>Testar "{selectedTarget.hanzi}"</span>
                </button>
              )}
            </div>

            {/* Error banner if mic was blocked or speech api failed */}
            {speechError && (
              <div className="w-full max-w-lg p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 text-left">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold">{speechError}</span>
                  <span className="text-[11px] text-amber-800">
                    Você também pode clicar em "Testar Frase" acima para experimentar a validação gramatical e dicionário imediatamente.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Evaluation Results Deck */}
          <AnimatePresence>
            {evaluation && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col gap-5"
              >
                {/* Result Header & Score Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-xs ${
                      evaluation.score >= 80 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                        : evaluation.score >= 60 
                          ? 'bg-amber-50 text-amber-600 border border-amber-200' 
                          : 'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}>
                      {evaluation.score}%
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-800">Resultado do Reconhecimento</h3>
                        {evaluation.isValidGrammar ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Gramática Válida
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Regra Incompleta
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {evaluation.fluencyFeedback}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => speakMandarin(evaluation.rawTranscript)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Ouvir o que falei</span>
                    </button>
                    {evaluation.recognizedWords.length > 0 && onSendToBuilder && (
                      <button
                        type="button"
                        onClick={() => onSendToBuilder(evaluation.recognizedWords.map(rw => rw.word))}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Abrir no Construtor</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Spoken Transcription */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Texto Reconhecido no Áudio:
                  </span>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-wide">
                        {evaluation.rawTranscript}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {evaluation.recognizedWords.length} palavras mapeadas
                      </span>
                    </div>
                    {recognizedPinyin && (
                      <span className="text-sm font-semibold text-rose-700 font-mono">
                        Pinyin reconhecido: {recognizedPinyin}
                      </span>
                    )}
                    {aiFeedback && (
                      <div className="mt-1 pt-2 border-t border-slate-200/60 flex items-start gap-2 text-xs text-slate-600">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span><strong>Diagnóstico Fonético IA:</strong> {aiFeedback}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 1: Identified Words in Dictionary */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      Palavras Identificadas no Dicionário ({evaluation.recognizedWords.length}):
                    </span>
                  </div>

                  {evaluation.recognizedWords.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {evaluation.recognizedWords.map((match, idx) => (
                        <div
                          key={`${match.word.id}-${idx}`}
                          className="flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-xs"
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-slate-900">{match.word.hanzi}</span>
                              <span className="text-xs font-semibold text-emerald-800 font-mono">{match.word.label}</span>
                            </div>
                            <span className="text-xs text-slate-600">{match.word.translation}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">
                              {match.word.category} • {match.word.hskLevel || 'HSK 1'}
                            </span>
                          </div>
                          <div className="text-emerald-600 bg-white p-1 rounded-full border border-emerald-200 shadow-xs">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                      Nenhuma palavra exata do vocabulário HSK 1/2 foi identificada nesta fala. Tente pronunciar com mais clareza.
                    </div>
                  )}

                  {/* Unknown tokens if any */}
                  {evaluation.unknownTokens.length > 0 && (
                    <div className="flex items-center gap-2 mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                      <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Caracteres fora do dicionário do app: <strong>{evaluation.unknownTokens.join(', ')}</strong></span>
                    </div>
                  )}
                </div>

                {/* Section 2: Grammar Diagnostic */}
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Avaliação das Regras Gramaticais Pré-estabelecidas:
                  </span>

                  <div className={`p-4 rounded-2xl border ${
                    evaluation.isValidGrammar
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-sm mb-1">
                      {evaluation.isValidGrammar ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                      )}
                      <span>{evaluation.grammarDiagnostic.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-700">
                      {evaluation.grammarDiagnostic.description}
                    </p>

                    {evaluation.grammarDiagnostic.missingElements && (
                      <div className="mt-2 text-[11px] text-amber-800 font-semibold">
                        Elemento sugerido para completar a regra: {evaluation.grammarDiagnostic.missingElements.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right Col: Preset Practice Library & Tone Guide */}
        <div className="flex flex-col gap-5">
          
          {/* Preset Phrases List */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between text-slate-700 font-bold text-xs uppercase tracking-wider">
              <span>Banco de Frases para Praticar</span>
              <span className="text-rose-600">{PRESET_PRACTICE_PHRASES.length} frases</span>
            </div>

            <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
              {PRESET_PRACTICE_PHRASES.map((phrase) => {
                const isSelected = selectedTarget?.id === phrase.id && !isFreeSpeech;

                return (
                  <button
                    key={phrase.id}
                    type="button"
                    onClick={() => {
                      setSelectedTarget(phrase);
                      setIsFreeSpeech(false);
                      setEvaluation(null);
                    }}
                    className={`flex flex-col p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-300 shadow-xs'
                        : 'border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-slate-900">{phrase.hanzi}</span>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-md">
                        {phrase.level}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-rose-800 font-mono mt-0.5">{phrase.pinyin}</span>
                    <span className="text-xs text-slate-500 mt-0.5">{phrase.portuguese}</span>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">{phrase.category}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakMandarin(phrase.hanzi);
                        }}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                        title="Ouvir pronúncia"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mandarin 4 Tones Educational Guide */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Guia Rápido dos 4 Tons</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
                <span className="font-bold text-slate-800">1º Tom (—) mā</span>
                <span className="text-[11px] text-slate-500">Alto, reto e estável como uma nota cantada contínua.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
                <span className="font-bold text-slate-800">2º Tom (ˊ) má</span>
                <span className="text-[11px] text-slate-500">Ascendente. Sobe do tom médio para o agudo como "Hã?!".</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
                <span className="font-bold text-slate-800">3º Tom (ˇ) mǎ</span>
                <span className="text-[11px] text-slate-500">Desce bem grave no peito e sobe suavemente no final.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
                <span className="font-bold text-slate-800">4º Tom (ˋ) mà</span>
                <span className="text-[11px] text-slate-500">Descendente forte, rápido e afirmativo como "Não!".</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
