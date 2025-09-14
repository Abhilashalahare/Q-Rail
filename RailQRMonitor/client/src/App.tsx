import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AuthWrapper from "@/components/AuthWrapper";
import { AppSidebar } from "@/components/AppSidebar";
import { VendorSidebar } from "@/components/VendorSidebar";
import HomePage from "@/components/HomePage";
import QRScannerPage from "@/components/QRScannerPage";
import DashboardPage from "@/components/DashboardPage";
import ComplaintsPage from "@/components/ComplaintsPage";
import ReportsPage from "@/components/ReportsPage";
import VendorDashboard from "@/components/VendorDashboard";
import VendorRecords from "@/components/VendorRecords";
import NotFound from "@/pages/not-found";

function RailwayOfficialRouter() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/scanner" component={QRScannerPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/complaints" component={ComplaintsPage} />
      <Route path="/reports" component={ReportsPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function VendorRouter() {
  const [, setLocation] = useLocation();
  
  return (
    <Switch>
      <Route path="/vendor" component={VendorDashboard} />
      <Route path="/vendor/records" component={VendorRecords} />
      {/* Redirect vendor root to dashboard */}
      <Route path="/" component={() => { 
        setLocation('/vendor'); 
        return null;
      }} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedApp() {
  const { user } = useAuth();
  
  // Custom sidebar width for role-based layouts
  const style = {
    "--sidebar-width": "18rem",       // 288px for better navigation
    "--sidebar-width-icon": "4rem",   // default icon width
  };

  const isVendor = user?.role === 'vendor';
  const isRailwayOfficial = user?.role === 'railway_official';

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        {isVendor && <VendorSidebar />}
        {isRailwayOfficial && <AppSidebar />}
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {isVendor ? "Vendor Portal" : "Railway Official Portal"} | Indian Railways QR System
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-background">
            {isVendor && <VendorRouter />}
            {isRailwayOfficial && <RailwayOfficialRouter />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AuthWrapper>
            <AuthenticatedApp />
          </AuthWrapper>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
