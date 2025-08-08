import { Navigate, Outlet, replace } from "react-router-dom";
import useAuthStore from "../store/authStore";

const PrivateRoute=()=>{
    const {userInfo}= useAuthStore();
     return userInfo ? <Outlet/> :<Navigate to='/login' replace />
};

export default PrivateRoute;