import axios from 'axios';

// Task and related interfaces
interface Task {
  id: number;
  Name: string;
  label: string;
  slug: string;
  description?: string;
  status: StatusOption;
  assignee: UserOption | null; // Update to handle null
  updatedAt: string;
}

interface TaskData {
  id?: number;
  Name: string;
  label: string;
  slug: string;
  description?: string;
  status: StatusOption;
  assignee: UserOption | null; // Update to handle null
  files?: File;
}

interface StatusOption {
  id: number;
  name: string;
  label: string;
}

interface UserOption {
  id: number;
  username: string;
}

// Get Tasks
export const getTaskApi = async (token: string): Promise<Task[]> => {
  try {
    const response = await axios.get(
      'https://seashell-app-5i2xd.ondigitalocean.app/api/tasks?populate=*',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.data) {
      console.error('No data field in response:', response.data);
      return [];
    }

    return response.data.data.map((task: any) => {
      const attributes = task.attributes || {};
      const statusData = attributes.status?.data || {};
      const assigneeData = attributes.assignee?.data || null; // Handle null

      return {
        id: task.id || 0,
        Name: attributes.Name || '',
        label: attributes.label || '',
        slug: attributes.slug || '',
        description: attributes.full_description?.[0]?.children?.[0]?.text || 'No Description',
        status: {
          id: statusData.id || 0,
          name: statusData.attributes?.name || 'None',
          label: statusData.attributes?.label || 'Unknown',
        },
        assignee: assigneeData
          ? {
              id: assigneeData.id || 0,
              username: assigneeData.attributes?.username || 'Unknown',
            }
          : null, // Assign null if no assignee
        updatedAt: attributes.updatedAt || '',
      };
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Create Task
export const createTaskApi = async (taskData: TaskData, token: string): Promise<Task> => {
  try {
    const taskObject: any = {
      Name: taskData.Name,
      label: taskData.label,
      slug: taskData.slug,
      status: taskData.status,
      assignee: taskData.assignee || null, // Handle null
      files: taskData.files,
    };

    if (taskData.description) {
      taskObject.full_description = [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: taskData.description }],
        },
      ];
    }

    const response = await axios.post(
      'https://seashell-app-5i2xd.ondigitalocean.app/api/tasks',
      { data: taskObject },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update Task
export const updateTaskApi = async (taskData: TaskData, token: string): Promise<Task> => {
  try {
    const taskObject: any = {
      Name: taskData.Name,
      label: taskData.label,
      slug: taskData.slug,
      status: taskData.status,
      assignee: taskData.assignee || null, // Handle null
      full_description: taskData.description
        ? [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: taskData.description }],
            },
          ]
        : undefined,
    };

    const response = await axios.put(
      `https://seashell-app-5i2xd.ondigitalocean.app/api/tasks/${taskData.id}`,
      { data: taskObject },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete Task
export const deleteTaskApi = async (id: number, token: string): Promise<void> => {
  try {
    await axios.delete(
      `https://seashell-app-5i2xd.ondigitalocean.app/api/tasks/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
