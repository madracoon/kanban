import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getCardTreeIds } from 'utils'
import { Card } from 'types'
import { batch } from 'react-redux'
import { actions as allActions } from 'store';
import { getAllCards, addNewCard, destroyCards, updateCard as updateDbCard } from "localStorage"

const initialState = {
  cards: [],  
  isFetching: false
}

const fetchAllCards = createAsyncThunk(
  'cards/fetchCardsByListId',
  async () => {
    return getAllCards();
  }
);

const addCard = createAsyncThunk(
  'cards/addList',
  async (data: any) => {
    return addNewCard(data);
  }
)

const updateCard = createAsyncThunk(
  'cards/updateCard',
  async (data: any) => {
    return updateDbCard(data);
  }
)

const removeCard = createAsyncThunk(
  'cards/removeCard',
  async (id: number, thunkAPI) => {
    const treeIds = destroyCards([id]);
    const dispatch = thunkAPI.dispatch

    batch(() => {
      dispatch(allActions.cards.removeCardsByIds([id]));
      dispatch(allActions.comments.removeCommentsByIds(treeIds.comments));
    })

    return id;
  }
)

const slice = createSlice({
  name: 'cards',
  initialState: initialState,
  reducers: {
    removeCardsByIds: (state, action) => {
      const toRemove = new Set(action.payload);
      const updatedCards = state.cards.filter((item: Card) => !toRemove.has(item.id));
      state.cards = updatedCards;
    }
  },
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
  addCard,
  updateCard,
  removeCard
};

export const { reducer } = slice;

export const selectors = {
  selectCardsByListId(state: any, listId: number) {
    const selectedCards = state.cards.cards ? state.cards.cards.filter((item: Card) => item.listId === listId ) : [];

    return selectedCards;
  }
}