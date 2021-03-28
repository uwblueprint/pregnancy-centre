/* Imports from local files */
import { LOAD_REQUEST_GROUP } from "../actionTypes";
import RequestGroup from '../types/requestGroup'
import { RequestGroupAction } from '../actions/'

export interface RequestGroupsState {
  data: RequestGroup
}

const defaultState: RequestGroupsState = {
  data: null
};

/**
 * switch statement that filters on the action type to determine how to change the data in the store.
 * these replacements should be immutable.
 */
export default (state = defaultState, action: RequestGroupAction): RequestGroupsState => {
  switch (action.type) {
    // directly sets the global data to the payload as specified in the action
    case LOAD_REQUEST_GROUP:
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
};
