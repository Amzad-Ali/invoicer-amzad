import Tax from '../models/Tax.mjs';

export const addTax = async (req, res) => {
  try {
    const { name, rate } = req.body;

    // Check if name and rate exist
    if (!name || !rate) {
      return res.status(400).json({ success: false, error: 'Name and rate are required for creating a tax' });
    }

    const taxRate = parseFloat(rate);

    const existingTax = await Tax.findOne({ name });
    if (existingTax) {
      return res.status(400).json({ success: false, error: `Tax with name '${name}' already exists` });
    }

    const newTax = new Tax({ name, rate: taxRate });
    const savedTax = await newTax.save();
    return res.status(201).json({ success: true, tax: savedTax });
  } catch (error) {
    console.error('Error adding tax:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getTax = async (req, res) => {
  try {
    const taxes = await Tax.find({ archived: false });
    return res.json(taxes);
  } catch (err) {
    return res.status(400).json({ error: err.message, message: 'Failed to get taxes' });
  }
};

export const getTaxById = async (req, res) => {
  try {
    const { id } = req.params;
    const tax = await Tax.findById(id);
    if (!tax) {
      return res.status(404).json({ success: false, error: 'Tax not found' });
    }
    return res.json({ success: true, tax });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, message: 'Internal server error' });
  }
};
export const updateTax = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rate } = req.body;

    // Check if name and rate exist
    if (!name || !rate) {
      return res.status(400).json({ success: false, message: 'Name and rate are required for updating tax' });
    }

    // Parse rate string to float and convert to percentage
    const taxRate = parseFloat(rate) / 100;

    console.log(`Updating tax with ID: ${id}`);

    const tax = await Tax.findById(id);

    if (!tax) {
      console.log(`Tax with ID ${id} is not found`);
      return res.status(404).json({ success: false, message: 'Tax not found' });
    }

    console.log('Retrieved tax:', tax);

    tax.name = name;
    tax.rate = taxRate;

    await tax.save();

    console.log(`Tax with ID ${id} updated successfully`);

    return res.json({ success: true, tax });
  } catch (error) {
    console.error(`Error updating tax: ${error.message}`);
    return res.status(500).json({ success: false, error: error.message, message: 'Internal server error' });
  }
};
export const archiveTax = async (req, res) => {
  try {
    const { taxId } = req.params;
    const { archived } = req.body; // Get the 'archived' value from the request body

    const taxArchive = await Tax.findById(taxId);
    if (!taxArchive) {
      return res.status(404).json({ error: 'tax not found' });
    }

    taxArchive.archived = archived;

    const updatedTax = await taxArchive.save();
    return res.status(200).json(updatedTax);
  } catch (error) {
    return res.status(400).json({ error: error.message, message: 'Failed to update tax archive status' });
  }
};

export const getArchivedTax = async (req, res) => {
  try {
    const categories = await Tax.find({ archived: true });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(400).json({ error: error.message, message: 'Failed to get archived categories' });
  }
};

export const deleteTax = async (req, res) => {
  try {
    const { taxId } = req.params;
    const deletedTax = await Tax.findByIdAndDelete(taxId);

    if (!deletedTax) {
      return res.status(404).json({ error: 'Tax not found' });
    }

    return res.status(200).json({ success: true, message: 'Tax deleted successfully' });
  } catch (error) {
    return res.status(400).json({ error: error.message, message: 'Failed to delete tax' });
  }
};

export const searchTax = async (req, res) => {
  try {
    const { name } = req.query;

    const taxes = await Tax.find({ name: { $regex: new RegExp(name, 'i') } });

    if (taxes.length === 0) {
      return res.status(404).json({ success: false, message: 'No taxes found with the provided name' });
    }

    return res.status(200).json({ success: true, message: 'Tax retrieved successfully', taxes });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to search tax by name', error: error.message });
  }
};
