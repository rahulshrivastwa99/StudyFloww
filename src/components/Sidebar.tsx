import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  TrendingUp,
  CheckSquare,
  FileText,
  MapPin,
  List,
  Play,
  Settings,
  User,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  activePanel: string;
  setActivePanel: (panel: any) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  focusMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  activePanel,
  setActivePanel,
  isOpen,
  setIsOpen,
  focusMode,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "streak", label: "Streak Tracker", icon: TrendingUp },
    { id: "todo", label: "Todo List", icon: CheckSquare },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "roadmap", label: "Roadmap", icon: MapPin },
    { id: "checkin", label: "Check-ins", icon: List },
    { id: "youtube", label: "YouTube", icon: Play },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (focusMode) return null;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              StudyFlow
            </h1>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={`/${item.id === "dashboard" ? "" : item.id}`}
                  onClick={() => {
                    if (window.innerWidth < 768) setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      activePanel === item.id
                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
            <h3 className="font-semibold mb-1">Stay Focused!</h3>
            <p className="text-sm opacity-90">
              Your consistency builds success
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
