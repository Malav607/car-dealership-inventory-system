import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, Car } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2 rounded-xl">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              AutoDeal.
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Logged in as</p>
              <p className="text-sm font-medium text-slate-200">{user?.email}</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full">
              {user?.role}
            </span>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 border border-slate-800 rounded-xl hover:bg-slate-900 hover:border-slate-700 transition-all duration-300 text-sm font-medium text-slate-300"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10">
          <Car className="h-16 w-16 text-slate-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to your Dashboard</h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm">
            We will implement the car inventory grid, search filters, and management actions here in the next step.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
