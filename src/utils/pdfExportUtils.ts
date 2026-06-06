import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  PraPendidikanRecord,
  IpeRecord,
  ModulIpeRecord,
  StudentInboundRecord,
  KunjunganRecord,
  MouRecord,
  AkselerasiRecord,
  PelatihanRecord,
  InhouseTrainingRecord,
  KerjasamaSkpRecord,
  StudiBandingRecord,
  TrainerSertifikasiRecord,
  PenelitianRecord,
  PendapatanPenelitianRecord,
  UjiEtikRecord,
  UjiKlinikRecord,
  PenelitianPublikasiRecord,
  ProdukInovasiRecord,
  ProdukInovasiTerjualRecord,
  BukuIsbnRecord,
  PengabdianMasyarakatRecord,
  ProposalArfRecord,
  SubmissionCphmRecord,
  PatenRecord,
  HkiRecord
} from '../context/SMKSContext';

interface ExportPdfData {
  praPendidikanRecords: PraPendidikanRecord[];
  ipeRecords: IpeRecord[];
  modulIpeRecords: ModulIpeRecord[];
  studentInboundRecords: StudentInboundRecord[];
  kunjunganRecords: KunjunganRecord[];
  mouRecords: MouRecord[];
  akselerasiRecords: AkselerasiRecord[];
  pelatihanRecords: PelatihanRecord[];
  penelitianRecords: PenelitianRecord[];
  dashboardStats: {
    pendidikan: {
      totalOrientasiPeserta: number;
      totalIpePeserta: number;
      totalStudentInbound: number;
      totalAkselerasiPeserta: number;
    };
    pelatihan: {
      totalTrained: number;
    };
    penelitian: {
      activeResearches: number;
      grants: string;
    };
  };
}

