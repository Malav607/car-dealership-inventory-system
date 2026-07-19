import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Car, ShoppingBag, ShieldCheck, LogOut, User as UserIcon, Menu, X, Sparkles, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Marketplace", path: "/", icon: Car },
    { name: "My Purchases", path: "/my-purchases", icon: ShoppingBag },
    { name: "Rajkot Concierge", path: "/contact", icon: MessageSquare },
  ];

  if (user?.role === "Admin") {
    navLinks.push({ name: "Admin Control", path: "/admin", icon: ShieldCheck });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-obsidian-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-accent to-blue-600 flex items-center justify-center text-obsidian-950 shadow-glow group-hover:scale-105 transition-transform duration-300">
            <Car className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                APEX<span className="text-cyan-accent">MOTORS</span>
              </span>
              <Sparkles className="w-4 h-4 text-cyan-accent animate-pulse" />
            </div>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-400">
              Luxury Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-300 ${
                  active
                    ? "text-cyan-accent bg-cyan-accent/10 border border-cyan-accent/30 shadow-glow"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-cyan-accent" : "text-slate-400"}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative group">
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800 cursor-pointer py-1">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-accent/20 to-blue-600/20 border border-cyan-accent/40 flex items-center justify-center text-cyan-accent shadow-glow">
                <UserIcon className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-200 line-clamp-1 max-w-[140px]">
                  {user?.email}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    user?.role === "Admin" ? "text-purple-400" : "text-cyan-accent"
                  }`}
                >
                  {user?.role === "Admin" ? "Executive Admin" : "Rajkot Client"}
                </span>
              </div>
            </div>

            {/* Hover Profile Dropdown */}
            <div className="absolute right-0 top-full pt-2 w-56 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50">
              <div className="glass-panel p-3 rounded-2xl border border-slate-800 space-y-2 shadow-2xl bg-obsidian-950/95 backdrop-blur-2xl">
                <div className="p-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white">Logged in as</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>
                <Link to="/my-purchases" className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-cyan-accent flex items-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  My Vehicle Purchases
                </Link>
                <Link to="/contact" className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-cyan-accent flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Rajkot Showroom Concierge
                </Link>
                {user?.role === "Admin" && (
                  <Link to="/admin" className="w-full text-left px-3 py-2 rounded-xl text-xs text-purple-400 hover:bg-purple-900/20 flex items-center gap-2 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Control Center
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-semibold border-t border-slate-800/80 pt-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:bg-slate-800/80 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-accent" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-800 bg-obsidian-900/95 backdrop-blur-2xl px-4 py-4 space-y-3"
          >
            <div className="flex items-center gap-3 px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800">
              <UserIcon className="w-5 h-5 text-cyan-accent" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-200">{user?.email}</span>
                <span className="text-[10px] font-bold text-cyan-accent uppercase tracking-wider">
                  {user?.role} Account
                </span>
              </div>
            </div>

            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-3 ${
                    isActive(link.path)
                      ? "text-cyan-accent bg-cyan-accent/10 border border-cyan-accent/20"
                      : "text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-5 h-5 text-cyan-accent" />
                  {link.name}
                </Link>
              );
            })}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full mt-2 px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-3 text-rose-400 bg-rose-500/10 border border-rose-500/20"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
