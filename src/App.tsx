// src/App.tsx
import React, { useState, useEffect } from "react";
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
  const isFocusMode = location.pathname === "/focus";

  // Initialize isOpen based on screen size
  const [isOpen, setIsOpen] = useState(() => window.innerWidth >= 768);
  const [isInspecting, setIsInspecting] = useState(false);
  const setActivePanel = () => {}; // Placeholder function

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true); // Always open on desktop
      } else {
        setIsOpen(false); // Closed by default on mobile
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keyboard shortcut for inspection mode (Ctrl+Shift+I)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        setIsInspecting((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen">
      {user && (
        <Sidebar
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          focusMode={isFocusMode}
          // isInspecting={isInspecting}
        />
      )}

      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          user && window.innerWidth >= 768 ? "ml-64" : "ml-0"
        }`}
      >
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
            path="/todo"
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
            path="/checkin"
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
