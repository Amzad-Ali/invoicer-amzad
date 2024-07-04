import React, { useState, useEffect } from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import {
  TextField,
  MenuItem,
  Button,
  ButtonGroup,
  Container,
  Grid,
  Card,
  Typography,
  IconButton,
  Box,
  Paper,
  InputAdornment,
  Chip,
  Stack,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  Link,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import { Add, Delete } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { getAccountById } from '../../actions/settingAction';


const EstimateForm = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDiscountFields, setShowDiscountFields] = useState(false);
  const [showTaxFields, setShowTaxFields] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  
  // this is for fetch the data on the bases of specific individual data
  const [id, setId] = useState("");
  const [accountData, setAccountData] = useState('');
  const [edit, setEdit] = useState({});
  //const [data, setData] = useState([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await getAccountById('6671b21ae0b8373938298b33');
  //       setData(response);
  //     } 
  //     catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchData();
  // }, []); 
  // console.log('data ===>', data.name);
  // console.log('data ===>', data);


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

  useEffect(() => {
    if (edit) {
      formik.setValues({
        from: {
          name: edit.name || "",
          address1: edit?.address?.address_line_1 || "",
          address2: edit?.address?.address_line_2 || "",
          city: edit?.address?.city || "",
          state: edit?.address?.state || "",
          country: edit?.address?.country_id || "United States",
          zip: edit?.address?.postal_code || "",
          phone: edit?.mobile || "",
          information: edit?.information || "",
        },
        client: {
          billing_address: {
            name: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            country: "United States",
            zip: "",
            phone: "",
            information: "",
          },
          shipping_address: {
            name: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            country: "United States",
            zip: "",
            phone: "",
            information: "",
          },
          client_id: id,
        },
        dateIssued: "",
        dateDue: "",
        currency: "USD $ - United States Dollar",
        referenceNo: "",
        estimateNo: "EST-00001",
        language: "English",
        amount: 0,
        items: [
          {
            id: 1,
            name: "",
            description: "",
            rate: 0,
            qty: 1,
            lineTotal: 0,
          },
        ],
        discounts: [{ description: "", percentage: 0 }],
        taxes: [{ description: "", percentage: 0 }],
        subTotal: 0,
        total: 0,
        notes: "",
        terms: "",
        files: [],
        attachments: [],
        // is_send: false,
        // status: "",
        // invoice: false,
        // archieved: false,
        estimate_id: id,
      });
    }
  }, [edit]);

  const formik = useFormik({
    initialValues: {
      from: {
        name: "Test",
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "United States",
        zip: "",
        phone: "",
        information: "",
        account_id: id,
      },
      client: {
        billing_address: {
          name: "",
          address1: "",
          address2: "",
          city: "",
          state: "",
          country: "United States",
          zip: "",
          phone: "",
          information: "",
        },
        shipping_address: {
          name: "",
          address1: "",
          address2: "",
          city: "",
          state: "",
          country: "United States",
          zip: "",
          phone: "",
          information: "",
        },
        client_id: id,
      },
      dateIssued: "",
      dateDue: "",
      currency: "USD $ - United States Dollar",
      referenceNo: "",
      estimateNo: "EST-00001",
      language: "English",
      amount: 0,
      items: [
        {
          id: 1,
          name: "",
          description: "",
          rate: 0,
          qty: 1,
          lineTotal: 0,
        },
      ],
      discounts: [{ description: "", percentage: 0 }],
      taxes: [{ description: "", percentage: 0 }],
      subTotal: 0,
      total: 0,
      notes: "",
      terms: "",
      files: [],
      attachments: [],
      // is_send: false,
      // status: "",
      // invoice: false,
      // archieved: false,
      estimate_id: id,
    },
    onSubmit: (values) => {
      console.log(values);
    },
    handleChange: (event) => {
      setValue(event.target.value);
    },
  });

  const countryOptions = [
    { value: "India", label: "India" },
    { value: "France", label: "France" },
    { value: "UK", label: "UK" },
    { value: "United States", label: "United States" },
  ];
  const clientOptions = [
    { value: "Deep", label: "Deep" },
    { value: "Client1", label: "Client 1" },
    { value: "Client2", label: "Client 2" },
  ];
  const languageOptions = [{ value: "English", label: "English" }];
  const currencyOptions = [
    {
      value: "USD $ - United States Dollar",
      label: "USD $ - United States Dollar",
    },
    { 
      value: "INR ₹ - Indian Ruppees", 
      label: "INR ₹ - Indian Ruppees",
    },
  ];
  const [value, setValue] = React.useState("");

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleBlur = async (event) => {
    formik.handleBlur(event);
    console.log(formik.values);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      formik.setFieldValue("files", acceptedFiles);
    },
  });

  // Define action handlers for the buttons
  const handleView = () => {
    console.log("View action triggered");
  };

  const handlePDF = () => {
    console.log("PDF action triggered");
  };

  const handleSend = () => {
    console.log("Send action triggered");
  };

  const handleApprove = () => {
    console.log("Approve action triggered");
  };

  const handleGenerateInvoice = () => {
    console.log("Generate Invoice action triggered");
  };

  const calculateSubtotal = () => {
    return formik.values.items.reduce(
      (acc, item) => acc + item.rate * item.qty,
      0
    );
  };

  const calculateDiscounts = () => {
    return formik.values.discounts.reduce(
      (acc, discount) =>
        acc + calculateSubtotal() * (discount.percentage / 100),
      0
    );
  };

  const calculateTaxes = () => {
    return formik.values.taxes.reduce(
      (acc, tax) =>
        acc +
        (calculateSubtotal() - calculateDiscounts()) * (tax.percentage / 100),
      0
    );
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscounts() + calculateTaxes();
  };

  const calculateLineTotal = () => {
    //return (item.rate * item.qty).toFixed(2);
    return formik.values.items.reduce((acc, item) => item.rate * item.qty, 0);
  };
  const handleAddItem = () => {
    formik.setFieldValue("items", [
      ...formik.values.items,
      {
        id: formik.values.items.length + 1,
        name: "",
        description: "",
        rate: 0,
        qty: 1,
        lineTotal: 0,
      },
    ]);
  };

  // const handleDeleteItem = (index) => {
  //   const newItems = [...formik.values.items];
  //   newItems.splice(index, 1);
  //   formik.setFieldValue("items", newItems);
  // };

  // const handleChangeItem = (index, field, value) => {
  //   const newItems = [...formik.values.items];
  //   newItems[index] = { ...newItems[index], [field]: value };
  //   newItems[index].lineTotal = calculateLineTotal(newItems[index]);
  //   formik.setFieldValue("items", newItems);
  // };

  //   const gridStyle = {
  //     //position: "absolute",
  //     padding: "10px",
  //     margin: "10px",
  //     width: "100%",
  //     height: "100%",
  //     fullWidth: "true",
  //     // backgroundColor: "rgba(255, 255, 255, 0.7)",
  //     opacity: isHovered ? 1 : 0,
  //     textAlign: "center",

  //     //transition: "opacity 0.3s",
  //     zIndex: 1, // Make sure the grid is above other content
  //   };
  useEffect(() => {
    const newTotal = calculateTotal();
    formik.setFieldValue("amount", newTotal);
  }, [formik.values.items, formik.values.discounts, formik.values.taxes]);

  useEffect(() => {
    const newSubTotal = calculateSubtotal(formik.values.items);
    formik.setFieldValue("subTotal", newSubTotal);

    const newTotal = calculateTotal(
      newSubTotal,
      formik.values.discounts,
      formik.values.taxes
    );
    formik.setFieldValue("total", newTotal);
  }, [formik.values.items, formik.values.discounts, formik.values.taxes]);

  return (
    <Grid container spacing={3} padding={6}>
      <Grid item xs={12} sm={12} md={12}>
        {/*Estimate Title*/}
        <Stack
          direction="row"
          spacing={2}
          borderBottom={"2px solid lightgrey"}
          padding={2}
        >
          <Typography variant="h4" gutterBottom>
            Estimate EST-00001
          </Typography>
          <Chip label="created" variant="outlined" />
        </Stack>
      </Grid>

      <Grid item xs={12} sm={12} md={12}>
        {/* Button area */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div>
            <Button variant="outlined" sx={{ mr: 2 }}>
              View
            </Button>
            <ButtonGroup variant="outlined" sx={{ mr: 2 }}>
              <Button>PDF</Button>
              <Button variant="outlined">
                <SettingsOutlinedIcon />
              </Button>
            </ButtonGroup>
            <Button variant="outlined" sx={{ mr: 2 }}>
              Send
            </Button>
            <Button variant="outlined" sx={{ mr: 2 }}>
              Approve
            </Button>
            <Button variant="outlined" sx={{ mr: 2 }}>
              Generate Invoice
            </Button>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label
              htmlFor="colorPicker"
              style={{ marginRight: "10px", color: "grey" }}
            >
              Change Color
            </label>
            <TextField
              id="colorPicker"
              type="color"
              variant="outlined"
              inputProps={{
                style: {
                  padding: 0,
                  height: "50px",
                  width: "100px",
                },
              }}
            />
          </div>
        </div>
      </Grid>

      <Grid item xs={12} sm={12} md={12}>
        {/*Form*/}
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <Card
              paddingBottom={"100px"}
              sx={{ border: "1px solid lightgrey" }}
            >
              {/*White Page*/}
              <Grid container spacing={3} padding={6}>
                {/*Parent div to control all children*/}
                <Grid item xs={12} md={6}>
                  {/* Upload Form */}
                  <Paper
                    {...getRootProps()}
                    sx={{
                      border: "2px dashed #ccc",
                      textAlign: "center",
                      height: "55vh",
                      alignContent: "center",
                      //spacing: "2",
                    }}
                  >
                    <input {...getInputProps()} />
                    <p>
                      <InsertPhotoOutlinedIcon />
                      <br />
                      <a href="#">Upload a file</a> or drag and drop
                      <br />
                      <span style={{ color: "grey" }}>Optional</span>
                    </p>

                    <Box sx={{ mt: 2 }}>
                      {formik.values.files &&
                        formik.values.files.map((file, index) => (
                          <Typography key={index}>{file.name}</Typography>
                        ))}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  {/* Account Form */}
                  <Typography variant="h6" fontWeight={"bold"}>
                    From
                  </Typography>
                  <TextField
                    fullWidth
                    //label="Name"
                    name="from.name"
                    value={formik.values.from.name}
                    onChange={formik.handleChange}
                    onBlur={handleBlur}
                    placeholder="Name"
                    marginTop="dense"
                    InputProps={{
                      style: {
                        borderBottomRightRadius: "0px",
                        borderBottomLeftRadius: "0px",
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    //label="Address 1"
                    name="from.address1"
                    value={formik.values.from.address1}
                    onChange={formik.handleChange}
                    onBlur={handleBlur}
                    placeholder="Address 1"
                    InputProps={{
                      style: {
                        borderRadius: "0px",
                      },
                    }}
                    //margin="normal"
                  />
                  <TextField
                    fullWidth
                    //label="Address 2"
                    name="from.address2"
                    value={formik.values.from.address2}
                    onChange={formik.handleChange}
                    onBlur={handleBlur}
                    placeholder="Address 2"
                    InputProps={{
                      style: {
                        borderRadius: "0px",
                      },
                    }}
                    //margin="normal"
                  />
                  <TextField
                    fullWidth
                    //label="City"
                    name="from.city"
                    value={formik.values.from.city}
                    onChange={formik.handleChange}
                    onBlur={handleBlur}
                    placeholder="City"
                    InputProps={{
                      style: {
                        borderRadius: "0px",
                      },
                    }}
                    //margin="normal"
                  />
                  <TextField
                    fullWidth
                    //label="State/Province"
                    name="from.state"
                    value={formik.values.from.state}
                    onChange={formik.handleChange}
                    onBlur={handleBlur}
                    placeholder="State/Province"
                    InputProps={{
                      style: {
                        borderRadius: "0px",
                      },
                    }}
                    //margin="normal"
                  />
                  <TextField
                    select
                    //label="Country"
                    value={formik.values.from.country}
                    variant="outlined"
                    fullWidth
                    name="from.country"
                    onChange={formik.handleChange}
                    onBlur={handleBlur}
                    placeholder="Country"
                    InputProps={{
                      style: {
                        borderRadius: "0px",
                      },
                    }}
                    //margin="normal"
                  >
                    {countryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    //label="ZIP/Postal"
                    name="from.zip"
                    value={formik.values.from.zip}
                    onChange={formik.handleChange}
                    onBlur={handleBlur}
                    placeholder="ZIP/Postal"
                    InputProps={{
                      style: {
                        borderRadius: "0px",
                      },
                    }}
                    //margin="normal"
                  />
                  <TextField
                    fullWidth
                    //label="Phone"
                    name="from.phone"
                    value={formik.values.from.phone}
                    onChange={formik.handleChange}
                    onBlur={handleBlur}
                    placeholder="Phone"
                    InputProps={{
                      style: {
                        borderRadius: "0px",
                      },
                    }}
                    //margin="normal"
                  >
                    {countryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    //label="Message"
                    name="from.information"
                    value={formik.values.from.information}
                    onChange={formik.handleChange}
                    onBlur={handleBlur}
                    placeholder="Information"
                    InputProps={{
                      style: {
                        borderTopRightRadius: "0px",
                        borderTopLeftRadius: "0px",
                      },
                    }}
                    //margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  {/* Billed To */}
                  <Grid xs={12} md={12} backgroundColor={"#f0f0f0"} padding={2}>
                    <Tabs
                      value={tabIndex}
                      onChange={handleTabChange}
                      variant="fullWidth"
                    >
                      <Tab label="Billed To" />
                      <Tab label="Shipped To" />
                    </Tabs>

                    {tabIndex === 0 && (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Tooltip
                            title="Type to search and select existing clients.
                            To create a new client, type the cient's name and choose '+ Add...'
                            Select 'Edit client' and 'Lock client' to lock client editing."
                            placement="top"
                            arrow
                          >
                            <Button>
                              <InfoOutlinedIcon />
                            </Button>
                          </Tooltip>
                          <Link
                            href="#"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            Edit client{" "}
                            <EditIcon
                              sx={{ marginLeft: "4px" }}
                              fontSize="small"
                            />
                          </Link>
                        </Box>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          sx={{ marginTop: "16px" }}
                        >
                          <TextField
                            select
                            fullWidth
                            variant="outlined"
                            label="Name"
                            name="client.billing_address.name"
                            value={formik.values.client.billing_address.name}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            marginTop="dense"
                            placeholder="Type to select or add client"
                            InputProps={{
                              style: {
                                borderBottomLeftRadius: "0px",
                                borderBottomRightRadius: "0px",
                              },
                            }}
                          >
                            {clientOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            fullWidth
                            //label="Address 1"
                            name="client.billing_address.address1"
                            value={formik.values.client.billing_address.address1}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            //margin="normal"
                            placeholder="Address 1"
                            InputProps={{
                              style: {
                                borderRadius: "0px",
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            //label="Address 2"
                            name="client.billing_address.address2"
                            value={formik.values.client.billing_address.address2}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            placeholder="Address 2"
                            //margin="normal"
                            InputProps={{
                              style: {
                                borderRadius: "0px",
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            //label="City"
                            name="client.billing_address.city"
                            value={formik.values.client.billing_address.city}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            //margin="normal"
                            placeholder="City"
                            InputProps={{
                              style: {
                                borderRadius: "0px",
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            //label="State/Province"
                            name="client.billing_address.state"
                            value={formik.values.client.billing_address.state}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            //margin="normal"
                            placeholder="State/Province"
                            InputProps={{
                              style: {
                                borderRadius: "0px",
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            //label="Country"
                            name="client.billing_address.country"
                            value={formik.values.client.billing_address.country}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            //margin="normal"
                            placeholder="Country"
                            InputProps={{
                              style: {
                                borderRadius: "0px",
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            //label="ZIP/Postal"
                            name="client.billing_address.zip"
                            value={formik.values.client.billing_address.zip}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            //margin="normal"
                            placeholder="ZIP/Postal"
                            InputProps={{
                              style: {
                                borderRadius: "0px",
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            //label="Phone"
                            name="client.billing_address.phone"
                            value={formik.values.client.billing_address.phone}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            //margin="normal"
                            placeholder="Phone"
                            InputProps={{
                              style: {
                                borderRadius: "0px",
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            //label="Information"
                            name="client.billing_address.information"
                            value={formik.values.client.billing_address.information}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            //margin="normal"
                            placeholder="Info"
                            InputProps={{
                              style: {
                                borderTopLeftRadius: "0px",
                                borderTopRightRadius: "0px",
                              },
                            }}
                          />
                        </FormControl>
                      </Box>
                    )}
                    {tabIndex === 1 && (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Tooltip
                            title="Type to search and select existing clients.
                            To create a new client, type the cient's name and choose '+ Add...'
                            Select 'Edit client' and 'Lock client' to lock client editing."
                            placement="top"
                            arrow
                          >
                            <Button>
                              <InfoOutlinedIcon />
                            </Button>
                          </Tooltip>
                          <Link
                            href="#"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            Edit client
                            <EditIcon
                              sx={{ marginLeft: "4px" }}
                              fontSize="small"
                            />
                          </Link>
                        </Box>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          sx={{ marginTop: "16px" }}
                        >
                          <TextField
                            select
                            fullWidth
                            variant="outlined"
                            label="Name"
                            name="client.shipping_address.name"
                            value={formik.values.client.shipping_address.name}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            marginTop="dense"
                            placeholder="Type to select or add client"
                            InputProps={{
                              style: {
                                borderBottomLeftRadius: "0px",
                                borderBottomRightRadius: "0px",
                              },
                            }}
                          >
                            {clientOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            fullWidth
                            //label="Address 1"
                            name="client.shipping_address.address1"
                            value={formik.values.client.shipping_address.address1}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            //margin="normal"
                            placeholder="Address 1"
                            InputProps={{
                              style: {
                                borderRadius: "0px",
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            //label="Address 2"
                            name="client.shipping_address.address2"
                            value={formik.values.client.shipping_address.address2}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            placeholder="Address 2"
                            //margin="normal"
                            InputProps={{
                              style: {
                                borderRadius: "0px",
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            //label="City"
                            name="client.shipping_address.city"
                            value={formik.values.client.shipping_address.city}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            //margin="normal"
                            placeholder="City"
                            InputProps={{
                              style: {
                                borderRadius: "0px",
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            //label="State/Province"
                            name="client.shipping_address.state"
                            value={formik.values.client.shipping_address.state}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            //margin="normal"
                            placeholder="State/Province"
                            InputProps={{
                              style: {
                                borderRadius: "0px",
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            //label="Country"
                            name="client.shipping_address.country"
                            value={formik.values.client.shipping_address.country}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            //margin="normal"
                            placeholder="Country"
                            InputProps={{
                              style: {
                                borderRadius: "0px",
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            //label="ZIP/Postal"
                            name="client.shipping_address.zip"
                            value={formik.values.client.shipping_address.zip}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            //margin="normal"
                            placeholder="ZIP/Postal"
                            InputProps={{
                              style: {
                                borderRadius: "0px",
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            //label="Phone"
                            name="client.shipping_address.phone"
                            value={formik.values.client.shipping_address.phone}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            //margin="normal"
                            placeholder="Phone"
                            InputProps={{
                              style: {
                                borderRadius: "0px",
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            //label="Information"
                            name="client.shipping_address.information"
                            value={formik.values.client.shipping_address.information}
                            onChange={formik.handleChange}
                            onBlur={handleBlur}
                            //margin="normal"
                            placeholder="Info"
                            InputProps={{
                              style: {
                                borderTopLeftRadius: "0px",
                                borderTopRightRadius: "0px",
                              },
                            }}
                          />
                        </FormControl>
                      </Box>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  {/* Dates */}
                  <Grid conatianer md={12} display={"flex"} gap={"20px"}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" fontWeight={"bold"}>
                        Date Issued
                      </Typography>
                      <TextField
                        fullWidth
                        //label="Date Issued"
                        type="date"
                        name="dateIssued"
                        value={formik.values.dateIssued}
                        onChange={formik.handleChange}
                        onBlur={handleBlur}
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" fontWeight={"bold"}>
                        Date Due
                      </Typography>
                      <TextField
                        fullWidth
                        //label="Date Due"
                        type="date"
                        name="dateDue"
                        value={formik.values.dateDue}
                        onChange={formik.handleChange}
                        onBlur={handleBlur}
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Typography variant="h6" fontWeight={"bold"}>
                      Currency
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      varient="outlined"
                      //label="Currency"
                      name="currency"
                      value={formik.values.currency}
                      onChange={formik.handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                    >
                      {currencyOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Typography variant="h6" fontWeight={"bold"}>
                      PDF Language
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      variant="outlined"
                      //label="Currency"
                      name="currency"
                      value={formik.values.language}
                      onChange={formik.handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                    >
                      {languageOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid conatianer md={12} display={"flex"} gap={"20px"}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" fontWeight={"bold"}>
                        Estimate Number
                      </Typography>
                      <TextField
                        fullWidth
                        //label="Estimate Number"
                        name="estimateNo"
                        value={formik.values.estimateNo}
                        onChange={formik.handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" fontWeight={"bold"}>
                        Reference #
                      </Typography>
                      <TextField
                        fullWidth
                        //label="Reference #"
                        name="referenceNo"
                        value={formik.values.referenceNo}
                        onChange={formik.handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        placeholder="Enter Value (eg PO#)"
                      />
                    </Grid>
                  </Grid>

                  {/* <Grid item xs={12} md={12}>
                    <Typography variant="h6">Amount</Typography>
                    <TextField
                      backgroundColor="#f0f0f0"
                      fullWidth
                      //label="Amount"
                      name="amount"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      multiline
                      rows={4}
                    >
                      ${calculateTotal().toFixed(2)}
                    </TextField>
                  </Grid> */}
                  <Grid
                    mt={4}
                    p={2}
                    bgcolor="#f5f5f5"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    height="150px"
                  >
                    <Typography variant="h6" fontWeight={"bold"}>
                      Amount
                    </Typography>

                    <Typography variant="h4" name="amount">
                      ${calculateTotal().toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                  {/* Items */}
                  <Grid
                    conatainer
                    borderTop={"5px solid black"}
                    display={"flex"}
                    gap={3}
                    px={3}
                    paddingTop={2}
                  >
                    <Grid item md={6}>
                      <Typography variant="h6">Item</Typography>
                    </Grid>
                    <Grid item md={1}>
                      <Typography variant="h6">Rate</Typography>
                    </Grid>
                    <Grid item md={1}>
                      <Typography variant="h6">Qty</Typography>
                    </Grid>
                    <Grid item md={3}>
                      <Typography textAlign={"right"} variant="h6">
                        LineTotal
                      </Typography>
                    </Grid>
                  </Grid>
                  <FieldArray name="items">
                    {({ push, remove }) => (
                      <>
                        {formik.values.items.map((item, index) => (
                          <Grid
                            container
                            //spacing={2}
                            key={index}
                            display={"flex"}
                            sx={{
                              //maxWidth: 1200,
                              mx: "auto",
                              mt: 3,

                              backgroundColor: "#f0f0f0",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              padding: "10px",
                            }}
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                          >
                            <Grid
                              //container
                              display={"flex"}
                              flexDirection={"column"}
                              justifyContent={"center"}
                              xs={12}
                              md={6}
                            >
                              <Grid item xs={12} md={12}>
                                <TextField
                                  fullWidth
                                  backgroundColor="white"
                                  //label="Item Name"
                                  name={`items[${index}].name`}
                                  value={item.name}
                                  onChange={formik.handleChange}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  placeholder="Item name"
                                />
                              </Grid>

                              <Grid item xs={12} md={12}>
                                <TextField
                                  fullWidth
                                  //label="Description"
                                  name={`items[${index}].description`}
                                  value={item.description}
                                  onChange={formik.handleChange}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  placeholder="Item description"
                                  multiline={true}
                                  rows={4}
                                />
                              </Grid>
                            </Grid>
                            <Grid
                              //container
                              display={"flex"}
                              flexDirection={"column"}
                              alignSelf={"flex-start"}
                              xs={12}
                              md={6}
                            >
                              <Grid
                                display={"flex"}
                                justifyContent={"space-around"}
                                alignItems={"center"}
                                alignSelf={"flex-start"}
                                //gap="20px"
                                xs={12}
                                md={12}
                              >
                                <Grid
                                  display={"flex"}
                                  justifyContent={"flex-start"}
                                  alignItems={"center"}
                                  alignSelf={"flex-start"}
                                  gap="20px"
                                  xs={12}
                                  md={12}
                                  paddingLeft={"20px"}
                                >
                                  <Grid item xs={12} md={3}>
                                    <TextField
                                      fullWidth
                                      //label="Rate"
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment position="start">
                                            $
                                          </InputAdornment>
                                        ),
                                      }}
                                      name={`items[${index}].rate`}
                                      value={item.rate}
                                      onChange={formik.handleChange}
                                      onBlur={handleBlur}
                                      margin="normal"
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={2}>
                                    <TextField
                                      fullWidth
                                      //label="Qty"
                                      type="number"
                                      name={`items[${index}].qty`}
                                      value={item.qty}
                                      onChange={formik.handleChange}
                                      onBlur={handleBlur}
                                      margin="normal"
                                    />
                                  </Grid>
                                </Grid>
                                <Grid
                                  display={"flex"}
                                  alignItems={"center"}
                                  alignContent={"center"}
                                  gap={5}
                                >
                                  <Grid
                                    xs={12}
                                    sm={1}
                                    //padding={"15px"}
                                  >
                                    <p
                                      fullWidth
                                      //label="Qty"
                                      //type="number"
                                      name={`items[${index}].lineTotal`}
                                      value={item.lineTotal}
                                      onChange={formik.handleChange}
                                      onBlur={handleBlur}
                                      margin="normal"
                                    >
                                      ${(item.rate * item.qty).toFixed(2)}
                                    </p>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={1}
                                    //padding={"15px"}
                                  >
                                    <IconButton onClick={() => remove(index)}>
                                      <Delete />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid padding={3}>
                                <Typography color="primary">Add tax</Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        ))}
                        <Grid
                          container
                          fullWidth
                          //spacing={2}
                          sx={{
                            //maxWidth: 1200,
                            mx: "auto",
                            mt: 2,

                            backgroundColor: "#f0f0f0",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            paddingBottom: "10px",

                            display: "flex",
                            justifyContent: "center",
                            alignContent: "center",
                          }}
                          onClick={handleAddItem}
                        >
                          <Typography
                            textAlign="center"
                            height="50px"
                            alignContent="center"
                            color="grey"
                            backgroundColor="#f0f0f0"
                            //padding={"100px"}
                            //margin={"100px"}

                            //sx={{ mt: 2 }}
                          >
                            + Add Line Item
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </FieldArray>
                </Grid>

                {/* important */}

                <Grid item xs={12} md={12}>
                  {/* Total */}
                  <Grid
                    display={"flex"}
                    flexDirection={"column"}
                    gap={2}
                    alignItems={"flex-end"}
                  >
                    <Grid item xs={12} md={6}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={32}
                      >
                        <Typography variant="h6" fontWeight={"bold"}>
                          Subtotal
                        </Typography>
                        <Typography variant="h6">
                          ${calculateSubtotal().toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {/* <Typography variant="h6">Discounts</Typography> */}
                      <Typography
                        variant="contained"
                        color="primary"
                        onClick={() => setShowDiscountFields(true)}
                        disabled={showDiscountFields}
                      >
                        Add Discount
                      </Typography>
                      {showDiscountFields && (
                        <FieldArray name="discounts">
                          {({ push, remove }) => (
                            <>
                              {formik.values.discounts.map(
                                (discount, index) => (
                                  <Grid container spacing={2} key={index}>
                                    <Grid item xs={12} sm={4}>
                                      <TextField
                                        fullWidth
                                        label="Description"
                                        name={`discounts[${index}].description`}
                                        value={discount.description}
                                        onChange={formik.handleChange}
                                        onBlur={handleBlur}
                                        margin="normal"
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                      <TextField
                                        fullWidth
                                        label="Percentage"
                                        type="number"
                                        name={`discounts[${index}].percentage`}
                                        value={discount.percentage}
                                        onChange={formik.handleChange}
                                        onBlur={handleBlur}
                                        margin="normal"
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              %
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={"12"} md={"1"}>
                                      <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        //padding={"20px"}
                                      >
                                        <Typography variant="body1">
                                          -${calculateDiscounts().toFixed(2)}
                                        </Typography>
                                      </Box>
                                    </Grid>

                                    <Grid
                                      item
                                      xs={12}
                                      sm={1} //padding={"50px"}
                                    >
                                      <IconButton onClick={() => remove(index)}>
                                        <Delete />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                )
                              )}
                              <Typography
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  push({ description: "", percentage: 0 })
                                }
                              >
                                Add Discount
                              </Typography>
                            </>
                          )}
                        </FieldArray>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {/* <Typography variant="h6">Taxes</Typography> */}
                      <Typography
                        variant="contained"
                        color="primary"
                        onClick={() => setShowTaxFields(true)}
                        disabled={showTaxFields}
                      >
                        Add Tax
                      </Typography>
                      {showTaxFields && (
                        <FieldArray name="taxes">
                          {({ push, remove }) => (
                            <>
                              {formik.values.taxes.map((tax, index) => (
                                <Grid container spacing={2} key={index}>
                                  <Grid item xs={12} sm={4}>
                                    <TextField
                                      fullWidth
                                      label="Description"
                                      name={`taxes[${index}].description`}
                                      value={tax.description}
                                      onChange={formik.handleChange}
                                      onBlur={handleBlur}
                                      margin="normal"
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={3}>
                                    <TextField
                                      fullWidth
                                      label="Percentage"
                                      type="number"
                                      name={`taxes[${index}].percentage`}
                                      value={tax.percentage}
                                      onChange={formik.handleChange}
                                      onBlur={handleBlur}
                                      margin="normal"
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            %
                                          </InputAdornment>
                                        ),
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={"12"} sm={"1"}>
                                    <Box
                                      display="flex"
                                      justifyContent="space-between"
                                      alignItems="center"
                                      //padding={"20px"}
                                    >
                                      <Typography variant="body1">
                                        ${calculateTaxes().toFixed(2)}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={1}
                                    //padding={"20px"}
                                  >
                                    <IconButton onClick={() => remove(index)}>
                                      <Delete />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              ))}
                              <Typography
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  push({ description: "", percentage: 0 })
                                }
                              >
                                Add Tax
                              </Typography>
                            </>
                          )}
                        </FieldArray>
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={32}
                      >
                        <Typography variant="h6" fontWeight={"bold"}>
                          Total
                        </Typography>
                        <Typography variant="h6">
                          ${calculateTotal().toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                  {/* Notes */}
                  <Typography variant="h6" fontWeight={"bold"}>
                    Notes
                  </Typography>
                  <TextField
                    fullWidth
                    name="notes"
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    multiline={true}
                    rows={4}
                    placeholder="Notes or payment detail (optional)&#10;Saying things like thanks for business! is a good idea..."
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  {/* Terms */}
                  <Typography variant="h6" fontWeight={"bold"}>
                    Terms
                  </Typography>
                  <TextField
                    fullWidth
                    name="terms"
                    value={formik.values.terms}
                    onChange={formik.handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    multiline
                    rows={4}
                    placeholder="Terms & conditions."
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  {/* Attachments */}
                  <Typography variant="h6" fontWeight={"bold"}>
                    Attachments
                  </Typography>
                  <Paper
                    {...getRootProps()}
                    sx={{
                      //padding: 2,
                      border: "2px dashed #ccc",
                      textAlign: "center",
                      height: "30vh",
                      alignContent: "center",
                    }}
                  >
                    <input {...getInputProps()} />
                    <p>
                      <AttachFileOutlinedIcon />
                      <br />
                      <a href="#">Upload a file</a> or drag and drop <br /> PDF,
                      JPG, PNG, TXT, DOC up to 20 MB
                    </p>

                    <Box sx={{ mt: 2 }}>
                      {formik.values.files &&
                        formik.values.files.map((file, index) => (
                          <Typography key={index}>{file.name}</Typography>
                        ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Card>
          </form>
        </FormikProvider>
      </Grid>
      <Grid item md={12}>
        {/* Button area */}
        <Button
          variant="outlined"
          color="primary"
          onClick={handleView}
          sx={{ mr: 2 }}
        >
          View
        </Button>
        <ButtonGroup variant="outlined">
          <Button onClick={handlePDF}>PDF</Button>
          <Button sx={{ mr: 2 }}>
            <SettingsOutlinedIcon />
          </Button>
        </ButtonGroup>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSend}
          sx={{ mr: 2 }}
        >
          Send
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleApprove}
          sx={{ mr: 2 }}
        >
          Approve
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleGenerateInvoice}
          sx={{ mr: 2 }}
        >
          Generate Invoice
        </Button>
      </Grid>
    </Grid>
  );
};

export default EstimateForm;
