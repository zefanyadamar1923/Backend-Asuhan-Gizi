import { Request, Response } from "express";
import { getMonitoringEvaluasiRI, getMonitoringEvaluasiRJ, saveMonitoringEvaluasiRI, saveMonitoringEvaluasiRJ } from "../services/monevService";
import { logger } from "../utils/logger";
import { IApiResponse, IMonitoringEvaluasiRI, IMonitoringEvaluasiRJ } from "../@types";

export const getMonitoringEvaluasiRIController = async (req: Request, res: Response): Promise<void> => {
  try {
      const { vc_noreg } = req.params;
      if (!vc_noreg) {
        res.status(400).json({ success: false, message: 'vc_noreg tidak ditemukan' } as IApiResponse);
        return;
      }
      const data = await getMonitoringEvaluasiRI(vc_noreg as string);
      if (data && data.length > 0) {
        res.status(200).json({ success: true, message: 'Data ditemukan', data } as IApiResponse);
      } else {
        res.status(404).json({ success: false, message: 'Data tidak ditemukan' } as IApiResponse);
      }
    } catch (error) {
      logger.error('Error in getMonitoringEvaluasiRIController', error);
      res.status(500).json({ success: false, message: 'Internal server error' } as IApiResponse);
    }
};

export const getMonitoringEvaluasiRJController = async (req: Request, res: Response): Promise<void> => {
  try {
      const { vc_noreg } = req.params;
      if (!vc_noreg) {
        res.status(400).json({ success: false, message: 'vc_noreg tidak ditemukan' } as IApiResponse);
        return;
      }
      const data = await getMonitoringEvaluasiRJ(vc_noreg as string);
      if (data && data.length > 0) {
        res.status(200).json({ success: true, message: 'Data ditemukan', data } as IApiResponse);
      } else {
        res.status(404).json({ success: false, message: 'Data tidak ditemukan' } as IApiResponse);
      }
    } catch (error) {
      logger.error('Error in getMonitoringEvaluasiRJController', error);
      res.status(500).json({ success: false, message: 'Internal server error' } as IApiResponse);
    }
};

export const saveMonitoringEvaluasiRIController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: IMonitoringEvaluasiRI = req.body;
    if (!data.vc_noreg) {
      res.status(400).json({ success: false, message: 'vc_noreg tidak boleh kosong' } as IApiResponse);
      return;
    }
    if (!data.vc_norm) {
      res.status(400).json({ success: false, message: 'vc_norm tidak boleh kosong' } as IApiResponse);
      return;
    }

    const result = await saveMonitoringEvaluasiRI(data);
    res.status(200).json({ success: true, message: "Data berhasil disimpan", data: result });
  } catch (error) {
    logger.error('Error in saveMonitoringEvaluasiRIController', error);
    res.status(500).json({ success: false, message: 'Data tidak dapat disimpan' } as IApiResponse);
  }
};

export const saveMonitoringEvaluasiRJController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: IMonitoringEvaluasiRJ = req.body;
    if (!data.vc_noreg) {
      res.status(400).json({ success: false, message: 'vc_noreg tidak boleh kosong' } as IApiResponse);
      return;
    }
    if (!data.vc_norm) {
      res.status(400).json({ success: false, message: 'vc_norm tidak boleh kosong' } as IApiResponse);
      return;
    }

    const result = await saveMonitoringEvaluasiRJ(data);
    res.status(200).json({ success: true, message: 'Data berhasil disimpan', data: result });
  } catch (error) {
    logger.error('Error in saveMonitoringEvaluasiRJController', error);
    res.status(500).json({ success: false, message: 'Data tidak dapat disimpan' } as IApiResponse);
  }
};
