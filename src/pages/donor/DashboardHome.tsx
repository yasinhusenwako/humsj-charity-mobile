import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Calendar, TrendingUp, Heart } from "lucide-react";
import { getUserSubscription } from "@/services/subscriptionService";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const DashboardHome = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    monthlyAmount: 0,
    subscriptionStatus: "inactive",
    totalDonations: 0,
    nextEmailDate: "N/A",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    // Fetch subscription (one-time)
    const fetchSubscription = async () => {
      try {
        const subscription = await getUserSubscription(currentUser.uid);

        let nextDate = "N/A";
        if (subscription?.active && subscription.startDate) {
          const start = subscription.startDate.toDate();
          const next = new Date(start);
          next.setMonth(next.getMonth() + 1);
          nextDate = next.toLocaleDateString();
        }

        setStats(prev => ({
          ...prev,
          monthlyAmount: subscription?.amount || 0,
          subscriptionStatus: subscription?.active ? "active" : "inactive",
          nextEmailDate: nextDate,
        }));
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
    };

    // Set up real-time listener for donations
    const donationsQuery = query(
      collection(db, "donations"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(donationsQuery, (snapshot) => {
      const donations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setStats(prev => ({
        ...prev,
        totalDonations: donations.length,
      }));

      setLoading(false);
    }, (error) => {
      console.error("Error fetching donations:", error);
      setLoading(false);
    });

    fetchSubscription();

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return (
      <DashboardLayout type="donor">
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="donor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {currentUser?.displayName}!</h1>
          <p className="text-muted-foreground">Here's your donation overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Donation</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthlyAmount} ETB</div>
              <p className="text-xs text-muted-foreground">Per month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{stats.subscriptionStatus}</div>
              <p className="text-xs text-muted-foreground">
                {stats.subscriptionStatus === "active" ? "Currently active" : "Not active"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDonations}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Next Email</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.nextEmailDate}</div>
              <p className="text-xs text-muted-foreground">Monthly update</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-semibold">Monthly donation processed</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.monthlyAmount} ETB deducted
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">This month</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-semibold">Subscription renewed</p>
                  <p className="text-sm text-muted-foreground">Auto-renewal successful</p>
                </div>
                <span className="text-xs text-muted-foreground">30 days ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-semibold">Monthly email received</p>
                  <p className="text-sm text-muted-foreground">Impact report sent</p>
                </div>
                <span className="text-xs text-muted-foreground">30 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
