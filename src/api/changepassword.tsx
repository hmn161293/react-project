import axios from 'axios';
interface UserOption {
    currentPassword: string;
    password: string;
    passwordConfirmation: string;

  }

export const updatePassword= async (userData: UserOption): Promise<any> => {
    try {
      const taskObject: any = {
        currentPassword: userData.currentPassword,
        password: userData.password,
        passwordConfirmation: userData.passwordConfirmation
        
      };
      
      console.log(taskObject)
      const response = await axios.post(`https://seashell-app-5i2xd.ondigitalocean.app/api/auth/change-password`, taskObject, {
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