import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice';
import postSlice from './postSlice';
import darkmodeSlice from './darkmodeSlice';
import modalSlice from './modalSlice';
const store = configureStore({
    reducer: {
        auth : authSlice,
        post : postSlice,
        theme :darkmodeSlice,
        modal : modalSlice
    }
});


export default store;
