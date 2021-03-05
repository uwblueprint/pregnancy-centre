/* Imports from local files */
import { DEFINE_DISPLAY_REQUEST_GROUPS, LOAD_REQUEST_GROUPS } from "../actionTypes";
import RequestGroup from '../types/requestGroup'

/**
 * Actions should be as light weight as possible. No asynchronous processes should be started in actions.
 * This is why the data fetching was done prior to loading the data to the global store.
 *
 * "uploads" the data taken as an input into the datastore
 */
export interface RequestGroupsAction {
  type: string,
  payload: {
    requestGroups: Array<RequestGroup>,
    defineDisplayRequestGroups: (requestGroups: Array<RequestGroup>) => Array<RequestGroup>
  }
}

export const loadRequestGroups = (data: Array<RequestGroup>): RequestGroupsAction => ({
  type: LOAD_REQUEST_GROUPS,
  payload: { 
    requestGroups: data, 
    defineDisplayRequestGroups: (_: Array<RequestGroup>) => []
  },
});

export const defineDisplayRequestGroups = (defineDisplayRequestGroups: (requestGroups: Array<RequestGroup>) => Array<RequestGroup>): RequestGroupsAction => ({
  type: DEFINE_DISPLAY_REQUEST_GROUPS,
  payload: { 
    requestGroups: [], 
    defineDisplayRequestGroups 
  },
});
