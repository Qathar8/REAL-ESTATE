import { Navigate, Route, Routes } from "react-router-dom";

import { MainLayout } from "@/components/layout/MainLayout";
import { HomePage } from "@/pages/HomePage";
import { PropertiesPage } from "@/pages/PropertiesPage";
import { PropertyDetailsPage } from "@/pages/PropertyDetailsPage";
import { ContactPage } from "@/pages/ContactPage";
import { VirtualToursPage } from "@/pages/VirtualToursPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AdminOverview } from "@/pages/admin/AdminOverview";
import { ClientsTab } from "@/pages/admin/ClientsTab";
import { PropertiesTab } from "@/pages/admin/PropertiesTab";
import { SiteVisitsTab } from "@/pages/admin/SiteVisitsTab";
import { VirtualToursTab } from "@/pages/admin/VirtualToursTab";
import { ReceiptsTab } from "@/pages/admin/ReceiptsTab";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="properties/:id" element={<PropertyDetailsPage />} />
        <Route path="virtual-tours" element={<VirtualToursPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="clients" element={<ClientsTab />} />
          <Route path="properties" element={<PropertiesTab />} />
          <Route path="site-visits" element={<SiteVisitsTab />} />
          <Route path="virtual-tours" element={<VirtualToursTab />} />
          <Route path="receipts" element={<ReceiptsTab />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;

