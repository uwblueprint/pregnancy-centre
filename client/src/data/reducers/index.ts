/**
 * An index file of a directory will automatically be read when referencing the directory from another file.
 * Use this index file to export all reducers
 */
/* Imports from packages */
import { combineReducers } from 'redux';

/* Imports from local files */
import requestsReducer from './requestsReducer';

const rootReducer = combineReducers({
  requests: requestsReducer
});

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>
