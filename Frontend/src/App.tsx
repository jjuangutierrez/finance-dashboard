import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Home } from "./pages/home";
import { Dashboard } from "./pages/dashboard";
import { Profile } from "./pages/profile";

import authService from "./features/auth/services/auth.service";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuth = authService.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;