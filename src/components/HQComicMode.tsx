import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  HelpCircle, 
  RotateCcw, 
  Sparkles, 
  Trophy, 
  ChevronRight, 
  Eye, 
  Check, 
  BookOpen, 
  Info,
  Maximize2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { speakMandarin } from '../utils/speech';
import patoEPeixeImg from '../assets/pato_e_peixe.png';

export type HQOptionKey = 'hui' | 'yidianr' | 'neng' | 'keyi' | 'zhidao';

export interface HQOptionDef {
  key: HQOptionKey;
  hanzi: string;
  pinyin: string;
  meaning: string;
  ruleExplanation: string;
  badgeColor: string;
}

export const HQ_OPTIONS: HQOptionDef[] = [
  {
    key: 'hui',
    hanzi: '会',
    pinyin: 'huì',
    meaning: 'Saber / Habilidade aprendida ou inata',
    ruleExplanation: 'Usado para habilidades adquiridas com estudo, treino ou inatas (como nadar, falar chinês, dirigir).',
    badgeColor: 'bg-blue-600 text-white',
  },
  {
    key: 'yidianr',
    hanzi: '一点儿',
    pinyin: 'yìdiǎnr',
    meaning: 'Um pouco / Intensidade parcial',
    ruleExplanation: 'Indica intensidade moderada ou restrita ("sabe apenas um pouco", "só um pouquinho").',
    badgeColor: 'bg-amber-600 text-white',
  },
  {
    key: 'neng',
    hanzi: '能',
    pinyin: 'néng',
    meaning: 'Conseguir / Capacidade física e condições',
    ruleExplanation: 'Tem a ver com capacidade física no momento, condições externas e possibilidade (se machucado: 不能).',
    badgeColor: 'bg-emerald-600 text-white',
  },
  {
    key: 'keyi',
    hanzi: '可以',
    pinyin: 'kěyǐ',
    meaning: 'Poder / Permissão ou autorização',
    ruleExplanation: 'Sobre pedir ou conceder permissão/autorização (se proibido por regras ou placa: 不可以).',
    badgeColor: 'bg-purple-600 text-white',
  },
  {
    key: 'zhidao',
    hanzi: '知道',
    pinyin: 'zhīdào',
    meaning: 'Saber / Informação, fato ou notícia',
    ruleExplanation: 'Conhecer um fato, informação, nome ou notícia (ex: saber o nome de alguém; se não sabe: 不知道).',
    badgeColor: 'bg-rose-600 text-white',
  },
];

export interface HQQuestion {
  id: number;
  panelNumber: number;
  title: string;
  hanziPrompt: string;
  pinyinPrompt: string;
  comicText: string;
  comicPinyin: string;
  comicTranslation: string;
  contextDesc: string;
  correctKeys: HQOptionKey[];
  // Resposta tolerada alternativa (caso o estudante marque a visão direta do foco)
  alternativeKeys?: HQOptionKey[];
  pedagogicalNote: string;
}

