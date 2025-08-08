import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import UserListPage from './pages/UserListPage.jsx';
import './index.css';
import LeaveListPage from './pages/LeaveListPage.jsx';
import ApplyLeavePage from './pages/ApplyLeavePage.jsx';
import MyLeavesPage from './pages/MyLeavesPage.jsx';
import FaceLoginPage from './pages/FaceLoginPage.jsx';


const router= createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/facelogin' element={<FaceLoginPage/>}/>
      <Route path='' element={<PrivateRoute/>}>
        <Route index={true} path='/' element={<HomePage/>}/>
        <Route path='/profile' element={<ProfilePage/>}></Route>
        <Route path='/history' element={<HistoryPage/>}></Route>
        <Route path='/apply-leave' element={<ApplyLeavePage/>}/>
        <Route path='/myleaves' element={<MyLeavesPage/>}/>
      </Route>
      <Route path='' element={<AdminRoute/>}>
        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
        <Route path='/admin/userlist' element={<UserListPage/>}/>
        <Route path='/admin/leavelist' element={<LeaveListPage/>}/>
      </Route>
    </Route>
  )
);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
