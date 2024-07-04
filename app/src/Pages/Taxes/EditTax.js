import React, { useState,useEffect } from 'react';
import { OutlinedInput } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import { MenuItem, FormControl, Select } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { RiDeleteBinLine } from "react-icons/ri";
import { Link as RouterLink } from 'react-router-dom';
import './../../App.css';
import { updateTax, getTaxById } from '../../actions/taxAction';
import { useFormik } from 'formik';
import * as Yup from 'yup';


export default  function EditTaxes() {
  const dispatch = useDispatch();
  const params = useParams();
  const taxId = params.id;
  const [error, setError] = useState(null);
  const [edit,setEdit] = useState({});
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('tax name is required').min(2, 'Tax name must be at least 2 characters'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      rate:''
    },
    validationSchema: validationSchema,
    onSubmit: () => { },
  });

  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        const taxData = await dispatch(getTaxById(taxId));
        console.log("sdf",taxData)
        setEdit(taxData);
        formik.setValues({
          name: taxData.name || '',
          rate:taxData.rate || ''
        });
      } catch (error) {
        console.error('Error fetching tax data:', error);
        setError('Failed to fetch tax data.');
      }
    };
    
    fetchTaxData();
  }, [dispatch, taxId]);
  // console.log("sdfs",fetchTaxData);
  const handleTaxNameChange = (event) => {
    formik.handleChange(event);
    updateTaxData({
      name: event.target.value,
      rate: edit.rate
    });
  };
  const handleTaxRateChange = (event) => {
    formik.handleChange(event);
    updateTaxData({
      name: edit.name,
      rate: event.target.value
    });
  };
  const updateTaxData = (data) => {
    try {
      dispatch(updateTax({ taxId, taxData: data }));
    } catch (error) {
      console.error('Error updating tax:', error);
    }
  };

  return(
    <div>
        <section className='section'>
    <div className='header-div1'>
      <i className="fa-sharp fa-regular fa-bell"></i>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className='header-p'>Edit Tax
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

    <form action='#'>
      <div className='form-div1'>
        <OutlinedInput
          className='div-outlined'
          type='text'
          id='name'
          value={formik.values.name}
          onChange={handleTaxNameChange}
            placeholder='Name'
            required

          
        />
      </div>
      <div className='form-div1' style={{marginTop:'20px'}}>
        <OutlinedInput
          className='div-outlined'
          type='text'
          id='rate'
          name="rate"
          onChange={handleTaxRateChange}
          value={formik.values.rate}
          placeholder='Rate'
          
        />
      </div>
    </form>

  </section>
    </div>
    
  ) 
}