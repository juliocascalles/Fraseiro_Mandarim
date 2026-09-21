import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, Sparkles, PlusSquare, X, CheckCircle2, 
  AlertCircle, Trash2, Globe, Volume2, HelpCircle, 
  ChevronDown, ChevronUp, Send
} from 'lucide-react';
import { Word, PhraseValidationReport, ContextualGrammarTip } from '../types';
import { speakMandarin } from '../utils/speech';

export interface SentenceBuilderProps {
  allWords: Word[];
  sequence: Word[];
  setSequence: (words: Word[]) => void;
  insertIndex?: number;
  setInsertIndex?: (index: number) => void;
  getAvailableWords: (sequence: Word[]) => Word[];
  checkIsValidSentence: (sequence: Word[]) => boolean;
  getNaturalTranslation: (sequence: Word[]) => string;
  validateAndBuildPhrase: (input: string) => PhraseValidationReport;
  accompanyingText?: string;
  setAccompanyingText?: (text: string) => void;
  onSendMessage?: () => void;
  isSubmitting?: boolean;
  userName?: string;
}

const normalizePinyin = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
};

const tokenizeInput = (text: string): string[] => {
  return text
    .trim()
    .split(/[\s,，.。!！?？;；]+/)
    .filter(Boolean);
};

const getCategoryBg = (category: string) => {
  switch (category) {
    case 'pronoun': return 'bg-blue-50';
    case 'verb': return 'bg-green-50';
    case 'adverb': return 'bg-yellow-50';
    case 'question': return 'bg-purple-50';
    case 'noun': return 'bg-amber-50';
    case 'family': return 'bg-emerald-50';
    case 'classifier': return 'bg-amber-100';
    case 'country': return 'bg-teal-50';
    case 'plural': return 'bg-indigo-50';
    case 'possessive': return 'bg-rose-100';
    case 'thing': return 'bg-orange-50';
    case 'adjective': return 'bg-yellow-50';
    case 'number': return 'bg-cyan-50';
    case 'preposition': return 'bg-orange-100';
    case 'etiquette': return 'bg-sky-100';
    case 'conjunction': return 'bg-pink-100';
    case 'particle': return 'bg-purple-100';
    default: return 'bg-white';
  }
};

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  allWords,
  sequence,
  setSequence,
  insertIndex: externalInsertIndex,
  setInsertIndex: externalSetInsertIndex,
  getAvailableWords,
  checkIsValidSentence,
  getNaturalTranslation,
  validateAndBuildPhrase,
  accompanyingText = '',
  setAccompanyingText,
  onSendMessage,
  isSubmitting = false,
  userName,
}) => {
  const [localInsertIndex, setLocalInsertIndex] = useState<number>(sequence.length);
  const [searchQuery, setSearchQuery] = useState('');
  const [validationReport, setValidationReport] = useState<PhraseValidationReport | null>(null);
  const [activeGrammarTip, setActiveGrammarTip] = useState<ContextualGrammarTip | null>(null);
  const [showGrammarGuide, setShowGrammarGuide] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const insertIndex = externalInsertIndex !== undefined ? externalInsertIndex : localInsertIndex;
  const setInsertIndex = externalSetInsertIndex || setLocalInsertIndex;

  const activeInsertIndex = useMemo(() => {
    return Math.min(Math.max(0, insertIndex), sequence.length);
  }, [insertIndex, sequence.length]);

  const addWord = (word: Word) => {
    const targetIdx = activeInsertIndex;
    const newSeq = [
      ...sequence.slice(0, targetIdx),
      word,
      ...sequence.slice(targetIdx)
    ];
    setSequence(newSeq);
    setInsertIndex(targetIdx + 1);
    setSearchQuery('');
    setValidationReport(null);
    setActiveGrammarTip(null);

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const removeWordAt = (index: number) => {
    const newSeq = sequence.filter((_, i) => i !== index);
    setSequence(newSeq);
    if (insertIndex > index) {
      setInsertIndex(Math.max(0, insertIndex - 1));
    } else if (insertIndex > newSeq.length) {
      setInsertIndex(newSeq.length);
    }
    setValidationReport(null);
    setActiveGrammarTip(null);
  };

  const clearSequence = () => {
    setSequence([]);
    setInsertIndex(0);
    setValidationReport(null);
    setActiveGrammarTip(null);
  };

  const availableWords = useMemo(() => {
    if (activeInsertIndex === sequence.length) {
      return getAvailableWords(sequence);
    }
    const currentPrefix = sequence.slice(0, activeInsertIndex);
    const allowed = getAvailableWords(currentPrefix);
    return allWords.filter(word => allowed.some(aw => aw.id === word.id));
  }, [sequence, activeInsertIndex, getAvailableWords, allWords]);

  const isValidSentence = useMemo(() => {
    return checkIsValidSentence(sequence);
  }, [sequence, checkIsValidSentence]);

  const tokensInQuery = useMemo(() => {
    return tokenizeInput(searchQuery);
  }, [searchQuery]);

  const isMultiWordQuery = tokensInQuery.length > 1;

  const handleValidateAndBuildPhrase = (inputToValidate?: string) => {
    const text = inputToValidate !== undefined ? inputToValidate : searchQuery;
    if (!text.trim()) return;

    const report = validateAndBuildPhrase(text);
    setValidationReport(report);

    if (report.validWords.length > 0) {
      setSequence(report.validWords);
      setInsertIndex(report.validWords.length);
    }

    if (report.success) {
      setSearchQuery('');
      setActiveGrammarTip(null);
    } else if (report.contextualGrammarTip) {
      setActiveGrammarTip(report.contextualGrammarTip);
    }
  };

  const filteredWords = useMemo(() => {
    let words = allWords.filter(w => availableWords.some(aw => aw.id === w.id));

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const normQ = normalizePinyin(searchQuery);
      words = words.filter(w => 
        normalizePinyin(w.label).includes(normQ) || 
        normalizePinyin(w.id).includes(normQ) ||
        w.hanzi.includes(q) || 
        normalizePinyin(w.translation).includes(normQ)
      );
    }
    return words;
  }, [searchQuery, availableWords, allWords]);

  return (
    <div className="w-full flex flex-col gap-3.5 text-slate-800">
      
      {/* 1. Barra de Busca e Digitação de Palavras */}
      <div className="bg-slate-50 hover:bg-slate-100/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 flex flex-col gap-2 shadow-xs transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Search className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Pesquisar Palavra ou Digitar Frase
            </span>
          </div>
          {isMultiWordQuery && (
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              {tokensInQuery.length} palavras
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (isMultiWordQuery) {
                    handleValidateAndBuildPhrase(searchQuery);
                  } else if (filteredWords.length > 0) {
                    addWord(filteredWords[0]);
                  } else if (searchQuery.trim()) {
                    handleValidateAndBuildPhrase(searchQuery);
                  }
                }
              }}
              placeholder="Digite pinyin, ideograma ou significado (ex: wo xihuan kafei)..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-indigo-500 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Limpar pesquisa"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleValidateAndBuildPhrase(searchQuery)}
            disabled={!searchQuery.trim()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-40 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inserir</span>
          </button>
        </div>
      </div>

      {/* 2. Avisos de Erro / Sugestões Discretos (Req 4: fonte menor, menos texto, sem botões) */}
      {activeGrammarTip && (
        <div className="text-[11px] text-amber-800 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200/60 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="font-semibold text-amber-950">{activeGrammarTip.title}:</span>
          <span className="truncate">{activeGrammarTip.description}</span>
        </div>
      )}

      {validationReport && (
        <div className={`text-[11px] px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
          validationReport.success 
            ? 'bg-emerald-50/90 text-emerald-900 border-emerald-200' 
            : 'bg-rose-50/90 text-rose-900 border-rose-200'
        }`}>
          {validationReport.success ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          )}
          <span className="truncate">
            {validationReport.success 
              ? 'Frase montada com sucesso.' 
              : (validationReport.contextualGrammarTip?.description || validationReport.errorReason || 'Ajuste a ordem das palavras.')}
          </span>
        </div>
      )}

      {/* 3. Palavras Disponíveis para Seleção */}
      {filteredWords.length > 0 && (
        <div className="flex flex-col gap-2 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-600">
              <PlusSquare className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Palavras Disponíveis
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {filteredWords.length} opções
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 max-h-[190px] overflow-y-auto pr-1">
            {filteredWords.map(word => {
              const Icon = word.icon;
              return (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => addWord(word)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${getCategoryBg(word.category)} border-slate-200/80 hover:scale-[101%] hover:shadow-xs active:scale-95 cursor-pointer`}
                >
                  <div className="p-1 rounded-lg bg-white shadow-2xs text-slate-600 shrink-0">
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none">
                      {word.label}
                    </span>
                    <span className="font-semibold text-xs truncate mt-0.5 text-slate-800">
                      {word.hanzi}
                    </span>
                    <span className="text-[9px] text-slate-500 truncate leading-none mt-0.5">
                      {word.translation}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Dica Gramatical Rápida Expansível */}
      <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-200/60 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => setShowGrammarGuide(!showGrammarGuide)}
          className="flex items-center justify-between text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            Regras Gramaticais Rápidas do Mandarim
          </span>
          {showGrammarGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showGrammarGuide && (
          <div className="pt-1.5 border-t border-slate-200 text-[10px] text-slate-600 space-y-1">
            <p>• <strong>Ordem Básica:</strong> Sujeito + Advérbio + Verbo + Objeto (ex: 我也喜欢茶 - Eu também gosto de chá).</p>
            <p>• <strong>Advérbio yě (也):</strong> Sempre antes do verbo ou adjetivo, nunca no final da frase.</p>
            <p>• <strong>Negação:</strong> <em>bù (不)</em> no presente/futuro; <em>méi (没)</em> com <em>yǒu (有)</em> e passado.</p>
            <p>• <strong>Perguntas:</strong> Partícula <em>ma (吗)</em> ao final de frase afirmativa.</p>
          </div>
        )}
      </div>

      {/* 5. ÁREA DE DESTAQUE COM A FRASE PRONTA (Req 3: formada abaixo em destaque) */}
      <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/60 border-2 border-indigo-200/90 shadow-sm flex flex-col gap-3">
        
        {/* Topo do Destaque: Status e Controles da Frase */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Frase Pronta para Envio
            </span>

            {sequence.length > 0 && (
              isValidSentence ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  Validada
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800">
                  <HelpCircle className="w-3 h-3" />
                  Em construção
                </span>
              )
            )}
          </div>

          {sequence.length > 0 && (() => {
            const isWoJiao = sequence.length >= 2 && 
              sequence[sequence.length - 2].id === 'wo' && 
              sequence[sequence.length - 1].id === 'jiao';
            const activeUser = userName || (typeof window !== 'undefined' ? localStorage.getItem('chat_sender_name') : '') || 'Estudante';
            const displayHanzi = isWoJiao ? `${sequence.map(w => w.hanzi).join('')} ${activeUser}` : sequence.map(w => w.hanzi).join('');
            const displayPinyin = isWoJiao ? `${sequence.map(w => w.label).join(' ')} ${activeUser}` : sequence.map(w => w.label).join(' ');
            const displayTrans = isWoJiao ? `Eu me chamo ${activeUser}.` : getNaturalTranslation(sequence);

            return (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => speakMandarin(displayHanzi)}
                  className="p-1.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-100 transition-colors shadow-xs cursor-pointer"
                  title="Ouvir pronúncia da frase"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>

                <a
                  href={`https://translate.google.com/?sl=zh-CN&tl=pt&text=${encodeURIComponent(displayHanzi)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-100 transition-colors shadow-xs cursor-pointer"
                  title="Ver no Google Tradutor"
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={clearSequence}
                  className="p-1.5 rounded-xl bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors shadow-xs cursor-pointer"
                  title="Limpar frase"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })()}
        </div>

        {/* Visualização de Texto da Frase Montada */}
        {sequence.length > 0 ? (() => {
          const isWoJiao = sequence.length >= 2 && 
            sequence[sequence.length - 2].id === 'wo' && 
            sequence[sequence.length - 1].id === 'jiao';
          const activeUser = userName || (typeof window !== 'undefined' ? localStorage.getItem('chat_sender_name') : '') || 'Estudante';
          const displayHanzi = isWoJiao ? `${sequence.map(w => w.hanzi).join('')} ${activeUser}` : sequence.map(w => w.hanzi).join('');
          const displayPinyin = isWoJiao ? `${sequence.map(w => w.label).join(' ')} ${activeUser}` : sequence.map(w => w.label).join(' ');
          const displayTrans = isWoJiao ? `Eu me chamo ${activeUser}.` : getNaturalTranslation(sequence);

          return (
            <div className="flex flex-col gap-1 p-3 rounded-2xl bg-white/80 border border-indigo-100/90 shadow-2xs">
              <span className="text-2xl sm:text-3xl font-bold text-indigo-950 tracking-wide">
                {displayHanzi}
              </span>
              <span className="font-mono text-xs sm:text-sm text-indigo-700 font-semibold">
                {displayPinyin}
              </span>
              <span className="text-xs sm:text-sm text-slate-600 font-medium">
                {displayTrans}
              </span>
            </div>
          );
        })() : (
          <div className="p-3 rounded-2xl bg-white/60 border border-dashed border-indigo-200 text-center text-xs text-indigo-900/60 font-medium">
            Selecione palavras acima ou digite na pesquisa para formar a mensagem que será enviada.
          </div>
        )}

        {/* Fita de Blocos/Palavras da Frase (Slots para remoção e inserção) */}
        {sequence.length > 0 && (
          <div className="p-2.5 bg-slate-50/70 rounded-2xl border border-slate-200/70 flex flex-wrap items-center gap-1.5">
            {/* Slot de inserção inicial */}
            <button
              type="button"
              onClick={() => setInsertIndex(0)}
              className={`w-5 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                activeInsertIndex === 0 
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-xs' 
                  : 'bg-white hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 border border-slate-200'
              }`}
              title="Inserir no início"
            >
              +
            </button>

            {sequence.map((word, idx) => {
              const Icon = word.icon;
              return (
                <React.Fragment key={`${word.id}-${idx}`}>
                  <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div className="p-0.5 rounded bg-indigo-50 text-indigo-600">
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] font-mono text-indigo-600 font-bold leading-none">{word.label}</span>
                      <span className="text-xs font-bold text-slate-900 leading-tight">{word.hanzi}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeWordAt(idx)}
                      className="ml-1 p-0.5 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remover"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setInsertIndex(idx + 1)}
                    className={`w-5 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                      activeInsertIndex === idx + 1 
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-xs' 
                        : 'bg-white hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 border border-slate-200'
                    }`}
                    title={`Inserir após ${word.label}`}
                  >
                    +
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Linha de Envio da Frase (Sem campo de comentário - Req 4) */}
        {onSendMessage && (
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-indigo-100/80">
            <span className="text-[11px] text-slate-500 font-medium">
              {sequence.length > 0 
                ? 'Frase pronta para publicação na sala' 
                : 'Selecione palavras acima para habilitar o envio'}
            </span>

            <button
              type="button"
              id="btn-enviar-frase"
              onClick={onSendMessage}
              disabled={isSubmitting || sequence.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-[1.02] active:scale-[0.98] shrink-0 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
              title={sequence.length === 0 ? 'Construa uma frase antes de enviar' : 'Enviar frase para o bate-papo'}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Enviando...' : 'Enviar Frase'}</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
