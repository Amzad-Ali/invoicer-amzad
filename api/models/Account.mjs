import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

const accountSchema = new Schema({
  name: {
    type: String,
    index: true
  },
  account_email: {
    type: String,
    unique: true,
    index: true
  },
  public_email: {
    type: String,
    index: true
  },
  mobile: {
    type: String
  },
  site_url: {
    type: String
  },
  information: {
    type: String
  },
  address: {
    type: Schema.Types.ObjectId, ref: 'Address'
  },
});

const Account = mongoose.model('Account', accountSchema);

export default Account;