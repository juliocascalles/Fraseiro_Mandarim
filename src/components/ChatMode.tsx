import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, Users, Volume2, Layers, Heart, 
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, Smile, 
  Plus, ShieldCheck, ArrowRight, CornerDownRight,
  Share2, Check, Copy, Hash, Compass, KeyRound, ExternalLink,
  Shuffle, LogIn, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  updateDoc, 
  increment,
  getDocs
} from 'firebase/firestore';
import { db, auth, initAnonymousAuth, handleFirestoreError, OperationType } from '../lib/firebase';
import { Word, ChatMessage, ChatPhraseData, ChatRoom, PhraseValidationReport } from '../types';
import { speakMandarin } from '../utils/speech';
import { SentenceBuilder } from './SentenceBuilder';

export interface ChatModeProps {
  allWords: Word[];
  builderPhrase?: {
    hanzi: string;
    pinyin: string;
    portuguese: string;
    words: Word[];
    isValid: boolean;
  };
  builderSequence: Word[];
  setBuilderSequence: (words: Word[]) => void;
  builderInsertIndex?: number;
  setBuilderInsertIndex?: (index: number) => void;
  getAvailableWords: (sequence: Word[]) => Word[];
  checkIsValidSentence: (sequence: Word[]) => boolean;
  getNaturalTranslation: (sequence: Word[]) => string;
  validateAndBuildPhrase: (input: string) => PhraseValidationReport;
}

const AVATARS = ['🐼', '🐉', '🦩', '🐯', '🦊', '🐰', '🎋', '🏮'];

