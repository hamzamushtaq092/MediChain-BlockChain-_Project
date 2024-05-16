import { Router} from "express";
import { createPatient } from "../controllers/patient.controller.js";

const router = Router();


router.post('/create-patient', createPatient)

export default router