import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Mail, UserPlus, CreditCard } from "lucide-react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalDonors: 0,
    activeSubs: 0,
    monthlyRevenue: 0,
    donationsThisMonth: 0,
    emailsSent: 0,
    newDonorsThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get all users
      const usersSnapshot = await getDocs(collection(db, "users"));
      const users = usersSnapshot.docs.map(doc => doc.data());
      const donors = users.filter(u => u.role === "donor");
      
      // Get active subscriptions
      const subsSnapshot = await getDocs(
        query(collection(db, "subscriptions"), where("active", "==", true))
      );
      const activeSubs = subsSnapshot.docs.map(doc => doc.data());
      const monthlyRevenue = activeSubs.reduce((sum, sub: any) => sum + (sub.amount || 0), 0);

      // Get donations this month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const donationsSnapshot = await getDocs(
        query(
          collection(db, "donations"),
          where("createdAt", ">=", Timestamp.fromDate(firstDayOfMonth))
        )
      );

      // Get new donors this month
      const newDonors = donors.filter(d => {
        const createdAt = d.createdAt?.toDate();
        return createdAt && createdAt >= firstDayOfMonth;
      });

      // Get emails sent this month
      const emailLogsSnapshot = await getDocs(
        query(
          collection(db, "emailLogs"),
          where("sentAt", ">=", Timestamp.fromDate(firstDayOfMonth))
        )
      );

      setStats({
        totalDonors: donors.length,
        activeSubs: activeSubs.length,
        monthlyRevenue,
        donationsThisMonth: donationsSnapshot.size,
        emailsSent: emailLogsSnapshot.size,
        newDonorsThisMonth: newDonors.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Overview</h1>
          <p className="text-muted-foreground">Platform analytics and insights</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDonors}</div>
              <p className="text-xs text-green-600">
                +{stats.newDonorsThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSubs}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthlyRevenue.toLocaleString()} ETB</div>
              <p className="text-xs text-muted-foreground">From subscriptions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Donations This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.donationsThisMonth}</div>
              <p className="text-xs text-muted-foreground">Processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.emailsSent}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Donors</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newDonorsThisMonth}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-semibold">New donor registered</p>
                    <p className="text-sm text-muted-foreground">User joined platform</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2h ago</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-semibold">Donation processed</p>
                    <p className="text-sm text-muted-foreground">500 ETB received</p>
                  </div>
                  <span className="text-xs text-muted-foreground">5h ago</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-semibold">Monthly emails sent</p>
                    <p className="text-sm text-muted-foreground">Sent to {stats.activeSubs} donors</p>
                  </div>
                  <span className="text-xs text-muted-foreground">1d ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Average Donation</span>
                  <span className="font-semibold">
                    {stats.activeSubs > 0 
                      ? Math.round(stats.monthlyRevenue / stats.activeSubs) 
                      : 0} ETB
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Subscription Rate</span>
                  <span className="font-semibold">
                    {stats.totalDonors > 0 
                      ? Math.round((stats.activeSubs / stats.totalDonors) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Growth Rate</span>
                  <span className="font-semibold text-green-600">
                    +{stats.totalDonors > 0 
                      ? Math.round((stats.newDonorsThisMonth / stats.totalDonors) * 100) 
                      : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
};

export default AdminOverview;
