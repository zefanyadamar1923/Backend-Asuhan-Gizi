import { differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths } from "date-fns";

/**
 * Fungsi untuk menghitung umur secara detail (Tahun, Bulan, Hari)
 * @param birthDate Tanggal lahir pasien
 * @returns Object berisi { tahun, bulan, hari }
 */
export const hitungUmurDetail = (birthDate: Date | string) => {
    const tanggalLahir = new Date(birthDate);
    const sekarang = new Date();

    // 1. Hitung total tahun
    const tahun = differenceInYears(sekarang, tanggalLahir);

    // Majukan tanggal lahir sebanyak "tahun" untuk menghitung sisa bulan
    const setelahTahun = addYears(tanggalLahir, tahun);

    // 2. Hitung sisa bulan
    const bulan = differenceInMonths(sekarang, setelahTahun);

    // Majukan lagi sebanyak "bulan" untuk menghitung sisa hari
    const setelahBulan = addMonths(setelahTahun, bulan);

    // 3. Hitung sisa hari
    const hari = differenceInDays(sekarang, setelahBulan);

    return { tahun, bulan, hari };
};