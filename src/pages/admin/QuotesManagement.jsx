import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Plus, Trash2, Edit } from "lucide-react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Quote {
  id: string;
  text: string;
  source: string;
  type: "quran" | "hadith";
  timesUsed: number;
}

const QuotesManagement = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [type, setType] = useState<"quran" | "hadith">("quran");
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const quotesSnapshot = await getDocs(collection(db, "quotes"));
      const quotesData = quotesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Quote[];
      setQuotes(quotesData);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!text || !source) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await addDoc(collection(db, "quotes"), {
        text,
        source,
        type,
        timesUsed: 0,
      });

      toast({
        title: "Success!",
        description: "Quote added successfully",
      });

      setText("");
      setSource("");
      fetchQuotes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingQuote) return;

    try {
      await updateDoc(doc(db, "quotes", editingQuote.id), {
        text: editingQuote.text,
        source: editingQuote.source,
        type: editingQuote.type,
      });

      toast({
        title: "Success!",
        description: "Quote updated successfully",
      });

      setEditingQuote(null);
      fetchQuotes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quote?")) return;

    try {
      await deleteDoc(doc(db, "quotes", id));
      toast({
        title: "Success!",
        description: "Quote deleted successfully",
      });
      fetchQuotes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading quotes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quotes Management</h1>
        <p className="text-muted-foreground">Manage Islamic quotes for monthly emails</p>
      </div>

      {/* Add Quote Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-4" />
            {editingQuote ? "Edit Quote" : "Add New Quote"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={editingQuote ? editingQuote.type : type}
              onValueChange={(value: "quran" | "hadith") => {
                if (editingQuote) {
                  setEditingQuote({ ...editingQuote, type: value });
                } else {
                  setType(value);
                }
              }}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quran">Quran</SelectItem>
                <SelectItem value="hadith">Hadith</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="text">Quote Text</Label>
            <Textarea
              id="text"
              value={editingQuote ? editingQuote.text : text}
              onChange={(e) => {
                if (editingQuote) {
                  setEditingQuote({ ...editingQuote, text: e.target.value });
                } else {
                  setText(e.target.value);
                }
              }}
              placeholder="Enter the quote text"
              className="mt-2"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              value={editingQuote ? editingQuote.source : source}
              onChange={(e) => {
                if (editingQuote) {
                  setEditingQuote({ ...editingQuote, source: e.target.value });
                } else {
                  setSource(e.target.value);
                }
              }}
              placeholder="e.g., Quran 2:195 or Sahih Bukhari"
              className="mt-2"
            />
          </div>
          <div className="flex gap-2">
            {editingQuote ? (
              <>
                <Button onClick={handleUpdate}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditingQuote(null)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Quote
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quotes List */}
      <div className="space-y-4">
        {quotes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No quotes added yet</p>
            </CardContent>
          </Card>
        ) : (
          quotes.map((quote) => (
            <Card key={quote.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        quote.type === "quran" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {quote.type === "quran" ? "Quran" : "Hadith"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Used {quote.timesUsed} times
                      </span>
                    </div>
                    <blockquote className="text-lg italic mb-2">
                      "{quote.text}"
                    </blockquote>
                    <p className="text-sm text-muted-foreground">— {quote.source}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingQuote(quote)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(quote.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default QuotesManagement;
