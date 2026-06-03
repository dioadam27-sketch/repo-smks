import React, { useState } from 'react';
import { 
  Compass, 
  Users, 
  BookOpen, 
  Globe, 
  MapPin, 
  Handshake, 
  TrendingUp, 
  Trash2, 
  Edit2,
  FolderPlus, 
  Info, 
  Check, 
  Plus, 
  FileText, 
  BookMarked,
  LineChart as LineChartIcon,
  Calendar,
  Layers,
  Sparkles,
  Search,
  X,
  Printer,
  Coins,
  Upload,
  Eye,
  Download,
  ChevronDown,
  Filter,
  ArrowDown,
  ArrowUp,
  AlertTriangle,
  Edit,
  Layout
} from 'lucide-react';
import { uploadToAppsScript } from '../utils/gdriveUpload';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { useSMKS } from '../context/SMKSContext';
import { 
  formatPraPendidikanExcel,
  formatIpeExcel,
  formatModulIpeExcel,
  formatStudentInboundExcel,
  formatKunjunganExcel,
  formatMouExcel,
  formatAkselerasiExcel,
  downloadExcelSheet
} from '../utils/exportUtils';
import {
  generatePraPendidikanPdf,
  generateIpePdf,
  generateModulIpePdf,
  generateStudentInboundPdf,
  generateKunjunganPdf,
  generateMouPdf,
  generateAkselerasiPdf,
  generatePendapatanPdf,
  generatePajananPdf
} from '../utils/pdfExportUtils';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { fetchApi } from '../lib/api';

const UNAIR_FAKULTAS = [
  'Kedokteran',
  'Kedokteran Gigi',
  'Hukum',
  'Ekonomi dan Bisnis',
  'Farmasi',
  'Kedokteran Hewan',
  'Ilmu Sosial dan Ilmu Politik',
  'Sains dan Teknologi',
  'Kesehatan Masyarakat',
  'Psikologi',
  'Ilmu Budaya',
  'Keperawatan',
  'Perikanan dan Kelautan',
  'Vokasi',
  'Sekolah Pascasarjana',
  'Teknologi Maju dan Multidisiplin',
  'Ilmu Kesehatan, Kedokteran dan Ilmu Alam'
];

const UNAIR_PRODI_LIST = [
  // S1 Bidang Kesehatan
  "S1-Kedokteran",
  "S1-Kedokteran Gigi",
  "S1-Farmasi",
  "S1-Keperawatan",
  "S1-Kebidanan",
  "S1-Kesehatan Masyarakat",
  "S1-Gizi",
  "S1-Kedokteran Hewan",
  "S1-Akuakultur",
  "S1-Kebidanan (FIKKIA)",
  "S1-Kedokteran (FIKKIA)",
  "S1-Kedokteran Hewan (FIKKIA)",
  "S1-Kesehatan Masyarakat (FIKKIA)",
  "S1-Akuakultur (FIKKIA)",
  
  // Spesialis & Subspesialis
  "Sp-Ilmu Penyakit Dalam",
  "Sp-Ilmu Bedah",
  "Sp-Ilmu Kesehatan Anak",
  "Sp-Obstetri dan Ginekologi",
  "Sp-Neurologi",
  "Sp-Anestesiologi",
  "Sp-Kardiologi dan Kedokteran Vaskular",
  "Sp-Ilmu Kesehatan Kulit dan Kelamin",
  "Sp-Ilmu Kedokteran Fisik dan Rehabilitasi",
  "Sp-Oftalmologi",
  "Sp-Telinga Hidung Tenggorok Bedah Kepala dan Leher",
  "Sp-Psikiatri",
  "Sp-Orthopaedi dan Traumatologi",
  "Sp-Urologi",
  "Sp-Bedah Saraf",
  "Sp-Bedah Plastik Rekonstruksi dan Estetik",
  "Sp-Pulmonologi dan Kedokteran Respirasi",
  "Sp-Radiologi",
  "Sp-Patologi Klinik",
  "Sp-Patologi Anatomi",
  "Sp-Mikrobiologi Klinik",
  "Sp-Kedokteran Forensik dan Medikolegal",

  // Profesi & Reguler UNAIR
  "Profesi Dokter",
  "Profesi Dokter Gigi",
  "Profesi Ners",
  "Profesi Apoteker",
  "Profesi Bidan",
  "Profesi Akuntan",
  "Profesi Dokter Hewan",
  "D3-Bahasa Inggris",
  "D3-Keperawatan",
  "D3-Perpajakan",
  "D4-Akuntansi Bisnis Digital",
  "D4-Manajemen Pemasaran Digital",
  "D4-Destinasi Pariwisata",
  "D4-Fisioterapi",
  "D4-Kearsipan Dan Informasi Digital",
  "D4-Keselamatan Dan Kesehatan Kerja",
  "D4-Manajemen Perhotelan",
  "D4-Manajemen Perkantoran Digital",
  "D4-Pengobat Tradisional",
  "D4-Perbankan Dan Keuangan",
  "D4-Teknik Informatika",
  "D4-Teknologi Kesehatan Gigi",
  "D4-Teknologi Laboratorium Medik",
  "D4-Teknologi Radiologi Pencitraan",
  "D4-Teknologi Rekayasa Instrumentasi Dan Kontrol",
  "D4-Teknologi Veteriner",

  // S1 Non-Kesehatan/Reguler
  "S1-Administrasi Publik",
  "S1-Akuntansi",
  "S1-Antropologi",
  "S1-Bahasa Dan Sastra Indonesia",
  "S1-Bahasa Dan Sastra Jepang",
  "S1-Bahasa Dan Sastra Inggris",
  "S1-Biologi",
  "S1-Ekonomi Islam",
  "S1-Fisika",
  "S1-Ilmu Ekonomi",
  "S1-Ilmu Hubungan Internasional",
  "S1-Ilmu Hukum",
  "S1-Ilmu Informasi dan Perpustakaan",
  "S1-Ilmu Komunikasi",
  "S1-Ilmu Politik",
  "S1-Ilmu Sejarah",
  "S1-Kimia",
  "S1-Manajemen",
  "S1-Matematika",
  "S1-Psikologi",
  "S1-Rekayasa Nanoteknologi",
  "S1-Sistem Informasi",
  "S1-Sosiologi",
  "S1-Statistika",
  "S1-Teknik Biomedis",
  "S1-Teknik Elektro",
  "S1-Teknik Industri",
  "S1-Teknik Lingkungan",
  "S1-Teknik Robotika Dan Kecerdasan Buatan",
  "S1-Teknologi Hasil Perikanan",
  "S1-Teknologi Sains Data"
];

const KSM_PELAKSANA_OPTIONS = [
  "Kepala KSM Ilmu Bedah",
  "Kepala KSM Ilmu Penyakit Dalam",
  "Kepala KSM Kesehatan Anak",
  "Kepala KSM Anastesiologi dan Reanimasi",
  "Kepala KSM Kardiologi dan Kedokteran Vaskuler",
  "Kepala KSM Forensik dan Medikolegal",
  "Kepala KSM Obstetri dan Genikologi",
  "Kepala KSM Kedokteran Jiwa",
  "Kepala KSM Kesehatan Kulit dan Kelamin",
  "Kepala KSM Kesehatan Mata",
  "Kepala KSM Orthopedi",
  "Kepala KSM Bedah Saraf",
  "Kepala KSM Bedah Plastik",
  "Kepala KSM Bedah Urologi",
  "Kepala KSM Penyakit Pulmonologi dan Kesehatan Respirasi",
  "Kepala KSM Neurologi",
  "Kepala KSM Bedah Thorax Kardio Vaskuler",
  "Kepala KSM Radiologi",
  "Kepala KSM Kedokteran Fisik dan Rehabilitasi Medis",
  "Kepala KSM Kedokteran Umum",
  "Kepala KSM Kedokteran Gigi",
  "Kepala KSM Kesehatan THT-BKL",
  "Kepala KSM Patologi Klinik",
  "Kepala KSM Patologi Anatomi",
  "Kepala KSM Mikrobiologi dan Parasitologi Klinik",
  "Kepala KSM Farmasi Klinik",
  "Kepala KSM Andrologi",
  "Kepala KSM Gizi Klinik",
  "Kepala Instalasi Gawat Darurat",
  "Kepala Instalasi Anestesi",
  "Kepala Instalasi Dialisis",
  "Kepala Instalasi Intervensi Vaskuler Terpadu",
  "Kepala Instalasi Kedokteran Fisik dan Rehabilitasi",
  "Kepala Instalasi Maternal Perinatal",
  "Kepala Instalasi Bedah Sentral",
  "Kepala Instalasi Rawat Inap",
  "Kepala Instalasi Rawat Intensif",
  "Kepala Instalasi Rawat Jalan",
  "Kepala Instalasi Pengobatan Tradisional",
  "Kepala Instalasi Onkologi Terpadu",
  "Kepala Instalasi Home Care dan Hospital Tourism",
  "Kepala Instalasi Pemeliharaan Sarana dan Sanitasi",
  "Kepala Instalasi Radiologi",
  "Kepala Instalasi Rekam Medis",
  "Kepala Instalasi Farmasi",
  "Kepala Instalasi CSSD dan Laundry",
  "Kepala Instalasi Gizi",
  "Komkordik",
  "Manajer Pendidikan",
  "Manajer Keperawatan",
  "Manajer SDM",
  "Kepala Seksi Pelayanan Keperawatan",
  "Kepala Seksi Monitoring dan Evaluasi Keperawatan",
  "Kepala Seksi Perencanaan,Pengembangan dan Evaluasi SDM",
  "Kepala Seksi Layanan Kepegawaian dan Karier",
  "Kepala Seksi Perencanaan dan Kolaborasi Pendidikan",
  "Kepala Seksi Monitoring, Evaluasi dan Pengembangan Pendidikan",
  "Kepala Seksi Perencanaan dan Kolaborasi Pelatihan",
  "Kepala Seksi Monitoring, Evaluasi dan Pengembangan Pelatihan",
  "Kepala Seksi Penelitian",
  "Kepala Seksi Inovasi dan Hilirisasi Riset",
  "Kepala Instalasi Laboratorium Sentral",
  "Kepala Instalasi Teknologi Informasi",
  "Kepala Instalasi Laboratorium Riset"
];

const KSM_OPTIONS = [
  "KSM Ilmu Bedah",
  "KSM Ilmu Penyakit Dalam",
  "KSM Kesehatan Anak",
  "KSM Anastesiologi dan Reanimasi",
  "KSM Kardiologi dan Kedokteran Vaskuler",
  "KSM Forensik dan Medikolegal",
  "KSM Obstetri dan Genikologi",
  "KSM Kedokteran Jiwa",
  "KSM Kesehatan Kulit dan Kelamin",
  "KSM Kesehatan Mata",
  "KSM Orthopedi",
  "KSM Bedah Saraf",
  "KSM Bedah Plastik",
  "KSM Bedah Urologi",
  "KSM Penyakit Pulmonologi dan Kesehatan Respirasi",
  "KSM Neurologi",
  "KSM Bedah Thorax Kardio Vaskuler",
  "KSM Radiologi",
  "KSM Kedokteran Fisik dan Rehabilitasi Medis",
  "KSM Kedokteran Umum",
  "KSM Kedokteran Gigi",
  "KSM Kesehatan THT-BKL",
  "KSM Patologi Klinik",
  "KSM Patologi Anatomi",
  "KSM Mikrobiologi dan Parasitologi Klinik",
  "KSM Farmasi Klinik",
  "KSM Andrologi",
  "KSM Gizi Klinik"
];

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  title?: string;
  subtitle?: string;
  showTotalText?: string;
  allowCustom?: boolean;
}

function SearchableSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = "Pilih...",
  title = "Pilih KSM Pelaksana",
  subtitle = "Cari dan pilih KSM/Instalasi pelaksana",
  showTotalText = "unit",
  allowCustom = false
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <div 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white cursor-pointer hover:border-slate-300 focus:outline-none min-h-[32px] transition-all"
      >
        <span className={value ? "text-slate-900 font-semibold truncate" : "text-slate-400 font-medium"}>
          {value || placeholder}
        </span>
        <svg 
          className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1.5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200" 
            onClick={() => { setIsOpen(false); setSearchTerm(''); }}
          />
          
          {/* Modal Container */}
          <div className="relative bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh] z-10 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-800 text-xs font-sans">{title}</h3>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{subtitle}</p>
              </div>
              <button 
                type="button" 
                onClick={() => { setIsOpen(false); setSearchTerm(''); }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 bg-slate-50 border-b border-slate-100 shrink-0">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Ketik kata kunci pencarian..."
                  className="w-full pl-8.5 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none text-slate-800 placeholder-slate-400 font-sans focus:border-unair-blue transition-all"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                {searchTerm && (
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchTerm('');
                    }} 
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600 text-[9px] bg-slate-200/50 hover:bg-slate-200 px-1 py-0.5 rounded font-bold cursor-pointer shrink-0"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            {/* Options List */}
            <div className="overflow-y-auto flex-1 divide-y divide-slate-50 p-1.5">
              {allowCustom && searchTerm && !options.slice(0).some(o => o.toLowerCase() === searchTerm.toLowerCase()) && (
                <button
                  type="button"
                  onClick={() => {
                    onChange(searchTerm);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="w-full text-left px-3 py-2.5 mb-1 text-xs transition-colors rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold border border-indigo-100 flex items-center justify-between gap-2 shrink-0 cursor-pointer"
                >
                  <span className="truncate">Gunakan Kustom: "{searchTerm}"</span>
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                </button>
              )}
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors rounded-lg hover:bg-slate-50 flex items-center justify-between gap-2.5 ${
                      value === option 
                        ? 'bg-blue-50/70 font-bold text-unair-blue border border-blue-100/30' 
                        : 'text-slate-700 font-medium'
                    }`}
                  >
                    <span className="truncate">{option}</span>
                    {value === option && (
                      <span className="p-0.5 bg-blue-100 text-blue-700 rounded-full shrink-0">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-[11px] text-slate-400 italic">
                  Tidak ada kecocokan pencarian "{searchTerm}"
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-[9px] text-slate-400 italic">Total: {filteredOptions.length} {showTotalText}</span>
              <button
                type="button"
                onClick={() => { setIsOpen(false); setSearchTerm(''); }}
                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md text-[10px] font-bold transition-all cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface PendidikanProps {
  activeSubTab?: 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'J' | 'K' | 'L' | 'M';
  onChangeSubTab?: (tab: 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'J' | 'K' | 'L' | 'M') => void;
}

export function Pendidikan({ activeSubTab, onChangeSubTab }: PendidikanProps = {}) {
  const {
    praPendidikanRecords,
    ipeRecords,
    modulIpeRecords,
    studentInboundRecords,
    kunjunganRecords,
    mouRecords,
    akselerasiRecords,
    prapendidikanKomkordikRecords,
    orientasiKsmRecords,

    addPraPendidikanRecord,
    updatePraPendidikanRecord,
    deletePraPendidikanRecord,
    addIpeRecord,
    updateIpeRecord,
    deleteIpeRecord,
    addModulIpeRecord,
    updateModulIpeRecord,
    deleteModulIpeRecord,
    addStudentInboundRecord,
    updateStudentInboundRecord,
    deleteStudentInboundRecord,
    addKunjunganRecord,
    updateKunjunganRecord,
    deleteKunjunganRecord,
    addMouRecord,
    updateMouRecord,
    deleteMouRecord,
    addAkselerasiRecord,
    updateAkselerasiRecord,
    deleteAkselerasiRecord,
    addPrapendidikanKomkordikRecord,
    updatePrapendidikanKomkordikRecord,
    deletePrapendidikanKomkordikRecord,
    addOrientasiKsmRecord,
    updateOrientasiKsmRecord,
    deleteOrientasiKsmRecord
  } = useSMKS();

  // Selected Active Sub-Menu Tab (B to G, and J to M)
  const [localActiveTab, setLocalActiveTab] = useState<'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'J' | 'K' | 'L' | 'M'>('L');
  const activeTab = activeSubTab || localActiveTab;
  const setActiveTab = onChangeSubTab || setLocalActiveTab;

  const {
    pendapatanPendidikanRecords: pendidikanJRecords,
    addPendapatanPendidikanRecord,
    updatePendapatanPendidikanRecord,
    deletePendapatanPendidikanRecord,
    pajananPesertaRecords: pendidikanKRecords,
    addPajananPesertaRecord,
    updatePajananPesertaRecord,
    deletePajananPesertaRecord,
  } = useSMKS();

  const [dbUnits, setDbUnits] = useState<{ id: string; type: 'Unit' | 'KSM'; name: string }[]>([]);

  React.useEffect(() => {
    let active = true;
    const sortUnitsByImportOrder = (unitsList: { id: string; type: 'Unit' | 'KSM'; name: string }[]) => {
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

    const fetchUnits = async () => {
      try {
        const res = await fetchApi('unit_ksm');
        if (res.status === 'success' && Array.isArray(res.data) && active) {
          const mapped = res.data.map((item: any) => ({
            id: String(item.id),
            type: item.type as 'Unit' | 'KSM',
            name: String(item.nama || item.name || '')
          }));
          setDbUnits(sortUnitsByImportOrder(mapped));
        }
      } catch (err: any) {
        if (err && err.message && err.message.includes("Sesi telah habis")) {
          console.warn("Failed to load units inside Pendidikan: User is offline or session expired");
        } else {
          console.error("Failed to load units inside Pendidikan:", err);
        }
      }
    };
    fetchUnits();
    return () => { active = false; };
  }, []);

  const dynamicKsmPelaksanaOptions = React.useMemo(() => {
    if (dbUnits.length === 0) return KSM_PELAKSANA_OPTIONS;
    return dbUnits.map(u => {
      if (u.type === 'KSM') {
        const prefix = u.name.toLowerCase().startsWith('ksm') 
          ? 'Kepala ' 
          : u.name.toLowerCase().startsWith('kepala') 
            ? '' 
            : 'Kepala KSM ';
        return `${prefix}${u.name}`;
      } else {
        const needsKepala = !u.name.toLowerCase().startsWith('kepala') && 
                            !u.name.toLowerCase().startsWith('manajer') && 
                            u.name.toLowerCase() !== 'komkordik';
        return needsKepala ? `Kepala ${u.name}` : u.name;
      }
    });
  }, [dbUnits]);

  const dynamicKsmOptions = React.useMemo(() => {
    if (dbUnits.length === 0) return KSM_OPTIONS;
    return dbUnits.map(u => u.name);
  }, [dbUnits]);

  const handleExportSubTabExcel = () => {
    if (activeTab === 'B') {
      const formatted = formatIpeExcel(ipeRecords);
      downloadExcelSheet('Kegiatan IPE', formatted, 'Riwayat_Kegiatan_IPE_RSUA');
    } else if (activeTab === 'C') {
      const formatted = formatModulIpeExcel(modulIpeRecords);
      downloadExcelSheet('Buku & Modul IPE', formatted, 'Daftar_Buku_Modul_IPE_RSUA');
    } else if (activeTab === 'D') {
      const formatted = formatStudentInboundExcel(studentInboundRecords);
      downloadExcelSheet('Student Inbound', formatted, 'Daftar_Student_Inbound_RSUA');
    } else if (activeTab === 'E') {
      const formatted = formatKunjunganExcel(kunjunganRecords);
      downloadExcelSheet('Riwayat Kunjungan', formatted, 'Riwayat_Kunjungan_Akademik_RSUA');
    } else if (activeTab === 'F') {
      const formatted = formatMouExcel(mouRecords);
      downloadExcelSheet('Kerjasama MoU', formatted, 'Daftar_MoU_RSUA');
    } else if (activeTab === 'G') {
      const formatted = formatAkselerasiExcel(akselerasiRecords);
      downloadExcelSheet('Target Akselerasi', formatted, 'Analisis_Tren_Akselerasi_Pendidikan_RSUA');
    } else if (activeTab === 'J') {
      const formatted = pendidikanJRecords.map(r => ({
        'Bulan': r.bulan,
        'Tipe Institusi': r.institusiType,
        'Nama Institusi': r.institusiName,
        'Pendapatan Prapendidikan': r.prapendidikanIncome,
        'Pendapatan Praktik': r.praktikIncome,
        'Pendapatan IPE': r.ipeIncome,
        'Total Pendapatan': r.totalIncome
      }));
      downloadExcelSheet('Pendapatan Pendidikan', formatted, 'Laporan_Pendapatan_Pendidikan');
    } else if (activeTab === 'K') {
      const formatted = pendidikanKRecords.map(r => ({
        'Nama Mahasiswa': r.namaMahasiswa,
        'NIM': r.nim,
        'Tipe Institusi': r.institusiType,
        'Fakultas': r.fakultas,
        'Program Studi': r.programStudi,
        'Tanggal Kejadian': r.tanggalKejadian
      }));
      downloadExcelSheet('Data Pajanan', formatted, 'Data_Pajanan_Peserta_Didik');
    }
  };

  const handleExportSubTabPDF = () => {
    if (activeTab === 'B') {
      generateIpePdf(ipeRecords);
    } else if (activeTab === 'C') {
      generateModulIpePdf(modulIpeRecords);
    } else if (activeTab === 'D') {
      generateStudentInboundPdf(studentInboundRecords);
    } else if (activeTab === 'E') {
      generateKunjunganPdf(kunjunganRecords);
    } else if (activeTab === 'F') {
      generateMouPdf(mouRecords);
    } else if (activeTab === 'G') {
      generateAkselerasiPdf(akselerasiRecords);
    } else if (activeTab === 'J') {
      generatePendapatanPdf(pendidikanJRecords);
    } else if (activeTab === 'K') {
      generatePajananPdf(pendidikanKRecords);
    }
  };
  // Deletion modal state for unified submenu removals
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    type: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'J' | 'K' | 'L' | 'M';
    title: string;
    message?: string;
  } | null>(null);

  // Edit target state
  const [editTarget, setEditTarget] = useState<{ id: string; type: string; data: any } | null>(null);

  const confirmDeleteSubtabRecord = () => {
    if (!deleteTarget) return;
    const { id, type } = deleteTarget;
    if (type === 'A') deletePraPendidikanRecord(id);
    else if (type === 'B') deleteIpeRecord(id);
    else if (type === 'C') deleteModulIpeRecord(id);
    else if (type === 'D') deleteStudentInboundRecord(id);
    else if (type === 'E') deleteKunjunganRecord(id);
    else if (type === 'F') deleteMouRecord(id);
    else if (type === 'G') deleteAkselerasiRecord(id);
    else if (type === 'J') {
      deletePendapatanPendidikanRecord(id);
      setDeleteTarget(null);
    }
    else if (type === 'K') {
      deletePajananPesertaRecord(id);
      setDeleteTarget(null);
    }
    else if (type === 'L') deletePrapendidikanKomkordikRecord(id);
    else if (type === 'M') deleteOrientasiKsmRecord(id);
  };

  const [successMsg, setSuccessMsg] = useState('');

  // Selected Row for Akselerasi Chart Visualization
  const [selectedAkselerasiId, setSelectedAkselerasiId] = useState<string>('');
  const [filterGKsm, setFilterGKsm] = useState<string>('SEMUA KSM');
  const [filterGKat, setFilterGKat] = useState<string>('SEMUA KATEGORI');
  const [expandedKsms, setExpandedKsms] = useState<string[]>([]);
  const [gVisType, setGVisType] = useState<'BULANAN' | 'TRIWULAN'>('BULANAN');

  const toggleKsmAccordion = (ksm: string) => {
    setExpandedKsms(prev => 
      prev.includes(ksm) ? prev.filter(k => k !== ksm) : [...prev, ksm]
    );
  };

  // Form Fields - Submenu J (Pendapatan Pendidikan)
  const [jBulan, setJBulan] = useState<string>('Januari');
  const [jTahun, setJTahun] = useState<string>('2026');
  const [jInstitusiType, setJInstitusiType] = useState<'UNAIR' | 'NON UNAIR'>('NON UNAIR');
  const [jInstitusiName, setJInstitusiName] = useState<string>('');
  const [jPrapendidikanIncome, setJPrapendidikanIncome] = useState<string>('');
  const [jPraktikIncome, setJPraktikIncome] = useState<string>('');
  const [jIpeIncome, setJIpeIncome] = useState<string>('');
  const [jBuktiPembayaran, setJBuktiPembayaran] = useState<string>('');
  const [jBuktiPembayaranName, setJBuktiPembayaranName] = useState<string>('');
  const [isUploadingBukti, setIsUploadingBukti] = useState<boolean>(false);
  const [jSearchQuery, setJSearchQuery] = useState<string>('');
  const [jFilterTahun, setJFilterTahun] = useState<string>('SEMUA');
  const [showYearPopover, setShowYearPopover] = useState<boolean>(false);
  const [jSortConfig, setJSortConfig] = useState<{ key: 'prapendidikanIncome' | 'praktikIncome' | 'ipeIncome' | 'totalIncome' | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [jSelectedRecordDetail, setJSelectedRecordDetail] = useState<any | null>(null);
  const [jEditingRecordId, setJEditingRecordId] = useState<string | null>(null);

  const handleSaveJRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const pra = Number(jPrapendidikanIncome) || 0;
    const prak = Number(jPraktikIncome) || 0;
    const ipe = Number(jIpeIncome) || 0;
    const total = pra + prak + ipe;

    if (jEditingRecordId) {
      updatePendapatanPendidikanRecord({
        id: jEditingRecordId,
        bulan: jBulan,
        tahun: jTahun,
        institusiType: jInstitusiType as any,
        institusiName: jInstitusiName || 'Draft/Belum diisi',
        prapendidikanIncome: pra,
        praktikIncome: prak,
        ipeIncome: ipe,
        totalIncome: total,
        buktiPembayaran: jBuktiPembayaran,
        buktiPembayaranName: jBuktiPembayaranName
      });
      setJEditingRecordId(null);
      setSuccessMsg('Pendapatan berhasil diperbarui!');
    } else {
      addPendapatanPendidikanRecord({
        bulan: jBulan,
        tahun: jTahun,
        institusiType: jInstitusiType as any,
        institusiName: jInstitusiName || 'Draft/Belum diisi',
        prapendidikanIncome: pra,
        praktikIncome: prak,
        ipeIncome: ipe,
        totalIncome: total,
        buktiPembayaran: jBuktiPembayaran,
        buktiPembayaranName: jBuktiPembayaranName
      });
      setSuccessMsg('Pendapatan berhasil ditambahkan!');
    }

    // Reset Form
    setJBulan('Januari');
    setJTahun('2026');
    setJInstitusiType('NON UNAIR');
    setJInstitusiName('');
    setJPrapendidikanIncome('');
    setJPraktikIncome('');
    setJIpeIncome('');
    setJBuktiPembayaran('');
    setJBuktiPembayaranName('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Form Fields - Submenu K (Data Pajanan Peserta Didik)
  const [kNama, setKNama] = useState<string>('');
  const [kNim, setKNim] = useState<string>('');
  const [kInstitusiType, setKInstitusiType] = useState<'UNAIR' | 'NON UNAIR'>('UNAIR');
  const [kFakultas, setKFakultas] = useState<string>('Kedokteran');
  const [kProgramStudi, setKProgramStudi] = useState<string>('');
  const [kTanggalKejadian, setKTanggalKejadian] = useState<string>('');
  const [kSearchQuery, setKSearchQuery] = useState<string>('');
  const [kEditingRecordId, setKEditingRecordId] = useState<string | null>(null);
  const [isKProdiModalOpen, setIsKProdiModalOpen] = useState(false);
  const [kProdiSearchFilter, setKProdiSearchFilter] = useState('');
  
  const handleSaveKRecord = (e: React.FormEvent) => {
    e.preventDefault();

    if (kEditingRecordId) {
      updatePajananPesertaRecord({
        id: kEditingRecordId,
        namaMahasiswa: kNama || 'Draft/Belum diisi',
        nim: kNim || 'Draft/Belum diisi',
        institusiType: kInstitusiType,
        fakultas: kFakultas || 'Kedokteran',
        programStudi: kProgramStudi || 'Draft/Belum diisi',
        tanggalKejadian: kTanggalKejadian || '',
        jenisPajanan: '',
        lokasiKejadian: '',
        deskripsiKejadian: '',
        tindakLanjut: '',
        fileLaporan: '',
        tanggalLaporan: ''
      });
      setKEditingRecordId(null);
      setSuccessMsg('Data Pajanan berhasil diperbarui!');
    } else {
      addPajananPesertaRecord({
        namaMahasiswa: kNama || 'Draft/Belum diisi',
        nim: kNim || 'Draft/Belum diisi',
        institusiType: kInstitusiType,
        fakultas: kFakultas || 'Kedokteran',
        programStudi: kProgramStudi || 'Draft/Belum diisi',
        tanggalKejadian: kTanggalKejadian || '',
        jenisPajanan: '',
        lokasiKejadian: '',
        deskripsiKejadian: '',
        tindakLanjut: '',
        fileLaporan: '',
        tanggalLaporan: ''
      });
      setSuccessMsg('Data Pajanan berhasil ditambahkan!');
    }

    setKNama('');
    setKNim('');
    setKInstitusiType('UNAIR');
    setKFakultas('Kedokteran');
    setKProgramStudi('');
    setKTanggalKejadian('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleEditJRecord = (rec: any) => {
    setJEditingRecordId(rec.id);
    setJBulan(rec.bulan);
    setJTahun(rec.tahun || '2026');
    setJInstitusiType(rec.institusiType);
    setJInstitusiName(rec.institusiName);
    setJPrapendidikanIncome(String(rec.prapendidikanIncome || ''));
    setJPraktikIncome(String(rec.praktikIncome || ''));
    setJIpeIncome(String(rec.ipeIncome || ''));
    setJBuktiPembayaran(rec.buktiPembayaran || '');
    setJBuktiPembayaranName(rec.buktiPembayaranName || '');
  };

  const handleCancelEditJ = () => {
    setJEditingRecordId(null);
    setJBulan('Januari');
    setJTahun('2026');
    setJInstitusiType('NON UNAIR');
    setJInstitusiName('');
    setJPrapendidikanIncome('');
    setJPraktikIncome('');
    setJIpeIncome('');
    setJBuktiPembayaran('');
    setJBuktiPembayaranName('');
  };

  const handleEditKRecord = (rec: any) => {
    setKEditingRecordId(rec.id);
    setKNama(rec.namaMahasiswa);
    setKNim(rec.nim);
    setKInstitusiType(rec.institusiType);
    setKFakultas(rec.fakultas);
    setKProgramStudi(rec.programStudi);
    setKTanggalKejadian(rec.tanggalKejadian);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEditK = () => {
    setKNama('');
    setKNim('');
    setKInstitusiType('UNAIR');
    setKFakultas('Kedokteran');
    setKProgramStudi('');
    setKTanggalKejadian('');
    setKEditingRecordId(null);
  };

  // Form Fields - Submenu A
  const [aTanggal, setATanggal] = useState('');
  const [aInstitusiType, setAInstitusiType] = useState<'UNAIR' | 'Non UNAIR' | 'Gabungan'>('UNAIR');
  
  // UNAIR Details
  const [aUnairFakultas, setAUnairFakultas] = useState('Kedokteran');
  const [aUnairProdi, setAUnairProdi] = useState('');
  const [aUnairPeserta, setAUnairPeserta] = useState(0);

  // Non-UNAIR Details
  const [aNonUnairUniversitas, setANonUnairUniversitas] = useState('');
  const [aNonUnairFakultas, setANonUnairFakultas] = useState('');
  const [aNonUnairProdi, setANonUnairProdi] = useState('');
  const [aNonUnairPeserta, setANonUnairPeserta] = useState(0);

  // Form Fields - Submenu B
  const [bTema, setBTema] = useState('');
  const [bPemateriList, setBPemateriList] = useState<string[]>(['']);
  const [bModeratorList, setBModeratorList] = useState<string[]>(['']);
  const [bKsm, setBKsm] = useState('Kepala KSM Ilmu Penyakit Dalam');
  const [bTanggal, setBTanggal] = useState('');
  const [bPesertaUnair, setBPesertaUnair] = useState(0);
  const [bPesertaNonUnair, setBPesertaNonUnair] = useState(0);

  // Form Fields - Submenu C
  const [cJudulBuku, setCJudulBuku] = useState('');
  const [cPenerbit, setCPenerbit] = useState('');
  const [cIsbn, setCIsbn] = useState('');
  const [cTanggalTerbit, setCTanggalTerbit] = useState('');
  const [cCoverBuku, setCCoverBuku] = useState('');
  const [cCoverBukuName, setCCoverBukuName] = useState('');
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Form Fields - Submenu D
  const [dFakultas, setDFakultas] = useState('Kedokteran');
  const [dNamaStudent, setDNamaStudent] = useState('');
  const [dUniversitas, setDUniversitas] = useState('');
  const [dTanggalMasuk, setDTanggalMasuk] = useState('');
  const [dTanggalKeluar, setDTanggalKeluar] = useState('');
  const [dKsmTujuanList, setDKsmTujuanList] = useState<string[]>(['']);
  const [dPembimbing, setDPembimbing] = useState('');

  // Form Fields - Submenu E
  const [eInstitusiType, setEInstitusiType] = useState<'UNAIR' | 'Non UNAIR'>('UNAIR');
  const [eFakultas, setEFakultas] = useState('Kedokteran');
  const [eUniversitasNonUnair, setEUniversitasNonUnair] = useState('');
  const [eProdi, setEProdi] = useState('');
  const [eTujuan, setETujuan] = useState('');
  const [eTanggal, setETanggal] = useState('');
  const [ePemateriList, setEPemateriList] = useState<string[]>(['']);
  const [eJumlahPeserta, setEJumlahPeserta] = useState(0);

  // Form Fields - Submenu F
  const [fNamaInstitusi, setFNamaInstitusi] = useState('');
  const [fJenis, setFJenis] = useState<'Nasional' | 'Internasional'>('Nasional');
  const [fTahun, setFTahun] = useState('2026');
  const [fMasaBerlaku, setFMasaBerlaku] = useState('5 Tahun');

  // Form Fields - Submenu L (Komkordik)
  const [lTanggalPelaksanaan, setLTanggalPelaksanaan] = useState('');
  const [lInstitusiPendidikanList, setLInstitusiPendidikanList] = useState<string[]>(['']);
  const [lTotalPeserta, setLTotalPeserta] = useState(0);
  const [lSearchQuery, setLSearchQuery] = useState('');

  // Form Fields - Submenu M (Orientasi KSM)
  const [mTanggalPelaksanaan, setMTanggalPelaksanaan] = useState('');
  const [mInstitusiList, setMInstitusiList] = useState<string[]>(['']);
  const [mTotalPeserta, setMTotalPeserta] = useState(0);
  const [mBuktiFoto1, setMBuktiFoto1] = useState('');
  const [mBuktiFoto1Name, setMBuktiFoto1Name] = useState('');
  const [mBuktiFoto2, setMBuktiFoto2] = useState('');
  const [mBuktiFoto2Name, setMBuktiFoto2Name] = useState('');
  const [mSearchQuery, setMSearchQuery] = useState('');
  const [isUploadingM1, setIsUploadingM1] = useState(false);
  const [isUploadingM2, setIsUploadingM2] = useState(false);

  // Form Fields - Submenu G
  const AKS_CATEGORIES = [
    'PROFESI DOKTER (DM) NAIK MENJADI 50%',
    'PROGRAM PENDIDIKAN DOKTER SPESIALIS (PPDS 1) NAIK MENJADI 50%',
    'PROGRAM PENDIDIKAN DOKTER SUB SPESIALIS (PPDS 2)'
  ] as const;
  const [gKategoris, setGKategoris] = useState<string[]>([AKS_CATEGORIES[0]]);
  const [gActiveKategori, setGActiveKategori] = useState<string>(AKS_CATEGORIES[0]);
  const [gKsm, setGKsm] = useState('KSM Ilmu Penyakit Dalam');
  const [gValues, setGValues] = useState<Record<string, Record<string, number>>>(
    AKS_CATEGORIES.reduce((acc, cat) => ({
      ...acc,
      [cat]: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agt: 0, sep: 0, okt: 0, nov: 0, des: 0 }
    }), {})
  );

  const updateGValue = (cat: string, month: string, val: number) => {
    setGValues(prev => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        [month]: val
      }
    }));
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Submit Handlers
  const handleSubmitA = (e: React.FormEvent) => {
    e.preventDefault();

    let institusiText = '';
    let totalPes = 0;

    if (aInstitusiType === 'UNAIR') {
      institusiText = aUnairProdi ? `Universitas Airlangga (Fakultas ${aUnairFakultas} - ${aUnairProdi})` : 'Draft / Belum lengkap';
      totalPes = Number(aUnairPeserta) || 0;
    } else if (aInstitusiType === 'Non UNAIR') {
      institusiText = aNonUnairUniversitas ? `${aNonUnairUniversitas} (${aNonUnairFakultas ? `${aNonUnairFakultas} - ` : ''}${aNonUnairProdi})` : 'Draft / Belum lengkap';
      totalPes = Number(aNonUnairPeserta) || 0;
    } else if (aInstitusiType === 'Gabungan') {
      institusiText = `Universitas Airlangga (${aUnairFakultas} - ${aUnairProdi || ''}), ${aNonUnairUniversitas || ''} (${aNonUnairFakultas ? `${aNonUnairFakultas} - ` : ''}${aNonUnairProdi || ''})`;
      totalPes = (Number(aUnairPeserta) || 0) + (Number(aNonUnairPeserta) || 0);
    }

    const payload = {
      tanggalPelaksanaan: aTanggal,
      institusiType: aInstitusiType,
      unairFakultas: aInstitusiType !== 'Non UNAIR' ? aUnairFakultas : undefined,
      unairProdi: aInstitusiType !== 'Non UNAIR' ? aUnairProdi : undefined,
      unairPeserta: aInstitusiType !== 'Non UNAIR' ? Number(aUnairPeserta) : undefined,
      nonUnairUniversitas: aInstitusiType !== 'UNAIR' ? aNonUnairUniversitas : undefined,
      nonUnairFakultas: aInstitusiType !== 'UNAIR' ? aNonUnairFakultas : undefined,
      nonUnairProdi: aInstitusiType !== 'UNAIR' ? aNonUnairProdi : undefined,
      nonUnairPeserta: aInstitusiType !== 'UNAIR' ? Number(aNonUnairPeserta) : undefined,
      institusiPendidikan: institusiText,
      totalPeserta: totalPes
    };

    if (editTarget && editTarget.type === 'A') {
      updatePraPendidikanRecord({ ...payload, id: editTarget.id });
      setEditTarget(null);
      triggerSuccess('Data Pra-pendidikan berhasil diupdate.');
    } else {
      addPraPendidikanRecord(payload);
      triggerSuccess('Data Pra-pendidikan & Orientasi berhasil disimpan.');
    }

    setATanggal('');
    setAUnairProdi('');
    setAUnairPeserta(0);
    setANonUnairUniversitas('');
    setANonUnairFakultas('');
    setANonUnairProdi('');
    setANonUnairPeserta(0);
    setAInstitusiType('UNAIR');
  };

  const handleSubmitB = (e: React.FormEvent) => {
    e.preventDefault();
    const compiledPemateri = bPemateriList.filter(p => p.trim() !== '').join(', ');
    const compiledModerator = bModeratorList.filter(m => m.trim() !== '').join(', ');

    const payload = {
      tema: bTema || 'Belum diisi',
      pemateri: compiledPemateri || 'Belum diisi',
      moderator: compiledModerator || 'Belum diisi',
      ksm: bKsm,
      tanggal: bTanggal || '1970-01-01',
      pesertaUnair: Number(bPesertaUnair) || 0,
      pesertaNonUnair: Number(bPesertaNonUnair) || 0
    };

    if (editTarget && editTarget.type === 'B') {
      updateIpeRecord({ ...payload, id: editTarget.id });
      setEditTarget(null);
      triggerSuccess('Data IPE berhasil diupdate.');
    } else {
      addIpeRecord(payload);
      triggerSuccess('Data IPE berhasil disimpan.');
    }

    setBTema('');
    setBPemateriList(['']);
    setBModeratorList(['']);
    setBPesertaUnair(0);
    setBPesertaNonUnair(0);
  };

  const handleSubmitC = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      judulBuku: cJudulBuku || 'Belum diisi',
      penerbit: cPenerbit || 'Belum diisi',
      isbn: cIsbn || 'Belum diisi',
      tanggalTerbit: cTanggalTerbit || '1970-01-01',
      coverBuku: cCoverBuku,
      coverBukuName: cCoverBukuName
    };

    if (editTarget && editTarget.type === 'C') {
      updateModulIpeRecord({ ...payload, id: editTarget.id });
      setEditTarget(null);
      triggerSuccess('Data Modul IPE berhasil diupdate.');
    } else {
      addModulIpeRecord(payload);
      triggerSuccess('Data Modul IPE berhasil disimpan.');
    }

    setCJudulBuku('');
    setCPenerbit('');
    setCIsbn('');
    setCTanggalTerbit('');
    setCCoverBuku('');
    setCCoverBukuName('');
  };

  const handleSubmitD = (e: React.FormEvent) => {
    e.preventDefault();
    
    const compiledKsmTujuan = dKsmTujuanList.filter(k => k.trim() !== '').join(', ') || 'Umum';

    const payload = {
      fakultasPengirim: dFakultas || 'Belum diisi',
      namaStudent: dNamaStudent || 'Belum diisi',
      universitas: dUniversitas || 'Belum diisi',
      tanggalMasuk: dTanggalMasuk || '1970-01-01',
      tanggalKeluar: dTanggalKeluar || '1970-01-01',
      ksmTujuan: compiledKsmTujuan,
      pembimbing: dPembimbing || 'Belum Ada'
    };

    if (editTarget && editTarget.type === 'D') {
      updateStudentInboundRecord({ ...payload, id: editTarget.id });
      setEditTarget(null);
      triggerSuccess('Data Student Inbound berhasil diupdate.');
    } else {
      addStudentInboundRecord(payload);
      triggerSuccess('Data Student Inbound berhasil disimpan.');
    }

    setDNamaStudent('');
    setDUniversitas('');
    setDKsmTujuanList(['']);
    setDPembimbing('');
  };

  const handleSubmitE = (e: React.FormEvent) => {
    e.preventDefault();
    const compiledPemateri = ePemateriList.filter(p => p.trim() !== '').join(', ');

    const payload = {
      institusiType: eInstitusiType,
      universitas: eInstitusiType === 'UNAIR' ? undefined : (eUniversitasNonUnair || 'Belum diisi'),
      fakultas: eFakultas || 'Belum diisi',
      programStudi: eProdi || 'Belum diisi',
      tujuan: eTujuan || 'Belum diisi',
      tanggalPelaksanaan: eTanggal || '1970-01-01',
      pemateri: compiledPemateri || 'Belum diisi',
      jumlahPeserta: Number(eJumlahPeserta) || 0
    };

    if (editTarget && editTarget.type === 'E') {
      updateKunjunganRecord({ ...payload, id: editTarget.id });
      setEditTarget(null);
      triggerSuccess('Data Kunjungan berhasil diupdate.');
    } else {
      addKunjunganRecord(payload);
      triggerSuccess('Data Kunjungan berhasil disimpan.');
    }

    setEFakultas(eInstitusiType === 'UNAIR' ? 'Kedokteran' : '');
    setEUniversitasNonUnair('');
    setEProdi('');
    setETujuan('');
    setEPemateriList(['']);
    setEJumlahPeserta(0);
  };

  const handleSubmitF = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      namaInstitusi: fNamaInstitusi || 'Belum diisi',
      jenis: fJenis || 'Nasional',
      tahun: fTahun || '2026',
      masaBerlaku: fMasaBerlaku || 'Belum diisi'
    };
    if (editTarget && editTarget.type === 'F') {
      updateMouRecord({ ...payload, id: editTarget.id });
      setEditTarget(null);
      triggerSuccess('Data MOU Kemitraan berhasil diupdate.');
    } else {
      addMouRecord(payload);
      triggerSuccess('Data MOU Kemitraan berhasil disimpan.');
    }
    setFNamaInstitusi('');
  };

  const handleSubmitL = (e: React.FormEvent) => {
    e.preventDefault();
    const joinedInstitusi = lInstitusiPendidikanList.filter(i => i.trim() !== '').join('\n');
    
    const payload = {
      tanggalPelaksanaan: lTanggalPelaksanaan || '1970-01-01',
      institusiPendidikan: joinedInstitusi || 'Belum diisi',
      totalPeserta: Number(lTotalPeserta) || 0
    };

    if (editTarget && editTarget.type === 'L') {
      updatePrapendidikanKomkordikRecord({ ...payload, id: editTarget.id });
      setEditTarget(null);
      triggerSuccess('Data Prapendidikan (Komkordik) berhasil diupdate.');
    } else {
      addPrapendidikanKomkordikRecord(payload);
      triggerSuccess('Data Prapendidikan (Komkordik) berhasil disimpan.');
    }

    setLTanggalPelaksanaan('');
    setLInstitusiPendidikanList(['']);
    setLTotalPeserta(0);
  };
  
  const handleSubmitM = (e: React.FormEvent) => {
    e.preventDefault();
    const joinedInstitusi = mInstitusiList.filter(i => i.trim() !== '').join('\n');
    
    const payload = {
      tanggalPelaksanaan: mTanggalPelaksanaan || '1970-01-01',
      institusiPendidikan: joinedInstitusi || 'Belum diisi',
      totalPeserta: Number(mTotalPeserta) || 0,
      buktiFoto1: mBuktiFoto1,
      buktiFoto1Name: mBuktiFoto1Name,
      buktiFoto2: mBuktiFoto2,
      buktiFoto2Name: mBuktiFoto2Name
    };

    if (editTarget && editTarget.type === 'M') {
      updateOrientasiKsmRecord({ ...payload, id: editTarget.id });
      setEditTarget(null);
      triggerSuccess('Data Orientasi KSM / Instalasi berhasil diupdate.');
    } else {
      addOrientasiKsmRecord(payload);
      triggerSuccess('Data Orientasi KSM / Instalasi berhasil disimpan.');
    }

    setMTanggalPelaksanaan('');
    setMInstitusiList(['']);
    setMTotalPeserta(0);
    setMBuktiFoto1('');
    setMBuktiFoto1Name('');
    setMBuktiFoto2('');
    setMBuktiFoto2Name('');
  };

  const handleSubmitG = (e: React.FormEvent) => {
    e.preventDefault();
    if (gKategoris.length === 0) return;

    if (editTarget && editTarget.type === 'G') {
      // For Edit, we handle all checked categories
      gKategoris.forEach(kat => {
        const vals = gValues[kat];
        // Check if record for this KSM + Category already exists
        const existingRec = akselerasiRecords.find(r => r.ksm === gKsm && r.kategori === kat);
        
        if (existingRec) {
          updateAkselerasiRecord({ 
            ...vals, 
            kategori: kat, 
            ksm: gKsm,
            id: existingRec.id 
          });
        } else {
          addAkselerasiRecord({
            ...vals,
            kategori: kat,
            ksm: gKsm
          });
        }
      });
      setEditTarget(null);
      triggerSuccess('Data Kinerja Akselerasi Pendidikan berhasil diupdate.');
    } else {
      gKategoris.forEach(kat => {
        const vals = gValues[kat];
        addAkselerasiRecord({ 
          ...vals,
          kategori: kat,
          ksm: gKsm
        });
      });
      triggerSuccess('Data Kinerja Akselesasi Pendidikan berhasil disimpan.');
    }

    setGValues(
      AKS_CATEGORIES.reduce((acc, cat) => ({
        ...acc,
        [cat]: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agt: 0, sep: 0, okt: 0, nov: 0, des: 0 }
      }), {})
    );
    setGKategoris([AKS_CATEGORIES[0]]);
    setGActiveKategori(AKS_CATEGORIES[0]);
  };

  // Get active Akselerasi data for line chart
  const getSelectedAkselerasiChart = () => {
    let filtered = akselerasiRecords;
    
    if (filterGKsm !== 'SEMUA KSM') {
      filtered = filtered.filter(r => r.ksm === filterGKsm);
    }
    if (filterGKat !== 'SEMUA KATEGORI') {
      filtered = filtered.filter(r => r.kategori === filterGKat);
    }

    if (filtered.length === 0) return [];

    if (gVisType === 'TRIWULAN') {
      const quarters = [
        { name: 'TW 1', months: ['jan', 'feb', 'mar'] },
        { name: 'TW 2', months: ['apr', 'mei', 'jun'] },
        { name: 'TW 3', months: ['jul', 'agt', 'sep'] },
        { name: 'TW 4', months: ['okt', 'nov', 'des'] }
      ];
      return quarters.map(q => {
        const total = filtered.reduce((sum, r) => {
          const qSum = q.months.reduce((mSum, m) => mSum + (r[m] || 0), 0);
          return sum + qSum;
        }, 0);
        return { name: q.name, jumlah: total };
      });
    }

    // Aggregate data if multiple records match the filter
    const months = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agt', 'sep', 'okt', 'nov', 'des'];
    return months.map(m => {
      const total = filtered.reduce((sum, r) => sum + (r[m] || 0), 0);
      return {
        name: m.charAt(0).toUpperCase() + m.slice(1),
        jumlah: total
      };
    });
  };

  const selectedRecordName = () => {
    if (filterGKsm === 'SEMUA KSM' && filterGKat === 'SEMUA KATEGORI') return 'Seluruh Data Akselerasi';
    if (filterGKsm === 'SEMUA KSM') return `Kategori: ${filterGKat}`;
    if (filterGKat === 'SEMUA KATEGORI') return `KSM: ${filterGKsm}`;
    return `${filterGKat} - ${filterGKsm}`;
  };

  const handleCloseEdit = () => {
    setEditTarget(null);
    // Reset forms
    if (activeTab === 'B') {
      setBTema('');
      setBPemateriList(['']);
      setBModeratorList(['']);
      setBPesertaUnair(0);
      setBPesertaNonUnair(0);
    } else if (activeTab === 'C') {
      setCJudulBuku('');
      setCPenerbit('');
      setCIsbn('');
      setCTanggalTerbit('');
      setCCoverBuku('');
      setCCoverBukuName('');
    } else if (activeTab === 'D') {
      setDNamaStudent('');
      setDUniversitas('');
      setDKsmTujuanList(['']);
      setDPembimbing('');
    } else if (activeTab === 'E') {
      setEFakultas(eInstitusiType === 'UNAIR' ? 'Kedokteran' : '');
      setEUniversitasNonUnair('');
      setEProdi('');
      setETujuan('');
      setEPemateriList(['']);
      setEJumlahPeserta(0);
    } else if (activeTab === 'F') {
      setFNamaInstitusi('');
    } else if (activeTab === 'G') {
      setGValues(
        AKS_CATEGORIES.reduce((acc, cat) => ({
          ...acc,
          [cat]: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agt: 0, sep: 0, okt: 0, nov: 0, des: 0 }
        }), {})
      );
      setGKategoris([AKS_CATEGORIES[0]]);
      setGActiveKategori(AKS_CATEGORIES[0]);
    } else if (activeTab === 'L') {
      setLTanggalPelaksanaan('');
      setLInstitusiPendidikanList(['']);
      setLTotalPeserta(0);
    } else if (activeTab === 'M') {
      setMTanggalPelaksanaan('');
      setMInstitusiList(['']);
      setMTotalPeserta(0);
      setMBuktiFoto1('');
      setMBuktiFoto2('');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <AnimatePresence>
        {editTarget && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={handleCloseEdit}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] z-10"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Edit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Edit Data {
                      editTarget.type === 'B' ? 'IPE' :
                      editTarget.type === 'C' ? 'Modul IPE' :
                      editTarget.type === 'D' ? 'Student Inbound' :
                      editTarget.type === 'E' ? 'Kunjungan' :
                      editTarget.type === 'F' ? 'MoU' : 
                      editTarget.type === 'L' ? 'Prapendidikan (Komkordik)' : 
                      editTarget.type === 'M' ? 'Orientasi KSM / Instalasi' : 'Akselerasi'
                    }</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">ID: {editTarget.id}</p>
                  </div>
                </div>
                <button 
                  onClick={handleCloseEdit}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 scroll-smooth">
                {editTarget.type === 'B' && (
                  <form noValidate onSubmit={handleSubmitB} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tema IPE</label>
                      <textarea required rows={2} value={bTema || ''} onChange={(e) => setBTema(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue resize-none" />
                    </div>
                    {/* Basic fields for brevity in this turn, same pattern */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tanggal</label>
                      <input type="date" required value={bTanggal || ''} onChange={(e) => setBTanggal(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Peserta UNAIR</label>
                        <input type="number" required value={bPesertaUnair} onChange={(e) => setBPesertaUnair(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Peserta Non-UNAIR</label>
                        <input type="number" required value={bPesertaNonUnair} onChange={(e) => setBPesertaNonUnair(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue" />
                      </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                      <button type="button" onClick={handleCloseEdit} className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 cursor-pointer">Batal</button>
                      <button type="submit" className="flex-2 py-2.5 bg-unair-blue text-white font-bold rounded-xl shadow-lg hover:bg-unair-blue-light cursor-pointer">Update Kegiatan IPE</button>
                    </div>
                  </form>
                )}

                {editTarget.type === 'C' && (
                  <form noValidate onSubmit={handleSubmitC} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Judul Buku</label>
                      <textarea required rows={2} value={cJudulBuku || ''} onChange={(e) => setCJudulBuku(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Penerbit</label>
                      <input type="text" required value={cPenerbit || ''} onChange={(e) => setCPenerbit(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ISBN</label>
                      <input type="text" required value={cIsbn || ''} onChange={(e) => setCIsbn(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tanggal Terbit</label>
                      <input type="date" required value={cTanggalTerbit || ''} onChange={(e) => setCTanggalTerbit(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue" />
                    </div>

                    {/* Cover Buku Upload in Edit Modal */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Update Cover Buku</label>
                      <div 
                        onClick={() => !isUploadingCover && document.getElementById('cover_buku_input_edit')?.click()}
                        className={`border-2 border-dashed border-slate-200 hover:border-unair-blue rounded-xl p-4 text-center cursor-pointer transition-all hover:bg-slate-50 ${isUploadingCover ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        <input 
                          id="cover_buku_input_edit"
                          type="file" 
                          disabled={isUploadingCover}
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setIsUploadingCover(true);
                            const reader = new FileReader();
                            reader.onload = async () => {
                              try {
                                const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                setCCoverBuku(driveUrl);
                                setCCoverBukuName(file.name);
                              } catch (err) {
                                alert("Gagal mengunggah ke Google Drive: " + (err instanceof Error ? err.message : String(err)));
                                setCCoverBuku(reader.result as string);
                                setCCoverBukuName(file.name);
                              } finally {
                                setIsUploadingCover(false);
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="hidden"
                        />
                        {isUploadingCover ? (
                          <div className="flex flex-col items-center py-2">
                            <div className="w-5 h-5 border-2 border-unair-blue border-t-transparent rounded-full animate-spin" />
                            <p className="text-[10px] font-bold text-unair-blue mt-2 animate-pulse">Mengunggah...</p>
                          </div>
                        ) : cCoverBuku ? (
                          <div className="flex flex-col items-center">
                            {cCoverBuku.startsWith('http') ? (
                              <img src={cCoverBuku} alt="Preview" className="w-16 h-20 object-cover rounded shadow-md mb-2" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-16 h-20 bg-slate-100 rounded flex items-center justify-center mb-2">
                                <BookOpen className="w-8 h-8 text-slate-400" />
                              </div>
                            )}
                            <p className="text-[10px] font-bold text-slate-700 truncate max-w-[150px]">{cCoverBukuName}</p>
                            <div className="flex gap-2 mt-2 justify-center">
                              <button 
                                type="button"
                                onClick={() => window.open(cCoverBuku, '_blank', 'noopener,noreferrer')}
                                className="flex items-center gap-1 text-[9px] text-emerald-600 hover:text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded"
                              >
                                <Eye className="w-3 h-3" /> Lihat
                              </button>
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCCoverBuku('');
                                  setCCoverBukuName('');
                                }}
                                className="text-[9px] text-rose-500 hover:text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded"
                              >
                                Ganti
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="py-2">
                            <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                            <p className="text-xs font-bold text-slate-500">Pilih Cover Buku</p>
                            <p className="text-[10px] text-slate-400">Dimensi Rekomendasi 2:3 (JPG/PNG)</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button type="button" onClick={handleCloseEdit} className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 cursor-pointer">Batal</button>
                      <button type="submit" className="flex-2 py-2.5 bg-unair-blue text-white font-bold rounded-xl shadow-lg hover:bg-unair-blue-light cursor-pointer">Update Modul IPE</button>
                    </div>
                  </form>
                )}

                {editTarget.type === 'D' && (
                  <form noValidate onSubmit={handleSubmitD} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Student</label>
                      <input type="text" required value={dNamaStudent} onChange={(e) => setDNamaStudent(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Universitas Asal</label>
                      <input type="text" required value={dUniversitas} onChange={(e) => setDUniversitas(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tgl Masuk</label>
                        <input type="date" required value={dTanggalMasuk} onChange={(e) => setDTanggalMasuk(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tgl Keluar</label>
                        <input type="date" required value={dTanggalKeluar} onChange={(e) => setDTanggalKeluar(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue" />
                      </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                      <button type="button" onClick={handleCloseEdit} className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 cursor-pointer">Batal</button>
                      <button type="submit" className="flex-2 py-2.5 bg-unair-blue text-white font-bold rounded-xl shadow-lg hover:bg-unair-blue-light cursor-pointer">Update Student Inbound</button>
                    </div>
                  </form>
                )}

                {editTarget.type === 'E' && (
                  <form noValidate onSubmit={handleSubmitE} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tujuan Kunjungan</label>
                      <textarea required rows={2} value={eTujuan} onChange={(e) => setETujuan(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fakultas / Prodi</label>
                      <input type="text" required value={eProdi} onChange={(e) => setEProdi(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tanggal</label>
                        <input type="date" required value={eTanggal} onChange={(e) => setETanggal(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jumlah Peserta</label>
                        <input type="number" required value={eJumlahPeserta} onChange={(e) => setEJumlahPeserta(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue" />
                      </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                      <button type="button" onClick={handleCloseEdit} className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 cursor-pointer">Batal</button>
                      <button type="submit" className="flex-2 py-2.5 bg-unair-blue text-white font-bold rounded-xl shadow-lg hover:bg-unair-blue-light cursor-pointer">Update Kunjungan</button>
                    </div>
                  </form>
                )}

                {editTarget.type === 'F' && (
                  <form noValidate onSubmit={handleSubmitF} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Institusi</label>
                      <input type="text" required value={fNamaInstitusi} onChange={(e) => setFNamaInstitusi(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tahun</label>
                        <input type="text" required value={fTahun} onChange={(e) => setFTahun(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue font-mono" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Masa Berlaku</label>
                        <input type="text" required value={fMasaBerlaku} onChange={(e) => setFMasaBerlaku(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue" />
                      </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                      <button type="button" onClick={handleCloseEdit} className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 cursor-pointer">Batal</button>
                      <button type="submit" className="flex-2 py-2.5 bg-unair-blue text-white font-bold rounded-xl shadow-lg hover:bg-unair-blue-light cursor-pointer">Update MoU</button>
                    </div>
                  </form>
                )}

                {editTarget.type === 'L' && (
                  <form noValidate onSubmit={handleSubmitL} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Institusi Pendidikan</label>
                      {lInstitusiPendidikanList.map((inst, index) => (
                        <div key={index} className="flex gap-2">
                          <input 
                            required 
                            type="text"
                            value={inst} 
                            onChange={(e) => {
                              const newList = [...lInstitusiPendidikanList];
                              newList[index] = e.target.value;
                              setLInstitusiPendidikanList(newList);
                            }} 
                            placeholder="Contoh: FK UNAIR" 
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue font-medium" 
                          />
                          {lInstitusiPendidikanList.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => setLInstitusiPendidikanList(lInstitusiPendidikanList.filter((_, i) => i !== index))}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={() => setLInstitusiPendidikanList([...lInstitusiPendidikanList, ''])}
                        className="w-full py-1.5 border border-dashed border-slate-300 rounded-lg text-[10px] font-black uppercase text-slate-500 hover:border-unair-blue hover:text-unair-blue transition-all flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3 h-3" /> Tambah Institusi
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tanggal Pelaksanaan</label>
                        <input type="date" required value={lTanggalPelaksanaan} onChange={(e) => setLTanggalPelaksanaan(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Peserta</label>
                        <input type="number" required value={lTotalPeserta} onChange={(e) => setLTotalPeserta(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue font-bold" />
                      </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                      <button type="button" onClick={handleCloseEdit} className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 cursor-pointer">Batal</button>
                      <button type="submit" className="flex-2 py-2.5 bg-unair-blue text-white font-bold rounded-xl shadow-lg hover:bg-unair-blue-light cursor-pointer">Update Data Komkordik</button>
                    </div>
                  </form>
                )}
                
                {editTarget.type === 'M' && (
                  <form noValidate onSubmit={handleSubmitM} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase">KSM / Instalasi (Bisa Lebih dari Satu)</label>
                      {mInstitusiList.map((inst, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <div className="flex-1">
                            <SearchableSelect
                              options={dynamicKsmOptions}
                              value={inst}
                              onChange={(val) => {
                                const newList = [...mInstitusiList];
                                newList[index] = val;
                                setMInstitusiList(newList);
                              }}
                              placeholder="Pilih KSM/Instalasi..."
                              title="Pilih KSM / Instalasi"
                              subtitle="Pilih KSM/Instalasi orientasi dari data admin"
                              showTotalText="ksm/unit"
                              allowCustom={true}
                            />
                          </div>
                          {mInstitusiList.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => setMInstitusiList(mInstitusiList.filter((_, i) => i !== index))}
                              className="p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700 rounded-lg transition-colors border border-rose-100 shrink-0 self-center"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={() => setMInstitusiList([...mInstitusiList, ''])}
                        className="w-full py-1.5 border border-dashed border-slate-300 rounded-lg text-[10px] font-black uppercase text-slate-500 hover:border-unair-blue hover:text-unair-blue transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Tambah KSM/Instalasi
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tanggal Pelaksanaan</label>
                        <input type="date" required value={mTanggalPelaksanaan} onChange={(e) => setMTanggalPelaksanaan(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Peserta</label>
                        <input type="number" required value={mTotalPeserta} onChange={(e) => setMTotalPeserta(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-unair-blue font-bold" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Photo 1 Upload */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bukti 1</label>
                        <div 
                          onClick={() => !isUploadingM1 && document.getElementById('bukti_m1_edit')?.click()}
                          className={`border border-dashed border-slate-200 rounded-lg p-2 text-center cursor-pointer hover:bg-slate-50 ${isUploadingM1 ? 'opacity-50' : ''}`}
                        >
                          <input id="bukti_m1_edit" type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setIsUploadingM1(true);
                            const reader = new FileReader();
                            reader.onload = async () => {
                              try {
                                const url = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                setMBuktiFoto1(url);
                                setMBuktiFoto1Name(file.name);
                              } catch (err) {
                                setMBuktiFoto1(reader.result as string);
                                setMBuktiFoto1Name(file.name);
                              } finally { setIsUploadingM1(false); }
                            };
                            reader.readAsDataURL(file);
                          }} />
                          {mBuktiFoto1 ? (
                            <img src={mBuktiFoto1} alt="Preview" className="w-full h-16 object-cover rounded shadow-sm" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="py-2 text-[10px] text-slate-400 font-bold uppercase">Foto 1</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Photo 2 Upload */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bukti 2</label>
                        <div 
                          onClick={() => !isUploadingM2 && document.getElementById('bukti_m2_edit')?.click()}
                          className={`border border-dashed border-slate-200 rounded-lg p-2 text-center cursor-pointer hover:bg-slate-50 ${isUploadingM2 ? 'opacity-50' : ''}`}
                        >
                          <input id="bukti_m2_edit" type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setIsUploadingM2(true);
                            const reader = new FileReader();
                            reader.onload = async () => {
                              try {
                                const url = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                setMBuktiFoto2(url);
                                setMBuktiFoto2Name(file.name);
                              } catch (err) {
                                setMBuktiFoto2(reader.result as string);
                                setMBuktiFoto2Name(file.name);
                              } finally { setIsUploadingM2(false); }
                            };
                            reader.readAsDataURL(file);
                          }} />
                          {mBuktiFoto2 ? (
                            <img src={mBuktiFoto2} alt="Preview" className="w-full h-16 object-cover rounded shadow-sm" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="py-2 text-[10px] text-slate-400 font-bold uppercase">Foto 2</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button type="button" onClick={handleCloseEdit} className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 cursor-pointer">Batal</button>
                      <button type="submit" className="flex-2 py-2.5 bg-unair-blue text-white font-bold rounded-xl shadow-lg hover:bg-unair-blue-light cursor-pointer">Update Data Orientasi</button>
                    </div>
                  </form>
                )}

                {editTarget.type === 'G' && (
                  <form noValidate onSubmit={handleSubmitG} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">KSM Pendidikan</label>
                      <p className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700">{gKsm}</p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pilih Kategori untuk Diisi (Atur Checklist)</label>
                      <div className="grid grid-cols-1 gap-2">
                        {AKS_CATEGORIES.map((kat, idx) => {
                          const isSelected = gKategoris.includes(kat);
                          const isActive = gActiveKategori === kat;
                          return (
                            <div 
                              key={kat}
                              onClick={() => setGActiveKategori(kat)}
                              className={`px-3 py-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between group ${
                                isActive 
                                  ? 'bg-blue-50 border-unair-blue ring-1 ring-unair-blue shadow-sm' 
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isSelected) {
                                      if (gKategoris.length > 1) {
                                        setGKategoris(gKategoris.filter(k => k !== kat));
                                      }
                                    } else {
                                      setGKategoris([...gKategoris, kat]);
                                    }
                                  }}
                                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shadow-sm ${isSelected ? 'bg-unair-blue border-unair-blue' : 'bg-slate-50 border-slate-300 hover:border-unair-blue'}`}
                                >
                                  {isSelected && <Check className="w-3 h-3 text-white stroke-[4]" />}
                                </button>
                                <span className={`text-[10px] font-bold ${isActive ? 'text-unair-blue' : 'text-slate-600'}`}>
                                  {idx + 1}. {kat.split(')')[0].trim()})
                                </span>
                              </div>
                              {isActive && (
                                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-unair-blue text-white rounded text-[8px] font-bold">
                                  Aktif
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                      <div className="flex items-center justify-between mb-2">
                        <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          Target Per-Bulan
                        </span>
                        <div className="text-[8px] text-unair-blue bg-blue-100/50 px-1.5 py-0.5 rounded font-bold">
                          {gActiveKategori.split('(')[0].trim()}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agt', 'sep', 'okt', 'nov', 'des'].map((m) => (
                          <div key={m}>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase text-center mb-0.5">{m}</label>
                            <input 
                              type="number" 
                              required 
                              min={0}
                              value={gValues[gActiveKategori][m]}
                              onChange={(e) => updateGValue(gActiveKategori, m, Number(e.target.value))}
                              className="w-full text-center py-1 bg-white border border-slate-200 text-xs rounded font-bold font-mono text-slate-800 focus:ring-1 focus:ring-unair-blue outline-none transition-all" 
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button type="button" onClick={handleCloseEdit} className="flex-1 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 cursor-pointer">Batal</button>
                      <button type="submit" className="flex-2 py-2 bg-unair-blue text-white font-bold rounded-lg shadow-lg hover:bg-unair-blue-light cursor-pointer">Perbarui Seluruh Target</button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Pendidikan</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportSubTabExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg transition-all border border-emerald-100 cursor-pointer"
            title="Ekspor data subtab yang aktif ke format Excel (.xlsx)"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            Ekspor Excel
          </button>
          <button
            onClick={handleExportSubTabPDF}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-lg transition-all border border-red-100 cursor-pointer"
            title="Ekspor data subtab yang aktif ke format PDF (.pdf) tanpa kop surat dan tanda tangan"
          >
            <FileText className="w-4 h-4 text-red-600" />
            Ekspor PDF
          </button>
          

        </div>
      </div>

      <div className="space-y-8">
        
        {/* Content Panel */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="space-y-8"
            >
          {/* Submenu B: INTERPROFESSIONAL EDUCATION (IPE) */}
          {activeTab === 'B' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Interprofessional Education (IPE)</h3>
                </div>

                {ipeRecords.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                    <p className="text-sm font-medium">Belum ada data IPE terdaftar.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                        <tr>
                          <th className="px-4 py-3 text-left">Tema IPE</th>
                          <th className="px-4 py-3 text-left">Pemateri</th>
                          <th className="px-4 py-3 text-left">Moderator</th>
                          <th className="px-4 py-3 text-left">KSM</th>
                          <th className="px-4 py-3 text-left">Tanggal</th>
                          <th className="px-4 py-3 text-center">Unair / Non</th>
                          <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {ipeRecords.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 text-xs">
                            <td className="px-4 py-3.5 font-medium text-slate-900 max-w-xs" title={item.tema}>
                              <div className="font-semibold font-sans text-sm text-slate-800 leading-normal">{item.tema}</div>
                            </td>
                            <td className="px-4 py-3 text-slate-700 min-w-[120px]">
                              <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">{item.pemateri}</span>
                            </td>
                            <td className="px-4 py-3 text-slate-700 min-w-[120px]">
                              <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">{item.moderator}</span>
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-medium">
                              {item.ksm}
                            </td>
                            <td className="px-4 py-3 text-slate-500 font-mono">
                              {item.tanggal}
                            </td>
                            <td className="px-4 py-3 text-center font-semibold text-slate-900">
                              <div>Unair: <span className="text-unair-blue">{item.pesertaUnair}</span></div>
                              <div>Non: <span className="text-amber-600">{item.pesertaNonUnair}</span></div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => {
                                setEditTarget({ id: item.id, type: 'B', data: item });
                                setBTema(item.tema);
                                setBPemateriList(item.pemateri.split(', '));
                                setBModeratorList(item.moderator.split(', '));
                                setBKsm(item.ksm);
                                setBTanggal(item.tanggal);
                                setBPesertaUnair(item.pesertaUnair);
                                setBPesertaNonUnair(item.pesertaNonUnair);
                              }} className="text-blue-500 hover:text-blue-700 p-1 rounded-md hover:bg-blue-50 mr-1">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => setDeleteTarget({ id: item.id, type: 'B', title: 'Hapus Kegiatan IPE', message: 'Apakah Anda yakin ingin menghapus data kegiatan IPE ini?' })} className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Form Input Tab B */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                <div className="flex items-center space-x-2 text-unair-blue mb-4">
                  <FolderPlus className="w-5 h-5 text-unair-gold" />
                  <h3 className="font-bold text-slate-900">Input Kegiatan IPE</h3>
                </div>
                <form noValidate onSubmit={handleSubmitB} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Tema IPE</label>
                    <textarea 
                      required 
                      rows={2} 
                      value={bTema || ''}
                      onChange={(e) => setBTema(e.target.value)}
                      placeholder="Tema / Topik Kolaborasi Kejaringan..."
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-unair-blue resize-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Nama Pemateri</label>
                    <div className="space-y-1.5">
                      {bPemateriList.map((pemateri, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input 
                            type="text" 
                            required 
                            value={pemateri}
                            onChange={(e) => {
                              const newList = [...bPemateriList];
                              newList[idx] = e.target.value;
                              setBPemateriList(newList);
                            }}
                            placeholder={`Nama Pemateri ${idx + 1}...`}
                            className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-unair-blue" 
                          />
                          {bPemateriList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newList = bPemateriList.filter((_, i) => i !== idx);
                                setBPemateriList(newList);
                              }}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setBPemateriList([...bPemateriList, ''])}
                      className="inline-flex items-center gap-1 text-[10px] text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      Tambah Pemateri
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Nama Moderator</label>
                    <div className="space-y-1.5">
                      {bModeratorList.map((moderator, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input 
                            type="text" 
                            required 
                            value={moderator}
                            onChange={(e) => {
                              const newList = [...bModeratorList];
                              newList[idx] = e.target.value;
                              setBModeratorList(newList);
                            }}
                            placeholder={`Nama Moderator ${idx + 1}...`}
                            className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-unair-blue" 
                          />
                          {bModeratorList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newList = bModeratorList.filter((_, i) => i !== idx);
                                setBModeratorList(newList);
                              }}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setBModeratorList([...bModeratorList, ''])}
                      className="inline-flex items-center gap-1 text-[10px] text-indigo-750 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      Tambah Moderator
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">KSM Pelaksana</label>
                      <SearchableSelect
                        options={dynamicKsmPelaksanaOptions}
                        value={bKsm}
                        onChange={setBKsm}
                        placeholder="Pilih KSM Pelaksana..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Tanggal</label>
                      <input 
                        type="date" 
                        required 
                        value={bTanggal}
                        onChange={(e) => setBTanggal(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Peserta Unair</label>
                      <input 
                        type="number" 
                        required 
                        min={0}
                        value={bPesertaUnair || ''}
                        onChange={(e) => setBPesertaUnair(Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Peserta Non-Unair</label>
                      <input 
                        type="number" 
                        required 
                        min={0}
                        value={bPesertaNonUnair || ''}
                        onChange={(e) => setBPesertaNonUnair(Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none" 
                      />
                    </div>
                  </div>

                  {successMsg && <p className="text-emerald-600 text-xs font-semibold">{successMsg}</p>}
                  <button type="submit" className="w-full py-2 bg-unair-blue hover:bg-unair-blue-light text-white font-bold text-xs rounded-lg transition-colors cursor-pointer">
                    Simpan Kegiatan IPE
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Submenu C: MODUL IPE */}
          {activeTab === 'C' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Penerbitan Modul & Buku IPE</h3>
                </div>

                {modulIpeRecords.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                    <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                    <p className="text-sm font-medium">Belum ada modul terbit.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                        <tr>
                          <th className="px-4 py-3 text-left">Judul Buku / Modul</th>
                          <th className="px-4 py-3 text-left">Penerbit</th>
                          <th className="px-4 py-3 text-left">Nomor ISBN</th>
                          <th className="px-4 py-3 text-left">Tanggal Terbit</th>
                          <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {modulIpeRecords.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center space-x-3">
                                {item.coverBuku ? (
                                  <div 
                                    onClick={() => window.open(item.coverBuku, '_blank', 'noopener,noreferrer')}
                                    className="w-10 h-14 rounded shadow-sm overflow-hidden flex-shrink-0 bg-slate-100 hover:scale-110 transition-transform cursor-zoom-in relative group"
                                  >
                                    <img src={item.coverBuku} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                      <Eye className="w-4 h-4 text-white drop-shadow-md" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-10 h-14 rounded bg-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-200">
                                    <BookOpen className="w-5 h-5 text-slate-300" />
                                  </div>
                                )}
                                <span className="font-semibold text-slate-800 leading-tight">{item.judulBuku}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-slate-600 italic font-medium">{item.penerbit}</td>
                            <td className="px-4 py-3.5 text-slate-600 font-mono text-xs">{item.isbn}</td>
                            <td className="px-4 py-3.5 text-slate-500 font-mono text-xs">{item.tanggalTerbit}</td>
                            <td className="px-4 py-3.5 text-right text-nowrap">
                              <button 
                                onClick={() => item.coverBuku && window.open(item.coverBuku, '_blank', 'noopener,noreferrer')}
                                className={`${item.coverBuku ? 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50' : 'text-slate-200 cursor-not-allowed'} p-1 rounded-md mr-1`}
                                title={item.coverBuku ? "Pratinjau File" : "Tidak ada file"}
                                disabled={!item.coverBuku}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button onClick={() => {
                                setEditTarget({ id: item.id, type: 'C', data: item });
                                setCJudulBuku(item.judulBuku);
                                setCPenerbit(item.penerbit);
                                setCIsbn(item.isbn);
                                setCTanggalTerbit(item.tanggalTerbit);
                                setCCoverBuku(item.coverBuku || '');
                                setCCoverBukuName(item.coverBukuName || '');
                              }} className="text-blue-500 hover:text-blue-700 p-1 rounded-md hover:bg-blue-50 mr-1">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => setDeleteTarget({ id: item.id, type: 'C', title: 'Hapus Buku / Modul IPE', message: 'Apakah Anda yakin ingin menghapus modul IPE ini?' })} className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Form Input Tab C */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                <div className="flex items-center space-x-2 text-unair-blue mb-4">
                  <FolderPlus className="w-5 h-5 text-unair-gold" />
                  <h3 className="font-bold text-slate-900">Arsip Buku Baru</h3>
                </div>
                <form noValidate onSubmit={handleSubmitC} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Judul Buku / Modul</label>
                    <textarea 
                      required 
                      rows={2}
                      value={cJudulBuku || ''}
                      onChange={(e) => setCJudulBuku(e.target.value)}
                      placeholder="Contoh: Modul Klinis Asuhan Anak Komparatif..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-unair-blue resize-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Penerbit</label>
                    <input 
                      type="text" 
                      required 
                      value={cPenerbit || ''}
                      onChange={(e) => setCPenerbit(e.target.value)}
                      placeholder="Contoh: Airlangga University Press"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-unair-blue" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nomor ISBN</label>
                    <input 
                      type="text" 
                      required 
                      value={cIsbn || ''}
                      onChange={(e) => setCIsbn(e.target.value)}
                      placeholder="Contoh: 978-602..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-unair-blue font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tanggal & Tahun Terbit</label>
                    <input 
                      type="date" 
                      required 
                      value={cTanggalTerbit || ''}
                      onChange={(e) => setCTanggalTerbit(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-unair-blue" 
                    />
                  </div>

                  {/* Upload Cover Buku in Main Form */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Upload Cover Buku</label>
                    <div 
                      onClick={() => !isUploadingCover && document.getElementById('cover_buku_input_main')?.click()}
                      className={`border-2 border-dashed border-slate-200 hover:border-unair-blue rounded-xl p-5 text-center cursor-pointer transition-all hover:bg-slate-50 bg-slate-50/20 ${isUploadingCover ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <input 
                        id="cover_buku_input_main"
                        type="file" 
                        disabled={isUploadingCover}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploadingCover(true);
                          const reader = new FileReader();
                          reader.onload = async () => {
                            try {
                              const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                              setCCoverBuku(driveUrl);
                              setCCoverBukuName(file.name);
                            } catch (err) {
                              alert("Gagal mengunggah ke Google Drive: " + (err instanceof Error ? err.message : String(err)));
                              setCCoverBuku(reader.result as string);
                              setCCoverBukuName(file.name);
                            } finally {
                              setIsUploadingCover(false);
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="hidden"
                      />
                      {isUploadingCover ? (
                        <div className="flex flex-col items-center py-4">
                          <div className="w-6 h-6 border-2 border-unair-blue border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs font-bold text-unair-blue mt-3 animate-pulse">Sedang mengunggah berkas...</p>
                        </div>
                      ) : cCoverBuku ? (
                        <div className="flex flex-col items-center py-2">
                          <div className="relative group">
                            {cCoverBuku.startsWith('http') ? (
                              <img src={cCoverBuku} alt="Preview" className="w-24 h-32 object-cover rounded shadow-lg border-2 border-white mb-2" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-24 h-32 bg-slate-100 rounded flex items-center justify-center mb-2 border border-slate-200">
                                <BookOpen className="w-10 h-10 text-slate-300" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                              <span className="text-white text-[10px] font-bold">Ganti Cover</span>
                            </div>
                          </div>
                          <p className="text-xs font-bold text-slate-700 truncate max-w-[200px] mb-1">{cCoverBukuName}</p>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCCoverBuku('');
                              setCCoverBukuName('');
                            }}
                            className="text-[10px] text-rose-500 hover:text-rose-600 font-black uppercase tracking-tighter"
                          >
                            Hapus Berkas
                          </button>
                        </div>
                      ) : (
                        <div className="py-4">
                          <Upload className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                          <p className="text-sm font-bold text-slate-500">Pilih berkas cover</p>
                          <p className="text-[10px] text-slate-400 mt-1">Hanya file gambar (JPG, PNG) mak 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {successMsg && <p className="text-emerald-600 text-xs font-semibold">{successMsg}</p>}
                  <button type="submit" className="w-full py-2 bg-unair-blue hover:bg-unair-blue-light text-white font-bold text-sm rounded-lg transition-colors cursor-pointer">
                    Simpan Modul IPE
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Submenu D: STUDENT INBOUND */}
          {activeTab === 'D' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Student Inbound</h3>
                </div>

                {studentInboundRecords.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                    <Globe className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                    <p className="text-sm font-medium">Belum ada mahasiswa inbound terekam.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                        <tr>
                          <th className="px-4 py-3 text-left">Fakultas / Mahasiswa</th>
                          <th className="px-4 py-3 text-left">Universitas Asal</th>
                          <th className="px-4 py-3 text-left">KSM / Pembimbing</th>
                          <th className="px-4 py-3 text-center">Durasi</th>
                          <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 text-xs">
                        {studentInboundRecords.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3.5">
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-unair-blue/15 text-unair-blue uppercase mb-1">
                                {item.fakultasPengirim}
                              </span>
                              <div className="font-semibold text-slate-850 font-sans text-sm">{item.namaStudent}</div>
                            </td>
                            <td className="px-4 py-3.5 text-slate-600 font-medium">{item.universitas}</td>
                            <td className="px-4 py-3.5 text-slate-650 space-y-0.5">
                              <div>KSM Tujuan: <span className="font-bold text-slate-800">{item.ksmTujuan}</span></div>
                              <div>Pembimbing: <span className="text-slate-500 italic">{item.pembimbing}</span></div>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <div className="font-mono text-slate-500 text-xs">{item.tanggalMasuk} s/d {item.tanggalKeluar}</div>
                              <div className="mt-1">
                                <span className="inline-block px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-55/70 text-indigo-700 border border-indigo-100/50">
                                  {(() => {
                                    if (!item.tanggalMasuk || !item.tanggalKeluar) return '0 hari';
                                    const start = new Date(item.tanggalMasuk);
                                    const end = new Date(item.tanggalKeluar);
                                    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-';
                                    const diffTime = end.getTime() - start.getTime();
                                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
                                    return `${diffDays > 0 ? diffDays : 0} hari`;
                                  })()}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <button onClick={() => {
                                setEditTarget({ id: item.id, type: 'D', data: item });
                                setDNamaStudent(item.namaStudent);
                                setDUniversitas(item.universitas);
                                setDFakultas(item.fakultasPengirim);
                                setDTanggalMasuk(item.tanggalMasuk);
                                setDTanggalKeluar(item.tanggalKeluar);
                                setDKsmTujuanList(item.ksmTujuan.split(', '));
                                setDPembimbing(item.pembimbing);
                              }} className="text-blue-500 hover:text-blue-700 p-1 rounded-md hover:bg-blue-50 mr-1">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => setDeleteTarget({ id: item.id, type: 'D', title: 'Hapus Student Inbound', message: 'Apakah Anda yakin ingin menghapus data student inbound ini dari daftar?' })} className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Form Input Tab D */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                <div className="flex items-center space-x-2 text-unair-blue mb-4">
                  <FolderPlus className="w-5 h-5 text-unair-gold" />
                  <h3 className="font-bold text-slate-900">Registrasi Inbound</h3>
                </div>
                <form noValidate onSubmit={handleSubmitD} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Fakultas Penerima (Unair)</label>
                    <SearchableSelect
                      options={UNAIR_FAKULTAS}
                      value={dFakultas}
                      onChange={setDFakultas}
                      placeholder="Pilih Fakultas Penerima"
                      title="Pilih Fakultas Penerima"
                      subtitle="Cari dan pilih fakultas penerima mahasiswa"
                      showTotalText="fakultas"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Nama Student</label>
                    <textarea 
                      required 
                      rows={2}
                      value={dNamaStudent || ''}
                      onChange={(e) => setDNamaStudent(e.target.value)}
                      placeholder="Contoh: dr. John Smith-Keen, Sarah Connor"
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none resize-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Universitas Asal</label>
                    <input 
                      type="text" 
                      required 
                      value={dUniversitas || ''}
                      onChange={(e) => setDUniversitas(e.target.value)}
                      placeholder="Contoh: Saga University Japan"
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Tgl Masuk</label>
                      <input 
                        type="date" 
                        required 
                        value={dTanggalMasuk || ''}
                        onChange={(e) => setDTanggalMasuk(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 text-xs rounded-lg focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Tgl Keluar</label>
                      <input 
                        type="date" 
                        required 
                        value={dTanggalKeluar || ''}
                        onChange={(e) => setDTanggalKeluar(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 text-xs rounded-lg focus:outline-none" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">KSM Tujuan (Multi)</label>
                    <div className="space-y-1.5">
                      {dKsmTujuanList.map((ksmItem, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="flex-1">
                            <SearchableSelect
                              options={dynamicKsmOptions}
                              value={ksmItem}
                              onChange={(val) => {
                                const newList = [...dKsmTujuanList];
                                newList[idx] = val;
                                setDKsmTujuanList(newList);
                              }}
                              placeholder={`Pilih KSM Tujuan ${idx + 1}...`}
                              title="Pilih KSM Tujuan"
                              subtitle="Cari KSM atau ketik kata kunci untuk menambah secara mandiri"
                              showTotalText="ksm"
                              allowCustom={true}
                            />
                          </div>
                          {dKsmTujuanList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newList = dKsmTujuanList.filter((_, i) => i !== idx);
                                setDKsmTujuanList(newList);
                              }}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100 cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDKsmTujuanList([...dKsmTujuanList, ''])}
                      className="inline-flex items-center gap-1 text-[10px] text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      Tambah KSM Tujuan
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Dosen / DPK Pembimbing</label>
                    <input 
                      type="text" 
                      value={dPembimbing}
                      onChange={(e) => setDPembimbing(e.target.value)}
                      placeholder="Contoh: Prof. dr. Teddy, dr. Joni Sp.An"
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none" 
                    />
                  </div>

                  {successMsg && <p className="text-emerald-600 text-xs font-semibold">{successMsg}</p>}
                  <button type="submit" className="w-full py-2 bg-unair-blue hover:bg-unair-blue-light text-white font-bold text-xs rounded-lg transition-colors cursor-pointer">
                    Simpan Registrasi
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Submenu E: KUNJUNGAN */}
          {activeTab === 'E' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Riwayat Kunjungan</h3>
                </div>

                {kunjunganRecords.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                    <MapPin className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                    <p className="text-sm font-medium">Belum ada riwayat kunjungan studi banding.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto text-xs">
                    <table className="min-w-full divide-y divide-slate-100">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold">
                        <tr>
                          <th className="px-4 py-3 text-left">Asal Institusi</th>
                          <th className="px-4 py-3 text-left">Fakultas</th>
                          <th className="px-4 py-3 text-left">Program Studi</th>
                          <th className="px-4 py-3 text-left">Tujuan Kunjungan</th>
                          <th className="px-4 py-3 text-left">Pemateri</th>
                          <th className="px-4 py-3 text-center">Tgl / Peserta</th>
                          <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {kunjunganRecords.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3.5">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mb-1 ${
                                item.institusiType === 'UNAIR' ? 'bg-unair-blue/10 text-unair-blue' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {item.institusiType}
                              </span>
                              <div className="font-semibold text-slate-800 text-sm">
                                {item.institusiType === 'UNAIR' ? 'UNAIR' : (item.universitas || '-')}
                              </div>
                            </td>
                            <td className="px-4 py-3.5 font-medium text-slate-700">
                              {item.fakultas}
                            </td>
                            <td className="px-4 py-3.5 text-slate-600 font-medium">{item.programStudi}</td>
                            <td className="px-4 py-3.5 text-slate-800 italic font-medium whitespace-pre-line">
                              "{item.tujuan}"
                            </td>
                            <td className="px-4 py-3.5 text-slate-650 font-medium">
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-55/70 text-indigo-700 uppercase mr-1.5">
                                Pemateri
                              </span>
                              <span className="text-slate-700">{item.pemateri}</span>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <div className="font-mono text-slate-400 mb-1">{item.tanggalPelaksanaan}</div>
                              <div className="font-bold text-slate-900">{item.jumlahPeserta} Peserta</div>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <button onClick={() => {
                                setEditTarget({ id: item.id, type: 'E', data: item });
                                setEInstitusiType(item.institusiType);
                                setEUniversitasNonUnair(item.universitas || '');
                                setEFakultas(item.fakultas);
                                setEProdi(item.programStudi);
                                setETujuan(item.tujuan);
                                setETanggal(item.tanggalPelaksanaan);
                                setEPemateriList(item.pemateri.split(', '));
                                setEJumlahPeserta(item.jumlahPeserta);
                              }} className="text-blue-500 hover:text-blue-700 p-1 rounded-md hover:bg-blue-50 mr-1">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => setDeleteTarget({ id: item.id, type: 'E', title: 'Hapus Kunjungan Akademik', message: 'Apakah Anda yakin ingin menghapus histori kunjungan akademik ini?' })} className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Form Input Tab E */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                <div className="flex items-center space-x-2 text-unair-blue mb-4">
                  <FolderPlus className="w-5 h-5 text-unair-gold" />
                  <h3 className="font-bold text-slate-900">Arsip Kunjungan</h3>
                </div>
                <form noValidate onSubmit={handleSubmitE} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Tipe Institusi</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-1 cursor-pointer text-xs">
                        <input 
                          type="radio" 
                          checked={eInstitusiType === 'UNAIR'} 
                          onChange={() => {
                            setEInstitusiType('UNAIR');
                            setEUniversitasNonUnair('');
                            setEFakultas('Kedokteran');
                          }} 
                          className="text-unair-blue" 
                        />
                        <span>UNAIR</span>
                      </label>
                      <label className="flex items-center space-x-1 cursor-pointer text-xs">
                        <input 
                          type="radio" 
                          checked={eInstitusiType === 'Non UNAIR'} 
                          onChange={() => {
                            setEInstitusiType('Non UNAIR');
                            setEUniversitasNonUnair('');
                            setEFakultas('');
                          }} 
                          className="text-unair-blue" 
                        />
                        <span>Non-UNAIR</span>
                      </label>
                    </div>
                  </div>
                  {eInstitusiType === 'UNAIR' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Fakultas (UNAIR)</label>
                      <select 
                        required 
                        value={eFakultas}
                        onChange={(e) => setEFakultas(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none"
                      >
                        {UNAIR_FAKULTAS.map((f, idx) => (
                          <option key={idx} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Nama Universitas / Instansi</label>
                        <input 
                          type="text" 
                          required 
                          value={eUniversitasNonUnair}
                          onChange={(e) => setEUniversitasNonUnair(e.target.value)}
                          placeholder="Contoh: Universitas Indonesia..."
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Fakultas</label>
                        <input 
                          type="text" 
                          required 
                          value={eFakultas}
                          onChange={(e) => setEFakultas(e.target.value)}
                          placeholder="Contoh: Fakultas Farmasi..."
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none" 
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Program Studi</label>
                    <input 
                      type="text" 
                      required 
                      value={eProdi || ''}
                      onChange={(e) => setEProdi(e.target.value)}
                      placeholder="Contoh: D3 Keperawatan Lambung Mangkurat..."
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Tujuan Kunjungan</label>
                    <textarea 
                      required 
                      rows={2}
                      value={eTujuan || ''}
                      onChange={(e) => setETujuan(e.target.value)}
                      placeholder="Contoh: Mempelajari rekam medis elektronik terintegrasi..."
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none resize-none" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Tgl Kunjungan</label>
                      <input 
                        type="date" 
                        required 
                        value={eTanggal || ''}
                        onChange={(e) => setETanggal(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Total Peserta</label>
                      <input 
                        type="number" 
                        required 
                        min={1}
                        value={eJumlahPeserta || ''}
                        onChange={(e) => setEJumlahPeserta(Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Pemateri / Narasumber</label>
                    <div className="space-y-2">
                      {ePemateriList.map((pemateri, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input 
                            type="text" 
                            required 
                            value={pemateri}
                            onChange={(e) => {
                              const newList = [...ePemateriList];
                              newList[idx] = e.target.value;
                              setEPemateriList(newList);
                            }}
                            placeholder={`Nama Pemateri ${idx + 1}...`}
                            className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-unair-blue" 
                          />
                          {ePemateriList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newList = ePemateriList.filter((_, i) => i !== idx);
                                setEPemateriList(newList);
                              }}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setEPemateriList([...ePemateriList, ''])}
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Tambah Pemateri
                    </button>
                  </div>

                  {successMsg && <p className="text-emerald-600 text-xs font-semibold">{successMsg}</p>}
                  <button type="submit" className="w-full py-2 bg-unair-blue hover:bg-unair-blue-light text-white font-bold text-xs rounded-lg transition-colors cursor-pointer">
                    Simpan Riwayat
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Submenu F: MOU */}
          {activeTab === 'F' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Kerjasama MOU & RS Jejaring</h3>
                </div>

                {mouRecords.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                    <Handshake className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                    <p className="text-sm font-medium">Belum ada MoU kemitraan tersimpan.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto text-xs">
                    <table className="min-w-full divide-y divide-slate-100">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold">
                        <tr>
                          <th className="px-4 py-3 text-left">Nama Institusi Pendidikan / RS Jejaring</th>
                          <th className="px-4 py-3 text-left">Jenis Kerjasama</th>
                          <th className="px-4 py-3 text-center">Tahun Berjalan</th>
                          <th className="px-4 py-3 text-center">Masa Berlaku</th>
                          <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {mouRecords.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3.5 font-bold font-sans text-sm text-slate-800">{item.namaInstitusi}</td>
                            <td className="px-4 py-3.5">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                item.jenis === 'Nasional' ? 'bg-blue-105 text-blue-800 bg-blue-50' : 'bg-purple-105 text-purple-800 bg-purple-50'
                              }`}>
                                {item.jenis}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-700">{item.tahun}</td>
                            <td className="px-4 py-3.5 text-center text-slate-500 font-semibold">{item.masaBerlaku}</td>
                            <td className="px-4 py-3.5 text-right">
                              <button onClick={() => {
                                setEditTarget({ id: item.id, type: 'F', data: item });
                                setFNamaInstitusi(item.namaInstitusi);
                                setFJenis(item.jenis);
                                setFTahun(item.tahun);
                                setFMasaBerlaku(item.masaBerlaku);
                              }} className="text-blue-500 hover:text-blue-700 p-1 rounded-md hover:bg-blue-50 mr-1">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => setDeleteTarget({ id: item.id, type: 'F', title: 'Hapus Kerja Sama (MoU)', message: 'Apakah Anda yakin ingin menghapus data MoU ini?' })} className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Form Input Tab F */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                <div className="flex items-center space-x-2 text-unair-blue mb-4">
                  <FolderPlus className="w-5 h-5 text-unair-gold" />
                  <h3 className="font-bold text-slate-900">Arsip MoU Baru</h3>
                </div>
                <form noValidate onSubmit={handleSubmitF} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Institusi / RS Jejaring</label>
                    <textarea 
                      required 
                      rows={2}
                      value={fNamaInstitusi || ''}
                      onChange={(e) => setFNamaInstitusi(e.target.value)}
                      placeholder="Contoh: FK UNS, RSU Dr. Koesma Tuban..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-unair-blue resize-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jenis Lingkup Kerja</label>
                    <select 
                      value={fJenis}
                      onChange={(e) => setFJenis(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                    >
                      <option value="Nasional">Nasional / Dalam Negeri</option>
                      <option value="Internasional">Internasional / Luar Negeri</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tahun MOU</label>
                      <input 
                        type="text" 
                        required 
                        value={fTahun}
                        onChange={(e) => setFTahun(e.target.value)}
                        placeholder="2026"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Masa Berlaku</label>
                      <input 
                        type="text" 
                        required 
                        value={fMasaBerlaku}
                        onChange={(e) => setFMasaBerlaku(e.target.value)}
                        placeholder="Contoh: 5 Tahun"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" 
                      />
                    </div>
                  </div>

                  {successMsg && <p className="text-emerald-600 text-xs font-semibold">{successMsg}</p>}
                  <button type="submit" className="w-full py-2 bg-unair-blue hover:bg-unair-blue-light text-white font-bold text-sm rounded-lg transition-colors cursor-pointer">
                    Simpan MoU
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Submenu G: AKSELERASI PENDIDIKAN */}
          {activeTab === 'G' && (
            <div className="space-y-6">
              {/* filter & stats header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
                  <div className="w-full md:w-1/2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Filter KSM</label>
                    <SearchableSelect
                      options={['SEMUA KSM', ...dynamicKsmOptions]}
                      value={filterGKsm}
                      onChange={setFilterGKsm}
                      placeholder="Pilih KSM..."
                      title="Filter Berdasarkan KSM"
                      subtitle="Lihat tren spesifik per unit KSM"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Filter Kategori</label>
                    <select 
                      value={filterGKat}
                      onChange={(e) => setFilterGKat(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-unair-blue"
                    >
                      <option value="SEMUA KATEGORI">SEMUA KATEGORI (AGGREGATE)</option>
                      {AKS_CATEGORIES.map(kat => (
                        <option key={kat} value={kat}>{kat.split(')')[0].trim()})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-unair-blue p-4 rounded-xl shadow-lg shadow-blue-500/15 flex flex-col justify-between overflow-hidden relative group">
                  <div className="relative z-10">
                    <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider mb-1">Total Peserta Didik</p>
                    <h3 className="text-2xl font-black text-white font-mono">
                      {akselerasiRecords.reduce((sum, r) => {
                        if (filterGKsm !== 'SEMUA KSM' && r.ksm !== filterGKsm) return sum;
                        if (filterGKat !== 'SEMUA KATEGORI' && r.kategori !== filterGKat) return sum;
                        return sum + r.jan + r.feb + r.mar + r.apr + r.mei + r.jun + r.jul + r.agt + r.sep + r.okt + r.nov + r.des;
                      }, 0)}
                    </h3>
                  </div>
                  <div className="relative z-10 flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-blue-200 font-medium">Berdasarkan filter aktif</span>
                       <TrendingUp className="w-4 h-4 text-unair-gold" />
                    </div>
                    {/* Overall Quarterly Indicator for Header */}
                    <div className="flex gap-2 text-[9px] font-mono font-bold">
                       {(() => {
                         const filtered = akselerasiRecords.filter(r => {
                           if (filterGKsm !== 'SEMUA KSM' && r.ksm !== filterGKsm) return false;
                           if (filterGKat !== 'SEMUA KATEGORI' && r.kategori !== filterGKat) return false;
                           return true;
                         });
                         const tw1 = filtered.reduce((s, r) => s + r.jan + r.feb + r.mar, 0);
                         const tw2 = filtered.reduce((s, r) => s + r.apr + r.mei + r.jun, 0);
                         const tw3 = filtered.reduce((s, r) => s + r.jul + r.agt + r.sep, 0);
                         const tw4 = filtered.reduce((s, r) => s + r.okt + r.nov + r.des, 0);
                         return (
                           <>
                             <span className="text-unair-gold" title="TW 1">Q1:{tw1}</span>
                             <span className="text-white" title="TW 2">Q2:{tw2}</span>
                             <span className="text-white" title="TW 3">Q3:{tw3}</span>
                             <span className="text-white" title="TW 4">Q4:{tw4}</span>
                           </>
                         );
                       })()}
                    </div>
                  </div>
                  {/* Decorative background icon */}
                  <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 group-hover:text-unair-gold/10 transition-all duration-700" />
                </div>
              </div>

              {/* Main Analysis Panel */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-unair-blue">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <LineChartIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Visualisasi Analisis Tren</h3>
                      <p className="text-xs text-slate-500 font-medium">{selectedRecordName()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* View Toggle */}
                    <div className="flex bg-slate-200 p-1 rounded-lg">
                      <button 
                        onClick={() => setGVisType('BULANAN')}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${gVisType === 'BULANAN' ? 'bg-white text-unair-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        BULANAN
                      </button>
                      <button 
                        onClick={() => setGVisType('TRIWULAN')}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${gVisType === 'TRIWULAN' ? 'bg-white text-unair-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        TRIWULAN
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                       <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-unair-gold" />
                      Januari - Desember 2026
                    </span>
                  </div>
                </div>
              </div>
                
                <div className="p-6">
                  {akselerasiRecords.length === 0 ? (
                    <div className="py-24 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LineChartIcon className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-sm font-medium text-slate-500">Belum ada data untuk dianalisis.</p>
                      <p className="text-xs text-slate-400 mt-1">Gunakan formulir di bawah untuk menambah data target KSM.</p>
                    </div>
                  ) : (
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={getSelectedAkselerasiChart()}>
                          <defs>
                            <linearGradient id="colorAks" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#1A365D" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#1A365D" stopOpacity={0.01}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}}
                            dx={-10}
                          />
                          <Tooltip 
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', padding: '12px'}}
                            itemStyle={{fontWeight: 'bold', color: '#1a365d'}}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="jumlah" 
                            name="Jumlah Peserta" 
                            stroke="#1A365D" 
                            strokeWidth={4} 
                            fillOpacity={1} 
                            fill="url(#colorAks)" 
                            animationDuration={1500}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Data Entry Hub */}
                <div className="xl:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 h-fit sticky top-24">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-unair-gold/10 text-unair-blue rounded-lg">
                      <FolderPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Kelola Data Input</h3>
                      <p className="text-xs text-slate-500">Tambah atau perbarui target akselerasi</p>
                    </div>
                  </div>
                  
                  <form noValidate onSubmit={handleSubmitG} className="space-y-5">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">1. Pilih KSM Pendidikan</label>
                        <SearchableSelect
                          options={dynamicKsmOptions}
                          value={gKsm}
                          onChange={setGKsm}
                          placeholder="Cari Nama KSM..."
                          title="Pilih KSM Pendidikan"
                          subtitle="Unit yang mengakomodasi peserta didik"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">2. Kategori Aktivitas (Bisa multi)</label>
                        <div className="grid grid-cols-1 gap-2">
                          {AKS_CATEGORIES.map((kat, idx) => {
                            const isSelected = gKategoris.includes(kat);
                            const isActive = gActiveKategori === kat;
                            return (
                              <div 
                                key={kat}
                                onClick={() => setGActiveKategori(kat)}
                                className={`px-4 py-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                                  isActive 
                                    ? 'bg-blue-50 border-unair-blue ring-1 ring-unair-blue shadow-sm' 
                                    : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isSelected) {
                                        if (gKategoris.length > 1) {
                                          setGKategoris(gKategoris.filter(k => k !== kat));
                                        }
                                      } else {
                                        setGKategoris([...gKategoris, kat]);
                                      }
                                    }}
                                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shadow-sm ${isSelected ? 'bg-unair-blue border-unair-blue' : 'bg-white border-slate-300 hover:border-unair-blue'}`}
                                  >
                                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[4]" />}
                                  </button>
                                  <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-unair-blue' : 'text-slate-600'}`}>
                                    {idx + 1}. {kat.split(')')[0].trim()})
                                  </span>
                                </div>
                                {isActive && (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-unair-blue text-white rounded text-[9px] font-bold animate-pulse">
                                    <Edit2 className="w-3 h-3" />
                                    Editing
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                      <div className="flex items-center justify-between mb-3">
                        <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          Target Per-Bulan
                        </span>
                        <div className="text-[9px] text-white bg-slate-800 px-2 py-0.5 rounded-full font-mono font-bold">
                          {gActiveKategori.split('(')[0].trim()}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agt', 'sep', 'okt', 'nov', 'des'].map((m) => (
                          <div key={m}>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase text-center mb-1">{m}</label>
                            <input 
                              type="number" 
                              required 
                              min={0}
                              value={gValues[gActiveKategori][m]}
                              onChange={(e) => updateGValue(gActiveKategori, m, Number(e.target.value))}
                              className="w-full text-center py-1.5 bg-white border border-slate-200 text-xs rounded-lg font-bold font-mono text-slate-800 focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue focus:outline-none transition-all" 
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {successMsg && <p className="text-emerald-600 text-[11px] font-bold animate-bounce text-center">{successMsg}</p>}
                    <button type="submit" className="w-full py-3.5 bg-unair-blue hover:bg-unair-blue-light text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer">
                      {editTarget && editTarget.type === 'G' ? 'Update Data Akselerasi' : 'Simpan & Posting Akselerasi'}
                    </button>
                  </form>
                </div>

                {/* List View / Records */}
                <div className="xl:col-span-7 space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Riwayat Target Terdaftar</h4>
                    <div className="text-[10px] font-bold text-slate-500">
                      Total: <span className="text-unair-blue">{Array.from(new Set(akselerasiRecords.map(r => r.ksm))).length}</span> KSM
                    </div>
                  </div>

                  <div className="space-y-4">
                    {akselerasiRecords.length === 0 ? (
                      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-12 text-center">
                        <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-400">Database masih kosong</p>
                      </div>
                    ) : (
                      (Object.entries(
                        akselerasiRecords
                          .reduce((acc, curr) => {
                            if (!acc[curr.ksm]) acc[curr.ksm] = [];
                            acc[curr.ksm].push(curr);
                            return acc;
                          }, {} as Record<string, typeof akselerasiRecords>)
                      ) as [string, typeof akselerasiRecords][]).map(([ksm, records]) => {
                        const isExpanded = expandedKsms.includes(ksm);
                        const totalKsmParticipants = records.reduce((sum, r) => 
                          sum + r.jan + r.feb + r.mar + r.apr + r.mei + r.jun + r.jul + r.agt + r.sep + r.okt + r.nov + r.des, 0
                        );

                        return (
                          <div key={ksm} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                            {/* KSM Accordion Header */}
                            <div 
                              onClick={() => toggleKsmAccordion(ksm)}
                              className={`px-5 py-4 flex items-center justify-between cursor-pointer transition-colors ${isExpanded ? 'bg-slate-50/80 border-b border-slate-100' : 'hover:bg-slate-50'}`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isExpanded ? 'bg-unair-blue text-white' : 'bg-blue-50 text-unair-blue'}`}>
                                  <Layers className="w-5 h-5" />
                                </div>
                                <div>
                                  <h5 className="font-extrabold text-slate-800 text-sm font-sans uppercase tracking-tight">{ksm}</h5>
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-0.5">
                                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                      <Plus className="w-3 h-3 text-unair-gold" />
                                      {records.length} Kategori
                                    </span>
                                    <span className="text-[10px] font-bold text-unair-blue flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      {totalKsmParticipants} Total
                                    </span>
                                    {/* KSM Level Quarterly Breakdown */}
                                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-slate-100 rounded text-[8px] font-mono font-black text-slate-500">
                                      {(() => {
                                        const tw1 = records.reduce((s, r) => s + r.jan + r.feb + r.mar, 0);
                                        const tw2 = records.reduce((s, r) => s + r.apr + r.mei + r.jun, 0);
                                        const tw3 = records.reduce((s, r) => s + r.jul + r.agt + r.sep, 0);
                                        const tw4 = records.reduce((s, r) => s + r.okt + r.nov + r.des, 0);
                                        return (
                                          <>
                                            <span className="text-unair-blue" title="TW 1">Q1:{tw1}</span>
                                            <span title="TW 2">Q2:{tw2}</span>
                                            <span title="TW 3">Q3:{tw3}</span>
                                            <span title="TW 4">Q4:{tw4}</span>
                                          </>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const item = records[0];
                                    setEditTarget({ id: item.id, type: 'G', data: item });
                                    const relatedRecords = akselerasiRecords.filter(r => r.ksm === item.ksm);
                                    const existingKats = relatedRecords.map(r => r.kategori);
                                    setGKategoris(existingKats);
                                    setGActiveKategori(item.kategori);
                                    setGKsm(item.ksm);
                                    const initialValues = AKS_CATEGORIES.reduce((acc, cat) => ({
                                      ...acc,
                                      [cat]: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, agt: 0, sep: 0, okt: 0, nov: 0, des: 0 }
                                    }), {});
                                    relatedRecords.forEach(rec => {
                                      initialValues[rec.kategori] = {
                                        jan: rec.jan, feb: rec.feb, mar: rec.mar, apr: rec.apr,
                                        mei: rec.mei, jun: rec.jun, jul: rec.jul, agt: rec.agt,
                                        sep: rec.sep, okt: rec.okt, nov: rec.nov, des: rec.des
                                      };
                                    });
                                    setGValues(initialValues);
                                  }}
                                  className="p-2 text-slate-400 hover:text-unair-blue hover:bg-blue-50 rounded-lg transition-all"
                                  title="Edit Seluruh KSM"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                >
                                  <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </motion.div>
                              </div>
                            </div>

                            {/* Expanded Content */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-4 space-y-3 bg-slate-50/30">
                                    {records.map((item) => {
                                      const total = item.jan + item.feb + item.mar + item.apr + item.mei + item.jun + item.jul + item.agt + item.sep + item.okt + item.nov + item.des;
                                      return (
                                        <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm group">
                                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                            <div className="space-y-1">
                                              <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tight border ${
                                                  item.kategori.includes('PROFESI DOKTER') 
                                                    ? 'bg-amber-50 text-amber-600 border-amber-100' 
                                                    : item.kategori.includes('PPDS 1')
                                                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                      : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                                }`}>
                                                  {item.kategori.split('(')[0].trim()}
                                                </span>
                                                <span className="text-[9px] font-mono font-bold text-slate-400"># {item.id.slice(-4)}</span>
                                              </div>
                                              <h6 className="font-bold text-slate-700 text-xs">{item.kategori}</h6>
                                              <div className="flex items-center gap-3">
                                                <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                                  <Users className="w-3 h-3 text-unair-gold" />
                                                  {total} Peserta
                                                </p>
                                                {/* Quarterly highlight for individual category */}
                                                <div className="flex gap-2 text-[8px] font-mono font-bold text-slate-400">
                                                  <span className="text-unair-blue">TW1:{item.jan+item.feb+item.mar}</span>
                                                  <span>TW2:{item.apr+item.mei+item.jun}</span>
                                                  <span>TW3:{item.jul+item.agt+item.sep}</span>
                                                  <span>TW4:{item.okt+item.nov+item.des}</span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <button 
                                                onClick={() => setDeleteTarget({ id: item.id, type: 'G', title: 'Hapus Kategori', message: 'Hapus kategori ini dari riwayat KSM?' })}
                                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </div>

                                          <div className="mt-4 flex items-center gap-1 px-1 overflow-x-auto no-scrollbar pb-1">
                                            {[
                                              {m: 'J', v: item.jan}, {m: 'F', v: item.feb}, {m: 'M', v: item.mar},
                                              {m: 'A', v: item.apr}, {m: 'M', v: item.mei}, {m: 'J', v: item.jun},
                                              {m: 'J', v: item.jul}, {m: 'A', v: item.agt}, {m: 'S', v: item.sep},
                                              {m: 'O', v: item.okt}, {m: 'N', v: item.nov}, {m: 'D', v: item.des}
                                            ].map((month, idx) => (
                                              <div key={idx} className="flex-1 min-w-[20px] flex flex-col items-center">
                                                <div 
                                                  className="w-full bg-blue-100/50 rounded-t-sm relative group/bar"
                                                  style={{ height: `${Math.min(total > 0 ? (month.v / total) * 100 + 4 : 4, 20)}px` }}
                                                >
                                                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[7px] px-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">
                                                    {month.v}
                                                  </div>
                                                </div>
                                                <span className="text-[7px] font-bold text-slate-400 mt-1">{month.m}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submenu J: PENDAPATAN PENDIDIKAN (NON UNAIR ONLY) */}
          {activeTab === 'J' && (() => {
            const yearFilteredRecords = jFilterTahun === 'SEMUA' 
              ? pendidikanJRecords 
              : pendidikanJRecords.filter(r => r.tahun === jFilterTahun);

            const totalIncomeOverall = yearFilteredRecords.reduce((sum, r) => sum + r.totalIncome, 0);

            const totalPrapendidikan = yearFilteredRecords.reduce((sum, r) => sum + r.prapendidikanIncome, 0);
            const totalPraktik = yearFilteredRecords.reduce((sum, r) => sum + r.praktikIncome, 0);
            const totalIpe = yearFilteredRecords.reduce((sum, r) => sum + r.ipeIncome, 0);

            const filteredJRecords = [...pendidikanJRecords.filter(r => {
              const matchesSearch = r.institusiName.toLowerCase().includes(jSearchQuery.toLowerCase()) || 
                r.bulan.toLowerCase().includes(jSearchQuery.toLowerCase()) || 
                (r.tahun && r.tahun.includes(jSearchQuery));
              const matchesYear = jFilterTahun === 'SEMUA' || r.tahun === jFilterTahun;
              return matchesSearch && matchesYear;
            })].sort((a, b) => {
              if (!jSortConfig.key) return 0;
              const valA = a[jSortConfig.key] || 0;
              const valB = b[jSortConfig.key] || 0;
              if (jSortConfig.direction === 'asc') {
                return typeof valA === 'number' && typeof valB === 'number' ? valA - valB : String(valA).localeCompare(String(valB));
              } else {
                return typeof valA === 'number' && typeof valB === 'number' ? valB - valA : String(valB).localeCompare(String(valA));
              }
            });

            const uniqueInputYears = pendidikanJRecords.map(r => String(r.tahun || '2026'));
            const sortedYears = (Array.from(new Set(uniqueInputYears)) as string[]).sort((a, b) => a.localeCompare(b));
            const availableFilterOptions = ['SEMUA', ...sortedYears];

            return (
              <div className="space-y-6">
                {/* Summary Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Total Overall */}
                  <div className="bg-gradient-to-br from-unair-blue to-unair-blue-light p-6 rounded-3xl shadow-xl text-white relative overflow-hidden group flex flex-col justify-center min-h-[140px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-y-[-20%] translate-x-[20%] group-hover:scale-110 transition-transform" />
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-blue-100/80 text-[10px] font-black uppercase tracking-widest mb-1.5">
                          {jFilterTahun === 'SEMUA' ? 'Total Pendapatan Non-UNAIR' : `Total Pendapatan (${jFilterTahun})`}
                        </p>
                        <h3 className="text-3xl font-black font-mono">
                          Rp {totalIncomeOverall.toLocaleString('id-ID')}
                        </h3>
                      </div>
                      <div className="p-2.5 bg-white/10 rounded-2xl text-unair-gold">
                        <Coins className="w-5 h-5 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Distribusi Rincian Bidang */}
                  <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 flex flex-col justify-center min-h-[140px] group">
                    <div>
                      <span className="text-[9px] font-black uppercase text-unair-blue bg-unair-blue/5 px-2.5 py-1 rounded-full">
                        {jFilterTahun === 'SEMUA' ? 'Rincian Per Bidang' : `Rincian Bidang (${jFilterTahun})`}
                      </span>
                      <div className="space-y-1.5 mt-3">
                        <div className="flex justify-between text-[11px] font-medium text-slate-500">
                          <span>Prapendidikan:</span>
                          <span className="font-mono font-bold text-slate-800">Rp {totalPrapendidikan.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-medium text-slate-500">
                          <span>Praktik:</span>
                          <span className="font-mono font-bold text-slate-800">Rp {totalPraktik.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-medium text-slate-500">
                          <span>IPE:</span>
                          <span className="font-mono font-bold text-slate-800">Rp {totalIpe.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid Split Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Records List */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                      {/* Search & Popover filter bar */}
                      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="Cari institusi atau waktu..."
                            value={jSearchQuery}
                            onChange={(e) => setJSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-unair-blue"
                          />
                        </div>
                        {/* Popover Filter Tahun */}
                        <div className="relative shrink-0">
                          <button
                            type="button"
                            onClick={() => setShowYearPopover(!showYearPopover)}
                            className={`w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 hover:border-unair-blue/50 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between sm:justify-start gap-2 duration-150 ${
                              jFilterTahun !== 'SEMUA' 
                                ? 'bg-blue-50/50 border-unair-blue/30 text-unair-blue' 
                                : 'text-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <Filter className="w-3.5 h-3.5 text-slate-400" />
                              <span>Tahun: {jFilterTahun === 'SEMUA' ? 'Semua' : jFilterTahun}</span>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showYearPopover ? 'rotate-180' : ''}`} />
                          </button>

                          {showYearPopover && (
                            <>
                              {/* Overlay for dismissing popover */}
                              <div className="fixed inset-0 z-30" onClick={() => setShowYearPopover(false)} />
                              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-40 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-2.5 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1">
                                  Pilih Tahun
                                </div>
                                {availableFilterOptions.map(yearOpt => (
                                  <button
                                    key={yearOpt}
                                    type="button"
                                    onClick={() => {
                                      setJFilterTahun(yearOpt);
                                      setShowYearPopover(false);
                                    }}
                                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                                      jFilterTahun === yearOpt 
                                        ? 'bg-unair-blue/5 text-unair-blue font-black' 
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                  >
                                    <span>{yearOpt === 'SEMUA' ? 'Semua Tahun' : `Tahun ${yearOpt}`}</span>
                                    {jFilterTahun === yearOpt && <Check className="w-3.5 h-3.5 text-unair-blue" />}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Records Table */}
                      <div className="overflow-x-auto text-sm">
                        {filteredJRecords.length === 0 ? (
                           <div className="text-center py-10 space-y-2">
                             <Coins className="w-10 h-10 mx-auto text-slate-300 animate-bounce" />
                             <p className="text-xs font-bold text-slate-500">Belum ada catatan pendapatan.</p>
                             <p className="text-[10px] text-slate-400">Gunakan form di sebelah kanan untuk menambahkan baru.</p>
                           </div>
                        ) : (
                          <table className="min-w-full divide-y divide-slate-100 text-sm">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-[9px] font-black tracking-wider">
                              <tr>
                                <th className="px-3 py-3 text-left">Bulan / Tahun</th>
                                <th className="px-3 py-3 text-left">Institusi Pendidikan</th>
                                <th 
                                  className="px-3 py-3 text-right cursor-pointer hover:bg-slate-100 transition-colors group"
                                  onClick={() => setJSortConfig({ key: 'prapendidikanIncome', direction: jSortConfig.key === 'prapendidikanIncome' && jSortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                                >
                                  <div className="flex items-center justify-end gap-1">
                                    Prapendidikan
                                    <div className="flex flex-col">
                                      <ArrowUp className={`w-2.5 h-2.5 ${jSortConfig.key === 'prapendidikanIncome' && jSortConfig.direction === 'asc' ? 'text-unair-blue' : 'text-slate-300'}`} />
                                      <ArrowDown className={`w-2.5 h-2.5 -mt-0.5 ${jSortConfig.key === 'prapendidikanIncome' && jSortConfig.direction === 'desc' ? 'text-unair-blue' : 'text-slate-300'}`} />
                                    </div>
                                  </div>
                                </th>
                                <th 
                                  className="px-3 py-3 text-right cursor-pointer hover:bg-slate-100 transition-colors group"
                                  onClick={() => setJSortConfig({ key: 'praktikIncome', direction: jSortConfig.key === 'praktikIncome' && jSortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                                >
                                  <div className="flex items-center justify-end gap-1">
                                    Praktik
                                    <div className="flex flex-col">
                                      <ArrowUp className={`w-2.5 h-2.5 ${jSortConfig.key === 'praktikIncome' && jSortConfig.direction === 'asc' ? 'text-unair-blue' : 'text-slate-300'}`} />
                                      <ArrowDown className={`w-2.5 h-2.5 -mt-0.5 ${jSortConfig.key === 'praktikIncome' && jSortConfig.direction === 'desc' ? 'text-unair-blue' : 'text-slate-300'}`} />
                                    </div>
                                  </div>
                                </th>
                                <th 
                                  className="px-3 py-3 text-right cursor-pointer hover:bg-slate-100 transition-colors group"
                                  onClick={() => setJSortConfig({ key: 'ipeIncome', direction: jSortConfig.key === 'ipeIncome' && jSortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                                >
                                  <div className="flex items-center justify-end gap-1">
                                    IPE
                                    <div className="flex flex-col">
                                      <ArrowUp className={`w-2.5 h-2.5 ${jSortConfig.key === 'ipeIncome' && jSortConfig.direction === 'asc' ? 'text-unair-blue' : 'text-slate-300'}`} />
                                      <ArrowDown className={`w-2.5 h-2.5 -mt-0.5 ${jSortConfig.key === 'ipeIncome' && jSortConfig.direction === 'desc' ? 'text-unair-blue' : 'text-slate-300'}`} />
                                    </div>
                                  </div>
                                </th>
                                <th 
                                  className="px-3 py-3 text-right cursor-pointer hover:bg-slate-100 transition-colors group"
                                  onClick={() => setJSortConfig({ key: 'totalIncome', direction: jSortConfig.key === 'totalIncome' && jSortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                                >
                                  <div className="flex items-center justify-end gap-1">
                                    Total
                                    <div className="flex flex-col">
                                      <ArrowUp className={`w-2.5 h-2.5 ${jSortConfig.key === 'totalIncome' && jSortConfig.direction === 'asc' ? 'text-unair-blue' : 'text-slate-300'}`} />
                                      <ArrowDown className={`w-2.5 h-2.5 -mt-0.5 ${jSortConfig.key === 'totalIncome' && jSortConfig.direction === 'desc' ? 'text-unair-blue' : 'text-slate-300'}`} />
                                    </div>
                                  </div>
                                </th>
                                <th className="px-3 py-3 text-center">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              {filteredJRecords.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-3 py-3 font-semibold text-xs whitespace-nowrap">
                                    <span className="text-[10px] font-bold text-unair-blue bg-blue-50/80 border border-blue-100 px-2 py-0.5 rounded">
                                      {item.bulan} {item.tahun || '2026'}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3 font-bold text-xs text-slate-900">
                                    <div className="flex flex-col gap-1">
                                      <span>{item.institusiName}</span>
                                      {item.buktiPembayaran && (
                                        <button 
                                          type="button"
                                          onClick={() => {
                                            const url = item.buktiPembayaran;
                                            if (url) {
                                              if (url.startsWith('http') || url.includes('drive.google.com')) {
                                                window.open(url, '_blank', 'noopener,noreferrer');
                                              } else {
                                                try {
                                                  const urlToOpen = url.startsWith('data:') ? url : `data:application/octet-stream;base64,${url}`;
                                                  const parts = urlToOpen.split(',');
                                                  const byteString = atob(parts[1]);
                                                  const mimeString = parts[0].split(':')[1].split(';')[0];
                                                  const ab = new ArrayBuffer(byteString.length);
                                                  const ia = new Uint8Array(ab);
                                                  for (let i = 0; i < byteString.length; i++) {
                                                    ia[i] = byteString.charCodeAt(i);
                                                  }
                                                  const blob = new Blob([ab], { type: mimeString });
                                                  const blobUrl = URL.createObjectURL(blob);
                                                  window.open(blobUrl, '_blank');
                                                } catch (e) {
                                                  console.error('Error opening file:', e);
                                                  if (url.length < 2000) window.open(url, '_blank');
                                                }
                                              }
                                            }
                                          }}
                                          className="text-[9px] font-black text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-0.5 w-max cursor-pointer"
                                        >
                                          <Eye className="w-3 h-3" /> Lihat Bukti
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-3 py-3 text-right font-mono text-xs text-slate-600">
                                    Rp {item.prapendidikanIncome.toLocaleString('id-ID')}
                                  </td>
                                  <td className="px-3 py-3 text-right font-mono text-xs text-slate-600">
                                    Rp {item.praktikIncome.toLocaleString('id-ID')}
                                  </td>
                                  <td className="px-3 py-3 text-right font-mono text-xs text-slate-600">
                                    Rp {item.ipeIncome.toLocaleString('id-ID')}
                                  </td>
                                  <td className="px-3 py-3 text-right font-mono text-xs font-black text-unair-blue whitespace-nowrap">
                                    Rp {item.totalIncome.toLocaleString('id-ID')}
                                  </td>
                                  <td className="px-3 py-3 text-center whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button 
                                        type="button"
                                        onClick={() => handleEditJRecord(item)}
                                        className="p-1.5 text-unair-blue hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                        title="Edit"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        type="button"
                                        onClick={() => setDeleteTarget({ id: item.id, type: 'J', title: 'Hapus Pendapatan', message: `Hapus catatan pendapatan untuk ${item.institusiName} bulan ${item.bulan}?` })}
                                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                        title="Hapus"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Add/Edit Input Form */}
                  <div className="lg:col-span-1">
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4 sticky top-24">
                      <div>
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                          {jEditingRecordId ? 'Edit Catatan Pendapatan' : 'Tambah Catatan Baru'}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium font-sans">Lengkapi isi field secara proporsional sesuai peruntukannya</p>
                      </div>

                      <form noValidate onSubmit={handleSaveJRecord} className="space-y-4">
                        <div className="space-y-3">
                          {/* Bulan */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Bulan</label>
                            <select 
                              value={jBulan}
                              onChange={(e) => setJBulan(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none"
                            >
                              {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(m => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                            </select>
                          </div>

                          {/* Tahun (Interactive Unlimited Year Picker) */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Tahun</label>
                            <div className="flex gap-1.5 items-center">
                              <button
                                type="button"
                                onClick={() => {
                                  const current = parseInt(jTahun) || 2026;
                                  setJTahun(String(current - 1));
                                }}
                                className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center font-bold text-sm select-none cursor-pointer border border-slate-200/50 hover:border-slate-300 transition-colors duration-150"
                              >
                                -
                              </button>
                              
                              <input
                                type="number"
                                min="1900"
                                max="2100"
                                value={jTahun}
                                onChange={(e) => setJTahun(e.target.value)}
                                placeholder="Pilih Tahun"
                                className="flex-1 text-center py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-4 focus:ring-unair-blue/10 transition-all font-mono"
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  const current = parseInt(jTahun) || 2026;
                                  setJTahun(String(current + 1));
                                }}
                                className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center font-bold text-sm select-none cursor-pointer border border-slate-200/50 hover:border-slate-300 transition-colors duration-150"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Nama Institusi */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Institusi Pendidikan</label>
                          <input 
                            type="text" 
                            placeholder="Contoh: Universitas Brawijaya"
                            value={jInstitusiName}
                            onChange={(e) => setJInstitusiName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none"
                            required
                          />
                        </div>

                        {/* Rincian Kegiatan Pendapatan */}
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider block border-b border-slate-200 pb-1.5 mb-2">
                            Pendapatan Berdasarkan Jenis Kegiatan
                          </p>

                          <div className="space-y-2">
                            {/* Prapendidikan */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Prapendidikan</span>
                              </div>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">Rp</span>
                                <input 
                                  type="number" 
                                  placeholder="0"
                                  value={jPrapendidikanIncome}
                                  onChange={(e) => setJPrapendidikanIncome(e.target.value)}
                                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-unair-blue"
                                  min="0"
                                />
                              </div>
                            </div>

                            {/* Praktik */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Praktik</span>
                              </div>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">Rp</span>
                                <input 
                                  type="number" 
                                  placeholder="0"
                                  value={jPraktikIncome}
                                  onChange={(e) => setJPraktikIncome(e.target.value)}
                                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-unair-blue"
                                  min="0"
                                />
                              </div>
                            </div>

                            {/* IPE */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">IPE</span>
                              </div>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">Rp</span>
                                <input 
                                  type="number" 
                                  placeholder="0"
                                  value={jIpeIncome}
                                  onChange={(e) => setJIpeIncome(e.target.value)}
                                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-unair-blue"
                                  min="0"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Calculated Live Total */}
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex justify-between items-center">
                          <div>
                            <span className="text-[8px] font-black text-amber-800 uppercase tracking-wider block">Total Pendapatan</span>
                            <span className="text-[10px] text-slate-400 block font-medium">(Hitung Otomatis)</span>
                          </div>
                          <span className="text-sm font-black font-mono text-unair-blue">
                            Rp {((Number(jPrapendidikanIncome) || 0) + (Number(jPraktikIncome) || 0) + (Number(jIpeIncome) || 0)).toLocaleString('id-ID')}
                          </span>
                        </div>

                        {/* Drag and Drop Upload */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Bukti Pembayaran</label>
                          <div 
                            onClick={() => !isUploadingBukti && document.getElementById('bukti_file_input')?.click()}
                            className={`border-2 border-dashed border-slate-200 hover:border-unair-blue rounded-2xl p-4 text-center cursor-pointer transition-all hover:bg-slate-50 bg-slate-50/20 ${isUploadingBukti ? 'opacity-70 cursor-not-allowed' : ''}`}
                          >
                            <input 
                              id="bukti_file_input"
                              type="file" 
                              disabled={isUploadingBukti}
                              accept="image/*,application/pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploadingBukti(true);
                                const reader = new FileReader();
                                reader.onload = async () => {
                                  try {
                                    const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                    setJBuktiPembayaran(driveUrl);
                                    setJBuktiPembayaranName(file.name);
                                  } catch (err) {
                                    alert("Gagal mengunggah ke Google Drive: " + (err instanceof Error ? err.message : String(err)));
                                    setJBuktiPembayaran(reader.result as string);
                                    setJBuktiPembayaranName(file.name);
                                  } finally {
                                    setIsUploadingBukti(false);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }}
                              className="hidden"
                            />
                            {isUploadingBukti ? (
                              <div className="space-y-1 py-2">
                                <div className="w-5 h-5 mx-auto border-2 border-unair-blue border-t-transparent rounded-full animate-spin" />
                                <p className="text-xs font-bold text-amber-600 animate-pulse">Mengunggah ke Google Drive...</p>
                              </div>
                            ) : jBuktiPembayaran ? (
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-700 truncate max-w-[150px] mx-auto">{jBuktiPembayaranName}</p>
                                <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                  {jBuktiPembayaran.startsWith('http') ? '✓ Drive Terkoneksi' : 'File Terunggah Lokal'}
                                </span>
                                <button 
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setJBuktiPembayaran('');
                                    setJBuktiPembayaranName('');
                                  }}
                                  className="block mx-auto text-[9px] text-rose-500 hover:underline font-bold mt-1.5"
                                >
                                  Hapus File
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <Upload className="w-5 h-5 mx-auto text-slate-400" />
                                <p className="text-xs font-bold text-slate-500">Pilih / Seret berkas</p>
                                <p className="text-[8px] text-slate-400 font-medium">Gambar/PDF</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Submit Actions */}
                        {successMsg && <p className="text-emerald-600 text-[10px] font-black uppercase text-center tracking-wider">{successMsg}</p>}
                        <div className="flex gap-2">
                          <button 
                            type="submit" 
                            disabled={isUploadingBukti}
                            className="flex-1 py-2.5 bg-unair-blue hover:bg-unair-blue-light text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow shadow-blue-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isUploadingBukti ? 'Mengunggah...' : (jEditingRecordId ? 'Simpan' : 'Simpan Baru')}
                          </button>
                          {jEditingRecordId && (
                            <button 
                              type="button"
                              onClick={handleCancelEditJ}
                              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                            >
                              Batal
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {/* Bukti Pembayaran Preview Modal Removed */}
              </div>
            );
          })()}

          {/* Submenu K: DATA PAJANAN PESERTA DIDIK */}
          {activeTab === 'K' && (() => {
            const filteredKRecords = pendidikanKRecords.filter(r => {
              const matchesSearch = r.namaMahasiswa.toLowerCase().includes(kSearchQuery.toLowerCase()) || 
                r.nim.toLowerCase().includes(kSearchQuery.toLowerCase()) || 
                r.institusiType.toLowerCase().includes(kSearchQuery.toLowerCase());
              return matchesSearch;
            });

            const filteredProdis = UNAIR_PRODI_LIST.filter(prodi => 
              prodi.toLowerCase().includes(kProdiSearchFilter.toLowerCase())
            );

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Records List */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                      {/* Search bar */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text"
                          placeholder="Cari nama, NIM, institusi..."
                          value={kSearchQuery}
                          onChange={(e) => setKSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-unair-blue"
                        />
                      </div>

                      {/* Header and Table */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <h3 className="text-sm font-black text-unair-blue uppercase tracking-widest flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" /> REKAMAN PAJANAN
                        </h3>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{filteredKRecords.length} DATA</span>
                      </div>

                      <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-slate-600">
                            <thead className="bg-slate-100/50 text-slate-500 font-black uppercase tracking-widest border-b border-slate-200/60 text-[9px]">
                              <tr>
                                <th className="px-3 py-3 text-left">Nama Mahasiswa</th>
                                <th className="px-3 py-3 text-left">NIM</th>
                                <th className="px-3 py-3 text-left">Institusi</th>
                                <th className="px-3 py-3 text-left">Fakultas / Prodi</th>
                                <th className="px-3 py-3 text-left">Tanggal Kejadian</th>
                                <th className="px-3 py-3 text-center">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {filteredKRecords.length > 0 ? filteredKRecords.map(rec => (
                                <tr key={rec.id} className="hover:bg-white transition-colors group">
                                  <td className="px-3 py-3 font-semibold text-slate-800">{rec.namaMahasiswa}</td>
                                  <td className="px-3 py-3 font-mono">{rec.nim}</td>
                                  <td className="px-3 py-3 text-xs font-bold">
                                    <span className={`px-2 py-0.5 rounded-md ${rec.institusiType === 'UNAIR' ? 'bg-unair-blue text-white' : 'bg-slate-200 text-slate-700'}`}>
                                      {rec.institusiType}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3">
                                    <div className="font-bold text-slate-700">{rec.fakultas}</div>
                                    <div className="text-[10px] text-slate-500">{rec.programStudi}</div>
                                  </td>
                                  <td className="px-3 py-3 font-bold text-slate-600">
                                    {rec.tanggalKejadian}
                                  </td>
                                  <td className="px-3 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {rec.fileLaporan && (
                                        <button 
                                          onClick={() => window.open(rec.fileLaporan, '_blank', 'noopener,noreferrer')}
                                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                          title="Pratinjau Laporan"
                                        >
                                          <Eye className="w-4 h-4" />
                                        </button>
                                      )}
                                      <button onClick={() => handleEditKRecord(rec)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Edit">
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button onClick={() => setDeleteTarget({ id: rec.id, type: 'K', title: 'Hapus Rekaman Pajanan' })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Hapus">
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )) : (
                                <tr>
                                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-medium text-xs">
                                    Tidak ada data yang ditemukan.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Form Form Add / Edit */}
                  <div className="lg:col-span-1 w-full lg:w-96 shrink-0">
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 sticky top-6">
                      <div className="mb-4">
                        <h3 className="text-sm font-black text-unair-blue uppercase tracking-widest">{kEditingRecordId ? 'EDIT CATATAN' : 'TAMBAH CATATAN BARU'}</h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5 font-sans leading-relaxed">Pendataan kejadian pajanan peserta didik</p>
                      </div>

                      <form noValidate onSubmit={handleSaveKRecord} className="space-y-4">
                        {/* Nama Mahasiswa */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Mahasiswa</label>
                          <input 
                            type="text"
                            required
                            value={kNama}
                            onChange={e => setKNama(e.target.value)}
                            placeholder="Contoh: John Doe"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none text-slate-700"
                          />
                        </div>

                        {/* NIM */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">NIM</label>
                          <input 
                            type="text"
                            required
                            value={kNim}
                            onChange={e => setKNim(e.target.value)}
                            placeholder="Contoh: 011911..."
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none font-mono text-slate-700"
                          />
                        </div>

                        {/* Tipe Institusi */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipe Institusi</label>
                          <div className="flex bg-slate-100 p-1 rounded-xl">
                            {(['UNAIR', 'NON UNAIR'] as const).map(type => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => {
                                  setKInstitusiType(type);
                                  setKProgramStudi('');
                                }}
                                className={`flex-1 py-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                                  kInstitusiType === type 
                                    ? 'bg-white text-unair-blue shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Fakultas */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Fakultas {kInstitusiType === 'UNAIR' ? 'Sesuai UNAIR' : ''}</label>
                          {kInstitusiType === 'UNAIR' ? (
                            <select
                              value={kFakultas}
                              onChange={e => setKFakultas(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none text-slate-700"
                            >
                              {UNAIR_FAKULTAS.map((fac) => (<option key={fac} value={fac}>{fac}</option>))}
                            </select>
                          ) : (
                            <input 
                              type="text"
                              required
                              value={kFakultas}
                              onChange={e => setKFakultas(e.target.value)}
                              placeholder="Masukkan Nama Fakultas"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none text-slate-700"
                            />
                          )}
                        </div>

                        {/* Program Studi */}
                        <div className="space-y-1 relative">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Program Studi {kInstitusiType === 'UNAIR' ? 'Sesuai UNAIR' : ''}</label>
                          {kInstitusiType === 'UNAIR' ? (
                            <div 
                              onClick={() => {
                                setKProdiSearchFilter('');
                                setIsKProdiModalOpen(true);
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none text-slate-700 flex justify-between items-center cursor-pointer hover:bg-white select-none border-dashed"
                            >
                              <span className={kProgramStudi ? 'text-slate-800 font-bold' : 'text-slate-400 font-medium'}>
                                {kProgramStudi || 'Cari & Pilih Program Studi...'}
                              </span>
                              <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
                            </div>
                          ) : (
                            <input 
                              type="text"
                              required
                              value={kProgramStudi}
                              onChange={e => setKProgramStudi(e.target.value)}
                              placeholder="Masukkan Nama Program Studi"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none text-slate-700"
                            />
                          )}
                        </div>

                        {/* Tanggal Kejadian */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Kejadian</label>
                          <input 
                            type="date"
                            required
                            value={kTanggalKejadian}
                            onChange={e => setKTanggalKejadian(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none text-slate-700"
                          />
                        </div>

                        <div className="pt-2 flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 bg-unair-blue text-white py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-blue-800 transition-colors shadow-sm cursor-pointer"
                          >
                            {kEditingRecordId ? 'Simpan Perubahan' : 'Tambahkan'}
                          </button>
                          {kEditingRecordId && (
                            <button
                              type="button"
                              onClick={handleCancelEditK}
                              className="px-4 bg-slate-100 text-slate-600 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-slate-200 transition-colors shadow-sm cursor-pointer"
                            >
                              Batal
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Specific Pop up modal for Program Studi Search */}
                <AnimatePresence>
                  {isKProdiModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                      {/* overlay backdrop */}
                      <div 
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
                        onClick={() => setIsKProdiModalOpen(false)} 
                      />
                      
                      {/* modal container */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md relative max-h-[75vh] flex flex-col overflow-hidden z-10"
                      >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                          <div>
                            <h3 className="text-xs font-black text-unair-blue uppercase tracking-widest">Cari Program Studi</h3>
                            <p className="text-[9px] font-bold text-slate-400 mt-0.5">Silakan pilih Program Studi UNAIR</p>
                          </div>
                          <button
                            onClick={() => setIsKProdiModalOpen(false)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Search Input inline */}
                        <div className="p-3 border-b border-slate-100 bg-white">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input 
                              type="text"
                              autoFocus
                              placeholder="Ketik untuk mencari (contoh: Kedokteran...)"
                              value={kProdiSearchFilter}
                              onChange={(e) => setKProdiSearchFilter(e.target.value)}
                              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-unair-blue block"
                            />
                          </div>
                        </div>

                        {/* List items result */}
                        <div className="p-2 overflow-y-auto flex-1 custom-scrollbar max-h-[45vh] divide-y divide-slate-50">
                          {filteredProdis.length > 0 ? (
                            filteredProdis.map((prodi) => {
                              const isSelected = kProgramStudi === prodi;
                              return (
                                <button
                                  key={prodi}
                                  type="button"
                                  onClick={() => {
                                    setKProgramStudi(prodi);
                                    setIsKProdiModalOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                                    isSelected 
                                      ? 'bg-unair-blue/5 text-unair-blue font-bold' 
                                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                  }`}
                                >
                                  <span>{prodi}</span>
                                  {isSelected && <span className="w-1.5 h-1.5 bg-unair-blue rounded-full" />}
                                </button>
                              );
                            })
                          ) : (
                            <div className="p-8 text-center text-slate-400 font-bold text-[11px] uppercase tracking-wide">
                              Tidak ada Program Studi yang cocok
                            </div>
                          )}
                        </div>

                        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setIsKProdiModalOpen(false)}
                            className="px-4 py-1.5 bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-300 transition-colors cursor-pointer"
                          >
                            Tutup
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            );
          })()}

          {/* Submenu L: PRAPENDIDIKAN ORIENTASI OLEH KOMKORDIK */}
          {activeTab === 'L' && (() => {
            const filteredLRecords = prapendidikanKomkordikRecords.filter(r => 
              r.institusiPendidikan.toLowerCase().includes(lSearchQuery.toLowerCase())
            );

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Records List */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                      {/* Search bar */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text"
                          placeholder="Cari institusi..."
                          value={lSearchQuery}
                          onChange={(e) => setLSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-unair-blue"
                        />
                      </div>

                      {/* Header and Table */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <h3 className="text-sm font-black text-unair-blue uppercase tracking-widest flex items-center gap-2">
                          <Compass className="w-5 h-5" /> REKAMAN KOMKORDIK
                        </h3>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{filteredLRecords.length} DATA</span>
                      </div>

                      <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-slate-600">
                            <thead className="bg-slate-100/50 text-slate-500 font-black uppercase tracking-widest border-b border-slate-200/60 text-[9px]">
                              <tr>
                                <th className="px-4 py-3 text-left">Tanggal</th>
                                <th className="px-4 py-3 text-left">Institusi Pendidikan</th>
                                <th className="px-4 py-3 text-center">Total Peserta</th>
                                <th className="px-4 py-3 text-center">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {filteredLRecords.length > 0 ? filteredLRecords.map(rec => (
                                <tr key={rec.id} className="hover:bg-white transition-colors group">
                                  <td className="px-4 py-4 font-mono text-[10px] text-slate-500">{rec.tanggalPelaksanaan}</td>
                                  <td className="px-4 py-4 font-bold text-slate-800 whitespace-pre-wrap leading-relaxed">{rec.institusiPendidikan}</td>
                                  <td className="px-4 py-4 text-center">
                                    <span className="px-2.5 py-1 bg-blue-50 text-unair-blue rounded-full font-black text-[10px]">
                                      {rec.totalPeserta} PESERTA
                                    </span>
                                  </td>
                                   <td className="px-4 py-4 text-center">
                                     <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button 
                                         onClick={() => {
                                           setEditTarget({ id: rec.id, type: 'L', data: rec });
                                           setLTanggalPelaksanaan(rec.tanggalPelaksanaan);
                                           setLInstitusiPendidikanList(rec.institusiPendidikan.split('\n'));
                                           setLTotalPeserta(rec.totalPeserta);
                                         }} 
                                         className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" 
                                         title="Edit"
                                       >
                                         <Edit className="w-4 h-4" />
                                       </button>
                                       <button onClick={() => setDeleteTarget({ id: rec.id, type: 'L', title: 'Hapus Rekaman Komkordik' })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Hapus">
                                         <Trash2 className="w-4 h-4" />
                                       </button>
                                     </div>
                                   </td>
                                </tr>
                              )) : (
                                <tr>
                                  <td colSpan={4} className="px-4 py-12 text-center text-slate-400 font-medium text-xs italic">
                                    Belum ada data prapendidikan Komkordik.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Form Add */}
                  <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-6">
                      <div className="mb-6">
                        <div className="w-10 h-10 bg-unair-blue/10 text-unair-blue rounded-xl flex items-center justify-center mb-3">
                          <Compass className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-black text-unair-blue uppercase tracking-widest">INPUT KOMKORDIK</h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase leading-relaxed tracking-tighter">PRAPENDIDIKAN ORIENTASI OLEH KOMKORDIK</p>
                      </div>

                      <form noValidate onSubmit={handleSubmitL} className="space-y-5">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Tanggal Pelaksanaan</label>
                          <input 
                            type="date"
                            required
                            value={lTanggalPelaksanaan}
                            onChange={(e) => setLTanggalPelaksanaan(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest font-sans">Institusi Pendidikan (Bisa Lebih dari Satu)</label>
                          {lInstitusiPendidikanList.map((inst, index) => (
                            <div key={index} className="flex gap-2">
                              <input 
                                required
                                type="text"
                                value={inst}
                                onChange={(e) => {
                                  const newList = [...lInstitusiPendidikanList];
                                  newList[index] = e.target.value;
                                  setLInstitusiPendidikanList(newList);
                                }}
                                placeholder="Ketik nama institusi..."
                                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none"
                              />
                              {lInstitusiPendidikanList.length > 1 && (
                                <button 
                                  type="button"
                                  onClick={() => setLInstitusiPendidikanList(lInstitusiPendidikanList.filter((_, i) => i !== index))}
                                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button 
                            type="button"
                            onClick={() => setLInstitusiPendidikanList([...lInstitusiPendidikanList, ''])}
                            className="w-full py-2 border border-dashed border-slate-300 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:border-unair-blue hover:text-unair-blue transition-all flex items-center justify-center gap-2"
                          >
                            <Plus className="w-3 h-3 stroke-[3]" /> Tambah Baris
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Peserta (Isi Manual)</label>
                          <input 
                            type="number"
                            required
                            min="0"
                            value={lTotalPeserta || ''}
                            onChange={(e) => setLTotalPeserta(Number(e.target.value))}
                            placeholder="0"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none text-unair-blue"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-unair-blue text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/10 cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" /> Simpan Data
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Submenu M: ORIENTASI KSM / INSTALASI */}
          {activeTab === 'M' && (() => {
            const filteredMRecords = orientasiKsmRecords.filter(r => 
              r.institusiPendidikan.toLowerCase().includes(mSearchQuery.toLowerCase())
            );

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Records List */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                      {/* Search bar */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text"
                          placeholder="Cari KSM/Instalasi..."
                          value={mSearchQuery}
                          onChange={(e) => setMSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-unair-blue"
                        />
                      </div>

                      {/* Header and Table */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <h3 className="text-sm font-black text-unair-blue uppercase tracking-widest flex items-center gap-2">
                          <Layout className="w-5 h-5" /> REKAMAN ORIENTASI KSM
                        </h3>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{filteredMRecords.length} DATA</span>
                      </div>

                      <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-slate-600">
                            <thead className="bg-slate-100/50 text-slate-500 font-black uppercase tracking-widest border-b border-slate-200/60 text-[9px]">
                              <tr>
                                <th className="px-4 py-3 text-left">Tanggal</th>
                                <th className="px-4 py-3 text-left">KSM / Instalasi</th>
                                <th className="px-4 py-3 text-center">Peserta</th>
                                <th className="px-4 py-3 text-center">Bukti</th>
                                <th className="px-4 py-3 text-center">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {filteredMRecords.length > 0 ? filteredMRecords.map(rec => (
                                <tr key={rec.id} className="hover:bg-white transition-colors group">
                                  <td className="px-4 py-4 font-mono text-[10px] text-slate-500">{rec.tanggalPelaksanaan}</td>
                                  <td className="px-4 py-4">
                                    <div className="font-bold text-slate-800 whitespace-pre-wrap leading-relaxed">{rec.institusiPendidikan}</div>
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full font-black text-[10px]">
                                      {rec.totalPeserta}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                    <div className="flex justify-center gap-1">
                                      {rec.buktiFoto1 && (
                                        <div 
                                          onClick={() => window.open(rec.buktiFoto1, '_blank', 'noopener,noreferrer')}
                                          className="w-8 h-8 rounded bg-slate-200 overflow-hidden border border-white shadow-sm ring-1 ring-slate-100 relative group cursor-pointer"
                                          title="Pratinjau Foto 1"
                                        >
                                          <img src={rec.buktiFoto1} alt="B1" className="w-full h-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
                                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Eye className="w-3 h-3 text-white" />
                                          </div>
                                        </div>
                                      )}
                                      {rec.buktiFoto2 && (
                                        <div 
                                          onClick={() => window.open(rec.buktiFoto2, '_blank', 'noopener,noreferrer')}
                                          className="w-8 h-8 rounded bg-slate-200 overflow-hidden border border-white shadow-sm ring-1 ring-slate-100 relative group cursor-pointer"
                                          title="Pratinjau Foto 2"
                                        >
                                          <img src={rec.buktiFoto2} alt="B2" className="w-full h-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
                                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Eye className="w-3 h-3 text-white" />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {rec.buktiFoto1 && (
                                        <button 
                                          onClick={() => window.open(rec.buktiFoto1, '_blank', 'noopener,noreferrer')}
                                          className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                          title="Pratinjau Foto 1"
                                        >
                                          <Eye className="w-4 h-4" />
                                        </button>
                                      )}
                                      {rec.buktiFoto2 && (
                                        <button 
                                          onClick={() => window.open(rec.buktiFoto2, '_blank', 'noopener,noreferrer')}
                                          className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                          title="Pratinjau Foto 2"
                                        >
                                          <Eye className="w-4 h-4" />
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => {
                                          setEditTarget({ id: rec.id, type: 'M', data: rec });
                                          setMTanggalPelaksanaan(rec.tanggalPelaksanaan);
                                          setMInstitusiList(rec.institusiPendidikan.split('\n'));
                                          setMTotalPeserta(rec.totalPeserta);
                                          setMBuktiFoto1(rec.buktiFoto1 || '');
                                          setMBuktiFoto1Name(rec.buktiFoto1Name || '');
                                          setMBuktiFoto2(rec.buktiFoto2 || '');
                                          setMBuktiFoto2Name(rec.buktiFoto2Name || '');
                                        }} 
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" 
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button onClick={() => setDeleteTarget({ id: rec.id, type: 'M', title: 'Hapus Rekaman Orientasi' })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )) : (
                                <tr>
                                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400 font-medium text-xs italic">
                                    Belum ada data orientasi KSM.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Form Add */}
                  <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-6">
                      <div className="mb-6">
                        <div className="w-10 h-10 bg-unair-blue/10 text-unair-blue rounded-xl flex items-center justify-center mb-3">
                          <Layout className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-black text-unair-blue uppercase tracking-widest font-sans">INPUT ORIENTASI</h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase leading-relaxed tracking-tighter">ORIENTASI KSM / INSTALASI</p>
                      </div>

                      <form noValidate onSubmit={handleSubmitM} className="space-y-5">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest font-sans">Tanggal Pelaksanaan</label>
                          <input 
                            type="date"
                            required
                            value={mTanggalPelaksanaan}
                            onChange={(e) => setMTanggalPelaksanaan(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest font-sans">KSM / Instalasi (Bisa Lebih dari Satu)</label>
                          {mInstitusiList.map((inst, index) => (
                            <div key={index} className="flex gap-2 items-center">
                              <div className="flex-1">
                                <SearchableSelect
                                  options={dynamicKsmOptions}
                                  value={inst}
                                  onChange={(val) => {
                                    const newList = [...mInstitusiList];
                                    newList[index] = val;
                                    setMInstitusiList(newList);
                                  }}
                                  placeholder="Pilih KSM/Instalasi..."
                                  title="Pilih KSM / Instalasi"
                                  subtitle="Semua data patokan dari yang diinput admin"
                                  showTotalText="ksm"
                                  allowCustom={true}
                                />
                              </div>
                              {mInstitusiList.length > 1 && (
                                <button 
                                  type="button"
                                  onClick={() => setMInstitusiList(mInstitusiList.filter((_, i) => i !== index))}
                                  className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-rose-100 shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button 
                            type="button"
                            onClick={() => setMInstitusiList([...mInstitusiList, ''])}
                            className="w-full py-2 border border-dashed border-slate-300 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:border-unair-blue hover:text-unair-blue transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Plus className="w-3 h-3 stroke-[3]" /> Tambah Baris
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest font-sans">Total Peserta (Isi Manual)</label>
                          <input 
                            type="number"
                            required
                            min="0"
                            value={mTotalPeserta || ''}
                            onChange={(e) => setMTotalPeserta(Number(e.target.value))}
                            placeholder="0"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none text-unair-blue"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3 pb-2">
                          <div className="space-y-1.5">
                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-sans">Foto 1</label>
                            <div 
                              onClick={() => !isUploadingM1 && document.getElementById('bukti_m1_main')?.click()}
                              className={`border-2 border-dashed border-slate-100 rounded-xl p-2 text-center cursor-pointer hover:bg-slate-50 transition-all ${isUploadingM1 ? 'opacity-50' : ''}`}
                            >
                              <input id="bukti_m1_main" type="file" accept="image/*" className="hidden" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploadingM1(true);
                                const reader = new FileReader();
                                reader.onload = async () => {
                                  try {
                                    const url = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                    setMBuktiFoto1(url);
                                    setMBuktiFoto1Name(file.name);
                                  } catch (err) {
                                    setMBuktiFoto1(reader.result as string);
                                    setMBuktiFoto1Name(file.name);
                                  } finally { setIsUploadingM1(false); }
                                };
                                reader.readAsDataURL(file);
                              }} />
                              {mBuktiFoto1 ? (
                                <div className="relative group">
                                  <img src={mBuktiFoto1} alt="P1" className="w-full h-14 object-cover rounded-lg border border-slate-200" referrerPolicy="no-referrer" />
                                  <div className="absolute inset-0 bg-rose-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg" onClick={(e) => { e.stopPropagation(); setMBuktiFoto1(''); }}>
                                    <Trash2 className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                              ) : isUploadingM1 ? (
                                <div className="py-2 animate-spin border-2 border-unair-blue border-t-transparent rounded-full w-4 h-4 mx-auto my-2" />
                              ) : (
                                <div className="py-4"><Plus className="w-5 h-5 mx-auto text-slate-300" /></div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                             <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-sans">Foto 2 (Opsional)</label>
                             <div 
                              onClick={() => !isUploadingM2 && document.getElementById('bukti_m2_main')?.click()}
                              className={`border-2 border-dashed border-slate-100 rounded-xl p-2 text-center cursor-pointer hover:bg-slate-50 transition-all ${isUploadingM2 ? 'opacity-50' : ''}`}
                            >
                              <input id="bukti_m2_main" type="file" accept="image/*" className="hidden" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploadingM2(true);
                                const reader = new FileReader();
                                reader.onload = async () => {
                                  try {
                                    const url = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                    setMBuktiFoto2(url);
                                    setMBuktiFoto2Name(file.name);
                                  } catch (err) {
                                    setMBuktiFoto2(reader.result as string);
                                    setMBuktiFoto2Name(file.name);
                                  } finally { setIsUploadingM2(false); }
                                };
                                reader.readAsDataURL(file);
                              }} />
                              {mBuktiFoto2 ? (
                                <div className="relative group">
                                  <img src={mBuktiFoto2} alt="P2" className="w-full h-14 object-cover rounded-lg border border-slate-200" referrerPolicy="no-referrer" />
                                  <div className="absolute inset-0 bg-rose-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg" onClick={(e) => { e.stopPropagation(); setMBuktiFoto2(''); }}>
                                    <Trash2 className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                              ) : isUploadingM2 ? (
                                <div className="py-2 animate-spin border-2 border-unair-blue border-t-transparent rounded-full w-4 h-4 mx-auto my-2" />
                              ) : (
                                <div className="py-4"><Plus className="w-5 h-5 mx-auto text-slate-300" /></div>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-unair-blue text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/10 cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" /> Simpan Orientasi
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      </AnimatePresence>
    </div>

      </div>

      <ConfirmDeleteModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteSubtabRecord}
        title={deleteTarget?.title}
        message={deleteTarget?.message}
      />
    </div>
  );
}
