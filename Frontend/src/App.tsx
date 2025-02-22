import { MantineProvider, Title } from "@mantine/core";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { Notifications } from "@mantine/notifications";
import ClientLayout from "./Layouts/ClientLayout";
import AdminLayout from "./Layouts/AdminLayout";
import { theme } from "./theme";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { useAuth } from "./Contexts/AuthContext";
import ManageUsers from "./components/ManageUsers/ManageUsers";
import Profile from "./components/Profile/Profile";
import Availability from "./components/Availability/Availability";
import CreateAppointment from "./components/CreateAppointment/CreateApointment";

function App() {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <Router>
        <Routes>
          {/* General Routes */}
          <Route path="/" element={<Title>Home</Title>} />
          <Route path="/about" element={<Title>About Us</Title>} />

          {/* User Management */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                userRole === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/client" replace />
                )
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                userRole === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/client" replace />
                )
              ) : (
                <Register />
              )
            }
          />
          {/* Client Routes */}
          <Route
            path="/client"
            element={
              <ProtectedRoute requiredRole="client">
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Title>Client Dashboard</Title>} />
            <Route path="appointments" element={<Title>Appointments</Title>} />
            <Route path="appointments/new" element={<CreateAppointment />} />
            <Route path="profile" element={<Title>Profile</Title>} />
          </Route>
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Title>Admin Dashboard</Title>} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="appointments" element={<Title>Appointments</Title>} />
            <Route path="appointments/new" element={<Availability />} />
            <Route
              path="notifications"
              element={<Title>Notifications</Title>}
            />
            <Route path="reports" element={<Title>Reports</Title>} />
            <Route path="settings" element={<Title>Settings</Title>} />
            <Route path="profile" element={<Profile />} />
          </Route>
          {/* Fallback Route */}
          <Route path="*" element={<Title>404 - Not Found</Title>} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}
export default App;
