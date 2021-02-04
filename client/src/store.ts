import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";

const DEFAULT_STATE = {};

export default function configureStore(initialState = DEFAULT_STATE) {
  return createStore(reducers, initialState, applyMiddleware(thunk));
}
