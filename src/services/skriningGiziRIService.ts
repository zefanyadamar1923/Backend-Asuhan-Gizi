import { poolPromise } from '../config/db';
import { logger } from '../utils/logger';
import { ISkriningGiziRI } from '../@types';

export const getSkriningGiziRI = async (noReg: string): Promise<ISkriningGiziRI | null> => {
  try {
    const pool = await poolPromise;
    const request = pool.request();
    
    request.input('noReg', noReg);
    
    const query = `
      SELECT
        vc_NoReg,
        vc_NoRM,
        bt_SkriningAnak,
        vc_BB,
        vc_TB,
        vc_LILA,
        bt_PenurunanBBAnak,
        vc_KdPenurunanBB,
        si_SkorPenurunanBB,
        bt_AsupanMakanan,
        si_SkorAsupanMakanan,
        si_SkorDiagnosaKhusus,
        vc_KdDiagnosaKhusus,
        VC_DiagnosaKhususLain,
        bt_gastrointestinal,
        bt_MalnutrisiOpBesar,
        vc_KdMalnutrisiOpBesar,
        si_SkorMalnutrisiOpBesar,
        bt_GiziBuruk,
        si_SkorGiziBuruk,
        bt_KondisiTertentu,
        vc_KdKondisiTertentu,
        si_SkorKondisiTertentu,
        vc_SkorAkhir,
        bt_KonsultasiAhliGizi
      FROM _ASKEPIGD_SkriningGizi
      WHERE vc_NoReg = @noReg

      UNION ALL

      SELECT
        vc_NoReg,
        vc_NoRM,
        bt_SkriningAnak,
        vc_BB,
        vc_TB,
        vc_LILA,
        bt_PenurunanBBAnak,
        vc_KdPenurunanBB,
        si_SkorPenurunanBB,
        bt_AsupanMakanan,
        si_SkorAsupanMakanan,
        si_SkorDiagnosaKhusus,
        vc_KdDiagnosasKhusus,
        VC_DiagnosaKhususLain,
        bt_gastrointestinal,
        bt_MalnutrisiOpBesar,
        vc_KdMalnutrisiOpBesar,
        si_SkorMalnutrisiOpBesar,
        bt_GiziBuruk,
        si_SkorGiziBuruk,
        bt_KondisiTertentu,
        vc_KondisiTertentu,
        si_SkorKondisiTertentu,
        vc_SkorAkhir,
        bt_KonsultasiAhliGizi
      FROM _AskepRajal_SkriningGizi
      WHERE vc_NoReg = @noReg
    `;
    
    const result = await request.query(query);
    
    if (result.recordset && result.recordset.length > 0) {
      return result.recordset[0] as ISkriningGiziRI;
    }
    
    return null;
  } catch (error) {
    logger.error('Error in getSkriningGiziAnakRI', error);
    throw error;
  }
};
