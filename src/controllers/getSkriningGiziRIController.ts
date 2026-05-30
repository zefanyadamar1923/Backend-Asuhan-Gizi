import { Request, Response } from 'express';
import { getSkriningGiziRI } from '../services/skriningGiziRIService';
import { logger } from '../utils/logger';
import { ISkriningGiziRI, IApiResponse } from '../@types';

export const getSkriningGiziRIController = async (req: Request, res: Response): Promise<void> => {
  const no_reg = req.params.no_reg;
  if (!no_reg) {
    res.status(400).json({ success: false, message: 'no_reg tidak ditemukan' } as IApiResponse);
    return;
  }

  try {
    const data = await getSkriningGiziRI(no_reg as string);
    if (data) {
      res.status(200).json({ success: true, message: 'Success', data } as IApiResponse<ISkriningGiziRI>);
    } else {
      res.status(200).json({ success: true, message: 'Data tidak ditemukan', data: null } as IApiResponse);
    }
  } catch (error) {
    logger.error('getSkriningGiziRIController Error', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' } as IApiResponse);
  }
};
