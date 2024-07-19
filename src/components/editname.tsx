import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Icons } from './icons';
import { updateUser } from '../api/edituser';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export const UserAuthForm: React.FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [username, setUsername] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (error) {
      setShowError(true);
      setErrorMessage(error);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'username') {
      setUsername(value);
    } 
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Name cannot be empty');
      setShowError(true);
      return;
    }
    const userData = {
      id: user.id,
      name: username,
    };
    const result = await updateUser(userData);
    if (result && result.status === 200) {
      setShowSuccess(true);
    } else {
      setShowError(true);
      setErrorMessage('Failed to update details');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/dashboard');
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`} {...props}>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username" className="font-medium text-gray-700">
            New Name
          </Label>
          <Input
            id="username"
            name="username"
            placeholder={user.name || 'Enter new username'}
            value={username}
            onChange={handleChange}
            disabled={loading}
            autoComplete="new-password"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        {errorMessage && (
          <p className="text-red-500 mt-2">{errorMessage}</p>
        )}
        <Button type="submit" disabled={loading} className="self-start mt-4 bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center">
          {loading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save Changes
        </Button>
      </form>
      {showSuccess && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">You have successfully updated your details.</p>
            <div className="flex justify-center">
              <Button onClick={handleSuccessClose} className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center justify-center">
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
