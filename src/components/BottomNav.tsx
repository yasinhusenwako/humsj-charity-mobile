import { Link, useLocation } from "react-router-dom";
import { Home, Info, Heart, Image, Phone, User, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";

const BottomNav = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const isAdmin = currentUser?.email === "admin@humsj.edu.et";
  const dashboardLink = isAdmin ? "/admin" : "/dashboard";

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About", icon: Info },
    { path: "/causes", label: "Causes", icon: Heart },
    { path: "/gallery", label: "Gallery", icon: Image },
    { path: "/contact", label: "Contact", icon: Phone },
  ];

  const moreItems = [{ path: "/contact", label: "Contact", icon: Phone }];

  if (currentUser) {
    moreItems.push({
      path: dashboardLink,
      label: isAdmin ? "Admin" : "Dashboard",
      icon: User,
    });
  } else {
    moreItems.push({ path: "/auth", label: "Sign In", icon: User });
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50 shadow-soft">
      <div className="flex items-center justify-around py-2">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* More menu button for additional items */}
        <div className="relative" ref={moreMenuRef}>
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            title="More navigation options"
            aria-label="More navigation options"
            aria-expanded={showMoreMenu}
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
              showMoreMenu
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            }`}
          >
            <Menu className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">More</span>
          </button>

          {/* More menu dropdown */}
          {showMoreMenu && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-background border border-border rounded-lg shadow-lg p-2 min-w-[150px]">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground">
                  More
                </span>
                <button
                  onClick={() => setShowMoreMenu(false)}
                  title="Close menu"
                  aria-label="Close menu"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMoreMenu(false)}
                    className={`flex items-center space-x-2 p-2 rounded-md transition-all duration-200 ${
                      isActive(item.path)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
