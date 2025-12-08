import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Heart, Shield, ArrowRight } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

const Donate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    amount: "",
    donationType: "one-time",
    message: "",
  });

  const presetAmounts = [50, 100, 200, 500, 1000, 2000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a donation or upload a receipt.",
      });
      navigate("/auth");
      return;
    }

    // If authenticated, redirect to payment methods to complete donation
    toast({
      title: "Redirecting...",
      description: "Taking you to the secure payment and receipt upload page.",
    });
    navigate("/dashboard/methods");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl font-bold mb-6">Make a Donation</h1>
            <p className="text-xl opacity-90 mb-8">
              Your one-time donation helps support students and community
              members in need. Every contribution makes a difference.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Left Column - Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-medium">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-start gap-4">
                    <Heart className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">
                        Make a Difference
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Your donation directly supports students and community
                        programs, providing education, meals, and essential
                        needs.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-start gap-4">
                    <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Secure & Safe</h3>
                      <p className="text-muted-foreground text-sm">
                        All donations are processed securely. We maintain
                        complete transparency in how funds are used.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-secondary/10 border-secondary">
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-bold mb-3 text-primary">
                    Prefer Monthly Donations?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Become a monthly donor and provide consistent support to our
                    programs.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      document.getElementById("donation-form")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                  >
                    View Monthly Options
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Donation Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-strong" id="donation-form">
                <CardHeader>
                  <CardTitle className="text-2xl">Donation Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder="Enter your full name"
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="your.email@example.com"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+251 9XX XXX XXX"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Monthly Donation Details (ETB) *</Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {presetAmounts.map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={
                              formData.amount === amount.toString()
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              setFormData({
                                ...formData,
                                amount: amount.toString(),
                              })
                            }
                            className="w-full"
                          >
                            {amount}
                          </Button>
                        ))}
                      </div>
                      <div className="mt-3">
                        <Input
                          type="number"
                          min="10"
                          value={formData.amount}
                          onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                          }
                          placeholder="Or enter custom amount"
                          className="w-full"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Minimum donation: 10 ETB
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="message">Message (Optional)</Label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Leave a message with your donation..."
                        rows={3}
                        className="mt-2 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CreditCard className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold mb-1">
                            Payment Information
                          </p>
                          <p className="text-sm text-muted-foreground">
                            You'll be redirected to a secure payment gateway to
                            complete your donation. We accept major credit cards
                            and mobile money transfers.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full"
                      disabled={
                        !formData.amount || parseFloat(formData.amount) < 10
                      }
                    >
                      Continue to Payment
                      <ArrowRight className="ml-2" />
                    </Button>

                    <p className="text-sm text-center text-muted-foreground">
                      Need to sign in first? You'll be redirected to create an
                      account.
                    </p>
                  </form>
                </CardContent>
              </Card>

              <Card className="mt-6 bg-secondary/10 border-secondary">
                <CardContent className="pt-6 pb-6">
                  <p className="text-sm text-center">
                    <span className="font-bold text-primary">
                      "Whoever relieves a believer's distress of the distressful
                      aspects of this world, Allah will rescue him from a
                      difficulty of the difficulties of the Hereafter."
                    </span>
                    <br />
                    <span className="text-muted-foreground">
                      - Prophet Muhammad (ﷺ)
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Donate;
