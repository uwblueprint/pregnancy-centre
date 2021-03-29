/* Imports from packages */
import { applyMiddleware, createStore, Store } from "redux";
import thunk from "redux-thunk";

/* Imports from local files */
import reducers from "./reducers";
import { RootState } from './reducers'

const DEFAULT_STATE: RootState = {
  requestGroups: { 
    data: [],
    displayData: []
  },
  requestGroup: {
    data: {} 
  }
};

export default function configureStore(initialState = DEFAULT_STATE): Store<RootState> {
  return createStore(reducers, initialState, applyMiddleware(thunk));
}
