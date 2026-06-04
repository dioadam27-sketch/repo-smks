import React, { useState } from 'react';
import { Lock, User, LogIn, ShieldCheck, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { authenticateUser } from '../lib/api';

interface LoginProps {
  onLogin: (user: { id: string; username: string; name: string; role: string; menu_permissions?: string }) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inactivityMsg, setInactivityMsg] = useState(() => {
    const reason = localStorage.getItem('smks_logout_reason');
    if (reason === 'inactivity') {
      localStorage.removeItem('smks_logout_reason');
      return 'Sesi Anda telah berakhir secara otomatis karena tidak ada aktivitas selama 5 menit. Silakan login kembali.';
    }
    return '';
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authenticateUser(username, password);
      
      if (result.success && result.user) {
        setIsLoading(false);
        setIsSuccess(true);
        // Show loading screen for 2.2 seconds before transitioning
        setTimeout(() => {
          onLogin(result.user!);
        }, 2200);
      } else {
        setError(result.error || 'Username atau password tidak valid.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan sistem saat menghubungi backend.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-unair-blue selection:text-white">
      {/* Loading Screen Overlay */}
      {isSuccess && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.9, 1, 0.9]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut"
            }}
            className="w-48 h-48 mb-8"
          >
            <img 
              src="https://i.imgur.com/g3CJZNH.png" 
              alt="RSUA Logo" 
              className="w-full h-full object-contain drop-shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-unair-blue"
              />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-unair-blue uppercase tracking-[0.5em] mb-1">
                Autentikasi Berhasil
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Menyiapkan sistem manajemen...
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-unair-blue rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-unair-gold rounded-full blur-3xl opacity-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-slate-200 overflow-hidden relative z-10 border border-slate-100"
      >
        <div className="p-8 sm:p-12">
          {/* Logo/Identity Section */}
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="w-28 h-28 mx-auto mb-6"
            >
              <img 
                src="https://i.imgur.com/g3CJZNH.png" 
                alt="RSUA Logo" 
                className="w-full h-full object-contain drop-shadow-lg"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">SMKS RS UNAIR</h1>
            <p className="text-slate-500 font-medium leading-relaxed">Sistem Manajemen Kerjasama, Pendidikan & Penelitian Strategis</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {inactivityMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3 text-amber-800 text-xs font-bold leading-relaxed"
              >
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                  <Info className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-black text-amber-950 uppercase text-[10px] tracking-wider mb-0.5">Sesi Berakhir</p>
                  {inactivityMsg}
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold"
              >
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Info className="w-4 h-4" />
                </div>
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-unair-blue transition-colors">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-unair-blue" />
                  </span>
                  <input
                    required
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-unair-blue/10 focus:border-unair-blue focus:bg-white transition-all"
                    placeholder="Masukkan username anda..."
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-unair-blue transition-colors">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-unair-blue" />
                  </span>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-unair-blue/10 focus:border-unair-blue focus:bg-white transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-unair-blue text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-unair-blue-light transition-all shadow-xl shadow-unair-blue/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Masuk ke Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-xs text-slate-400 font-medium">
              @ 2026 Rumah Sakit Universitas Airlangga
            </p>
          </div>
        </div>
      </motion.div>

      {/* Developer Helper Info */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-center opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Developer Access</p>
        <p className="text-[10px] text-slate-500 mt-1 font-bold">admin / 112233</p>
      </div>
    </div>
  );
}
