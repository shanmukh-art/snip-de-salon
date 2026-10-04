import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'snip_de_salon_super_secret_jwt_key_2026_luxury_spa',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_snipdesalon_2026',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_key_snipdesalon',
};