// Helper to generate engaging alphanumeric codes like ZK7H9N4, YY0T8J17
const generateRandomRoomCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const ChatMode: React.FC<ChatModeProps> = ({
  allWords,
  builderPhrase,
  builderSequence,
  setBuilderSequence,
  builderInsertIndex,
  setBuilderInsertIndex,
  getAvailableWords,
  checkIsValidSentence,
  getNaturalTranslation,
  validateAndBuildPhrase,
  onOpenDictionary
}) => {
  // User Profile
  const [senderName, setSenderName] = useState<string>(() => {
    return localStorage.getItem('chat_sender_name') || 'Estudante';
  });
  const [senderAvatar, setSenderAvatar] = useState<string>(() => {
    return localStorage.getItem('chat_sender_avatar') || '🐉';
  });
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  // Active Room State (stored in localStorage for session continuity)
  const [currentRoomCode, setCurrentRoomCode] = useState<string>(() => {
    return localStorage.getItem('chat_active_room_code') || 'ZH-GERAL';
  });
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);

  // Room identification controls: input for entering by code & status notices
  const [roomInputText, setRoomInputText] = useState<string>('');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [recentRooms, setRecentRooms] = useState<ChatRoom[]>([]);
  const [copiedCodeSuccess, setCopiedCodeSuccess] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Messages & Firestore State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);

  // Composer State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize Anonymous Auth on load
  useEffect(() => {
    initAnonymousAuth();
  }, []);

  // Save profile to local storage
  const handleSaveProfile = (name: string, avatar: string) => {
    const cleanName = name.trim() || 'Estudante';
    setSenderName(cleanName);
    setSenderAvatar(avatar);
    localStorage.setItem('chat_sender_name', cleanName);
    localStorage.setItem('chat_sender_avatar', avatar);
    setIsEditingProfile(false);
  };

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch recent active rooms from Firestore for discovery
  const fetchRecentRooms = async () => {
    try {
      const q = query(collection(db, 'rooms'), orderBy('lastActivity', 'desc'), limit(8));
      const snap = await getDocs(q);
      const rooms: ChatRoom[] = [];
      snap.forEach((d) => {
        rooms.push({ id: d.id, ...d.data() } as ChatRoom);
      });
      setRecentRooms(rooms);
    } catch (err) {
      console.warn('Não foi possível listar salas recentes:', err);
    }
  };

  useEffect(() => {
    fetchRecentRooms();
  }, [currentRoomCode]);

  // Real-time listener for current Room details and Messages
  useEffect(() => {
    setIsLoadingMessages(true);
    setFirestoreError(null);
    localStorage.setItem('chat_active_room_code', currentRoomCode);

    // 1. Listen to Room document in Firestore
    const roomRef = doc(db, 'rooms', currentRoomCode);
    const unsubRoom = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        setCurrentRoom({ id: docSnap.id, ...docSnap.data() } as ChatRoom);
      } else {
        // Automatically provision room document if it's new
        const initialRoom: ChatRoom = {
          id: currentRoomCode,
          code: currentRoomCode,
          name: currentRoomCode === 'ZH-GERAL' ? 'Sala Aberta Geral' : `Sala ${currentRoomCode}`,
          description: currentRoomCode === 'ZH-GERAL' 
            ? 'Compartilhamento comunitário de frases em Mandarim.' 
            : 'Sala de conversa por código compartilhado.',
          createdBy: auth.currentUser?.uid || senderName,
          creatorName: senderName,
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        };

        setDoc(roomRef, initialRoom)
          .then(() => {
            setCurrentRoom(initialRoom);
          })
          .catch((err) => {
            handleFirestoreError(err, OperationType.WRITE, `rooms/${currentRoomCode}`);
          });
      }
    }, (err) => {
      const errInfo = handleFirestoreError(err, OperationType.GET, `rooms/${currentRoomCode}`);
      setFirestoreError(errInfo.error);
    });

    // 2. Listen to Messages subcollection in real-time
    const messagesQuery = query(
      collection(db, 'rooms', currentRoomCode, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(100)
    );

    const unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
      const loadedMessages: ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        loadedMessages.push({ id: docSnap.id, ...docSnap.data() } as ChatMessage);
      });
      setMessages(loadedMessages);
      setIsLoadingMessages(false);
      setTimeout(scrollToBottom, 100);
    }, (err) => {
      const errInfo = handleFirestoreError(err, OperationType.LIST, `rooms/${currentRoomCode}/messages`);
      setFirestoreError(errInfo.error);
      setIsLoadingMessages(false);
    });

    return () => {
      unsubRoom();
      unsubMessages();
    };
  }, [currentRoomCode]);

  // Handle Room Code Copy
  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(currentRoomCode);
    setCopiedCodeSuccess(true);
    setTimeout(() => setCopiedCodeSuccess(false), 2500);
  };

  // 1- Botão "Gerar sala": Gera um código aleatório e entra imediatamente
  const handleGenerateRoom = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    const newCode = generateRandomRoomCode();

    const newRoom: ChatRoom = {
      id: newCode,
      code: newCode,
      name: `Sala ${newCode}`,
      description: 'Sala de conversa com código compartilhado.',
      createdBy: auth.currentUser?.uid || senderName,
      creatorName: senderName,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'rooms', newCode), newRoom);
      setCurrentRoomCode(newCode);
      setRoomInputText('');
      setFeedbackNotice(`Nova sala gerada com o código "${newCode}"! Compartilhe este código para conversarem.`);
      setTimeout(() => setFeedbackNotice(null), 8000);
      fetchRecentRooms();
    } catch (err) {
      const errInfo = handleFirestoreError(err, OperationType.CREATE, `rooms/${newCode}`);
      setFirestoreError(`Falha ao gerar sala: ${errInfo.error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // 2- Campo de texto + botão "Entrar": Permite entrar na sala com o código digitado
  const handleEnterRoom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = roomInputText.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!cleanCode) {
      setFeedbackNotice('Por favor, digite um código de sala (ex: ZK7H9N4).');
      setTimeout(() => setFeedbackNotice(null), 4000);
      return;
    }

    setCurrentRoomCode(cleanCode);
    setFeedbackNotice(`Você entrou na sala "${cleanCode}". Todas as mensagens enviadas e recebidas são desta sala!`);
    setTimeout(() => setFeedbackNotice(null), 6000);
    setRoomInputText('');
  };

  // Send a phrase message to Firebase Firestore
  const handleSendMessage = async () => {
    if (isSubmitting) return;

    if (!builderSequence || builderSequence.length === 0) {
      setFeedbackNotice('Monte uma frase no construtor acima para poder enviar.');
      setTimeout(() => setFeedbackNotice(null), 3500);
      return;
    }

    const hanzi = builderSequence.map(w => w.hanzi).join('');
    const pinyin = builderSequence.map(w => w.label).join(' ');
    const portuguese = getNaturalTranslation(builderSequence);
    const isValid = checkIsValidSentence(builderSequence);

    // CRITICAL: Word contains React Component icon (with symbols like Symbol(react.element)).
    // Serialize to pure primitive objects so Firestore never encounters a Symbol (Fix ID: 3029).
    const serializedWords = builderSequence.map(w => ({
      id: String(w.id),
      label: String(w.label),
      hanzi: String(w.hanzi),
      translation: String(w.translation),
      category: String(w.category)
    }));

    const phraseData = {
      hanzi: String(hanzi),
      pinyin: String(pinyin),
      portuguese: String(portuguese),
      wordIds: builderSequence.map(w => String(w.id)),
      words: serializedWords,
      isValidGrammar: Boolean(isValid)
    };

    setIsSubmitting(true);

    try {
      const rawPayload = {
        roomId: String(currentRoomCode),
        senderId: String(auth.currentUser?.uid || `user-${senderName.toLowerCase().replace(/[^a-z0-9]/g, '')}`),
        senderName: String(senderName),
        avatar: String(senderAvatar),
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString(),
        phrase: phraseData,
        likes: 0
      };

      // Strip all functions, symbols, and undefined values before calling addDoc
      const cleanPayload = JSON.parse(JSON.stringify(rawPayload));

      // Add to Firestore collection
      await addDoc(collection(db, 'rooms', currentRoomCode, 'messages'), cleanPayload);

      // Update room's last activity
      await updateDoc(doc(db, 'rooms', currentRoomCode), {
        lastActivity: new Date().toISOString()
      }).catch(() => {});

      // Clear builder sequence after sending so user can build next sentence
      setBuilderSequence([]);
      if (setBuilderInsertIndex) setBuilderInsertIndex(0);

      setTimeout(scrollToBottom, 120);

    } catch (err) {
      const errInfo = handleFirestoreError(err, OperationType.CREATE, `rooms/${currentRoomCode}/messages`);
      setFirestoreError(`Erro ao enviar mensagem: ${errInfo.error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like a message in Firestore
  const handleLikeMessage = async (messageId: string) => {
    try {
      const msgRef = doc(db, 'rooms', currentRoomCode, 'messages', messageId);
      await updateDoc(msgRef, {
        likes: increment(1)
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `rooms/${currentRoomCode}/messages/${messageId}`);
    }
  };

  // Import received phrase into builder directly on this page
  const handleImportToBuilder = (phrase: ChatPhraseData) => {
    if (phrase.wordIds && phrase.wordIds.length > 0) {
      const mapped = phrase.wordIds
        .map(id => allWords.find(w => w.id === id))
        .filter((w): w is Word => !!w);
      if (mapped.length > 0) {
        setBuilderSequence(mapped);
        if (setBuilderInsertIndex) setBuilderInsertIndex(mapped.length);
        return;
      }
    }

    if (phrase.words && phrase.words.length > 0) {
      const mapped = phrase.words
        .map(pw => allWords.find(w => w.id === pw.id || w.hanzi === pw.hanzi))
        .filter((w): w is Word => !!w);
      if (mapped.length > 0) {
        setBuilderSequence(mapped);
        if (setBuilderInsertIndex) setBuilderInsertIndex(mapped.length);
        return;
      }
    }

    const foundWords: Word[] = [];
    const rem = phrase.hanzi;
    for (const w of allWords) {
      if (rem.includes(w.hanzi)) {
        foundWords.push(w);
      }
    }
    if (foundWords.length > 0) {
      setBuilderSequence(foundWords);
      if (setBuilderInsertIndex) setBuilderInsertIndex(foundWords.length);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5">
      {/* Room Identification & Controls: 1- Botão "Gerar sala" | 2- Campo de texto + botão "Entrar" */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
        
        {/* Main interactive header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Current Room Info & Copy Code */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Sala Atual:
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-800">
                {currentRoom?.name || `Sala ${currentRoomCode}`}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Room Code Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs font-mono font-bold shadow-xs">
                <KeyRound className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Código: <strong className="text-sm sm:text-base text-indigo-700 tracking-wider select-all">{currentRoomCode}</strong></span>
                <button
                  type="button"
                  id="btn-copiar-codigo"
                  onClick={handleCopyRoomCode}
                  className="ml-1 px-2 py-0.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-800 transition-colors flex items-center gap-1 cursor-pointer font-sans"
                  title="Copiar código da sala para a área de transferência"
                >
                  {copiedCodeSuccess ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-[10px] text-emerald-700 font-bold">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="text-[10px]">Copiar</span>
                    </>
                  )}
                </button>
              </div>

              {copiedCodeSuccess && (
                <span className="text-[11px] font-bold text-emerald-600 animate-fade-in">
                  Código copiado! Envie para quem deseja conversar.
                </span>
              )}
            </div>
          </div>

          {/* Action Area: [Gerar sala] e [Campo de texto + Entrar] */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
            
            {/* 1- Botão "Gerar sala" */}
            <button
              type="button"
              id="btn-gerar-sala"
              onClick={handleGenerateRoom}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer shadow-xs hover:shadow-md disabled:opacity-50"
              title="Gerar código aleatório e entrar em uma nova sala"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>{isGenerating ? 'Gerando...' : 'Gerar sala'}</span>
            </button>

            {/* Separador vertical discreto em telas médias/grandes */}
            <div className="hidden sm:block w-px h-8 bg-slate-200" />

            {/* 2- Campo de texto + botão "Entrar" */}
            <form onSubmit={handleEnterRoom} className="flex items-center gap-1.5">
              <div className="relative">
                <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  id="input-codigo-sala"
                  value={roomInputText}
                  onChange={(e) => setRoomInputText(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                  placeholder="Código (ex: ZK7H9N4)"
                  maxLength={20}
                  className="w-40 sm:w-48 pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-mono font-bold uppercase tracking-wider focus:outline-indigo-500 placeholder:text-slate-400 placeholder:normal-case placeholder:font-normal transition-colors"
                />
              </div>

              <button
                type="submit"
                id="btn-entrar-sala"
                disabled={!roomInputText.trim()}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed"
                title="Entrar na sala com o código digitado"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </button>
            </form>

          </div>

        </div>

        {/* Feedback / Notification banner */}
        {feedbackNotice && (
          <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="font-semibold">{feedbackNotice}</span>
          </div>
        )}

        {/* Instructive example note matching user prompt */}
        <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-1">
          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-bold text-slate-700 shrink-0">💡 Exemplo de uso:</span>
            <span>
              Você clica em <strong>"Gerar sala"</strong> e obtém um código (ex: <code className="font-mono font-bold text-indigo-700 bg-slate-100 px-1 py-0.5 rounded">ZK7H9N4</code>). Outra pessoa digita <code className="font-mono font-bold text-indigo-700 bg-slate-100 px-1 py-0.5 rounded">ZK7H9N4</code> no campo e clica em <strong>"Entrar"</strong> para falarem juntos.
            </span>
          </div>
        </div>

      </div>

      {/* Firestore Error Alert if any */}
      {firestoreError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{firestoreError}</span>
        </div>
      )}

      {/* Main Grid: Rooms & Info Sidebar + Chat Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Col: Rooms List & Current Phrase Helper */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          
          {/* Quick Rooms Switcher */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              Salas Ativas no Firebase
            </span>

            <div className="flex flex-col gap-1.5">
              {/* Default General Room */}
              <button
                type="button"
                onClick={() => setCurrentRoomCode('ZH-GERAL')}
                className={`flex flex-col text-left p-3 rounded-2xl transition-all cursor-pointer border ${
                  currentRoomCode === 'ZH-GERAL'
                    ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900 shadow-xs ring-1 ring-indigo-300'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Sala Aberta Geral</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-indigo-700 border border-indigo-200 font-bold">
                    ZH-GERAL
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5">Comunidade aberta HSK 1-2</span>
              </button>

              {/* Other recent active rooms */}
              {recentRooms
                .filter((r) => r.code !== 'ZH-GERAL')
                .map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setCurrentRoomCode(r.code)}
                    className={`flex flex-col text-left p-3 rounded-2xl transition-all cursor-pointer border ${
                      currentRoomCode === r.code
                        ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900 shadow-xs ring-1 ring-indigo-300'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate max-w-[120px]">{r.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-bold">
                        {r.code}
                      </span>
                    </div>
                    {r.description && (
                      <span className="text-[11px] text-slate-500 mt-0.5 truncate">{r.description}</span>
                    )}
                  </button>
                ))}
            </div>
          </div>

          {/* Canto esquerdo inferior: Avatar e Identidade do Usuário (Req 6) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              Meu Perfil
            </span>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100/70 border border-indigo-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                {senderAvatar}
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {senderName}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="text-[10px] font-semibold text-indigo-600 hover:underline cursor-pointer shrink-0"
                    title="Mudar nome e avatar"
                  >
                    (mudar)
                  </button>
                </div>

                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-[10px] font-semibold text-emerald-700 truncate">
                    Firebase Ativo
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right 3 Cols: Construtor Integrado ACIMA, Área de Mensagens ABAIXO (Req 2) */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          
          {/* 1. Construtor Integrado (Acima) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <SentenceBuilder
              allWords={allWords}
              sequence={builderSequence}
              setSequence={setBuilderSequence}
              insertIndex={builderInsertIndex}
              setInsertIndex={setBuilderInsertIndex}
              getAvailableWords={getAvailableWords}
              checkIsValidSentence={checkIsValidSentence}
              getNaturalTranslation={getNaturalTranslation}
              validateAndBuildPhrase={validateAndBuildPhrase}
              onSendMessage={handleSendMessage}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* 2. Área de Mensagens (Abaixo do construtor - Req 2) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col h-[460px] overflow-hidden">
            
            {/* Header da Área de Mensagens */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800">
                  Mensagens da Sala <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg">{currentRoomCode}</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  ({messages.length} {messages.length === 1 ? 'frase' : 'frases'})
                </span>
              </div>

              <button
                type="button"
                onClick={scrollToBottom}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                title="Rolar para as mensagens mais recentes"
              >
                Rolar ao final ↓
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3.5">
              {isLoadingMessages ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                  <span className="text-xs">Sincronizando com a sala no Firebase...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 text-center p-6">
                  <MessageSquare className="w-10 h-10 text-slate-300" />
                  <span className="text-sm font-bold text-slate-600">Nenhuma frase nesta sala ainda!</span>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Monte uma frase no construtor acima e clique em <strong>"Enviar Frase"</strong> para iniciar a conversa nesta sala.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderName === senderName;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] ${isMine ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      {/* Sender Header */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 px-1">
                        <span className="text-sm">{msg.avatar}</span>
                        <span className="font-bold text-slate-700">{msg.senderName}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Balão de Mensagem: apenas a frase enviada, botão de ouvir e botão de curtir (Req 3) */}
                      <div className={`p-4 rounded-3xl border shadow-2xs flex flex-col gap-2 transition-all ${
                        isMine 
                          ? 'bg-indigo-600 text-white border-indigo-700 rounded-tr-xs' 
                          : 'bg-white text-slate-800 border-slate-200/90 rounded-tl-xs'
                      }`}>
                        
                        {/* Linha Principal: Hanzi e Botão de Ouvir */}
                        <div className="flex items-start justify-between gap-3">
                          <span className={`text-xl sm:text-2xl font-bold tracking-wide select-text ${isMine ? 'text-white' : 'text-slate-900'}`}>
                            {msg.phrase?.hanzi || ''}
                          </span>

                          <button
                            type="button"
                            onClick={() => speakMandarin(msg.phrase?.hanzi || '')}
                            className={`p-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                              isMine 
                                ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-xs' 
                                : 'bg-slate-100 hover:bg-indigo-50 text-indigo-600 shadow-2xs'
                            }`}
                            title="Ouvir pronúncia da frase"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Pinyin */}
                        {msg.phrase?.pinyin && (
                          <span className={`text-xs font-semibold font-mono ${isMine ? 'text-indigo-200' : 'text-indigo-700'}`}>
                            {msg.phrase.pinyin}
                          </span>
                        )}

                        {/* Tradução em Português */}
                        {msg.phrase?.portuguese && (
                          <span className={`text-xs font-medium leading-relaxed ${isMine ? 'text-indigo-100' : 'text-slate-600'}`}>
                            {msg.phrase.portuguese}
                          </span>
                        )}

                        {/* Rodapé do Balão: Botão de Curtir */}
                        <div className="flex items-center justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => handleLikeMessage(msg.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                              isMine 
                                ? 'bg-indigo-700/60 hover:bg-indigo-700 text-indigo-100 hover:text-white' 
                                : 'bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/60'
                            }`}
                            title="Curtir frase"
                          >
                            <Heart className={`w-3.5 h-3.5 ${msg.likes && msg.likes > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                            <span>{msg.likes || 0}</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

          </div>

        </div>

      </div>

      {/* Modal: Edit Profile */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border border-slate-100 flex flex-col gap-4">
            <h3 className="text-base font-bold text-slate-800">Editar Meu Perfil no Chat</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Seu Nome ou Apelido:</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                maxLength={20}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-indigo-500"
                placeholder="Ex: Julio, Ana, Li Wei..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Escolha seu Avatar:</label>
              <div className="flex items-center gap-2 flex-wrap">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSenderAvatar(av)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                      senderAvatar === av ? 'bg-indigo-100 ring-2 ring-indigo-500 scale-105' : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSaveProfile(senderName, senderAvatar)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs"
              >
                Salvar Perfil
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
