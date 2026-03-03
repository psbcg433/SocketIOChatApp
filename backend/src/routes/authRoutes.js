import express from 'express';
import AuthController from '../controllers/AuthController.js';
import protect from '../middlewares/protect.js';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', protect, AuthController.logout);

export default router;