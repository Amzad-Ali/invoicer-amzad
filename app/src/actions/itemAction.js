import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  apiGetItems,
  apiCreateItem,
  apiUpdateItem,
  apiGetItemById,
  apiArchiveItem,
  apiSearchItemByName,
  apiCopyItem,
  apiGetArchivedItems,
  apiDeleteItem
} from "../api/itemsApi";



export const createItem = createAsyncThunk(
  'items/createItem',
  async (itemData, { rejectWithValue }) => {
    try {
    
      const response = await axios.post(apiCreateItem, itemData);
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ itemId, itemData }, { rejectWithValue }) => {
    try {
      console.log(itemData);
      const response = await axios.put(`${apiUpdateItem}/${itemId}`, itemData);
      console.log(response.data)
      return response.data;  
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getItemById = (itemId) => async (dispatch) => {
  try {
    const response = await axios.get(`${apiGetItemById}/${itemId}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getItemById: ${error}`);
    throw error;
  }
};

export const archiveItem = createAsyncThunk(
  'items/archiveItem',
  async ({ itemId, isArchive }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${apiArchiveItem}/${itemId}`,
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

export const searchItemByName = async (itemName) => {
  try {
    const response = await axios(`${apiSearchItemByName}?name=${encodeURIComponent(itemName)}`);
    console.log("Search item by name", response.data.items);
    return response.data.items;
  } catch (error) {
    console.error('Error fetching items by name:', error);
    return [];
  }
};


export const copyItem = createAsyncThunk(
  'items/copyItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const itemDetails = await apiGetItemById(itemId);
      const newItem = {
        ...itemDetails,
        name: `${itemDetails.name} copy`,
      };
      delete newItem._id;
      const response = await axios.post(apiCopyItem, newItem, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error copying item:', error);
      return rejectWithValue(error);
    }
  }
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${apiDeleteItem}/${itemId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getItems = async() => {
  try{
    const response = await axios.get(apiGetItems);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }


export const getArchivedItems = async () => {
  try {
    const response = await axios.get(apiGetArchivedItems);
    return response.data;
  } catch (error) {
    console.error('Error fetching archived items:', error);
  }
};