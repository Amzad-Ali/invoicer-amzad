import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { OutlinedInput, Card,Grid, CardContent, InputLabel, Button, MenuItem, FormControl, Select, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './../../App.css';
import { createClient, fetchCountries, updateClient } from '../../actions/clientAction';
import { useDispatch } from "react-redux";
import { getClientById } from '../../actions/clientAction';

export default function EditClient() {
  const dispatch = useDispatch();
  // const{clients}=useSelector((state)=>state.app);

  // this is for fetch the data on the bases of specific individual data
 const [edit,setEdit] = useState({});

  const params = useParams();

    useEffect(() => {
      const Editclients = async () => {
        try {
          const clientDataById = await getClientById(params.id)
          setEdit(clientDataById)
        } catch (error) {
          console.error(error);
        }
      };
      Editclients();
  },[params.id]);

  console.log(edit);

  function handleName(e){
    setEdit({
        ...edit,
        name:e.target.value
    })
    formik.setFieldValue('client_Name',e.target.value);
  }

//   function handleEmail(e){
//     setEdit((prevEdit) => ({
//         ...prevEdit,
//         contact: {
//             ...prevEdit.contact,
//             email: e.target.value
//         }
//     }));
//     formik.setFieldValue('client_Email',e.target.value);
// }

  function handleEmail(e){
    setEdit({
        ...edit,
        contact:{
            ...edit.contact,
            email:e.target.value
        }
    })
    formik.setFieldValue('client_Email',e.target.value);
  }

function handleMobile(e){
    setEdit({
        ...edit,
        contact:{
            ...edit.contact,
            mobile: e.target.value
        }
    })
    formik.setFieldValue('client_Phone',e.target.value);
}

function handleAddress1(e){
    setEdit({
        ...edit,
        address:{
            ...edit.address,
            address_line_1 : e.target.value
        }
    })
    formik.setFieldValue('client_Address1',e.target.value);
}

function handleAddress2(e){
    setEdit({
        ...edit,
        address:{
            ...edit.address,
            address_line_2 : e.target.value
        }
    })
    formik.setFieldValue('client_Address2',e.target.value);
}

function handleState(e){
    setEdit({
        ...edit,
        address : {
            ...edit.address,
            state : e.target.value
        }
    })
    formik.setFieldValue('client_State',e.target.value);
}

function handleZip(e){
    setEdit({
        ...edit,
        address :{
            ...edit.address,
            postal_code : e.target.value
        }
    })
    formik.setFieldValue('client_Zip',e.target.value);
}

function handleCity(e){
    setEdit({
        ...edit,
        address : {
            ...edit.address,
            city : e.target.value
        }
    })
    formik.setFieldValue('client_City',e.target.value);
}
 //end of fetch the data on the bases of specific individual data task


  const [selectedCountry, setSelectedCountry] = useState('');
  const[countriesData,setCountriesData]=useState([]);
  const[id,setId]=useState('');
  const clientid = edit._id;
  const[clickCountry,setClickCountry]=useState(false);


  useEffect(() => {
    if (clickCountry) {
      const fetchData = async () => {
        try {
          const countries = await fetchCountries();
          setCountriesData(countries);
        } catch (error) {
          console.error('Error fetching archive clients:', error);
        }
      };
      fetchData();
    }
  }, );



  const handleChange = (event) => {
    formik.handleChange(event);
    setSelectedCountry(event.target.value);
  };
  function handleCountries() {
    setClickCountry(true);
}

  const validationSchema = Yup.object().shape({
    client_Name: Yup.string().required('').min(2, 'Name must be at least 2 characters'),
    client_Email: Yup.string().email('Invalid email format').required(''),
  });

  
  useEffect(() => {
    if (edit) {
      formik.setValues({
        client_Name: edit.name || "",
        client_Email: edit?.contact?.email || "",
        client_Phone: edit?.contact?.mobile || "",
        client_Address1: edit?.address?.address_line_1 || "",
        client_Address2: edit?.address?.address_line_2 || "",
        client_City: edit?.address?.city || "",
        client_State: edit?.address?.state || "",
        client_Zip: edit?.address?.postal_code || "",
        selectedCountry: edit?.address?.country || "",
      });
    }
  }, [edit]);

  const formik = useFormik({
    initialValues: { 
      client_Name: edit.name || "",
      client_Email: edit?.contact?.email || "",
      client_Phone: edit?.contact?.mobile || "",
      client_Address1: edit?.address?.address_line_1 || "",
      client_Address2: edit?.address?.address_line_2 || "",
      client_City: edit?.address?.city || "",
      client_State: edit?.address?.state || "",
      client_Zip: edit?.address?.postal_code || "",
      selectedCountry: selectedCountry,
      client_id:clientid,
    },
    validationSchema: validationSchema
  });


  const handleBlur = async(event) => {
    
    formik.handleBlur(event);
    if(clientid){
      // console.log(formik.values);
      const formik_value=formik.values;
      formik_value.client_id=clientid;
      const updateClientResponse= await  dispatch(updateClient(formik_value));
      console.log(updateClientResponse.payload);
    }
    else{
       
      const clientResponse= await  dispatch(createClient(formik.values));
      console.log(formik.values);
      const ide=clientResponse.payload._id;
      setId(ide); 
      
    }       
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  }
  return (
    <>
    <div style={{ marginTop: '20px' ,textAlign:'right'}}>
    <Button
      variant="contained"
      color="primary"
      component={Link}
      to="/clients"
    >
      Back to List
    </Button>
    </div>
    <Card sx={{ maxWidth: 1024, mx: 'auto', mt: 4 , 
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
  borderRadius: '4px'}}>
      <CardContent sx={{p:6}}>
        <Typography variant="h5" component="div" gutterBottom>
          Edit Client
        </Typography>
          <form action='#' onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <OutlinedInput
                className='div-outlined'
                type='text'
                id='client_Name'
                name="client_Name"
                value={formik.values.client_Name}
                onBlur={handleBlur}
                onChange={handleName}
                placeholder='Name'
                required
              />
              {formik.touched.client_Name && formik.errors.client_Name ? (
                <div style={{ color: 'red' }}>{formik.errors.client_Name}</div>
              ) : null}
              </Grid>
    <Grid item xs={12}>
          <OutlinedInput
            className='div-outlined'
            type='text'
            id='client_Email'
            name="client_Email"
            value={formik.values.client_Email}
            // value={edit.contact.email}
            onBlur={handleBlur}
            onChange={handleEmail}
            placeholder='Email'
            required
          />
          {formik.touched.client_Email && formik.errors.client_Email ? (
            <div style={{ color: 'red' }}>{formik.errors.client_Email}</div>
          ) : null}
          </Grid>
    
    <Grid item xs={12}>
          <OutlinedInput
            className='div-outlined'
            type='text'
            id='client_Phone'
            name="client_Phone"
            value={formik.values.client_Phone}
            // value={edit.contact.mobile}
            onBlur={handleBlur}
            onChange={handleMobile}
            placeholder='Phone Number'
          />
            {formik.touched.client_Phone && formik.errors.client_Phone ? (
            <div style={{ color: 'red' }}>{formik.errors.client_Phone}</div>
          ) : null}
          </Grid>

        <Grid item xs={12}>
          <OutlinedInput
            className='div-outlined'
            type='text'
            id='client_Address1'
            name="client_Address1"
            value={formik.values.client_Address1}
            // value={edit.address.address_line_1}
            onBlur={handleBlur}
            onChange={handleAddress1}
            placeholder='Address 1'
          />
            {formik.touched.client_Address1 && formik.errors.client_Address1 ? (
            <div style={{ color: 'red' }}>{formik.errors.client_Address1}</div>
          ) : null}
          </Grid>

         <Grid item xs={12}>
          <OutlinedInput
            className='div-outlined'
            type='text'
            id='client_Address2'
            name="client_Address2"
            value={formik.values.client_Address2}
            // value={edit.address.address_line_2}
            onBlur={handleBlur}
            onChange={handleAddress2}
            placeholder='Address 2'
          />
            {formik.touched.client_Address2 && formik.errors.client_Address2 ? (
            <div style={{ color: 'red' }}>{formik.errors.client_Address2}</div>
          ) : null}
        </Grid>

          <Grid item xs={12}>
          <OutlinedInput
            className='div-outlined'
            type='text'
            id='client_City'
            name="client_City"
            value={formik.values.client_City}
            // value={edit.address.city}
            onBlur={handleBlur}
            onChange={handleCity}
            placeholder='City'
          />
            {formik.touched.client_Email && formik.errors.client_Email ? (
            <div style={{ color: 'red' }}>{formik.errors.client_Email}</div>
          ) : null}
          </Grid>

          <Grid item xs={12}>
          <OutlinedInput
            className='div-outlined'
            type='text'
            id='client_State'
            name="client_State"
            value={formik.values.client_State}
            // value={edit.address.state}
            onBlur={handleBlur}
            onChange={handleState}
            placeholder='State/Province'
          />
            {formik.touched.client_State && formik.errors.client_State ? (
            <div style={{ color: 'red' }}>{formik.errors.client_State}</div>
          ) : null}
          </Grid>

         <Grid item xs={12}>
          <OutlinedInput
            className='div-outlined'
            type='text'
            id='client_Zip'
            name="client_Zip"
            value={formik.values.client_Zip}
            // value={edit.address.postal_code}
            onBlur={handleBlur}
            onChange={handleZip}
            placeholder='Zip/Postal'
          />
            {formik.touched.client_Zip && formik.errors.client_Zip ? (
            <div style={{ color: 'red' }}>{formik.errors.client_Zip}</div>
          ) : null}
          </Grid>
         
         <Grid item xs={12}>
          <FormControl fullWidth className='select-div'>
            <InputLabel id="demo-simple-select-label"> Country</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="selectedCountry"
              name='selectedCountry'
              value={selectedCountry}
              label="selectedCountry"
              onClick={handleCountries}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {countriesData.map((data) => (
                <MenuItem key={data.id} value={data.name}>
                  {data.name}
                </MenuItem>
              ))} 
            </Select>
          </FormControl>
          
          </Grid>
          </Grid>
        {/* <button  type='submit'>submit</button>             */}
      </form>
      </CardContent>
    </Card>
    <div style={{ marginTop: '20px' ,textAlign:'right'}}>
    <Button
      variant="contained"
      color="primary"
      component={Link}
      to="/clients"
    >
      Back to List
    </Button>
    </div>
    </>
   
  )
}