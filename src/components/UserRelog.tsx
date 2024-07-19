import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { userLoginFetch } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Icons } from './icons';
import { Checkbox } from '../ui/checkbox';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export const UserAuthForm: React.FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [shown, setShown] = useState(false);
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await dispatch(userLoginFetch({ identifier: user.username, password }));
    if (result.payload === true) {
      navigate('/dashboard/profile/change-password');
    }
  };

  const handleChangeName = () => {
    navigate('/dashboard/profile/change-name');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`} {...props}>
      <form className="grid gap-4" onSubmit={handleChangePassword}>
        <div className="grid gap-2">
          <Label htmlFor="password" className="font-medium text-gray-700">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            placeholder="Password"
            type={shown ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            autoComplete="current-password"
            disabled={loading}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="show-password"
            checked={shown}
            onCheckedChange={() => setShown(!shown)}
            className="transform scale-75"
          />
          <label htmlFor="show-password" className="text-sm font-medium leading-none text-gray-700">
            Show Password
          </label>
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center justify-center">
          {loading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Change Password
        </Button>
      </form>
      <Button type="button" onClick={handleChangeName} disabled={loading} className="w-full bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-lg mt-2 flex items-center justify-center">
        {loading && (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        )}
        Change Name
      </Button>
      <Button type="button" onClick={handleBackToDashboard} className="w-full bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 rounded-lg mt-2 flex items-center justify-center">
        {loading && (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        )}
        Back to Dashboard
      </Button>
      {showError && error && (
        <div className="bg-red-500 text-white p-4 rounded shadow-lg mt-4">
          {error}
        </div>
      )}
    </div>
  );
};
