import { Router } from 'express';
import { loginUser } from '../controllers/loginController';
import { getAsuhanGiziRIController, saveAsuhanGiziAnakRIController, saveAsuhanGiziDewasaRIController } from '../controllers/formAsuhanGiziRIController';
import { getAsuhanGiziRJController, saveAsuhanGiziAnakRJController, saveAsuhanGiziDewasaRJController } from '../controllers/formAsuhanGiziRJController';
import { getPasienRJController } from '../controllers/getPasienRJController';
import { getPasienRIController } from '../controllers/getPasienRIController';
import { getSkriningGiziRIController } from '../controllers/getSkriningGiziRIController';

const router = Router();

router.post('/login', loginUser);

//Pasien Rawat Jalan
router.get('/pasien-rj', getPasienRJController);

//Pasien Rawat Inap
router.get('/pasien-ri', getPasienRIController);

//Skrining Gizi Rawat Inap
router.get('/skrining-gizi-ri/:no_reg', getSkriningGiziRIController);

//Asuhan Gizi Rawat Inap (GET shared, POST terpisah Anak & Dewasa)
router.get('/asuhan-gizi-ri/:no_reg', getAsuhanGiziRIController);
router.post('/asuhan-gizi-anak-ri', saveAsuhanGiziAnakRIController);
router.post('/asuhan-gizi-dewasa-ri', saveAsuhanGiziDewasaRIController);

//Asuhan Gizi Rawat Jalan (GET shared, POST terpisah Anak & Dewasa)
router.get('/asuhan-gizi-rj/:no_reg', getAsuhanGiziRJController);
router.post('/asuhan-gizi-anak-rj', saveAsuhanGiziAnakRJController);
router.post('/asuhan-gizi-dewasa-rj', saveAsuhanGiziDewasaRJController);

export default router;
