import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  apiCreateTaxes,
  apiGetTaxes,
  apiEditTax,
  apiGetSingleTax,
  apiArchiveTaxes,
  apiGetArchiveTaxes,
  apiSearchTaxByName,
  apiDeleteTax
} from '../api/taxesApi';

export const createTax = createAsyncThunk(
    'taxes/createTax',
    async (taxData, { rejectWithValue }) => {
      try {
        console.log(taxData)
        const response = await axios.post(apiCreateTaxes, {
          name: taxData.name,
          rate:taxData.rate,
          archived: false,
        }, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );

  export const updateTax = createAsyncThunk( 'taxes/updateTax', async ( payload , { rejectWithValue }) => {
      try {
        console.log(payload.taxData)
        const taxData=payload.taxData;
        const taxId= payload.taxId;
      
        const response = await axios.put(`${apiEditTax}/${taxId}`, {
          name:taxData.name,
         rate: taxData.rate,
          archived: false,
        }, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );
  export const getTaxById = (taxId) => async (dispatch) => {
    try {
      const response = await axios(`${apiGetSingleTax}/${taxId}`);
      return response.data.tax;
    } catch (error) {
      console.error(`Error in getTaxById: ${error}`);
      throw error;
    }
  };
  
  export const archiveTax = createAsyncThunk(
    'taxes/archiveTax',
    async ({ taxId, isArchive }, { rejectWithValue }) => {
      try {
        console.log("dklfasljd",taxId,isArchive);
        const response = await axios.patch(
          `${apiArchiveTaxes}/${taxId}`,
          { archived: isArchive },
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );
  
  export const getTaxes = async () => {
    try {
      const response = await axios.get(apiGetTaxes);
      // console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching taxes:', error);
    }
  };
  
  export const getArchiveTaxes = async () => {
    try {
      const response = await axios.get(apiGetArchiveTaxes);
      return response.data;
    } catch (error) {
      console.error('Error fetching archived taxes:', error);
    }
  };
  
  export const getTaxesByName = async (taxName) => {
    try {
      console.log("sdfs",taxName)
      const response = await axios(`${apiSearchTaxByName}?name=${encodeURIComponent(taxName)}`);
      console.log("Search by name tax", response.data.taxes);
      return response.data.taxes;
    } catch (error) {
      console.log(error);
      console.error('Error fetching taxes by name:', error);
      return [];
    }
  };

  export const deleteTax = createAsyncThunk(
    'taxes/deleteTax',
    async (taxId, { rejectWithValue }) => {
      try {
        const response = await axios.delete(`${apiDeleteTax}/${taxId}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );