import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../lib/api';

export interface PrapendidikanKomkordikRecord {
  id: string;
  tanggalPelaksanaan: string;
  institusiPendidikan: string;
  totalPeserta: number;
}

export interface OrientasiKsmRecord {
  id: string;
  tanggalPelaksanaan: string;
  institusiPendidikan: string;
  totalPeserta: number;
  buktiFoto1?: string;
  buktiFoto1Name?: string;
  buktiFoto2?: string;
  buktiFoto2Name?: string;
}

// Submenu J (Pendidikan): Pendapatan Pendidikan (Non UNAIR)
export interface PendapatanPendidikanRecord {
  id: string;
  bulan: string;
  tahun: string;
  institusiName: string;
  institusiType: 'UNAIR' | 'NON UNAIR' | 'GABUNGAN';
  prapendidikanIncome: number;
  praktikIncome: number;
  ipeIncome: number;
  totalIncome: number;
  buktiPembayaran?: string;
  buktiPembayaranName?: string;
}

// Submenu K (Pendidikan): Pajanan Peserta Didik
export interface PajananPesertaRecord {
  id: string;
  namaMahasiswa: string;
  nim: string;
  institusiType: 'UNAIR' | 'NON UNAIR';
  fakultas: string;
  programStudi: string;
  jenisPajanan?: string;
  tanggalKejadian?: string;
  lokasiKejadian?: string;
  deskripsiKejadian?: string;
  tindakLanjut?: string;
  fileLaporan?: string;
  tanggalLaporan?: string;
}

export interface ProgramFellowshipRecord {
  id: string;
  namaPenyelenggara: string;
  namaProgramFellowship: string;
  lamaKegiatan: number;
  kerjasamaKolegium: string;
}

// Submenu A: PraPendidikan & Orientasi
export interface PraPendidikanRecord {
  id: string;
  tanggalPelaksanaan: string;
  institusiPendidikan: string; // Combined display string (or fallback if empty)
  totalPeserta: number;
  institusiType?: 'UNAIR' | 'Non UNAIR' | 'Gabungan';
  unairFakultas?: string;
  unairProdi?: string;
  unairPeserta?: number;
  nonUnairUniversitas?: string;
  nonUnairFakultas?: string;
  nonUnairProdi?: string;
  nonUnairPeserta?: number;
}

// Submenu B: Interprofessional Education (IPE)
export interface IpeRecord {
  id: string;
  tema: string;
  pemateri: string; // Bisa lebih dari 5 orang
  moderator: string; // Bisa lebih dari 5 orang
  ksm: string;
  tanggal: string;
  pesertaUnair: number;
  pesertaNonUnair: number;
}

// Submenu C: Modul IPE
export interface ModulIpeRecord {
  id: string;
  judulBuku: string;
  penerbit: string;
  isbn: string;
  tanggalTerbit: string;
  coverBuku?: string;
  coverBukuName?: string;
}

// Submenu D: Student Inbound
export interface StudentInboundRecord {
  id: string;
  fakultasPengirim: string;
  namaStudent: string;
  universitas: string;
  tanggalMasuk: string;
  tanggalKeluar: string;
  ksmTujuan: string; // Bisa lebih dari satu
  pembimbing: string; // Bisa lebih dari satu
}

// Submenu E: Kunjungan
export interface KunjunganRecord {
  id: string;
  institusiType: 'UNAIR' | 'Non UNAIR';
  fakultas: string;
  programStudi: string;
  tujuan: string;
  tanggalPelaksanaan: string;
  pemateri: string; // Bisa lebih dari satu
  jumlahPeserta: number;
  universitas?: string;
}

// Submenu F: MOU
export interface MouRecord {
  id: string;
  namaInstitusi: string;
  jenis: 'Nasional' | 'Internasional';
  tahun: string;
  masaBerlaku: string; // durasi/periode
}

// Submenu G: Akselerasi Pendidikan (dibagi dr 3 kategori)
export interface AkselerasiRecord {
  id: string;
  kategori: 'PROFESI DOKTER (DM) NAIK MENJADI 50%' | 'PROGRAM PENDIDIKAN DOKTER SPESIALIS (PPDS 1) NAIK MENJADI 50%' | 'PROGRAM PENDIDIKAN DOKTER SUB SPESIALIS (PPDS 2)';
  ksm: string;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  mei: number;
  jun: number;
  jul: number;
  agt: number;
  sep: number;
  okt: number;
  nov: number;
  des: number;
}

// Pelatihan Sub-menus
export interface PelatihanUnggulanRecord {
  id: string;
  namaKegiatan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  pengusul: string; // KSM/Instalasi/Institusi Penyelenggara
}

export interface InhouseTrainingRecord {
  id: string;
  namaKegiatan: string;
  tanggalPelaksanaan: string;
  pengusul: string; // KSM/Instalasi
  berkasKak: string;
  berkasKakName?: string;
  berkasKakDriveUrl?: string;
}

export interface KerjasamaSkpRecord {
  id: string;
  judulKegiatan: string;
  tanggalKegiatan: string;
  lembagaKerjasama: string;
  pks: string;
  berkasPendukung: string;
  laporanPengendali: string;
  totalPendapatan: number;
  pksName?: string;
  pksDriveUrl?: string;
  berkasPendukungName?: string;
  berkasPendukungDriveUrl?: string;
  laporanPengendaliName?: string;
  laporanPengendaliDriveUrl?: string;
}

export interface StudiBandingRecord {
  id: string;
  namaInstitusi: string;
  wahanaPembelajaran: string;
  tanggalPelaksanaan: string;
  totalPendapatan: number;
  lpj: string;
  lpjName?: string;
  lpjDriveUrl?: string;
}

export interface DokterObserverRecord {
  id: string;
  nama: string;
  lulusanInstitusi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
}

export interface MagangRecord {
  id: string;
  jenisMagang: 'Magang Observer' | 'Magang Kompetensi';
  namaPeserta: string;
  namaInstitusi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  tempatPelaksanaan: string;
  totalPendapatan: number;
  karyaIlmiah: string;
  sertifikat: string;
  karyaIlmiahDriveUrl?: string;
  sertifikatDriveUrl?: string;
}

export interface StandarKemenkesRecord {
  id: string;
  judulPelatihan: string;
  dokumen: string;
  dokumenName?: string;
  dokumenDriveUrl?: string;
}

export interface PelatihanInternasionalRecord {
  id: string;
  namaKegiatan: string;
  tanggalKegiatan: string;
  lembagaKerjasama: string;
  lpj: string;
  totalPendapatan: number;
  lpjName?: string;
  lpjDriveUrl?: string;
}

export interface TrainerSertifikasiRecord {
  id: string;
  namaPeserta: string;
  unitKerja: string;
  judulPelatihan: string;
  tanggalPelaksanaan: string;
  sertifikat: string;
  sertifikatName?: string;
  sertifikatDriveUrl?: string;
}

export interface PelatihanMandiriRecord {
  id: string;
  judulKegiatan: string;
  tanggalKegiatan: string;
  unitKerja: string; // Unit/ Instalasi/ KSM/ Komite yang mengajukan
  lpj: string; // upload
  lpjName?: string;
  lpjDriveUrl?: string;
  suratKakRegistrasi: string; // upload
  suratKakRegistrasiName?: string;
  suratKakRegistrasiDriveUrl?: string;
  laporanPengendali: string; // upload
  laporanPengendaliName?: string;
  laporanPengendaliDriveUrl?: string;
  totalPendapatan: number;
}

export interface MonitoringJamRecord {
  id: string;
  nama: string;
  nip: string;
  ksm: string;
  totalJam: number;
  statusKepatuhan: 'Patuh' | 'Tidak Patuh';
}

// Submenu L: Pendapatan Penelitian
export interface PendapatanPenelitianRecord {
  id: string;
  bulan: 'Januari' | 'Februari' | 'Maret' | 'April' | 'Mei' | 'Juni' | 'Juli' | 'Agustus' | 'September' | 'Oktober' | 'November' | 'Desember';
  pendapatanEtik: number;
  pendapatanLabRiset: number;
  pendapatanInovasi: number;
  pendapatanUjiKlinik: number;
  totalPendapatan: number;
}

// Submenu M: Pelaksanaan Uji Etik Penelitian
export interface UjiEtikRecord {
  id: string;
  tanggalSuratMasuk: string;
  nomorSuratMasuk: string;
  namaPeneliti: string;
  nimNrpNip: string;
  cp: string;
  institusi: string;
  pendidikan: 'D3' | 'D4' | 'S1' | 'S2' | 'SP1' | 'SP2' | 'S3' | '-';
  jenisKegiatan: 'TUGAS AKHIR' | 'CASE REPORT' | 'PENELITIAN INSTITUSI';
  judulPenelitian: string;
  jumlahSampelPenelitian: number;
  pengambilanData: string;
  pembimbingKlinis: string;
  reviewAwal: 'WAKIL I' | 'WAKIL II' | 'SEKRETARIS I' | 'SEKRETARIS II';
  hasilReview: 'EXEMPTED' | 'EXPEDITED MINOR' | 'EXPEDITED MAYOR' | 'FULL BOARD';
  catatanReviewer: string;
  tanggalSeminarEtik: string;
  tanggalSertifikatEtik: string;
  monev: 'SUDAH' | 'BELUM';
  laporan: 'BERJALAN' | 'TERKUMPUL';
  pembayaranNominal: number;
  pembayaranStatus: 'Lunas' | 'Belum Lunas';
}

// Submenu N: Penelitian Uji Klinik
export interface UjiKlinikRecord {
  id: string;
  tahun: string;
  judulPenelitian: string;
  mitraKerjasama: string;
  timPenelitiFile?: string;
  timPenelitiFileName?: string;
  timPenelitiFileDriveUrl?: string;
  ctaFile?: string;
  ctaFileName?: string;
  ctaFileDriveUrl?: string;
  danaRabPenelitian: number;
  status: 'SSV' | 'ETIK' | 'BUDGETING' | 'CTA' | 'RUNNING' | 'CLOSSING';
}

// Submenu O: Penelitian Terpublikasi dan Terindeks Internasional (formerly "Penelitian Terpublikasi")
export interface PenelitianPublikasiRecord {
  id: string;
  namaAutor: string;
  afiliasi: string;
  judulArtikelIlmiah: string;
  namaJurnalTerbit: string;
  jenisPublikasi: 'Nasional' | 'Internasional' | 'Scopus';
  ranking: 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'Q1' | 'Q2' | 'Q3' | 'Q4';
  tanggalPublikasi: string;
  doiSitusWeb: string;
}

// Submenu P: Produk Inovasi
export interface ProdukInovasiRecord {
  id: string;
  tahun: string;
  namaProduk: string;
  judulRisetInovasi: string;
  mitraKerjasama: string;
  sponsor: string;
  pic: string;
  fotoProduk?: string;
  fotoProdukName?: string;
  fotoProdukDriveUrl?: string;
  deskripsiSingkat: string;
}

// Submenu Q: Produk Inovasi Terjual
export interface ProdukInovasiTerjualRecord {
  id: string;
  tanggal: string;
  namaPasien: string;
  namaProduk: string;
  jumlahPesananProduk: number;
}

// Submenu R: Buku ISBN
export interface BukuIsbnRecord {
  id: string;
  tanggalTerbit: string;
  namaPenulis: string;
  afiliasi: string;
  judulBuku: string;
  nomorIsbn: string;
  namaPubliser: string;
  linkPublikasiEbook: string;
  buktiBukuCetak?: string;
  buktiBukuCetakName?: string;
  buktiBukuCetakDriveUrl?: string;
}

// Submenu S: Pengabdian Masyarakat
export interface PengabdianMasyarakatRecord {
  id: string;
  nama: string;
  ksmDepartemen: string;
  judul: string;
  skema: string;
  tahun: string;
}

// Submenu T: Proposal Penelitian Didanai (ARF)
export interface ProposalArfRecord {
  id: string;
  ketuaPeneliti: string;
  unitKerja: string;
  anggotaPeneliti: string;
  judulPenelitian: string;
  skema: string;
  targetLuaran: string;
  danaHibahDiperoleh: number;
}

// Submenu U: Submission CPHM
export interface SubmissionCphmRecord {
  id: string;
  tanggal: string;
  judulArtikel: string;
  author: string;
  afiliasi: string;
  fileArtikel?: string;
  fileArtikelName?: string;
  fileArtikelDriveUrl?: string;
}

// Submenu V: Paten
export interface PatenRecord {
  id: string;
  tanggalTerbit: string;
  namaAutor: string;
  afiliasi: string;
  judulPaten: string;
  nomorPaten: string;
  buktiSertifikatPaten?: string;
  buktiSertifikatPatenName?: string;
  buktiSertifikatPatenDriveUrl?: string;
}

// Submenu W: HKI
export interface HkiRecord {
  id: string;
  tanggalTerbit: string;
  namaAutor: string;
  afiliasi: string;
  judulHki: string;
  nomorHki: string;
  buktiSertifikatHki?: string;
  buktiSertifikatHkiName?: string;
  buktiSertifikatHkiDriveUrl?: string;
}

// Pelatihan & Penelitian Existing Records (Old Research record remains but we prioritize new sub-menus)
export interface PelatihanRecord {
  id: string;
  namaPelatihan: string;
  kategori: 'Medis' | 'Non-Medis';
  jumlahPeserta: number;
  totalJam: number;
  sertifikasiBaru: number;
  anggaranRealisasi: number;
  tanggal: string;
}

export interface PenelitianRecord {
  id: string;
  judul: string;
  penelitiUtama: string;
  status: 'Berjalan Penuh' | 'Rekrutmen' | 'Selesai';
  publikasiScopus: boolean;
  patenTerdaftar: boolean;
  danaHibah: number;
  tanggalMulai: string;
}

// Table Mappers
const mapPraPendidikanToDb = (rec: any) => ({
  id: rec.id,
  tanggal_pelaksanaan: rec.tanggalPelaksanaan,
  institusi_pendidikan: rec.institusiPendidikan,
  total_peserta: Number(rec.totalPeserta || 0),
  institusi_type: rec.institusiType,
  unair_fakultas: rec.unairFakultas,
  unair_prodi: rec.unairProdi,
  unair_peserta: Number(rec.unairPeserta || 0),
  non_unair_universitas: rec.nonUnairUniversitas,
  non_unair_fakultas: rec.nonUnairFakultas,
  non_unair_prodi: rec.nonUnairProdi,
  non_unair_peserta: Number(rec.nonUnairPeserta || 0)
});
const mapPraPendidikanFromDb = (row: any): PraPendidikanRecord => ({
  id: String(row.id),
  tanggalPelaksanaan: row.tanggal_pelaksanaan || '',
  institusiPendidikan: row.institusi_pendidikan || '',
  totalPeserta: Number(row.total_peserta || 0),
  institusiType: row.institusi_type,
  unairFakultas: row.unair_fakultas,
  unairProdi: row.unair_prodi,
  unairPeserta: Number(row.unair_peserta || 0),
  nonUnairUniversitas: row.non_unair_universitas,
  nonUnairFakultas: row.non_unair_fakultas,
  nonUnairProdi: row.non_unair_prodi,
  nonUnairPeserta: Number(row.non_unair_peserta || 0)
});

const mapIpeToDb = (rec: any) => ({
  id: rec.id,
  tema: rec.tema,
  pemateri: rec.pemateri,
  moderator: rec.moderator,
  ksm: rec.ksm,
  tanggal: rec.tanggal,
  peserta_unair: Number(rec.pesertaUnair || 0),
  peserta_non_unair: Number(rec.pesertaNonUnair || 0)
});
const mapIpeFromDb = (row: any): IpeRecord => ({
  id: String(row.id),
  tema: row.tema || '',
  pemateri: row.pemateri || '',
  moderator: row.moderator || '',
  ksm: row.ksm || '',
  tanggal: row.tanggal || '',
  pesertaUnair: Number(row.peserta_unair || 0),
  pesertaNonUnair: Number(row.peserta_non_unair || 0)
});

const mapProgramFellowshipToDb = (rec: ProgramFellowshipRecord) => ({
  id: rec.id,
  nama_penyelenggara: rec.namaPenyelenggara,
  nama_program_fellowship: rec.namaProgramFellowship,
  lama_kegiatan: Number(rec.lamaKegiatan || 1),
  kerjasama_kolegium: rec.kerjasamaKolegium
});

