import mongoose from "mongoose";
// import accounts from "../models/Account.mjs";
// import addresses from "../models/Address.mjs";
import Account from "../models/Account.mjs";
import Address from "../models/Address.mjs";
import Country from "../models/Country.mjs";

export const getAccountById = async (req, res) => {
  try {
    // const accountId = '6660219b41cf90333b2d4eba';
    // const {accountId} = req.params;
    const accountId = req.body.id;
    const account = await Account.findById(accountId).populate('address');
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching account' });
  }
}

export const fetchAccounts = async (req, res) => {
  try {
    const Accounts = await Account.find().populate('address');
    return res.json(Accounts);
  } catch (err) {
    return res.status(400).json({ error: err.message, message: 'Failed to get Accounts' });
  }
}

// export const createOrUpdateAccount = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, account_email, public_email, mobile, site_url, information, address } = req.body;

//     // Check for duplicate account_email
//     const existingAccountWithEmail = await Account.findOne({ account_email });
//     if (existingAccountWithEmail && !id) {
//       return res.status(400).json({ message: 'Account email already exists' });
//     }

//     if (id) {
//       // Update existing account
//       const existingAccount = await Account.findById(id);
//       if (!existingAccount) {
//         return res.status(404).json({ message: 'Account not found' });
//       }

//       // Update address if provided
//       if (address) {
//         const existingAddress = await Address.findOne({ _id: existingAccount.address });
//         if (existingAddress) {
//           console.log('existingAddress==>', existingAddress);
//           existingAddress.address_line_1 = address.address_line_1;
//           existingAddress.address_line_2 = address.address_line_2;
//           existingAddress.city = address.city;
//           existingAddress.country_id = address.country_id;
//           existingAddress.postal_code = address.postal_code;
//           existingAddress.state = address.state;
//           await existingAddress.save();
//           console.log('existingAddress==>', existingAddress);
//         } else {
//           const newAddress = new Address(address);
//           const savedAddress = await newAddress.save();
//           existingAccount.address = savedAddress._id;
//         }
//       }

//       // Update account fields
//       existingAccount.name = name;
//       existingAccount.account_email = account_email;
//       existingAccount.public_email = public_email;
//       existingAccount.mobile = mobile;
//       existingAccount.site_url = site_url;
//       existingAccount.information = information;

//       const updatedAccount = await existingAccount.save();
//       const populatedAccount = await updatedAccount.populate('address');
//       res.status(200).json(populatedAccount);
//     } else {
//       // Create new account
//       // Check if account_email is already taken
//       if (existingAccountWithEmail) {
//         return res.status(400).json({ message: 'Account email already exists' });
//       }

//       // Create a new address document
//       const newAddress = new Address(address);
//       const savedAddress = await newAddress.save();

//       // Create a new account document with the saved address id
//       const newAccount = new Account({
//         name,
//         account_email,
//         public_email,
//         mobile,
//         site_url,
//         information,
//         address: savedAddress._id,
//       });

//       const savedAccount = await newAccount.save();
//       const populatedAccount = await savedAccount.populate('address');
//       res.status(201).json(populatedAccount);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error creating or updating account' });
//   }
// }


// new 


export const createOrUpdateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, account_email, public_email, mobile, site_url, information, address } = req.body;

    // Check for duplicate account_email
    const existingAccountWithEmail = await Account.findOne({ account_email });
    if (existingAccountWithEmail && !id) {
      return res.status(400).json({ message: 'Account email already exists' });
    }

    if (id) {
      // Update existing account
      const existingAccount = await Account.findById(id);
      if (!existingAccount) {
        return res.status(404).json({ message: 'Account not found' });
      }

      // Update address if provided
      if (address) {
        // const existingAddress = await Address.findById(existingAccount.address);
        const existingAddress = await Address.findOne({ _id: existingAccount.address });
        if (!existingAddress) {
          return res.status(404).json({ message: 'Address not found' });
        }

        // Update country if provided
        if (address.country_id) {
          const existingCountry = await Country.findById(address.country_id);
          if (!existingCountry) {
            return res.status(404).json({ message: 'Country not found' });
          }
          existingAddress.country_id = existingCountry._id;
          // You can update other fields of the country as needed
        }

        existingAddress.address_line_1 = address.address_line_1;
        existingAddress.address_line_2 = address.address_line_2;
        existingAddress.city = address.city;
        existingAddress.postal_code = address.postal_code;
        existingAddress.state = address.state;

        await existingAddress.save();
      }

      // Update account fields
      existingAccount.name = name;
      existingAccount.account_email = account_email;
      existingAccount.public_email = public_email;
      existingAccount.mobile = mobile;
      existingAccount.site_url = site_url;
      existingAccount.information = information;

      const updatedAccount = await existingAccount.save();
      // const populatedAccount = await updatedAccount.populate('address');
      const populatedAccount = await updatedAccount.populate({
        path: 'address',
        populate: { path: 'country_id' }
      })
      res.status(200).json(populatedAccount);
    } else {
      // Create new account
      // Check if account_email is already taken
      if (existingAccountWithEmail) {
        return res.status(400).json({ message: 'Account email already exists' });
      }

      // Create a new address document
      const newAddress = new Address({
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2,
        city: address.city,
        postal_code: address.postal_code,
        state: address.state,
        country_id: address.country_id, // Assign the country id directly
      });

      const savedAddress = await newAddress.save();

      // Create a new account document with the saved address id
      const newAccount = new Account({
        name,
        account_email,
        public_email,
        mobile,
        site_url,
        information,
        address: savedAddress._id,
      });

      const savedAccount = await newAccount.save();
      // const populatedAccount = await savedAccount.populate('address');
      const populatedAccount = await savedAccount.populate({
        path: 'address',
        populate: { path: 'country_id' }
      })
      res.status(201).json(populatedAccount);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating or updating account' });
  }
};