export function generateExecutiveReportPdf(data: ExportPdfData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor: [number, number, number] = [13, 46, 92]; // RSUA Navy #0D2E5C
  const goldColor: [number, number, number] = [198, 146, 20]; // RSUA Gold #C69214
  const darkTextColor: [number, number, number] = [30, 41, 59]; // Slate 800
  const lightBgColor: [number, number, number] = [248, 250, 252]; // Slate 50
  
  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Footer / Header helper for subsequent pages
  let totalPagesExp = '{total_pages_count_string}';

  const addHeaderFooter = (pdf: jsPDF, pageNum: number) => {
    // Top small thin line
    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setLineWidth(1);
    pdf.line(15, 10, 195, 10);

    // Footer
    pdf.setDrawColor(226, 232, 240); // border gray
    pdf.setLineWidth(0.5);
    pdf.line(15, 280, 195, 280);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184); // light slate gray
    pdf.text('SMKS RSUA - Laporan Rekapitulasi Kinerja Strategis', 15, 285);
    pdf.text(`Halaman ${pageNum} dari ${totalPagesExp}`, 195, 285, { align: 'right' });
  };

  // ==========================================
  // PAGE 1: KOP SURAT, TITLE & KPI SUMMARIES
  // ==========================================

  // Letterhead
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('UNIVERSITAS AIRLANGGA', 15, 20);
  
  doc.setFontSize(14);
  doc.text('RUMAH SAKIT UNIVERSITAS AIRLANGGA', 15, 26);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Kampus C Universitas Airlangga, Mulyorejo, Surabaya 60115', 15, 31);
  doc.text('Telp. (031) 5916290 | Email: info@rsua.unair.ac.id | Web: rsua.unair.ac.id', 15, 35);

  // Logo Box
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.8);
  doc.rect(155, 16, 40, 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('SMKS - RSUA', 175, 21, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('Dokumen Resmi Digital', 175, 25, { align: 'center' });

  // Letterhead double line
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(1.2);
  doc.line(15, 39, 195, 39);
  doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.setLineWidth(0.5);
  doc.line(15, 41, 195, 41);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59); // dark text
  doc.text('LAPORAN REKAPITULASI KINERJA STRATEGIS (SMKS)', 105, 52, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Bidang Pendidikan, Pelatihan, & Inovasi Penelitian KSM / Instalasi Pelaksana', 105, 57, { align: 'center' });

  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(90, 61, 120, 61);

  // Metadata Panel Box
  doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.rect(15, 66, 180, 18, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Tanggal Ekspor:', 20, 72);
  doc.text('Status Laporan:', 20, 77);
  doc.text('Sistem:', 110, 72);
  doc.text('Pengekspor:', 110, 77);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(todayStr, 47, 72);
  doc.text('Dokumen Final Eksekutif (Bergaransi Hukum)', 47, 77);
  doc.text('Executive Strategic RSUA App', 130, 72);
  doc.text(localStorage.getItem('user_email') || 'User Executive RSUA', 130, 77);

  // SECTION I: KPI Summary Boxes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('I. RINGKASAN INDIKATOR KINERJA UTAMA (IKU)', 15, 93);
  
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.3);
  doc.line(15, 95, 195, 95);

  const totalEduPeserta = 
    data.dashboardStats.pendidikan.totalOrientasiPeserta + 
    data.dashboardStats.pendidikan.totalIpePeserta + 
    data.dashboardStats.pendidikan.totalStudentInbound + 
    data.dashboardStats.pendidikan.totalAkselerasiPeserta;

  // Box 1: Pendidikan
  doc.setFillColor(239, 246, 255); // bluebg
  doc.setDrawColor(191, 219, 254);
  doc.rect(15, 100, 56, 25, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(29, 78, 216); // text blue
  doc.text('PENDIDIKAN', 43, 105, { align: 'center' });
  doc.setFontSize(16);
  doc.text(String(totalEduPeserta), 43, 114, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Total Peserta Ritel', 43, 120, { align: 'center' });

  // Box 2: Pelatihan
  doc.setFillColor(240, 253, 250); // green bg
  doc.setDrawColor(153, 246, 228);
  doc.rect(77, 100, 56, 25, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 118, 110); // text green
  doc.text('PELATIHAN', 105, 105, { align: 'center' });
  doc.setFontSize(16);
  doc.text(String(data.dashboardStats.pelatihan.totalTrained), 105, 114, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Peserta Terlatih', 105, 120, { align: 'center' });

  // Box 3: Penelitian
  doc.setFillColor(254, 252, 232); // yellow bg
  doc.setDrawColor(254, 240, 138);
  doc.rect(139, 100, 56, 25, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(161, 98, 7); // text yellow
  doc.text('PENELITIAN & PATEN', 167, 105, { align: 'center' });
  doc.setFontSize(16);
  doc.text(String(data.dashboardStats.penelitian.activeResearches), 167, 114, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Proyek Aktif & Hibah', 167, 120, { align: 'center' });


  // ==========================================
  // SECTION II: PRAPENDIDIKAN & ORIENTASI
  // ==========================================
  let currentY = 134;

  const drawSectionTitle = (title: string, yPos: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(title, 15, yPos);
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.3);
    doc.line(15, yPos + 2, 195, yPos + 2);
    return yPos + 6;
  };

  currentY = drawSectionTitle('II. PRAPENDIDIKAN & ORIENTASI MAHASISWA', currentY);

  const praPendidikanData = data.praPendidikanRecords.map((r, idx) => [
    idx + 1,
    r.tanggalPelaksanaan,
    r.institusiPendidikan || 'Umum',
    r.institusiType === 'UNAIR' 
      ? `UNAIR - ${r.unairFakultas} (${r.unairProdi})` 
      : `Non UNAIR - ${r.nonUnairUniversitas || '-'} - ${r.nonUnairFakultas || '-'}`,
    r.totalPeserta || 0
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['No', 'Tanggal Pelaksanaan', 'Institusi', 'Fakultas / Program Studi', 'Peserta']],
    body: praPendidikanData.length > 0 ? praPendidikanData : [['-', 'Tidak ada data tercatat', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5, textColor: darkTextColor },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 35, halign: 'center' },
      2: { cellWidth: 45 },
      3: { cellWidth: 70 },
      4: { cellWidth: 20, halign: 'center', fontStyle: 'bold' }
    },
    margin: { left: 15, right: 15 },
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber);
    }
  });

  // Fetch final Y of last table to push next headers
  currentY = (doc as any).lastAutoTable.finalY + 10;

  // ==========================================
  // SECTION III: INTERPROFESSIONAL EDUCATION (IPE)
  // ==========================================
  
  // Check if we need to start a new page to avoid orphans
  if (currentY > 215) {
    doc.addPage();
    currentY = 20; // reset to top of new page (minus page margin header)
  }

  currentY = drawSectionTitle('III. INTERPROFESSIONAL EDUCATION (IPE)', currentY);

  const keyIpeData = data.ipeRecords.map((r, idx) => [
    idx + 1,
    r.tema,
    r.pemateri,
    r.moderator,
    `${r.ksm} \n(${r.tanggal})`,
    `UA: ${r.pesertaUnair || 0}\nNon: ${r.pesertaNonUnair || 0}`
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['No', 'Tema Kegiatan IPE', 'Pemateri', 'Moderator', 'KSM & Tanggal', 'UA / Non']],
    body: keyIpeData.length > 0 ? keyIpeData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5, textColor: darkTextColor },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 50 },
      2: { cellWidth: 30, fontStyle: 'bold' },
      3: { cellWidth: 30 },
      4: { cellWidth: 35, halign: 'center' },
      5: { cellWidth: 25, halign: 'center' }
    },
    margin: { left: 15, right: 15 },
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber);
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // ==========================================
  // SECTION IV: STUDENT INBOUND & MAHASISWA ASING
  // ==========================================
  if (currentY > 215) {
    doc.addPage();
    currentY = 20;
  }

  currentY = drawSectionTitle('IV. STUDENT INBOUND & MAHASISWA ASING', currentY);

  const inboundData = data.studentInboundRecords.map((r, idx) => {
    let durStr = '0 hari';
    if (r.tanggalMasuk && r.tanggalKeluar) {
      const s = new Date(r.tanggalMasuk);
      const e = new Date(r.tanggalKeluar);
      if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
        const days = Math.floor((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        durStr = `${days > 0 ? days : 0} hari`;
      }
    }
    return [
      idx + 1,
      `${r.namaStudent}\n(${r.fakultasPengirim})`,
      r.universitas,
      `KSM: ${r.ksmTujuan || 'Umum'}\nPemb: ${r.pembimbing || '-'}`,
      `${r.tanggalMasuk} s/d \n${r.tanggalKeluar}`,
      durStr
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['No', 'Identitas / Fakultas', 'Universitas Asal', 'KSM & Pembimbing', 'Sesi / Periode', 'Durasi']],
    body: inboundData.length > 0 ? inboundData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5, textColor: darkTextColor },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 40 },
      2: { cellWidth: 35 },
      3: { cellWidth: 45 },
      4: { cellWidth: 32, halign: 'center' },
      5: { cellWidth: 18, halign: 'center', fontStyle: 'bold' }
    },
    margin: { left: 15, right: 15 },
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber);
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // ==========================================
  // SECTION V: PELATIHAN & KEY SERTIFIKASI
  // ==========================================
  if (currentY > 215) {
    doc.addPage();
    currentY = 20;
  }

  currentY = drawSectionTitle('V. PELAKSANAAN KELAS PELATIHAN & SERTIFIKASI', currentY);

  const pelatihanData = data.pelatihanRecords.map((r, idx) => [
    idx + 1,
    r.namaPelatihan,
    r.kategori,
    `${r.jumlahPeserta} orang \n(${r.totalJam} JP)`,
    `+${r.sertifikasiBaru} Sertifikat`,
    `Rp ${r.anggaranRealisasi.toLocaleString('id-ID')}`,
    r.tanggal
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['No', 'Topik/Sesi Pelatihan', 'Kategori', 'Peserta (JP)', 'Sertifikat', 'Realisasi Anggaran', 'Tanggal']],
    body: pelatihanData.length > 0 ? pelatihanData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5, textColor: darkTextColor },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 50, fontStyle: 'bold' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 28, halign: 'center' },
      4: { cellWidth: 22, halign: 'center' },
      5: { cellWidth: 30, halign: 'right' },
      6: { cellWidth: 20, halign: 'center' }
    },
    margin: { left: 15, right: 15 },
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber);
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // ==========================================
  // SECTION VI: REGISTRASI PROYEK PENELITIAN
  // ==========================================
  if (currentY > 215) {
    doc.addPage();
    currentY = 20;
  }

  currentY = drawSectionTitle('VI. REGISTRASI PROYEK PENELITIAN & LISENSI PATEN', currentY);

  const penelitianData = data.penelitianRecords.map((r, idx) => [
    idx + 1,
    r.judul,
    r.penelitiUtama,
    r.status,
    `Scopus: ${r.publikasiScopus ? 'Ya' : 'Tidak'}\nPaten: ${r.patenTerdaftar ? 'Ya' : 'Tidak'}`,
    `Rp ${(r.danaHibah || 0).toLocaleString('id-ID')}`,
    r.tanggalMulai
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['No', 'Judul Penelitian / Uji Klinis', 'Peneliti Utama', 'Status Jurnal', 'Scopus & Paten', 'Dana Hibah', 'Tanggal Mulai']],
    body: penelitianData.length > 0 ? penelitianData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.2, textColor: darkTextColor },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 55, fontStyle: 'bold' },
      2: { cellWidth: 30 },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 25 },
      5: { cellWidth: 22, halign: 'right' },
      6: { cellWidth: 18, halign: 'center' }
    },
    margin: { left: 15, right: 15 },
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber);
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 14;

  // ==========================================
  // SIGNATURE SIGN-OFF SECTION
  // ==========================================
  if (currentY > 230) {
    doc.addPage();
    currentY = 25;
  }

  // Add thin divider before signature
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, currentY, 195, currentY);
  currentY += 6;

  // Footer / disclaimer small print
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('* Laporan dicetak secara dinamis dari Sistem Manajemen Kinerja Strategis (SMKS) Rumah Sakit Universitas Airlangga.', 15, currentY);
  doc.text('Segala perubahan data merupakan tanggung jawab administrator sistem komite akademik.', 15, currentY + 3.5);

  // Mengetahui
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Surabaya, ${todayStr}`, 150, currentY + 4, { align: 'center' });
  doc.text('Mengetahui,', 150, currentY + 8, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.text('Manajer Bidang Pendidikan & Penelitian RSUA', 150, currentY + 12, { align: 'center' });

  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.5);
  doc.line(120, currentY + 34, 180, currentY + 34);

  doc.text('KOMITE AKADEMIK & INOVASI', 150, currentY + 38, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Komite Koordinasi Pendidikan RSUA', 150, currentY + 42, { align: 'center' });


  // ==========================================
  // CALCULATE EXACT PAGES AND ENCODE VALUE
  // ==========================================
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Replace the page counter placeholder
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // light slate gray
    // Re-draw standard page counters to avoid overlapping
    doc.text(`Halaman ${i} dari ${totalPages}`, 195, 285, { align: 'right' });
    // Overwrite the placeholder '{total_pages_count_string}' with nothing or space since we drew it clean now
    // Actually our template string can just be overwritten or draw page clean.
  }

  // Trigger browser download
  doc.save(`Laporan_Eksekutif_SMKS_RSUA_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function createCellLink(text: string, url?: string): any {
  if (!url) return text || '-';
  return {
    content: `${text || 'Buka Berkas'}\n(Klik Buka)`,
    linkUrl: url,
    styles: { textColor: [29, 78, 216], fontStyle: 'bold' as const } // Blue color for links
  };
}

export function handleDidDrawCellWithLink(doc: jsPDF, data: any) {
  if (data.cell.raw && data.cell.raw.linkUrl) {
    doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: data.cell.raw.linkUrl });
  }
}

// =========================================================================
// SUB-MENU DIRECT PDF GENERATION (NO KOP SURAT / NO TANDA TANGAN)
// =========================================================================

function buildCleanSubMenuDoc(
  title: string,
  subtitle: string,
  isLandscape: boolean = false
) {
  const doc = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor: [number, number, number] = [13, 46, 92]; // RSUA Navy #0D2E5C
  const goldColor: [number, number, number] = [198, 146, 20]; // RSUA Gold #C69214
  
  const width = isLandscape ? 297 : 210;
  const height = isLandscape ? 210 : 297;
  const margin = 15;
  const contentWidth = width - (margin * 2); // 267 or 180

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Top Title Card (No Letterhead copy, just elegant, clean colored badge)
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, 15, contentWidth, 22, 'F');

  // Horizontal gold accent line under top title card
  doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.rect(margin, 37, contentWidth, 1.5, 'F');

  // Title Text inside Navy Card - Centered vertically with high-contrast text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  // Center vertically inside the 22mm card (y=15 to 37)
  doc.text(title.toUpperCase(), margin + 5, 28);

  // Metadata block (directly below title block)
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.rect(margin, 43, contentWidth, 10, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Tanggal Cetak:', margin + 4, 49.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(todayStr, margin + 24, 49.5);

  const addHeaderFooter = (pdf: jsPDF, pageNum: number, totalPagesPlaceholder: string) => {
    // Top tiny indicator line
    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setLineWidth(0.5);
    pdf.line(margin, 8, width - margin, 8);

    // Bottom border gray line
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.5);
    pdf.line(margin, height - 15, width - margin, height - 15);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(148, 163, 184); // light slate gray
    pdf.text(`SMKS RSUA - Laporan Bidang ${title} | Cetak Mandiri`, margin, height - 11);
    pdf.text(`Halaman ${pageNum} dari ${totalPagesPlaceholder}`, width - margin, height - 11, { align: 'right' });
  };

  return { doc, startY: 62, margin, width, height, contentWidth, addHeaderFooter, primaryColor };
}

