import { LOAD_REQUEST_GROUP } from "../actionTypes";
import RequestGroup from '../types/requestGroup';

export interface RequestGroupAction {
  type: string,
  payload: RequestGroup
}

export const loadRequestGroup = (data: RequestGroup): RequestGroupAction => ({
  type: LOAD_REQUEST_GROUP,
  payload: data
})