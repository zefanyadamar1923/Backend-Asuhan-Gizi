import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { IApiResponse, IDataPddk, IDataPekerjaan, IDataJenisDiit, IDataSDMDokter, IDataRiwayatKunjung } from '../@types';
import { getDataPddk, getDataPekerjaan, getDataSDMDokter, getDataJenisDiit, getRiwayatKunjung } from '../services/dataService';

export const getPddkController = async (req: Request, res: Response) => {
    const response: IApiResponse = {
        success: false,
        message: "",
    };

    try {
        const result = await getDataPddk();

        response.success = true;
        response.message = "Data berhasil diambil";
        response.data = result as IDataPddk[];
        res.status(200).json(response);
    } catch (error: any) {
        logger.error(error, "Error getting PDDk");
        response.message = "Gagal mengambil data PDDk";
        res.status(500).json(response);
    }
}

export const getPekerjaanController = async (req: Request, res: Response) => {
    const response: IApiResponse = {
        success: false,
        message: "",
    };

    try {
        const result = await getDataPekerjaan();

        response.success = true;
        response.message = "Data berhasil diambil";
        response.data = result as IDataPekerjaan[];
        res.status(200).json(response);
    } catch (error: any) {
        logger.error(error, "Error getting Pekerjaan");
        response.message = "Gagal mengambil data Pekerjaan";
        res.status(500).json(response);
    }
}

export const getSDMDokterController = async (req: Request, res: Response) => {
    const response: IApiResponse = {
        success: false,
        message: "",
    };

    try {
        const result = await getDataSDMDokter();

        response.success = true;
        response.message = "Data berhasil diambil";
        response.data = result as IDataSDMDokter[];
        res.status(200).json(response);
    } catch (error: any) {
        logger.error(error, "Error getting Dokter");
        response.message = "Gagal mengambil data Dokter";
        res.status(500).json(response);
    }
}

export const getJenisDiitController = async (req: Request, res: Response) => {
    const response: IApiResponse = {
        success: false,
        message: "",
    };

    try {
        const result = await getDataJenisDiit();

        response.success = true;
        response.message = "Data berhasil diambil";
        response.data = result as IDataJenisDiit[];
        res.status(200).json(response);
    } catch (error: any) {
        logger.error(error, "Error getting Jenis Diit");
        response.message = "Gagal mengambil data Jenis Diit";
        res.status(500).json(response);
    }
}

export const getRiwayatKunjungController = async (req: Request, res: Response) => {
    const response: IApiResponse = {
        success: false,
        message: "",
    };

    try {
        const { vc_norm } = req.params;
        if (!vc_norm) {
            res.status(400).json({ success: false, message: 'vc_norm tidak ditemukan' } as IApiResponse);
            return;
        }
        const result = await getRiwayatKunjung(vc_norm as string);

        if (!result || result.length === 0) {
            res.status(404).json({ success: false, message: 'Data riwayat kunjung tidak ditemukan' } as IApiResponse);
            return;
        }

        response.success = true;
        response.message = "Data berhasil diambil";
        response.data = result as IDataRiwayatKunjung[];
        res.status(200).json(response);
    } catch (error: any) {
        logger.error(error, "Error getting Riwayat Kunjung");
        response.message = "Gagal mengambil data Riwayat Kunjung";
        res.status(500).json(response);
    }
}
