export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface IRegParams {
  noReg: string;
}

export interface IServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface ILoginRequest {
  username?: string;
  password?: string;
}

export interface IPasienRI {
  vc_no_reg: string;
  vc_no_rm: string;
  vc_no_ktp: string;
  vc_nama_p: string;
  dt_tgl_lhr: Date;
  vc_nama: string;
  vc_noregj_ralan: string;
  umur_tahun: number;
  umur_bulan: number;
  umur_hari: number;
}

export interface IPasienRJ {
  vc_no_reg: string;
  vc_no_rm: string;
  vc_no_ktp: string;
  dt_tgl_lhr: Date;
  vc_nama_p: string;
  vc_n_klinik?: string;
  vc_pekerjaan?: string;
  vc_pendidikan?: string;
  umur_tahun: number;
  umur_bulan: number;
  umur_hari: number;
}

export interface IDataPddk {
  vc_kode?: string;
  vc_pendidikan?: string;
}

export interface IDataPekerjaan {
  vc_kode?: string;
  vc_pekerjaan?: string;
}

export interface IDataSDMDokter {
  vc_nid?: string;
  vc_nama_kry?: string;
}

export interface IDataJenisDiit {
  vc_kode?: string;
  vc_jns_diet?: string;
}

export interface IDataRiwayatKunjung {
  vc_no_regj?: string;
  vc_no_rm?: string;
  vc_id?: string;
  dt_tanggal?: string;
  vc_nama_ahli_gizi?: string;
  vc_diagnosis_medis?: string;
  bt_aktif?: string;
}

export interface IDataDiagnosisGizi {
  vc_kode: string;
  vc_nama: string;
}

export interface ISkriningGizi {
  _ASKEPIGD_SkriningGizi: {
    vc_NoReg: string;
    vc_NoRM: string;
    bt_SkriningAnak: string;
    vc_BB: string;
    vc_TB: string;
    vc_LILA: string;
    bt_PenurunanBBAnak: string;
    vc_KdPenurunanBB: string;
    si_SkorPenurunanBB: string;
    bt_AsupanMakanan: string;
    si_SkorAsupanMakanan: string;
    si_SkorDiagnosaKhusus: string;
    vc_KdDiagnosaKhusus: string;
    VC_DiagnosaKhususLain: string;
    bt_gastrointestinal: string;
    bt_MalnutrisiOpBesar: string;
    vc_KdMalnutrisiOpBesar: string;
    si_SkorMalnutrisiOpBesar: string;
    bt_GiziBuruk: string;
    si_SkorGiziBuruk: string;
    bt_KondisiTertentu: string;
    vc_KdKondisiTertentu: string;
    si_SkorKondisiTertentu: string;
    vc_SkorAkhir: string;
    bt_KonsultasiAhliGizi: string;
  };

  _AskepRajal_SkriningGizi: {
    vc_NoReg: string;
    vc_NoRM: string;
    bt_SkriningAnak: string;
    vc_BB: string;
    vc_TB: string;
    vc_LILA: string;
    bt_PenurunanBBAnak: string;
    vc_KdPenurunanBB: string;
    si_SkorPenurunanBB: string;
    bt_AsupanMakanan: string;
    si_SkorAsupanMakanan: string;
    si_SkorDiagnosaKhusus: string;
    vc_KdDiagnosasKhusus: string;
    VC_DiagnosaKhususLain: string;
    bt_gastrointestinal: string;
    bt_MalnutrisiOpBesar: string;
    vc_KdMalnutrisiOpBesar: string;
    si_SkorMalnutrisiOpBesar: string;
    bt_GiziBuruk: string;
    si_SkorGiziBuruk: string;
    bt_KondisiTertentu: string;
    vc_KondisiTertentu: string;
    si_SkorKondisiTertentu: string;
    vc_SkorAkhir: string;
    bt_KonsultasiAhliGizi: string;
  };
}

export interface IAsuhanGizi {
  vc_id?: string;
  vc_no_reg: string;
  vc_no_rm: string;

  // Khusus Rawat Jalan (RJ)
  vc_dokter_pengirim?: string;
  vc_diagnosa_medis?: string;

