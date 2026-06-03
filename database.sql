-- Database Schema for SMKS Application
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100),
    role VARCHAR(50),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Unit KSM Table
CREATE TABLE IF NOT EXISTS unit_ksm (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Default Admin (Password: admin)
-- Adjust password hash if necessary for the current dummy mechanism
INSERT IGNORE INTO users (username, password_hash, nama_lengkap, role, email) VALUES 
('admin', '$2y$10$xK9PqfM4vR1mXUoZ6/B0guP5j4Dk8iG24o936jDscW3p9VvFv6Bvq', 'Administrator', 'System Developer', 'admin@rsua.unair.ac.id');

-- Pendidikan Tables
CREATE TABLE IF NOT EXISTS prapendidikan_komkordik (
    id VARCHAR(50) PRIMARY KEY,
    tanggal_pelaksanaan DATE,
    institusi_pendidikan VARCHAR(255),
    total_peserta INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orientasi_ksm (
    id VARCHAR(50) PRIMARY KEY,
    tanggal_pelaksanaan DATE,
    institusi_pendidikan VARCHAR(255),
    total_peserta INT DEFAULT 0,
    bukti_foto1 TEXT,
    bukti_foto1_name VARCHAR(255),
    bukti_foto2 TEXT,
    bukti_foto2_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pendapatan_pendidikan (
    id VARCHAR(50) PRIMARY KEY,
    bulan VARCHAR(20),
    tahun VARCHAR(4),
    institusi_name VARCHAR(255),
    institusi_type VARCHAR(50),
    prapendidikan_income DECIMAL(15,2) DEFAULT 0,
    praktik_income DECIMAL(15,2) DEFAULT 0,
    ipe_income DECIMAL(15,2) DEFAULT 0,
    total_income DECIMAL(15,2) DEFAULT 0,
    bukti_pembayaran TEXT,
    bukti_pembayaran_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pajanan_peserta (
    id VARCHAR(50) PRIMARY KEY,
    nama_mahasiswa VARCHAR(255),
    nim VARCHAR(50),
    institusi_type VARCHAR(50),
    fakultas VARCHAR(255),
    program_studi VARCHAR(255),
    jenis_pajanan VARCHAR(255),
    tanggal_kejadian DATE,
    lokasi_kejadian VARCHAR(255),
    deskripsi_kejadian TEXT,
    tindak_lanjut TEXT,
    file_laporan TEXT,
    tanggal_laporan DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pra_pendidikan (
    id VARCHAR(50) PRIMARY KEY,
    tanggal_pelaksanaan DATE,
    institusi_pendidikan VARCHAR(255),
    total_peserta INT DEFAULT 0,
    institusi_type VARCHAR(50),
    unair_fakultas VARCHAR(255),
    unair_prodi VARCHAR(255),
    unair_peserta INT DEFAULT 0,
    non_unair_universitas VARCHAR(255),
    non_unair_fakultas VARCHAR(255),
    non_unair_prodi VARCHAR(255),
    non_unair_peserta INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ipe (
    id VARCHAR(50) PRIMARY KEY,
    tema VARCHAR(255),
    pemateri TEXT,
    moderator TEXT,
    ksm VARCHAR(255),
    tanggal DATE,
    peserta_unair INT DEFAULT 0,
    peserta_non_unair INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS modul_ipe (
    id VARCHAR(50) PRIMARY KEY,
    judul_buku VARCHAR(255),
    penerbit VARCHAR(255),
    isbn VARCHAR(50),
    tanggal_terbit DATE,
    cover_buku TEXT,
    cover_buku_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS student_inbound (
    id VARCHAR(50) PRIMARY KEY,
    fakultas_pengirim VARCHAR(255),
    nama_student VARCHAR(255),
    universitas VARCHAR(255),
    tanggal_masuk DATE,
    tanggal_keluar DATE,
    ksm_tujuan TEXT,
    pembimbing TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS kunjungan (
    id VARCHAR(50) PRIMARY KEY,
    institusi_type VARCHAR(50),
    fakultas VARCHAR(255),
    program_studi VARCHAR(255),
    tujuan TEXT,
    tanggal_pelaksanaan DATE,
    pemateri TEXT,
    jumlah_peserta INT DEFAULT 0,
    universitas VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mou (
    id VARCHAR(50) PRIMARY KEY,
    nama_institusi VARCHAR(255),
    jenis VARCHAR(50),
    tahun VARCHAR(4),
    masa_berlaku VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS akselerasi (
    id VARCHAR(50) PRIMARY KEY,
    kategori VARCHAR(255),
    ksm VARCHAR(100),
    jan INT DEFAULT 0,
    feb INT DEFAULT 0,
    mar INT DEFAULT 0,
    apr INT DEFAULT 0,
    mei INT DEFAULT 0,
    jun INT DEFAULT 0,
    jul INT DEFAULT 0,
    agt INT DEFAULT 0,
    sep INT DEFAULT 0,
    okt INT DEFAULT 0,
    nov INT DEFAULT 0,
    des INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Pelatihan Tables
CREATE TABLE IF NOT EXISTS pelatihan (
    id VARCHAR(50) PRIMARY KEY,
    nama_pelatihan VARCHAR(255),
    kategori VARCHAR(255),
    jumlah_peserta INT DEFAULT 0,
    total_jam INT DEFAULT 0,
    sertifikasi_baru INT DEFAULT 0,
    anggaran_realisasi DECIMAL(15,2) DEFAULT 0,
    tanggal DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pelatihan_unggulan (
    id VARCHAR(50) PRIMARY KEY,
    nama_kegiatan VARCHAR(255),
    tanggal_mulai DATE,
    tanggal_selesai DATE,
    pengusul VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inhouse_training (
    id VARCHAR(50) PRIMARY KEY,
    nama_kegiatan VARCHAR(255),
    tanggal_pelaksanaan DATE,
    pengusul VARCHAR(255),
    berkas_kak TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS kegiatan_kerjasama_skp (
    id VARCHAR(50) PRIMARY KEY,
    judul_kegiatan VARCHAR(255),
    tanggal_kegiatan DATE,
    lembaga_kerjasama VARCHAR(255),
    pks TEXT,
    pks_name VARCHAR(255),
    pks_drive_url VARCHAR(255),
    berkas_pendukung TEXT,
    berkas_pendukung_name VARCHAR(255),
    berkas_pendukung_drive_url VARCHAR(255),
    laporan_pengendali TEXT,
    laporan_pengendali_name VARCHAR(255),
    laporan_pengendali_drive_url VARCHAR(255),
    total_pendapatan DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS studi_banding (
    id VARCHAR(50) PRIMARY KEY,
    nama_institusi VARCHAR(255),
    wahana_pembelajaran VARCHAR(255),
    tanggal_pelaksanaan DATE,
    total_pendapatan DECIMAL(15,2) DEFAULT 0,
    lpj TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS dokter_observer (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(255),
    lulusan_institusi VARCHAR(255),
    tanggal_mulai DATE,
    tanggal_selesai DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS magang (
    id VARCHAR(50) PRIMARY KEY,
    jenis_magang VARCHAR(100),
    nama_peserta VARCHAR(255),
    nama_institusi VARCHAR(255),
    tanggal_mulai DATE,
    tanggal_selesai DATE,
    tempat_pelaksanaan VARCHAR(255),
    total_pendapatan DECIMAL(15,2) DEFAULT 0,
    karya_ilmiah TEXT,
    sertifikat TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS kurikulum_kemenkes (
    id VARCHAR(50) PRIMARY KEY,
    judul_pelatihan VARCHAR(255),
    dokumen TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS kegiatan_internasional (
    id VARCHAR(50) PRIMARY KEY,
    nama_kegiatan VARCHAR(255),
    tanggal_kegiatan DATE,
    lembaga_kerjasama VARCHAR(255),
    lpj TEXT,
    total_pendapatan DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS trainer_sertifikasi (
    id VARCHAR(50) PRIMARY KEY,
    nama_peserta VARCHAR(255),
    unit_kerja VARCHAR(255),
    judul_pelatihan VARCHAR(255),
    tanggal_pelaksanaan DATE,
    sertifikat TEXT,
    sertifikat_name VARCHAR(255),
    sertifikat_drive_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS kegiatan_mandiri_skp (
    id VARCHAR(50) PRIMARY KEY,
    judul_kegiatan VARCHAR(255),
    tanggal_kegiatan DATE,
    unit_kerja VARCHAR(255),
    lpj TEXT,
    lpj_name VARCHAR(255),
    lpj_drive_url VARCHAR(255),
    surat_kak_registrasi TEXT,
    surat_kak_registrasi_name VARCHAR(255),
    surat_kak_registrasi_drive_url VARCHAR(255),
    laporan_pengendali TEXT,
    laporan_pengendali_name VARCHAR(255),
    laporan_pengendali_drive_url VARCHAR(255),
    total_pendapatan DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS monitoring_jam (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(255),
    nip VARCHAR(50),
    ksm VARCHAR(100),
    total_jam DECIMAL(10,2) DEFAULT 0,
    status_kepatuhan VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Penelitian & Inovasi Tables
CREATE TABLE IF NOT EXISTS penelitian (
    id VARCHAR(50) PRIMARY KEY,
    judul TEXT,
    peneliti_utama VARCHAR(255),
    status VARCHAR(50),
    publikasi_scopus TINYINT(1) DEFAULT 0,
    paten_terdaftar TINYINT(1) DEFAULT 0,
    dana_hibah DECIMAL(15,2) DEFAULT 0,
    tanggal_mulai DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pendapatan_penelitian (
    id VARCHAR(50) PRIMARY KEY,
    bulan VARCHAR(20),
    pendapatan_etik DECIMAL(15,2) DEFAULT 0,
    pendapatan_lab_riset DECIMAL(15,2) DEFAULT 0,
    pendapatan_inovasi DECIMAL(15,2) DEFAULT 0,
    pendapatan_uji_klinik DECIMAL(15,2) DEFAULT 0,
    total_pendapatan DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS uji_etik (
    id VARCHAR(50) PRIMARY KEY,
    tanggal_surat_masuk DATE,
    nomor_surat_masuk VARCHAR(255),
    nama_peneliti VARCHAR(255),
    nim_nrp_nip VARCHAR(100),
    cp VARCHAR(100),
    institusi VARCHAR(255),
    pendidikan VARCHAR(50),
    jenis_kegiatan VARCHAR(100),
    judul_penelitian TEXT,
    jumlah_sampel_penelitian INT DEFAULT 0,
    pengambilan_data VARCHAR(255),
    pembimbing_klinis VARCHAR(255),
    review_awal VARCHAR(100),
    hasil_review VARCHAR(100),
    catatan_reviewer TEXT,
    tanggal_seminar_etik DATE,
    tanggal_sertifikat_etik DATE,
    monev VARCHAR(50),
    laporan VARCHAR(100),
    pembayaran_nominal DECIMAL(15,2) DEFAULT 0,
    pembayaran_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS uji_klinik (
    id VARCHAR(50) PRIMARY KEY,
    tahun VARCHAR(4),
    judul_penelitian TEXT,
    mitra_kerjasama VARCHAR(255),
    tim_peneliti_file TEXT,
    tim_peneliti_file_name VARCHAR(255),
    tim_peneliti_file_drive_url VARCHAR(255),
    cta_file TEXT,
    cta_file_name VARCHAR(255),
    cta_file_drive_url VARCHAR(255),
    dana_rab_penelitian DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS penelitian_publikasi (
    id VARCHAR(50) PRIMARY KEY,
    nama_autor VARCHAR(255),
    afiliasi VARCHAR(255),
    judul_artikel_ilmiah TEXT,
    nama_jurnal_terbit VARCHAR(255),
    jenis_publikasi VARCHAR(100),
    ranking VARCHAR(50),
    tanggal_publikasi DATE,
    doi_situs_web TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS produk_inovasi (
    id VARCHAR(50) PRIMARY KEY,
    tahun VARCHAR(4),
    nama_produk VARCHAR(255),
    judul_riset_inovasi TEXT,
    mitra_kerjasama VARCHAR(255),
    sponsor VARCHAR(255),
    pic VARCHAR(255),
    foto_produk TEXT,
    foto_produk_name VARCHAR(255),
    foto_produk_drive_url VARCHAR(255),
    deskripsi_singkat TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS produk_inovasi_terjual (
    id VARCHAR(50) PRIMARY KEY,
    tanggal DATE,
    nama_pasien VARCHAR(255),
    nama_produk VARCHAR(255),
    jumlah_pesanan_produk INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS buku_isbn (
    id VARCHAR(50) PRIMARY KEY,
    tanggal_terbit DATE,
    nama_penulis VARCHAR(255),
    afiliasi VARCHAR(255),
    judul_buku TEXT,
    nomor_isbn VARCHAR(50),
    nama_publiser VARCHAR(255),
    link_publikasi_ebook TEXT,
    bukti_buku_cetak TEXT,
    bukti_buku_cetak_name VARCHAR(255),
    bukti_buku_cetak_drive_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pengabdian_masyarakat (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(255),
    ksm_departemen VARCHAR(255),
    judul TEXT,
    skema VARCHAR(100),
    tahun VARCHAR(4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS proposal_arf (
    id VARCHAR(50) PRIMARY KEY,
    ketua_peneliti VARCHAR(255),
    unit_kerja VARCHAR(255),
    anggota_peneliti TEXT,
    judul_penelitian TEXT,
    skema VARCHAR(50),
    target_luaran TEXT,
    dana_hibah_diperoleh DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS submission_cphm (
    id VARCHAR(50) PRIMARY KEY,
    tanggal DATE,
    judul_artikel TEXT,
    author VARCHAR(255),
    afiliasi VARCHAR(255),
    file_artikel TEXT,
    file_artikel_name VARCHAR(255),
    file_artikel_drive_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS paten (
    id VARCHAR(50) PRIMARY KEY,
    tanggal_terbit DATE,
    nama_autor VARCHAR(255),
    afiliasi VARCHAR(255),
    judul_paten TEXT,
    nomor_paten VARCHAR(100),
    bukti_sertifikat_paten TEXT,
    bukti_sertifikat_paten_name VARCHAR(255),
    bukti_sertifikat_paten_drive_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hki (
    id VARCHAR(50) PRIMARY KEY,
    tanggal_terbit DATE,
    nama_autor VARCHAR(255),
    afiliasi VARCHAR(255),
    judul_hki TEXT,
    nomor_hki VARCHAR(100),
    bukti_sertifikat_hki TEXT,
    bukti_sertifikat_hki_name VARCHAR(255),
    bukti_sertifikat_hki_drive_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