const mapProgramFellowshipFromDb = (row: any): ProgramFellowshipRecord => ({
  id: String(row.id),
  namaPenyelenggara: row.nama_penyelenggara || '',
  namaProgramFellowship: row.nama_program_fellowship || '',
  lamaKegiatan: Number(row.lama_kegiatan || 1),
  kerjasamaKolegium: row.kerjasama_kolegium || ''
});

const mapModulIpeToDb = (rec: any) => ({
  id: rec.id,
  judul_buku: rec.judulBuku,
  penerbit: rec.penerbit,
  isbn: rec.isbn,
  tanggal_terbit: rec.tanggalTerbit,
  cover_buku: rec.coverBuku,
  cover_buku_name: rec.coverBukuName
});
const mapModulIpeFromDb = (row: any): ModulIpeRecord => ({
  id: String(row.id),
  judulBuku: row.judul_buku || '',
  penerbit: row.penerbit || '',
  isbn: row.isbn || '',
  tanggalTerbit: row.tanggal_terbit || '',
  coverBuku: row.cover_buku || '',
  coverBukuName: row.cover_buku_name || ''
});

const mapStudentInboundToDb = (rec: any) => ({
  id: rec.id,
  fakultas_pengirim: rec.fakultasPengirim,
  nama_student: rec.namaStudent,
  universitas: rec.universitas,
  tanggal_masuk: rec.tanggalMasuk,
  tanggal_keluar: rec.tanggalKeluar,
  ksm_tujuan: rec.ksmTujuan,
  pembimbing: rec.pembimbing
});
const mapStudentInboundFromDb = (row: any): StudentInboundRecord => ({
  id: String(row.id),
  fakultasPengirim: row.fakultas_pengirim || '',
  namaStudent: row.nama_student || '',
  universitas: row.universitas || '',
  tanggalMasuk: row.tanggal_masuk || '',
  tanggalKeluar: row.tanggal_keluar || '',
  ksmTujuan: row.ksm_tujuan || '',
  pembimbing: row.pembimbing || ''
});

const mapKunjunganToDb = (rec: any) => ({
  id: rec.id,
  institusi_type: rec.institusiType,
  fakultas: rec.fakultas,
  program_studi: rec.programStudi,
  tujuan: rec.tujuan,
  tanggal_pelaksanaan: rec.tanggalPelaksanaan,
  pemateri: rec.pemateri,
  jumlah_peserta: Number(rec.jumlahPeserta || 0),
  universitas: rec.universitas
});
const mapKunjunganFromDb = (row: any): KunjunganRecord => ({
  id: String(row.id),
  institusiType: row.institusi_type || 'UNAIR',
  fakultas: row.fakultas || '',
  programStudi: row.program_studi || '',
  tujuan: row.tujuan || '',
  tanggalPelaksanaan: row.tanggal_pelaksanaan || '',
  pemateri: row.pemateri || '',
  jumlahPeserta: Number(row.jumlah_peserta || 0),
  universitas: row.universitas
});

const mapMouToDb = (rec: any) => ({
  id: rec.id,
  nama_institusi: rec.namaInstitusi,
  jenis: rec.jenis,
  tahun: rec.tahun,
  masa_berlaku: rec.masaBerlaku
});
const mapMouFromDb = (row: any): MouRecord => ({
  id: String(row.id),
  namaInstitusi: row.nama_institusi || '',
  jenis: row.jenis || 'Nasional',
  tahun: row.tahun || '',
  masaBerlaku: row.masa_berlaku || ''
});

const mapAkselerasiToDb = (rec: any) => ({
  id: rec.id,
  kategori: rec.kategori,
  ksm: rec.ksm,
  jan: Number(rec.jan || 0),
  feb: Number(rec.feb || 0),
  mar: Number(rec.mar || 0),
  apr: Number(rec.apr || 0),
  mei: Number(rec.mei || 0),
  jun: Number(rec.jun || 0),
  jul: Number(rec.jul || 0),
  agt: Number(rec.agt || 0),
  sep: Number(rec.sep || 0),
  okt: Number(rec.okt || 0),
  nov: Number(rec.nov || 0),
  des: Number(rec.des || 0)
});
const mapAkselerasiFromDb = (row: any): AkselerasiRecord => ({
  id: String(row.id),
  kategori: row.kategori,
  ksm: row.ksm,
  jan: Number(row.jan || 0),
  feb: Number(row.feb || 0),
  mar: Number(row.mar || 0),
  apr: Number(row.apr || 0),
  mei: Number(row.mei || 0),
  jun: Number(row.jun || 0),
  jul: Number(row.jul || 0),
  agt: Number(row.agt || 0),
  sep: Number(row.sep || 0),
  okt: Number(row.okt || 0),
  nov: Number(row.nov || 0),
  des: Number(row.des || 0)
});

const mapPelatihanToDb = (rec: any) => ({
  id: rec.id,
  nama_pelatihan: rec.namaPelatihan,
  kategori: rec.kategori,
  jumlah_peserta: Number(rec.jumlahPeserta || 0),
  total_jam: Number(rec.totalJam || 0),
  sertifikasi_baru: Number(rec.sertifikasiBaru || 0),
  anggaran_realisasi: Number(rec.anggaranRealisasi || 0),
  tanggal: rec.tanggal
});
const mapPelatihanFromDb = (row: any): PelatihanRecord => ({
  id: String(row.id),
  namaPelatihan: row.nama_pelatihan || '',
  kategori: row.kategori || 'Medis',
  jumlahPeserta: Number(row.jumlah_peserta || 0),
  totalJam: Number(row.total_jam || 0),
  sertifikasiBaru: Number(row.sertifikasi_baru || 0),
  anggaranRealisasi: Number(row.anggaran_realisasi || 0),
  tanggal: row.tanggal || ''
});

const mapPelatihanUnggulanToDb = (rec: any) => ({
  id: rec.id,
  nama_kegiatan: rec.namaKegiatan,
  tanggal_mulai: rec.tanggalMulai,
  tanggal_selesai: rec.tanggalSelesai,
  pengusul: rec.pengusul
});
const mapPelatihanUnggulanFromDb = (row: any): PelatihanUnggulanRecord => ({
  id: String(row.id),
  namaKegiatan: row.nama_kegiatan || '',
  tanggalMulai: row.tanggal_mulai || '',
  tanggalSelesai: row.tanggal_selesai || '',
  pengusul: row.pengusul || ''
});

const mapInhouseTrainingToDb = (rec: any) => ({
  id: rec.id,
  nama_kegiatan: rec.namaKegiatan,
  tanggal_pelaksanaan: rec.tanggalPelaksanaan,
  pengusul: rec.pengusul,
  berkas_kak: rec.berkasKak
});
const mapInhouseTrainingFromDb = (row: any): InhouseTrainingRecord => ({
  id: String(row.id),
  namaKegiatan: row.nama_kegiatan || '',
  tanggalPelaksanaan: row.tanggal_pelaksanaan || '',
  pengusul: row.pengusul || '',
  berkasKak: row.berkas_kak || ''
});

const mapKerjasamaSkpToDb = (rec: any) => ({
  id: rec.id,
  judul_kegiatan: rec.judulKegiatan,
  tanggal_kegiatan: rec.tanggalKegiatan,
  lembaga_kerjasama: rec.lembagaKerjasama,
  pks: rec.pks,
  pks_name: rec.pksName,
  pks_drive_url: rec.pksDriveUrl,
  berkas_pendukung: rec.berkasPendukung,
  berkas_pendukung_name: rec.berkasPendukungName,
  berkas_pendukung_drive_url: rec.berkasPendukungDriveUrl,
  laporan_pengendali: rec.laporanPengendali,
  laporan_pengendali_name: rec.laporanPengendaliName,
  laporan_pengendali_drive_url: rec.laporanPengendaliDriveUrl,
  total_pendapatan: Number(rec.totalPendapatan || 0)
});
const mapKerjasamaSkpFromDb = (row: any): KerjasamaSkpRecord => ({
  id: String(row.id),
  judulKegiatan: row.judul_kegiatan || '',
  tanggalKegiatan: row.tanggal_kegiatan || '',
  lembagaKerjasama: row.lembaga_kerjasama || '',
  pks: row.pks || '',
  pksName: row.pks_name || '',
  pksDriveUrl: row.pks_drive_url || '',
  berkasPendukung: row.berkas_pendukung || '',
  berkasPendukungName: row.berkas_pendukung_name || '',
  berkasPendukungDriveUrl: row.berkas_pendukung_drive_url || '',
  laporanPengendali: row.laporan_pengendali || '',
  laporanPengendaliName: row.laporan_pengendali_name || '',
  laporanPengendaliDriveUrl: row.laporan_pengendali_drive_url || '',
  totalPendapatan: Number(row.total_pendapatan || 0)
});

const mapStudiBandingToDb = (rec: any) => ({
  id: rec.id,
  nama_institusi: rec.namaInstitusi,
  wahana_pembelajaran: rec.wahanaPembelajaran,
  tanggal_pelaksanaan: rec.tanggalPelaksanaan,
  total_pendapatan: Number(rec.totalPendapatan || 0),
  lpj: rec.lpj
});
const mapStudiBandingFromDb = (row: any): StudiBandingRecord => ({
  id: String(row.id),
  namaInstitusi: row.nama_institusi || '',
  wahanaPembelajaran: row.wahana_pembelajaran || '',
  tanggalPelaksanaan: row.tanggal_pelaksanaan || '',
  totalPendapatan: Number(row.total_pendapatan || 0),
  lpj: row.lpj || ''
});

const mapDokterObserverToDb = (rec: any) => ({
  id: rec.id,
  nama: rec.nama,
  lulusan_institusi: rec.lulusanInstitusi,
  tanggal_mulai: rec.tanggalMulai,
  tanggal_selesai: rec.tanggalSelesai
});
const mapDokterObserverFromDb = (row: any): DokterObserverRecord => ({
  id: String(row.id),
  nama: row.nama || '',
  lulusanInstitusi: row.lulusan_institusi || '',
  tanggalMulai: row.tanggal_mulai || '',
  tanggalSelesai: row.tanggal_selesai || ''
});

const mapStandarKemenkesToDb = (rec: any) => ({
  id: rec.id,
  judul_pelatihan: rec.judulPelatihan,
  dokumen: rec.dokumen
});
const mapStandarKemenkesFromDb = (row: any): StandarKemenkesRecord => ({
  id: String(row.id),
  judulPelatihan: row.judul_pelatihan || '',
  dokumen: row.dokumen || ''
});

const mapPelatihanInternasionalToDb = (rec: any) => ({
  id: rec.id,
  nama_kegiatan: rec.namaKegiatan,
  tanggal_kegiatan: rec.tanggalKegiatan,
  lembaga_kerjasama: rec.lembagaKerjasama,
  lpj: rec.lpj,
  total_pendapatan: Number(rec.totalPendapatan || 0)
});
const mapPelatihanInternasionalFromDb = (row: any): PelatihanInternasionalRecord => ({
  id: String(row.id),
  namaKegiatan: row.nama_kegiatan || '',
  tanggalKegiatan: row.tanggal_kegiatan || '',
  lembagaKerjasama: row.lembaga_kerjasama || '',
  lpj: row.lpj || '',
  totalPendapatan: Number(row.total_pendapatan || 0)
});

const mapTrainerSertifikasiToDb = (rec: any) => ({
  id: rec.id,
  nama_peserta: rec.namaPeserta,
  unit_kerja: rec.unitKerja,
  judul_pelatihan: rec.judulPelatihan,
  tanggal_pelaksanaan: rec.tanggalPelaksanaan,
  sertifikat: rec.sertifikat,
  sertifikat_name: rec.sertifikatName,
  sertifikat_drive_url: rec.sertifikatDriveUrl
});

const mapTrainerSertifikasiFromDb = (row: any): TrainerSertifikasiRecord => ({
  id: String(row.id),
  namaPeserta: row.nama_peserta || '',
  unitKerja: row.unit_kerja || '',
  judulPelatihan: row.judul_pelatihan || '',
  tanggalPelaksanaan: row.tanggal_pelaksanaan || '',
  sertifikat: row.sertifikat || '',
  sertifikatName: row.sertifikat_name || '',
  sertifikatDriveUrl: row.sertifikat_drive_url || ''
});

const mapPelatihanMandiriToDb = (rec: any) => ({
  id: rec.id,
  judul_kegiatan: rec.judulKegiatan,
  tanggal_kegiatan: rec.tanggalKegiatan,
  unit_kerja: rec.unitKerja,
  lpj: rec.lpj,
  lpj_name: rec.lpjName,
  lpj_drive_url: rec.lpjDriveUrl,
  surat_kak_registrasi: rec.suratKakRegistrasi,
  surat_kak_registrasi_name: rec.suratKakRegistrasiName,
  surat_kak_registrasi_drive_url: rec.suratKakRegistrasiDriveUrl,
  laporan_pengendali: rec.laporanPengendali,
  laporan_pengendali_name: rec.laporanPengendaliName,
  laporan_pengendali_drive_url: rec.laporanPengendaliDriveUrl,
  total_pendapatan: Number(rec.totalPendapatan || 0)
});

const mapPelatihanMandiriFromDb = (row: any): PelatihanMandiriRecord => ({
  id: String(row.id),
  judulKegiatan: row.judul_kegiatan || '',
  tanggalKegiatan: row.tanggal_kegiatan || '',
  unitKerja: row.unit_kerja || '',
  lpj: row.lpj || '',
  lpjName: row.lpj_name || '',
  lpjDriveUrl: row.lpj_drive_url || '',
  suratKakRegistrasi: row.surat_kak_registrasi || '',
  suratKakRegistrasiName: row.surat_kak_registrasi_name || '',
  suratKakRegistrasiDriveUrl: row.surat_kak_registrasi_drive_url || '',
  laporanPengendali: row.laporan_pengendali || '',
  laporanPengendaliName: row.laporan_pengendali_name || '',
  laporanPengendaliDriveUrl: row.laporan_pengendali_drive_url || '',
  totalPendapatan: Number(row.total_pendapatan || 0)
});

const mapMonitoringJamToDb = (rec: any) => ({
  id: rec.id,
  nama: rec.nama,
  nip: rec.nip,
  ksm: rec.ksm,
  total_jam: Number(rec.totalJam || 0),
  status_kepatuhan: rec.statusKepatuhan
});

const mapMonitoringJamFromDb = (row: any): MonitoringJamRecord => ({
  id: String(row.id),
  nama: row.nama || '',
  nip: row.nip || '',
  ksm: row.ksm || '',
  totalJam: Number(row.total_jam || 0),
  statusKepatuhan: row.status_kepatuhan || 'Tidak Patuh'
});

const mapMagangToDb = (rec: any) => ({
  id: rec.id,
  jenis_magang: rec.jenisMagang,
  nama_peserta: rec.namaPeserta,
  nama_institusi: rec.namaInstitusi,
  tanggal_mulai: rec.tanggalMulai,
  tanggal_selesai: rec.tanggalSelesai,
  tempat_pelaksanaan: rec.tempatPelaksanaan,
  total_pendapatan: Number(rec.totalPendapatan || 0),
  karya_ilmiah: rec.karyaIlmiahDriveUrl || rec.karyaIlmiah,
  sertifikat: rec.sertifikatDriveUrl || rec.sertifikat
});
const mapMagangFromDb = (row: any): MagangRecord => ({
  id: String(row.id),
  jenisMagang: row.jenis_magang || 'Magang Observer',
  namaPeserta: row.nama_peserta || '',
  namaInstitusi: row.nama_institusi || '',
  tanggalMulai: row.tanggal_mulai || '',
  tanggalSelesai: row.tanggal_selesai || '',
  tempatPelaksanaan: row.tempat_pelaksanaan || '',
  totalPendapatan: Number(row.total_pendapatan || 0),
  karyaIlmiah: row.karya_ilmiah || '',
  sertifikat: row.sertifikat || ''
});

const mapPenelitianToDb = (rec: any) => ({
  id: rec.id,
  judul: rec.judul,
  peneliti_utama: rec.penelitiUtama,
  status: rec.status,
  publikasi_scopus: rec.publikasiScopus ? 1 : 0,
  paten_terdaftar: rec.patenTerdaftar ? 1 : 0,
  dana_hibah: Number(rec.danaHibah || 0),
  tanggal_mulai: rec.tanggalMulai
});
const mapPenelitianFromDb = (row: any): PenelitianRecord => ({
  id: String(row.id),
  judul: row.judul || '',
  penelitiUtama: row.peneliti_utama || '',
  status: row.status || 'Berjalan Penuh',
  publikasiScopus: !!Number(row.publikasi_scopus),
  patenTerdaftar: !!Number(row.paten_terdaftar),
  danaHibah: Number(row.dana_hibah || 0),
  tanggalMulai: row.tanggal_mulai || ''
});

