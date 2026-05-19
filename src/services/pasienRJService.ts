import { poolPromise } from "../config/db";
import { logger } from "../utils/logger";

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
          e.vc_pendidikan
        FROM RMKUNJUNG a 
        LEFT JOIN RMPasien b ON a.VC_NO_RM = b.vc_no_rm
        LEFT JOIN RMKLINIK c ON a.VC_K_KLINIK = c.vc_K_KLINIK
        LEFT JOIN PubKerja d ON b.vc_k_pek = d.vc_kode
        LEFT JOIN PubPddk e ON b.vc_k_pend = e.vc_kode
        WHERE a.vc_K_KLINIK = '2200'
    `;

    if (tanggal) {
      query += ` AND a.DT_TGL_REG = @tanggal`;
      request.input("tanggal", tanggal);
    }
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    logger.error("Error in getPasienRJ", error);
    throw error;
  }
};
