import React, { useState, useEffect } from 'react';
import { OutlinedInput, Button, Card, CardContent, Typography, Grid } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import { MenuItem, FormControl, Select } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Link as RouterLink } from 'react-router-dom';
import { RiDeleteBinLine } from "react-icons/ri";
import './../../App.css';
import { updateCategory, getCategoryById, deleteSubcategory } from '../../actions/categoryAction';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function EditCategories() {
  const dispatch = useDispatch();
  const params = useParams();
  const categoryId = params.id;
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState(null);

  const validationSchema = Yup.object().shape({
    category_name: Yup.string().required('Category name is required').min(2, 'Category name must be at least 2 characters'),
  });

  const formik = useFormik({
    initialValues: {
      category_name: '',
      subcategories: [],
    },
    validationSchema: validationSchema,
    onSubmit: () => { },
  });

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoryData = await dispatch(getCategoryById(categoryId));
        formik.setValues({
          category_name: categoryData.name || '',
          subcategories: categoryData.subcategories ? categoryData.subcategories.map(sub => ({ ...sub })) : [],
        });
        setSubcategories(categoryData.subcategories ? categoryData.subcategories.map(sub => ({ ...sub })) : []);
      } catch (error) {
        console.error('Error fetching category data:', error);
        setError('Failed to fetch category data.');
      }
    };
    fetchCategoryData();
  }, [dispatch, categoryId]);

  const handleCategoryNameChange = (event) => {
    formik.handleChange(event);
    updateCategoryData({
      category_name: event.target.value,
      subcategories: formik.values.subcategories,
    });
  };

  const addSubcategory = () => {
    const newSubcategory = {
      id: subcategories.length.toString(),
      name: '',
    };
    formik.setFieldValue('subcategories', [...formik.values.subcategories, newSubcategory]);
    setSubcategories([...subcategories, newSubcategory]);
    updateCategoryData({
      category_name: formik.values.category_name,
      subcategories: [...formik.values.subcategories, newSubcategory],
    });
  };

  const handleSubcategoryChange = (index, value) => {
    const updatedSubcategories = [...formik.values.subcategories];
    updatedSubcategories[index].name = value;
    formik.setFieldValue('subcategories', updatedSubcategories);
    setSubcategories(updatedSubcategories);
  };

  const handleSaveSubcategory = async(event) => {
    formik.handleBlur(event);
    await updateCategoryData({
      category_name: formik.values.category_name,
      subcategories: subcategories,
    });
  };

  const handleDeleteSubcategory = (categoryId,subcategoryId) => {
    deleteCategoryData(categoryId,subcategoryId);
    const updatedSubcategories = subcategories.filter((x) => x._id !== subcategoryId);
    formik.setFieldValue('subcategories', updatedSubcategories);
    setSubcategories(updatedSubcategories);
  };

  const updateCategoryData = async(data) => {
    try {
      const response = await dispatch(updateCategory({ categoryId, categoryData: data }));
      const _subcategories = response?.payload?.category?.subcategories;
      setSubcategories(_subcategories);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };
  const deleteCategoryData = (categoryId,subcategoryId) => {
    try {
      dispatch(deleteSubcategory({ categoryId, subcategoryId }));
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };
  return (
      <Card sx={{ maxWidth: 1024, mx: 'auto', mt: 4, p: 4, boxShadow: 3 }}>
      <CardContent>
      <Grid item xs={12} container justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="div" gutterBottom>
          Edit Category
        </Typography>
        <Button component={RouterLink} to='/categories/new'
            className='green-btn'
            variant='contained'
            color='success'
            sx={{mb:2}}
          >
            New Category
          </Button>
              </Grid>

      <form action='#'>
      <Grid container spacing={2}>
            <Grid item xs={12}>
          <OutlinedInput
            className='div-outlined'
            type='text'
            id="category_name"
            name="category_name"
            value={formik.values.category_name}
            onChange={handleCategoryNameChange}
            placeholder='Name'
            required
            error={formik.touched.category_name && Boolean(formik.errors.category_name)}

          />
          {formik.touched.category_name && formik.errors.category_name ? (
                <Typography variant="caption" color="error">
                  {formik.errors.category_name}
                </Typography>
              ) : null}
            </Grid>
            <Grid item xs={12} container justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Subcategories</Typography>
              <Button onClick={addSubcategory} variant='contained' color='success'>
                Add Subcategory
              </Button>
            </Grid>
        {formik.values.subcategories && formik.values.subcategories.length > 0 ? (
          formik.values.subcategories.map((subcategory, index) => (
            <Grid item xs={12} key={index} container alignItems="center" spacing={1}>
            <Grid item xs>              <OutlinedInput
                className='div-outlined'
                type='text'
                id={`subcategory._${index}`}
                name={`subcategory_${index}`}
                value={subcategory.name}
                onChange={(e) => handleSubcategoryChange(index, e.target.value)}
                onBlur={(e)=>handleSaveSubcategory(e,categoryId,subcategory._id,e.target.value)}
                placeholder='New Subcategory'
              />
              </Grid>

            <Grid item>
              <RiDeleteBinLine
                style={{ cursor: 'pointer', fontSize: '30px' }}
                onClick={() => handleDeleteSubcategory(categoryId, subcategory._id)}
              />
              </Grid>
          </Grid>
          ))
        ) : null}
        </Grid>
      </form>
      </CardContent>
    </Card>
  );
}