import { poolPromise } from "../config/db";
import { logger } from "../utils/logger";
import { IAsuhanGiziAnakRI, IAsuhanGiziDewasaRI } from "../@types";

// GET shared untuk Anak & Dewasa RI
export const getAsuhanGiziRI = async (no_reg: string) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().input("no_reg", no_reg).query(`
        SELECT 
          a.vc_NoReg,
          a.vc_AlergiMakanan,
          a.vc_RiwayatPenyakitKeluarga,
          a.vc_RiwayatPenyakitDulu,
          a.vc_RiwayatKesehatanSkrg,
          NULL AS bt_PantangMakan, -- tidak ada di tabel
          NULL AS vc_PantangMakan, -- tidak ada di tabel
          c.vc_pendidikan, 
          d.vc_pekerjaan 
        FROM _ASKEPIGD_PengkajianPrimer a
        LEFT JOIN RMPasien b ON a.vc_NoRm = b.vc_no_rm
        LEFT JOIN PubPddk c ON b.vc_k_pend = c.vc_kode
        LEFT JOIN PubKerja d ON b.vc_k_pek = d.vc_kode
        WHERE a.vc_NoReg = @no_reg
        
        UNION ALL
        
        SELECT 
          a.vc_NoReg,
          a.vc_AlergiMakanan,
          NULL AS vc_RiwayatPenyakitKeluarga, -- tidak ada di tabel
          a.vc_RiwayatPenyakitDulu,
          a.vc_RiwayatKesehatanSkrg,
          a.bt_PantangMakan,
          a.vc_PantangMakan,
          c.vc_pendidikan, 
          d.vc_pekerjaan
        FROM _AskepRajal_PengkajianPrimer a
        LEFT JOIN RMPasien b ON a.vc_NoRm = b.vc_no_rm
        LEFT JOIN PubPddk c ON b.vc_k_pend = c.vc_kode
        LEFT JOIN PubKerja d ON b.vc_k_pek = d.vc_kode
        WHERE a.vc_NoReg = @no_reg
      `);
    return result.recordset;
  } catch (error) {
    logger.error("Error in getAsuhanGiziRI", error);
    throw error;
  }
};

