import { createSlice } from '@reduxjs/toolkit';
import { createClient, updateClient, archiveClient,getClientsByName} from '../actions/clientAction';



// import { useReducer } from 'react';
// i move the all data of userDetails  in store.js


export const userDetails = createSlice({
  name: "userDetails",
  initialState: {
    clients: [],
    loading: false,
    error: null,
  },
    extraReducers: (builder) => {
      builder
        .addCase(createClient.pending, (state) => {
          state.loading = true;
        })
        .addCase(createClient.fulfilled, (state, action) => {
          state.loading = false;
          state.clients.push(action.payload);
        })
        .addCase(createClient.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(updateClient.pending, (state) => {
          state.loading = true;
        })
        .addCase(updateClient.fulfilled, (state, action) => {
          state.loading = false;
          state.clients.push(action.payload);
        })
        .addCase(updateClient.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(archiveClient.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(archiveClient.fulfilled, (state, action) => {
          state.loading = false;
          state.clients = state.clients.map((client) =>
            client._id === action.payload._id ? action.payload : client
          );
        })
        .addCase(archiveClient.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
       



      // store state of getClients
      // .addCase(getClients.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(getClients.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.clients=action.payload;
      // })
      // .addCase(getClients.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // })

      // // store all Archive Clients
      // .addCase(getAllArchiveClients.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(getAllArchiveClients.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.clients=action.payload;
      // })
      // .addCase(getAllArchiveClients.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // })


      




      // [getClients.pending]: (state) => {
      //   state.loading = true;
      // },
      // [getClients.fulfilled]: (state, action) => {
      //   state.loading = false;
      //   state.clients=action.payload;

      // },
      // [getClients.rejected]: (state,action) => {
      //   state.loading = false;
      //   state.clients=action.payload.message;
      // }, 

      // // store state of getAllActiveClients


      // [getAllActiveClients.pending]: (state) => {
      //   state.loading = true;
      // },
      // [getAllActiveClients.fulfilled]: (state, action) => {
      //   state.loading = false;
      //   state.clients=action.payload;

      // },
      // [getAllActiveClients.rejected]: (state,action) => {
      //   state.loading = false;
      //   state.clients=action.payload.message;
      // },

      // // store state of exportClients

      // [exportClients.pending]: (state) => {
      //   state.loading = true;
      // },
      // [exportClients.fulfilled]: (state, action) => {
      //   state.loading = false;
      //   state.clients=action.payload;

      // },
      // [exportClients.rejected]: (state,action) => {
      //   state.loading = false;
      //   state.clients=action.payload.message;
      // },

      // // store search client by name

      // [searchClientByName.pending]: (state) => {
      //   state.loading = true;
    //   },
     //  [searchClientByName.fulfilled]: (state, action) => {
     //   state.loading = false;
     //   state.clients=action.payload;

    //   },
     //  [searchClientByName.rejected]: (state,action) => {
     //   state.loading = false;
     //    state.clients=action.payload.message;
     //  },
   },

});

export default userDetails.reducer;

// export default userReducer;