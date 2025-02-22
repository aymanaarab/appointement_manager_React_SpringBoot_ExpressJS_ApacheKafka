import { Navigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { Loader, Center } from "@mantine/core";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "client";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  // Show a loading screen while checking authentication
  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === "admin" ? "/admin" : "/client"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
