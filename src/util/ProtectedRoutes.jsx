import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoutes() {
    return (
        localStorage.getItem("user") ? <Outlet /> : <Navigate to="/login" />
    )
}

export default ProtectedRoutes;