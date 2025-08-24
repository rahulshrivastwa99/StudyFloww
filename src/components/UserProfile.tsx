import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User, Mail, Calendar, LogOut, Shield } from "lucide-react";

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800  p-10 shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Your Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </p>
            <p className="text-gray-900 dark:text-white">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Member Since
            </p>
            <p className="text-gray-900 dark:text-white">
              {formatDate(user.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Account Status
            </p>
            <p className="text-gray-900 dark:text-white">
              {user.email_confirmed_at ? "Verified" : "Pending Verification"}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {loading ? "Signing Out..." : "Sign Out"}
        </button>
      </div>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          🔒 Your Data is Secure
        </h3>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          All your study data is encrypted and stored securely. Only you can
          access your personal information and study progress.
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
