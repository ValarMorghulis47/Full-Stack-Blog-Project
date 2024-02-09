import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    modal: false,
    success: false,
    postDelete: false,
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
        togglePostDelete: (state) => {
            state.postDelete = !state.postDelete;
            console.log("post delete toggled: ", state.postDelete);
        },
    },
});

export const { toggleModal, toggleSuccess, togglePostDelete } = modalSlice.actions;

export default modalSlice.reducer;
