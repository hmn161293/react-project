import { createContext, useContext } from 'react';

interface AuthContextType {
  token: string | null;
  // Other relevant state or functions
}

const AuthContext = createContext<AuthContextType>({ token: null });

export const useAuthHeader = () => {
  const { token } = useContext(AuthContext);

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Usage example

