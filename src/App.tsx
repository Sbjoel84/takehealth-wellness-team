import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Contact from "./pages/Contact";
import Health360 from "./pages/Health360";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import FAQs from "./pages/FAQs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Partners from "./pages/Partners";
import Newsroom from "./pages/Newsroom";
import Careers from "./pages/Careers";
import GetStarted from "./pages/GetStarted";
import AdminLayout from "./components/layout/AdminLayout";
import DashboardOverview from "./pages/admin/DashboardOverview";
import ClientList from "./pages/admin/ClientList";
import AddClient from "./pages/admin/AddClient";
import AppointmentList from "./pages/admin/AppointmentList";
import OnboardingList from "./pages/admin/OnboardingList";
import ServiceProviderManagement from "./pages/admin/ServiceProviderManagement";
import ClientProgressTracking from "./pages/admin/ClientProgressTracking";
import CommunicationHub from "./pages/admin/CommunicationHub";
import DocumentsPage from "./pages/admin/Documents";
import Settings from "./pages/admin/Settings";

// Scroll to top on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceSlug" element={<ServiceDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/health360" element={<Health360 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/news" element={<Newsroom />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/get-started" element={<GetStarted />} />
        
        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="clients" element={<ClientList />} />
          <Route path="clients/add" element={<AddClient />} />
          <Route path="onboarding" element={<OnboardingList />} />
          <Route path="appointments" element={<AppointmentList />} />
          <Route path="providers" element={<ServiceProviderManagement />} />
          <Route path="progress" element={<ClientProgressTracking />} />
          <Route path="communications" element={<CommunicationHub />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Service Registration Routes - Linked to Admin Dashboard */}
        <Route path="/services/gym" element={<Services />} />
        <Route path="/services/spa" element={<Services />} />
        <Route path="/services/skincare" element={<Services />} />
        <Route path="/services/dental" element={<Services />} />
        <Route path="/services/elite" element={<Services />} />
        <Route path="/services/rehab" element={<Services />} />
        <Route path="/services/nutrition" element={<Services />} />
        <Route path="/services/counselling" element={<Services />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