export const HQ_QUESTIONS: HQQuestion[] = [
  {
    id: 1,
    panelNumber: 1,
    title: '1. O peixe... nadar',
    hanziPrompt: '这条鱼...游泳',
    pinyinPrompt: 'Zhè tiáo yú... yóuyǒng',
    comicText: '这条鱼会游泳。',
    comicPinyin: 'Zhè tiáo yú huì yóuyǒng.',
    comicTranslation: 'Este peixe sabe nadar.',
    contextDesc: 'No quadro ①, o peixe nada perfeitamente na água. Ele sabe nadar por natureza, consegue fisicamente e tem permissão natural para nadar nas águas.',
    correctKeys: ['hui', 'neng', 'keyi'],
    pedagogicalNote: 'R.: "huì", "neng" e "keyi" (Ele sabe [habilidade inata], consegue [capacidade física] e é permitido [permissão]). Não marcamos 一点儿 porque ele nada plenamente, nem 知道 porque 知道 é apenas para fatos/notícias.',
  },
  {
    id: 2,
    panelNumber: 2,
    title: '2. O pato... nadar',
    hanziPrompt: '这只鸭子也...游泳',
    pinyinPrompt: 'Zhè zhī yāzi yě... yóuyǒng',
    comicText: '这只鸭子也会游泳..一点儿',
    comicPinyin: 'Zhè zhī yāzi yě huì yóuyǒng.. yìdiǎnr',
    comicTranslation: 'Este pato também sabe nadar... um pouco.',
    contextDesc: 'No quadro ②, o patinho alegre está nadando e espirrando água. Ele sabe, tem capacidade física, é permitido, mas nada apenas "um pouco".',
    correctKeys: ['hui', 'yidianr', 'neng', 'keyi'],
    pedagogicalNote: 'R.: "huì", "neng", "keyi" e "yi dian´r" (Idem ao peixe, mas ele sabe só "um pouco" - 一点儿). 知道 não se aplica.',
  },
  {
    id: 3,
    panelNumber: 3,
    title: '3. Este pato...',
    hanziPrompt: '这只鸭子...',
    pinyinPrompt: 'Zhè zhī yāzi...',
    comicText: '这只鸭子不能游泳',
    comicPinyin: 'Zhè zhī yāzi bù néng yóuyǒng',
    comicTranslation: 'Este pato não consegue nadar (está machucado).',
    contextDesc: 'No quadro ③, o pato está com atadura na cabeça e machucado na asa, sentado na margem. Ele ainda sabe a técnica e é permitido nadar, mas NÃO CONSEGUE fisicamente.',
    correctKeys: ['hui', 'yidianr', 'keyi'],
    pedagogicalNote: 'R.: Idem ao 2, mas sem o "neng" (huì, keyi e yi dian´r). O pato sabe nadar (um pouco), mas NÃO CONSEGUE (porque está machucado: 不能!).',
  },
  {
    id: 4,
    panelNumber: 4,
    title: '4. É permitido nadar?',
    hanziPrompt: '我可以在这里游泳吗？不可以！',
    pinyinPrompt: 'Wǒ kěyǐ zài zhèlǐ yóuyǒng ma? Bù kěyǐ!',
    comicText: '我可以在这里游泳吗？不可以！',
    comicPinyin: 'Wǒ kěyǐ zài zhèlǐ yóuyǒng ma? Bù kěyǐ!',
    comicTranslation: 'Posso nadar aqui? Não pode / Não é permitido!',
    contextDesc: 'No quadro ④, há uma placa de madeira com símbolo de proibido nadar. A permissão está explicitamente NEGADA (不可以!).',
    correctKeys: ['hui', 'yidianr', 'neng', 'zhidao'],
    alternativeKeys: ['keyi'],
    pedagogicalNote: 'R.: Todos marcados, exceto "keyi" (Como a placa proíbe enfaticamente "不可以!", a permissão está excluída da resposta afirmativa!).',
  },
  {
    id: 5,
    panelNumber: 5,
    title: '5. O peixe sabe o nome do pato?',
    hanziPrompt: '这条鱼不知道它朋友的名字',
    pinyinPrompt: 'Zhè tiáo yú bù zhīdào tā péngyou de míngzi',
    comicText: '这条鱼不知道它朋友的名字 / 我叫什么名字',
    comicPinyin: 'Zhè tiáo yú bù zhīdào tā péngyou de míngzi / Wǒ jiào shénme míngzi',
    comicTranslation: 'Este peixe não sabe o nome do amigo dele. / Qual é o meu nome?',
    contextDesc: 'No quadro ⑤, o pato pergunta "我叫什么名字?" e o peixe fica com um ponto de interrogação. O peixe NÃO conhece a informação do nome (不知道!).',
    correctKeys: ['hui', 'yidianr', 'neng', 'keyi'],
    alternativeKeys: ['zhidao'],
    pedagogicalNote: 'R.: Todos marcados, exceto "zhi dao" (Como a legenda diz expressamente "不知道", o peixe NÃO sabe a informação, excluindo 知道 das respostas afirmativas!).',
  },
];

