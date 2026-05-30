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

router.post("/login", loginUser);

//Pasien Rawat Jalan
router.get("/pasien-rj", getPasienRJController);

//Pasien Rawat Inap
router.get("/pasien-ri", getPasienRIController);

// Data Pasien
router.get("/pddk", getPddkController);
router.get("/pekerjaan", getPekerjaanController);
router.get("/dokter", getSDMDokterController);
router.get("/jenis-diit", getJenisDiitController);
router.get("/riwayat-kunjung/:vc_norm", getRiwayatKunjungController);

//Monitoring dan Evaluasi Rawat Inap
router.get("/monev-ri/save/:vc_noreg", getMonitoringEvaluasiRIController);
router.post("/monev-ri", saveMonitoringEvaluasiRIController);
//Monitoring dan Evaluasi Rawat Jalan
router.get("/monev-rj/save/:vc_noreg", getMonitoringEvaluasiRJController);
router.post("/monev-rj", saveMonitoringEvaluasiRJController);

//Skrining Gizi Rawat Inap
router.get("/skrining-gizi-ri/:no_reg", getSkriningGiziRIController);

//Asuhan Gizi Rawat Inap (GET & POST shared)
router.get("/asuhan-gizi-ri/:no_reg", getAsuhanGiziRIController);
router.get("/asuhan-gizi-ri/save/:no_reg", getSaveAsuhanGiziRIController);
router.post("/asuhan-gizi-ri", saveAsuhanGiziRIController);

//Asuhan Gizi Rawat Jalan (GET & POST shared)
router.get("/asuhan-gizi-rj/:no_reg", getAsuhanGiziRJController);
router.get("/asuhan-gizi-rj/save/:no_reg", getSaveAsuhanGiziRJController);
router.post("/asuhan-gizi-rj", saveAsuhanGiziRJController);

export default router;
