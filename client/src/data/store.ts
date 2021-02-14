/* Imports from packages */
import { applyMiddleware, createStore, Store } from "redux";
import thunk from "redux-thunk";

/* Imports from local files */
import reducers from "./reducers";
import StoreType from './types/store'

const DEFAULT_STATE: StoreType = {
  requests: { data: [] }
};

export default function configureStore(initialState: StoreType = DEFAULT_STATE): Store<StoreType> {
  return createStore(reducers, initialState, applyMiddleware(thunk));
}
