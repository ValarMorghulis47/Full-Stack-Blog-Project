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
            console.log("The userData stored in the redux is: ", state.userData);
        },
        logout: (state) => {
            state.IsLoggedIn = false;
            state.userData = null;
        }
     }
})

export const {login, logout, IsLoggedIn} = authSlice.actions;

export default authSlice.reducer;