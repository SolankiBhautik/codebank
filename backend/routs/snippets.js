import express from "express";
import { search, show, create, update, remove } from '../controllers/SnippetsController.js'
import middleware from '../middleware/auth.js'

const router = express.Router();


router.get('/search', search);
router.get('/:id', show);
router.post('/', middleware, create);
router.patch('/:id', middleware, update);
router.delete('/', middleware, remove);

export default router  