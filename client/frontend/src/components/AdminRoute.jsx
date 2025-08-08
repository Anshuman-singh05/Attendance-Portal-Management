import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore.js";

const AdminRoute=()=>{
    const {userInfo}= useAuthStore();

    return userInfo && userInfo.role==='admin' ?(
        <Outlet/>
    ) : (
        <Navigate to='/login' replace/>
    );
};
export default AdminRoute;