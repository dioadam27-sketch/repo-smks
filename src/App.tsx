import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Pendidikan } from './pages/Pendidikan';
import { Pelatihan } from './pages/Pelatihan';
import { Penelitian } from './pages/Penelitian';
import { Login } from './pages/Login';
import { Portal } from './pages/Portal';
import { AdminPortal } from './pages/AdminPortal';
import { DashboardSummary } from './pages/DashboardSummary';
import type { TabType, ViewMode } from './types';

function getTabFromHash(hash: string): TabType {
  const cleanHash = hash.replace(/^#\/?/, '');
  if (cleanHash === 'pelatihan') return 'pelatihan_inhouse';
  if (cleanHash.startsWith('pelatihan/')) {
    const sub = cleanHash.split('/')[1];
    if (['inhouse', 'kerjasama', 'studi', 'magang', 'standar_kemenkes', 'internasional', 'trainer_sertifikasi', 'mandiri'].includes(sub)) {
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
    if (['b', 'c', 'd', 'e', 'f', 'g', 'j', 'k', 'l', 'm'].includes(sub)) {
      return `pendidikan_${sub}` as TabType;
    }
  }
  return 'pendidikan_l';
}

function getHashFromTab(tab: TabType): string {
  if (tab === 'pelatihan') return '#/pelatihan/inhouse';
  if (tab.startsWith('pelatihan_')) {
    const sub = tab.replace('pelatihan_', '');
    return `#/pelatihan/${sub}`;
  }
  if (tab === 'penelitian') return '#/penelitian/pendapatan';
  if (tab.startsWith('penelitian_')) {
    const sub = tab.replace('penelitian_', '');
    return `#/penelitian/${sub}`;
  }
  if (tab === 'pendidikan') return '#/pendidikan/l';
  if (tab.startsWith('pendidikan_')) {
    const sub = tab.split('_')[1];
    return `#/pendidikan/${sub}`;
  }
  return '#/pendidikan/l';
}

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('smks_view_mode');
    return (saved as ViewMode) || 'portal';
  });

  const [user, setUser] = useState<{ id: string; username: string; name: string; role: string } | null>(() => {
    const saved = localStorage.getItem('smks_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!user;

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const currentTab = getTabFromHash(window.location.hash);
    const initialHash = getHashFromTab(currentTab);
    if (window.location.hash !== initialHash) {
      window.location.hash = initialHash;
    }
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
    const handleHashChange = () => {
      const newTab = getTabFromHash(window.location.hash);
      if (newTab !== activeTab) {
        setActiveTab(newTab);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  const handleSetActiveTab = (tab: TabType) => {
    const targetHash = getHashFromTab(tab);
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
  };

  const renderContent = () => {
    if (activeTab === 'pelatihan' || activeTab.startsWith('pelatihan_')) {
      const sub = (activeTab === 'pelatihan' ? 'INHOUSE' : activeTab.replace('pelatihan_', '').toUpperCase()) as any;
      return (
        <Pelatihan 
          activeSubTab={sub} 
          onChangeSubTab={(s: string) => handleSetActiveTab(`pelatihan_${s.toLowerCase()}` as any)} 
        />
      );
    }
    if (activeTab === 'penelitian' || activeTab.startsWith('penelitian_')) {
      const sub = (activeTab === 'penelitian' ? 'PENDAPATAN' : activeTab.replace('penelitian_', '').toUpperCase()) as any;
      return (
        <Penelitian 
          activeSubTab={sub} 
          onChangeSubTab={(s: string) => handleSetActiveTab(`penelitian_${s.toLowerCase()}` as any)} 
        />
      );
    }
    if (activeTab === 'pendidikan' || activeTab.startsWith('pendidikan_')) {
      const sub = activeTab === 'pendidikan' ? 'L' : activeTab.split('_')[1].toUpperCase();
      return (
        <Pendidikan 
          activeSubTab={sub as any} 
          onChangeSubTab={(s) => handleSetActiveTab(`pendidikan_${s.toLowerCase()}` as any)} 
        />
      );
    }
    return (
      <Pendidikan 
        activeSubTab="L" 
        onChangeSubTab={(s) => handleSetActiveTab(`pendidikan_${s.toLowerCase()}` as any)} 
      />
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('smks_auth');
    localStorage.removeItem('smks_user');
    localStorage.removeItem('smks_view_mode');
    setUser(null);
    setViewMode('portal');
  };

  const handleLogin = (userData: { id: string; username: string; name: string; role: string }) => {
    localStorage.setItem('smks_auth', 'true');
    localStorage.setItem('smks_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleSetViewMode = (mode: ViewMode) => {
    localStorage.setItem('smks_view_mode', mode);
    setViewMode(mode);
    if (mode === 'smks_pendidikan') {
      handleSetActiveTab('pendidikan_l');
    } else if (mode === 'smks_pelatihan') {
      handleSetActiveTab('pelatihan_inhouse');
    } else if (mode === 'smks_penelitian') {
      handleSetActiveTab('penelitian_pendapatan');
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (viewMode === 'portal') {
    return (
      <Portal 
        user={user}
        onSelect={handleSetViewMode} 
        onLogout={handleLogout} 
      />
    );
  }

  if (viewMode === 'admin') {
    return (
      <AdminPortal onBack={() => handleSetViewMode('portal')} />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans print:bg-white">
      {/* Hide Sidebar for prints */}
      <div className="print:hidden">
        {viewMode.startsWith('smks') && (
          <Sidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} viewMode={viewMode} />
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
          ) : renderContent()}
        </main>
      </div>
    </div>
  );
}
