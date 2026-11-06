import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed and not an uninstalled state, don't show install buttons
  if (isInstalled && !isIOS) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-1.5">
        {/* Chromium / Android / Desktop direct install button */}
        {isInstallable && (
          <button
            type="button"
            onClick={install}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-xs transition-all cursor-pointer select-none active:scale-95"
            title="Instalar o app no Celular, Tablet ou Computador"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Instalar App</span>
            <span className="sm:hidden">Instalar</span>
          </button>
        )}

        {/* iOS Safari Guide Button */}
        {isIOS && !isInstalled && (
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            title="Instalar no iPhone ou iPad"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Instalar no iOS</span>
            <span className="sm:hidden">iOS</span>
          </button>
        )}
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                <span>Instalar no iPhone / iPad</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              No Safari da Apple, você pode instalar o Fraseiro Mandarim diretamente na sua tela inicial em 2 passos:
            </p>

            <ol className="text-xs text-slate-700 space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 text-[10px]">1</span>
                <span>Toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta para cima) na barra inferior do Safari.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 text-[10px]">2</span>
                <span>Role para baixo e selecione <strong>Adicionar à Tela de Início</strong> (Add to Home Screen).</span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
