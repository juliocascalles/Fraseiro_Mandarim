import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Sparkles, 
  PenTool, 
  Target, 
  Shuffle, 
  ShoppingBag, 
  BookOpen, 
  Hash, 
  AlertTriangle, 
  ChevronRight, 
  Check, 
  Search,
  Compass,
  Layers,
  Flame,
  Zap,
  Tag,
  Mic,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type AppModeTab = 'chat' | 'slots' | 'hanzi' | 'practice' | 'quiz' | 'flashcards' | 'shop' | 'repeticoes' | 'pronuncia';

export interface ModeMenuItem {
  id: AppModeTab | 'numbers' | 'dictionary' | 'false_friends' | 'tutorial';
  title: string;
  hanzi: string;
  pinyin: string;
  description: string;
  category: 'games' | 'hanzi_chars' | 'communication' | 'reference';
  icon: React.ElementType | string;
  badge?: string;
  badgeColor?: string;
  themeColor: string;
  isModal?: boolean;
}

export const ALL_MODES_CONFIG: ModeMenuItem[] = [
  // 1. Jogos & Prática Ativa
  {
    id: 'pronuncia',
    title: 'Modo Pronúncia & Voz',
    hanzi: '发音训练',
    pinyin: 'fāyīn xùnliàn',
    description: 'Fale pelo microfone com GenAI Speech-to-Text: o app diz a frase, avalia sua proximidade, destaca erros e prioriza palavras difíceis.',
    category: 'communication',
    icon: Mic,
    badge: 'Novo',
    badgeColor: 'bg-rose-600 text-white font-black',
    themeColor: 'from-rose-600 to-indigo-600',
  },
  {
    id: 'repeticoes',
    title: 'Módulo Repetições',
    hanzi: '叠词机器',
    pinyin: 'diécí jīqì',
    description: 'Esteira e Máquina Duplicadora: verbos suavizados (看看, 试一试, 等等), modéstia (哪里哪里) e universalidade (天天, 人人).',
    category: 'games',
    icon: '🔁',
    badge: 'Reduplicar',
    badgeColor: 'bg-purple-600 text-white font-black',
    themeColor: 'from-purple-600 to-indigo-600',
  },
  {
    id: 'slots',
    title: 'Caça-níqueis de Frases',
    hanzi: '老虎机',
    pinyin: 'lǎohǔjī',
    description: 'Gire 5 faixas sintáticas (Tempo, Sujeito, Local com 在/去/想去, Verbo, Objeto) e adivinhe a tradução correta.',
    category: 'games',
    icon: '🎰',
    badge: 'Slots',
    badgeColor: 'bg-amber-500 text-slate-950 font-black',
    themeColor: 'from-amber-500 to-yellow-500',
  },
  {
    id: 'shop',
    title: 'Loja de Roupas Chinesas',
    hanzi: '服装店',
    pinyin: 'fúzhuāngdiàn',
    description: 'Simule compras reais em Pequim: pergunte preços com duōshao qián e responda valores por extenso.',
    category: 'games',
    icon: ShoppingBag,
    badge: 'Roupas',
    badgeColor: 'bg-rose-500 text-white font-bold',
    themeColor: 'from-rose-500 to-pink-500',
  },
  {
    id: 'practice',
    title: 'Modo Prática Guiada',
    hanzi: '练习',
    pinyin: 'liànxí',
    description: 'Desafios passo a passo para construir frases com validação sintática e dicas gramaticais.',
    category: 'games',
    icon: Target,
    badge: 'HSK 1-2',
    badgeColor: 'bg-emerald-500 text-white font-bold',
    themeColor: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'quiz',
    title: 'Quiz de Gramática',
    hanzi: '语法测试',
    pinyin: 'yǔfǎ cèshì',
    description: 'Perguntas interativas de múltipla escolha para testar particulas, classificadores e ordem das palavras.',
    category: 'games',
    icon: Shuffle,
    badge: 'Quiz',
    badgeColor: 'bg-purple-500 text-white font-bold',
    themeColor: 'from-purple-500 to-indigo-500',
  },

  // 2. Ideogramas & Mnemônicas
  {
    id: 'flashcards',
    title: 'Flashcards Mnemônicos',
    hanzi: '字卡',
    pinyin: 'zìkǎ',
    description: 'Desenhos explicativos e biblioteca 3D que mostram a origem visual e o significado de cada hanzi.',
    category: 'hanzi_chars',
    icon: Sparkles,
    badge: 'Mnemônicas 3D',
    badgeColor: 'bg-amber-600 text-white font-bold',
    themeColor: 'from-amber-600 to-orange-500',
  },
  {
    id: 'hanzi',
    title: 'Modo Hanzi (Grade de Traçado)',
    hanzi: '汉字描红',
    pinyin: 'hànzì miáohóng',
    description: 'Desenhe caracteres direto na grade 米字格 com avaliação de precisão e ordem dos traços.',
    category: 'hanzi_chars',
    icon: PenTool,
    badge: 'Desenho',
    badgeColor: 'bg-rose-600 text-white font-bold',
    themeColor: 'from-rose-600 to-red-500',
  },

  // 3. Comunicação ao Vivo
  {
    id: 'chat',
    title: 'Bate-papo em Tempo Real',
    hanzi: '实时聊天',
    pinyin: 'shíshí liáotiān',
    description: 'Envie frases completas validadas para salas temáticas e converse com outros estudantes ao vivo.',
    category: 'communication',
    icon: Users,
    badge: 'Live',
    badgeColor: 'bg-indigo-600 text-white font-bold',
    themeColor: 'from-indigo-600 to-blue-600',
  },

  // 4. Ferramentas de Consulta & Referência
  {
    id: 'dictionary',
    title: 'Dicionário Visual',
    hanzi: '词典',
    pinyin: 'cídiǎn',
    description: 'Vocabulário completo categorizado com busca por pinyin/hanzi, áudio nativo e níveis HSK.',
    category: 'reference',
    icon: BookOpen,
    badge: 'HSK 1-2',
    badgeColor: 'bg-sky-600 text-white font-bold',
    themeColor: 'from-sky-600 to-cyan-600',
    isModal: true,
  },
  {
    id: 'numbers',
    title: 'Guia de Números Chineses',
    hanzi: '数字',
    pinyin: 'shùzì',
    description: 'Conversor de algarismos arábicos para números chineses por extenso e regras 4.1 a 4.5.',
    category: 'reference',
    icon: Hash,
    badge: 'Conversor',
    badgeColor: 'bg-teal-600 text-white font-bold',
    themeColor: 'from-teal-600 to-emerald-600',
    isModal: true,
  },
  {
    id: 'false_friends',
    title: 'Não Confundir!',
    hanzi: '易混淆',
    pinyin: 'yì hùnxiáo',
    description: 'Guia de homófonos, falsos cognatos e erros frequentes na escrita e fala do mandarim.',
    category: 'reference',
    icon: AlertTriangle,
    badge: 'Guia',
    badgeColor: 'bg-amber-700 text-white font-bold',
    themeColor: 'from-amber-700 to-yellow-600',
    isModal: true,
  },
  {
    id: 'tutorial',
    title: 'Tutorial Interativo',
    hanzi: '新手指南',
    pinyin: 'xīnshǒu zhǐnán',
    description: 'Tour guiado completo passo a passo explicando como funciona cada módulo e recurso do app.',
    category: 'reference',
    icon: GraduationCap,
    badge: 'Tour 1 min',
    badgeColor: 'bg-indigo-600 text-white font-bold',
    themeColor: 'from-indigo-600 to-rose-600',
    isModal: true,
  },
];

