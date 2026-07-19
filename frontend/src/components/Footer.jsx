import React from "react";
import { Car, MapPin, Phone, Mail, ShieldCheck, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-obsidian-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-accent to-blue-600 flex items-center justify-center text-obsidian-950 shadow-glow">
                <Car className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                APEX<span className="text-cyan-accent">MOTORS</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Elevating automotive luxury. Discover hypercars, luxury sedans, and high-performance electric vehicles with nationwide home delivery.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Inventory System Active</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-cyan-accent transition-colors">Browse Vehicles</Link></li>
              <li><Link to="/my-purchases" className="hover:text-cyan-accent transition-colors">My Purchases & Orders</Link></li>
              <li><a href="#featured" className="hover:text-cyan-accent transition-colors">Featured Fleet</a></li>
              <li><a href="#specifications" className="hover:text-cyan-accent transition-colors">Dealership Locations</a></li>
            </ul>
          </div>

          {/* Luxury Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Categories</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="hover:text-cyan-accent cursor-pointer transition-colors">Coupes & Supercars</li>
              <li className="hover:text-cyan-accent cursor-pointer transition-colors">Electric Performance</li>
              <li className="hover:text-cyan-accent cursor-pointer transition-colors">Executive Luxury Sedans</li>
              <li className="hover:text-cyan-accent cursor-pointer transition-colors">Premium SUVs & Hybrids</li>
            </ul>
          </div>

          {/* Showroom Contacts */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Dealership Location</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-accent shrink-0 mt-0.5" />
                <span>150 Feet Ring Road, Near Kalavad Road, Rajkot, Gujarat 360005, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-accent shrink-0" />
                <span>+91 (281) 555-APEX</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-accent shrink-0" />
                <span>contact@apexmotors.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Apex Motors Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Warranty Coverage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
