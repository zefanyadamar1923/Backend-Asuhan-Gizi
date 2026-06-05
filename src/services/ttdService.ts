import path from "path";

/**
 * Mendapatkan full path file tanda tangan berdasarkan NIK dan environment
 * @param nik Nomor Induk Karyawan / Ahli Gizi
 * @returns string full path file png
 */
export const getTtdFilePath = (nik: string): string => {
  // Mengambil base path dari environment variable
  const basePath = process.env.TTD_PATH;

  if (!basePath) {
    throw new Error("Environment variable TTD_PATH belum didefinisikan");
  }

  // path.join secara otomatis akan menyesuaikan separator sesuai OS:
  // Windows: \  |  Linux: /
  console.log(path.join(basePath, `${nik}.png`));
  return path.join(basePath, `${nik}.png`);
};
