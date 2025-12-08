import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash2, Play, Pause } from "lucide-react";
import {
  getAllSubscriptions,
  updateSubscription,
  deleteSubscription,
  pauseSubscription,
  activateSubscription,
} from "@/services/subscriptionService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SubscriptionsManagement = () => {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [filteredSubs, setFilteredSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newAmount, setNewAmount] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [subscriptions, searchTerm]);

  const fetchSubscriptions = async () => {
    try {
      const data = await getAllSubscriptions();
      setSubscriptions(data);
      setFilteredSubs(data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!searchTerm) {
      setFilteredSubs(subscriptions);
      return;
    }

    const filtered = subscriptions.filter(s =>
      s.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.amount.toString().includes(searchTerm)
    );
    setFilteredSubs(filtered);
  };

  const handleEdit = (sub: any) => {
    setSelectedSub(sub);
    setNewAmount(sub.amount.toString());
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedSub || !newAmount) return;

    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount < 50) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount (minimum 50 ETB)",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateSubscription(selectedSub.id, { amount });
      toast({
        title: "Success!",
        description: "Subscription updated successfully",
      });
      setEditDialogOpen(false);
      fetchSubscriptions();
    } catch (error: any) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error",
        description: `Failed to update subscription: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (sub: any) => {
    try {
      if (sub.active) {
        await pauseSubscription(sub.id);
        toast({ title: "Subscription paused" });
      } else {
        await activateSubscription(sub.id);
        toast({ title: "Subscription activated" });
      }
      fetchSubscriptions();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: `Failed to update status: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (subId: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;

    try {
      await deleteSubscription(subId);
      toast({
        title: "Success!",
        description: "Subscription deleted successfully",
      });
      fetchSubscriptions();
    } catch (error: any) {
      console.error("Error deleting subscription:", error);
      toast({
        title: "Error",
        description: `Failed to delete subscription: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
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
        <h1 className="text-3xl font-bold">Subscriptions Management</h1>
        <p className="text-muted-foreground">Manage all monthly subscriptions</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Subscriptions</p>
            <p className="text-2xl font-bold">{subscriptions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {subscriptions.filter(s => s.active).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
            <p className="text-2xl font-bold">
              {subscriptions
                .filter(s => s.active)
                .reduce((sum, s) => sum + s.amount, 0)
                .toLocaleString()} ETB
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>{filteredSubs.length} Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">User ID</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Start Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubs.map((sub) => (
                  <tr key={sub.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-mono text-sm">{sub.userId.slice(0, 8)}...</td>
                    <td className="py-3 px-4 font-semibold">{sub.amount} ETB</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${sub.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                        }`}>
                        {sub.active ? "Active" : "Paused"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {sub.startDate?.toDate().toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(sub)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(sub)}
                        >
                          {sub.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(sub.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>Update subscription amount</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Monthly Amount (ETB)</Label>
              <Input
                id="amount"
                type="number"
                min="50"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionsManagement;
