export type TabType = 
  | 'pendidikan' 
  | 'pendidikan_b' 
  | 'pendidikan_c' 
  | 'pendidikan_d' 
  | 'pendidikan_e' 
  | 'pendidikan_f' 
  | 'pendidikan_g' 
  | 'pendidikan_j' 
  | 'pendidikan_k' 
  | 'pendidikan_l' 
  | 'pendidikan_m' 
  | 'pelatihan' 
  | 'pelatihan_inhouse'
  | 'pelatihan_kerjasama'
  | 'pelatihan_studi'
  | 'pelatihan_magang'
  | 'pelatihan_standar_kemenkes'
  | 'pelatihan_internasional'
  | 'pelatihan_trainer_sertifikasi'
  | 'pelatihan_mandiri'
  | 'penelitian'
  | 'penelitian_pendapatan'
  | 'penelitian_uji_etik'
  | 'penelitian_uji_klinik'
  | 'penelitian_publikasi'
  | 'penelitian_produk'
  | 'penelitian_produk_terjual'
  | 'penelitian_buku'
  | 'penelitian_pengabdian'
  | 'penelitian_proposal_arf'
  | 'penelitian_submission_cphm'
  | 'penelitian_paten'
  | 'penelitian_hki';

export type ViewMode = 'portal' | 'dashboard' | 'smks' | 'smks_pendidikan' | 'smks_pelatihan' | 'smks_penelitian' | 'admin';

export interface StatItem {
  title: string;
  value: string | number;
  trend: number;
  icon: any;
  description: string;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}
