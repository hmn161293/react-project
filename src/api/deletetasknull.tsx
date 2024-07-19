import axios from 'axios';

const deleteTaskById = async () => {
  const taskId = '6'; // Hardcoded taskId
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found in local storage.');
    }

    // Send DELETE request to delete the task
    const response = await axios.delete(`https://seashell-app-5i2xd.ondigitalocean.app/api/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`Task with ID ${taskId} deleted successfully.`);
    return response.data; // Optionally return data if needed
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
    throw error;
  }
};

export default deleteTaskById;