  riwayat_gizi?: {
    vc_pola_makan?: string; // Dipakai di RI & RJ Anak
    bt_diit_konseling?: string;
    vc_diit_konseling?: string;
    bt_alergi_makanan?: string;
    vc_alergi_makanan?: string;
    bt_pantangan_makanan?: string;
    vc_pantangan_makanan?: string;
    bt_ketidaksukaan_makan?: string;
    vc_ketidaksukaan_makan?: string;
  };

  antropometri?: {
    vc_bb?: string;
    vc_tb?: string;
    vc_lila?: string;
    vc_imt?: string;
    vc_bbi?: string; // Dipakai di RI & RJ Dewasa
    vc_status_gizi?: string;
    // Khusus Anak (RI & RJ)
    vc_pb?: string; // Khusus RI & RJ Anak
    vc_bb_pb?: string; // Khusus RI Anak
    vc_bb_tb?: string;
    vc_bb_u?: string; // Khusus RJ Anak
    vc_bb_bp?: string;
    vc_pb_tb?: string;
    // Khusus Dewasa (RI & RJ)
    vc_persen_lila?: string;
  };

  vc_biokimia?: string;
  vc_pemeriksaan_penunjang?: string;

  fisik_klinis?: {
    bt_edema?: string;
    bt_asites?: string;
    bt_nafsu_makan?: string;
    bt_gigi_geligi?: string;
    vc_fisik_lainnya?: string;
    // Khusus Anak (RI & RJ)
    bt_kesulitan_menghisap?: string;
    // RI & RJ (Anak dan Dewasa)
    vc_sistole?: string;
    vc_diastole?: string;
  };

  riwayat_personal?: {
    vc_pendidikan?: string;
    bt_suplemen_obat?: string;
    vc_suplemen_obat?: string;
    vc_riwayat_penyakit_keluarga?: string;
    vc_riwayat_penyakit_dulu?: string;
    vc_riwayat_penyakit_sekarang?: string;
    vc_masalah_cerna?: string;
    bt_perokok?: string;
    vc_pekerjaan?: string; // Khusus Dewasa (RI & RJ)
  };

  vc_diagnosis_gizi?: string;

  diagnosis?: Array<{
    vc_etiologi?: string;
    vc_sign_symptoms?: string;
    vc_rangkuman_diagnosis?: string;
    vc_problem?: string;
  }>;

  // Intervensi Gizi digabung karena ada variasi struktur RI (menggunakan sub-objek) dan RJ (flat)
  intervensi_gizi?: {
    // Properti Umum / RJ
    vc_jenis_makanan?: string;
    vc_jenis_diit?: string; // Digunakan di RJ
    vc_jadwal?: string; // Digunakan di RJ
    vc_tujuan_intervensi?: string; // Digunakan di RJ
    vc_makanan_dianjurkan?: string; // Digunakan di RJ (RI menaruhnya di root object aslinya, atau bisa fleksibel di sini)
    vc_makanan_tidak_dianjurkan?: string; // Digunakan di RJ
    bt_leaflet?: string; // Khusus RJ

    // Khusus Rawat Inap (RI) yang menggunakan sub-objek struktural
    jenis?: {
      vc_jenis_makanan?: string;
      vc_jenis_diit?: string;
      vc_bentuk?: string;
      vc_jadwal_pemberian_diit?: string;
      vc_jalur_makanan?: string;
    };
    modifikasi?: {
      vc_modifikasi_diit?: string;
      vc_bentuk?: string;
      vc_jadwal_pemberian_diit?: string;
      vc_jalur_makanan?: string;
    };
  };

  // Properti luar milik RI yang bisa diakses global jika dibutuhkan
  vc_makanan_dianjurkan?: string; // Cadangan properti root milik RI
  vc_makanan_tidak_dianjurkan?: string; // Cadangan properti root milik RI

  dt_tanggal?: Date;
  vc_nama_ahli_gizi?: string;
  bt_anak?: string; // Flag penanda Anak / Dewasa
  bt_aktif?: string;
  bt_ranap?: string;
}

export interface IMonitoringEvaluasi {
  vc_id?: string;
  vc_noreg: string;
  vc_norm: string;
  dt_tanggal_monev: string;
  vc_keterangan_monev: string;
  vc_nama_ahli_gizi?: string;
  bt_ranap?: string;
}
