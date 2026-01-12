import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { useDataStore } from "./stores/dataStore";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ConferenceList from "./pages/conferences/ConferenceList";
import LocationList from "./pages/locations/LocationList";
import TechnicianList from "./pages/technicians/TechnicianList";
import MainLayout from "./components/Layout/MainLayout";
import { UserTabs } from "./pages/users/UserTabs";

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchAll = useDataStore((state) => state.fetchAll);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAll();
    }
  }, [isAuthenticated, fetchAll]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="conferences" element={<ConferenceList />} />
          <Route path="locations" element={<LocationList />} />
          <Route path="technicians" element={<TechnicianList />} />
          <Route path="users" element={<UserTabs />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
