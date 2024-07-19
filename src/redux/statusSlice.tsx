// src/redux/statusSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './rootReducer'; // Import RootState
import { getStatusApi, updateStatusApi, removeStatusApi, createStatusApi } from '../api/statuscall';

interface Status {
  id: number;
  name: string;
  label: string;
}

interface StatusState {
  data: Status[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatusState = {
  data: null,
  loading: false,
  error: null,
};

// Fetch JWT token from the store
const selectToken = (state: RootState) => state.auth.token;

export const fetchStatus = createAsyncThunk(
  'status/fetchStatus',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState; // Cast state to RootState
    const token = selectToken(state);
    try {
      const statuses = await getStatusApi(token!); // Ensure token is not null
      console.log(statuses)
      return statuses;
    } catch (error) {
      return rejectWithValue('Error fetching statuses');
    }
  }
);

export const createStatus = createAsyncThunk(
  'status/createStatus',
  async (newStatus: { name: string; label: string }, { rejectWithValue, getState }) => {
    const state = getState() as RootState; // Cast state to RootState
    const token = selectToken(state);
    try {
      const createdStatus = await createStatusApi(newStatus, token!); 
      return createdStatus;
    } catch (error) {
      return rejectWithValue('Error creating status');
    }
  }
);

export const updateStatus = createAsyncThunk(
  'status/updateStatus',
  async ({ id, updatedData }: { id: number; updatedData: { name: string; label: string } }, { rejectWithValue, getState }) => {
    const state = getState() as RootState; // Cast state to RootState
    const token = selectToken(state);
    try {
      const updatedStatus = await updateStatusApi(id, updatedData, token!); // Ensure token is not null
      return updatedStatus;
    } catch (error) {
      return rejectWithValue('Error updating status');
    }
  }
);

export const deleteStatus = createAsyncThunk(
  'status/deleteStatus',
  async (id: number, { rejectWithValue, getState }) => {
    const state = getState() as RootState; // Cast state to RootState
    const token = selectToken(state);
    try {
      await removeStatusApi(id, token!); // Ensure token is not null
      return id;
    } catch (error) {
      return rejectWithValue('Error deleting status');
    }
  }
);

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Status
      .addCase(fetchStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatus.fulfilled, (state, action: PayloadAction<Status[]>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchStatus.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Create Status
      .addCase(createStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStatus.fulfilled, (state, action: PayloadAction<Status>) => {
        if (state.data) {
          state.data.push(action.payload);
        } else {
          state.data = [action.payload];
        }
        state.loading = false;
      })
      .addCase(createStatus.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Update Status
      .addCase(updateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action: PayloadAction<Status>) => {
        if (state.data) {
          const index = state.data.findIndex(status => status.id === action.payload.id);
          if (index !== -1) {
            state.data[index] = action.payload;
          }
        }
        state.loading = false;
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Delete Status
      .addCase(deleteStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStatus.fulfilled, (state, action: PayloadAction<number>) => {
        if (state.data) {
          state.data = state.data.filter(status => status.id !== action.payload);
        }
        state.loading = false;
      })
      .addCase(deleteStatus.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default statusSlice.reducer;
