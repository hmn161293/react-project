// src/redux/taskSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getTaskApi, createTaskApi, updateTaskApi, deleteTaskApi } from '../api/taskcall';
import { RootState } from './store';

// src/redux/taskSlice.ts
interface Task {
    id: number;
    Name: string;
    label: string;
    slug: string;
    description?: string;
    status: Status;
    assignee: Users | null; // Ensure this matches your usage
    files?: File;
    updatedAt?: string;
  }
  
  interface TaskData {
    id?: number;
    Name: string;
    label: string;
    slug: string;
    description?: string;
    status: Status;
    assignee: Users | null; // Ensure this matches your usage
    files?: File;
  }
  

interface Users {
  id: number;
  username: string;
}

interface Status {
  id: number;
  name: string;
  label: string;
}

interface TaskState {
  data: Task[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk<Task[], void, { state: RootState }>(
    'tasks/fetchTasks',
    async (_, { getState }) => {
      const state = getState();
      const token = state.auth.token;
      if (!token) {
        throw new Error('No token available');
      }
      const tasks = await getTaskApi(token);
      return tasks;
    }
  );

export const createTask = createAsyncThunk<Task, Omit<Task, 'id'>, { rejectValue: string, state: RootState }>(
  'tasks/createTask',
  async (newTask, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) {
        throw new Error('No token available');
      }
      const createdTask = await createTaskApi(newTask, token);
      return createdTask;
    } catch (error) {
      return rejectWithValue('Error creating task');
    }
  }
);

// src/redux/taskSlice.ts
export const updateTask = createAsyncThunk<Task, { id: number; updatedData: Partial<Task> }, { rejectValue: string, state: RootState }>(
    'tasks/updateTask',
    async ({ id, updatedData }, { getState, rejectWithValue }) => {
      try {
        const state = getState();
        const token = state.auth.token;
        if (!token) {
          throw new Error('No token available');
        }
        const taskToUpdate: TaskData = {
          id,
          Name: updatedData.Name || '',
          label: updatedData.label || '',
          slug: updatedData.slug || '',
          status: updatedData.status as Status,
          assignee: updatedData.assignee as Users | null, // Ensure this matches
          description: updatedData.description,
          files: updatedData.files,
        };
        const updatedTask = await updateTaskApi(taskToUpdate, token);
        return updatedTask;
      } catch (error) {
        return rejectWithValue('Error updating task');
      }
    }
  );
  

export const deleteTask = createAsyncThunk<number, { id: number }, { rejectValue: string, state: RootState }>(
  'tasks/deleteTask',
  async ({ id }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) {
        throw new Error('No token available');
      }
      await deleteTaskApi(id, token);
      return id;
    } catch (error) {
      return rejectWithValue('Error deleting task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch tasks';
        state.loading = false;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        if (state.data) {
          state.data.push(action.payload);
        } else {
          state.data = [action.payload];
        }
        state.loading = false;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        if (state.data) {
          const index = state.data.findIndex((task) => task.id === action.payload.id);
          if (index !== -1) {
            state.data[index] = action.payload;
          }
        }
        state.loading = false;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        if (state.data) {
          state.data = state.data.filter((task) => task.id !== action.payload);
        }
        state.loading = false;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default taskSlice.reducer;
