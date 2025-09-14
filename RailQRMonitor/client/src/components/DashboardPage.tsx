import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StatCard from "./StatCard"
import StatusBadge from "./StatusBadge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, Tooltip } from 'recharts'
import { Package, AlertTriangle, CheckCircle, TrendingUp, Users, Calendar, Bell, Download } from "lucide-react"

// TODO: remove mock data - replace with real API calls
const mockChartData = [
  { month: 'Jan', operational: 1820, maintenance: 15, defective: 3 },
  { month: 'Feb', operational: 1835, maintenance: 12, defective: 5 },
  { month: 'Mar', operational: 1842, maintenance: 18, defective: 4 },
  { month: 'Apr', operational: 1851, maintenance: 21, defective: 2 },
  { month: 'May', operational: 1847, maintenance: 23, defective: 7 },
]

const vendorData = [
  { name: 'RailTech Industries', value: 45, color: 'hsl(var(--chart-1))' },
  { name: 'TrackSecure Ltd', value: 30, color: 'hsl(var(--chart-2))' },
  { name: 'Railway Components Co', value: 15, color: 'hsl(var(--chart-3))' },
  { name: 'Others', value: 10, color: 'hsl(var(--chart-4))' },
]

const recentAlerts = [
  {
    id: '1',
    type: 'warning',
    message: 'High failure risk detected on Lot #RT-2024-B23',
    location: 'Track Section 15-C',
    time: '2 hours ago'
  },
  {
    id: '2', 
    type: 'defective',
    message: 'Critical wear detected on elastic rail clips',
    location: 'Junction Point 8-A',
    time: '4 hours ago'
  },
  {
    id: '3',
    type: 'ok',
    message: 'Preventive maintenance completed successfully',
    location: 'Bridge Section 5-B',
    time: '1 day ago'
  }
]

export function DashboardPage() {
  return (
    <div className="p-6 space-y-6" data-testid="page-dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of railway track fitting monitoring system.
          </p>
        </div>
        <Button variant="outline" data-testid="button-export-data">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Fittings"
          value="1,877"
          icon={Package}
          description="Active track components"
          trend="up"
          trendValue="+2.1%"
        />
        <StatCard
          title="Operational"
          value="1,847"
          icon={CheckCircle}
          description="Fittings in good condition"
          trend="up"
          trendValue="+1.5%"
        />
        <StatCard
          title="Maintenance Due"
          value="23"
          icon={AlertTriangle}
          description="Require attention soon"
          trend="up"
          trendValue="+4"
        />
        <StatCard
          title="Defective"
          value="7"
          icon={AlertTriangle}
          description="Need immediate replacement"
          trend="down"
          trendValue="-2"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Trend Chart */}
        <Card data-testid="card-status-trend">
          <CardHeader>
            <CardTitle>Status Trends</CardTitle>
            <CardDescription>Track fitting condition over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
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
                    dataKey="operational" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                    name="Operational"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="maintenance" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    name="Maintenance Due"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="defective" 
                    stroke="hsl(var(--chart-5))" 
                    strokeWidth={2}
                    name="Defective"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Distribution */}
        <Card data-testid="card-vendor-distribution">
          <CardHeader>
            <CardTitle>Vendor Distribution</CardTitle>
            <CardDescription>Fitting supply by vendor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vendorData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {vendorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card data-testid="card-recent-alerts">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent AI Alerts
              </CardTitle>
              <CardDescription>Smart notifications and anomaly detection</CardDescription>
            </div>
            <Badge variant="secondary" data-testid="badge-alert-count">{recentAlerts.length} Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="flex items-start justify-between p-4 rounded-lg border hover-elevate"
                data-testid={`alert-item-${alert.id}`}
              >
                <div className="flex items-start gap-3">
                  <StatusBadge status={alert.type as 'ok' | 'warning' | 'defective'} />
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">{alert.location}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{alert.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card data-testid="card-inspection-compliance">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inspection Compliance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1" data-testid="text-compliance-rate">94.2%</div>
            <p className="text-xs text-muted-foreground">
              On-time inspections this month
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-avg-response-time">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-response-time">2.4h</div>
            <p className="text-xs text-muted-foreground">
              From detection to action
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-active-vendors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-vendor-count">12</div>
            <p className="text-xs text-muted-foreground">
              Certified suppliers
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage