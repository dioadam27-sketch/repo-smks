import * as XLSX from 'xlsx';
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

// ---------------------------------------------------------
// EXCEL FORMATTERS (Translating raw keys to user-friendly Indonesian labels)
// ---------------------------------------------------------

export function formatPraPendidikanExcel(records: PraPendidikanRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Tanggal Pelaksanaan': r.tanggalPelaksanaan,
    'Institusi Pendidikan': r.institusiPendidikan || 'Umum',
    'Tipe Institusi': r.institusiType || '-',
    'Fakultas (UNAIR)': r.unairFakultas || '-',
    'Prodi (UNAIR)': r.unairProdi || '-',
    'Peserta (UNAIR)': r.unairPeserta || 0,
    'Universitas (Non UNAIR)': r.nonUnairUniversitas || '-',
    'Fakultas (Non UNAIR)': r.nonUnairFakultas || '-',
    'Prodi (Non UNAIR)': r.nonUnairProdi || '-',
    'Peserta (Non UNAIR)': r.nonUnairPeserta || 0,
    'Total Peserta': r.totalPeserta || 0
  }));
}

export function formatIpeExcel(records: IpeRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Tema IPE': r.tema,
    'Pemateri': r.pemateri,
    'Moderator': r.moderator,
    'KSM Pelaksana': r.ksm,
    'Tanggal': r.tanggal,
    'Jumlah Peserta UNAIR': r.pesertaUnair || 0,
    'Jumlah Peserta Non UNAIR': r.pesertaNonUnair || 0,
    'Total Peserta': (r.pesertaUnair || 0) + (r.pesertaNonUnair || 0)
  }));
}

export function formatModulIpeExcel(records: ModulIpeRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Judul Buku / Modul': r.judulBuku,
    'Penerbit': r.penerbit || 'Airlangga University Press',
    'ISBN': r.isbn || 'Belum Ada',
    'Tanggal Terbit': r.tanggalTerbit
  }));
}

export function formatStudentInboundExcel(records: StudentInboundRecord[]) {
  return records.map((r, idx) => {
    // Calculate duration in days
    let durationStr = '0 hari';
    if (r.tanggalMasuk && r.tanggalKeluar) {
      const start = new Date(r.tanggalMasuk);
      const end = new Date(r.tanggalKeluar);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        durationStr = `${diffDays > 0 ? diffDays : 0} hari`;
      }
    }

    return {
      'No': idx + 1,
      'Nama Student': r.namaStudent,
      'Fakultas Pengirim': r.fakultasPengirim,
      'Universitas Asal': r.universitas,
      'KSM Tujuan': r.ksmTujuan || 'Umum',
      'Dosen / DPK Pembimbing': r.pembimbing || 'Belum Ada',
      'Tanggal Masuk': r.tanggalMasuk,
      'Tanggal Keluar': r.tanggalKeluar,
      'Lama Durasi': durationStr
    };
  });
}

export function formatKunjunganExcel(records: KunjunganRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Universitas / Institusi': r.universitas || '-',
    'Tipe': r.institusiType,
    'Fakultas': r.fakultas || '-',
    'Program Studi': r.programStudi || '-',
    'Tujuan Kunjungan': r.tujuan,
    'Tanggal Pelaksanaan': r.tanggalPelaksanaan,
    'Dosen Pemateri': r.pemateri || '-',
    'Jumlah Peserta': r.jumlahPeserta || 0
  }));
}

export function formatMouExcel(records: MouRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Nama Institusi': r.namaInstitusi,
    'Jenis Mitra': r.jenis,
    'Tahun Kerjasama': r.tahun,
    'Masa Berlaku': r.masaBerlaku
  }));
}

export function formatAkselerasiExcel(records: AkselerasiRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Kategori Acs': r.kategori,
    'KSM': r.ksm,
    'Jan': r.jan || 0,
    'Feb': r.feb || 0,
    'Mar': r.mar || 0,
    'Apr': r.apr || 0,
    'Mei': r.mei || 0,
    'Jun': r.jun || 0,
    'Jul': r.jul || 0,
    'Ags': r.agt || 0,
    'Sep': r.sep || 0,
    'Okt': r.okt || 0,
    'Nov': r.nov || 0,
    'Des': r.des || 0,
    'Total Target Setahun': (r.jan + r.feb + r.mar + r.apr + r.mei + r.jun + r.jul + r.agt + r.sep + r.okt + r.nov + r.des)
  }));
}

export function formatPelatihanExcel(records: PelatihanRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Nama/Sesi Pelatihan': r.namaPelatihan,
    'Kategori': r.kategori,
    'Jumlah Peserta': r.jumlahPeserta || 0,
    'Total Jam (JP)': r.totalJam || 0,
    'Sertifikasi Baru': r.sertifikasiBaru || 0,
    'Anggaran / Realisasi (Rp)': r.anggaranRealisasi || 0,
    'Tanggal Pelaksanaan': r.tanggal
  }));
}

export function formatPelatihanUnggulanExcel(records: any[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Nama Kegiatan': r.namaKegiatan,
    'Tanggal Mulai': r.tanggalMulai,
    'Tanggal Selesai': r.tanggalSelesai,
    'Pengusul / Penyelenggara': r.pengusul
  }));
}

export function formatInhouseTrainingExcel(records: InhouseTrainingRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Nama Kegiatan': r.namaKegiatan,
    'Tanggal Pelaksanaan': r.tanggalPelaksanaan,
    'KSM / Instalasi Pengusul': r.pengusul,
    'Surat Permohonan, KAK': r.berkasKak || '-'
  }));
}

export function formatMonitoringJamExcel(records: any[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Nama Staf': r.nama,
    'NIP': r.nip,
    'KSM / Unit': r.ksm,
    'Total Jam': r.totalJam,
    'Status Kepatuhan': r.statusKepatuhan
  }));
}

export function formatKerjasamaSkpExcel(records: KerjasamaSkpRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Judul Kegiatan': r.judulKegiatan,
    'Tanggal Kegiatan': r.tanggalKegiatan,
    'Lembaga Kerjasama': r.lembagaKerjasama,
    'PKS': r.pks || '-',
    'Surat Permohonan, KAK, Registrasi': r.berkasPendukung || '-',
    'Laporan Pengendali': r.laporanPengendali || '-',
    'Total Pendapatan (Rp)': r.totalPendapatan || 0
  }));
}

export function formatStudiBandingExcel(records: StudiBandingRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Nama Institusi': r.namaInstitusi,
    'Wahana Pembelajaran': r.wahanaPembelajaran,
    'Tanggal Pelaksanaan': r.tanggalPelaksanaan,
    'Total Pendapatan (Rp)': r.totalPendapatan || 0,
    'LPJ': r.lpj || '-'
  }));
}

export function formatDokterObserverExcel(records: any[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Nama Dokter': r.nama,
    'Lulusan Institusi': r.lulusanInstitusi,
    'Tanggal Mulai': r.tanggalMulai,
    'Tanggal Selesai': r.tanggalSelesai
  }));
}

export function formatMagangExcel(records: any[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Jenis Magang': r.jenisMagang,
    'Nama Peserta Magang': r.namaPeserta,
    'Nama Institusi': r.namaInstitusi,
    'Tanggal Mulai': r.tanggalMulai,
    'Tanggal Selesai': r.tanggalSelesai,
    'Tempat Pelaksanaan': r.tempatPelaksanaan,
    'Total Pendapatan (Rp)': r.totalPendapatan,
    'Karya Ilmiah': r.karyaIlmiah || '-',
    'Sertifikat': r.sertifikat || '-'
  }));
}

export function formatPenelitianExcel(records: PenelitianRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Judul Penelitian': r.judul,
    'Peneliti Utama': r.penelitiUtama,
    'Status Proyek': r.status,
    'Publikasi Scopus': r.publikasiScopus ? 'Ya' : 'Tidak',
    'Paten Terdaftar': r.patenTerdaftar ? 'Ya' : 'Tidak',
    'Dana Hibah (Rp)': r.danaHibah || 0,
    'Tanggal Mulai': r.tanggalMulai
  }));
}

export function formatPendapatanPenelitianExcel(records: PendapatanPenelitianRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Bulan': r.bulan,
    'Pendapatan Etik (Rp)': r.pendapatanEtik || 0,
    'Pendapatan Laboratorium Riset (Rp)': r.pendapatanLabRiset || 0,
    'Pendapatan Inovasi (Rp)': r.pendapatanInovasi || 0,
    'Pendapatan Uji Klinik (Rp)': r.pendapatanUjiKlinik || 0,
    'Total Pendapatan (Rp)': r.totalPendapatan || 0
  }));
}

export function formatUjiEtikExcel(records: UjiEtikRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Tanggal Surat Masuk': r.tanggalSuratMasuk,
    'Nomor Surat Masuk': r.nomorSuratMasuk,
    'Nama Peneliti': r.namaPeneliti,
    'NIM/NRP/NIP': r.nimNrpNip,
    'CP Kontak': r.cp,
    'Institusi': r.institusi,
    'Pendidikan': r.pendidikan,
    'Jenis Kegiatan': r.jenisKegiatan,
    'Judul Penelitian': r.judulPenelitian,
    'Jumlah Sampel': r.jumlahSampelPenelitian || 0,
    'Pengambilan Data': r.pengambilanData,
    'Pembimbing Klinis': r.pembimbingKlinis,
    'Review Awal': r.reviewAwal,
    'Hasil Review': r.hasilReview,
    'Catatan Reviewer': r.catatanReviewer,
    'Tanggal Seminar Etik': r.tanggalSeminarEtik,
    'Tanggal Sertifikat Etik': r.tanggalSertifikatEtik,
    'Monev': r.monev,
    'Laporan': r.laporan,
    'Nominal Pembayaran (Rp)': r.pembayaranNominal || 0,
    'Status Pembayaran': r.pembayaranStatus
  }));
}

export function formatUjiKlinikExcel(records: UjiKlinikRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Tahun': r.tahun,
    'Judul Penelitian': r.judulPenelitian,
    'Mitra Kerjasama': r.mitraKerjasama,
    'SK Tim Penelitian': r.timPenelitiFileName || r.timPenelitiFile || '-',
    'CTA File': r.ctaFileName || r.ctaFile || '-',
    'Dana/RAB Penelitian (Rp)': r.danaRabPenelitian || 0,
    'Status': r.status
  }));
}

export function formatPenelitianPublikasiExcel(records: PenelitianPublikasiRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Nama Autor': r.namaAutor,
    'Afiliasi': r.afiliasi,
    'Judul Artikel Ilmiah': r.judulArtikelIlmiah,
    'Nama Jurnal Terbit': r.namaJurnalTerbit,
    'Jenis Publikasi': r.jenisPublikasi,
    'Ranking': r.ranking,
    'Tanggal Publikasi': r.tanggalPublikasi,
    'DOI / Situs Web': r.doiSitusWeb
  }));
}

export function formatProdukInovasiExcel(records: ProdukInovasiRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Tahun': r.tahun,
    'Nama Produk': r.namaProduk,
    'Judul Riset Inovasi': r.judulRisetInovasi,
    'Mitra Kerjasama': r.mitraKerjasama,
    'Sponsor': r.sponsor,
    'PIC / Penanggung Jawab': r.pic,
    'Foto Produk File': r.fotoProdukName || r.fotoProduk || '-',
    'Deskripsi Singkat': r.deskripsiSingkat
  }));
}

export function formatProdukInovasiTerjualExcel(records: ProdukInovasiTerjualRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Tanggal': r.tanggal,
    'Nama Pasien': r.namaPasien,
    'Nama Inovasi / Produk': r.namaProduk,
    'Jumlah Pesanan': r.jumlahPesananProduk || 0
  }));
}

export function formatBukuIsbnExcel(records: BukuIsbnRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Tanggal Terbit': r.tanggalTerbit,
    'Nama Penulis': r.namaPenulis,
    'Afiliasi': r.afiliasi,
    'Judul Buku / Bab': r.judulBuku,
    'Nomor ISBN': r.nomorIsbn,
    'Penerbit': r.namaPubliser,
    'Link E-book / Publikasi': r.linkPublikasiEbook,
    'Bukti Cetak / Buku': r.buktiBukuCetakName || r.buktiBukuCetak || '-'
  }));
}

export function formatPengabdianMasyarakatExcel(records: PengabdianMasyarakatRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Nama Ketua / Anggota': r.nama,
    'KSM / Departemen': r.ksmDepartemen,
    'Judul Kegiatan': r.judul,
    'Skema Pengabdian': r.skema,
    'Tahun': r.tahun
  }));
}

