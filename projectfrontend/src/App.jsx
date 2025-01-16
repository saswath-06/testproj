// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, Home } from './components';

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Navigate to="/signin" />} />
    </Routes>
  );
}

export default App;
