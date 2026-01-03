import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  DollarSign,
  Image,
  MessageSquare,
  Mail,
  BookOpen,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminOverview from "./admin/AdminOverview";
import DonorsManagement from "./admin/DonorsManagement";
import SubscriptionsManagement from "./admin/SubscriptionsManagement";
import DonationsManagement from "./admin/DonationsManagement";
import GalleryManagement from "./admin/GalleryManagement";
import QuotesManagement from "./admin/QuotesManagement";
import ContactMessages from "./admin/ContactMessages";
import EmailLogs from "./admin/EmailLogs";

const AdminDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Get tab from URL hash (e.g., /admin#donors -> "donors")
    const hash = location.hash.replace("#", "");
    if (hash) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  return (
    <DashboardLayout type="admin">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="overview">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="donors">
            <DonorsManagement />
          </TabsContent>

          <TabsContent value="subscriptions">
            <SubscriptionsManagement />
          </TabsContent>

          <TabsContent value="donations">
            <DonationsManagement />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryManagement />
          </TabsContent>

          <TabsContent value="quotes">
            <QuotesManagement />
          </TabsContent>

          <TabsContent value="messages">
            <ContactMessages />
          </TabsContent>

          <TabsContent value="emails">
            <EmailLogs />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
