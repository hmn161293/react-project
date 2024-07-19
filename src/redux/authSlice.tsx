import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginApi } from '../api/login';
import { fetchStatus } from './statusSlice';
import { fetchTasks } from './taskSlice';
import { fetchUsers } from './usersSlice';
import { loginRequest, loginSuccess, loginFailure } from './authActions';

interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  token: null,
};

export const userLoginFetch = createAsyncThunk(
  'auth/login',
  async (userData: { identifier: string; password: string }, { dispatch }) => {
    const { identifier, password } = userData;
    dispatch(loginRequest());

    try {
      const response = await loginApi(identifier, password);
      if (response) {
        const userdata = response;
        dispatch(setToken(userdata.jwt));

        // Ensure that dispatch is correctly typed
        await dispatch(fetchStatus() as any).unwrap();
        await dispatch(fetchTasks() as any).unwrap();
        await dispatch(fetchUsers() as any).unwrap();

        dispatch(loginSuccess(userdata.user));
        return true;
      } else {
        dispatch(loginFailure('An unexpected error occurred'));
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      dispatch(loginFailure('An error occurred during login'));
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    clearToken(state) {
      localStorage.clear()
      state = Object.assign({}, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginRequest, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginSuccess, (state, action: PayloadAction<any>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loginFailure, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
