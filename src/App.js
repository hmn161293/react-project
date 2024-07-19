import { Provider } from 'react-redux';
import store from './redux/store';
import './globals.css';
import Layout from './pages/layout'; // Ensure correct import path
import AuthenticationPage from './pages/login';
import Dashboard from './pages/dashboard';
import Profile from './pages/profile';
import EditProfile from './pages/editname';
import EditPass from './pages/editpassword';
import {StatusEdit} from './pages/editstatus'

import ProtectedRoute from './components/protectedroute'; // Import ProtectedRoute component
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthenticationPage />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/change-name" element={<EditProfile />} />
            <Route path="profile/change-password" element={<EditPass />} />
            <Route path="profile/change-status" element={<StatusEdit/>} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
