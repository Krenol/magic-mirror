import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import Login from "./pages/Login";
import { QueryClient, QueryClientProvider } from "react-query";
import MenuAppBar from "./features/appbar/MenuAppBar";
import { Box } from "@mui/material";
import { PADDING } from "./assets/styles/theme";
import { Settings } from "./pages/Settings";
import { Registration } from "./pages/Registration";
import React from "react";
import ErrorPage from "./pages/ErrorPage";
import { locationLoader } from "./features/location_loader/locationLoader";

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

const BaseFrame = (props: any) => {
  return (
    <React.Fragment>
      <MenuAppBar />
      <Box sx={{ padding: PADDING }}>{props.children}</Box>
    </React.Fragment>
  );
};

const AppFrame = () => {
  return (
    <BaseFrame>
      <Outlet />
    </BaseFrame>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppFrame />,
    errorElement: (
      <BaseFrame>
        <ErrorPage />
      </BaseFrame>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
        loader: async () => await locationLoader(),
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "registration",
        element: <Registration />,
      },
    ],
  },
]);

export const App = () => {
  return (
    <QueryClientProvider client={queryCache}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
