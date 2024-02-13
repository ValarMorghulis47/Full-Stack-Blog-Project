import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    emailComp: false,
    resetPassComp: true,
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
            console.log("ive switched the state");
        },
    },
});

export const { toggleEmailComp, toggleresetPassComp} = modalSlice.actions;

export default modalSlice.reducer;
