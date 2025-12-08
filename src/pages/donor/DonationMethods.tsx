import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  CreditCard,
  Building2,
  Smartphone,
  ArrowRight,
  CheckCircle,
  Upload,
  FileText,
  X,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { db } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { uploadImageSigned } from "@/services/cloudinaryService";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createSubscription, getUserSubscription, updateSubscription } from "@/services/subscriptionService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentMethod {
  id: string;
  type: "bank" | "mobile" | "card";
  name: string;
  details: string;
  isDefault: boolean;
}

const DonationMethods = () => {

  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [amount, setAmount] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [notes, setNotes] = useState("");
  const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");
  const [uploading, setUploading] = useState(false);
  const [methods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "bank",
      name: "Commercial Bank of Ethiopia (CBE)",
      details: "Account: 1000614307599",
      isDefault: true,
    },
    {
      id: "5",
      type: "mobile",
      name: "E-birr",
      details: "Phone: 0985736451",
      isDefault: false,
    },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setReceiptFile(file);
    }
  };

  const handleUploadReceipt = async () => {
    if (!receiptFile || !amount || !currentUser) {
      toast({
        title: "Error",
        description: "Please fill all required fields and select a receipt",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Upload receipt to Cloudinary
      const { url: receiptUrl, publicId } = await uploadImageSigned(
        receiptFile,
        `receipts/${currentUser.uid}`
      );

      // Save donation record to Firestore
      await addDoc(collection(db, "donations"), {
        userId: currentUser.uid,
        amount: parseFloat(amount),
        paymentMethod: selectedMethod?.name || "Unknown",
        transactionRef: transactionRef || "N/A",
        receiptUrl,
        receiptPublicId: publicId || "",
        notes,
        type: donationType,
        status: "pending",
        createdAt: Timestamp.now(),
      });
      // If monthly donation, create or update subscription
      if (donationType === "monthly") {
        const existingSubscription = await getUserSubscription(currentUser.uid);

        if (existingSubscription) {
          // Update existing subscription
          await updateSubscription(existingSubscription.id!, {
            amount: parseFloat(amount),
            active: true,
          });
        } else {
          // Create new subscription
          await createSubscription({
            userId: currentUser.uid,
            amount: parseFloat(amount),
            startDate: Timestamp.now(),
            active: true,
            billingCycle: "monthly",
          });
        }
      }

      toast({
        title: "Success!",
        description: donationType === "monthly"
          ? "Monthly subscription created! Your donation is being verified."
          : "Receipt uploaded successfully. Your donation is being verified.",
      });
      // Reset form
      setUploadDialogOpen(false);
      setReceiptFile(null);
      setAmount("");
      setTransactionRef("");
      setNotes("");
      setDonationType("one-time");
      setSelectedMethod(null);
    } catch (error) {
      console.error("Error uploading receipt:", error);
      toast({
        title: "Error",
        description: "Failed to upload receipt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const openUploadDialog = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setUploadDialogOpen(true);
  };

  const handleDonate = () => {
    navigate("/donate");
  };

  const handleCopyDetails = (method: PaymentMethod) => {
    const textToCopy = method.type === "bank"
      ? method.details.replace("Account: ", "")
      : method.details.replace("Phone: ", "");

    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied!",
      description: `${method.name} details copied to clipboard`,
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "bank":
        return <Building2 className="w-6 h-6" />;
      case "mobile":
        return <Smartphone className="w-6 h-6" />;
      case "card":
        return <CreditCard className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  return (
    <DashboardLayout type="donor">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Donation Methods</h1>
          <p className="text-muted-foreground">
            Choose your preferred donation method to support HUMSJ Charity
          </p>
        </div>

        {/* Payment Methods List */}
        <div className="space-y-4">
          {methods.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No payment methods added yet
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Add a payment method to start donating
                </p>
              </CardContent>
            </Card>
          ) : (
            methods.map((method) => (
              <Card
                key={method.id}
                className={method.isDefault ? "border-primary" : ""}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        {getIcon(method.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{method.name}</h3>
                          {method.isDefault && (
                            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {method.details}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 capitalize">
                          {method.type === "bank"
                            ? "Bank Transfer"
                            : method.type === "mobile"
                              ? "Mobile Money"
                              : "Credit/Debit Card"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyDetails(method)}
                      >
                        Copy Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Upload Receipt Button */}
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Already Made a Donation?</h3>
                <p className="text-sm opacity-90">Upload your payment receipt for verification</p>
              </div>
              <Button
                variant="charity"
                size="lg"
                onClick={() => {
                  setSelectedMethod(methods[0]);
                  setUploadDialogOpen(true);
                }}
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Receipt
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">
              How to Donate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Choose your preferred payment method above</li>
              <li>• Click "Copy Details" to copy the account/phone number</li>
              <li>• Use your bank app or mobile money to transfer</li>
              <li>• Bank transfers: 1-2 business days processing</li>
              <li>• Mobile money (Telebirr/E-birr): Instant transfer</li>
              <li>• After payment, click "Upload Receipt" to submit your donation proof</li>
            </ul>
          </CardContent>
        </Card>

        {/* Upload Receipt Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upload Payment Receipt</DialogTitle>
            </DialogHeader>
            <div className="space-y-2.5">
              <div>
                <Label htmlFor="paymentMethod">Payment Method Used *</Label>
                <select
                  id="paymentMethod"
                  className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md"
                  value={selectedMethod?.id || ""}
                  onChange={(e) => {
                    const method = methods.find(m => m.id === e.target.value);
                    setSelectedMethod(method || null);
                  }}
                >
                  <option value="">Select payment method</option>
                  {methods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="donationType">Donation Type *</Label>
                <Select value={donationType} onValueChange={(value: "one-time" | "monthly") => setDonationType(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time Donation</SelectItem>
                    <SelectItem value="monthly">Monthly Subscription</SelectItem>
                  </SelectContent>
                </Select>
                {donationType === "monthly" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ✨ This will create a monthly subscription
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="amount">Donation Amount (ETB) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="transactionRef">Transaction Reference</Label>
                <Input
                  id="transactionRef"
                  placeholder="Transaction ID or reference number"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="receipt">Upload Receipt *</Label>
                <div className="mt-1">
                  <Input
                    id="receipt"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {receiptFile && (
                    <div className="flex items-center gap-2 mt-1.5 p-2 bg-muted rounded">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm flex-1">{receiptFile.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReceiptFile(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Supported formats: JPG, PNG, PDF (Max 5MB)
                </p>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional information..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setUploadDialogOpen(false)}
                  className="flex-1"
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUploadReceipt}
                  className="flex-1"
                  disabled={uploading || !receiptFile || !amount}
                >
                  {uploading ? "Uploading..." : "Submit Receipt"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default DonationMethods;
