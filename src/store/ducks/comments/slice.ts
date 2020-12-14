import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Comment } from 'types'

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
    const comments = JSON.parse(localStorage.getItem("comments") as string)
    const lastId = comments.sort((a: Comment, b: Comment) => a.id - b.id)[comments.length - 1].id || 0
    const updatedComments = comments.concat({id: lastId + 1, ...data})
    localStorage.setItem("comments", JSON.stringify(updatedComments))

    return {id: lastId + 1, ...data}
  }
)

const removeCommentsByIds = createAsyncThunk(
  'comments/removeCommentsByIds',
  async (ids: Array<number>) => {
    const cards = JSON.parse(localStorage.getItem("comments") as string)
    // localstorage work
    const toRemove = new Set(ids);
    const updatedComments = cards.filter((item: Comment) => !toRemove.has(item.id));
    localStorage.setItem("comments", JSON.stringify(updatedComments))
  }
)

const slice = createSlice({
  name: 'comments',
  initialState: initialState,
  reducers: {},
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
    builder.addCase(removeCommentsByIds.fulfilled, (state: any, action: any) => {
      const toRemove = new Set(action.payload);
      const updatedComments = state.comments.filter((item: Comment) => !toRemove.has(item.id));
      state.comments = updatedComments;
    })
  }
})

export const actions = {
  ...slice.actions,
  fetchComments,
  addComment,
  removeCommentsByIds
};

export const { reducer } = slice;

export const selectors = {
  selectCommentsByCardId(state: any, cardId: number) {
    const selectedComments = state.comments.comments ? state.comments.comments.filter((item: Comment) => item.cardId === cardId ) : [];
    return selectedComments;
  }
}