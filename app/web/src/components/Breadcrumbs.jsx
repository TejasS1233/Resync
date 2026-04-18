import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show breadcrumbs on landing page
  if (location.pathname === "/") {
    return null;
  }

  // Map route names to display names
  const routeNames = {
    dashboard: "Dashboard",
    profile: "Profile",
    login: "Login",
    signup: "Sign Up",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
  };

  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Link
        to="/"
        className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
      >
        <Home size={16} />
        <span>Home</span>
      </Link>

      {pathnames.length > 0 && (
        <>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const displayName = routeNames[name] || name.charAt(0).toUpperCase() + name.slice(1);

            return (
              <div key={name} className="flex items-center gap-2">
                <ChevronRight size={16} className="text-gray-600" />
                {isLast ? (
                  <span className="text-white font-medium">{displayName}</span>
                ) : (
                  <Link to={routeTo} className="text-gray-400 hover:text-white transition-colors">
                    {displayName}
                  </Link>
                )}
              </div>
            );
          })}
        </>
      )}
    </nav>
  );
};

export default Breadcrumbs;
