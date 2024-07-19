// actions/authActions.ts

import { createAction } from '@reduxjs/toolkit';

export const loginRequest = createAction('LOGIN_REQUEST');
export const loginSuccess = createAction<any>('LOGIN_SUCCESS');
export const loginFailure = createAction<string>('LOGIN_FAILURE');
export const statusFetchSuccess = createAction<any>('STATUS_FETCH_SUCCESS');
export const taskFetchSuccess = createAction<any>('TASK_FETCH_SUCCESS');
export const usersFetchSuccess = createAction<any>('USERS_FETCH_SUCCESS');