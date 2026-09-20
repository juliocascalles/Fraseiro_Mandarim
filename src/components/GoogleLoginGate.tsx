import React, { useState } from 'react';
import { LogIn, Sparkles, ShieldCheck, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

interface GoogleLoginGateProps {
  onSuccess?: () => void;
}

export const GoogleLoginGate: React.FC<GoogleLoginGateProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string };
      console.error('Erro ao autenticar com Google:', errorObj);
      if (errorObj?.code === 'auth/popup-closed-by-user') {
        setErrorMessage('A janela de login com o Google foi fechada antes da conclusão.');
      } else if (errorObj?.code === 'auth/popup-blocked') {
        setErrorMessage('O navegador bloqueou o popup de login do Google. Por favor, permita popups neste site e tente novamente.');
      } else {
        setErrorMessage(errorObj?.message || 'Falha ao autenticar com o Google. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 flex flex-col items-center text-center">
        {/* Chinese Flag / Dragon theme icon */}
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5 shadow-inner">
          <span className="text-3xl font-serif font-black text-indigo-700">汉</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mandarim Fácil • v1.2026.09.20</span>
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          Fraseiro de Mandarim
        </h1>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Para acessar o aplicativo, praticar a construção de frases e participar do bate-papo comunitário, entre com sua conta Google.
        </p>

        {/* Benefits list */}
        <div className="w-full bg-slate-50 rounded-2xl p-4 mb-6 text-left border border-slate-100 flex flex-col gap-2.5">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-xs text-slate-600 leading-snug">
              <strong>Identificação Google:</strong> Controle e autorização para gerenciar e excluir salas criadas por você.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span className="text-xs text-slate-600 leading-snug">
              <strong>Bate-papo em tempo real:</strong> Envio de frases validadas em Hanzi, Pinyin e Português.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span className="text-xs text-slate-600 leading-snug">
              <strong>Superusuário:</strong> A conta de <em>Júlio Cascalles</em> possui permissões completas e irrestritas para limpar ou excluir qualquer sala.
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="w-full mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google Sign-in button */}
        <button
          type="button"
          id="btn-google-login"
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border-2 border-slate-200 hover:border-slate-300 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-98 disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
              <span>Conectando com o Google...</span>
            </>
          ) : (
            <>
              {/* Google G SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Entrar com a conta Google</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-400 mt-4">
          Conexão segura via Firebase Authentication.
        </p>
      </div>
    </div>
  );
};
