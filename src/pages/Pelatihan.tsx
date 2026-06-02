import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatCard } from '../components/StatCard';
import { 
  UsersRound, ShieldCheck, Target, Trash2, FolderPlus, Info, 
  FileText, Award, Activity, Handshake, Plane, UserSearch,
  Plus, CheckCircle2, XCircle, Pencil, X, Search, Check, Briefcase,
  Eye, Download, Printer, ExternalLink, Globe, Clock, UserCheck
} from 'lucide-react';
import { useSMKS } from '../context/SMKSContext';
import { 
  formatPelatihanExcel, 
  downloadExcelSheet,
  formatPelatihanUnggulanExcel,
  formatInhouseTrainingExcel,
  formatKerjasamaSkpExcel,
  formatStudiBandingExcel,
  formatDokterObserverExcel,
  formatMagangExcel,
  formatTrainerSertifikasiExcel,
  formatPelatihanMandiriExcel
} from '../utils/exportUtils';
import { 
  generatePelatihanPdf,
  generatePelatihanUnggulanPdf,
  generateInhouseTrainingPdf,
  generateKerjasamaSkpPdf,
  generateStudiBandingPdf,
  generateDokterObserverPdf,
  generateMagangPdf,
  generateTrainerSertifikasiPdf,
  generatePelatihanMandiriPdf
} from '../utils/pdfExportUtils';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { uploadToAppsScript } from '../utils/gdriveUpload';

type PelatihanSubMenu = 'OVERVIEW' | 'INHOUSE' | 'KERJASAMA' | 'STUDI' | 'OBSERVER' | 'MAGANG' | 'STANDAR_KEMENKES' | 'INTERNASIONAL' | 'TRAINER_SERTIFIKASI' | 'MANDIRI';

interface PelatihanProps {
  activeSubTab?: PelatihanSubMenu;
  onChangeSubTab?: (tab: PelatihanSubMenu) => void;
}

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

