import { Request, Response } from 'express';
import { getPasienRI } from '../services/pasienRIService';
import { logger } from '../utils/logger';
import { IApiResponse } from '../@types';

export const getPasienRIController = async (req: Request, res: Response): Promise<void> => {
  try {
    const gugus = (req.query?.gugus as string) || (req.body?.gugus as string);

    if (!gugus) {
      res.status(400).json({ success: false, message: 'Parameter gugus wajib diisi' } as IApiResponse);
      return;
    }
    
    let isPulang = false; 
    
    if (req.body?.isPulang !== undefined) {
        isPulang = req.body.isPulang;
    } else if (req.query?.isPulang !== undefined) {
        isPulang = req.query.isPulang === 'true'; 
    }

    const data = await getPasienRI(gugus, isPulang);
    
    res.status(200).json({ success: true, message: 'Success', data } as IApiResponse);
  } catch (error) {
    logger.error('getPasienRIController Error', error);
    res.status(500).json({ success: false, message: 'Data tidak ditemukan' } as IApiResponse);
  }
};