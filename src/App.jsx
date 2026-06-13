import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Profile from './pages/dashboard/Profile'
import Projects from './pages/projects/Projects'
import ProjectDetail from './pages/projects/ProjectDetail'
import Orders from './pages/orders/Orders'

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('access_token')
    return token ? children : <Navigate to="/login" />
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                <Route path="/profile" element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                } />
                <Route path="/projects" element={
                    <PrivateRoute>
                        <Projects />
                    </PrivateRoute>
                } />
                <Route path="/projects/:id" element={
                    <PrivateRoute>
                        <ProjectDetail />
                    </PrivateRoute>
                } />
                <Route path="/orders" element={
                    <PrivateRoute>
                        <Orders />
                    </PrivateRoute>
                } />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    )
}