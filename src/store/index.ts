import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { actions, selectors, reducer } from "./ducks"
import logger from 'redux-logger'

export { actions, selectors };

export default function configureStore() {
    const store =  createStore(
      reducer,
      // initialState,
      applyMiddleware(
        logger,
        thunk
      ),
    );

    return store
}