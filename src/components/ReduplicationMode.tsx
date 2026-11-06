import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Coins, 
  Trophy, 
  Flame, 
  HelpCircle, 
  ArrowRight, 
  BookOpen, 
  Play, 
  Search, 
  Zap, 
  Layers, 
  Info,
  ChevronRight,
  Smile,
  Clock,
  Shirt,
  Utensils,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { speakMandarin } from '../utils/speech';

export interface ReduplicationItem {
  id: string;
  category: 'action_verb' | 'courtesy' | 'universal_noun' | 'adjective';
  baseHanzi: string;
  basePinyin: string;
  baseTranslation: string;
  duplicatedHanzi: string;
  duplicatedPinyin: string;
  duplicatedMeaning: string;
  variants?: string[]; // e.g. ["看看", "看一看", "看一下"]
  culturalNote: string;
  exampleSentence: string;
  examplePinyin: string;
  exampleTranslation: string;
  icon?: string;
}

export const REDUPLICATION_DATABASE: ReduplicationItem[] = [
  // 1. Verbos de Ação Rápida e Suave (Ação breve, tentativa e polidez)
  {
    id: 'kan',
    category: 'action_verb',
    baseHanzi: '看',
    basePinyin: 'kàn',
    baseTranslation: 'olhar / ver / ler',
    duplicatedHanzi: '看看',
    duplicatedPinyin: 'kànkan',
    duplicatedMeaning: 'Dar uma olhadinha / conferir rapidamente',
    variants: ['看看 (kànkan)', '看一看 (kàn yi kàn)', '看一下 (kàn yíxià)'],
    culturalNote: 'O "yi" (一) ou "yixia" (一下) podem ser incluídos ou omitidos. A duplicação suaviza o pedido, evitando parecer uma ordem ríspida.',
    exampleSentence: '我看一下行不行？',
    examplePinyin: 'Wǒ kàn yíxià xíng bu xíng?',
    exampleTranslation: 'Deixa eu dar uma olhadinha. Tudo bem?',
    icon: '👀'
  },
  {
    id: 'shi',
    category: 'action_verb',
    baseHanzi: '试',
    basePinyin: 'shì',
    baseTranslation: 'testar / provar / tentar',
    duplicatedHanzi: '试试 / 试一试',
    duplicatedPinyin: 'shìshi / shì yi shì',
    duplicatedMeaning: 'Dar uma experimentada / provar (comida ou roupa)',
    variants: ['试试 (shìshi)', '试一试 (shì yi shì)', '试一下 (shì yíxià)'],
    culturalNote: 'Como na frase clássica de compras: "我可以试一试吗？" (Posso experimentar?). O tom da segunda repetição é atenuado.',
    exampleSentence: '我可以试一下衣服吗？',
    examplePinyin: 'Wǒ kěyǐ shì yíxià yīfu ma?',
    exampleTranslation: 'Eu posso dar uma experimentada na roupa?',
    icon: '👕'
  },
  {
    id: 'deng',
    category: 'action_verb',
    baseHanzi: '等',
    basePinyin: 'děng',
    baseTranslation: 'esperar / aguardar',
    duplicatedHanzi: '等等',
    duplicatedPinyin: 'děngdeng',
    duplicatedMeaning: 'Espere um pouco / aguardar um instantinho',
    variants: ['等等 (děngdeng)', '等一下 (děng yíxià)', '等一等 (děng yi děng)'],
    culturalNote: 'Muito comum em "等等我！" (Me espera aí!). Soa muito mais amigável e acolhedor do que simplesmente dizer "等".',
    exampleSentence: '等等我，我也去超市！',
    examplePinyin: 'Děngdeng wǒ, wǒ yě qù chāoshì!',
    exampleTranslation: 'Me espera um pouco, eu também vou ao mercado!',
    icon: '⏳'
  },
  {
    id: 'shuo',
    category: 'action_verb',
    baseHanzi: '说',
    basePinyin: 'shuō',
    baseTranslation: 'falar / dizer',
    duplicatedHanzi: '说说',
    duplicatedPinyin: 'shuōshuo',
    duplicatedMeaning: 'Bater um papo / conversar a respeito / desabafar',
    variants: ['说说 (shuōshuo)', '说一说 (shuō yi shuō)', '聊聊 (liáoliao)'],
    culturalNote: 'Transforma o verbo formal "falar" em uma conversa descontraída entre amigos ou família.',
    exampleSentence: '我们坐下来，说说你的工作吧。',
    examplePinyin: 'Wǒmen zuò xiàlai, shuōshuo nǐ de gōngzuò ba.',
    exampleTranslation: 'Vamos nos sentar e bater um papo sobre o seu trabalho.',
    icon: '💬'
  },
  {
    id: 'ting',
    category: 'action_verb',
    baseHanzi: '听',
    basePinyin: 'tīng',
    baseTranslation: 'ouvir / escutar',
    duplicatedHanzi: '听听',
    duplicatedPinyin: 'tīngting',
    duplicatedMeaning: 'Dar uma escutada / ouvir um pouquinho / prestar atenção',
    variants: ['听听 (tīngting)', '听一听 (tīng yi tīng)', '听一下 (tīng yíxià)'],
    culturalNote: 'Usado para pedir para alguém apreciar uma música ou ouvir uma opinião amigável.',
    exampleSentence: '你听听这首歌，真好听！',
    examplePinyin: 'Nǐ tīngting zhè shǒu gē, zhēn hǎotīng!',
    exampleTranslation: 'Dá uma escutada nessa música, é muito boa!',
    icon: '🎧'
  },
  {
    id: 'xiang',
    category: 'action_verb',
    baseHanzi: '想',
    basePinyin: 'xiǎng',
    baseTranslation: 'pensar / achar',
    duplicatedHanzi: '想想',
    duplicatedPinyin: 'xiǎngxiang',
    duplicatedMeaning: 'Dar uma refletida / pensar com carinho / reconsiderar',
    variants: ['想想 (xiǎngxiang)', '想一想 (xiǎng yi xiǎng)'],
    culturalNote: 'Indica um pensamento rápido ou um convite para refletir sem pressão.',
    exampleSentence: '让我好好想想。',
    examplePinyin: 'Ràng wǒ hǎohāo xiǎngxiang.',
    exampleTranslation: 'Deixa eu dar uma boa pensada.',
    icon: '💡'
  },
  {
    id: 'zou',
    category: 'action_verb',
    baseHanzi: '走',
    basePinyin: 'zǒu',
    baseTranslation: 'andar / caminhar',
    duplicatedHanzi: '走走',
    duplicatedPinyin: 'zǒuzou',
    duplicatedMeaning: 'Dar uma voltinha / passear um pouco / caminhar',
    variants: ['走走 (zǒuzou)', '去走走 (qù zǒuzou)'],
    culturalNote: 'Muito usado após as refeições ("饭后走走" - caminhar um pouco depois de comer faz bem à digestão).',
    exampleSentence: '我们去公园走走吧。',
    examplePinyin: 'Wǒmen qù gōngyuán zǒuzou ba.',
    exampleTranslation: 'Vamos dar uma voltinha no parque.',
    icon: '🚶'
  },
  {
    id: 'wan',
    category: 'action_verb',
    baseHanzi: '玩',
    basePinyin: 'wán',
    baseTranslation: 'brincar / curtir / jogar',
    duplicatedHanzi: '玩玩',
    duplicatedPinyin: 'wánwan',
    duplicatedMeaning: 'Descontrair / se divertir um pouco / passar o tempo',
    variants: ['玩玩 (wánwan)', '玩儿玩儿 (wánrwanr)'],
    culturalNote: 'Expressa atividade lúdica e informal, sem compromisso sério.',
    exampleSentence: '周末我想去朋友家玩玩。',
    examplePinyin: 'Zhōumò wǒ xiǎng qù péngyou jiā wánwan.',
    exampleTranslation: 'No fim de semana quero ir à casa de um amigo para curtir um pouco.',
    icon: '🎮'
  },
  {
    id: 'chang',
    category: 'action_verb',
    baseHanzi: '尝',
    basePinyin: 'cháng',
    baseTranslation: 'provar (comida) / degustar',
    duplicatedHanzi: '尝尝',
    duplicatedPinyin: 'chángchang',
    duplicatedMeaning: 'Degustar um pedacinho / dar uma mordidinha / experimentar o sabor',
    variants: ['尝尝 (chángchang)', '尝一尝 (cháng yi cháng)', '尝一下 (cháng yíxià)'],
    culturalNote: 'Essencial na gastronomia chinesa: quando a mãe ou o garçom oferecem comida com carinho.',
    exampleSentence: '你尝尝这个蛋糕，特别好吃！',
    examplePinyin: 'Nǐ chángchang zhè ge dàngāo, tèbié hǎochī!',
    exampleTranslation: 'Dá uma provadinha nesse bolo, é delicioso!',
    icon: '🍰'
  },

  // 2. Modéstia Cultural & Cortesia Social
  {
    id: 'nali',
    category: 'courtesy',
    baseHanzi: '哪里',
    basePinyin: 'nǎli',
    baseTranslation: 'onde / qual lugar',
    duplicatedHanzi: '哪里哪里',
    duplicatedPinyin: 'nǎli nǎli',
    duplicatedMeaning: '"Imagina! / Que nada! / Não é para tanto!" (Modéstia chinesa)',
    variants: ['哪里哪里 (nǎli nǎli)'],
    culturalNote: 'A resposta mais tradicional e elegante da cultura chinesa ao receber um elogio ou agradecimento caloroso. Demonstra humildade e apreço.',
    exampleSentence: '—— 你的中文真好！ —— 哪里哪里，还在学呢。',
    examplePinyin: '—— Nǐ de zhōngwén zhēn hǎo! —— Nǎli nǎli, hái zài xué ne.',
    exampleTranslation: '—— Seu chinês é ótimo! —— Imagina, que nada! Ainda estou aprendendo.',
    icon: '🙏'
  },
  {
    id: 'xiexie',
    category: 'courtesy',
    baseHanzi: '谢',
    basePinyin: 'xiè',
    baseTranslation: 'agradecer / declinar',
    duplicatedHanzi: '谢谢',
    duplicatedPinyin: 'xièxie',
    duplicatedMeaning: 'Obrigado(a)! / Muito grato(a)',
    variants: ['谢谢 (xièxie)'],
    culturalNote: 'Uma das palavras mais universais do mandarim é, na verdade, uma reduplicação afetiva do verbo 谢 (agradecer).',
    exampleSentence: '太谢谢你了！',
    examplePinyin: 'Tài xièxie nǐ le!',
    exampleTranslation: 'Muitíssimo obrigado(a)!',
    icon: '💐'
  },

  // 3. Substantivos e Universalidade ("Cada um / Todos sem exceção")
  {
    id: 'tian',
    category: 'universal_noun',
    baseHanzi: '天',
    basePinyin: 'tiān',
    baseTranslation: 'dia / céu',
    duplicatedHanzi: '天天',
    duplicatedPinyin: 'tiāntiān',
    duplicatedMeaning: 'Diariamente / todo santo dia / sem falhar um dia sequer',
    variants: ['天天 (tiāntiān)', '每一天 (měi yì tiān)'],
    culturalNote: 'Quando substantivos temporais ou contáveis são duplicados, ganham o sentido distributivo de "todo(a) / cada um sem exceção".',
    exampleSentence: '他天天在超市工作。',
    examplePinyin: 'Tā tiāntiān zài chāoshì gōngzuò.',
    exampleTranslation: 'Ele trabalha no supermercado todo santo dia.',
    icon: '☀️'
  },
  {
    id: 'ren',
    category: 'universal_noun',
    baseHanzi: '人',
    basePinyin: 'rén',
    baseTranslation: 'pessoa / ser humano',
    duplicatedHanzi: '人人',
    duplicatedPinyin: 'rénrén',
    duplicatedMeaning: 'Todo mundo / todas as pessoas / cada indivíduo',
    variants: ['人人 (rénrén)', '每个人 (měi ge rén)'],
    culturalNote: 'Expressa universalidade total e inclusão coletiva calorosa.',
    exampleSentence: '人人都可以学好中文！',
    examplePinyin: 'Rénrén dōu kěyǐ xué hǎo zhōngwén!',
    exampleTranslation: 'Todo mundo pode aprender chinês muito bem!',
    icon: '👥'
  },
  {
    id: 'nian',
    category: 'universal_noun',
    baseHanzi: '年',
    basePinyin: 'nián',
    baseTranslation: 'ano',
    duplicatedHanzi: '年年',
    duplicatedPinyin: 'niánnián',
    duplicatedMeaning: 'Ano após ano / todos os anos sem interrupção',
    variants: ['年年 (niánnián)', '年年有余 (Prosperidade contínua)'],
    culturalNote: 'Muito presente nos votos tradicionais de Ano Novo Chinês ("年年有余" - que haja abundância ano após ano).',
    exampleSentence: '我们年年回中国看奶奶。',
    examplePinyin: 'Wǒmen niánnián huí zhōngguó kàn nǎinai.',
    exampleTranslation: 'Nós voltamos à China todos os anos para visitar a vovó.',
    icon: '🏮'
  },

  // 4. Adjetivos Intensificados / Afetuosos
  {
    id: 'man',
    category: 'adjective',
    baseHanzi: '慢',
    basePinyin: 'màn',
    baseTranslation: 'devagar / lento',
    duplicatedHanzi: '慢慢',
    duplicatedPinyin: 'mànmàn',
    duplicatedMeaning: 'Devagarinho / com calma / sem pressa',
    variants: ['慢慢 (mànmàn)', '慢慢来 (com calma)', '慢慢走 (vai com calma)'],
    culturalNote: 'Expressão de carinho e boa hospitalidade chinesa. Dizer "慢慢吃" (coma com calma) é a etiqueta clássica das refeições.',
    exampleSentence: '慢慢吃，别着急。',
    examplePinyin: 'Mànmàn chī, bié zháojí.',
    exampleTranslation: 'Coma devagarinho, não precisa ter pressa.',
    icon: '🐢'
  },
  {
    id: 'gaoxing',
    category: 'adjective',
    baseHanzi: '高兴',
    basePinyin: 'gāoxìng',
    baseTranslation: 'alegre / contente',
    duplicatedHanzi: '高高兴兴',
    duplicatedPinyin: 'gāogāo-xìngxìng',
    duplicatedMeaning: 'Radiante de felicidade / alegremente / transbordando alegria',
    variants: ['高高兴兴 (Formato AABB de adjetivo bissilábico)'],
    culturalNote: 'Adjetivos de 2 sílabas seguem o padrão rítmico AABB (高高兴兴, 漂漂亮亮), trazendo uma atmosfera viva e musical à frase.',
    exampleSentence: '孩子们高高兴兴去公园玩。',
    examplePinyin: 'Háizimen gāogāo-xìngxìng qù gōngyuán wán.',
    exampleTranslation: 'As crianças foram para o parque radiantes de felicidade para brincar.',
    icon: '🎉'
  }
];

