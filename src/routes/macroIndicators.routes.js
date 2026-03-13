import { Router } from "express";
import { getMacroData } from "../controllers/macroIndicators.controller.js";

const router = Router();

router.get("/", getMacroData);

export default router;