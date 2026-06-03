import { Router } from "express";
import { loginUser } from "../controllers/loginController";
import {
  getAsuhanGiziRIController,
  getSaveAsuhanGiziRIController,
  saveAsuhanGiziRIController,
} from "../controllers/formAsuhanGiziRIController";
import {
  getAsuhanGiziRJController,
  getSaveAsuhanGiziRJController,
  saveAsuhanGiziRJController,
} from "../controllers/formAsuhanGiziRJController";
import { getPasienRJController } from "../controllers/getPasienRJController";
import { getPasienRIController } from "../controllers/getPasienRIController";
import {
  getPddkController,
  getPekerjaanController,
  getSDMDokterController,
  getJenisDiitController,
  getRiwayatKunjungController,
} from "../controllers/dataController";
import { getSkriningGiziRIController } from "../controllers/getSkriningGiziRIController";
import {
  getMonitoringEvaluasiRIController,
  getMonitoringEvaluasiRJController,
  saveMonitoringEvaluasiRIController,
  saveMonitoringEvaluasiRJController,
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
 * tags:
 *   name: Monitoring Evaluasi
 *   description: API untuk Monitoring dan Evaluasi
 */

/**
 * @swagger
 * /monev-ri/save/{vc_noreg}:
 *   get:
 *     summary: Mendapatkan data form save Monitoring Evaluasi Rawat Inap
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
router.get("/monev-ri/save/:vc_noreg", getMonitoringEvaluasiRIController);

/**
 * @swagger
 * /monev-ri:
 *   post:
 *     summary: Menyimpan data Monitoring Evaluasi Rawat Inap
 *     tags: [Monitoring Evaluasi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Sukses menyimpan data
 */
router.post("/monev-ri", saveMonitoringEvaluasiRIController);

/**
 * @swagger
 * /monev-rj/save/{vc_noreg}:
 *   get:
 *     summary: Mendapatkan data form save Monitoring Evaluasi Rawat Jalan
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
router.get("/monev-rj/save/:vc_noreg", getMonitoringEvaluasiRJController);

/**
 * @swagger
 * /monev-rj:
 *   post:
 *     summary: Menyimpan data Monitoring Evaluasi Rawat Jalan
 *     tags: [Monitoring Evaluasi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Sukses menyimpan data
 */
router.post("/monev-rj", saveMonitoringEvaluasiRJController);

/**
 * @swagger
 * tags:
 *   name: Skrining Gizi
 *   description: API untuk Skrining Gizi
 */

/**
 * @swagger
 * /skrining-gizi-ri/{no_reg}:
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
router.get("/skrining-gizi-ri/:no_reg", getSkriningGiziRIController);

/**
 * @swagger
 * tags:
 *   name: Asuhan Gizi
 *   description: API untuk Asuhan Gizi
 */

/**
 * @swagger
 * /asuhan-gizi-ri/{no_reg}:
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
router.get("/asuhan-gizi-ri/:no_reg", getAsuhanGiziRIController);

/**
 * @swagger
 * /asuhan-gizi-ri/save/{no_reg}:
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
router.get("/asuhan-gizi-ri/save/:no_reg", getSaveAsuhanGiziRIController);

/**
 * @swagger
 * /asuhan-gizi-ri:
 *   post:
 *     summary: Menyimpan data asuhan gizi rawat inap
 *     tags: [Asuhan Gizi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Sukses menyimpan data
 */
router.post("/asuhan-gizi-ri", saveAsuhanGiziRIController);

/**
 * @swagger
 * /asuhan-gizi-rj/{no_reg}:
 *   get:
 *     summary: Mendapatkan data asuhan gizi rawat jalan
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
router.get("/asuhan-gizi-rj/:no_reg", getAsuhanGiziRJController);

/**
 * @swagger
 * /asuhan-gizi-rj/save/{no_reg}:
 *   get:
 *     summary: Mendapatkan data form save asuhan gizi rawat jalan
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
router.get("/asuhan-gizi-rj/save/:no_reg", getSaveAsuhanGiziRJController);

/**
 * @swagger
 * /asuhan-gizi-rj:
 *   post:
 *     summary: Menyimpan data asuhan gizi rawat jalan
 *     tags: [Asuhan Gizi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Sukses menyimpan data
 */
router.post("/asuhan-gizi-rj", saveAsuhanGiziRJController);

export default router;
