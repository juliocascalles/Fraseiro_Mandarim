import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Tag, 
  Volume2, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Coins, 
  HelpCircle, 
  ArrowRight, 
  Award, 
  Palette, 
  LayoutGrid, 
  UserCheck, 
  Hash, 
  Lightbulb,
  Shuffle,
  Sparkles
} from 'lucide-react';
import gridRoupasImg from '../assets/grid_roupas.png';
import { 
  colors, 
  clothes, 
  nomeRoupaTraduzida, 
  nomeRoupaEmChines,
  precoFinal,
  ColorItem, 
  ClothItem 
} from '../utils/colorfulClothes';
import { convertNumberToChinese, portugueseNumberToWords } from '../utils/chineseNumbers';
import { speakMandarin } from '../utils/speech';

interface ShopModeProps {
  onOpenNumbersModal?: () => void;
}

// Componente para renderizar a sprite recortada da roupa colorida
export function ClothingSprite({
  cloth,
  cor,
  size = 'md',
  className = '',
}: {
  cloth: ClothItem;
  cor: ColorItem;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}) {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    '2xl': 'w-44 h-44',
  };

  return (
    <div
      className={`bg-no-repeat bg-center transition-transform shrink-0 ${sizeMap[size]} ${className}`}
      style={{
        backgroundImage: `url(${gridRoupasImg})`,
        backgroundSize: '700% 800%',
        backgroundPosition: `${cor.backgroundPosX}% ${cloth.backgroundPosY}%`,
      }}
      aria-label={nomeRoupaTraduzida(cloth, cor)}
    />
  );
}

