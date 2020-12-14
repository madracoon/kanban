import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getListTreeIds } from "utils"
import { batch } from 'react-redux'
import { actions as allActions } from 'store';

const initialState = {
  lists: [],  
  isFetching: false
}

const fetchLists = createAsyncThunk(
  'lists/fetchLists',
  async () => {
    return JSON.parse(localStorage.getItem("lists") as string)
  }
); 

const addList = createAsyncThunk(
  'lists/addList',
  async (data: any) => {
    const lists = JSON.parse(localStorage.getItem("lists") as string)
    const updatedLists = lists.concat(data)
    localStorage.setItem("lists", JSON.stringify(updatedLists))

    return data
  }
)

const renameList = createAsyncThunk(
  'lists/updateList',
  async (data: any) => {
    const {id, name} = data;
    const lists = JSON.parse(localStorage.getItem("lists") as string)
    const updatedList = lists.map((item: any) => { 
      if (item.id === id) item.name = name;
      return item
    })
    
    localStorage.setItem("lists", JSON.stringify(updatedList))

    return data
  }
)

const removeList = createAsyncThunk(
  'lists/removeList',
  async (data: any, thunkAPI) => {
    const { id } = data;
    const lists = JSON.parse(localStorage.getItem("lists") as string)
    
    // localstorage work
    const toRemove = new Set([id]);
    const updatedList = lists.filter((item: any) => !toRemove.has(item.id));
    localStorage.setItem("lists", JSON.stringify(updatedList))

    // store work
    const treeIds = getListTreeIds(thunkAPI.getState(), id)
    const dispatch = thunkAPI.dispatch

    batch(() => {
      dispatch(allActions.cards.removeCardsByIds(treeIds.cards))
    })

    return data
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