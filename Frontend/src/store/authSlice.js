import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    IsLoggedIn : false,
    userData: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.IsLoggedIn = true;
            state.userData = action.payload;
        },
        logout: (state) => {
            state.userData = null;
        },
        toggleloggedin: (state)=>{
            state.IsLoggedIn =!state.IsLoggedIn;
        }
     }
})

export const {login, logout, toggleloggedin} = authSlice.actions;

export default authSlice.reducer;