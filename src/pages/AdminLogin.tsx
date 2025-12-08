import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginData.email, loginData.password);
      
      // Verify admin role from Firestore
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          if (userData.role === "admin") {
            toast({
              title: "Welcome Admin!",
              description: "Successfully logged in to admin dashboard.",
            });
            navigate("/admin");
          } else {
            // Not an admin - logout and show error
            await auth.signOut();
            toast({
              title: "Access Denied",
              description: "You don't have admin privileges. Please use the regular login.",
              variant: "destructive",
            });
          }
        } else {
          // No Firestore profile - check email
          if (loginData.email === "admin@humsj.edu.et") {
            toast({
              title: "Welcome Admin!",
              description: "Successfully logged in to admin dashboard.",
            });
            navigate("/admin");
          } else {
            await auth.signOut();
            toast({
              title: "Access Denied",
              description: "Admin access only. Please use the regular login.",
              variant: "destructive",
            });
          }
        }
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Portal</h1>
          <p className="text-gray-600">HUMSJ Charity Management System</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-2">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <p className="text-sm text-center text-muted-foreground">
              Enter your admin credentials to access the dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  placeholder="admin@humsj.edu.et"
                  className="mt-2"
                  autoComplete="email"
                />
              </div>

              <div>
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="••••••••"
                    className="pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Sign In as Admin
                  </>
                )}
              </Button>
            </form>

            {/* Warning Notice */}
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-semibold mb-1">Admin Access Only</p>
                  <p className="text-xs">
                    This portal is restricted to authorized administrators. 
                    Unauthorized access attempts are logged and monitored.
                  </p>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="mt-6 space-y-2 text-center text-sm">
              <Link 
                to="/auth" 
                className="block text-primary hover:underline"
              >
                ← Regular Donor Login
              </Link>
              <Link 
                to="/" 
                className="block text-muted-foreground hover:text-foreground"
              >
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2025 HUMSJ Charity. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
