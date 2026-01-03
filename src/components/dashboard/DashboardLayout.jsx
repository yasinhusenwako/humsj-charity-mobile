import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  DollarSign,
  Image,
  MessageSquare,
  Mail,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  History,
  Heart,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  type: "admin" | "donor";
}

const DashboardLayout = ({ children, type }: DashboardLayoutProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin#overview" },
    { icon: Users, label: "Donors", path: "/admin#donors" },
    { icon: CreditCard, label: "Subscriptions", path: "/admin#subscriptions" },
    { icon: DollarSign, label: "Donations", path: "/admin#donations" },
    { icon: Image, label: "Gallery", path: "/admin#gallery" },
    { icon: BookOpen, label: "Quotes", path: "/admin#quotes" },
    { icon: MessageSquare, label: "Messages", path: "/admin#messages" },
    { icon: Mail, label: "Email Logs", path: "/admin#emails" },
  ];

  const donorMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    {
      icon: CreditCard,
      label: "My Subscription",
      path: "/dashboard/subscription",
    },
    { icon: History, label: "Donation History", path: "/dashboard/history" },
    { icon: DollarSign, label: "Donation Methods", path: "/dashboard/methods" },
    { icon: Heart, label: "Inspiration", path: "/dashboard/inspiration" },
    { icon: User, label: "Profile", path: "/dashboard/profile" },
  ];

  const menuItems = type === "admin" ? adminMenuItems : donorMenuItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm pt-2">
        <div className="flex items-center justify-between p-4 h-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">H</span>
            </div>
            <span className="font-bold text-lg">
              {type === "admin" ? "Admin" : "Donor"} Dashboard
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r shadow-lg transition-transform duration-300 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b pt-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">
                H
              </span>
            </div>
            <div>
              <h1 className="font-bold text-lg">HUMSJ Charity</h1>
              <p className="text-xs text-muted-foreground">
                {type === "admin" ? "Admin Panel" : "Donor Portal"}
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t bg-gray-50 mt-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {currentUser?.displayName || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUser?.email}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">{children}</div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
