import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Filter } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const DonationHistory = () => {
  const { currentUser } = useAuth();
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterYear, setFilterYear] = useState("all");

  useEffect(() => {
    if (!currentUser) return;

    // Set up real-time listener for donations
    const donationsQuery = query(
      collection(db, "donations"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      donationsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDonations(data);
        setFilteredDonations(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching donations:", error);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    applyFilters();
  }, [donations, searchTerm, filterType, filterYear]);

  const applyFilters = () => {
    let filtered = [...donations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.causeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.amount.toString().includes(searchTerm)
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((d) =>
        filterType === "monthly" ? d.isMonthly : !d.isMonthly
      );
    }

    // Year filter
    if (filterYear !== "all") {
      filtered = filtered.filter((d) => {
        const year = d.createdAt?.toDate().getFullYear().toString();
        return year === filterYear;
      });
    }

    setFilteredDonations(filtered);
  };

  const exportToCSV = () => {
    const headers = ["Date", "Amount", "Cause", "Type", "Status"];
    const rows = filteredDonations.map((d) => [
      d.createdAt?.toDate().toLocaleDateString(),
      `${d.amount} ETB`,
      d.causeName || "General",
      d.isMonthly ? "Monthly" : "One-time",
      d.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donation-history-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
  };

  const years = Array.from(
    new Set(
      donations.map((d) => d.createdAt?.toDate().getFullYear().toString())
    )
  ).filter(Boolean);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Donation History</h1>
            <p className="text-muted-foreground">
              View and export your donation records
            </p>
          </div>
          <Button
            onClick={exportToCSV}
            disabled={filteredDonations.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search donations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="onetime">One-time</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Donations Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {filteredDonations.length} Donation
              {filteredDonations.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredDonations.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground">
                  No donations found
                </p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
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
                    {filteredDonations.map((donation) => (
                      <tr
                        key={donation.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-3 px-4">
                          {donation.createdAt?.toDate().toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          {donation.amount} ETB
                        </td>
                        <td className="py-3 px-4">
                          {donation.causeName || "General"}
                        </td>
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

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">
                Total Donated
              </p>
              <p className="text-2xl font-bold">
                {filteredDonations.reduce((sum, d) => sum + d.amount, 0)} ETB
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">
                Total Donations
              </p>
              <p className="text-2xl font-bold">{filteredDonations.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">
                Average Donation
              </p>
              <p className="text-2xl font-bold">
                {filteredDonations.length > 0
                  ? Math.round(
                      filteredDonations.reduce((sum, d) => sum + d.amount, 0) /
                        filteredDonations.length
                    )
                  : 0}{" "}
                ETB
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DonationHistory;
