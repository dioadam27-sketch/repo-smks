import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Users, 
  FlaskConical,
  ChevronDown,
  ChevronRight,
  Compass,
  BookOpen,
  Globe,
  MapPin,
  Handshake,
  TrendingUp,
  Users2,
  FileText,
  Award,
  Activity,
  Clock,
  Plane,
  UserSearch,
  Coins,
  AlertTriangle,
  Layout,
  Briefcase,
  UserCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { TabType, ViewMode } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  viewMode?: ViewMode;
}

export function Sidebar({ activeTab, setActiveTab, viewMode }: SidebarProps) {
  const isPendidikanActive = activeTab === 'pendidikan' || activeTab.startsWith('pendidikan_');
  const isPelatihanActive = activeTab === 'pelatihan' || activeTab.startsWith('pelatihan_');
  const isInovasiActive = activeTab === 'penelitian' || activeTab.startsWith('penelitian_');
  
  const [eduExpanded, setEduExpanded] = useState(isPendidikanActive);
  const [trainExpanded, setTrainExpanded] = useState(isPelatihanActive);
  const [inovExpanded, setInovExpanded] = useState(isInovasiActive);

  // Auto-expand only when switching TO the section
  useEffect(() => {
    if (isPendidikanActive) setEduExpanded(true);
  }, [isPendidikanActive]);

  useEffect(() => {
    if (isPelatihanActive) setTrainExpanded(true);
  }, [isPelatihanActive]);

  useEffect(() => {
    if (isInovasiActive) setInovExpanded(true);
  }, [isInovasiActive]);

  const navItemsRaw = [
    { 
      id: 'pendidikan', 
      label: 'Pendidikan', 
      icon: GraduationCap,
      hasSubmenu: true 
    },
    { 
      id: 'pelatihan', 
      label: 'Pelatihan', 
      icon: Users,
      hasSubmenu: true
    },
    { 
      id: 'penelitian', 
      label: 'Inovasi & Penelitian', 
      icon: FlaskConical,
      hasSubmenu: true
    },
  ] as const;

  const navItems = navItemsRaw.filter(item => {
    if (viewMode === 'smks_pendidikan') return item.id === 'pendidikan';
    if (viewMode === 'smks_pelatihan') return item.id === 'pelatihan';
    if (viewMode === 'smks_penelitian') return item.id === 'penelitian';
    return true;
  });

  const eduSubItems = [
    { id: 'pendidikan_l', label: 'Prapendidikan (Komkordik)', icon: Compass },
    { id: 'pendidikan_m', label: 'Orientasi KSM / Instalasi', icon: Layout },
    { id: 'pendidikan_b', label: 'IPE (Interprofessional)', icon: Users2 },
    { id: 'pendidikan_c', label: 'Modul IPE', icon: BookOpen },
    { id: 'pendidikan_d', label: 'Student Inbound', icon: Globe },
    { id: 'pendidikan_e', label: 'Kunjungan', icon: MapPin },
    { id: 'pendidikan_f', label: 'Surat MOU', icon: Handshake },
    { id: 'pendidikan_g', label: 'Akselerasi Pendidikan', icon: TrendingUp },
    { id: 'pendidikan_j', label: 'Pendapatan Pendidikan Non UNAIR', icon: Coins },
    { id: 'pendidikan_k', label: 'Data Pajanan Peserta Didik', icon: AlertTriangle },
  ] as const;

  const trainSubItems = [
    { id: 'pelatihan_inhouse', label: 'Inhouse Training', icon: Activity },
    { id: 'pelatihan_kerjasama', label: 'Kerjasama SKP', icon: Handshake },
    { id: 'pelatihan_studi', label: 'Studi Banding', icon: Plane },
    { id: 'pelatihan_magang', label: 'Magang', icon: Briefcase },
    { id: 'pelatihan_standar_kemenkes', label: 'Pelatihan Standar Kemenkes', icon: FileText },
    { id: 'pelatihan_internasional', label: 'Kerjasama Pelatihan Internasional', icon: Globe },
    { id: 'pelatihan_trainer_sertifikasi', label: 'Trainer Tersertifikasi', icon: UserCheck },
    { id: 'pelatihan_mandiri', label: 'Pelatihan Mandiri ber-SKP', icon: Award },
  ] as const;

  const inovSubItems = [
    { id: 'penelitian_pendapatan', label: 'Pendapatan Penelitian', icon: Coins },
    { id: 'penelitian_uji_etik', label: 'Pelaksanaan Uji Etik Penelitian', icon: FlaskConical },
    { id: 'penelitian_uji_klinik', label: 'Penelitian Uji Klinik', icon: Users },
    { id: 'penelitian_publikasi', label: 'Penelitian Terpublikasi dan Terindeks Internasional', icon: FileText },
    { id: 'penelitian_produk', label: 'Produk Inovasi', icon: Activity },
    { id: 'penelitian_produk_terjual', label: 'Produk Inovasi Terjual', icon: Coins },
    { id: 'penelitian_buku', label: 'Buku ISBN', icon: BookOpen },
    { id: 'penelitian_pengabdian', label: 'Pengabdian Masyarakat', icon: Users2 },
    { id: 'penelitian_proposal_arf', label: 'Proposal Penelitian Didanai (ARF)', icon: Award },
    { id: 'penelitian_submission_cphm', label: 'Submission CPHM', icon: FileText },
    { id: 'penelitian_paten', label: 'Paten', icon: Award },
    { id: 'penelitian_hki', label: 'HKI', icon: Award },
  ] as const;



  const handleMainMenuClick = (itemId: string) => {
    if (itemId === 'pendidikan') {
      if (!isPendidikanActive) {
        setEduExpanded(true);
        setActiveTab('pendidikan_l');
      } else {
        setEduExpanded(!eduExpanded);
      }
    } else if (itemId === 'pelatihan') {
      if (!isPelatihanActive) {
        setTrainExpanded(true);
        setActiveTab('pelatihan_inhouse');
      } else {
        setTrainExpanded(!trainExpanded);
      }
    } else if (itemId === 'penelitian') {
      if (!isInovasiActive) {
        setInovExpanded(true);
        setActiveTab('penelitian_pendapatan');
      } else {
        setInovExpanded(!inovExpanded);
      }
    } else {
      setActiveTab(itemId as TabType);
    }
  };

  return (
    <aside className="w-64 bg-unair-blue h-screen flex flex-col fixed left-0 top-0 border-r border-unair-blue-light/30 z-30">
      <div className="py-8 flex flex-col items-center justify-center border-b border-white/10 shrink-0 px-4">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl mb-4 overflow-hidden ring-4 ring-white/5">
          <img src="https://i.imgur.com/g3CJZNH.png" alt="Logo RSUA" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </div>
        <div className="text-center">
          <h1 className="text-white font-bold tracking-widest leading-none text-xl mb-1.5 px-2">SMKS RSUA</h1>
          <p className="text-white/50 text-[9px] uppercase font-bold tracking-[0.2em] whitespace-nowrap">Rumah Sakit Unair</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            let isItemActive = false;
            if (item.id === 'pendidikan') isItemActive = isPendidikanActive;
            else if (item.id === 'pelatihan') isItemActive = isPelatihanActive;
            else isItemActive = isInovasiActive;
            
            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => handleMainMenuClick(item.id)}
                  title={item.label}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200",
                    isItemActive 
                      ? "bg-white/10 text-unair-gold font-semibold" 
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className={cn(
                      "mr-3 flex-shrink-0 w-5 h-5 transition-colors duration-200",
                      isItemActive ? "text-unair-gold" : "text-white/50"
                    )} />
                    {item.label}
                  </div>
                  
                  {'hasSubmenu' in item && (
                    (item.id === 'pendidikan' ? eduExpanded : item.id === 'pelatihan' ? trainExpanded : inovExpanded)
                      ? <ChevronDown className="w-4 h-4 opacity-50" /> 
                      : <ChevronRight className="w-4 h-4 opacity-50" />
                  )}
                </button>

                {/* Submenus nested rendering for Pendidikan */}
                <AnimatePresence>
                  {item.id === 'pendidikan' && eduExpanded && (
                    <motion.div 
                      key="edu-sub"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-4 mt-1 space-y-1 border-l border-white/10 ml-5 overflow-hidden"
                    >
                      {eduSubItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => setActiveTab(subItem.id as TabType)}
                          title={subItem.label}
                          className={cn(
                            "w-full flex items-center px-3 py-2 text-xs font-medium rounded-md transition-colors",
                            activeTab === subItem.id ? "bg-unair-gold/15 text-unair-gold font-semibold" : "text-white/60 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <subItem.icon className={cn("mr-2.5 w-4 h-4", activeTab === subItem.id ? "text-unair-gold" : "text-white/40")} />
                          <span className="truncate">{subItem.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submenus nested rendering for Pelatihan */}
                <AnimatePresence>
                  {item.id === 'pelatihan' && trainExpanded && (
                    <motion.div 
                      key="train-sub"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-4 mt-1 space-y-1 border-l border-white/10 ml-5 overflow-hidden"
                    >
                      {trainSubItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => setActiveTab(subItem.id as TabType)}
                          title={subItem.label}
                          className={cn(
                            "w-full flex items-center px-3 py-2 text-xs font-medium rounded-md transition-colors",
                            activeTab === subItem.id ? "bg-unair-gold/15 text-unair-gold font-semibold" : "text-white/60 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <subItem.icon className={cn("mr-2.5 w-4 h-4", activeTab === subItem.id ? "text-unair-gold" : "text-white/40")} />
                          <span className="truncate">{subItem.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submenus nested rendering for Inovasi */}
                <AnimatePresence>
                  {item.id === 'penelitian' && inovExpanded && (
                    <motion.div 
                      key="inov-sub"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-4 mt-1 space-y-1 border-l border-white/10 ml-5 overflow-hidden"
                    >
                      {inovSubItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => setActiveTab(subItem.id as TabType)}
                          title={subItem.label}
                          className={cn(
                            "w-full flex items-center px-3 py-2 text-xs font-medium rounded-md transition-colors",
                            activeTab === subItem.id ? "bg-unair-gold/15 text-unair-gold font-semibold" : "text-white/60 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <subItem.icon className={cn("mr-2.5 w-4 h-4", activeTab === subItem.id ? "text-unair-gold" : "text-white/40")} />
                          <span className="truncate">{subItem.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="text-[10px] text-white/35 text-center">
          @ 2026 Rumah Sakit Universitas Airlangga
        </div>
      </div>
    </aside>
  );
}
