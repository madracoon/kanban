import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Card } from 'types'

const initialState = {
  cards: [],  
  isFetching: false
}

const fetchAllCards = createAsyncThunk(
  'cards/fetchCardsByListId',
  async () => {
    return JSON.parse(localStorage.getItem("cards") as string)
  }
); 

const fetchCardsByListId = createAsyncThunk(
  'cards/fetchCardsByListId',
  async () => {
    return JSON.parse(localStorage.getItem("cards") as string)
  }
); 

const addCard = createAsyncThunk(
  'cards/addList',
  async (data: any) => {
    const cards = JSON.parse(localStorage.getItem("cards") as string)
    const lastId = cards.sort((a: Card, b: Card) => a.id - b.id)[cards.length - 1].id || 0
    const updatedCards = cards.concat({id: lastId + 1, ...data})

    localStorage.setItem("cards", JSON.stringify(updatedCards))

    return {id: lastId + 1, ...data}
  }
)

const updateCard = createAsyncThunk(
  'cards/updateCard',
  async (data: any) => {
    const {id, name, details} = data;
    const cards = JSON.parse(localStorage.getItem("cards") as string)
    const updatedCards = cards.map((item: Card) => { 
      if (item.id === id) item = data;
      return item
    })
    
    localStorage.setItem("cards", JSON.stringify(updatedCards))

    return data
  }
)

const slice = createSlice({
  name: 'cards',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllCards.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(fetchAllCards.fulfilled, (state, action) => {
      state.isFetching = false;
      state.cards = action.payload
    });

    builder.addCase(addCard.fulfilled, (state, action) => {
      state.cards = state.cards.concat(action.payload as any)
    })

    builder.addCase(updateCard.fulfilled, (state: any, action: any) => {
      state.cards = state.cards.map((item: any) => item.id === action.payload.id ? action.payload : item)
    })
  }
})

export const actions = {
  ...slice.actions,
  fetchAllCards,
  fetchCardsByListId,
  addCard,
  updateCard
};

export const { reducer } = slice;

export const selectors = {
  selectCardsByListId(state: any, listId: number) {
    const selectedCards = state.cards.cards ? state.cards.cards.filter((item: Card) => item.listId === listId ) : [];

    return selectedCards;
  }
}