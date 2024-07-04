import Item from '../models/Item.mjs';
import Category from '../models/Category.mjs';

export const createItem = async (req, res) => {
  try {
    const { name, category } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({ message: 'Item name is required' });
    }

    // Check if an item with the same name already exists
    const existingItem = await Item.findOne({ name });
    if (existingItem) {
      return res.status(400).json({ message: 'Item name already exists' });
    }

    let categoryDocument = null;
    if (category) {
      categoryDocument = await Category.findById(category);
    }

    // Create the item
    const newItem = new Item({
      ...req.body,
      category: categoryDocument,
    });

    // Save the item to the database
    await newItem.save();

    return res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const {
      name, description, sku, category, subcategory, cost, price, taxable, archived, taxes,
    } = req.body;

    // Retrieve the item from the database
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Update the item properties only if they are provided in the request body
    if (name) item.name = name;
    if (description) item.description = description;
    if (sku) item.sku = sku;
    if (category) item.category = category;
    if (subcategory) item.subcategory = subcategory;
    if (cost) item.cost = cost;
    if (price) item.price = price;
    if (taxable !== undefined) item.taxable = taxable;
    if (archived !== undefined) item.archived = archived;
    if (taxes) item.taxes = taxes;

    // Save the updated item
    const updatedItem = await item.save();

    return res.status(200).json(updatedItem);
  } catch (error) {
    return res.status(400).json({ error: error.message, message: 'Failed to edit item' });
  }
};

export const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    return res.status(200).json(item);
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message, message: 'Failed to get item by ID' });
  }
};

export const copyItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const itemToCopy = await Item.findById(itemId);

    if (!itemToCopy) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const newItem = new Item({
      name: `${itemToCopy.name} copy`,
    });

    const savedItem = await newItem.save();

    return res.status(201).json(savedItem);
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message, message: 'Failed to copy item' });
  }
};

export const archiveItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { archived } = req.body;

    const itemArchive = await Item.findById(itemId);
    if (!itemArchive) {
      return res.status(404).json({ error: 'Item not found' });
    }

    itemArchive.archived = archived;

    const updatedItem = await itemArchive.save();
    return res.status(200).json(updatedItem);
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message, message: 'Failed to archive Item' });
  }
};

export const searchItemByName = async (req, res) => {
  try {
    const { name } = req.query;
    const items = await Item.find({ name: { $regex: new RegExp(name, 'i') } }).populate('category');
    if (items.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: 'No items found with the provided name',
        });
    }
    return res
      .status(200)
      .json({ success: true, message: 'Items retrieved successfully', items });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: 'Failed to search item by name',
        error: error.message,
      });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find({ archived: false }).populate('category');
    return res.json(items);
  } catch (err) {
    return res
      .status(400)
      .json({ error: err.message, message: 'Failed to get items' });
  }
};

export const getArchivedItems = async (req, res) => {
  try {
    const items = await Item.find({ archived: true }).populate('category');
    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message, message: 'Failed to get archived items' });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const deletedItem = await Item.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    return res
      .status(200)
      .json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message, message: 'Failed to delete item' });
  }
};
