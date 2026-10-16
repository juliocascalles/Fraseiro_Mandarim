import React, { useState } from 'react';
import { 
  AlertTriangle, X, Volume2, Search, CheckCircle2, 
  Lightbulb, BookOpen, ArrowRight, Sparkles, Filter
} from 'lucide-react';
import { FALSE_FRIENDS_DATA } from '../data/falseFriendsData';
import { speakMandarin } from '../utils/speech';

interface FalseFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FalseFriendsModal: React.FC<FalseFriendsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = FALSE_FRIENDS_DATA.filter(item => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      item.warningTitle.toLowerCase().includes(q) ||
      item.whyConfusing.toLowerCase().includes(q) ||
      item.mnemonicTip.toLowerCase().includes(q) ||
      item.item1.hanzi.includes(q) ||
      item.item1.pinyin.toLowerCase().includes(q) ||
      item.item1.meaning.toLowerCase().includes(q) ||
      item.item2.hanzi.includes(q) ||
      item.item2.pinyin.toLowerCase().includes(q) ||
      item.item2.meaning.toLowerCase().includes(q) ||
      (item.item3 && (
        item.item3.hanzi.includes(q) ||
        item.item3.pinyin.toLowerCase().includes(q) ||
        item.item3.meaning.toLowerCase().includes(q)
      ))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl max-h-[90vh] bg-white text-slate-800 rounded-3xl shadow-2xl flex flex-col border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-xs">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">Não Confundir! (Falsos Cognatos)</h2>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Guia Prático
                </span>
              </div>
              <p className="text-xs text-white/90">
                Pares e termos fáceis de misturar no mandarim com dicas mnemônicas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por caractere, pinyin ou significado (ex: zhi, xing, bi, yao, nadar...)"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <AlertTriangle className="w-8 h-8 text-slate-300" />
              <span>Nenhum par encontrado para "{search}".</span>
            </div>
          ) : (
            filtered.map((entry) => (
              <div 
                key={entry.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col gap-3 hover:border-amber-300 transition-colors"
              >
                {/* Title & Issue */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      {entry.warningTitle}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {entry.whyConfusing}
                    </p>
                  </div>
                </div>

                {/* Items Comparison Grid */}
                <div className={`grid grid-cols-1 ${entry.item3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-2.5`}>
                  {/* Item 1 */}
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-amber-950 font-serif">
                        {entry.item1.hanzi}
                      </span>
                      <button
                        type="button"
                        onClick={() => speakMandarin(entry.item1.example)}
                        className="p-1 rounded-lg bg-white/80 text-amber-800 hover:bg-white shadow-2xs cursor-pointer"
                        title="Ouvir pronúncia"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-800">
                      {entry.item1.pinyin}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {entry.item1.meaning}
                    </span>
                    <div className="mt-1 pt-1.5 border-t border-amber-200/60 text-[11px] text-slate-600">
                      <p className="font-medium text-amber-900">{entry.item1.example}</p>
                      <p className="text-slate-500 italic mt-0.5">{entry.item1.examplePt}</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-950 font-serif">
                        {entry.item2.hanzi}
                      </span>
                      <button
                        type="button"
                        onClick={() => speakMandarin(entry.item2.example)}
                        className="p-1 rounded-lg bg-white/80 text-blue-800 hover:bg-white shadow-2xs cursor-pointer"
                        title="Ouvir pronúncia"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-mono text-xs font-bold text-blue-800">
                      {entry.item2.pinyin}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {entry.item2.meaning}
                    </span>
                    <div className="mt-1 pt-1.5 border-t border-blue-200/60 text-[11px] text-slate-600">
                      <p className="font-medium text-blue-900">{entry.item2.example}</p>
                      <p className="text-slate-500 italic mt-0.5">{entry.item2.examplePt}</p>
                    </div>
                  </div>

                  {/* Item 3 if present */}
                  {entry.item3 && (
                    <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-purple-950 font-serif">
                          {entry.item3.hanzi}
                        </span>
                        <button
                          type="button"
                          onClick={() => speakMandarin(entry.item3!.example)}
                          className="p-1 rounded-lg bg-white/80 text-purple-800 hover:bg-white shadow-2xs cursor-pointer"
                          title="Ouvir pronúncia"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-mono text-xs font-bold text-purple-800">
                        {entry.item3.pinyin}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {entry.item3.meaning}
                      </span>
                      <div className="mt-1 pt-1.5 border-t border-purple-200/60 text-[11px] text-slate-600">
                        <p className="font-medium text-purple-900">{entry.item3.example}</p>
                        <p className="text-slate-500 italic mt-0.5">{entry.item3.examplePt}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mnemonic Tip */}
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 mr-1">Dica de Fixação:</span>
                    {entry.mnemonicTip}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
          Dica: Você também pode testar estes termos na aba Quiz escolhendo o filtro "Não Confundir!"
        </div>
      </div>
    </div>
  );
};
