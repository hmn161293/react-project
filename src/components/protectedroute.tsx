import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true); // Introduce isLoading state
  const [showForbiddenMessage, setShowForbiddenMessage] = useState(false);

  useEffect(() => {
    // Simulate loading delay for demonstration (replace with actual logic)
    const timeout = setTimeout(() => {
      setIsLoading(false);
      if (!user) {
        setShowForbiddenMessage(true);
      }
    }, );

    // Clear timeout on unmount or when user is authenticated
    return () => clearTimeout(timeout);
  }, [user]);

  const handleRedirect = () => {
    setShowForbiddenMessage(false);
    navigate('/');
  };

  // Show loading indicator or message while waiting for authentication to resolve
  if (isLoading) {
    return <p>Loading...</p>; // Replace with your loading indicator or component
  }

  // Show Forbidden Access message if user is not authenticated
  if (showForbiddenMessage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">Forbidden Access!</h1>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleRedirect}
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  // Render children if user is authenticated and loading is complete
  return <>{children}</>;
};

export default ProtectedRoute;
