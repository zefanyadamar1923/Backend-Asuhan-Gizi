import { Request, Response } from 'express';
import { getTtdFilePath } from '../services/ttdService'; // Sesuaikan path
import fs from 'fs';

export const getTtdController = (req: Request, res: Response): void => {
  try {
    const { nik } = req.params;

    // 1. Validasi input NIK untuk mencegah Path Traversal (keamanan)
    if (!nik || !/^[a-zA-Z0-9_-]+$/.test(nik.toString())) {
      res.status(400).json({ message: 'Format NIK tidak valid' });
      return;
    }

    // 2. Panggil Service untuk mendapatkan full path file
    const filePath = getTtdFilePath(nik.toString());

    // 3. Cek apakah file fisik ada di storage/network
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: `Tanda tangan untuk NIK ${nik} tidak ditemukan` });
      return;
    }

    // 4. Kirim file gambar sebagai response stream
    res.setHeader('Content-Type', 'image/png');
    const fileStream = fs.createReadStream(filePath);
    
    // Handle jika ada error saat streaming (misal masalah permission mendadak)
    fileStream.on('error', (err) => {
      console.error('Stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Gagal membaca file tanda tangan' });
      }
    });

    fileStream.pipe(res);

  } catch (error) {
    console.error('Error di TTD Controller:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};