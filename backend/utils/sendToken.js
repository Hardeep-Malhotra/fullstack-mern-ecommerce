// Token generate karke cookie me save karne aur JSON response / Redirect bhejne ka clean function
export const sendToken = (user, statusCode, res, redirectUrl = null) => {
  const token = user.getJWTToken();

  // Cookie Options
  const options = {
    expires: new Date(
      Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === "production", // Production mein HTTPS mandatory
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // OAuth top-level redirects ke liye 'lax'/'none' zaroori hai
  };

  // Response mein password remove kar do output safety ke liye
  if (user.password) {
    user.password = undefined;
  }

  // 1. Cookie status aur options ke saath set karein
  res.status(statusCode).cookie("token", token, options);

  // 2. Agar OAuth redirectUrl aaya hai, toh frontend app par redirect karein
  if (redirectUrl) {
    return res.redirect(redirectUrl);
  }

  // 3. Normal email/password login aur signup ke liye JSON send karein
  return res.json({
    success: true,
    user,
    token,
  });
};