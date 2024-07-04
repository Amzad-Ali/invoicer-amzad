import { Parser } from 'json2csv';
import mongoose from 'mongoose';
import Client from '../models/Client.mjs';

// TODO : remove extra bkank lines
export const createClient = async (req, res) => {
  try {
    const { contact, name } = req.body; // destructor

    // TODO: Improve validation to check for required fields more comprehensively
    if (!contact || (!contact.email && !name)) {
      return res.status(400).json({ error: 'Either name or email must be provided' });
    }

    // TODO: Validate email format more strictly. add method in utility
    if (contact && contact.email) {
      // TODO: no need to create email and use destructor, directly use contact.email
      const { email } = contact;
      // TODO: Handle case insensitivity in email comparison
      const existingClientEmail = await Client.findOne({ 'contact.email': email });
      if (existingClientEmail) {
        return res.status(400).json({ error: `Client already exists with email ${email}` });
      }
    }

    // TODO: Consider using a try-catch block for the client creation to handle any potential errors
    // TODO: use create method directly instead of instance and save
    const newClient = new Client(req.body); // Why is this important
    const savedClient = await newClient.save();
    return res.json(savedClient);
  } catch (err) {
    // Todo : return 500 instead of 400 , read more about status code
    return res.status(400).json({ error: err.message, message: 'internal server error' });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    // TODO: Extract a utility function for object validation isValidObjectId or use loadash
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ error: 'Invalid Client ID', message: 'Please provide a valid Client ID' });
    }
    // TODO: Consider using findByIdAndUpdate for a more efficient update
    // TODO: Move this call after checking for body and unique
    const existingClient = await Client.findById(clientId);
    if (!existingClient) {
      return res.status(404).json({ error: 'Client not found' });
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Empty request body', message: 'Request body cannot be empty' });
    }

    // TODO destruct req.body
    if (req.body.contact && req.body.contact.email) {
      const { email } = req.body.contact;
      // TODO: create a function isUnique
      const existingClientEmail = await Client.findOne({ 'contact.email': email });
      if (existingClientEmail && existingClientEmail.id.toString() !== clientId) {
        return res.status(400).json({ error: `Client with email ${email} already exists` });
      }
    }
    // TODO : remove below line after using findByIdAndUpdate 
    Object.assign(existingClient, req.body);
    const updatedClient = await existingClient.save();
    // TODO : move response for client not found
    return res.status(200).json({ success: true, message: 'Client updated successfully', client: updatedClient });
  } catch (error) {
    return res.status(400).json({ error: error.message, message: 'Failed to update client' });
  }
};

export const getClientById = async (req, res) => {
  try {
    const { clientId } = req.params;
    // TODO : add check for object ID validaity
    const client = await Client.findById(clientId);
    // TODO: use 400 error here.
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    return res.status(200).json(client);
  } catch (error) {
    return res.status(400).json({ error: error.message, message: 'Failed to get client details' });
  }
};

// TODO this method should be merged with getArchivedClients
// TODO use query parameter
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ archived: false });
    return res.json(clients);
  } catch (err) {
    return res.status(400).json({ error: err.message, message: 'Failed to get clients' });
  }
};

export const archiveClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { archived } = req.body;

    // TODO : add check for object ID validaity
    // TODO use updateOne instead of find and save
    const clientArchive = await Client.findById(clientId);
    // TODO : replace 404 with 400
    // TODO : check for nmodfied 
    if (!clientArchive) {
      return res.status(404).json({ error: 'Client not found' });
    }

    clientArchive.archived = archived;
    const updatedClient = await clientArchive.save();
    // TODO : add message to the success , no need to return object
    return res.status(200).json(updatedClient);
  } catch (error) {
    return res.status(400).json({ error: error.message, message: 'Failed to archive client' });
  }
};

// TODO merge with getClients
export const getArchivedClients = async (req, res) => {
  try {
    const clients = await Client.find({ archived: true });
    return res.status(200).json(clients);
  } catch (error) {
    return res.status(400).json({ error: error.message, message: 'Failed to get archived clients' });
  }
};

export const searchClient = async (req, res) => {
  try {
    const { name } = req.query;
    const clients = await Client.find({ name: { $regex: new RegExp(name, 'i') } });

    if (clients.length === 0) {
      return res.status(404).json({ success: false, message: 'No clients found with the provided name' });
    }

    return res.status(200).json({ success: true, message: 'Client retrieved successfully', clients });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to search client by name', error: error.message });
  }
};

/**
 * Export clients' data to CSV.
 * @param {Object} req - The HTTP request object.
 * fields : name,email,address_1......
 * @param {Object} res - The HTTP response object.
 * @returns {Object} HTTP response object.
  */
// TODO: if there are any field that is not part of field mapping then show the error
// TODO: If no fields sent then return data with all fields
// TODO : remove commented code
// TODO: add to expert filtered records
export const exportClients = async (req, res) => {
  try {
    // Extract fields parameter from the request query
    const { fields } = req.query;

    // Define field mapping for frontend to backend field names

    const fieldMapping = {
      name: 'name',
      email: 'contact.email',
      address_1: 'address.address_line_1',
      address_2: 'address.address_line_2',
      phone: 'contact.mobile',
      city: 'address.city',
      state: 'address.state',
      zip: 'address.postal_code',
      country: 'address.country_id',
      isArchived: 'archived',
      estimates_count: 'estimatesCount', // for future purpose
      invoices_count: 'invoicesCount', // for future purpose
      summary_data: 'summaryData', // for future purpose
    };

    // const newFieldMapping = {
    //   name: 'name',
    //   'contact.email': 'Email',
    //   'address.address_line_1': 'address 1',
    //   'address.address_line_2': 'address 2',
    //   'contact.mobile': 'Phone',
    //   'address.city': 'City',
    //   'address.state': 'State',
    //   'address.postal_code': 'Zip',
    //   'address.country_id': 'country',
    //   archived: 'archived',
    //   estimates_count: 'estimatesCount',
    //   invoices_count: 'Invoices Count',
    //   summary_data: 'summary Data',

    // };
    let selectedFields;
    if (!fields || typeof fields !== 'string') {
      // If no fields are selected, export all fields
      selectedFields = Object.keys(fieldMapping);
    } else {
      selectedFields = fields.split(',');
    }
    // Map selected fields from frontend to backend field names
    const mappedFields = selectedFields.map((field) => fieldMapping[field]);

    // Fetch clients data from the database
    const clients = await Client.find({}, mappedFields.join(' '));

    // Check if clients found
    if (clients.length === 0) {
      // Return 204 No Content status code if no data found
      return res.status(204).end();
    }

    // Convert data to CSV format using json2csv parser
    const json2csvParser = new Parser({ fields: mappedFields });
    let csvData = json2csvParser.parse(clients);

    Object.keys(fieldMapping).forEach((key) => {
      csvData = csvData.replace(new RegExp(fieldMapping[key], 'g'), key);
    });

    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=clients.csv');

    // Send CSV data as response
    return res.status(200).send(csvData);
  } catch (error) {
    // Handle errors
    return res.status(400).json({ error: error.message, message: 'Failed to export clients' });
  }
};
