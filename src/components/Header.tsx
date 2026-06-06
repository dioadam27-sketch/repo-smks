import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, UserCircle, LogOut, Grid, ChevronDown, LayoutDashboard, GraduationCap, Users, FlaskConical } from 'lucide-react';
import type { ViewMode } from '../types';

interface HeaderProps {
  onLogout?: () => void;
  user?: { name: string; role: string } | null;
  onBackToPortal?: () => void;
  viewMode?: ViewMode;
  onSwitchViewMode?: (mode: ViewMode) => void;
}

export function Header({ onLogout, user, onBackToPortal, viewMode, onSwitchViewMode }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { mode: 'dashboard' as ViewMode, label: 'Dashboard Utama', icon: LayoutDashboard, color: 'text-sky-600 bg-sky-50' },
    { mode: 'smks_pendidikan' as ViewMode, label: 'Pendidikan', icon: GraduationCap, color: 'text-emerald-600 bg-emerald-50' },
    { mode: 'smks_pelatihan' as ViewMode, label: 'Pelatihan', icon: Users, color: 'text-indigo-600 bg-indigo-50' },
    { mode: 'smks_penelitian' as ViewMode, label: 'Penelitian dan Inovasi', icon: FlaskConical, color: 'text-amber-600 bg-amber-50' },
  ];

  const currentOption = options.find(o => o.mode === viewMode) || options[0];
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 selection:bg-unair-blue selection:text-white">
      <div className="flex items-center gap-4 sm:gap-6">
        <button 
          onClick={onBackToPortal}
          className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group shrink-0"
          title="Kembali ke Portal"
        >
          <div className="w-8 h-8 rounded-lg bg-unair-blue/10 flex items-center justify-center text-unair-blue group-hover:bg-unair-blue group-hover:text-white transition-all">
            <Grid className="w-5 h-5" />
          </div>
          <img src="https://i.imgur.com/g3CJZNH.png" alt="Logo" className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
          <h2 className="hidden lg:block text-sm font-black text-slate-800 uppercase tracking-tight">SMKS RS UNAIR</h2>
        </button>

        {onSwitchViewMode && viewMode && (
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full text-xs font-semibold text-slate-700 transition-all shadow-sm cursor-pointer select-none"
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${currentOption.color}`}>
                <currentOption.icon className="w-3 h-3" />
              </div>
              <span className="max-w-[150px] truncate hidden sm:inline">{currentOption.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1">
                  Pindah Modul / Role Direct
                </div>
                {options.map((opt) => {
                  const isActive = opt.mode === viewMode;
                  return (
                    <button
                      key={opt.mode}
                      onClick={() => {
                        onSwitchViewMode(opt.mode);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-xs text-left transition-all ${
                        isActive 
                          ? 'bg-unair-blue/5 text-unair-blue font-bold font-semibold' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${opt.color} shrink-0`}>
                        <opt.icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold leading-none">{opt.label}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="relative w-72 hidden xl:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-unair-blue focus:border-unair-blue"
            placeholder="Cari modul atau laporan..."
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <button className="text-slate-400 hover:text-slate-600 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 block h-2 border-2 border-white w-2 rounded-full bg-rose-500"></span>
        </button>
        <div className="flex items-center space-x-3 border-l border-slate-200 pl-6 group">
          <div className="flex items-center space-x-3 pr-2">
            <UserCircle className="h-8 w-8 text-slate-400" />
            <div className="hidden md:block text-sm text-left">
              <p className="font-medium text-slate-700 leading-tight">{user?.name || 'Dr. Kirana'}</p>
              <p className="text-slate-500 text-[11px] leading-tight mt-0.5">{user?.role || 'Direktur SDM & Akademik'}</p>
            </div>
          </div>
          {onLogout && (
            <button 
              onClick={onLogout}
              className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
