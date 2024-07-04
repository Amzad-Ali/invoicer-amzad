import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { OutlinedInput, Button, Card, CardContent, Typography, Grid } from '@mui/material';
import { RiDeleteBinLine } from "react-icons/ri";
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { createCategory, getCategoryById, updateCategory } from '../../actions/categoryAction';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function CreateCategories(categoryId) {
  const dispatch = useDispatch();
  const[id,setId]=useState('');
  const [subcategories, setSubcategories] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    category_name: Yup.string().required('Category name is required').min(2, 'Category name must be at least 2 characters'),
  });

  const formik = useFormik({
    initialValues: {
      category_name: '',
      subcategories: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(updateCategory(categoryId, {
          category_name: values.category_name,
          subcategories: values.subcategories,
        }));
        formik.resetForm();
        setSubcategories([]);
      } catch (error) {
        console.error('Error creating category:', error);
      }
    },
  });

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const { copyCategory } = location.state || {};
        if (copyCategory) {
          const categoryDetails = await dispatch(getCategoryById(copyCategory._id));
          formik.setValues({
            category_name: categoryDetails.name,
            subcategories: categoryDetails.subcategories || [],
          });
          setSubcategories(categoryDetails.subcategories || []);
        }
      } catch (error) {
        console.error('Error fetching category details:', error);
      }
    };

    fetchCategoryDetails();
  }, [dispatch, location.state]);


  const handleBlur = async (event) => {
    formik.handleBlur(event);
  
    try {
      if (id) {
        // If id exists, it means we are updating an existing category
        const payload = {
          categoryId: id, // Assuming id is the ID of the category being updated
          categoryData: formik.values // Include the updated category data
        };
        await dispatch(updateCategory(payload));
      } else {
        // If id doesn't exist, it means we are creating a new category
        const response = await dispatch(createCategory(formik.values));
        const newCategoryId = response.payload.category._id;
        setId(newCategoryId); // Update the id state with the newly created category id
      }
    } catch (error) {
      console.error('Error handling category:', error);
    }
  };
  

  const handleCategoryNameChange = (event) => {
    formik.handleChange(event);
  };

  const addSubcategory = async () => {
    try {
      const newSubcategoryName = '';
  
      const isDuplicate = formik.values.subcategories.some(subcategory => subcategory.name === newSubcategoryName);
  
      if (!isDuplicate) {
        const newSubcategory = {
          id: subcategories.length.toString(),
          name: newSubcategoryName,
        };
        formik.setFieldValue('subcategories', [...formik.values.subcategories, newSubcategory]);
        setSubcategories([...subcategories, newSubcategory]);
      } else {
        console.error('Duplicate subcategory:', newSubcategoryName);
      }
    } catch (error) {
      console.error('Error adding subcategory:', error);
    }
  };
  

  const handleSubcategoryChange = (index, value) => {
    const updatedSubcategories = [...formik.values.subcategories];
    updatedSubcategories[index].name = value;
    formik.setFieldValue('subcategories', updatedSubcategories);
    setSubcategories(updatedSubcategories);
  };

  const handleDeleteSubcategory = async (index) => {
    try {
      const updatedSubcategories = formik.values.subcategories.filter((_, subIndex) => subIndex !== index);
      formik.setFieldValue('subcategories', updatedSubcategories);
      setSubcategories(updatedSubcategories);
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
  };


  return (
    <Card sx={{ maxWidth: 1024, mx: 'auto', mt: 4, p: 4, boxShadow: 3 }}>
      <CardContent>
      <Grid item xs={12} container justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="div" gutterBottom>
          New Category
        </Typography>
        <Button component={RouterLink} to='/categories/new' className='green-btn' variant='contained' color='success' sx={{mb:2}}>
            New Category
          </Button>
              </Grid>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <OutlinedInput
                fullWidth
                type='text'
                id="category_name"
                name="category_name"
                value={formik.values.category_name}
                onChange={handleCategoryNameChange}
                onBlur={handleBlur}
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
                  <Grid item xs>
                    <OutlinedInput
                      fullWidth
                      type='text'
                      id={`subcategory_${index}`}
                      name={`subcategory_${index}`}
                      value={subcategory.name}
                      onChange={(e) => handleSubcategoryChange(index, e.target.value)}
                      onBlur={handleBlur}
                      placeholder='Subcategory Name'
                    />
                  </Grid>
                  <Grid item>
                    <RiDeleteBinLine
                      style={{ cursor: 'pointer', fontSize: '24px' }}
                      onClick={() => handleDeleteSubcategory(index)}
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