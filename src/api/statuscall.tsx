// src/api/statuscall.ts
import axios from 'axios';

interface Status {
  id: number;
  name: string;
  label: string;
}

const API_URL = 'https://seashell-app-5i2xd.ondigitalocean.app/api/statuses';

// Get Statuses
export const getStatusApi = async (token: string): Promise<Status[]> => {
  try {
    const response = await axios.get(`${API_URL}?populate=*`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.data.map((status: any) => ({
      id: status.id,
      name: status.attributes.name,
      label: status.attributes.label,
    }));
  } catch (error) {
    console.error('Error fetching statuses:', error);
    throw error;
  }
};

// Create Status
export const createStatusApi = async (newStatus: { name: string; label: string }, token: string): Promise<Status> => {
  try {
    const response = await axios.post(API_URL, { data: newStatus }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return {
      id: response.data.data.id,
      name: response.data.data.attributes.name,
      label: response.data.data.attributes.label,
    };
  } catch (error) {
    console.error('Error creating status:', error);
    throw error;
  }
};

// Update Status
export const updateStatusApi = async (id: number, updatedData: { name: string; label: string }, token: string): Promise<Status> => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}`,
      { data: updatedData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return {
      id: response.data.data.id,
      name: response.data.data.attributes.name,
      label: response.data.data.attributes.label,
    };
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
};

// Remove Status
export const removeStatusApi = async (id: number, token: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error removing status:', error);
    throw error;
  }
};
