import { poolPromise } from "../config/db";
import { logger } from "../utils/logger";
import { hitungUmurDetail } from "../utils/ageHelper";

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
          a.vc_no_regj_ralan,
          CASE 
            WHEN s.vc_NoReg IS NOT NULL THEN 'SUDAH'
            ELSE 'BELUM'
          END AS status_skrining,
          s.bt_SkriningAnak AS jenis_skrining_anak,
          CASE 
            WHEN ag.vc_no_reg IS NOT NULL THEN 'SUDAH'
            ELSE 'BELUM'
          END AS status_asuhan
        FROM RMP_inap a 
        LEFT JOIN RMKamar b ON (
          CASE 
            WHEN ISNULL(a.vc_kd_kamar_Mutasi, '') = '' THEN a.vc_kd_kamar_Masuk
            ELSE a.vc_kd_kamar_Mutasi
          END
        ) = b.vc_no_bed
        LEFT JOIN RMPasien c ON a.vc_no_rm = c.vc_no_rm
        LEFT JOIN (
            SELECT vc_NoReg, bt_SkriningAnak FROM _ASKEPIGD_SkriningGizi
            UNION
            SELECT vc_NoReg, bt_SkriningAnak FROM _AskepRajal_SkriningGizi
        ) s ON s.vc_NoReg IN (a.vc_no_reg, a.vc_no_regj_ralan)
        LEFT JOIN _Gizi_AsuhanGizi ag ON ag.vc_no_reg IN (a.vc_no_reg, a.vc_no_regj_ralan) AND ag.bt_aktif = '1'
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
    const pasienList = result.recordset;

    // --- PROSES MENGHITUNG UMUR DETAIL DISINI ---
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

      // Jika data tanggal lahir kosong
      return {
        ...pasien,
        umur_tahun: 0,
        umur_bulan: 0,
        umur_hari: 0,
      };
    });

    return pasienDenganUmur;

  } catch (error) {
    logger.error("Error in getPasienRI", error);
    throw error;
  }
};