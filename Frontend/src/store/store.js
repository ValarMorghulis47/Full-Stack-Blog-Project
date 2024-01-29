import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice';
import postSlice from './postSlice';
import darkmodeSlice from './darkmodeSlice';
const store = configureStore({
    reducer: {
        auth : authSlice,
        post : postSlice,
        theme :darkmodeSlice
    }
});


export default store;