interface ModesMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: AppModeTab;
  onSelectTab: (tab: AppModeTab) => void;
  onOpenDictionary: () => void;
  onOpenNumbers: () => void;
  onOpenFalseFriends: () => void;
  onOpenTutorial?: () => void;
}

export const ModesMenuModal: React.FC<ModesMenuModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onOpenDictionary,
  onOpenNumbers,
  onOpenFalseFriends,
  onOpenTutorial,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'games' | 'hanzi_chars' | 'communication' | 'reference'>('all');

  if (!isOpen) return null;

  const filteredItems = ALL_MODES_CONFIG.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.hanzi.toLowerCase().includes(q) ||
      item.pinyin.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  const handleItemClick = (item: ModeMenuItem) => {
    onClose();
    if (item.id === 'dictionary') {
      onOpenDictionary();
    } else if (item.id === 'numbers') {
      onOpenNumbers();
    } else if (item.id === 'false_friends') {
      onOpenFalseFriends();
    } else if (item.id === 'tutorial') {
      if (onOpenTutorial) onOpenTutorial();
    } else {
      onSelectTab(item.id as AppModeTab);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop com blur suave */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
        />

        {/* Card do Menu de Modos */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden z-10"
        >
          {/* Top Bar Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-3 bg-gradient-to-r from-slate-50 via-white to-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Modos de Aprendizado</span>
                  <span className="text-xs font-serif text-indigo-600 font-bold hidden sm:inline">
                    (学习模式)
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Selecione um modo de estudo ou ferramenta de referência
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input & Category Filters */}
          <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-slate-100 bg-white flex flex-col gap-2.5">
            {/* Campo de Busca Rápida */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Buscar por modo, caractere ou ferramenta (ex: caça-níqueis, loja, quiz...)"
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Categorias / Filtros Rápidos */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todos ({ALL_MODES_CONFIG.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('games')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === 'games'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🎮 Jogos & Prática (4)
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('hanzi_chars')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === 'hanzi_chars'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ✍️ Ideogramas (2)
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('communication')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === 'communication'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                💬 Bate-papo (1)
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('reference')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === 'reference'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                📖 Ferramentas (3)
              </button>
            </div>
          </div>

          {/* Grid de Modos com Scroll Suave */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-slate-600">Nenhum modo encontrado para "{filterQuery}"</p>
                <p className="text-xs mt-1">Tente pesquisar por palavras como "frase", "quiz" ou "roupas".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredItems.map((item) => {
                  const isCurrentActive = !item.isModal && activeTab === item.id;
                  const IconComp = item.icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className={`group relative text-left p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isCurrentActive
                          ? 'border-indigo-500 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs hover:shadow-xs'
                      }`}
                    >
                      {/* Ícone com tema colorido */}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                        typeof IconComp === 'string'
                          ? 'bg-amber-100 text-xl'
                          : 'bg-slate-100 group-hover:bg-indigo-100 text-slate-700 group-hover:text-indigo-700 transition-colors'
                      }`}>
                        {typeof IconComp === 'string' ? (
                          <span>{IconComp}</span>
                        ) : (
                          <IconComp className="w-5 h-5" />
                        )}
                      </div>

                      {/* Informações Textuais */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                            {item.title}
                          </span>
                          <span className="font-serif text-slate-400 text-xs font-semibold">
                            {item.hanzi}
                          </span>
                          {item.badge && (
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 mt-1 leading-snug line-clamp-2">
                          {item.description}
                        </p>

                        {isCurrentActive && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 mt-2">
                            <Check className="w-3.5 h-3.5" /> Modo em exibição
                          </span>
                        )}
                      </div>

                      {/* Seta Direita */}
                      <div className="self-center text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Rodapé Informativo */}
          <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Fraseiro Mandarim • v1.2026.11.06</span>
            </span>
            <span className="hidden sm:inline text-slate-400">
              Toque em qualquer card para alternar instantaneamente
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
