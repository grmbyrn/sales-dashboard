import {createBrowserRouter} from "react-router-dom";
import SignIn from './components/SignIn.tsx'
import Dashboard from './routes/Dashboard.tsx'
import Header from './components/Header.tsx'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <SignIn />
    },
    {
        path: '/dashboard',
        element: (
            <>
                <Header />
                <Dashboard />
            </>
        )
    }
])