import React, { useState } from 'react';
import { X, Sparkles, HelpCircle, ArrowRight, Check, Hash, Copy } from 'lucide-react';
import { convertNumberToChinese, type ChineseNumberResult } from '../utils/chineseNumbers';
import type { Word } from '../types';

interface ChineseNumbersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertWords?: (numberWords: Word[]) => void;
  allWords: Word[];
}

const PRESET_EXAMPLES = [
  { val: 12, label: '12 (十二 - shi er)' },
  { val: 20, label: '20 (二十 - er shi)' },
  { val: 300, label: '300 (三百 - san bai)' },
  { val: 2000, label: '2.000 (二千 - er qian)' },
  { val: 10000, label: '10.000 (一万 - yi wan)' },
  { val: 12345, label: '12.345 (一万二千三百四十五)' },
  { val: 10005, label: '10.005 (一万零五 - com buraco 零)' },
  { val: 59, label: '59 (五十九 - wu shi jiu)' },
  { val: 105, label: '105 (一百零五 - yi bai ling wu)' },
  { val: 2005, label: '2.005 (二千零五 - er qian ling wu)' },
];

export const ChineseNumbersModal: React.FC<ChineseNumbersModalProps> = ({
  isOpen,
  onClose,
  onInsertWords,
  allWords,
}) => {
  const [inputVal, setInputVal] = useState<string>('12345');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentNum = parseInt(inputVal.replace(/\D/g, ''), 10) || 0;
  const result: ChineseNumberResult = convertNumberToChinese(currentNum);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${result.hanzi} (${result.pinyin}) - ${result.portuguese}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertIntoBuilder = () => {
    if (!onInsertWords) return;

    // Convert result tokens to Word objects
    const tokens = result.pinyinSpaced.split(' ');
    const matchedWords: Word[] = [];

    for (const tok of tokens) {
      // Find matching word in allWords
      let found = allWords.find((w) => {
        if (tok === 'qian' && w.id === 'qian_num') return true;
        if (tok === 'wan' && w.id === 'wan_num') return true;
        if (tok === 'shi' && w.id === 'shi_num') return true;
        if (tok === 'bai' && w.id === 'bai') return true;
        if (tok === 'ling' && w.id === 'ling') return true;
        if (tok === 'yi' && w.id === 'yi') return true;
        if (tok === 'er' && w.id === 'er') return true;
        if (tok === 'liang' && w.id === 'liang') return true;
        if (tok === 'san' && w.id === 'san') return true;
        if (tok === 'si' && w.id === 'si') return true;
        if (tok === 'wu' && w.id === 'wu') return true;
        if (tok === 'liu' && w.id === 'liu') return true;
        if (tok === 'qi' && w.id === 'qi') return true;
        if (tok === 'ba' && w.id === 'ba') return true;
        if (tok === 'jiu' && w.id === 'jiu') return true;
        return w.label.toLowerCase() === tok || w.id === tok;
      });

      if (found) {
        matchedWords.push(found);
      }
    }

    if (matchedWords.length > 0) {
      onInsertWords(matchedWords);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                Números por Extenso em Mandarim
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono font-semibold">
                  HSK 1-2
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Regras de dezenas (十), centenas (百), milhares (千), miríades (万) e zero intermediário (零)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* Quick preset pills */}
          <div>
            <span className="text-xs font-semibold text-slate-500 mb-2 block">
              Exemplos das Regras Oficiais:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_EXAMPLES.map((ex) => (
                <button
                  key={ex.val}
                  type="button"
                  onClick={() => setInputVal(String(ex.val))}
                  className={`text-xs px-2.5 py-1 rounded-xl font-medium border transition-all cursor-pointer ${
                    currentNum === ex.val
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-indigo-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="number-input" className="text-xs font-bold text-slate-700">
              Digite qualquer número inteiro:
            </label>
            <div className="flex gap-2">
              <input
                id="number-input"
                type="number"
                min="0"
                max="999999999"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ex: 12345 ou 10005"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-base text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                title="Copiar texto"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 border border-indigo-100 rounded-2xl p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                Resultado em Mandarim
              </span>
              <div className="flex items-center gap-1">
                {result.ruleTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-indigo-200 text-indigo-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Hanzi Display */}
            <div className="text-center py-3 bg-white/90 rounded-xl border border-indigo-50 shadow-inner">
              <span className="text-4xl sm:text-5xl font-serif font-black text-slate-900 tracking-wider">
                {result.hanzi}
              </span>
              <div className="text-sm font-semibold text-indigo-600 mt-1 font-mono">
                {result.pinyin}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                ({result.pinyinSpaced})
              </div>
            </div>

            {/* Portuguese por extenso */}
            <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-500">Português por extenso:</span>
              <span className="text-sm font-bold text-slate-800 capitalize">
                {result.portuguese}
              </span>
            </div>

            {/* Pedagogical Breakdown */}
            <div className="bg-white/80 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
              <strong className="text-indigo-950">Explicação: </strong>
              {result.breakdown}
            </div>

            {/* Action to insert into builder */}
            {onInsertWords && (
              <button
                type="button"
                id="btn-inserir-no-construtor"
                onClick={handleInsertIntoBuilder}
                className="w-full mt-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Inserir este número no Construtor de Frases</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>

          {/* Reference Grammar Guide of Rules 4.1 to 4.5 */}
          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Guia Rápido das 5 Regras de Números:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <span className="font-bold text-indigo-900 block mb-1">
                  4.1 Dezenas com 十 (shí):
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>二十 (èr shí)</strong> = 20 (número antes de 十).<br />
                  <strong>十二 (shí èr)</strong> = 12 (dezena + unidade).
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <span className="font-bold text-indigo-900 block mb-1">
                  4.2 Centenas com 百 (bǎi):
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>三百 (sān bǎi)</strong> = 300.<br />
                  <strong>一百零五 (yī bǎi líng wǔ)</strong> = 105.
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <span className="font-bold text-indigo-900 block mb-1">
                  4.3 Milhar com 千 (qiān):
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>二千 (èr qiān)</strong> = 2000.<br />
                  <strong>一千二百 (yī qiān èr bǎi)</strong> = 1200.
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <span className="font-bold text-indigo-900 block mb-1">
                  4.4 & 4.4.1 Wan 万 (10 mil / 4 dígitos):
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>一万 (yī wàn)</strong> = 10.000.<br />
                  <strong>12.345</strong> = 一万 二千 三百 四十五 (yī wàn èr qiān sān bǎi sì shí wǔ).
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-100 sm:col-span-2">
                <span className="font-bold text-indigo-900 block mb-1">
                  4.5 Regra do Zero (零 / líng) como "Buraco":
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  O zero no mandarim marca a ausência de uma ordem de grandeza inteira entre dois algarismos:
                  <strong> 一万零五 (yī wàn líng wǔ)</strong> = dez mil e cinco (10.005).<br />
                  Múltiplos zeros seguidos (ex: 10005) são sintetizados em apenas <strong>UM</strong> 零 (líng), e nunca se repetem "zero zero". Zeros ao final (como 100 = 一百) não usam 零.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
