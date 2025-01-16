// SignIn.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const validateForm = () => {
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    setError('');
    return true;
  };

  const handleLogin = async (isNewAccount) => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const endpoint = isNewAccount ? '/api/register' : '/api/login';
      const response = await axios.post(`${API_URL}${endpoint}`, {
        username,
        password
      });
      
      if (response.data.status === 'success') {
        // Store the token in localStorage
        localStorage.setItem('authToken', response.data.token);
        // Store user info
        localStorage.setItem('user', JSON.stringify({
          username: username,
          id: response.data.userId
        }));
        
        setMessage(response.data.message);
        setUsername('');
        setPassword('');
        // Navigate to home page
        navigate('/home');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const showAllUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/all-users`);
      setUserList(response.data.users);
      setMessage('User list updated');
    } catch (error) {
      setError('Error fetching users');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleLogin(false)}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            <button
              onClick={() => handleLogin(true)}
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'New Account'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <button
            onClick={showAllUsers}
            disabled={isLoading}
            className="w-full bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Show All Users'}
          </button>
        </div>

        {userList.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Registered Users</h2>
            <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
              {userList.map((user, index) => (
                <div 
                  key={index} 
                  className="border-b border-gray-200 last:border-0 py-2 flex items-center"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700">{user.username}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignIn;