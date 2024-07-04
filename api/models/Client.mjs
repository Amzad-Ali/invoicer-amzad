import mongoose from 'mongoose';

const { Schema } = mongoose;
const clientSchema = new Schema({
  name: { type: String, index: true },
  address: {
    address_line_1: { type: String },
    address_line_2: { type: String },
    city: { type: String },
    state: { type: String },
    postal_code: { type: String },
    country_id: { type: Schema.Types.ObjectId, ref: 'Country' },
  },
  contact: {
    email: { type: String, index: true },
    mobile: { type: String },
  },

  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
  archived: { type: Boolean, default: false },
});

const Client = mongoose.model('Client', clientSchema);

export default Client;
