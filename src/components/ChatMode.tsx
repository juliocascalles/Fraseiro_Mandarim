import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, Users, Volume2, Layers, Heart, 
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, Smile, 
  BookOpen, Plus, ShieldCheck, ArrowRight, CornerDownRight,
  Radio, Share2, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Word, ChatMessage, ChatPhraseData } from '../types';
import { speakMandarin } from '../utils/speech';

interface ChatModeProps {
  allWords: Word[];
  builderPhrase?: {
    hanzi: string;
    pinyin: string;
    portuguese: string;
    words: Word[];
    isValid: boolean;
  };
  onSendToBuilder: (words: Word[]) => void;
  onOpenDictionary?: () => void;
  onNavigateToBuilder?: () => void;
}

const AVATARS = ['🐼', '🐉', '🦩', '🐯', '🦊', '🐰', '🎋', '🏮'];

const ROOMS = [
  { id: 'global', name: 'Sala Aberta (HSK 1-2)', description: 'Compartilhamento geral de frases construídas' },
  { id: 'restaurant', name: 'Restaurante & Compras', description: 'Prática de pedidos e negociação' },
  { id: 'social', name: 'Amizade & Apresentações', description: 'Conversas cotidianas e cumprimentos' }
];

export const ChatMode: React.FC<ChatModeProps> = ({
  allWords,
  builderPhrase,
  onSendToBuilder,
  onOpenDictionary,
  onNavigateToBuilder
}) => {
  // User Profile
  const [senderName, setSenderName] = useState<string>(() => {
    return localStorage.getItem('chat_sender_name') || 'Julio';
  });
  const [senderAvatar, setSenderAvatar] = useState<string>(() => {
    return localStorage.getItem('chat_sender_avatar') || '🐉';
  });
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  // Room State
  const [activeRoom, setActiveRoom] = useState<string>('global');

  // Messages & Connection State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Composer State
  const [accompanyingText, setAccompanyingText] = useState<string>('');
  const [selectedWordChips, setSelectedWordChips] = useState<Word[]>([]);
  const [customInputText, setCustomInputText] = useState<string>('');
  const [composerMode, setComposerMode] = useState<'from_builder' | 'quick_pick'>('from_builder');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Save profile to local storage
  const handleSaveProfile = (name: string, avatar: string) => {
    const cleanName = name.trim() || 'Estudante';
    setSenderName(cleanName);
    setSenderAvatar(avatar);
    localStorage.setItem('chat_sender_name', cleanName);
    localStorage.setItem('chat_sender_avatar', avatar);
    setIsEditingProfile(false);
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize WebSocket & Fetch Initial Messages
  useEffect(() => {
    let isMounted = true;

    const fetchInitialMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?roomId=${activeRoom}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setMessages(data.messages || []);
            setOnlineCount(data.onlineCount || 1);
            setIsLoading(false);
            setTimeout(scrollToBottom, 100);
          }
        }
      } catch (err) {
        console.warn('Erro ao carregar mensagens iniciais:', err);
        if (isMounted) setIsLoading(false);
      }
    };

    fetchInitialMessages();

    // Setup WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/chat`;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        if (isMounted) setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          if (payload.type === 'init') {
            if (isMounted) {
              setMessages(payload.messages || []);
              setOnlineCount(payload.onlineCount || 1);
              setIsLoading(false);
              setTimeout(scrollToBottom, 100);
            }
          } else if (payload.type === 'new_message') {
            if (isMounted) {
              setMessages((prev) => {
                // Avoid duplicate messages
                if (prev.some((m) => m.id === payload.message.id)) return prev;
                return [...prev, payload.message];
              });
              setTimeout(scrollToBottom, 100);
            }
          } else if (payload.type === 'message_liked') {
            if (isMounted) {
              setMessages((prev) =>
                prev.map((m) => (m.id === payload.messageId ? { ...m, likes: payload.likes } : m))
              );
            }
          } else if (payload.type === 'presence') {
            if (isMounted) setOnlineCount(payload.onlineCount || 1);
          }
        } catch (e) {
          console.error('Erro ao ler mensagem WS:', e);
        }
      };

      ws.onclose = () => {
        if (isMounted) setIsConnected(false);
      };

      ws.onerror = (err) => {
        console.warn('WebSocket error, falling back to REST:', err);
        if (isMounted) setIsConnected(false);
      };

      socketRef.current = ws;
    } catch (e) {
      console.warn('Não foi possível conectar ao WebSocket:', e);
      setIsConnected(false);
    }

    // Polling fallback every 8 seconds in case WS was interrupted
    const interval = setInterval(fetchInitialMessages, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [activeRoom]);

  // Send a message
  const handleSendMessage = async () => {
    let phraseData: ChatPhraseData | null = null;

    if (composerMode === 'from_builder' && builderPhrase && builderPhrase.hanzi) {
      phraseData = {
        hanzi: builderPhrase.hanzi,
        pinyin: builderPhrase.pinyin,
        portuguese: builderPhrase.portuguese,
        words: builderPhrase.words,
        isValidGrammar: builderPhrase.isValid,
        grammarNotes: builderPhrase.isValid 
          ? 'Frase com estrutura gramatical validada pelo Fraseiro.' 
          : 'Frase construída livremente.'
      };
    } else if (selectedWordChips.length > 0) {
      const hanzi = selectedWordChips.map((w) => w.hanzi).join('');
      const pinyin = selectedWordChips.map((w) => w.label).join(' ');
      const pt = selectedWordChips.map((w) => w.translation).join(' ');
      phraseData = {
        hanzi,
        pinyin,
        portuguese: pt,
        words: selectedWordChips,
        isValidGrammar: true,
        grammarNotes: 'Frase composta no chat.'
      };
    } else if (customInputText.trim()) {
      phraseData = {
        hanzi: customInputText.trim(),
        pinyin: '',
        portuguese: 'Frase compartilhada',
        isValidGrammar: true
      };
    }

    if (!phraseData) {
      alert('Construa uma frase no Construtor ou selecione blocos de palavras para enviar!');
      return;
    }

    const payload = {
      senderId: `user-${senderName.toLowerCase().replace(/\s+/g, '')}`,
      senderName,
      avatar: senderAvatar,
      roomId: activeRoom,
      phrase: phraseData,
      textMessage: accompanyingText.trim()
    };

    // If WebSocket is open, send via WS
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'send_message',
          ...payload
        })
      );
    } else {
      // Fallback: Send via REST
      try {
        const res = await fetch('/api/chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.message) {
            setMessages((prev) => [...prev, data.message]);
          }
        }
      } catch (err) {
        console.error('Erro ao enviar mensagem via REST:', err);
      }
    }

    // Reset composer input
    setAccompanyingText('');
    setSelectedWordChips([]);
    setCustomInputText('');
    setTimeout(scrollToBottom, 150);
  };

  // Like a message
  const handleLikeMessage = async (messageId: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'like_message',
          messageId
        })
      );
    } else {
      try {
        await fetch('/api/chat/like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageId })
        });
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, likes: (m.likes || 0) + 1 } : m))
        );
      } catch (err) {
        console.warn('Erro ao curtir mensagem:', err);
      }
    }
  };

  // Import received phrase to builder
  const handleImportToBuilder = (phrase: ChatPhraseData) => {
    if (phrase.words && phrase.words.length > 0) {
      onSendToBuilder(phrase.words);
    } else {
      // Fallback: match words from allWords by hanzi
      const foundWords: Word[] = [];
      let rem = phrase.hanzi;
      for (const w of allWords) {
        if (rem.includes(w.hanzi)) {
          foundWords.push(w);
        }
      }
      if (foundWords.length > 0) {
        onSendToBuilder(foundWords);
      } else if (onNavigateToBuilder) {
        onNavigateToBuilder();
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Top Banner & Profile Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-1">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider font-bold">Comunidade de Aprendizado em Tempo Real</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Bate-papo: Compartilhamento de Frases
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Envie frases construídas no app para outros estudantes, ouça a pronúncia de cada mensagem, inspecione a estrutura gramatical e importe frases recebidas direto no seu Construtor!
          </p>
        </div>

        {/* User Identity & Live Indicator */}
        <div className="flex items-center gap-3 shrink-0 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{senderAvatar}</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                {senderName}
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="text-[10px] text-indigo-600 hover:underline cursor-pointer"
                >
                  (mudar)
                </button>
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-[10px] font-semibold text-slate-500">
                  {onlineCount} {onlineCount === 1 ? 'pessoa online' : 'pessoas online'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
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

      {/* Main Chat Layout: Rooms Sidebar + Conversation View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Col: Rooms & Fast Actions */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Salas de Prática
            </span>
            <div className="flex flex-col gap-1.5">
              {ROOMS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setActiveRoom(r.id)}
                  className={`flex flex-col text-left p-3 rounded-2xl transition-all cursor-pointer border ${
                    activeRoom === r.id
                      ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900 shadow-xs ring-1 ring-indigo-300'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold">{r.name}</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">{r.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Builder Phrase Quick Status */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-2.5 text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              Sua Frase do Construtor
            </span>

            {builderPhrase && builderPhrase.hanzi ? (
              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col gap-1">
                <span className="text-base font-bold text-indigo-950">{builderPhrase.hanzi}</span>
                <span className="font-mono text-indigo-800 font-semibold">{builderPhrase.pinyin}</span>
                <span className="text-slate-600">{builderPhrase.portuguese}</span>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-800 font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Pronta para ser enviada na conversa!
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-500 text-center">
                Você ainda não montou uma frase no Construtor.
                {onNavigateToBuilder && (
                  <button
                    type="button"
                    onClick={onNavigateToBuilder}
                    className="mt-2 block w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                  >
                    Ir ao Construtor
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right 3 Cols: Message Feed & Phrase Composer */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          
          {/* Chat Feed Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col h-[520px] overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                  <span className="text-xs">Sintonizando com os outros estudantes...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                  <MessageSquare className="w-8 h-8 text-slate-300" />
                  <span className="text-xs font-semibold">Nenhuma frase enviada nesta sala ainda.</span>
                  <span className="text-[11px]">Seja o primeiro a compartilhar uma frase construída!</span>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderName === senderName;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col gap-1 max-w-[85%] ${isMine ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      {/* Sender Header */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 px-1">
                        <span className="text-sm">{msg.avatar}</span>
                        <span className="font-bold text-slate-700">{msg.senderName}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Message Card */}
                      <div className={`p-4 rounded-3xl border shadow-xs flex flex-col gap-2.5 transition-all ${
                        isMine 
                          ? 'bg-indigo-600 text-white border-indigo-700 rounded-tr-xs' 
                          : 'bg-white text-slate-800 border-slate-200/90 rounded-tl-xs'
                      }`}>
                        
                        {/* Optional text message comment */}
                        {msg.textMessage && (
                          <p className={`text-xs pb-2 border-b ${
                            isMine ? 'border-indigo-500/60 text-indigo-100' : 'border-slate-100 text-slate-600'
                          }`}>
                            {msg.textMessage}
                          </p>
                        )}

                        {/* Built Chinese Phrase Block */}
                        <div className={`p-3 rounded-2xl flex flex-col gap-1 ${
                          isMine ? 'bg-indigo-700/80 border border-indigo-500' : 'bg-slate-50 border border-slate-200/80'
                        }`}>
                          <div className="flex items-start justify-between gap-3">
                            <span className={`text-xl sm:text-2xl font-bold tracking-wide ${isMine ? 'text-white' : 'text-slate-900'}`}>
                              {msg.phrase.hanzi}
                            </span>
                            <button
                              type="button"
                              onClick={() => speakMandarin(msg.phrase.hanzi)}
                              className={`p-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                                isMine ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-white hover:bg-slate-100 text-indigo-600 shadow-xs'
                              }`}
                              title="Ouvir pronúncia"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>

                          {msg.phrase.pinyin && (
                            <span className={`text-xs font-semibold font-mono ${isMine ? 'text-indigo-200' : 'text-indigo-800'}`}>
                              {msg.phrase.pinyin}
                            </span>
                          )}

                          {msg.phrase.portuguese && (
                            <span className={`text-xs ${isMine ? 'text-indigo-100' : 'text-slate-600'}`}>
                              {msg.phrase.portuguese}
                            </span>
                          )}

                          {/* Grammar validation badge */}
                          {msg.phrase.isValidGrammar && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Regra Gramatical Válida</span>
                            </div>
                          )}
                        </div>

                        {/* Message Action Footer: Import to Builder & Like */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleImportToBuilder(msg.phrase)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                                isMine 
                                  ? 'bg-indigo-500 hover:bg-indigo-400 text-white' 
                                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                              }`}
                              title="Carregar esta frase para praticar no Construtor"
                            >
                              <Layers className="w-3 h-3" />
                              <span>Carregar no Construtor</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleLikeMessage(msg.id)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                              isMine 
                                ? 'text-indigo-200 hover:text-white' 
                                : 'text-slate-500 hover:text-rose-600'
                            }`}
                          >
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
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

            {/* Accompanying Phrase Composer Footer */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              
              {/* Phrase source selector */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setComposerMode('from_builder')}
                    className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all ${
                      composerMode === 'from_builder' 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Usar Frase do Construtor
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerMode('quick_pick')}
                    className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all ${
                      composerMode === 'quick_pick' 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Digitar / Montar Rápido
                  </button>
                </div>

                {onOpenDictionary && (
                  <button
                    type="button"
                    onClick={onOpenDictionary}
                    className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Dicionário</span>
                  </button>
                )}
              </div>

              {/* Quick Pick / Type form if chosen */}
              {composerMode === 'quick_pick' && (
                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <input
                    type="text"
                    value={customInputText}
                    onChange={(e) => setCustomInputText(e.target.value)}
                    placeholder="Escreva a frase em Hanzi ou Pinyin (ex: 你好，我是巴西人)..."
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-indigo-500 font-medium"
                  />
                  <span className="text-[10px] text-slate-400">
                    Dica: Você também pode usar o modo principal "Construtor" para montar com regras gramaticais e enviar aqui!
                  </span>
                </div>
              )}

              {/* Active Phrase Preview to be sent */}
              {composerMode === 'from_builder' && builderPhrase && builderPhrase.hanzi && (
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="font-bold text-indigo-900 shrink-0">Frase Pronta:</span>
                    <span className="truncate font-semibold text-slate-800">{builderPhrase.hanzi}</span>
                    <span className="text-slate-500 truncate">({builderPhrase.portuguese})</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                    Validada
                  </span>
                </div>
              )}

              {/* Input row */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={accompanyingText}
                  onChange={(e) => setAccompanyingText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Mensagem ou comentário opcional (ex: O que acharam dessa frase?)..."
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-indigo-500 font-medium"
                />

                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Frase</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
