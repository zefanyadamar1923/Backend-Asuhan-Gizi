import { Request, Response } from 'express';
import { getAsuhanGizi, getSaveAsuhanGizi, saveAsuhanGizi } from '../services/formAsuhanGiziService';
import { IAsuhanGizi, IApiResponse } from '../@types';
import { logger } from '../utils/logger';

// Helper: validasi field bit hanya boleh "0", "1", undefined, atau null
const validateBitFields = (fields: { name: string; value: any }[]): string | null => {
  for (const field of fields) {
    if (field.value !== undefined && field.value !== null && field.value !== '0' && field.value !== '1') {
      return `Field '${field.name}' harus bernilai '0' atau '1', nilai yang dikirim: '${field.value}'`;
    }
  }
  return null;
};

// 1. GET Asesmen Primer IGD / Rajal (Shared untuk RI & RJ)
export const getAsuhanGiziController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { no_reg } = req.params;
    if (!no_reg) {
      res.status(400).json({ success: false, message: 'no_reg tidak boleh kosong' } as IApiResponse);
      return;
    }
    
    const data = await getAsuhanGizi(no_reg as string);
    if (data && data.length > 0) {
      res.status(200).json({ success: true, message: 'Data ditemukan', data } as IApiResponse);
    } else {
      res.status(404).json({ success: false, message: 'Data tidak ditemukan' } as IApiResponse);
    }
  } catch (error) {
    logger.error('Error in getAsuhanGiziController', error);
    res.status(500).json({ success: false, message: 'Internal server error' } as IApiResponse);
  }
};

// 2. GET Data Asuhan Gizi yang Sudah Tersimpan di Tabel Gabungan (_Gizi_AsuhanGizi)
export const getSaveAsuhanGiziController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { no_reg } = req.params;
    if (!no_reg) {
      res.status(400).json({ success: false, message: 'no_reg tidak boleh kosong' } as IApiResponse);
      return;
    }

    const data = await getSaveAsuhanGizi(no_reg as string);
    if (data) {
      res.status(200).json({ success: true, message: 'Data ditemukan', data } as IApiResponse);
    } else {
      res.status(404).json({ success: false, message: 'Data tidak ditemukan' } as IApiResponse);
    }
  } catch (error) {
    logger.error('Error in getSaveAsuhanGiziController', error);
    res.status(500).json({ success: false, message: 'Internal server error' } as IApiResponse);
  }
};

// 3. SAVE Asuhan Gizi Tunggal (Mencakup RI & RJ, Anak & Dewasa)
export const saveAsuhanGiziController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: IAsuhanGizi = req.body;
    if (!data.vc_no_reg) {
      res.status(400).json({ success: false, message: 'Data tidak boleh kosong' } as IApiResponse);
      return;
    }

    // Validasi bit fields gabungan parameter RI & RJ
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
      { name: 'bt_perokok', value: data.riwayat_personal?.bt_perokok },
      { name: 'bt_suplemen_obat', value: data.riwayat_personal?.bt_suplemen_obat },
      { name: 'bt_leaflet', value: data.intervensi_gizi?.bt_leaflet }, // Parameter khusus RJ
      { name: 'bt_anak', value: data.bt_anak },
    ]);

    if (bitError) {
      res.status(400).json({ success: false, message: bitError } as IApiResponse);
      return;
    }

    await saveAsuhanGizi(data);
    res.status(200).json({ success: true, message: 'Successfully saved Asuhan Gizi' } as IApiResponse);
  } catch (error) {
    logger.error('Error in saveAsuhanGiziController', error);
    res.status(500).json({ success: false, message: 'Internal server error' } as IApiResponse);
  }
};
