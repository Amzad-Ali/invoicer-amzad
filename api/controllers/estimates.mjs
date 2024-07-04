import mongoose from 'mongoose';
import Client from '../models/Client.mjs';
import Estimate from '../models/Estimate.mjs';

import Account from '../models/Account.mjs';

// eslint-disable-next-line import/prefer-default-export
export const createEstimate = async (req, res) => {
  const {
    logo,
    account,
    client,
    address,
    issued_date,
    due_date,
    currency,
    language,
    estimate_number,
    reference_number,
    items,
    discounts,
    taxes,
    subtotal,
    total,
    notes,
    terms,
    attachments,
    status,
    archived,
    invoiced,
    sent,
    created_by,
    updated_by,
  } = req.body;

  try {
    //  Validate account ID
    if (!mongoose.Types.ObjectId.isValid(account)) {
      return res.status(400).json({ message: 'Invalid account ID' });
    }

    const existingAccount = await Account.findById(account);
    if (!existingAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (!mongoose.Types.ObjectId.isValid(client.client_id)) {
      return res.status(400).json({ message: 'Invalid client ID' });
    }

    const existingClient = await Client.findById(client.client_id);
    if (!existingClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Create estimate object
    const newEstimate = new Estimate({
    logo,
    account,
    client,
    address,
    issued_date,
    due_date,
    currency,
    language,
    estimate_number,
    reference_number,
    items,
    discounts,
    taxes,
    subtotal,
    total,
    notes,
    terms,
    attachments,
    status,
    archived,
    invoiced,
    sent,
    created_by,
    updated_by,
    });

    await newEstimate.save();

    // Instead of saving, you return the new estimate object
    res.status(201).json({
      message: "Estimate created successfully",
      data: newEstimate
    });

  } catch (error) {
    res.status(500).json({ message: 'Error creating estimate', error });
  }
};

export const getEstimateById = async (req, res) => {
  const { estimateId } = req.params;
  // const { estimateId } = req.body.id;

  try {
    const estimate = await Estimate.findById(estimateId);

    if (!estimate) {
      return res.status(404).json({ message: 'Estimate not found' });
    }

    res.status(200).json({ message: 'Estimate retrieved successfully', data: estimate });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving estimate', error });
  }
};

export const getAllEstimates = async (req, res) => {
  try {
    const estimate = await Estimate.find();

    res.status(200).json({ message: 'Estimates retrieved successfully', data: estimate });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving estimates', error });
  }
};

export const updateEstimate = async (req, res) => {
  try {
    const estimateId = req.params.id;
    const updateData = req.body;

    // Validate the estimate ID
    if (!estimateId) {
      return res.status(400).json({ error: 'Estimate ID is required' });
    }

    // Validate the update data
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Update data is required' });
    }

    // Find the estimate by ID and update it
    const updatedEstimate = await Estimate.findByIdAndUpdate(estimateId, updateData, { new: true });

    // If the estimate does not exist
    if (!updatedEstimate) {
      return res.status(404).json({ error: 'Estimate not found' });
    }

    // Return the updated estimate
    return res.status(200).json({
      message: 'Estimate updated successfully',
      estimate: updatedEstimate
    });
  } catch (err) {
    return res.status(500).json({ error: err.message, message: 'Internal server error' });
  }
};
