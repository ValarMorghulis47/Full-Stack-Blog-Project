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
            state.userData = action.payload;
            console.log("The userData stored in the redux is: ", state.userData, " And the user is :", state.IsLoggedIn);
        },
        logout: (state) => {
            state.userData = null;
        },
        toggleloggedin: (state)=>{
            console.log("The userData stored in the redux is: ", state.userData, " And the user is :", state.IsLoggedIn);
            state.IsLoggedIn =!state.IsLoggedIn
        }
     }
})

export const {login, logout, toggleloggedin} = authSlice.actions;

export default authSlice.reducer;