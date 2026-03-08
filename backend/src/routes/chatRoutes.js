import express from 'express';
import ChatController from '../controllers/ChatController.js';
import protect from '../middlewares/protect.js'; 

const router = express.Router();

router.use(protect); 
router.get('/messages/:conversationId', ChatController.getMessages);
router.post('/messages/:conversationId', ChatController.sendMessage);

export default router;