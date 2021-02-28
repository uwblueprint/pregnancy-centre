/* Imports from local files */
import { LOAD_DATA } from "../actionTypes";
import RequestGroup from '../types/requestGroup'
import { RequestGroupsAction } from '../actions/'

export interface RequestGroupsState {
  data: Array<RequestGroup>
}

const defaultState: RequestGroupsState = {
  data: [],
};

/**
 * switch statement that filters on the action type to determine how to change the data in the store.
 * these replacements should be immutable.
 */
export default (state = defaultState, action: RequestGroupsAction): RequestGroupsState => {
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
