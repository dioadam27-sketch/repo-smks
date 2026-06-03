import React, { useState } from 'react';
import { 
  FileText, 
  FlaskConical, 
  BookOpen, 
  Award, 
  Users2, 
  Activity, 
  Plus, 
  Search, 
  Trash2, 
  Download,
  Info,
  Calendar,
  Share2,
  FolderPlus,
  ArrowRight,
  Pencil,
  FileSpreadsheet,
  FilePieChart,
  X,
  Eye
} from 'lucide-react';
import { useSMKS } from '../context/SMKSContext';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { 
  downloadExcelSheet, 
  formatPendapatanPenelitianExcel,
  formatUjiEtikExcel,
  formatUjiKlinikExcel,
  formatPenelitianPublikasiExcel,
  formatProdukInovasiExcel,
  formatProdukInovasiTerjualExcel,
  formatBukuIsbnExcel,
  formatPengabdianMasyarakatExcel,
  formatProposalArfExcel,
  formatSubmissionCphmExcel,
  formatPatenExcel,
  formatHkiExcel
} from '../utils/exportUtils';
import { 
  generatePendapatanPenelitianPdf,
  generateUjiEtikPdf,
  generateUjiKlinikPdf,
  generatePenelitianPublikasiPdf,
  generateProdukInovasiPdf,
  generateProdukInovasiTerjualPdf,
  generateBukuIsbnPdf,
  generatePengabdianPdf,
  generateProposalArfPdf,
  generateSubmissionCphmPdf,
  generatePatenPdf,
  generateHkiPdf
} from '../utils/pdfExportUtils';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { uploadToAppsScript } from '../utils/gdriveUpload';

type SubTab = 
  | 'penelitian_pendapatan'
  | 'uji_etik'
  | 'penelitian_uji_klinik'
  | 'penelitian_publikasi'
  | 'produk_inovasi'
  | 'produk_inovasi_terjual'
  | 'buku_isbn'
  | 'pengabdian_masyarakat'
  | 'proposal_arf'
  | 'submission_cphm'
  | 'paten'
  | 'hki';

const SUB_TABS = [
  { id: 'penelitian_pendapatan' as const, label: 'Pendapatan Penelitian', icon: Activity },
  { id: 'uji_etik' as const, label: 'Uji Etik Penelitian', icon: FlaskConical },
  { id: 'penelitian_uji_klinik' as const, label: 'Penelitian Uji Klinik', icon: FlaskConical },
  { id: 'penelitian_publikasi' as const, label: 'Penelitian Terpublikasi', icon: FileText },
  { id: 'produk_inovasi' as const, label: 'Produk Inovasi (Gilir Inovasi)', icon: Activity },
  { id: 'produk_inovasi_terjual' as const, label: 'Produk Inovasi Terjual', icon: Activity },
  { id: 'buku_isbn' as const, label: 'Buku ISBN / Chapter Book', icon: BookOpen },
  { id: 'pengabdian_masyarakat' as const, label: 'Pengabdian Masyarakat', icon: Users2 },
  { id: 'proposal_arf' as const, label: 'Proposal ARF', icon: FileText },
  { id: 'submission_cphm' as const, label: 'Submission Artikel CPHM', icon: FileText },
  { id: 'paten' as const, label: 'Paten', icon: Award },
  { id: 'hki' as const, label: 'Hak Cipta (HKI)', icon: Award }
];

interface PenelitianProps {
  activeSubTab?: any;
  onChangeSubTab?: (tab: string) => void;
}

