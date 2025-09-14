import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Tooltip, Legend } from 'recharts'
import { FileText, Download, Brain, TrendingUp, AlertTriangle, Calendar, Filter } from "lucide-react"
import StatusBadge from "./StatusBadge"

// TODO: remove mock data - replace with real API calls
const mockInspectionData = [
  {
    id: "INS-001",
    fittingId: "RC-2024-001",
    type: "Elastic Rail Clip",
    inspector: "John Smith",
    date: "2024-12-01",
    status: "ok" as const,
    findings: "All components within acceptable parameters",
    nextInspection: "2025-03-01"
  },
  {
    id: "INS-002",
    fittingId: "LP-2024-002", 
    type: "Liner Pad",
    inspector: "Sarah Johnson",
    date: "2024-11-28",
    status: "warning" as const,
    findings: "Minor wear detected on edges, monitor closely",
    nextInspection: "2025-01-28"
  },
  {
    id: "INS-003",
    fittingId: "SL-2023-003",
    type: "Concrete Sleeper",
    inspector: "Mike Wilson",
    date: "2024-11-25",
    status: "defective" as const,
    findings: "Structural cracks observed, immediate replacement required",
    nextInspection: "N/A"
  }
]

const vendorPerformanceData = [
  { vendor: 'RailTech Industries', defectRate: 2.1, deliveryScore: 98, warrantyIssues: 3 },
  { vendor: 'TrackSecure Ltd', defectRate: 3.2, deliveryScore: 95, warrantyIssues: 5 },
  { vendor: 'Railway Components Co', defectRate: 4.8, deliveryScore: 92, warrantyIssues: 8 },
  { vendor: 'Steel Track Solutions', defectRate: 3.7, deliveryScore: 94, warrantyIssues: 6 },
]

const predictiveAlerts = [
  {
    id: "AI-001",
    type: "Predictive Maintenance",
    severity: "medium",
    message: "Lot RT-2024-B23 showing early wear patterns - recommend inspection in 2 weeks",
    affectedFittings: 15,
    confidence: 85,
    generatedAt: "2024-12-10 14:30"
  },
  {
    id: "AI-002",
    type: "Failure Risk",
    severity: "high",
    message: "Critical failure risk detected in Bridge Section 5-C - immediate inspection required",
    affectedFittings: 8,
    confidence: 92,
    generatedAt: "2024-12-10 09:15"
  },
  {
    id: "AI-003",
    type: "Pattern Analysis",
    severity: "low",
    message: "Seasonal wear pattern detected - consider proactive replacement schedule",
    affectedFittings: 45,
    confidence: 78,
    generatedAt: "2024-12-09 16:45"
  }
]

const monthlyTrends = [
  { month: 'Aug', inspections: 42, defects: 3, maintenance: 8 },
  { month: 'Sep', inspections: 38, defects: 2, maintenance: 12 },
  { month: 'Oct', inspections: 45, defects: 4, maintenance: 9 },
  { month: 'Nov', inspections: 52, defects: 7, maintenance: 15 },
  { month: 'Dec', inspections: 48, defects: 5, maintenance: 11 },
]