// Normalizador de pinyin para comparações tolerantes
function normalizePinyin(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const ShopMode: React.FC<ShopModeProps> = ({ onOpenNumbersModal }) => {
  // Submodos da Loja:
  // 'ask_price' = Modo Cliente (perguntar o preço das peças)
  // 'answer_price' = Modo Vendedor (responder o preço ao cliente)
  // 'catalog' = Vitrine e Catálogo das 56 peças
  // 'colors_guide' = Guia de cores e fórmulas
  const [subTab, setSubTab] = useState<'ask_price' | 'answer_price' | 'catalog' | 'colors_guide'>('ask_price');

  // Moedas acumuladas nas compras/vendas
  const [walletYuans, setWalletYuans] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('shop_wallet_yuans');
      return saved ? parseInt(saved, 10) : 500;
    } catch {
      return 500;
    }
  });

  const [salesScore, setSalesScore] = useState<number>(0);

  // Peça ativa no Modo Cliente (Perguntar Preço)
  const [askCloth, setAskCloth] = useState<ClothItem>(clothes[1]); // camiseta (33)
  const [askColor, setAskColor] = useState<ColorItem>(colors[2]); // amarelo
  const [askInput, setAskInput] = useState<string>('');
  const [askFeedback, setAskFeedback] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    sellerReply?: {
      hanzi: string;
      pinyin: string;
      portuguese: string;
      price: number;
      priceChinese: string;
      pricePinyin: string;
      breakdown: string;
    };
  }>({ status: 'idle', message: '' });

  // Peça ativa no Modo Vendedor (Responder Preço)
  const [answerCloth, setAnswerCloth] = useState<ClothItem>(clothes[0]); // casaco (175)
  const [answerColor, setAnswerColor] = useState<ColorItem>(colors[0]); // azul
  const [answerInput, setAnswerInput] = useState<string>('');
  const [answerFeedback, setAnswerFeedback] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    details?: string;
  }>({ status: 'idle', message: '' });

  // Seleções do Catálogo
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('all');
  const [selectedClothFilter, setSelectedClothFilter] = useState<string>('all');
  const [inspectModalPiece, setInspectModalPiece] = useState<{
    cloth: ClothItem;
    cor: ColorItem;
  } | null>(null);

  // Sorteia uma nova peça para o Modo Cliente
  const randomizeAskPiece = () => {
    const randomCloth = clothes[Math.floor(Math.random() * clothes.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setAskCloth(randomCloth);
    setAskColor(randomColor);
    setAskInput('');
    setAskFeedback({ status: 'idle', message: '' });
  };

  // Sorteia uma nova peça para o Modo Vendedor
  const randomizeAnswerPiece = () => {
    const randomCloth = clothes[Math.floor(Math.random() * clothes.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setAnswerCloth(randomCloth);
    setAnswerColor(randomColor);
    setAnswerInput('');
    setAnswerFeedback({ status: 'idle', message: '' });
    // Toca a pergunta do cliente após 300ms
    setTimeout(() => {
      speakMandarin(`${randomColor.hanzi}的${randomCloth.hanzi}多少钱`);
    }, 300);
  };

  // Validar a pergunta de preço (Modo Cliente)
  // Regra 1.2: O usuário não precisa saber os nomes em chinês para as roupas, mas as cores são importantes!
  // Regra 3: Para perguntar o preço usar "...duo shao qian"
  const handleValidateAskPrice = () => {
    const norm = normalizePinyin(askInput);
    if (!norm) {
      setAskFeedback({
        status: 'error',
        message: 'Por favor, digite ou monte a pergunta de preço antes de enviar.',
      });
      return;
    }

    // 1. Verifica se tem a pergunta de preço "duo shao qian" (多少钱)
    const hasDuoShaoQian = 
      norm.includes('duo shao qian') || 
      norm.includes('duoshao qian') || 
      norm.includes('duoshaoqian') || 
      askInput.includes('多少钱') ||
      askInput.includes('多少');

    if (!hasDuoShaoQian) {
      setAskFeedback({
        status: 'error',
        message: 'Lembre-se da Regra 3: Para perguntar o preço, use "...duo shao qian" (多少钱)!',
      });
      return;
    }

    // 2. Verifica se mencionou a cor correta em chinês (Regra 1.2)
    // Ex: para amarelo -> "huang se" ou "huang" ou "黄色" ou "黄"
    const expectedColorNorm = normalizePinyin(askColor.pinyin); // ex: "huang se"
    const expectedColorBase = expectedColorNorm.split(' ')[0]; // ex: "huang"
    const expectedColorHanzi = askColor.hanzi; // ex: "黄色"

    const mentionsCorrectColor = 
      norm.includes(expectedColorNorm) || 
      norm.includes(expectedColorBase) || 
      askInput.includes(expectedColorHanzi) || 
      askInput.includes(expectedColorHanzi[0]);

    if (!mentionsCorrectColor) {
      // Verifica se o usuário colocou outra cor errada
      const foundOtherColor = colors.find(c => 
        norm.includes(normalizePinyin(c.pinyin)) || 
        norm.includes(normalizePinyin(c.pinyin).split(' ')[0]) ||
        askInput.includes(c.hanzi)
      );

      if (foundOtherColor) {
        setAskFeedback({
          status: 'error',
          message: `Atenção à cor: a peça mostrada é ${askColor.traducao} (${askColor.pinyin} / ${askColor.hanzi}), mas você mencionou ${foundOtherColor.traducao} (${foundOtherColor.pinyin}).`,
        });
      } else {
        setAskFeedback({
          status: 'error',
          message: `Faltou a cor em chinês! A peça é ${askColor.traducao}. Use "${askColor.pinyin}" (${askColor.hanzi}). O nome do tipo da roupa é opcional!`,
        });
      }
      return;
    }

    // Sucesso! O vendedor responde com o preço por extenso calculado
    // O preço final soma o preço base da roupa com a demanda da cor
    const priceNum = precoFinal(askCloth, askColor);
    const chineseNum = convertNumberToChinese(priceNum);
    const pieceNameHanzi = `${askColor.hanzi}的${askCloth.hanzi}`;
    const sellerSpeechHanzi = `这件${pieceNameHanzi}是${chineseNum.hanzi}块钱。`;
    const sellerSpeechPinyin = `Zhè jiàn ${askColor.pinyin} de ${askCloth.pinyin} shì ${chineseNum.pinyin} kuài qián.`;

    // Toca a fala do vendedor em mandarim
    speakMandarin(sellerSpeechHanzi);

    setAskFeedback({
      status: 'success',
      message: `Excelente pergunta! O vendedor chinês entendeu perfeitamente a cor (${askColor.pinyin}) e respondeu o preço.`,
      sellerReply: {
        hanzi: sellerSpeechHanzi,
        pinyin: sellerSpeechPinyin,
        portuguese: `Esta ${nomeRoupaTraduzida(askCloth, askColor)} custa ${chineseNum.portuguese} iuanes (¥${priceNum}).`,
        price: priceNum,
        priceChinese: `${chineseNum.hanzi} 块`,
        pricePinyin: `${chineseNum.pinyin} kuài`,
        breakdown: chineseNum.breakdown,
      },
    });
  };

  // Validar a resposta de preço (Modo Vendedor)
  // O usuário informa o preço por extenso usando o módulo de números
  const handleValidateAnswerPrice = () => {
    const norm = normalizePinyin(answerInput);
    if (!norm) {
      setAnswerFeedback({
        status: 'error',
        message: 'Digite ou monte o valor do preço em chinês por extenso.',
      });
      return;
    }

    // O preço final do produto é: preço base + demanda da cor
    const priceNum = precoFinal(answerCloth, answerColor);
    const chineseNum = convertNumberToChinese(priceNum);
    const expectedPinyin = normalizePinyin(chineseNum.pinyin); // ex: "yi bai qi shi wu"
    const expectedSpaced = normalizePinyin(chineseNum.pinyinSpaced);
    const expectedHanzi = chineseNum.hanzi; // ex: "一百七十五"

    // Comparações aceitas
    const isExactPinyin = norm === expectedPinyin || norm === expectedSpaced || norm === `${expectedPinyin} kuai` || norm === `${expectedSpaced} kuai`;
    const isExactHanzi = answerInput.trim() === expectedHanzi || answerInput.trim() === `${expectedHanzi}块` || answerInput.trim() === `${expectedHanzi}元`;
    const isNumberTyped = norm === priceNum.toString() || norm === `${priceNum} kuai` || norm === `${priceNum} yuan`;

    // Verifica se acertou o pinyin aproximado (sem espaços ou com kuai)
    const normNoSpaces = norm.replace(/\s+/g, '').replace('kuai', '').replace('yuan', '');
    const expectedNoSpaces = expectedPinyin.replace(/\s+/g, '');

    const isMatch = isExactPinyin || isExactHanzi || isNumberTyped || normNoSpaces === expectedNoSpaces;

    if (isMatch) {
      const reward = priceNum;
      const newWallet = walletYuans + reward;
      setWalletYuans(newWallet);
      try {
        localStorage.setItem('shop_wallet_yuans', newWallet.toString());
      } catch {}
      setSalesScore(prev => prev + 1);

      speakMandarin(`太好了，我买了！${expectedHanzi}块钱。`);

      setAnswerFeedback({
        status: 'success',
        message: `Parabéns! Preço correto: ${chineseNum.hanzi} (${chineseNum.pinyin}) = ¥${priceNum}!`,
        details: `O cliente ficou satisfeito e comprou o(a) ${nomeRoupaTraduzida(answerCloth, answerColor)}. Você arrecadou ¥${reward} para o caixa da loja!`,
      });
    } else {
      setAnswerFeedback({
        status: 'error',
        message: `Preço incorreto. O valor final do(a) ${nomeRoupaTraduzida(answerCloth, answerColor)} é ¥${priceNum} (Base: ¥${answerCloth.price} ${answerColor.demanda >= 0 ? `+${answerColor.demanda}` : answerColor.demanda} cor).`,
        details: `Em chinês por extenso (Regras 4.1 e 4.2): ${chineseNum.hanzi} (${chineseNum.pinyin} kuài). Decomposição: ${chineseNum.breakdown}`,
      });
    }
  };

  // Filtragem da vitrine
  const filteredPieces = useMemo(() => {
    return clothes.flatMap(cloth => {
      if (selectedClothFilter !== 'all' && cloth.pinyin !== selectedClothFilter) return [];
      return colors.filter(cor => {
        if (selectedColorFilter !== 'all' && cor.pinyin !== selectedColorFilter) return false;
        return true;
      }).map(cor => ({ cloth, cor }));
    });
  }, [selectedClothFilter, selectedColorFilter]);

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Top Banner da Loja Chinesa */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden border border-amber-300/30">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none text-9xl font-serif">
          衣
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <ShoppingBag className="w-6 h-6 text-amber-900" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                  <span>Loja de Roupas Chinesas</span>
                  <span className="text-amber-200 font-serif text-lg">服装店 (Fúzhuāngdiàn)</span>
                </h2>
                <span className="bg-amber-400/20 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300/40 uppercase">
                  Módulo 1.2026.10.29
                </span>
              </div>
              <p className="text-xs sm:text-sm text-rose-100 font-medium mt-0.5">
                Aprenda a perguntar e responder preços em mandarim, cores e números por extenso!
              </p>
            </div>
          </div>

          {/* Caixa de Yuans & Botão de Números */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/20 border border-amber-300/30 backdrop-blur-xs text-amber-200 text-xs font-bold"
              title="Seu saldo de compras e vendas na Loja de Roupas"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Caixa da Loja:</span>
              <span className="text-amber-300 font-black text-sm">¥{walletYuans}</span>
            </div>

            {onOpenNumbersModal && (
              <button
                type="button"
                onClick={onOpenNumbersModal}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs transition-all shadow-sm cursor-pointer"
                title="Abrir o conversor e guia de números em chinês por extenso (Regras 4.1 a 4.5)"
              >
                <Hash className="w-3.5 h-3.5" />
                <span>Números</span>
              </button>
            )}
          </div>
        </div>

        {/* Abas Internas da Loja */}
        <div className="flex items-center gap-1.5 mt-5 overflow-x-auto pb-1 pt-1 border-t border-white/10">
          <button
            type="button"
            onClick={() => setSubTab('ask_price')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              subTab === 'ask_price'
                ? 'bg-white text-rose-900 shadow-md scale-102'
                : 'bg-black/20 text-rose-100 hover:bg-black/30 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>1. Modo Cliente (Perguntar Preço)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('answer_price')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              subTab === 'answer_price'
                ? 'bg-white text-rose-900 shadow-md scale-102'
                : 'bg-black/20 text-rose-100 hover:bg-black/30 hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>2. Modo Vendedor (Responder Preço)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('catalog')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              subTab === 'catalog'
                ? 'bg-white text-rose-900 shadow-md scale-102'
                : 'bg-black/20 text-rose-100 hover:bg-black/30 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>3. Vitrine & Catálogo (56 Peças)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('colors_guide')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              subTab === 'colors_guide'
                ? 'bg-white text-rose-900 shadow-md scale-102'
                : 'bg-black/20 text-rose-100 hover:bg-black/30 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>4. Guia das Cores</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MODO CLIENTE: PERGUNTAR O PREÇO                                       */}
      {/* ========================================================================= */}
      {subTab === 'ask_price' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card Esquerdo: Peça Selecionada na Vitrine */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-between text-center gap-4">
            <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-indigo-500" /> Peça Escolhida
              </span>
              <button
                type="button"
                onClick={randomizeAskPiece}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="Sortear outra peça de roupa colorida"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Sortear Outra</span>
              </button>
            </div>

            {/* Sprite da Roupa com fundo suave */}
            <div className="relative group p-4 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-inner flex items-center justify-center">
              <ClothingSprite cloth={askCloth} cor={askColor} size="xl" className="filter drop-shadow-md" />
              <div 
                className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs"
                style={{ backgroundColor: askColor.traducao === 'amarelo' ? '#ca8a04' : askColor.traducao === 'azul' ? '#2563eb' : askColor.traducao === 'verde' ? '#16a34a' : askColor.traducao === 'laranja' ? '#ea580c' : askColor.traducao === 'vermelho' ? '#dc2626' : askColor.traducao === 'rosa' ? '#db2777' : '#7c3aed' }}
              >
                {askColor.traducao}
              </div>
            </div>

            {/* Informações da Peça */}
            <div className="flex flex-col items-center gap-1">
              <h3 className="text-xl font-bold text-slate-800 capitalize">
                {nomeRoupaTraduzida(askCloth, askColor)}
              </h3>
              <p className="text-sm font-semibold text-indigo-600 flex items-center gap-1.5">
                <span>Chinês:</span>
                <span className="font-serif text-slate-800 text-base">{nomeRoupaEmChines(askCloth, askColor, false)}</span>
                <span className="text-xs text-slate-500">({nomeRoupaEmChines(askCloth, askColor, true)})</span>
              </p>
              <button
                type="button"
                onClick={() => speakMandarin(nomeRoupaEmChines(askCloth, askColor, false))}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 mt-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Ouvir nome em chinês</span>
              </button>
            </div>

            {/* Dica da Regra 1.2 */}
            <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-3 text-left flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-900 leading-relaxed">
                <span className="font-bold">Regra 1.2:</span> Você <strong>não precisa saber o nome da roupa</strong> em chinês! O importante é responder com a <strong>cor ({askColor.pinyin})</strong> e terminar com <strong>"...duo shao qian"</strong> (多少钱).
              </div>
            </div>
          </div>

          {/* Card Direito: Área de Construção da Pergunta & Resposta do Vendedor */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-5">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    问
                  </div>
                  <span className="font-bold text-slate-800 text-sm">Sua Pergunta de Preço ao Vendedor</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">Use a estrutura "... duo shao qian"</span>
              </div>

              {/* Botões Rápidos / Chips para Auxiliar o Aluno */}
              <div className="flex flex-col gap-2 mb-4">
                <span className="text-xs font-bold text-slate-600">Blocos Rápidos (clique para adicionar ao campo):</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Cores */}
                  {colors.map(c => (
                    <button
                      key={c.pinyin}
                      type="button"
                      onClick={() => setAskInput(prev => prev ? `${prev} ${c.pinyin}` : c.pinyin)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        c.pinyin === askColor.pinyin
                          ? 'bg-amber-100 border-amber-300 text-amber-900 ring-2 ring-amber-300/50'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                      title={`${c.hanzi} - ${c.traducao}`}
                    >
                      {c.pinyin}
                    </button>
                  ))}

                  <span className="text-slate-300">|</span>

                  {/* Conectivo de */}
                  <button
                    type="button"
                    onClick={() => setAskInput(prev => prev ? `${prev} de` : 'de')}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-all cursor-pointer"
                  >
                    de (的)
                  </button>

                  {/* Nome da roupa atual (opcional) */}
                  <button
                    type="button"
                    onClick={() => setAskInput(prev => prev ? `${prev} ${askCloth.pinyin}` : askCloth.pinyin)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer"
                    title="Nome da roupa (opcional)"
                  >
                    {askCloth.pinyin} ({askCloth.traducao})
                  </button>

                  <span className="text-slate-300">|</span>

                  {/* Pergunta de preço oficial (Regra 3) */}
                  <button
                    type="button"
                    onClick={() => setAskInput(prev => prev ? `${prev} duo shao qian` : 'duo shao qian')}
                    className="px-3 py-1 rounded-lg text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition-all cursor-pointer"
                  >
                    duo shao qian (多少钱)
                  </button>
                </div>
              </div>

              {/* Input da Pergunta */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={askInput}
                    onChange={(e) => setAskInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleValidateAskPrice()}
                    placeholder={`Ex: ${askColor.pinyin} duo shao qian? (ou ${askColor.pinyin} de ${askCloth.pinyin} duo shao qian)`}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:outline-hidden focus:border-indigo-500 focus:bg-white shadow-inner transition-colors"
                  />
                  {askInput && (
                    <button
                      type="button"
                      onClick={() => setAskInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleValidateAskPrice}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Perguntar Preço</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Sugestões de formato */}
              <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                <span>Formatos aceitos:</span>
                <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                  {askColor.pinyin} duo shao qian
                </code>
                <span>ou</span>
                <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                  {askColor.pinyin} de {askCloth.pinyin} duo shao qian
                </code>
              </div>
            </div>

            {/* Feedback & Resposta do Vendedor Wang */}
            {askFeedback.status === 'error' && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-semibold">{askFeedback.message}</div>
              </div>
            )}

            {askFeedback.status === 'success' && askFeedback.sellerReply && (
              <div className="p-5 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50 border border-emerald-200 text-slate-800 flex flex-col gap-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      王
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-emerald-900">Vendedor Wang (王老板) respondeu:</span>
                      <span className="text-[10px] text-emerald-600 ml-1.5">Áudio em mandarim reproduzido</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => askFeedback.sellerReply && speakMandarin(askFeedback.sellerReply.hanzi)}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-white hover:bg-emerald-100/70 border border-emerald-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ouvir Novamente</span>
                  </button>
                </div>

                {/* Balão de Resposta */}
                <div className="bg-white rounded-xl p-4 border border-emerald-200/80 shadow-xs flex flex-col gap-2">
                  <div className="text-xl sm:text-2xl font-serif text-slate-900 font-bold tracking-wide">
                    {askFeedback.sellerReply.hanzi}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-emerald-700">
                    {askFeedback.sellerReply.pinyin}
                  </div>
                  <div className="text-xs text-slate-600 italic">
                    {askFeedback.sellerReply.portuguese}
                  </div>
                </div>

                {/* Detalhes do Número por Extenso (Regra 1.1.1) */}
                <div className="bg-emerald-100/60 rounded-xl p-3 border border-emerald-200 flex flex-col gap-1.5 text-xs text-emerald-950">
                  <div className="font-bold flex items-center justify-between flex-wrap gap-1">
                    <div className="flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Número por extenso em Mandarim:</span>
                      <span className="font-black text-emerald-800 text-sm">
                        {askFeedback.sellerReply.priceChinese} ({askFeedback.sellerReply.pricePinyin})
                      </span>
                    </div>
                    {askColor.demanda !== 0 && (
                      <span className="text-[10px] text-emerald-700 font-bold bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200">
                        Base ¥{askCloth.price} {askColor.demanda > 0 ? `+¥${askColor.demanda}` : `-¥${Math.abs(askColor.demanda)}`} (demanda da cor {askColor.traducao})
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-emerald-800 font-medium">
                    {askFeedback.sellerReply.breakdown}
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={randomizeAskPiece}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Próxima Peça de Roupa</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODO VENDEDOR: RESPONDER O PREÇO AO CLIENTE                           */}
      {/* ========================================================================= */}
      {subTab === 'answer_price' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card Esquerdo: Cliente na Loja */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-between text-center gap-4">
            <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-rose-500" /> Cliente Chinês Perguntando
              </span>
              <button
                type="button"
                onClick={randomizeAnswerPiece}
                className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="Sortear outro cliente e peça"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Novo Cliente</span>
              </button>
            </div>

            {/* Roupa Escolhida pelo Cliente */}
            <div className="relative group p-4 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-inner flex items-center justify-center">
              <ClothingSprite cloth={answerCloth} cor={answerColor} size="xl" className="filter drop-shadow-md" />
              <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-black bg-amber-400 text-amber-950 shadow-xs flex items-center gap-1">
                <span>Preço: ¥{precoFinal(answerCloth, answerColor)}</span>
                {answerColor.demanda !== 0 && (
                  <span className="text-[10px] font-bold opacity-80">
                    ({answerColor.demanda > 0 ? `+${answerColor.demanda}` : answerColor.demanda})
                  </span>
                )}
              </div>
            </div>

            {/* Pergunta Falada pelo Cliente */}
            <div className="w-full bg-rose-50 border border-rose-200 rounded-2xl p-4 text-left flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-rose-900 uppercase tracking-wide">Cliente aponta e diz:</span>
                <button
                  type="button"
                  onClick={() => speakMandarin(`这件${answerColor.hanzi}的${answerCloth.hanzi}多少钱`)}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-white px-2 py-0.5 rounded-md border border-rose-200 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Ouvir</span>
                </button>
              </div>

              <div className="text-base sm:text-lg font-serif font-bold text-slate-900">
                老板，这件{answerColor.hanzi}的{answerCloth.hanzi}多少钱？
              </div>
              <div className="text-xs font-semibold text-rose-700">
                Lǎobǎn, zhè jiàn {answerColor.pinyin} de {answerCloth.pinyin} duōshao qián?
              </div>
              <div className="text-xs text-slate-600 italic">
                "Patrão, quanto custa este(a) {nomeRoupaTraduzida(answerCloth, answerColor)}?"
              </div>
            </div>

            {/* Dica de Vendas */}
            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-left text-xs text-slate-600 flex flex-wrap items-center justify-between gap-1">
              <span>Vendas Concluídas: <strong className="text-slate-800">{salesScore}</strong></span>
              <span className="font-bold text-emerald-600">
                Preço Final: ¥{precoFinal(answerCloth, answerColor)}
                <span className="text-[10px] font-medium text-slate-500 ml-1">
                  (Base ¥{answerCloth.price} {answerColor.demanda >= 0 ? `+${answerColor.demanda}` : answerColor.demanda} cor)
                </span>
              </span>
            </div>
          </div>

          {/* Card Direito: Digitação ou Montagem do Preço por Extenso */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-5">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    答
                  </div>
                  <span className="font-bold text-slate-800 text-sm">Responda o Preço em Chinês por Extenso</span>
                </div>
                {(() => {
                  const finalPrice = precoFinal(answerCloth, answerColor);
                  return (
                    <span className="text-xs text-emerald-600 font-bold">
                      Valor: {portugueseNumberToWords(finalPrice)} (¥{finalPrice})
                    </span>
                  );
                })()}
              </div>

              {/* Botões Numéricos Rápidos para Montar a Resposta */}
              <div className="flex flex-col gap-2 mb-4">
                <span className="text-xs font-bold text-slate-600">Blocos de Números (clique para montar):</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Dígitos 1 a 9 */}
                  {['yi', 'er', 'san', 'si', 'wu', 'liu', 'qi', 'ba', 'jiu'].map((dig, idx) => (
                    <button
                      key={dig}
                      type="button"
                      onClick={() => setAnswerInput(prev => prev ? `${prev} ${dig}` : dig)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all cursor-pointer"
                    >
                      {dig} ({idx + 1})
                    </button>
                  ))}

                  <span className="text-slate-300">|</span>

                  {/* Multiplicadores 十 e 百 */}
                  <button
                    type="button"
                    onClick={() => setAnswerInput(prev => prev ? `${prev} shi` : 'shi')}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 transition-all cursor-pointer"
                  >
                    shi (十 - 10)
                  </button>

                  <button
                    type="button"
                    onClick={() => setAnswerInput(prev => prev ? `${prev} bai` : 'bai')}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-800 transition-all cursor-pointer"
                  >
                    bai (百 - 100)
                  </button>

                  <button
                    type="button"
                    onClick={() => setAnswerInput(prev => prev ? `${prev} kuai` : 'kuai')}
                    className="px-3 py-1 rounded-lg text-xs font-black bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 transition-all cursor-pointer"
                  >
                    kuai (块 - ¥)
                  </button>
                </div>
              </div>

              {/* Input de Resposta */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleValidateAnswerPrice()}
                    placeholder="Ex: san shi san (para 33) ou yi bai qi shi wu (para 175)"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:outline-hidden focus:border-emerald-500 focus:bg-white shadow-inner transition-colors"
                  />
                  {answerInput && (
                    <button
                      type="button"
                      onClick={() => setAnswerInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleValidateAnswerPrice}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Responder Preço</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>

              {/* Dica da resposta esperada (colapsável) */}
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Dica: Use pinyin por extenso (ex: 33 = san shi san).</span>
                {onOpenNumbersModal && (
                  <button
                    type="button"
                    onClick={onOpenNumbersModal}
                    className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Ver Regras de Números</span>
                  </button>
                )}
              </div>
            </div>

            {/* Feedback da Resposta */}
            {answerFeedback.status === 'error' && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex flex-col gap-1.5 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{answerFeedback.message}</span>
                </div>
                {answerFeedback.details && (
                  <div className="text-[11px] text-rose-800 pl-6 leading-relaxed">
                    {answerFeedback.details}
                  </div>
                )}
              </div>
            )}

            {answerFeedback.status === 'success' && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col gap-2.5 animate-fadeIn">
                <div className="flex items-center gap-2 font-black text-sm text-emerald-900">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>{answerFeedback.message}</span>
                </div>
                {answerFeedback.details && (
                  <div className="text-xs text-emerald-800 pl-7 leading-relaxed font-medium">
                    {answerFeedback.details}
                  </div>
                )}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={randomizeAnswerPiece}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Próximo Cliente</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VITRINE & CATÁLOGO COMPLETO (56 PEÇAS)                                */}
      {/* ========================================================================= */}
      {subTab === 'catalog' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-indigo-600" />
                <span>Vitrine da Loja (56 Peças de Roupa)</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                8 tipos de roupas em 7 cores vibrantes. Clique em qualquer peça para ver detalhes, ouvir a pronúncia e praticar!
              </p>
            </div>

            {/* Contadores da vitrine */}
            <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start md:self-auto">
              Exibindo <span className="text-indigo-600">{filteredPieces.length}</span> de 56 peças
            </div>
          </div>

          {/* Filtros por Roupa e por Cor */}
          <div className="flex flex-col gap-3">
            {/* Filtro por Cores */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="font-bold text-slate-600 shrink-0">Filtrar por Cor:</span>
              <button
                type="button"
                onClick={() => setSelectedColorFilter('all')}
                className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all shrink-0 ${
                  selectedColorFilter === 'all'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todas as Cores
              </button>

              {colors.map(cor => (
                <button
                  key={cor.pinyin}
                  type="button"
                  onClick={() => setSelectedColorFilter(cor.pinyin)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold cursor-pointer transition-all shrink-0 ${
                    selectedColorFilter === cor.pinyin
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: cor.traducao === 'amarelo' ? '#eab308' : cor.traducao === 'azul' ? '#3b82f6' : cor.traducao === 'verde' ? '#22c55e' : cor.traducao === 'laranja' ? '#f97316' : cor.traducao === 'vermelho' ? '#ef4444' : cor.traducao === 'rosa' ? '#ec4899' : '#a855f7' }}
                  />
                  <span>{cor.traducao}</span>
                  <span className="text-[10px] opacity-80 font-serif">({cor.hanzi})</span>
                </button>
              ))}
            </div>

            {/* Filtro por Tipo de Roupa */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="font-bold text-slate-600 shrink-0">Filtrar por Peça:</span>
              <button
                type="button"
                onClick={() => setSelectedClothFilter('all')}
                className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all shrink-0 ${
                  selectedClothFilter === 'all'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todos os Tipos
              </button>

              {clothes.map(cloth => (
                <button
                  key={cloth.pinyin}
                  type="button"
                  onClick={() => setSelectedClothFilter(cloth.pinyin)}
                  className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all shrink-0 ${
                    selectedClothFilter === cloth.pinyin
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cloth.traducao}</span>
                  <span className="text-[10px] opacity-80 ml-1">¥{cloth.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Roupas com a Sprite */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-8 gap-3 sm:gap-4">
            {filteredPieces.map(({ cloth, cor }) => {
              const translatedName = nomeRoupaTraduzida(cloth, cor);
              const finalPrice = precoFinal(cloth, cor);

              return (
                <button
                  key={`${cloth.pinyin}-${cor.pinyin}`}
                  type="button"
                  onClick={() => setInspectModalPiece({ cloth, cor })}
                  className="group relative flex flex-col items-center p-3 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 cursor-pointer text-center"
                >
                  <ClothingSprite 
                    cloth={cloth} 
                    cor={cor} 
                    size="md" 
                    className="group-hover:scale-110 transition-transform duration-200" 
                  />

                  <div className="mt-2 flex flex-col items-center gap-0.5 w-full">
                    <span className="text-xs font-bold text-slate-800 truncate max-w-full capitalize">
                      {translatedName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-serif">
                      {cor.hanzi} {cloth.hanzi}
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        ¥{finalPrice}
                      </span>
                      {cor.demanda !== 0 && (
                        <span 
                          className={`text-[9px] font-bold px-1 py-0.5 rounded ${
                            cor.demanda > 0 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-slate-200 text-slate-600'
                          }`}
                          title={`Ajuste de demanda da cor ${cor.traducao}: ${cor.demanda > 0 ? `+¥${cor.demanda}` : cor.demanda}`}
                        >
                          {cor.demanda > 0 ? `+${cor.demanda}` : cor.demanda}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GUIA DAS 7 CORES & FÓRMULAS DA LOJA                                   */}
      {/* ========================================================================= */}
      {subTab === 'colors_guide' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-600" />
              <span>Guia Completo das 7 Cores em Mandarim (颜色 Yánsè)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Conheça os ideogramas, pronúncia com tons e regras de concordância das cores utilizadas na loja.
            </p>
          </div>

          {/* Cards das 7 Cores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {colors.map(cor => {
              const colorHex = 
                cor.traducao === 'amarelo' ? '#eab308' : 
                cor.traducao === 'azul' ? '#3b82f6' : 
                cor.traducao === 'verde' ? '#22c55e' : 
                cor.traducao === 'laranja' ? '#f97316' : 
                cor.traducao === 'vermelho' ? '#ef4444' : 
                cor.traducao === 'rosa' ? '#ec4899' : '#a855f7';

              return (
                <div
                  key={cor.pinyin}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-3 shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-6 h-6 rounded-full shadow-xs border border-white"
                        style={{ backgroundColor: colorHex }}
                      />
                      <span className="font-bold text-slate-800 capitalize text-sm">{cor.traducao}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => speakMandarin(cor.hanzi)}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                      title="Ouvir pronúncia da cor em mandarim"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-slate-200/60">
                    <div>
                      <div className="text-2xl font-serif font-black text-slate-900">{cor.hanzi}</div>
                      <div className="text-xs font-bold text-indigo-600">{cor.pinyin}</div>
                    </div>

                    {cor.traducaoFeminina && (
                      <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Fem: {cor.traducaoFeminina}
                      </span>
                    )}
                  </div>

                  {/* Demanda cultural da cor */}
                  <div className="mt-1 pt-1.5 border-t border-slate-200/40 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Demanda na China:</span>
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      cor.demanda > 0 
                        ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                        : cor.demanda < 0 
                          ? 'bg-slate-200 text-slate-700' 
                          : 'bg-slate-100 text-slate-600'
                    }`}>
                      {cor.demanda > 0 ? `+¥${cor.demanda} (Alta)` : cor.demanda < 0 ? `${cor.demanda}¥ (Menor)` : '¥0 (Neutra)'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* As Estruturas Gramaticais de Compra e Cultura de Cores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col gap-2">
              <h4 className="font-extrabold text-amber-950 text-sm flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-600" />
                <span>1. Perguntando o Preço</span>
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed">
                Estrutura: <code>[Cor] + 的 (de) + [Roupa] + 多少钱？</code>
              </p>
              <div className="bg-white rounded-xl p-3 border border-amber-200/80 text-xs text-slate-700 flex flex-col gap-1">
                <div className="font-serif font-bold text-slate-900 text-sm">
                  黄色的短袖多少钱？
                </div>
                <div className="text-amber-800 font-semibold">
                  huángsè de duǎnxiù duōshao qián?
                </div>
                <div className="text-slate-500 italic">
                  "Quanto custa a camiseta amarela?"
                </div>
                <div className="text-[11px] text-emerald-700 font-bold mt-1">
                  💡 Simplificado: "huang se duo shao qian"!
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col gap-2">
              <h4 className="font-extrabold text-emerald-950 text-sm flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span>2. Respondendo com Kuài (块)</span>
              </h4>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Na fala coloquial, usa-se <strong>块 (kuài)</strong> como unidade de moeda (Yuan 元):
              </p>
              <div className="bg-white rounded-xl p-3 border border-emerald-200/80 text-xs text-slate-700 flex flex-col gap-1">
                <div className="font-serif font-bold text-slate-900 text-sm">
                  三十三块 (sān shí sān kuài) = ¥33
                </div>
                <div className="font-serif font-bold text-slate-900 text-sm">
                  一百七十五块 (yī bǎi qī shí wǔ kuài) = ¥175
                </div>
                <div className="text-slate-500 italic">
                  Números convertidos automaticamente pelo módulo do app.
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 flex flex-col gap-2">
              <h4 className="font-extrabold text-rose-950 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-600" />
                <span>3. Demanda Cultural das Cores</span>
              </h4>
              <p className="text-xs text-rose-900 leading-relaxed">
                O preço final soma o <strong>preço base</strong> com a <strong>demanda da cor</strong>:
              </p>
              <div className="bg-white rounded-xl p-3 border border-rose-200/80 text-xs text-slate-700 flex flex-col gap-1.5">
                <div className="text-rose-900 font-bold">
                  Preço Final = Preço Base + Demanda
                </div>
                <div className="text-[11px] text-slate-600 leading-normal">
                  • <strong>Vermelho (+8)</strong> e <strong>Amarelo (+5)</strong>: máxima preferência e nobreza tradicional.<br />
                  • <strong>Laranja (+3)</strong> e <strong>Rosa (+1)</strong>: aceitação calorosa.<br />
                  • <strong>Roxo (0)</strong>: demanda neutra.<br />
                  • <strong>Azul (-2)</strong> e <strong>Verde (-5)</strong>: menor demanda tradicional em roupas.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE INSPEÇÃO / DETALHES DE UMA PEÇA                                   */}
      {/* ========================================================================= */}
      {inspectModalPiece && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">
                Detalhes da Peça
              </span>
              <button
                type="button"
                onClick={() => setInspectModalPiece(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Visualização da Sprite */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
              <ClothingSprite 
                cloth={inspectModalPiece.cloth} 
                cor={inspectModalPiece.cor} 
                size="2xl" 
                className="filter drop-shadow-lg" 
              />
              <h4 className="text-xl font-bold text-slate-800 capitalize mt-3">
                {nomeRoupaTraduzida(inspectModalPiece.cloth, inspectModalPiece.cor)}
              </h4>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="font-serif font-bold text-slate-900 text-lg">
                  {nomeRoupaEmChines(inspectModalPiece.cloth, inspectModalPiece.cor, false)}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  ({nomeRoupaEmChines(inspectModalPiece.cloth, inspectModalPiece.cor, true)})
                </span>
                <button
                  type="button"
                  onClick={() => speakMandarin(nomeRoupaEmChines(inspectModalPiece.cloth, inspectModalPiece.cor, false))}
                  className="p-1 text-indigo-600 hover:text-indigo-800 cursor-pointer ml-1"
                  title="Ouvir nome em chinês"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Informações de Preço por Extenso */}
            {(() => {
              const finalPrice = precoFinal(inspectModalPiece.cloth, inspectModalPiece.cor);
              const numRes = convertNumberToChinese(finalPrice);
              return (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900">Preço Final da Peça:</span>
                    <span className="text-xl font-black text-emerald-700">¥{finalPrice}</span>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center justify-between bg-white/70 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                    <span>Preço Base: ¥{inspectModalPiece.cloth.price}</span>
                    <span className={inspectModalPiece.cor.demanda >= 0 ? 'text-amber-800 font-bold' : 'text-slate-700 font-bold'}>
                      Demanda da Cor ({inspectModalPiece.cor.traducao}): {inspectModalPiece.cor.demanda >= 0 ? `+¥${inspectModalPiece.cor.demanda}` : `-¥${Math.abs(inspectModalPiece.cor.demanda)}`}
                    </span>
                  </div>

                  <div className="text-xs text-emerald-950 font-semibold flex items-center justify-between border-t border-emerald-200/60 pt-2">
                    <span>Em chinês por extenso:</span>
                    <span className="font-serif text-sm font-bold">{numRes.hanzi} 块 ({numRes.pinyin} kuài)</span>
                  </div>
                  <div className="text-[11px] text-emerald-800 italic">
                    {numRes.portuguese} iuanes
                  </div>
                </div>
              );
            })()}

            {/* Botões de Ação Imediata */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setAskCloth(inspectModalPiece.cloth);
                  setAskColor(inspectModalPiece.cor);
                  setAskInput(`${inspectModalPiece.cor.pinyin} duo shao qian`);
                  setAskFeedback({ status: 'idle', message: '' });
                  setSubTab('ask_price');
                  setInspectModalPiece(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center"
              >
                Perguntar Preço
              </button>

              <button
                type="button"
                onClick={() => {
                  setAnswerCloth(inspectModalPiece.cloth);
                  setAnswerColor(inspectModalPiece.cor);
                  setAnswerInput('');
                  setAnswerFeedback({ status: 'idle', message: '' });
                  setSubTab('answer_price');
                  setInspectModalPiece(null);
                  setTimeout(() => {
                    speakMandarin(`这件${inspectModalPiece.cor.hanzi}的${inspectModalPiece.cloth.hanzi}多少钱`);
                  }, 300);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center"
              >
                Vender Peça
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopMode;
