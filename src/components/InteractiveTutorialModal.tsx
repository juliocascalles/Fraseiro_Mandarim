import React, { useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles, 
  HelpCircle, 
  Mic, 
  ShoppingBag, 
  Shuffle, 
  Target, 
  PenTool, 
  BookOpen, 
  Hash, 
  AlertTriangle, 
  Users, 
  Compass, 
  CheckCircle2,
  Smartphone,
  Play,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppModeTab } from './ModesMenuModal';

export interface TutorialStep {
  id: string;
  title: string;
  hanzi: string;
  pinyin: string;
  targetTab?: AppModeTab;
  targetModal?: 'dictionary' | 'numbers' | 'false_friends';
  icon: string | React.ElementType;
  themeColor: string;
  badge: string;
  summary: string;
  keyPoints: string[];
  actionPrompt: string;
  previewSnippet?: {
    hanzi: string;
    pinyin: string;
    translation: string;
  };
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'intro',
    title: 'Bem-vindo ao Fraseiro Mandarim!',
    hanzi: '欢迎来到中文学习',
    pinyin: 'huānyíng lái dào zhōngwén xuéxí',
    icon: '🇨🇳',
    themeColor: 'from-indigo-600 to-rose-600',
    badge: 'Visão Geral',
    summary: 'O Fraseiro Mandarim é um ecossistema completo para você aprender a pensar e construir frases naturais em chinês, conectar palavras, dominar tons e simular situações do dia a dia.',
    keyPoints: [
      'Aprenda por blocos sintáticos inteligentes sem decoreba estéril',
      'Validação gramatical em tempo real com regras HSK 1 e HSK 2',
      'Treino auditivo e fala com IA pelo microfone',
      'Multiplataforma: funciona em Celular, Tablet e Desktop'
    ],
    actionPrompt: 'Vamos fazer um tour rápido de 1 minuto por todos os módulos do app!'
  },
  {
    id: 'chat_builder',
    title: '1. Construtor de Frases & Bate-papo',
    hanzi: '句子构建器 & 聊天',
    pinyin: 'jùzi gòujiàn qì & liáotiān',
    targetTab: 'chat',
    icon: Users,
    themeColor: 'from-indigo-600 to-blue-600',
    badge: 'Comunicação',
    summary: 'Construa frases clicando nos botões de vocabulário categorizados (Pronomes, Verbos, Locais, Objetos). O app verifica se a ordem das palavras segue a sintaxe correta do mandarim.',
    keyPoints: [
      'Toque nas palavras para adicioná-las na esteira de montagem',
      'A validação sintática avisa se falta verbo, se o local deve vir antes da ação, etc.',
      'Clique em "Enviar no Bate-papo" para compartilhar com outros estudantes ao vivo via Firebase'
    ],
    previewSnippet: {
      hanzi: '我喜欢喝茶',
      pinyin: 'wǒ xǐhuan hē chá',
      translation: 'Eu gosto de tomar chá'
    },
    actionPrompt: 'Use o construtor sempre que quiser experimentar novas frases!'
  },
  {
    id: 'pronunciation',
    title: '2. Modo Pronúncia & Voz com IA',
    hanzi: '发音训练',
    pinyin: 'fāyīn xùnliàn',
    targetTab: 'pronuncia',
    icon: Mic,
    themeColor: 'from-rose-600 to-amber-600',
    badge: 'Voz & Tons',
    summary: 'Treine sua fala pelo microfone com inteligência artificial Gemini Speech-to-Text. O app analisa sua pronúncia, mede a proximidade e aponta desvios de tom.',
    keyPoints: [
      'O app pronuncia a frase de referência (com opção de velocidade lenta 0.65x)',
      'Você pressiona o microfone e repete a frase em voz alta',
      'O sistema destaca cada palavra: verde (acertou) ou vermelho (erro de tom)',
      'As palavras difíceis são salvas no localStorage e priorizadas nos próximos exercícios'
    ],
    previewSnippet: {
      hanzi: '我想买苹果',
      pinyin: 'wǒ xiǎng mǎi píngguǒ',
      translation: 'Cuidado com o 3º tom de mǎi (comprar) vs 4º tom de mài (vender)'
    },
    actionPrompt: 'Pratique a fala diariamente para destravar os 4 tons do mandarim!'
  },
  {
    id: 'repeticoes',
    title: '3. Módulo Repetições (Esteira & Duplicadora)',
    hanzi: '叠词制造机',
    pinyin: 'diécí zhìzào jī',
    targetTab: 'repeticoes',
    icon: '🔁',
    themeColor: 'from-purple-600 to-indigo-600',
    badge: 'Morfologia',
    summary: 'Descubra por que os chineses duplicam palavras! Na esteira interativa, o verbo entra na máquina duplicadora e sai com um novo significado mais suave e educado.',
    keyPoints: [
      'Verbos duplicados (看看, 等等, 试一试): suavizam pedidos ("dar uma olhadinha", "esperar um pouco")',
      'Modéstia (哪里哪里): resposta educada para elogios ("que nada, imagina!")',
      'Universalidade (天天, 人人): substantivos repetidos significam "todo mundo" ou "todos os dias"'
    ],
    previewSnippet: {
      hanzi: '看 (olhar) ➔ 看看 (dar uma olhadinha)',
      pinyin: 'kàn ➔ kànkan',
      translation: 'Ação rápida, informal e acolhedora'
    },
    actionPrompt: 'Clique nas palavras na esteira e veja a transformação mecânica acontecer!'
  },
  {
    id: 'slots',
    title: '4. Caça-níqueis de Frases (5 Faixas)',
    hanzi: '老虎机',
    pinyin: 'lǎohǔjī',
    targetTab: 'slots',
    icon: '🎰',
    themeColor: 'from-amber-500 to-yellow-600',
    badge: 'Sintaxe Rápida',
    summary: 'Gire 5 faixas temáticas que formam estruturas gramaticais reais: Tempo + Sujeito + Local (com 在/去/想去) + Verbo + Objeto.',
    keyPoints: [
      'Puxe a alavanca para sortear uma combinação sintática inédita',
      'Descubra o significado natural da frase gerada',
      'Aprenda a diferença entre estar em um local (在 zài) e ir até ele (去 qù / 想去 xiǎng qù)'
    ],
    previewSnippet: {
      hanzi: '晚上 他 想去超市 买 意大利面',
      pinyin: 'wǎnshang tā xiǎng qù chāoshì mǎi yìdàlìmiàn',
      translation: 'À noite ele quer ir ao supermercado comprar macarrão'
    },
    actionPrompt: 'Teste seu raciocínio rápido acertando as traduções sorteadas!'
  },
  {
    id: 'shop',
    title: '5. Loja de Roupas Chinesas',
    hanzi: '服装店',
    pinyin: 'fúzhuāngdiàn',
    targetTab: 'shop',
    icon: ShoppingBag,
    themeColor: 'from-rose-500 to-pink-600',
    badge: 'Simulação Real',
    summary: 'Simule compras reais em uma boutique de roupas na China. Pergunte preços, responda valores por extenso e aprenda a pechinchar.',
    keyPoints: [
      'Pergunte preços usando "...多少钱" (duōshao qián)',
      'O preço considera a cor e a demanda cultural (vermelho e amarelo são mais nobres)',
      'Use o botão "太贵了!" (tài guì le!) para pedir desconto e renegociar o valor',
      'Treine a conversão de números arábicos para números chineses por extenso'
    ],
    previewSnippet: {
      hanzi: '这件红衣服多少钱？太贵了！',
      pinyin: 'zhè jiàn hóng yīfu duōshao qián? tài guì le!',
      translation: 'Quanto custa esta roupa vermelha? Está muito cara!'
    },
    actionPrompt: 'Compre peças coloridas e acumule saldo na sua carteira da loja!'
  },
  {
    id: 'practice',
    title: '6. Modo Prática Guiada',
    hanzi: '练习模式',
    pinyin: 'liànxí móshì',
    targetTab: 'practice',
    icon: Target,
    themeColor: 'from-emerald-500 to-teal-600',
    badge: 'Missões HSK',
    summary: 'Exercícios estruturados com objetivos pedagógicos progressivos do HSK 1 ao HSK 2.',
    keyPoints: [
      'Receba uma missão em português e construa a resposta em ideogramas',
      'Receba dicas imediatas ao escolher uma palavra fora de ordem',
      'Avance por níveis e ganhe confiança sintática passo a passo'
    ],
    actionPrompt: 'Ideal para quem está começando do zero e quer um trilho guiado!'
  },
  {
    id: 'hanzi_canvas',
    title: '7. Modo Hanzi (Grade de Traçado)',
    hanzi: '汉字描红',
    pinyin: 'hànzì miáohóng',
    targetTab: 'hanzi',
    icon: PenTool,
    themeColor: 'from-rose-600 to-red-600',
    badge: 'Escrita',
    summary: 'Aprenda a desenhar ideogramas diretamente na tela com o mouse ou o dedo na tradicional grade 米字格 (Mǐ Zì Gé).',
    keyPoints: [
      'Guia visual com a ordem correta dos traços chineses',
      'Cálculo automático de precisão e fidelidade ao traçado padrão',
      'Botão para enviar o caractere desenhado direto para o construtor'
    ],
    actionPrompt: 'Desenhe caracteres essenciais como 我, 你, 好, 爱 e 茶!'
  },
  {
    id: 'flashcards',
    title: '8. Flashcards Mnemônicos 3D',
    hanzi: '字卡记忆',
    pinyin: 'zìkǎ jìyì',
    targetTab: 'flashcards',
    icon: Sparkles,
    themeColor: 'from-amber-600 to-orange-500',
    badge: 'Memória Visual',
    summary: 'Descubra a origem pictográfica e a etimologia visual dos ideogramas com animações e mnemônicas.',
    keyPoints: [
      'Veja como o ideograma de "árvore" (木) ou "pessoa" (人) se originou de desenhos reais',
      'Biblioteca 3D interativa com pronúncia e exemplos práticos',
      'Botão "Embaralhar" para revisar seu vocabulário a qualquer momento'
    ],
    actionPrompt: 'Memorize mais rápido associando a forma do caractere ao seu significado!'
  },
  {
    id: 'quiz',
    title: '9. Quiz de Gramática',
    hanzi: '语法测试',
    pinyin: 'yǔfǎ cèshì',
    targetTab: 'quiz',
    icon: Shuffle,
    themeColor: 'from-purple-500 to-indigo-600',
    badge: 'Desafio',
    summary: 'Teste seus conhecimentos em perguntas rápidas de múltipla escolha com foco em partículas gramaticais e estruturas chave.',
    keyPoints: [
      'Perguntas sobre classificadores (个, 本, 只, 件, 张)',
      'Diferença entre partículas interrogativas (吗, 几, 多少)',
      'Feedback detalhado explicando o motivo de cada acerto ou erro'
    ],
    actionPrompt: 'Faça um teste de 5 perguntas e veja sua pontuação subir!'
  },
  {
    id: 'hq_comic',
    title: '10. Módulo HQ: Pato & Peixe',
    hanzi: '连环画 (鸭与鱼)',
    pinyin: 'liánhuánhuà (yā yǔ yú)',
    targetTab: 'hq',
    icon: '🦆',
    themeColor: 'from-amber-500 to-emerald-600',
    badge: 'História em Quadrinhos',
    summary: 'História em quadrinhos com pato e peixe para dominar as diferenças entre 会 (habilidade aprendida/inata), 一点儿 (um pouco), 能 (capacidade física), 可以 (permissão) e 知道 (informação).',
    keyPoints: [
      '① O peixe sabe nadar por natureza (会, 能, 可以)',
      '② O pato também sabe nadar um pouco (会, 能, 可以, 一点儿)',
      '③ O pato ferido sabe, mas NÃO CONSEGUE nadar (sem o 能)',
      '④ Proibido nadar no lago (sem o 可以)',
      '⑤ O peixe não tem a informação do nome (sem o 知道)'
    ],
    previewSnippet: {
      hanzi: '这条鱼会游泳。这只鸭子不能游泳。',
      pinyin: 'Zhè tiáo yú huì yóuyǒng. Zhè zhī yāzi bù néng yóuyǒng.',
      translation: 'O peixe sabe nadar. O pato ferido não consegue nadar.'
    },
    actionPrompt: 'Responda as 5 perguntas com os 5 checkboxes e valide suas respostas!'
  },
  {
    id: 'reference_tools',
    title: '11. Ferramentas de Consulta & Apoio',
    hanzi: '参考工具',
    pinyin: 'cānkǎo gōngjù',
    icon: BookOpen,
    themeColor: 'from-teal-600 to-cyan-600',
    badge: 'Dicionário & Guias',
    summary: 'Três ferramentas essenciais disponíveis a qualquer momento na barra superior ou menu:',
    keyPoints: [
      '📖 Dicionário Visual (/dic): busca rápida por pinyin, português ou hanzi com áudio nativo',
      '🔢 Guia de Números Chineses (/num): conversor automático de algarismos para caracteres por extenso',
      '⚠️ Não Confundir! (/nao-conf): guia de homófonos (和 vs 也 vs 还, 是 vs 试) e complementos de ação'
    ],
    actionPrompt: 'Consulte sempre que tiver dúvidas sobre grafia, números ou falsos cognatos!'
  },
  {
    id: 'pwa_install',
    title: '12. Instalação do Aplicativo (Celular, Tablet e PC)',
    hanzi: '应用安装',
    pinyin: 'yìngyòng ānzhuāng',
    icon: Smartphone,
    themeColor: 'from-emerald-600 to-sky-600',
    badge: 'Multiplataforma',
    summary: 'O Fraseiro Mandarim é um Progressive Web App (PWA) de alta performance e pode ser instalado diretamente no seu celular Android, iPhone, tablet ou computador desktop.',
    keyPoints: [
      'Toque no botão "Instalar App" no topo para fixar o ícone na sua tela inicial',
      'Funciona em tela cheia como um aplicativo nativo e armazena dados offline',
      'Layout adaptativo desenvolvido para celular, tablet e computador'
    ],
    actionPrompt: 'Você está pronto para dominar o mandarim! Comece agora seu aprendizado.'
  }
];

