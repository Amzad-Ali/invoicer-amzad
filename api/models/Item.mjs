import mongoose from 'mongoose';

const { Schema } = mongoose;

const addItemSchema = new mongoose.Schema({

  name: {
    type: String,
    index: true,
  },

  description: {
    type: String,
  },

  sku: {
    type: String,
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  subcategory: {
    type: Schema.Types.ObjectId,
  },
  cost: {
    type: Number,
  },

  price: {
    type: Number,
  },

  taxable: {
    type: Boolean,
    default: false,
  },

  archived: {
    type: Boolean,
    default: false,
  },

  taxes: [{
    type: Schema.Types.ObjectId,
    ref: 'Tax',
  }],

  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' },

});

const Item = mongoose.model('Item', addItemSchema);
export default Item;