// SAVE Asuhan Gizi Anak RI
export const saveAsuhanGiziAnakRI = async (data: IAsuhanGiziAnakRI) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    // Riwayat Gizi
    request.input("vc_pola_makan", data.riwayat_gizi?.vc_pola_makan);
    request.input("bt_diit_konseling", data.riwayat_gizi?.bt_diit_konseling);
    request.input("vc_diit_konseling", data.riwayat_gizi?.vc_diit_konseling);
    request.input("bt_alergi_makanan", data.riwayat_gizi?.bt_alergi_makanan);
    request.input("vc_alergi_makanan", data.riwayat_gizi?.vc_alergi_makanan);
    request.input(
      "bt_pantangan_makanan",
      data.riwayat_gizi?.bt_pantangan_makanan,
    );
    request.input(
      "vc_pantangan_makanan",
      data.riwayat_gizi?.vc_pantangan_makanan,
    );
    request.input(
      "bt_ketidaksukaan_makan",
      data.riwayat_gizi?.bt_ketidaksukaan_makan,
    );
    request.input(
      "vc_ketidaksukaan_makan",
      data.riwayat_gizi?.vc_ketidaksukaan_makan,
    );

    // Antropometri
    request.input("vc_bb", data.antropometri?.vc_bb);
    request.input("vc_pb", data.antropometri?.vc_pb);
    request.input("vc_tb", data.antropometri?.vc_tb);
    request.input("vc_imt", data.antropometri?.vc_imt);
    request.input("vc_bb_pb", data.antropometri?.vc_bb_pb);
    request.input("vc_bb_tb", data.antropometri?.vc_bb_tb);
    request.input("vc_lila", data.antropometri?.vc_lila);
    request.input("vc_status_gizi", data.antropometri?.vc_status_gizi);

    // Biokimia
    request.input("vc_biokimia", data.vc_biokimia);
    request.input("vc_pemeriksaan_penunjang", data.vc_pemeriksaan_penunjang);

    // Fisik Klinis
    request.input("bt_edema", data.fisik_klinis?.bt_edema);
    request.input("bt_asites", data.fisik_klinis?.bt_asites);
    request.input(
      "bt_kesulitan_menghisap",
      data.fisik_klinis?.bt_kesulitan_menghisap,
    );
    request.input("bt_nafsu_makan", data.fisik_klinis?.bt_nafsu_makan);
    request.input("bt_gigi_geligi", data.fisik_klinis?.bt_gigi_geligi);
    request.input("vc_fisik_lainnya", data.fisik_klinis?.vc_fisik_lainnya);

    // Riwayat Personal
    request.input("vc_pendidikan", data.riwayat_personal?.vc_pendidikan);
    request.input("bt_suplemen_obat", data.riwayat_personal?.bt_suplemen_obat);
    request.input("vc_suplemen_obat", data.riwayat_personal?.vc_suplemen_obat);
    request.input(
      "vc_riwayat_penyakit_keluarga",
      data.riwayat_personal?.vc_riwayat_penyakit_keluarga,
    );
    request.input(
      "vc_riwayat_penyakit_dulu",
      data.riwayat_personal?.vc_riwayat_penyakit_dulu,
    );
    request.input(
      "vc_riwayat_penyakit_sekarang",
      data.riwayat_personal?.vc_riwayat_penyakit_sekarang,
    );
    request.input("vc_masalah_cerna", data.riwayat_personal?.vc_masalah_cerna);

    request.input("vc_diagnosis_gizi", data.vc_diagnosis_gizi);

    request.input(
      "vc_tujuan_intervensi",
      data.intervensi_gizi?.vc_tujuan_intervensi,
    );
    //jenis
    request.input("vc_jenis_diit", data.intervensi_gizi?.jenis?.vc_jenis_diit);
    request.input(
      "vc_jenis_modifikasi_diit",
      data.intervensi_gizi?.jenis?.vc_modifikasi_diit,
    );
    request.input("vc_jenis_bentuk", data.intervensi_gizi?.jenis?.vc_bentuk);
    request.input(
      "vc_jenis_jadwal_pemberian_diit",
      data.intervensi_gizi?.jenis?.vc_jadwal_pemberian_diit,
    );
    request.input(
      "vc_jenis_jalur_makanan",
      data.intervensi_gizi?.jenis?.vc_jalur_makanan,
    );
    //modifikasi
    request.input(
      "vc_modifikasi_diit",
      data.intervensi_gizi?.modifikasi?.vc_modifikasi_diit,
    );
    request.input("vc_bentuk", data.intervensi_gizi?.modifikasi?.vc_bentuk);
    request.input(
      "vc_jadwal_pemberian_diit",
      data.intervensi_gizi?.modifikasi?.vc_jadwal_pemberian_diit,
    );
    request.input(
      "vc_jalur_makanan",
      data.intervensi_gizi?.modifikasi?.vc_jalur_makanan,
    );

    // Monitoring Evaluasi
    request.input("dt_tanggal_monev", data.monitoring_evaluasi?.dt_tanggal);
    request.input(
      "vc_keterangan_monev",
      data.monitoring_evaluasi?.vc_keterangan,
    );
    request.input("vc_paraf_monev", data.monitoring_evaluasi?.vc_paraf);

    // Additional Info
    request.input("dt_tanggal", data.dt_tanggal);
    request.input("vc_nama_ahli_gizi", data.vc_nama_ahli_gizi);
    request.input("vc_no_reg", data.vc_no_reg);
    request.input("bt_anak", data.bt_anak);

    await request.query(`
      INSERT INTO AsuhanGiziRI (
        vc_no_reg, vc_pola_makan, bt_diit_konseling, vc_diit_konseling, bt_alergi_makanan, vc_alergi_makanan,
        bt_pantangan_makanan, vc_pantangan_makanan, bt_ketidaksukaan_makan, vc_ketidaksukaan_makan,
        vc_bb, vc_pb, vc_tb, vc_imt, vc_bb_pb, vc_bb_tb, vc_lila, vc_status_gizi, vc_biokimia, vc_pemeriksaan_penunjang,
        bt_edema, bt_asites, bt_kesulitan_menghisap, bt_nafsu_makan, bt_gigi_geligi, vc_fisik_lainnya,
        vc_pendidikan, bt_suplemen_obat, vc_suplemen_obat, vc_riwayat_penyakit_keluarga, vc_riwayat_penyakit_dulu,
        vc_riwayat_penyakit_sekarang, vc_masalah_cerna, vc_diagnosis_gizi, vc_tujuan_intervensi,
        vc_jenis_diit, vc_jenis_modifikasi_diit, vc_jenis_bentuk, vc_jenis_jadwal_pemberian_diit, vc_jenis_jalur_makanan,
        vc_modifikasi_diit, vc_bentuk, vc_jadwal_pemberian_diit, vc_jalur_makanan,
        dt_tanggal_monev, vc_keterangan_monev, vc_paraf_monev, dt_tanggal, vc_nama_ahli_gizi, bt_anak
      ) VALUES (
        @vc_no_reg, @vc_pola_makan, @bt_diit_konseling, @vc_diit_konseling, @bt_alergi_makanan, @vc_alergi_makanan,
        @bt_pantangan_makanan, @vc_pantangan_makanan, @bt_ketidaksukaan_makan, @vc_ketidaksukaan_makan,
        @vc_bb, @vc_pb, @vc_tb, @vc_imt, @vc_bb_pb, @vc_bb_tb, @vc_lila, @vc_status_gizi, @vc_biokimia, @vc_pemeriksaan_penunjang,
        @bt_edema, @bt_asites, @bt_kesulitan_menghisap, @bt_nafsu_makan, @bt_gigi_geligi, @vc_fisik_lainnya,
        @vc_pendidikan, @bt_suplemen_obat, @vc_suplemen_obat, @vc_riwayat_penyakit_keluarga, @vc_riwayat_penyakit_dulu,
        @vc_riwayat_penyakit_sekarang, @vc_masalah_cerna, @vc_diagnosis_gizi, @vc_tujuan_intervensi,
        @vc_jenis_diit, @vc_jenis_modifikasi_diit, @vc_jenis_bentuk, @vc_jenis_jadwal_pemberian_diit, @vc_jenis_jalur_makanan,
        @vc_modifikasi_diit, @vc_bentuk, @vc_jadwal_pemberian_diit, @vc_jalur_makanan,
        @dt_tanggal_monev, @vc_keterangan_monev, @vc_paraf_monev, @dt_tanggal, @vc_nama_ahli_gizi, @bt_anak
      )
    `);
  } catch (error) {
    logger.error("Error in saveAsuhanGiziAnakRI", error);
    throw error;
  }
};

