import express from 'express';
import { createOrUpdateAccount , fetchAccounts,getAccountById} from '../controllers/setting.mjs';
import { upload,handleFileUpload } from '../controllers/uploadFiles.mjs';
const router = express.Router();

router.post('/account', createOrUpdateAccount);
router.put('/account/:id', createOrUpdateAccount);
router.get('/account',fetchAccounts);
router.post('/accountId',getAccountById);

// Define API endpoint for file upload
router.post('/upload', upload.single('file'), handleFileUpload);

export default router;