import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    modal: false,
    success: false,
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        toggleModal: (state) => {
            state.modal= !state.modal;
        },
        toggleSuccess: (state) => {
            state.success = !state.success;
        },
    },
});

export const { toggleModal, toggleSuccess } = modalSlice.actions;

export default modalSlice.reducer;