const mapPendapatanPenelitianToDb = (rec: any) => ({
  id: rec.id,
  bulan: rec.bulan,
  pendapatan_etik: rec.pendapatanEtik,
  pendapatan_lab_riset: rec.pendapatanLabRiset,
  pendapatan_inovasi: rec.pendapatanInovasi,
  pendapatan_uji_klinik: rec.pendapatanUjiKlinik,
  total_pendapatan: rec.totalPendapatan
});
const mapPendapatanPenelitianFromDb = (row: any): PendapatanPenelitianRecord => ({
  id: String(row.id),
  bulan: row.bulan || 'Januari',
  pendapatanEtik: Number(row.pendapatan_etik || 0),
  pendapatanLabRiset: Number(row.pendapatan_lab_riset || 0),
  pendapatanInovasi: Number(row.pendapatan_inovasi || 0),
  pendapatanUjiKlinik: Number(row.pendapatan_uji_klinik || 0),
  totalPendapatan: Number(row.total_pendapatan || 0)
});

const mapUjiEtikToDb = (rec: any) => ({
  id: rec.id,
  tanggal_surat_masuk: rec.tanggalSuratMasuk,
  nomor_surat_masuk: rec.nomorSuratMasuk,
  nama_peneliti: rec.namaPeneliti,
  nim_nrp_nip: rec.nimNrpNip,
  cp: rec.cp,
  institusi: rec.institusi,
  pendidikan: rec.pendidikan,
  jenis_kegiatan: rec.jenisKegiatan,
  judul_penelitian: rec.judulPenelitian,
  jumlah_sampel_penelitian: rec.jumlahSampelPenelitian,
  pengambilan_data: rec.pengambilanData,
  pembimbing_klinis: rec.pembimbingKlinis,
  review_awal: rec.reviewAwal,
  hasil_review: rec.hasilReview,
  catatan_reviewer: rec.catatanReviewer,
  tanggal_seminar_etik: rec.tanggalSeminarEtik,
  tanggal_sertifikat_etik: rec.tanggalSertifikatEtik,
  monev: rec.monev,
  laporan: rec.laporan,
  pembayaran_nominal: rec.pembayaranNominal,
  pembayaran_status: rec.pembayaranStatus
});
const mapUjiEtikFromDb = (row: any): UjiEtikRecord => ({
  id: String(row.id),
  tanggalSuratMasuk: row.tanggal_surat_masuk || '',
  nomorSuratMasuk: row.nomor_surat_masuk || '',
  namaPeneliti: row.nama_peneliti || '',
  nimNrpNip: row.nim_nrp_nip || '',
  cp: row.cp || '',
  institusi: row.institusi || '',
  pendidikan: row.pendidikan || '-',
  jenisKegiatan: row.jenis_kegiatan || 'TUGAS AKHIR',
  judulPenelitian: row.judul_penelitian || '',
  jumlahSampelPenelitian: Number(row.jumlah_sampel_penelitian || 0),
  pengambilanData: row.pengambilan_data || '',
  pembimbingKlinis: row.pembimbing_klinis || '',
  reviewAwal: row.review_awal || 'WAKIL I',
  hasilReview: row.hasil_review || 'EXEMPTED',
  catatanReviewer: row.catatan_reviewer || '',
  tanggalSeminarEtik: row.tanggal_seminar_etik || '',
  tanggalSertifikatEtik: row.tanggal_sertifikat_etik || '',
  monev: row.monev || 'BELUM',
  laporan: row.laporan || 'BERJALAN',
  pembayaranNominal: Number(row.pembayaran_nominal || 0),
  pembayaranStatus: row.pembayaran_status || 'Belum Lunas'
});

const mapUjiKlinikToDb = (rec: any) => ({
  id: rec.id,
  tahun: rec.tahun,
  judul_penelitian: rec.judulPenelitian,
  mitra_kerjasama: rec.mitraKerjasama,
  tim_peneliti_file: rec.timPenelitiFile,
  tim_peneliti_file_name: rec.timPenelitiFileName,
  tim_peneliti_file_drive_url: rec.timPenelitiFileDriveUrl,
  cta_file: rec.ctaFile,
  cta_file_name: rec.ctaFileName,
  cta_file_drive_url: rec.ctaFileDriveUrl,
  dana_rab_penelitian: rec.danaRabPenelitian,
  status: rec.status
});
const mapUjiKlinikFromDb = (row: any): UjiKlinikRecord => ({
  id: String(row.id),
  tahun: row.tahun || '',
  judulPenelitian: row.judul_penelitian || '',
  mitraKerjasama: row.mitra_kerjasama || '',
  timPenelitiFile: row.tim_peneliti_file || '',
  timPenelitiFileName: row.tim_peneliti_file_name || '',
  timPenelitiFileDriveUrl: row.tim_peneliti_file_drive_url || '',
  ctaFile: row.cta_file || '',
  ctaFileName: row.cta_file_name || '',
  ctaFileDriveUrl: row.cta_file_drive_url || '',
  danaRabPenelitian: Number(row.dana_rab_penelitian || 0),
  status: row.status || 'SSV'
});

const mapPenelitianPublikasiToDb = (rec: any) => ({
  id: rec.id,
  nama_autor: rec.namaAutor,
  afiliasi: rec.afiliasi,
  judul_artikel_ilmiah: rec.judulArtikelIlmiah,
  nama_jurnal_terbit: rec.namaJurnalTerbit,
  jenis_publikasi: rec.jenisPublikasi,
  ranking: rec.ranking,
  tanggal_publikasi: rec.tanggalPublikasi,
  doi_situs_web: rec.doiSitusWeb
});
const mapPenelitianPublikasiFromDb = (row: any): PenelitianPublikasiRecord => ({
  id: String(row.id),
  namaAutor: row.nama_autor || '',
  afiliasi: row.afiliasi || '',
  judulArtikelIlmiah: row.judul_artikel_ilmiah || '',
  namaJurnalTerbit: row.nama_jurnal_terbit || '',
  jenisPublikasi: row.jenis_publikasi || 'Nasional',
  ranking: row.ranking || 'S1',
  tanggalPublikasi: row.tanggal_publikasi || '',
  doiSitusWeb: row.doi_situs_web || ''
});

const mapProdukInovasiToDb = (rec: any) => ({
  id: rec.id,
  tahun: rec.tahun,
  nama_produk: rec.namaProduk,
  judul_riset_inovasi: rec.judulRisetInovasi,
  mitra_kerjasama: rec.mitraKerjasama,
  sponsor: rec.sponsor,
  pic: rec.pic,
  foto_produk: rec.fotoProduk,
  foto_produk_name: rec.fotoProdukName,
  foto_produk_drive_url: rec.fotoProdukDriveUrl,
  deskripsi_singkat: rec.deskripsiSingkat
});
const mapProdukInovasiFromDb = (row: any): ProdukInovasiRecord => ({
  id: String(row.id),
  tahun: row.tahun || '',
  namaProduk: row.nama_produk || '',
  judulRisetInovasi: row.judul_riset_inovasi || '',
  mitraKerjasama: row.mitra_kerjasama || '',
  sponsor: row.sponsor || '',
  pic: row.pic || '',
  fotoProduk: row.foto_produk || '',
  fotoProdukName: row.foto_produk_name || '',
  fotoProdukDriveUrl: row.foto_produk_drive_url || '',
  deskripsiSingkat: row.deskripsi_singkat || ''
});

const mapProdukInovasiTerjualToDb = (rec: any) => ({
  id: rec.id,
  tanggal: rec.tanggal,
  nama_pasien: rec.namaPasien,
  nama_produk: rec.namaProduk,
  jumlah_pesanan_produk: rec.jumlahPesananProduk
});
const mapProdukInovasiTerjualFromDb = (row: any): ProdukInovasiTerjualRecord => ({
  id: String(row.id),
  tanggal: row.tanggal || '',
  namaPasien: row.nama_pasien || '',
  namaProduk: row.nama_produk || '',
  jumlahPesananProduk: Number(row.jumlah_pesanan_produk || 0)
});

const mapBukuIsbnToDb = (rec: any) => ({
  id: rec.id,
  tanggal_terbit: rec.tanggalTerbit,
  nama_penulis: rec.namaPenulis,
  afiliasi: rec.afiliasi,
  judul_buku: rec.judulBuku,
  nomor_isbn: rec.nomorIsbn,
  nama_publiser: rec.namaPubliser,
  link_publikasi_ebook: rec.linkPublikasiEbook,
  bukti_buku_cetak: rec.buktiBukuCetak,
  bukti_buku_cetak_name: rec.buktiBukuCetakName,
  bukti_buku_cetak_drive_url: rec.buktiBukuCetakDriveUrl
});
const mapBukuIsbnFromDb = (row: any): BukuIsbnRecord => ({
  id: String(row.id),
  tanggalTerbit: row.tanggal_terbit || '',
  namaPenulis: row.nama_penulis || '',
  afiliasi: row.afiliasi || '',
  judulBuku: row.judul_buku || '',
  nomorIsbn: row.nomor_isbn || '',
  namaPubliser: row.nama_publiser || '',
  linkPublikasiEbook: row.link_publikasi_ebook || '',
  buktiBukuCetak: row.bukti_buku_cetak || '',
  buktiBukuCetakName: row.bukti_buku_cetak_name || '',
  buktiBukuCetakDriveUrl: row.bukti_buku_cetak_drive_url || ''
});

const mapPengabdianMasyarakatToDb = (rec: any) => ({
  id: rec.id,
  nama: rec.nama,
  ksm_departemen: rec.ksmDepartemen,
  judul: rec.judul,
  skema: rec.skema,
  tahun: rec.tahun
});
const mapPengabdianMasyarakatFromDb = (row: any): PengabdianMasyarakatRecord => ({
  id: String(row.id),
  nama: row.nama || '',
  ksmDepartemen: row.ksm_departemen || '',
  judul: row.judul || '',
  skema: row.skema || '',
  tahun: row.tahun || ''
});

const mapProposalArfToDb = (rec: any) => ({
  id: rec.id,
  ketua_peneliti: rec.ketuaPeneliti,
  unit_kerja: rec.unitKerja,
  anggota_peneliti: rec.anggotaPeneliti,
  judul_penelitian: rec.judulPenelitian,
  skema: rec.skema,
  target_luaran: rec.targetLuaran,
  dana_hibah_diperoleh: rec.danaHibahDiperoleh
});
const mapProposalArfFromDb = (row: any): ProposalArfRecord => ({
  id: String(row.id),
  ketuaPeneliti: row.ketua_peneliti || '',
  unitKerja: row.unit_kerja || '',
  anggotaPeneliti: row.anggota_peneliti || '',
  judulPenelitian: row.judul_penelitian || '',
  skema: row.skema || 'ARF-A',
  targetLuaran: row.target_luaran || '',
  danaHibahDiperoleh: Number(row.dana_hibah_diperoleh || 0)
});

const mapSubmissionCphmToDb = (rec: any) => ({
  id: rec.id,
  tanggal: rec.tanggal,
  judul_artikel: rec.judulArtikel,
  author: rec.author,
  afiliasi: rec.afiliasi,
  file_artikel: rec.fileArtikel,
  file_artikel_name: rec.fileArtikelName,
  file_artikel_drive_url: rec.fileArtikelDriveUrl
});
const mapSubmissionCphmFromDb = (row: any): SubmissionCphmRecord => ({
  id: String(row.id),
  tanggal: row.tanggal || '',
  judulArtikel: row.judul_artikel || '',
  author: row.author || '',
  afiliasi: row.afiliasi || '',
  fileArtikel: row.file_artikel || '',
  fileArtikelName: row.file_artikel_name || '',
  fileArtikelDriveUrl: row.file_artikel_drive_url || ''
});

const mapPatenToDb = (rec: any) => ({
  id: rec.id,
  tanggal_terbit: rec.tanggalTerbit,
  nama_autor: rec.namaAutor,
  afiliasi: rec.afiliasi,
  judul_paten: rec.judulPaten,
  nomor_paten: rec.nomorPaten,
  bukti_sertifikat_paten: rec.buktiSertifikatPaten,
  bukti_sertifikat_paten_name: rec.buktiSertifikatPatenName,
  bukti_sertifikat_paten_drive_url: rec.buktiSertifikatPatenDriveUrl
});
const mapPatenFromDb = (row: any): PatenRecord => ({
  id: String(row.id),
  tanggalTerbit: row.tanggal_terbit || '',
  namaAutor: row.nama_autor || '',
  afiliasi: row.afiliasi || '',
  judulPaten: row.judul_paten || '',
  nomorPaten: row.nomor_paten || '',
  buktiSertifikatPaten: row.bukti_sertifikat_paten || '',
  buktiSertifikatPatenName: row.bukti_sertifikat_paten_name || '',
  buktiSertifikatPatenDriveUrl: row.bukti_sertifikat_paten_drive_url || ''
});

const mapHkiToDb = (rec: any) => ({
  id: rec.id,
  tanggal_terbit: rec.tanggalTerbit,
  nama_autor: rec.namaAutor,
  afiliasi: rec.afiliasi,
  judul_hki: rec.judulHki,
  nomor_hki: rec.nomorHki,
  bukti_sertifikat_hki: rec.buktiSertifikatHki,
  bukti_sertifikat_hki_name: rec.buktiSertifikatHkiName,
  bukti_sertifikat_hki_drive_url: rec.buktiSertifikatHkiDriveUrl
});
const mapHkiFromDb = (row: any): HkiRecord => ({
  id: String(row.id),
  tanggalTerbit: row.tanggal_terbit || '',
  namaAutor: row.nama_autor || '',
  afiliasi: row.afiliasi || '',
  judulHki: row.judul_hki || '',
  nomorHki: row.nomor_hki || '',
  buktiSertifikatHki: row.bukti_sertifikat_hki || '',
  buktiSertifikatHkiName: row.bukti_sertifikat_hki_name || '',
  buktiSertifikatHkiDriveUrl: row.bukti_sertifikat_hki_drive_url || ''
});

const mapPrapendidikanKomkordikToDb = (rec: any) => ({
  id: rec.id,
  tanggal_pelaksanaan: rec.tanggalPelaksanaan,
  institusi_pendidikan: rec.institusiPendidikan,
  total_peserta: Number(rec.totalPeserta || 0)
});
const mapPrapendidikanKomkordikFromDb = (row: any): PrapendidikanKomkordikRecord => ({
  id: String(row.id),
  tanggalPelaksanaan: row.tanggal_pelaksanaan || '',
  institusiPendidikan: row.institusi_pendidikan || '',
  totalPeserta: Number(row.total_peserta || 0)
});

const mapOrientasiKsmToDb = (rec: any) => ({
  id: rec.id,
  tanggal_pelaksanaan: rec.tanggalPelaksanaan,
  institusi_pendidikan: rec.institusiPendidikan,
  total_peserta: Number(rec.totalPeserta || 0),
  bukti_foto1: rec.buktiFoto1,
  bukti_foto1_name: rec.buktiFoto1Name,
  bukti_foto2: rec.buktiFoto2,
  bukti_foto2_name: rec.buktiFoto2Name
});

const mapPendapatanPendidikanToDb = (rec: any) => ({
  id: rec.id,
  bulan: rec.bulan,
  tahun: rec.tahun,
  institusi_name: rec.institusiName,
  institusi_type: rec.institusiType,
  prapendidikan_income: Number(rec.prapendidikanIncome || 0),
  praktik_income: Number(rec.praktikIncome || 0),
  ipe_income: Number(rec.ipeIncome || 0),
  total_income: Number(rec.totalIncome || 0),
  bukti_pembayaran: rec.buktiPembayaran,
  bukti_pembayaran_name: rec.buktiPembayaranName
});

const mapPajananPesertaToDb = (rec: any) => ({
  id: rec.id,
  nama_mahasiswa: rec.namaMahasiswa,
  nim: rec.nim,
  institusi_type: rec.institusiType,
  fakultas: rec.fakultas,
  program_studi: rec.programStudi,
  jenis_pajanan: rec.jenisPajanan,
  tanggal_kejadian: rec.tanggalKejadian,
  lokasi_kejadian: rec.lokasiKejadian,
  deskripsi_kejadian: rec.deskripsiKejadian,
  tindak_lanjut: rec.tindakLanjut,
  file_laporan: rec.fileLaporan,
  tanggal_laporan: rec.tanggalLaporan
});
const mapOrientasiKsmFromDb = (row: any): OrientasiKsmRecord => ({
  id: String(row.id),
  tanggalPelaksanaan: row.tanggal_pelaksanaan || '',
  institusiPendidikan: row.institusi_pendidikan || '',
  totalPeserta: Number(row.total_peserta || 0),
  buktiFoto1: row.bukti_foto1,
  buktiFoto1Name: row.bukti_foto1_name,
  buktiFoto2: row.bukti_foto2,
  buktiFoto2Name: row.bukti_foto2_name
});

const mapPendapatanPendidikanFromDb = (row: any): PendapatanPendidikanRecord => ({
  id: String(row.id),
  bulan: row.bulan || '',
  tahun: row.tahun || '',
  institusiName: row.institusi_name || '',
  institusiType: row.institusi_type || 'NON UNAIR',
  prapendidikanIncome: Number(row.prapendidikan_income || 0),
  praktikIncome: Number(row.praktik_income || 0),
  ipeIncome: Number(row.ipe_income || 0),
  totalIncome: Number(row.total_income || 0),
  buktiPembayaran: row.bukti_pembayaran,
  buktiPembayaranName: row.bukti_pembayaran_name
});

const mapPajananPesertaFromDb = (row: any): PajananPesertaRecord => ({
  id: String(row.id),
  namaMahasiswa: row.nama_mahasiswa || '',
  nim: row.nim || '',
  institusiType: row.institusi_type || 'UNAIR',
  fakultas: row.fakultas || '',
  programStudi: row.program_studi || '',
  jenisPajanan: row.jenis_pajanan || '',
  tanggalKejadian: row.tanggal_kejadian || '',
  lokasiKejadian: row.lokasi_kejadian || '',
  deskripsiKejadian: row.deskripsi_kejadian || '',
  tindakLanjut: row.tindak_lanjut || '',
  fileLaporan: row.file_laporan || '',
  tanggalLaporan: row.tanggal_laporan || ''
});


interface SMKSContextType {
  // Sub-data menu Pendidikan
  praPendidikanRecords: PraPendidikanRecord[];
  ipeRecords: IpeRecord[];
  modulIpeRecords: ModulIpeRecord[];
  studentInboundRecords: StudentInboundRecord[];
  kunjunganRecords: KunjunganRecord[];
  mouRecords: MouRecord[];
  akselerasiRecords: AkselerasiRecord[];
  programFellowshipRecords: ProgramFellowshipRecord[];

  // Pelatihan & Penelitian Datasets
  pelatihanRecords: PelatihanRecord[];
  
  // Pelatihan Sub-menus Datasets
  pelatihanUnggulanRecords: PelatihanUnggulanRecord[];
  inhouseTrainingRecords: InhouseTrainingRecord[];
  monitoringJamRecords: MonitoringJamRecord[];
  kerjasamaSkpRecords: KerjasamaSkpRecord[];
  studiBandingRecords: StudiBandingRecord[];
  dokterObserverRecords: DokterObserverRecord[];
  magangRecords: MagangRecord[];
  standarKemenkesRecords: StandarKemenkesRecord[];
  pelatihanInternasionalRecords: PelatihanInternasionalRecord[];
  trainerSertifikasiRecords: TrainerSertifikasiRecord[];
  pelatihanMandiriRecords: PelatihanMandiriRecord[];

  // Inovasi & Penelitian Sub-menus
  pendapatanPenelitianRecords: PendapatanPenelitianRecord[];
  ujiEtikRecords: UjiEtikRecord[];
  ujiKlinikRecords: UjiKlinikRecord[];
  penelitianPublikasiRecords: PenelitianPublikasiRecord[];
  produkInovasiRecords: ProdukInovasiRecord[];
  produkInovasiTerjualRecords: ProdukInovasiTerjualRecord[];
  bukuIsbnRecords: BukuIsbnRecord[];
  pengabdianMasyarakatRecords: PengabdianMasyarakatRecord[];
  proposalArfRecords: ProposalArfRecord[];
  submissionCphmRecords: SubmissionCphmRecord[];
  patenRecords: PatenRecord[];
  hkiRecords: HkiRecord[];

  penelitianRecords: PenelitianRecord[];

  // Actions Pendidikan
  prapendidikanKomkordikRecords: PrapendidikanKomkordikRecord[];
  addPrapendidikanKomkordikRecord: (rec: Omit<PrapendidikanKomkordikRecord, 'id'>) => void;
  updatePrapendidikanKomkordikRecord: (rec: PrapendidikanKomkordikRecord) => void;
  deletePrapendidikanKomkordikRecord: (id: string) => void;

  orientasiKsmRecords: OrientasiKsmRecord[];
  addOrientasiKsmRecord: (rec: Omit<OrientasiKsmRecord, 'id'>) => void;
  updateOrientasiKsmRecord: (rec: OrientasiKsmRecord) => void;
  deleteOrientasiKsmRecord: (id: string) => void;

  pendapatanPendidikanRecords: PendapatanPendidikanRecord[];
  addPendapatanPendidikanRecord: (rec: Omit<PendapatanPendidikanRecord, 'id'>) => void;
  updatePendapatanPendidikanRecord: (rec: PendapatanPendidikanRecord) => void;
  deletePendapatanPendidikanRecord: (id: string) => void;

  pajananPesertaRecords: PajananPesertaRecord[];
  addPajananPesertaRecord: (rec: Omit<PajananPesertaRecord, 'id'>) => void;
  updatePajananPesertaRecord: (rec: PajananPesertaRecord) => void;
  deletePajananPesertaRecord: (id: string) => void;

  addPraPendidikanRecord: (rec: Omit<PraPendidikanRecord, 'id'>) => void;
  updatePraPendidikanRecord: (rec: PraPendidikanRecord) => void;
  deletePraPendidikanRecord: (id: string) => void;

  addIpeRecord: (rec: Omit<IpeRecord, 'id'>) => void;
  updateIpeRecord: (rec: IpeRecord) => void;
  deleteIpeRecord: (id: string) => void;

  addModulIpeRecord: (rec: Omit<ModulIpeRecord, 'id'>) => void;
  updateModulIpeRecord: (rec: ModulIpeRecord) => void;
  deleteModulIpeRecord: (id: string) => void;

  addStudentInboundRecord: (rec: Omit<StudentInboundRecord, 'id'>) => void;
  updateStudentInboundRecord: (rec: StudentInboundRecord) => void;
  deleteStudentInboundRecord: (id: string) => void;

  addKunjunganRecord: (rec: Omit<KunjunganRecord, 'id'>) => void;
  updateKunjunganRecord: (rec: KunjunganRecord) => void;
  deleteKunjunganRecord: (id: string) => void;

  addMouRecord: (rec: Omit<MouRecord, 'id'>) => void;
  updateMouRecord: (rec: MouRecord) => void;
  deleteMouRecord: (id: string) => void;

  addAkselerasiRecord: (rec: Omit<AkselerasiRecord, 'id'>) => void;
  updateAkselerasiRecord: (rec: AkselerasiRecord) => void;
  deleteAkselerasiRecord: (id: string) => void;

  addProgramFellowshipRecord: (rec: Omit<ProgramFellowshipRecord, 'id'>) => void;
  updateProgramFellowshipRecord: (rec: ProgramFellowshipRecord) => void;
  deleteProgramFellowshipRecord: (id: string) => void;

  // Actions Pelatihan & Penelitian
  addPelatihanRecord: (rec: Omit<PelatihanRecord, 'id'>) => void;
  updatePelatihanRecord: (rec: PelatihanRecord) => void;
  deletePelatihanRecord: (id: string) => void;

  // Pelatihan Sub-menus Actions
  addPelatihanUnggulan: (rec: Omit<PelatihanUnggulanRecord, 'id'>) => void;
  updatePelatihanUnggulan: (rec: PelatihanUnggulanRecord) => void;
  deletePelatihanUnggulan: (id: string) => void;

  addInhouseTraining: (rec: Omit<InhouseTrainingRecord, 'id'>) => void;
  updateInhouseTraining: (rec: InhouseTrainingRecord) => void;
  deleteInhouseTraining: (id: string) => void;

  addMonitoringJam: (rec: Omit<MonitoringJamRecord, 'id'>) => void;
  updateMonitoringJam: (rec: MonitoringJamRecord) => void;
  deleteMonitoringJam: (id: string) => void;

  addKerjasamaSkp: (rec: Omit<KerjasamaSkpRecord, 'id'>) => void;
  updateKerjasamaSkp: (rec: KerjasamaSkpRecord) => void;
  deleteKerjasamaSkp: (id: string) => void;

  addStudiBanding: (rec: Omit<StudiBandingRecord, 'id'>) => void;
  updateStudiBanding: (rec: StudiBandingRecord) => void;
  deleteStudiBanding: (id: string) => void;

  addDokterObserver: (rec: Omit<DokterObserverRecord, 'id'>) => void;
  updateDokterObserver: (rec: DokterObserverRecord) => void;
  deleteDokterObserver: (id: string) => void;

  addMagang: (rec: Omit<MagangRecord, 'id'>) => void;
  updateMagang: (rec: MagangRecord) => void;
  deleteMagang: (id: string) => void;
  
  addStandarKemenkes: (rec: Omit<StandarKemenkesRecord, 'id'>) => void;
  updateStandarKemenkes: (rec: StandarKemenkesRecord) => void;
  deleteStandarKemenkes: (id: string) => void;

  addPelatihanInternasional: (rec: Omit<PelatihanInternasionalRecord, 'id'>) => void;
  updatePelatihanInternasional: (rec: PelatihanInternasionalRecord) => void;
  deletePelatihanInternasional: (id: string) => void;

  addTrainerSertifikasi: (rec: Omit<TrainerSertifikasiRecord, 'id'>) => void;
  updateTrainerSertifikasi: (rec: TrainerSertifikasiRecord) => void;
  deleteTrainerSertifikasi: (id: string) => void;

  addPelatihanMandiri: (rec: Omit<PelatihanMandiriRecord, 'id'>) => void;
  updatePelatihanMandiri: (rec: PelatihanMandiriRecord) => void;
  deletePelatihanMandiri: (id: string) => void;

  // Inovasi & Penelitian Actions
  addPendapatanPenelitian: (rec: Omit<PendapatanPenelitianRecord, 'id'>) => void;
  updatePendapatanPenelitian: (rec: PendapatanPenelitianRecord) => void;
  deletePendapatanPenelitian: (id: string) => void;

  addUjiEtik: (rec: Omit<UjiEtikRecord, 'id'>) => void;
  updateUjiEtik: (rec: UjiEtikRecord) => void;
  deleteUjiEtik: (id: string) => void;

  addUjiKlinik: (rec: Omit<UjiKlinikRecord, 'id'>) => void;
  updateUjiKlinik: (rec: UjiKlinikRecord) => void;
  deleteUjiKlinik: (id: string) => void;

  addPenelitianPublikasi: (rec: Omit<PenelitianPublikasiRecord, 'id'>) => void;
  updatePenelitianPublikasi: (rec: PenelitianPublikasiRecord) => void;
  deletePenelitianPublikasi: (id: string) => void;

  addProdukInovasi: (rec: Omit<ProdukInovasiRecord, 'id'>) => void;
  updateProdukInovasi: (rec: ProdukInovasiRecord) => void;
  deleteProdukInovasi: (id: string) => void;

  addProdukInovasiTerjual: (rec: Omit<ProdukInovasiTerjualRecord, 'id'>) => void;
  updateProdukInovasiTerjual: (rec: ProdukInovasiTerjualRecord) => void;
  deleteProdukInovasiTerjual: (id: string) => void;

  addBukuIsbn: (rec: Omit<BukuIsbnRecord, 'id'>) => void;
  updateBukuIsbn: (rec: BukuIsbnRecord) => void;
  deleteBukuIsbn: (id: string) => void;

  addPengabdianMasyarakat: (rec: Omit<PengabdianMasyarakatRecord, 'id'>) => void;
  updatePengabdianMasyarakat: (rec: PengabdianMasyarakatRecord) => void;
  deletePengabdianMasyarakat: (id: string) => void;

  addProposalArf: (rec: Omit<ProposalArfRecord, 'id'>) => void;
  updateProposalArf: (rec: ProposalArfRecord) => void;
  deleteProposalArf: (id: string) => void;

  addSubmissionCphm: (rec: Omit<SubmissionCphmRecord, 'id'>) => void;
  updateSubmissionCphm: (rec: SubmissionCphmRecord) => void;
  deleteSubmissionCphm: (id: string) => void;

  addPaten: (rec: Omit<PatenRecord, 'id'>) => void;
  updatePaten: (rec: PatenRecord) => void;
  deletePaten: (id: string) => void;

  addHki: (rec: Omit<HkiRecord, 'id'>) => void;
  updateHki: (rec: HkiRecord) => void;
  deleteHki: (id: string) => void;

  addPenelitianRecord: (rec: Omit<PenelitianRecord, 'id'>) => void;
  deletePenelitianRecord: (id: string) => void;

  // Global States Actions
  clearAllData: () => void;
  loadSampleData: () => void;

  // Aggregate stats
  dashboardStats: {
    pendidikan: {
      totalOrientasiPeserta: number;
      totalIpePeserta: number;
      totalModul: number;
      totalStudentInbound: number;
      totalKunjungan: number;
      totalMou: number;
      totalAkselerasiPeserta: number;
    };
    pelatihan: {
      totalTrained: number;
      avgHours: number;
      certifiedStaff: number;
      budgetUtilization: number;
    };
    penelitian: {
      activeResearches: number;
      publications: number;
      grants: string;
      rawGrants: number;
      patents: number;
    };
  };

  // Chart adapters
  pelatihanChart: { name: string; medis: number; nonMedis: number }[];
  penelitianChart: { name: string; publikasi: number; paten: number }[];
}

const SMKSContext = createContext<SMKSContextType | undefined>(undefined);

export const SMKSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize to empty array to honor "hapus semua data dummy"
  // Cleanup duplicates on load if any
  const ensureUniqueIds = (records: any[], prefix: string) => {
    const ids = new Set();
    return records.map(r => {
      if (!r.id || ids.has(r.id)) {
        const newId = `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
        ids.add(newId);
        return { ...r, id: newId };
      }
      ids.add(r.id);
      return r;
    });
  };

  const [praPendidikanRecords, setPraPendidikanRecords] = useState<PraPendidikanRecord[]>(() => {
    const saved = localStorage.getItem('smks_prapendidikan');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'pra') : [];
  });
  const [prapendidikanKomkordikRecords, setPrapendidikanKomkordikRecords] = useState<PrapendidikanKomkordikRecord[]>(() => {
    const saved = localStorage.getItem('smks_prapendidikan_komkordik');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'prakom') : [];
  });
  const [orientasiKsmRecords, setOrientasiKsmRecords] = useState<OrientasiKsmRecord[]>(() => {
    const saved = localStorage.getItem('smks_orientasi_ksm');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'ksm') : [];
  });
  const [pendapatanPendidikanRecords, setPendapatanPendidikanRecords] = useState<PendapatanPendidikanRecord[]>(() => {
    const saved = localStorage.getItem('smks_pendapatan_pendidikan');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'pendapat') : [];
  });
  const [pajananPesertaRecords, setPajananPesertaRecords] = useState<PajananPesertaRecord[]>(() => {
    const saved = localStorage.getItem('smks_pajanan_peserta');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'pajanan') : [];
  });
  const [programFellowshipRecords, setProgramFellowshipRecords] = useState<ProgramFellowshipRecord[]>(() => {
    const saved = localStorage.getItem('smks_program_fellowship');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'fel') : [];
  });
  const [ipeRecords, setIpeRecords] = useState<IpeRecord[]>(() => {
    const saved = localStorage.getItem('smks_ipe');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'ipe') : [];
  });
  const [modulIpeRecords, setModulIpeRecords] = useState<ModulIpeRecord[]>(() => {
    const saved = localStorage.getItem('smks_modulipe');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'mod') : [];
  });
  const [studentInboundRecords, setStudentInboundRecords] = useState<StudentInboundRecord[]>(() => {
    const saved = localStorage.getItem('smks_studentinbound');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'stu') : [];
  });
  const [kunjunganRecords, setKunjunganRecords] = useState<KunjunganRecord[]>(() => {
    const saved = localStorage.getItem('smks_kunjungan');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'kun') : [];
  });
  const [mouRecords, setMouRecords] = useState<MouRecord[]>(() => {
    const saved = localStorage.getItem('smks_mou');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'mou') : [];
  });
  const [akselerasiRecords, setAkselerasiRecords] = useState<AkselerasiRecord[]>(() => {
    const saved = localStorage.getItem('smks_akselerasi');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'aks') : [];
  });

  const [pelatihanRecords, setPelatihanRecords] = useState<PelatihanRecord[]>(() => {
    const saved = localStorage.getItem('smks_pelatihan');
    return saved ? JSON.parse(saved) : [];
  });

  const [pelatihanUnggulanRecords, setPelatihanUnggulanRecords] = useState<PelatihanUnggulanRecord[]>(() => {
    const saved = localStorage.getItem('smks_pelatihan_unggulan');
    return saved ? JSON.parse(saved) : [];
  });
  const [inhouseTrainingRecords, setInhouseTrainingRecords] = useState<InhouseTrainingRecord[]>(() => {
    const saved = localStorage.getItem('smks_inhouse_training');
    return saved ? JSON.parse(saved) : [];
  });
  const [monitoringJamRecords, setMonitoringJamRecords] = useState<MonitoringJamRecord[]>(() => {
    const saved = localStorage.getItem('smks_monitoring_jam');
    return saved ? JSON.parse(saved) : [];
  });
  const [kerjasamaSkpRecords, setKerjasamaSkpRecords] = useState<KerjasamaSkpRecord[]>(() => {
    const saved = localStorage.getItem('smks_kerjasama_skp');
    return saved ? JSON.parse(saved) : [];
  });
  const [studiBandingRecords, setStudiBandingRecords] = useState<StudiBandingRecord[]>(() => {
    const saved = localStorage.getItem('smks_studi_banding');
    return saved ? JSON.parse(saved) : [];
  });
  const [dokterObserverRecords, setDokterObserverRecords] = useState<DokterObserverRecord[]>(() => {
    const saved = localStorage.getItem('smks_dokter_observer');
    return saved ? JSON.parse(saved) : [];
  });
  const [magangRecords, setMagangRecords] = useState<MagangRecord[]>(() => {
    const saved = localStorage.getItem('smks_magang');
    return saved ? JSON.parse(saved) : [];
  });
  const [standarKemenkesRecords, setStandarKemenkesRecords] = useState<StandarKemenkesRecord[]>(() => {
    const saved = localStorage.getItem('smks_standar_kemenkes');
    return saved ? JSON.parse(saved) : [];
  });
  const [pelatihanInternasionalRecords, setPelatihanInternasionalRecords] = useState<PelatihanInternasionalRecord[]>(() => {
    const saved = localStorage.getItem('smks_pelatihan_internasional');
    return saved ? JSON.parse(saved) : [];
  });
  const [trainerSertifikasiRecords, setTrainerSertifikasiRecords] = useState<TrainerSertifikasiRecord[]>(() => {
    const saved = localStorage.getItem('smks_trainer_sertifikasi');
    return saved ? JSON.parse(saved) : [];
  });
  const [pelatihanMandiriRecords, setPelatihanMandiriRecords] = useState<PelatihanMandiriRecord[]>(() => {
    const saved = localStorage.getItem('smks_pelatihan_mandiri');
    return saved ? JSON.parse(saved) : [];
  });

  const [penelitianRecords, setPenelitianRecords] = useState<PenelitianRecord[]>(() => {
    const saved = localStorage.getItem('smks_penelitian');
    return saved ? JSON.parse(saved) : [];
  });

  const [pendapatanPenelitianRecords, setPendapatanPenelitianRecords] = useState<PendapatanPenelitianRecord[]>(() => {
    const saved = localStorage.getItem('smks_pendapatan_penelitian');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'ppend') : [];
  });
  const [ujiEtikRecords, setUjiEtikRecords] = useState<UjiEtikRecord[]>(() => {
    const saved = localStorage.getItem('smks_uji_etik');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'etik') : [];
  });
  const [ujiKlinikRecords, setUjiKlinikRecords] = useState<UjiKlinikRecord[]>(() => {
    const saved = localStorage.getItem('smks_uji_klinik');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'uklin') : [];
  });
  const [penelitianPublikasiRecords, setPenelitianPublikasiRecords] = useState<PenelitianPublikasiRecord[]>(() => {
    const saved = localStorage.getItem('smks_penelitian_pub');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'ppub') : [];
  });
  const [produkInovasiRecords, setProdukInovasiRecords] = useState<ProdukInovasiRecord[]>(() => {
    const saved = localStorage.getItem('smks_produk_inov');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'inov') : [];
  });
  const [produkInovasiTerjualRecords, setProdukInovasiTerjualRecords] = useState<ProdukInovasiTerjualRecord[]>(() => {
    const saved = localStorage.getItem('smks_produk_inov_terjual');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'piter') : [];
  });
  const [bukuIsbnRecords, setBukuIsbnRecords] = useState<BukuIsbnRecord[]>(() => {
    const saved = localStorage.getItem('smks_buku_isbn');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'bisbn') : [];
  });
  const [pengabdianMasyarakatRecords, setPengabdianMasyarakatRecords] = useState<PengabdianMasyarakatRecord[]>(() => {
    const saved = localStorage.getItem('smks_pengabdian');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'abd') : [];
  });
  const [proposalArfRecords, setProposalArfRecords] = useState<ProposalArfRecord[]>(() => {
    const saved = localStorage.getItem('smks_proposal_arf');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'parf') : [];
  });
  const [submissionCphmRecords, setSubmissionCphmRecords] = useState<SubmissionCphmRecord[]>(() => {
    const saved = localStorage.getItem('smks_submission_cphm');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'scphm') : [];
  });
  const [patenRecords, setPatenRecords] = useState<PatenRecord[]>(() => {
    const saved = localStorage.getItem('smks_paten');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'pat') : [];
  });
  const [hkiRecords, setHkiRecords] = useState<HkiRecord[]>(() => {
    const saved = localStorage.getItem('smks_hki');
    return saved ? ensureUniqueIds(JSON.parse(saved), 'hki') : [];
  });

  // Persists to LocalStorage
  useEffect(() => {
    localStorage.setItem('smks_prapendidikan', JSON.stringify(praPendidikanRecords));
  }, [praPendidikanRecords]);
  useEffect(() => {
    localStorage.setItem('smks_prapendidikan_komkordik', JSON.stringify(prapendidikanKomkordikRecords));
  }, [prapendidikanKomkordikRecords]);
  useEffect(() => {
    localStorage.setItem('smks_orientasi_ksm', JSON.stringify(orientasiKsmRecords));
  }, [orientasiKsmRecords]);
  useEffect(() => {
    localStorage.setItem('smks_pendapatan_pendidikan', JSON.stringify(pendapatanPendidikanRecords));
  }, [pendapatanPendidikanRecords]);
  useEffect(() => {
    localStorage.setItem('smks_pajanan_peserta', JSON.stringify(pajananPesertaRecords));
  }, [pajananPesertaRecords]);
  useEffect(() => {
    localStorage.setItem('smks_ipe', JSON.stringify(ipeRecords));
  }, [ipeRecords]);
  useEffect(() => {
    localStorage.setItem('smks_modulipe', JSON.stringify(modulIpeRecords));
  }, [modulIpeRecords]);
  useEffect(() => {
    localStorage.setItem('smks_studentinbound', JSON.stringify(studentInboundRecords));
  }, [studentInboundRecords]);
  useEffect(() => {
    localStorage.setItem('smks_kunjungan', JSON.stringify(kunjunganRecords));
  }, [kunjunganRecords]);
  useEffect(() => {
    localStorage.setItem('smks_mou', JSON.stringify(mouRecords));
  }, [mouRecords]);
  useEffect(() => {
    localStorage.setItem('smks_akselerasi', JSON.stringify(akselerasiRecords));
  }, [akselerasiRecords]);
  useEffect(() => {
    localStorage.setItem('smks_pelatihan', JSON.stringify(pelatihanRecords));
  }, [pelatihanRecords]);
  useEffect(() => {
    localStorage.setItem('smks_pelatihan_unggulan', JSON.stringify(pelatihanUnggulanRecords));
  }, [pelatihanUnggulanRecords]);
  useEffect(() => {
    localStorage.setItem('smks_inhouse_training', JSON.stringify(inhouseTrainingRecords));
  }, [inhouseTrainingRecords]);
  useEffect(() => {
    localStorage.setItem('smks_monitoring_jam', JSON.stringify(monitoringJamRecords));
  }, [monitoringJamRecords]);
  useEffect(() => {
    localStorage.setItem('smks_kerjasama_skp', JSON.stringify(kerjasamaSkpRecords));
  }, [kerjasamaSkpRecords]);
  useEffect(() => {
    localStorage.setItem('smks_studi_banding', JSON.stringify(studiBandingRecords));
  }, [studiBandingRecords]);
  useEffect(() => {
    localStorage.setItem('smks_dokter_observer', JSON.stringify(dokterObserverRecords));
  }, [dokterObserverRecords]);
  useEffect(() => {
    localStorage.setItem('smks_magang', JSON.stringify(magangRecords));
  }, [magangRecords]);
  useEffect(() => {
    localStorage.setItem('smks_standar_kemenkes', JSON.stringify(standarKemenkesRecords));
  }, [standarKemenkesRecords]);
  useEffect(() => {
    localStorage.setItem('smks_pelatihan_internasional', JSON.stringify(pelatihanInternasionalRecords));
  }, [pelatihanInternasionalRecords]);
  useEffect(() => {
    localStorage.setItem('smks_trainer_sertifikasi', JSON.stringify(trainerSertifikasiRecords));
  }, [trainerSertifikasiRecords]);
  useEffect(() => {
    localStorage.setItem('smks_pelatihan_mandiri', JSON.stringify(pelatihanMandiriRecords));
  }, [pelatihanMandiriRecords]);
  useEffect(() => {
    localStorage.setItem('smks_penelitian', JSON.stringify(penelitianRecords));
  }, [penelitianRecords]);

  useEffect(() => {
    localStorage.setItem('smks_pendapatan_penelitian', JSON.stringify(pendapatanPenelitianRecords));
  }, [pendapatanPenelitianRecords]);
  useEffect(() => {
    localStorage.setItem('smks_uji_etik', JSON.stringify(ujiEtikRecords));
  }, [ujiEtikRecords]);
  useEffect(() => {
    localStorage.setItem('smks_uji_klinik', JSON.stringify(ujiKlinikRecords));
  }, [ujiKlinikRecords]);
  useEffect(() => {
    localStorage.setItem('smks_penelitian_pub', JSON.stringify(penelitianPublikasiRecords));
  }, [penelitianPublikasiRecords]);
  useEffect(() => {
    localStorage.setItem('smks_produk_inov', JSON.stringify(produkInovasiRecords));
  }, [produkInovasiRecords]);
  useEffect(() => {
    localStorage.setItem('smks_produk_inov_terjual', JSON.stringify(produkInovasiTerjualRecords));
  }, [produkInovasiTerjualRecords]);
  useEffect(() => {
    localStorage.setItem('smks_buku_isbn', JSON.stringify(bukuIsbnRecords));
  }, [bukuIsbnRecords]);
  useEffect(() => {
    localStorage.setItem('smks_pengabdian', JSON.stringify(pengabdianMasyarakatRecords));
  }, [pengabdianMasyarakatRecords]);
  useEffect(() => {
    localStorage.setItem('smks_proposal_arf', JSON.stringify(proposalArfRecords));
  }, [proposalArfRecords]);
  useEffect(() => {
    localStorage.setItem('smks_submission_cphm', JSON.stringify(submissionCphmRecords));
  }, [submissionCphmRecords]);
  useEffect(() => {
    localStorage.setItem('smks_paten', JSON.stringify(patenRecords));
  }, [patenRecords]);
  useEffect(() => {
    localStorage.setItem('smks_hki', JSON.stringify(hkiRecords));
  }, [hkiRecords]);
  useEffect(() => {
    localStorage.setItem('smks_prapendidikan_komkordik', JSON.stringify(prapendidikanKomkordikRecords));
  }, [prapendidikanKomkordikRecords]);
  useEffect(() => {
    localStorage.setItem('smks_orientasi_ksm', JSON.stringify(orientasiKsmRecords));
  }, [orientasiKsmRecords]);
  useEffect(() => {
    localStorage.setItem('smks_program_fellowship', JSON.stringify(programFellowshipRecords));
  }, [programFellowshipRecords]);

  const apiSave = async (resource: string, method: 'POST' | 'PUT' | 'DELETE', payload: any, id?: string) => {
    try {
      await fetchApi(resource, method, payload, id);
    } catch (e) {
      console.error(`Gagal menyimpan data ke remote database untuk resource ${resource}:`, e);
    }
  };

  useEffect(() => {
    const loadAllDataFromApi = async () => {
      try {
        const fetchAndSet = async (resource: string, fromDbMap: (row: any) => any, setRecords: React.Dispatch<React.SetStateAction<any[]>>, fallbackKey: string) => {
          try {
            const res = await fetchApi(resource);
            if (res && res.status === "success" && Array.isArray(res.data)) {
              const mapped = res.data.map(fromDbMap);
              setRecords(mapped);
              localStorage.setItem(fallbackKey, JSON.stringify(mapped));
            }
          } catch (e: any) {
            if (e && e.message && e.message.includes("Sesi telah habis")) {
              console.warn(`Sesi sinkronisasi DB ditangguhkan untuk resource ${resource}. Pengguna offline atau sesi habis.`);
            } else {
              console.error(`Gagal sinkronisasi data dari DB untuk resource ${resource}, menggunakan cache lokal.`, e);
            }
          }
        };

        await Promise.all([
          fetchAndSet('pra_pendidikan', mapPraPendidikanFromDb, setPraPendidikanRecords, 'smks_prapendidikan'),
          fetchAndSet('ipe', mapIpeFromDb, setIpeRecords, 'smks_ipe'),
          fetchAndSet('modul_ipe', mapModulIpeFromDb, setModulIpeRecords, 'smks_modulipe'),
          fetchAndSet('student_inbound', mapStudentInboundFromDb, setStudentInboundRecords, 'smks_studentinbound'),
          fetchAndSet('kunjungan', mapKunjunganFromDb, setKunjunganRecords, 'smks_kunjungan'),
          fetchAndSet('mou', mapMouFromDb, setMouRecords, 'smks_mou'),
          fetchAndSet('akselerasi', mapAkselerasiFromDb, setAkselerasiRecords, 'smks_akselerasi'),
          
          fetchAndSet('pelatihan', mapPelatihanFromDb, setPelatihanRecords, 'smks_pelatihan'),
          fetchAndSet('pelatihan_unggulan', mapPelatihanUnggulanFromDb, setPelatihanUnggulanRecords, 'smks_pelatihan_unggulan'),
          fetchAndSet('inhouse_training', mapInhouseTrainingFromDb, setInhouseTrainingRecords, 'smks_inhouse_training'),
          fetchAndSet('monitoring_jam', mapMonitoringJamFromDb, setMonitoringJamRecords, 'smks_monitoring_jam'),
          fetchAndSet('kegiatan_kerjasama_skp', mapKerjasamaSkpFromDb, setKerjasamaSkpRecords, 'smks_kerjasama_skp'),
          fetchAndSet('studi_banding', mapStudiBandingFromDb, setStudiBandingRecords, 'smks_studi_banding'),
          fetchAndSet('dokter_observer', mapDokterObserverFromDb, setDokterObserverRecords, 'smks_dokter_observer'),
          fetchAndSet('magang', mapMagangFromDb, setMagangRecords, 'smks_magang'),
          fetchAndSet('kurikulum_kemenkes', mapStandarKemenkesFromDb, setStandarKemenkesRecords, 'smks_standar_kemenkes'),
          fetchAndSet('kegiatan_internasional', mapPelatihanInternasionalFromDb, setPelatihanInternasionalRecords, 'smks_pelatihan_internasional'),
          fetchAndSet('trainer_sertifikasi', mapTrainerSertifikasiFromDb, setTrainerSertifikasiRecords, 'smks_trainer_sertifikasi'),
          fetchAndSet('kegiatan_mandiri_skp', mapPelatihanMandiriFromDb, setPelatihanMandiriRecords, 'smks_pelatihan_mandiri'),
          
          fetchAndSet('penelitian', mapPenelitianFromDb, setPenelitianRecords, 'smks_penelitian'),
          fetchAndSet('pendapatan_penelitian', mapPendapatanPenelitianFromDb, setPendapatanPenelitianRecords, 'smks_pendapatan_penelitian'),
          fetchAndSet('uji_etik', mapUjiEtikFromDb, setUjiEtikRecords, 'smks_uji_etik'),
          fetchAndSet('uji_klinik', mapUjiKlinikFromDb, setUjiKlinikRecords, 'smks_uji_klinik'),
          fetchAndSet('penelitian_publikasi', mapPenelitianPublikasiFromDb, setPenelitianPublikasiRecords, 'smks_penelitian_pub'),
          fetchAndSet('produk_inovasi', mapProdukInovasiFromDb, setProdukInovasiRecords, 'smks_produk_inov'),
          fetchAndSet('produk_inovasi_terjual', mapProdukInovasiTerjualFromDb, setProdukInovasiTerjualRecords, 'smks_produk_inov_terjual'),
          fetchAndSet('buku_isbn', mapBukuIsbnFromDb, setBukuIsbnRecords, 'smks_buku_isbn'),
          fetchAndSet('pengabdian_masyarakat', mapPengabdianMasyarakatFromDb, setPengabdianMasyarakatRecords, 'smks_pengabdian'),
          fetchAndSet('proposal_arf', mapProposalArfFromDb, setProposalArfRecords, 'smks_proposal_arf'),
          fetchAndSet('submission_cphm', mapSubmissionCphmFromDb, setSubmissionCphmRecords, 'smks_submission_cphm'),
          fetchAndSet('paten', mapPatenFromDb, setPatenRecords, 'smks_paten'),
          fetchAndSet('hki', mapHkiFromDb, setHkiRecords, 'smks_hki'),
          fetchAndSet('prapendidikan_komkordik', mapPrapendidikanKomkordikFromDb, setPrapendidikanKomkordikRecords, 'smks_prapendidikan_komkordik'),
          fetchAndSet('orientasi_ksm', mapOrientasiKsmFromDb, setOrientasiKsmRecords, 'smks_orientasi_ksm'),
          fetchAndSet('pendapatan_pendidikan', mapPendapatanPendidikanFromDb, setPendapatanPendidikanRecords, 'smks_pendapatan_pendidikan'),
          fetchAndSet('pajanan_peserta', mapPajananPesertaFromDb, setPajananPesertaRecords, 'smks_pajanan_peserta'),
          fetchAndSet('program_fellowship', mapProgramFellowshipFromDb, setProgramFellowshipRecords, 'smks_program_fellowship'),
        ]);
      } catch (err) {
        console.error("Gagal sinkron data startup", err);
      }
    };
    
    loadAllDataFromApi();
  }, []);

  const generateId = (prefix: string) => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `${prefix}_${crypto.randomUUID()}`;
    }
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
  };

  // CRUD Operations
  const addPrapendidikanKomkordikRecord = (rec: Omit<PrapendidikanKomkordikRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('prakom') };
    setPrapendidikanKomkordikRecords(prev => [newRecord, ...prev]);
    apiSave('prapendidikan_komkordik', 'POST', mapPrapendidikanKomkordikToDb(newRecord));
  };
  const updatePrapendidikanKomkordikRecord = (rec: PrapendidikanKomkordikRecord) => {
    setPrapendidikanKomkordikRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('prapendidikan_komkordik', 'PUT', mapPrapendidikanKomkordikToDb(rec), rec.id);
  };
  const deletePrapendidikanKomkordikRecord = (id: string) => {
    setPrapendidikanKomkordikRecords(prev => prev.filter(r => r.id !== id));
    apiSave('prapendidikan_komkordik', 'DELETE', undefined, id);
  };

  const addOrientasiKsmRecord = (rec: Omit<OrientasiKsmRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('ksm') };
    setOrientasiKsmRecords(prev => [newRecord, ...prev]);
    apiSave('orientasi_ksm', 'POST', mapOrientasiKsmToDb(newRecord));
  };
  const updateOrientasiKsmRecord = (rec: OrientasiKsmRecord) => {
    setOrientasiKsmRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('orientasi_ksm', 'PUT', mapOrientasiKsmToDb(rec), rec.id);
  };
  const deleteOrientasiKsmRecord = (id: string) => {
    setOrientasiKsmRecords(prev => prev.filter(r => r.id !== id));
    apiSave('orientasi_ksm', 'DELETE', undefined, id);
  };

  const addPendapatanPendidikanRecord = (rec: Omit<PendapatanPendidikanRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('pendapat') };
    setPendapatanPendidikanRecords(prev => [newRecord, ...prev]);
    apiSave('pendapatan_pendidikan', 'POST', mapPendapatanPendidikanToDb(newRecord));
  };
  const updatePendapatanPendidikanRecord = (rec: PendapatanPendidikanRecord) => {
    setPendapatanPendidikanRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('pendapatan_pendidikan', 'PUT', mapPendapatanPendidikanToDb(rec), rec.id);
  };
  const deletePendapatanPendidikanRecord = (id: string) => {
    setPendapatanPendidikanRecords(prev => prev.filter(r => r.id !== id));
    apiSave('pendapatan_pendidikan', 'DELETE', undefined, id);
  };

  const addPajananPesertaRecord = (rec: Omit<PajananPesertaRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('pajanan') };
    setPajananPesertaRecords(prev => [newRecord, ...prev]);
    apiSave('pajanan_peserta', 'POST', mapPajananPesertaToDb(newRecord));
  };
  const updatePajananPesertaRecord = (rec: PajananPesertaRecord) => {
    setPajananPesertaRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('pajanan_peserta', 'PUT', mapPajananPesertaToDb(rec), rec.id);
  };
  const deletePajananPesertaRecord = (id: string) => {
    setPajananPesertaRecords(prev => prev.filter(r => r.id !== id));
    apiSave('pajanan_peserta', 'DELETE', undefined, id);
  };

  const addProgramFellowshipRecord = (rec: Omit<ProgramFellowshipRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('fel') };
    setProgramFellowshipRecords(prev => [newRecord, ...prev]);
    apiSave('program_fellowship', 'POST', mapProgramFellowshipToDb(newRecord));
  };
  const updateProgramFellowshipRecord = (rec: ProgramFellowshipRecord) => {
    setProgramFellowshipRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('program_fellowship', 'PUT', mapProgramFellowshipToDb(rec), rec.id);
  };
  const deleteProgramFellowshipRecord = (id: string) => {
    setProgramFellowshipRecords(prev => prev.filter(r => r.id !== id));
    apiSave('program_fellowship', 'DELETE', undefined, id);
  };

  const addPraPendidikanRecord = (rec: Omit<PraPendidikanRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('pra') };
    setPraPendidikanRecords(prev => [newRecord, ...prev]);
    apiSave('pra_pendidikan', 'POST', mapPraPendidikanToDb(newRecord));
  };
  const updatePraPendidikanRecord = (rec: PraPendidikanRecord) => {
    setPraPendidikanRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('pra_pendidikan', 'PUT', mapPraPendidikanToDb(rec), rec.id);
  };
  const deletePraPendidikanRecord = (id: string) => {
    setPraPendidikanRecords(prev => prev.filter(r => r.id !== id));
    apiSave('pra_pendidikan', 'DELETE', undefined, id);
  };

  const addIpeRecord = (rec: Omit<IpeRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('ipe') };
    setIpeRecords(prev => [newRecord, ...prev]);
    apiSave('ipe', 'POST', mapIpeToDb(newRecord));
  };
  const updateIpeRecord = (rec: IpeRecord) => {
    setIpeRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('ipe', 'PUT', mapIpeToDb(rec), rec.id);
  };
  const deleteIpeRecord = (id: string) => {
    setIpeRecords(prev => prev.filter(r => r.id !== id));
    apiSave('ipe', 'DELETE', undefined, id);
  };

  const addModulIpeRecord = (rec: Omit<ModulIpeRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('mod') };
    setModulIpeRecords(prev => [newRecord, ...prev]);
    apiSave('modul_ipe', 'POST', mapModulIpeToDb(newRecord));
  };
  const updateModulIpeRecord = (rec: ModulIpeRecord) => {
    setModulIpeRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('modul_ipe', 'PUT', mapModulIpeToDb(rec), rec.id);
  };
  const deleteModulIpeRecord = (id: string) => {
    setModulIpeRecords(prev => prev.filter(r => r.id !== id));
    apiSave('modul_ipe', 'DELETE', undefined, id);
  };

  const addStudentInboundRecord = (rec: Omit<StudentInboundRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('stu') };
    setStudentInboundRecords(prev => [newRecord, ...prev]);
    apiSave('student_inbound', 'POST', mapStudentInboundToDb(newRecord));
  };
  const updateStudentInboundRecord = (rec: StudentInboundRecord) => {
    setStudentInboundRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('student_inbound', 'PUT', mapStudentInboundToDb(rec), rec.id);
  };
  const deleteStudentInboundRecord = (id: string) => {
    setStudentInboundRecords(prev => prev.filter(r => r.id !== id));
    apiSave('student_inbound', 'DELETE', undefined, id);
  };

  const addKunjunganRecord = (rec: Omit<KunjunganRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('kun') };
    setKunjunganRecords(prev => [newRecord, ...prev]);
    apiSave('kunjungan', 'POST', mapKunjunganToDb(newRecord));
  };
  const updateKunjunganRecord = (rec: KunjunganRecord) => {
    setKunjunganRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('kunjungan', 'PUT', mapKunjunganToDb(rec), rec.id);
  };
  const deleteKunjunganRecord = (id: string) => {
    setKunjunganRecords(prev => prev.filter(r => r.id !== id));
    apiSave('kunjungan', 'DELETE', undefined, id);
  };

  const addMouRecord = (rec: Omit<MouRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('mou') };
    setMouRecords(prev => [newRecord, ...prev]);
    apiSave('mou', 'POST', mapMouToDb(newRecord));
  };
  const updateMouRecord = (rec: MouRecord) => {
    setMouRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('mou', 'PUT', mapMouToDb(rec), rec.id);
  };
  const deleteMouRecord = (id: string) => {
    setMouRecords(prev => prev.filter(r => r.id !== id));
    apiSave('mou', 'DELETE', undefined, id);
  };

  const addAkselerasiRecord = (rec: Omit<AkselerasiRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('aks') };
    setAkselerasiRecords(prev => [newRecord, ...prev]);
    apiSave('akselerasi', 'POST', mapAkselerasiToDb(newRecord));
  };
  const updateAkselerasiRecord = (rec: AkselerasiRecord) => {
    setAkselerasiRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('akselerasi', 'PUT', mapAkselerasiToDb(rec), rec.id);
  };
  const deleteAkselerasiRecord = (id: string) => {
    setAkselerasiRecords(prev => prev.filter(r => r.id !== id));
    apiSave('akselerasi', 'DELETE', undefined, id);
  };

  const addPelatihanRecord = (rec: Omit<PelatihanRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('pel') };
    setPelatihanRecords(prev => [newRecord, ...prev]);
    apiSave('pelatihan', 'POST', mapPelatihanToDb(newRecord));
  };
  const updatePelatihanRecord = (rec: PelatihanRecord) => {
    setPelatihanRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('pelatihan', 'PUT', mapPelatihanToDb(rec), rec.id);
  };
  const deletePelatihanRecord = (id: string) => {
    setPelatihanRecords(prev => prev.filter(r => r.id !== id));
    apiSave('pelatihan', 'DELETE', undefined, id);
  };

  // Pelatihan Sub-menus Actions
  const addPelatihanUnggulan = (rec: Omit<PelatihanUnggulanRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('pu') };
    setPelatihanUnggulanRecords(prev => [newRecord, ...prev]);
    apiSave('pelatihan_unggulan', 'POST', mapPelatihanUnggulanToDb(newRecord));
  };
  const updatePelatihanUnggulan = (rec: PelatihanUnggulanRecord) => {
    setPelatihanUnggulanRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('pelatihan_unggulan', 'PUT', mapPelatihanUnggulanToDb(rec), rec.id);
  };
  const deletePelatihanUnggulan = (id: string) => {
    setPelatihanUnggulanRecords(prev => prev.filter(r => r.id !== id));
    apiSave('pelatihan_unggulan', 'DELETE', undefined, id);
  };

  const addInhouseTraining = (rec: Omit<InhouseTrainingRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('it') };
    setInhouseTrainingRecords(prev => [newRecord, ...prev]);
    apiSave('inhouse_training', 'POST', mapInhouseTrainingToDb(newRecord));
  };
  const updateInhouseTraining = (rec: InhouseTrainingRecord) => {
    setInhouseTrainingRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('inhouse_training', 'PUT', mapInhouseTrainingToDb(rec), rec.id);
  };
  const deleteInhouseTraining = (id: string) => {
    setInhouseTrainingRecords(prev => prev.filter(r => r.id !== id));
    apiSave('inhouse_training', 'DELETE', undefined, id);
  };

  const addMonitoringJam = (rec: Omit<MonitoringJamRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('mon') };
    setMonitoringJamRecords(prev => [newRecord, ...prev]);
    apiSave('monitoring_jam', 'POST', mapMonitoringJamToDb(newRecord));
  };
  const updateMonitoringJam = (rec: MonitoringJamRecord) => {
    setMonitoringJamRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('monitoring_jam', 'PUT', mapMonitoringJamToDb(rec), rec.id);
  };
  const deleteMonitoringJam = (id: string) => {
    setMonitoringJamRecords(prev => prev.filter(r => r.id !== id));
    apiSave('monitoring_jam', 'DELETE', undefined, id);
  };

  const addKerjasamaSkp = (rec: Omit<KerjasamaSkpRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('ks') };
    setKerjasamaSkpRecords(prev => [newRecord, ...prev]);
    apiSave('kegiatan_kerjasama_skp', 'POST', mapKerjasamaSkpToDb(newRecord));
  };
  const updateKerjasamaSkp = (rec: KerjasamaSkpRecord) => {
    setKerjasamaSkpRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('kegiatan_kerjasama_skp', 'PUT', mapKerjasamaSkpToDb(rec), rec.id);
  };
  const deleteKerjasamaSkp = (id: string) => {
    setKerjasamaSkpRecords(prev => prev.filter(r => r.id !== id));
    apiSave('kegiatan_kerjasama_skp', 'DELETE', undefined, id);
  };

  const addStudiBanding = (rec: Omit<StudiBandingRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('sb') };
    setStudiBandingRecords(prev => [newRecord, ...prev]);
    apiSave('studi_banding', 'POST', mapStudiBandingToDb(newRecord));
  };
  const updateStudiBanding = (rec: StudiBandingRecord) => {
    setStudiBandingRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('studi_banding', 'PUT', mapStudiBandingToDb(rec), rec.id);
  };
  const deleteStudiBanding = (id: string) => {
    setStudiBandingRecords(prev => prev.filter(r => r.id !== id));
    apiSave('studi_banding', 'DELETE', undefined, id);
  };

  const addDokterObserver = (rec: Omit<DokterObserverRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('do') };
    setDokterObserverRecords(prev => [newRecord, ...prev]);
    apiSave('dokter_observer', 'POST', mapDokterObserverToDb(newRecord));
  };
  const updateDokterObserver = (rec: DokterObserverRecord) => {
    setDokterObserverRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('dokter_observer', 'PUT', mapDokterObserverToDb(rec), rec.id);
  };
  const deleteDokterObserver = (id: string) => {
    setDokterObserverRecords(prev => prev.filter(r => r.id !== id));
    apiSave('dokter_observer', 'DELETE', undefined, id);
  };

  const addMagang = (rec: Omit<MagangRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('mg') };
    setMagangRecords(prev => [newRecord, ...prev]);
    apiSave('magang', 'POST', mapMagangToDb(newRecord));
  };
  const updateMagang = (rec: MagangRecord) => {
    setMagangRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('magang', 'PUT', mapMagangToDb(rec), rec.id);
  };
  const deleteMagang = (id: string) => {
    setMagangRecords(prev => prev.filter(r => r.id !== id));
    apiSave('magang', 'DELETE', undefined, id);
  };

  const addStandarKemenkes = (rec: Omit<StandarKemenkesRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('stk') };
    setStandarKemenkesRecords(prev => [newRecord, ...prev]);
    apiSave('kurikulum_kemenkes', 'POST', mapStandarKemenkesToDb(newRecord));
  };
  const updateStandarKemenkes = (rec: StandarKemenkesRecord) => {
    setStandarKemenkesRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('kurikulum_kemenkes', 'PUT', mapStandarKemenkesToDb(rec), rec.id);
  };
  const deleteStandarKemenkes = (id: string) => {
    setStandarKemenkesRecords(prev => prev.filter(r => r.id !== id));
    apiSave('kurikulum_kemenkes', 'DELETE', undefined, id);
  };

  const addPelatihanInternasional = (rec: Omit<PelatihanInternasionalRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('pint') };
    setPelatihanInternasionalRecords(prev => [newRecord, ...prev]);
    apiSave('kegiatan_internasional', 'POST', mapPelatihanInternasionalToDb(newRecord));
  };
  const updatePelatihanInternasional = (rec: PelatihanInternasionalRecord) => {
    setPelatihanInternasionalRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('kegiatan_internasional', 'PUT', mapPelatihanInternasionalToDb(rec), rec.id);
  };
  const deletePelatihanInternasional = (id: string) => {
    setPelatihanInternasionalRecords(prev => prev.filter(r => r.id !== id));
    apiSave('kegiatan_internasional', 'DELETE', undefined, id);
  };

  const addTrainerSertifikasi = (rec: Omit<TrainerSertifikasiRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('tsert') };
    setTrainerSertifikasiRecords(prev => [newRecord, ...prev]);
    apiSave('trainer_sertifikasi', 'POST', mapTrainerSertifikasiToDb(newRecord));
  };
  const updateTrainerSertifikasi = (rec: TrainerSertifikasiRecord) => {
    setTrainerSertifikasiRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('trainer_sertifikasi', 'PUT', mapTrainerSertifikasiToDb(rec), rec.id);
  };
  const deleteTrainerSertifikasi = (id: string) => {
    setTrainerSertifikasiRecords(prev => prev.filter(r => r.id !== id));
    apiSave('trainer_sertifikasi', 'DELETE', undefined, id);
  };

  const addPelatihanMandiri = (rec: Omit<PelatihanMandiriRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('pmand') };
    setPelatihanMandiriRecords(prev => [newRecord, ...prev]);
    apiSave('kegiatan_mandiri_skp', 'POST', mapPelatihanMandiriToDb(newRecord));
  };
  const updatePelatihanMandiri = (rec: PelatihanMandiriRecord) => {
    setPelatihanMandiriRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('kegiatan_mandiri_skp', 'PUT', mapPelatihanMandiriToDb(rec), rec.id);
  };
  const deletePelatihanMandiri = (id: string) => {
    setPelatihanMandiriRecords(prev => prev.filter(r => r.id !== id));
    apiSave('kegiatan_mandiri_skp', 'DELETE', undefined, id);
  };

  const addPendapatanPenelitian = (rec: Omit<PendapatanPenelitianRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('ppend') };
    setPendapatanPenelitianRecords(prev => [newRecord, ...prev]);
    apiSave('pendapatan_penelitian', 'POST', mapPendapatanPenelitianToDb(newRecord));
  };
  const updatePendapatanPenelitian = (rec: PendapatanPenelitianRecord) => {
    setPendapatanPenelitianRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('pendapatan_penelitian', 'PUT', mapPendapatanPenelitianToDb(rec), rec.id);
  };
  const deletePendapatanPenelitian = (id: string) => {
    setPendapatanPenelitianRecords(prev => prev.filter(r => r.id !== id));
    apiSave('pendapatan_penelitian', 'DELETE', undefined, id);
  };

  const addUjiEtik = (rec: Omit<UjiEtikRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('etik') };
    setUjiEtikRecords(prev => [newRecord, ...prev]);
    apiSave('uji_etik', 'POST', mapUjiEtikToDb(newRecord));
  };
  const updateUjiEtik = (rec: UjiEtikRecord) => {
    setUjiEtikRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('uji_etik', 'PUT', mapUjiEtikToDb(rec), rec.id);
  };
  const deleteUjiEtik = (id: string) => {
    setUjiEtikRecords(prev => prev.filter(r => r.id !== id));
    apiSave('uji_etik', 'DELETE', undefined, id);
  };

  const addUjiKlinik = (rec: Omit<UjiKlinikRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('uklin') };
    setUjiKlinikRecords(prev => [newRecord, ...prev]);
    apiSave('uji_klinik', 'POST', mapUjiKlinikToDb(newRecord));
  };
  const updateUjiKlinik = (rec: UjiKlinikRecord) => {
    setUjiKlinikRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('uji_klinik', 'PUT', mapUjiKlinikToDb(rec), rec.id);
  };
  const deleteUjiKlinik = (id: string) => {
    setUjiKlinikRecords(prev => prev.filter(r => r.id !== id));
    apiSave('uji_klinik', 'DELETE', undefined, id);
  };

  const addPenelitianPublikasi = (rec: Omit<PenelitianPublikasiRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('ppub') };
    setPenelitianPublikasiRecords(prev => [newRecord, ...prev]);
    apiSave('penelitian_publikasi', 'POST', mapPenelitianPublikasiToDb(newRecord));
  };
  const updatePenelitianPublikasi = (rec: PenelitianPublikasiRecord) => {
    setPenelitianPublikasiRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('penelitian_publikasi', 'PUT', mapPenelitianPublikasiToDb(rec), rec.id);
  };
  const deletePenelitianPublikasi = (id: string) => {
    setPenelitianPublikasiRecords(prev => prev.filter(r => r.id !== id));
    apiSave('penelitian_publikasi', 'DELETE', undefined, id);
  };

  const addProdukInovasi = (rec: Omit<ProdukInovasiRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('inov') };
    setProdukInovasiRecords(prev => [newRecord, ...prev]);
    apiSave('produk_inovasi', 'POST', mapProdukInovasiToDb(newRecord));
  };
  const updateProdukInovasi = (rec: ProdukInovasiRecord) => {
    setProdukInovasiRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('produk_inovasi', 'PUT', mapProdukInovasiToDb(rec), rec.id);
  };
  const deleteProdukInovasi = (id: string) => {
    setProdukInovasiRecords(prev => prev.filter(r => r.id !== id));
    apiSave('produk_inovasi', 'DELETE', undefined, id);
  };

  const addProdukInovasiTerjual = (rec: Omit<ProdukInovasiTerjualRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('piter') };
    setProdukInovasiTerjualRecords(prev => [newRecord, ...prev]);
    apiSave('produk_inovasi_terjual', 'POST', mapProdukInovasiTerjualToDb(newRecord));
  };
  const updateProdukInovasiTerjual = (rec: ProdukInovasiTerjualRecord) => {
    setProdukInovasiTerjualRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('produk_inovasi_terjual', 'PUT', mapProdukInovasiTerjualToDb(rec), rec.id);
  };
  const deleteProdukInovasiTerjual = (id: string) => {
    setProdukInovasiTerjualRecords(prev => prev.filter(r => r.id !== id));
    apiSave('produk_inovasi_terjual', 'DELETE', undefined, id);
  };

  const addBukuIsbn = (rec: Omit<BukuIsbnRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('bisbn') };
    setBukuIsbnRecords(prev => [newRecord, ...prev]);
    apiSave('buku_isbn', 'POST', mapBukuIsbnToDb(newRecord));
  };
  const updateBukuIsbn = (rec: BukuIsbnRecord) => {
    setBukuIsbnRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('buku_isbn', 'PUT', mapBukuIsbnToDb(rec), rec.id);
  };
  const deleteBukuIsbn = (id: string) => {
    setBukuIsbnRecords(prev => prev.filter(r => r.id !== id));
    apiSave('buku_isbn', 'DELETE', undefined, id);
  };

  const addPengabdianMasyarakat = (rec: Omit<PengabdianMasyarakatRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('abd') };
    setPengabdianMasyarakatRecords(prev => [newRecord, ...prev]);
    apiSave('pengabdian_masyarakat', 'POST', mapPengabdianMasyarakatToDb(newRecord));
  };
  const updatePengabdianMasyarakat = (rec: PengabdianMasyarakatRecord) => {
    setPengabdianMasyarakatRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('pengabdian_masyarakat', 'PUT', mapPengabdianMasyarakatToDb(rec), rec.id);
  };
  const deletePengabdianMasyarakat = (id: string) => {
    setPengabdianMasyarakatRecords(prev => prev.filter(r => r.id !== id));
    apiSave('pengabdian_masyarakat', 'DELETE', undefined, id);
  };

  const addProposalArf = (rec: Omit<ProposalArfRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('parf') };
    setProposalArfRecords(prev => [newRecord, ...prev]);
    apiSave('proposal_arf', 'POST', mapProposalArfToDb(newRecord));
  };
  const updateProposalArf = (rec: ProposalArfRecord) => {
    setProposalArfRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('proposal_arf', 'PUT', mapProposalArfToDb(rec), rec.id);
  };
  const deleteProposalArf = (id: string) => {
    setProposalArfRecords(prev => prev.filter(r => r.id !== id));
    apiSave('proposal_arf', 'DELETE', undefined, id);
  };

  const addSubmissionCphm = (rec: Omit<SubmissionCphmRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('scphm') };
    setSubmissionCphmRecords(prev => [newRecord, ...prev]);
    apiSave('submission_cphm', 'POST', mapSubmissionCphmToDb(newRecord));
  };
  const updateSubmissionCphm = (rec: SubmissionCphmRecord) => {
    setSubmissionCphmRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('submission_cphm', 'PUT', mapSubmissionCphmToDb(rec), rec.id);
  };
  const deleteSubmissionCphm = (id: string) => {
    setSubmissionCphmRecords(prev => prev.filter(r => r.id !== id));
    apiSave('submission_cphm', 'DELETE', undefined, id);
  };

  const addPaten = (rec: Omit<PatenRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('pat') };
    setPatenRecords(prev => [newRecord, ...prev]);
    apiSave('paten', 'POST', mapPatenToDb(newRecord));
  };
  const updatePaten = (rec: PatenRecord) => {
    setPatenRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('paten', 'PUT', mapPatenToDb(rec), rec.id);
  };
  const deletePaten = (id: string) => {
    setPatenRecords(prev => prev.filter(r => r.id !== id));
    apiSave('paten', 'DELETE', undefined, id);
  };

  const addHki = (rec: Omit<HkiRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('hki') };
    setHkiRecords(prev => [newRecord, ...prev]);
    apiSave('hki', 'POST', mapHkiToDb(newRecord));
  };
  const updateHki = (rec: HkiRecord) => {
    setHkiRecords(prev => prev.map(r => r.id === rec.id ? rec : r));
    apiSave('hki', 'PUT', mapHkiToDb(rec), rec.id);
  };
  const deleteHki = (id: string) => {
    setHkiRecords(prev => prev.filter(r => r.id !== id));
    apiSave('hki', 'DELETE', undefined, id);
  };

  const addPenelitianRecord = (rec: Omit<PenelitianRecord, 'id'>) => {
    const newRecord = { ...rec, id: generateId('pen') };
    setPenelitianRecords(prev => [newRecord, ...prev]);
    apiSave('penelitian', 'POST', mapPenelitianToDb(newRecord));
  };
  const deletePenelitianRecord = (id: string) => {
    setPenelitianRecords(prev => prev.filter(r => r.id !== id));
    apiSave('penelitian', 'DELETE', undefined, id);
  };

  const clearAllData = () => {
    setPraPendidikanRecords([]);
    setIpeRecords([]);
    setModulIpeRecords([]);
    setStudentInboundRecords([]);
    setKunjunganRecords([]);
    setMouRecords([]);
    setAkselerasiRecords([]);
    setPelatihanRecords([]);
    setPelatihanUnggulanRecords([]);
    setInhouseTrainingRecords([]);
    setKerjasamaSkpRecords([]);
    setStudiBandingRecords([]);
    setDokterObserverRecords([]);
    setMagangRecords([]);
    setStandarKemenkesRecords([]);
    setPelatihanInternasionalRecords([]);
    setPenelitianRecords([]);
    setPendapatanPenelitianRecords([]);
    setUjiEtikRecords([]);
    setUjiKlinikRecords([]);
    setPenelitianPublikasiRecords([]);
    setProdukInovasiRecords([]);
    setProdukInovasiTerjualRecords([]);
    setBukuIsbnRecords([]);
    setPengabdianMasyarakatRecords([]);
    setProposalArfRecords([]);
    setSubmissionCphmRecords([]);
    setPatenRecords([]);
    setHkiRecords([]);
  };

  const loadSampleData = () => {
    setPraPendidikanRecords([
      { id: 'pra-1', tanggalPelaksanaan: '2026-05-10', institusiPendidikan: 'Universitas Airlangga, Universitas Brawijaya', totalPeserta: 45 },
      { id: 'pra-2', tanggalPelaksanaan: '2026-05-24', institusiPendidikan: 'Univesitas Airlangga, Universitas Indonesia', totalPeserta: 72 }
    ]);
    setIpeRecords([
      { id: 'ipe-1', tema: 'Kolaborasi Interprofessional dalam Penanganan Pasien Sepsis di ICU', pemateri: 'Dr. Retno Sp.PD, dr. Purba Sp.An, Ns. Sukanto M.Kep, Apt. Laili M.Farm, Dr. Hendra M.Sc', moderator: 'dr. Kirana Sp.An, Ns. Wahyu S.Kep', ksm: 'Anestesiologi & Reanimasi', tanggal: '2026-05-15', pesertaUnair: 50, pesertaNonUnair: 35 }
    ]);
    setModulIpeRecords([
      { id: 'mod-1', judulBuku: 'Panduan Asuhan Kolaboratif Kritis Rumah Sakit Pendidikan', penerbit: 'Airlangga University Press', isbn: '978-602-1234-56-7', tanggalTerbit: '2026-02-15' }
    ]);
    setStudentInboundRecords([
      { id: 'stu-1', fakultasPengirim: 'Fakultas Kedokteran', namaStudent: 'John Smith, Sarah Connor', universitas: 'University of Sydney', tanggalMasuk: '2026-04-01', tanggalKeluar: '2026-06-01', ksmTujuan: 'Ilmu Kesehatan Anak, Bedah', pembimbing: 'Prof. dr. Nasron Sp.A, dr. Budi Sp.B' }
    ]);
    setKunjunganRecords([
      { id: 'kun-1', institusiType: 'Non UNAIR', universitas: 'Universitas Indonesia', fakultas: 'Fakultas Farmasi', programStudi: 'Profesi Apoteker', tujuan: 'Benchmark pengelolaan depo farmasi rawat darurat', tanggalPelaksanaan: '2026-05-20', pemateri: 'Apt. Retno M.Farm, Apt. Hasan', jumlahPeserta: 18 }
    ]);
    setMouRecords([
      { id: 'mou-1', namaInstitusi: 'RSUD Dr. Soetomo Surabaya', jenis: 'Nasional', tahun: '2026', masaBerlaku: '5 Tahun' },
      { id: 'mou-2', namaInstitusi: 'Nagasaki University Medical School', jenis: 'Internasional', tahun: '2025', masaBerlaku: '3 Tahun' }
    ]);
    setAkselerasiRecords([
      { id: 'aks-1', kategori: 'PROFESI DOKTER (DM) NAIK MENJADI 50%', ksm: 'KSM Ilmu Penyakit Dalam', jan: 20, feb: 22, mar: 25, apr: 28, mei: 30, jun: 35, jul: 32, agt: 36, sep: 40, okt: 42, nov: 45, des: 48 },
      { id: 'aks-2', kategori: 'PROGRAM PENDIDIKAN DOKTER SPESIALIS (PPDS 1) NAIK MENJADI 50%', ksm: 'KSM Anastesiologi dan Reanimasi', jan: 10, feb: 11, mar: 12, apr: 14, mei: 15, jun: 16, jul: 15, agt: 18, sep: 19, okt: 20, nov: 22, des: 24 }
    ]);
    setPelatihanRecords([
      { id: 'l1', namaPelatihan: 'Life Support Dasar Medis', kategori: 'Medis', jumlahPeserta: 120, totalJam: 40, sertifikasiBaru: 45, anggaranRealisasi: 45000000, tanggal: '2026-01' },
      { id: 'l2', namaPelatihan: 'Service Excellence RSUA', kategori: 'Non-Medis', jumlahPeserta: 80, totalJam: 16, sertifikasiBaru: 10, anggaranRealisasi: 12000000, tanggal: '2026-02' }
    ]);
    setPenelitianRecords([
      { id: 'n1', judul: 'Analisis Genom Virus Tropis Universitas Airlangga', penelitiUtama: 'Prof. dr. Nasron', status: 'Berjalan Penuh', publikasiScopus: true, patenTerdaftar: true, danaHibah: 7500000000, tanggalMulai: '2026-01' }
    ]);
    setPendapatanPenelitianRecords([
      { id: 'pp-1', bulan: 'Januari', pendapatanEtik: 15000000, pendapatanLabRiset: 25000000, pendapatanInovasi: 5000000, pendapatanUjiKlinik: 10000000, totalPendapatan: 55000000 },
      { id: 'pp-2', bulan: 'Februari', pendapatanEtik: 18000000, pendapatanLabRiset: 30000000, pendapatanInovasi: 8000000, pendapatanUjiKlinik: 15000000, totalPendapatan: 71000000 }
    ]);
    setUjiEtikRecords([
      {
        id: 'ue-1',
        tanggalSuratMasuk: '2026-05-01',
        nomorSuratMasuk: '001/UN3.1.2/KEPK/2026',
        namaPeneliti: 'Dr. Sarah Wijaya',
        nimNrpNip: '198705122015042001',
        cp: '08123456789',
        institusi: 'FK UNAIR',
        pendidikan: 'S3',
        jenisKegiatan: 'PENELITIAN INSTITUSI',
        judulPenelitian: 'Efektivitas Terapi Stem Cell pada Pasien Stroke',
        jumlahSampelPenelitian: 50,
        pengambilanData: 'Laboratorium Stem Cell RSUA',
        pembimbingKlinis: 'Prof. dr. Soetojo',
        reviewAwal: 'WAKIL I',
        hasilReview: 'EXPEDITED MINOR',
        catatanReviewer: 'Perlu melampirkan informed consent yang diperbaiki',
        tanggalSeminarEtik: '2026-05-10',
        tanggalSertifikatEtik: '2026-05-15',
        monev: 'SUDAH',
        laporan: 'BERJALAN',
        pembayaranNominal: 500000,
        pembayaranStatus: 'Lunas'
      }
    ]);
    setUjiKlinikRecords([
      {
        id: 'uk-1',
        tahun: '2026',
        judulPenelitian: 'Uji Klinik Fase II Vaksin Merah Putih',
        mitraKerjasama: 'PT Biotis Pharmaceutical Indonesia',
        timPenelitiFile: 'sk_tim_peneliti_vaksin.pdf',
        timPenelitiFileName: 'SK Tim Vaksin.pdf',
        timPenelitiFileDriveUrl: 'https://drive.google.com/open?id=mock_sk_tim',
        ctaFile: 'cta_vaksin_rsua.pdf',
        ctaFileName: 'CTA Vaksin RSUAPT Biotis.pdf',
        ctaFileDriveUrl: 'https://drive.google.com/open?id=mock_cta',
        danaRabPenelitian: 2500000000,
        status: 'RUNNING'
      }
    ]);
    setPenelitianPublikasiRecords([
      {
        id: 'pub-1',
        namaAutor: 'Dr. Ahmad Fauzi',
        afiliasi: 'KSM Ilmu Penyakit Dalam',
        judulArtikelIlmiah: 'Deep Learning for Medical Diagnosis in COVID-19 Patients',
        namaJurnalTerbit: 'Journal of Infection and Public Health',
        jenisPublikasi: 'Internasional',
        ranking: 'Q1',
        tanggalPublikasi: '2026-03-12',
        doiSitusWeb: 'https://doi.org/10.1016/j.jiph.2026.03.001'
      }
    ]);
    setProdukInovasiRecords([
      {
        id: 'pi-1',
        tahun: '2026',
        namaProduk: 'Aplikasi SMKS RSUA',
        judulRisetInovasi: 'Sistem Informasi Monitoring Kinerja Staf berbasis Web',
        mitraKerjasama: 'DTI UNAIR',
        sponsor: 'Hibah Inovasi UNAIR',
        pic: 'dr. Purba Sp.An',
        fotoProduk: 'smks_dashboard.png',
        fotoProdukName: 'Dashboard SMKS.png',
        fotoProdukDriveUrl: 'https://drive.google.com/open?id=mock_foto_produk',
        deskripsiSingkat: 'Aplikasi dashboard real-time terintegrasi untuk input dan monitoring data SKP Pendidikan, Pelatihan, serta Penelitian.'
      }
    ]);
    setProdukInovasiTerjualRecords([
      { id: 'pit-1', tanggal: '2026-05-28', namaPasien: 'Anis Baswedan', namaProduk: 'Suplemen RSUA-Immun', jumlahPesananProduk: 5 }
    ]);
    setBukuIsbnRecords([
      {
        id: 'bi-1',
        tanggalTerbit: '2026-05-10',
        namaPenulis: 'Prof. Sudirman',
        afiliasi: 'KSM Anestesiologi',
        judulBuku: 'Manajemen Resusitasi Cairan Modern',
        nomorIsbn: '978-602-1234-56-7',
        namaPubliser: 'Airlangga University Press',
        linkPublikasiEbook: 'https://ebook.uap.unair.ac.id/resusitasi',
        buktiBukuCetak: 'bukti_cetak_resusitasi.pdf',
        buktiBukuCetakName: 'Bukti Buku Cairan.pdf',
        buktiBukuCetakDriveUrl: 'https://drive.google.com/open?id=mock_bukti_buku'
      }
    ]);
    setPengabdianMasyarakatRecords([
      { id: 'pm-1', nama: 'Tim Pengabdian RSUA', ksmDepartemen: 'KSM Bedah', judul: 'Penyuluhan Kesehatan di Desa Binaan', skema: 'Hibah Internal', tahun: '2026' }
    ]);
    setProposalArfRecords([
      { id: 'parf-1', ketuaPeneliti: 'Prof. Dr. Ni Nyoman Tri Puspaningsih', unitKerja: 'Lembaga Penyakit Tropis RSUA', anggotaPeneliti: 'dr. Sarah, dr. Fauzi', judulPenelitian: 'Biomarker Diagnostik Demam Berdarah Dengue', skema: 'ARF-A', targetLuaran: 'Publikasi Jurnal Internasional Indeks Scopus Q1', danaHibahDiperoleh: 150000000 }
    ]);
    setSubmissionCphmRecords([
      { id: 'sc-1', tanggal: '2026-05-20', judulArtikel: 'Analysis of Hospital Waste Management in East Java', author: 'Dr. Retno', afiliasi: 'Lembaga Mutu RSUA', fileArtikel: 'art_waste_mgmt.pdf', fileArtikelName: 'Artikel Waste.pdf', fileArtikelDriveUrl: 'https://drive.google.com/open?id=mock_cphm' }
    ]);
    setPatenRecords([
      {
        id: 'pat-1',
        tanggalTerbit: '2026-04-15',
        namaAutor: 'Prof. dr. Nasron',
        afiliasi: 'KSM Pediatric',
        judulPaten: 'Alat Deteksi Cepat Tuberkulosis Anak Berbasis Bio-sensor',
        nomorPaten: 'IDS000012345',
        buktiSertifikatPaten: 'sertifikat_paten_tb_anak.pdf',
        buktiSertifikatPatenName: 'Paten BioSensor TB.pdf',
        buktiSertifikatPatenDriveUrl: 'https://drive.google.com/open?id=mock_paten'
      }
    ]);
    setHkiRecords([
      {
        id: 'hki-1',
        tanggalTerbit: '2026-05-18',
        namaAutor: 'Apt. Laili M.Farm',
        afiliasi: 'Instalasi Farmasi',
        judulHki: 'Leaflet Panduan Efek Samping Obat Pasien rawat Jalan',
        nomorHki: 'EC00202600234',
        buktiSertifikatHki: 'hki_leaflet_obat.pdf',
        buktiSertifikatHkiName: 'Leaflet HKI.pdf',
        buktiSertifikatHkiDriveUrl: 'https://drive.google.com/open?id=mock_hki'
      }
    ]);
  };

  const formatRupiahAbbreviation = (value: number) => {
    if (value >= 1_000_000_000) {
      return `Rp ${(value / 1_000_000_000).toFixed(1)}M`;
    } else if (value >= 1_000_000) {
      return `Rp ${(value / 1_000_000).toFixed(1)}Jt`;
    }
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  // Aggregates
  const totalOrientasiPeserta = praPendidikanRecords.reduce((sum, r) => sum + r.totalPeserta, 0);
  const totalIpePeserta = ipeRecords.reduce((sum, r) => sum + r.pesertaUnair + r.pesertaNonUnair, 0);
  const totalModul = modulIpeRecords.length;
  const totalStudentInbound = studentInboundRecords.length;
  const totalKunjungan = kunjunganRecords.length;
  const totalMou = mouRecords.length;
  
  // To get the newest sum of all Akselerasi kids
  const totalAkselerasiPeserta = akselerasiRecords.reduce((sum, r) => {
    // Current month is May (index 5 of 2026, let's take average or latest input dec)
    return sum + r.des;
  }, 0);

  // Pelatihan totals
  const totalTrained = pelatihanRecords.reduce((sum, r) => sum + r.jumlahPeserta, 0);
  const avgHours = pelatihanRecords.length > 0
    ? Math.round(pelatihanRecords.reduce((sum, r) => sum + r.totalJam, 0) / pelatihanRecords.length)
    : 0;
  const certifiedStaff = pelatihanRecords.reduce((sum, r) => sum + r.sertifikasiBaru, 0);
  const totalRealisasiAnggaran = pelatihanRecords.reduce((sum, r) => sum + r.anggaranRealisasi, 0);
  const budgetUtilization = Math.min(100, Math.round((totalRealisasiAnggaran / 150_000_000) * 100));

  // Penelitian totals
  const activeResearches = penelitianRecords.filter(r => r.status !== 'Selesai').length;
  const publicationsCount = penelitianRecords.filter(r => r.publikasiScopus).length;
  const patentsCount = penelitianRecords.filter(r => r.patenTerdaftar).length;
  const totalGrants = penelitianRecords.reduce((sum, r) => sum + r.danaHibah, 0);

  const dashboardStats = {
    pendidikan: {
      totalOrientasiPeserta,
      totalIpePeserta,
      totalModul,
      totalStudentInbound,
      totalKunjungan,
      totalMou,
      totalAkselerasiPeserta
    },
    pelatihan: {
      totalTrained,
      avgHours,
      certifiedStaff,
      budgetUtilization
    },
    penelitian: {
      activeResearches,
      publications: publicationsCount,
      grants: formatRupiahAbbreviation(totalGrants),
      rawGrants: totalGrants,
      patents: patentsCount
    }
  };

  const getPelatihanChartData = () => {
    const timeframes = ['01', '02', '03', '04'];
    const names = ['Kuartal 1', 'Kuartal 2', 'Kuartal 3', 'Kuartal 4'];
    return timeframes.map((tf, idx) => {
      const medis = pelatihanRecords
        .filter(r => r.kategori === 'Medis' && r.tanggal.endsWith(tf))
        .reduce((sum, r) => sum + r.jumlahPeserta, 0);
      const nonMedis = pelatihanRecords
        .filter(r => r.kategori === 'Non-Medis' && r.tanggal.endsWith(tf))
        .reduce((sum, r) => sum + r.jumlahPeserta, 0);
      return {
        name: names[idx],
        medis: medis || 0,
        nonMedis: nonMedis || 0
      };
    });
  };

  const getPenelitianChartData = () => {
    const timeframes = ['01', '02', '03', '04'];
    const names = ['Triwulan I', 'Triwulan II', 'Triwulan III', 'Triwulan IV'];
    return timeframes.map((tf, idx) => {
      const pubs = penelitianRecords.filter(r => r.publikasiScopus && r.tanggalMulai.endsWith(tf)).length;
      const patens = penelitianRecords.filter(r => r.patenTerdaftar && r.tanggalMulai.endsWith(tf)).length;
      return {
        name: names[idx],
        publikasi: pubs || 0,
        paten: patens || 0
      };
    });
  };

  return (
    <SMKSContext.Provider value={{
      praPendidikanRecords,
      ipeRecords,
      modulIpeRecords,
      studentInboundRecords,
      kunjunganRecords,
      mouRecords,
      akselerasiRecords,
      programFellowshipRecords,
      pelatihanRecords,
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
      pendapatanPenelitianRecords,
      ujiEtikRecords,
      ujiKlinikRecords,
      penelitianPublikasiRecords,
      produkInovasiRecords,
      produkInovasiTerjualRecords,
      bukuIsbnRecords,
      pengabdianMasyarakatRecords,
      proposalArfRecords,
      submissionCphmRecords,
      patenRecords,
      hkiRecords,
      penelitianRecords,

      prapendidikanKomkordikRecords,
      addPrapendidikanKomkordikRecord,
      updatePrapendidikanKomkordikRecord,
      deletePrapendidikanKomkordikRecord,

      orientasiKsmRecords,
      addOrientasiKsmRecord,
      updateOrientasiKsmRecord,
      deleteOrientasiKsmRecord,

      pendapatanPendidikanRecords,
      addPendapatanPendidikanRecord,
      updatePendapatanPendidikanRecord,
      deletePendapatanPendidikanRecord,

      pajananPesertaRecords,
      addPajananPesertaRecord,
      updatePajananPesertaRecord,
      deletePajananPesertaRecord,

      addProgramFellowshipRecord,
      updateProgramFellowshipRecord,
      deleteProgramFellowshipRecord,

      addPraPendidikanRecord,
      updatePraPendidikanRecord,
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

      addPelatihanRecord,
      deletePelatihanRecord,
      addPelatihanUnggulan,
      updatePelatihanUnggulan,
      deletePelatihanUnggulan,
      addInhouseTraining,
      updateInhouseTraining,
      deleteInhouseTraining,
      addMonitoringJam,
      updateMonitoringJam,
      deleteMonitoringJam,
      addKerjasamaSkp,
      updateKerjasamaSkp,
      deleteKerjasamaSkp,
      addStudiBanding,
      updateStudiBanding,
      deleteStudiBanding,
      addDokterObserver,
      updateDokterObserver,
      deleteDokterObserver,
      addMagang,
      updateMagang,
      deleteMagang,
      addStandarKemenkes,
      updateStandarKemenkes,
      deleteStandarKemenkes,
      addPelatihanInternasional,
      updatePelatihanInternasional,
      deletePelatihanInternasional,
      addTrainerSertifikasi,
      updateTrainerSertifikasi,
      deleteTrainerSertifikasi,
      addPelatihanMandiri,
      updatePelatihanMandiri,
      deletePelatihanMandiri,

      addPendapatanPenelitian,
      updatePendapatanPenelitian,
      deletePendapatanPenelitian,
      addUjiEtik,
      updateUjiEtik,
      deleteUjiEtik,
      addUjiKlinik,
      updateUjiKlinik,
      deleteUjiKlinik,
      addPenelitianPublikasi,
      updatePenelitianPublikasi,
      deletePenelitianPublikasi,
      addProdukInovasi,
      updateProdukInovasi,
      deleteProdukInovasi,
      addProdukInovasiTerjual,
      updateProdukInovasiTerjual,
      deleteProdukInovasiTerjual,
      addBukuIsbn,
      updateBukuIsbn,
      deleteBukuIsbn,
      addPengabdianMasyarakat,
      updatePengabdianMasyarakat,
      deletePengabdianMasyarakat,
      addProposalArf,
      updateProposalArf,
      deleteProposalArf,
      addSubmissionCphm,
      updateSubmissionCphm,
      deleteSubmissionCphm,
      addPaten,
      updatePaten,
      deletePaten,
      addHki,
      updateHki,
      deleteHki,

      addPenelitianRecord,
      deletePenelitianRecord,

      clearAllData,
      loadSampleData,
      dashboardStats,

      pelatihanChart: getPelatihanChartData(),
      penelitianChart: getPenelitianChartData()
    }}>
      {children}
    </SMKSContext.Provider>
  );
};

export const useSMKS = () => {
  const context = useContext(SMKSContext);
  if (context === undefined) {
    throw new Error('useSMKS must be used within a SMKSProvider');
  }
  return context;
};
