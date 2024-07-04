import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  apiCreateCategory,
  apiUpdateCategory,
  apiGetCategoryById,
  apiArchiveCategory,
  apiGetCategories,
  apiGetArchiveCategories,
  apiSearchCategoryByName,
  apiDeleteSubcategory,
  apiCopyCategory,
  apiGetSubcategories 
} from '../api/categoriesApi';

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      console.log(categoryData);
      const response = await axios.post(
        apiCreateCategory,
        {
          name: categoryData.category_name,
          subcategories: categoryData.subcategories || [],
          archived: false,
        },
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

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (payload, { rejectWithValue }) => {
    try {
      const { categoryId, categoryData } = payload;
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      const { category_name: name, subcategories } = categoryData;
      const requestData = {
        name,
        subcategories: subcategories.map(sub => sub.name ? sub : { name: sub.name }),
      };
      const response = await axios.put(`${apiUpdateCategory}/${categoryId}`, requestData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating category: ${error}`);
      return rejectWithValue(error);
      
    }
  }
);

export const getCategoryById = (categoryId) => async (dispatch) => {
  try {
    const response = await axios(`${apiGetCategoryById}/${categoryId}`);
    return response.data.category;
  } catch (error) {
    console.error(`Error in getCategoryById: ${error}`);
    throw error;
  }
};

export const archiveCategory = createAsyncThunk(
  'categories/archiveCategory',
  async ({ categoryId, isArchive }, { rejectWithValue }) => {
    try {
      console.log(categoryId);
      const response = await axios.patch(
        `${apiArchiveCategory}/${categoryId}`,
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

export const getCategories = async () => {
  try {
    const response = await axios.get(apiGetCategories);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};



export const getArchiveCategories = async () => {
  try {
    const response = await axios.get(apiGetArchiveCategories);
    return response.data;
  } catch (error) {
    console.error('Error fetching archived categories:', error);
  }
};

export const getCategoriesByName = async (categoryName) => {
  try {
    const response = await axios(`${apiSearchCategoryByName}?name=${encodeURIComponent(categoryName)}`);
    console.log("Search by name category", response.data.categories);
    return response.data.categories;
  } catch (error) {
    console.error('Error fetching categories by name:', error);
    return [];
  }
};

export const getSubcategories = createAsyncThunk(
  'subcategories/getSubcategories',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(apiGetSubcategories.replace(':categoryId', categoryId)); // Replace categoryId in the API URL
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteSubcategory = createAsyncThunk(
  'categories/deleteSubcategory',
  async (payload, { rejectWithValue }) => {
    const { categoryId, subcategoryId } = payload;
    try {
      const deleteSubcategoryURL = apiDeleteSubcategory.replace(':categoryId', categoryId).replace(':subcategoryId', subcategoryId);
      const response = await axios.delete(deleteSubcategoryURL, {
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


export const copyCategory = createAsyncThunk(
  'categories/copyCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const categoryDetails = await apiGetCategoryById(categoryId);
      const newCategory = { ...categoryDetails };
      delete newCategory._id;
      const response = await axios.post(apiCopyCategory, newCategory, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error copying category:', error);
      return rejectWithValue(error);
    }
  }
);