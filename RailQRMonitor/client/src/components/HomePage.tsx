import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, BarChart3, AlertTriangle, FileText, Train, Shield, Zap } from "lucide-react"
import { Link } from "wouter"

const quickActions = [
  {
    title: "Scan QR Code",
    description: "Simulate QR scanning for track fittings",
    icon: QrCode,
    href: "/scanner",
    color: "bg-primary text-primary-foreground"
  },
  {
    title: "View Dashboard",
    description: "Monitor system overview and analytics",
    icon: BarChart3,
    href: "/dashboard",
    color: "bg-accent text-accent-foreground"
  },
  {
    title: "Report Issue",
    description: "Register complaints for defective fittings",
    icon: AlertTriangle,
    href: "/complaints",
    color: "bg-chart-2 text-white"
  },
  {
    title: "View Reports",
    description: "Access inspection reports and AI alerts",
    icon: FileText,
    href: "/reports",
    color: "bg-chart-1 text-white"
  },
]

const features = [
  {
    icon: Train,
    title: "Track Fitting Management",
    description: "Monitor elastic rail clips, liners, pads, and sleepers across the railway network"
  },
  {
    icon: Shield,
    title: "AI-Powered Monitoring",
    description: "Smart alerts and predictive maintenance recommendations using advanced algorithms"
  },
  {
    icon: Zap,
    title: "Real-time Tracking",
    description: "Live status updates, warranty tracking, and inspection history for all components"
  }
]

export function HomePage() {
  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Railway Track Fittings</h1>
        <h2 className="text-2xl text-primary">QR Monitoring System</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Advanced AI-powered monitoring system for Indian Railways track fittings with comprehensive 
          lifecycle management, inspection tracking, and predictive maintenance alerts.
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Card key={action.title} className="hover-elevate cursor-pointer group" data-testid={`card-action-${action.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <Link href={action.href}>
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`w-16 h-16 rounded-lg ${action.color} flex items-center justify-center mx-auto group-hover:scale-105 transition-transform`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-xl font-semibold mb-4">System Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* System Status */}
      <Card data-testid="card-system-status">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-chart-1/10">
              <p className="text-2xl font-bold text-chart-1" data-testid="text-operational-count">1,847</p>
              <p className="text-sm text-muted-foreground">Operational Fittings</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-chart-2/10">
              <p className="text-2xl font-bold text-chart-2" data-testid="text-maintenance-count">23</p>
              <p className="text-sm text-muted-foreground">Maintenance Due</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-chart-5/10">
              <p className="text-2xl font-bold text-chart-5" data-testid="text-defective-count">7</p>
              <p className="text-sm text-muted-foreground">Defective Items</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HomePage