export const HQComicMode: React.FC = () => {
  // Estado das seleções: dicionário de questionId -> Set de chaves marcadas
  const [userSelections, setUserSelections] = useState<Record<number, HQOptionKey[]>>({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  });

  const [hasChecked, setHasChecked] = useState<boolean>(false);
  const [isRulesExpanded, setIsRulesExpanded] = useState<boolean>(true);
  const [selectedPanelZoom, setSelectedPanelZoom] = useState<number | null>(null);
  const [isFullImageOpen, setIsFullImageOpen] = useState<boolean>(false);

  // Alterna o checkbox de uma pergunta
  const toggleOption = (questionId: number, key: HQOptionKey) => {
    setUserSelections(prev => {
      const current = prev[questionId] || [];
      const updated = current.includes(key)
        ? current.filter(k => k !== key)
        : [...current, key];
      return { ...prev, [questionId]: updated };
    });
  };

  // Avaliação de cada pergunta
  const evaluationResults = useMemo(() => {
    return HQ_QUESTIONS.map(q => {
      const selected = userSelections[q.id] || [];
      const isExactMatch = 
        selected.length === q.correctKeys.length &&
        q.correctKeys.every(k => selected.includes(k));

      // Aceita também resposta alternativa se configurada
      const isAltMatch = q.alternativeKeys && 
        selected.length === q.alternativeKeys.length &&
        q.alternativeKeys.every(k => selected.includes(k));

      const isCorrect = isExactMatch || !!isAltMatch;

      return {
        questionId: q.id,
        selected,
        isCorrect,
        missingKeys: q.correctKeys.filter(k => !selected.includes(k)),
        extraKeys: selected.filter(k => !q.correctKeys.includes(k)),
      };
    });
  }, [userSelections]);

  const scoreCount = evaluationResults.filter(r => r.isCorrect).length;
  const allCorrect = scoreCount === HQ_QUESTIONS.length;

  // Botão: Preencher Gabarito Oficial da HQ (facilita testar e conferir)
  const handleFillCorrectAnswers = () => {
    const correctMap: Record<number, HQOptionKey[]> = {};
    HQ_QUESTIONS.forEach(q => {
      correctMap[q.id] = [...q.correctKeys];
    });
    setUserSelections(correctMap);
    setHasChecked(true);
  };

  // Botão: Limpar Seleções
  const handleReset = () => {
    setUserSelections({
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    });
    setHasChecked(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 select-none">
      {/* Top Banner do Módulo HQ */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-950/30 text-amber-100 backdrop-blur-xs border border-white/20">
                Módulo HQ • História em Quadrinhos
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white">
                v1.2026.11.11
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
              <span>🦆 Pato & Peixe 🐟</span>
              <span className="text-lg sm:text-xl font-normal opacity-90 font-serif">鸭与鱼</span>
            </h1>

            <p className="text-xs sm:text-sm text-white/95 max-w-2xl font-medium leading-relaxed">
              Descubra na prática a diferença sutil entre os verbos modais e de cognição em mandarim:
              <strong className="text-amber-200"> 会 (huì)</strong>, 
              <strong className="text-amber-200"> 一点儿 (yìdiǎnr)</strong>, 
              <strong className="text-emerald-200"> 能 (néng)</strong>, 
              <strong className="text-purple-200"> 可以 (kěyǐ)</strong> e 
              <strong className="text-rose-200"> 知道 (zhīdào)</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => speakMandarin('这条鱼会游泳。这只鸭子也会游泳一点儿。这只鸭子不能游泳。我可以在这里游泳吗？不可以！这条鱼不知道它朋友的名字。')}
              className="px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              title="Ouvir a história completa em chinês nativo"
            >
              <Volume2 className="w-4 h-4" />
              <span>Ouvir HQ</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullImageOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-white text-slate-900 hover:bg-amber-50 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
              title="Ver imagem completa dos quadrinhos em tamanho grande"
            >
              <Maximize2 className="w-4 h-4 text-amber-600" />
              <span>Ampliar HQ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Seção 2: Explicação Gramatical das 4 Regras (Item 2 do pedido) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                Gramática da HQ: As 4 Regras Essenciais
              </h2>
              <p className="text-xs text-slate-500">
                Guia comparativo para saber exatamente quando usar cada termo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsRulesExpanded(!isRulesExpanded)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            {isRulesExpanded ? 'Ocultar Regras' : 'Ver Regras'}
          </button>
        </div>

        {isRulesExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {/* 2.1 - 会 huì */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-blue-900 font-serif">会 (huì)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-200 text-blue-800">
                  Item 2.1
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                É para <strong>habilidades aprendidas com estudo e prática</strong> (ou inatas).
              </p>
              <div className="text-[11px] text-blue-800 bg-blue-100/60 p-2 rounded-xl mt-1">
                <em>Ex:</em> O peixe sabe nadar por natureza; nós sabemos falar chinês porque estudamos.
              </div>
            </div>

            {/* 2.2 - 能 néng */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-emerald-900 font-serif">能 (néng)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-800">
                  Item 2.2
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Tem a ver com <strong>capacidade física, condições externas e possibilidade</strong>.
              </p>
              <div className="text-[11px] text-emerald-800 bg-emerald-100/60 p-2 rounded-xl mt-1">
                <em>Ex:</em> O pato sabe nadar, mas hoje está machucado: <strong>不能 (não consegue)</strong>!
              </div>
            </div>

            {/* 2.3 - 可以 kěyǐ */}
            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-purple-900 font-serif">可以 (kěyǐ)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-200 text-purple-800">
                  Item 2.3
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                É sobre <strong>pedir ou dar permissão e autorização</strong>.
              </p>
              <div className="text-[11px] text-purple-800 bg-purple-100/60 p-2 rounded-xl mt-1">
                <em>Ex:</em> A placa do lago proíbe: <strong>不可以 (não é permitido nadar aqui!)</strong>.
              </div>
            </div>

            {/* 2.4 - 知道 zhīdào */}
            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-rose-900 font-serif">知道 (zhīdào)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-200 text-rose-800">
                  Item 2.4
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                É <strong>conhecer uma informação, fato, dado ou notícia</strong>.
              </p>
              <div className="text-[11px] text-rose-800 bg-rose-100/60 p-2 rounded-xl mt-1">
                <em>Ex:</em> O peixe não tem a informação de qual é o nome do amigo: <strong>不知道</strong>.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visual da Imagem da HQ com Recortes e Miniaturas Clicáveis */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎨</span>
            <h3 className="text-sm font-black text-slate-800">
              História em Quadrinhos Completa (5 Quadros)
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Clique na imagem para ampliar ou nos botões dos quadros abaixo
          </span>
        </div>

        {/* Imagem Completa */}
        <div 
          onClick={() => setIsFullImageOpen(true)}
          className="relative rounded-2xl overflow-hidden border-2 border-slate-200 cursor-pointer group shadow-sm hover:shadow-md transition-shadow bg-slate-900 flex items-center justify-center"
        >
          <img 
            src={patoEPeixeImg} 
            alt="História em quadrinhos: O Pato e o Peixe (鸭与鱼)" 
            className="w-full h-auto object-contain max-h-[460px] group-hover:scale-[1.01] transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-4 py-2 rounded-xl bg-white/95 text-slate-950 text-xs font-black shadow-lg flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-indigo-600" />
              Clique para ampliar em tela cheia
            </span>
          </div>
        </div>

        {/* Navegador Rápido de Quadros 1 a 5 com Áudio */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
          {HQ_QUESTIONS.map(q => (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                speakMandarin(q.comicText);
                setSelectedPanelZoom(q.panelNumber);
              }}
              className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 shadow-2xs active:scale-95 ${
                selectedPanelZoom === q.panelNumber
                  ? 'border-amber-400 bg-amber-50/70 ring-2 ring-amber-300'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px]">
                    {q.panelNumber}
                  </span>
                  <span>Quadro {q.panelNumber}</span>
                </span>
                <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <div className="text-[11px] font-bold text-slate-800 font-serif truncate">
                {q.comicText}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {q.comicTranslation}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Painel Central das 5 Perguntas Interativas com os 5 Checkboxes */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>📝</span>
              <span>As 5 Perguntas do Desafio</span>
            </h3>
            <p className="text-xs text-slate-500">
              Para cada situação da HQ, marque todas as opções que correspondem à regra gramatical correta.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFillCorrectAnswers}
              className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-black transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              title="Preenche automaticamente as 5 respostas oficiais conforme solicitado pelo exercício"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Gabarito Oficial</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              title="Limpar todas as respostas marcadas"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Limpar</span>
            </button>
          </div>
        </div>

        {/* Lista das 5 Perguntas */}
        <div className="space-y-4">
          {HQ_QUESTIONS.map(q => {
            const currentSelected = userSelections[q.id] || [];
            const evalResult = evaluationResults.find(r => r.questionId === q.id);
            const isCorrect = evalResult?.isCorrect;

            return (
              <div
                key={q.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-sm space-y-4 ${
                  hasChecked
                    ? isCorrect
                      ? 'border-emerald-300 ring-2 ring-emerald-100 bg-emerald-50/20'
                      : 'border-amber-300 ring-2 ring-amber-100 bg-amber-50/15'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {/* Cabeçalho da Pergunta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">
                        {q.panelNumber}
                      </span>
                      <h4 className="text-base font-black text-slate-900">
                        {q.title}
                      </h4>
                      <button
                        type="button"
                        onClick={() => speakMandarin(q.comicText)}
                        className="p-1 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        title="Ouvir frase da HQ"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-600 font-serif pl-8 flex items-center gap-2">
                      <span className="font-bold text-slate-800">{q.hanziPrompt}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-sans text-slate-500">{q.pinyinPrompt}</span>
                    </div>
                  </div>

                  {/* Status de Validação */}
                  {hasChecked && (
                    <div className="pl-8 sm:pl-0">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Correto ✓</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-200">
                          <HelpCircle className="w-4 h-4 text-amber-600" />
                          <span>Revisar Resposta</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Descrição do Contexto da HQ */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Cenário da HQ: </span>
                    <span>{q.contextDesc}</span>
                  </div>
                </div>

                {/* Os 5 Checkboxes Requisitados pelo Usuário */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Selecione os termos válidos (5 checkboxes):
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
                    {HQ_OPTIONS.map(opt => {
                      const isChecked = currentSelected.includes(opt.key);
                      const isExpected = q.correctKeys.includes(opt.key);

                      let checkCardStyle = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300';
                      if (isChecked) {
                        checkCardStyle = 'bg-indigo-50/70 border-indigo-500 text-indigo-950 font-bold shadow-xs';
                      }
                      if (hasChecked) {
                        if (isChecked && isExpected) {
                          checkCardStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs';
                        } else if (isChecked && !isExpected) {
                          checkCardStyle = 'bg-rose-50 border-rose-400 text-rose-950 line-through';
                        } else if (!isChecked && isExpected) {
                          checkCardStyle = 'bg-amber-50/80 border-dashed border-amber-400 text-amber-950';
                        }
                      }

                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => toggleOption(q.id, opt.key)}
                          className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 active:scale-95 select-none ${checkCardStyle}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-black font-serif">
                              {opt.hanzi}
                            </span>
                            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors ${
                              isChecked 
                                ? hasChecked && isExpected 
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'bg-indigo-600 border-indigo-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}>
                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-bold text-slate-700">
                              {opt.pinyin}
                            </div>
                            <div className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                              {opt.meaning}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback Pedagógico (após conferir ou quando acerta) */}
                {hasChecked && (
                  <motion.div 
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3.5 rounded-2xl text-xs space-y-1.5 ${
                      isCorrect 
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' 
                        : 'bg-amber-50 border border-amber-200 text-amber-950'
                    }`}
                  >
                    <div className="font-black flex items-center gap-1.5">
                      <span>💡 Explicação do Exercício:</span>
                    </div>
                    <p className="leading-relaxed">
                      {q.pedagogicalNote}
                    </p>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Rodapé de Ação e Verificação */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner ${
              allCorrect 
                ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                : 'bg-slate-100 text-slate-700'
            }`}>
              {scoreCount}/{HQ_QUESTIONS.length}
            </div>
            <div>
              <div className="text-sm font-black text-slate-900">
                {allCorrect 
                  ? 'Parabéns! Todas as 5 respostas corretas! 🎉' 
                  : `Progresso: ${scoreCount} de ${HQ_QUESTIONS.length} perguntas resolvidas`}
              </div>
              <div className="text-xs text-slate-500">
                {allCorrect 
                  ? 'Você dominou as diferenças entre 会, 一点儿, 能, 可以 e 知道!' 
                  : 'Marque os checkboxes e clique em "Conferir Respostas" para validar.'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setHasChecked(true)}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Conferir Respostas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Zoom da Imagem em Tela Cheia */}
      <AnimatePresence>
        {isFullImageOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl w-full max-h-[92vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col"
            >
              <div className="p-4 bg-slate-800 text-white flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎨</span>
                  <span className="font-black text-sm">HQ Pato & Peixe (鸭与鱼) • 5 Quadros</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFullImageOpen(false)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 overflow-auto flex items-center justify-center">
                <img 
                  src={patoEPeixeImg} 
                  alt="HQ Pato e Peixe ampliada" 
                  className="max-h-[80vh] w-auto object-contain rounded-xl"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
