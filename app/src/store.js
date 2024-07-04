import { configureStore } from '@reduxjs/toolkit';
import userDetails from './reducers/clientReducers';
import apiErrorHandler from './middleware/apiErrorHandler';

export const store = configureStore({
  reducer: {
    app: userDetails,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiErrorHandler),
});

