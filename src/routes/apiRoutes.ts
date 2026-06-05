import { Router } from "express";
import { loginUser } from "../controllers/loginController";
import {
  getAsuhanGiziController,
  getSaveAsuhanGiziController,
  saveAsuhanGiziController,
} from "../controllers/formAsuhanGiziController";
import { getPasienRJController } from "../controllers/getPasienRJController";
import { getPasienRIController } from "../controllers/getPasienRIController";
import {
  getPddkController,
  getPekerjaanController,
  getSDMDokterController,
  getJenisDiitController,
  getRiwayatKunjungController,
  getDiagnosisGiziController,
  getSDMKaryawanController,
} from "../controllers/dataController";
import { getSkriningGiziController } from "../controllers/getSkriningGiziController";
import {
  getMonitoringEvaluasiController,
  saveMonitoringEvaluasiController,
} from "../controllers/monevController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API untuk Autentikasi
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login User
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil
 */
router.post("/login", loginUser);

/**
 * @swagger
 * tags:
 *   name: Pasien
 *   description: API untuk Data Pasien
 */

/**
 * @swagger
 * /pasien-ri:
 *   get:
 *     summary: Mendapatkan data pasien rawat inap
 *     tags: [Pasien]
 *     parameters:
 *       - in: query
 *         name: gugus
 *         schema:
 *           type: string
 *         description: Kode gugus rawat inap (contoh 0301)
 *       - in: query
 *         name: isPulang
 *         schema:
 *           type: boolean
 *         description: Status kepulangan pasien (true/false)
 *     responses:
 *       200:
 *         description: Sukses mendapatkan data
 */
router.get("/pasien-ri", getPasienRIController);

/**
 * @swagger
 * /pasien-rj:
 *   get:
 *     summary: Mendapatkan data pasien rawat jalan
 *     tags: [Pasien]
 *     parameters:
 *       - in: query
 *         name: tanggal
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal (format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Sukses mendapatkan data
 */
router.get("/pasien-rj", getPasienRJController);

/**
 * @swagger
 * tags:
 *   name: Referensi
 *   description: API untuk Data Referensi/Master
 */

/**
 * @swagger
 * /pddk:
 *   get:
 *     summary: Mendapatkan data pendidikan
 *     tags: [Referensi]
 *     responses:
 *       200:
 *         description: Sukses mendapatkan data
 */
router.get("/pddk", getPddkController);

/**
 * @swagger
 * /pekerjaan:
 *   get:
 *     summary: Mendapatkan data pekerjaan
 *     tags: [Referensi]
 *     responses:
 *       200:
 *         description: Sukses mendapatkan data
 */
router.get("/pekerjaan", getPekerjaanController);

/**
 * @swagger
 * /dokter:
 *   get:
 *     summary: Mendapatkan data dokter
 *     tags: [Referensi]
 *     responses:
 *       200:
 *         description: Sukses mendapatkan data
 */
router.get("/dokter", getSDMDokterController);

/**
 * @swagger
 * /jenis-diit:
 *   get:
 *     summary: Mendapatkan data jenis diit
 *     tags: [Referensi]
 *     responses:
 *       200:
 *         description: Sukses mendapatkan data
 */
router.get("/jenis-diit", getJenisDiitController);

/**
 * @swagger
 * /riwayat-kunjung/{vc_norm}:
 *   get:
 *     summary: Mendapatkan riwayat kunjungan berdasarkan No RM
 *     tags: [Referensi]
 *     parameters:
 *       - in: path
 *         name: vc_norm
 *         required: true
 *         schema:
 *           type: string
 *         description: Nomor Rekam Medis
 *     responses:
 *       200:
 *         description: Sukses mendapatkan data
 */
router.get("/riwayat-kunjung/:vc_norm", getRiwayatKunjungController);

/**
 * @swagger
 * /diagnosis:
 *   get:
 *     summary: Mendapatkan data diagnosis gizi
 *     tags: [Referensi]
 *     responses:
 *       200:
 *         description: Sukses mendapatkan data
 */
router.get("/diagnosis", getDiagnosisGiziController);

/**
 * @swagger
 * /sdm-karyawan/{vc_nik}:
 *   get:
 *     summary: Mendapatkan data SDM Karyawan berdasarkan NIK
 *     tags: [Referensi]
 *     parameters:
 *       - in: path
 *         name: vc_nik
 *         required: true
 *         schema:
 *           type: string
 *         description: Nomor Induk Karyawan
 *     responses:
 *       200:
 *         description: Sukses mendapatkan data
 */
router.get("/sdm-karyawan/:vc_nik", getSDMKaryawanController);

