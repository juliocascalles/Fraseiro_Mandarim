import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MessageSquare, Send, Users, Volume2, Layers, Heart, 
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, Smile, 
  Plus, ShieldCheck, ArrowRight, CornerDownRight,
  Share2, Check, Copy, Hash, Compass, KeyRound, ExternalLink,
  Shuffle, LogIn, User, Trash2, Crown
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
  getDocs,
  writeBatch,
  deleteDoc
} from 'firebase/firestore';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { db, auth, initAnonymousAuth, handleFirestoreError, OperationType, isSuperUser } from '../lib/firebase';
import { Word, ChatMessage, ChatPhraseData, ChatRoom, PhraseValidationReport } from '../types';
import { speakMandarin } from '../utils/speech';
import { SentenceBuilder } from './SentenceBuilder';

export interface ChatModeProps {
  currentUser?: FirebaseUser | null;
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
  onOpenDictionary?: () => void;
}

const AVATARS = ['🐼', '🐉', '🦩', '🐯', '🦊', '🐰', '🎋', '🏮'];

// 10 Nomes reservados inspirados na cultura chinesa para as salas temáticas (Req 2)
export interface CulturalRoomTheme {
  id: string;
  name: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  icon: string;
}

export const CULTURAL_ROOM_THEMES: CulturalRoomTheme[] = [
  { id: 'dragao', name: 'Sala Dragão', hanzi: '龙', pinyin: 'Lóng', meaning: 'Poder, nobreza e prosperidade na cultura chinesa', icon: '🐉' },
  { id: 'panda', name: 'Sala Panda', hanzi: '熊猫', pinyin: 'Xióngmāo', meaning: 'Tesouro nacional chinês e símbolo de paz', icon: '🐼' },
  { id: 'jade', name: 'Sala Jade', hanzi: '玉', pinyin: 'Yù', meaning: 'Pedra preciosa de pureza, sabedoria e virtude', icon: '💎' },
  { id: 'fenix', name: 'Sala Fênix', hanzi: '凤凰', pinyin: 'Fènghuáng', meaning: 'Ave mítica de harmonia, renascimento e graça', icon: '🪶' },
  { id: 'bambu', name: 'Sala Bambu', hanzi: '竹', pinyin: 'Zhú', meaning: 'Símbolo de integridade, flexibilidade e resiliência', icon: '🎋' },
  { id: 'lotus', name: 'Sala Lótus', hanzi: '莲花', pinyin: 'Liánhuā', meaning: 'Flor pura que floresce imaculada sobre as águas', icon: '🪷' },
  { id: 'cha', name: 'Sala Chá', hanzi: '茶', pinyin: 'Chá', meaning: 'Tradição milenar da harmonia e serenidade do chá', icon: '🍵' },
  { id: 'lanterna', name: 'Sala Lanterna', hanzi: '灯笼', pinyin: 'Dēnglong', meaning: 'Símbolo das festividades chinesas, calor e esperança', icon: '🏮' },
  { id: 'seda', name: 'Sala Seda', hanzi: '丝绸', pinyin: 'Sīchóu', meaning: 'Refinamento e o legado histórico da Rota da Seda', icon: '🧵' },
  { id: 'peonia', name: 'Sala Peônia', hanzi: '牡丹', pinyin: 'Mǔdan', meaning: 'Rainha das flores chinesas, símbolo de honra e riqueza', icon: '🌺' },
];