export function formatProposalArfExcel(records: ProposalArfRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Ketua Peneliti': r.ketuaPeneliti,
    'Unit Kerja': r.unitKerja,
    'Anggota Peneliti': r.anggotaPeneliti,
    'Judul Penelitian': r.judulPenelitian,
    'Skema ARF': r.skema,
    'Target Luaran': r.targetLuaran,
    'Dana Hibah Diperoleh (Rp)': r.danaHibahDiperoleh || 0
  }));
}

export function formatSubmissionCphmExcel(records: SubmissionCphmRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Tanggal Submission': r.tanggal,
    'Judul Artikel': r.judulArtikel,
    'Author': r.author,
    'Afiliasi': r.afiliasi,
    'File Artikel': r.fileArtikelName || r.fileArtikel || '-'
  }));
}

export function formatPatenExcel(records: PatenRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Tanggal Terbit': r.tanggalTerbit,
    'Nama Autor / Inventor': r.namaAutor,
    'Afiliasi': r.afiliasi,
    'Judul Paten': r.judulPaten,
    'Nomor Paten': r.nomorPaten,
    'Bukti Sertifikat Paten': r.buktiSertifikatPatenName || r.buktiSertifikatPaten || '-'
  }));
}

export function formatHkiExcel(records: HkiRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Tanggal Terbit': r.tanggalTerbit,
    'Nama Autor': r.namaAutor,
    'Afiliasi': r.afiliasi,
    'Judul Hak Cipta (HKI)': r.judulHki,
    'Nomor HKI': r.nomorHki,
    'Bukti Sertifikat HKI': r.buktiSertifikatHkiName || r.buktiSertifikatHki || '-'
  }));
}

// ---------------------------------------------------------
// REUSABLE SHEETS WRITER (Allows single or multi-sheet output)
// ---------------------------------------------------------

export function downloadExcelSheet(sheetName: string, jsonRows: any[], fileName: string) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(jsonRows);
  
  // Custom headers style/column width auto-fit (optional simple estimation)
  if (jsonRows.length > 0) {
    const keys = Object.keys(jsonRows[0]);
    const max_widths = keys.map(key => {
      let max_len = key.length;
      jsonRows.forEach(row => {
        const val_str = String(row[key] ?? '');
        if (val_str.length > max_len) max_len = val_str.length;
      });
      return { wch: Math.min(50, Math.max(8, max_len + 3)) };
    });
    ws['!cols'] = max_widths;
  }

  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

export function downloadMultipleExcelSheets(sheets: { sheetName: string; jsonRows: any[] }[], fileName: string) {
  const wb = XLSX.utils.book_new();

  sheets.forEach(({ sheetName, jsonRows }) => {
    const ws = XLSX.utils.json_to_sheet(jsonRows);
    
    if (jsonRows.length > 0) {
      const keys = Object.keys(jsonRows[0]);
      const max_widths = keys.map(key => {
        let max_len = key.length;
        jsonRows.forEach(row => {
          const val_str = String(row[key] ?? '');
          if (val_str.length > max_len) max_len = val_str.length;
        });
        return { wch: Math.min(50, Math.max(8, max_len + 3)) };
      });
      ws['!cols'] = max_widths;
    }

    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

export function formatTrainerSertifikasiExcel(records: TrainerSertifikasiRecord[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Nama Peserta': r.namaPeserta,
    'Unit / Instalasi / KSM': r.unitKerja,
    'Judul Pelatihan': r.judulPelatihan,
    'Tanggal Kegiatan Pelatihan': r.tanggalPelaksanaan,
    'Sertifikat': r.sertifikat || '-'
  }));
}

export function formatPelatihanMandiriExcel(records: any[]) {
  return records.map((r, idx) => ({
    'No': idx + 1,
    'Judul Kegiatan': r.judulKegiatan,
    'Tanggal Kegiatan': r.tanggalKegiatan,
    'Unit/Instalasi/KSM/Komite Pengaju': r.unitKerja,
    'LPJ': r.lpj || '-',
    'Surat Permohonan, KAK': r.suratKakRegistrasi || '-',
    'Laporan Pengendali Pelatihan': r.laporanPengendali || '-',
    'Total Pendapatan': r.totalPendapatan || 0
  }));
}