/**
 * @swagger
 * tags:
 *   name: Monitoring Evaluasi
 *   description: API untuk Monitoring dan Evaluasi
 */

/**
 * @swagger
 * /monev/save/{vc_noreg}:
 *   get:
 *     summary: Mendapatkan data form save Monitoring Evaluasi
 *     tags: [Monitoring Evaluasi]
 *     parameters:
 *       - in: path
 *         name: vc_noreg
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sukses mendapatkan data
 */
router.get("/monev/save/:vc_noreg", getMonitoringEvaluasiController);

/**
 * @swagger
 * /monev:
 *   post:
 *     summary: Menyimpan data Monitoring Evaluasi
 *     tags: [Monitoring Evaluasi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               vc_noreg: "string"
 *               vc_norm: "string"
 *               dt_tanggal_monev: "string"
 *               vc_keterangan_monev: "string"
 *               vc_nama_ahli_gizi: "string"
 *               bt_ranap: "string"
 *     responses:
 *       200:
 *         description: Sukses menyimpan data
 */
router.post("/monev", saveMonitoringEvaluasiController);

/**
 * @swagger
 * tags:
 *   name: Skrining Gizi
 *   description: API untuk Skrining Gizi
 */

/**
 * @swagger
 * /skrining-gizi/{no_reg}:
 *   get:
 *     summary: Mendapatkan data skrining gizi rawat inap
 *     tags: [Skrining Gizi]
 *     parameters:
 *       - in: path
 *         name: no_reg
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sukses mendapatkan data
 */
router.get("/skrining-gizi/:no_reg", getSkriningGiziController);

/**
 * @swagger
 * tags:
 *   name: Asuhan Gizi
 *   description: API untuk Asuhan Gizi
 */

/**
 * @swagger
 * /asuhan-gizi/{no_reg}:
 *   get:
 *     summary: Mendapatkan data asuhan gizi rawat inap
 *     tags: [Asuhan Gizi]
 *     parameters:
 *       - in: path
 *         name: no_reg
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sukses mendapatkan data
 */
router.get("/asuhan-gizi/:no_reg", getAsuhanGiziController);

/**
 * @swagger
 * /asuhan-gizi/save/{no_reg}:
 *   get:
 *     summary: Mendapatkan data form save asuhan gizi rawat inap
 *     tags: [Asuhan Gizi]
 *     parameters:
 *       - in: path
 *         name: no_reg
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sukses mendapatkan data
 */
router.get("/asuhan-gizi/save/:no_reg", getSaveAsuhanGiziController);

