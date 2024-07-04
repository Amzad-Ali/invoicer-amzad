import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {apiCreateUser,apiUpdateClient,apiGetClients,apiGetAllArchiveClient, apiSearchByName,apiGetCountries, apiArchiveClient} from "../api/clientsApi";


// action for get all country

// import {useEffect,useState} from 'react'

export const fetchCountries = async () => {
      try {
        const response = await axios(apiGetCountries);
        return response.data;
  
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };









// To create a client, Post the data into API


export const createClient = createAsyncThunk("user/addUser", async (clientData,{rejectWithValue}) => {
  try {
    const response = await axios.post(apiCreateUser,{
      "name": clientData.client_Name,
      "address": {
        "address_line_1": clientData.client_Address1,
        "address_line_2": clientData.client_Address2,
        "city": clientData.client_City,
        "state": clientData.client_State,
        "postal_code": clientData.client_Zip,
        "country": {
          "code": "",
          "name": clientData.selectedCountry,
          "currency": ""
        }
      },
      "contact": {
        "email":clientData.client_Email,
        "mobile": clientData.client_Phone,
      },
      "active": true
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }        
    });
    // console.log(response.data);
    return response.data;
 

  } catch (error) {
    return rejectWithValue(error);
  }
});

// update the clients data

export const updateClient = createAsyncThunk("user/updateUser", async (clientData, { rejectWithValue }) => {
  try {
    const client_id=clientData.client_id;
    console.log(client_id);
    const response = await axios.put(`${apiUpdateClient}/${client_id}`, {
      "name": clientData.client_Name,
      "address": {
        "address_line_1": clientData.client_Address1,
        "address_line_2": clientData.client_Address2,
        "city": clientData.client_City,
        "state": clientData.client_State,
        "postal_code": clientData.client_Zip,
        "country": {
          "code": "",
          "name": clientData.selectedCountry,
          "currency": ""
        }
      },
      "contact": {
        "email": clientData.client_Email,
        "mobile": clientData.client_Phone,
      },
      "active": true
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});





// To get the data of Active clints, then get the data from API

export const getAllActiveClients = async () => {
      try {
        const response = await axios(apiGetClients);
        // const data = await response.json();
        return response.data;
      } catch (error) {
        console.error('Error fetching in get Active Clients:', error);
      }
    };

    
// list all archive clients
export const getAllArchiveClients = async () => {
  try {
    const response = await axios(apiGetAllArchiveClient);
    return response.data;
  } catch (error) {
    console.error('Error fetching in all archive clients:', error);
  }
};












export const getClientsByName = async (clientName) => {
  try {
    const response = await axios(`${apiSearchByName}?name=${clientName}`);
    console.log("Search by name client", response.data.clients);
    return response.data.clients;

    
  } catch (error) {
    console.error('Error fetching in search clients:', error);
    return [];
    }  
  }


  export const getClientById = async (id) => {
    try{
      const response = await axios(`${apiUpdateClient}${id}`);
      // console.log(response.data);
      return response.data;
    }catch(error){
      console.error(`this error is getclientbyid error  ${error}`);
    }
  }
  





















// export const getClients = createAsyncThunk(
//   'user/getAllClients',
//   async ({ rejectWithValue }) => {
//     try {
//       // Make GET request to the API to fetch all clients
//       const response = await axios.get(apiGetClients);
//       // Return the data if the request is successful
//       console.log(response.data);
//       return response.data;
//     } catch (error) {
//       // If there's an error, reject the promise with the error value
//       return rejectWithValue(error);
//     }
//   }
// );

// Define custom hook to fetch all clients
// export const useAllClients = () => {
//   const [allActiveClients, setAllActiveClients] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     getClients()
//       .then((data) => {
//         setAllActiveClients(data);
//       })
//       .catch((error) => {
//         setError(error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []); // Run this effect only once on component mount

//   return [allActiveClients];
// };
 


// // Get all Archive Clients  => get data from apiGetAllArchiveClient
// export const getAllArchiveClients = createAsyncThunk(
//   'user/getAllArchiveClients',
//   async ({ rejectWithValue }) => {
//     try {
//       // Make GET request to the API to fetch all clients
//       const response = await axios.get(apiGetAllArchiveClient);
//       // Return the data if the request is successful
//       console.log(response.data);
//       return response.data;
//     } catch (error) {
//       // If there's an error, reject the promise with the error value
//       return rejectWithValue(error);
//     }
//   }
// );

// Define custom hook to fetch all clients
// export const useAllArchiveClients = () => {
//   const [allArchiveClients, setAllArchiveClients] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     getAllArchiveClients()
//       .then((data) => {
//         setAllArchiveClients(data);
//       })
//       .catch((error) => {
//         setError(error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []); // Run this effect only once on component mount

//   return { allArchiveClients, loading, error };
// };

// // Export Clients from the API=>> by get info from the API


// export const exportClients = createAsyncThunk(
//   'user/exportClients',
//   async ({ rejectWithValue }) => {
//     try {
//       // Make get request to Api1 and get data
//       const response = await axios.get(apiExportClient);
      
//       // Return the data if the request is successful
//       return response.data;
//     } catch (error) {
//       // If there's an error, reject the promise with the error value
//       return rejectWithValue(error);
//     }
//   }
// );

// // Search Client By Name from the API -> get details from API

// export const searchClientByName = createAsyncThunk(
//   'user/searchClientByName',
//   async ({ rejectWithValue }) => {
//     try {
//       // Make get request to Api1 and get data
//       const response = await axios.get(searchClientByName);
      
//       // Return the data if the request is successful
//       return response.data;
//     } catch (error) {
//       // If there's an error, reject the promise with the error value
//       return rejectWithValue(error);
//     }
//   }
// );


export const archiveClient = createAsyncThunk(
  'clients/archiveClient',
  async ({ clientId, isArchive }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${apiArchiveClient}/${clientId}`,
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