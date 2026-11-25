import { useAuth } from "@clerk/react";
import { Navigate, Outlet } from "react-router";
import PageLoader from "../components/core/PageLoader";

const PublicRoute = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <PageLoader />;
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
