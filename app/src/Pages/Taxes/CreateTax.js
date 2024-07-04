import React, { useState } from 'react';
import { OutlinedInput } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import { MenuItem, FormControl, Select } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { RiDeleteBinLine } from "react-icons/ri";
import { Link as RouterLink } from 'react-router-dom';
import './../../App.css';
import { useDispatch } from 'react-redux';
import { createTax,updateTax } from '../../actions/taxAction';
import { useFormik } from 'formik';
import * as Yup from 'yup';
export default  function CreateTaxes() {
  const dispatch = useDispatch();
  const[id,setId]=useState('');
  const validationSchema = Yup.object().shape({
    tax_name: Yup.string().required('').min(2, 'Name must be at least 2 characters'),
    // tax_rate: Yup.string().number('Invalid email format').required(''),
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      rate:'',
    },
    validationSchema: validationSchema
  });
  const handleBlur = async(event) => {
    
    formik.handleBlur(event);
    if(id){
      console.log(formik.values);
      const formik_value=formik.values;
      const payload = {
        taxId: id, // Assuming id is the ID of the tax entry being updated
        taxData: formik_value
      };
      const updateTaxResponse= await  dispatch(updateTax(payload));

      console.log(updateTaxResponse.payload);
    }
    else{
       
      const taxResponse= await  dispatch(createTax(formik.values));
      // console.log(taxResponse.payload.tax._id);

      // const ide=taxResponse.payload.tax._id;
      // setId(ide); 
      // console.log(ide)
      
    }       
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return(
    <section className='section'>
    <div className='header-div1'>
      <i className="fa-sharp fa-regular fa-bell"></i>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className='header-p'>New Tax
      {/* <p>These are the values that will remain by default for this this tax</p> */}
      </div>
      
      <div className='green-div'>
        <Button component={RouterLink} to='/taxes/new'
          className='green-btn'
          variant='contained'
          color='success'
        >
          New Tax
        </Button>
      </div>
    </div>

    <form action='#' onSubmit={handleSubmit}>
      <div className='form-div1'>
        <OutlinedInput
          className='div-outlined'
          type='text'
          id='name'
          name="name"
          placeholder='Name'
          value={formik.values.name}
          onBlur={handleBlur}
          onChange={formik.handleChange}
          
        />
        {formik.touched.name && formik.errors.name ? (
            <div style={{ color: 'red' }}>{formik.errors.name}</div>
          ) : null}
      </div>
      <div className='form-div1' style={{marginTop:'20px'}}>
        <OutlinedInput
          className='div-outlined'
          type='text'
          id='rate'
          name="rate"
          placeholder='Rate'
          value={formik.values.rate}
          onBlur={handleBlur}
          onChange={formik.handleChange}
          
        />
      </div>
    </form>



    
  </section>
    
  ) 
}