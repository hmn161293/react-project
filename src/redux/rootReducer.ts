// src/redux/rootReducer.ts

import { combineReducers } from 'redux';
import authReducer from './authSlice';
import taskReducer from './taskSlice'; // Adjust the import path as necessary
import usersReducer from './usersSlice'; // Adjust the import path as necessary
import statusReducer from './statusSlice'; // Adjust the import path as necessary

const rootReducer = combineReducers({
  auth: authReducer,
  tasks: taskReducer,
  users: usersReducer,
  status: statusReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
