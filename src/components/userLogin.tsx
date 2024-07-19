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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const redux = useSelector((state: RootState) => state);
  console.log(redux)
  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async(event: React.FormEvent) => {
    event.preventDefault();
    const result = await dispatch(userLoginFetch({ identifier: username, password }));
    if (result.payload === true){
        navigate('/dashboard')
    }
};

  return (
    <div className={className} {...props}>
      {showError && error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-2">
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="email">
            Username
          </Label>
          <Input
            id="email"
            name="username"
            placeholder="name@example.com"
            type="email"
            value={username}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            placeholder="Password"
            type={shown ? 'text' : 'password'}
            value={password}
            onChange={handleChange}
            autoComplete="current-password"
            disabled={loading}
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="show-password"
            checked={shown}
            onCheckedChange={() => setShown(!shown)}
            className="transform scale-75"
          />
          <label htmlFor="show-password" className="text-sm font-medium leading-none">
            Show Password
          </label>
        </div>
        <Button type="submit" disabled={loading} className="self-start">
          {loading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Sign In
        </Button>
      </form>
    </div>
  );
};