import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { currentUser } = useAuth();

  const isAdmin = currentUser?.email === "admin@humsj.edu.et";
  const dashboardLink = isAdmin ? "/admin" : "/dashboard";

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-soft pt-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">
                H
              </span>
            </div>
            <span className="font-bold text-xl text-primary">
              HUMSJ Charity
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="relative text-foreground hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-primary/5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="relative text-foreground hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-primary/5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              About
            </Link>
            <Link
              to="/causes"
              className="relative text-foreground hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-primary/5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Causes
            </Link>

            <Link
              to="/gallery"
              className="relative text-foreground hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-primary/5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Gallery
            </Link>
            <Link
              to="/contact"
              className="relative text-foreground hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-primary/5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="relative text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200 px-2 py-1 rounded-md hover:bg-orange-50 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-600 after:transition-all after:duration-300 hover:after:w-full"
              >
                Admin Panel
              </Link>
            )}
            {currentUser ? (
              <Link to={dashboardLink}>
                <Button variant="hero" size="sm">
                  <User className="mr-2 w-4 h-4" />
                  {isAdmin ? "Admin" : "Dashboard"}
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="hero" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