function finalizePdfPages(doc: jsPDF, title: string, isLandscape: boolean = false, addHeaderFooter: any) {
  const totalPages = (doc as any).internal.getNumberOfPages();
  const width = isLandscape ? 297 : 210;
  const height = isLandscape ? 210 : 297;
  const margin = 15;
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Draw the footers
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // light slate gray
    
    // Overwrite the footnote safely
    doc.text(`SMKS RSUA - Laporan Bidang ${title.replace(/_/g, ' ')} | Cetak Mandiri`, margin, height - 11);
    doc.text(`Halaman ${i} dari ${totalPages}`, width - margin, height - 11, { align: 'right' });
  }

  const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Laporan_${cleanTitle}_RSUA_${new Date().toISOString().split('T')[0]}.pdf`);
}

// 1. PraPendidikan & Orientasi (Subtab A)
export function generatePraPendidikanPdf(records: PraPendidikanRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Prapendidikan & Orientasi',
    'Sub-Menu Pendidikan Kelas A'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.tanggalPelaksanaan,
    r.institusiPendidikan || 'Umum',
    r.institusiType === 'UNAIR' 
      ? `UNAIR - ${r.unairFakultas} (${r.unairProdi})` 
      : `Non UNAIR - ${r.nonUnairUniversitas || '-'} - ${r.nonUnairFakultas || '-'}`,
    r.totalPeserta || 0
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Tanggal Pelaksanaan', 'Institusi', 'Fakultas / Program Studi', 'Peserta']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 35, halign: 'center' },
      2: { cellWidth: 45 },
      3: { cellWidth: 70 },
      4: { cellWidth: 20, halign: 'center', fontStyle: 'bold' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Prapendidikan_Orientasi', false, addHeaderFooter);
}

// 2. Kegiatan IPE (Subtab B)
export function generateIpePdf(records: IpeRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Kegiatan Interprofessional Education',
    'Sub-Menu Pendidikan Kelas B'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.tema,
    r.pemateri,
    r.moderator,
    `${r.ksm} \n(${r.tanggal})`,
    `UA: ${r.pesertaUnair || 0}\nNon: ${r.pesertaNonUnair || 0}`
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Tema Kegiatan IPE', 'Pemateri', 'Moderator', 'KSM & Tanggal', 'UA / Non']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 50 },
      2: { cellWidth: 30, fontStyle: 'bold' },
      3: { cellWidth: 30 },
      4: { cellWidth: 35, halign: 'center' },
      5: { cellWidth: 25, halign: 'center' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Kegiatan_IPE', false, addHeaderFooter);
}

// 3. Buku & Modul IPE (Subtab C)
export function generateModulIpePdf(records: ModulIpeRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Buku & Modul IPE',
    'Sub-Menu Pendidikan Kelas C'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.judulBuku,
    r.penerbit || 'Airlangga University Press',
    r.isbn || 'Belum Ada',
    r.tanggalTerbit
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Judul Buku / Modul IPE', 'Penerbit', 'ISBN', 'Tanggal Terbit']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 80, fontStyle: 'bold' },
      2: { cellWidth: 45 },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 18, halign: 'center' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Buku_Modul_IPE', false, addHeaderFooter);
}

// 4. Student Inbound (Subtab D)
export function generateStudentInboundPdf(records: StudentInboundRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Student Inbound & Mahasiswa Asing',
    'Sub-Menu Pendidikan Kelas D'
  );

  const tableData = records.map((r, idx) => {
    let durStr = '0 hari';
    if (r.tanggalMasuk && r.tanggalKeluar) {
      const s = new Date(r.tanggalMasuk);
      const e = new Date(r.tanggalKeluar);
      if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
        const days = Math.floor((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        durStr = `${days > 0 ? days : 0} hari`;
      }
    }
    return [
      idx + 1,
      `${r.namaStudent}\n(${r.fakultasPengirim})`,
      r.universitas,
      `KSM: ${r.ksmTujuan || 'Umum'}\nPemb: ${r.pembimbing || '-'}`,
      `${r.tanggalMasuk} s/d \n${r.tanggalKeluar}`,
      durStr
    ];
  });

  autoTable(doc, {
    startY,
    head: [['No', 'Identitas / Fakultas', 'Universitas Asal', 'KSM & Pembimbing', 'Sesi / Periode', 'Durasi']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 40 },
      2: { cellWidth: 35 },
      3: { cellWidth: 45 },
      4: { cellWidth: 32, halign: 'center' },
      5: { cellWidth: 18, halign: 'center', fontStyle: 'bold' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Student_Inbound', false, addHeaderFooter);
}

// 5. Riwayat Kunjungan (Subtab E)
export function generateKunjunganPdf(records: KunjunganRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Kunjungan Institusi Akademik',
    'Sub-Menu Pendidikan Kelas E'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    `${r.universitas} (${r.institusiType})\n${r.fakultas} - ${r.programStudi}`,
    r.tujuan,
    r.tanggalPelaksanaan,
    r.pemateri || '-',
    r.jumlahPeserta || 0
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Asal Universitas / Fak / Prodi', 'Tujuan Kunjungan', 'Tanggal', 'Pemateri', 'Peserta']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 65 },
      2: { cellWidth: 40 },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 25 },
      5: { cellWidth: 15, halign: 'center', fontStyle: 'bold' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Kunjungan_Institusi', false, addHeaderFooter);
}

// 6. Kerjasama MoU (Subtab F)
export function generateMouPdf(records: MouRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Kerjasama Nota Kesepahaman (MoU)',
    'Sub-Menu Pendidikan Kelas F'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.namaInstitusi,
    r.jenis,
    r.tahun,
    r.masaBerlaku
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Nama Institusi', 'Jenis Jaringan / Mitra', 'Tahun', 'Masa Berlaku MoU']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 70, fontStyle: 'bold' },
      2: { cellWidth: 40 },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 35, halign: 'center' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Mou_Kerjasama', false, addHeaderFooter);
}

// 7. Target Akselerasi (Subtab G)
export function generateAkselerasiPdf(records: AkselerasiRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Target Akselerasi Capaian Pendidikan',
    'Sub-Menu Pendidikan Kelas G',
    true
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.kategori,
    r.ksm,
    r.jan, r.feb, r.mar, r.apr, r.mei, r.jun, r.jul, r.agt, r.sep, r.okt, r.nov, r.des,
    (r.jan + r.feb + r.mar + r.apr + r.mei + r.jun + r.jul + r.agt + r.sep + r.okt + r.nov + r.des)
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Kategori', 'KSM', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des', 'Total']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-', '-'] ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 7, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 6.5 },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 45 },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 12, halign: 'center' },
      4: { cellWidth: 12, halign: 'center' },
      5: { cellWidth: 12, halign: 'center' },
      6: { cellWidth: 12, halign: 'center' },
      7: { cellWidth: 12, halign: 'center' },
      8: { cellWidth: 12, halign: 'center' },
      9: { cellWidth: 12, halign: 'center' },
      10: { cellWidth: 12, halign: 'center' },
      11: { cellWidth: 12, halign: 'center' },
      12: { cellWidth: 12, halign: 'center' },
      13: { cellWidth: 12, halign: 'center' },
      14: { cellWidth: 12, halign: 'center' },
      15: { cellWidth: 15, halign: 'center', fontStyle: 'bold' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Akselerasi_Pendidikan', true, addHeaderFooter);
}

// 8. Pendapatan Pendidikan (Subtab J)
export function generatePendapatanPdf(records: any[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Pendapatan Pendidikan',
    'Sub-Menu Pendidikan Kelas J',
    true
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    `${r.bulan} ${r.tahun || ''}`,
    r.institusiName,
    r.institusiType,
    `Rp ${r.prapendidikanIncome.toLocaleString('id-ID')}`,
    `Rp ${r.praktikIncome.toLocaleString('id-ID')}`,
    `Rp ${r.ipeIncome.toLocaleString('id-ID')}`,
    `Rp ${r.totalIncome.toLocaleString('id-ID')}`
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Bulan / Tahun', 'Institusi', 'Tipe', 'Prapendidikan', 'Praktik', 'IPE', 'Total']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 30 },
      2: { cellWidth: 60, fontStyle: 'bold' },
      3: { cellWidth: 20 },
      4: { cellWidth: 32, halign: 'right' },
      5: { cellWidth: 32, halign: 'right' },
      6: { cellWidth: 32, halign: 'right' },
      7: { cellWidth: 35, halign: 'right', fontStyle: 'bold' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Pendapatan_Pendidikan', true, addHeaderFooter);
}

// 8b. Data Pajanan Peserta Didik (Subtab K)
export function generatePajananPdf(records: any[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Data Pajanan Peserta Didik',
    'Sub-Menu Pendidikan Kelas K',
    true
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.namaMahasiswa,
    r.nim,
    r.institusiType,
    r.fakultas,
    r.programStudi,
    r.tanggalKejadian
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Nama Mahasiswa', 'NIM', 'Tipe', 'Fakultas', 'Program Studi', 'Tanggal Kejadian']],
    body: tableData.length > 0 ? tableData : [['-', '-', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 50 },
      2: { cellWidth: 35 },
      3: { cellWidth: 25 },
      4: { cellWidth: 50 },
      5: { cellWidth: 50 },
      6: { cellWidth: 40 }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Data_Pajanan_Peserta_Didik', true, addHeaderFooter);
}

// 9. Pelatihan
export function generatePelatihanPdf(records: PelatihanRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Pelaksanaan Pelatihan Komite',
    'Menu Layanan Pelatihan RSUA'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.namaPelatihan,
    r.kategori,
    `${r.jumlahPeserta} org (${r.totalJam} JP)`,
    `+${r.sertifikasiBaru} Srtf`,
    `Rp ${r.anggaranRealisasi.toLocaleString('id-ID')}`,
    r.tanggal
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Topik/Sesi Pelatihan', 'Kategori', 'Peserta (JP)', 'Sertifikat', 'Realisasi Anggaran', 'Tanggal']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 50, fontStyle: 'bold' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 28, halign: 'center' },
      4: { cellWidth: 22, halign: 'center' },
      5: { cellWidth: 30, halign: 'right' },
      6: { cellWidth: 20, halign: 'center' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Pelaksanaan_Pelatihan', false, addHeaderFooter);
}

// 8b. Pelatihan Unggulan
export function generatePelatihanUnggulanPdf(records: any[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Pelatihan Unggulan Strategis',
    'Sub-Menu Pelatihan Unggulan'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.namaKegiatan,
    `${r.tanggalMulai} s/d\n${r.tanggalSelesai}`,
    r.pengusul
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Nama Kegiatan Pelatihan', 'Periode Pelaksanaan', 'Pengusul / Penyelenggara']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 80, fontStyle: 'bold' },
      2: { cellWidth: 40, halign: 'center' },
      3: { cellWidth: 50 }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Pelatihan_Unggulan', false, addHeaderFooter);
}

// 8c. Inhouse Training
export function generateInhouseTrainingPdf(records: InhouseTrainingRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Inhouse Training Internal',
    'Sub-Menu Inhouse Training'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.namaKegiatan,
    r.tanggalPelaksanaan,
    r.pengusul,
    createCellLink(r.berkasKakName || r.berkasKak, r.berkasKakDriveUrl)
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Nama Kegiatan Pelatihan', 'Tanggal Pelaksanaan', 'KSM / Instalasi Pengusul', 'Surat Permohonan, KAK']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 50, fontStyle: 'bold' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 50 },
      4: { cellWidth: 40 }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Inhouse_Training', false, addHeaderFooter);
}

// 8d. Monitoring Jam
export function generateMonitoringJamPdf(records: any[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Monitoring Kepatuhan Jam Pelatihan',
    'Standar Minimal 20-30 JP / Tahun'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    `${r.nama}\nNIP: ${r.nip}`,
    r.ksm,
    `${r.totalJam} JP`,
    r.statusKepatuhan
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Nama Staf & NIP', 'KSM / Unit Kerja', 'Total Terkumpul', 'Status Kepatuhan']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 60, fontStyle: 'bold' },
      2: { cellWidth: 50 },
      3: { cellWidth: 30, halign: 'center' },
      4: { cellWidth: 30, halign: 'center', fontStyle: 'bold' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Monitoring_Jam_Pelatihan', false, addHeaderFooter);
}

// 8e. Kerjasama SKP
export function generateKerjasamaSkpPdf(records: KerjasamaSkpRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'kegiatan Kerjasama ber-SKP',
    'Program Kerjasama Sertifikasi'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.judulKegiatan,
    r.tanggalKegiatan,
    r.lembagaKerjasama,
    `Rp ${(r.totalPendapatan || 0).toLocaleString('id-ID')}`
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Judul Kegiatan', 'Tanggal', 'Lembaga Kerjasama', 'Total Pendapatan']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 60, fontStyle: 'bold' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 50 },
      4: { cellWidth: 30, halign: 'right' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'kegiatan_Kerjasama_ber_SKP', false, addHeaderFooter);
}

// 8f. Studi Banding
export function generateStudiBandingPdf(records: StudiBandingRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Program Studi Banding Eksternal',
    'Kunjungan Observasi Layanan'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.namaInstitusi,
    r.wahanaPembelajaran,
    r.tanggalPelaksanaan,
    `Rp ${(r.totalPendapatan || 0).toLocaleString('id-ID')}`,
    createCellLink(r.lpjName || r.lpj, r.lpjDriveUrl)
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Institusi', 'Wahana Pembelajaran', 'Tanggal', 'Total Pendapatan', 'LPJ']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 45, fontStyle: 'bold' },
      2: { cellWidth: 45 },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 30, halign: 'right' },
      5: { cellWidth: 30 }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Studi_Banding', false, addHeaderFooter);
}

// 8g. Dokter Observer
export function generateDokterObserverPdf(records: any[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Program Dokter Observer Tamu',
    'Registrasi Dokter Tamu RSUA'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.nama,
    r.lulusanInstitusi,
    `${r.tanggalMulai} s/d\n${r.tanggalSelesai}`
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Nama Dokter Observer', 'Institusi Pendidikan', 'Periode Observasi']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 70, fontStyle: 'bold' },
      2: { cellWidth: 60 },
      3: { cellWidth: 40, halign: 'center' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Dokter_Observer', false, addHeaderFooter);
}

// 8h. Magang
export function generateMagangPdf(records: any[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Program Magang Kerja & Kompetensi',
    'Registrasi Peserta Magang RSUA'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.jenisMagang,
    r.namaPeserta,
    r.namaInstitusi,
    `${r.tanggalMulai} s/d\n${r.tanggalSelesai}`,
    r.tempatPelaksanaan,
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(r.totalPendapatan || 0)
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Jenis Magang', 'Nama Peserta', 'Institusi', 'Periode', 'Tempat', 'Pendapatan']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 25 },
      2: { cellWidth: 35, fontStyle: 'bold' },
      3: { cellWidth: 35 },
      4: { cellWidth: 25, halign: 'center' },
      5: { cellWidth: 25 },
      6: { cellWidth: 25, halign: 'right' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Magang', false, addHeaderFooter);
}

// 8i. Trainer Tersertifikasi
export function generateTrainerSertifikasiPdf(records: TrainerSertifikasiRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Trainer Tersertifikasi',
    'Sub-Menu Trainer Tersertifikasi RS UNAIR'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.namaPeserta,
    r.unitKerja,
    r.judulPelatihan,
    r.tanggalPelaksanaan,
    createCellLink(r.sertifikatName || r.sertifikat, r.sertifikatDriveUrl)
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Nama Peserta', 'Unit / Instalasi / KSM', 'Judul Pelatihan', 'Tanggal Pelaksanaan', 'Sertifikat']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 40, fontStyle: 'bold' },
      2: { cellWidth: 40 },
      3: { cellWidth: 45 },
      4: { cellWidth: 25, halign: 'center' },
      5: { cellWidth: 20 }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Trainer_Tersertifikasi', false, addHeaderFooter);
}

export function generatePelatihanMandiriPdf(records: any[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Kegiatan Mandiri ber SKP',
    'Sub-Menu Kegiatan Mandiri ber SKP RS UNAIR'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.judulKegiatan,
    r.tanggalKegiatan,
    r.unitKerja,
    createCellLink(r.lpjName || r.lpj, r.lpjDriveUrl),
    createCellLink(r.suratKakRegistrasiName || r.suratKakRegistrasi, r.suratKakRegistrasiDriveUrl),
    createCellLink(r.laporanPengendaliName || r.laporanPengendali, r.laporanPengendaliDriveUrl),
    r.totalPendapatan ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(r.totalPendapatan) : '-'
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Judul Kegiatan', 'Tanggal', 'Unit Pengaju', 'LPJ', 'KAK & Reg', 'Laporan Pengendali', 'Pendapatan']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 45, fontStyle: 'bold' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 35 },
      4: { cellWidth: 15, halign: 'center' },
      5: { cellWidth: 15, halign: 'center' },
      6: { cellWidth: 20, halign: 'center' },
      7: { cellWidth: 30, halign: 'right' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Kegiatan_Mandiri_ber_SKP', false, addHeaderFooter);
}

// 9. Penelitian
export function generatePenelitianPdf(records: PenelitianRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Registrasi Proyek Penelitian',
    'Menu Inovasi Penelitian RSUA'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.judul,
    r.penelitiUtama,
    r.status,
    `Scopus: ${r.publikasiScopus ? 'Ya' : 'Tidak'}\nPaten: ${r.patenTerdaftar ? 'Ya' : 'Tidak'}`,
    `Rp ${(r.danaHibah || 0).toLocaleString('id-ID')}`,
    r.tanggalMulai
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Judul Penelitian / Uji Klinis', 'Peneliti Utama', 'Status Jurnal', 'Scopus & Paten', 'Dana Hibah', 'Tanggal Mulai']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.2 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 55, fontStyle: 'bold' },
      2: { cellWidth: 30 },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 25 },
      5: { cellWidth: 22, halign: 'right' },
      6: { cellWidth: 18, halign: 'center' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Registrasi_Penelitian', false, addHeaderFooter);
}

// 9b. Pendapatan Penelitian
export function generatePendapatanPenelitianPdf(records: PendapatanPenelitianRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Pendapatan Penelitian',
    'Sub-Menu Penelitian dan Inovasi'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.bulan,
    `Rp ${(r.pendapatanEtik || 0).toLocaleString('id-ID')}`,
    `Rp ${(r.pendapatanLabRiset || 0).toLocaleString('id-ID')}`,
    `Rp ${(r.pendapatanInovasi || 0).toLocaleString('id-ID')}`,
    `Rp ${(r.pendapatanUjiKlinik || 0).toLocaleString('id-ID')}`,
    `Rp ${(r.totalPendapatan || 0).toLocaleString('id-ID')}`
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Bulan', 'Pendapatan Etik', 'Pendapatan Lab', 'Pendapatan Inovasi', 'Pendapatan Uji Klinik', 'Total Pendapatan']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 25 },
      2: { cellWidth: 29, halign: 'right' },
      3: { cellWidth: 29, halign: 'right' },
      4: { cellWidth: 29, halign: 'right' },
      5: { cellWidth: 29, halign: 'right' },
      6: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Pendapatan_Penelitian', false, addHeaderFooter);
}

// 9c. Uji Etik Penelitian
export function generateUjiEtikPdf(records: UjiEtikRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Pelaksanaan Uji Etik Penelitian',
    'Sub-Menu Penelitian dan Inovasi'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.tanggalSuratMasuk || '-',
    r.namaPeneliti || '-',
    r.jenisKegiatan || '-',
    r.judulPenelitian || '-',
    r.hasilReview || '-',
    r.pembayaranStatus || '-'
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Tgl Masuk', 'Nama Peneliti', 'Jenis', 'Judul Penelitian', 'Hasil Review', 'Bayar']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7 },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 35 },
      3: { cellWidth: 25 },
      4: { cellWidth: 60, fontStyle: 'bold' },
      5: { cellWidth: 22, halign: 'center' },
      6: { cellWidth: 12, halign: 'center' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Uji_Etik_Penelitian', false, addHeaderFooter);
}

// 9d. Penelitian Uji Klinik
export function generateUjiKlinikPdf(records: UjiKlinikRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Penelitian Uji Klinik (CRU)',
    'Sub-Menu Penelitian dan Inovasi'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.tahun,
    r.judulPenelitian,
    r.mitraKerjasama,
    `Rp ${(r.danaRabPenelitian || 0).toLocaleString('id-ID')}`,
    r.status
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Tahun', 'Judul Penelitian', 'Mitra Kerjasama', 'Dana/RAB', 'Status']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 75, fontStyle: 'bold' },
      3: { cellWidth: 40 },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 15, halign: 'center' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Uji_Klinik_Penelitian', false, addHeaderFooter);
}

// 9e. Penelitian Terpublikasi Dan Terindeks Internasional
export function generatePenelitianPublikasiPdf(records: PenelitianPublikasiRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Penelitian Terpublikasi dan Terindeks Internasional',
    'Sub-Menu Penelitian dan Inovasi'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.namaAutor,
    r.afiliasi,
    r.judulArtikelIlmiah,
    r.namaJurnalTerbit,
    r.ranking,
    r.jenisPublikasi
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Nama Autor', 'Afiliasi', 'Judul Klimiah', 'Nama Jurnal', 'Ranking', 'Jenis']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7 },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 27 },
      2: { cellWidth: 25 },
      3: { cellWidth: 60, fontStyle: 'bold' },
      4: { cellWidth: 35 },
      5: { cellWidth: 15, halign: 'center' },
      6: { cellWidth: 12, halign: 'center' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Penelitian_Publikasi_Internasional', false, addHeaderFooter);
}

// 9f. Produk Inovasi
export function generateProdukInovasiPdf(records: ProdukInovasiRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Produk Inovasi (Gilir Inovasi)',
    'Sub-Menu Penelitian dan Inovasi'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.tahun,
    r.namaProduk,
    r.pic,
    r.mitraKerjasama,
    r.sponsor
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Tahun', 'Nama Produk', 'PIC', 'Mitra Kerjasama', 'Sponsor']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 55, fontStyle: 'bold' },
      3: { cellWidth: 35 },
      4: { cellWidth: 35 },
      5: { cellWidth: 30 }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Produk_Inovasi_Gilir', false, addHeaderFooter);
}

// 9g. Produk Inovasi Terjual
export function generateProdukInovasiTerjualPdf(records: ProdukInovasiTerjualRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Produk Inovasi Terjual',
    'Sub-Menu Penelitian dan Inovasi'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.tanggal,
    r.namaPasien,
    r.namaProduk,
    r.jumlahPesananProduk || 0
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Tanggal', 'Nama Pembeli / Pasien', 'Nama Produk', 'Jumlah Pesanan']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 55 },
      3: { cellWidth: 55, fontStyle: 'bold' },
      4: { cellWidth: 25, halign: 'center' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Produk_Inovasi_Terjual', false, addHeaderFooter);
}

// 9h. Buku ISBN
export function generateBukuIsbnPdf(records: BukuIsbnRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Buku Ber-ISBN / Chapter Book',
    'Sub-Menu Penelitian dan Inovasi'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.tanggalTerbit || '-',
    r.namaPenulis || '-',
    r.judulBuku || '-',
    r.nomorIsbn || '-',
    r.namaPubliser || '-'
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Tgl Terbit', 'Penulis', 'Judul Buku / Chapter', 'ISBN', 'Penerbit']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.2 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 35 },
      3: { cellWidth: 65, fontStyle: 'bold' },
      4: { cellWidth: 25, halign: 'center' },
      5: { cellWidth: 25 }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Buku_ISBN_Chapter', false, addHeaderFooter);
}

// 9i. Pengabdian Masyarakat
export function generatePengabdianPdf(records: PengabdianMasyarakatRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Pengabdian Masyarakat',
    'Sub-Menu Penelitian dan Inovasi'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.nama,
    r.ksmDepartemen,
    r.judul,
    r.skema,
    r.tahun
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Ketua / Pelaksana', 'KSM / Departemen', 'Judul Kegiatan', 'Skema Pengabdian', 'Tahun']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 35 },
      2: { cellWidth: 35 },
      3: { cellWidth: 65, fontStyle: 'bold' },
      4: { cellWidth: 25 },
      5: { cellWidth: 12, halign: 'center' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Pengabdian_Masyarakat', false, addHeaderFooter);
}

// 9j. Proposal ARF
export function generateProposalArfPdf(records: ProposalArfRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Proposal ARF (Academic Research Fund)',
    'Sub-Menu Penelitian dan Inovasi'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.ketuaPeneliti,
    r.unitKerja,
    r.judulPenelitian,
    r.skema,
    `Rp ${(r.danaHibahDiperoleh || 0).toLocaleString('id-ID')}`
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Ketua Peneliti', 'Unit Kerja', 'Judul Penelitian', 'Skema', 'Dana Diperoleh']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 },
      3: { cellWidth: 65, fontStyle: 'bold' },
      4: { cellWidth: 15, halign: 'center' },
      5: { cellWidth: 22, halign: 'right' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Proposal_ARF_Penelitian', false, addHeaderFooter);
}

// 9k. Submission Artikel CPHM
export function generateSubmissionCphmPdf(records: SubmissionCphmRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Submission Artikel CPHM',
    'Sub-Menu Penelitian dan Inovasi'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.tanggal,
    r.author,
    r.afiliasi,
    r.judulArtikel,
    r.fileArtikelName || createCellLink(r.fileArtikelName || r.fileArtikel, r.fileArtikelDriveUrl)
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Tanggal', 'Author', 'Afiliasi', 'Judul Artikel', 'File']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 35 },
      3: { cellWidth: 30 },
      4: { cellWidth: 60, fontStyle: 'bold' },
      5: { cellWidth: 27 }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Submission_CPHM_Artikel', false, addHeaderFooter);
}

// 9l. Paten
export function generatePatenPdf(records: PatenRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Paten Penelitian',
    'Sub-Menu Penelitian dan Inovasi'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.tanggalTerbit,
    r.namaAutor,
    r.afiliasi,
    r.judulPaten,
    r.nomorPaten
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Tgl Terbit', 'Autor / Inventor', 'Afiliasi', 'Judul Paten', 'Nomor Paten']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 35 },
      3: { cellWidth: 30 },
      4: { cellWidth: 60, fontStyle: 'bold' },
      5: { cellWidth: 27 }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Paten_Penelitian', false, addHeaderFooter);
}

// 9m. Hak Cipta (HKI)
export function generateHkiPdf(records: HkiRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Hak Cipta (HKI)',
    'Sub-Menu Penelitian dan Inovasi'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.tanggalTerbit,
    r.namaAutor,
    r.afiliasi,
    r.judulHki,
    r.nomorHki
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Tgl Terbit', 'Nama Autor', 'Afiliasi', 'Judul Hak Cipta (HKI)', 'Nomor HKI']],
    body: tableData.length > 0 ? tableData : [['-', 'Tidak ada data tercatat', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 35 },
      3: { cellWidth: 30 },
      4: { cellWidth: 60, fontStyle: 'bold' },
      5: { cellWidth: 27 }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'HKI_Hak_Cipta', false, addHeaderFooter);
}

export interface PatenHkiPdfRecord {
  id: string;
  tanggalTerbit: string;
  namaAutor: string;
  afiliasi: string;
  judul: string;
  nomor: string;
  jenis: string;
}

export function generatePatenHkiPdf(records: PatenHkiPdfRecord[]) {
  const { doc, startY, margin, addHeaderFooter, primaryColor } = buildCleanSubMenuDoc(
    'Paten & Hak Cipta (HKI)',
    'Sub-Menu Penelitian dan Inovasi'
  );

  const tableData = records.map((r, idx) => [
    idx + 1,
    r.jenis,
    r.tanggalTerbit,
    r.namaAutor,
    r.afiliasi,
    r.judul,
    r.nomor
  ]);

  autoTable(doc, {
    startY,
    head: [['No', 'Jenis', 'Tgl Terbit', 'Autor / Inventor', 'Afiliasi', 'Judul Karya', 'Nomor Paten/HKI']],
    body: tableData.length > 0 ? tableData : [['-', '-', 'Tidak ada data tercatat', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 22, halign: 'center' },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 32 },
      4: { cellWidth: 26 },
      5: { cellWidth: 50, fontStyle: 'bold' },
      6: { cellWidth: 26 }
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),
    didDrawPage: (dataHook) => {
      addHeaderFooter(doc, dataHook.pageNumber, '{total_pages_count_string}');
    }
  });

  finalizePdfPages(doc, 'Paten_dan_HKI', false, addHeaderFooter);
}

