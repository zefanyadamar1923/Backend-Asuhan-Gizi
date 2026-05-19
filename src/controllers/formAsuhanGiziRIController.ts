import { Request, Response } from 'express';
import { getAsuhanGiziRI, saveAsuhanGiziAnakRI, saveAsuhanGiziDewasaRI } from '../services/formAsuhanGiziRIService';
import { IAsuhanGiziAnakRI, IAsuhanGiziDewasaRI, IApiResponse } from '../@types';
import { logger } from '../utils/logger';
import { poolPromise } from '../config/db';

// Helper: validasi field bit hanya boleh "0", "1", undefined, atau null
const validateBitFields = (fields: { name: string; value: any }[]): string | null => {
  for (const field of fields) {
    if (field.value !== undefined && field.value !== null && field.value !== '0' && field.value !== '1') {
      return `Field '${field.name}' harus bernilai '0' atau '1', nilai yang dikirim: '${field.value}'`;
    }
  }
  return null;
};

// GET shared untuk Anak & Dewasa RI
export const getAsuhanGiziRIController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { no_reg } = req.params;
    if (!no_reg) {
      res.status(400).json({ success: false, message: 'no_reg tidak boleh kosong' } as IApiResponse);
      return;
    }
    const data = await getAsuhanGiziRI(no_reg as string);
    if (data && data.length > 0) {
      res.status(200).json({ success: true, message: 'Data ditemukan', data } as IApiResponse);
    } else {
      res.status(404).json({ success: false, message: 'Data tidak ditemukan' } as IApiResponse);
    }
  } catch (error) {
    logger.error('Error in getAsuhanGiziRIController', error);
    res.status(500).json({ success: false, message: 'Internal server error' } as IApiResponse);
  }
};

// SAVE Anak RI
export const saveAsuhanGiziAnakRIController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: IAsuhanGiziAnakRI = req.body;
    if (!data.vc_no_reg) {
      res.status(400).json({ success: false, message: 'vc_no_reg tidak boleh kosong' } as IApiResponse);
      return;
    }
    // Validasi bit fields
    const bitError = validateBitFields([
      { name: 'bt_diit_konseling', value: data.riwayat_gizi?.bt_diit_konseling },
      { name: 'bt_alergi_makanan', value: data.riwayat_gizi?.bt_alergi_makanan },
      { name: 'bt_pantangan_makanan', value: data.riwayat_gizi?.bt_pantangan_makanan },
      { name: 'bt_ketidaksukaan_makan', value: data.riwayat_gizi?.bt_ketidaksukaan_makan },
      { name: 'bt_edema', value: data.fisik_klinis?.bt_edema },
      { name: 'bt_asites', value: data.fisik_klinis?.bt_asites },
      { name: 'bt_kesulitan_menghisap', value: data.fisik_klinis?.bt_kesulitan_menghisap },
      { name: 'bt_nafsu_makan', value: data.fisik_klinis?.bt_nafsu_makan },
      { name: 'bt_gigi_geligi', value: data.fisik_klinis?.bt_gigi_geligi },
      { name: 'bt_suplemen_obat', value: data.riwayat_personal?.bt_suplemen_obat },
      { name: 'bt_anak', value: data.bt_anak },
    ]);
    if (bitError) {
      res.status(400).json({ success: false, message: bitError } as IApiResponse);
      return;
    }

    // Cek duplikat no_reg
    const pool = await poolPromise;
    const check = await pool.request()
      .input('vc_no_reg', data.vc_no_reg)
      .query('SELECT vc_no_reg FROM AsuhanGiziRI WHERE vc_no_reg = @vc_no_reg');
    if (check.recordset.length > 0) {
      res.status(409).json({ success: false, message: 'Data dengan no_reg tersebut sudah ada' } as IApiResponse);
      return;
    }

    await saveAsuhanGiziAnakRI(data);
    res.status(200).json({ success: true, message: 'Successfully saved Asuhan Gizi Anak RI' } as IApiResponse);
  } catch (error) {
    logger.error('Error in saveAsuhanGiziAnakRIController', error);
    res.status(500).json({ success: false, message: 'Internal server error' } as IApiResponse);
  }
};

// SAVE Dewasa RI
export const saveAsuhanGiziDewasaRIController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: IAsuhanGiziDewasaRI = req.body;
    if (!data.vc_no_reg) {
      res.status(400).json({ success: false, message: 'vc_no_reg tidak boleh kosong' } as IApiResponse);
      return;
    }
    // Validasi bit fields
    const bitError = validateBitFields([
      { name: 'bt_diit_konseling', value: data.riwayat_gizi?.bt_diit_konseling },
      { name: 'bt_alergi_makanan', value: data.riwayat_gizi?.bt_alergi_makanan },
      { name: 'bt_pantangan_makanan', value: data.riwayat_gizi?.bt_pantangan_makanan },
      { name: 'bt_ketidaksukaan_makan', value: data.riwayat_gizi?.bt_ketidaksukaan_makan },
      { name: 'bt_nafsu_makan', value: data.fisik_klinis?.bt_nafsu_makan },
      { name: 'bt_edema', value: data.fisik_klinis?.bt_edema },
      { name: 'bt_gigi_geligi', value: data.fisik_klinis?.bt_gigi_geligi },
      { name: 'bt_asites', value: data.fisik_klinis?.bt_asites },
      { name: 'bt_perokok', value: data.riwayat_personal?.bt_perokok },
      { name: 'bt_suplemen_obat', value: data.riwayat_personal?.bt_suplemen_obat },
      { name: 'bt_anak', value: data.bt_anak },
    ]);
    if (bitError) {
      res.status(400).json({ success: false, message: bitError } as IApiResponse);
      return;
    }

    // Cek duplikat no_reg
    const pool = await poolPromise;
    const check = await pool.request()
      .input('vc_no_reg', data.vc_no_reg)
      .query('SELECT vc_no_reg FROM AsuhanGiziRI WHERE vc_no_reg = @vc_no_reg');
    if (check.recordset.length > 0) {
      res.status(409).json({ success: false, message: 'Data dengan no_reg tersebut sudah ada' } as IApiResponse);
      return;
    }

    await saveAsuhanGiziDewasaRI(data);
    res.status(200).json({ success: true, message: 'Successfully saved Asuhan Gizi Dewasa RI' } as IApiResponse);
  } catch (error) {
    logger.error('Error in saveAsuhanGiziDewasaRIController', error);
    res.status(500).json({ success: false, message: 'Internal server error' } as IApiResponse);
  }
};
