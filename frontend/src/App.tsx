
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './routes/Dashboard';
import Login from './routes/Login';
import Logout from './routes/Logout';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryCache = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: false,
      staleTime: 60000,
    },
  },
});

export const App = () => {
  return (
    <QueryClientProvider client={queryCache}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
