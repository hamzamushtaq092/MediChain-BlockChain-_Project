import { Router} from "express";
import { createPatient, getPatientDetails } from "../controllers/patient.controller.js";

const router = Router();


router.post('/create-patient', createPatient)
router.post('/getPatientDetail', getPatientDetails)

export default router