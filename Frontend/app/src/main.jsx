import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import ErrorPage from "./pages/ErrorPage"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Upload from "./pages/Upload"
import ViewTeam from "./pages/ViewTeam"
import ViewUser from "./pages/ViewUser"
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import EditTeam from './pages/EditTeam';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/upload',
    element: <Upload />
  }, 
  {
    path: 'viewUser/:username',
    element: <ViewUser />
  },
  {
    path: 'viewTeam/:teamid',
    element: <ViewTeam />
  },
  {
    path: 'editTeam/:teamid',
    element: <EditTeam />
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
