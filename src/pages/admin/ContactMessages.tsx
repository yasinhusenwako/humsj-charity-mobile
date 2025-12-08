import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, Phone, CheckCircle, Clock } from "lucide-react";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";

interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string;
  phone?: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: any;
}

const ContactMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "replied">("all");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const messagesSnapshot = await getDocs(
        query(collection(db, "contactMessages"), orderBy("createdAt", "desc"))
      );
      
      const messagesData = messagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];

      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: "new" | "read" | "replied") => {
    try {
      await updateDoc(doc(db, "contactMessages", id), { status });
      fetchMessages();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredMessages = filter === "all" 
    ? messages 
    : messages.filter(m => m.status === filter);

  const newCount = messages.filter(m => m.status === "new").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          <p className="text-muted-foreground">Manage inquiries from visitors</p>
        </div>
        {newCount > 0 && (
          <Badge variant="destructive" className="text-lg px-4 py-2">
            {newCount} New
          </Badge>
        )}
      </div>

      {/* Filter Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All ({messages.length})
            </Button>
            <Button
              variant={filter === "new" ? "default" : "outline"}
              onClick={() => setFilter("new")}
            >
              New ({messages.filter(m => m.status === "new").length})
            </Button>
            <Button
              variant={filter === "read" ? "default" : "outline"}
              onClick={() => setFilter("read")}
            >
              Read ({messages.filter(m => m.status === "read").length})
            </Button>
            <Button
              variant={filter === "replied" ? "default" : "outline"}
              onClick={() => setFilter("replied")}
            >
              Replied ({messages.filter(m => m.status === "replied").length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No messages found</p>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} className={message.status === "new" ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{message.name}</CardTitle>
                      <Badge variant={
                        message.status === "new" ? "destructive" :
                        message.status === "replied" ? "default" : "secondary"
                      }>
                        {message.status}
                      </Badge>
                    </div>
                    {message.subject && (
                      <p className="font-semibold text-sm mb-2">Subject: {message.subject}</p>
                    )}
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${message.email}`} className="hover:underline">
                          {message.email}
                        </a>
                      </div>
                      {message.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${message.phone}`} className="hover:underline">
                            {message.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {message.createdAt 
                          ? format(message.createdAt.toDate(), "MMM dd, yyyy 'at' h:mm a")
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 whitespace-pre-wrap">{message.message}</p>
                <div className="flex gap-2">
                  {message.status === "new" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(message.id, "read")}
                    >
                      Mark as Read
                    </Button>
                  )}
                  {message.status !== "replied" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => updateStatus(message.id, "replied")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Replied
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `mailto:${message.email}`}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Reply via Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactMessages;
