import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    emailComp: false,
    resetPassComp: true,
    resetPassSuccess: false,
};

const modalSlice = createSlice({
    name: "resetPass",
    initialState,
    reducers: {
        toggleEmailComp: (state) => {
            state.emailComp= !state.emailComp;
        },
        toggleresetPassComp: (state) => {
            state.resetPassComp = !state.resetPassComp;
        },
        toggleresetPassSuccess: (state) => {
            state.resetPassSuccess = !state.resetPassSuccess;
        }
    },
});

export const { toggleEmailComp, toggleresetPassComp, toggleresetPassSuccess} = modalSlice.actions;

export default modalSlice.reducer;
