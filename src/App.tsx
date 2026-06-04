import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Pendidikan } from './pages/Pendidikan';
import { Pelatihan } from './pages/Pelatihan';
import { Penelitian } from './pages/Penelitian';
import { Login } from './pages/Login';
import { Portal } from './pages/Portal';
import { AdminPortal } from './pages/AdminPortal';
import { DashboardSummary } from './pages/DashboardSummary';
import { SMKSProvider } from './context/SMKSContext';
import type { TabType, ViewMode } from './types';

function getTabFromHash(hash: string): TabType {
  const cleanHash = hash.replace(/^#?\/?/, '');
  if (cleanHash === 'pelatihan') return 'pelatihan_trainer_sertifikasi';
  if (cleanHash.startsWith('pelatihan/')) {
    const sub = cleanHash.split('/')[1];
    if (['trainer_sertifikasi', 'inhouse', 'kerjasama', 'studi', 'magang', 'standar_kemenkes', 'internasional', 'mandiri'].includes(sub)) {
      return `pelatihan_${sub}` as TabType;
    }
  }
  if (cleanHash === 'penelitian') return 'penelitian_pendapatan';
  if (cleanHash.startsWith('penelitian/')) {
    const sub = cleanHash.split('/')[1];
    if (['pendapatan', 'uji_etik', 'uji_klinik', 'publikasi', 'produk', 'produk_terjual', 'buku', 'pengabdian', 'proposal_arf', 'submission_cphm', 'paten', 'hki'].includes(sub)) {
      return `penelitian_${sub}` as TabType;
    }
  }
  if (cleanHash === 'pendidikan') return 'pendidikan_l';
  if (cleanHash.startsWith('pendidikan/')) {
    const sub = cleanHash.split('/')[1];
    if (['b', 'c', 'd', 'e', 'f', 'g', 'j', 'k', 'l', 'm', 'n'].includes(sub)) {
      return `pendidikan_${sub}` as TabType;
    }
  }
  return 'pendidikan_l';
}

function getHashFromTab(tab: TabType): string {
  if (tab === 'pelatihan') return '/pelatihan/trainer_sertifikasi';
  if (tab.startsWith('pelatihan_')) {
    const sub = tab.replace('pelatihan_', '');
    return `/pelatihan/${sub}`;
  }
  if (tab === 'penelitian') return '/penelitian/pendapatan';
  if (tab.startsWith('penelitian_')) {
    const sub = tab.replace('penelitian_', '');
    return `/penelitian/${sub}`;
  }
  if (tab === 'pendidikan') return '/pendidikan/l';
  if (tab.startsWith('pendidikan_')) {
    const sub = tab.split('_')[1];
    return `/pendidikan/${sub}`;
  }
  return '/pendidikan/l';
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('smks_view_mode');
    return (saved as ViewMode) || 'portal';
  });

  const [user, setUser] = useState<{ id: string; username: string; name: string; role: string; menu_permissions?: string } | null>(() => {
    const saved = localStorage.getItem('smks_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!user;

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const currentTab = getTabFromHash(location.pathname);
    return currentTab;
  });

  // Automatic logout after 5 minutes of inactivity (300,000ms)
  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        localStorage.setItem('smks_logout_reason', 'inactivity');
        handleLogout();
      }, 300000); // 5 minutes
    };

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const newTab = getTabFromHash(location.pathname);
    if (newTab !== activeTab && location.pathname !== '/' && location.pathname !== '/admin') {
      setActiveTab(newTab);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleAuthExpired = () => {
      handleLogout();
    };
    window.addEventListener('auth_expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth_expired', handleAuthExpired);
    };
  }, []);

  const handleSetActiveTab = (tab: TabType) => {
    const targetPath = getHashFromTab(tab);
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
    setActiveTab(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem('smks_auth');
    localStorage.removeItem('smks_user');
    localStorage.removeItem('smks_view_mode');
    setUser(null);
    setViewMode('portal');
  };

  const handleLogin = (userData: { id: string; username: string; name: string; role: string; menu_permissions?: string }) => {
    localStorage.setItem('smks_auth', 'true');
    localStorage.setItem('smks_user', JSON.stringify(userData));
    setUser(userData);
  };

  const getFirstAllowedTab = (category: 'pendidikan' | 'pelatihan' | 'penelitian'): TabType => {
    const isAdmin = user?.role === 'System Developer' || user?.role === 'Administrator';
    if (isAdmin) {
      if (category === 'pendidikan') return 'pendidikan_l';
      if (category === 'pelatihan') return 'pelatihan_trainer_sertifikasi';
      return 'penelitian_pendapatan';
    }

    const permissions = user?.menu_permissions ? user.menu_permissions.split(',') : [];
    if (category === 'pendidikan') {
      const allowed = ['pendidikan_l', 'pendidikan_m', 'pendidikan_b', 'pendidikan_c', 'pendidikan_d', 'pendidikan_e', 'pendidikan_f', 'pendidikan_g', 'pendidikan_j', 'pendidikan_k', 'pendidikan_n'].filter(p => permissions.includes(p));
      return (allowed[0] || 'pendidikan_l') as TabType;
    }
    if (category === 'pelatihan') {
      const allowed = ['pelatihan_trainer_sertifikasi', 'pelatihan_internasional', 'pelatihan_standar_kemenkes', 'pelatihan_mandiri', 'pelatihan_kerjasama', 'pelatihan_inhouse', 'pelatihan_magang', 'pelatihan_studi'].filter(p => permissions.includes(p));
      return (allowed[0] || 'pelatihan_trainer_sertifikasi') as TabType;
    }
    const allowed = ['penelitian_pendapatan', 'penelitian_uji_etik', 'penelitian_uji_klinik', 'penelitian_publikasi', 'penelitian_produk', 'penelitian_produk_terjual', 'penelitian_buku', 'penelitian_pengabdian', 'penelitian_proposal_arf', 'penelitian_submission_cphm', 'penelitian_paten', 'penelitian_hki'].filter(p => permissions.includes(p));
    return (allowed[0] || 'penelitian_pendapatan') as TabType;
  };

  const handleSetViewMode = (mode: ViewMode) => {
    localStorage.setItem('smks_view_mode', mode);
    setViewMode(mode);
    if (mode === 'smks_pendidikan') {
      handleSetActiveTab(getFirstAllowedTab('pendidikan'));
    } else if (mode === 'smks_pelatihan') {
      handleSetActiveTab(getFirstAllowedTab('pelatihan'));
    } else if (mode === 'smks_penelitian') {
      handleSetActiveTab(getFirstAllowedTab('penelitian'));
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (viewMode === 'portal') {
    return (
      <SMKSProvider>
        <Portal 
          user={user}
          onSelect={handleSetViewMode} 
          onLogout={handleLogout} 
        />
      </SMKSProvider>
    );
  }

  if (viewMode === 'admin') {
    return (
      <SMKSProvider>
        <AdminPortal onBack={() => handleSetViewMode('portal')} />
      </SMKSProvider>
    );
  }

  return (
    <SMKSProvider>
      <div className="flex min-h-screen bg-slate-50 font-sans print:bg-white">
        {/* Hide Sidebar for prints */}
        <div className="print:hidden">
          {viewMode.startsWith('smks') && (
            <Sidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} viewMode={viewMode} user={user} />
          )}
        </div>
        
        {/* Dynamic print-override for layouts: remove ml-64 and h-screen limits */}
        <div className={`flex-1 print:ml-0 flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible transition-all duration-500 ${viewMode.startsWith('smks') ? 'ml-64' : 'ml-0'}`}>
          {/* Hide Header for prints */}
          <div className="print:hidden">
            <Header 
              onLogout={handleLogout} 
              user={user} 
              onBackToPortal={() => handleSetViewMode('portal')} 
              viewMode={viewMode}
              onSwitchViewMode={handleSetViewMode}
            />
          </div>
          
          <main className="flex-1 overflow-y-auto print:overflow-visible">
            {viewMode === 'dashboard' ? (
              <DashboardSummary 
                onNavigate={(tab) => {
                  if (tab.startsWith('pendidikan')) handleSetViewMode('smks_pendidikan');
                  else if (tab.startsWith('pelatihan')) handleSetViewMode('smks_pelatihan');
                  else if (tab.startsWith('penelitian')) handleSetViewMode('smks_penelitian');
                  handleSetActiveTab(tab);
                }}
              />
            ) : (
              <Routes>
                <Route path="/pelatihan/:sub" element={<Pelatihan activeSubTab={(activeTab === 'pelatihan' ? 'TRAINER_SERTIFIKASI' : activeTab.replace('pelatihan_', '').toUpperCase()) as any} onChangeSubTab={(s: string) => handleSetActiveTab(`pelatihan_${s.toLowerCase()}` as any)} />} />
                <Route path="/penelitian/:sub" element={<Penelitian activeSubTab={(activeTab === 'penelitian' ? 'PENDAPATAN' : activeTab.replace('penelitian_', '').toUpperCase()) as any} onChangeSubTab={(s: string) => handleSetActiveTab(`penelitian_${s.toLowerCase()}` as any)} />} />
                <Route path="/pendidikan/:sub" element={<Pendidikan activeSubTab={(activeTab === 'pendidikan' ? 'L' : activeTab.split('_')[1].toUpperCase()) as any} onChangeSubTab={(s) => handleSetActiveTab(`pendidikan_${s.toLowerCase()}` as any)} />} />
                <Route path="*" element={<Pendidikan  activeSubTab="L" onChangeSubTab={(s) => handleSetActiveTab(`pendidikan_${s.toLowerCase()}` as any)}  />} />
              </Routes>
            )}
          </main>
        </div>
      </div>
    </SMKSProvider>
  );
}
