/* Imports from local files */
import { LOAD_DATA } from "../actionTypes";
import Request from '../types/request'
import { RequestsAction } from '../actions/'

export interface RequestsState {
  data: Array<Request>
}

const defaultState: RequestsState = {
  data: [],
};

/**
 * switch statement that filters on the action type to determine how to change the data in the store.
 * these replacements should be immutable.
 */
export default (state = defaultState, action: RequestsAction): RequestsState => {
  switch (action.type) {
    // directly sets the global data to the payload as specified in the action
    case LOAD_DATA:
      return {
        data: action.payload,
      };
    default:
      return state;
  }
};
