// src/App.tsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { StudyDataProvider } from "./contexts/StudyDataContext";

// Components
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import NotesPanel from "./components/NotesPanel";
import TodoList from "./components/TodoList";
import StreakTracker from "./components/StreakTracker";
import FocusMode from "./components/FocusMode";
import Roadmap from "./components/Roadmap";
import Settings from "./components/Settings";
import UserProfile from "./components/UserProfile";
import YouTubeManager from "./components/YouTubeManager";
import CheckInList from "./components/CheckInList";
import Sidebar from "./components/Sidebar";

// ----------------------
// Wrappers
// ----------------------
const FocusModeWrapper: React.FC = () => {
  const navigate = useNavigate();
  return <FocusMode onExit={() => navigate("/")} />;
};

const SettingsWrapper: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return <Settings theme={theme} setTheme={setTheme} />;
};

const AuthFormWrapper: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  return (
    <AuthForm
      mode={mode}
      onToggleMode={() => setMode(mode === "login" ? "signup" : "login")}
    />
  );
};

// ----------------------
// Protected Route
// ----------------------
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

// ----------------------
// App Content
// ----------------------
const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const activePanel = location.pathname.split("/")[1] || "dashboard";

  return (
    <div className="flex h-screen">
      {user && (
        <Sidebar
          activePanel={activePanel}
          setActivePanel={() => {}}
          isOpen={true}
          setIsOpen={() => {}}
          focusMode={false}
        />
      )}

      <main className="flex-1 overflow-y-auto p-4">
        <Routes>
          <Route
            path="/auth"
            element={user ? <Navigate to="/" /> : <AuthFormWrapper />}
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <PrivateRoute>
                <NotesPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/todos"
            element={
              <PrivateRoute>
                <TodoList />
              </PrivateRoute>
            }
          />
          <Route
            path="/streak"
            element={
              <PrivateRoute>
                <StreakTracker />
              </PrivateRoute>
            }
          />
          <Route
            path="/focus"
            element={
              <PrivateRoute>
                <FocusModeWrapper />
              </PrivateRoute>
            }
          />
          <Route
            path="/roadmap"
            element={
              <PrivateRoute>
                <Roadmap />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsWrapper />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/youtube"
            element={
              <PrivateRoute>
                <YouTubeManager />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkins"
            element={
              <PrivateRoute>
                <CheckInList />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

// ----------------------
// Main App Wrapper
// ----------------------
const App = () => {
  return (
    <AuthProvider>
      <StudyDataProvider>
        <Router>
          <AppContent />
        </Router>
      </StudyDataProvider>
    </AuthProvider>
  );
};

export default App;
