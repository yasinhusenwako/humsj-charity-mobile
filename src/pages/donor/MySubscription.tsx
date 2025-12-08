import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, DollarSign, Pause, Play, XCircle } from "lucide-react";
import {
  updateSubscription,
  pauseSubscription,
  activateSubscription,
  deleteSubscription,
} from "@/services/subscriptionService";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { collection, query, where, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const MySubscription = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newAmount, setNewAmount] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    // Set up real-time listener for subscription
    const subscriptionQuery = query(
      collection(db, "subscriptions"),
      where("userId", "==", currentUser.uid),
      limit(1)
    );

    const unsubscribe = onSnapshot(subscriptionQuery, (snapshot) => {
      if (!snapshot.empty) {
        const subData = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        } as any; // Type assertion to handle Firestore data
        setSubscription(subData);
        setNewAmount(subData.amount.toString());
      } else {
        setSubscription(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching subscription:", error);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [currentUser]);

  const handleUpdateAmount = async () => {
    if (!subscription || !newAmount) return;

    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount < 50) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount (minimum 50 ETB)",
        variant: "destructive",
      });
      return;
    }

    setUpdating(true);
    try {
      await updateSubscription(subscription.id, { amount });
      toast({
        title: "Success!",
        description: "Your monthly amount has been updated.",
      });
      // No need to fetch - real-time listener will update automatically
    } catch (error: any) {
      console.error("Error updating amount:", error);
      toast({
        title: "Error",
        description: `Failed to update amount: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePause = async () => {
    if (!subscription) return;

    try {
      await pauseSubscription(subscription.id);
      toast({
        title: "Subscription Paused",
        description: "Your subscription has been paused.",
      });
      // No need to fetch - real-time listener will update automatically
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to pause subscription.",
        variant: "destructive",
      });
    }
  };

  const handleActivate = async () => {
    if (!subscription) return;

    try {
      await activateSubscription(subscription.id);
      toast({
        title: "Subscription Activated",
        description: "Your subscription is now active.",
      });
      // No need to fetch - real-time listener will update automatically
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate subscription.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async () => {
    if (!subscription) return;

    try {
      await deleteSubscription(subscription.id);
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled.",
      });
      setSubscription(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription.",
        variant: "destructive",
      });
    }
  };

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
          <h1 className="text-3xl font-bold">My Subscription</h1>
          <p className="text-muted-foreground">Manage your monthly donation</p>
        </div>

        {subscription ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Subscription */}
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Monthly Amount</span>
                  </div>
                  <span className="font-bold text-lg">{subscription.amount} ETB</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Start Date</span>
                  </div>
                  <span className="font-semibold">
                    {subscription.startDate?.toDate().toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${subscription.active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                    }`}>
                    {subscription.active ? "Active" : "Paused"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-muted-foreground">Billing Cycle</span>
                  <span className="font-semibold capitalize">{subscription.billingCycle}</span>
                </div>
              </CardContent>
            </Card>

            {/* Update Amount */}
            <Card>
              <CardHeader>
                <CardTitle>Update Monthly Amount</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amount">New Monthly Amount (ETB)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="50"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Minimum: 50 ETB per month
                  </p>
                </div>

                <Button
                  onClick={handleUpdateAmount}
                  disabled={updating || !newAmount}
                  className="w-full"
                >
                  {updating ? "Updating..." : "Update Amount"}
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Subscription Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {subscription.active ? (
                    <Button
                      variant="outline"
                      onClick={handlePause}
                      className="h-24 flex flex-col gap-2"
                    >
                      <Pause className="w-6 h-6" />
                      <span>Pause Subscription</span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleActivate}
                      className="h-24 flex flex-col gap-2"
                    >
                      <Play className="w-6 h-6" />
                      <span>Reactivate Subscription</span>
                    </Button>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col gap-2 text-red-600 hover:text-red-700"
                      >
                        <XCircle className="w-6 h-6" />
                        <span>Cancel Subscription</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently cancel your subscription. You can always create a new one later.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No, keep it</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel} className="bg-red-600">
                          Yes, cancel
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Active Subscription</h3>
              <p className="text-muted-foreground mb-6">
                You don't have an active subscription yet. Start making a difference today!
              </p>
              <Button onClick={() => window.location.href = "/causes"}>
                Start Donating
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MySubscription;
