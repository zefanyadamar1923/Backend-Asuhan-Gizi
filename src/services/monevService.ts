import { IMonitoringEvaluasiRI, IMonitoringEvaluasiRJ } from "../@types";
import { poolPromise } from "../config/db";
import { logger } from "../utils/logger";
import * as crypto from "crypto";

export const getMonitoringEvaluasiRI = async (vc_noreg: string) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().input("vc_noreg", vc_noreg).query(`
        SELECT * FROM _GiziAsuhanGiziRIMonev
        WHERE vc_noreg = @vc_noreg
      `);
    return result.recordset;
  } catch (error) {
    logger.error("Error in getMonitoringEvaluasiRI", error);
    throw error;
  }
};

export const getMonitoringEvaluasiRJ = async (vc_noreg: string) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().input("vc_noreg", vc_noreg).query(`
        SELECT * FROM _GiziAsuhanGiziRJMonev
        WHERE vc_noreg = @vc_noreg
      `);
    return result.recordset;
  } catch (error) {
    logger.error("Error in getMonitoringEvaluasiRJ", error);
    throw error;
  }
};

export const saveMonitoringEvaluasiRI = async (data: IMonitoringEvaluasiRI) => {
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
      .input("vc_nama_ahli_gizi", data.vc_nama_ahli_gizi).query(`
          INSERT INTO _GiziAsuhanGiziRIMonev (
            vc_id,
            vc_noreg,
            vc_norm,
            dt_tanggal_monev,
            vc_keterangan_monev,
            vc_nama_ahli_gizi
          ) VALUES (
            @vc_id,
            @vc_noreg,
            @vc_norm,
            @dt_tanggal_monev,
            @vc_keterangan_monev,
            @vc_nama_ahli_gizi
          )
        `);
    return;
  } catch (error) {
    logger.error("Error in saveMonitoringEvaluasiRI", error);
    throw error;
  }
};

export const saveMonitoringEvaluasiRJ = async (data: IMonitoringEvaluasiRJ) => {
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
      .input("vc_nama_ahli_gizi", data.vc_nama_ahli_gizi).query(`
          INSERT INTO _GiziAsuhanGiziRJMonev (
            vc_id,
            vc_noreg,
            vc_norm,
            dt_tanggal_monev,
            vc_keterangan_monev,
            vc_nama_ahli_gizi
          ) VALUES (
            @vc_id,
            @vc_noreg,
            @vc_norm,
            @dt_tanggal_monev,
            @vc_keterangan_monev,
            @vc_nama_ahli_gizi
          )
        `);
    return;
  } catch (error) {
    logger.error("Error in saveMonitoringEvaluasiRJ", error);
    throw error;
  }
};
