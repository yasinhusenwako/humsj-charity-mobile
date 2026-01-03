import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Download, Search, FileText, CheckCircle, XCircle, Eye } from "lucide-react";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Donation {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  amount: number;
  cause?: string;
  paymentMethod?: string;
  transactionRef?: string;
  receiptUrl?: string;
  notes?: string;
  type?: "one-time" | "monthly";
  status: "pending" | "verified" | "rejected";
  createdAt: any;
}

const DonationsManagement = () => {
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "verified" | "rejected">("all");
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    filterDonations();
  }, [searchTerm, filterStatus, donations]);

  const fetchDonations = async () => {
    try {
      const donationsSnapshot = await getDocs(
        query(collection(db, "donations"), orderBy("createdAt", "desc"))
      );
      
      const donationsData = donationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Donation[];

      setDonations(donationsData);
      setFilteredDonations(donationsData);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDonations = () => {
    let filtered = donations;

    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.transactionRef?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(d => d.status === filterStatus);
    }

    setFilteredDonations(filtered);
  };

  const updateDonationStatus = async (id: string, status: "verified" | "rejected") => {
    try {
      await updateDoc(doc(db, "donations", id), { status });
      toast({
        title: "Success",
        description: `Donation ${status} successfully`,
      });
      fetchDonations();
    } catch (error) {
      console.error("Error updating donation:", error);
      toast({
        title: "Error",
        description: "Failed to update donation status",
        variant: "destructive",
      });
    }
  };

  const viewReceipt = (donation: Donation) => {
    setSelectedDonation(donation);
    setReceiptDialogOpen(true);
  };

  const exportToCSV = () => {
    const headers = ["Date", "Donor", "Email", "Amount", "Cause", "Type", "Status"];
    const rows = filteredDonations.map(d => [
      format(d.createdAt?.toDate() || new Date(), "yyyy-MM-dd"),
      d.userName,
      d.userEmail,
      d.amount,
      d.cause,
      d.type,
      d.status
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donations-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const totalAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading donations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Donations Management</h1>
          <p className="text-muted-foreground">Track and manage all donations</p>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredDonations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {donations.filter(d => d.status === "pending").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAmount.toLocaleString()} ETB</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {donations.filter(d => d.status === "verified").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by donor, email, or cause..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
              >
                All
              </Button>
              <Button
                variant={filterStatus === "pending" ? "default" : "outline"}
                onClick={() => setFilterStatus("pending")}
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === "verified" ? "default" : "outline"}
                onClick={() => setFilterStatus("verified")}
              >
                Verified
              </Button>
              <Button
                variant={filterStatus === "rejected" ? "default" : "outline"}
                onClick={() => setFilterStatus("rejected")}
              >
                Rejected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donations Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Payment Method</th>
                  <th className="text-left py-3 px-4">Transaction Ref</th>
                  <th className="text-left py-3 px-4">Receipt</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      No donations found
                    </td>
                  </tr>
                ) : (
                  filteredDonations.map((donation) => (
                    <tr key={donation.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          {donation.createdAt 
                            ? format(donation.createdAt.toDate(), "MMM dd, yyyy HH:mm")
                            : "N/A"}
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          {donation.amount.toLocaleString()} ETB
                        </td>
                        <td className="py-3 px-4">{donation.paymentMethod || "N/A"}</td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-muted-foreground">
                            {donation.transactionRef || "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {donation.receiptUrl ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewReceipt(donation)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          ) : (
                            <span className="text-sm text-muted-foreground">No receipt</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={
                            donation.status === "verified" ? "default" :
                            donation.status === "pending" ? "secondary" : "destructive"
                          }>
                            {donation.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {donation.status === "pending" && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateDonationStatus(donation.id, "verified")}
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateDonationStatus(donation.id, "rejected")}
                              >
                                <XCircle className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          )}
                        </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Viewer Dialog */}
      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
          </DialogHeader>
          {selectedDonation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p className="font-semibold">{selectedDonation.amount.toLocaleString()} ETB</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Method</p>
                  <p className="font-semibold">{selectedDonation.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Transaction Reference</p>
                  <p className="font-semibold">{selectedDonation.transactionRef || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-semibold">
                    {selectedDonation.createdAt 
                      ? format(selectedDonation.createdAt.toDate(), "MMM dd, yyyy HH:mm")
                      : "N/A"}
                  </p>
                </div>
              </div>

              {selectedDonation.notes && (
                <div>
                  <p className="text-muted-foreground text-sm">Notes</p>
                  <p className="text-sm mt-1">{selectedDonation.notes}</p>
                </div>
              )}

              {selectedDonation.receiptUrl && (
                <div className="border rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Receipt Image</p>
                  {selectedDonation.receiptUrl.endsWith('.pdf') ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <a 
                        href={selectedDonation.receiptUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Open PDF Receipt
                      </a>
                    </div>
                  ) : (
                    <img 
                      src={selectedDonation.receiptUrl} 
                      alt="Receipt" 
                      className="w-full rounded-lg"
                    />
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {selectedDonation.status === "pending" && (
                  <>
                    <Button
                      variant="default"
                      onClick={() => {
                        updateDonationStatus(selectedDonation.id, "verified");
                        setReceiptDialogOpen(false);
                      }}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Donation
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        updateDonationStatus(selectedDonation.id, "rejected");
                        setReceiptDialogOpen(false);
                      }}
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => setReceiptDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonationsManagement;
