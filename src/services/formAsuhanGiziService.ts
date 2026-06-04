import { poolPromise } from "../config/db";
import { logger } from "../utils/logger";
import { IAsuhanGizi } from "../@types";
import * as crypto from "crypto";

// GET shared untuk Anak & Dewasa RI & RJ
export const getAsuhanGizi = async (no_reg: string) => {
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
          NULL AS bt_PantangMakan, 
          NULL AS vc_PantangMakan, 
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
          NULL AS vc_RiwayatPenyakitKeluarga, 
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
    logger.error("Error in getAsuhanGizi", error);
    throw error;
  }
};

// Mengambil semua data RI & RJ dalam satu tabel resmi target (_Gizi_AsuhanGizi)
// beserta array diagnosis dari _Gizi_AsuhanGizi_Diagnosis
export const getSaveAsuhanGizi = async (vc_no_reg: string) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().input("vc_no_reg", vc_no_reg).query(`
      SELECT
        a.*,
        d.vc_etiologi,
        d.vc_sign_symptoms,
        d.vc_rangkuman_diagnosis
      FROM _Gizi_AsuhanGizi a
      LEFT JOIN _Gizi_AsuhanGizi_Diagnosis d ON a.vc_id = d.vc_id_asuhan
      WHERE a.vc_no_reg = @vc_no_reg AND a.bt_aktif = '1'
    `);

    const rows = result.recordset;
    if (!rows || rows.length === 0) return null;

    // Group diagnosis rows ke dalam satu objek asuhan
    const asuhan = { ...rows[0] };

    // Hapus kolom diagnosis dari objek root
    delete asuhan.vc_etiologi;
    delete asuhan.vc_sign_symptoms;
    delete asuhan.vc_rangkuman_diagnosis;

    // Kumpulkan semua baris diagnosis (jika ada)
    asuhan.diagnosis = rows
      .filter((r: any) => r.vc_etiologi !== null || r.vc_sign_symptoms !== null || r.vc_rangkuman_diagnosis !== null)
      .map((r: any) => ({
        vc_etiologi: r.vc_etiologi,
        vc_sign_symptoms: r.vc_sign_symptoms,
        vc_rangkuman_diagnosis: r.vc_rangkuman_diagnosis,
      }));

    return asuhan;
  } catch (error) {
    logger.error("Error in getSaveAsuhanGizi", error);
    throw error;
  }
};

