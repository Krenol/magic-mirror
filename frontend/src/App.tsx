
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './routes/Dashboard';
import Login from './routes/Login';
import Logout from './routes/Logout';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
