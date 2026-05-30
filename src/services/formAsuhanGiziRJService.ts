import { poolPromise } from "../config/db";
import { logger } from "../utils/logger";
import { IAsuhanGiziRJ } from "../@types";
import * as crypto from "crypto";

export const getAsuhanGiziRJ = async (no_reg: string) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().input("no_reg", no_reg).query(`
        SELECT 
          a.vc_NoReg,
          a.vc_AlergiMakanan,
          a.vc_RiwayatPenyakitKeluarga,
          a.vc_RiwayatPenyakitDulu,
          a.vc_RiwayatKesehatanSkrg,
          a.vc_Sistole,
          a.vc_Diastole,
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
          a.vc_Sistole,
          a.vc_Diastole,
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
    logger.error("Error in getAsuhanGiziRJ", error);
    throw error;
  }
};

export const getSaveAsuhanGiziRJ = async (vc_no_reg: string) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().input("vc_no_reg", vc_no_reg).query(`
      SELECT * FROM _GiziAsuhanGiziRJ WHERE vc_no_reg = @vc_no_reg and bt_aktif = '1'
    `);
    return result.recordset;
  } catch (error) {
    logger.error("Error in getSaveAsuhanGiziRJ", error);
    throw error;
  }
};

export const saveAsuhanGiziRJ = async (data: IAsuhanGiziRJ) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    // Mapping inputs
    const vc_id = crypto.randomUUID(); // selalu generate ID baru untuk record baru
    request.input("vc_id", vc_id);
    request.input("vc_no_reg", data.vc_no_reg);
    request.input("vc_no_rm", data.vc_no_rm);
    request.input("vc_dokter_pengirim", data.vc_dokter_pengirim);
    request.input("vc_diagnosa_medis", data.vc_diagnosa_medis);

    // Antropometri
    request.input("vc_bb", data.antropometri?.vc_bb);
    request.input("vc_pb", data.antropometri?.vc_pb);
    request.input("vc_tb", data.antropometri?.vc_tb);
    request.input("vc_bb_pb", data.antropometri?.vc_bb_pb);
    request.input("vc_bb_u", data.antropometri?.vc_bb_u);
    request.input("vc_pb_tb", data.antropometri?.vc_pb_tb);
    request.input("vc_lila", data.antropometri?.vc_lila);
    request.input("vc_status_gizi", data.antropometri?.vc_status_gizi);
    request.input("vc_imt", data.antropometri?.vc_imt);
    request.input("vc_bbi", data.antropometri?.vc_bbi);
    request.input("vc_persen_lila", data.antropometri?.vc_persen_lila);

    // Biokimia & Pemeriksaan Penunjang
    request.input("vc_biokimia", data.vc_biokimia);
    request.input("vc_pemeriksaan_penunjang", data.vc_pemeriksaan_penunjang);

    // Fisik Klinis
    request.input("bt_edema", data.fisik_klinis?.bt_edema);
    request.input("bt_nafsu_makan", data.fisik_klinis?.bt_nafsu_makan);
    request.input("bt_asites", data.fisik_klinis?.bt_asites);
    request.input("bt_gigi_geligi", data.fisik_klinis?.bt_gigi_geligi);
    request.input(
      "bt_kesulitan_menghisap",
      data.fisik_klinis?.bt_kesulitan_menghisap,
    );
    request.input("vc_fisik_lainnya", data.fisik_klinis?.vc_fisik_lainnya);
    request.input("vc_sistole", data.fisik_klinis?.vc_sistole);
    request.input("vc_diastole", data.fisik_klinis?.vc_diastole);

    // Riwayat Gizi (Gabungan Anak & Dewasa)
    request.input("vc_pola_makan", data.riwayat_gizi?.vc_pola_makan);
    request.input(
      "vc_anamnesa_riwayat_makan",
      data.riwayat_gizi?.vc_anamnesa_riwayat_makan,
    );
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

    // Diagnosis Gizi
    request.input("vc_diagnosis_gizi", data.vc_diagnosis_gizi);

    // Intervensi Gizi
    request.input("vc_jenis_makanan", data.intervensi_gizi?.vc_jenis_makanan);
    request.input("vc_jenis_diit", data.intervensi_gizi?.vc_jenis_diit);
    request.input("vc_tujuan", data.intervensi_gizi?.vc_tujuan);
    request.input("vc_jadwal", data.intervensi_gizi?.vc_jadwal);
    request.input(
      "vc_makanan_dianjurkan",
      data.intervensi_gizi?.vc_makanan_dianjurkan,
    );
    request.input(
      "vc_makanan_tidak_dianjurkan",
      data.intervensi_gizi?.vc_makanan_tidak_dianjurkan,
    );
    request.input("bt_leaflet", data.intervensi_gizi?.bt_leaflet);

    request.input("dt_tanggal", data.dt_tanggal);
    request.input("vc_nama_ahli_gizi", data.vc_nama_ahli_gizi);
    request.input("bt_anak", data.bt_anak);
    request.input("bt_aktif", '1'); // selalu '1' untuk record baru

    // Nonaktifkan semua record lama dengan no_reg yang sama
    await pool.request()
      .input("vc_no_reg_upd", data.vc_no_reg)
      .query(`UPDATE _GiziAsuhanGiziRJ SET bt_aktif = '0' WHERE vc_no_reg = @vc_no_reg_upd`);

    await request.query(`
      INSERT INTO _GiziAsuhanGiziRJ (
        vc_id, vc_no_reg, vc_no_rm, vc_dokter_pengirim, vc_diagnosa_medis, vc_bb, vc_pb, vc_tb, vc_bb_pb, vc_bb_u, vc_pb_tb, vc_lila, vc_status_gizi, vc_imt, vc_bbi,
        vc_biokimia, vc_pemeriksaan_penunjang, bt_edema, bt_nafsu_makan, bt_asites, bt_gigi_geligi, bt_kesulitan_menghisap,
        vc_fisik_lainnya, vc_sistole, vc_diastole, vc_pola_makan, vc_anamnesa_riwayat_makan, bt_diit_konseling, vc_diit_konseling, bt_alergi_makanan, vc_alergi_makanan,
        bt_pantangan_makanan, vc_pantangan_makanan, bt_ketidaksukaan_makan, vc_ketidaksukaan_makan,
        vc_pekerjaan, vc_pendidikan, vc_riwayat_penyakit_keluarga, vc_riwayat_penyakit_dulu, vc_riwayat_penyakit_sekarang,
        vc_masalah_cerna, bt_perokok, bt_suplemen_obat, vc_suplemen_obat, vc_diagnosis_gizi, vc_jenis_makanan, vc_jenis_diit, vc_tujuan,
        vc_jadwal, vc_makanan_dianjurkan, vc_makanan_tidak_dianjurkan, bt_leaflet, dt_tanggal, vc_nama_ahli_gizi, bt_anak, bt_aktif
      ) VALUES (
        @vc_id, @vc_no_reg, @vc_no_rm, @vc_dokter_pengirim, @vc_diagnosa_medis, @vc_bb, @vc_pb, @vc_tb, @vc_bb_pb, @vc_bb_u, @vc_pb_tb, @vc_lila, @vc_status_gizi, @vc_imt, @vc_bbi,
        @vc_biokimia, @vc_pemeriksaan_penunjang, @bt_edema, @bt_nafsu_makan, @bt_asites, @bt_gigi_geligi, @bt_kesulitan_menghisap,
        @vc_fisik_lainnya, @vc_sistole, @vc_diastole, @vc_pola_makan, @vc_anamnesa_riwayat_makan, @bt_diit_konseling, @vc_diit_konseling, @bt_alergi_makanan, @vc_alergi_makanan,
        @bt_pantangan_makanan, @vc_pantangan_makanan, @bt_ketidaksukaan_makan, @vc_ketidaksukaan_makan,
        @vc_pekerjaan, @vc_pendidikan, @vc_riwayat_penyakit_keluarga, @vc_riwayat_penyakit_dulu, @vc_riwayat_penyakit_sekarang,
        @vc_masalah_cerna, @bt_perokok, @bt_suplemen_obat, @vc_suplemen_obat, @vc_diagnosis_gizi, @vc_jenis_makanan, @vc_jenis_diit, @vc_tujuan,
        @vc_jadwal, @vc_makanan_dianjurkan, @vc_makanan_tidak_dianjurkan, @bt_leaflet, @dt_tanggal, @vc_nama_ahli_gizi, @bt_anak, @bt_aktif
      )
    `);
  } catch (error) {
    logger.error("Error in saveAsuhanGiziRJ", error);
    throw error;
  }
};
