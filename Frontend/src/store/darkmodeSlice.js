import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: localStorage.getItem("theme") || "light", // Get initial mode from localStorage
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state, action) => {
            const newMode = action.payload === "light" ? "dark" : "light";
            state.mode = newMode;
            localStorage.setItem("theme", newMode); // Save the new mode in localStorage
        },
    },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
