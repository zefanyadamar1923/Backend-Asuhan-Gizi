import { Request, Response } from "express";
import { getMonitoringEvaluasi, saveMonitoringEvaluasi } from "../services/monevService";
import { logger } from "../utils/logger";
import { IApiResponse, IMonitoringEvaluasi } from "../@types";

export const getMonitoringEvaluasiController = async (req: Request, res: Response): Promise<void> => {
  try {
      const { vc_noreg } = req.params;
      if (!vc_noreg) {
        res.status(400).json({ success: false, message: 'vc_noreg tidak ditemukan' } as IApiResponse);
        return;
      }
      const data = await getMonitoringEvaluasi(vc_noreg as string);
      if (data && data.length > 0) {
        res.status(200).json({ success: true, message: 'Data ditemukan', data } as IApiResponse);
      } else {
        res.status(404).json({ success: false, message: 'Data tidak ditemukan' } as IApiResponse);
      }
    } catch (error) {
      logger.error('Error in getMonitoringEvaluasiController', error);
      res.status(500).json({ success: false, message: 'Internal server error' } as IApiResponse);
    }
};

export const saveMonitoringEvaluasiController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: IMonitoringEvaluasi = req.body;
    if (!data.vc_noreg) {
      res.status(400).json({ success: false, message: 'vc_noreg tidak boleh kosong' } as IApiResponse);
      return;
    }
    if (!data.vc_norm) {
      res.status(400).json({ success: false, message: 'vc_norm tidak boleh kosong' } as IApiResponse);
      return;
    }

    const result = await saveMonitoringEvaluasi(data);
    res.status(200).json({ success: true, message: "Data berhasil disimpan", data: result });
  } catch (error) {
    logger.error('Error in saveMonitoringEvaluasiController', error);
    res.status(500).json({ success: false, message: 'Data tidak dapat disimpan' } as IApiResponse);
  }
};
