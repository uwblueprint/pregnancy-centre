/* Imports from local files */
import { LOAD_REQUEST_GROUPS, SET_DISPLAY_REQUEST_GROUPS } from "../actionTypes";
import RequestGroup from '../types/requestGroup'
import { RequestGroupsAction } from '../actions/'

export interface RequestGroupsState {
  data: Array<RequestGroup>,
  displayData: Array<RequestGroup>
}

const defaultState: RequestGroupsState = {
  data: [],
  displayData: [] // Sorted and filtered data for user display.
};

/**
 * switch statement that filters on the action type to determine how to change the data in the store.
 * these replacements should be immutable.
 */
export default (state = defaultState, action: RequestGroupsAction): RequestGroupsState => {
  switch (action.type) {
    // directly sets the global data to the payload as specified in the action
    case LOAD_REQUEST_GROUPS:
      return {
        ...state,
        data: action.payload.data,
      };
    case SET_DISPLAY_REQUEST_GROUPS:
      return {
        ...state,
        displayData: action.payload.data, 
      };
    default:
      return state;
  }
};
