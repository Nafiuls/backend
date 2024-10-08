import express from 'express';
import cors from 'cors';
import {
  forgotPassword,
  login,
  logout,
  signup,
  verifyEmail,
  resetPassword,
  checkAuth,
} from '../controller/user.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

const corsOptions = {
  origin: ['https://auth-project-770fb.web.app'],
  credentials: true, // Enable sending cookies with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // List the methods you're using// Include any custom headers
};

router.use(cors(corsOptions));

// check-auth
router.get('/check-auth', verifyToken, checkAuth);

router.post('/signup', signup); // done

router.post('/login', login);

router.post('/logout', logout);

router.post('/verify-email', verifyEmail); // done

router.post('/forgot-password', forgotPassword); // done
router.post('/reset-password/:token', resetPassword); // done

export default router;
