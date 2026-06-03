import React, { useState, useEffect } from 'react';
import { Users, Building, ShieldCheck, ArrowLeft, Plus, Trash2, Edit, Lock, Loader2, Upload, Download, FileSpreadsheet, AlertTriangle, CheckCircle2, XCircle, X, HelpCircle, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { fetchApi } from '../lib/api';
import * as XLSX from 'xlsx';

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

const sortUnitsByImportOrder = (unitsList: UnitKSM[]): UnitKSM[] => {
  return [...unitsList].sort((a, b) => {
    const parseIdSuffix = (id: string) => {
      const parts = id.split('_');
      if (parts.length >= 3) {
        const idxPart = parts.length >= 4 ? parts[2] : parts[parts.length - 1];
        const idx = parseInt(idxPart, 10);
        if (!isNaN(idx)) return { isImported: true, index: idx, ts: parseInt(parts[1], 10) || 0 };
      }
      return { isImported: false, index: 0, ts: parseInt(parts[1], 10) || parseInt(id.replace(/\D/g, ''), 10) || 0 };
    };

    const infoA = parseIdSuffix(a.id);
    const infoB = parseIdSuffix(b.id);

    if (infoA.isImported && infoB.isImported) {
      if (infoA.ts !== infoB.ts) {
        return infoA.ts - infoB.ts;
      }
      return infoA.index - infoB.index;
    }
    return infoA.ts - infoB.ts;
  });
};

export function AdminPortal({ onBack }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'accounts' | 'units'>('accounts');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [units, setUnits] = useState<UnitKSM[]>([]);
  const [searchUnitTerm, setSearchUnitTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        const rawUnits = unitRes.data.map((d: any) => ({
           id: String(d.id),
           type: d.type,
           name: d.nama || d.name || ''
        }));
        setUnits(sortUnitsByImportOrder(rawUnits));
      }
    } catch (err) {
      console.error("Gagal memuat data admin:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Account Form
  const [accountForm, setAccountForm] = useState({ username: '', name: '', role: 'Operator', password: '' });
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  // Unit Form
  const [unitForm, setUnitForm] = useState({ type: 'KSM' as 'KSM' | 'Unit', name: '' });
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Custom confirmation and alert states
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'danger' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void | Promise<void>;
  } | null>(null);

  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  } | null>(null);

  const showAlert = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message });
  };

  const showConfirm = (options: {
    title: string;
    message: string;
    type?: 'danger' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void | Promise<void>;
  }) => {
    setConfirmDialog({ isOpen: true, ...options });
  };

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
          showAlert("success", "Akun Diperbarui", "Data akun berhasil diupdate.");
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
          showAlert("success", "Akun Dibuat", "Akun berhasil dibuat.");
        }
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Gagal", "Operasi gagal. Username mungkin sudah digunakan.");
    }
  };

  const handleDeleteAccount = (id: string) => {
    const acc = accounts.find(a => a.id === id);
    const accName = acc ? acc.name : 'pengguna ini';
    showConfirm({
      title: "Hapus Akun Pengguna",
      message: `Hapus akun "${accName}" secara permanen? Tindakan ini tidak dapat dibatalkan.`,
      type: "danger",
      confirmText: "Hapus Akun",
      cancelText: "Batal",
      onConfirm: async () => {
        try {
          await fetchApi('users', 'DELETE', null, id);
          setAccounts(accounts.filter(a => a.id !== id));
          showAlert("success", "Akun Dihapus", `Akun "${accName}" berhasil dihapus.`);
        } catch (err) {
          console.error(err);
          showAlert("error", "Gagal", "Gagal menghapus data akun.");
        }
      }
    });
  };

  const handleResetPassword = (id: string, username: string) => {
    showConfirm({
      title: "Reset Password Akun",
      message: `Apakah Anda yakin ingin generate password baru untuk akun @${username}?`,
      type: "warning",
      confirmText: "Generate Password",
      cancelText: "Batal",
      onConfirm: async () => {
        const newPassword = Math.random().toString(36).slice(-6);
        try {
          const res = await fetchApi('users', 'PUT', { password: newPassword }, id);
          if (res.status === 'success') {
            showAlert("success", "Password Direset", `Password untuk @${username} berhasil direset!\n\nPassword Baru: ${newPassword}\n\nSebarkan password ini ke pengguna terkait.`);
          } else {
            showAlert("error", "Gagal Reset", `Gagal mereset password: ${res.message}`);
          }
        } catch (err) {
          console.error(err);
          showAlert("error", "Kesalahan Sistem", "Terjadi kesalahan sistem saat mereset password.");
        }
      }
    });
  };

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitForm.name) return;
    
    try {
      if (editingUnitId) {
        // Update Unit/KSM
        const res = await fetchApi('unit_ksm', 'PUT', {
          type: unitForm.type,
          name: unitForm.name
        }, editingUnitId);
        
        if (res.status === 'success') {
          const updated = units.map(u => u.id === editingUnitId ? { ...u, type: unitForm.type, name: unitForm.name } : u);
          setUnits(sortUnitsByImportOrder(updated));
          setEditingUnitId(null);
          setUnitForm({ type: 'KSM', name: '' });
          showAlert("success", `${unitForm.type} Diperbarui`, `Berhasil memperbarui data ${unitForm.type} menjadi "${unitForm.name}".`);
        }
      } else {
        // Add new Unit/KSM
        const newId = `unt_${Date.now()}`;
        const res = await fetchApi('unit_ksm', 'POST', {
          id: newId,
          type: unitForm.type,
          name: unitForm.name
        });
        
        if (res.status === 'success') {
          const updated = [{ id: newId, type: unitForm.type, name: unitForm.name }, ...units];
          setUnits(sortUnitsByImportOrder(updated));
          setUnitForm({ type: 'KSM', name: '' });
          showAlert("success", `${unitForm.type} Berhasil Ditambahkan`, `Berhasil menyimpan data ${unitForm.type} "${unitForm.name}".`);
        }
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Gagal", `Gagal menyimpan data ${unitForm.type}.`);
    }
  };

  const handleDeleteAllUnits = () => {
    showConfirm({
      title: "Hapus Semua Unit / KSM?",
      message: `Apakah Anda yakin ingin menghapus seluruh ${units.length} Unit dan KSM dari sistem? Tindakan ini tidak dapat dibatalkan!`,
      type: "danger",
      confirmText: "Hapus Semua",
      cancelText: "Batal",
      onConfirm: () => {
        showConfirm({
          title: "Konfirmasi Terakhir",
          message: "TINDAKAN INI SANGAT BERBAHAYA!\n\nSeluruh data Unit dan KSM akan dihapus dari database. Apakah Anda benar-benar yakin?",
          type: "danger",
          confirmText: "Ya, Hapus Semua!",
          cancelText: "Batal",
          onConfirm: async () => {
            setIsLoading(true);
            try {
              // Deleting in moderate chunks of 5 is safe, fast, and does not lock cPanel databases
              const chunks: UnitKSM[][] = [];
              const chunkSize = 5;
              for (let i = 0; i < units.length; i += chunkSize) {
                chunks.push(units.slice(i, i + chunkSize));
              }
              
              for (const chunk of chunks) {
                await Promise.all(chunk.map(u => fetchApi('unit_ksm', 'DELETE', null, u.id)));
              }
              
              setUnits([]);
              showAlert("success", "Semua Data Dihapus", "Seluruh Unit & KSM berhasil dihapus dari sistem.");
            } catch (err) {
              console.error("Gagal menghapus semua unit:", err);
              showAlert("error", "Gagal", "Beberapa atau semua data gagal dihapus. Silakan coba lagi.");
              loadData();
            } finally {
              setIsLoading(false);
            }
          }
        });
      }
    });
  };

  const handleDeleteUnit = (id: string) => {
    const unit = units.find(u => u.id === id);
    const unitLabel = unit ? `${unit.type} "${unit.name}"` : 'Unit/KSM ini';
    showConfirm({
      title: "Hapus Unit / KSM",
      message: `Hapus ${unitLabel} secara permanen? Tindakan ini tidak dapat dibatalkan.`,
      type: "danger",
      confirmText: "Hapus Permanen",
      cancelText: "Batal",
      onConfirm: async () => {
        try {
          await fetchApi('unit_ksm', 'DELETE', null, id);
          setUnits(units.filter(u => u.id !== id));
          showAlert("success", "Berhasil Dihapus", `${unitLabel} berhasil dihapus.`);
        } catch (err) {
          console.error(err);
          showAlert("error", "Gagal", "Gagal menghapus data unit.");
        }
      }
    });
  };

  const handleExportUnitsExcel = () => {
    try {
      const rows = units.map((u, i) => ({
        'No': i + 1,
        'Tipe': u.type,
        'Nama KSM / Unit': u.name
      }));
      
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rows);
      
      const max_widths = [
        { wch: 6 },
        { wch: 15 },
        { wch: 45 }
      ];
      ws['!cols'] = max_widths;
      
      XLSX.utils.book_append_sheet(wb, ws, "Unit & KSM");
      XLSX.writeFile(wb, `Daftar_Unit_dan_KSM_RS_UNAIR.xlsx`);
      showAlert("success", "Ekspor Berhasil", "Daftar unit dan KSM berhasil diekspor ke file Excel.");
    } catch (err) {
      console.error("Gagal mengekspor data ke Excel:", err);
      showAlert("error", "Gagal Ekspor", "Gagal melakukan ekspor data ke Excel.");
    }
  };

  const processExcelFile = async (file: File) => {
    if (!file) return;
    if (isImporting) {
      showAlert("info", "Sedang Berjalan", "Proses impor sebelumnya sedang berlangsung.");
      return;
    }
    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("Gagal membaca file.");
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);
        
        if (!json || json.length === 0) {
          showAlert("error", "Excel Kosong", "File Excel kosong atau tidak terbaca.");
          setIsImporting(false);
          return;
        }
        
        const parsedUnits: { type: 'KSM' | 'Unit'; name: string }[] = [];
        const seenInFile = new Set<string>();
        
        for (const row of json) {
          const keys = Object.keys(row);
          const typeKey = keys.find(k => /type|tipe|jenis/i.test(k));
          const nameKey = keys.find(k => /name|nama/i.test(k));
          
          if (!nameKey) continue;
          
          const rawType = typeKey ? String(row[typeKey]).trim() : '';
          const type: 'KSM' | 'Unit' = (/unit/i.test(rawType)) ? 'Unit' : 'KSM';
          const name = String(row[nameKey]).trim();
          
          if (name) {
            const fileKey = `${type}:${name.toLowerCase()}`;
            if (!seenInFile.has(fileKey)) {
              seenInFile.add(fileKey);
              parsedUnits.push({ type, name });
            }
          }
        }
        
        if (parsedUnits.length === 0) {
          showAlert("error", "Format Tidak Sesuai", "Tidak ditemukan data unit/KSM yang valid. Pastikan Excel Anda memiliki kolom 'Tipe' dan 'Nama' (atau serupa).");
          setIsImporting(false);
          return;
        }
        
        const ksmCount = parsedUnits.filter(u => u.type === 'KSM').length;
        const unitCount = parsedUnits.filter(u => u.type === 'Unit').length;
        
        const confirmMsg = `Ditemukan ${ksmCount} KSM dan ${unitCount} Unit dari file Excel. Apakah Anda yakin ingin mengimpor data ini ke sistem?`;
        
        showConfirm({
          title: "Konfirmasi Impor Massal",
          message: confirmMsg,
          type: "info",
          confirmText: "Mulai Impor",
          cancelText: "Batal",
          onConfirm: async () => {
            setIsImporting(true);
            let successCount = 0;
            let duplicateCount = 0;
            let failCount = 0;
            
            // Fetch live list of units from the server to guarantee fresh duplicate check matching
            let currentUnits = [...units];
            try {
              const unitRes = await fetchApi('unit_ksm');
              if (unitRes.status === 'success' && Array.isArray(unitRes.data)) {
                currentUnits = unitRes.data.map((d: any) => ({
                  id: String(d.id),
                  type: d.type,
                  name: d.nama
                }));
              }
            } catch (err) {
              console.warn("Could not reload units to check duplicate, falling back to local state:", err);
            }

            const importedKeysInThisSession = new Set<string>();
            
            for (let i = 0; i < parsedUnits.length; i++) {
              const item = parsedUnits[i];
              const nameLower = item.name.toLowerCase();
              const lookupKey = `${item.type}:${nameLower}`;
              
              // Prevent duplicates against both database state AND duplicate rows processed within this imports batch
              const isDuplicateInDb = currentUnits.some(u => u.name.toLowerCase() === nameLower && u.type === item.type);
              const isDuplicateInBatch = importedKeysInThisSession.has(lookupKey);
              
              if (isDuplicateInDb || isDuplicateInBatch) {
                duplicateCount++;
                continue;
              }
              
              // Generate highly randomized, unique identifiers in milliseconds increment
              const newId = `unt_${Date.now()}_${i}_${Math.floor(Math.random() * 1000)}`;
              
              try {
                const res = await fetchApi('unit_ksm', 'POST', {
                  id: newId,
                  type: item.type,
                  name: item.name
                });
                if (res.status === 'success') {
                  successCount++;
                  importedKeysInThisSession.add(lookupKey);
                  currentUnits.push({ id: newId, type: item.type, name: item.name });
                } else {
                  failCount++;
                }
              } catch (err) {
                console.error("Gagal mengimpor unit:", item.name, err);
                failCount++;
              }
            }
            
            setIsImporting(false);
            showAlert("success", "Impor Selesai", `Impor data Excel selesai!\n\n- Berhasil diimpor: ${successCount} data\n- Dilewati (data ganda): ${duplicateCount} data\n- Gagal: ${failCount} data`);
            await loadData();
          }
        });
      } catch (err) {
        console.error("Gagal memproses berkas Excel:", err);
        showAlert("error", "Error", "Gagal memproses file Excel.");
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.readAsBinaryString(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processExcelFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processExcelFile(e.dataTransfer.files[0]);
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

  const filteredUnits = units.filter(unit => 
    unit.name.toLowerCase().includes(searchUnitTerm.toLowerCase()) || 
    unit.id.toLowerCase().includes(searchUnitTerm.toLowerCase())
  );

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
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
                >
                  <div className="flex items-center gap-3 mb-8 text-slate-800">
                    <div className="w-10 h-10 rounded-2xl bg-unair-gold/10 flex items-center justify-center text-unair-gold">
                      <Building className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-black tracking-tight uppercase">
                      {editingUnitId ? 'Edit Unit / KSM' : 'Tambah Unit / KSM'}
                    </h2>
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
                        {editingUnitId ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {editingUnitId ? `Update ${unitForm.type}` : `Simpan ${unitForm.type}`}
                      </div>
                    </button>
                    {editingUnitId && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingUnitId(null);
                          setUnitForm({ type: 'KSM', name: '' });
                        }}
                        className="w-full text-center text-slate-400 text-[10px] font-black uppercase tracking-widest mt-4 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        Batal Edit
                      </button>
                    )}
                  </form>
                </motion.div>

                {/* Integration Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
                >
                  <div className="flex items-center gap-3 mb-6 text-slate-800">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-md font-black tracking-tight uppercase leading-none mb-1">Integrasi Excel</h2>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ekspor & Impor Massal</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                    Unduh daftar Unit/KSM saat ini sebagai file Excel, atau unggah Excel baru untuk melakukan impor massal secara instan.
                  </p>

                  <div className="space-y-4">
                    {/* Export */}
                    <button 
                      onClick={handleExportUnitsExcel}
                      disabled={isImporting}
                      className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl py-3.5 px-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      Ekspor ke Excel (.xlsx)
                    </button>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                      <div className="flex-1 border-t border-slate-100"></div>
                      <span className="px-3 text-[10px] font-bold text-slate-300 uppercase tracking-widest">ATAU IMPOR</span>
                      <div className="flex-1 border-t border-slate-100"></div>
                    </div>

                    {/* Import Dropzone / Button */}
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                        dragActive 
                          ? 'border-unair-gold bg-unair-gold/5' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <input 
                        type="file" 
                        id="excel-import-units" 
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        disabled={isImporting}
                        className="hidden" 
                      />
                      <label 
                        htmlFor="excel-import-units"
                        className="flex flex-col items-center justify-center gap-2.5 cursor-pointer"
                      >
                        {isImporting ? (
                          <>
                            <Loader2 className="w-6 h-6 text-unair-gold animate-spin" />
                            <div>
                              <p className="text-xs font-bold text-slate-700">Sedang mengimpor data...</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Harap tunggu sejenak</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-slate-400" />
                            <div>
                              <p className="text-xs font-bold text-slate-700">
                                Seret & letakkan file atau <span className="text-unair-blue underline">pilih file</span>
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1">
                                Format: .xlsx atau .xls
                              </p>
                            </div>
                          </>
                        )}
                      </label>
                    </div>

                    {/* Template Tip */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/50 text-[11px] text-slate-500 leading-relaxed">
                      <span className="font-bold text-slate-700 block mb-1">Struktur Kolom Excel:</span>
                      Harus memiliki kolom <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-xs font-bold text-slate-700">Tipe</code> (nilai: <code className="font-semibold text-slate-600">Unit</code> atau <code className="font-semibold text-slate-600">KSM</code>) & <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-xs font-bold text-slate-700">Nama</code>.
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          {/* Right: Data Table View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden h-full flex flex-col">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-black text-slate-800 uppercase tracking-tight">
                  {activeTab === 'accounts' ? 'Daftar Akun Sistem' : 'Daftar Unit & KSM'}
                </h3>
                <div className="flex items-center gap-3">
                  {activeTab === 'units' && units.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDeleteAllUnits}
                      className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus Semua
                    </button>
                  )}
                  <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                    Total {activeTab === 'accounts' ? accounts.length : units.length} Data
                  </span>
                </div>
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
                  <div className="space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Cari Unit / KSM..."
                        value={searchUnitTerm}
                        onChange={(e) => setSearchUnitTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-unair-blue/10 focus:border-unair-blue outline-none transition-all"
                      />
                    </div>
                  
                    <div className="space-y-4">
                      {filteredUnits.map(unit => (
                        <div key={unit.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-unair-gold/30 hover:bg-slate-50 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg uppercase">
                              <Building className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 flex items-center gap-2">
                                {unit.name}
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${unit.type === 'KSM' ? 'bg-unair-blue/10 text-unair-blue' : 'bg-unair-gold/10 text-unair-gold-dark'}`}>
                                  {unit.type}
                                </span>
                              </div>
                              <div className="text-xs text-slate-400 font-medium mt-1">ID: {unit.id}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button 
                              title="Edit Unit/KSM"
                              onClick={() => {
                                setEditingUnitId(unit.id);
                                setUnitForm({
                                  type: unit.type,
                                  name: unit.name
                                });
                              }}
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-unair-blue hover:bg-unair-blue/10 transition-colors cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              title="Hapus Unit/KSM"
                              onClick={() => handleDeleteUnit(unit.id)}
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {filteredUnits.length === 0 && (
                        <div className="text-center py-12 text-slate-400 font-medium text-sm">
                          {units.length > 0 ? 'Pencarian tidak ditemukan.' : 'Belum ada data unit/KSM.'}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Custom Confirmation Dialog Modal */}
      {confirmDialog?.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setConfirmDialog(null)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-[32px] p-8 shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 ${
                confirmDialog.type === 'danger' 
                  ? 'bg-rose-50 text-rose-500' 
                  : confirmDialog.type === 'warning'
                    ? 'bg-amber-50 text-amber-500'
                    : 'bg-unair-blue/10 text-unair-blue'
              }`}>
                {confirmDialog.type === 'danger' && <Trash2 className="w-8 h-8" />}
                {confirmDialog.type === 'warning' && <AlertTriangle className="w-8 h-8" />}
                {(confirmDialog.type === 'info' || !confirmDialog.type) && <HelpCircle className="w-8 h-8" />}
              </div>
              
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-3">
                {confirmDialog.title}
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 whitespace-pre-line">
                {confirmDialog.message}
              </p>
              
              <div className="flex gap-4 w-full">
                <button 
                  type="button"
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 py-4 px-6 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold rounded-2xl text-xs uppercase tracking-widest transition-colors cursor-pointer border border-slate-200/50"
                >
                  {confirmDialog.cancelText || 'Batal'}
                </button>
                <button 
                  type="button"
                  onClick={async () => {
                    const onConfirmCallback = confirmDialog.onConfirm;
                    setConfirmDialog(null);
                    await onConfirmCallback();
                  }}
                  className={`flex-1 py-4 px-6 text-white font-bold rounded-2xl text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-lg ${
                    confirmDialog.type === 'danger' 
                      ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200' 
                      : confirmDialog.type === 'warning'
                        ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
                        : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'
                  }`}
                >
                  {confirmDialog.confirmText || 'Ya, Lanjutkan'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Custom Alert Notification Modal */}
      {notification?.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setNotification(null)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-[32px] p-8 shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 ${
                notification.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-500' 
                  : notification.type === 'error'
                    ? 'bg-rose-50 text-rose-500'
                    : 'bg-unair-blue/10 text-unair-blue'
              }`}>
                {notification.type === 'success' && <CheckCircle2 className="w-8 h-8" />}
                {notification.type === 'error' && <XCircle className="w-8 h-8" />}
                {notification.type === 'info' && <AlertTriangle className="w-8 h-8" />}
              </div>
              
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-3">
                {notification.title}
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 whitespace-pre-line">
                {notification.message}
              </p>
              
              <button 
                type="button"
                onClick={() => setNotification(null)}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-lg shadow-slate-200"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