export interface InteractiveTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: AppModeTab;
  onNavigateTab: (tab: AppModeTab) => void;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  onExploreCurrentMode: (stepIndex: number, modeTitle: string) => void;
  onCompleteTutorial: () => void;
  onOpenDictionary?: () => void;
  onOpenNumbers?: () => void;
  onOpenFalseFriends?: () => void;
}

export const InteractiveTutorialModal: React.FC<InteractiveTutorialModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  onNavigateTab,
  currentStepIndex,
  onStepChange,
  onExploreCurrentMode,
  onCompleteTutorial,
  onOpenDictionary,
  onOpenNumbers,
  onOpenFalseFriends
}) => {
  const step = TUTORIAL_STEPS[currentStepIndex] || TUTORIAL_STEPS[0];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TUTORIAL_STEPS.length - 1;
  const progressPercent = Math.round(((currentStepIndex + 1) / TUTORIAL_STEPS.length) * 100);

  // When step changes, switch background view to match the explained module
  useEffect(() => {
    if (!isOpen) return;
    if (step.targetTab && step.targetTab !== activeTab) {
      onNavigateTab(step.targetTab);
    }
  }, [currentStepIndex, isOpen]);

  const handleNext = () => {
    if (isLastStep) {
      onCompleteTutorial();
    } else {
      const nextIndex = Math.min(TUTORIAL_STEPS.length - 1, currentStepIndex + 1);
      onStepChange(nextIndex);
      const nextStep = TUTORIAL_STEPS[nextIndex];
      if (nextStep && nextStep.targetTab) {
        onNavigateTab(nextStep.targetTab);
        // Quando o tutorial muda o modo de estudo, ativa a exploração com o botão piscando
        onExploreCurrentMode(nextIndex, nextStep.title);
      }
    }
  };

  const handlePrev = () => {
    const prevIndex = Math.max(0, currentStepIndex - 1);
    onStepChange(prevIndex);
    const prevStep = TUTORIAL_STEPS[prevIndex];
    if (prevStep && prevStep.targetTab) {
      onNavigateTab(prevStep.targetTab);
    }
  };

  const handleExploreModeClick = () => {
    onExploreCurrentMode(currentStepIndex, step.title);
  };

  if (!isOpen) return null;

  const IconComponent = step.icon;
  const hasStudyMode = !!step.targetTab;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 select-none">
        {/* Backdrop com blur escurecido */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleExploreModeClick}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal Card Centralizado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Top Header com gradiente do passo */}
          <div className={`p-4 sm:p-6 bg-gradient-to-r ${step.themeColor} text-white flex items-center justify-between gap-3 relative overflow-hidden shrink-0`}>
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner shrink-0">
                {typeof IconComponent === 'string' ? (
                  <span>{IconComponent}</span>
                ) : (
                  <IconComponent className="w-6 h-6 text-white" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/25 text-white">
                    {step.badge}
                  </span>
                  <span className="text-xs text-white/80 font-medium">
                    Passo {currentStepIndex + 1} de {TUTORIAL_STEPS.length}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight mt-0.5">
                  {step.title}
                </h2>
                <div className="text-xs text-white/90 font-serif">
                  {step.hanzi} • <span className="font-sans text-[11px] font-normal">{step.pinyin}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExploreModeClick}
              className="p-2 rounded-2xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer shrink-0"
              title="Explorar este modo agora (o botão Tutorial ficará piscando no topo)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barra de Progresso Superior */}
          <div className="w-full bg-slate-100 h-1.5 shrink-0">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 via-rose-500 to-amber-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Conteúdo do Passo com Scroll */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-800 text-sm">
            {/* Destaque de Modo em Tela Cheia */}
            {hasStudyMode && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>
                    O modo <strong>{step.title}</strong> está aberto ao fundo! Você pode testá-lo agora ou avançar.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleExploreModeClick}
                  className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] shrink-0 cursor-pointer shadow-xs transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Explorar agora</span>
                </button>
              </div>
            )}

            {/* Descrição Principal */}
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
              {step.summary}
            </p>

            {/* Snippet / Exemplo Visual Prático (se aplicável) */}
            {step.previewSnippet && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Exemplo Prático
                </span>
                <div className="text-xl sm:text-2xl font-black text-indigo-900 font-serif">
                  {step.previewSnippet.hanzi}
                </div>
                <div className="text-xs font-bold text-indigo-600">
                  {step.previewSnippet.pinyin}
                </div>
                <div className="text-xs text-slate-600 italic">
                  "{step.previewSnippet.translation}"
                </div>
              </div>
            )}

            {/* Destaques / Pontos Chave */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Como usar este recurso:
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {step.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      ✓
                    </div>
                    <span className="leading-snug">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chamada para Ação */}
            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs font-semibold text-indigo-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{step.actionPrompt}</span>
            </div>
          </div>

          {/* Rodapé com Navegação */}
          <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            {/* Botão de explorar este modo */}
            {hasStudyMode ? (
              <button
                type="button"
                onClick={handleExploreModeClick}
                className="text-xs font-extrabold text-amber-700 hover:text-amber-800 bg-amber-100/70 hover:bg-amber-100 border border-amber-300/80 px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all self-start sm:self-auto"
                title="Minimiza o tutorial e faz o botão 'Tutorial' piscar no topo para você explorar o modo"
              >
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                <span>Explorar Modo na Prática (o botão piscará no topo)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onCompleteTutorial}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
              >
                Pular Tutorial
              </button>
            )}

            {/* Botões de Ação */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {!isFirstStep && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95"
              >
                <span>{isLastStep ? 'Concluir Tutorial 🎉' : 'Próximo Modo'}</span>
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
