import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    AllPost: [],
    UserPost: [],
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        AllPost: (state, action) => {
            state.AllPost = action.payload;
            console.log("All Posts Are: ", state.AllPost);
        },
        UserPost: (state, action) => {
            state.UserPost = action.payload;
            console.log("Users Posts Are: ", state.UserPost);
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
            state.AllPost = [];
            state.UserPost = [];
        },
    },
});

export const { dataclear, AllPost, deletePost, updatePost, UserPost } = postSlice.actions;

export default postSlice.reducer;
