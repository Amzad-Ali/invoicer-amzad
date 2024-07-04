import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createClient,
  fetchCountries,
  updateClient,
} from "../../actions/clientAction";
import { useDispatch } from "react-redux";

export default function CreateClient() {
  const dispatch = useDispatch();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countriesData, setCountriesData] = useState([]);
  const [id, setId] = useState("");
  const [clickCountry, setClickCountry] = useState(false);

  useEffect(() => {
    if (clickCountry) {
      const fetchData = async () => {
        try {
          const countries = await fetchCountries();
          setCountriesData(countries);
        } catch (error) {
          console.error("Error fetching archive clients:", error);
        }
      };
      fetchData();
    }
  }, [clickCountry]);

  const handleChange = (event) => {
    formik.handleChange(event);
    setSelectedCountry(event.target.value);
  };

  function handleCountries() {
    setClickCountry(true);
  }

  const validationSchema = Yup.object().shape({
    client_Name: Yup.string()
      .required("")
      .min(2, "Name must be at least 2 characters"),
    client_Email: Yup.string().email("Invalid email format").required(""),
  });

  const formik = useFormik({
    initialValues: {
      client_Name: "",
      client_Email: "",
      client_Phone: "",
      client_Address1: "",
      client_Address2: "",
      client_City: "",
      client_State: "",
      client_Zip: "",
      selectedCountry: selectedCountry,
      client_id: id,
    },
    validationSchema: validationSchema,
  });

  const handleBlur = async (event) => {
    formik.handleBlur(event);
    if (id) {
      const formik_value = formik.values;
      formik_value.client_id = id;
      const updateClientResponse = await dispatch(updateClient(formik_value));
      console.log(updateClientResponse.payload);
    } else {
      const clientResponse = await dispatch(createClient(formik.values));
      const ide = clientResponse.payload._id;
      setId(ide);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/clients"
        >
          Back to List
        </Button>
      </div>
      <Card
        sx={{
          maxWidth: 1024,
          mx: "auto",
          mt: 4,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        <CardContent sx={{ p: 6 }}>
          <Typography variant="h5" component="div" gutterBottom>
            New Client
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <OutlinedInput
                  fullWidth
                  type="text"
                  id="client_Name"
                  name="client_Name"
                  value={formik.values.client_Name}
                  onBlur={handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Name"
                  required
                />
                {formik.touched.client_Name && formik.errors.client_Name ? (
                  <Typography variant="caption" color="error">
                    {formik.errors.client_Name}
                  </Typography>
                ) : null}
              </Grid>
              <Grid item xs={12}>
                <OutlinedInput
                  fullWidth
                  type="text"
                  id="client_Email"
                  name="client_Email"
                  value={formik.values.client_Email}
                  onBlur={handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Email"
                  required
                />
                {formik.touched.client_Email && formik.errors.client_Email ? (
                  <Typography variant="caption" color="error">
                    {formik.errors.client_Email}
                  </Typography>
                ) : null}
              </Grid>
              <Grid item xs={12}>
                <OutlinedInput
                  fullWidth
                  type="text"
                  id="client_Phone"
                  name="client_Phone"
                  value={formik.values.client_Phone}
                  onBlur={handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Phone Number"
                />
              </Grid>
              <Grid item xs={12}>
                <OutlinedInput
                  fullWidth
                  type="text"
                  id="client_Address1"
                  name="client_Address1"
                  value={formik.values.client_Address1}
                  onBlur={handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Address 1"
                />
              </Grid>
              <Grid item xs={12}>
                <OutlinedInput
                  fullWidth
                  type="text"
                  id="client_Address2"
                  name="client_Address2"
                  value={formik.values.client_Address2}
                  onBlur={handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Address 2"
                />
              </Grid>
              <Grid item xs={12}>
                <OutlinedInput
                  fullWidth
                  type="text"
                  id="client_City"
                  name="client_City"
                  value={formik.values.client_City}
                  onBlur={handleBlur}
                  onChange={formik.handleChange}
                  placeholder="City"
                />
              </Grid>
              <Grid item xs={12}>
                <OutlinedInput
                  fullWidth
                  type="text"
                  id="client_State"
                  name="client_State"
                  value={formik.values.client_State}
                  onBlur={handleBlur}
                  onChange={formik.handleChange}
                  placeholder="State/Province"
                />
              </Grid>
              <Grid item xs={12}>
                <OutlinedInput
                  fullWidth
                  type="text"
                  id="client_Zip"
                  name="client_Zip"
                  value={formik.values.client_Zip}
                  onBlur={handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Zip/Postal"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Country</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="selectedCountry"
                    name="selectedCountry"
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
              {/* <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit
              </Button>
                </Grid> */}
            </Grid>
          </form>
        </CardContent>
      </Card>
      <div style={{ marginTop: "20px", textAlign: "right" }}>
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
  );
}
