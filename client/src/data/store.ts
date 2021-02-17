/* Imports from packages */
import { applyMiddleware, createStore, Store } from "redux";
import thunk from "redux-thunk";

/* Imports from local files */
import reducers from "./reducers";
import { RootState } from '../data/reducers'

const DEFAULT_STATE: RootState = {
  requests: { data: [] }
};

export default function configureStore(initialState = DEFAULT_STATE): Store<RootState> {
  return createStore(reducers, initialState, applyMiddleware(thunk));
}
