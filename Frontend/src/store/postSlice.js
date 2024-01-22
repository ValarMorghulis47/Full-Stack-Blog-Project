import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    AllPost: null,
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        AllPost: (state, action)=>{
            state.AllPost = action.payload.AllPost;
            console.log("All Posts Are: ", state.AllPost);
        },
        deletePost: (state, action) => {
            // Remove the deleted post from the state
            const postIdToDelete = action.payload.postId;
            state.AllPost = state.AllPost.filter(post => post.$id !== postIdToDelete);
            state.postData = state.postData.filter(post => post.$id !== postIdToDelete);
          },
        dataclear: (state) => {
            state.AllPost = null;
        }
     }
})

export const {postdata, dataclear, AllPost, deletePost} = postSlice.actions;

export default postSlice.reducer;