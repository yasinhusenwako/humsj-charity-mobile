import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useDonations } from "@/hooks/useDonations";
import { Heart, DollarSign, Calendar, TrendingUp, Download } from "lucide-react";

const DonorDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { donations, loading } = useDonations(currentUser?.uid || null);
  const [stats, setStats] = useState({
    totalDonated: 0,
    monthlyDonations: 0,
    totalDonations: 0,
    activeCauses: 0,
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (donations.length > 0) {
      const total = donations.reduce((sum, d) => sum + d.amount, 0);
      const monthly = donations.filter((d) => d.isMonthly).length;
      const uniqueCauses = new Set(donations.map((d) => d.causeId).filter(Boolean));
      
      setStats({
        totalDonated: total,
        monthlyDonations: monthly,
        totalDonations: donations.length,
        activeCauses: uniqueCauses.size,
      });
    }
  }, [donations]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome, {currentUser?.displayName || "Donor"}</h1>
              <p className="text-lg opacity-90">Thank you for your generous support</p>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-medium">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Donated</p>
                    <h3 className="text-3xl font-bold text-primary">{stats.totalDonated} ETB</h3>
                  </div>
                  <DollarSign className="w-12 h-12 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Donations</p>
                    <h3 className="text-3xl font-bold text-primary">{stats.totalDonations}</h3>
                  </div>
                  <Heart className="w-12 h-12 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Monthly Donations</p>
                    <h3 className="text-3xl font-bold text-primary">{stats.monthlyDonations}</h3>
                  </div>
                  <Calendar className="w-12 h-12 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Causes Supported</p>
                    <h3 className="text-3xl font-bold text-primary">{stats.activeCauses}</h3>
                  </div>
                  <TrendingUp className="w-12 h-12 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <p className="text-sm text-muted-foreground">Get started with these common tasks</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-2"
                  onClick={() => navigate("/causes")}
                >
                  <Heart className="w-6 h-6" />
                  <span>Make a Donation</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-2"
                  onClick={() => navigate("/donate")}
                >
                  <Calendar className="w-6 h-6" />
                  <span>Manage Subscription</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-2"
                  onClick={() => navigate("/causes")}
                >
                  <TrendingUp className="w-6 h-6" />
                  <span>View All Causes</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <p className="text-sm text-muted-foreground">Account information</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold">{currentUser?.displayName || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{currentUser?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-semibold">Donor</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-semibold">
                    {currentUser?.metadata?.creationTime 
                      ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Impact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Total Impact</CardTitle>
                <p className="text-sm text-muted-foreground">Your contribution to the community</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-6">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {stats.activeCauses}
                  </div>
                  <p className="text-muted-foreground">Causes Supported</p>
                </div>
                <div className="text-center py-6 border-t">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {stats.totalDonated}
                  </div>
                  <p className="text-muted-foreground">ETB Donated</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <p className="text-sm text-muted-foreground">Your latest actions</p>
              </CardHeader>
              <CardContent>
                {donations.length > 0 ? (
                  <div className="space-y-3">
                    {donations.slice(0, 3).map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="font-semibold text-sm">{donation.causeName || "General"}</p>
                          <p className="text-xs text-muted-foreground">
                            {donation.createdAt?.toDate().toLocaleDateString()}
                          </p>
                        </div>
                        <span className="font-bold text-primary">{donation.amount} ETB</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground text-sm">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Donation History */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Recent Donations</CardTitle>
                  <p className="text-sm text-muted-foreground">Your latest contributions</p>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 w-4 h-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {donations.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold text-muted-foreground">No donations yet.</p>
                  <p className="text-sm text-muted-foreground mb-6">Start by supporting a cause!</p>
                  <Button variant="hero" onClick={() => navigate("/causes")}>
                    Get Started
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Amount</th>
                        <th className="text-left py-3 px-4">Cause</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((donation) => (
                        <tr key={donation.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            {donation.createdAt?.toDate().toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 font-semibold">{donation.amount} ETB</td>
                          <td className="py-3 px-4">{donation.causeName || "General"}</td>
                          <td className="py-3 px-4">
                            {donation.isMonthly ? "Monthly" : "One-time"}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                donation.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : donation.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {donation.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DonorDashboard;