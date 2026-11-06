import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Volume2, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Coins, 
  Trophy, 
  Flame, 
  Lock, 
  Unlock, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw,
  Clock,
  User,
  MapPin,
  Zap,
  Package,
  Award,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TIME_REEL, 
  SUBJECT_REEL, 
  LOCATION_REEL, 
  VERB_REEL, 
  OBJECT_REEL,
  SlotSentence,
  createSlotSentence,
  generateSlotOptions
} from '../utils/slotMachineData';
import { speakMandarin } from '../utils/speech';

export const SlotMachineMode: React.FC = () => {
  // Índices selecionados para cada uma das 5 faixas
  const [timeIdx, setTimeIdx] = useState<number>(0);
  const [subjIdx, setSubjIdx] = useState<number>(2); // Ele (他)
  const [locIdx, setLocIdx] = useState<number>(0);  // 在超市
  const [verbIdx, setVerbIdx] = useState<number>(0); // 卖
  const [objIdx, setObjIdx] = useState<number>(0);   // 苹果

  // Filtro de preposição de local (Item 1: zài, qù, ou xiǎng qù)
  const [locationPrepFilter, setLocationPrepFilter] = useState<'all' | 'zai' | 'qu' | 'xiang_qu'>('all');

  // Travas individuais das faixas (Hold / Lock)
  const [locks, setLocks] = useState<boolean[]>([false, false, false, false, false]);

  // Estados de rotação e animação da máquina
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinningReels, setSpinningReels] = useState<boolean[]>([false, false, false, false, false]);
  const [leverPulled, setLeverPulled] = useState<boolean>(false);

  // Frase atual e opções do desafio de tradução
  const [currentSentence, setCurrentSentence] = useState<SlotSentence | null>(null);
  const [options, setOptions] = useState<{ id: string; text: string; isCorrect: boolean }[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  // Pontuação e moedas
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [walletYuans, setWalletYuans] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('shop_wallet_yuans');
      return saved ? parseInt(saved, 10) : 500;
    } catch {
      return 500;
    }
  });

  // Temporizadores para animação de parada progressiva
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  // Inicialização com a frase exemplo especificada pelo usuário:
  // "晚上 他 在超市 卖 苹果 = Ele vende maçãs no supermercado à noite."
  useEffect(() => {
    const initialSentence = createSlotSentence(
      TIME_REEL[0],     // 晚上
      SUBJECT_REEL[2],  // 他
      LOCATION_REEL[0], // 在超市
      VERB_REEL[0],     // 卖
      OBJECT_REEL[2]    // 苹果
    );
    setCurrentSentence(initialSentence);
    setOptions(generateSlotOptions(initialSentence));
  }, []);

  const toggleLock = (index: number) => {
    if (isSpinning) return;
    setLocks(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  // Carrega o exemplo exato pedido pelo usuário: "他想去超市买意大利面"
  const loadTargetExample = () => {
    if (isSpinning) return;
    const targetSubj = 2; // 他
    const targetLoc = LOCATION_REEL.findIndex(l => l.id === 'chaoshi_xiangqu'); // 想去超市
    const targetVerb = VERB_REEL.findIndex(v => v.id === 'mai_buy'); // 买
    const targetObj = OBJECT_REEL.findIndex(o => o.id === 'yidalimian'); // 意大利面
    const targetTime = 0; // 晚上

    setTimeIdx(targetTime);
    setSubjIdx(targetSubj);
    setLocIdx(targetLoc >= 0 ? targetLoc : 0);
    setVerbIdx(targetVerb >= 0 ? targetVerb : 0);
    setObjIdx(targetObj >= 0 ? targetObj : 0);

    const s = createSlotSentence(
      TIME_REEL[targetTime],
      SUBJECT_REEL[targetSubj],
      LOCATION_REEL[targetLoc >= 0 ? targetLoc : 0],
      VERB_REEL[targetVerb >= 0 ? targetVerb : 0],
      OBJECT_REEL[targetObj >= 0 ? targetObj : 0]
    );
    setCurrentSentence(s);
    setOptions(generateSlotOptions(s));
    setHasAnswered(false);
    setSelectedOptionId(null);
  };

  const handlePullLever = () => {
    if (isSpinning) return;

    // Efeito de alavanca puxada
    setLeverPulled(true);
    setTimeout(() => setLeverPulled(false), 300);

    // Inicia rotação
    setIsSpinning(true);
    setHasAnswered(false);
    setSelectedOptionId(null);
    setSpinningReels([!locks[0], !locks[1], !locks[2], !locks[3], !locks[4]]);

    // Limpa timers anteriores
    timerRefs.current.forEach(t => clearTimeout(t));
    timerRefs.current = [];

    // Escolhe novos índices aleatórios respeitando compatibilidade de verbos/objetos
    const nextTime = locks[0] ? timeIdx : Math.floor(Math.random() * TIME_REEL.length);
    const nextSubj = locks[1] ? subjIdx : Math.floor(Math.random() * SUBJECT_REEL.length);

    // Faixa de local respeitando filtro selecionado (zai, qu, xiang_qu)
    let candidateLocs = LOCATION_REEL;
    if (locationPrepFilter !== 'all') {
      candidateLocs = LOCATION_REEL.filter(l => l.prep === locationPrepFilter);
    }
    const chosenLocItem = candidateLocs[Math.floor(Math.random() * candidateLocs.length)];
    const nextLoc = locks[2] ? locIdx : LOCATION_REEL.findIndex(l => l.id === chosenLocItem.id);

    const nextVerb = locks[3] ? verbIdx : Math.floor(Math.random() * VERB_REEL.length);

    // Para o objeto: escolhe um objeto compatível com o verbo escolhido
    const chosenVerb = VERB_REEL[nextVerb];
    const matchingObjects = OBJECT_REEL.filter(obj => chosenVerb.allowedObjectIds.includes(obj.id));
    const randomObjItem = matchingObjects.length > 0 
      ? matchingObjects[Math.floor(Math.random() * matchingObjects.length)]
      : OBJECT_REEL[Math.floor(Math.random() * OBJECT_REEL.length)];
    
    const nextObj = locks[4] ? objIdx : OBJECT_REEL.findIndex(o => o.id === randomObjItem.id);

    // Paradas escalonadas das faixas (estilo caça-níqueis autêntico)
    // Faixa 1 (Tempo): 600ms
    const t0 = setTimeout(() => {
      if (!locks[0]) setTimeIdx(nextTime);
      setSpinningReels(prev => [false, prev[1], prev[2], prev[3], prev[4]]);
    }, 600);

    // Faixa 2 (Sujeito): 900ms
    const t1 = setTimeout(() => {
      if (!locks[1]) setSubjIdx(nextSubj);
      setSpinningReels(prev => [false, false, prev[2], prev[3], prev[4]]);
    }, 950);

    // Faixa 3 (Local com 'zai'): 1300ms
    const t2 = setTimeout(() => {
      if (!locks[2]) setLocIdx(nextLoc);
      setSpinningReels(prev => [false, false, false, prev[3], prev[4]]);
    }, 1300);

    // Faixa 4 (Verbo): 1650ms
    const t3 = setTimeout(() => {
      if (!locks[3]) setVerbIdx(nextVerb);
      setSpinningReels(prev => [false, false, false, false, prev[4]]);
    }, 1650);

    // Faixa 5 (Objeto) e Finalização: 2000ms
    const t4 = setTimeout(() => {
      if (!locks[4]) setObjIdx(nextObj >= 0 ? nextObj : 0);
      setSpinningReels([false, false, false, false, false]);
      setIsSpinning(false);

      // Constrói a nova frase gerada e suas opções de múltipla escolha
      const newSentence = createSlotSentence(
        TIME_REEL[nextTime],
        SUBJECT_REEL[nextSubj],
        LOCATION_REEL[nextLoc],
        VERB_REEL[nextVerb],
        OBJECT_REEL[nextObj >= 0 ? nextObj : 0]
      );
      setCurrentSentence(newSentence);
      setOptions(generateSlotOptions(newSentence));

      // Pronuncia a frase em mandarim automaticamente
      speakMandarin(newSentence.chinese);
    }, 2000);

    timerRefs.current = [t0, t1, t2, t3, t4];
  };

  // Trata a resposta do usuário
  const handleSelectOption = (opt: { id: string; text: string; isCorrect: boolean }) => {
    if (hasAnswered || isSpinning || !currentSentence) return;

    setSelectedOptionId(opt.id);
    setHasAnswered(true);

    if (opt.isCorrect) {
      const reward = 25;
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setScore(prev => prev + 10 + newStreak * 2);

      const newWallet = walletYuans + reward;
      setWalletYuans(newWallet);
      try {
        localStorage.setItem('shop_wallet_yuans', newWallet.toString());
      } catch {}
    } else {
      setStreak(0);
    }
  };

  const currentTimeItem = TIME_REEL[timeIdx];
  const currentSubjItem = SUBJECT_REEL[subjIdx];
  const currentLocItem = LOCATION_REEL[locIdx];
  const currentVerbItem = VERB_REEL[verbIdx];
  const currentObjItem = OBJECT_REEL[objIdx];

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Top Banner da Máquina de Frases */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-700 to-indigo-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden border border-amber-300/30">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-9xl font-serif">
          机
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 flex items-center justify-center font-black text-2xl shadow-lg shrink-0 border border-amber-200">
              🎰
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                  <span>Caça-Níqueis de Frases</span>
                  <span className="text-amber-200 font-serif text-lg">老虎机 (Lǎohǔjī)</span>
                </h2>
                <span className="bg-amber-400/20 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300/40 uppercase">
                  Modo Sintaxe 1.2026.11.05
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 font-medium mt-0.5">
                Rola as 5 faixas gramaticais, monta frases completas e adivinha a tradução correta!
              </p>
            </div>
          </div>

          {/* Painel de Pontos, Streak e Moedas */}
          <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 border border-amber-400/30 backdrop-blur-xs text-xs font-bold text-amber-200 shadow-inner">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Sequência:</span>
              <span className="text-white font-black text-sm">{streak}</span>
              {bestStreak > 0 && (
                <span className="text-[10px] text-amber-300/80 ml-1">
                  (Recorde: {bestStreak})
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 border border-amber-400/30 backdrop-blur-xs text-xs font-bold text-amber-200 shadow-inner">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Pontos:</span>
              <span className="text-white font-black text-sm">{score}</span>
            </div>

            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 border border-amber-400/30 backdrop-blur-xs text-xs font-bold text-amber-200 shadow-inner"
              title="Moedas do caixa integradas à loja"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 font-black text-sm">¥{walletYuans}</span>
            </div>
          </div>
        </div>

        {/* Mini Guia da Fórmula de Sintaxe Mandarim */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 overflow-x-auto text-[11px] font-semibold text-rose-100 pb-1">
          <span className="bg-white/15 px-2 py-0.5 rounded-md text-amber-200 font-bold uppercase text-[9px] shrink-0">
            Fórmula Sintática:
          </span>
          <span className="shrink-0 text-cyan-200">1. Tempo (时间)</span>
          <span className="opacity-40">➔</span>
          <span className="shrink-0 text-emerald-200">2. Sujeito (主语)</span>
          <span className="opacity-40">➔</span>
          <span className="shrink-0 text-amber-200">3. Local: 在 / 去 / 想去 + 地点</span>
          <span className="opacity-40">➔</span>
          <span className="shrink-0 text-rose-200">4. Verbo (动词)</span>
          <span className="opacity-40">➔</span>
          <span className="shrink-0 text-indigo-200">5. Objeto (宾语)</span>
        </div>

        {/* Filtros de Preposição de Local e Botão Exemplo do Usuário */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-amber-300 font-bold text-[11px] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" /> Preposição de Local:
            </span>
            <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-amber-400/30 text-[10px]">
              <button
                type="button"
                onClick={() => setLocationPrepFilter('all')}
                className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                  locationPrepFilter === 'all' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                }`}
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => setLocationPrepFilter('zai')}
                className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                  locationPrepFilter === 'zai' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                }`}
                title="Ação ocorrendo dentro do local (在 + Local)"
              >
                在 (No local)
              </button>
              <button
                type="button"
                onClick={() => setLocationPrepFilter('qu')}
                className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                  locationPrepFilter === 'qu' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                }`}
                title="Deslocamento ao local para realizar a ação (去 + Local)"
              >
                去 (Indo)
              </button>
              <button
                type="button"
                onClick={() => setLocationPrepFilter('xiang_qu')}
                className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                  locationPrepFilter === 'xiang_qu' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                }`}
                title="Intenção de ir ao local para realizar a ação (想去 + Local)"
              >
                想去 (Quer ir)
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={loadTargetExample}
            disabled={isSpinning}
            className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="Carregar exemplo: 他想去超市买意大利面 (Ele quer ir ao supermercado comprar macarrão)"
          >
            <span>🍝</span>
            <span>Exemplo: 想去 (Quer ir comprar macarrão)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CORPO PRINCIPAL DO CAÇA-NÍQUEIS                                          */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border-4 border-amber-500/80 rounded-3xl p-4 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col gap-6 text-white">
        
        {/* Luzes decorativas do topo da máquina */}
        <div className="flex items-center justify-between px-2 pb-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold text-amber-300/90 uppercase tracking-widest ml-1 font-mono">
              JACKPOT MANDARIM CASINO
            </span>
          </div>

          <div className="text-[11px] text-slate-400 font-medium hidden sm:flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Dica: Trave faixas com o botão 🔒 para treinar variações!</span>
          </div>
        </div>

        {/* GABINETE DAS 5 FAIXAS (REELS) + ALAVANCA LATERAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
          
          {/* As 5 Colunas Rotativas (10 colunas em tela grande) */}
          <div className="lg:col-span-10 grid grid-cols-5 gap-1 sm:gap-2.5 md:gap-3 bg-slate-950/85 p-2 sm:p-3.5 md:p-4 rounded-2xl border-2 border-slate-700 shadow-inner">
            
            {/* Faixa 1: Tempo */}
            <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
              <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-cyan-300 uppercase px-0.5 sm:px-1">
                <span className="flex items-center gap-0.5 sm:gap-1 truncate"><Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> Tempo</span>
                <span className="opacity-60 hidden md:inline">1</span>
              </div>
              
              <div className={`relative h-24 sm:h-32 md:h-36 rounded-xl border-2 flex flex-col items-center justify-center p-1 sm:p-2 text-center transition-all overflow-hidden ${
                spinningReels[0] 
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-cyan-500/20 shadow-lg' 
                  : 'border-slate-700 bg-slate-900/90'
              }`}>
                {spinningReels[0] ? (
                  <div className="flex flex-col items-center justify-center gap-1 animate-pulse">
                    <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 animate-spin" />
                    <span className="text-[9px] sm:text-[10px] text-cyan-300 font-mono">rolando...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 max-w-full">
                    <span className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-cyan-200 truncate max-w-full">
                      {currentTimeItem.hanzi}
                    </span>
                    <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-cyan-400 truncate max-w-full">
                      {currentTimeItem.pinyin}
                    </span>
                    <span className="text-[9px] sm:text-[11px] md:text-xs text-slate-300 font-medium capitalize truncate max-w-full">
                      {currentTimeItem.pt}
                    </span>
                  </div>
                )}
              </div>

              {/* Botão Travar Faixa 1 */}
              <button
                type="button"
                onClick={() => toggleLock(0)}
                disabled={isSpinning}
                className={`w-full py-1 px-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  locks[0]
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                }`}
                title={locks[0] ? 'Faixa travada (não irá girar)' : 'Travar esta palavra'}
              >
                {locks[0] ? <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <Unlock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                <span className="hidden min-[380px]:inline">{locks[0] ? 'Travado' : 'Travar'}</span>
              </button>
            </div>

            {/* Faixa 2: Sujeito */}
            <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
              <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-emerald-300 uppercase px-0.5 sm:px-1">
                <span className="flex items-center gap-0.5 sm:gap-1 truncate"><User className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> Sujeito</span>
                <span className="opacity-60 hidden md:inline">2</span>
              </div>
              
              <div className={`relative h-24 sm:h-32 md:h-36 rounded-xl border-2 flex flex-col items-center justify-center p-1 sm:p-2 text-center transition-all overflow-hidden ${
                spinningReels[1] 
                  ? 'border-emerald-400 bg-emerald-950/40 shadow-emerald-500/20 shadow-lg' 
                  : 'border-slate-700 bg-slate-900/90'
              }`}>
                {spinningReels[1] ? (
                  <div className="flex flex-col items-center justify-center gap-1 animate-pulse">
                    <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 animate-spin" />
                    <span className="text-[9px] sm:text-[10px] text-emerald-300 font-mono">rolando...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 max-w-full">
                    <span className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-emerald-200 truncate max-w-full">
                      {currentSubjItem.hanzi}
                    </span>
                    <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-emerald-400 truncate max-w-full">
                      {currentSubjItem.pinyin}
                    </span>
                    <span className="text-[9px] sm:text-[11px] md:text-xs text-slate-300 font-medium capitalize truncate max-w-full">
                      {currentSubjItem.pt}
                    </span>
                  </div>
                )}
              </div>

              {/* Botão Travar Faixa 2 */}
              <button
                type="button"
                onClick={() => toggleLock(1)}
                disabled={isSpinning}
                className={`w-full py-1 px-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  locks[1]
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                }`}
                title={locks[1] ? 'Faixa travada (não irá girar)' : 'Travar esta palavra'}
              >
                {locks[1] ? <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <Unlock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                <span className="hidden min-[380px]:inline">{locks[1] ? 'Travado' : 'Travar'}</span>
              </button>
            </div>

            {/* Faixa 3: Local com 'zai' */}
            <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
              <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-amber-300 uppercase px-0.5 sm:px-1">
                <span className="flex items-center gap-0.5 sm:gap-1 truncate"><MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> Local</span>
                <span className="opacity-60 hidden md:inline">3</span>
              </div>
              
              <div className={`relative h-24 sm:h-32 md:h-36 rounded-xl border-2 flex flex-col items-center justify-center p-1 sm:p-2 text-center transition-all overflow-hidden ${
                spinningReels[2] 
                  ? 'border-amber-400 bg-amber-950/40 shadow-amber-500/20 shadow-lg' 
                  : 'border-slate-700 bg-slate-900/90'
              }`}>
                {spinningReels[2] ? (
                  <div className="flex flex-col items-center justify-center gap-1 animate-pulse">
                    <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 animate-spin" />
                    <span className="text-[9px] sm:text-[10px] text-amber-300 font-mono">rolando...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 max-w-full">
                    <span className="text-sm min-[380px]:text-base sm:text-xl md:text-2xl font-serif font-black text-amber-200 truncate max-w-full">
                      {currentLocItem.hanzi}
                    </span>
                    <span className="text-[9px] min-[380px]:text-[10px] sm:text-xs md:text-sm font-semibold text-amber-400 truncate max-w-full">
                      {currentLocItem.pinyin}
                    </span>
                    <span className="text-[8px] min-[380px]:text-[9px] sm:text-[11px] md:text-xs text-slate-300 font-medium capitalize truncate max-w-full">
                      {currentLocItem.pt}
                    </span>
                  </div>
                )}
              </div>

              {/* Botão Travar Faixa 3 */}
              <button
                type="button"
                onClick={() => toggleLock(2)}
                disabled={isSpinning}
                className={`w-full py-1 px-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  locks[2]
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                }`}
                title={locks[2] ? 'Faixa travada (não irá girar)' : 'Travar esta palavra'}
              >
                {locks[2] ? <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <Unlock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                <span className="hidden min-[380px]:inline">{locks[2] ? 'Travado' : 'Travar'}</span>
              </button>
            </div>

            {/* Faixa 4: Verbo Principal */}
            <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
              <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-rose-300 uppercase px-0.5 sm:px-1">
                <span className="flex items-center gap-0.5 sm:gap-1 truncate"><Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> Verbo</span>
                <span className="opacity-60 hidden md:inline">4</span>
              </div>
              
              <div className={`relative h-24 sm:h-32 md:h-36 rounded-xl border-2 flex flex-col items-center justify-center p-1 sm:p-2 text-center transition-all overflow-hidden ${
                spinningReels[3] 
                  ? 'border-rose-400 bg-rose-950/40 shadow-rose-500/20 shadow-lg' 
                  : 'border-slate-700 bg-slate-900/90'
              }`}>
                {spinningReels[3] ? (
                  <div className="flex flex-col items-center justify-center gap-1 animate-pulse">
                    <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 animate-spin" />
                    <span className="text-[9px] sm:text-[10px] text-rose-300 font-mono">rolando...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 max-w-full">
                    <span className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-rose-200 truncate max-w-full">
                      {currentVerbItem.hanzi}
                    </span>
                    <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-rose-400 truncate max-w-full">
                      {currentVerbItem.pinyin}
                    </span>
                    <span className="text-[9px] sm:text-[11px] md:text-xs text-slate-300 font-medium capitalize truncate max-w-full">
                      {currentVerbItem.lemma}
                    </span>
                  </div>
                )}
              </div>

              {/* Botão Travar Faixa 4 */}
              <button
                type="button"
                onClick={() => toggleLock(3)}
                disabled={isSpinning}
                className={`w-full py-1 px-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  locks[3]
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                }`}
                title={locks[3] ? 'Faixa travada (não irá girar)' : 'Travar esta palavra'}
              >
                {locks[3] ? <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <Unlock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                <span className="hidden min-[380px]:inline">{locks[3] ? 'Travado' : 'Travar'}</span>
              </button>
            </div>

            {/* Faixa 5: Objeto */}
            <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
              <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-indigo-300 uppercase px-0.5 sm:px-1">
                <span className="flex items-center gap-0.5 sm:gap-1 truncate"><Package className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> Objeto</span>
                <span className="opacity-60 hidden md:inline">5</span>
              </div>
              
              <div className={`relative h-24 sm:h-32 md:h-36 rounded-xl border-2 flex flex-col items-center justify-center p-1 sm:p-2 text-center transition-all overflow-hidden ${
                spinningReels[4] 
                  ? 'border-indigo-400 bg-indigo-950/40 shadow-indigo-500/20 shadow-lg' 
                  : 'border-slate-700 bg-slate-900/90'
              }`}>
                {spinningReels[4] ? (
                  <div className="flex flex-col items-center justify-center gap-1 animate-pulse">
                    <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 animate-spin" />
                    <span className="text-[9px] sm:text-[10px] text-indigo-300 font-mono">rolando...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 max-w-full">
                    <span className="text-base min-[380px]:text-lg sm:text-2xl md:text-3xl font-serif font-black text-indigo-200 truncate max-w-full">
                      {currentObjItem.hanzi}
                    </span>
                    <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-indigo-400 truncate max-w-full">
                      {currentObjItem.pinyin}
                    </span>
                    <span className="text-[9px] sm:text-[11px] md:text-xs text-slate-300 font-medium capitalize truncate max-w-full">
                      {currentObjItem.pt}
                    </span>
                  </div>
                )}
              </div>

              {/* Botão Travar Faixa 5 */}
              <button
                type="button"
                onClick={() => toggleLock(4)}
                disabled={isSpinning}
                className={`w-full py-1 px-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  locks[4]
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                }`}
                title={locks[4] ? 'Faixa travada (não irá girar)' : 'Travar esta palavra'}
              >
                {locks[4] ? <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <Unlock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                <span className="hidden min-[380px]:inline">{locks[4] ? 'Travado' : 'Travar'}</span>
              </button>
            </div>
          </div>

          {/* ALAVANCA LATERAL & BOTÃO DE GIRO (2 colunas em desktop, flexível em mobile) */}
          <div className="lg:col-span-2 flex flex-row lg:flex-col items-center justify-center gap-2.5 sm:gap-3 py-1 sm:py-2 w-full">
            
            {/* Alavanca Estilizada */}
            <button
              type="button"
              onClick={handlePullLever}
              disabled={isSpinning}
              className="group relative flex flex-col items-center cursor-pointer disabled:cursor-not-allowed select-none shrink-0"
              title="Puxar alavanca para girar as faixas!"
            >
              {/* Top Knob da Alavanca */}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-rose-700 via-red-500 to-amber-300 border-2 sm:border-3 border-amber-200 shadow-xl flex items-center justify-center font-bold text-base sm:text-lg text-white transition-all transform ${
                leverPulled ? 'translate-y-4 sm:translate-y-6 scale-90' : 'group-hover:scale-105 group-hover:-translate-y-1'
              }`}>
                🎰
              </div>
              
              {/* Haste metálica da Alavanca */}
              <div className={`w-2.5 sm:w-3 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-b-md shadow-md transition-all ${
                leverPulled ? 'h-6 sm:h-8' : 'h-10 sm:h-16'
              }`} />

              {/* Base da Alavanca */}
              <div className="w-12 sm:w-14 h-5 sm:h-6 rounded-t-xl bg-slate-800 border border-slate-600 shadow-inner flex items-center justify-center">
                <span className="text-[8px] sm:text-[9px] font-black text-amber-400 tracking-wider">PULL</span>
              </div>
            </button>

            {/* Botão de Giro Principal */}
            <button
              type="button"
              onClick={handlePullLever}
              disabled={isSpinning}
              className={`flex-1 lg:w-full py-3 sm:py-3.5 px-3 sm:px-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                isSpinning
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 border-2 border-amber-200 shadow-amber-500/20'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Rolando...' : 'Girar Faixas'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FRASE FORMADA & DESAFIO DE TRADUÇÃO                                      */}
        {/* ========================================================================= */}
        {currentSentence && !isSpinning && (
          <div className="bg-slate-950/90 border border-slate-700 rounded-2xl p-4 sm:p-6 flex flex-col gap-5 animate-fadeIn">
            
            {/* Header da Frase Formada */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Frase Formada na Roleta:
                </span>

                {/* Exibição em ideogramas com destaque por blocos */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <div className="text-2xl sm:text-3xl font-serif font-black tracking-wide text-white">
                    <span className="text-cyan-300">{currentSentence.time.hanzi}</span>
                    <span className="text-emerald-300 ml-1">{currentSentence.subject.hanzi}</span>
                    <span className="text-amber-300 ml-1">{currentSentence.location.hanzi}</span>
                    <span className="text-rose-300 ml-1">{currentSentence.verb.hanzi}</span>
                    <span className="text-indigo-300 ml-1">{currentSentence.object.hanzi}</span>
                  </div>

                  {/* Botão de Áudio */}
                  <button
                    type="button"
                    onClick={() => speakMandarin(currentSentence.chinese)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-300/30 text-xs font-bold transition-colors cursor-pointer"
                    title="Ouvir a frase completa em mandarim nativo"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Ouvir</span>
                  </button>
                </div>

                <div className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">
                  {currentSentence.pinyin}
                </div>
              </div>

              {/* Tag com a regra de sintaxe em tempo real */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-[11px] text-slate-300 max-w-xs self-start sm:self-auto">
                <span className="font-bold text-amber-300 block mb-0.5">Sintaxe da Frase:</span>
                <span className="text-cyan-300">{currentSentence.time.pt}</span> +{' '}
                <span className="text-emerald-300">{currentSentence.subject.pt}</span> +{' '}
                <span className="text-amber-300">{currentSentence.location.pt}</span> +{' '}
                <span className="text-rose-300">{currentSentence.verb.lemma}</span> +{' '}
                <span className="text-indigo-300">{currentSentence.object.pt}</span>
              </div>
            </div>

            {/* O DESAFIO: ESCOLHA A TRADUÇÃO CORRETA */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Qual é a tradução correta em português?</span>
                </h3>

                {hasAnswered && (
                  <button
                    type="button"
                    onClick={handlePullLever}
                    className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    <span>Próxima Rodada (Girar)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* As 4 Opções de Múltipla Escolha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx); // A, B, C, D
                  const isSelected = selectedOptionId === opt.id;

                  let borderClass = 'border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700 text-slate-200';
                  
                  if (hasAnswered) {
                    if (opt.isCorrect) {
                      borderClass = 'border-emerald-500 bg-emerald-950/60 text-emerald-100 shadow-md ring-2 ring-emerald-500/50';
                    } else if (isSelected && !opt.isCorrect) {
                      borderClass = 'border-rose-500 bg-rose-950/60 text-rose-200';
                    } else {
                      borderClass = 'border-slate-800 bg-slate-900/40 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      disabled={hasAnswered}
                      className={`p-3.5 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${borderClass} ${
                        !hasAnswered ? 'active:scale-98' : ''
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        hasAnswered && opt.isCorrect
                          ? 'bg-emerald-500 text-slate-950'
                          : hasAnswered && isSelected && !opt.isCorrect
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {hasAnswered && opt.isCorrect ? '✓' : hasAnswered && isSelected && !opt.isCorrect ? '✕' : letter}
                      </div>

                      <div className="flex-1 text-xs sm:text-sm font-semibold leading-relaxed">
                        {opt.text}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback pós-resposta */}
              {hasAnswered && (
                <div className="mt-2 animate-fadeIn">
                  {selectedOptionId && options.find(o => o.id === selectedOptionId)?.isCorrect ? (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-emerald-900/70 to-teal-950/80 border border-emerald-500/80 text-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                          🎉
                        </div>
                        <div>
                          <div className="text-sm font-black text-emerald-200 flex items-center gap-2">
                            <span>JACKPOT! Tradução Exata!</span>
                            <span className="text-xs text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-400/40">
                              +¥25 moedas
                            </span>
                          </div>
                          <p className="text-xs text-emerald-300/90 mt-0.5 leading-relaxed">
                            Parabéns! Você identificou corretamente a ordem: <strong>{currentSentence.translation}</strong>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handlePullLever}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer shrink-0 self-end sm:self-auto"
                      >
                        Girar Novamente ➔
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-rose-900/70 to-slate-950/80 border border-rose-500/80 text-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                          ✕
                        </div>
                        <div>
                          <div className="text-sm font-black text-rose-200">
                            Quase lá! Veja a tradução correta:
                          </div>
                          <p className="text-xs text-rose-200/90 mt-0.5 font-bold">
                            "{currentSentence.translation}"
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handlePullLever}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md transition-all cursor-pointer shrink-0 self-end sm:self-auto"
                      >
                        Tentar Outra Rodada ➔
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Explicação detalhada de cada bloco da frase */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Análise Gramatical Detalhada desta Frase:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase block">1. Tempo:</span>
                  <strong className="text-sm text-cyan-200 block">{currentSentence.time.hanzi}</strong>
                  <span className="text-[11px] text-slate-400">{currentSentence.time.pinyin} = {currentSentence.time.pt}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase block">2. Sujeito:</span>
                  <strong className="text-sm text-emerald-200 block">{currentSentence.subject.hanzi}</strong>
                  <span className="text-[11px] text-slate-400">{currentSentence.subject.pinyin} = {currentSentence.subject.pt}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60">
                  <span className="text-[10px] font-bold text-amber-400 uppercase block">3. Local (在):</span>
                  <strong className="text-sm text-amber-200 block">{currentSentence.location.hanzi}</strong>
                  <span className="text-[11px] text-slate-400">{currentSentence.location.pinyin} = {currentSentence.location.pt}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60">
                  <span className="text-[10px] font-bold text-rose-400 uppercase block">4. Verbo:</span>
                  <strong className="text-sm text-rose-200 block">{currentSentence.verb.hanzi}</strong>
                  <span className="text-[11px] text-slate-400">{currentSentence.verb.pinyin} = {currentSentence.verb.lemma}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/60">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase block">5. Objeto:</span>
                  <strong className="text-sm text-indigo-200 block">{currentSentence.object.hanzi}</strong>
                  <span className="text-[11px] text-slate-400">{currentSentence.object.pinyin} = {currentSentence.object.pt}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotMachineMode;
