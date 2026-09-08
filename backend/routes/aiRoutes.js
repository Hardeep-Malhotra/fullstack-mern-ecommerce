import express from "express";

import { chatWithAI } from "../controllers/aiController/AIShoppingAssistant.js";

const router = express.Router();

// ============================================
// AI CHAT
// POST /api/v1/ai/chat
// ============================================

router.post("/chat", chatWithAI);

export default router;