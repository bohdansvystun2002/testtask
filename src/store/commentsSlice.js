import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//  fetching comments from the server
export const fetchComments = createAsyncThunk('comments/fetchComments', async () => {
  const res = await axios.get('http://localhost:3001/comments');
  return res.data;
});

// updating a comment
export const updateComment = createAsyncThunk('comments/updateComment', async (comment) => {
  const res = await axios.put(`http://localhost:3001/comments/${comment.id}`, comment);
  return res.data;
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default commentsSlice.reducer;
