import { useProfile } from "@/hooks/use-profile";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PageLoading } from "./page-loading";

export function ProtectedRoute() {
    const { isSuccess, isLoading } = useProfile();
    const location = useLocation();

    if (isLoading) return <PageLoading />;

    if (!isSuccess) {
        const redirect = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/auth/login?redirect=${redirect}`} replace />;
    }

    return <Outlet />;
}