const UNIT_INSTALASI_KSM_KOMITE_OPTIONS = [
  ...KSM_OPTIONS,
  "Instalasi Gawat Darurat",
  "Instalasi Anestesi",
  "Instalasi Dialisis",
  "Instalasi Intervensi Vaskuler Terpadu",
  "Instalasi Kedokteran Fisik dan Rehabilitasi",
  "Instalasi Maternal Perinatal",
  "Instalasi Bedah Sentral",
  "Instalasi Rawat Inap",
  "Instalasi Rawat Intensif",
  "Instalasi Rawat Jalan",
  "Instalasi Pengobatan Tradisional",
  "Instalasi Onkologi Terpadu",
  "Instalasi Home Care dan Hospital Tourism",
  "Instalasi Pemeliharaan Sarana dan Sanitasi",
  "Instalasi Radiologi",
  "Instalasi Rekam Medis",
  "Instalasi Farmasi",
  "Instalasi CSSD dan Laundry",
  "Instalasi Gizi",
  "Instalasi Laboratorium Sentral",
  "Instalasi Teknologi Informasi",
  "Instalasi Laboratorium Riset",
  "Komite Medik",
  "Komite Keperawatan",
  "Komite Penunjang Pelayanan",
  "Komite Etik dan Hukum",
  "Komite Mutu",
  "Komite Keperawatan & Kebidanan",
  "Komite Pencegahan dan Pengendalian Infeksi (PPI)",
  "Komite Keselamatan dan Kesehatan Kerja Rumah Sakit (K3RS)"
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

function SearchableSelect({ options, value, onChange, placeholder = "Pilih..." }: { options: string[], value: string, onChange: (v: string) => void, placeholder?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <div 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm cursor-pointer hover:bg-white focus:ring-2 focus:ring-unair-blue/20 transition-all outline-none"
      >
        <span className={value ? "text-slate-900" : "text-slate-400"}>
          {value || placeholder}
        </span>
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => { setIsOpen(false); setSearchTerm(''); }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[70vh] z-10"
            >
              <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari KSM..."
                  className="flex-1 bg-transparent border-none outline-none text-sm placeholder-slate-400"
                  autoFocus
                />
                <button onClick={() => { setIsOpen(false); setSearchTerm(''); }} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
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
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between ${
                        value === option ? 'bg-unair-blue text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {option}
                      {value === option && <Check className="w-4 h-4" />}
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs italic">
                    KSM tidak ditemukan
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Pelatihan({ activeSubTab = 'OVERVIEW' }: PelatihanProps) {
  const { 
    dashboardStats, 
    pelatihanRecords, 
    addPelatihanRecord, 
    updatePelatihanRecord,
    deletePelatihanRecord, 
    pelatihanChart,
    // Sub-menus records & actions
    inhouseTrainingRecords, addInhouseTraining, updateInhouseTraining, deleteInhouseTraining,
    kerjasamaSkpRecords, addKerjasamaSkp, updateKerjasamaSkp, deleteKerjasamaSkp,
    studiBandingRecords, addStudiBanding, updateStudiBanding, deleteStudiBanding,
    dokterObserverRecords, addDokterObserver, updateDokterObserver, deleteDokterObserver,
    magangRecords, addMagang, updateMagang, deleteMagang,
    standarKemenkesRecords, addStandarKemenkes, updateStandarKemenkes, deleteStandarKemenkes,
    pelatihanInternasionalRecords, addPelatihanInternasional, updatePelatihanInternasional, deletePelatihanInternasional,
    trainerSertifikasiRecords, addTrainerSertifikasi, updateTrainerSertifikasi, deleteTrainerSertifikasi,
    pelatihanMandiriRecords, addPelatihanMandiri, updatePelatihanMandiri, deletePelatihanMandiri
  } = useSMKS();

  const activeSubMenu = activeSubTab;
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{id: string, type: PelatihanSubMenu} | null>(null);
  const [editTarget, setEditTarget] = useState<{id: string, type: PelatihanSubMenu, data: any} | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isUploadingEdit, setIsUploadingEdit] = useState<{[key: string]: boolean}>({});

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const [formU, setFormU] = useState({ namaKegiatan: '', tanggalMulai: '', tanggalSelesai: '', pengusul: '' });
  const [formI, setFormI] = useState({ namaKegiatan: '', tanggalPelaksanaan: '', pengusul: '', berkasKak: '', berkasKakName: '', berkasKakDriveUrl: '' });
  const [formK, setFormK] = useState({ judulKegiatan: '', tanggalKegiatan: '', lembagaKerjasama: '', pks: '', pksName: '', pksDriveUrl: '', berkasPendukung: '', berkasPendukungName: '', berkasPendukungDriveUrl: '', laporanPengendali: '', laporanPengendaliName: '', laporanPengendaliDriveUrl: '', totalPendapatan: 0 });
  const [formS, setFormS] = useState({ namaInstitusi: '', wahanaPembelajaran: '', tanggalPelaksanaan: '', totalPendapatan: 0, lpj: '', lpjName: '', lpjDriveUrl: '' });
  const [formO, setFormO] = useState({ nama: '', lulusanInstitusi: '', tanggalMulai: '', tanggalSelesai: '' });
  const [formMagang, setFormMagang] = useState({ jenisMagang: 'Magang Observer' as const, namaPeserta: '', namaInstitusi: '', tanggalMulai: '', tanggalSelesai: '', tempatPelaksanaan: '', totalPendapatan: 0, karyaIlmiah: '', sertifikat: '' });
  const [formStandarKemenkes, setFormStandarKemenkes] = useState({ judulPelatihan: '', dokumen: '', dokumenName: '', dokumenDriveUrl: '' });
  const [formInternasional, setFormInternasional] = useState({ namaKegiatan: '', tanggalKegiatan: '', lembagaKerjasama: '', lpj: '', lpjName: '', lpjDriveUrl: '', totalPendapatan: 0 });
  const [formTS, setFormTS] = useState({ namaPeserta: '', unitKerja: '', judulPelatihan: '', tanggalPelaksanaan: '', sertifikat: '', sertifikatName: '', sertifikatDriveUrl: '' });
  const [formPM, setFormPM] = useState({ 
    judulKegiatan: '', 
    tanggalKegiatan: '', 
    unitKerja: '', 
    lpj: '', 
    lpjName: '', 
    lpjDriveUrl: '', 
    suratKakRegistrasi: '', 
    suratKakRegistrasiName: '', 
    suratKakRegistrasiDriveUrl: '', 
    laporanPengendali: '', 
    laporanPengendaliName: '', 
    laporanPengendaliDriveUrl: '', 
    totalPendapatan: 0 
  });

  const handleEdit = (rec: any, type: PelatihanSubMenu) => {
    setEditTarget({ id: rec.id, type, data: rec });
    setEditForm({ ...rec });
  };

  const handleCancelEdit = () => {
    setEditTarget(null);
    setEditForm({});
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;

    if (editTarget.type === 'OVERVIEW') updatePelatihanRecord(editForm);
    else if (editTarget.type === 'INHOUSE') updateInhouseTraining(editForm);
    else if (editTarget.type === 'KERJASAMA') updateKerjasamaSkp(editForm);
    else if (editTarget.type === 'STUDI') updateStudiBanding(editForm);
    else if (editTarget.type === 'OBSERVER') updateDokterObserver(editForm);
    else if (editTarget.type === 'MAGANG') updateMagang(editForm);
    else if (editTarget.type === 'STANDAR_KEMENKES') updateStandarKemenkes(editForm);
    else if (editTarget.type === 'INTERNASIONAL') updatePelatihanInternasional(editForm);
    else if (editTarget.type === 'TRAINER_SERTIFIKASI') updateTrainerSertifikasi(editForm);
    else if (editTarget.type === 'MANDIRI') updatePelatihanMandiri(editForm);

    triggerSuccess(`Data ${editTarget.type.toLowerCase()} berhasil diupdate.`);
    handleCancelEdit();
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const tabs = [
    { id: 'OVERVIEW', label: 'Dashboard', icon: Target },
    { id: 'INHOUSE', label: 'Inhouse Training', icon: Activity },
    { id: 'KERJASAMA', label: 'Kerjasama SKP', icon: Handshake },
    { id: 'STUDI', label: 'Studi Banding', icon: Plane },
    { id: 'MAGANG', label: 'Magang', icon: Briefcase },
    { id: 'STANDAR_KEMENKES', label: 'Pelatihan Standar Kemenkes', icon: FileText },
    { id: 'INTERNASIONAL', label: 'Kerjasama Pelatihan Internasional', icon: Globe },
    { id: 'TRAINER_SERTIFIKASI', label: 'Trainer Tersertifikasi', icon: UserCheck },
    { id: 'MANDIRI', label: 'Pelatihan Mandiri ber-SKP', icon: Award }
  ];

  const stats = [
    {
      title: "Total Staf Dilatih",
      value: dashboardStats.pelatihan.totalTrained,
      trend: dashboardStats.pelatihan.totalTrained > 0 ? 15.4 : 0,
      icon: UsersRound,
      description: "Medis dan Non-Medis"
    },
    {
      title: "Rata-rata Jam Pelatihan",
      value: `${dashboardStats.pelatihan.avgHours} Jam`,
      trend: dashboardStats.pelatihan.avgHours > 0 ? 8.5 : 0,
      icon: Clock,
      description: "Per kapita / tahun"
    },
    {
      title: "Sertifikasi Profesi Baru",
      value: dashboardStats.pelatihan.certifiedStaff,
      trend: dashboardStats.pelatihan.certifiedStaff > 0 ? 10.0 : 0,
      icon: ShieldCheck,
      description: "Sertifikasi keahlian"
    },
    {
      title: "Penyerapan Anggaran RKAP",
      value: `${dashboardStats.pelatihan.budgetUtilization}%`,
      trend: dashboardStats.pelatihan.budgetUtilization > 0 ? 12.0 : 0,
      icon: Target,
      description: "Target RKAP Rp 150Jt"
    }
  ];

  const handleExportExcel = () => {
    const formatted = formatPelatihanExcel(pelatihanRecords);
    downloadExcelSheet('Riwayat Pelatihan', formatted, 'Riwayat_Pelatihan_RSUA');
  };

  const handleExportPDF = () => {
    generatePelatihanPdf(pelatihanRecords);
  };

  const getTopPelatihan = () => {
    return pelatihanRecords
      .map(r => ({ name: r.namaPelatihan, count: r.jumlahPeserta }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const topPelatihanList = getTopPelatihan();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Pelatihan & Pengembangan SDM</h1>
        <p className="text-slate-500 mt-1">Manajemen peningkatan kapasitas, sertifikasi kompetensi, dan pemantauan kepatuhan jam pelatihan staf.</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubMenu}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeSubMenu === 'OVERVIEW' && (
            <OverviewTab 
              stats={stats} 
              pelatihanRecords={pelatihanRecords} 
              pelatihanChart={pelatihanChart}
              handleExportExcel={handleExportExcel}
              handleExportPDF={handleExportPDF}
              setDeleteTarget={setDeleteTarget}
              onEdit={(rec: any) => handleEdit(rec, 'OVERVIEW')}
              addPelatihanRecord={addPelatihanRecord}
              updatePelatihanRecord={updatePelatihanRecord}
              topPelatihanList={topPelatihanList}
              successMsg={successMsg}
              triggerSuccess={triggerSuccess}
              formatRupiah={formatRupiah}
            />
          )}

          {activeSubMenu === 'INHOUSE' && (
            <GenericTab 
              title="Inhouse Training"
              description="Pelatihan internal yang diselenggarakan rutin oleh KSM atau instalasi rumah sakit."
              records={inhouseTrainingRecords}
              onAdd={addInhouseTraining}
              onUpdate={updateInhouseTraining}
              onDelete={(id: string) => setDeleteTarget({id, type: 'INHOUSE'})}
              onEdit={(rec: any) => handleEdit(rec, 'INHOUSE')}
              editTarget={editTarget?.type === 'INHOUSE' ? editTarget : null}
              onCancelEdit={handleCancelEdit}
              form={formI}
              setForm={setFormI}
              fields={[
                { key: 'namaKegiatan', label: 'Nama Kegiatan', type: 'text' },
                { key: 'tanggalPelaksanaan', label: 'Tanggal Pelaksanaan', type: 'date' },
                { key: 'pengusul', label: 'KSM / Instalasi Pengusul', type: 'ksm-select' },
                { key: 'berkasKak', label: 'Surat Permohonan, KAK (Upload)', type: 'file' }
              ]}
              successMsg={successMsg}
              triggerSuccess={triggerSuccess}
              handleExportExcel={() => {
                const formatted = formatInhouseTrainingExcel(inhouseTrainingRecords);
                downloadExcelSheet('Inhouse Training', formatted, 'Inhouse_Training_RSUA');
              }}
              handleExportPDF={() => generateInhouseTrainingPdf(inhouseTrainingRecords)}
            />
          )}

          {activeSubMenu === 'KERJASAMA' && (
            <GenericTab 
              title="Kerjasama Pelatihan Ber-SKP"
              description="Penyelenggaraan pelatihan dengan pengakuan Satuan Kredit Profesi (SKP)."
              records={kerjasamaSkpRecords}
              onAdd={addKerjasamaSkp}
              onUpdate={updateKerjasamaSkp}
              onDelete={(id: string) => setDeleteTarget({id, type: 'KERJASAMA'})}
              onEdit={(rec: any) => handleEdit(rec, 'KERJASAMA')}
              editTarget={editTarget?.type === 'KERJASAMA' ? editTarget : null}
              onCancelEdit={handleCancelEdit}
              form={formK}
              setForm={setFormK}
              fields={[
                { key: 'judulKegiatan', label: 'Judul Kegiatan', type: 'text' },
                { key: 'tanggalKegiatan', label: 'Tanggal Kegiatan', type: 'date' },
                { key: 'lembagaKerjasama', label: 'Lembaga Kerjasama', type: 'text' },
                { key: 'pks', label: 'PKS (Upload)', type: 'file' },
                { key: 'berkasPendukung', label: 'Surat Permohonan, KAK, Surat Registrasi (Upload)', type: 'file' },
                { key: 'laporanPengendali', label: 'Laporan Pengendali Pelatihan (Upload)', type: 'file' },
                { key: 'totalPendapatan', label: 'Total Pendapatan', type: 'number' }
              ]}
              successMsg={successMsg}
              triggerSuccess={triggerSuccess}
              handleExportExcel={() => {
                const formatted = formatKerjasamaSkpExcel(kerjasamaSkpRecords);
                downloadExcelSheet('Kerjasama SKP', formatted, 'Kerjasama_SKP_RSUA');
              }}
              handleExportPDF={() => generateKerjasamaSkpPdf(kerjasamaSkpRecords)}
            />
          )}

          {activeSubMenu === 'STUDI' && (
            <GenericTab 
              title="Studi Banding"
              description="Kegiatan kunjungan observasi ke institusi lain untuk peningkatan kualitas layanan."
              records={studiBandingRecords}
              onAdd={addStudiBanding}
              onUpdate={updateStudiBanding}
              onDelete={(id: string) => setDeleteTarget({id, type: 'STUDI'})}
              onEdit={(rec: any) => handleEdit(rec, 'STUDI')}
              editTarget={editTarget?.type === 'STUDI' ? editTarget : null}
              onCancelEdit={handleCancelEdit}
              form={formS}
              setForm={setFormS}
              fields={[
                { key: 'namaInstitusi', label: 'Nama Institusi', type: 'text' },
                { key: 'wahanaPembelajaran', label: 'Wahana Pembelajaran', type: 'text' },
                { key: 'tanggalPelaksanaan', label: 'Tanggal Pelaksanaan', type: 'date' },
                { key: 'totalPendapatan', label: 'Total Pendapatan', type: 'number' },
                { key: 'lpj', label: 'LPJ (Upload)', type: 'file' }
              ]}
              successMsg={successMsg}
              triggerSuccess={triggerSuccess}
              handleExportExcel={() => {
                const formatted = formatStudiBandingExcel(studiBandingRecords);
                downloadExcelSheet('Studi Banding', formatted, 'Studi_Banding_RSUA');
              }}
              handleExportPDF={() => generateStudiBandingPdf(studiBandingRecords)}
            />
          )}

          {activeSubMenu === 'OBSERVER' && (
            <GenericTab 
              title="Dokter Observer"
              description="Pendataan dokter tamu yang melakukan pengamatan klinis di lingkungan RS UNAIR."
              records={dokterObserverRecords}
              onAdd={addDokterObserver}
              onUpdate={updateDokterObserver}
              onDelete={(id: string) => setDeleteTarget({id, type: 'OBSERVER'})}
              onEdit={(rec: any) => handleEdit(rec, 'OBSERVER')}
              editTarget={editTarget?.type === 'OBSERVER' ? editTarget : null}
              onCancelEdit={handleCancelEdit}
              form={formO}
              setForm={setFormO}
              fields={[
                { key: 'nama', label: 'Nama Dokter', type: 'text' },
                { key: 'lulusanInstitusi', label: 'Lulusan Institusi Pendidikan', type: 'text' },
                { key: 'tanggalMulai', label: 'Tanggal Mulai', type: 'date' },
                { key: 'tanggalSelesai', label: 'Tanggal Berakhir', type: 'date' }
              ]}
              successMsg={successMsg}
              triggerSuccess={triggerSuccess}
              handleExportExcel={() => {
                const formatted = formatDokterObserverExcel(dokterObserverRecords);
                downloadExcelSheet('Dokter Observer', formatted, 'Dokter_Observer_RSUA');
              }}
              handleExportPDF={() => generateDokterObserverPdf(dokterObserverRecords)}
            />
          )}

          {activeSubMenu === 'MAGANG' && (
            <GenericTab 
              title="Magang"
              description="Manajemen data program magang observer dan magang kompetensi di lingkungan RS UNAIR."
              records={magangRecords}
              onAdd={addMagang}
              onUpdate={updateMagang}
              onDelete={(id: string) => setDeleteTarget({id, type: 'MAGANG'})}
              onEdit={(rec: any) => handleEdit(rec, 'MAGANG')}
              editTarget={editTarget?.type === 'MAGANG' ? editTarget : null}
              onCancelEdit={handleCancelEdit}
              form={formMagang}
              setForm={setFormMagang}
              fields={[
                { key: 'jenisMagang', label: 'Jenis Magang', type: 'select', options: ['Magang Observer', 'Magang Kompetensi'] },
                { key: 'namaPeserta', label: 'Nama Peserta Magang', type: 'text' },
                { key: 'namaInstitusi', label: 'Nama Institusi / Lulusan', type: 'text' },
                { key: 'tanggalMulai', label: 'Tanggal Pelaksanaan', type: 'date' },
                { key: 'tanggalSelesai', label: 'Tanggal Berakhir', type: 'date' },
                { key: 'tempatPelaksanaan', label: 'Tempat Pelaksanaan Magang', type: 'text' },
                { key: 'totalPendapatan', label: 'Total Pendapatan (Rp)', type: 'number' },
                { key: 'karyaIlmiah', label: 'Karya Ilmiah', type: 'file' },
                { key: 'sertifikat', label: 'Sertifikat Magang', type: 'file' }
              ]}
              successMsg={successMsg}
              triggerSuccess={triggerSuccess}
              handleExportExcel={() => {
                const formatted = formatMagangExcel(magangRecords);
                downloadExcelSheet('Data Magang', formatted, 'Data_Magang_RSUA');
              }}
              handleExportPDF={() => generateMagangPdf(magangRecords)}
            />
          )}

          {activeSubMenu === 'STANDAR_KEMENKES' && (
            <GenericTab 
              title="Pelatihan Standar Kemenkes"
              description="Kompilasi kurikulum pelatihan terstandar Kemenkes."
              records={standarKemenkesRecords}
              onAdd={addStandarKemenkes}
              onUpdate={updateStandarKemenkes}
              onDelete={(id: string) => setDeleteTarget({id, type: 'STANDAR_KEMENKES'})}
              onEdit={(rec: any) => handleEdit(rec, 'STANDAR_KEMENKES')}
              editTarget={editTarget?.type === 'STANDAR_KEMENKES' ? editTarget : null}
              onCancelEdit={handleCancelEdit}
              form={formStandarKemenkes}
              setForm={setFormStandarKemenkes}
              fields={[
                { key: 'judulPelatihan', label: 'Judul Pelatihan', type: 'text' },
                { key: 'dokumen', label: 'Upload File', type: 'file' }
              ]}
              successMsg={successMsg}
              triggerSuccess={triggerSuccess}
            />
          )}

          {activeSubMenu === 'INTERNASIONAL' && (
            <GenericTab 
              title="Kerjasama Pelatihan Internasional"
              description="Dokumentasi kerjasama pelatihan berskala internasional."
              records={pelatihanInternasionalRecords}
              onAdd={addPelatihanInternasional}
              onUpdate={updatePelatihanInternasional}
              onDelete={(id: string) => setDeleteTarget({id, type: 'INTERNASIONAL'})}
              onEdit={(rec: any) => handleEdit(rec, 'INTERNASIONAL')}
              editTarget={editTarget?.type === 'INTERNASIONAL' ? editTarget : null}
              onCancelEdit={handleCancelEdit}
              form={formInternasional}
              setForm={setFormInternasional}
              fields={[
                { key: 'namaKegiatan', label: 'Nama Kegiatan', type: 'text' },
                { key: 'tanggalKegiatan', label: 'Tanggal Kegiatan', type: 'date' },
                { key: 'lembagaKerjasama', label: 'Lembaga Kerjasama', type: 'text' },
                { key: 'lpj', label: 'LPJ (Upload)', type: 'file' },
                { key: 'totalPendapatan', label: 'Total Pendapatan', type: 'number' }
              ]}
              successMsg={successMsg}
              triggerSuccess={triggerSuccess}
            />
          )}

          {activeSubMenu === 'TRAINER_SERTIFIKASI' && (
            <GenericTab 
              title="Trainer Tersertifikasi"
              description="Bertambahnya jumlah trainer yang tersertifikasi berbagai bidang di RS UNAIR."
              records={trainerSertifikasiRecords}
              onAdd={addTrainerSertifikasi}
              onUpdate={updateTrainerSertifikasi}
              onDelete={(id: string) => setDeleteTarget({id, type: 'TRAINER_SERTIFIKASI'})}
              onEdit={(rec: any) => handleEdit(rec, 'TRAINER_SERTIFIKASI')}
              editTarget={editTarget?.type === 'TRAINER_SERTIFIKASI' ? editTarget : null}
              onCancelEdit={handleCancelEdit}
              form={formTS}
              setForm={setFormTS}
              fields={[
                { key: 'namaPeserta', label: 'Nama Peserta', type: 'text' },
                { key: 'unitKerja', label: 'Unit / Instalasi / KSM', type: 'ksm-pelaksana-select' },
                { key: 'judulPelatihan', label: 'Judul Pelatihan', type: 'text' },
                { key: 'tanggalPelaksanaan', label: 'Tanggal Kegiatan Pelatihan', type: 'date' },
                { key: 'sertifikat', label: 'Sertifikat (Upload)', type: 'file' }
              ]}
              successMsg={successMsg}
              triggerSuccess={triggerSuccess}
              handleExportExcel={() => {
                const formatted = formatTrainerSertifikasiExcel(trainerSertifikasiRecords);
                downloadExcelSheet('Trainer Tersertifikasi', formatted, 'Trainer_Tersertifikasi_RSUA');
              }}
              handleExportPDF={() => generateTrainerSertifikasiPdf(trainerSertifikasiRecords)}
            />
          )}

          {activeSubMenu === 'MANDIRI' && (
            <GenericTab 
              title="Pelatihan Mandiri ber-SKP"
              description="Kegiatan pelatihan dan peningkatan kompetensi ber-SKP yang dilaksanakan secara mandiri oleh RS UNAIR."
              records={pelatihanMandiriRecords}
              onAdd={addPelatihanMandiri}
              onUpdate={updatePelatihanMandiri}
              onDelete={(id: string) => setDeleteTarget({id, type: 'MANDIRI'})}
              onEdit={(rec: any) => handleEdit(rec, 'MANDIRI')}
              editTarget={editTarget?.type === 'MANDIRI' ? editTarget : null}
              onCancelEdit={handleCancelEdit}
              form={formPM}
              setForm={setFormPM}
              fields={[
                { key: 'judulKegiatan', label: 'Judul Kegiatan', type: 'text' },
                { key: 'tanggalKegiatan', label: 'Tanggal Kegiatan', type: 'date' },
                { key: 'unitKerja', label: 'Unit / Instalasi / KSM / Komite Pengaju', type: 'select', options: UNIT_INSTALASI_KSM_KOMITE_OPTIONS },
                { key: 'lpj', label: 'LPJ (Upload)', type: 'file' },
                { key: 'suratKakRegistrasi', label: 'Surat Permohonan, KAK, Surat Registrasi Kegiatan (Upload)', type: 'file' },
                { key: 'laporanPengendali', label: 'Laporan Pengendali Pelatihan (Upload)', type: 'file' },
                { key: 'totalPendapatan', label: 'Total Pendapatan', type: 'number' }
              ]}
              successMsg={successMsg}
              triggerSuccess={triggerSuccess}
              handleExportExcel={() => {
                const formatted = formatPelatihanMandiriExcel(pelatihanMandiriRecords);
                downloadExcelSheet('Pelatihan Mandiri ber-SKP', formatted, 'Pelatihan_Mandiri_RSUA');
              }}
              handleExportPDF={() => generatePelatihanMandiriPdf(pelatihanMandiriRecords)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <ConfirmDeleteModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          const { id, type } = deleteTarget;
          if (type === 'OVERVIEW') deletePelatihanRecord(id);
          else if (type === 'INHOUSE') deleteInhouseTraining(id);
          else if (type === 'KERJASAMA') deleteKerjasamaSkp(id);
          else if (type === 'STUDI') deleteStudiBanding(id);
          else if (type === 'OBSERVER') deleteDokterObserver(id);
          else if (type === 'MAGANG') deleteMagang(id);
          else if (type === 'STANDAR_KEMENKES') deleteStandarKemenkes(id);
          else if (type === 'INTERNASIONAL') deletePelatihanInternasional(id);
          else if (type === 'TRAINER_SERTIFIKASI') deleteTrainerSertifikasi(id);
          else if (type === 'MANDIRI') deletePelatihanMandiri(id);
          setDeleteTarget(null);
        }}
        title="Hapus Catatan Pelatihan"
        message="Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak dapat dibatalkan."
      />

      {/* Edit Modal */}
      <AnimatePresence>
        {editTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelEdit}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-unair-blue/10 flex items-center justify-center text-unair-blue">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Edit Data {editTarget.type === 'OVERVIEW' ? 'Pelatihan' : editTarget.type.toLowerCase().split('_').join(' ')}</h3>
                    <p className="text-xs text-slate-500">Perbarui informasi catatan di bawah ini.</p>
                  </div>
                </div>
                <button 
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                {editTarget.type === 'OVERVIEW' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Pelatihan</label>
                      <input 
                        type="text" 
                        value={editForm.namaPelatihan || ''} 
                        onChange={e => setEditForm({...editForm, namaPelatihan: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-unair-blue/20 transition-all outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Kategori</label>
                        <select 
                          value={editForm.kategori || 'Medis'} 
                          onChange={e => setEditForm({...editForm, kategori: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-unair-blue/20 transition-all outline-none"
                        >
                          <option value="Medis">Tenaga Medis</option>
                          <option value="Non-Medis">Tenaga Non-Medis</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Kuartal</label>
                        <select 
                          value={editForm.tanggal || '2026-01'} 
                          onChange={e => setEditForm({...editForm, tanggal: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-unair-blue/20 transition-all outline-none"
                        >
                          <option value="2026-01">TW I</option>
                          <option value="2026-02">TW II</option>
                          <option value="2026-03">TW III</option>
                          <option value="2026-04">TW IV</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Peserta</label>
                        <input 
                          type="number" 
                          value={editForm.jumlahPeserta || 0} 
                          onChange={e => setEditForm({...editForm, jumlahPeserta: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-unair-blue/20 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Jam</label>
                        <input 
                          type="number" 
                          value={editForm.totalJam || 0} 
                          onChange={e => setEditForm({...editForm, totalJam: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-unair-blue/20 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sertifikat</label>
                        <input 
                          type="number" 
                          value={editForm.sertifikasiBaru || 0} 
                          onChange={e => setEditForm({...editForm, sertifikasiBaru: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-unair-blue/20 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Render fields dynamically based on sub-menu type */}
                    {activeSubMenu === 'INHOUSE' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Kegiatan</label>
                          <input type="text" value={editForm.namaKegiatan || ''} onChange={e => setEditForm({...editForm, namaKegiatan: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal Pelaksanaan</label>
                          <input type="date" value={editForm.tanggalPelaksanaan || ''} onChange={e => setEditForm({...editForm, tanggalPelaksanaan: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">KSM / Instalasi Pengusul</label>
                          <SearchableSelect 
                            options={KSM_PELAKSANA_OPTIONS}
                            value={editForm.pengusul || ''} 
                            onChange={v => setEditForm({...editForm, pengusul: v})} 
                            placeholder="Pilih KSM / Instalasi..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Surat Permohonan, KAK (Upload)</label>
                          <div className="flex items-center gap-2">
                             <input 
                               type="file" 
                               disabled={isUploadingEdit['berkasKak']}
                               onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (!file) return;
                                 setIsUploadingEdit(prev => ({...prev, berkasKak: true}));
                                 const reader = new FileReader();
                                 reader.onloadend = async () => {
                                   try {
                                     const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                     setEditForm({...editForm, berkasKak: driveUrl, berkasKakName: file.name, berkasKakDriveUrl: driveUrl});
                                   } catch (err) {
                                     alert("Gagal mengunggah: " + (err instanceof Error ? err.message : String(err)));
                                   } finally {
                                     setIsUploadingEdit(prev => ({...prev, berkasKak: false}));
                                   }
                                 };
                                 reader.readAsDataURL(file);
                               }} 
                               className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" 
                             />
                             {isUploadingEdit.berkasKak && <div className="w-4 h-4 border-2 border-unair-blue border-t-transparent animate-spin rounded-full"></div>}
                          </div>
                          {editForm.berkasKak && (
                            <div className="mt-1 flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{editForm.berkasKakName || 'File Terupload'}</span>
                              <div className="flex gap-1">
                                <a href={editForm.berkasKak} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white rounded text-unair-blue"><ExternalLink className="w-3 h-3" /></a>
                                <button type="button" onClick={() => setEditForm({...editForm, berkasKak: '', berkasKakName: '', berkasKakDriveUrl: ''})} className="p-1 hover:bg-white rounded text-red-500"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {activeSubMenu === 'KERJASAMA' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Judul Kegiatan</label>
                          <input type="text" value={editForm.judulKegiatan || ''} onChange={e => setEditForm({...editForm, judulKegiatan: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal Kegiatan</label>
                          <input type="date" value={editForm.tanggalKegiatan || ''} onChange={e => setEditForm({...editForm, tanggalKegiatan: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Lembaga Kerjasama</label>
                          <input type="text" value={editForm.lembagaKerjasama || ''} onChange={e => setEditForm({...editForm, lembagaKerjasama: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Total Pendapatan</label>
                          <input type="number" value={editForm.totalPendapatan || 0} onChange={e => setEditForm({...editForm, totalPendapatan: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        
                        {/* PKS Upload */}
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">PKS (Upload)</label>
                          <div className="flex items-center gap-2">
                             <input 
                               type="file" 
                               disabled={isUploadingEdit['pks']}
                               onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (!file) return;
                                 setIsUploadingEdit(prev => ({...prev, pks: true}));
                                 const reader = new FileReader();
                                 reader.onloadend = async () => {
                                   try {
                                     const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                     setEditForm({...editForm, pks: driveUrl, pksName: file.name, pksDriveUrl: driveUrl});
                                   } catch (err) {
                                     alert("Gagal mengunggah: " + (err instanceof Error ? err.message : String(err)));
                                   } finally {
                                     setIsUploadingEdit(prev => ({...prev, pks: false}));
                                   }
                                 };
                                 reader.readAsDataURL(file);
                               }} 
                               className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" 
                             />
                             {isUploadingEdit.pks && <div className="w-4 h-4 border-2 border-unair-blue border-t-transparent animate-spin rounded-full"></div>}
                          </div>
                          {editForm.pks && (
                            <div className="mt-1 flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{editForm.pksName || 'File Terupload'}</span>
                              <div className="flex gap-1">
                                <a href={editForm.pks} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white rounded text-unair-blue"><ExternalLink className="w-3 h-3" /></a>
                                <button type="button" onClick={() => setEditForm({...editForm, pks: '', pksName: '', pksDriveUrl: ''})} className="p-1 hover:bg-white rounded text-red-500"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Berkas Pendukung Upload */}
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Berkas Pendukung (Upload)</label>
                          <div className="flex items-center gap-2">
                             <input 
                               type="file" 
                               disabled={isUploadingEdit['berkasPendukung']}
                               onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (!file) return;
                                 setIsUploadingEdit(prev => ({...prev, berkasPendukung: true}));
                                 const reader = new FileReader();
                                 reader.onloadend = async () => {
                                   try {
                                     const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                     setEditForm({...editForm, berkasPendukung: driveUrl, berkasPendukungName: file.name, berkasPendukungDriveUrl: driveUrl});
                                   } catch (err) {
                                     alert("Gagal mengunggah: " + (err instanceof Error ? err.message : String(err)));
                                   } finally {
                                     setIsUploadingEdit(prev => ({...prev, berkasPendukung: false}));
                                   }
                                 };
                                 reader.readAsDataURL(file);
                               }} 
                               className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" 
                             />
                             {isUploadingEdit.berkasPendukung && <div className="w-4 h-4 border-2 border-unair-blue border-t-transparent animate-spin rounded-full"></div>}
                          </div>
                          {editForm.berkasPendukung && (
                            <div className="mt-1 flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{editForm.berkasPendukungName || 'File Terupload'}</span>
                              <div className="flex gap-1">
                                <a href={editForm.berkasPendukung} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white rounded text-unair-blue"><ExternalLink className="w-3 h-3" /></a>
                                <button type="button" onClick={() => setEditForm({...editForm, berkasPendukung: '', berkasPendukungName: '', berkasPendukungDriveUrl: ''})} className="p-1 hover:bg-white rounded text-red-500"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Laporan Pengendali Upload */}
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Laporan Pengendali (Upload)</label>
                          <div className="flex items-center gap-2">
                             <input 
                               type="file" 
                               disabled={isUploadingEdit['laporanPengendali']}
                               onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (!file) return;
                                 setIsUploadingEdit(prev => ({...prev, laporanPengendali: true}));
                                 const reader = new FileReader();
                                 reader.onloadend = async () => {
                                   try {
                                     const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                     setEditForm({...editForm, laporanPengendali: driveUrl, laporanPengendaliName: file.name, laporanPengendaliDriveUrl: driveUrl});
                                   } catch (err) {
                                     alert("Gagal mengunggah: " + (err instanceof Error ? err.message : String(err)));
                                   } finally {
                                     setIsUploadingEdit(prev => ({...prev, laporanPengendali: false}));
                                   }
                                 };
                                 reader.readAsDataURL(file);
                               }} 
                               className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" 
                             />
                             {isUploadingEdit.laporanPengendali && <div className="w-4 h-4 border-2 border-unair-blue border-t-transparent animate-spin rounded-full"></div>}
                          </div>
                          {editForm.laporanPengendali && (
                            <div className="mt-1 flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{editForm.laporanPengendaliName || 'File Terupload'}</span>
                              <div className="flex gap-1">
                                <a href={editForm.laporanPengendali} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white rounded text-unair-blue"><ExternalLink className="w-3 h-3" /></a>
                                <button type="button" onClick={() => setEditForm({...editForm, laporanPengendali: '', laporanPengendaliName: '', laporanPengendaliDriveUrl: ''})} className="p-1 hover:bg-white rounded text-red-500"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {activeSubMenu === 'STUDI' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Institusi</label>
                          <input type="text" value={editForm.namaInstitusi || ''} onChange={e => setEditForm({...editForm, namaInstitusi: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Wahana Pembelajaran</label>
                          <input type="text" value={editForm.wahanaPembelajaran || ''} onChange={e => setEditForm({...editForm, wahanaPembelajaran: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal Pelaksanaan</label>
                          <input type="date" value={editForm.tanggalPelaksanaan || ''} onChange={e => setEditForm({...editForm, tanggalPelaksanaan: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Total Pendapatan</label>
                          <input type="number" value={editForm.totalPendapatan || 0} onChange={e => setEditForm({...editForm, totalPendapatan: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">LPJ (Upload)</label>
                          <div className="flex items-center gap-2">
                             <input 
                               type="file" 
                               disabled={isUploadingEdit['lpj']}
                               onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (!file) return;
                                 setIsUploadingEdit(prev => ({...prev, lpj: true}));
                                 const reader = new FileReader();
                                 reader.onloadend = async () => {
                                   try {
                                     const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                     setEditForm({...editForm, lpj: driveUrl, lpjName: file.name, lpjDriveUrl: driveUrl});
                                   } catch (err) {
                                     alert("Gagal mengunggah: " + (err instanceof Error ? err.message : String(err)));
                                   } finally {
                                     setIsUploadingEdit(prev => ({...prev, lpj: false}));
                                   }
                                 };
                                 reader.readAsDataURL(file);
                               }} 
                               className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" 
                             />
                             {isUploadingEdit.lpj && <div className="w-4 h-4 border-2 border-unair-blue border-t-transparent animate-spin rounded-full"></div>}
                          </div>
                          {editForm.lpj && (
                            <div className="mt-1 flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{editForm.lpjName || 'File Terupload'}</span>
                              <div className="flex gap-1">
                                <a href={editForm.lpj} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white rounded text-unair-blue"><ExternalLink className="w-3 h-3" /></a>
                                <button type="button" onClick={() => setEditForm({...editForm, lpj: '', lpjName: '', lpjDriveUrl: ''})} className="p-1 hover:bg-white rounded text-red-500"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {activeSubMenu === 'OBSERVER' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Dokter</label>
                          <input type="text" value={editForm.nama || ''} onChange={e => setEditForm({...editForm, nama: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Institusi</label>
                          <input type="text" value={editForm.lulusanInstitusi || ''} onChange={e => setEditForm({...editForm, lulusanInstitusi: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mulai</label>
                            <input type="date" value={editForm.tanggalMulai || ''} onChange={e => setEditForm({...editForm, tanggalMulai: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Selesai</label>
                            <input type="date" value={editForm.tanggalSelesai || ''} onChange={e => setEditForm({...editForm, tanggalSelesai: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                          </div>
                        </div>
                      </>
                    )}
                    {activeSubMenu === 'MAGANG' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Jenis Magang</label>
                            <select 
                              value={editForm.jenisMagang || 'Magang Observer'} 
                              onChange={e => setEditForm({...editForm, jenisMagang: e.target.value})} 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-250 border-slate-200 rounded-xl text-sm outline-none"
                            >
                              <option value="Magang Observer">Magang Observer</option>
                              <option value="Magang Kompetensi">Magang Kompetensi</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Peserta Magang</label>
                            <input 
                              type="text" 
                              value={editForm.namaPeserta || ''} 
                              onChange={e => setEditForm({...editForm, namaPeserta: e.target.value})} 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-250 border-slate-200 rounded-xl text-sm outline-none" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Institusi / Lulusan</label>
                          <input 
                            type="text" 
                            value={editForm.namaInstitusi || ''} 
                            onChange={e => setEditForm({...editForm, namaInstitusi: e.target.value})} 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-250 border-slate-200 rounded-xl text-sm outline-none" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal Pelaksanaan</label>
                            <input 
                              type="date" 
                              value={editForm.tanggalMulai || ''} 
                              onChange={e => setEditForm({...editForm, tanggalMulai: e.target.value})} 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-250 border-slate-200 rounded-xl text-sm outline-none" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal Berakhir</label>
                            <input 
                              type="date" 
                              value={editForm.tanggalSelesai || ''} 
                              onChange={e => setEditForm({...editForm, tanggalSelesai: e.target.value})} 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-250 border-slate-200 rounded-xl text-sm outline-none" 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tempat Pelaksanaan Magang</label>
                            <input 
                              type="text" 
                              value={editForm.tempatPelaksanaan || ''} 
                              onChange={e => setEditForm({...editForm, tempatPelaksanaan: e.target.value})} 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-250 border-slate-200 rounded-xl text-sm outline-none" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Total Pendapatan (Rp)</label>
                            <input 
                              type="number" 
                              value={editForm.totalPendapatan || 0} 
                              onChange={e => setEditForm({...editForm, totalPendapatan: parseInt(e.target.value) || 0})} 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-250 border-slate-200 rounded-xl text-sm outline-none" 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Karya Ilmiah</label>
                            <div className="relative border border-dashed border-slate-200 rounded-lg p-3 bg-slate-50 hover:bg-slate-100/50 transition-all flex flex-col items-center justify-center min-h-[80px] cursor-pointer">
                              <input 
                                type="file"
                                disabled={isUploadingEdit['karyaIlmiah']}
                                onChange={async e => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setIsUploadingEdit(p => ({...p, karyaIlmiah: true}));
                                    const reader = new FileReader();
                                    reader.onloadend = async () => {
                                      try {
                                        const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                        setEditForm({
                                          ...editForm,
                                          karyaIlmiah: file.name,
                                          karyaIlmiahDriveUrl: driveUrl,
                                          karyaIlmiahContent: '', // Clear content to force drive preview mode
                                          karyaIlmiahType: file.type
                                        });
                                      } catch (err) {
                                        alert("Gagal mengunggah ke Google Drive: " + (err instanceof Error ? err.message : String(err)));
                                        setEditForm({
                                          ...editForm,
                                          karyaIlmiah: file.name,
                                          karyaIlmiahContent: reader.result as string,
                                          karyaIlmiahType: file.type
                                        });
                                      } finally {
                                        setIsUploadingEdit(p => ({...p, karyaIlmiah: false}));
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <FolderPlus className={`w-5 h-5 text-unair-gold mb-1 ${isUploadingEdit['karyaIlmiah'] ? 'animate-spin' : ''}`} />
                              <span className="text-center text-[10px] font-semibold text-slate-500 truncate max-w-full px-1">
                                {isUploadingEdit['karyaIlmiah'] ? (
                                  <span className="text-amber-600 font-bold animate-pulse">Mengunggah...</span>
                                ) : editForm.karyaIlmiah ? (
                                  <span className="text-emerald-700 font-bold">✓ GDrive: {editForm.karyaIlmiah}</span>
                                ) : (
                                  "Ubah Karya Ilmiah..."
                                )}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sertifikat Magang</label>
                            <div className="relative border border-dashed border-slate-200 rounded-lg p-3 bg-slate-50 hover:bg-slate-100/50 transition-all flex flex-col items-center justify-center min-h-[80px] cursor-pointer">
                              <input 
                                type="file"
                                disabled={isUploadingEdit['sertifikat']}
                                onChange={async e => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setIsUploadingEdit(p => ({...p, sertifikat: true}));
                                    const reader = new FileReader();
                                    reader.onloadend = async () => {
                                      try {
                                        const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                        setEditForm({
                                          ...editForm,
                                          sertifikat: file.name,
                                          sertifikatDriveUrl: driveUrl,
                                          sertifikatContent: '', // Clear content to force drive preview mode
                                          sertifikatType: file.type
                                        });
                                      } catch (err) {
                                        alert("Gagal mengunggah ke Google Drive: " + (err instanceof Error ? err.message : String(err)));
                                        setEditForm({
                                          ...editForm,
                                          sertifikat: file.name,
                                          sertifikatContent: reader.result as string,
                                          sertifikatType: file.type
                                        });
                                      } finally {
                                        setIsUploadingEdit(p => ({...p, sertifikat: false}));
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <FolderPlus className={`w-5 h-5 text-unair-gold mb-1 ${isUploadingEdit['sertifikat'] ? 'animate-spin' : ''}`} />
                              <span className="text-center text-[10px] font-semibold text-slate-550 truncate max-w-full px-1">
                                {isUploadingEdit['sertifikat'] ? (
                                  <span className="text-amber-600 font-bold animate-pulse">Mengunggah...</span>
                                ) : editForm.sertifikat ? (
                                  <span className="text-emerald-700 font-bold">✓ GDrive: {editForm.sertifikat}</span>
                                ) : (
                                  "Ubah Sertifikat..."
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {activeSubMenu === 'STANDAR_KEMENKES' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Judul Pelatihan</label>
                          <input type="text" value={editForm.judulPelatihan || ''} onChange={e => setEditForm({...editForm, judulPelatihan: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Dokumen (Upload)</label>
                          <div className="flex items-center gap-2">
                             <input 
                               type="file" 
                               disabled={isUploadingEdit['dokumen']}
                               onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (!file) return;
                                 setIsUploadingEdit(prev => ({...prev, dokumen: true}));
                                 const reader = new FileReader();
                                 reader.onloadend = async () => {
                                   try {
                                     const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                     setEditForm({...editForm, dokumen: driveUrl, dokumenName: file.name, dokumenDriveUrl: driveUrl});
                                   } catch (err) {
                                     alert("Gagal mengunggah: " + (err instanceof Error ? err.message : String(err)));
                                   } finally {
                                     setIsUploadingEdit(prev => ({...prev, dokumen: false}));
                                   }
                                 };
                                 reader.readAsDataURL(file);
                               }} 
                               className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" 
                             />
                             {isUploadingEdit.dokumen && <div className="w-4 h-4 border-2 border-unair-blue border-t-transparent animate-spin rounded-full"></div>}
                          </div>
                          {editForm.dokumen && (
                            <div className="mt-1 flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{editForm.dokumenName || 'File Terupload'}</span>
                              <div className="flex gap-1">
                                <a href={editForm.dokumen} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white rounded text-unair-blue"><ExternalLink className="w-3 h-3" /></a>
                                <button type="button" onClick={() => setEditForm({...editForm, dokumen: '', dokumenName: '', dokumenDriveUrl: ''})} className="p-1 hover:bg-white rounded text-red-500"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {activeSubMenu === 'INTERNASIONAL' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Kegiatan</label>
                          <input type="text" value={editForm.namaKegiatan || ''} onChange={e => setEditForm({...editForm, namaKegiatan: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal Kegiatan</label>
                          <input type="date" value={editForm.tanggalKegiatan || ''} onChange={e => setEditForm({...editForm, tanggalKegiatan: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Lembaga Kerjasama</label>
                          <input type="text" value={editForm.lembagaKerjasama || ''} onChange={e => setEditForm({...editForm, lembagaKerjasama: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Total Pendapatan</label>
                          <input type="number" value={editForm.totalPendapatan || 0} onChange={e => setEditForm({...editForm, totalPendapatan: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">LPJ (Upload)</label>
                          <div className="flex items-center gap-2">
                             <input 
                               type="file" 
                               disabled={isUploadingEdit['lpj']}
                               onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (!file) return;
                                 setIsUploadingEdit(prev => ({...prev, lpj: true}));
                                 const reader = new FileReader();
                                 reader.onloadend = async () => {
                                   try {
                                     const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                     setEditForm({...editForm, lpj: driveUrl, lpjName: file.name, lpjDriveUrl: driveUrl});
                                   } catch (err) {
                                     alert("Gagal mengunggah: " + (err instanceof Error ? err.message : String(err)));
                                   } finally {
                                     setIsUploadingEdit(prev => ({...prev, lpj: false}));
                                   }
                                 };
                                 reader.readAsDataURL(file);
                               }} 
                               className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" 
                             />
                             {isUploadingEdit.lpj && <div className="w-4 h-4 border-2 border-unair-blue border-t-transparent animate-spin rounded-full"></div>}
                          </div>
                          {editForm.lpj && (
                            <div className="mt-1 flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{editForm.lpjName || 'File Terupload'}</span>
                              <div className="flex gap-1">
                                <a href={editForm.lpj} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white rounded text-unair-blue"><ExternalLink className="w-3 h-3" /></a>
                                <button type="button" onClick={() => setEditForm({...editForm, lpj: '', lpjName: '', lpjDriveUrl: ''})} className="p-1 hover:bg-white rounded text-red-500"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {activeSubMenu === 'TRAINER_SERTIFIKASI' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Peserta</label>
                          <input type="text" value={editForm.namaPeserta || ''} onChange={e => setEditForm({...editForm, namaPeserta: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Unit / Instalasi / KSM</label>
                          <SearchableSelect 
                            options={KSM_PELAKSANA_OPTIONS}
                            value={editForm.unitKerja || ''} 
                            onChange={v => setEditForm({...editForm, unitKerja: v})} 
                            placeholder="Pilih Unit / Instalasi / KSM..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Judul Pelatihan</label>
                          <input type="text" value={editForm.judulPelatihan || ''} onChange={e => setEditForm({...editForm, judulPelatihan: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal Kegiatan Pelatihan</label>
                          <input type="date" value={editForm.tanggalPelaksanaan || ''} onChange={e => setEditForm({...editForm, tanggalPelaksanaan: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sertifikat (Upload)</label>
                          <div className="flex items-center gap-2">
                             <input 
                               type="file" 
                               disabled={isUploadingEdit['sertifikat']}
                               onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (!file) return;
                                 setIsUploadingEdit(prev => ({...prev, sertifikat: true}));
                                 const reader = new FileReader();
                                 reader.onloadend = async () => {
                                   try {
                                     const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                     setEditForm({...editForm, sertifikat: driveUrl, sertifikatName: file.name, sertifikatDriveUrl: driveUrl});
                                   } catch (err) {
                                     alert("Gagal mengunggah: " + (err instanceof Error ? err.message : String(err)));
                                   } finally {
                                     setIsUploadingEdit(prev => ({...prev, sertifikat: false}));
                                   }
                                 };
                                 reader.readAsDataURL(file);
                               }} 
                               className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" 
                             />
                             {isUploadingEdit.sertifikat && <div className="w-4 h-4 border-2 border-unair-blue border-t-transparent animate-spin rounded-full"></div>}
                          </div>
                          {editForm.sertifikat && (
                            <div className="mt-1 flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{editForm.sertifikatName || 'File Terupload'}</span>
                              <div className="flex gap-1">
                                <a href={editForm.sertifikat} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white rounded text-unair-blue"><ExternalLink className="w-3 h-3" /></a>
                                <button type="button" onClick={() => setEditForm({...editForm, sertifikat: '', sertifikatName: '', sertifikatDriveUrl: ''})} className="p-1 hover:bg-white rounded text-red-500"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {editTarget.type === 'MANDIRI' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Judul Kegiatan</label>
                          <input type="text" value={editForm.judulKegiatan || ''} onChange={e => setEditForm({...editForm, judulKegiatan: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal Kegiatan</label>
                          <input type="date" value={editForm.tanggalKegiatan || ''} onChange={e => setEditForm({...editForm, tanggalKegiatan: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Unit / Instalasi / KSM / Komite Pengaju</label>
                          <SearchableSelect 
                            options={UNIT_INSTALASI_KSM_KOMITE_OPTIONS}
                            value={editForm.unitKerja || ''} 
                            onChange={v => setEditForm({...editForm, unitKerja: v})} 
                            placeholder="Pilih Unit / Instalasi / KSM / Komite..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">LPJ (Upload)</label>
                          <div className="flex items-center gap-2">
                             <input 
                               type="file" 
                               disabled={isUploadingEdit['lpj']}
                               onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (!file) return;
                                 setIsUploadingEdit(prev => ({...prev, lpj: true}));
                                 const reader = new FileReader();
                                 reader.onloadend = async () => {
                                   try {
                                     const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                     setEditForm({...editForm, lpj: driveUrl, lpjName: file.name, lpjDriveUrl: driveUrl});
                                   } catch (err) {
                                     alert("Gagal mengunggah: " + (err instanceof Error ? err.message : String(err)));
                                   } finally {
                                     setIsUploadingEdit(prev => ({...prev, lpj: false}));
                                   }
                                 };
                                 reader.readAsDataURL(file);
                               }} 
                               className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" 
                             />
                             {isUploadingEdit.lpj && <div className="w-4 h-4 border-2 border-unair-blue border-t-transparent animate-spin rounded-full"></div>}
                          </div>
                          {editForm.lpj && (
                            <div className="mt-1 flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{editForm.lpjName || 'File Terupload'}</span>
                              <div className="flex gap-1">
                                <a href={editForm.lpj} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white rounded text-unair-blue"><ExternalLink className="w-3 h-3" /></a>
                                <button type="button" onClick={() => setEditForm({...editForm, lpj: '', lpjName: '', lpjDriveUrl: ''})} className="p-1 hover:bg-white rounded text-red-500"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Surat Permohonan, KAK, Surat Registrasi Kegiatan (Upload)</label>
                          <div className="flex items-center gap-2">
                             <input 
                               type="file" 
                               disabled={isUploadingEdit['suratKakRegistrasi']}
                               onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (!file) return;
                                 setIsUploadingEdit(prev => ({...prev, suratKakRegistrasi: true}));
                                 const reader = new FileReader();
                                 reader.onloadend = async () => {
                                   try {
                                     const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                     setEditForm({...editForm, suratKakRegistrasi: driveUrl, suratKakRegistrasiName: file.name, suratKakRegistrasiDriveUrl: driveUrl});
                                   } catch (err) {
                                     alert("Gagal mengunggah: " + (err instanceof Error ? err.message : String(err)));
                                   } finally {
                                     setIsUploadingEdit(prev => ({...prev, suratKakRegistrasi: false}));
                                   }
                                 };
                                 reader.readAsDataURL(file);
                               }} 
                               className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" 
                             />
                             {isUploadingEdit.suratKakRegistrasi && <div className="w-4 h-4 border-2 border-unair-blue border-t-transparent animate-spin rounded-full"></div>}
                          </div>
                          {editForm.suratKakRegistrasi && (
                            <div className="mt-1 flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{editForm.suratKakRegistrasiName || 'File Terupload'}</span>
                              <div className="flex gap-1">
                                <a href={editForm.suratKakRegistrasi} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white rounded text-unair-blue"><ExternalLink className="w-3 h-3" /></a>
                                <button type="button" onClick={() => setEditForm({...editForm, suratKakRegistrasi: '', suratKakRegistrasiName: '', suratKakRegistrasiDriveUrl: ''})} className="p-1 hover:bg-white rounded text-red-500"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Laporan Pengendali Pelatihan (Upload)</label>
                          <div className="flex items-center gap-2">
                             <input 
                               type="file" 
                               disabled={isUploadingEdit['laporanPengendali']}
                               onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (!file) return;
                                 setIsUploadingEdit(prev => ({...prev, laporanPengendali: true}));
                                 const reader = new FileReader();
                                 reader.onloadend = async () => {
                                   try {
                                     const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                     setEditForm({...editForm, laporanPengendali: driveUrl, laporanPengendaliName: file.name, laporanPengendaliDriveUrl: driveUrl});
                                   } catch (err) {
                                     alert("Gagal mengunggah: " + (err instanceof Error ? err.message : String(err)));
                                   } finally {
                                     setIsUploadingEdit(prev => ({...prev, laporanPengendali: false}));
                                   }
                                 };
                                 reader.readAsDataURL(file);
                               }} 
                               className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" 
                             />
                             {isUploadingEdit.laporanPengendali && <div className="w-4 h-4 border-2 border-unair-blue border-t-transparent animate-spin rounded-full"></div>}
                          </div>
                          {editForm.laporanPengendali && (
                            <div className="mt-1 flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{editForm.laporanPengendaliName || 'File Terupload'}</span>
                              <div className="flex gap-1">
                                <a href={editForm.laporanPengendali} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white rounded text-unair-blue"><ExternalLink className="w-3 h-3" /></a>
                                <button type="button" onClick={() => setEditForm({...editForm, laporanPengendali: '', laporanPengendaliName: '', laporanPengendaliDriveUrl: ''})} className="p-1 hover:bg-white rounded text-red-500"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Total Pendapatan</label>
                          <input type="number" value={editForm.totalPendapatan === undefined ? 0 : editForm.totalPendapatan} onChange={e => setEditForm({...editForm, totalPendapatan: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-unair-blue/20" />
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={Object.values(isUploadingEdit).some(Boolean)}
                    className="flex-1 py-3 px-4 bg-unair-blue hover:bg-unair-blue-light text-white font-bold rounded-xl shadow-lg shadow-unair-blue/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {Object.values(isUploadingEdit).some(Boolean) ? 'Mengunggah Berkas...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components for better organization
function OverviewTab({ 
  stats, pelatihanRecords, pelatihanChart, handleExportExcel, handleExportPDF, 
  setDeleteTarget, onEdit, addPelatihanRecord, updatePelatihanRecord, topPelatihanList, successMsg, triggerSuccess, formatRupiah 
}: any) {
  const [localForm, setLocalForm] = useState({
    nama: '', kategori: 'Medis', peserta: 25, jam: 16, sert: 10, budget: 15_000_000, date: '2026-01'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPelatihanRecord({
      namaPelatihan: localForm.nama,
      kategori: localForm.kategori as any,
      jumlahPeserta: localForm.peserta,
      totalJam: localForm.jam,
      sertifikasiBaru: localForm.sert,
      anggaranRealisasi: localForm.budget,
      tanggal: localForm.date
    });
    triggerSuccess('Pelatihan record successfully added.');
    setLocalForm({ nama: '', kategori: 'Medis', peserta: 25, jam: 16, sert: 10, budget: 15_000_000, date: '2026-01' });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat: any, i: number) => (
          <StatCard key={i} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 font-sans">Tren Peserta Pelatihan Internal (Kuartalan)</h3>
            {pelatihanRecords.length === 0 ? (
              <div className="h-80 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-250">
                <Info className="w-10 h-10 mb-2 stroke-1 text-slate-350" />
                <p className="text-sm">Belum ada sebaran peserta pelatihan aktif.</p>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={pelatihanChart}>
                    <defs>
                      <linearGradient id="colorMedis" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1A365D" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#1A365D" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorNonMedis" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D69E2E" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#D69E2E" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                    <Area type="monotone" dataKey="medis" name="Staf Medis" stroke="#1A365D" fillOpacity={1} fill="url(#colorMedis)" />
                    <Area type="monotone" dataKey="nonMedis" name="Staf Non-Medis" stroke="#D69E2E" fillOpacity={1} fill="url(#colorNonMedis)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
              <h3 className="text-lg font-semibold text-slate-900 font-sans">Daftar Pelaksanaan Pelatihan</h3>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleExportExcel} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded transition-colors cursor-pointer">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" /> Ekspor Excel
                </button>
                <button onClick={handleExportPDF} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded transition-colors cursor-pointer">
                  <FileText className="w-3.5 h-3.5 text-red-600" /> Ekspor PDF
                </button>
              </div>
            </div>
            
            {pelatihanRecords.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <p>Belum ada data pelatihan terekam.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Nama Pelatihan</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Kategori</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Peserta</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Jam</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Sertifikasi</th>
                      <th className="px-3 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100 text-sm">
                    {pelatihanRecords.map((item: any) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3.5 font-medium text-slate-900">{item.namaPelatihan}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${item.kategori === 'Medis' ? 'bg-unair-blue/10 text-unair-blue' : 'bg-amber-100 text-amber-800'}`}>
                            {item.kategori}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-650 font-semibold">{item.jumlahPeserta} org</td>
                        <td className="px-4 py-3.5 text-slate-500">{item.totalJam} Jam</td>
                        <td className="px-4 py-3.5 font-medium text-emerald-600">+{item.sertifikasiBaru}</td>
                        <td className="px-3 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => onEdit(item)}
                              className="p-1.5 text-slate-400 hover:text-unair-blue hover:bg-unair-blue/5 rounded-lg transition-all cursor-pointer"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteTarget({id: item.id, type: 'OVERVIEW'})} className="text-rose-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-unair-gold" /> Tambah Pelatihan
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Nama Pelatihan" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white transition-all outline-none" value={localForm.nama || ''} onChange={e => setLocalForm({...localForm, nama: e.target.value})} />
              <select className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white transition-all outline-none" value={localForm.kategori || 'Medis'} onChange={e => setLocalForm({...localForm, kategori: e.target.value})} >
                <option value="Medis">Tenaga Medis</option>
                <option value="Non-Medis">Tenaga Non-Medis</option>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Peserta" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white transition-all outline-none" value={localForm.peserta || ''} onChange={e => setLocalForm({...localForm, peserta: parseInt(e.target.value) || 0})} />
                <input type="number" placeholder="Jam" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white transition-all outline-none" value={localForm.jam || ''} onChange={e => setLocalForm({...localForm, jam: parseInt(e.target.value) || 0})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Sertifikat" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white transition-all outline-none" value={localForm.sert || ''} onChange={e => setLocalForm({...localForm, sert: parseInt(e.target.value) || 0})} />
                <select className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white transition-all outline-none" value={localForm.date || '2026-01'} onChange={e => setLocalForm({...localForm, date: e.target.value})}>
                  <option value="2026-01">TW I</option>
                  <option value="2026-02">TW II</option>
                  <option value="2026-03">TW III</option>
                  <option value="2026-04">TW IV</option>
                </select>
              </div>
              <input type="number" placeholder="Anggaran" className="w-full px-3 py-2 border rounded-lg text-sm font-mono bg-slate-50 focus:bg-white transition-all outline-none" value={localForm.budget || ''} onChange={e => setLocalForm({...localForm, budget: parseInt(e.target.value) || 0})} />
              <button type="submit" className="w-full py-2.5 bg-unair-blue text-white font-bold rounded-lg hover:bg-unair-blue-light transition-colors shadow-lg shadow-unair-blue/20">
                Simpan Data
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Top Pelatihan Paling Padat</h3>
            {topPelatihanList.length === 0 ? (
              <p className="text-xs text-slate-450">Belum ada sebaran pelatihan.</p>
            ) : (
              <ul className="space-y-3">
                {topPelatihanList.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-center justify-between text-sm text-slate-700">
                    <span className="truncate pr-4 font-medium">{item.name}</span>
                    <span className="font-semibold text-unair-blue">{item.count} org</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GenericTab({ 
  title, description, records, onAdd, onUpdate, onDelete, onEdit, editTarget, 
  onCancelEdit, form, setForm, fields, successMsg, triggerSuccess, handleExportExcel, handleExportPDF 
}: any) {
  const [uploadingKeys, setUploadingKeys] = useState<{[key: string]: boolean}>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTarget) {
      onUpdate({ ...form, id: editTarget.id });
      onCancelEdit();
      triggerSuccess(`${title} record successfully updated.`);
    } else {
      onAdd(form);
      const clearedForm = {...form};
      Object.keys(clearedForm).forEach(k => {
        if (typeof clearedForm[k] === 'number') clearedForm[k] = 0;
        else if (k === 'statusKepatuhan') clearedForm[k] = 'Patuh';
        else if (k === 'tipeKerjasama') clearedForm[k] = 'Mandiri';
        else clearedForm[k] = '';
      });
      setForm(clearedForm);
      triggerSuccess(`${title} record successfully added.`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Plus className="w-24 h-24 text-unair-blue" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{title}</h3>
              <p className="text-slate-500 text-sm max-w-2xl">{description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleExportExcel} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded transition-colors cursor-pointer">
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> Ekspor Excel
              </button>
              <button onClick={handleExportPDF} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded transition-colors cursor-pointer">
                <FileText className="w-3.5 h-3.5 text-red-600" /> Ekspor PDF
              </button>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-white">
                <tr>
                  {fields.map((f: any) => (
                    <th key={f.key} className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.label}</th>
                  ))}
                  <th className="px-4 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={fields.length + 1} className="px-4 py-12 text-center text-slate-400 italic text-sm">
                      Belum ada data tersedia.
                    </td>
                  </tr>
                ) : (
                  records.map((rec: any) => (
                    <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                      {fields.map((f: any) => (
                        <td key={f.key} className="px-4 py-3.5 text-sm">
                          {f.key.toLowerCase().includes('status') ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${rec[f.key] === 'Patuh' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {rec[f.key] === 'Patuh' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {rec[f.key]}
                            </span>
                          ) : f.key === 'totalPendapatan' ? (
                            <span className="text-emerald-600 font-bold font-mono">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(rec[f.key] || 0)}</span>
                          ) : f.type === 'file' ? (
                            rec[f.key] ? (
                              <button 
                                onClick={() => {
                                  const url = rec[f.key + 'DriveUrl'] || rec[f.key];
                                  if (url) {
                                    if (url.startsWith('http') || url.includes('drive.google.com')) {
                                      window.open(url, '_blank', 'noopener,noreferrer');
                                    } else {
                                      // Handle local data URLs (base64) or fallback
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
                                        // If everything fails, at least attempt a direct window open if it looks like a URL
                                        if (url.length < 2000) window.open(url, '_blank');
                                      }
                                    }
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 hover:text-amber-800 rounded text-xs font-semibold cursor-pointer transition-all select-none group"
                                title="Klik untuk Lihat Dokumen"
                                type="button"
                              >
                                <FileText className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" /> 
                                <span className="hover:underline">{rec[f.key]}</span>
                                <Eye className="w-3 h-3 text-amber-500 ml-0.5 opacity-80 group-hover:opacity-100" />
                              </button>
                            ) : (
                              <span className="text-slate-400 text-xs italic">Belum diunggah</span>
                            )
                          ) : (
                            <span className="text-slate-700 font-medium truncate max-w-[150px] block">{rec[f.key]}</span>
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => onEdit(rec)}
                            className="p-1.5 text-slate-400 hover:text-unair-blue hover:bg-unair-blue/5 rounded-lg transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onDelete(rec.id)} 
                            className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-8 relative overflow-hidden">
          {editTarget && (
            <div className="absolute top-0 right-0 p-3">
              <span className="px-2 py-1 bg-unair-blue/10 text-unair-blue text-[10px] font-black uppercase rounded block">Mode Edit</span>
            </div>
          )}
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-unair-gold" /> {editTarget ? 'Update Data' : 'Input Data Baru'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f: any) => (
              <div key={f.key}>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{f.label}</label>
                {f.type === 'select' ? (
                  <select 
                    value={form[f.key] || ''} 
                    onChange={e => setForm({...form, [f.key]: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-unair-blue/20 transition-all outline-none"
                  >
                    {f.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : f.type === 'ksm-select' ? (
                  <SearchableSelect 
                    value={form[f.key] || ''} 
                    onChange={v => setForm({...form, [f.key]: v})} 
                    options={KSM_OPTIONS}
                  />
                ) : f.type === 'ksm-pelaksana-select' ? (
                  <SearchableSelect 
                    value={form[f.key] || ''} 
                    onChange={v => setForm({...form, [f.key]: v})} 
                    options={KSM_PELAKSANA_OPTIONS}
                  />
                ) : f.type === 'textarea' ? (
                  <textarea 
                    value={form[f.key] || ''} 
                    onChange={e => setForm({...form, [f.key]: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-unair-blue/20 transition-all min-h-[100px] outline-none"
                    placeholder={f.placeholder}
                  />
                ) : f.type === 'file' ? (
                  <div className="relative border border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-slate-100/50 transition-all flex flex-col items-center justify-center min-h-[90px] cursor-pointer">
                    <input 
                      type="file"
                      disabled={uploadingKeys[f.key]}
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadingKeys(prev => ({ ...prev, [f.key]: true }));
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            try {
                              const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                              setForm({
                                ...form,
                                [f.key]: file.name,
                                [f.key + 'DriveUrl']: driveUrl,
                                [f.key + 'Content']: '', // Clear local content to trigger google drive viewport
                                [f.key + 'Type']: file.type
                              });
                            } catch (err) {
                              alert("Gagal mengunggah ke Google Drive: " + (err instanceof Error ? err.message : String(err)));
                              setForm({
                                ...form,
                                [f.key]: file.name,
                                [f.key + 'Content']: reader.result as string,
                                [f.key + 'Type']: file.type
                              });
                            } finally {
                              setUploadingKeys(prev => ({ ...prev, [f.key]: false }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <FolderPlus className={`w-7 h-7 text-unair-gold mb-1 ${uploadingKeys[f.key] ? 'animate-spin' : ''}`} />
                    <span className="text-center text-xs font-semibold text-slate-500">
                      {uploadingKeys[f.key] ? (
                        <span className="text-amber-600 font-bold animate-pulse">Mengunggah ke Google Drive...</span>
                      ) : form[f.key] ? (
                        <span className="text-emerald-700 font-bold">✓ GDrive: {form[f.key]}</span>
                      ) : (
                        "Pilih atau Seret Berkas..."
                      )}
                    </span>
                  </div>
                ) : (
                  <input 
                    type={f.type} 
                    value={form[f.key] === undefined ? (f.type === 'number' ? 0 : '') : form[f.key]} 
                    onChange={e => setForm({...form, [f.key]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-unair-blue/20 transition-all outline-none"
                    placeholder={f.placeholder}
                  />
                )}
              </div>
            ))}
            
            {successMsg && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-2 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg text-center">
                {successMsg}
              </motion.div>
            )}

            <div className="flex gap-2">
              {editTarget && (
                <button 
                  type="button" 
                  onClick={onCancelEdit} 
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Batal
                </button>
              )}
              <button 
                type="submit" 
                disabled={Object.values(uploadingKeys).some(Boolean)}
                className="flex-2 py-3 bg-unair-blue hover:bg-unair-blue-light text-white font-black text-xs uppercase tracking-tighter rounded-lg shadow-lg shadow-unair-blue/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {Object.values(uploadingKeys).some(Boolean) ? 'Mengunggah...' : (editTarget ? 'Simpan Perubahan' : `Simpan ${title}`)}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* File Preview Modal Removed - Redirecting directly to new tab */}
    </div>
  );
}

// End of Pelatihan.tsx

