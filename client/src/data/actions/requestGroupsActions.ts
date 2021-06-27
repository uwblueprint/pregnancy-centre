/* Imports from local files */
import { LOAD_REQUEST_GROUPS, SET_DISPLAY_REQUEST_GROUPS, UPSERT_REQUEST_GROUP } from "../actionTypes";
import RequestGroup from "../types/requestGroup";

/**
 * Actions should be as light weight as possible. No asynchronous processes should be started in actions.
 * This is why the data fetching was done prior to loading the data to the global store.
 *
 * "uploads" the data taken as an input into the datastore
 */
export interface RequestGroupsAction {
    type: string;
    payload: {
        requestGroups?: Array<RequestGroup>;
        requestGroup?: RequestGroup;
    };
}

export const loadRequestGroups = (data: Array<RequestGroup>): RequestGroupsAction => ({
    type: LOAD_REQUEST_GROUPS,
    payload: { requestGroups: data }
});

export const setDisplayRequestGroups = (data: Array<RequestGroup>): RequestGroupsAction => ({
    type: SET_DISPLAY_REQUEST_GROUPS,
    payload: { requestGroups: data }
});

export const upsertRequestGroup = (data: RequestGroup): RequestGroupsAction => ({
    type: UPSERT_REQUEST_GROUP,
    payload: { requestGroup: data }
});
