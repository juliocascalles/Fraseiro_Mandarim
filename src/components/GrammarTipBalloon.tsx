import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb, CheckCircle2, XCircle, X, Sparkles, BookOpen } from 'lucide-react';
import { ContextualGrammarTip } from '../types';

interface GrammarTipBalloonProps {
  tip: ContextualGrammarTip;
  onClose?: () => void;
  pointerPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-center' | 'none';
  className?: string;
  autoFocus?: boolean;
}

export const GrammarTipBalloon: React.FC<GrammarTipBalloonProps> = ({
  tip,
  onClose,
  pointerPosition = 'top-center',
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      className={`relative z-20 flex flex-col gap-2.5 p-4 sm:p-5 rounded-2xl bg-amber-50/95 border-2 border-amber-300/90 text-amber-950 shadow-lg backdrop-blur-xs ${className}`}
      role="alert"
      aria-live="polite"
    >
      {/* Speech Balloon Triangle Pointer / Arrow */}
      {pointerPosition !== 'none' && (
        <>
          {pointerPosition === 'top-left' && (
            <div className="absolute -top-2.5 left-6 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-amber-300" />
          )}
          {pointerPosition === 'top-center' && (
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-amber-300" />
          )}
          {pointerPosition === 'top-right' && (
            <div className="absolute -top-2.5 right-6 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-amber-300" />
          )}
          {pointerPosition === 'bottom-center' && (
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-amber-300" />
          )}
        </>
      )}

      {/* Header bar */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-xl bg-amber-200/80 text-amber-900 shrink-0 mt-0.5 shadow-xs">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md border border-amber-300/60">
                Dica de Ordem Gramatical
              </span>
              {tip.position && (
                <span className="text-[10px] font-mono font-bold text-amber-700 bg-white/80 px-1.5 py-0.5 rounded-md border border-amber-200">
                  Posição #{tip.position}
                </span>
              )}
            </div>
            <h4 className="text-sm sm:text-base font-bold text-amber-950 mt-1 leading-snug">
              {tip.title}
            </h4>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-amber-700 hover:text-amber-950 hover:bg-amber-200/50 transition-colors cursor-pointer shrink-0"
            title="Fechar dica"
            aria-label="Fechar dica gramatical"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Rule name subtitle */}
      <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold">
        <BookOpen className="w-3.5 h-3.5 text-amber-700 shrink-0" />
        <span>Regra: {tip.ruleName}</span>
      </div>

      {/* Specific Explanation */}
      <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium bg-white/70 p-3 rounded-xl border border-amber-200/70">
        {tip.explanation}
      </p>

      {/* Examples Comparison (Correct vs Incorrect) */}
      {(tip.exampleCorrect || tip.exampleIncorrect) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {tip.exampleCorrect && (
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Ordem Correta</span>
                <span className="font-semibold text-emerald-950 mt-0.5">{tip.exampleCorrect}</span>
              </div>
            </div>
          )}

          {tip.exampleIncorrect && (
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50/90 border border-rose-200 text-xs">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Ordem Incorreta</span>
                <span className="font-semibold text-rose-950 mt-0.5 line-through decoration-rose-400">{tip.exampleIncorrect}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actionable tip / Takeaway */}
      {tip.solutionTip && (
        <div className="flex items-start gap-2 text-xs text-amber-900 font-semibold border-t border-amber-200/80 pt-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span><strong>Como corrigir:</strong> {tip.solutionTip}</span>
        </div>
      )}
    </motion.div>
  );
};
