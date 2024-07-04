import React from 'react'
import { useState, useEffect, useRef } from 'react';
import Divider from '@mui/material/Divider';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
// import { objectId } from 'yup-objectid';
import { updateAccount, createAccount, getAccountById } from '../../actions/settingAction';
import { fetchCountries } from '../../actions/clientAction';
// import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
// import TuneTwoToneIcon from '@mui/icons-material/TuneTwoTone';

import { Typography, Link } from '@mui/material';
import { Link as RouterLink, json } from 'react-router-dom';
import { Box, OutlinedInput } from '@mui/material';
import axios from 'axios';

// import { alpha, styled } from '@mui/material/styles';
// import { OutlinedInput } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import { MenuItem, FormControl, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useDispatch } from "react-redux";

import './../../App.css';



export default function Account() {


  const dispatch = useDispatch();
  // const{clients}=useSelector((state)=>state.app);

  // this is for fetch the data on the bases of specific individual data
  const [edit, setEdit] = useState({});
  const [id, setId] = useState('');
  const [accountData, setAccountData] = useState('');

  useEffect(() => {
    let storedData = localStorage.getItem('accountData');
    console.log(storedData);
    if (storedData) {
      storedData = JSON.parse(storedData);
      console.log(storedData?._id);
      setAccountData(storedData);
      setId(storedData?._id) ;
    }
  }, []);
  useEffect(() => {
    const Editclients = async () => {
      try {
        const clientDataById = await getAccountById(id)
        if(clientDataById){
          setEdit(clientDataById)
        }
      } catch (error) {
        console.error(error);
      }
    };
    Editclients();
  }, [id]);
  
  function handleInputChange(field, value) {
    setSavingMessage(true);
    setSaving(true);
    if (field.startsWith('address.')) {
      const addressField = field.replace('address.', '');
      setEdit((prevEdit) => ({
        ...prevEdit,
        address: {
          ...prevEdit.address,
          [addressField]: value,
        },
      }));
      formik.setFieldValue(`address.${addressField}`, value);
    } else {
      setEdit((prevEdit) => ({ ...prevEdit, [field]: value }));
      formik.setFieldValue(field, value);
    }
  }


  const [selectedCountry, setSelectedCountry] = useState('');
  const [countriesData, setCountriesData] = useState([]);
  
  const clientid = edit?._id;
  const [clickCountry, setClickCountry] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingMessage, setSavingMessage] = useState(false);
  
  const fetchData = async () => {
    try {
      const countries = await fetchCountries();
      setCountriesData(countries);
    } catch (error) {
      console.error('Error fetching archive clients:', error);
    }
  };

  useEffect(() => {
    fetchData();
  },[]);

  countriesData.map((countryId)=>{
    console.log('countriesId===>',countryId._id);
  })
  

  const handleChange = (event) => {
    formik.handleChange(event);
    setSelectedCountry(event.target.value);
  };


  // const validationSchema = Yup.object().shape({
  //   name: Yup.string(),
  //   account_email: Yup.string(),
  // });

  const validationSchema = Yup.object().shape({
    name: Yup.string(),
    account_email: Yup.string(),
    public_email: Yup.string(),
    mobile: Yup.string(),
    site_url: Yup.string(),
    information: Yup.string(),
    address: Yup.object().shape({
      address_line_1: Yup.string(),
      address_line_2: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      postal_code: Yup.string(),
      // country_id: objectId(),
    }),
  });


  useEffect(() => {
    if (edit) {
      formik.setValues({
        name: edit.name || "",
        account_email: edit?.account_email || "",
        public_email: edit?.public_email || "",
        mobile: edit?.mobile || "",
        site_url: edit?.site_url || "",
        information: edit?.information || "",
        // client_State: edit?.address?.state || "",
        // client_Zip: edit?.address?.postal_code || "",
        // selectedCountry: edit?.address?.country || "",
        address: {
          address_line_1: edit?.address?.address_line_1 || "",
          address_line_2: edit?.address?.address_line_2 || "",
          city: edit?.address?.city || "",
          country_id: edit?.address?.country_id || "",
          postal_code: edit?.address?.postal_code || "",
          state: edit?.address?.state || "",
        }
      });
    }
  }, [edit]);

  const formik = useFormik({
    initialValues: {
      name: edit.name || "",
      account_email: edit?.account_email || "",
      public_email: edit?.public_email || "",
      mobile: edit?.mobile || "",
      site_url: edit?.site_url || "",
      information: edit?.information || "",
      // client_State: edit?.address?.state || "",
      // client_Zip: edit?.address?.postal_code || "",
      // selectedCountry: selectedCountry,
      client_id: clientid,
      address: {
        address_line_1: edit?.address?.address_line_1 || "",
        address_line_2: edit?.address?.address_line_2 || "",
        city: edit?.address?.city || "",
        country_id: edit?.address?.country_id || "",
        postal_code: edit?.address?.postal_code || "",
        state: edit?.address?.state || "",
      }
    },
    validationSchema: validationSchema
  });


  const handleBlur = async (event) => {

    formik.handleBlur(event);
    if (clientid) {
      // if('6662c5788d94d10c3398b2ca' !== clientid){
      const formik_value = formik.values;
      formik_value.client_id = clientid;
      const updateClientResponse = await dispatch(updateAccount(formik_value));
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        setSavingMessage(false);
      }, 1000)
    }
    else {
      const clientResponse = await dispatch(createAccount(formik.values));
      if(clientResponse){
        console.log(formik.values);
        const ide = clientResponse.payload._id;
        localStorage.setItem('accountData',JSON.stringify(clientResponse.payload));
        setId(ide);
      }
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        setSavingMessage(false);
      }, 1000)
      
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (

    <section className='section'>
      <Box sx={{
        textAlign: 'left'
      }}>
        <Typography sx={{ fontSize: '2rem', color: '#575757', }}>Settings</Typography>
      </Box>
      <Divider
        sx={{
          mt: '20px',
        }}
      ></Divider>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          '& > *': {
            m: 5,
          },
        }}
      >
        <ButtonGroup aria-label="Basic button group"
          sx={{
            height: '3.5rem',
            width: '96%',
            ml: '0px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Button sx={{
            width: '16%',
            border: 'none',
            color: 'black',
            '&:hover': {
              border: 'none',
            },
          }}
            key="one" component={RouterLink} to='/settings/account'>Account</Button>,
          <Divider orientation="vertical" flexItem sx={{ height: '100%', borderRightColor: 'rgba(0, 0, 0, 0.87)' }} />
          <Button sx={{
            width: '16%',
            border: 'none',
            color: 'black',
            '&:hover': {
              border: 'none',
            },
          }}
            key="two" component={RouterLink} to='/settings/application' >Application</Button>,
          <Divider orientation="vertical" flexItem sx={{ height: '100%', borderRightColor: 'rgba(0, 0, 0, 0.87)' }} />
          <Button sx={{
            width: '16%',
            border: 'none',
            color: 'black',
            '&:hover': {
              border: 'none',
            },
          }}

            key="three">Invoice</Button>,
          <Divider orientation="vertical" flexItem sx={{ height: '100%', borderRightColor: 'rgba(0, 0, 0, 0.87)' }} />
          <Button sx={{
            width: '16%',
            border: 'none',
            color: 'black',
            '&:hover': {
              border: 'none',
            },

          }}
            key="one">Estimate</Button>,
          <Divider orientation="vertical" flexItem sx={{ height: '100%', borderRightColor: 'rgba(0, 0, 0, 0.87)' }} />
          <Button sx={{
            width: '16%',
            border: 'none',
            color: 'black',
            '&:hover': {
              border: 'none',
            },

          }}
            key="two">Notifications</Button>,
          <Divider orientation="vertical" flexItem sx={{ height: '100%', borderRightColor: 'rgba(0, 0, 0, 0.87)' }} />
          <Button sx={{
            width: '16%',
            border: 'none',
            color: 'black',
            '&:hover': {
              border: 'none',
            },

          }}
            key="three">Billing</Button>,
        </ButtonGroup>
      </Box>
      <p className='header-p'>Account</p>

      {savingMessage &&
        <div>
          {saving ? (
            <Button variant="contained">
              Saving...
            </Button>
          ) : (
            <Button variant="contained">
              {saved && 'Saved!'}
            </Button>
          )}
        </div>
      }

      <p className='header-c'>contact</p>
      <form action='#'>

        <div className='form-div'>
          <TextField
            className='div-outlined'
            id="outlined-basic"
            // label="Name"
            variant="outlined"
            name="name"
            placeholder='Name'
            value={formik.values.name}
            onBlur={handleBlur}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>

        <div className='form-div'>
          <TextField
            className='div-outlined'
            id="outlined-basic"
            // label="Email Account"
            variant="outlined"
            name="account_email"
            placeholder='Email Account'
            value={formik.values.account_email}
            onBlur={handleBlur}
            onChange={(e) => handleInputChange('account_email', e.target.value)}
          />
        </div>

        <div className='form-div'>
          <TextField
            className='div-outlined'
            id="outlined-basic"
            // label="Email"
            variant="outlined"
            name="public_email"
            placeholder='Email'
            value={formik.values.public_email}
            onBlur={handleBlur}
            onChange={(e) => handleInputChange('public_email', e.target.value)}
          />
        </div>

        <div className='form-div'>
          <TextField
            className='div-outlined'
            id="outlined-basic"
            // label="Phone Number"
            variant="outlined"
            name="mobile"
            placeholder='Phone Number'
            value={formik.values.mobile}
            onBlur={handleBlur}
            onChange={(e) => handleInputChange('mobile', e.target.value)}
          />
        </div>

        <div className='form-div'>
          <TextField
            className='div-outlined'
            id="outlined-basic"
            // label="Site URL"
            variant="outlined"
            name="site_url"
            placeholder='Site URL'
            value={formik.values.site_url}
            onBlur={handleBlur}
            onChange={(e) => handleInputChange('site_url', e.target.value)}
          />
        </div>

        <div className='form-div'>
          <TextField
            className='div-outlined'
            id="outlined-basic"
            // label="Information"
            variant="outlined"
            name="information"
            placeholder='Information'
            value={formik.values.information}
            onBlur={handleBlur}
            onChange={(e) => handleInputChange('information', e.target.value)}
          />
        </div>

        {/* <div className='form-div'>
         <FormControl fullWidth className='select-div'>
            <TextField id="demo-simple-select-label" label='Country' varient='outlined'>
            <Select
              labelId="demo-simple-select-label"
              id="selectedCountry"
              name='selectedCountry'
            >
              <MenuItem>hello</MenuItem>
              <MenuItem>hello</MenuItem>
              <MenuItem>hello</MenuItem>
            </Select>
            </TextField>
          </FormControl>
        </div> */}

        {/* <div className='form-div'>
          <FormControl fullWidth className='select-div'>
            <TextField id="demo-simple-select-label" label='Currency' varient='outlined' >
            <Select
              labelId="demo-simple-select-label"
              id="selectedCountry"
              name='selectedCountry'
            >
              <MenuItem>hello</MenuItem>
              <MenuItem>hello</MenuItem>
              <MenuItem>hello</MenuItem>
            </Select>
            </TextField>
          </FormControl>
        </div> */}
        {/* <button  type='submit'>submit</button>             */}
      </form>

      <p className='header-p'>Address</p>
      <form action='#'>

        <div className='form-div'>
          <TextField
            className='div-outlined'
            id="outlined-basic"
            variant="outlined"
            name="address_line_1"
            placeholder='Address-1'
            value={formik.values.address.address_line_1}
            onBlur={handleBlur}
            onChange={(e) => handleInputChange('address.address_line_1', e.target.value)}
          />
        </div>

        <div className='form-div'>
          <TextField
            className='div-outlined'
            id="outlined-basic"
            name="address_line_2"
            variant="outlined"
            placeholder='Address-2'
            value={formik.values.address.address_line_2}
            onBlur={handleBlur}
            onChange={(e) => handleInputChange('address.address_line_2', e.target.value)}
          />
        </div>

        <div className='form-div'>
          <TextField
            className='div-outlined'
            id="outlined-basic"
            variant="outlined"
            name="city"
            placeholder='City'
            value={formik.values.address.city}
            onBlur={handleBlur}
            onChange={(e) => handleInputChange('address.city', e.target.value)}
          />
        </div>

        <div className='form-div'>
          <TextField
            className='div-outlined'
            id="outlined-basic"
            name="state"
            variant="outlined"
            placeholder='State'
            value={formik.values.address.state}
            onBlur={handleBlur}
             onChange={(e) => handleInputChange('address.state', e.target.value)}
          />
        </div>

        <div className='form-div'>
          <TextField
            className='div-outlined'
            id="outlined-basic"
            name="postal_code"
            variant="outlined"
            placeholder='Zip/Postal'
            value={formik.values.address.postal_code}
            onBlur={handleBlur}
            onChange={(e) => handleInputChange('address.postal_code', e.target.value)}
          />
        </div>

        <div className='form-div'>
          <FormControl className='div-outlined select-div' sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Country</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              name="Country_id"
              autoWidth
              label="Age"
            >
              {countriesData.map((data) => (
                      <MenuItem key={data.id} value={data.name}>
                        {data.name}
                      </MenuItem>
                    ))}
            </Select>
          </FormControl>
        </div>

        <div className='form-div'>
          <FormControl className='div-outlined' sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Currency</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              name="Currency"
              // value={arr?.address?.currency}
              // value={age}
              // onChange={handleChange}
              autoWidth
              label="Age"
            // onBlur={handleSavingMessage}
            // onChange={handleMessageChange}
            >
               {countriesData.map((data) => (
                      <MenuItem key={data.id} value={data.currency}>
                        {data.currency}
                      </MenuItem>
                    ))}
            </Select>
          </FormControl>
        </div>
        {/* <button  type='submit'>submit</button>             */}
      </form>
    </section>
  )
}