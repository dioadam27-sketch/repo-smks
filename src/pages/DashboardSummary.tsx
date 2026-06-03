import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Coins,
  Briefcase, 
  Lightbulb, 
  ChevronRight, 
  Users, 
  BookOpen, 
  FileText, 
  Award, 
  Clock, 
  Globe, 
  Activity, 
  TrendingUp, 
  Layers,
  ArrowRight,
  ArrowLeft,
  Search,
  ExternalLink,
  Plus,
  Percent,
  CheckCircle2,
  ShieldAlert,
  Building2,
  FileSpreadsheet,
  Calendar,
  Layers3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSMKS } from '../context/SMKSContext';
import { TabType } from '../types';

interface DashboardSummaryProps {
  onNavigate?: (tab: TabType) => void;
}

type MainCategory = 'pendidikan' | 'pelatihan' | 'penelitian';

export function DashboardSummary({ onNavigate }: DashboardSummaryProps) {
  const { 
    // Live records from secure global state (cPanel synced)
    prapendidikanKomkordikRecords,
    orientasiKsmRecords,
    ipeRecords,
    modulIpeRecords,
    studentInboundRecords,
    kunjunganRecords,
    mouRecords,
    akselerasiRecords,

    pelatihanUnggulanRecords,
    inhouseTrainingRecords,
    monitoringJamRecords,
    kerjasamaSkpRecords,
    studiBandingRecords,
    dokterObserverRecords,
    magangRecords,
    standarKemenkesRecords,
    pelatihanInternasionalRecords,
    trainerSertifikasiRecords,
    pelatihanMandiriRecords,

    penelitianRecords,
    penelitianPublikasiRecords,
    ujiEtikRecords,
    bukuIsbnRecords,
    kepkRecords = [],
    pengabdianMasyarakatRecords,
    produkInovasiRecords,
    pendapatanPenelitianRecords,
    ujiKlinikRecords,
    produkInovasiTerjualRecords,
    proposalArfRecords,
    submissionCphmRecords,
    patenRecords,
    hkiRecords,
    pendapatanPendidikanRecords: pendidikanJRecords,
    pajananPesertaRecords: pendidikanKRecords,
  } = useSMKS();

  // State controllers
  const [activeCategory, setActiveCategory] = useState<MainCategory | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<TabType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Pendidikan Group Metadata
  const pendidikanSubMenus = useMemo(() => [
    {
      id: 'pendidikan_l' as TabType,
      title: 'Prapendidikan (Komkordik)',
      count: prapendidikanKomkordikRecords.length,
      unit: 'Sesi',
      icon: Users,
      color: 'bg-blue-500',
      tag: 'Orientasi & Adaptasi Klinis',
      records: prapendidikanKomkordikRecords,
      fields: ['tanggalPelaksanaan', 'institusiPendidikan', 'totalPeserta'],
      labels: ['Tanggal', 'Institusi', 'Total Peserta'],
      chartField: 'institusiPendidikan',
    },
    {
      id: 'pendidikan_m' as TabType,
      title: 'Orientasi KSM / Instalasi',
      count: orientasiKsmRecords.length,
      unit: 'Sesi',
      icon: Layers,
      color: 'bg-indigo-600',
      tag: 'Adaptasi Unit Kerja',
      records: orientasiKsmRecords,
      fields: ['tanggalPelaksanaan', 'institusiPendidikan', 'totalPeserta'],
      labels: ['Tanggal', 'Institusi', 'Total Peserta'],
      chartField: 'institusiPendidikan',
    },
    {
      id: 'pendidikan_b' as TabType,
      title: 'IPE (Interprofessional)',
      count: ipeRecords.length,
      unit: 'Kegiatan',
      icon: Layers3,
      color: 'bg-indigo-500',
      tag: 'Interprofessional Education',
      records: ipeRecords,
      fields: ['tanggal', 'tema', 'ksm', 'pesertaUnair'],
      labels: ['Tanggal', 'Tema', 'KSM Penanggungjawab', 'Peserta UNAIR'],
      chartField: 'ksm',
    },
    {
      id: 'pendidikan_c' as TabType,
      title: 'Modul IPE',
      count: modulIpeRecords.length,
      unit: 'Modul',
      icon: BookOpen,
      color: 'bg-sky-500',
      tag: 'Buku Referensi Modul Klinis',
      records: modulIpeRecords,
      fields: ['judulBuku', 'isbn', 'penerbit', 'tanggalTerbit'],
      labels: ['Judul Modul Buku IPE', 'Nomor ISBN', 'Penerbit', 'Tanggal Terbit'],
      chartField: 'penerbit',
    },
    {
      id: 'pendidikan_d' as TabType,
      title: 'Student Inbound',
      count: studentInboundRecords.length,
      unit: 'Student',
      icon: Globe,
      color: 'bg-teal-500',
      tag: 'Mahasiswa Magang/Klinik',
      records: studentInboundRecords,
      fields: ['namaStudent', 'universitas', 'ksmTujuan', 'tanggalMasuk'],
      labels: ['Nama Mahasiswa', 'Universitas Asal', 'KSM Tujuan', 'Tanggal Masuk'],
      chartField: 'universitas',
    },
    {
      id: 'pendidikan_e' as TabType,
      title: 'Kunjungan Institusi',
      count: kunjunganRecords.length,
      unit: 'Kunjungan',
      icon: Building2,
      color: 'bg-cyan-500',
      tag: 'Studi Banding Pendidikan',
      records: kunjunganRecords,
      fields: ['tanggalPelaksanaan', 'universitas', 'fakultas', 'tujuan'],
      labels: ['Tanggal', 'Institusi Kunjungan', 'Fakultas', 'Tujuan Kegiatan'],
      chartField: 'universitas',
    },
    {
      id: 'pendidikan_f' as TabType,
      title: 'Surat MOU',
      count: mouRecords.length,
      unit: 'Dokumen',
      icon: FileText,
      color: 'bg-violet-500',
      tag: 'Kemitraan & Perjanjian Kerja',
      records: mouRecords,
      fields: ['namaInstitusi', 'jenis', 'tahun', 'masaBerlaku'],
      labels: ['Nama Institusi Mitra', 'Jenis Klasifikasi', 'Tahun Terbit', 'Masa Berlaku'],
      chartField: 'jenis',
    },
    {
      id: 'pendidikan_g' as TabType,
      title: 'Akselerasi Pendidikan',
      count: akselerasiRecords.length,
      unit: 'KSM',
      icon: TrendingUp,
      color: 'bg-pink-500',
      tag: 'Monitoring Peningkatan Rasio KSM',
      records: akselerasiRecords,
      fields: ['ksm', 'kategori', 'mei', 'des'],
      labels: ['Unit KSM RSUA', 'Rasio Kategori', 'Realisasi Mei', 'Proyeksi Des'],
      chartField: 'kategori',
    },
    {
      id: 'pendidikan_j' as TabType,
      title: 'Pendapatan Pendidikan',
      count: pendidikanJRecords.length,
      unit: 'Data',
      icon: Coins,
      color: 'bg-emerald-500',
      tag: 'Monitoring Pendapatan Eksternal',
      records: pendidikanJRecords,
      fields: ['bulan', 'institusiName', 'totalIncome'],
      labels: ['Bulan', 'Nama Institusi', 'Total Pendapatan'],
      chartField: 'institusiName',
    },
    {
      id: 'pendidikan_k' as TabType,
      title: 'Data Pajanan Peserta Didik',
      count: pendidikanKRecords.length,
      unit: 'Data',
      icon: ShieldAlert,
      color: 'bg-rose-500',
      tag: 'Kesehatan & Keselamatan Mahasiswa',
      records: pendidikanKRecords,
      fields: ['namaMahasiswa', 'nim', 'jenisPajanan'],
      labels: ['Nama Mahasiswa', 'NIM', 'Jenis Pajanan'],
      chartField: 'jenisPajanan',
    },
  ], [prapendidikanKomkordikRecords, orientasiKsmRecords, ipeRecords, modulIpeRecords, studentInboundRecords, kunjunganRecords, mouRecords, akselerasiRecords, pendidikanJRecords, pendidikanKRecords]);

  // 2. Pelatihan Group Metadata
  const pelatihanSubMenus = useMemo(() => [
    {
      id: 'pelatihan_unggulan' as TabType,
      title: 'Pelatihan Unggulan',
      count: pelatihanUnggulanRecords.length,
      unit: 'Event',
      icon: Award,
      color: 'bg-amber-500',
      tag: 'Sertifikasi Keahlian Berkelanjutan',
      records: pelatihanUnggulanRecords,
      fields: ['namaKegiatan', 'pengusul', 'tanggalMulai', 'tanggalSelesai'],
      labels: ['Nama Kegiatan Pelatihan', 'Penyelenggara / Pengusul', 'Tanggal Mulai', 'Estimasi Selesai'],
      chartField: 'pengusul',
    },
    {
      id: 'pelatihan_inhouse' as TabType,
      title: 'Inhouse Training',
      count: inhouseTrainingRecords.length,
      unit: 'Kelas',
      icon: Activity,
      color: 'bg-orange-500',
      tag: 'Peningkatan Kompetensi internal',
      records: inhouseTrainingRecords,
      fields: ['namaKegiatan', 'pengusul', 'tanggalMulai', 'tanggalSelesai'],
      labels: ['Nama Inhouse Training', 'KSM Pengusul', 'Waktu Pengadaan', 'Rentang Selesai'],
      chartField: 'pengusul',
    },
    {
      id: 'pelatihan_monitoring' as TabType,
      title: 'Monitoring Jam Pelatihan',
      count: monitoringJamRecords.length,
      unit: 'Staff',
      icon: Clock,
      color: 'bg-yellow-600',
      tag: 'Audit 20 Jam Kelayakan Staf',
      records: monitoringJamRecords,
      fields: ['nip', 'nama', 'ksm', 'totalJam', 'statusKepatuhan'],
      labels: ['NIP Pegawai', 'Nama Lengkap Staf', 'Stasiun KSM', 'Total JP Kumulatif', 'Kepatuhan (>= 20 JP)'],
      chartField: 'statusKepatuhan',
    },
    {
      id: 'pelatihan_kerjasama' as TabType,
      title: 'kegiatan Kerjasama ber-SKP',
      count: kerjasamaSkpRecords.length,
      unit: 'MoU',
      icon: Building2,
      color: 'bg-amber-600',
      tag: 'Sertifikasi Organisasi Profesi',
      records: kerjasamaSkpRecords,
      fields: ['namaKegiatan', 'namaInstitusi', 'tanggalPelaksanaan', 'tipeKerjasama'],
      labels: ['Nama Kegiatan SKP', 'Mitra Institusi', 'Tanggal Kegiatan', 'Metode Kerjasama'],
      chartField: 'tipeKerjasama',
    },
    {
      id: 'pelatihan_studi' as TabType,
      title: 'Studi Banding',
      count: studiBandingRecords.length,
      unit: 'Instansi',
      icon: Globe,
      color: 'bg-yellow-500',
      tag: 'Kunjungan Lapangan Pelatihan',
      records: studiBandingRecords,
      fields: ['namaInstitusi', 'tanggalPelaksanaan', 'tujuanKunjungan'],
      labels: ['Nama Institusi Studi Banding', 'Waktu Kunjungan', 'Tujuan Penelitian Kerja'],
      chartField: 'namaInstitusi',
    },
    {
      id: 'pelatihan_observer' as TabType,
      title: 'Dokter Observer',
      count: dokterObserverRecords.length,
      unit: 'Dokter',
      icon: Users,
      color: 'bg-orange-600',
      tag: 'Magang Dokter Spesialis Ex-Unair',
      records: dokterObserverRecords,
      fields: ['nama', 'lulusanInstitusi', 'tanggalMulai', 'tanggalSelesai'],
      labels: ['Nama Dokter', 'Lembaga Lulusan Almamater', 'Tanggal Mulai', 'Selesai Kontrak'],
      chartField: 'lulusanInstitusi',
    },
    {
      id: 'pelatihan_magang' as TabType,
      title: 'Data Magang',
      count: magangRecords.length,
      unit: 'Peserta',
      icon: Users,
      color: 'bg-orange-500',
      tag: 'Magang Observer & Kompetensi',
      records: magangRecords,
      fields: ['namaPeserta', 'jenisMagang', 'namaInstitusi', 'tempatPelaksanaan'],
      labels: ['Nama Peserta', 'Jenis Magang', 'Institusi Asal', 'Unit Pelaksana'],
      chartField: 'jenisMagang',
    },
    {
      id: 'pelatihan_kemenkes' as TabType,
      title: 'Kurikulum Kemenkes',
      count: standarKemenkesRecords.length,
      unit: 'Pelatihan',
      icon: ShieldAlert,
      color: 'bg-amber-700',
      tag: 'Akreditasi Kurikulum Kemenkes',
      records: standarKemenkesRecords,
      fields: ['judulPelatihan'],
      labels: ['Judul Kurikulum Kemenkes'],
      chartField: 'judulPelatihan',
    },
    {
      id: 'pelatihan_internasional' as TabType,
      title: 'Kegiatan Internasional',
      count: pelatihanInternasionalRecords.length,
      unit: 'Event',
      icon: Globe,
      color: 'bg-indigo-600',
      tag: 'Global Competency Training',
      records: pelatihanInternasionalRecords,
      fields: ['namaKegiatan', 'lembagaKerjasama', 'tanggalKegiatan', 'totalPendapatan'],
      labels: ['Nama Kegiatan', 'Partner Internasional', 'Tanggal', 'Revenue'],
      chartField: 'lembagaKerjasama',
    },
    {
      id: 'pelatihan_trainer' as TabType,
      title: 'Trainer & Sertifikasi',
      count: trainerSertifikasiRecords.length,
      unit: 'Sertifikat',
      icon: Award,
      color: 'bg-orange-700',
      tag: 'TOT & Sertifikasi Tenaga Pelatih',
      records: trainerSertifikasiRecords,
      fields: ['namaPeserta', 'judulPelatihan', 'unitKerja', 'tanggalPelaksanaan'],
      labels: ['Nama Trainer', 'Judul Pelatihan', 'Unit Kerja', 'Waktu Sertifikasi'],
      chartField: 'unitKerja',
    },
    {
      id: 'pelatihan_mandiri' as TabType,
      title: 'Kegiatan Mandiri ber SKP',
      count: pelatihanMandiriRecords.length,
      unit: 'Kegiatan',
      icon: Plus,
      color: 'bg-yellow-700',
      tag: 'Pengembangan Mandiri Instalasi',
      records: pelatihanMandiriRecords,
      fields: ['judulKegiatan', 'unitKerja', 'tanggalKegiatan', 'totalPendapatan'],
      labels: ['Judul Kegiatan', 'Unit Pengusul', 'Tanggal', 'Revenue'],
      chartField: 'unitKerja',
    },
  ], [pelatihanUnggulanRecords, inhouseTrainingRecords, monitoringJamRecords, kerjasamaSkpRecords, studiBandingRecords, dokterObserverRecords, magangRecords, standarKemenkesRecords, pelatihanInternasionalRecords, trainerSertifikasiRecords, pelatihanMandiriRecords]);

  // 3. Inovasi & Penelitian Group Metadata
  const penelitianSubMenus = useMemo(() => [
    {
      id: 'penelitian' as TabType,
      title: 'Penelitian & Hibah Riset',
      count: penelitianRecords.length,
      unit: 'Riset',
      icon: BookOpen,
      color: 'bg-emerald-500',
      tag: 'Eksplorasi Hibah Riset Klinis',
      records: penelitianRecords,
      fields: ['judul', 'penelitiUtama', 'status', 'danaHibah'],
      labels: ['Judul Riset / Judul Penelitian', 'Peneliti Utama (PI)', 'Status Progress', 'Anggaran Dana Mandiri/Hibah'],
      chartField: 'status',
    },
    {
      id: 'penelitian_publikasi' as TabType,
      title: 'Publikasi Internasional',
      count: penelitianPublikasiRecords.length,
      unit: 'Karya',
      icon: Globe,
      color: 'bg-green-500',
      tag: 'Karya Ilmiah Terindeks Scopus',
      records: penelitianPublikasiRecords,
      fields: ['judul', 'namaPeneliti', 'skema', 'tahun'],
      labels: ['Judul Artikel Ilmiah', 'Peneliti Medis', 'Skema Repositori', 'Tahun Publikasi'],
      chartField: 'skema',
    },
    {
      id: 'penelitian_uji_etik' as TabType,
      title: 'Uji Etik Penelitian',
      count: ujiEtikRecords.length,
      unit: 'Protokol',
      icon: FileText,
      color: 'bg-teal-600',
      tag: 'Persetujuan Kelayakan Medis',
      records: ujiEtikRecords,
      fields: ['judulPenelitian', 'namaPeneliti', 'skema', 'tahun'],
      labels: ['Judul Protokol Riset', 'Pemohon / Peneliti', 'Skema Uji Etik', 'Tahun Diajukan'],
      chartField: 'skema',
    },
    {
      id: 'penelitian_buku' as TabType,
      title: 'Buku Referensi ISBN',
      count: bukuIsbnRecords.length,
      unit: 'Buku',
      icon: BookOpen,
      color: 'bg-emerald-600',
      tag: 'Buku & Monograf ber-ISBN',
      records: bukuIsbnRecords,
      fields: ['judulBuku', 'isbn', 'penerbit', 'tanggalTerbit'],
      labels: ['Nama Buku Terbit', 'Nomor ISBN / HAKI', 'Badan Penerbit', 'Tanggal Publikasi'],
      chartField: 'penerbit',
    },
    {
      id: 'penelitian_kepk' as TabType,
      title: 'Kepatuhan KEPK',
      count: kepkRecords.length,
      unit: 'Sertifikat',
      icon: Award,
      color: 'bg-emerald-700',
      tag: 'Audit Komite Kode Etik RSUA',
      records: kepkRecords,
      fields: ['judulPenelitian', 'namaPeneliti', 'tahun'],
      labels: ['Judul Protokol Kepatuhan', 'Nama Peneliti Utama', 'Tahun Berjalan'],
      chartField: 'tahun',
    },
    {
      id: 'penelitian_pengabdian' as TabType,
      title: 'Pengabdian Masyarakat',
      count: pengabdianMasyarakatRecords.length,
      unit: 'Aktivitas',
      icon: Users,
      color: 'bg-green-600',
      tag: 'Penyuluhan & Bakti Sosial Medis',
      records: pengabdianMasyarakatRecords,
      fields: ['judul', 'nama', 'ksm', 'tahun'],
      labels: ['Judul Kegiatan Sosial', 'Ketua Koordinator', 'KSM Pelaksana', 'Tahun Pelaksanaan'],
      chartField: 'ksm',
    },
    {
      id: 'penelitian_produk' as TabType,
      title: 'Produk Inovasi RSUA',
      count: produkInovasiRecords.length,
      unit: 'Inovasi',
      icon: Lightbulb,
      color: 'bg-teal-500',
      tag: 'Prototipe Alat Kesehatan & Software',
      records: produkInovasiRecords,
      fields: ['namaProduk', 'tahun', 'pic'],
      labels: ['Nama Produk Inovasi', 'Tahun Release', 'PIC Inovasi'],
      chartField: 'tahun',
    },
    {
      id: 'penelitian_pendapatan' as TabType,
      title: 'Pendapatan Penelitian',
      count: pendapatanPenelitianRecords.length,
      unit: 'Bulan',
      icon: TrendingUp,
      color: 'bg-emerald-600',
      tag: 'Monitoring PNBP Penelitian',
      records: pendapatanPenelitianRecords,
      fields: ['bulan', 'pendapatanEtik', 'pendapatanLabRiset', 'totalPendapatan'],
      labels: ['Bulan', 'Review Etik', 'Lab Riset', 'Total Revenue'],
      chartField: 'bulan',
    },
    {
      id: 'penelitian_uji_klinik' as TabType,
      title: 'Penelitian Uji Klinik',
      count: ujiKlinikRecords.length,
      unit: 'Proyek',
      icon: Activity,
      color: 'bg-teal-700',
      tag: 'Clinical Trial Management',
      records: ujiKlinikRecords,
      fields: ['judulPenelitian', 'mitraKerjasama', 'status', 'tahun'],
      labels: ['Judul Penelitian', 'Mitra Sponsor', 'Status', 'Tahun'],
      chartField: 'status',
    },
    {
      id: 'penelitian_terjual' as TabType,
      title: 'Inovasi Terjual',
      count: produkInovasiTerjualRecords.length,
      unit: 'Unit',
      icon: TrendingUp,
      color: 'bg-green-700',
      tag: 'Komersialisasi Produk Inovasi',
      records: produkInovasiTerjualRecords,
      fields: ['namaProduk', 'tanggal', 'jumlahPesananProduk'],
      labels: ['Nama Produk', 'Tanggal Transaksi', 'Jumlah Pesanan'],
      chartField: 'namaProduk',
    },
    {
      id: 'penelitian_arf' as TabType,
      title: 'Proposal ARF',
      count: proposalArfRecords.length,
      unit: 'Proposal',
      icon: FileText,
      color: 'bg-emerald-800',
      tag: 'Airlangga Research Fund',
      records: proposalArfRecords,
      fields: ['judulPenelitian', 'skema', 'ketuaPeneliti', 'danaHibahDiperoleh'],
      labels: ['Judul Penelitian', 'Skema Hibah', 'Ketua Peneliti', 'Dana Hibah'],
      chartField: 'skema',
    },
    {
      id: 'penelitian_cphm' as TabType,
      title: 'Submission CPHM',
      count: submissionCphmRecords.length,
      unit: 'Artikel',
      icon: BookOpen,
      color: 'bg-teal-800',
      tag: 'Case Report & Health Management',
      records: submissionCphmRecords,
      fields: ['judulArtikel', 'author', 'tanggal'],
      labels: ['Judul Artikel', 'Penulis', 'Tanggal Submission'],
      chartField: 'author',
    },
    {
      id: 'penelitian_paten' as TabType,
      title: 'Paten RSUA',
      count: patenRecords.length,
      unit: 'Paten',
      icon: ShieldAlert,
      color: 'bg-green-800',
      tag: 'Intellectual Property - Patents',
      records: patenRecords,
      fields: ['judulPaten', 'nomorPaten', 'namaAutor', 'tanggalTerbit'],
      labels: ['Judul Paten', 'Nomor Paten', 'Author', 'Tgl Terbit'],
      chartField: 'namaAutor',
    },
    {
      id: 'penelitian_hki' as TabType,
      title: 'HKI RSUA',
      count: hkiRecords.length,
      unit: 'Sertifikat',
      icon: Award,
      color: 'bg-emerald-900',
      tag: 'Hak Kekayaan Intelektual',
      records: hkiRecords,
      fields: ['judulHki', 'nomorHki', 'namaAutor', 'tanggalTerbit'],
      labels: ['Judul HKI', 'Nomor HKI', 'Author', 'Tgl Terbit'],
      chartField: 'namaAutor',
    },
  ], [penelitianRecords, penelitianPublikasiRecords, ujiEtikRecords, bukuIsbnRecords, kepkRecords, pengabdianMasyarakatRecords, produkInovasiRecords, pendapatanPenelitianRecords, ujiKlinikRecords, produkInovasiTerjualRecords, proposalArfRecords, submissionCphmRecords, patenRecords, hkiRecords]);

  // Main Category Definitions
  const mainCategories = [
    {
      id: 'pendidikan' as MainCategory,
      title: 'PENDIDIKAN',
      tagline: 'Kelola orientasi pembelajaran klinis, program interprofessional, modul perkuliahan, data inbound, dan kerjasama akselerasi akademik.',
      icon: GraduationCap,
      colorTheme: 'from-blue-600 to-indigo-600',
      borderClass: 'border-blue-100',
      ringColor: 'ring-blue-100',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50/50',
      list: pendidikanSubMenus,
      overallSum: prapendidikanKomkordikRecords.length + orientasiKsmRecords.length + ipeRecords.length + modulIpeRecords.length + studentInboundRecords.length + kunjunganRecords.length + mouRecords.length + akselerasiRecords.length + pendidikanJRecords.length + pendidikanKRecords.length,
      overallUnit: 'Unit Dokumen'
    },
    {
      id: 'pelatihan' as MainCategory,
      title: 'PELATIHAN',
      tagline: 'Tingkatkan kecakapan berkelanjutan perawat & tenaga medis, audit program 20 jam pembelajaran, inhouse training, serta dokter spesialis observer.',
      icon: Briefcase,
      colorTheme: 'from-amber-500 to-orange-500',
      borderClass: 'border-amber-100',
      ringColor: 'ring-amber-100',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50/50',
      list: pelatihanSubMenus,
      overallSum: pelatihanUnggulanRecords.length + inhouseTrainingRecords.length + monitoringJamRecords.length + kerjasamaSkpRecords.length + studiBandingRecords.length + dokterObserverRecords.length + magangRecords.length + standarKemenkesRecords.length + pelatihanInternasionalRecords.length + trainerSertifikasiRecords.length + pelatihanMandiriRecords.length,
      overallUnit: 'Kompetensi'
    },
    {
      id: 'penelitian' as MainCategory,
      title: 'INOVASI & PENELITIAN',
      tagline: 'Monitor progress penelitian hibah RSUA, permohonan komite etik kedokteran, pengarsipan publikasi Scopus, sirkulasi buku ISBN, dan komersialisasi HAKI.',
      icon: Lightbulb,
      colorTheme: 'from-emerald-500 to-teal-500',
      borderClass: 'border-emerald-100',
      ringColor: 'ring-emerald-100',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/50',
      list: penelitianSubMenus,
      overallSum: penelitianRecords.length + penelitianPublikasiRecords.length + ujiEtikRecords.length + bukuIsbnRecords.length + kepkRecords.length + pengabdianMasyarakatRecords.length + produkInovasiRecords.length + pendapatanPenelitianRecords.length + ujiKlinikRecords.length + produkInovasiTerjualRecords.length + proposalArfRecords.length + submissionCphmRecords.length + patenRecords.length + hkiRecords.length,
      overallUnit: 'Output Riset'
    }
  ];

  // Resolve active submenus for current view state
  const activeSubMenus = useMemo(() => {
    if (!activeCategory) return [];
    if (activeCategory === 'pendidikan') return pendidikanSubMenus;
    if (activeCategory === 'pelatihan') return pelatihanSubMenus;
    return penelitianSubMenus;
  }, [activeCategory, pendidikanSubMenus, pelatihanSubMenus, penelitianSubMenus]);

  // Resolve selected submenu object for details modal
  const selectedSubmenuObj = useMemo(() => {
    if (!selectedSubId) return null;
    const all = [...pendidikanSubMenus, ...pelatihanSubMenus, ...penelitianSubMenus];
    return all.find(s => s.id === selectedSubId) || null;
  }, [selectedSubId, pendidikanSubMenus, pelatihanSubMenus, penelitianSubMenus]);

  // Filtered rows in detail table when modal is active
  const filteredSubmenuRecords = useMemo(() => {
    if (!selectedSubmenuObj) return [];
    if (!searchQuery) return selectedSubmenuObj.records;
    const q = searchQuery.toLowerCase();
    return selectedSubmenuObj.records.filter((rec: any) => {
      return Object.values(rec).some(val => 
        String(val).toLowerCase().includes(q)
      );
    });
  }, [selectedSubmenuObj, searchQuery]);

  // Compute a dynamic visual chart statistics breakdown for modal
  const chartBreakdownData = useMemo(() => {
    if (!selectedSubmenuObj || !selectedSubmenuObj.records.length) return [];
    const field = selectedSubmenuObj.chartField || 'status';
    const counts: Record<string, number> = {};
    
    selectedSubmenuObj.records.forEach((rec: any) => {
      let key = String(rec[field] || 'Umum').trim();
      if (!key || key === 'undefined') key = 'Lainnya';
      counts[key] = (counts[key] || 0) + 1;
    });

    const total = selectedSubmenuObj.records.length;
    return Object.entries(counts).map(([key, count]) => ({
      name: key,
      count: count,
      percent: Math.round((count / total) * 100)
    })).sort((a, b) => b.count - a.count);
  }, [selectedSubmenuObj]);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 bg-slate-50/50 min-h-full">
      
      {/* 1. TOP HEADER PANEL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-8 h-8 text-unair-blue" />
            DASHBOARD
          </h1>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!activeCategory ? (
          
          /* =========================================================
             SCREEN 1: THE 3 MAIN UTAMA CATEGORY CARDS 
             ========================================================= */
          <motion.div
            key="main-portal"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 animate-in duration-300"
          >
            {/* 3 Main Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {mainCategories.map((cat, idx) => {
                const IconComponent = cat.icon;
                return (
                  <motion.div
                    key={cat.id}
                    whileHover={{ y: -6, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setActiveCategory(cat.id)}
                    className="bg-white rounded-[40px] border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer overflow-hidden group flex flex-col min-h-[320px]"
                    id={`main-cat-card-${cat.id}`}
                  >
                    {/* Header Panel */}
                    <div className={`p-8 bg-gradient-to-br ${cat.colorTheme} text-white flex flex-col justify-between relative overflow-hidden h-44`}>
                      <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-xl group-hover:scale-125 transition-transform duration-500" />
                      
                      <div className="flex justify-between items-start z-10">
                        <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-[10px] font-black tracking-widest bg-black/25 backdrop-blur-sm px-3.5 py-1.5 rounded-full uppercase">
                          {cat.list.length} Modul Data
                        </span>
                      </div>

                      <div className="z-10 mt-auto">
                        <h2 className="text-2xl font-extrabold tracking-tight uppercase leading-none">
                          {cat.title}
                        </h2>
                      </div>
                    </div>

                    {/* Desc Column */}
                    <div className="p-8 flex-1 flex flex-col justify-between space-y-6">

                      {/* Stat summary */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-3xl">
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Jumlah Rekaman</span>
                          <span className="text-3xl font-black text-slate-900 mt-1 block">
                            {cat.overallSum} <span className="text-xs font-semibold text-slate-500">{cat.overallUnit}</span>
                          </span>
                        </div>
                        <div className={`p-2.5 rounded-full bg-white border border-slate-100 text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-50 transition-colors`}>
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Footer interaction link */}
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-unair-blue transition-colors">
                        <span>Eksplorasi Modul Sekarang</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          
          /* =========================================================
             SCREEN 2: DRILL-DOWN SUBMENU CARD LAYOUT (with graphs & details preview)
             ========================================================= */
          <motion.div
            key="drill-down-portal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Nav back & horizontal portal switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <button
                onClick={() => setActiveCategory(null)}
                className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-4 py-2.5 rounded-2xl shadow-sm transition-all self-start"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Menu Utama
              </button>

              {/* Switches categories on the fly */}
              <div className="flex flex-wrap gap-2.5 bg-slate-200/50 p-1.5 rounded-2xl">
                {mainCategories.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeCategory === tab.id
                        ? 'bg-unair-blue text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Current category identifier banner */}
            <div className={`p-6 bg-white border border-slate-200 rounded-[32px] flex items-start gap-4 shadow-sm`}>
              <div className={`p-3.5 rounded-2xl bg-unair-blue text-white shadow`}>
                {React.createElement(
                  mainCategories.find(c => c.id === activeCategory)?.icon || Layers, 
                  { className: 'w-6 h-6' }
                )}
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">DIREKTORI MODUL AKTIF</span>
                <h2 className="text-xl font-bold text-slate-900 uppercase">
                  {mainCategories.find(c => c.id === activeCategory)?.title}
                </h2>
                <p className="text-slate-500 text-xs font-medium mt-0.5">
                  Menganalisis {activeSubMenus.length} jenis formulir data. Silakan klik "Lihat Rincian & Grafik" pada card di bawah ini.
                </p>
              </div>
            </div>

            {/* Submenu CARDS GRID with numeric graphs, metrics, and list of actual titles! */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeSubMenus.map((sub, sIdx) => {
                const SubIcon = sub.icon;
                
                // Get the last 3 records to list their titles/names
                const last3Records = sub.records.slice(-3).reverse();

                // Generate a lightweight visual Sparkline of progress or mock distribution
                // Let's count items based on their unique parameters to make actual bars
                const uniqueValCount = Array.from(new Set(sub.records.map((r: any) => r[sub.chartField] || ''))).length;

                return (
                  <div
                    key={sub.id}
                    className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group"
                    id={`subcard-${sub.id}`}
                  >
                    {/* Header with Submenu title */}
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-start gap-3 justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-3 rounded-xl ${sub.color || 'bg-slate-500'} text-white shadow-sm shrink-0`}>
                          <SubIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block truncate">
                            {sub.tag}
                          </span>
                          <h3 className="text-base font-extrabold text-slate-950 truncate tracking-tight group-hover:text-unair-blue transition-colors">
                            {sub.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Content Section containing numeric summary and list of titles */}
                    <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                      
                      {/* 1. Large numeric display and progress bar gauge */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Terinput</span>
                          <span className="text-3xl font-black text-slate-900 mt-0.5 block">
                            {sub.count} <span className="text-xs font-semibold text-slate-500">{sub.unit}</span>
                          </span>
                        </div>
                        
                        {/* Dynamic Mini Circle Progress Gauge */}
                        <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shrink-0">
                          <Clock className="w-5 h-5 text-slate-400 group-hover:rotate-12 transition-transform" />
                          <div className="absolute inset-0 border-[1.5px] rounded-2xl border-slate-200" />
                        </div>
                      </div>

                      {/* 2. Graphical data bar line */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                          <span>Data Berjalan</span>
                          <span>{sub.count > 0 ? `${uniqueValCount} Kelompok` : 'Database Kosong'}</span>
                        </div>
                        
                        {/* Customizable styled visual progress bar */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${sub.color || 'bg-slate-700'}`} 
                            style={{ width: `${Math.min(100, Math.max(8, sub.count * 15))}%` }}
                          />
                        </div>
                      </div>

                      {/* 3. "Detil Judul" - LIST OF ACTUAL RECORDED TITLES inside the card */}
                      <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl space-y-3 flex-1 flex flex-col justify-start">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                          Daftar Judul & Detil Terbaru:
                        </span>
                        
                        {last3Records.length === 0 ? (
                          <div className="text-center py-4 flex-1 flex flex-col items-center justify-center">
                            <FileSpreadsheet className="w-6 h-6 text-slate-300 stroke-[1.5]" />
                            <p className="text-slate-400 text-[11px] font-semibold mt-1">Belum ada entri data</p>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {last3Records.map((rec: any, recIdx) => {
                              // Dynamically resolve of representative fields like 'judul', 'tema', 'namaPeneliti', 'institusiPendidikan'
                              const mainTitle = rec.judulBuku || rec.judul || rec.tema || rec.judulPenelitian || rec.namaKegiatan || rec.nama || rec.institusiPendidikan || 'Data Tanpa Judul';
                              const subInfo = rec.isbn || rec.penerbit || rec.tanggalPelaksanaan || rec.unairFakultas || rec.universitas || rec.namaPeneliti || rec.totalJam || rec.statusKepatuhan || '';
                              
                              return (
                                <div key={rec.id || recIdx} className="text-xs flex items-start gap-2 border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-extrabold text-slate-800 truncate leading-snug" title={mainTitle}>
                                      {mainTitle}
                                    </p>
                                    {subInfo && (
                                      <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">
                                        {String(subInfo)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Operational Actions */}
                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
                      
                      {/* Clickable Card Action to see Full details popup */}
                      <button
                        onClick={() => setSelectedSubId(sub.id)}
                        className="w-full text-center justify-center items-center py-2.5 px-4 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 shadow-sm transition-all flex gap-1.5"
                        id={`btn-details-${sub.id}`}
                      >
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                        Detail Rincian & Grafik
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
         MODAL DETAIL WINDOW: Renders on Submenu Card selection
         ========================================================= */}
      <AnimatePresence>
        {selectedSubmenuObj && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="bg-white rounded-[40px] max-w-5xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]"
              id="details-modal-window"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3.5">
                  <div className={`p-4 rounded-2xl ${selectedSubmenuObj.color || 'bg-slate-500'} text-white shadow-md`}>
                    {React.createElement(selectedSubmenuObj.icon, { className: 'w-6 h-6' })}
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-widest text-[#cf9b33] uppercase">RINCIAN DATA LENGKAP</span>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
                      {selectedSubmenuObj.title}
                    </h3>
                  </div>
                </div>
                
                {/* Close Button at top right */}
                <button
                  onClick={() => {
                    setSelectedSubId(null);
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl shadow-xs transition-all self-end"
                >
                  Tutup Panel
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(85vh-200px)]">

                {/* Search query table filtering */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                      <FileSpreadsheet className="w-5 h-5 text-slate-400" />
                      TABEL RECORD LENGKAP ({filteredSubmenuRecords.length})
                    </h4>

                    {/* Search Field */}
                    <div className="relative w-full sm:w-80">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Cari data dalam modul ini..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-unair-blue"
                      />
                    </div>
                  </div>

                  {/* Clean Tabular records list representation */}
                  <div className="border border-slate-200 rounded-[28px] overflow-hidden bg-white shadow-xs max-h-96 overflow-y-auto">
                    {filteredSubmenuRecords.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 space-y-2">
                        <FileSpreadsheet className="w-12 h-12 mx-auto stroke-[1.2]" />
                        <p className="text-sm font-bold">Data tidak ditemukan</p>
                        <p className="text-xs">Database masih kosong atau tidak ada hasil yang cocok dengan kata kunci.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-slate-200">
                            <th className="p-4 w-12 text-center">No</th>
                            {selectedSubmenuObj.labels.map((lbl: string) => (
                              <th key={lbl} className="p-4">{lbl}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                          {filteredSubmenuRecords.map((rec: any, recIdx) => (
                            <tr key={rec.id || recIdx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 text-center text-slate-400 font-bold">{recIdx + 1}</td>
                              {selectedSubmenuObj.fields.map((fld: string) => {
                                let val = rec[fld];
                                if (typeof val === 'boolean') {
                                  val = val ? 'Ya' : 'Tidak';
                                }
                                if (fld.toLowerCase().includes('tanggal') && typeof val === 'string' && val.includes('-')) {
                                  try {
                                    val = new Date(val).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
                                  } catch (_) { /* Keep legacy */ }
                                }
                                return (
                                  <td key={fld} className="p-4 truncate max-w-xs" title={String(val || '-')}>
                                    {String(val !== undefined && val !== null ? val : '-')}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

              </div>

              {/* Modal Footer Banner with Action buttons */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  ID Modul: {selectedSubmenuObj.id}
                </span>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setSelectedSubId(null);
                      setSearchQuery('');
                    }}
                    className="w-full sm:w-auto py-3 px-8 bg-slate-200/80 hover:bg-slate-300/80 rounded-2xl text-xs font-bold text-slate-700 transition"
                  >
                    Tutup Rincian
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
