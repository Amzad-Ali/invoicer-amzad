import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiCreateAccount, apiUpdateAccount, apiGetAccountById, apiFetchAccount, uploadFile } from '../api/settingsApi';
//TODO : move the API name and path to api file

export const getAccountById = async (id) => {
  try {
    const response = await axios.post(`${apiGetAccountById}`, { id });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`this error is getclientbyid error  ${error}`);
  }
}


export const updateAccount = createAsyncThunk("account/updateAccount", async (clientData, { rejectWithValue }) => {
  console.log("Incoming clientData:", clientData);
  try {
    const client_id = clientData.client_id;
    console.log("actionClientId==>", client_id);
      const response = await axios.put(`${apiUpdateAccount}${client_id}`, {
      "name": clientData.name,
      "account_email": clientData.account_email,
      "public_email": clientData.public_email,
      "mobile": clientData.mobile,
      "site_url": clientData.site_url,
      "information": clientData.information,
      "address": {
        "address_line_1": clientData.address.address_line_1,
        "address_line_2": clientData.address.address_line_2,
        "city": clientData.address.city,
        "country_id": clientData.address.country_id || null,
        "postal_code": clientData.address.postal_code,
        "state": clientData.address.state,
      },
      "active": true
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log("form data to update==>", response.data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});



export const createAccount = createAsyncThunk("account/createAccount", async (clientData, { rejectWithValue }) => {
  try {
      const response = await axios.post(`${apiCreateAccount}`, {
      "name": clientData.name,
      "account_email": clientData.account_email,
      "public_email": clientData.public_email,
      "mobile": clientData.mobile,
      "site_url": clientData.site_url,
      "information": clientData.information,
      "address": {
        "address_line_1": clientData.address.address_line_1,
        "address_line_2": clientData.address.address_line_2,
        "city": clientData.address.city,
        "country_id": clientData.address.country_id || null,
        "postal_code": clientData.address.postal_code,
        "state": clientData.address.state,
      },
      "active": true
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    // console.log(response.data);
    return response.data;


  } catch (error) {
    return rejectWithValue(error);
  }
});

export const uploadFiles = createAsyncThunk("upload/uploadFile", async (file, { rejectWithValue }) => {
  const formData = new FormData();
  formData.append('file', file);
  console.log('uploadedData==>', file);
  try {
    const response = await axios.post(`${uploadFile}`, formData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      }
    });
    // console.log(response.data);
    return response.data;


  } catch (error) {
    return rejectWithValue(error);
  }
});

//   'file/upload',
//   async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);

//     const response = await axios.post(`${uploadFile}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     return response.data;
//   }
// );