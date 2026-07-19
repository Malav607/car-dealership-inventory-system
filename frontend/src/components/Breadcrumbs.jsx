import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumbs = ({ customCrumbs = [] }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 py-2">
      <Link to="/" className="hover:text-cyan-accent flex items-center gap-1 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {customCrumbs.length > 0 ? (
        customCrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            {crumb.path ? (
              <Link to={crumb.path} className="hover:text-cyan-accent transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="font-bold text-slate-200 truncate">{crumb.label}</span>
            )}
          </React.Fragment>
        ))
      ) : (
        pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const formattedName = name.replace("-", " ");

          return (
            <React.Fragment key={name}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              {isLast ? (
                <span className="font-bold text-slate-200 capitalize">{formattedName}</span>
              ) : (
                <Link to={routeTo} className="hover:text-cyan-accent capitalize transition-colors">
                  {formattedName}
                </Link>
              )}
            </React.Fragment>
          );
        })
      )}
    </nav>
  );
};

export default Breadcrumbs;
