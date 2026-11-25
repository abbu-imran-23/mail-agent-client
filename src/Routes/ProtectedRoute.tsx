import { useAuth } from "@clerk/react";
import { Navigate, Outlet } from "react-router";
import PageLoader from "../components/core/PageLoader";

const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <PageLoader />;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
