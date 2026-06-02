import React, { useState, useEffect } from 'react';
import { Users, Building, ShieldCheck, ArrowLeft, Plus, Trash2, Edit, Lock, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { fetchApi } from '../lib/api';

interface AdminPortalProps {
  onBack: () => void;
}

interface Account {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface UnitKSM {
  id: string;
  type: 'Unit' | 'KSM';
  name: string;
}

export function AdminPortal({ onBack }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'accounts' | 'units'>('accounts');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [units, setUnits] = useState<UnitKSM[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [accRes, unitRes] = await Promise.all([
          fetchApi('users', 'GET'),
          fetchApi('unit_ksm', 'GET')
        ]);
        
        if (accRes.status === 'success' && Array.isArray(accRes.data)) {
          setAccounts(accRes.data.map((d: any) => ({
            id: String(d.id),
            username: d.username,
            name: d.nama_lengkap,
            role: d.role
          })));
        }
        
        if (unitRes.status === 'success' && Array.isArray(unitRes.data)) {
          setUnits(unitRes.data.map((d: any) => ({
             id: String(d.id),
             type: d.type,
             name: d.nama
          })));
        }
      } catch (err) {
        console.error("Gagal memuat data admin:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [isAuthenticated]);

  // Account Form
  const [accountForm, setAccountForm] = useState({ username: '', name: '', role: 'Operator', password: '' });
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  // Unit Form
  const [unitForm, setUnitForm] = useState({ type: 'KSM' as 'KSM' | 'Unit', name: '' });

  const handleSubmitAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountForm.username || !accountForm.name) return;
    if (!editingAccountId && !accountForm.password) return;
    
    try {
      if (editingAccountId) {
        // Update Account
        const res = await fetchApi('users', 'PUT', {
          username: accountForm.username,
          nama_lengkap: accountForm.name,
          role: accountForm.role,
          ...(accountForm.password ? { password: accountForm.password } : {})
        }, editingAccountId);

        if (res.status === 'success') {
          setAccounts(accounts.map(acc => acc.id === editingAccountId ? {
            ...acc,
            username: accountForm.username,
            name: accountForm.name,
            role: accountForm.role
          } : acc));
          setEditingAccountId(null);
          setAccountForm({ username: '', name: '', role: 'Operator', password: '' });
          alert("Data akun berhasil diupdate.");
        }
      } else {
        // Create Account
        const res = await fetchApi('users', 'POST', {
          username: accountForm.username,
          password: accountForm.password,
          nama_lengkap: accountForm.name,
          role: accountForm.role,
          email: accountForm.username + '@rsua.unair.ac.id'
        });
        
        if (res.status === 'success') {
          setAccounts([{ 
            id: String(res.id), 
            username: accountForm.username, 
            name: accountForm.name, 
            role: accountForm.role 
          }, ...accounts]);
          setAccountForm({ username: '', name: '', role: 'Operator', password: '' });
          alert("Akun berhasil dibuat.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Operasi gagal. Username mungkin sudah digunakan.");
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!confirm("Hapus pengguna ini secara permanen?")) return;
    try {
      await fetchApi('users', 'DELETE', null, id);
      setAccounts(accounts.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data akun.");
    }
  };

  const handleResetPassword = async (id: string, username: string) => {
    if (!confirm(`Generate password baru untuk akun @${username}?`)) return;
    
    const newPassword = Math.random().toString(36).slice(-6);
    
    try {
      const res = await fetchApi('users', 'PUT', { password: newPassword }, id);
      if (res.status === 'success') {
        alert(`Password untuk @${username} berhasil direset!\n\nPassword Baru: ${newPassword}\n\nSebarkan password ini ke pengguna terkait.`);
      } else {
        alert(`Gagal mereset password: ${res.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem saat mereset password.");
    }
  };

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitForm.name) return;
    const newId = `unt_${Date.now()}`;
    
    try {
      const res = await fetchApi('unit_ksm', 'POST', {
        id: newId,
        type: unitForm.type,
        nama: unitForm.name
      });
      
      if (res.status === 'success') {
        setUnits([{ id: newId, type: unitForm.type, name: unitForm.name }, ...units]);
        setUnitForm({ type: 'KSM', name: '' });
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan unit/KSM.");
    }
  };

  const handleDeleteUnit = async (id: string) => {
    if (!confirm("Hapus Unit/KSM ini secara permanen?")) return;
    try {
      await fetchApi('unit_ksm', 'DELETE', null, id);
      setUnits(units.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data unit.");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === 'admin' && loginPassword === 'admin') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-slate-800 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-unair-gold/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="relative z-10">
            <button 
              onClick={onBack}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center text-white mb-8 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 bg-unair-gold text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-unair-gold/20">
              <Lock className="w-10 h-10" />
            </div>

            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Admin Login</h2>
            <p className="text-slate-400 font-medium mb-10 leading-relaxed">
              Masukkan kredensial administrator.
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              {loginError && (
                <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 text-xs px-4 py-3 rounded-2xl font-bold mb-4">
                  Username atau password salah.
                </div>
              )}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Username</label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white text-sm focus:ring-4 focus:ring-unair-gold/10 focus:border-unair-gold outline-none transition-all"
                  placeholder="admin"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white text-sm focus:ring-4 focus:ring-unair-gold/10 focus:border-unair-gold outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="w-full mt-4 flex">
                <div className="w-full bg-unair-gold text-slate-900 rounded-2xl py-4 font-black text-xs uppercase tracking-widest flex items-center justify-center hover:bg-unair-gold-dark transition-colors cursor-pointer">
                  Akses Portal
                </div>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6">
      <div className="max-w-6xl mx-auto space-y-8 mt-10">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-900 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-unair-gold/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-6">
            <button 
              onClick={onBack}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center text-white transition-all backdrop-blur-sm cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3 text-unair-gold mb-2">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Super Admin Portal</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Manajemen Sistem</h1>
            </div>
          </div>
          
          <div className="hidden md:flex bg-white/5 backdrop-blur-md rounded-2xl p-1.5 border border-white/10 relative z-10">
            <button 
              onClick={() => setActiveTab('accounts')}
              className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'accounts' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Manajemen Akun
            </button>
            <button 
              onClick={() => setActiveTab('units')}
              className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'units' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Manajemen Unit / KSM
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Input Form */}
          <div className="lg:col-span-1">
            {activeTab === 'accounts' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-8 text-slate-800">
                  <div className="w-10 h-10 rounded-2xl bg-unair-blue/10 flex items-center justify-center text-unair-blue">
                    <Users className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black tracking-tight uppercase">
                    {editingAccountId ? 'Edit Akun' : 'Tambah Akun'}
                  </h2>
                </div>
                
                <form onSubmit={handleSubmitAccount} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={accountForm.name}
                      onChange={e => setAccountForm({...accountForm, name: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-unair-blue/10 focus:border-unair-blue outline-none transition-all"
                      placeholder="Masukkan nama..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Username Login</label>
                    <input 
                      type="text" 
                      value={accountForm.username}
                      onChange={e => setAccountForm({...accountForm, username: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-unair-blue/10 focus:border-unair-blue outline-none transition-all"
                      placeholder="Masukkan username..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                      Password {editingAccountId && '(Kosongkan jika tidak diubah)'}
                    </label>
                    <input 
                      type="password" 
                      value={accountForm.password}
                      onChange={e => setAccountForm({...accountForm, password: e.target.value})}
                      required={!editingAccountId}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-unair-blue/10 focus:border-unair-blue outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Role Akun</label>
                    <select 
                      value={accountForm.role}
                      onChange={e => setAccountForm({...accountForm, role: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-unair-blue/10 focus:border-unair-blue outline-none transition-all"
                    >
                      <option value="Operator">Operator</option>
                      <option value="Viewer">Viewer</option>
                      <option value="Administrator">Administrator</option>
                    </select>
                  </div>
                  
                  <button type="submit" className="w-full pt-2 flex">
                    <div className="w-full bg-slate-900 text-white rounded-2xl py-4 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer">
                      {editingAccountId ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {editingAccountId ? 'Update Akun' : 'Buat Akun'}
                    </div>
                  </button>
                  {editingAccountId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingAccountId(null);
                        setAccountForm({ username: '', name: '', role: 'Operator', password: '' });
                      }}
                      className="w-full text-center text-slate-400 text-[10px] font-black uppercase tracking-widest mt-4 hover:text-slate-600 transition-colors"
                    >
                      Batal Edit
                    </button>
                  )}
                </form>
              </motion.div>
            )}

            {activeTab === 'units' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-8 text-slate-800">
                  <div className="w-10 h-10 rounded-2xl bg-unair-gold/10 flex items-center justify-center text-unair-gold">
                    <Building className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black tracking-tight uppercase">Tambah Unit / KSM</h2>
                </div>
                
                <form onSubmit={handleAddUnit} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Jenis</label>
                    <div className="flex bg-slate-50 p-1.5 border border-slate-200 rounded-2xl">
                      <button 
                        type="button"
                        onClick={() => setUnitForm({...unitForm, type: 'KSM'})}
                        className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${unitForm.type === 'KSM' ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        KSM
                      </button>
                      <button 
                        type="button"
                        onClick={() => setUnitForm({...unitForm, type: 'Unit'})}
                        className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${unitForm.type === 'Unit' ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        UNIT STRUKTURAL
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama {unitForm.type}</label>
                    <input 
                      type="text" 
                      value={unitForm.name}
                      onChange={e => setUnitForm({...unitForm, name: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-unair-gold/10 focus:border-unair-gold outline-none transition-all"
                      placeholder={`Contoh: ${unitForm.type === 'KSM' ? 'Bedah Orthopedi' : 'Pendidikan & Pelatihan'}...`}
                    />
                  </div>
                  
                  <button type="submit" className="w-full pt-2 flex">
                    <div className="w-full bg-slate-900 text-white rounded-2xl py-4 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer">
                      <Plus className="w-4 h-4" />
                      Simpan {unitForm.type}
                    </div>
                  </button>
                </form>
              </motion.div>
            )}
          </div>

          {/* Right: Data Table View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden h-full flex flex-col">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-black text-slate-800 uppercase tracking-tight">
                  {activeTab === 'accounts' ? 'Daftar Akun Sistem' : 'Daftar Unit & KSM'}
                </h3>
                <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                  Total {activeTab === 'accounts' ? accounts.length : units.length} Data
                </span>
              </div>
              
              <div className="p-8 flex-1 overflow-y-auto">
                {activeTab === 'accounts' ? (
                  <div className="space-y-4">
                    {accounts.map(acc => (
                      <div key={acc.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-unair-blue/30 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg uppercase">
                            {acc.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 flex items-center gap-2">
                              {acc.name}
                              {acc.role.includes('Admin') && (
                                <span className="bg-rose-100 text-rose-600 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Admin</span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 font-medium">@{acc.username} • {acc.role}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            title="Edit Akun"
                            onClick={() => {
                              setEditingAccountId(acc.id);
                              setAccountForm({
                                username: acc.username,
                                name: acc.name,
                                role: acc.role,
                                password: '' // Keep password empty for security, handle specially in update
                              });
                            }}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-unair-blue hover:bg-unair-blue/10 transition-colors cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            title="Reset Password"
                            onClick={() => handleResetPassword(acc.id, acc.username)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-unair-blue hover:bg-unair-blue/10 transition-colors cursor-pointer"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                          <button 
                            title="Hapus Akun"
                            onClick={() => handleDeleteAccount(acc.id)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {accounts.length === 0 && (
                      <div className="text-center py-12 text-slate-400 font-medium text-sm">Belum ada data akun.</div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {units.map(unit => (
                       <div key={unit.id} className="flex flex-col p-5 rounded-2xl border border-slate-100 hover:border-unair-gold/30 hover:bg-slate-50 transition-colors group">
                         <div className="flex justify-between items-start mb-4">
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${unit.type === 'KSM' ? 'bg-unair-blue/10 text-unair-blue' : 'bg-unair-gold/10 text-unair-gold-dark'}`}>
                              {unit.type}
                            </span>
                            <button 
                              onClick={() => handleDeleteUnit(unit.id)}
                              className="text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                         <h4 className="font-bold text-slate-800 text-lg mb-1">{unit.name}</h4>
                         <p className="text-xs text-slate-400 font-medium mt-auto">ID: {unit.id}</p>
                       </div>
                    ))}
                    {units.length === 0 && (
                      <div className="col-span-2 text-center py-12 text-slate-400 font-medium text-sm">Belum ada data unit/KSM.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
