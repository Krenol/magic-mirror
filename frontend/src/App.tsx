
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './routes/Dashboard';
import Login from './routes/Login';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryCache = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 2,
      retryDelay: 300,
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
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
