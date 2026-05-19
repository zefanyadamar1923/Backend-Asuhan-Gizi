import { poolPromise } from '../config/db';
import { logger } from '../utils/logger';
import { IAsuhanGiziAnakRJ, IAsuhanGiziDewasaRJ } from '../@types';

export const getAsuhanGiziRJ = async (no_reg: string) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('no_reg', no_reg)
      .query(`
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
    logger.error('Error in getAsuhanGiziRJ', error);
    throw error;
  }
};

export const saveAsuhanGiziAnakRJ = async (data: IAsuhanGiziAnakRJ) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    // Mapping inputs
    request.input('vc_no_reg', data.vc_no_reg);
    request.input('vc_dokter_pengirim', data.vc_dokter_pengirim);
    request.input('vc_diagnosa_medis', data.vc_diagnosa_medis);

    //Antropometri
    request.input('vc_bb', data.antropometri?.vc_bb);
    request.input('vc_pb', data.antropometri?.vc_pb);
    request.input('vc_tb', data.antropometri?.vc_tb);
    request.input('vc_bb_pb', data.antropometri?.vc_bb_pb);
    request.input('vc_bb_u', data.antropometri?.vc_bb_u);
    request.input('vc_pb_tb', data.antropometri?.vc_pb_tb);
    request.input('vc_lila', data.antropometri?.vc_lila);
    request.input('vc_status_gizi', data.antropometri?.vc_status_gizi);
    request.input('vc_imt', data.antropometri?.vc_imt);

    //biokimia
    request.input('vc_biokimia', data.vc_biokimia);
    request.input('vc_pemeriksaan_penunjang', data.vc_pemeriksaan_penunjang);

    //fisik klinis
    request.input('bt_edema', data.fisik_klinis?.bt_edema);
    request.input('bt_nafsu_makan', data.fisik_klinis?.bt_nafsu_makan);
    request.input('bt_asites', data.fisik_klinis?.bt_asites);
    request.input('bt_gigi_geligi', data.fisik_klinis?.bt_gigi_geligi);
    request.input('bt_kesulitan_menghisap', data.fisik_klinis?.bt_kesulitan_menghisap);
    request.input('vc_fisik_lainnya', data.fisik_klinis?.vc_fisik_lainnya);

    //riwayat gizi
    request.input('vc_pola_makan', data.riwayat_gizi?.vc_pola_makan);
    request.input('bt_diit_konseling', data.riwayat_gizi?.bt_diit_konseling);
    request.input('vc_diit_konseling', data.riwayat_gizi?.vc_diit_konseling);
    request.input('bt_alergi_makanan', data.riwayat_gizi?.bt_alergi_makanan);
    request.input('vc_alergi_makanan', data.riwayat_gizi?.vc_alergi_makanan);
    request.input('bt_pantangan_makanan', data.riwayat_gizi?.bt_pantangan_makanan);
    request.input('vc_pantangan_makanan', data.riwayat_gizi?.vc_pantangan_makanan);
    request.input('bt_ketidaksukaan_makan', data.riwayat_gizi?.bt_ketidaksukaan_makan);
    request.input('vc_ketidaksukaan_makan', data.riwayat_gizi?.vc_ketidaksukaan_makan);
    
    //riwayat personal
    request.input('vc_pekerjaan', data.riwayat_personal?.vc_pekerjaan);
    request.input('vc_pendidikan', data.riwayat_personal?.vc_pendidikan);
    request.input('vc_riwayat_penyakit_keluarga', data.riwayat_personal?.vc_riwayat_penyakit_keluarga);
    request.input('vc_riwayat_penyakit_dulu', data.riwayat_personal?.vc_riwayat_penyakit_dulu);
    request.input('vc_riwayat_penyakit_sekarang', data.riwayat_personal?.vc_riwayat_penyakit_sekarang);
    request.input('vc_masalah_cerna', data.riwayat_personal?.vc_masalah_cerna);
    request.input('bt_perokok', data.riwayat_personal?.bt_perokok);
    request.input('bt_suplemen_obat', data.riwayat_personal?.bt_suplemen_obat);
    request.input('vc_suplemen_obat', data.riwayat_personal?.vc_suplemen_obat);

    //diagnosis gizi
    request.input('vc_diagnosis_gizi', data.vc_diagnosis_gizi);

    //intervensi gizi
    request.input('vc_jenis_diit', data.intervensi_gizi?.vc_jenis_diit);
    request.input('vc_tujuan', data.intervensi_gizi?.vc_tujuan);
    request.input('vc_jadwal', data.intervensi_gizi?.vc_jadwal);
    request.input('vc_makanan_dianjurkan', data.intervensi_gizi?.vc_makanan_dianjurkan);
    request.input('vc_makanan_tidak_dianjurkan', data.intervensi_gizi?.vc_makanan_tidak_dianjurkan);
    request.input('bt_leaflet', data.intervensi_gizi?.bt_leaflet);

    //monitoring dan evaluasi
    request.input('dt_tanggal_monev', data.monitoring_evaluasi?.dt_tanggal);
    request.input('vc_pola_makan_monev', data.monitoring_evaluasi?.vc_pola_makan);
    request.input('vc_keterangan_monev', data.monitoring_evaluasi?.vc_keterangan);

    request.input('dt_tanggal', data.dt_tanggal);
    request.input('vc_nama_ahli_gizi', data.vc_nama_ahli_gizi);
    request.input('bt_anak', data.bt_anak);

    await request.query(`
      INSERT INTO AsuhanGiziRJ (
        vc_no_reg, vc_dokter_pengirim, vc_diagnosa_medis, vc_bb, vc_pb, vc_tb, vc_bb_pb, vc_bb_u, vc_pb_tb, vc_lila, vc_status_gizi, vc_imt,
        vc_biokimia, vc_pemeriksaan_penunjang, bt_edema, bt_nafsu_makan, bt_asites, bt_gigi_geligi, bt_kesulitan_menghisap,
        vc_fisik_lainnya, vc_pola_makan, bt_diit_konseling, vc_diit_konseling, bt_alergi_makanan, vc_alergi_makanan,
        bt_pantangan_makanan, vc_pantangan_makanan, bt_ketidaksukaan_makan, vc_ketidaksukaan_makan,
        vc_pekerjaan, vc_pendidikan, vc_riwayat_penyakit_keluarga, vc_riwayat_penyakit_dulu, vc_riwayat_penyakit_sekarang,
        vc_masalah_cerna, bt_perokok, bt_suplemen_obat, vc_suplemen_obat, vc_diagnosis_gizi, vc_jenis_diit, vc_tujuan,
        vc_jadwal, vc_makanan_dianjurkan, vc_makanan_tidak_dianjurkan, bt_leaflet, dt_tanggal_monev, vc_pola_makan_monev,
        vc_keterangan_monev, dt_tanggal, vc_nama_ahli_gizi, bt_anak
      ) VALUES (
        @vc_no_reg, @vc_dokter_pengirim, @vc_diagnosa_medis, @vc_bb, @vc_pb, @vc_tb, @vc_bb_pb, @vc_bb_u, @vc_pb_tb, @vc_lila, @vc_status_gizi, @vc_imt,
        @vc_biokimia, @vc_pemeriksaan_penunjang, @bt_edema, @bt_nafsu_makan, @bt_asites, @bt_gigi_geligi, @bt_kesulitan_menghisap,
        @vc_fisik_lainnya, @vc_pola_makan, @bt_diit_konseling, @vc_diit_konseling, @bt_alergi_makanan, @vc_alergi_makanan,
        @bt_pantangan_makanan, @vc_pantangan_makanan, @bt_ketidaksukaan_makan, @vc_ketidaksukaan_makan,
        @vc_pekerjaan, @vc_pendidikan, @vc_riwayat_penyakit_keluarga, @vc_riwayat_penyakit_dulu, @vc_riwayat_penyakit_sekarang,
        @vc_masalah_cerna, @bt_perokok, @bt_suplemen_obat, @vc_suplemen_obat, @vc_diagnosis_gizi, @vc_jenis_diit, @vc_tujuan,
        @vc_jadwal, @vc_makanan_dianjurkan, @vc_makanan_tidak_dianjurkan, @bt_leaflet, @dt_tanggal_monev, @vc_pola_makan_monev,
        @vc_keterangan_monev, @dt_tanggal, @vc_nama_ahli_gizi, @bt_anak
      )
    `);
  } catch (error) {
    logger.error('Error in saveAsuhanGiziAnakRJ', error);
    throw error;
  }
};

export const saveAsuhanGiziDewasaRJ = async (data: IAsuhanGiziDewasaRJ) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    // Mapping inputs
    request.input('vc_no_reg', data.vc_no_reg);

    request.input('vc_bb', data.vc_bb);
    request.input('vc_tb', data.vc_tb);
    request.input('vc_bbi', data.vc_bbi);
    request.input('vc_lila', data.vc_lila);
    request.input('vc_imt', data.vc_imt);
    request.input('vc_persen_lila', data.vc_persen_lila);
    request.input('vc_status_gizi', data.vc_status_gizi);

    request.input('vc_dokter_pengirim', data.vc_dokter_pengirim);
    request.input('vc_diagnosa_medis', data.vc_diagnosa_medis);
    
    //assessment
    request.input('vc_anamnesa_riwayat_makan', data.asesmen_gizi?.vc_anamnesa_riwayat_makan);
    request.input('bt_diit_konseling', data.asesmen_gizi?.bt_diit_konseling);
    request.input('vc_diit_konseling', data.asesmen_gizi?.vc_diit_konseling);
    request.input('bt_alergi_makanan', data.asesmen_gizi?.bt_alergi_makanan);
    request.input('vc_alergi_makanan', data.asesmen_gizi?.vc_alergi_makanan);
    request.input('bt_pantangan_makanan', data.asesmen_gizi?.bt_pantangan_makanan);
    request.input('vc_pantangan_makanan', data.asesmen_gizi?.vc_pantangan_makanan);
    request.input('bt_ketidaksukaan_makan', data.asesmen_gizi?.bt_ketidaksukaan_makan);
    request.input('vc_ketidaksukaan_makan', data.asesmen_gizi?.vc_ketidaksukaan_makan);

    //riwayat personal
    request.input('vc_pekerjaan', data.riwayat_personal?.vc_pekerjaan);
    request.input('vc_pendidikan', data.riwayat_personal?.vc_pendidikan);
    request.input('vc_riwayat_penyakit_keluarga', data.riwayat_personal?.vc_riwayat_penyakit_keluarga);
    request.input('vc_riwayat_penyakit_dulu', data.riwayat_personal?.vc_riwayat_penyakit_dulu);
    request.input('vc_riwayat_penyakit_sekarang', data.riwayat_personal?.vc_riwayat_penyakit_sekarang);
    request.input('vc_masalah_cerna', data.riwayat_personal?.vc_masalah_cerna);
    request.input('bt_perokok', data.riwayat_personal?.bt_perokok);
    request.input('bt_suplemen_obat', data.riwayat_personal?.bt_suplemen_obat);
    request.input('vc_suplemen_obat', data.riwayat_personal?.vc_suplemen_obat);

    //fisik klinis
    request.input('vc_td', data.fisik_klinis?.vc_td);
    request.input('bt_nafsu_makan', data.fisik_klinis?.bt_nafsu_makan);
    request.input('bt_edema', data.fisik_klinis?.bt_edema);
    request.input('bt_asites', data.fisik_klinis?.bt_asites);

    request.input('vc_biokimia', data.vc_biokimia);
    request.input('vc_pemeriksaan_penunjang', data.vc_pemeriksaan_penunjang);

    request.input('vc_diagnosis_gizi', data.vc_diagnosis_gizi);

    //intervensi gizi
    request.input('vc_jenis_diit', data.intervensi_gizi?.vc_jenis_diit);
    request.input('vc_tujuan', data.intervensi_gizi?.vc_tujuan);
    request.input('vc_jadwal', data.intervensi_gizi?.vc_jadwal);
    request.input('vc_makanan_dianjurkan', data.intervensi_gizi?.vc_makanan_dianjurkan);
    request.input('vc_makanan_tidak_dianjurkan', data.intervensi_gizi?.vc_makanan_tidak_dianjurkan);
    request.input('bt_leaflet', data.intervensi_gizi?.bt_leaflet);

    //monitoring evaluasi
    request.input('dt_tanggal_monev', data.monitoring_evaluasi?.dt_tanggal);
    request.input('vc_pola_makan_monev', data.monitoring_evaluasi?.vc_pola_makan);
    request.input('vc_keterangan_monev', data.monitoring_evaluasi?.vc_keterangan);

    request.input('dt_tanggal', data.dt_tanggal);
    request.input('vc_nama_ahli_gizi', data.vc_nama_ahli_gizi);
    request.input('bt_anak', data.bt_anak);

    await request.query(`
      INSERT INTO AsuhanGiziRJ (
        vc_no_reg, vc_bb, vc_tb, vc_bbi, vc_lila, vc_imt, vc_status_gizi, vc_dokter_pengirim, vc_diagnosa_medis,
        vc_anamnesa_riwayat_makan, bt_diit_konseling, vc_diit_konseling, bt_alergi_makanan, vc_alergi_makanan,
        bt_pantangan_makanan, vc_pantangan_makanan, bt_ketidaksukaan_makan, vc_ketidaksukaan_makan,
        vc_pekerjaan, vc_pendidikan, vc_riwayat_penyakit_keluarga, vc_riwayat_penyakit_dulu, vc_riwayat_penyakit_sekarang,
        vc_masalah_cerna, bt_perokok, bt_suplemen_obat, vc_suplemen_obat, vc_td, bt_nafsu_makan, bt_edema, bt_asites,
        vc_biokimia, vc_pemeriksaan_penunjang, vc_diagnosis_gizi, vc_jenis_diit, vc_tujuan, vc_jadwal,
        vc_makanan_dianjurkan, vc_makanan_tidak_dianjurkan, bt_leaflet, dt_tanggal_monev, vc_pola_makan_monev,
        vc_keterangan_monev, dt_tanggal, vc_nama_ahli_gizi, bt_anak
      ) VALUES (
        @vc_no_reg, @vc_bb, @vc_tb, @vc_bbi, @vc_lila, @vc_imt, @vc_status_gizi, @vc_dokter_pengirim, @vc_diagnosa_medis,
        @vc_anamnesa_riwayat_makan, @bt_diit_konseling, @vc_diit_konseling, @bt_alergi_makanan, @vc_alergi_makanan,
        @bt_pantangan_makanan, @vc_pantangan_makanan, @bt_ketidaksukaan_makan, @vc_ketidaksukaan_makan,
        @vc_pekerjaan, @vc_pendidikan, @vc_riwayat_penyakit_keluarga, @vc_riwayat_penyakit_dulu, @vc_riwayat_penyakit_sekarang,
        @vc_masalah_cerna, @bt_perokok, @bt_suplemen_obat, @vc_suplemen_obat, @vc_td, @bt_nafsu_makan, @bt_edema, @bt_asites,
        @vc_biokimia, @vc_pemeriksaan_penunjang, @vc_diagnosis_gizi, @vc_jenis_diit, @vc_tujuan, @vc_jadwal,
        @vc_makanan_dianjurkan, @vc_makanan_tidak_dianjurkan, @bt_leaflet, @dt_tanggal_monev, @vc_pola_makan_monev,
        @vc_keterangan_monev, @dt_tanggal, @vc_nama_ahli_gizi, @bt_anak
      )
    `);
  } catch (error) {
    logger.error('Error in saveAsuhanGiziDewasaRJ', error);
    throw error;
  }
};