export function Penelitian({ activeSubTab = 'penelitian_pendapatan', onChangeSubTab }: PenelitianProps) {
  const context = useSMKS();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [uploadingKeys, setUploadingKeys] = useState<Record<string, boolean>>({});

  const handleOpenFile = (rec: any, nameKey: string) => {
    const fileKey = nameKey.endsWith('Name') ? nameKey.slice(0, -4) : nameKey;
    const driveKey = nameKey.endsWith('Name') ? nameKey.slice(0, -4) + 'DriveUrl' : nameKey + 'DriveUrl';

    const driveUrl = rec[driveKey];
    const localData = rec[fileKey] || rec[nameKey];

    const url = driveUrl || localData;
    if (!url) {
      alert("Tidak ada file yang dapat ditampilkan.");
      return;
    }

    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else if (url.startsWith('data:')) {
      try {
        const parts = url.split(',');
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
        if (url.length < 2000) {
          window.open(url, '_blank');
        }
      }
    } else {
      window.open(url, '_blank');
    }
  };

  // Normalize the activeSubTab from App.tsx/routing (which may be uppercase or have different keys)
  const normalizedTab = (() => {
    const t = (activeSubTab || '').toString().toLowerCase();
    if (t === 'pendapatan') return 'penelitian_pendapatan';
    if (t === 'uji_etik') return 'uji_etik';
    if (t === 'uji_klinik') return 'penelitian_uji_klinik';
    if (t === 'publikasi') return 'penelitian_publikasi';
    if (t === 'produk') return 'produk_inovasi';
    if (t === 'produk_terjual') return 'produk_inovasi_terjual';
    if (t === 'buku') return 'buku_isbn';
    if (t === 'pengabdian') return 'pengabdian_masyarakat';
    if (t === 'proposal_arf') return 'proposal_arf';
    if (t === 'submission_cphm') return 'submission_cphm';
    if (t === 'paten') return 'paten';
    if (t === 'hki') return 'hki';
    return t; // if it's already one of the exact SubTab cases
  })() as SubTab;

  // Get active tab data
  const getSubTabData = () => {
    switch (normalizedTab) {
      case 'penelitian_pendapatan':
        return { 
          records: context.pendapatanPenelitianRecords, 
          add: (form: any) => {
            // Auto calculate total
            const eti = parseFloat(form.pendapatanEtik) || 0;
            const lab = parseFloat(form.pendapatanLabRiset) || 0;
            const ino = parseFloat(form.pendapatanInovasi) || 0;
            const uji = parseFloat(form.pendapatanUjiKlinik) || 0;
            const tot = eti + lab + ino + uji;
            context.addPendapatanPenelitian({ ...form, totalPendapatan: tot });
          }, 
          update: (form: any) => {
            const eti = parseFloat(form.pendapatanEtik) || 0;
            const lab = parseFloat(form.pendapatanLabRiset) || 0;
            const ino = parseFloat(form.pendapatanInovasi) || 0;
            const uji = parseFloat(form.pendapatanUjiKlinik) || 0;
            const tot = eti + lab + ino + uji;
            context.updatePendapatanPenelitian({ ...form, totalPendapatan: tot });
          },
          delete: context.deletePendapatanPenelitian,
          title: 'Pendapatan Penelitian',
          formatter: formatPendapatanPenelitianExcel,
          pdfGenerator: generatePendapatanPenelitianPdf
        };
      case 'uji_etik':
        return { 
          records: context.ujiEtikRecords, 
          add: context.addUjiEtik, 
          update: context.updateUjiEtik as any,
          delete: context.deleteUjiEtik,
          title: 'Pelaksanaan Uji Etik Penelitian',
          formatter: formatUjiEtikExcel,
          pdfGenerator: generateUjiEtikPdf
        };
      case 'penelitian_uji_klinik':
        return { 
          records: context.ujiKlinikRecords, 
          add: context.addUjiKlinik, 
          update: context.updateUjiKlinik as any,
          delete: context.deleteUjiKlinik,
          title: 'Penelitian Uji Klinik',
          formatter: formatUjiKlinikExcel,
          pdfGenerator: generateUjiKlinikPdf
        };
      case 'penelitian_publikasi':
        return { 
          records: context.penelitianPublikasiRecords, 
          add: context.addPenelitianPublikasi, 
          update: context.updatePenelitianPublikasi as any,
          delete: context.deletePenelitianPublikasi,
          title: 'Penelitian Terpublikasi Dan Terindeks Internasional',
          formatter: formatPenelitianPublikasiExcel,
          pdfGenerator: generatePenelitianPublikasiPdf
        };
      case 'produk_inovasi':
        return { 
          records: context.produkInovasiRecords, 
          add: context.addProdukInovasi, 
          update: context.updateProdukInovasi as any,
          delete: context.deleteProdukInovasi,
          title: 'Produk Inovasi (Gilir Inovasi)',
          formatter: formatProdukInovasiExcel,
          pdfGenerator: generateProdukInovasiPdf
        };
      case 'produk_inovasi_terjual':
        return { 
          records: context.produkInovasiTerjualRecords, 
          add: context.addProdukInovasiTerjual, 
          update: context.updateProdukInovasiTerjual as any,
          delete: context.deleteProdukInovasiTerjual,
          title: 'Produk Inovasi Terjual',
          formatter: formatProdukInovasiTerjualExcel,
          pdfGenerator: generateProdukInovasiTerjualPdf
        };
      case 'buku_isbn':
        return { 
          records: context.bukuIsbnRecords, 
          add: context.addBukuIsbn, 
          update: context.updateBukuIsbn as any,
          delete: context.deleteBukuIsbn,
          title: 'Buku Ber-ISBN / Chapter Book',
          formatter: formatBukuIsbnExcel,
          pdfGenerator: generateBukuIsbnPdf
        };
      case 'pengabdian_masyarakat':
        return { 
          records: context.pengabdianMasyarakatRecords, 
          add: context.addPengabdianMasyarakat, 
          update: context.updatePengabdianMasyarakat as any,
          delete: context.deletePengabdianMasyarakat,
          title: 'Pengabdian Masyarakat',
          formatter: formatPengabdianMasyarakatExcel,
          pdfGenerator: generatePengabdianPdf
        };
      case 'proposal_arf':
        return { 
          records: context.proposalArfRecords, 
          add: context.addProposalArf, 
          update: context.updateProposalArf as any,
          delete: context.deleteProposalArf,
          title: 'Proposal ARF',
          formatter: formatProposalArfExcel,
          pdfGenerator: generateProposalArfPdf
        };
      case 'submission_cphm':
        return { 
          records: context.submissionCphmRecords, 
          add: context.addSubmissionCphm, 
          update: context.updateSubmissionCphm as any,
          delete: context.deleteSubmissionCphm,
          title: 'Submission Artikel CPHM',
          formatter: formatSubmissionCphmExcel,
          pdfGenerator: generateSubmissionCphmPdf
        };
      case 'paten':
        return { 
          records: context.patenRecords, 
          add: context.addPaten, 
          update: context.updatePaten as any,
          delete: context.deletePaten,
          title: 'Paten',
          formatter: formatPatenExcel,
          pdfGenerator: generatePatenPdf
        };
      case 'hki':
        return { 
          records: context.hkiRecords, 
          add: context.addHki, 
          update: context.updateHki as any,
          delete: context.deleteHki,
          title: 'Hak Cipta (HKI)',
          formatter: formatHkiExcel,
          pdfGenerator: generateHkiPdf
        };
      default:
        return { 
          records: [], 
          add: () => {}, 
          update: () => {},
          delete: () => {}, 
          title: '', 
          formatter: (r: any) => [], 
          pdfGenerator: (r: any) => {} 
        };
    }
  };

  const { records, add, update, delete: remove, title, formatter, pdfGenerator } = getSubTabData();

  const handleExportExcel = () => {
    const formatted = formatter(records as any);
    downloadExcelSheet(title, formatted, `Ekspor_${title.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportPdf = () => {
    pdfGenerator(records as any);
  };

  const filteredRecords = records.filter(r => {
    const searchStr = searchTerm.toLowerCase();
    return Object.values(r).some(val => 
      val && val.toString().toLowerCase().includes(searchStr)
    );
  });

  const [form, setForm] = useState<any>({});
  const [editForm, setEditForm] = useState<any>({});

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    add(form);
    setForm({});
  };

  const handleEdit = (rec: any) => {
    setEditForm({ ...rec });
    setEditId(rec.id);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      update({ ...editForm, id: editId });
      setEditId(null);
      setEditForm({});
    }
  };

  const handleCancelEdit = () => {
    setEditForm({});
    setEditId(null);
  };

  const getFields = () => {
    switch (normalizedTab) {
      case 'penelitian_pendapatan':
        return [
          { 
            key: 'bulan', 
            label: 'Bulan', 
            type: 'select', 
            options: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'] 
          },
          { key: 'pendapatanEtik', label: 'Pendapatan Etik (IDR)', placeholder: 'Nominal pendapatan uji etik...', type: 'number' },
          { key: 'pendapatanLabRiset', label: 'Pendapatan Lab Riset (IDR)', placeholder: 'Nominal pendapatan lab riset...', type: 'number' },
          { key: 'pendapatanInovasi', label: 'Pendapatan Inovasi (IDR)', placeholder: 'Nominal pendapatan gilir inovasi...', type: 'number' },
          { key: 'pendapatanUjiKlinik', label: 'Pendapatan Uji Klinik (IDR)', placeholder: 'Nominal pendapatan uji klinik...', type: 'number' },
        ];
      case 'uji_etik':
        return [
          { key: 'tanggalSuratMasuk', label: 'Tanggal Surat Masuk', type: 'date' },
          { key: 'nomorSuratMasuk', label: 'Nomor Surat Masuk', placeholder: 'Nomor surat masuk...', type: 'text' },
          { key: 'namaPeneliti', label: 'Nama Peneliti', placeholder: 'Nama lengkap peneliti...', type: 'text' },
          { key: 'nimNrpNip', label: 'NIM / NRP / NIP', placeholder: 'NIM / NRP / NIP...', type: 'text' },
          { key: 'cp', label: 'CP Kontak', placeholder: 'Nomor WhatsApp kontak...', type: 'text' },
          { key: 'institusi', label: 'Institusi', placeholder: 'Institusi asal...', type: 'text' },
          { 
            key: 'pendidikan', 
            label: 'Pendidikan', 
            type: 'select', 
            options: ['D3', 'D4', 'S1', 'S2', 'SP1', 'SP2', 'S3', '-'] 
          },
          { 
            key: 'jenisKegiatan', 
            label: 'Jenis Kegiatan', 
            type: 'select', 
            options: ['TUGAS AKHIR', 'CASE REPORT', 'PENELITIAN INSTITUSI'] 
          },
          { key: 'judulPenelitian', label: 'Judul Penelitian', placeholder: 'Judul lengkap penelitian...', type: 'textarea' },
          { key: 'jumlahSampelPenelitian', label: 'Jumlah Sampel Penelitian', placeholder: 'Jumlah sampel...', type: 'number' },
          { key: 'pengambilanData', label: 'Pengambilan Data', placeholder: 'Lokasi pengambilan data...', type: 'text' },
          { key: 'pembimbingKlinis', label: 'Pembimbing Klinis', placeholder: 'Nama pembimbing...', type: 'text' },
          { 
            key: 'reviewAwal', 
            label: 'Review Awal', 
            type: 'select', 
            options: ['WAKIL I', 'WAKIL II', 'SEKRETARIS I', 'SEKRETARIS II'] 
          },
          { 
            key: 'hasilReview', 
            label: 'Hasil Review', 
            type: 'select', 
            options: ['EXEMPTED', 'EXPEDITED MINOR', 'EXPEDITED MAYOR', 'FULL BOARD'] 
          },
          { key: 'catatanReviewer', label: 'Catatan Reviewer', placeholder: 'Tulis catatan...', type: 'textarea' },
          { key: 'tanggalSeminarEtik', label: 'Tanggal Seminar Etik', type: 'date' },
          { key: 'tanggalSertifikatEtik', label: 'Tanggal Sertifikat Etik', type: 'date' },
          { 
            key: 'monev', 
            label: 'Monev', 
            type: 'select', 
            options: ['SUDAH', 'BELUM'] 
          },
          { 
            key: 'laporan', 
            label: 'Laporan', 
            type: 'select', 
            options: ['BERJALAN', 'TERKUMPUL'] 
          },
          { key: 'pembayaranNominal', label: 'Nominal Pembayaran', placeholder: 'Nominal pembayaran etik...', type: 'number' },
          { 
            key: 'pembayaranStatus', 
            label: 'Status Pembayaran', 
            type: 'select', 
            options: ['Lunas', 'Belum Lunas'] 
          },
        ];
      case 'penelitian_uji_klinik':
        return [
          { key: 'tahun', label: 'Tahun', placeholder: 'Tahun...', type: 'text' },
          { key: 'judulPenelitian', label: 'Judul Penelitian', placeholder: 'Judul uji klinik...', type: 'textarea' },
          { key: 'mitraKerjasama', label: 'Mitra Kerjasama', placeholder: 'Mitra kerjasama...', type: 'text' },
          { key: 'timPenelitiFileName', label: 'Upload SK Tim Penelitian (Nama File)', placeholder: 'Contoh: sk_tim_uji_klinik.pdf...', type: 'file' },
          { key: 'ctaFileName', label: 'Upload CTA (Nama File)', placeholder: 'Contoh: cta_mou_vaksin.pdf...', type: 'file' },
          { key: 'danaRabPenelitian', label: 'Dana / RAB Penelitian', placeholder: 'Jumlah dana...', type: 'number' },
          { 
            key: 'status', 
            label: 'Status', 
            type: 'select', 
            options: ['SSV', 'ETIK', 'BUDGETING', 'CTA', 'RUNNING', 'CLOSSING'] 
          },
        ];
      case 'penelitian_publikasi':
        return [
          { key: 'namaAutor', label: 'Nama Autor', placeholder: 'Nama autor...', type: 'text' },
          { key: 'afiliasi', label: 'Afiliasi', placeholder: 'Afiliasi...', type: 'text' },
          { key: 'judulArtikelIlmiah', label: 'Judul Artikel Ilmiah', placeholder: 'Judul artikel ilmiah...', type: 'textarea' },
          { key: 'namaJurnalTerbit', label: 'Nama Jurnal Terbit', placeholder: 'Nama jurnal...', type: 'text' },
          { 
            key: 'jenisPublikasi', 
            label: 'Jenis Publikasi', 
            type: 'select', 
            options: ['Nasional', 'Internasional'] 
          },
          { 
            key: 'ranking', 
            label: 'Ranking jurnal', 
            type: 'select', 
            options: ['Q1', 'Q2', 'Q3', 'Q4', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'Tidak Terakreditasi'] 
          },
          { key: 'tanggalPublikasi', label: 'Tanggal Publikasi', type: 'date' },
          { key: 'doiSitusWeb', label: 'DOI / Situs Web', placeholder: 'https://doi.org/...', type: 'text' },
        ];
      case 'produk_inovasi':
        return [
          { key: 'tahun', label: 'Tahun', placeholder: 'Tahun inovasi...', type: 'text' },
          { key: 'namaProduk', label: 'Nama Produk', placeholder: 'Nama produk...', type: 'text' },
          { key: 'judulRisetInovasi', label: 'Judul Riset Inovasi', placeholder: 'Judul riset...', type: 'textarea' },
          { key: 'mitraKerjasama', label: 'Mitra Kerjasama', placeholder: 'Mitra...', type: 'text' },
          { key: 'sponsor', label: 'Sponsor', placeholder: 'Sponsor atau donatur...', type: 'text' },
          { key: 'pic', label: 'PIC / Penanggung Jawab', placeholder: 'Nama PIC...', type: 'text' },
          { key: 'fotoProdukName', label: 'Upload Foto Produk (Nama File)', placeholder: 'Contoh: foto_produk_a.png...', type: 'file' },
          { key: 'deskripsiSingkat', label: 'Deskripsi Singkat', placeholder: 'Tulis penjelasan singkat...', type: 'textarea' },
        ];
      case 'produk_inovasi_terjual':
        return [
          { key: 'tanggal', label: 'Tanggal', type: 'date' },
          { key: 'namaPasien', label: 'Nama Pasien', placeholder: 'Nama pasien...', type: 'text' },
          { key: 'namaProduk', label: 'Nama Produk Inovasi', placeholder: 'Nama produk...', type: 'text' },
          { key: 'jumlahPesananProduk', label: 'Jumlah Pesanan', placeholder: 'Jumlah pesanan...', type: 'number' },
        ];
      case 'buku_isbn':
        return [
          { key: 'tanggalTerbit', label: 'Tanggal Terbit', type: 'date' },
          { key: 'namaPenulis', label: 'Nama Penulis', placeholder: 'Nama penulis...', type: 'text' },
          { key: 'afiliasi', label: 'Afiliasi', placeholder: 'Afiliasi penulis...', type: 'text' },
          { key: 'judulBuku', label: 'Judul Buku / Bab', placeholder: 'Judul buku...', type: 'textarea' },
          { key: 'nomorIsbn', label: 'Nomor ISBN', placeholder: 'Nomor ISBN...', type: 'text' },
          { key: 'namaPubliser', label: 'Penerbit', placeholder: 'Penerbit...', type: 'text' },
          { key: 'linkPublikasiEbook', label: 'Link E-Book / Publikasi', placeholder: 'https://...', type: 'text' },
          { key: 'buktiBukuCetakName', label: 'Upload Bukti Buku Cetak (Nama File)', placeholder: 'Contoh: bukti_buku_a.pdf...', type: 'file' },
        ];
      case 'pengabdian_masyarakat':
        return [
          { key: 'nama', label: 'Nama Ketua / Pelaksana', placeholder: 'Nama lengkap ketua...', type: 'text' },
          { key: 'ksmDepartemen', label: 'KSM / Departemen', placeholder: 'Contoh: KSM Bedah...', type: 'text' },
          { key: 'judul', label: 'Judul Kegiatan', placeholder: 'Judul kegiatan pengmas...', type: 'textarea' },
          { key: 'skema', label: 'Skema Pengabdian', placeholder: 'Contoh: Pengabdian Masyarakat Hibah Dr. Soetomo...', type: 'text' },
          { key: 'tahun', label: 'Tahun', placeholder: 'Tahun kegiatan...', type: 'text' },
        ];
      case 'proposal_arf':
        return [
          { key: 'ketuaPeneliti', label: 'Ketua Peneliti', placeholder: 'Nama ketua...', type: 'text' },
          { key: 'unitKerja', label: 'Unit Kerja', placeholder: 'Unit kerja...', type: 'text' },
          { key: 'anggotaPeneliti', label: 'Anggota Peneliti (Pisahkan dengan koma)', placeholder: 'Anggota...', type: 'text' },
          { key: 'judulPenelitian', label: 'Judul Penelitian', placeholder: 'Judul penelitian...', type: 'textarea' },
          { 
            key: 'skema', 
            label: 'Skema ARF', 
            type: 'select', 
            options: ['ARF-A', 'ARF-B'] 
          },
          { key: 'targetLuaran', label: 'Target Luaran', placeholder: 'Target luaran...', type: 'text' },
          { key: 'danaHibahDiperoleh', label: 'Dana Hibah Diperoleh', placeholder: 'Jumlah dana...', type: 'number' },
        ];
      case 'submission_cphm':
        return [
          { key: 'tanggal', label: 'Tanggal', type: 'date' },
          { key: 'judulArtikel', label: 'Judul Artikel', placeholder: 'Judul artikel...', type: 'textarea' },
          { key: 'author', label: 'Author', placeholder: 'Nama author...', type: 'text' },
          { key: 'afiliasi', label: 'Afiliasi', placeholder: 'Afiliasi...', type: 'text' },
          { key: 'fileArtikelName', label: 'Upload File Artikel (Nama File)', placeholder: 'Contoh: asuhan_gizi_cphm.pdf...', type: 'file' },
        ];
      case 'paten':
        return [
          { key: 'tanggalTerbit', label: 'Tanggal Terbit', type: 'date' },
          { key: 'namaAutor', label: 'Nama Autor', placeholder: 'Nama autor...', type: 'text' },
          { key: 'afiliasi', label: 'Afiliasi', placeholder: 'Afiliasi...', type: 'text' },
          { key: 'judulPaten', label: 'Judul Paten', placeholder: 'Judul paten...', type: 'textarea' },
          { key: 'nomorPaten', label: 'Nomor Paten', placeholder: 'Nomor paten...', type: 'text' },
          { key: 'buktiSertifikatPatenName', label: 'Upload Bukti Sertifikat Paten (Nama File)', placeholder: 'sertifikat_paten_a.pdf...', type: 'file' },
        ];
      case 'hki':
        return [
          { key: 'tanggalTerbit', label: 'Tanggal Terbit', type: 'date' },
          { key: 'namaAutor', label: 'Nama Autor', placeholder: 'Nama autor...', type: 'text' },
          { key: 'afiliasi', label: 'Afiliasi', placeholder: 'Afiliasi...', type: 'text' },
          { key: 'judulHki', label: 'Judul Hak Cipta (HKI)', placeholder: 'Judul HKI...', type: 'textarea' },
          { key: 'nomorHki', label: 'Nomor HKI', placeholder: 'Nomor HKI...', type: 'text' },
          { key: 'buktiSertifikatHkiName', label: 'Upload Bukti Sertifikat HKI (Nama File)', placeholder: 'sertifikat_hki_a.pdf...', type: 'file' },
        ];
      default:
        return [];
    }
  };

  const fields = getFields();

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inovasi & Penelitian</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase tracking-wider rounded-xl hover:bg-emerald-100 transition-all cursor-pointer border border-emerald-100 shadow-sm shadow-emerald-500/5 group"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Ekspor Excel
          </button>
          <button 
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 font-bold text-[10px] uppercase tracking-wider rounded-xl hover:bg-rose-100 transition-all cursor-pointer border border-rose-100 shadow-sm shadow-rose-500/5 group"
          >
            <FilePieChart className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Ekspor PDF
          </button>
        </div>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[550px]">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/30">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-unair-gold" />
                {title}
              </h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-unair-blue/20 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              {filteredRecords.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-6 py-4 w-16">No</th>
                      {fields.slice(0, 4).map(f => (
                        <th key={f.key} className="px-6 py-4">{f.label}</th>
                      ))}
                      <th className="px-6 py-4 text-right w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.map((rec, idx) => (
                      <tr key={rec.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-400">{(idx + 1).toString().padStart(2, '0')}</span>
                        </td>
                        {fields.slice(0, 4).map(f => {
                          const val = rec[f.key];
                          const isCurrency = f.key.toLowerCase().includes('pendapatan') || f.key.toLowerCase().includes('dana') || f.key.toLowerCase().includes('pembayarannominal') || f.key.toLowerCase().includes('nominal');
                          const formattedValue = (typeof val === 'number' && isCurrency)
                            ? `Rp ${val.toLocaleString('id-ID')}`
                            : val;

                          return (
                            <td key={f.key} className="px-6 py-4">
                              <div className="max-w-xs">
                                {f.type === 'file' && val ? (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenFile(rec, f.key)}
                                    className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-xl border border-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer max-w-full text-left"
                                    title={`Lihat ${f.label}`}
                                  >
                                    <Eye className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                    <span className="truncate">{val}</span>
                                  </button>
                                ) : (
                                  <p className={cn(
                                    "text-sm font-medium text-slate-700 leading-relaxed truncate",
                                    f.key.toLowerCase().includes('judul') || f.key.toLowerCase().includes('produk') ? 'font-bold' : ''
                                  )} title={formattedValue?.toString()}>
                                    {formattedValue !== undefined && formattedValue !== null && formattedValue !== '' ? formattedValue : '-'}
                                  </p>
                                )}
                              </div>
                            </td>
                          );
                        })}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {fields.filter(f => f.type === 'file').map(f => {
                              const hasFile = !!rec[f.key];
                              if (!hasFile) return null;
                              return (
                                <button 
                                  key={f.key}
                                  onClick={() => handleOpenFile(rec, f.key)}
                                  className="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                                  title={`Lihat ${f.label}`}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              );
                            })}
                            <button 
                              onClick={() => handleEdit(rec)}
                              className="p-2 text-slate-400 hover:text-unair-blue hover:bg-unair-blue/5 rounded-lg transition-all cursor-pointer"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setDeleteId(rec.id)}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                    <Info className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-slate-900 font-bold">Tidak ada data ditemukan</h3>
                  <p className="text-sm text-slate-400 mt-1">Belum ada catatan untuk kategori ini.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Form Area */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <FolderPlus className="w-24 h-24 text-unair-blue" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-unair-gold" />
              Tambah {title}
            </h3>

            <form onSubmit={handleAdd} className="space-y-4">
              {fields.map((f, i) => (
                <div key={f.key}>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{f.label}</label>
                  {f.type === 'select' ? (
                    <select
                      value={form[f.key] || ''}
                      onChange={(e) => setForm({...form, [f.key]: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none"
                    >
                      <option value="">-- Pilih {f.label} --</option>
                      {f.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea
                      value={form[f.key] || ''}
                      onChange={(e) => setForm({...form, [f.key]: e.target.value})}
                      placeholder={f.placeholder}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none resize-none"
                    />
                  ) : f.type === 'file' ? (() => {
                    const nameKey = f.key;
                    const fileKey = nameKey.endsWith('Name') ? nameKey.slice(0, -4) : nameKey;
                    const driveKey = nameKey.endsWith('Name') ? nameKey.slice(0, -4) + 'DriveUrl' : nameKey + 'DriveUrl';

                    const fileName = form[nameKey];
                    const fileUrl = form[driveKey] || form[fileKey];
                    const isUploading = uploadingKeys[nameKey] === true;

                    return (
                      <div className="space-y-1">
                        <div 
                          onClick={() => !isUploading && document.getElementById(`add_file_input_${f.key}`)?.click()}
                          className={`border-2 border-dashed border-slate-200 hover:border-unair-blue rounded-2xl p-4 text-center cursor-pointer transition-all hover:bg-slate-50 bg-slate-50/20 ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          <input 
                            id={`add_file_input_${f.key}`}
                            type="file" 
                            disabled={isUploading}
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploadingKeys(prev => ({ ...prev, [nameKey]: true }));
                              const reader = new FileReader();
                              reader.onload = async () => {
                                try {
                                  const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                  setForm(prev => ({
                                    ...prev,
                                    [nameKey]: file.name,
                                    [fileKey]: reader.result as string,
                                    [driveKey]: driveUrl
                                  }));
                                } catch (err) {
                                  alert("Gagal mengunggah ke Google Drive: " + (err instanceof Error ? err.message : String(err)));
                                  setForm(prev => ({
                                    ...prev,
                                    [nameKey]: file.name,
                                    [fileKey]: reader.result as string
                                  }));
                                } finally {
                                  setUploadingKeys(prev => ({ ...prev, [nameKey]: false }));
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="hidden"
                          />
                          {isUploading ? (
                            <div className="space-y-1 py-1">
                              <div className="w-5 h-5 mx-auto border-2 border-unair-blue border-t-transparent rounded-full animate-spin" />
                              <p className="text-[11px] font-bold text-amber-600 animate-pulse">Mengunggah ke Google Drive...</p>
                            </div>
                          ) : fileUrl ? (
                            <div className="space-y-1 py-1">
                              <p className="text-xs font-bold text-slate-700 truncate max-w-[200px] mx-auto">{fileName}</p>
                              <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                {fileUrl.startsWith('http') ? '✓ Drive Terkoneksi' : 'File Terunggah Lokal'}
                              </span>
                               <div className="flex justify-center gap-2 mt-1.5">
                                <button 
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenFile(form, nameKey);
                                  }}
                                  className="text-[10px] text-amber-600 hover:underline font-bold flex items-center gap-0.5"
                                >
                                  <Eye className="w-3 h-3" /> Lihat File
                                </button>
                                <span className="text-slate-300 text-[10px]">|</span>
                                <button 
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setForm(prev => {
                                      const next = { ...prev };
                                      delete next[nameKey];
                                      delete next[fileKey];
                                      delete next[driveKey];
                                      return next;
                                    });
                                  }}
                                  className="text-[10px] text-rose-500 hover:underline font-bold"
                                >
                                  Hapus File
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="py-2.5">
                              <p className="text-xs text-slate-500 font-medium">Klik untuk memilih atau seret file ke sini</p>
                              <p className="text-[10px] text-slate-400 mt-1">Mendukung PDF atau Gambar</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })() : (
                    <input
                      type={f.type}
                      value={form[f.key] || ''}
                      onChange={(e) => {
                        const val = f.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
                        setForm({...form, [f.key]: val});
                      }}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none"
                    />
                  )}
                </div>
              ))}
              
              <button 
                type="submit"
                className="w-full py-4 mt-4 bg-unair-blue text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-unair-blue-light transition-all shadow-xl shadow-unair-blue/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                Simpan {title}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) remove(deleteId);
          setDeleteId(null);
        }}
        title={`Hapus Data ${title}`}
        message="Tindakan ini tidak dapat dibatalkan dan data akan dihapus secara permanen."
      />

      {/* Edit Modal */}
      <AnimatePresence>
        {editId && (
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
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
            >
              <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-unair-blue/10 flex items-center justify-center text-unair-blue">
                    <Pencil className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Perbarui {title}</h3>
                    <p className="text-sm text-slate-500">Edit informasi data yang tersimpan.</p>
                  </div>
                </div>
                <button 
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-white hover:shadow-sm rounded-full text-slate-400 transition-all cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-8 space-y-5 max-h-[60vh] overflow-y-auto">
                {fields.map((f, i) => (
                  <div key={f.key}>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{f.label}</label>
                    {f.type === 'select' ? (
                      <select
                        value={editForm[f.key] || ''}
                        onChange={(e) => setEditForm({...editForm, [f.key]: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none"
                      >
                        <option value="">-- Pilih {f.label} --</option>
                        {f.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea
                        value={editForm[f.key] || ''}
                        onChange={(e) => setEditForm({...editForm, [f.key]: e.target.value})}
                        placeholder={f.placeholder}
                        rows={3}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none resize-none"
                      />
                    ) : f.type === 'file' ? (() => {
                      const nameKey = f.key;
                      const fileKey = nameKey.endsWith('Name') ? nameKey.slice(0, -4) : nameKey;
                      const driveKey = nameKey.endsWith('Name') ? nameKey.slice(0, -4) + 'DriveUrl' : nameKey + 'DriveUrl';

                      const fileName = editForm[nameKey];
                      const fileUrl = editForm[driveKey] || editForm[fileKey];
                      const isUploading = uploadingKeys[nameKey] === true;

                      return (
                        <div className="space-y-1">
                          <div 
                            onClick={() => !isUploading && document.getElementById(`edit_file_input_${f.key}`)?.click()}
                            className={`border-2 border-dashed border-slate-200 hover:border-unair-blue rounded-2xl p-4 text-center cursor-pointer transition-all hover:bg-slate-50 bg-slate-50/20 ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                          >
                            <input 
                              id={`edit_file_input_${f.key}`}
                              type="file" 
                              disabled={isUploading}
                              accept="image/*,application/pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setUploadingKeys(prev => ({ ...prev, [nameKey]: true }));
                                const reader = new FileReader();
                                reader.onload = async () => {
                                  try {
                                    const driveUrl = await uploadToAppsScript(file.name, reader.result as string, file.type);
                                    setEditForm(prev => ({
                                      ...prev,
                                      [nameKey]: file.name,
                                      [fileKey]: reader.result as string,
                                      [driveKey]: driveUrl
                                    }));
                                  } catch (err) {
                                    alert("Gagal mengunggah ke Google Drive: " + (err instanceof Error ? err.message : String(err)));
                                    setEditForm(prev => ({
                                      ...prev,
                                      [nameKey]: file.name,
                                      [fileKey]: reader.result as string
                                    }));
                                  } finally {
                                    setUploadingKeys(prev => ({ ...prev, [nameKey]: false }));
                                  }
                                };
                                reader.readAsDataURL(file);
                              }}
                              className="hidden"
                            />
                            {isUploading ? (
                              <div className="space-y-1 py-1">
                                <div className="w-5 h-5 mx-auto border-2 border-unair-blue border-t-transparent rounded-full animate-spin" />
                                <p className="text-[11px] font-bold text-amber-600 animate-pulse">Mengunggah ke Google Drive...</p>
                              </div>
                            ) : fileUrl ? (
                              <div className="space-y-1 py-1">
                                <p className="text-xs font-bold text-slate-700 truncate max-w-[200px] mx-auto">{fileName}</p>
                                <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                  {fileUrl.startsWith('http') ? '✓ Drive Terkoneksi' : 'File Terunggah Lokal'}
                                </span>
                                 <div className="flex justify-center gap-2 mt-1.5">
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenFile(editForm, nameKey);
                                    }}
                                    className="text-[10px] text-amber-600 hover:underline font-bold flex items-center gap-0.5"
                                  >
                                    <Eye className="w-3 h-3" /> Lihat File
                                  </button>
                                  <span className="text-slate-300 text-[10px]">|</span>
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditForm(prev => {
                                        const next = { ...prev };
                                        delete next[nameKey];
                                        delete next[fileKey];
                                        delete next[driveKey];
                                        return next;
                                      });
                                    }}
                                    className="text-[10px] text-rose-500 hover:underline font-bold"
                                  >
                                    Hapus File
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="py-2.5">
                                <p className="text-xs text-slate-500 font-medium">Klik untuk memilih atau seret file ke sini</p>
                                <p className="text-[10px] text-slate-400 mt-1">Mendukung PDF atau Gambar</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })() : (
                      <input
                        type={f.type}
                        value={editForm[f.key] || ''}
                        onChange={(e) => {
                          const val = f.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
                          setEditForm({...editForm, [f.key]: val});
                        }}
                        placeholder={f.placeholder}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-unair-blue/10 transition-all outline-none"
                      />
                    )}
                  </div>
                ))}
              </form>

              <div className="p-8 pt-4 flex gap-3 bg-slate-50/30">
                <button 
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  onClick={handleUpdate}
                  className="flex-2 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Simpan Perubahan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