// SAVE Asuhan Gizi RI & RJ (Gabungan Anak, Dewasa, RI, dan RJ)
export const saveAsuhanGizi = async (data: IAsuhanGizi) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    // 1. Identitas & Info Utama
    const vc_id = crypto.randomUUID();
    request.input("vc_id", vc_id);
    request.input("vc_no_reg", data.vc_no_reg);
    request.input("vc_no_rm", data.vc_no_rm);
    request.input("vc_dokter_pengirim", data.vc_dokter_pengirim);
    request.input("vc_diagnosa_medis", data.vc_diagnosa_medis);

    // 2. Riwayat Gizi
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

    // 3. Antropometri
    request.input("vc_bb", data.antropometri?.vc_bb);
    request.input("vc_pb", data.antropometri?.vc_pb);
    request.input("vc_tb", data.antropometri?.vc_tb);
    request.input("vc_imt", data.antropometri?.vc_imt);
    request.input("vc_bbi", data.antropometri?.vc_bbi);
    request.input("vc_bb_pb", data.antropometri?.vc_bb_pb);
    request.input("vc_bb_tb", data.antropometri?.vc_bb_tb);
    request.input("vc_bb_u", data.antropometri?.vc_bb_u);
    request.input("vc_bb_bp", data.antropometri?.vc_bb_bp);
    request.input("vc_pb_tb", data.antropometri?.vc_pb_tb);
    request.input("vc_lila", data.antropometri?.vc_lila);
    request.input("vc_persen_lila", data.antropometri?.vc_persen_lila);
    request.input("vc_status_gizi", data.antropometri?.vc_status_gizi);

    // 4. Biokimia & Pemeriksaan Penunjang
    request.input("vc_biokimia", data.vc_biokimia);
    request.input("vc_pemeriksaan_penunjang", data.vc_pemeriksaan_penunjang);

    // 5. Fisik Klinis
    request.input("vc_sistole", data.fisik_klinis?.vc_sistole);
    request.input("vc_diastole", data.fisik_klinis?.vc_diastole);
    request.input("bt_edema", data.fisik_klinis?.bt_edema);
    request.input("bt_asites", data.fisik_klinis?.bt_asites);
    request.input(
      "bt_kesulitan_menghisap",
      data.fisik_klinis?.bt_kesulitan_menghisap,
    );
    request.input("bt_nafsu_makan", data.fisik_klinis?.bt_nafsu_makan);
    request.input("bt_gigi_geligi", data.fisik_klinis?.bt_gigi_geligi);
    request.input("vc_fisik_lainnya", data.fisik_klinis?.vc_fisik_lainnya);

    // 6. Riwayat Personal
    request.input("vc_pekerjaan", data.riwayat_personal?.vc_pekerjaan);
    request.input("vc_pendidikan", data.riwayat_personal?.vc_pendidikan);
    request.input("bt_perokok", data.riwayat_personal?.bt_perokok);
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

    // 7. Diagnosis Gizi
    request.input("vc_diagnosis_gizi", data.vc_diagnosis_gizi);

    // 8. Intervensi Gizi (Mapping Struktur RI & RJ)
    request.input(
      "vc_tujuan_intervensi",
      data.intervensi_gizi?.vc_tujuan_intervensi,
    );

    // Properti Intervensi RI (Nested) / RJ (Flat)
    request.input(
      "vc_jenis_makanan",
      data.intervensi_gizi?.jenis?.vc_jenis_makanan,
    );
    request.input("vc_jenis_diit", data.intervensi_gizi?.jenis?.vc_jenis_diit);
    request.input("vc_jenis_bentuk", data.intervensi_gizi?.jenis?.vc_bentuk);
    request.input(
      "vc_jenis_jadwal_pemberian_diit",
      data.intervensi_gizi?.jenis?.vc_jadwal_pemberian_diit,
    );
    request.input(
      "vc_jenis_jalur_makanan",
      data.intervensi_gizi?.jenis?.vc_jalur_makanan,
    );

    // Properti RJ Flat tambahan
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

    // Properti Modifikasi RI
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
    
    // 9. Informasi Audit Penutup
    request.input("dt_tanggal", data.dt_tanggal);
    request.input("vc_nama_ahli_gizi", data.vc_nama_ahli_gizi);
    request.input("bt_anak", data.bt_anak);
    request.input("bt_aktif", "1");
    request.input("bt_ranap", data.bt_ranap);

    // Nonaktifkan record lama di tabel gabungan tunggal `_Gizi_AsuhanGizi`
    await pool
      .request()
      .input("vc_no_reg_upd", data.vc_no_reg)
      .query(
        `UPDATE _Gizi_AsuhanGizi SET bt_aktif = '0' WHERE vc_no_reg = @vc_no_reg_upd`,
      );

    // Lakukan eksekusi query INSERT ke tabel gabungan
    await request.query(`
      INSERT INTO _Gizi_AsuhanGizi (
        vc_id, vc_no_reg, vc_no_rm, vc_dokter_pengirim, vc_diagnosa_medis,
        vc_pola_makan, bt_diit_konseling, vc_diit_konseling, bt_alergi_makanan, vc_alergi_makanan,
        bt_pantangan_makanan, vc_pantangan_makanan, bt_ketidaksukaan_makan, vc_ketidaksukaan_makan,
        vc_bb, vc_pb, vc_tb, vc_imt, vc_bbi, vc_bb_pb, vc_bb_tb, vc_bb_u, vc_bb_bp, vc_pb_tb, vc_lila, vc_persen_lila, vc_status_gizi, 
        vc_biokimia, vc_pemeriksaan_penunjang,
        vc_sistole, vc_diastole, bt_edema, bt_asites, bt_kesulitan_menghisap, bt_nafsu_makan, bt_gigi_geligi, vc_fisik_lainnya,
        vc_pekerjaan, vc_pendidikan, bt_perokok, bt_suplemen_obat, vc_suplemen_obat, vc_riwayat_penyakit_keluarga, vc_riwayat_penyakit_dulu,
        vc_riwayat_penyakit_sekarang, vc_masalah_cerna, vc_diagnosis_gizi, 
        vc_tujuan_intervensi, vc_jenis_makanan, vc_jenis_diit, vc_jenis_bentuk, vc_jenis_jadwal_pemberian_diit, vc_jenis_jalur_makanan,
        vc_jadwal, vc_makanan_dianjurkan, vc_makanan_tidak_dianjurkan, bt_leaflet,
        vc_modifikasi_diit, vc_bentuk, vc_jadwal_pemberian_diit, vc_jalur_makanan,
        dt_tanggal, vc_nama_ahli_gizi, bt_anak, bt_aktif, bt_ranap
      ) VALUES (
        @vc_id, @vc_no_reg, @vc_no_rm, @vc_dokter_pengirim, @vc_diagnosa_medis,
        @vc_pola_makan, @bt_diit_konseling, @vc_diit_konseling, @bt_alergi_makanan, @vc_alergi_makanan,
        @bt_pantangan_makanan, @vc_pantangan_makanan, @bt_ketidaksukaan_makan, @vc_ketidaksukaan_makan,
        @vc_bb, @vc_pb, @vc_tb, @vc_imt, @vc_bbi, @vc_bb_pb, @vc_bb_tb, @vc_bb_u, @vc_bb_bp, @vc_pb_tb, @vc_lila, @vc_persen_lila, @vc_status_gizi, 
        @vc_biokimia, @vc_pemeriksaan_penunjang,
        @vc_sistole, @vc_diastole, @bt_edema, @bt_asites, @bt_kesulitan_menghisap, @bt_nafsu_makan, @bt_gigi_geligi, @vc_fisik_lainnya,
        @vc_pekerjaan, @vc_pendidikan, @bt_perokok, @bt_suplemen_obat, @vc_suplemen_obat, @vc_riwayat_penyakit_keluarga, @vc_riwayat_penyakit_dulu,
        @vc_riwayat_penyakit_sekarang, @vc_masalah_cerna, @vc_diagnosis_gizi, 
        @vc_tujuan_intervensi, @vc_jenis_makanan, @vc_jenis_diit, @vc_jenis_bentuk, @vc_jenis_jadwal_pemberian_diit, @vc_jenis_jalur_makanan,
        @vc_jadwal, @vc_makanan_dianjurkan, @vc_makanan_tidak_dianjurkan, @bt_leaflet,
        @vc_modifikasi_diit, @vc_bentuk, @vc_jadwal_pemberian_diit, @vc_jalur_makanan,
        @dt_tanggal, @vc_nama_ahli_gizi, @bt_anak, @bt_aktif, @bt_ranap
      )
    `);

    // Insert data diagnosis jika ada
    if (data.diagnosis && Array.isArray(data.diagnosis) && data.diagnosis.length > 0) {
      for (const diag of data.diagnosis) {
        const reqDiag = pool.request();
        reqDiag.input("vc_id_asuhan", vc_id);
        reqDiag.input("vc_etiologi", diag.vc_etiologi);
        reqDiag.input("vc_sign_symptoms", diag.vc_sign_symptoms);
        reqDiag.input("vc_rangkuman_diagnosis", diag.vc_rangkuman_diagnosis);

        await reqDiag.query(`
          INSERT INTO _Gizi_AsuhanGizi_Diagnosis (
            vc_id_asuhan, vc_etiologi, vc_sign_symptoms, vc_rangkuman_diagnosis
          ) VALUES (
            @vc_id_asuhan, @vc_etiologi, @vc_sign_symptoms, @vc_rangkuman_diagnosis
          )
        `);
      }
    }
  } catch (error) {
    logger.error("Error in saveAsuhanGizi", error);
    throw error;
  }
};
