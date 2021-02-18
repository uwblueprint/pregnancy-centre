/* Imports from local files */
import { LOAD_DATA } from "../actionTypes";
import Request from '../types/request'

/**
 * Actions should be as light weight as possible. No asynchronous processes should be started in actions.
 * This is why the data fetching was done prior to loading the data to the global store.
 *
 * "uploads" the data taken as an input into the datastore
 */
export interface RequestsAction {
  type: string,
  payload: Array<Request>
}

export const loadData = (data: Array<Request>): RequestsAction => ({
  type: LOAD_DATA,
  payload: data,
});
