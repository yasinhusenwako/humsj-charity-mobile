import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, BookOpen } from "lucide-react";
import { getRandomQuote } from "@/services/quoteService";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const IslamicInspiration = () => {
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuote();
  }, []);

  const loadQuote = async () => {
    setLoading(true);
    try {
      const randomQuote = await getRandomQuote();
      setQuote(randomQuote);
    } catch (error) {
      console.error("Error loading quote:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout type="donor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Islamic Inspiration</h1>
          <p className="text-muted-foreground">Daily wisdom from Quran and Hadith</p>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {quote?.type === "quran" ? "Quranic Verse" : "Hadith"}
              </CardTitle>
              <Button onClick={loadQuote} disabled={loading} variant="outline" size="sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                New Quote
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {quote ? (
              <div className="space-y-6">
                <blockquote className="text-xl italic text-center py-8 px-4 border-l-4 border-primary bg-muted/30">
                  "{quote.text}"
                </blockquote>
                <p className="text-right text-muted-foreground font-semibold">
                  — {quote.source}
                </p>
                {quote.timesUsed > 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    This quote has been shared {quote.timesUsed} times in monthly emails
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading inspiration...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="max-w-3xl mx-auto bg-primary/5">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">About Islamic Inspiration</h3>
            <p className="text-sm text-muted-foreground">
              Each month, we include a verse from the Quran or a Hadith in our donor emails. 
              These inspirational messages remind us of the importance of charity and helping others.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default IslamicInspiration;
