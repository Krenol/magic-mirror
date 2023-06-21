
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import Login from './pages/Login';
import { QueryClient, QueryClientProvider } from 'react-query';
import MenuAppBar from './features/appbar/MenuAppBar';
import { Box } from '@mui/material';
import { PADDING } from './assets/styles/theme';
import { Settings } from './pages/Settings';
import { Registration } from './pages/Registration';

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
        <MenuAppBar />
        <Box sx={{ padding: PADDING }}>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/settings' element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
