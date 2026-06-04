<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'pkkiipendidikanu_smks');
define('DB_USER', 'pkkiipendidikanu_dioarsip');
define('DB_PASS', '@Dioadam27');

$dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (\PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Auto-migrate: check if menu_permissions column exists, if not, add it
try {
    $stmt = $pdo->prepare("SHOW COLUMNS FROM users LIKE 'menu_permissions'");
    $stmt->execute();
    if ($stmt->rowCount() === 0) {
        $pdo->exec("ALTER TABLE users ADD COLUMN menu_permissions TEXT NULL");
    }
} catch (\Exception $e) {
    // Avoid blocking if database cannot be altered (or already has column in sqlite etc)
}

// Auto-migrate: check if user_permissions table exists, if not create it
try {
    $stmt = $pdo->query("SHOW TABLES LIKE 'user_permissions'");
    if ($stmt->rowCount() === 0) {
        $pdo->exec("CREATE TABLE user_permissions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            menu_key VARCHAR(191) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    }
} catch (\Exception $e) {
    // Avoid blocking if database cannot be altered
}

// Auto-migrate: check if program_fellowship table exists, if not create it
try {
    $stmt = $pdo->query("SHOW TABLES LIKE 'program_fellowship'");
    if ($stmt->rowCount() === 0) {
        $pdo->exec("CREATE TABLE program_fellowship (
            id VARCHAR(50) PRIMARY KEY,
            nama_penyelenggara VARCHAR(255) NOT NULL,
            nama_program_fellowship VARCHAR(255) NOT NULL,
            lama_kegiatan INT DEFAULT 1,
            kerjasama_kolegium VARCHAR(255) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    }
} catch (\Exception $e) {
    // Avoid blocking if database cannot be altered
}

// Helper to handle CRUD
function handleCrud($pdo, $table, $allowedFields, $inputOverride = null) {
    try {
        $method = $_SERVER['REQUEST_METHOD'];
        $input = ($inputOverride !== null) ? $inputOverride : json_decode(file_get_contents('php://input'), true);
        
        switch ($method) {
            case 'GET':
                if (isset($_GET['id'])) {
                    $stmt = $pdo->prepare("SELECT * FROM $table WHERE id = ?");
                    $stmt->execute([$_GET['id']]);
                    $row = $stmt->fetch();
                    echo json_encode([
                        'status' => 'success',
                        'data' => $row ? $row : null
                    ]);
                } else {
                    $stmt = $pdo->query("SELECT * FROM $table ORDER BY created_at DESC");
                    echo json_encode([
                        'status' => 'success',
                        'data' => $stmt->fetchAll()
                    ]);
                }
                break;
                
            case 'POST':
                $fields = [];
                $placeholders = [];
                $values = [];
                foreach ($allowedFields as $field) {
                    if ($field === 'id' && $table === 'users') {
                        continue;
                    }
                    if (is_array($input) && array_key_exists($field, $input)) {
                        $fields[] = $field;
                        $placeholders[] = "?";
                        $val = $input[$field];
                        if ($val === '') {
                            $val = null;
                        }
                        $values[] = $val;
                    }
                }
                if (empty($fields)) {
                    echo json_encode(['error' => 'No valid fields provided']);
                    exit;
                }
                $sql = "INSERT INTO $table (" . implode(', ', $fields) . ") VALUES (" . implode(', ', $placeholders) . ")";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($values);
                echo json_encode(['status' => 'success', 'id' => (isset($input['id']) && $table !== 'users') ? $input['id'] : $pdo->lastInsertId()]);
                break;
                
            case 'PUT':
                if (!isset($_GET['id'])) {
                    echo json_encode(['error' => 'ID required for update']);
                    exit;
                }
                $updates = [];
                $values = [];
                foreach ($allowedFields as $field) {
                    if ($field === 'id') continue;
                    if (is_array($input) && array_key_exists($field, $input)) {
                        $updates[] = "$field = ?";
                        $val = $input[$field];
                        if ($val === '') {
                            $val = null;
                        }
                        $values[] = $val;
                    }
                }
                if (empty($updates)) {
                    echo json_encode(['error' => 'No valid fields for update']);
                    exit;
                }
                $values[] = $_GET['id'];
                $sql = "UPDATE $table SET " . implode(', ', $updates) . " WHERE id = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($values);
                echo json_encode(['status' => 'success']);
                break;
                
            case 'DELETE':
                if (!isset($_GET['id'])) {
                    echo json_encode(['error' => 'ID required for deletion']);
                    exit;
                }
                $stmt = $pdo->prepare("DELETE FROM $table WHERE id = ?");
                $stmt->execute([$_GET['id']]);
                echo json_encode(['status' => 'success']);
                break;
        }
    } catch (\PDOException $e) {
        http_response_code(400); // Bad Request to prevent 500 error bubbling
        echo json_encode(['error' => 'Database operation failed: ' . $e->getMessage()]);
    }
}

$resource = isset($_GET['resource']) ? $_GET['resource'] : '';

switch ($resource) {
    case 'login':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Fallback for admin user with password admin
            if (isset($input['username']) && $input['username'] === 'admin' && isset($input['password']) && $input['password'] === 'admin') {
                echo json_encode([
                    'status' => 'success',
                    'token' => 'dummy-jwt-token',
                    'user' => [
                        'id' => '1',
                        'username' => 'admin',
                        'nama_lengkap' => 'Administrator',
                        'role' => 'System Developer',
                        'email' => 'admin@rsua.unair.ac.id'
                    ]
                ]);
                break;
            }

            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->execute([$input['username']]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($input['password'], $user['password_hash'])) {
                unset($user['password_hash']);
                echo json_encode([
                    'status' => 'success',
                    'token' => 'dummy-jwt-token',
                    'user' => $user
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
            }
        }
        break;

    // Admin & Unit
    case 'users':
        $rawInput = json_decode(file_get_contents('php://input'), true);
        $input = $rawInput !== null ? $rawInput : array();
        if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
            if (isset($input['password']) && !empty($input['password'])) {
                $input['password_hash'] = password_hash($input['password'], PASSWORD_DEFAULT);
            }
        }
    
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            switch ($method) {
                case 'GET':
                    if (isset($_GET['id'])) {
                        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
                        $stmt->execute([$_GET['id']]);
                        $row = $stmt->fetch();
                        if ($row) {
                            unset($row['password_hash']);
                        }
                        echo json_encode([
                            'status' => 'success',
                            'data' => $row ? $row : null
                        ]);
                    } else {
                        $stmt = $pdo->query("SELECT * FROM users ORDER BY created_at DESC");
                        $rows = $stmt->fetchAll();
                        foreach ($rows as &$r) {
                            unset($r['password_hash']);
                        }
                        echo json_encode([
                            'status' => 'success',
                            'data' => $rows
                        ]);
                    }
                    break;
                    
                case 'POST':
                    $fields = ['username', 'password_hash', 'nama_lengkap', 'role', 'email', 'menu_permissions'];
                    $insertFields = [];
                    $placeholders = [];
                    $values = [];
                    foreach ($fields as $field) {
                        if (array_key_exists($field, $input)) {
                            $insertFields[] = $field;
                            $placeholders[] = "?";
                            $values[] = $input[$field] === '' ? null : $input[$field];
                        }
                    }
                    $sql = "INSERT INTO users (" . implode(', ', $insertFields) . ") VALUES (" . implode(', ', $placeholders) . ")";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute($values);
                    $userId = $pdo->lastInsertId();
                    
                    // Sync user_permissions
                    if (isset($input['menu_permissions'])) {
                        $perms = array_filter(explode(',', $input['menu_permissions']));
                        $stmtIns = $pdo->prepare("INSERT INTO user_permissions (user_id, menu_key) VALUES (?, ?)");
                        foreach ($perms as $perm) {
                            $stmtIns->execute([$userId, trim($perm)]);
                        }
                    }
                    
                    echo json_encode(['status' => 'success', 'id' => $userId]);
                    break;
                    
                case 'PUT':
                    if (!isset($_GET['id'])) {
                        echo json_encode(['error' => 'ID required for update']);
                        exit;
                    }
                    $userId = $_GET['id'];
                    $fields = ['username', 'password_hash', 'nama_lengkap', 'role', 'email', 'menu_permissions'];
                    $updates = [];
                    $values = [];
                    foreach ($fields as $field) {
                        if (array_key_exists($field, $input)) {
                            $updates[] = "$field = ?";
                            $values[] = $input[$field] === '' ? null : $input[$field];
                        }
                    }
                    
                    if (!empty($updates)) {
                        $values[] = $userId;
                        $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
                        $stmt = $pdo->prepare($sql);
                        $stmt->execute($values);
                    }
                    
                    // Sync user_permissions
                    if (isset($input['menu_permissions'])) {
                        $stmtDel = $pdo->prepare("DELETE FROM user_permissions WHERE user_id = ?");
                        $stmtDel->execute([$userId]);
                        
                        $perms = array_filter(explode(',', $input['menu_permissions']));
                        if (!empty($perms)) {
                            $stmtIns = $pdo->prepare("INSERT INTO user_permissions (user_id, menu_key) VALUES (?, ?)");
                            foreach ($perms as $perm) {
                                $stmtIns->execute([$userId, trim($perm)]);
                            }
                        }
                    }
                    
                    echo json_encode(['status' => 'success']);
                    break;
                    
                case 'DELETE':
                    if (!isset($_GET['id'])) {
                        echo json_encode(['error' => 'ID required for deletion']);
                        exit;
                    }
                    $userId = $_GET['id'];
                    $stmtDel = $pdo->prepare("DELETE FROM user_permissions WHERE user_id = ?");
                    $stmtDel->execute([$userId]);
                    
                    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
                    $stmt->execute([$userId]);
                    echo json_encode(['status' => 'success']);
                    break;
            }
        } catch (\PDOException $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Database operation failed: ' . $e->getMessage()]);
        }
        break;

    case 'user_permissions':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            try {
                $stmt = $pdo->query("SELECT up.*, u.nama_lengkap, u.username, u.role FROM user_permissions up JOIN users u ON up.user_id = u.id ORDER BY up.created_at DESC");
                echo json_encode([
                    'status' => 'success',
                    'data' => $stmt->fetchAll()
                ]);
            } catch (\Exception $e) {
                handleCrud($pdo, 'user_permissions', ['id', 'user_id', 'menu_key']);
            }
        } else {
            handleCrud($pdo, 'user_permissions', ['id', 'user_id', 'menu_key']);
        }
        break;
    case 'unit_ksm':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            if (isset($_GET['id'])) {
                $stmt = $pdo->prepare("SELECT * FROM unit_ksm WHERE id = ?");
                $stmt->execute([$_GET['id']]);
                $row = $stmt->fetch();
                if ($row) {
                    $row['nama'] = $row['name'];
                }
                echo json_encode([
                    'status' => 'success',
                    'data' => $row ? $row : null
                ]);
            } else {
                $stmt = $pdo->query("SELECT * FROM unit_ksm ORDER BY created_at DESC");
                $rows = $stmt->fetchAll();
                foreach ($rows as &$row) {
                    $row['nama'] = $row['name'];
                }
                echo json_encode([
                    'status' => 'success',
                    'data' => $rows
                ]);
            }
        } else {
            $rawInput = json_decode(file_get_contents('php://input'), true);
            $input = $rawInput !== null ? $rawInput : array();
            if (isset($input['nama'])) {
                $input['name'] = $input['nama'];
            }
            handleCrud($pdo, 'unit_ksm', ['id', 'type', 'name'], $input);
        }
        break;

    // Pendidikan
    case 'pra_pendidikan':
        handleCrud($pdo, 'pra_pendidikan', ['id', 'tanggal_pelaksanaan', 'institusi_pendidikan', 'total_peserta', 'institusi_type', 'unair_fakultas', 'unair_prodi', 'unair_peserta', 'non_unair_universitas', 'non_unair_fakultas', 'non_unair_prodi', 'non_unair_peserta']);
        break;
    case 'ipe':
        handleCrud($pdo, 'ipe', ['id', 'tema', 'pemateri', 'moderator', 'ksm', 'tanggal', 'peserta_unair', 'peserta_non_unair']);
        break;
    case 'modul_ipe':
        handleCrud($pdo, 'modul_ipe', ['id', 'judul_buku', 'penerbit', 'isbn', 'tanggal_terbit', 'cover_buku', 'cover_buku_name']);
        break;
    case 'student_inbound':
        handleCrud($pdo, 'student_inbound', ['id', 'fakultas_pengirim', 'nama_student', 'universitas', 'tanggal_masuk', 'tanggal_keluar', 'ksm_tujuan', 'pembimbing']);
        break;
    case 'kunjungan':
        handleCrud($pdo, 'kunjungan', ['id', 'institusi_type', 'fakultas', 'program_studi', 'tujuan', 'tanggal_pelaksanaan', 'pemateri', 'jumlah_peserta', 'universitas']);
        break;
    case 'mou':
        handleCrud($pdo, 'mou', ['id', 'nama_institusi', 'jenis', 'tahun', 'masa_berlaku']);
        break;
    case 'akselerasi':
        handleCrud($pdo, 'akselerasi', ['id', 'kategori', 'ksm', 'jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agt', 'sep', 'okt', 'nov', 'des']);
        break;
    case 'prapendidikan_komkordik':
        handleCrud($pdo, 'prapendidikan_komkordik', ['id', 'tanggal_pelaksanaan', 'institusi_pendidikan', 'total_peserta']);
        break;
    case 'orientasi_ksm':
        handleCrud($pdo, 'orientasi_ksm', ['id', 'tanggal_pelaksanaan', 'institusi_pendidikan', 'total_peserta', 'bukti_foto1', 'bukti_foto1_name', 'bukti_foto2', 'bukti_foto2_name']);
        break;
    case 'pendapatan_pendidikan':
        handleCrud($pdo, 'pendapatan_pendidikan', ['id', 'bulan', 'tahun', 'institusi_name', 'institusi_type', 'prapendidikan_income', 'praktik_income', 'ipe_income', 'total_income', 'bukti_pembayaran', 'bukti_pembayaran_name']);
        break;
    case 'pajanan_peserta':
        handleCrud($pdo, 'pajanan_peserta', ['id', 'nama_mahasiswa', 'nim', 'institusi_type', 'fakultas', 'program_studi', 'jenis_pajanan', 'tanggal_kejadian', 'lokasi_kejadian', 'deskripsi_kejadian', 'tindak_lanjut', 'file_laporan', 'tanggal_laporan']);
        break;
    case 'program_fellowship':
        handleCrud($pdo, 'program_fellowship', ['id', 'nama_penyelenggara', 'nama_program_fellowship', 'lama_kegiatan', 'kerjasama_kolegium']);
        break;

    // Pelatihan
    case 'pelatihan':
        handleCrud($pdo, 'pelatihan', ['id', 'nama_pelatihan', 'kategori', 'jumlah_peserta', 'total_jam', 'sertifikasi_baru', 'anggaran_realisasi', 'tanggal']);
        break;
    case 'pelatihan_unggulan':
        handleCrud($pdo, 'pelatihan_unggulan', ['id', 'nama_kegiatan', 'tanggal_mulai', 'tanggal_selesai', 'pengusul']);
        break;
    case 'inhouse_training':
        handleCrud($pdo, 'inhouse_training', ['id', 'nama_kegiatan', 'tanggal_pelaksanaan', 'pengusul', 'berkas_kak']);
        break;
    case 'kegiatan_kerjasama_skp':
        handleCrud($pdo, 'kegiatan_kerjasama_skp', ['id', 'judul_kegiatan', 'tanggal_kegiatan', 'lembaga_kerjasama', 'pks', 'pks_name', 'pks_drive_url', 'berkas_pendukung', 'berkas_pendukung_name', 'berkas_pendukung_drive_url', 'laporan_pengendali', 'laporan_pengendali_name', 'laporan_pengendali_drive_url', 'total_pendapatan']);
        break;
    case 'studi_banding':
        handleCrud($pdo, 'studi_banding', ['id', 'nama_institusi', 'wahana_pembelajaran', 'tanggal_pelaksanaan', 'total_pendapatan', 'lpj']);
        break;
    case 'dokter_observer':
        handleCrud($pdo, 'dokter_observer', ['id', 'nama', 'lulusan_institusi', 'tanggal_mulai', 'tanggal_selesai']);
        break;
    case 'magang':
        handleCrud($pdo, 'magang', ['id', 'jenis_magang', 'nama_peserta', 'nama_institusi', 'tanggal_mulai', 'tanggal_selesai', 'tempat_pelaksanaan', 'total_pendapatan', 'karya_ilmiah', 'sertifikat']);
        break;
    case 'kurikulum_kemenkes':
        handleCrud($pdo, 'kurikulum_kemenkes', ['id', 'judul_pelatihan', 'dokumen']);
        break;
    case 'kegiatan_internasional':
        handleCrud($pdo, 'kegiatan_internasional', ['id', 'nama_kegiatan', 'tanggal_kegiatan', 'lembaga_kerjasama', 'lpj', 'total_pendapatan']);
        break;
    case 'trainer_sertifikasi':
        handleCrud($pdo, 'trainer_sertifikasi', ['id', 'nama_peserta', 'unit_kerja', 'judul_pelatihan', 'tanggal_pelaksanaan', 'sertifikat', 'sertifikat_name', 'sertifikat_drive_url']);
        break;
    case 'kegiatan_mandiri_skp':
        handleCrud($pdo, 'kegiatan_mandiri_skp', ['id', 'judul_kegiatan', 'tanggal_kegiatan', 'unit_kerja', 'lpj', 'lpj_name', 'lpj_drive_url', 'surat_kak_registrasi', 'surat_kak_registrasi_name', 'surat_kak_registrasi_drive_url', 'laporan_pengendali', 'laporan_pengendali_name', 'laporan_pengendali_drive_url', 'total_pendapatan']);
        break;
    case 'monitoring_jam':
        handleCrud($pdo, 'monitoring_jam', ['id', 'nama', 'nip', 'ksm', 'total_jam', 'status_kepatuhan']);
        break;

    // Penelitian & Inovasi
    case 'penelitian':
        handleCrud($pdo, 'penelitian', ['id', 'judul', 'peneliti_utama', 'status', 'publikasi_scopus', 'paten_terdaftar', 'dana_hibah', 'tanggal_mulai']);
        break;
    case 'pendapatan_penelitian':
        handleCrud($pdo, 'pendapatan_penelitian', ['id', 'bulan', 'pendapatan_etik', 'pendapatan_lab_riset', 'pendapatan_inovasi', 'pendapatan_uji_klinik', 'total_pendapatan']);
        break;
    case 'uji_etik':
        handleCrud($pdo, 'uji_etik', ['id', 'tanggal_surat_masuk', 'nomor_surat_masuk', 'nama_peneliti', 'nim_nrp_nip', 'cp', 'institusi', 'pendidikan', 'jenis_kegiatan', 'judul_penelitian', 'jumlah_sampel_penelitian', 'pengambilan_data', 'pembimbing_klinis', 'review_awal', 'hasil_review', 'catatan_reviewer', 'tanggal_seminar_etik', 'tanggal_sertifikat_etik', 'monev', 'laporan', 'pembayaran_nominal', 'pembayaran_status']);
        break;
    case 'uji_klinik':
        handleCrud($pdo, 'uji_klinik', ['id', 'tahun', 'judul_penelitian', 'mitra_kerjasama', 'tim_peneliti_file', 'tim_peneliti_file_name', 'tim_peneliti_file_drive_url', 'cta_file', 'cta_file_name', 'cta_file_drive_url', 'dana_rab_penelitian', 'status']);
        break;
    case 'penelitian_publikasi':
        handleCrud($pdo, 'penelitian_publikasi', ['id', 'nama_autor', 'afiliasi', 'judul_artikel_ilmiah', 'nama_jurnal_terbit', 'jenis_publikasi', 'ranking', 'tanggal_publikasi', 'doi_situs_web']);
        break;
    case 'produk_inovasi':
        handleCrud($pdo, 'produk_inovasi', ['id', 'tahun', 'nama_produk', 'judul_riset_inovasi', 'mitra_kerjasama', 'sponsor', 'pic', 'foto_produk', 'foto_produk_name', 'foto_produk_drive_url', 'deskripsi_singkat']);
        break;
    case 'produk_inovasi_terjual':
        handleCrud($pdo, 'produk_inovasi_terjual', ['id', 'tanggal', 'nama_pasien', 'nama_produk', 'jumlah_pesanan_produk']);
        break;
    case 'buku_isbn':
        handleCrud($pdo, 'buku_isbn', ['id', 'tanggal_terbit', 'nama_penulis', 'afiliasi', 'judul_buku', 'nomor_isbn', 'nama_publiser', 'link_publikasi_ebook', 'bukti_buku_cetak', 'bukti_buku_cetak_name', 'bukti_buku_cetak_drive_url']);
        break;
    case 'pengabdian_masyarakat':
        handleCrud($pdo, 'pengabdian_masyarakat', ['id', 'nama', 'ksm_departemen', 'judul', 'skema', 'tahun']);
        break;
    case 'proposal_arf':
        handleCrud($pdo, 'proposal_arf', ['id', 'ketua_peneliti', 'unit_kerja', 'anggota_peneliti', 'judul_penelitian', 'skema', 'target_luaran', 'dana_hibah_diperoleh']);
        break;
    case 'submission_cphm':
        handleCrud($pdo, 'submission_cphm', ['id', 'tanggal', 'judul_artikel', 'author', 'afiliasi', 'file_artikel', 'file_artikel_name', 'file_artikel_drive_url']);
        break;
    case 'paten':
        handleCrud($pdo, 'paten', ['id', 'tanggal_terbit', 'nama_autor', 'afiliasi', 'judul_paten', 'nomor_paten', 'bukti_sertifikat_paten', 'bukti_sertifikat_paten_name', 'bukti_sertifikat_paten_drive_url']);
        break;
    case 'hki':
        handleCrud($pdo, 'hki', ['id', 'tanggal_terbit', 'nama_autor', 'afiliasi', 'judul_hki', 'nomor_hki', 'bukti_sertifikat_hki', 'bukti_sertifikat_hki_name', 'bukti_sertifikat_hki_drive_url']);
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Resource not found: ' . $resource]);
        break;
}
