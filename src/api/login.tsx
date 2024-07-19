import axios from 'axios';

export const loginApi = async (identifier: string, password: string) => {
  try {
    const response = await axios.post(
      'https://seashell-app-5i2xd.ondigitalocean.app/api/auth/local',
      { identifier, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


