import { poolPromise } from "../config/db";
import { logger } from "../utils/logger";
import { hitungUmurDetail } from "../utils/ageHelper";

export const getPasienRJ = async (tanggal?: string) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    let query = `
        SELECT 
          a.VC_NO_REGJ, 
          b.vc_no_rm, 
          b.vc_no_ktp, 
          b.dt_tgl_lhr,
          b.vc_nama_p,
          c.vc_N_KLINIK,
          d.vc_pekerjaan,
          e.vc_pendidikan,
          CASE 
            WHEN ag.vc_no_reg IS NOT NULL THEN 'SUDAH'
            ELSE 'BELUM'
          END AS status_asuhan
        FROM RMKUNJUNG a 
        LEFT JOIN RMPasien b ON a.VC_NO_RM = b.vc_no_rm
        LEFT JOIN RMKLINIK c ON a.VC_K_KLINIK = c.vc_K_KLINIK
        LEFT JOIN PubKerja d ON b.vc_k_pek = d.vc_kode
        LEFT JOIN PubPddk e ON b.vc_k_pend = e.vc_kode
        LEFT JOIN _GiziAsuhanGiziRJ ag ON a.VC_NO_REGJ = ag.vc_no_reg AND ag.bt_aktif = '1'
        WHERE a.vc_K_KLINIK = '2200'
    `;

    if (tanggal) {
      query += ` AND a.DT_TGL_REG = @tanggal`;
      request.input("tanggal", tanggal);
    }

    const result = await request.query(query);
    const pasienList = result.recordset;

    // --- PROSES MENGHITUNG UMUR DETAIL DI SINI ---
    const pasienDenganUmur = pasienList.map((pasien: any) => {
      if (pasien.dt_tgl_lhr) {
        const detailUmur = hitungUmurDetail(pasien.dt_tgl_lhr);
        return {
          ...pasien,
          umur_tahun: detailUmur.tahun,
          umur_bulan: detailUmur.bulan,
          umur_hari: detailUmur.hari,
        };
      }

      // Default jika data dt_tgl_lhr kosong/null
      return {
        ...pasien,
        umur_tahun: 0,
        umur_bulan: 0,
        umur_hari: 0,
      };
    });

    return pasienDenganUmur;

  } catch (error) {
    logger.error("Error in getPasienRJ", error);
    throw error;
  }
};