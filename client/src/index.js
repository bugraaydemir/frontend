import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import authReducer from "./state";
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  REGISTER
} from "redux-persist";
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { BrowserRouter } from 'react-router-dom';
// Configuring redux-persist
const persistConfig = { key : "root", storage, version:1};
const persistedReducer = persistReducer(persistConfig, authReducer);

// Configuring the redux store with middleware
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck:{
        ignoreActions:[  persistStore,
          persistReducer,
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          REGISTER   ]
      },
    }),
  
});
if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

// Setting up the root component and rendering the app inside it
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<BrowserRouter basename="https://sociallobystack.herokuapp.com">  
    <React.StrictMode>
    <Provider store ={store}>
      {/* Persisting state using redux-persist */}
      <PersistGate loading ={null} persistor={persistStore(store)}>
            <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
  </BrowserRouter>
);