export const ChatMode: React.FC<ChatModeProps> = ({
  currentUser,
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
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [isClearingRoom, setIsClearingRoom] = useState<boolean>(false);
  const [emptyRoomCodes, setEmptyRoomCodes] = useState<Set<string>>(new Set());
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [isDeletingRoom, setIsDeletingRoom] = useState<boolean>(false);

  // User identity & rooms created by this client
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return auth.currentUser?.uid || localStorage.getItem('chat_device_user_id') || '';
  });

  const [myCreatedRooms, setMyCreatedRooms] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chat_my_created_rooms');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const getDeviceUserId = (): string => {
    let id = localStorage.getItem('chat_device_user_id');
    if (!id) {
      id = auth.currentUser?.uid || `usr_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
      localStorage.setItem('chat_device_user_id', id);
    }
    return id;
  };

  const registerCreatedRoom = (code: string) => {
    if (!code || code === 'ZH-GERAL') return;
    setMyCreatedRooms((prev) => {
      if (prev.includes(code)) return prev;
      const updated = [...prev, code];
      try {
        localStorage.setItem('chat_my_created_rooms', JSON.stringify(updated));
      } catch (err) {
        console.warn('Erro ao registrar sala criada no localStorage:', err);
      }
      return updated;
    });
  };

  // Usuário autenticado ativo
  const activeAuthUser = currentUser || auth.currentUser;

  // Superusuário Júlio Cascalles:
  // Verificação estrita por e-mail oficial (julio.gamedesign@gmail.com).
  // Somente Júlio Cascalles possui privilégios de superusuário.
  const isCurrentUserAdmin = useMemo(() => {
    return isSuperUser(activeAuthUser);
  }, [activeAuthUser, currentUserId]);

  // Determina se o usuário atual é o criador da sala ativa
  const isRoomCreator = useMemo(() => {
    if (!currentRoomCode || currentRoomCode === 'ZH-GERAL') {
      return false; // A sala comunitária pública não pode ser limpa por participantes individuais
    }

    if (isCurrentUserAdmin) {
      return true; // Superusuário tem acesso completo
    }

    // 1. Criado localmente neste dispositivo/navegador
    if (myCreatedRooms.includes(currentRoomCode)) {
      return true;
    }

    // 2. ID ou e-mail do Firebase Auth confere com a sala
    const authUid = activeAuthUser?.uid || currentUserId;
    const authEmail = activeAuthUser?.email?.toLowerCase().trim();
    if (authUid && currentRoom?.createdBy && currentRoom.createdBy === authUid) {
      return true;
    }
    if (authEmail && currentRoom?.creatorEmail && currentRoom.creatorEmail.toLowerCase().trim() === authEmail) {
      return true;
    }

    // 3. ID do dispositivo persistido confere com createdBy
    const localUid = localStorage.getItem('chat_device_user_id');
    if (localUid && currentRoom?.createdBy && currentRoom.createdBy === localUid) {
      return true;
    }

    return false;
  }, [currentRoomCode, currentRoom, myCreatedRooms, currentUserId, isCurrentUserAdmin, activeAuthUser]);

  // Permissão para limpar mensagens da sala atual (Somente Júlio Cascalles ou o criador da sala)
  const canClearCurrentRoom = useMemo(() => {
    if (isCurrentUserAdmin) return true;
    if (!currentRoomCode || currentRoomCode === 'ZH-GERAL') return false;
    return isRoomCreator;
  }, [currentRoomCode, isCurrentUserAdmin, isRoomCreator]);

  // Permissão para excluir uma sala:
  // - Superusuário Júlio Cascalles: sem restrições (pode excluir qualquer sala)
  // - Usuário comum: SOMENTE pode excluir salas criadas por ele próprio (identificado via Google)
  const canDeleteRoom = (roomCode: string, room?: ChatRoom | null): boolean => {
    if (!roomCode || roomCode === 'ZH-GERAL') return false;
    if (isCurrentUserAdmin) return true; // Superusuário Júlio Cascalles sem restrições

    const targetRoom = room || recentRooms.find((r) => r.code === roomCode) || (roomCode === currentRoomCode ? currentRoom : null);
    const authUid = activeAuthUser?.uid || currentUserId;
    const authEmail = activeAuthUser?.email?.toLowerCase().trim();

    // Somente o criador da própria sala tem permissão para excluí-la
    if (authUid && targetRoom?.createdBy && targetRoom.createdBy === authUid) {
      return true;
    }
    if (authEmail && targetRoom?.creatorEmail && targetRoom.creatorEmail.toLowerCase().trim() === authEmail) {
      return true;
    }
    if (myCreatedRooms.includes(roomCode)) {
      return true;
    }

    return false;
  };

  // Composer State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize Anonymous Auth on load & track auth state
  useEffect(() => {
    initAnonymousAuth();
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        localStorage.setItem('chat_device_user_id', user.uid);
      }
    });
    return () => unsubAuth();
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
      const q = query(collection(db, 'rooms'), orderBy('lastActivity', 'desc'), limit(25));
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
        const creatorId = currentRoomCode === 'ZH-GERAL'
          ? 'system_community'
          : (auth.currentUser?.uid || currentUserId || getDeviceUserId());

        const initialRoom: ChatRoom = {
          id: currentRoomCode,
          code: currentRoomCode,
          name: currentRoomCode === 'ZH-GERAL' ? 'Sala Aberta Geral' : `Sala ${currentRoomCode}`,
          description: currentRoomCode === 'ZH-GERAL' 
            ? 'Compartilhamento comunitário de frases em Mandarim.' 
            : 'Sala de conversa por código compartilhado.',
          createdBy: creatorId,
          creatorName: currentRoomCode === 'ZH-GERAL' ? 'Comunidade' : senderName,
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        };

        setDoc(roomRef, initialRoom)
          .then(() => {
            if (currentRoomCode !== 'ZH-GERAL') {
              registerCreatedRoom(currentRoomCode);
            }
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

      // Rastreia se a sala atual está vazia para habilitar exclusão
      if (currentRoomCode !== 'ZH-GERAL') {
        if (loadedMessages.length === 0) {
          setEmptyRoomCodes((prev) => {
            const next = new Set(prev);
            next.add(currentRoomCode);
            return next;
          });
        } else {
          setEmptyRoomCodes((prev) => {
            if (!prev.has(currentRoomCode)) return prev;
            const next = new Set(prev);
            next.delete(currentRoomCode);
            return next;
          });
        }
      }

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

  // 1- Botão "Gerar sala": Atribui tema da cultura chinesa e limita a 10 salas (Req 2)
  const handleGenerateRoom = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      // 1. Obter todas as salas existentes para verificar o limite de 10 salas culturais
      const roomsSnap = await getDocs(collection(db, 'rooms'));
      const existingRooms: ChatRoom[] = [];
      roomsSnap.forEach((d) => {
        existingRooms.push({ id: d.id, ...d.data() } as ChatRoom);
      });
      const activeCustomRooms = existingRooms.filter((r) => r.code !== 'ZH-GERAL');

      // Limite de 10 salas culturais ativas (Req 2)
      if (activeCustomRooms.length >= 10) {
        setFeedbackNotice('Limite de 10 salas culturais atingido (10/10). Não é permitido criar mais salas. Exclua uma sala existente para liberar espaço.');
        setTimeout(() => setFeedbackNotice(null), 8000);
        setIsGenerating(false);
        return;
      }

      // 2. Encontrar o próximo nome cultural disponível dos 10 reservados
      const usedNames = new Set(
        activeCustomRooms.map((r) => (r.name || '').toLowerCase().trim())
      );
      const availableTheme = CULTURAL_ROOM_THEMES.find(
        (t) => !usedNames.has(t.name.toLowerCase().trim())
      );

      if (!availableTheme) {
        setFeedbackNotice('Todos os 10 nomes culturais já estão em uso (10/10). Exclua uma sala existente para criar uma nova.');
        setTimeout(() => setFeedbackNotice(null), 8000);
        setIsGenerating(false);
        return;
      }

      const newCode = `ZH-${availableTheme.id.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      const creatorId = auth.currentUser?.uid || currentUserId || getDeviceUserId();
      const creatorEmail = auth.currentUser?.email || '';
      const creatorDisplayName = auth.currentUser?.displayName || senderName;

      const newRoom: ChatRoom = {
        id: newCode,
        code: newCode,
        name: availableTheme.name,
        description: `${availableTheme.icon} ${availableTheme.hanzi} (${availableTheme.pinyin}) — ${availableTheme.meaning}`,
        icon: availableTheme.icon,
        createdBy: creatorId,
        creatorEmail: creatorEmail,
        creatorName: creatorDisplayName,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };

      await setDoc(doc(db, 'rooms', newCode), newRoom);
      registerCreatedRoom(newCode);
      setCurrentRoomCode(newCode);
      setRoomInputText('');
      setFeedbackNotice(`Nova sala criada com sucesso: "${availableTheme.name}" (${activeCustomRooms.length + 1}/10 salas culturais ativas).`);
      setTimeout(() => setFeedbackNotice(null), 8000);
      fetchRecentRooms();
    } catch (err) {
      const errInfo = handleFirestoreError(err, OperationType.CREATE, 'rooms');
      setFirestoreError(`Falha ao gerar sala cultural: ${errInfo.error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // 2- Campo de texto + botão "Entrar": Permite entrar na sala por código ou por nome cultural
  const handleEnterRoom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawInput = roomInputText.trim();
    if (!rawInput) {
      setFeedbackNotice('Por favor, digite o nome da sala (ex: Dragão, Panda, Jade) ou o código.');
      setTimeout(() => setFeedbackNotice(null), 4000);
      return;
    }

    // Busca nas salas ativas por nome cultural
    const matchedRoom = recentRooms.find((r) => 
      (r.name && r.name.toLowerCase().includes(rawInput.toLowerCase())) ||
      (r.code && r.code.toUpperCase() === rawInput.toUpperCase().replace(/\s+/g, ''))
    );

    if (matchedRoom) {
      setCurrentRoomCode(matchedRoom.code);
      setFeedbackNotice(`Você entrou na "${matchedRoom.name}".`);
      setTimeout(() => setFeedbackNotice(null), 5000);
      setRoomInputText('');
      return;
    }

    const cleanCode = rawInput.toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    setCurrentRoomCode(cleanCode);
    setFeedbackNotice(`Você entrou na sala "${cleanCode}".`);
    setTimeout(() => setFeedbackNotice(null), 5000);
    setRoomInputText('');
  };

  // Limpar todas as mensagens da sala atual no Firestore (Criador ou Superusuário)
  const handleClearRoom = async () => {
    if (!canClearCurrentRoom) {
      setFeedbackNotice('Apenas quem criou a sala (conta Google) ou o superusuário Júlio Cascalles têm permissão para limpá-la.');
      setTimeout(() => setFeedbackNotice(null), 4000);
      setShowClearConfirm(false);
      return;
    }
    if (isClearingRoom) return;
    setIsClearingRoom(true);
    try {
      const messagesRef = collection(db, 'rooms', currentRoomCode, 'messages');
      const snap = await getDocs(messagesRef);
      if (snap.empty) {
        setFeedbackNotice(`A sala "${currentRoomCode}" já não possui mensagens.`);
        setTimeout(() => setFeedbackNotice(null), 3000);
        setShowClearConfirm(false);
        setIsClearingRoom(false);
        return;
      }

      const batch = writeBatch(db);
      snap.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();

      if (currentRoomCode !== 'ZH-GERAL') {
        setEmptyRoomCodes((prev) => new Set(prev).add(currentRoomCode));
      }

      setShowClearConfirm(false);
      setFeedbackNotice(`A sala "${currentRoomCode}" foi limpa com sucesso (${snap.size} ${snap.size === 1 ? 'mensagem apagada' : 'mensagens apagadas'}). Como está vazia, agora ela pode ser excluída na barra lateral.`);
      setTimeout(() => setFeedbackNotice(null), 5000);
    } catch (err) {
      const errInfo = handleFirestoreError(err, OperationType.DELETE, `rooms/${currentRoomCode}/messages`);
      setFirestoreError(`Erro ao limpar sala: ${errInfo.error}`);
    } finally {
      setIsClearingRoom(false);
    }
  };

  // Excluir sala do Firebase (Superusuário, Criador Google, ou Sala Vazia)
  const handleDeleteRoom = async (roomCodeToDelete: string) => {
    if (isDeletingRoom) return;
    if (!roomCodeToDelete || roomCodeToDelete === 'ZH-GERAL') {
      setFeedbackNotice('A sala comunitária aberta ZH-GERAL é padrão e não pode ser excluída.');
      setTimeout(() => setFeedbackNotice(null), 3500);
      setRoomToDelete(null);
      return;
    }

    if (!canDeleteRoom(roomCodeToDelete)) {
      setFeedbackNotice('Permissão negada. Apenas o criador da sala (conta Google) ou o superusuário Júlio Cascalles podem excluir salas com mensagens.');
      setTimeout(() => setFeedbackNotice(null), 4000);
      setRoomToDelete(null);
      return;
    }

    setIsDeletingRoom(true);
    try {
      // 1. Limpar mensagens remanescentes da subcoleção, se houver
      const messagesRef = collection(db, 'rooms', roomCodeToDelete, 'messages');
      const snap = await getDocs(messagesRef);
      if (!snap.empty) {
        const batch = writeBatch(db);
        snap.docs.forEach((docSnap) => {
          batch.delete(docSnap.ref);
        });
        await batch.commit();
      }

      // 2. Apagar o documento da sala no Firestore
      await deleteDoc(doc(db, 'rooms', roomCodeToDelete));

      // 3. Atualizar estados locais
      setRecentRooms((prev) => prev.filter((r) => r.code !== roomCodeToDelete));
      setEmptyRoomCodes((prev) => {
        const next = new Set(prev);
        next.delete(roomCodeToDelete);
        return next;
      });

      setMyCreatedRooms((prev) => {
        const next = prev.filter((c) => c !== roomCodeToDelete);
        try {
          localStorage.setItem('chat_my_created_rooms', JSON.stringify(next));
        } catch {}
        return next;
      });

      // 4. Se a sala excluída for a sala em que o usuário está, retornar para ZH-GERAL
      if (currentRoomCode === roomCodeToDelete) {
        setCurrentRoomCode('ZH-GERAL');
      }

      setRoomToDelete(null);
      const isSuper = isCurrentUserAdmin;
      setFeedbackNotice(
        isSuper
          ? `A sala "${roomCodeToDelete}" foi excluída com sucesso pelo superusuário Júlio Cascalles.`
          : `A sala "${roomCodeToDelete}" foi excluída do bate-papo com sucesso.`
      );
      setTimeout(() => setFeedbackNotice(null), 4000);
      fetchRecentRooms();
    } catch (err) {
      const errInfo = handleFirestoreError(err, OperationType.DELETE, `rooms/${roomCodeToDelete}`);
      setFirestoreError(`Erro ao excluir sala: ${errInfo.error}`);
    } finally {
      setIsDeletingRoom(false);
    }
  };

  // Send a phrase message to Firebase Firestore
  const handleSendMessage = async () => {
    if (isSubmitting) return;

    if (!builderSequence || builderSequence.length === 0) {
      setFeedbackNotice('Monte uma frase no construtor acima para poder enviar.');
      setTimeout(() => setFeedbackNotice(null), 3500);
      return;
    }

    const isWoJiao = builderSequence.length >= 2 && 
      builderSequence[builderSequence.length - 2].id === 'wo' && 
      builderSequence[builderSequence.length - 1].id === 'jiao';

    let hanzi = builderSequence.map(w => w.hanzi).join('');
    let pinyin = builderSequence.map(w => w.label).join(' ');
    let portuguese = getNaturalTranslation(builderSequence);
    const isValid = checkIsValidSentence(builderSequence);

    // Se a frase termina com "wo jiao", colocar o nome do usuário na frente (Req 3)
    if (isWoJiao) {
      const activeName = senderName || auth.currentUser?.displayName || 'Estudante';
      hanzi = `${hanzi} ${activeName}`;
      pinyin = `${pinyin} ${activeName}`;
      portuguese = `Eu me chamo ${activeName}.`;
    }

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

                {/* Indicador de Criador da Sala */}
                {isRoomCreator ? (
                  <span className="ml-1 px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[10px] font-sans font-bold flex items-center gap-1 border border-amber-300/80 shadow-2xs">
                    <Crown className="w-3 h-3 text-amber-600" />
                    <span>Criador</span>
                  </span>
                ) : currentRoom?.creatorName && currentRoomCode !== 'ZH-GERAL' ? (
                  <span className="ml-1 text-[10px] text-indigo-700/90 font-sans font-medium">
                    Criada por: <strong className="text-indigo-950">{currentRoom.creatorName}</strong>
                  </span>
                ) : null}

                {/* Botão Limpar Sala - EXCLUSIVO DO CRIADOR DA SALA */}
                {isRoomCreator && (
                  <button
                    type="button"
                    id="btn-limpar-sala-topo"
                    onClick={() => setShowClearConfirm(true)}
                    disabled={messages.length === 0 || isClearingRoom}
                    className="ml-1 px-2 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 transition-all flex items-center gap-1 cursor-pointer font-sans disabled:opacity-40 disabled:cursor-not-allowed border border-rose-200/60"
                    title="Limpar mensagens desta sala (Apenas criador)"
                  >
                    <Trash2 className="w-3 h-3 text-rose-600" />
                    <span className="text-[10px] font-semibold">Limpar sala</span>
                  </button>
                )}
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
            
            {/* 1- Botão "Gerar sala" com tema da cultura chinesa e limite de 10 salas (Req 2) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-gerar-sala"
                onClick={handleGenerateRoom}
                disabled={isGenerating || recentRooms.filter((r) => r.code !== 'ZH-GERAL').length >= 10}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer shadow-xs hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  recentRooms.filter((r) => r.code !== 'ZH-GERAL').length >= 10
                    ? 'Limite de 10 salas culturais atingido (10/10). Exclua uma sala para liberar espaço.'
                    : 'Criar uma nova sala com tema da cultura chinesa (limite de 10 salas)'
                }
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>
                  {isGenerating 
                    ? 'Gerando...' 
                    : recentRooms.filter((r) => r.code !== 'ZH-GERAL').length >= 10 
                      ? 'Limite atingido (10/10)' 
                      : 'Gerar sala'}
                </span>
              </button>

              <span 
                className={`text-[11px] font-bold px-2 py-1 rounded-xl border ${
                  recentRooms.filter((r) => r.code !== 'ZH-GERAL').length >= 10
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
                title="Total de salas culturais ativas / Limite máximo de 10 salas"
              >
                {recentRooms.filter((r) => r.code !== 'ZH-GERAL').length}/10
              </span>
            </div>

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
                  onChange={(e) => setRoomInputText(e.target.value)}
                  placeholder="Nome (ex: Dragão, Jade)"
                  maxLength={30}
                  className="w-44 sm:w-52 pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold focus:outline-indigo-500 placeholder:text-slate-400 placeholder:font-normal transition-colors"
                />
              </div>

              <button
                type="submit"
                id="btn-entrar-sala"
                disabled={!roomInputText.trim()}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed"
                title="Entrar na sala com o nome digitado"
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
              Ao clicar em <strong>"Gerar sala"</strong>, é criada uma sala inspirada na cultura chinesa (ex: <strong>Sala Dragão</strong>, <strong>Sala Panda</strong>, <strong>Sala Jade</strong> — máximo 10 salas). Na lista ao lado, são exibidos os <strong>nomes das salas</strong> no lugar dos códigos.
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
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-base shrink-0 leading-none">🌐</span>
                    <span className="text-xs font-bold truncate">Sala Aberta Geral</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-indigo-700 border border-indigo-200 font-bold">
                    Sala Aberta
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5">Comunidade aberta HSK 1-2</span>
              </button>

              {/* Other recent active rooms */}
              {recentRooms
                .filter((r) => r.code !== 'ZH-GERAL')
                .map((r) => {
                  const isThisRoomEmpty =
                    (r.code === currentRoomCode && messages.length === 0 && !isLoadingMessages) ||
                    emptyRoomCodes.has(r.code);
                  const canDeleteThisRoom = canDeleteRoom(r.code, r);
                  const isCreatorOfThisRoom = Boolean(
                    (auth.currentUser?.uid && r.createdBy === auth.currentUser.uid) ||
                    (auth.currentUser?.email && r.creatorEmail && r.creatorEmail.toLowerCase() === auth.currentUser.email.toLowerCase()) ||
                    myCreatedRooms.includes(r.code)
                  );

                  return (
                    <div
                      key={r.id}
                      onClick={() => setCurrentRoomCode(r.code)}
                      className={`group flex flex-col text-left p-3 rounded-2xl transition-all cursor-pointer border ${
                        currentRoomCode === r.code
                          ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900 shadow-xs ring-1 ring-indigo-300'
                          : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-base shrink-0 leading-none">{r.icon || '🏮'}</span>
                          <span className="text-xs font-bold truncate text-slate-900">{r.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-indigo-700 border border-indigo-200 font-bold truncate max-w-[110px]">
                            {r.name}
                          </span>

                          {/* Botão de lixeira na sala correspondente (Superusuário, Criador Google ou Sala Vazia) */}
                          {canDeleteThisRoom && (
                            <button
                              type="button"
                              id={`btn-excluir-sala-${r.code}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setRoomToDelete(r.code);
                              }}
                              className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 hover:border-rose-300 transition-all cursor-pointer shadow-2xs active:scale-90"
                              title={
                                isCurrentUserAdmin
                                  ? '👑 Superusuário Júlio Cascalles: excluir sala sem restrições'
                                  : 'Você é o criador desta sala (Conta Google). Clique para excluir.'
                              }
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {r.description && (
                        <span className="text-[11px] text-slate-500 mt-0.5 truncate">{r.description}</span>
                      )}

                      {/* Status da sala */}
                      <div className="flex items-center justify-between mt-1 text-[10px]">
                        {isCurrentUserAdmin ? (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            👑 Exclusão liberada
                          </span>
                        ) : isCreatorOfThisRoom ? (
                          <span className="text-indigo-700 font-semibold flex items-center gap-1">
                            Criada por você
                          </span>
                        ) : isThisRoomEmpty ? (
                          <span className="text-rose-600 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Sala vazia
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[9px]">Ativa</span>
                        )}

                        {canDeleteThisRoom && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setRoomToDelete(r.code);
                            }}
                            className="text-[9px] text-rose-500 hover:text-rose-700 underline font-semibold cursor-pointer"
                          >
                            Excluir
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Canto esquerdo inferior: Avatar e Identidade do Usuário (Req 6 e Google Auth) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              Meu Perfil Google
            </span>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100/70 border border-indigo-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs overflow-hidden">
                {auth.currentUser?.photoURL ? (
                  <img
                    src={auth.currentUser.photoURL}
                    alt="Foto do perfil"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  senderAvatar
                )}
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {auth.currentUser?.displayName || senderName}
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

                {auth.currentUser?.email && (
                  <span className="text-[10px] text-slate-500 truncate" title={auth.currentUser.email}>
                    {auth.currentUser.email}
                  </span>
                )}

                {isCurrentUserAdmin ? (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[9px] flex items-center gap-1">
                      👑 Superusuário
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-[10px] font-semibold text-emerald-700 truncate">
                      Conta Google Ativa
                    </span>
                  </div>
                )}
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
              userName={senderName || auth.currentUser?.displayName || 'Estudante'}
            />
          </div>

          {/* 2. Área de Mensagens (Abaixo do construtor - Req 2) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col h-[460px] overflow-hidden">
            
            {/* Header da Área de Mensagens */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  Mensagens da <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg">{currentRoom?.name || currentRoomCode}</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  ({messages.length} {messages.length === 1 ? 'frase' : 'frases'})
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Botão Limpar Sala */}
                {canClearCurrentRoom && (
                  <button
                    type="button"
                    id="btn-limpar-sala-mensagens"
                    onClick={() => setShowClearConfirm(true)}
                    disabled={messages.length === 0 || isClearingRoom}
                    className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer px-2 py-0.5 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-200"
                    title={isCurrentUserAdmin ? "Limpar todas as frases (Superusuário Júlio Cascalles)" : "Limpar frases desta sala (Criador)"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Limpar sala</span>
                  </button>
                )}

                {/* Botão Excluir Sala no topo da conversa */}
                {currentRoomCode !== 'ZH-GERAL' && canDeleteRoom(currentRoomCode, currentRoom) && (
                  <button
                    type="button"
                    id="btn-excluir-sala-header"
                    onClick={() => setRoomToDelete(currentRoomCode)}
                    disabled={isDeletingRoom}
                    className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:text-rose-800 transition-colors cursor-pointer px-2 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200"
                    title={isCurrentUserAdmin ? "Excluir sala sem restrições (Superusuário Júlio Cascalles)" : "Excluir sala"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir sala</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={scrollToBottom}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                  title="Rolar para as mensagens mais recentes"
                >
                  Rolar ao final ↓
                </button>
              </div>
            </div>

            {/* Confirmação para Limpar Sala */}
            <AnimatePresence>
              {showClearConfirm && canClearCurrentRoom && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden shrink-0"
                >
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-900 text-xs shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                        <Trash2 className="w-4 h-4 text-rose-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5 text-amber-600" />
                          <strong className="block font-semibold">Limpar frases da sala {currentRoomCode}?</strong>
                        </div>
                        <span className="text-[11px] text-rose-700">
                          {isCurrentUserAdmin
                            ? `Superusuário Júlio Cascalles: você tem permissão irrestrita para limpar todas as ${messages.length} ${messages.length === 1 ? 'mensagem' : 'mensagens'}.`
                            : `Como criador desta sala (conta Google), você apagará todas as ${messages.length} ${messages.length === 1 ? 'mensagem' : 'mensagens'} para todos os participantes.`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setShowClearConfirm(false)}
                        disabled={isClearingRoom}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-100 text-rose-700 font-medium text-xs cursor-pointer transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        id="btn-confirmar-limpeza"
                        onClick={handleClearRoom}
                        disabled={isClearingRoom}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        {isClearingRoom ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Limpando...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Confirmar limpeza</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                  {currentRoomCode !== 'ZH-GERAL' && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px]">
                      <Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>Salas vazias podem ser excluídas pelo botão de lixeira na barra lateral de <strong>"Salas ativas"</strong>.</span>
                    </div>
                  )}
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

      {/* Modal de confirmação para excluir sala vazia */}
      <AnimatePresence>
        {roomToDelete && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 flex flex-col gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-slate-900 text-sm">Excluir sala {roomToDelete}?</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {isCurrentUserAdmin
                      ? 'Autenticado como Superusuário Júlio Cascalles. Esta sala será excluída do bate-papo sem restrições.'
                      : 'Esta sala será removida permanentemente do bate-papo.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRoomToDelete(null)}
                  disabled={isDeletingRoom}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  id="btn-confirmar-exclusao-sala"
                  onClick={() => handleDeleteRoom(roomToDelete)}
                  disabled={isDeletingRoom}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {isDeletingRoom ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Excluindo...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir sala</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
