import express from 'express';
import { createEstimate } from '../controllers/estimates.mjs';
import { getEstimateById } from '../controllers/estimates.mjs';
import { getAllEstimates } from '../controllers/estimates.mjs';
import { updateEstimate } from '../controllers/estimates.mjs'

const router = express.Router();

router.post('/', createEstimate);
router.get('/:estimateId', getEstimateById);
router.get('/allEstimates', getAllEstimates);
router.put('/:id', updateEstimate)
export default router;
