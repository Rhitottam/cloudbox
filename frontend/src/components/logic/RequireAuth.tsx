import { authClient } from "@/lib"
import { Navigate, Outlet } from "react-router-dom";

export const RequireAuth = () => {
    const { data } = authClient.useSession();
    
    if (!data?.user) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;

}