// SAVE Asuhan Gizi Dewasa RI
export const saveAsuhanGiziDewasaRI = async (data: IAsuhanGiziDewasaRI) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    // Mapping inputs
    request.input("vc_no_reg", data.vc_no_reg);

    // Antropometri
    request.input("vc_bb", data.antropometri?.vc_bb);
    request.input("vc_tb", data.antropometri?.vc_tb);
    request.input("vc_lila", data.antropometri?.vc_lila);
    request.input("vc_imt", data.antropometri?.vc_imt);
    request.input("vc_persen_lila", data.antropometri?.vc_persen_lila);
    request.input("vc_status_gizi", data.antropometri?.vc_status_gizi);

    request.input("vc_biokimia", data.vc_biokimia);
    request.input("vc_pemeriksaan_penunjang", data.vc_pemeriksaan_penunjang);

    // Fisik Klinis
    request.input("vc_td", data.fisik_klinis?.vc_td);
    request.input("bt_nafsu_makan", data.fisik_klinis?.bt_nafsu_makan);
    request.input("bt_edema", data.fisik_klinis?.bt_edema);
    request.input("bt_gigi_geligi", data.fisik_klinis?.bt_gigi_geligi);
    request.input("bt_asites", data.fisik_klinis?.bt_asites);
    request.input("vc_fisik_lainnya", data.fisik_klinis?.vc_fisik_lainnya);

    // Riwayat Gizi
    request.input("vc_pola_makan", data.riwayat_gizi?.vc_pola_makan);
    request.input("bt_diit_konseling", data.riwayat_gizi?.bt_diit_konseling);
    request.input("vc_diit_konseling", data.riwayat_gizi?.vc_diit_konseling);
    request.input("bt_alergi_makanan", data.riwayat_gizi?.bt_alergi_makanan);
    request.input("vc_alergi_makanan", data.riwayat_gizi?.vc_alergi_makanan);
    request.input(
      "bt_pantangan_makanan",
      data.riwayat_gizi?.bt_pantangan_makanan,
    );
    request.input(
      "vc_pantangan_makanan",
      data.riwayat_gizi?.vc_pantangan_makanan,
    );
    request.input(
      "bt_ketidaksukaan_makan",
      data.riwayat_gizi?.bt_ketidaksukaan_makan,
    );
    request.input(
      "vc_ketidaksukaan_makan",
      data.riwayat_gizi?.vc_ketidaksukaan_makan,
    );

    // Riwayat Personal
    request.input("vc_pekerjaan", data.riwayat_personal?.vc_pekerjaan);
    request.input("vc_pendidikan", data.riwayat_personal?.vc_pendidikan);
    request.input(
      "vc_riwayat_penyakit_keluarga",
      data.riwayat_personal?.vc_riwayat_penyakit_keluarga,
    );
    request.input(
      "vc_riwayat_penyakit_dulu",
      data.riwayat_personal?.vc_riwayat_penyakit_dulu,
    );
    request.input(
      "vc_riwayat_penyakit_sekarang",
      data.riwayat_personal?.vc_riwayat_penyakit_sekarang,
    );
    request.input("vc_masalah_cerna", data.riwayat_personal?.vc_masalah_cerna);
    request.input("bt_perokok", data.riwayat_personal?.bt_perokok);
    request.input("bt_suplemen_obat", data.riwayat_personal?.bt_suplemen_obat);
    request.input("vc_suplemen_obat", data.riwayat_personal?.vc_suplemen_obat);

    request.input("vc_diagnosis_gizi", data.vc_diagnosis_gizi);
    request.input(
      "vc_tujuan_intervensi",
      data.intervensi_gizi?.vc_tujuan_intervensi,
    );
    //jenis
    request.input("vc_jenis_diit", data.intervensi_gizi?.jenis?.vc_jenis_diit);
    request.input(
      "vc_jenis_modifikasi_diit",
      data.intervensi_gizi?.jenis?.vc_modifikasi_diit,
    );
    request.input("vc_jenis_bentuk", data.intervensi_gizi?.jenis?.vc_bentuk);
    request.input(
      "vc_jenis_jadwal_pemberian_diit",
      data.intervensi_gizi?.jenis?.vc_jadwal_pemberian_diit,
    );
    request.input(
      "vc_jenis_jalur_makanan",
      data.intervensi_gizi?.jenis?.vc_jalur_makanan,
    );
    //modifikasi
    request.input(
      "vc_modifikasi_diit",
      data.intervensi_gizi?.modifikasi?.vc_modifikasi_diit,
    );
    request.input("vc_bentuk", data.intervensi_gizi?.modifikasi?.vc_bentuk);
    request.input(
      "vc_jadwal_pemberian_diit",
      data.intervensi_gizi?.modifikasi?.vc_jadwal_pemberian_diit,
    );
    request.input(
      "vc_jalur_makanan",
      data.intervensi_gizi?.modifikasi?.vc_jalur_makanan,
    );

    // Monitoring Evaluasi
    request.input("dt_tanggal_monev", data.monitoring_evaluasi?.dt_tanggal);
    request.input(
      "vc_keterangan_monev",
      data.monitoring_evaluasi?.vc_keterangan,
    );
    request.input("vc_paraf_monev", data.monitoring_evaluasi?.vc_paraf);

    request.input("dt_tanggal", data.dt_tanggal);
    request.input("vc_nama_ahli_gizi", data.vc_nama_ahli_gizi);
    request.input("bt_anak", data.bt_anak);

    await request.query(`
      INSERT INTO AsuhanGiziRI (
        vc_no_reg, vc_pola_makan, bt_diit_konseling, vc_diit_konseling, bt_alergi_makanan, vc_alergi_makanan,
        bt_pantangan_makanan, vc_pantangan_makanan, bt_ketidaksukaan_makan, vc_ketidaksukaan_makan,
        vc_bb, vc_tb, vc_imt, vc_lila, vc_status_gizi, vc_persen_lila, vc_biokimia, vc_pemeriksaan_penunjang,
        vc_td, bt_edema, bt_asites, bt_nafsu_makan, bt_gigi_geligi, vc_fisik_lainnya,
        vc_pendidikan, vc_pekerjaan, bt_perokok, bt_suplemen_obat, vc_suplemen_obat, vc_riwayat_penyakit_keluarga, vc_riwayat_penyakit_dulu,
        vc_riwayat_penyakit_sekarang, vc_masalah_cerna, vc_diagnosis_gizi, vc_tujuan_intervensi,
        vc_jenis_diit, vc_jenis_modifikasi_diit, vc_jenis_bentuk, vc_jenis_jadwal_pemberian_diit, vc_jenis_jalur_makanan,
        vc_modifikasi_diit, vc_bentuk, vc_jadwal_pemberian_diit, vc_jalur_makanan,
        dt_tanggal_monev, vc_keterangan_monev, vc_paraf_monev, dt_tanggal, vc_nama_ahli_gizi, bt_anak
      ) VALUES (
        @vc_no_reg, @vc_pola_makan, @bt_diit_konseling, @vc_diit_konseling, @bt_alergi_makanan, @vc_alergi_makanan,
        @bt_pantangan_makanan, @vc_pantangan_makanan, @bt_ketidaksukaan_makan, @vc_ketidaksukaan_makan,
        @vc_bb, @vc_tb, @vc_imt, @vc_lila, @vc_status_gizi, @vc_persen_lila, @vc_biokimia, @vc_pemeriksaan_penunjang,
        @vc_td, @bt_edema, @bt_asites, @bt_nafsu_makan, @bt_gigi_geligi, @vc_fisik_lainnya,
        @vc_pendidikan, @vc_pekerjaan, @bt_perokok, @bt_suplemen_obat, @vc_suplemen_obat, @vc_riwayat_penyakit_keluarga, @vc_riwayat_penyakit_dulu,
        @vc_riwayat_penyakit_sekarang, @vc_masalah_cerna, @vc_diagnosis_gizi, @vc_tujuan_intervensi,
        @vc_jenis_diit, @vc_jenis_modifikasi_diit, @vc_jenis_bentuk, @vc_jenis_jadwal_pemberian_diit, @vc_jenis_jalur_makanan,
        @vc_modifikasi_diit, @vc_bentuk, @vc_jadwal_pemberian_diit, @vc_jalur_makanan,
        @dt_tanggal_monev, @vc_keterangan_monev, @vc_paraf_monev, @dt_tanggal, @vc_nama_ahli_gizi, @bt_anak
      )
    `);
  } catch (error) {
    logger.error("Error in saveAsuhanGiziDewasaRI", error);
    throw error;
  }
};
