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
import { updatePassword } from '../api/changepassword';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export const UserAuthForm: React.FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [shown, setShown] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (name === 'currentPassword') {
      setCurrentPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async(event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setShowError(true);
      return;
    }
    const userData = {
      currentPassword : currentPassword,
      password : newPassword,
      passwordConfirmation : confirmPassword
    };
    const result = await updatePassword(userData);
    if (result && result.status === 200) {
      setShowSuccess(true);
    } else {
      setShowError(true);
      setErrorMessage('Failed to update password');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/login');
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`} {...props}>
      {showError && errorMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="currentPassword" className="font-medium text-gray-700">
            Current Password
          </Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            placeholder="Enter current password"
            type={shown ? 'text' : 'password'}
            value={currentPassword}
            onChange={handleChange}
            disabled={loading}
            autoComplete="current-password"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="newPassword" className="font-medium text-gray-700">
            New Password
          </Label>
          <Input
            id="newPassword"
            name="newPassword"
            placeholder="Enter new password"
            type={shown ? 'text' : 'password'}
            value={newPassword}
            onChange={handleChange}
            disabled={loading}
            autoComplete="new-password"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword" className="font-medium text-gray-700">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm new password"
            type={shown ? 'text' : 'password'}
            value={confirmPassword}
            onChange={handleChange}
            disabled={loading}
            autoComplete="new-password"
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
            Show Passwords
          </label>
        </div>
        <Button type="submit" disabled={loading} className="self-start mt-4 bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center justify-center">
          {loading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save Changes
        </Button>
      </form>
      {showSuccess && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">You have successfully updated your password.</p>
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
