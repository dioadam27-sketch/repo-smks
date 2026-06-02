-- Database Setup untuk SMKS RS UNAIR
-- Impor file ini melalui phpMyAdmin atau eksekusi di server SQL Anda

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'User',
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pra_pendidikan (
    id VARCHAR(50) PRIMARY KEY,
    tanggal_pelaksanaan DATE NOT NULL,
    institusi_pendidikan VARCHAR(255) NOT NULL,
    total_peserta INT NOT NULL DEFAULT 0,
    institusi_type ENUM('UNAIR', 'Non UNAIR', 'Gabungan'),
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
    tema VARCHAR(255) NOT NULL,
    pemateri TEXT,
    moderator TEXT,
    ksm VARCHAR(255) NOT NULL,
    tanggal DATE NOT NULL,
    peserta_unair INT DEFAULT 0,
    peserta_non_unair INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS modul_ipe (
    id VARCHAR(50) PRIMARY KEY,
    judul_buku VARCHAR(255) NOT NULL,
    penerbit VARCHAR(255) NOT NULL,
    isbn VARCHAR(100) NOT NULL,
    tanggal_terbit DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS student_inbound (
    id VARCHAR(50) PRIMARY KEY,
    fakultas_pengirim VARCHAR(255) NOT NULL,
    nama_student VARCHAR(255) NOT NULL,
    universitas VARCHAR(255) NOT NULL,
    tanggal_masuk DATE NOT NULL,
    tanggal_keluar DATE NOT NULL,
    ksm_tujuan VARCHAR(255) NOT NULL,
    pembimbing TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS kunjungan (
    id VARCHAR(50) PRIMARY KEY,
    institusi_type ENUM('UNAIR', 'Non UNAIR') NOT NULL,
    fakultas VARCHAR(255) NOT NULL,
    program_studi VARCHAR(255) NOT NULL,
    tujuan TEXT NOT NULL,
    tanggal_pelaksanaan DATE NOT NULL,
    pemateri TEXT NOT NULL,
    jumlah_peserta INT NOT NULL DEFAULT 0,
    universitas VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mou (
    id VARCHAR(50) PRIMARY KEY,
    nama_institusi VARCHAR(255) NOT NULL,
    jenis ENUM('Nasional', 'Internasional') NOT NULL,
    tahun VARCHAR(4) NOT NULL,
    masa_berlaku VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS akselerasi (
    id VARCHAR(50) PRIMARY KEY,
    kategori VARCHAR(255) NOT NULL,
    ksm VARCHAR(255) NOT NULL,
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

CREATE TABLE IF NOT EXISTS pelatihan (
    id VARCHAR(50) PRIMARY KEY,
    nama_pelatihan VARCHAR(255) NOT NULL,
    kategori ENUM('Medis', 'Non-Medis') NOT NULL,
    jumlah_peserta INT DEFAULT 0,
    total_jam INT DEFAULT 0,
    sertifikasi_baru INT DEFAULT 0,
    anggaran_realisasi DECIMAL(15,2) DEFAULT 0,
    tanggal VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pelatihan_unggulan (
    id VARCHAR(50) PRIMARY KEY,
    nama_kegiatan VARCHAR(255) NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    pengusul VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inhouse_training (
    id VARCHAR(50) PRIMARY KEY,
    nama_kegiatan VARCHAR(255) NOT NULL,
    tanggal_pelaksanaan DATE NOT NULL,
    pengusul VARCHAR(255) NOT NULL,
    berkas_kak VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS monitoring_jam (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    nip VARCHAR(100) NOT NULL,
    ksm VARCHAR(255) NOT NULL,
    total_jam INT DEFAULT 0,
    status_kepatuhan ENUM('Patuh', 'Tidak Patuh') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS kerjasama_skp (
    id VARCHAR(50) PRIMARY KEY,
    judul_kegiatan VARCHAR(255) NOT NULL,
    tanggal_kegiatan DATE,
    lembaga_kerjasama VARCHAR(255),
    pks VARCHAR(255),
    berkas_pendukung VARCHAR(255),
    laporan_pengendali VARCHAR(255),
    total_pendapatan DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS studi_banding (
    id VARCHAR(50) PRIMARY KEY,
    nama_institusi VARCHAR(255) NOT NULL,
    wahana_pembelajaran VARCHAR(255),
    tanggal_pelaksanaan DATE,
    total_pendapatan DECIMAL(15,2),
    lpj VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS dokter_observer (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    lulusan_institusi VARCHAR(255) NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS magang (
    id VARCHAR(50) PRIMARY KEY,
    jenis_magang ENUM('Magang Observer', 'Magang Kompetensi') NOT NULL,
    nama_peserta VARCHAR(255) NOT NULL,
    nama_institusi VARCHAR(255) NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    tempat_pelaksanaan VARCHAR(255) NOT NULL,
    total_pendapatan DECIMAL(15,2) DEFAULT 0,
    karya_ilmiah VARCHAR(255),
    sertifikat VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pelatihan_standar_kemenkes (
    id VARCHAR(50) PRIMARY KEY,
    judul_pelatihan VARCHAR(255) NOT NULL,
    dokumen VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pelatihan_internasional (
    id VARCHAR(50) PRIMARY KEY,
    nama_kegiatan VARCHAR(255) NOT NULL,
    tanggal_kegiatan DATE,
    lembaga_kerjasama VARCHAR(255),
    lpj VARCHAR(255),
    total_pendapatan DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS trainer_sertifikasi (
    id VARCHAR(50) PRIMARY KEY,
    nama_peserta VARCHAR(255) NOT NULL,
    unit_kerja VARCHAR(255) NOT NULL,
    judul_pelatihan VARCHAR(255) NOT NULL,
    tanggal_pelaksanaan DATE NOT NULL,
    sertifikat VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS penelitian (
    id VARCHAR(50) PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    peneliti_utama VARCHAR(255) NOT NULL,
    status ENUM('Berjalan Penuh', 'Rekrutmen', 'Selesai') NOT NULL,
    publikasi_scopus BOOLEAN DEFAULT FALSE,
    paten_terdaftar BOOLEAN DEFAULT FALSE,
    dana_hibah DECIMAL(15,2) DEFAULT 0,
    tanggal_mulai VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS penelitian_publikasi (
    id VARCHAR(50) PRIMARY KEY,
    nama_peneliti VARCHAR(255) NOT NULL,
    judul TEXT NOT NULL,
    skema VARCHAR(255) NOT NULL,
    tahun VARCHAR(4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS uji_etik (
    id VARCHAR(50) PRIMARY KEY,
    nama_peneliti VARCHAR(255) NOT NULL,
    judul_penelitian TEXT NOT NULL,
    skema VARCHAR(255) NOT NULL,
    tahun VARCHAR(4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS buku_isbn (
    id VARCHAR(50) PRIMARY KEY,
    judul_buku VARCHAR(255) NOT NULL,
    isbn VARCHAR(100) NOT NULL,
    penerbit VARCHAR(255) NOT NULL,
    tanggal_terbit DATE NOT NULL,
    haki_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS kepk (
    id VARCHAR(50) PRIMARY KEY,
    judul_penelitian TEXT NOT NULL,
    nama_peneliti VARCHAR(255) NOT NULL,
    tahun VARCHAR(4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pengabdian_masyarakat (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    ksm VARCHAR(255) NOT NULL,
    judul TEXT NOT NULL,
    skema VARCHAR(255) NOT NULL,
    tahun VARCHAR(4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS produk_inovasi (
    id VARCHAR(50) PRIMARY KEY,
    nama_produk VARCHAR(255) NOT NULL,
    tanggal DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS unit_ksm (
    id VARCHAR(50) PRIMARY KEY,
    type ENUM('Unit', 'KSM') NOT NULL,
    nama VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS prapendidikan_komkordik (
    id VARCHAR(50) PRIMARY KEY,
    tanggal_pelaksanaan DATE NOT NULL,
    institusi_pendidikan TEXT NOT NULL,
    total_peserta INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orientasi_ksm (
    id VARCHAR(50) PRIMARY KEY,
    tanggal_pelaksanaan DATE NOT NULL,
    institusi_pendidikan TEXT NOT NULL,
    total_peserta INT NOT NULL DEFAULT 0,
    bukti_foto1 TEXT,
    bukti_foto1_name VARCHAR(255),
    bukti_foto2 TEXT,
    bukti_foto2_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pendapatan_pendidikan (
    id VARCHAR(50) PRIMARY KEY,
    bulan VARCHAR(20) NOT NULL,
    tahun VARCHAR(4) NOT NULL,
    institusi_name VARCHAR(255) NOT NULL,
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
    nama_mahasiswa VARCHAR(255) NOT NULL,
    nim VARCHAR(50) NOT NULL,
    institusi_type VARCHAR(50),
    fakultas VARCHAR(255),
    program_studi VARCHAR(255),
    jenis_pajanan VARCHAR(100),
    tanggal_kejadian DATE NOT NULL,
    lokasi_kejadian VARCHAR(255),
    deskripsi_kejadian TEXT,
    tindak_lanjut TEXT,
    file_laporan TEXT,
    tanggal_laporan DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pelatihan_mandiri (
    id VARCHAR(50) PRIMARY KEY,
    judul_kegiatan VARCHAR(255) NOT NULL,
    tanggal_kegiatan DATE NOT NULL,
    unit_kerja VARCHAR(255) NOT NULL,
    lpj TEXT,
    lpj_name VARCHAR(255),
    lpj_drive_url VARCHAR(255),
    surat_kak_registrasi TEXT,
    surat_kak_registrasi_name VARCHAR(255),
    surat_kak_registrasi_drive_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pendapatan_penelitian (
    id VARCHAR(50) PRIMARY KEY,
    bulan VARCHAR(20) NOT NULL,
    pendapatan_etik DECIMAL(15,2) DEFAULT 0,
    pendapatan_lab_riset DECIMAL(15,2) DEFAULT 0,
    pendapatan_inovasi DECIMAL(15,2) DEFAULT 0,
    pendapatan_uji_klinik DECIMAL(15,2) DEFAULT 0,
    total_pendapatan DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS uji_klinik (
    id VARCHAR(50) PRIMARY KEY,
    tahun VARCHAR(4) NOT NULL,
    judul_penelitian TEXT NOT NULL,
    mitra_kerjasama VARCHAR(255),
    tim_peneliti_file TEXT,
    tim_peneliti_file_name VARCHAR(255),
    tim_peneliti_file_drive_url VARCHAR(255),
    cta_file TEXT,
    cta_file_name VARCHAR(255),
    cta_file_drive_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS produk_inovasi_terjual (
    id VARCHAR(50) PRIMARY KEY,
    tanggal DATE NOT NULL,
    nama_pasien VARCHAR(255) NOT NULL,
    nama_produk VARCHAR(255) NOT NULL,
    jumlah_pesanan_produk INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS proposal_arf (
    id VARCHAR(50) PRIMARY KEY,
    ketua_peneliti VARCHAR(255) NOT NULL,
    unit_kerja VARCHAR(255) NOT NULL,
    anggota_peneliti TEXT,
    judul_penelitian TEXT NOT NULL,
    skema VARCHAR(100) NOT NULL,
    target_luaran TEXT,
    dana_hibah_diperoleh DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS submission_cphm (
    id VARCHAR(50) PRIMARY KEY,
    tanggal DATE NOT NULL,
    judul_artikel TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    afiliasi VARCHAR(255),
    file_artikel TEXT,
    file_artikel_name VARCHAR(255),
    file_artikel_drive_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS paten (
    id VARCHAR(50) PRIMARY KEY,
    tanggal_terbit DATE NOT NULL,
    nama_autor VARCHAR(255) NOT NULL,
    afiliasi VARCHAR(255),
    judul_paten TEXT NOT NULL,
    nomor_paten VARCHAR(100) NOT NULL,
    bukti_sertifikat_paten TEXT,
    bukti_sertifikat_paten_name VARCHAR(255),
    bukti_sertifikat_paten_drive_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hki (
    id VARCHAR(50) PRIMARY KEY,
    tanggal_terbit DATE NOT NULL,
    nama_autor VARCHAR(255) NOT NULL,
    afiliasi VARCHAR(255),
    judul_hki TEXT NOT NULL,
    nomor_hki VARCHAR(100) NOT NULL,
    bukti_sertifikat_hki TEXT,
    bukti_sertifikat_hki_name VARCHAR(255),
    bukti_sertifikat_hki_drive_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Default Admin
INSERT IGNORE INTO users (username, password_hash, nama_lengkap, role, email) VALUES 
('admin', '$2y$10$w3U/lZf6Lh2UZbR8P9wTpe3O46vIfM.R6W2uD7iYofj1UWe.h.uA2', 'Administrator', 'System Developer', 'admin@rsua.unair.ac.id');
