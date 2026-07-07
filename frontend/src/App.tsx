import { QueryClientProvider } from 'react-query'
import { memo, type ReactNode } from 'react'
import MenuAppBar from './components/appbar/MenuAppBar'
import { PADDING } from './assets/styles/theme'
import { Box } from '@mui/material'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import RouteErrorPage from './routes/RouteErrorPage'
import ErrorPage from './routes/ErrorPage'
import { Dashboard } from './routes/Dashboard'
import { Settings } from './routes/Settings'
import { GridEditContextProvider } from './common/GridEditContext'
import { queryClient } from './common/queryClient'

interface BaseFrameProps {
    children: ReactNode
}

const BaseFrame = memo<BaseFrameProps>(({ children }) => {
    return (
        <>
            <MenuAppBar />
            <Box sx={{ p: PADDING }}>{children}</Box>
        </>
    )
})

BaseFrame.displayName = 'BaseFrame'

const AppFrame = () => {
    return (
        <BaseFrame>
            <Outlet />
        </BaseFrame>
    )
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppFrame />,
        errorElement: (
            <BaseFrame>
                <RouteErrorPage />
            </BaseFrame>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: 'settings',
                element: <Settings />,
            },
            {
                path: 'error',
                element: <ErrorPage />,
            },
        ],
    },
])

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <GridEditContextProvider>
                <RouterProvider router={router} />
            </GridEditContextProvider>
        </QueryClientProvider>
    )
}

export default App
