import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUsersApi } from '../api/userscall';
import { RootState } from './store'; // Adjust import path based on your store location

interface Users {
  id: number;
  username: string;
  email: string;
}

interface UsersState {
  data: Users[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token; // Adjust path to access token based on your state structure

    if (!token) {
      return rejectWithValue('No authentication token found');
    }

    try {
      const users = await getUsersApi(token);
      return users;
    } catch (error) {
      return rejectWithValue('Error fetching users');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<Users[]>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default usersSlice.reducer;
