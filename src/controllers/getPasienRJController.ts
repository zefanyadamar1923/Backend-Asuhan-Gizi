import { Request, Response } from "express";
import { getPasienRJ } from "../services/pasienRJService";
import { logger } from "../utils/logger";
import { IApiResponse } from "../@types";

export const getPasienRJController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const tanggal =
      (req.query?.tanggal as string) || (req.body?.tanggal as string);
    const data = await getPasienRJ(tanggal);

    if (!data || data.length === 0) {
      res.status(200).json({
        success: true,
        message: "Data tidak ditemukan pada tanggal tersebut",
        data: [],
      } as IApiResponse);
    } else {
      res
        .status(200)
        .json({ success: true, message: "Success", data } as IApiResponse);
    }
  } catch (error) {
    logger.error("getPasienRJController Error", error);
    res.status(500).json({
      success: false,
      message: "Data tidak ditemukan",
    } as IApiResponse);
  }
};
