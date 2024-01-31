import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    modal: false, // Get initial mode from localStorage
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        toggleModal: (state) => {
            state.modal= !state.modal;
            console.log("The state is: ", state.modal);
        },
    },
});

export const { toggleModal } = modalSlice.actions;

export default modalSlice.reducer;
