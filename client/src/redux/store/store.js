import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import rootReducer from '../reducer/reducer';
import { loadStateFromLocalStorage, saveStateToLocalStorage } from '../actions/actions';

const persistedState = loadStateFromLocalStorage();

const store = createStore(
  rootReducer,
  persistedState,
  applyMiddleware(thunk)
);

store.subscribe(() => {
  saveStateToLocalStorage(store.getState());
});

export default store;