import mongoose from 'mongoose';

const { Schema } = mongoose;

const estimateSchema = new Schema({
  logo: { type: String },
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
  client: {
    client_id: { type: Schema.Types.ObjectId, ref: 'Client' },
    billing_address: {  type: Schema.Types.ObjectId, ref: 'Address' },
    shipping_address: { type: Schema.Types.ObjectId, ref: 'Address' },
  },
  address: { type: String },
  issued_date: { type: Date },
  due_date: { type: Date },
  currency: { type: Schema.Types.ObjectId, ref: 'Country' },
  language: { type: String },
  estimate_number: { type: String, unique: true, index: true },
  reference_number: { type: String },
  items: [{
    item: { type: Schema.Types.ObjectId, ref: 'Item' },
    quantity: { type: Number },
    line_total: { type: Number },
    name: { type: String },
    description: { type: String },
    price: { type: Number },
  }],
  discounts: [{
    name: { type: String },
    rate: { type: Number },
    amount: { type: Number },
  }],
  taxes: [{
    tax_id: { type: Schema.Types.ObjectId, ref: 'Tax' },
    name: { type: String },
    rate: { type: Number },
  }],
  subtotal: { type: Number },
  tax_total: { type: Number },
  total: { type: Number },
  notes: { type: String },
  terms: { type: String },
  attachments: { type: String }, // URL path
  status: { type: String },
  archived: { type: Boolean, default: false },
  invoiced: { type: Boolean, default: false },
  sent: { type: Boolean, default: false },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Estimate = mongoose.model('Estimate', estimateSchema);

export default Estimate;