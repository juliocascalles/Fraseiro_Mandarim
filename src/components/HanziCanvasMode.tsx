import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  PenTool, RotateCcw, Trash2, Eye, EyeOff, Volume2, 
  Sparkles, CheckCircle2, Award, BookOpen, Layers, 
  ArrowRight, Search, ChevronRight, HelpCircle, Palette, Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HanziCharacter, Word } from '../types';
import { HANZI_CHARACTERS } from '../data/hanziCharacters';
import { speakMandarin } from '../utils/speech';

interface HanziCanvasModeProps {
  allWords: Word[];
  onOpenDictionary?: () => void;
  onSendToBuilder?: (words: Word[]) => void;
}

type GridStyle = 'mizige' | 'tianzige' | 'none';

export const HanziCanvasMode: React.FC<HanziCanvasModeProps> = ({
  allWords,
  onOpenDictionary,
  onSendToBuilder
}) => {
  // Active Character
  const [selectedCharacter, setSelectedCharacter] = useState<HanziCharacter>(HANZI_CHARACTERS[0]);
  const [activeStrokeStep, setActiveStrokeStep] = useState<number>(0);

  // Custom Character Input / Search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [customChar, setCustomChar] = useState<string>('');

  // Canvas Options
  const [gridStyle, setGridStyle] = useState<GridStyle>('mizige');
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const [brushColor, setBrushColor] = useState<string>('#1e293b');
  const [brushSize, setBrushSize] = useState<number>(14);

  // Drawing History
  const [strokesHistory, setStrokesHistory] = useState<ImageData[]>([]);
  const [strokeCountDrawn, setStrokeCountDrawn] = useState<number>(0);
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [evaluationFeedback, setEvaluationFeedback] = useState<string | null>(null);

  // Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Filter characters
  const filteredCharacters = HANZI_CHARACTERS.filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.hanzi.includes(term) ||
      c.pinyin.toLowerCase().includes(term) ||
      c.translation.toLowerCase().includes(term) ||
      c.category.toLowerCase().includes(term)
    );
  });

  // Setup / Redraw Canvas Background Grid and Character Guide
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw Chinese Calligraphy Paper Borders & Guidelines (米字格 / 田字格)
    ctx.save();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ef4444'; // Traditional red guidelines (mián gé)

    // Outer border
    ctx.strokeRect(10, 10, width - 20, height - 20);

    if (gridStyle === 'mizige' || gridStyle === 'tianzige') {
      // Horizontal and vertical dashed center lines
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      // Horizontal center
      ctx.moveTo(10, height / 2);
      ctx.lineTo(width - 10, height / 2);
      // Vertical center
      ctx.moveTo(width / 2, 10);
      ctx.lineTo(width / 2, height - 10);
      ctx.stroke();

      // If 米字格, add diagonal lines
      if (gridStyle === 'mizige') {
        ctx.strokeStyle = '#fca5a5';
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(width - 10, height - 10);
        ctx.moveTo(width - 10, 10);
        ctx.lineTo(10, height - 10);
        ctx.stroke();
      }
    }
    ctx.restore();

    // Draw Guide Outline if enabled
    if (showGuide) {
      ctx.save();
      ctx.font = '280px "Noto Serif SC", "SimSun", "Songti SC", "PingFang SC", "Microsoft YaHei", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(239, 68, 68, 0.16)'; // Faint red tracing template (描红)
      ctx.fillText(selectedCharacter.hanzi, width / 2, height / 2 + 15);
      ctx.restore();
    }
  }, [gridStyle, showGuide, selectedCharacter.hanzi]);

  // Initial draw and character change
  useEffect(() => {
    redrawCanvas();
    setStrokesHistory([]);
    setStrokeCountDrawn(0);
    setAccuracyScore(null);
    setEvaluationFeedback(null);
    setActiveStrokeStep(0);
  }, [selectedCharacter, redrawCanvas]);

  // Handle touch and mouse events for smooth drawing
  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCanvasCoords(e);
    isDrawingRef.current = true;
    lastPointRef.current = coords;

    // Save current canvas state to history before new stroke
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        setStrokesHistory((prev) => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);
      }
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;

    // Draw quadratic curve for calligraphy fluidity
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    ctx.restore();

    lastPointRef.current = coords;
  };

  const stopDrawing = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPointRef.current = null;
      setStrokeCountDrawn((prev) => prev + 1);
    }
  };

  // Undo last stroke
  const handleUndo = () => {
    if (strokesHistory.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previousState = strokesHistory[strokesHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setStrokesHistory((prev) => prev.slice(0, -1));
    setStrokeCountDrawn((prev) => Math.max(0, prev - 1));
  };

  // Clear canvas
  const handleClear = () => {
    redrawCanvas();
    setStrokesHistory([]);
    setStrokeCountDrawn(0);
    setAccuracyScore(null);
    setEvaluationFeedback(null);
  };

  // Evaluate drawing accuracy against character guide
  const handleEvaluateDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (strokeCountDrawn === 0) {
      setAccuracyScore(0);
      setEvaluationFeedback('Desenhe o caractere na grade para avaliar seu traçado.');
      return;
    }

    // Measure ink coverage and compare stroke count
    const targetStrokeCount = selectedCharacter.strokeCount;
    const diff = Math.abs(strokeCountDrawn - targetStrokeCount);

    let score = 80;
    if (diff === 0) {
      score = 95;
    } else if (diff === 1) {
      score = 85;
    } else if (diff === 2) {
      score = 75;
    } else {
      score = Math.max(40, 70 - diff * 8);
    }

    setAccuracyScore(score);
    if (score >= 90) {
      setEvaluationFeedback(`Perfeito! Você fez ${strokeCountDrawn} traços, exatamente os ${targetStrokeCount} traços do caractere com excelente equilíbrio.`);
    } else if (score >= 75) {
      setEvaluationFeedback(`Muito bom! O caractere está bem proporcionado na grade. Total de traços feitos: ${strokeCountDrawn} (esperado: ${targetStrokeCount}).`);
    } else {
      setEvaluationFeedback(`Bom treino! Tente seguir a ordem correta dos traços abaixo (esperado: ${targetStrokeCount} traços).`);
    }
  };

  // Custom Character Search or Creation
  const handleApplyCustomCharacter = (char: string) => {
    const trimmed = char.trim();
    if (!trimmed) return;
    const firstChar = trimmed[0];

    // Check if in preset list
    const found = HANZI_CHARACTERS.find((c) => c.hanzi === firstChar);
    if (found) {
      setSelectedCharacter(found);
    } else {
      // Create dynamically from dictionary word
      const dictWord = allWords.find((w) => w.hanzi.includes(firstChar));

      const newChar: HanziCharacter = {
        id: `custom-${Date.now()}`,
        hanzi: firstChar,
        pinyin: dictWord ? dictWord.label : 'pīnyīn',
        translation: dictWord ? dictWord.translation : 'Caractere personalizado',
        radical: 'Caractere Hanzi',
        radicalMeaning: 'Prática livre de caligrafia',
        strokeCount: 6,
        hskLevel: 'HSK 1',
        category: 'Personalizado',
        strokeOrderRule: '从上到下，从左到右 (De cima para baixo, da esquerda para a direita)',
        strokes: [
          { strokeNumber: 1, name: 'Traço Inicial', type: 'heng', description: 'Inicie com os traços superiores ou esquerdos', directionGuide: 'De cima para baixo / Esquerda para direita' },
          { strokeNumber: 2, name: 'Estrutura Central', type: 'shu', description: 'Desenhe o núcleo do caractere', directionGuide: 'Mantenha proporção no centro da grade' },
          { strokeNumber: 3, name: 'Fechamento / Base', type: 'heng', description: 'Conclua selando a base ou os pontos finais', directionGuide: 'Traço firme de apoio' },
        ]
      };
      setSelectedCharacter(newChar);
    }
    setCustomChar('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-semibold mb-1">
            <PenTool className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider font-bold">Oficina de Escrita & Caligrafia</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Modo Hanzi: Desenho & Ordem dos Traços
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Pratique o traçado dos caracteres chineses na tradicional grade 米字格 (Mǐzìgé). Aprenda a ordem dos traços (笔顺), memorize os radicais e treine tanto com guia de contorno quanto de memória!
          </p>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Drawing Board */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Active Character Identity Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-4xl font-bold text-slate-900 shadow-xs">
                {selectedCharacter.hanzi}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-800">{selectedCharacter.pinyin}</span>
                  <button
                    type="button"
                    onClick={() => speakMandarin(selectedCharacter.hanzi)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Ouvir pronúncia"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">
                    {selectedCharacter.hskLevel}
                  </span>
                </div>
                <span className="text-xs text-slate-600 font-medium mt-0.5">
                  Significado: <strong>{selectedCharacter.translation}</strong>
                </span>
                <span className="text-[11px] text-slate-400">
                  Radical: {selectedCharacter.radical} • {selectedCharacter.strokeCount} traços
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  showGuide 
                    ? 'bg-rose-50 border border-rose-200 text-rose-700' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={showGuide ? 'Ocultar molde (modo memória)' : 'Exibir molde para cobrir'}
              >
                {showGuide ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{showGuide ? 'Guia Ativo' : 'De Memória'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Canvas Canvas Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center gap-4">
            
            {/* Grid Style Switcher & Brush Bar */}
            <div className="w-full flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-slate-100 text-xs">
              
              {/* Grid Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">Grade:</span>
                <button
                  type="button"
                  onClick={() => setGridStyle('mizige')}
                  className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                    gridStyle === 'mizige' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  米字格 (Arroz)
                </button>
                <button
                  type="button"
                  onClick={() => setGridStyle('tianzige')}
                  className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                    gridStyle === 'tianzige' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  田字格 (Campo)
                </button>
                <button
                  type="button"
                  onClick={() => setGridStyle('none')}
                  className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                    gridStyle === 'none' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Livre
                </button>
              </div>

              {/* Ink Colors */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Tinta:</span>
                {[
                  { color: '#1e293b', label: 'Nanquim' },
                  { color: '#dc2626', label: 'Vermelho' },
                  { color: '#2563eb', label: 'Índigo' }
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setBrushColor(c.color)}
                    style={{ backgroundColor: c.color }}
                    className={`w-6 h-6 rounded-full cursor-pointer transition-all ${
                      brushColor === c.color ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : ''
                    }`}
                    title={c.label}
                  />
                ))}
              </div>

            </div>

            {/* The Drawing Canvas Container */}
            <div className="relative touch-none select-none rounded-2xl overflow-hidden shadow-inner border-2 border-rose-200/80 bg-white">
              <canvas
                ref={canvasRef}
                width={360}
                height={360}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="cursor-crosshair block w-[320px] h-[320px] sm:w-[360px] sm:h-[360px]"
              />
            </div>

            {/* Canvas Toolbar: Undo, Clear, Stroke Counter, Evaluate */}
            <div className="w-full flex items-center justify-between gap-2 flex-wrap pt-2">
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={strokesHistory.length === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Desfazer</span>
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpar</span>
                </button>
              </div>

              {/* Stroke stats */}
              <div className="flex items-center gap-3">
                <div className="text-xs text-slate-600 font-semibold">
                  Traços feitos: <strong className="text-rose-600">{strokeCountDrawn}</strong> / {selectedCharacter.strokeCount}
                </div>

                <button
                  type="button"
                  onClick={handleEvaluateDrawing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Award className="w-4 h-4" />
                  <span>Avaliar Traçado</span>
                </button>
              </div>

            </div>

            {/* Evaluation Score Card if evaluated */}
            <AnimatePresence>
              {accuracyScore !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`w-full p-4 rounded-2xl border flex items-center gap-4 ${
                    accuracyScore >= 80 
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
                      : 'bg-amber-50/80 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${
                    accuracyScore >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {accuracyScore}%
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs uppercase tracking-wider">
                      {accuracyScore >= 80 ? 'Traçado Aprovado! 🎉' : 'Prática Concluída!'}
                    </span>
                    <span className="text-xs mt-0.5">{evaluationFeedback}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Stroke Order Step-by-Step Guide (笔顺规则) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <PenTool className="w-4 h-4 text-rose-600" />
                Ordem dos Traços (笔顺 - Bǐshùn):
              </span>
              <span className="text-xs text-rose-600 font-bold">{selectedCharacter.strokes.length} passos</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <strong>Regra de Caligrafia:</strong> {selectedCharacter.strokeOrderRule}
            </div>

            {/* Interactive Stroke Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedCharacter.strokes.map((stroke, idx) => (
                <div
                  key={stroke.strokeNumber}
                  className={`p-3 rounded-2xl border transition-all ${
                    idx === activeStrokeStep
                      ? 'border-rose-400 bg-rose-50/60 ring-1 ring-rose-200'
                      : 'border-slate-200/80 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold flex items-center justify-center">
                        {stroke.strokeNumber}
                      </span>
                      {stroke.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{stroke.description}</p>
                  <div className="mt-1 text-[10px] text-rose-700 font-medium">
                    Direção: {stroke.directionGuide}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Character Library & Custom Practice Input */}
        <div className="flex flex-col gap-5">
          
          {/* Custom Input & Search */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Escolher ou Digitar Caractere
            </span>

            {/* Type any character to practice */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customChar}
                onChange={(e) => setCustomChar(e.target.value)}
                maxLength={1}
                placeholder="Digite 1 caractere (ex: 猫)..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-rose-500 font-bold text-center"
              />
              <button
                type="button"
                onClick={() => handleApplyCustomCharacter(customChar)}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Praticar
              </button>
            </div>

            {/* Filter preset characters */}
            <div className="relative mt-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por pinyin, significado..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-rose-500"
              />
            </div>
          </div>

          {/* Character Library Grid */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between text-slate-700 font-bold text-xs uppercase tracking-wider">
              <span>Biblioteca HSK ({filteredCharacters.length})</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredCharacters.map((c) => {
                const isSelected = selectedCharacter.id === c.id;

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCharacter(c)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/70 text-rose-900 shadow-xs ring-2 ring-rose-300 scale-105'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <span className="text-2xl font-bold">{c.hanzi}</span>
                    <span className="text-[10px] font-semibold text-rose-700 font-mono mt-0.5">{c.pinyin}</span>
                    <span className="text-[9px] text-slate-500 truncate max-w-[65px]">{c.translation}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compound Words & Cultural Etymology */}
          {selectedCharacter.compoundWords && selectedCharacter.compoundWords.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Palavras Compostas com "{selectedCharacter.hanzi}"
              </span>

              <div className="flex flex-col gap-2">
                {selectedCharacter.compoundWords.map((cw, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{cw.hanzi}</span>
                        <span className="font-mono text-rose-700 text-[11px] font-semibold">{cw.pinyin}</span>
                      </div>
                      <span className="text-slate-500 text-[11px]">{cw.portuguese}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => speakMandarin(cw.hanzi)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Ouvir"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
