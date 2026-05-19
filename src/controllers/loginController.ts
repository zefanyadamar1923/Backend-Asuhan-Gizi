import { Request, Response } from "express";
import axios from "axios";
import { ILoginRequest } from "../@types";

export const loginUser = async (
  req: Request<{}, {}, ILoginRequest>,
  res: Response,
) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password wajib diisi",
      });
    }

    const apiResponse = await axios.post<any>(
      "http://10.10.0.89:3000/api/login",
      {
        username,
        password,
      },
    );

    const apiLogin = apiResponse.data;

    return res.status(200).json({
      success: true,
      data: apiLogin,
    });
  } catch (error: any) {
    console.error("Error Login:", error);

    let status = 500;
    let msg = "Gagal menghubungi server login.";

    if (error.response) {
      status = error.response.status || 500;
      msg = error.response.data?.message || msg;
    } else if (error.message) {
      msg = error.message;
    }

    return res.status(status).json({
      success: false,
      message: msg,
    });
  }
};