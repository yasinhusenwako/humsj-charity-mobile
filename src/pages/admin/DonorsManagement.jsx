import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash2, UserPlus } from "lucide-react";
import { collection, getDocs, query, where, doc, setDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { updateUserProfile, deleteUser } from "@/services/userService";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const DonorsManagement = () => {
  const { toast } = useToast();
  const [donors, setDonors] = useState<any[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newDonor, setNewDonor] = useState({
    displayName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchDonors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [donors, searchTerm]);

  const fetchDonors = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "donor"));
      const querySnapshot = await getDocs(q);
      const donorsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDonors(donorsData);
      setFilteredDonors(donorsData);
    } catch (error) {
      console.error("Error fetching donors:", error);
      toast({
        title: "Error",
        description: "Failed to load donors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!searchTerm) {
      setFilteredDonors(donors);
      return;
    }

    const filtered = donors.filter(d =>
      d.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDonors(filtered);
  };

  const handleEdit = (donor: any) => {
    setSelectedDonor(donor);
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedDonor) return;

    try {
      await updateUserProfile(selectedDonor.id, {
        displayName: selectedDonor.displayName,
      });
      toast({
        title: "Success!",
        description: "Donor updated successfully",
      });
      setEditDialogOpen(false);
      fetchDonors();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update donor",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (donorId: string) => {
    if (!confirm("Are you sure you want to delete this donor?")) return;

    try {
      await deleteUser(donorId);
      toast({
        title: "Success!",
        description: "Donor deleted successfully",
      });
      fetchDonors();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete donor",
        variant: "destructive",
      });
    }
  };

  const handleCreateDonor = async () => {
    if (!newDonor.displayName || !newDonor.email || !newDonor.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (newDonor.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newDonor.email,
        newDonor.password
      );

      // Create user profile in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        displayName: newDonor.displayName,
        email: newDonor.email,
        phone: newDonor.phone || "",
        role: "donor",
        status: "active",
        createdAt: Timestamp.now(),
      });

      toast({
        title: "Success!",
        description: "Donor account created successfully",
      });

      setCreateDialogOpen(false);
      setNewDonor({ displayName: "", email: "", password: "", phone: "" });
      fetchDonors();
    } catch (error: any) {
      console.error("Error creating donor:", error);
      let errorMessage = "Failed to create donor account";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Donors Management</h1>
            <p className="text-muted-foreground">Manage all donor accounts</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Donor
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{donors.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Donors</CardTitle>
              <UserPlus className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {donors.filter(d => d.status === "active").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <UserPlus className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {donors.filter(d => {
                  const createdDate = d.createdAt?.toDate();
                  if (!createdDate) return false;
                  const now = new Date();
                  return createdDate.getMonth() === now.getMonth() && 
                         createdDate.getFullYear() === now.getFullYear();
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search donors by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Donors Table */}
        <Card>
          <CardHeader>
            <CardTitle>{filteredDonors.length} Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Joined</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonors.map((donor) => (
                    <tr key={donor.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-semibold">{donor.displayName}</td>
                      <td className="py-3 px-4">{donor.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          donor.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {donor.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {donor.createdAt?.toDate().toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(donor)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(donor.id)}
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

        {/* Create Donor Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Donor</DialogTitle>
              <DialogDescription>
                Create a new donor account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newName">Full Name *</Label>
                <Input
                  id="newName"
                  placeholder="Enter full name"
                  value={newDonor.displayName}
                  onChange={(e) => setNewDonor({
                    ...newDonor,
                    displayName: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="newEmail">Email *</Label>
                <Input
                  id="newEmail"
                  type="email"
                  placeholder="donor@example.com"
                  value={newDonor.email}
                  onChange={(e) => setNewDonor({
                    ...newDonor,
                    email: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="newPassword">Password *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newDonor.password}
                  onChange={(e) => setNewDonor({
                    ...newDonor,
                    password: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="newPhone">Phone Number</Label>
                <Input
                  id="newPhone"
                  type="tel"
                  placeholder="+251 912 345 678"
                  value={newDonor.phone}
                  onChange={(e) => setNewDonor({
                    ...newDonor,
                    phone: e.target.value
                  })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setCreateDialogOpen(false);
                  setNewDonor({ displayName: "", email: "", password: "", phone: "" });
                }}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateDonor} disabled={creating}>
                {creating ? "Creating..." : "Create Donor"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Donor</DialogTitle>
              <DialogDescription>
                Update donor information
              </DialogDescription>
            </DialogHeader>
            {selectedDonor && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={selectedDonor.displayName}
                    onChange={(e) => setSelectedDonor({
                      ...selectedDonor,
                      displayName: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={selectedDonor.email}
                    disabled
                  />
                </div>
              </div>
            )}
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

export default DonorsManagement;