export const ReduplicationMode: React.FC = () => {
  // Modo de operação: 'challenge' (Desafio com a esteira) ou 'lab' (Exploração livre)
  const [activeSubMode, setActiveSubMode] = useState<'challenge' | 'lab'>('challenge');

  // Item ativo na esteira
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState<number>(0);
  const currentChallenge = REDUPLICATION_DATABASE[currentChallengeIdx];

  // Opções de palavras para o desafio
  const [challengeOptions, setChallengeOptions] = useState<ReduplicationItem[]>([]);
  const [selectedWord, setSelectedWord] = useState<ReduplicationItem | null>(null);

  // Estados da Animação da Esteira e Máquina Duplicadora
  // 'idle': pronto para clicar
  // 'on_belt': palavra clicada, revelando tradução literal e deslizando na esteira em direção à máquina
  // 'processing': dentro da máquina com luzes neon e engrenagens girando
  // 'duplicated': saindo da máquina duplicada com o novo significado revelado!
  const [machineState, setMachineState] = useState<'idle' | 'on_belt' | 'processing' | 'duplicated'>('idle');

  // Pontuação, Streak e Moedas
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [walletYuans, setWalletYuans] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('shop_wallet_yuans');
      return saved ? parseInt(saved, 10) : 500;
    } catch {
      return 500;
    }
  });

  // Filtros no Modo Lab
  const [labCategoryFilter, setLabCategoryFilter] = useState<'all' | 'action_verb' | 'courtesy' | 'universal_noun' | 'adjective'>('all');
  const [labSearch, setLabSearch] = useState<string>('');
  const [isRulesGuideOpen, setIsRulesGuideOpen] = useState<boolean>(false);

  // Inicializa o desafio com opções embaralhadas
  useEffect(() => {
    initChallenge(currentChallengeIdx);
  }, [currentChallengeIdx]);

  const initChallenge = (idx: number) => {
    const target = REDUPLICATION_DATABASE[idx];
    const others = REDUPLICATION_DATABASE.filter(item => item.id !== target.id);
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    const combined = [target, ...shuffledOthers].sort(() => Math.random() - 0.5);

    setChallengeOptions(combined);
    setSelectedWord(null);
    setMachineState('idle');
  };

  // Processo de envio para a esteira e máquina duplicadora
  const handleWordClick = (word: ReduplicationItem) => {
    if (machineState !== 'idle') return;

    setSelectedWord(word);
    setMachineState('on_belt');

    // Fala a palavra simples
    speakMandarin(word.baseHanzi);

    // Passo 1: A palavra desliza pela esteira até a máquina (1.1s)
    setTimeout(() => {
      setMachineState('processing');

      // Passo 2: A máquina processa com engrenagens e luzes neon (1.4s)
      setTimeout(() => {
        setMachineState('duplicated');

        // Fala a forma duplicada
        speakMandarin(word.duplicatedHanzi);

        // Verifica se acertou o desafio
        const isCorrect = word.id === currentChallenge.id;
        if (isCorrect) {
          setScore(prev => prev + 100);
          setStreak(prev => prev + 1);
          setWalletYuans(prev => {
            const nextVal = prev + 50;
            try {
              localStorage.setItem('shop_wallet_yuans', nextVal.toString());
            } catch {}
            return nextVal;
          });
        } else {
          setStreak(0);
        }
      }, 1400);
    }, 1100);
  };

  const handleNextChallenge = () => {
    const nextIdx = (currentChallengeIdx + 1) % REDUPLICATION_DATABASE.length;
    setCurrentChallengeIdx(nextIdx);
  };

  // Reproduz áudio nativo de exemplo
  const playAudio = (text: string) => {
    speakMandarin(text);
  };

  // Filtragem do laboratório
  const filteredLabItems = REDUPLICATION_DATABASE.filter(item => {
    if (labCategoryFilter !== 'all' && item.category !== labCategoryFilter) return false;
    if (labSearch.trim()) {
      const q = labSearch.toLowerCase().trim();
      return (
        item.baseHanzi.includes(q) ||
        item.basePinyin.toLowerCase().includes(q) ||
        item.baseTranslation.toLowerCase().includes(q) ||
        item.duplicatedHanzi.includes(q) ||
        item.duplicatedMeaning.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-300">
      
      {/* ========================================================================= */}
      {/* HEADER PRINCIPAL COM BANNER E PLACAR                                     */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden border border-purple-400/30">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none text-9xl font-serif">
          叠
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shrink-0 border border-amber-200">
              🔁
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                  <span>Módulo Repetições</span>
                  <span className="text-amber-200 font-serif text-lg">叠词机器 (Diécí Jīqì)</span>
                </h2>
                <span className="bg-amber-400/20 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300/40 uppercase">
                  v1.2026.11.05
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-100 font-medium mt-0.5">
                Chineses adoram repetir palavras para soar agradável, suave e polido! Descubra novos significados na esteira duplicadora.
              </p>
            </div>
          </div>

          {/* Placar, Streak e Moedas */}
          <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 border border-purple-400/30 backdrop-blur-xs text-xs font-bold text-amber-200 shadow-inner">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Sequência:</span>
              <span className="text-white font-black text-sm">{streak}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 border border-purple-400/30 backdrop-blur-xs text-xs font-bold text-amber-200 shadow-inner">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Pontos:</span>
              <span className="text-white font-black text-sm">{score}</span>
            </div>

            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 border border-purple-400/30 backdrop-blur-xs text-xs font-bold text-amber-200 shadow-inner"
              title="Moedas do caixa integradas à loja"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 font-black text-sm">¥{walletYuans}</span>
            </div>
          </div>
        </div>

        {/* Abas Superiores de Alternância de Modo */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/15">
            <button
              type="button"
              onClick={() => setActiveSubMode('challenge')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSubMode === 'challenge' 
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-black' 
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Desafio da Esteira</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubMode('lab')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSubMode === 'lab' 
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-black' 
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Laboratório Livre ({REDUPLICATION_DATABASE.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsRulesGuideOpen(!isRulesGuideOpen)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-500/30 hover:bg-purple-500/40 border border-purple-300/30 text-purple-100 hover:text-white font-bold transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Regras Gramaticais de Reduplicação</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GUIA EXPANSÍVEL DE REGRAS GRAMATICAIS DE REDUPLICAÇÃO                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isRulesGuideOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-3xl p-5 border border-purple-200 shadow-lg text-slate-800 flex flex-col gap-4 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Como Funcionam as Repetições no Mandarim (重叠词 - Chóngdiécí)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRulesGuideOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕ Fechar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 flex flex-col gap-1.5">
                <span className="font-extrabold text-purple-900 flex items-center gap-1">
                  <span>1. Verbos Monossílabos</span>
                  <span className="px-1.5 py-0.2 rounded bg-purple-200 text-purple-900 text-[10px]">AA / A一A / A一下</span>
                </span>
                <p className="text-slate-600 leading-relaxed">
                  A repetição do verbo suaviza o tom da frase, expressa brevidade ("fazer um pouco") ou tentativa ("experimentar fazer").
                </p>
                <div className="bg-white p-2 rounded-xl border border-purple-200/80 font-mono text-[11px] text-purple-800">
                  看 ➔ 看看 / 看一看 / 看一下
                  <span className="block text-[10px] text-slate-500 font-sans mt-0.5 font-normal">
                    (Olhar ➔ Dar uma olhadinha)
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 flex flex-col gap-1.5">
                <span className="font-extrabold text-amber-900 flex items-center gap-1">
                  <span>2. Omissão do "一" ou "一下"</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[10px]">Flexibilidade</span>
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Como o usuário especificou: a estrutura <strong>V + 一 + V</strong> (ex: 试一试) pode omitir o "一" (试试) ou usar "一下" (试一下) mantendo o mesmo significado!
                </p>
                <div className="bg-white p-2 rounded-xl border border-amber-200/80 font-mono text-[11px] text-amber-900">
                  我可以试一试吗？
                  <span className="block text-[10px] text-slate-500 font-sans mt-0.5 font-normal">
                    = 我可以试一下吗？ = 试试
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col gap-1.5">
                <span className="font-extrabold text-emerald-900 flex items-center gap-1">
                  <span>3. Substantivos Distributivos</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 text-[10px]">Universalidade</span>
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Substantivos de tempo ou pessoas duplicados significam "cada um / todos sem exceção":
                </p>
                <div className="bg-white p-2 rounded-xl border border-emerald-200/80 font-mono text-[11px] text-emerald-900">
                  天 ➔ 天天 (Todo santo dia)
                  <br />
                  人 ➔ 人人 (Todo mundo)
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 flex flex-col gap-1.5">
                <span className="font-extrabold text-rose-900 flex items-center gap-1">
                  <span>4. Modéstia & Cortesia</span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-200 text-rose-900 text-[10px]">Cultura</span>
                </span>
                <p className="text-slate-600 leading-relaxed">
                  <strong>哪里哪里 (nǎli nǎli)</strong>: o "imagina!" clássico para recusar elogios com extrema elegância cultural chinesa.
                </p>
                <div className="bg-white p-2 rounded-xl border border-rose-200/80 font-mono text-[11px] text-rose-900">
                  —— 你的中文真好！
                  <br />
                  —— 哪里哪里！(Imagina!)
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODO DESAFIO COM A ESTEIRA ROLANTE E MÁQUINA DUPLICADORA                  */}
      {/* ========================================================================= */}
      {activeSubMode === 'challenge' ? (
        <div className="flex flex-col gap-5">
          
          {/* Card da Pergunta / Missão */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-extrabold text-[10px] uppercase tracking-wider">
                Desafio {currentChallengeIdx + 1} de {REDUPLICATION_DATABASE.length}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                Qual palavra, ao passar pela Esteira Duplicadora, ganha o sentido de:
              </h3>
              <p className="text-lg sm:text-xl font-extrabold text-purple-600 mt-1 flex items-center gap-2">
                <span>"{currentChallenge.duplicatedMeaning}"</span>
                <span className="text-base text-slate-400">({currentChallenge.duplicatedHanzi})</span>
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={handleNextChallenge}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Pular / Próximo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* A ESTEIRA ROLANTE & MÁQUINA DUPLICADORA                               */}
          {/* ===================================================================== */}
          <div className="bg-slate-950 rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-purple-500/60 relative overflow-hidden flex flex-col gap-5">
            
            {/* Luzes do Topo da Máquina */}
            <div className="flex items-center justify-between text-xs text-purple-200 pb-2 border-b border-purple-500/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-purple-300">
                  ESTEIRA DUPLICADORA DE IDEOGRAMAS (叠词传送带)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                STATUS: {machineState === 'idle' ? 'AGUARDANDO ITEM' : machineState === 'on_belt' ? 'NA ESTEIRA ➔ ENTRADA' : machineState === 'processing' ? 'DUPLICANDO COM ENERGIA NEON...' : 'SAÍDA COMPLETA!'}
              </span>
            </div>

            {/* Cenário Visual da Esteira e Máquina */}
            <div className="relative min-h-[220px] sm:min-h-[260px] rounded-2xl bg-slate-900 border border-purple-900/60 p-4 flex items-center justify-between gap-4 overflow-hidden">
              
              {/* Efeito de Grade no Fundo */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* Lado Esquerdo: Área da Esteira de Entrada */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase mb-2 flex items-center gap-1">
                  <span>1. Palavra Simples (Entrada)</span>
                </span>

                {selectedWord && machineState === 'on_belt' ? (
                  <motion.div
                    initial={{ x: -100, opacity: 0, scale: 0.8 }}
                    animate={{ x: 60, opacity: 1, scale: 1 }}
                    transition={{ duration: 1.1, ease: 'easeInOut' }}
                    className="p-4 rounded-2xl bg-white text-slate-900 shadow-xl border-2 border-amber-400 flex flex-col items-center justify-center min-w-[130px] z-20"
                  >
                    <span className="text-3xl font-serif font-black text-slate-900">
                      {selectedWord.baseHanzi}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 mt-0.5">
                      {selectedWord.basePinyin}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded-full mt-1">
                      {selectedWord.baseTranslation}
                    </span>
                  </motion.div>
                ) : (
                  <div className="w-28 sm:w-36 h-28 sm:h-32 rounded-2xl border-2 border-dashed border-purple-500/40 flex flex-col items-center justify-center text-center p-3 text-purple-400/80">
                    <span className="text-2xl mb-1">👆</span>
                    <span className="text-[11px] font-bold">Clique em uma palavra abaixo</span>
                  </div>
                )}
              </div>

              {/* Centro: A Máquina Duplicadora com Tubo Neon e Engrenagens */}
              <div className="relative z-20 flex flex-col items-center justify-center px-2">
                <div className={`w-28 sm:w-36 h-36 sm:h-44 rounded-3xl border-4 flex flex-col items-center justify-center p-3 text-center transition-all duration-300 relative shadow-2xl ${
                  machineState === 'processing'
                    ? 'border-amber-400 bg-purple-950/90 shadow-purple-500/50 shadow-2xl scale-105 ring-4 ring-amber-400/30'
                    : 'border-purple-600 bg-slate-950/90'
                }`}>
                  {/* Tubo de Energia Neon */}
                  <div className={`w-full h-2 rounded-full mb-2 transition-all ${
                    machineState === 'processing'
                      ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-400 animate-pulse'
                      : 'bg-purple-900'
                  }`} />

                  {/* Ícone da Máquina / Engrenagens */}
                  <div className="relative">
                    <motion.div
                      animate={machineState === 'processing' ? { rotate: 360 } : { rotate: 0 }}
                      transition={machineState === 'processing' ? { repeat: Infinity, duration: 0.8, ease: 'linear' } : {}}
                      className="text-4xl sm:text-5xl"
                    >
                      ⚙️
                    </motion.div>
                    {machineState === 'processing' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1.2 }}
                        className="absolute inset-0 flex items-center justify-center text-amber-300 font-black text-xl animate-ping"
                      >
                        ⚡
                      </motion.div>
                    )}
                  </div>

                  <span className="font-extrabold text-[11px] text-white mt-1">
                    {machineState === 'processing' ? 'DUPLICANDO...' : 'MÁQUINA 2X'}
                  </span>
                  <span className="text-[9px] font-serif text-purple-300 font-bold">
                    叠词制造机
                  </span>

                  {/* Fumaça / Vapor de Processamento */}
                  {machineState === 'processing' && (
                    <div className="text-[10px] text-amber-300 font-mono mt-1 animate-bounce">
                      ✦ V+V ✦ V+一+V ✦
                    </div>
                  )}
                </div>
              </div>

              {/* Lado Direito: Área da Saída com a Palavra Duplicada */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase mb-2 flex items-center gap-1">
                  <span>2. Resultado Duplicado (Saída)</span>
                </span>

                {selectedWord && machineState === 'duplicated' ? (
                  <motion.div
                    initial={{ x: -40, opacity: 0, scale: 0.7 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className={`p-4 rounded-2xl shadow-2xl border-2 flex flex-col items-center justify-center min-w-[150px] max-w-full text-center z-20 ${
                      selectedWord.id === currentChallenge.id
                        ? 'bg-gradient-to-b from-emerald-950 to-slate-900 border-emerald-400 text-white'
                        : 'bg-gradient-to-b from-rose-950 to-slate-900 border-rose-400 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-2xl sm:text-3xl font-serif font-black text-amber-300">
                        {selectedWord.duplicatedHanzi}
                      </span>
                      <button
                        type="button"
                        onClick={() => playAudio(selectedWord.duplicatedHanzi)}
                        className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                        title="Ouvir pronúncia duplicada"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-emerald-400 mt-0.5">
                      {selectedWord.duplicatedPinyin}
                    </span>

                    <span className="text-[10px] font-bold text-amber-200 mt-1.5 px-2 py-0.5 rounded-full bg-white/10 border border-white/15">
                      {selectedWord.duplicatedMeaning}
                    </span>

                    <div className="mt-2 flex items-center gap-1 text-[11px] font-extrabold">
                      {selectedWord.id === currentChallenge.id ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Resposta Correta! (+50¥)
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Não era essa!
                        </span>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="w-28 sm:w-36 h-28 sm:h-32 rounded-2xl border-2 border-dashed border-emerald-500/30 flex flex-col items-center justify-center text-center p-3 text-emerald-400/60">
                    <span className="text-2xl mb-1">🎁</span>
                    <span className="text-[11px]">Aguardando sair da máquina...</span>
                  </div>
                )}
              </div>

              {/* Faixa Inferior de Rolagem da Esteira (Animação de Trilhos) */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-slate-800 border-t border-purple-500/40 flex items-center justify-around overflow-hidden">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-2 rounded-xs bg-purple-400/50 transition-all ${
                      machineState === 'on_belt' || machineState === 'processing'
                        ? 'translate-x-3 duration-300 animate-pulse'
                        : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Painel Inferior de Cartões Disponíveis para Clicar */}
            <div className="flex flex-col gap-2.5 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                <span className="flex items-center gap-1.5 text-purple-200">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Clique no verbo ou palavra correspondente para colocá-lo na esteira:
                </span>
                {machineState === 'duplicated' && (
                  <button
                    type="button"
                    onClick={handleNextChallenge}
                    className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md transition-all cursor-pointer animate-pulse"
                  >
                    <span>Próximo Desafio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {challengeOptions.map((opt) => {
                  const isSelected = selectedWord?.id === opt.id;
                  const isAnswered = machineState === 'duplicated';
                  const isTarget = opt.id === currentChallenge.id;

                  let cardStyle = 'bg-slate-800/90 border-slate-700 text-white hover:border-purple-400 hover:bg-slate-800';
                  if (isSelected) {
                    cardStyle = 'bg-purple-900 border-amber-400 ring-2 ring-amber-400/40 text-white shadow-lg';
                  } else if (isAnswered && isTarget) {
                    cardStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-200';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={machineState !== 'idle'}
                      onClick={() => handleWordClick(opt)}
                      className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 text-center ${cardStyle} ${
                        machineState !== 'idle' ? 'cursor-not-allowed opacity-80' : ''
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xl font-serif font-black">
                          {opt.baseHanzi}
                        </span>
                        <span className="text-base">{opt.icon}</span>
                      </div>
                      <span className="text-xs font-bold text-purple-300">
                        {opt.basePinyin}
                      </span>
                      <span className="text-[10px] text-slate-300 font-semibold px-2 py-0.5 rounded-md bg-black/40 mt-0.5">
                        {opt.baseTranslation}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explicação Cultural e Frase Prática se já respondeu */}
            {machineState === 'duplicated' && selectedWord && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 p-4 rounded-2xl bg-purple-950/70 border border-purple-500/40 text-xs text-purple-100 flex flex-col gap-2.5"
              >
                <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Nuance e Cultura da Palavra:</span>
                </div>

                <p className="leading-relaxed text-slate-200">
                  {selectedWord.culturalNote}
                </p>

                {selectedWord.variants && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-purple-300 font-bold">Variantes Aceitas:</span>
                    {selectedWord.variants.map((v, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-purple-900/90 text-amber-200 font-mono text-[11px] border border-purple-700">
                        {v}
                      </span>
                    ))}
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-400 block">
                      Exemplo Real de Uso:
                    </span>
                    <span className="text-sm font-serif font-bold text-amber-200">
                      {selectedWord.exampleSentence}
                    </span>
                    <span className="block text-[11px] text-purple-300 font-medium">
                      {selectedWord.examplePinyin}
                    </span>
                    <span className="block text-xs text-slate-300 font-normal">
                      "{selectedWord.exampleTranslation}"
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => playAudio(selectedWord.exampleSentence)}
                    className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer shrink-0"
                    title="Ouvir frase em mandarim"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      ) : (
        /* ===================================================================== */
        /* MODO LABORATÓRIO LIVRE (CATÁLOGO DE TODAS AS REPETIÇÕES)              */
        /* ===================================================================== */
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>Laboratório de Palavras Duplicadas</span>
                <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                  {filteredLabItems.length} expressões
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Explore os verbos, expressões de modéstia, substantivos distributivos e adjetivos com áudio e nuances.
              </p>
            </div>

            {/* Barra de Busca */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={labSearch}
                onChange={(e) => setLabSearch(e.target.value)}
                placeholder="Buscar (ex: kan, olhar, shi, deng, nali...)"
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setLabCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                labCategoryFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas ({REDUPLICATION_DATABASE.length})
            </button>
            <button
              type="button"
              onClick={() => setLabCategoryFilter('action_verb')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                labCategoryFilter === 'action_verb'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ⚡ Verbos de Ação Rápida
            </button>
            <button
              type="button"
              onClick={() => setLabCategoryFilter('courtesy')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                labCategoryFilter === 'courtesy'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🙏 Modéstia & Cortesia (哪里哪里)
            </button>
            <button
              type="button"
              onClick={() => setLabCategoryFilter('universal_noun')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                labCategoryFilter === 'universal_noun'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🌍 Universalidade (天天 / 人人)
            </button>
            <button
              type="button"
              onClick={() => setLabCategoryFilter('adjective')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                labCategoryFilter === 'adjective'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🎨 Adjetivos Carinhosos (慢慢)
            </button>
          </div>

          {/* Grid de Cards do Laboratório */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLabItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col gap-3"
              >
                {/* Linha Superior: Palavra Simples ➔ Palavra Duplicada */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="text-center px-2 py-1 rounded-xl bg-slate-100 border border-slate-200">
                      <span className="text-lg font-serif font-black text-slate-900 block">
                        {item.baseHanzi}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 block">
                        {item.basePinyin}
                      </span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-purple-500 shrink-0" />

                    <div className="text-center px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-200">
                      <span className="text-lg font-serif font-black text-purple-900 block">
                        {item.duplicatedHanzi}
                      </span>
                      <span className="text-[10px] font-bold text-purple-600 block">
                        {item.duplicatedPinyin}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => playAudio(item.duplicatedHanzi)}
                    className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors cursor-pointer"
                    title="Ouvir pronúncia"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Sentido Literal vs Duplicado */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Sentido Literal:
                    </span>
                    <span className="font-semibold text-slate-700">
                      {item.baseTranslation}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-purple-50">
                    <span className="text-[10px] uppercase font-bold text-purple-700 block">
                      Sentido Duplicado:
                    </span>
                    <span className="font-extrabold text-purple-950">
                      {item.duplicatedMeaning}
                    </span>
                  </div>
                </div>

                {/* Variantes se houver */}
                {item.variants && (
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <span className="text-[11px] font-bold text-slate-400">Variantes:</span>
                    {item.variants.map((v, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-semibold">
                        {v}
                      </span>
                    ))}
                  </div>
                )}

                {/* Exemplo de Frase */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-serif font-bold text-slate-900 block text-sm">
                      {item.exampleSentence}
                    </span>
                    <span className="text-[10px] text-purple-700 font-medium block">
                      {item.examplePinyin}
                    </span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">
                      "{item.exampleTranslation}"
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => playAudio(item.exampleSentence)}
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0"
                    title="Ouvir exemplo"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
