import { poolPromise } from "../config/db";
import { logger } from "../utils/logger";

export const getDataPddk = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT * FROM PubPddk
            `);
        return result.recordset;
    } catch (error) {
        logger.error("Error in getDataPddk", error);
        throw error;
    }
}

export const getDataPekerjaan = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT * FROM PubKerja
            `);
        return result.recordset;
    } catch (error) {
        logger.error("Error in getDataPekerjaan", error);
        throw error;
    }
}

export const getDataSDMDokter = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT vc_nid, vc_nama_kry
                FROM SDMDOKTER where bt_aktif = '1'
            `);
        return result.recordset;
    } catch (error) {
        logger.error("Error in getDataSDMDokter", error);
        throw error;
    }
}

export const getDataJenisDiit = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT Vc_KdDiet, Vc_NmDiet 
                FROM _Yahya_GzJnsDiet
            `);
        return result.recordset;
    } catch (error) {
        logger.error("Error in getDataJenisDiit", error);
        throw error;
    }
}

export const getRiwayatKunjung = async (vc_norm: string) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("vc_norm", vc_norm)
            .query(`
                SELECT
                    a.vc_no_regj,
                    a.vc_no_rm,
                    b.vc_id,
                    b.dt_tanggal,
                    b.vc_nama_ahli_gizi,
                    b.vc_diagnosa_medis,
                    b.bt_aktif
                FROM RMKUNJUNG a
                INNER JOIN _GiziAsuhanGiziRJ b ON a.vc_no_regj = b.vc_no_reg
                WHERE b.vc_no_rm = @vc_norm and b.bt_aktif = '1'
            `);
        return result.recordset;
    } catch (error) {
        logger.error("Error in getRiwayatKunjung", error);
        throw error;
    }
}
