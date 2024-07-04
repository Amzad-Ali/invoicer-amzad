import { isRejectedWithValue } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiErrorHandler = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const { response } = action.payload;
    let errorMessage = 'An unknown error occurred';
   
    if (response && response.data) {
      const { error } = response.data;
      const{success,message}=response.data;


      // Handle error with a single message
      if (error) {
        errorMessage = error;
        console.log("error:" +errorMessage);
      }

      // Handle error with a message and additional information
      else if (message && !success) {
        errorMessage = message;
        console.log('message:' + message);

      }

      // Handle success response with additional data
      // else if (success && message && data) {
       
    //    errorMessage=message;
    //  }

      // Handle error response with additional data
      else if (!success && message) {
        errorMessage = message;
        console.log('message:' + message);

      }
    }
    

    toast.error(errorMessage, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  return next(action);
};

export default apiErrorHandler;