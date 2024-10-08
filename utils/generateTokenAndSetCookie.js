import jwt from 'jsonwebtoken';
export const generateTokenAndSetCookie = async (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: true, // Use true if your site is HTTPS
    sameSite: 'none',
  });
  return token;
};
