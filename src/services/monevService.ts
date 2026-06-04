import { IMonitoringEvaluasi } from "../@types";
import { poolPromise } from "../config/db";
import { logger } from "../utils/logger";
import * as crypto from "crypto";

export const getMonitoringEvaluasi = async (vc_noreg: string) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().input("vc_noreg", vc_noreg).query(`
        SELECT * FROM _Gizi_AsuhanGizi_Monev
        WHERE vc_noreg = @vc_noreg
      `);
    return result.recordset;
  } catch (error) {
    logger.error("Error in getMonitoringEvaluasi", error);
    throw error;
  }
};

export const saveMonitoringEvaluasi = async (data: IMonitoringEvaluasi) => {
  try {
    const pool = await poolPromise;
    const vc_id = data.vc_id || crypto.randomUUID();
    await pool
      .request()
      .input("vc_id", vc_id)
      .input("vc_noreg", data.vc_noreg)
      .input("vc_norm", data.vc_norm)
      .input("dt_tanggal_monev", data.dt_tanggal_monev)
      .input("vc_keterangan_monev", data.vc_keterangan_monev)
      .input("vc_nama_ahli_gizi", data.vc_nama_ahli_gizi)
      .input("bt_ranap", data.bt_ranap).query(`
          INSERT INTO _Gizi_AsuhanGizi_Monev (
            vc_id,
            vc_noreg,
            vc_norm,
            dt_tanggal_monev,
            vc_keterangan_monev,
            vc_nama_ahli_gizi,
            bt_ranap
          ) VALUES (
            @vc_id,
            @vc_noreg,
            @vc_norm,
            @dt_tanggal_monev,
            @vc_keterangan_monev,
            @vc_nama_ahli_gizi,
            @bt_ranap
          )
        `);
    return;
  } catch (error) {
    logger.error("Error in saveMonitoringEvaluasi", error);
    throw error;
  }
};
