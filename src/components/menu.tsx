import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Input } from '../ui/input';
import { SearchIcon } from 'lucide-react';
import avatar from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropmenu';
import { clearToken } from '../redux/authSlice';

const { Avatar } = avatar;

interface RootState {
  auth: {
    isLoading: boolean;
    isLoggedIn: boolean;
    error: string | null;
    user: any | null; // Adjust type as per your application
  };
}

export function Menu() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(clearToken());
    console.log('sss')
    console.log(user)
    // Redirect or perform additional actions after signing out
    // Example: Redirect to a sign-out page or home page
    window.location.href = '/'; // Replace with your sign-out route
    console.log('sss')
    console.log(user)
  };

  return (
    <div className="w-full flex items-center justify-between py-4 md:h-16">
      <div className="flex items-center justify-start space-x-16 pl-4">
        <h2 className="text-2xl font-bold">Quantum</h2>
        <nav className="hidden md:flex space-x-8 items-center h-full">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? 'text-gray-800' : 'text-gray-400 hover:text-gray-800'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/statistic"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? 'text-gray-800' : 'text-gray-400 hover:text-gray-800'
              }`
            }
          >
            Statistics
          </NavLink>
          <NavLink
            to="/page"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? 'text-gray-800' : 'text-gray-400 hover:text-gray-800'
              }`
            }
          >
            Page
          </NavLink>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="text-xl font-bold text-gray-400 hover:text-gray-800"
              style={{ transform: 'translateY(-2px)' }}
            >
              ...
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Change </DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      <div className="flex items-center space-x-4 pr-4">
        <div className="relative">
          <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 pr-4 py-2 w-40 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2">
            <div className="mr-2 h-12 w-12 flex items-center">
              <Avatar name={user ? user.name : 'Guest'} />
            </div>
            <div className="text-sm font-medium text-gray-700 flex items-center pr-2">
              {user ? user.name : 'Guest'}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Profile</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <NavLink to="/dashboard/profile">Change Profile</NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink to="/dashboard/profile/change-status">Change Status</NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="#!" onClick={handleSignOut} className="text-red-500">
                Sign Out
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
