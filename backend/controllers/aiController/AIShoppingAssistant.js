import axios from "axios";

// ============================================
// AI CHAT CONTROLLER
// POST /api/v1/ai/chat
// ============================================

export const chatWithAI = async (req, res) => {
  try {
    const { message, session_id } = req.body;

    // ============================================
    // VALIDATION
    // ============================================

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // ============================================
    // SESSION ID
    // ============================================

    const sessionId =
      session_id ||
      (req.user ? req.user._id.toString() : "guest_session");

    // ============================================
    // CALL FASTAPI AI MICROSERVICE
    // ============================================

    const aiResponse = await axios.post(
      "http://127.0.0.1:9000/ai/chat",
      {
        message: message.trim(),
        session_id: sessionId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },

        timeout: 40000,
      }
    );

    // ============================================
    // SEND RESPONSE TO FRONTEND
    // ============================================

    return res.status(200).json({
      success: true,

      message: aiResponse.data.message,

      // Optional:
      session_id: sessionId,
    });
  } catch (error) {
    console.error(
      "AI PROXY ERROR:",
      error.response?.data || error.message
    );

    // FastAPI service timeout / unavailable
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        message:
          "AI Service is currently unavailable. Please try again later.",
      });
    }

    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,
        message:
          "AI Service took too long to respond.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        "AI Service is currently unavailable. Please try again.",
    });
  }
};