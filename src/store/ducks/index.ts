import { combineReducers } from 'redux';

import * as lists from './lists';
import * as cards from './cards';
import * as comments from './comments';

export const reducer = combineReducers({
  lists: lists.reducer,
  cards: cards.reducer,
  comments: comments.reducer
});

export const actions = {
  lists: lists.actions,
  cards: cards.actions,
  comments: comments.actions
};

export const selectors = {
  cards: cards.selectors,
  comments: comments.selectors
}