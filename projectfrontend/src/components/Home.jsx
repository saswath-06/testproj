// Home.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, ChevronDown, Folder, File, Plus, Upload } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});
  const fileInputRef = useRef({});
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (!storedUser || !token) {
      navigate('/signin');
      return;
    }
    
    setUser(JSON.parse(storedUser));
    fetchFolders();
    setLoading(false);
  }, [navigate]);

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/folders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFolders(response.data.folders);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const createFolder = async () => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/folders`, 
        { name: folderName },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleFileUpload = async (e, folderId) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId);

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/files/upload`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      fetchFolders();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-gray-700">Welcome, {user?.username}</div>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">My Files</h1>
              <button
                onClick={createFolder}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus size={20} />
                <span>Create Folder</span>
              </button>
            </div>

            <div className="space-y-2">
              {folders.map(folder => (
                <div key={folder._id} className="border rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleFolder(folder._id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedFolders[folder._id] ? (
                        <ChevronDown size={20} />
                      ) : (
                        <ChevronRight size={20} />
                      )}
                    </button>
                    <Folder size={20} className="text-blue-500" />
                    <span className="font-medium">{folder.name}</span>
                    <input
                      type="file"
                      ref={el => fileInputRef.current[folder._id] = el}
                      onChange={(e) => handleFileUpload(e, folder._id)}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current[folder._id].click()}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <Upload size={16} />
                    </button>
                  </div>
                  
                  {expandedFolders[folder._id] && folder.files && (
                    <div className="ml-8 mt-2 space-y-1">
                      {folder.files.map(file => (
                        <div key={file._id} className="flex items-center space-x-2 text-gray-600">
                          <File size={16} />
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;