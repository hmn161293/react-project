import axios from 'axios';

interface Task {
  id: number;
  Name: string;
  label: string;
  slug: string;
  full_description: any[];
  summary: string;
  due_date: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  tasks: Task[];
}

export const getUsersApi = async (token: string): Promise<User[]> => {
  try {
    const response = await axios.get(
      'https://seashell-app-5i2xd.ondigitalocean.app/api/users?populate=*',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const users = response.data.map((user: any) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      tasks: user.tasks || []
    }));

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
