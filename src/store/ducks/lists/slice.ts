import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import { getListTreeIds } from "utils"
import { batch } from 'react-redux'
import { actions as allActions } from 'store';
import { getAllLists, addNewList, updateList, destroyLists } from 'localStorage';

const initialState = {
  lists: [],  
  isFetching: false
}

const fetchLists = createAsyncThunk(
  'lists/fetchLists',
  async () => {
    return getAllLists();
  }
); 

const addList = createAsyncThunk(
  'lists/addList',
  async (data: any) => {
    addNewList(data);

    return data;
  }
)

const renameList = createAsyncThunk(
  'lists/updateList',
  async (data: any) => {
    updateList(data);

    return data;
  }
)

const removeList = createAsyncThunk(
  'lists/removeList',
  async (data: any, thunkAPI) => {
    const { id } = data;
    const treeIds = destroyLists([id]);
    const dispatch = thunkAPI.dispatch

    batch(() => {
      dispatch(allActions.cards.removeCardsByIds(treeIds.cards))
      dispatch(allActions.comments.removeCommentsByIds(treeIds.comments))
    })

    return data;
  }
)

const slice = createSlice({
  name: 'lists',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLists.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(fetchLists.fulfilled, (state, action) => {
      state.isFetching = false;
      state.lists = action.payload
    });

    builder.addCase(addList.fulfilled, (state, action) => {
      state.lists = state.lists.concat(action.payload as any)
    })

    builder.addCase(renameList.fulfilled, (state: any, action: any) => {
      state.lists = state.lists.map((item: any) => item.id === action.payload.id ? action.payload : item)
    })

    builder.addCase(removeList.fulfilled, (state: any, action: any) => {
      const toRemove = new Set([action.payload.id]);
      const updatedLists = state.lists.filter((item: any) => !toRemove.has(item.id));
      state.lists = updatedLists;
    });
  }
})

export const actions = {
  ...slice.actions,
  fetchLists,
  renameList,
  addList,
  removeList
};

export const { reducer } = slice;