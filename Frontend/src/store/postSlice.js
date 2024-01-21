import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    postData: null,
    AllPost: null,
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        postdata: (state, action) => {
            state.postData = action.payload.postData;
        },
        AllPost: (state, action)=>{
            state.AllPost = action.payload.AllPost;
        },
        deletePost: (state, action) => {
            // Remove the deleted post from the state
            const postIdToDelete = action.payload.postId;
            state.AllPost = state.AllPost.filter(post => post.$id !== postIdToDelete);
            state.postData = state.postData.filter(post => post.$id !== postIdToDelete);
          },
        dataclear: (state) => {
            state.postData = null;
            state.AllPost = null;
        }
     }
})

export const {postdata, dataclear, AllPost, deletePost} = postSlice.actions;

export default postSlice.reducer;