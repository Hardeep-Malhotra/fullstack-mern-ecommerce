import express from "express";
import { registerUser } from "../controllers/authController/userRegisterController.js";
import { validateBody } from "../middlewares/validate.js"; // Aapka middleware
import { registerSchema } from "../validators/userValidation.js";

const router = express.Router();

// Validation middleware controller se pehle pass karein
router.post("/register", validateBody(registerSchema), registerUser);

export default router;
