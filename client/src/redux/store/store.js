import { createStore } from 'redux';
import rootReducer from '../reducer/reducer';
import { loadStateFromLocalStorage, saveStateToLocalStorage } from '../actions/actions';


const persistedState = loadStateFromLocalStorage();


const store = createStore(rootReducer, persistedState);


store.subscribe(() => {
  saveStateToLocalStorage(store.getState());
});

export default store;
