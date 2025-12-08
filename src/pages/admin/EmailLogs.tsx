import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Search,
  Download,
  CheckCircle,
  XCircle,
  Send,
} from "lucide-react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  type: "welcome" | "monthly" | "receipt" | "notification";
  status: "sent" | "failed";
  sentAt: any;
  error?: string;
}

const EmailLogs = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Compose State
  const [composeOpen, setComposeOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState(
    `HUMSJ Monthly Update - ${format(new Date(), "MMMM yyyy")}`
  );
  const [message, setMessage] = useState("");

  const handleDelete = async (logId: string) => {
    if (!confirm("Are you sure you want to delete this log?")) return;

    try {
      await deleteDoc(doc(db, "emailLogs", logId));
      toast({
        title: "Success",
        description: "Email log deleted successfully",
      });
      fetchLogs(); // Refresh list
    } catch (error) {
      console.error("Error deleting log:", error);
      toast({
        title: "Error",
        description: "Failed to delete log",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [searchTerm, logs]);

  const fetchLogs = async () => {
    try {
      const logsSnapshot = await getDocs(
        query(collection(db, "emailLogs"), orderBy("sentAt", "desc"))
      );

      const logsData = logsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EmailLog[];

      setLogs(logsData);
      setFilteredLogs(logsData);
    } catch (error) {
      console.error("Error fetching email logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    if (!searchTerm) {
      setFilteredLogs(logs);
      return;
    }

    const filtered = logs.filter(
      (log) =>
        log.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredLogs(filtered);
  };

  const handleSendUpdate = async () => {
    if (!subject || !message) {
      toast({
        title: "Missing Fields",
        description: "Please provide both Subject and Message.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      // 1. Get all donors
      const donorsQuery = query(
        collection(db, "users"),
        where("role", "==", "donor")
      );
      const donorsSnapshot = await getDocs(donorsQuery);
      const donors = donorsSnapshot.docs.map((doc) => doc.data());

      if (donors.length === 0) {
        toast({
          title: "No Donors",
          description: "No donors found to send updates to.",
          variant: "destructive",
        });
        setSending(false);
        return;
      }

      // 2. Simulate sending emails (Create logs)
      const batchPromises = donors.map((donor) =>
        addDoc(collection(db, "emailLogs"), {
          to: donor.email,
          subject: subject,
          type: "monthly",
          status: "sent",
          sentAt: Timestamp.now(),
          metadata: {
            messageLength: message.length,
            recipientName: donor.fullName || "Donor",
          },
        })
      );

      await Promise.all(batchPromises);

      toast({
        title: "Emails Sent!",
        description: `Successfully sent monthly update to ${donors.length} donors.`,
      });

      setComposeOpen(false);
      setMessage("");
      fetchLogs(); // Refresh logs
    } catch (error) {
      console.error("Error sending emails:", error);
      toast({
        title: "Error",
        description: "Failed to send emails. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Date", "To", "Subject", "Type", "Status"];
    const rows = filteredLogs.map((log) => [
      format(log.sentAt?.toDate() || new Date(), "yyyy-MM-dd HH:mm:ss"),
      log.to,
      log.subject,
      log.type,
      log.status,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email-logs-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const sentCount = logs.filter((l) => l.status === "sent").length;
  const failedCount = logs.filter((l) => l.status === "failed").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading email logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Email Logs</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Track all sent emails
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={exportToCSV}
            className="w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="sm:hidden">Export</span>
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
          <Button
            onClick={() => setComposeOpen(true)}
            className="w-full sm:w-auto"
          >
            <Send className="w-4 h-4 mr-2" />
            <span className="sm:hidden">Send Update</span>
            <span className="hidden sm:inline">Send Monthly Update</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Successfully Sent
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{sentCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by recipient, subject, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Logs */}
      <Card>
        <CardContent className="pt-6">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">To</th>
                  <th className="text-left py-3 px-4">Subject</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No email logs found
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        {log.sentAt
                          ? format(log.sentAt.toDate(), "MMM dd, yyyy HH:mm")
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4">{log.to}</td>
                      <td className="py-3 px-4">{log.subject}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{log.type}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {log.status === "sent" ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-green-600">Sent</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span className="text-red-600">Failed</span>
                            </>
                          )}
                        </div>
                        {log.error && (
                          <p className="text-xs text-red-600 mt-1">
                            {log.error}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-600"
                          onClick={() => handleDelete(log.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="lg:hidden space-y-4">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No email logs found
              </div>
            ) : (
              filteredLogs.map((log) => (
                <Card key={log.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {log.subject}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {log.to}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-600 flex-shrink-0"
                        onClick={() => handleDelete(log.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {log.type}
                        </Badge>
                        {log.status === "sent" ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            <span className="text-xs">Sent</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600">
                            <XCircle className="w-3 h-3" />
                            <span className="text-xs">Failed</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {log.sentAt
                          ? format(log.sentAt.toDate(), "MMM dd")
                          : "N/A"}
                      </div>
                    </div>

                    {log.error && (
                      <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded">
                        {log.error}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compose Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Monthly Update</DialogTitle>
            <DialogDescription>
              Write your periodic update email. This will be sent to ALL
              registered donors.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your update message here..."
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComposeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendUpdate} disabled={sending}>
              {sending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send to All Donors
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailLogs;
