import React, { useState } from 'react';
import { LayoutDashboard, Building2, LogOut, ArrowRight, ShieldCheck, KeyRound, Info, Loader2, GraduationCap, Users, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewMode } from '../types';
import { fetchApi } from '../lib/api';

interface PortalProps {
  onSelect: (mode: ViewMode) => void;
  onLogout: () => void;
  user?: { id: string; username: string; name: string; role: string; menu_permissions?: string } | null;
}

export function Portal({ onSelect, onLogout, user }: PortalProps) {
  const isAdmin = user?.role === 'System Developer' || user?.role === 'Administrator';
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passMessage, setPassMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [accessDeniedModal, setAccessDeniedModal] = useState<{ isOpen: boolean; title: string } | null>(null);

  const hasEduAccess = isAdmin || (user?.menu_permissions && user.menu_permissions.split(',').some(p => p.startsWith('pendidikan_')));
  const hasTrainAccess = isAdmin || (user?.menu_permissions && user.menu_permissions.split(',').some(p => p.startsWith('pelatihan_')));
  const hasInovAccess = isAdmin || (user?.menu_permissions && user.menu_permissions.split(',').some(p => p.startsWith('penelitian_')));

  const handleSelectCard = (mode: ViewMode, hasAccess: boolean, label: string) => {
    if (!hasAccess) {
      setAccessDeniedModal({ isOpen: true, title: label });
      return;
    }
    onSelect(mode);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id || !newPassword) return;
    
    if (newPassword !== confirmPassword) {
      setPassMessage({ type: 'error', text: 'Password konfirmasi tidak cocok!' });
      return;
    }
    
    setIsChangingPass(true);
    setPassMessage(null);
    try {
      const res = await fetchApi('users', 'PUT', { password: newPassword }, user.id);
      if (res.status === 'success') {
        setPassMessage({ type: 'success', text: 'Password berhasil diubah!' });
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setShowPasswordModal(false), 2000);
      } else {
        setPassMessage({ type: 'error', text: res.message || 'Gagal mengubah password' });
      }
    } catch (err: any) {
      setPassMessage({ type: 'error', text: err.message || 'Terjadi kesalahan sistem' });
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-unair-blue selection:text-white">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-unair-blue rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-unair-gold rounded-full blur-[120px] translate-y-1/2 opacity-50" />
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                 <img src="https://i.imgur.com/g3CJZNH.png" alt="Logo" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
              </div>
              <span className="text-xs font-black text-unair-blue uppercase tracking-[0.3em]">Portal Utama</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
            >
              Selamat Datang,<br/>
              <span className="text-unair-blue">{user?.name || 'User'}</span>
            </motion.h1>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => {
                setShowPasswordModal(true);
                setPassMessage(null);
                setNewPassword('');
                setConfirmPassword('');
              }}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-unair-blue/5 hover:text-unair-blue hover:border-unair-blue/20 transition-all flex items-center gap-2 cursor-pointer shadow-sm group"
            >
              <KeyRound className="w-4 h-4" />
              Ganti Password
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={onLogout}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all flex items-center gap-2 cursor-pointer shadow-sm group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Keluar
            </motion.button>
          </div>
        </div>

        <div className="grid gap-6 text-left md:grid-cols-2 lg:grid-cols-3">
          {/* Dashboard Option */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => onSelect('dashboard')}
            className="flex flex-col text-left group relative bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200 border border-slate-100 transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-unair-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-unair-blue/10 transition-colors" />
            
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="w-20 h-20 shrink-0 bg-unair-blue/10 text-unair-blue rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <LayoutDashboard className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-12 uppercase tracking-tight">Dashboard</h2>
              <div className="flex items-center gap-2 text-unair-blue font-black mt-auto text-xs uppercase tracking-widest">
                Masuk Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </motion.button>

          {/* Pendidikan Option */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => handleSelectCard('smks_pendidikan', !!hasEduAccess, 'Pendidikan')}
            className={`flex flex-col text-left group relative p-10 rounded-[40px] shadow-xl border transition-all overflow-hidden ${
              !hasEduAccess 
                ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                : isAdmin 
                  ? 'bg-white border-slate-100 shadow-slate-200 hover:shadow-2xl hover:-translate-y-2 cursor-pointer' 
                  : 'bg-unair-blue border-unair-blue-light/10 shadow-unair-blue/20 hover:shadow-2xl hover:-translate-y-2 cursor-pointer'
            }`}
          >
            {hasEduAccess && (
              <div className={`absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 transition-colors ${isAdmin ? 'bg-slate-50 group-hover:bg-slate-100' : 'bg-unair-gold/10 group-hover:bg-unair-gold/20'}`} />
            )}
            
            <div className="relative z-10 flex-1 flex flex-col">
              <div className={`w-20 h-20 shrink-0 rounded-3xl flex items-center justify-center mb-8 transition-transform duration-500 shadow-lg ${
                !hasEduAccess 
                  ? 'bg-slate-300 text-slate-500' 
                  : isAdmin 
                    ? 'bg-slate-800 text-white group-hover:scale-110' 
                    : 'bg-unair-gold text-white shadow-unair-gold/20 group-hover:scale-110'
              }`}>
                <GraduationCap className="w-10 h-10" />
              </div>
              <h2 className={`text-3xl font-black mb-12 uppercase tracking-tight ${
                !hasEduAccess 
                  ? 'text-slate-400' 
                  : isAdmin 
                    ? 'text-slate-900' 
                    : 'text-white'
              }`}>Pendidikan</h2>
              <div className={`flex items-center gap-2 font-black mt-auto text-xs uppercase tracking-widest ${
                !hasEduAccess 
                  ? 'text-slate-400' 
                  : isAdmin 
                    ? 'text-slate-800' 
                    : 'text-unair-gold'
              }`}>
                {!hasEduAccess ? (
                  <span className="flex items-center gap-1.5"><KeyRound className="w-4 h-4" /> Akses Terbatas</span>
                ) : (
                  <>
                    Buka Sistem <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </div>
            </div>
          </motion.button>
          
          {/* Pelatihan Option */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            onClick={() => handleSelectCard('smks_pelatihan', !!hasTrainAccess, 'Pelatihan')}
            className={`flex flex-col text-left group relative p-10 rounded-[40px] shadow-xl border transition-all overflow-hidden ${
              !hasTrainAccess 
                ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                : isAdmin 
                  ? 'bg-white border-slate-100 shadow-slate-200 hover:shadow-2xl hover:-translate-y-2 cursor-pointer' 
                  : 'bg-unair-blue border-unair-blue-light/10 shadow-unair-blue/20 hover:shadow-2xl hover:-translate-y-2 cursor-pointer'
            }`}
          >
            {hasTrainAccess && (
              <div className={`absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 transition-colors ${isAdmin ? 'bg-slate-50 group-hover:bg-slate-100' : 'bg-unair-gold/10 group-hover:bg-unair-gold/20'}`} />
            )}
            
            <div className="relative z-10 flex-1 flex flex-col">
              <div className={`w-20 h-20 shrink-0 rounded-3xl flex items-center justify-center mb-8 transition-transform duration-500 shadow-lg ${
                !hasTrainAccess 
                  ? 'bg-slate-300 text-slate-500' 
                  : isAdmin 
                    ? 'bg-slate-800 text-white group-hover:scale-110' 
                    : 'bg-unair-gold text-white shadow-unair-gold/20 group-hover:scale-110'
              }`}>
                <Users className="w-10 h-10" />
              </div>
              <h2 className={`text-3xl font-black mb-12 uppercase tracking-tight ${
                !hasTrainAccess 
                  ? 'text-slate-400' 
                  : isAdmin 
                    ? 'text-slate-900' 
                    : 'text-white'
              }`}>Pelatihan</h2>
              <div className={`flex items-center gap-2 font-black mt-auto text-xs uppercase tracking-widest ${
                !hasTrainAccess 
                  ? 'text-slate-400' 
                  : isAdmin 
                    ? 'text-slate-800' 
                    : 'text-unair-gold'
              }`}>
                {!hasTrainAccess ? (
                  <span className="flex items-center gap-1.5"><KeyRound className="w-4 h-4" /> Akses Terbatas</span>
                ) : (
                  <>
                    Buka Sistem <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </div>
            </div>
          </motion.button>
          
          {/* Penelitian Option */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => handleSelectCard('smks_penelitian', !!hasInovAccess, 'Penelitian & Inovasi')}
            className={`flex flex-col text-left group relative p-10 rounded-[40px] shadow-xl border transition-all overflow-hidden ${
              !hasInovAccess 
                ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                : isAdmin 
                  ? 'bg-white border-slate-100 shadow-slate-200 hover:shadow-2xl hover:-translate-y-2 cursor-pointer' 
                  : 'bg-unair-blue border-unair-blue-light/10 shadow-unair-blue/20 hover:shadow-2xl hover:-translate-y-2 cursor-pointer'
            }`}
          >
            {hasInovAccess && (
              <div className={`absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 transition-colors ${isAdmin ? 'bg-slate-50 group-hover:bg-slate-100' : 'bg-unair-gold/10 group-hover:bg-unair-gold/20'}`} />
            )}
            
            <div className="relative z-10 flex-1 flex flex-col">
              <div className={`w-20 h-20 shrink-0 rounded-3xl flex items-center justify-center mb-8 transition-transform duration-500 shadow-lg ${
                !hasInovAccess 
                  ? 'bg-slate-300 text-slate-500' 
                  : isAdmin 
                    ? 'bg-slate-800 text-white group-hover:scale-110' 
                    : 'bg-unair-gold text-white shadow-unair-gold/20 group-hover:scale-110'
              }`}>
                <FlaskConical className="w-10 h-10" />
              </div>
              <h2 className={`text-3xl font-black mb-12 uppercase tracking-tight ${
                !hasInovAccess 
                  ? 'text-slate-400' 
                  : isAdmin 
                    ? 'text-slate-900' 
                    : 'text-white'
              }`}>Penelitian & Inovasi</h2>
              <div className={`flex items-center gap-2 font-black mt-auto text-xs uppercase tracking-widest ${
                !hasInovAccess 
                  ? 'text-slate-400' 
                  : isAdmin 
                    ? 'text-slate-800' 
                    : 'text-unair-gold'
              }`}>
                {!hasInovAccess ? (
                  <span className="flex items-center gap-1.5"><KeyRound className="w-4 h-4" /> Akses Terbatas</span>
                ) : (
                  <>
                    Buka Sistem <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </div>
            </div>
          </motion.button>
          
          {/* Admin Option */}
          {isAdmin && (
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => onSelect('admin')}
              className="flex flex-col text-left group relative bg-unair-blue-light p-10 rounded-[40px] shadow-xl shadow-unair-blue-light/20 border border-unair-blue/30 transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-unair-gold/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-unair-gold/20 transition-colors pointer-events-none" />
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-20 h-20 shrink-0 bg-unair-gold text-white rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-unair-gold/20">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-white mb-12 uppercase tracking-tight">Admin</h2>
                <div className="flex items-center gap-2 text-unair-gold font-black mt-auto text-xs uppercase tracking-widest">
                  Kelola Sistem <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.button>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
            Sistem Manajemen Kerjasama, Pendidikan & Penelitian Strategis
          </p>
          <p className="text-[10px] text-slate-400 mt-2 font-bold">
            RS Universitas Airlangga &copy; 2026
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] shadow-2xl p-8 max-w-sm w-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-unair-blue/10 rounded-2xl flex items-center justify-center text-unair-blue">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Ganti Password</h3>
                  <p className="text-xs text-slate-500 font-medium">Ubah kata sandi akun Anda</p>
                </div>
              </div>

              {passMessage && (
                <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 text-sm font-bold ${passMessage.type === 'error' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  <Info className="w-5 h-5 shrink-0" />
                  {passMessage.text}
                </div>
              )}

              <form onSubmit={handleChangePassword}>
                <div className="mb-6">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password Baru</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 mb-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-unair-blue/10 focus:border-unair-blue transition-all"
                    placeholder="Masukkan password baru..."
                  />
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-unair-blue/10 focus:border-unair-blue transition-all"
                    placeholder="Ketik ulang password baru..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPass || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                    className="flex-1 px-4 py-3 bg-unair-blue text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-unair-blue-light transition-all shadow-lg shadow-unair-blue/20 disabled:opacity-50 flex items-center justify-center"
                  >
                    {isChangingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {accessDeniedModal?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] shadow-2xl p-8 max-w-sm w-full border border-slate-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Akses Terbatas: {accessDeniedModal.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-semibold mb-6">
                  Akun Anda tidak memiliki hak akses untuk membuka sub-menu di kategori ini.<br/><br/>Silakan hubungi <strong>Administrator</strong> untuk memberikan izin akses menu yang sesuai.
                </p>
                <button
                  type="button"
                  onClick={() => setAccessDeniedModal(null)}
                  className="w-full py-3.5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-colors shadow-lg cursor-pointer"
                >
                  Dimengerti
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
