import { poolPromise } from "../config/db";
import { logger } from "../utils/logger";

export const getPasienRI = async (
  gugus?: string,
  isPulang: boolean = false,
) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    if (gugus) {
      request.input("gugus", gugus);
    }

    let query = `
        SELECT 
          a.vc_no_reg, 
          a.vc_no_rm, 
          c.vc_no_ktp, 
          c.vc_nama_p, 
          c.dt_tgl_lhr, 
          b.vc_nama,
          a.vc_no_regj_ralan
        FROM RMP_inap a 
        LEFT JOIN RMKamar b ON (
          CASE 
            WHEN ISNULL(a.vc_kd_kamar_Mutasi, '') = '' THEN a.vc_kd_kamar_Masuk
            ELSE a.vc_kd_kamar_Mutasi
          END
        ) = b.vc_no_bed
        LEFT JOIN RMPasien c ON a.vc_no_rm = c.vc_no_rm
        WHERE (
          CASE 
            WHEN ISNULL(a.vc_kd_Ruang_mutasi, '') = '' THEN a.vc_kd_Ruang_masuk
            ELSE a.vc_kd_Ruang_mutasi
          END
        ) = @gugus
    `;

    if (isPulang) {
      query += ` AND a.dt_tgl_pul >= DATEADD(month, -7, GETDATE()) `;
    } else {
      query += ` AND a.dt_tgl_pul IS NULL`;
    }
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    logger.error("Error in getPasienRI", error);
    throw error;
  }
};
