import express from 'express';
import {
  getClients, createClient, updateClient, searchClient, archiveClient,
  exportClients, getArchivedClients, getClientById,
} from '../controllers/clients.mjs';

const router = express.Router();

router.post('/', createClient);
router.get('/', getClients);
router.patch('/:clientId', archiveClient);
router.put('/:clientId', updateClient);
router.get('/archived', getArchivedClients);
router.get('/export', exportClients);
router.get('/search', searchClient);
router.get('/:clientId', getClientById);

export default router;
