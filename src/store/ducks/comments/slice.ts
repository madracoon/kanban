import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Comment } from 'types'
import { addNewComment } from "localStorage"

const initialState = {
  comments: [],  
  isFetching: false
}

const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async () => {
    return JSON.parse(localStorage.getItem("comments") as string)
  }
); 

const addComment = createAsyncThunk(
  'comments/addComment',
  async (data: any) => {
    return addNewComment(data);
  }
)

const slice = createSlice({
  name: 'comments',
  initialState: initialState,
  reducers: {
    removeCommentsByIds: (state, action) => {
      const toRemove = new Set(action.payload);
      const updatedComments = state.comments.filter((item: Comment) => !toRemove.has(item.id));
      state.comments = updatedComments;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchComments.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.isFetching = false;
      state.comments = action.payload
    });
    builder.addCase(addComment.fulfilled, (state, action) => {
      state.comments = state.comments.concat(action.payload as any)
    });
  }
})

export const actions = {
  ...slice.actions,
  fetchComments,
  addComment,
};

export const { reducer } = slice;

export const selectors = {
  selectCommentsByCardId(state: any, cardId: number) {
    const selectedComments = state.comments.comments ? state.comments.comments.filter((item: Comment) => item.cardId === cardId ) : [];
    return selectedComments;
  }
}