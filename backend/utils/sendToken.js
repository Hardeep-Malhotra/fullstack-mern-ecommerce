// Token generate karke cookie me save karne aur JSON response bhejne ka clean function
export const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  // Cookie Options
  const options = {
    expires: new Date(
      Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevents XSS attacks (JS script client side se read nahi kar sakti)
    secure: process.env.NODE_ENV === "production", // HTTPS mandatory in production
    sameSite: "strict", // Protects against CSRF attacks
  };

  // Response me password remove kar do output safety ke liye
  user.password = undefined;

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};