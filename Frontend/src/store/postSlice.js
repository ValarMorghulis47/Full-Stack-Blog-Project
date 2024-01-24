import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    AllPost: null,
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        AllPost: (state, action) => {
            state.AllPost = action.payload;
            console.log("All Posts Are: ", state.AllPost);
        },
        deletePost: (state, action) => {
            // Remove the deleted post from the state
            const postIdToDelete = action.payload.postId;
            state.AllPost = state.AllPost.filter((post) => post._id !== postIdToDelete);
        },
        updatePost: (state, action) => {
            // Update the content of the post with the provided data
            const { postId, title, content, image, imagePublicId } = action.payload;
            const updatedPosts = state.AllPost.map((post) =>
                post._id === postId ? { ...post, title, content, image, imagePublicId } : post
            );
            state.AllPost = updatedPosts;
        },
        dataclear: (state) => {
            state.AllPost = null;
        },
    },
});

export const { dataclear, AllPost, deletePost, updatePost } = postSlice.actions;

export default postSlice.reducer;