export function ReportsPage() {
  const [selectedVendor, setSelectedVendor] = useState("all")
  const [dateRange, setDateRange] = useState("last-30-days")

  const exportReport = (type: string) => {
    // TODO: implement real export functionality
    console.log(`Exporting ${type} report...`)
    alert(`${type} report exported successfully!`)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-chart-5/10 text-chart-5 border-chart-5/20'
      case 'medium': return 'bg-chart-2/10 text-chart-2 border-chart-2/20' 
      case 'low': return 'bg-chart-1/10 text-chart-1 border-chart-1/20'
      default: return 'bg-muted/10 text-muted-foreground border-muted/20'
    }
  }

  return (
    <div className="p-6 space-y-6" data-testid="page-reports">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive inspection reports, vendor performance, and AI-powered insights.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReport('PDF')} data-testid="button-export-pdf">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport('CSV')} data-testid="button-export-csv">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card data-testid="card-filters">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-48">
            <Label htmlFor="vendor-filter">Vendor</Label>
            <Select value={selectedVendor} onValueChange={setSelectedVendor}>
              <SelectTrigger id="vendor-filter" data-testid="select-vendor-filter">
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                <SelectItem value="railtech">RailTech Industries</SelectItem>
                <SelectItem value="tracksecure">TrackSecure Ltd</SelectItem>
                <SelectItem value="railwaycomponents">Railway Components Co</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-48">
            <Label htmlFor="date-filter">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger id="date-filter" data-testid="select-date-filter">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="inspections" className="w-full" data-testid="tabs-reports">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inspections" data-testid="tab-inspections">Inspections</TabsTrigger>
          <TabsTrigger value="vendors" data-testid="tab-vendors">Vendor Performance</TabsTrigger>
          <TabsTrigger value="ai-alerts" data-testid="tab-ai-alerts">AI Alerts</TabsTrigger>
          <TabsTrigger value="trends" data-testid="tab-trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="inspections" className="space-y-4">
          <Card data-testid="card-inspection-reports">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Inspection Reports
              </CardTitle>
              <CardDescription>
                Detailed findings from track fitting inspections.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInspectionData.map((inspection) => (
                  <div 
                    key={inspection.id} 
                    className="p-4 border rounded-lg hover-elevate"
                    data-testid={`inspection-item-${inspection.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {inspection.id}
                        </Badge>
                        <StatusBadge status={inspection.status} />
                        <p className="text-sm font-medium">{inspection.type}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{inspection.date}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground">Fitting ID</p>
                        <p>{inspection.fittingId}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Inspector</p>
                        <p>{inspection.inspector}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Next Inspection</p>
                        <p>{inspection.nextInspection}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <p className="font-medium text-muted-foreground mb-1">Findings</p>
                      <p className="text-sm">{inspection.findings}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card data-testid="card-vendor-metrics">
              <CardHeader>
                <CardTitle>Vendor Performance Metrics</CardTitle>
                <CardDescription>Defect rates and delivery scores by vendor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={vendorPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="vendor" 
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="defectRate" 
                        fill="hsl(var(--chart-5))" 
                        name="Defect Rate (%)"
                        radius={[2, 2, 0, 0]}
                      />
                      <Bar 
                        dataKey="deliveryScore" 
                        fill="hsl(var(--chart-1))" 
                        name="Delivery Score"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-vendor-summary">
              <CardHeader>
                <CardTitle>Vendor Summary</CardTitle>
                <CardDescription>Performance overview by supplier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendorPerformanceData.map((vendor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{vendor.vendor}</p>
                        <p className="text-sm text-muted-foreground">
                          Defect Rate: {vendor.defectRate}% | Score: {vendor.deliveryScore}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={vendor.defectRate < 3 ? 'text-chart-1' : vendor.defectRate < 4 ? 'text-chart-2' : 'text-chart-5'}
                      >
                        {vendor.warrantyIssues} Issues
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-alerts" className="space-y-4">
          <Card data-testid="card-ai-alerts">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Predictive Alerts
              </CardTitle>
              <CardDescription>
                Machine learning insights and anomaly detection for proactive maintenance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className="p-4 border rounded-lg hover-elevate"
                    data-testid={`ai-alert-${alert.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {alert.id}
                        </Badge>
                        <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <p className="text-sm font-medium">{alert.type}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{alert.generatedAt}</p>
                    </div>
                    
                    <p className="text-sm mb-3">{alert.message}</p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <p>Affected Fittings: <strong>{alert.affectedFittings}</strong></p>
                      <p>Confidence: <strong>{alert.confidence}%</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card data-testid="card-monthly-trends">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Monthly Trends Analysis
              </CardTitle>
              <CardDescription>
                Track inspection volume, defect discovery, and maintenance activities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="month" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="inspections" 
                      stroke="hsl(var(--chart-3))" 
                      strokeWidth={2}
                      name="Inspections"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="defects" 
                      stroke="hsl(var(--chart-5))" 
                      strokeWidth={2}
                      name="Defects Found"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="maintenance" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      name="Maintenance Actions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ReportsPage