/**
 * @swagger
 * /asuhan-gizi:
 *   post:
 *     summary: Menyimpan data asuhan gizi rawat inap
 *     tags: [Asuhan Gizi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           examples:
 *             RawatInap:
 *               summary: Contoh Data Rawat Inap (RI)
 *               value:
 *                 vc_no_reg: "string"
 *                 vc_no_rm: "string"
 *                 dt_tanggal: "string"
 *                 vc_nama_ahli_gizi: "string"
 *                 bt_anak: "string"
 *                 bt_ranap: "1"
 *                 bt_aktif: "string"
 *                 riwayat_gizi:
 *                   vc_pola_makan: "string"
 *                   bt_diit_konseling: "string"
 *                   vc_diit_konseling: "string"
 *                   bt_alergi_makanan: "string"
 *                   vc_alergi_makanan: "string"
 *                   bt_pantangan_makanan: "string"
 *                   vc_pantangan_makanan: "string"
 *                   bt_ketidaksukaan_makan: "string"
 *                   vc_ketidaksukaan_makan: "string"
 *                 antropometri:
 *                   vc_bb: "string"
 *                   vc_pb: "string"
 *                   vc_tb: "string"
 *                   vc_imt: "string"
 *                   vc_bbi: "string"
 *                   vc_bb_pb: "string"
 *                   vc_bb_tb: "string"
 *                   vc_lila: "string"
 *                   vc_persen_lila: "string"
 *                   vc_status_gizi: "string"
 *                 vc_biokimia: "string"
 *                 vc_pemeriksaan_penunjang: "string"
 *                 fisik_klinis:
 *                   vc_sistole: "string"
 *                   vc_diastole: "string"
 *                   bt_edema: "string"
 *                   bt_asites: "string"
 *                   bt_kesulitan_menghisap: "string"
 *                   bt_nafsu_makan: "string"
 *                   bt_gigi_geligi: "string"
 *                   vc_fisik_lainnya: "string"
 *                 riwayat_personal:
 *                   vc_pekerjaan: "string"
 *                   vc_pendidikan: "string"
 *                   bt_perokok: "string"
 *                   bt_suplemen_obat: "string"
 *                   vc_suplemen_obat: "string"
 *                   vc_riwayat_penyakit_keluarga: "string"
 *                   vc_riwayat_penyakit_dulu: "string"
 *                   vc_riwayat_penyakit_sekarang: "string"
 *                   vc_masalah_cerna: "string"
 *                 vc_diagnosis_gizi: "string"
 *                 diagnosis:
 *                   - vc_etiologi: "string"
 *                     vc_sign_symptoms: "string"
 *                     vc_rangkuman_diagnosis: "string"
 *                     vc_problem: "string"
 *                 intervensi_gizi:
 *                   vc_tujuan_intervensi: "string"
 *                   jenis:
 *                     vc_jenis_makanan: "string"
 *                     vc_jenis_diit: "string"
 *                     vc_bentuk: "string"
 *                     vc_jadwal_pemberian_diit: "string"
 *                     vc_jalur_makanan: "string"
 *                   modifikasi:
 *                     vc_modifikasi_diit: "string"
 *                     vc_bentuk: "string"
 *                     vc_jadwal_pemberian_diit: "string"
 *                     vc_jalur_makanan: "string"
 *                 vc_makanan_dianjurkan: "string"
 *                 vc_makanan_tidak_dianjurkan: "string"
 *             RawatJalan:
 *               summary: Contoh Data Rawat Jalan (RJ)
 *               value:
 *                 vc_no_reg: "string"
 *                 vc_no_rm: "string"
 *                 dt_tanggal: "string"
 *                 vc_nama_ahli_gizi: "string"
 *                 bt_anak: "string"
 *                 bt_ranap: "0"
 *                 bt_aktif: "string"
 *                 vc_dokter_pengirim: "string"
 *                 vc_diagnosa_medis: "string"
 *                 riwayat_gizi:
 *                   vc_pola_makan: "string"
 *                   bt_diit_konseling: "string"
 *                   vc_diit_konseling: "string"
 *                   bt_alergi_makanan: "string"
 *                   vc_alergi_makanan: "string"
 *                   bt_pantangan_makanan: "string"
 *                   vc_pantangan_makanan: "string"
 *                   bt_ketidaksukaan_makan: "string"
 *                   vc_ketidaksukaan_makan: "string"
 *                 antropometri:
 *                   vc_bb: "string"
 *                   vc_pb: "string"
 *                   vc_tb: "string"
 *                   vc_imt: "string"
 *                   vc_bbi: "string"
 *                   vc_status_gizi: "string"
 *                   vc_bb_u: "string"
 *                   vc_pb_tb: "string"
 *                   vc_bb_bp: "string"
 *                   vc_lila: "string"
 *                   vc_persen_lila: "string"
 *                 vc_biokimia: "string"
 *                 vc_pemeriksaan_penunjang: "string"
 *                 fisik_klinis:
 *                   vc_sistole: "string"
 *                   vc_diastole: "string"
 *                   bt_edema: "string"
 *                   bt_asites: "string"
 *                   bt_kesulitan_menghisap: "string"
 *                   bt_nafsu_makan: "string"
 *                   bt_gigi_geligi: "string"
 *                   vc_fisik_lainnya: "string"
 *                 riwayat_personal:
 *                   vc_pekerjaan: "string"
 *                   vc_pendidikan: "string"
 *                   bt_perokok: "string"
 *                   bt_suplemen_obat: "string"
 *                   vc_suplemen_obat: "string"
 *                   vc_riwayat_penyakit_keluarga: "string"
 *                   vc_riwayat_penyakit_dulu: "string"
 *                   vc_riwayat_penyakit_sekarang: "string"
 *                   vc_masalah_cerna: "string"
 *                 vc_diagnosis_gizi: "string"
 *                 diagnosis:
 *                   - vc_etiologi: "string"
 *                     vc_sign_symptoms: "string"
 *                     vc_rangkuman_diagnosis: "string"
 *                     vc_problem: "string"
 *                 intervensi_gizi:
 *                   vc_jenis_makanan: "string"
 *                   vc_jenis_diit: "string"
 *                   vc_tujuan_intervensi: "string"
 *                   vc_jadwal: "string"
 *                   vc_makanan_dianjurkan: "string"
 *                   vc_makanan_tidak_dianjurkan: "string"
 *                   bt_leaflet: "string"
 *     responses:
 *       200:
 *         description: Sukses menyimpan data
 */
router.post("/asuhan-gizi", saveAsuhanGiziController);

export default router;
