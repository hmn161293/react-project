import axios from 'axios';
interface UserOption {
    id: number;
    name: string;

  }



export const updateUser= async (userData: UserOption): Promise<any> => {
    try {
      const taskObject: any = {
        id: userData.id,
        name: userData.name,
        
      };
      
      console.log(taskObject)
      const response = await axios.put(`https://seashell-app-5i2xd.ondigitalocean.app/api/users/${userData.id}`, taskObject, {
        headers: {
      
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };